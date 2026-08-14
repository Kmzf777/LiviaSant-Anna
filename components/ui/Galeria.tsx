import Image from "next/image";
import type { JSX } from "react";

import { cn } from "./cn";

/**
 * Galeria — as fotos de ambiente hospitalar da § 3 da home.
 *
 * ## O que ela é, e o que ela deliberadamente não é
 *
 * Não é lightbox, não é carrossel, não é masonry com autoplay. O orçamento de
 * animação do site tem três itens (§ 5.7) e nenhum deles é uma galeria; o § 15
 * lista "ícones de linha coloridos em grade de 3 colunas" como anti-padrão e a
 * mesma objeção vale para nove fotos iguais em três colunas iguais. O que
 * sobra, e é o que o § 5.4 pede, é **composição**: larguras diferentes, eixos
 * diferentes, desníveis verticais, e o branco entre as peças fazendo trabalho.
 *
 * ## A geometria
 *
 * `rounded-filete` (2px) em todas as peças. **O arco é exclusivo do retrato da
 * médica** (§ 5.5) — uma foto de centro cirúrgico com máscara de arco roubaria
 * o motivo assinatura de quem ele identifica. Reto é interface; arco é ela.
 *
 * ## Sem zoom no hover
 *
 * O `zoom-suave` existe e é o item 3 do orçamento, mas o `RetratoArco` já fixou
 * a doutrina: foto que não leva a lugar nenhum não reage ao ponteiro. Estas não
 * são links — não abrem nada, não navegam — então não têm hover. Um zoom aqui
 * prometeria um clique que não existe.
 *
 * ## Sem `Reveal` por dentro
 *
 * O item 2 do orçamento é "reveal de entrada **por seção**". Quem envolve a
 * seção é a página; se a galeria também revelasse item a item, o mesmo bloco
 * faria dois fades encadeados. A composição é da galeria, a entrada é da seção.
 *
 * ## As legendas
 *
 * Nenhuma legenda afirma qual profissional na foto é a Dra. Lívia: **não é
 * possível determinar isso com segurança** em foto com máscara e touca, e
 * legendar errado num site médico é erro grave. `alt` e `legenda` descrevem a
 * cena, que é verdadeira de qualquer forma. Ver PLANO-HOME.md e a Resolução
 * CFM 2.336/2023.
 */

export type ItemGaleria = {
  readonly src: string;
  readonly alt: string;
  readonly largura: number;
  readonly altura: number;
  readonly legenda?: string;
};

type Slot = {
  /**
   * Posição no grid de 12 colunas, a partir de `lg`.
   *
   * Vai como `grid-column` inteiro (`col-[7/span_4]`) e não como o par
   * `col-start-7 col-span-4`: `col-span` emite a forma abreviada
   * `grid-column: span 4 / span 4`, que zera o `grid-column-start` se o
   * Tailwind ordenar as duas regras nessa direção. Uma declaração só não tem
   * como sair pela metade.
   */
  readonly grid: string;
  /**
   * Desnível vertical dentro da linha. É o que impede que duas peças na mesma
   * linha se alinhem pelo topo e a composição vire tabela.
   */
  readonly desnivel: string;
  /** `true` ocupa a largura inteira no celular; o resto vai a meia largura. */
  readonly larguraTotalNoCelular: boolean;
  /**
   * Obrigatório e medido por posição. Sem isso o Next serve a maior variante
   * para qualquer viewport — a 1440px a peça mais larga pede 36vw, a mais
   * estreita 21vw, e a diferença entre servir 1920 e servir 640 no celular é
   * o LCP inteiro.
   */
  readonly sizes: string;
};

/**
 * O ritmo da composição, em ciclo de cinco.
 *
 * As posições são escolhidas para que o auto-placement do grid resolva em três
 * linhas sem nenhuma `grid-row` explícita — 5+4, 3+5, 4 — e para que nenhuma
 * linha tenha duas peças da mesma largura. O ciclo se repete se um dia entrar
 * uma sexta foto; o que não acontece é a grade regular voltar.
 */
const PADRAO: Slot = {
  grid: "lg:col-[1/span_5]",
  desnivel: "",
  larguraTotalNoCelular: true,
  sizes: "(min-width: 1024px) 38vw, 100vw",
};

const SLOTS = [
  PADRAO,
  {
    grid: "lg:col-[7/span_4]",
    desnivel: "lg:mt-28",
    larguraTotalNoCelular: false,
    sizes: "(min-width: 1024px) 30vw, 48vw",
  },
  {
    grid: "lg:col-[2/span_3]",
    desnivel: "",
    larguraTotalNoCelular: false,
    sizes: "(min-width: 1024px) 23vw, 48vw",
  },
  {
    grid: "lg:col-[6/span_5]",
    desnivel: "lg:mt-16",
    larguraTotalNoCelular: false,
    sizes: "(min-width: 1024px) 38vw, 48vw",
  },
  {
    grid: "lg:col-[3/span_4]",
    desnivel: "",
    larguraTotalNoCelular: false,
    sizes: "(min-width: 1024px) 30vw, 48vw",
  },
] as const satisfies readonly Slot[];

function slotDe(indice: number): Slot {
  return SLOTS[indice % SLOTS.length] ?? PADRAO;
}

export function Galeria({
  itens,
}: {
  readonly itens: readonly ItemGaleria[];
}): JSX.Element {
  return (
    /*
      Duas colunas no celular, doze a partir de `lg`.

      No celular a conta é de altura: cinco retratos 3/4 em largura total dariam
      mais de três telas de rolagem seguidas, e ninguém rola uma parede de fotos
      até o fim. Uma peça de abertura em largura total e o resto em pares resolve
      as mesmas cinco fotos em pouco mais de uma tela.
    */
    <ul className="grid list-none grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-12 lg:gap-x-8 lg:gap-y-16">
      {itens.map((item, indice) => {
        const slot = slotDe(indice);

        return (
          <li
            key={item.src}
            className={cn(
              // `self-start` para o desnível existir: sem ele o item estica
              // até a altura da linha e a margem some dentro do esticamento.
              "self-start",
              slot.larguraTotalNoCelular ? "col-span-2" : "col-span-1",
              slot.grid,
              slot.desnivel,
            )}
          >
            <figure className="flex flex-col gap-3">
              {/*
                A proporção vem do arquivo, não de uma escolha de layout: a
                caixa reserva a altura exata antes de a imagem chegar (CLS) e
                nenhuma foto é recortada por decisão de grade. Se um dia entrar
                uma foto deitada, ela entra deitada.

                O fundo `sand-200` é o que aparece durante o carregamento. Não
                há `placeholder="blur"` de propósito: o borrão do RetratoArco é
                `sand-300` porque é o fundo real das fotos DELA, e um borrão
                quente antes de uma foto de centro cirúrgico — verde e branca —
                daria um flash de cor errada. Superfície lisa é mais honesta.
              */}
              <div
                style={{ aspectRatio: `${item.largura} / ${item.altura}` }}
                className="rounded-filete bg-sand-200 relative w-full overflow-hidden"
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  width={item.largura}
                  height={item.altura}
                  sizes={slot.sizes}
                  className="h-full w-full object-cover"
                />
              </div>

              {item.legenda === undefined ? null : (
                <figcaption className="text-micro text-ink-400 [[data-superficie=vinho]_&]:text-wine-300 max-w-[38ch] font-mono tracking-[0.08em]">
                  {item.legenda}
                </figcaption>
              )}
            </figure>
          </li>
        );
      })}
    </ul>
  );
}
