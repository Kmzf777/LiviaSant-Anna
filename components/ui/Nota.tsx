import type { ReactNode } from "react";

import { cn } from "./cn";

/**
 * Nota — o disclaimer em mono.
 *
 * O § 8.5 fecha com "RESULTADOS VARIAM CONFORME ANATOMIA…" e o § 8.7 com
 * "TODA CIRURGIA ENVOLVE RISCOS…". Os dois são o mesmo objeto tipográfico:
 * fato verificável, em mono, sem eufemismo e sem letra miúda escondida.
 *
 * Este componente é a razão de a mono existir no design system. A Resolução
 * CFM 2.336/2023 exige contexto e ressalva junto da informação; a decisão de
 * projeto foi dar a esse conteúdo uma voz própria em vez de espremê-lo num
 * rodapé. Aviso legível é aviso cumprido.
 *
 * `tom="atencao"` acrescenta um filete vinho à esquerda — é o estado de
 * destaque e também o de erro. Não há cor nova: a paleta não tem vermelho de
 * erro, e introduzir um quebraria a regra do § 5.2 de que destaque vem de
 * contraste de superfície.
 */

type Props = {
  readonly children: ReactNode;
  readonly tom?: "neutro" | "atencao";
  readonly as?: "p" | "div";
  readonly className?: string;
  readonly id?: string;
  /** `polite` quando a nota aparece em resposta a uma ação do usuário. */
  readonly live?: "polite" | "assertive";
};

const TOM: Record<NonNullable<Props["tom"]>, string> = {
  neutro: "text-ink-600 [[data-superficie=vinho]_&]:text-wine-300",
  atencao:
    "border-l-2 border-wine-700 pl-4 text-wine-700 " +
    "[[data-superficie=vinho]_&]:border-blush-200 " +
    "[[data-superficie=vinho]_&]:text-blush-200",
};

export function Nota({
  children,
  tom = "neutro",
  as = "p",
  className,
  id,
  live,
}: Props) {
  const Tag = as;

  return (
    <Tag
      id={id}
      aria-live={live}
      className={cn(
        "text-micro max-w-[52ch] font-mono leading-relaxed tracking-[0.06em]",
        TOM[tom],
        className,
      )}
    >
      {children}
    </Tag>
  );
}
