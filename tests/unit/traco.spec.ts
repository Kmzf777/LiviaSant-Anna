import { describe, expect, it } from "vitest";

import {
  TRACO_COMPRIMENTO,
  TRACO_FIM_TELA,
  TRACO_FOLGA_COMPRIMENTO,
  TRACO_INICIO_TELA,
  TRACO_PATH,
  TRACO_SEGMENTOS,
  TRACO_TELAS,
  TRACO_UNIDADES_POR_TELA,
  TRACO_VIEWBOX,
  analisarCaminho,
  ancoras,
  caminhoCompleto,
  comprimentoAproximado,
  pontoFinal,
  pontoInicial,
  todosOsPontos,
} from "@/lib/traco";

const SEGMENTOS = ["entrada", "resolucao", "saida"] as const;

describe("analisarCaminho", () => {
  it("lê M e C absolutos", () => {
    expect(analisarCaminho("M 0 0 C 1 2 3 4 5 6")).toEqual([
      { tipo: "M", para: { x: 0, y: 0 } },
      {
        tipo: "C",
        c1: { x: 1, y: 2 },
        c2: { x: 3, y: 4 },
        para: { x: 5, y: 6 },
      },
    ]);
  });

  it("recusa comando fora do alfabeto", () => {
    // Um `L` ou `q` solto passaria batido em runtime e mudaria a curva sem
    // ninguém perceber. É melhor quebrar o build.
    expect(() => analisarCaminho("M 0 0 L 10 10")).toThrow(/não suportado/);
    expect(() => analisarCaminho("m 0 0")).toThrow(/não suportado/);
  });

  it("recusa coordenada que não é número", () => {
    expect(() => analisarCaminho("M 0 zero")).toThrow(/inválida/);
    expect(() => analisarCaminho("M 0 NaN")).toThrow(/inválida/);
  });

  it("recusa comando truncado", () => {
    expect(() => analisarCaminho("M 0 0 C 1 2 3 4 5")).toThrow(/no meio/);
  });

  it("recusa caminho vazio", () => {
    expect(() => analisarCaminho("   ")).toThrow(/vazio/);
  });
});

describe("geometria dos segmentos", () => {
  it.each(SEGMENTOS)("%s é um caminho válido", (nome) => {
    expect(() => analisarCaminho(TRACO_PATH[nome])).not.toThrow();
  });

  it.each(SEGMENTOS)("%s não tem nenhum valor não-finito", (nome) => {
    for (const ponto of todosOsPontos(TRACO_PATH[nome])) {
      expect(Number.isFinite(ponto.x)).toBe(true);
      expect(Number.isFinite(ponto.y)).toBe(true);
    }
  });

  it.each(SEGMENTOS)(
    "%s começa com um M absoluto e segue em cúbicas",
    (nome) => {
      const comandos = analisarCaminho(TRACO_PATH[nome]);
      expect(comandos[0]?.tipo).toBe("M");
      expect(comandos.slice(1).every((comando) => comando.tipo === "C")).toBe(
        true,
      );
      expect(comandos.length).toBeGreaterThan(3);
    },
  );

  it.each(SEGMENTOS)("%s cabe dentro do viewBox", (nome) => {
    for (const ponto of todosOsPontos(TRACO_PATH[nome])) {
      expect(ponto.x).toBeGreaterThanOrEqual(0);
      expect(ponto.x).toBeLessThanOrEqual(TRACO_VIEWBOX.largura);
      expect(ponto.y).toBeGreaterThanOrEqual(0);
      expect(ponto.y).toBeLessThanOrEqual(TRACO_VIEWBOX.altura);
    }
  });

  it.each(SEGMENTOS)("%s desce sem voltar para cima", (nome) => {
    // O desenho por stroke-dashoffset acompanha o scroll. Se a curva subisse,
    // a linha pareceria desenhar para trás em algum trecho.
    const pontos = ancoras(TRACO_PATH[nome]);
    for (let i = 1; i < pontos.length; i += 1) {
      expect(pontos[i]!.y).toBeGreaterThanOrEqual(pontos[i - 1]!.y);
    }
  });

  it.each(SEGMENTOS)(
    "%s ocupa exatamente a faixa vertical declarada",
    (nome) => {
      const faixa = TRACO_SEGMENTOS[nome];
      expect(pontoInicial(TRACO_PATH[nome]).y).toBe(faixa.de);
      expect(pontoFinal(TRACO_PATH[nome]).y).toBe(faixa.ate);
    },
  );

  it("começa no topo da fita e termina na base", () => {
    expect(pontoInicial(TRACO_PATH.entrada).y).toBe(0);
    expect(pontoFinal(TRACO_PATH.saida).y).toBe(TRACO_VIEWBOX.altura);
  });

  it.each(SEGMENTOS)("%s tem extensão plausível", (nome) => {
    const faixa = TRACO_SEGMENTOS[nome];
    const comprimento = comprimentoAproximado(TRACO_PATH[nome]);
    const vertical = faixa.ate - faixa.de;

    expect(Number.isFinite(comprimento)).toBe(true);
    // Nunca menor que a queda vertical, e nunca uma serpentina.
    expect(comprimento).toBeGreaterThanOrEqual(vertical);
    expect(comprimento).toBeLessThan(vertical * 1.6);
  });
});

describe("continuidade", () => {
  it("cada segmento começa onde o anterior termina", () => {
    expect(pontoInicial(TRACO_PATH.resolucao)).toEqual(
      pontoFinal(TRACO_PATH.entrada),
    );
    expect(pontoInicial(TRACO_PATH.saida)).toEqual(
      pontoFinal(TRACO_PATH.resolucao),
    );
  });

  it("caminhoCompleto costura os três em um traço só", () => {
    const completo = caminhoCompleto();
    const comandos = analisarCaminho(completo);

    const moves = comandos.filter((comando) => comando.tipo === "M");
    expect(moves).toHaveLength(1);

    // Nenhuma cúbica se perde na costura.
    const cubicasSoltas = SEGMENTOS.reduce(
      (total, nome) => total + analisarCaminho(TRACO_PATH[nome]).length - 1,
      0,
    );
    expect(comandos.length - 1).toBe(cubicasSoltas);

    expect(pontoInicial(completo)).toEqual(pontoInicial(TRACO_PATH.entrada));
    expect(pontoFinal(completo)).toEqual(pontoFinal(TRACO_PATH.saida));
  });
});

describe("a resolução é um perfil de rosto", () => {
  const pontos = ancoras(TRACO_PATH.resolucao);

  /*
    Os marcos são encontrados por GEOMETRIA, não por índice.

    A versão anterior deste bloco listava índices de âncora — `marco(7)` era a
    ponta do nariz. Funcionava enquanto a curva era a aproximação desenhada à
    mão, e quebrou no dia em que ela foi substituída pela curva medida do logo,
    que tem outra quantidade de âncoras. O teste reprovou por contar errado, não
    por o rosto ter deixado de ser rosto.

    Procurar por extremo local é mais trabalho e sobrevive a qualquer troca da
    geometria — inclusive à próxima, quando o vetor original do logo chegar.
  */

  /** O ponto mais avançado para dentro da página. */
  const ponta = pontos.reduce((menor, p) => (p.x < menor.x ? p : menor));

  const abaixoDaPonta = pontos.filter((p) => p.y > ponta.y);

  /** Extremos locais em x, na ordem em que aparecem descendo. */
  function extremosLocais(lista: readonly { x: number; y: number }[]) {
    const achados: { x: number; y: number; tipo: "avanca" | "recua" }[] = [];
    for (let i = 1; i < lista.length - 1; i++) {
      const a = lista[i - 1]!.x;
      const b = lista[i]!.x;
      const c = lista[i + 1]!.x;
      if (b < a && b <= c) achados.push({ ...lista[i]!, tipo: "avanca" });
      if (b > a && b >= c) achados.push({ ...lista[i]!, tipo: "recua" });
    }
    return achados;
  }

  const depois = extremosLocais(abaixoDaPonta);

  it("a ponta do nariz é o ponto mais avançado de todo o traço", () => {
    const menorX = Math.min(
      ...SEGMENTOS.flatMap((nome) => todosOsPontos(TRACO_PATH[nome])).map(
        (p) => p.x,
      ),
    );
    // A tolerância cobre pontos de controle, que podem ultrapassar a âncora.
    expect(ponta.x).toBeLessThan(menorX + 10);
  });

  it("a testa desce da margem até a ponta sem voltar atrás", () => {
    /*
      No logo, testa e dorso do nariz formam uma descida contínua: não há o
      degrau do násio que um perfil de manual costuma ter.

      Esta linha já foi o oposto — o teste antigo EXIGIA a reentrância, porque
      a curva desenhada à mão tinha uma. Medida a curva real, a exigência
      estava errada: era uma hipótese sobre o que faz uma silhueta ler como
      rosto, e o desenho dela prova que não precisa. O teste passou a descrever
      o logo em vez de descrever a expectativa de quem o aproximou.
    */
    const acimaDaPonta = pontos.filter((p) => p.y <= ponta.y);
    for (let i = 1; i < acimaDaPonta.length; i++) {
      expect(
        acimaDaPonta[i]!.x,
        `a testa recuou em y=${acimaDaPonta[i]!.y}`,
      ).toBeLessThanOrEqual(acimaDaPonta[i - 1]!.x);
    }
  });

  it("abaixo do nariz há lábio, estômio e queixo — não uma reta", () => {
    /*
      É esta alternância que separa um perfil de um risco: depois da ponta a
      linha recua para a base do nariz, avança no lábio superior, recua no
      estômio e avança de novo no queixo.
    */
    expect(
      depois.filter((e) => e.tipo === "avanca").length,
      "faltam avanços abaixo do nariz (lábio superior e queixo)",
    ).toBeGreaterThanOrEqual(2);
    expect(
      depois.filter((e) => e.tipo === "recua").length,
      "falta a reentrância do estômio",
    ).toBeGreaterThanOrEqual(1);

    // Nenhum deles avança tanto quanto o nariz.
    for (const marco of depois) {
      expect(marco.x).toBeGreaterThan(ponta.x);
    }
  });

  it("o lábio superior avança mais que o estômio e menos que o nariz", () => {
    const labioSuperior = depois.find((e) => e.tipo === "avanca");
    const estomio = depois.find(
      (e) => e.tipo === "recua" && e.y > (labioSuperior?.y ?? 0),
    );

    expect(labioSuperior, "não achei o lábio superior").toBeDefined();
    expect(estomio, "não achei o estômio").toBeDefined();
    expect(labioSuperior!.x).toBeGreaterThan(ponta.x);
    expect(labioSuperior!.x).toBeLessThan(estomio!.x);
  });

  it("tem proporção de rosto, não de linha esticada", () => {
    // A excursão horizontal do segmento inteiro, contra a altura dele. Fora
    // desta faixa o rosto lê como caricatura (largo) ou como um risco
    // (estreito). Medido no logo real: 0,29.
    const doRosto = todosOsPontos(TRACO_PATH.resolucao);
    const xs = doRosto.map((ponto) => ponto.x);
    const ys = doRosto.map((ponto) => ponto.y);
    const proporcao =
      (Math.max(...xs) - Math.min(...xs)) / (Math.max(...ys) - Math.min(...ys));

    expect(proporcao).toBeGreaterThan(0.22);
    expect(proporcao).toBeLessThan(0.36);
  });

  it("o rosto entra na página e a linha volta para a margem", () => {
    // Fora da resolução o traço mora na margem direita; o rosto é o único
    // momento em que ele avança para dentro.
    const forA = [TRACO_PATH.entrada, TRACO_PATH.saida].flatMap(todosOsPontos);
    const menorForaDoRosto = Math.min(...forA.map((ponto) => ponto.x));

    expect(ponta.x).toBeLessThan(menorForaDoRosto - 60);
    expect(pontoFinal(TRACO_PATH.resolucao).x).toBeGreaterThan(
      menorForaDoRosto - 10,
    );
  });
});

describe("constantes de montagem", () => {
  it("a resolução dura ~1,5 tela", () => {
    const telas =
      (TRACO_SEGMENTOS.resolucao.ate - TRACO_SEGMENTOS.resolucao.de) /
      TRACO_UNIDADES_POR_TELA;
    expect(telas).toBe(1.5);
  });

  it("a fita inteira mede o que TRACO_TELAS.amplo promete", () => {
    expect(TRACO_VIEWBOX.altura / TRACO_UNIDADES_POR_TELA).toBe(
      TRACO_TELAS.amplo,
    );
  });

  it("as faixas dos segmentos cobrem o viewBox sem buraco nem sobreposição", () => {
    expect(TRACO_SEGMENTOS.entrada.de).toBe(0);
    expect(TRACO_SEGMENTOS.entrada.ate).toBe(TRACO_SEGMENTOS.resolucao.de);
    expect(TRACO_SEGMENTOS.resolucao.ate).toBe(TRACO_SEGMENTOS.saida.de);
    expect(TRACO_SEGMENTOS.saida.ate).toBe(TRACO_VIEWBOX.altura);
  });

  it("a fita encolhe conforme a tela estreita", () => {
    expect(TRACO_TELAS.movel).toBeLessThan(TRACO_TELAS.tablet);
    expect(TRACO_TELAS.tablet).toBeLessThan(TRACO_TELAS.amplo);
  });

  it("a fita entra pela tela e sai antes do fim do scroll", () => {
    expect(TRACO_INICIO_TELA).toBeGreaterThan(0);
    expect(TRACO_INICIO_TELA).toBeLessThan(1);
    expect(TRACO_FIM_TELA).toBeGreaterThan(0);
    expect(TRACO_FIM_TELA).toBeLessThanOrEqual(1);
  });

  it("o comprimento do dasharray é o do traço inteiro", () => {
    // O CSS converte este número para pixels de tela e usa como
    // `stroke-dasharray`. Se ele ficar menor que o caminho, o traço aparece
    // em pedaços; se ficar muito maior, termina de se desenhar antes do fim
    // do scroll. Precisa ser o comprimento de verdade.
    expect(TRACO_COMPRIMENTO).toBeCloseTo(
      comprimentoAproximado(caminhoCompleto(), 256),
      6,
    );
    expect(TRACO_COMPRIMENTO).toBeGreaterThan(TRACO_VIEWBOX.altura);

    // E a folga é só folga: nunca um multiplicador que descaracterize a razão
    // entre progresso e fração desenhada.
    expect(TRACO_FOLGA_COMPRIMENTO).toBeGreaterThan(1);
    expect(TRACO_FOLGA_COMPRIMENTO).toBeLessThan(1.1);
  });
});
