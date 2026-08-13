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
  const marco = (indice: number) => {
    const ponto = pontos[indice];
    if (!ponto) throw new Error(`Marco ${indice} não existe.`);
    return ponto;
  };

  // Índices das âncoras da curva. Se a geometria mudar, estes são os únicos
  // números do teste que acompanham — e a lista de marcos abaixo é a
  // definição operacional de "isto ainda é um rosto".
  const testa = marco(1);
  const sobrancelha = marco(3);
  const nasio = marco(4);
  const ponta = marco(7);
  const labioSuperior = marco(10);
  const queixo = marco(14);

  it("os marcos anatômicos aparecem na ordem certa, de cima para baixo", () => {
    expect(testa.y).toBeLessThan(sobrancelha.y);
    expect(sobrancelha.y).toBeLessThan(nasio.y);
    expect(nasio.y).toBeLessThan(ponta.y);
    expect(ponta.y).toBeLessThan(labioSuperior.y);
    expect(labioSuperior.y).toBeLessThan(queixo.y);
  });

  it("a ponta do nariz é o ponto mais avançado de todo o traço", () => {
    const menorX = Math.min(
      ...SEGMENTOS.flatMap((nome) => todosOsPontos(TRACO_PATH[nome])).map(
        (p) => p.x,
      ),
    );
    expect(ponta.x).toBeLessThan(nasio.x);
    expect(ponta.x).toBeLessThan(labioSuperior.x);
    expect(ponta.x).toBeLessThan(menorX + 10);
  });

  it("o násio é uma reentrância entre a sobrancelha e o dorso", () => {
    // Sem esse degrau o nariz parece brotar direto da testa — é ele que faz a
    // silhueta virar rosto em vez de perfil de montanha.
    expect(sobrancelha.x).toBeLessThan(testa.x);
    expect(nasio.x).toBeGreaterThan(sobrancelha.x);
    expect(nasio.x).toBeLessThan(testa.x);
    expect(nasio.x).toBeGreaterThan(ponta.x);
  });

  it("o lábio superior avança menos que o nariz e mais que o queixo", () => {
    expect(labioSuperior.x).toBeGreaterThan(ponta.x);
    expect(labioSuperior.x).toBeLessThan(queixo.x);
  });

  it("tem proporção de rosto, não de linha esticada", () => {
    // Do alto da testa ao mento, a excursão horizontal de um perfil real fica
    // perto de 0,25–0,3 da altura. Fora dessa faixa o rosto lê como
    // caricatura (largo) ou como um risco (estreito).
    const doRosto = todosOsPontos(TRACO_PATH.resolucao).filter(
      (ponto) => ponto.y >= testa.y && ponto.y <= queixo.y + 30,
    );
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
