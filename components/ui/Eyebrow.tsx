import type { ReactNode } from "react";

import { cn } from "./cn";

/**
 * Eyebrow — a etiqueta em mono que abre cada seção.
 *
 * Mono, caixa alta, `letter-spacing: 0.14em` (briefing § 5.3). É o degrau mais
 * baixo da hierarquia e o mais reconhecível: o leitor aprende, sem que ninguém
 * explique, que mono significa fato e não persuasão.
 *
 * A cor troca por superfície. `ink-400` sobre areia mede 5.19:1; sobre vinho
 * ele desapareceria, então a variante de ancestral leva para `wine-300`, que
 * mede 4.58:1 sobre `wine-700`. Ambos os pares estão em
 * `scripts/verificar-contraste.ts`.
 */

type Props = {
  readonly children: ReactNode;
  /** `span` quando o eyebrow vive dentro de outro parágrafo ou de um card. */
  readonly as?: "p" | "span" | "div";
  readonly className?: string;
  readonly id?: string;
};

/** Exportado para o RailLateral, que repete o mesmo tratamento na vertical. */
export const CLASSES_EYEBROW =
  "font-mono text-micro font-normal uppercase tracking-[0.14em] text-ink-400 " +
  "[[data-superficie=vinho]_&]:text-wine-300";

export function Eyebrow({ children, as = "p", className, id }: Props) {
  const Tag = as;

  return (
    <Tag id={id} className={cn(CLASSES_EYEBROW, className)}>
      {children}
    </Tag>
  );
}
