import Image from "next/image";

import type { ImagemOuPendente } from "@/content/tipos";
import { cn } from "./cn";
import { PlaceholderImagem } from "./PlaceholderImagem";

/**
 * RetratoArco — o motivo assinatura de toda foto dela.
 *
 * Máscara de arco no topo (`--radius-arco`, `50vw 50vw 0 0`). O logo é um selo
 * circular de traço curvo, então a linguagem geométrica do site é o arco — e só
 * ele. Interface é reta (2px); retrato é arco. Não se mistura (§ 5.5).
 *
 * Aceita `ImagemOuPendente` em vez de `Imagem`, e cai no PlaceholderImagem com
 * a mesma proporção quando a foto ainda não existe. É o que impede uma página
 * de quebrar de layout enquanto os arquivos originais não chegam, sem que
 * ninguém precise lembrar de tratar o caso na página.
 *
 * O zoom de 1.02 no hover é a terceira e última animação do orçamento (§ 5.7),
 * e só acontece quando há link em volta — foto que não leva a lugar nenhum não
 * reage ao ponteiro.
 */

type Props = {
  readonly imagem: ImagemOuPendente;
  /**
   * Obrigatório. Sem `sizes` correto o Next serve a maior variante para
   * qualquer viewport e o LCP no mobile some — a meta é < 2.0s em 4G lento.
   */
  readonly sizes: string;
  /** `true` só no retrato do hero. Em qualquer outro lugar atrapalha o LCP. */
  readonly prioridade?: boolean;
  /** Proporção do slot. O placeholder usa a mesma, para o layout não pular. */
  readonly aspecto?: string;
  readonly interativo?: boolean;
  readonly className?: string;
};

/**
 * Placeholder de desfoque.
 *
 * SVG em `sand-300` — a cor real do fundo das fotos dela, amostrada. Um blur
 * genérico cinza daria um flash frio antes da imagem carregar, e a paleta é
 * quente do primeiro frame ao último.
 */
const BORRAO =
  "data:image/svg+xml;charset=utf-8," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="4" height="5">' +
      '<rect width="4" height="5" fill="rgb(197,183,174)"/></svg>',
  );

export function RetratoArco({
  imagem,
  sizes,
  prioridade = false,
  aspecto = "3/4",
  interativo = false,
  className,
}: Props) {
  if (imagem.tipo === "pendente") {
    return (
      <PlaceholderImagem
        descricao={imagem.descricao}
        aspecto={aspecto}
        arco
        className={className}
      />
    );
  }

  const { src, alt, largura, altura } = imagem.imagem;

  return (
    <div
      style={{ aspectRatio: aspecto }}
      className={cn(
        // A máscara vive no contêiner, com overflow escondido: é o que permite
        // a imagem escalar por dentro sem estourar o arco.
        "rounded-arco bg-sand-300 relative w-full overflow-hidden",
        className,
      )}
    >
      <Image
        src={src}
        alt={alt}
        width={largura}
        height={altura}
        sizes={sizes}
        priority={prioridade}
        placeholder="blur"
        blurDataURL={BORRAO}
        className={cn("h-full w-full object-cover", interativo && "zoom-suave")}
      />
    </div>
  );
}
