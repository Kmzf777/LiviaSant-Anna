"use client";

import { useEffect, useId, useRef, useState } from "react";

import {
  TRACO_COMPRIMENTO_CONDUZIDO,
  TRACO_CORREDOR,
  TRACO_FIM_TELA,
  TRACO_FOLGA_COMPRIMENTO,
  TRACO_INICIO_TELA,
  TRACO_VIEWBOX,
  caminhoConduzido,
} from "@/lib/traco";

/**
 * O Traço — a assinatura do site (§ 5.8 do briefing, § 4 do spec).
 *
 * Uma fita SVG fixa e recortada à viewport. Dentro dela, um caminho de 1px
 * que se desenha conforme o scroll. A geometria mora em `lib/traco.ts` — este
 * arquivo não conhece uma única coordenada.
 *
 * ---------------------------------------------------------------------------
 * O CORREDOR — a regra que manda em tudo aqui
 * ---------------------------------------------------------------------------
 *
 * § 5.8: *"Nunca cruza texto. Nunca compete com a leitura."* A fita cumpre
 * isso por construção, não por sorte: ela desenha `caminhoConduzido()`, cujo
 * percurso inteiro cabe nas 26 unidades de viewBox que o `Container` reserva
 * como `--traco-corredor` à direita de todo o site. Um `clip-path` na medida
 * do corredor fecha a conta — se a geometria e o token um dia divergirem, a
 * linha aparece cortada, que é um defeito visível, em vez de invadir a
 * coluna de texto, que é o defeito que este arquivo existe para impedir.
 *
 * A resolução em perfil de rosto NÃO viaja nesta fita. Ela precisa de 137
 * unidades de excursão — cinco corredores — e mora ancorada na zona
 * `data-traco="livre"` do `RespiroTraco`, o único trecho de página sem texto.
 * O porquê de não dar para carregá-la aqui está no cabeçalho daquele arquivo:
 * a fita é `fixed` e desliza ~0,66px por pixel de scroll em relação às seções,
 * então nenhuma faixa vazia de tamanho pagável a acompanha enquanto ela está
 * em cena.
 *
 * ---------------------------------------------------------------------------
 * COMO MONTAR
 * ---------------------------------------------------------------------------
 *
 * Em `app/layout.tsx`, como primeiro filho do `<body>`:
 *
 *     import { Traco } from "@/components/layout/Traco"
 *     …
 *     <body>
 *       <a href="#conteudo">…</a>
 *       <Traco />
 *       <Header />
 *       <main id="conteudo">{children}</main>
 *       <Footer />
 *     </body>
 *
 * Três contratos com o resto do site, todos baratos de cumprir:
 *
 * 1. `data-superficie` — cada seção full-bleed já declara
 *    `vinho | areia | areia-100` (componente `Secao`, subagent A). É o que o
 *    Traço mede para decidir a cor de cada trecho. Seções sem o atributo são
 *    ignoradas e o traço passa por elas na cor da superfície padrão (areia).
 *
 * 2. Texto acima do traço — a fita é `position: fixed; z-index: 1`, montada
 *    ANTES do `<main>`. Isso a coloca acima do fundo das seções (inclusive das
 *    que são `position: relative`, que é a maioria) e abaixo de qualquer
 *    conteúdo que declare `position: relative; z-index: 1`: mesmo z-index, e
 *    quem vem depois no DOM ganha.
 *
 *    Ou seja: **o wrapper de conteúdo de `Secao` precisa ter
 *    `position: relative; z-index: 1`.** Sem isso o traço passa POR CIMA do
 *    texto, que é a única forma de ele ficar feio. Uma seção que crie stacking
 *    context própria (`transform`, `opacity`, `isolation`, `z-index` numérico)
 *    tira o traço da equação inteira — evite nas seções full-bleed.
 *
 * 3. A pausa teatral — entre o manifesto (§ 8.3) e a rinoplastia (§ 8.5), a
 *    home reserva uma faixa sem texto marcada com `data-traco="livre"`
 *    (`RespiroTraco`). É o único lugar da página em que a assinatura pode usar
 *    a largura toda, e é lá que o perfil de rosto se desenha — na escala desta
 *    fita, medida na mesma `--traco-unidade`, para ler como a mesma linha.
 *
 * ---------------------------------------------------------------------------
 * COMO O PROGRESSO É CALCULADO
 * ---------------------------------------------------------------------------
 *
 * Preferido: `animation-timeline: scroll(root block)` anima a translação da
 * fita e o `stroke-dashoffset` do caminho. Zero JS por quadro.
 *
 * Fallback: um único listener de scroll passivo com `requestAnimationFrame`
 * escreve `--traco-progresso` (0 → 1); o CSS deriva translação e dashoffset
 * por `calc()`.
 *
 * `prefers-reduced-motion: reduce`: caminho completo, estático, sem observer
 * e sem listener.
 *
 * Abaixo de 768px o Traço degrada por decisão já tomada (§ 4.5 do spec): o
 * desenho acontece uma vez na entrada e depois só a translação — que é
 * transform puro, composto pelo compositor — e nenhum JS roda. É o único
 * candidato real a custar INP no celular, e aqui ele custa zero.
 *
 * ---------------------------------------------------------------------------
 * COR ADAPTATIVA
 * ---------------------------------------------------------------------------
 *
 * Nada de `mix-blend-mode`: sobre `wine-700` ele produz um blush sujo e
 * imprevisível, e a cor da assinatura não pode ser imprevisível (§ 4.4).
 *
 * O caminho é desenhado duas vezes — uma em `wine-700`, outra em
 * `blush-200` — e cada cópia é recortada por um `<clipPath>` montado com os
 * retângulos das seções da superfície correspondente. Antes da medição só a
 * cópia vinho aparece (o fundo padrão é areia), então nunca há flash.
 *
 * No modo estático (celular e reduced-motion, onde não há medição) as duas
 * cópias aparecem sem recorte. Isso funciona porque cada uma é praticamente
 * invisível sobre a superfície errada: `wine-700` sobre vinho e `blush-200`
 * sobre areia. O custo é um fio blush levíssimo sobre a areia; o benefício é
 * o traço continuar visível sobre as seções vinho sem uma linha de JS.
 */

const CAMINHO = caminhoConduzido();

/** Abaixo disso o Traço roda em modo estático e nenhum JS é registrado. */
const LARGURA_MINIMA_JS = 768;

type Superficie = "areia" | "vinho";

type Faixa = {
  chave: string;
  superficie: Superficie;
  /** y da faixa, em unidades de viewBox, com o scroll em 0. */
  yInicial: number;
  /** y da faixa, em unidades de viewBox, com o scroll no fim. */
  yFinal: number;
  altura: number;
};

export function Traco() {
  const raizRef = useRef<HTMLDivElement>(null);
  const fitaRef = useRef<SVGSVGElement>(null);
  const [faixas, setFaixas] = useState<Faixa[] | null>(null);

  const semente = useId().replace(/[^a-zA-Z0-9-]/g, "");
  const recorteAreia = `traco-areia-${semente}`;
  const recorteVinho = `traco-vinho-${semente}`;

  useEffect(() => {
    const raiz = raizRef.current;
    const fita = fitaRef.current;
    if (!raiz || !fita) return;

    const preferEstatico = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    const temEspaco = window.matchMedia(`(min-width: ${LARGURA_MINIMA_JS}px)`);

    let desligar: (() => void) | undefined;

    const reavaliar = () => {
      desligar?.();
      desligar = undefined;

      // Estático: sem observer, sem listener, sem medição. O CSS já mostra o
      // caminho completo nas duas cores.
      if (preferEstatico.matches || !temEspaco.matches) {
        setFaixas(null);
        delete raiz.dataset.tracoMedido;
        return;
      }

      desligar = ligar(raiz, fita, setFaixas);
    };

    reavaliar();
    preferEstatico.addEventListener("change", reavaliar);
    temEspaco.addEventListener("change", reavaliar);

    return () => {
      preferEstatico.removeEventListener("change", reavaliar);
      temEspaco.removeEventListener("change", reavaliar);
      desligar?.();
    };
  }, []);

  const recortadas = (superficie: Superficie) =>
    (faixas ?? []).filter((faixa) => faixa.superficie === superficie);

  return (
    <div ref={raizRef} className="traco" data-traco="" aria-hidden="true">
      <style dangerouslySetInnerHTML={{ __html: FOLHA }} />

      <svg
        ref={fitaRef}
        className="traco__fita"
        viewBox={`0 0 ${TRACO_VIEWBOX.largura} ${TRACO_VIEWBOX.altura}`}
        preserveAspectRatio="xMidYMid meet"
        fill="none"
        focusable="false"
        aria-hidden="true"
      >
        <defs>
          <clipPath id={recorteAreia} clipPathUnits="userSpaceOnUse">
            {recortadas("areia").map((faixa) => (
              <Faixa key={faixa.chave} faixa={faixa} />
            ))}
          </clipPath>
          <clipPath id={recorteVinho} clipPathUnits="userSpaceOnUse">
            {recortadas("vinho").map((faixa) => (
              <Faixa key={faixa.chave} faixa={faixa} />
            ))}
          </clipPath>
        </defs>

        {/* Sobre areia: fio vinho. Estado inicial e padrão. */}
        <g
          className="traco__grupo traco__grupo--areia"
          style={faixas ? { clipPath: `url(#${recorteAreia})` } : undefined}
        >
          <path className="traco__linha" d={CAMINHO} />
        </g>

        {/* Sobre vinho: fio blush. O `d` é duplicado em vez de referenciado por
            <use> de propósito: `stroke-dashoffset` animado em <use> depende de
            herança dentro da shadow tree, e o comportamento varia entre
            navegadores. A geometria continua tendo uma fonte só. */}
        <g
          className="traco__grupo traco__grupo--vinho"
          style={faixas ? { clipPath: `url(#${recorteVinho})` } : undefined}
        >
          <path className="traco__linha" d={CAMINHO} />
        </g>
      </svg>
    </div>
  );
}

function Faixa({ faixa }: { faixa: Faixa }) {
  return (
    <rect
      className="traco__faixa"
      x={-TRACO_VIEWBOX.largura}
      width={TRACO_VIEWBOX.largura * 3}
      y={faixa.yInicial}
      height={faixa.altura}
      data-y-inicial={faixa.yInicial}
      data-y-final={faixa.yFinal}
      style={
        {
          "--faixa-y-inicial": `${faixa.yInicial}px`,
          "--faixa-y-final": `${faixa.yFinal}px`,
        } as React.CSSProperties
      }
    />
  );
}

/* -------------------------------------------------------------------------- */
/* Medição e progresso                                                        */
/* -------------------------------------------------------------------------- */

/**
 * Liga a medição e, se o navegador não tiver scroll-driven animation, o
 * fallback de progresso. Devolve a função que desliga tudo.
 */
function ligar(
  raiz: HTMLDivElement,
  fita: SVGSVGElement,
  setFaixas: (proximas: Faixa[]) => void,
): () => void {
  const alvo = document.querySelector("main") ?? document.body;

  let pedidoMedida = 0;
  let pedidoQuadro = 0;
  let percurso = 1;

  /**
   * Toda leitura de layout acontece aqui, dentro do rAF do ResizeObserver —
   * nunca no handler de scroll.
   *
   * A fita se desloca linearmente com o progresso, e as seções se deslocam
   * linearmente com o scroll. A diferença entre as duas também é linear, então
   * cada faixa precisa apenas de dois valores (y no início e y no fim) e o
   * navegador interpola o resto. É o que torna a cor adaptativa barata.
   */
  const medir = () => {
    pedidoMedida = 0;

    const alturaTela = window.innerHeight;
    const alturaFita = fita.getBoundingClientRect().height;
    if (alturaTela <= 0 || alturaFita <= 0) return;

    const escala = alturaFita / TRACO_VIEWBOX.altura;
    percurso = Math.max(1, document.documentElement.scrollHeight - alturaTela);

    const topoNoInicio = TRACO_INICIO_TELA * alturaTela;
    const topoNoFim = TRACO_FIM_TELA * alturaTela - alturaFita;
    const rolagem = window.scrollY;

    const proximas: Faixa[] = [];
    const secoes = alvo.querySelectorAll<HTMLElement>("[data-superficie]");

    secoes.forEach((secao, indice) => {
      // Seções aninhadas herdariam a mesma área duas vezes.
      if (secao.parentElement?.closest("[data-superficie]")) return;

      const caixa = secao.getBoundingClientRect();
      if (caixa.height <= 0) return;

      const topoDocumento = caixa.top + rolagem;
      const superficie: Superficie =
        secao.dataset.superficie === "vinho" ? "vinho" : "areia";

      proximas.push({
        chave: `${superficie}-${indice}`,
        superficie,
        yInicial: (topoDocumento - topoNoInicio) / escala,
        yFinal: (topoDocumento - percurso - topoNoFim) / escala,
        altura: caixa.height / escala,
      });
    });

    setFaixas(proximas);
    raiz.dataset.tracoMedido = "true";
  };

  const agendarMedida = () => {
    if (pedidoMedida) return;
    pedidoMedida = requestAnimationFrame(medir);
  };

  const observador = new ResizeObserver(agendarMedida);
  observador.observe(alvo);
  agendarMedida();

  window.addEventListener("resize", agendarMedida, { passive: true });

  let removerScroll: (() => void) | undefined;

  if (!suportaLinhaDoTempo()) {
    const aplicar = () => {
      pedidoQuadro = 0;
      const progresso = Math.min(1, Math.max(0, window.scrollY / percurso));
      raiz.style.setProperty("--traco-progresso", progresso.toFixed(4));

      // Escrita pura: nenhuma leitura de layout neste caminho.
      const faixasDom = fita.querySelectorAll<SVGRectElement>(".traco__faixa");
      faixasDom.forEach((retangulo) => {
        const inicio = Number(retangulo.dataset.yInicial);
        const fim = Number(retangulo.dataset.yFinal);
        if (!Number.isFinite(inicio) || !Number.isFinite(fim)) return;
        retangulo.setAttribute(
          "y",
          String(inicio + (fim - inicio) * progresso),
        );
      });
    };

    const aoRolar = () => {
      if (pedidoQuadro) return;
      pedidoQuadro = requestAnimationFrame(aplicar);
    };

    window.addEventListener("scroll", aoRolar, { passive: true });
    aoRolar();
    removerScroll = () => window.removeEventListener("scroll", aoRolar);
  }

  return () => {
    observador.disconnect();
    window.removeEventListener("resize", agendarMedida);
    removerScroll?.();
    if (pedidoMedida) cancelAnimationFrame(pedidoMedida);
    if (pedidoQuadro) cancelAnimationFrame(pedidoQuadro);
    delete raiz.dataset.tracoMedido;
    raiz.style.removeProperty("--traco-progresso");
  };
}

function suportaLinhaDoTempo(): boolean {
  return (
    typeof CSS !== "undefined" &&
    typeof CSS.supports === "function" &&
    CSS.supports("animation-timeline: scroll()")
  );
}

/* -------------------------------------------------------------------------- */
/* Folha de estilo                                                            */
/* -------------------------------------------------------------------------- */

/**
 * O CSS vive aqui, e não em `globals.css`, porque cada número dele é derivado
 * das constantes de `lib/traco.ts`. Trocar a curva oficial não pode exigir
 * lembrar de sincronizar um arquivo de estilo à mão.
 *
 * A escala não está aqui: `--traco-telas` mora em `styles/theme.css`, junto do
 * `--traco-corredor` que sai dela e que o `Container` reserva. São o mesmo
 * número visto de dois lados, e separá-los seria a maneira mais rápida de a
 * fita voltar a cruzar texto.
 *
 * A ordem dos blocos é a cascata: base, caminho preferido, fallback,
 * degradação no celular, reduced-motion. Cada bloco só sobrescreve o anterior.
 */
const FOLHA = `
.traco {
  position: fixed;
  inset: 0;
  /* 1, não 0: seções full-bleed costumam ser \`position: relative\`, e um
     posicionado de z-index automático pinta na mesma camada que um z-index 0 —
     ganhando por ordem de DOM. Com 1 o traço fica acima do fundo das seções e
     empatado com o conteúdo, que vence por vir depois. */
  z-index: 1;
  overflow: hidden;
  pointer-events: none;
  contain: layout paint style;

  /* A fita é dimensionada A PARTIR do corredor, e não o contrário.
     \`--traco-corredor\` (styles/theme.css) já sai de \`--traco-telas\`; fazer o
     caminho de volta por aqui é o que garante que o \`clamp\` dele também
     limite a fita. Se a fita crescesse por conta própria, um teto no corredor
     viraria uma linha cortada — ou, pior, um corredor menor do que a curva. */
  --traco-altura: calc(
    var(--traco-corredor) * ${TRACO_VIEWBOX.altura} / ${TRACO_CORREDOR}
  );
  --traco-largura: calc(var(--traco-altura) * ${TRACO_VIEWBOX.largura} / ${TRACO_VIEWBOX.altura});
  --traco-y-inicial: calc(${TRACO_INICIO_TELA} * 100vh);
  --traco-y-final: calc(${TRACO_FIM_TELA} * 100vh - var(--traco-altura));
  --traco-progresso: 0;

  /* Comprimento do caminho em PIXELS DE TELA, não em unidades de viewBox.
     Medido no navegador: com \`vector-effect: non-scaling-stroke\` o Chrome
     resolve \`stroke-dasharray\` no espaço de tela e ignora \`pathLength\`, então
     um dasharray normalizado quebra o traço em pedaços e o faz sumir no fim do
     scroll. Escalar o comprimento junto com a fita é o que mantém a fração
     desenhada igual ao progresso em qualquer largura de tela.

     Se algum navegador resolver o dash no espaço de usuário, o valor fica
     grande demais em vez de pequeno demais: o traço termina de se desenhar
     antes do fim do scroll e fica completo. Degrada, não quebra. */
  --traco-comprimento: calc(
    var(--traco-altura) * ${(TRACO_COMPRIMENTO_CONDUZIDO * TRACO_FOLGA_COMPRIMENTO).toFixed(1)} /
      ${TRACO_VIEWBOX.altura}
  );
}

.traco__fita {
  position: absolute;
  top: 0;
  /* Ancorada na borda direita do CONTAINER, não da viewport: acima de 1440px
     o container para de crescer e a fita tem de parar com ele, senão ela sai
     do corredor que o Container reservou e vai morar na sobra da tela. */
  right: max(0px, calc((100% - var(--container)) / 2));
  width: var(--traco-largura);
  height: var(--traco-altura);
  pointer-events: none;
  transform: translate3d(0, var(--traco-y-inicial), 0);

  /* O recorte de segurança. A curva já cabe no corredor por geometria
     (\`TRACO_CORREDOR\` = ${TRACO_CORREDOR} unidades de viewBox); isto aqui é o que
     garante que continue cabendo se alguém trocar a curva sem reler o token.
     A translação da fita é só vertical, então a faixa recortada fica parada
     no mesmo x da tela. */
  clip-path: inset(0 0 0 calc(100% - var(--traco-corredor)));
}

.traco__linha {
  fill: none;
  stroke: var(--color-wine-700);
  stroke-width: 1;
  vector-effect: non-scaling-stroke;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-dasharray: var(--traco-comprimento);
  stroke-dashoffset: var(--traco-comprimento);
}

.traco__grupo--vinho .traco__linha {
  stroke: var(--color-blush-200);
}

/* Antes da medição só a cópia vinho aparece: o fundo padrão é areia, então
   nunca existe um quadro com a cor errada. */
.traco__grupo--vinho {
  visibility: hidden;
}

.traco[data-traco-medido="true"] .traco__grupo--vinho {
  visibility: visible;
}

/* Sem JS não há medição, e um traço vinho sobre seção vinho é um traço
   invisível. As duas cópias sem recorte resolvem: cada uma some sobre a
   superfície errada. */
@media (scripting: none) {
  .traco__grupo--vinho {
    visibility: visible;
  }
}

@keyframes traco-percorrer {
  from { transform: translate3d(0, var(--traco-y-inicial), 0); }
  to   { transform: translate3d(0, var(--traco-y-final), 0); }
}

@keyframes traco-desenhar {
  from { stroke-dashoffset: var(--traco-comprimento); }
  to   { stroke-dashoffset: 0; }
}

@keyframes traco-faixa {
  from { y: var(--faixa-y-inicial); }
  to   { y: var(--faixa-y-final); }
}

@keyframes traco-desenho-unico {
  from { stroke-dashoffset: var(--traco-comprimento); }
  to   { stroke-dashoffset: 0; }
}

/* Caminho preferido: o navegador conduz tudo pela timeline de scroll. */
@supports (animation-timeline: scroll()) {
  .traco__fita {
    animation: traco-percorrer linear both;
    animation-timeline: scroll(root block);
  }

  .traco__linha {
    animation: traco-desenhar linear both;
    animation-timeline: scroll(root block);
  }

  .traco__faixa {
    animation: traco-faixa linear both;
    animation-timeline: scroll(root block);
  }
}

/* Fallback: o rAF escreve --traco-progresso e o y dos retângulos. */
@supports not (animation-timeline: scroll()) {
  .traco__fita {
    transform: translate3d(
      0,
      calc(
        var(--traco-y-inicial) +
        (var(--traco-y-final) - var(--traco-y-inicial)) * var(--traco-progresso)
      ),
      0
    );
  }

  .traco__linha {
    stroke-dashoffset: calc(
      var(--traco-comprimento) * (1 - var(--traco-progresso))
    );
  }
}

/* Degradação no celular (§ 4.5 do spec): o desenho acontece uma vez, na
   entrada; depois só a translação, que é transform puro. Sem medição, as duas
   cópias ficam sem recorte — cada uma some sobre a superfície errada. */
@media (max-width: 767.98px) {
  .traco__grupo--vinho {
    visibility: visible;
  }

  .traco__linha {
    animation: traco-desenho-unico var(--dur-draw) var(--ease-out) 120ms both;
    animation-timeline: auto;
    stroke-dashoffset: 0;
  }
}

/* Completo e estático. */
@media (prefers-reduced-motion: reduce) {
  .traco__grupo--vinho {
    visibility: visible;
  }

  .traco__fita {
    animation: none;
    transform: translate3d(0, var(--traco-y-inicial), 0);
  }

  .traco__linha {
    animation: none;
    stroke-dashoffset: 0;
  }

  .traco__faixa {
    animation: none;
  }
}
`;
