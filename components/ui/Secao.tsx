import type { ReactNode } from "react";

import type { Superficie } from "@/content/tipos";
import { cn } from "./cn";

/**
 * Secao — o retângulo de superfície.
 *
 * Emite `data-superficie`, e esse atributo faz três coisas ao mesmo tempo:
 *
 *   1. pinta o fundo e o texto (regras em `app/globals.css`);
 *   2. troca a cor do foco para blush sobre vinho, para o anel não sumir;
 *   3. **é medido pelo Traço**, que lê os retângulos das seções para decidir
 *      a cor de cada segmento do path (spec § 4.4).
 *
 * O item 3 é o motivo de o atributo ser obrigatório e de nenhuma seção
 * full-bleed poder pintar o fundo por classe solta. Uma seção vinho sem
 * `data-superficie="vinho"` faz o Traço desenhar em vinho sobre vinho e a
 * assinatura do site simplesmente desaparece naquele trecho.
 *
 * `relative` vem de fábrica porque o RailLateral se posiciona em relação à
 * seção.
 */

type Props = {
  readonly children: ReactNode;
  readonly superficie: Superficie;
  /**
   * `section` por padrão. Vira `div` quando a seção já está dentro de um
   * `<section>` com rótulo próprio — evita landmark aninhado sem nome.
   */
  readonly as?: "section" | "div" | "article" | "aside";
  /**
   * Espaçamento vertical. `normal` aplica `--secao-y`
   * (clamp(5rem, 12vh, 11rem)); `compacto` usa metade, para faixas como a de
   * identificação do § 8.2; `nenhum` deixa a seção controlar o próprio ritmo,
   * caso do hero de 90vh.
   */
  readonly espacamento?: "normal" | "compacto" | "nenhum";
  readonly id?: string;
  readonly className?: string;
  readonly "aria-label"?: string;
  readonly "aria-labelledby"?: string;
};

const ESPACAMENTO: Record<
  NonNullable<Props["espacamento"]>,
  string | undefined
> = {
  normal: "py-[var(--secao-y)]",
  compacto: "py-[calc(var(--secao-y)/2.5)]",
  nenhum: undefined,
};

export function Secao({
  children,
  superficie,
  as = "section",
  espacamento = "normal",
  id,
  className,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
}: Props) {
  const Tag = as;

  return (
    <Tag
      id={id}
      data-superficie={superficie}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      className={cn("relative", ESPACAMENTO[espacamento], className)}
    >
      {children}
    </Tag>
  );
}
