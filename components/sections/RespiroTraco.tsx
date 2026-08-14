import { Secao } from "@/components/ui/Secao";
import {
  TRACO_COMPRIMENTO_RESOLUCAO,
  TRACO_FOLGA_COMPRIMENTO,
  TRACO_PATH,
  TRACO_SEGMENTOS,
  TRACO_VIEWBOX,
  limites,
} from "@/lib/traco";

/**
 * O respiro do Traço — a pausa teatral, e o único lugar do site em que a
 * assinatura usa a largura toda.
 *
 * O briefing § 5.8 pede duas coisas que brigam entre si: que o traço
 * *"resolva-se no perfil de rosto do logo, a mesma curva em escala grande"*, e
 * que ele *"nunca cruze texto"*. O rosto precisa de 137 unidades de excursão
 * horizontal — cinco vezes o corredor que o `Container` reserva. As duas
 * regras só cabem juntas num trecho de página sem texto nenhum. É este.
 *
 * A faixa se marca com `data-traco="livre"`: leia como *"aqui a assinatura
 * pode sair do corredor"*. Escrever qualquer coisa dentro dela reabre o
 * defeito que o corredor existe para fechar.
 *
 * ## Por que o rosto é ancorado aqui, e não carregado pela fita
 *
 * A versão anterior desenhava o rosto no meio da fita `fixed` que percorre a
 * página, e gastava 160vh de areia vazia tentando fazer os dois se
 * encontrarem. Não dá — e a aritmética estava escrita no próprio arquivo:
 *
 *   A fita se desloca ~0,33px por pixel de scroll; a seção, 1px. A deriva
 *   entre as duas é de ~0,66px por pixel. O rosto fica visível por ~6.400px
 *   de scroll, o que faz a faixa deslizar ~4.300px em relação a ele. Para
 *   contê-lo do início ao fim seriam necessárias mais de seis telas de página
 *   vazia.
 *
 * Ancorado, o encontro é exato: o rosto está sempre inteiro dentro da zona
 * livre, em qualquer altura de tela, e o respiro passa a ser dimensionado pelo
 * desenho em vez de por tentativa. A continuidade com a fita se mantém pela
 * escala — o rosto é medido na mesma `--traco-unidade`, então é literalmente a
 * mesma curva no mesmo tamanho que passa na margem, só que solta.
 *
 * ## Abaixo de `md`, sem rosto
 *
 * O perfil precisa de ~0,26 × altura de excursão horizontal. Num corredor de
 * ~27px o rosto sairia irreconhecível, e uma tela e meia de areia vazia no
 * celular lê como "a página acabou". Abaixo de 768px a faixa vira uma pausa
 * curta e o Traço é linha condutora e nada mais — degradação honesta, não
 * desligamento: a fita continua subindo a página inteira ao lado do texto.
 *
 * Sem `aria-label` e sem heading de propósito: é uma `div`, não uma landmark.
 * Uma região anunciada e vazia é ruído para quem usa leitor de tela.
 */

const ROSTO = TRACO_PATH.resolucao;
const CAIXA = limites(ROSTO);

/** Folga em volta do desenho, em unidades de viewBox. */
const MARGEM = 3;

const VB_X = CAIXA.minX - MARGEM;
const VB_LARGURA = CAIXA.maxX - CAIXA.minX + MARGEM * 2;
const VB_Y = TRACO_SEGMENTOS.resolucao.de;
const VB_ALTURA = TRACO_SEGMENTOS.resolucao.ate - TRACO_SEGMENTOS.resolucao.de;

/**
 * Distância entre a borda direita do desenho e a borda direita do container,
 * em unidades de viewBox — a mesma que a fita guarda, para que o rosto caia
 * exatamente sobre a pista por onde a linha passa.
 */
const RECUO = TRACO_VIEWBOX.largura - (VB_X + VB_LARGURA);

const COMPRIMENTO = (
  TRACO_COMPRIMENTO_RESOLUCAO * TRACO_FOLGA_COMPRIMENTO
).toFixed(1);

/**
 * Como em `Traco.tsx`, o CSS mora junto do componente porque cada número dele
 * sai da geometria de `lib/traco.ts`. Trocar a curva oficial não pode exigir
 * lembrar de acertar um arquivo de estilo à mão.
 */
const FOLHA = `
.respiro-traco {
  display: flex;
  align-items: center;
  min-height: 22vh;
  --respiro-comprimento: calc(${COMPRIMENTO} * var(--traco-unidade));
}

.respiro-traco__palco {
  display: flex;
  justify-content: flex-end;
  width: 100%;
  max-width: var(--container);
  margin-inline: auto;
  padding-inline-end: calc(${RECUO} * var(--traco-unidade));
  pointer-events: none;

  /* A linha do tempo do desenho é a passagem DO ROSTO pela tela, não a da
     seção: assim o traço termina de se desenhar no mesmo ponto do gesto em
     qualquer altura de viewport. */
  view-timeline-name: --respiro-rosto;
  view-timeline-axis: block;
}

.respiro-traco__rosto {
  display: none;
  width: calc(${VB_LARGURA} * var(--traco-unidade));
  height: calc(${VB_ALTURA} * var(--traco-unidade));
  pointer-events: none;
}

.respiro-traco__linha {
  fill: none;
  stroke: var(--color-wine-700);
  stroke-width: 1;
  vector-effect: non-scaling-stroke;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-dasharray: var(--respiro-comprimento);
  /* Completo por padrão. Quem não tiver \`view()\` — e quem pedir menos
     movimento — recebe o desenho pronto, que é a degradação certa: o rosto é
     o conteúdo, a animação é o acabamento. */
  stroke-dashoffset: 0;
}

@media (min-width: 768px) {
  .respiro-traco {
    /* Dimensionada pelo desenho, não por palpite: o rosto inteiro mais uma
       margem de respiro em cima e embaixo. */
    min-height: calc(${VB_ALTURA} * var(--traco-unidade) + 16vh);
  }

  .respiro-traco__rosto {
    display: block;
  }
}

@keyframes respiro-traco-desenhar {
  from { stroke-dashoffset: var(--respiro-comprimento); }
  to   { stroke-dashoffset: 0; }
}

@supports (animation-timeline: view()) {
  @media (prefers-reduced-motion: no-preference) {
    .respiro-traco__linha {
      animation: respiro-traco-desenhar linear both;
      animation-timeline: --respiro-rosto;
      animation-range: cover 10% cover 65%;
    }
  }
}
`;

export function RespiroTraco() {
  return (
    <>
      {/* Fora da faixa de propósito: dentro, ela deixaria de ser uma faixa
          sem texto — inclusive para `tests/unit/home.spec.tsx`, que confere
          isso lendo o `textContent` da seção. */}
      <style dangerouslySetInnerHTML={{ __html: FOLHA }} />

      <Secao
        superficie="areia"
        as="div"
        espacamento="nenhum"
        className="respiro-traco"
      >
        <div
          className="respiro-traco__palco"
          data-traco="livre"
          aria-hidden="true"
        >
          <svg
            className="respiro-traco__rosto"
            viewBox={`${VB_X} ${VB_Y} ${VB_LARGURA} ${VB_ALTURA}`}
            preserveAspectRatio="xMidYMid meet"
            fill="none"
            focusable="false"
            aria-hidden="true"
          >
            <path className="respiro-traco__linha" d={ROSTO} />
          </svg>
        </div>
      </Secao>
    </>
  );
}
