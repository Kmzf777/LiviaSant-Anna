import Image from "next/image";
import type { JSX } from "react";

/**
 * Galeria — as fotos de ambiente hospitalar da § 3 da home.
 *
 * ## O que ela é, e o que ela deliberadamente não é
 *
 * Não é lightbox, não é carrossel, não é masonry com autoplay. O orçamento de
 * animação do site tem três itens (§ 5.7) e nenhum deles é uma galeria.
 *
 * Foi um mosaico escalonado até 15/08/2026, quando o cliente o leu como
 * bagunça. Hoje é uma grade de duas colunas alinhadas — o porquê da troca está
 * no comentário do `<ul>`, e vale a pena ler antes de reverter.
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

/**
 * `sizes` único, porque agora toda peça tem a mesma largura.
 *
 * A galeria ocupa metade da grade (6 de 12 colunas) na § 3 e se divide em duas
 * — cada foto pede ~23vw a partir de `lg` e ~46vw no celular, onde as duas
 * dividem a largura do container. Sem isto o Next serve a maior variante para
 * qualquer viewport, e a diferença entre entregar 1920 e entregar 640 num
 * celular é o LCP inteiro.
 */
const SIZES = "(min-width: 1024px) 23vw, 46vw";

export function Galeria({
  itens,
}: {
  readonly itens: readonly ItemGaleria[];
}): JSX.Element {
  return (
    /*
      Grade regular: duas colunas, mesma largura, mesmo topo.

      ## O mosaico que estava aqui antes

      As peças tinham larguras diferentes (`col-[1/span_5]`, `col-[7/span_4]`,
      `col-[2/span_3]`…) e desníveis verticais (`lg:mt-28`, `lg:mt-16`), num
      ciclo de cinco slots. Era a leitura literal do § 5.4 — composição em vez
      de grade — e um comentário neste arquivo chegava a dizer que "o que não
      acontece é a grade regular voltar".

      Ela voltou, e por uma razão que vence o argumento tipográfico: o dono do
      site olhou a página e disse *"deixou as fotos tudo bagunçadas"*. Ele não
      estava vendo composição, estava vendo desalinhamento — e num site médico
      desalinhamento não lê como sofisticação, lê como descuido. Numa página
      cuja função é fazer alguém confiar o suficiente para agendar, essa
      leitura custa caro.

      O § 15 proíbe "ícones de linha coloridos em grade de 3 colunas", que é
      outra coisa: aquilo é ornamento genérico. Duas fotografias reais de
      centro cirúrgico, alinhadas, não são o anti-padrão que a regra descreve.

      `items-start` mantém as legendas de alturas diferentes sem esticar as
      figuras, e `grid-cols-2` vale desde o celular — as fotos são retratos 3/4
      e duas em largura total dariam duas telas de rolagem.
    */
    <ul className="grid list-none grid-cols-2 items-start gap-x-4 gap-y-8 sm:gap-x-6 lg:gap-x-8">
      {itens.map((item) => {
        return (
          <li key={item.src}>
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
                  sizes={SIZES}
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
