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
 * O eixo x cresce para a direita. A fita é ancorada na borda direita do
 * container, então x alto = margem direita, x baixo = para dentro da página.
 *
 * ---------------------------------------------------------------------------
 * O corredor — por que a linha em repouso é tão comportada
 * ---------------------------------------------------------------------------
 *
 * O briefing § 5.8 fecha com uma regra dura: *"Nunca cruza texto. Nunca
 * compete com a leitura."* Ela não é decorativa. Medida em 21 rotas, a versão
 * anterior desta curva cruzava 85% dos blocos de texto a 390px, 51% a 768 e
 * 12% a 1440 — a fita passeava por meia largura de tela e o texto ia até a
 * borda do `Container`.
 *
 * A correção é estrutural, não página a página: **o site reserva um corredor
 * à direita** (`--traco-corredor`, em `styles/theme.css`), e a fita vive
 * inteiramente dentro dele. Para isso, todo o percurso em repouso mora em
 * x ∈ [214, 234] — 26 unidades de viewBox, `TRACO_BANDA_REPOUSO`. O corredor
 * é dimensionado a partir desse número; se a curva mudar, ele muda junto.
 *
 * ---------------------------------------------------------------------------
 * Os segmentos
 * ---------------------------------------------------------------------------
 *
 *   entrada     y    0 → 480    hero → manifesto        (1,6 tela)
 *   resolucao   y  480 → 930    o perfil de rosto       (1,5 tela)
 *   conduzido   y  480 → 930    a alternativa de repouso ao rosto
 *   saida       y  930 → 1560   rinoplastia → footer    (2,1 telas)
 *
 * `resolucao` e `conduzido` ocupam a MESMA faixa vertical e têm os mesmos dois
 * extremos: são duas leituras do mesmo trecho. A fita que percorre a página
 * inteira usa `conduzido` — cabe no corredor. O rosto, que precisa de 137
 * unidades de excursão (5,3× o corredor), é desenhado à parte, ancorado na
 * zona sem texto do `RespiroTraco` (`data-traco="livre"`), onde não há leitura
 * com que competir. Ver o cabeçalho de `components/sections/RespiroTraco.tsx`
 * para a aritmética que torna impossível carregar o rosto na fita móvel.
 *
 * Os segmentos são contínuos: cada um começa exatamente onde o anterior
 * termina, e `caminhoCompleto()` / `caminhoConduzido()` costuram os três em um
 * único `d`. O teste `tests/unit/traco.spec.ts` reprova se as emendas se
 * soltarem.
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
    "M 234 0",
    "C 234 46 230 82 226 122",
    "C 222 164 216 196 215 236",
    "C 214 280 221 314 224 352",
    "C 227 396 220 430 216 458",
    "C 215 470 214 476 214 480",
  ].join(" "),

  resolucao: [
    "M 214 480",
    "C 218 496 212 512 210 540", // alto do crânio, bojo para trás
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
    "C 205 863 210 876 212 894", // saída do rosto
    "C 214 912 214 922 214 930",
  ].join(" "),

  /**
   * A alternativa de repouso ao rosto — o que a fita móvel desenha no lugar
   * dele.
   *
   * Mesmos extremos que `resolucao` — (214, 480) e (214, 930) — e a mesma
   * faixa vertical, mas sem sair do corredor: é a "linha condutora e nada
   * mais" de que fala o PLANO-MOBILE. Um único bojo largo, no ritmo da
   * `entrada` e da `saida`, para que a emenda não se perceba.
   */
  conduzido: [
    "M 214 480",
    "C 214 512 220 542 225 578",
    "C 230 618 233 654 231 692",
    "C 229 730 222 762 218 800",
    "C 215 838 214 878 214 930",
  ].join(" "),

  saida: [
    "M 214 930",
    "C 214 958 219 986 223 1024",
    "C 227 1070 220 1106 217 1152",
    "C 214 1200 222 1240 226 1290",
    "C 230 1342 220 1384 217 1436",
    "C 215 1486 221 1524 224 1560",
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
 * A largura da fita é derivada da altura pelo aspecto do viewBox, e a largura
 * do corredor é derivada da largura da fita: esta é a única alavanca de escala
 * do Traço. Mexer aqui move o corredor, e portanto a margem direita de todo o
 * site — é uma decisão de composição, não um ajuste local.
 *
 * No celular a fita encolhe: um corredor de 5% da tela já é presença
 * suficiente para um fio de 1px, e cada pixel a mais sai da medida de leitura,
 * que a 390px já é curta.
 */
export const TRACO_TELAS = { movel: 1.8, tablet: 3, amplo: 5.2 } as const;

/**
 * Largura do corredor, em unidades de viewBox, incluindo a folga.
 *
 * `TRACO_BANDA_REPOUSO` (abaixo) mede o quanto a curva em repouso realmente
 * ocupa; esta constante acrescenta a folga com que o corredor é dimensionado,
 * para que a linha nunca encoste no recorte de segurança.
 */
export const TRACO_CORREDOR_FOLGA = 2;

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

/**
 * O caminho que a fita móvel desenha: o mesmo percurso, com `conduzido` no
 * lugar do rosto.
 *
 * É este — e não `caminhoCompleto()` — que aparece na tela do começo ao fim da
 * página, porque é o único que cabe no corredor. O rosto vive em
 * `RespiroTraco`.
 */
export function caminhoConduzido(): string {
  const { entrada, conduzido, saida } = TRACO_PATH;
  return [entrada, semMoveInicial(conduzido), semMoveInicial(saida)].join(" ");
}

/** Caixa que contém todos os pontos de um caminho, em unidades de viewBox. */
export function limites(d: string): {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
} {
  const pontos = todosOsPontos(d);
  const xs = pontos.map((ponto) => ponto.x);
  const ys = pontos.map((ponto) => ponto.y);
  return {
    minX: Math.min(...xs),
    maxX: Math.max(...xs),
    minY: Math.min(...ys),
    maxY: Math.max(...ys),
  };
}

/**
 * Quantas unidades de viewBox, medidas a partir da borda direita, a fita em
 * repouso ocupa.
 *
 * É a ponte entre a geometria e o layout: `--traco-corredor`, em
 * `styles/theme.css`, é exatamente `(TRACO_BANDA_REPOUSO +
 * TRACO_CORREDOR_FOLGA)` unidades convertidas em pixels, e o `Container`
 * reserva esse tanto de margem à direita em todas as larguras.
 *
 * É calculado a partir da curva, não digitado: quem trocar `TRACO_PATH` pela
 * curva oficial do logo move o corredor junto, sem precisar saber que ele
 * existe. O recorte de segurança em `Traco.tsx` garante o resto.
 */
export const TRACO_BANDA_REPOUSO =
  TRACO_VIEWBOX.largura - limites(caminhoConduzido()).minX;

/** Corredor reservado, em unidades de viewBox. Base de `--traco-corredor`. */
export const TRACO_CORREDOR = TRACO_BANDA_REPOUSO + TRACO_CORREDOR_FOLGA;

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

/** Idem, para o caminho que a fita realmente desenha. */
export const TRACO_COMPRIMENTO_CONDUZIDO = comprimentoAproximado(
  caminhoConduzido(),
  256,
);

/** Comprimento só do rosto — o dasharray do desenho ancorado no respiro. */
export const TRACO_COMPRIMENTO_RESOLUCAO = comprimentoAproximado(
  TRACO_PATH.resolucao,
  256,
);

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
