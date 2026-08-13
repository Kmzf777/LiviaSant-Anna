/**
 * O Traço — geometria.
 *
 * Este arquivo é a ÚNICA fonte da curva. Nenhum componente conhece a
 * geometria: trocar pela curva oficial do logo é editar `TRACO_PATH` aqui,
 * e mais nada (§ 4.1 do spec, § 5.8 do briefing).
 *
 * ---------------------------------------------------------------------------
 * Sistema de coordenadas
 * ---------------------------------------------------------------------------
 *
 * viewBox 240 × 1560, sem distorção (`preserveAspectRatio` exato).
 *
 *   300 unidades = 1 altura de tela.
 *
 * Daí sai tudo o mais: a fita tem 1560 / 300 = 5,2 telas de altura, e a
 * `resolucao` ocupa 450 unidades — exatamente as ~1,5 telas que o briefing
 * pede para o momento teatral.
 *
 * O eixo x cresce para a direita. A fita é ancorada na borda direita da
 * viewport, então x alto = margem direita, x baixo = para dentro da página.
 * A linha "em repouso" mora em x ≈ 210–228 (margem); só durante a `resolucao`
 * ela entra até x ≈ 103, e é lá que o rosto acontece.
 *
 * ---------------------------------------------------------------------------
 * Os três segmentos
 * ---------------------------------------------------------------------------
 *
 *   entrada     y    0 → 480    hero → manifesto        (1,6 tela)
 *   resolucao   y  480 → 930    manifesto → rinoplastia (1,5 tela)
 *   saida       y  930 → 1560   rinoplastia → footer    (2,1 telas)
 *
 * Os segmentos são contínuos: cada um começa exatamente onde o anterior
 * termina, e `caminhoCompleto()` costura os três em um único `d`. O teste
 * `tests/unit/traco.spec.ts` reprova se as emendas se soltarem.
 *
 * ---------------------------------------------------------------------------
 * Alfabeto
 * ---------------------------------------------------------------------------
 *
 * Só `M` e `C`, em coordenadas absolutas, separados por espaço. É uma
 * restrição deliberada: mantém a curva legível para quem editar à mão e
 * permite que `analisarCaminho()` seja um parser de 30 linhas em vez de uma
 * dependência. Quando o SVG oficial chegar, converta-o para esse alfabeto
 * (qualquer editor vetorial exporta cúbicas absolutas).
 */

export type Ponto = { readonly x: number; readonly y: number };

export type ComandoCaminho =
  | { readonly tipo: "M"; readonly para: Ponto }
  | {
      readonly tipo: "C";
      readonly c1: Ponto;
      readonly c2: Ponto;
      readonly para: Ponto;
    };

/** Caixa de coordenadas da fita. Aspecto travado — a curva nunca distorce. */
export const TRACO_VIEWBOX = { largura: 240, altura: 1560 } as const;

/** Quantas unidades de viewBox equivalem a uma altura de tela. */
export const TRACO_UNIDADES_POR_TELA = 300;

/**
 * A curva, em três segmentos nomeados.
 *
 * `resolucao` é o perfil de rosto do logo em escala grande. A ordem dos
 * marcos, de cima para baixo, é a anatomia: testa (bojo em x ≈ 203),
 * glabela, násio (a reentrância que ancora o nariz), dorso nasal reto,
 * ponta (x ≈ 103, o ponto mais à esquerda de todo o traço), columela,
 * filtro, lábio superior, estômio, lábio inferior, sulco mentolabial,
 * pogônio, mento e a mandíbula varrendo de volta para a margem.
 *
 * É uma aproximação em Bézier, não a curva oficial — ver PENDENCIAS.md.
 */
export const TRACO_PATH = {
  entrada: [
    "M 228 0",
    "C 228 48 224 84 220 124",
    "C 216 166 210 196 210 236",
    "C 210 280 216 312 215 352",
    "C 214 396 205 428 199 458",
    "C 197 470 196 476 196 480",
  ].join(" "),

  resolucao: [
    "M 196 480",
    "C 200 496 209 512 210 540", // alto do crânio, bojo para trás
    "C 211 572 205 596 194 618", // testa desce para a frente
    "C 188 626 176 632 174 644", // arco superciliar — a testa avança
    "C 172 656 177 658 179 664", // násio — a reentrância que ancora o nariz
    "C 180 670 174 678 164 690", // virada para o dorso
    "C 150 703 132 715 123 724", // dorso nasal, quase reto
    "C 116 729 114 734 121 737", // ponta
    "C 128 741 135 744 142 746", // columela, base do nariz
    "C 147 748 151 749 152 751", // subnasal
    "C 154 756 149 760 145 764", // filtro → lábio superior
    "C 142 768 147 770 151 772", // estômio
    "C 155 775 150 780 146 784", // lábio inferior
    "C 142 790 153 795 159 800", // sulco mentolabial
    "C 163 807 157 814 154 821", // pogônio (frente do queixo)
    "C 151 832 158 841 167 845", // mento
    "C 177 851 187 855 196 858", // mandíbula voltando
    "C 205 863 210 876 210 894", // saída do rosto
    "C 210 912 209 922 208 930",
  ].join(" "),

  saida: [
    "M 208 930",
    "C 207 958 211 986 214 1024",
    "C 217 1070 209 1104 207 1150",
    "C 205 1200 214 1238 217 1288",
    "C 220 1342 211 1382 210 1436",
    "C 209 1486 215 1524 217 1560",
  ].join(" "),
} as const;

/** Faixa vertical de cada segmento, em unidades de viewBox. */
export const TRACO_SEGMENTOS = {
  entrada: { de: 0, ate: 480 },
  resolucao: { de: 480, ate: 930 },
  saida: { de: 930, ate: 1560 },
} as const;

/**
 * Folga sobre o comprimento medido, para o dash nunca deixar um fiapo por
 * desenhar no fim do scroll por conta de arredondamento.
 */
export const TRACO_FOLGA_COMPRIMENTO = 1.02;

/**
 * Altura da fita, em telas, por faixa de largura.
 *
 * A largura da fita é derivada da altura pelo aspecto do viewBox, então esta
 * é a única alavanca de escala do Traço. No celular ela encolhe para o rosto
 * caber na tela; em telas largas ela cresce e o traço passa a viver na
 * margem, fora da coluna de texto.
 */
export const TRACO_TELAS = { movel: 2.4, tablet: 3.4, amplo: 5.2 } as const;

/** Onde o topo da fita fica na viewport quando o scroll está em 0. */
export const TRACO_INICIO_TELA = 0.55;

/** Onde a base da fita fica na viewport quando o scroll chega ao fim. */
export const TRACO_FIM_TELA = 0.9;

/* -------------------------------------------------------------------------- */
/* Leitura da geometria                                                       */
/* -------------------------------------------------------------------------- */

/**
 * Parser do subconjunto de SVG que a geometria usa (`M` e `C` absolutos).
 *
 * Falha alto em vez de devolver NaN: uma coordenada inválida vira uma linha
 * invisível ou um path que o navegador descarta em silêncio, e isso é o tipo
 * de defeito que só aparece em produção.
 */
export function analisarCaminho(d: string): ComandoCaminho[] {
  const tokens = d
    .trim()
    .split(/[\s,]+/)
    .filter(Boolean);
  const comandos: ComandoCaminho[] = [];
  let i = 0;

  const numero = (): number => {
    const bruto = tokens[i];
    i += 1;
    if (bruto === undefined) {
      throw new Error("Traço: o caminho terminou no meio de um comando.");
    }
    const valor = Number(bruto);
    if (!Number.isFinite(valor)) {
      throw new Error(`Traço: coordenada inválida "${bruto}".`);
    }
    return valor;
  };

  const ponto = (): Ponto => {
    const x = numero();
    const y = numero();
    return { x, y };
  };

  while (i < tokens.length) {
    const tipo = tokens[i];
    i += 1;

    if (tipo === "M") {
      comandos.push({ tipo: "M", para: ponto() });
    } else if (tipo === "C") {
      comandos.push({ tipo: "C", c1: ponto(), c2: ponto(), para: ponto() });
    } else {
      throw new Error(
        `Traço: comando "${tipo}" não suportado. A geometria usa apenas M e C absolutos.`,
      );
    }
  }

  if (comandos.length === 0) {
    throw new Error("Traço: caminho vazio.");
  }

  return comandos;
}

/** Âncoras (pontos por onde a curva passa), na ordem. */
export function ancoras(d: string): Ponto[] {
  return analisarCaminho(d).map((comando) => comando.para);
}

/** Todos os pontos, âncoras e controles — para verificar limites. */
export function todosOsPontos(d: string): Ponto[] {
  return analisarCaminho(d).flatMap((comando) =>
    comando.tipo === "M"
      ? [comando.para]
      : [comando.c1, comando.c2, comando.para],
  );
}

export function pontoInicial(d: string): Ponto {
  const primeiro = ancoras(d)[0];
  if (!primeiro) throw new Error("Traço: caminho sem ponto inicial.");
  return primeiro;
}

export function pontoFinal(d: string): Ponto {
  const pontos = ancoras(d);
  const ultimo = pontos[pontos.length - 1];
  if (!ultimo) throw new Error("Traço: caminho sem ponto final.");
  return ultimo;
}

/**
 * Costura os três segmentos em um único `d` contínuo.
 *
 * O `M` inicial de `resolucao` e de `saida` é removido — ele só existe para
 * que cada segmento seja legível e testável isoladamente. Se uma emenda não
 * fechar, `analisarCaminho` continua válido mas o teste de continuidade
 * reprova, que é onde o erro deve aparecer.
 */
export function caminhoCompleto(): string {
  const { entrada, resolucao, saida } = TRACO_PATH;
  return [entrada, semMoveInicial(resolucao), semMoveInicial(saida)].join(" ");
}

function semMoveInicial(segmento: string): string {
  const comandos = analisarCaminho(segmento);
  if (comandos[0]?.tipo !== "M") {
    throw new Error("Traço: todo segmento precisa começar com um M absoluto.");
  }
  return segmento.trim().replace(/^M[\s,]+[-\d.]+[\s,]+[-\d.]+[\s,]*/, "");
}

/**
 * Comprimento de arco por amostragem. Não é usado em runtime (o `pathLength`
 * normalizado cuida disso) — existe para os testes conseguirem afirmar que a
 * curva tem extensão plausível sem depender de `getTotalLength`, que o jsdom
 * não implementa.
 */
export function comprimentoAproximado(d: string, amostras = 64): number {
  const comandos = analisarCaminho(d);
  let atual: Ponto = { x: 0, y: 0 };
  let total = 0;

  for (const comando of comandos) {
    if (comando.tipo === "M") {
      atual = comando.para;
      continue;
    }

    let anterior = atual;
    for (let passo = 1; passo <= amostras; passo += 1) {
      const t = passo / amostras;
      const seguinte = cubica(atual, comando.c1, comando.c2, comando.para, t);
      total += Math.hypot(seguinte.x - anterior.x, seguinte.y - anterior.y);
      anterior = seguinte;
    }
    atual = comando.para;
  }

  return total;
}

/**
 * Comprimento do traço inteiro, em unidades de viewBox.
 *
 * É o que o CSS usa como `stroke-dasharray`, convertido para pixels de tela.
 *
 * Por que não `pathLength` normalizado, que seria mais limpo: com
 * `vector-effect: non-scaling-stroke` — que o briefing exige e que é o que
 * mantém o fio em 1px em qualquer escala — o Chrome calcula o padrão de
 * tracejado no espaço de TELA e ignora a normalização do `pathLength`. O
 * resultado é um traço que aparece em pedaços e some no fim do scroll.
 * Medido em produção, não deduzido: ver o comentário de FOLHA em
 * `components/layout/Traco.tsx`.
 */
export const TRACO_COMPRIMENTO = comprimentoAproximado(caminhoCompleto(), 256);

function cubica(p0: Ponto, p1: Ponto, p2: Ponto, p3: Ponto, t: number): Ponto {
  const u = 1 - t;
  const a = u * u * u;
  const b = 3 * u * u * t;
  const c = 3 * u * t * t;
  const dd = t * t * t;
  return {
    x: a * p0.x + b * p1.x + c * p2.x + dd * p3.x,
    y: a * p0.y + b * p1.y + c * p2.y + dd * p3.y,
  };
}
