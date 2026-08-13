import type { ReactNode } from "react";

import { cn } from "./cn";

/**
 * Container — a medida horizontal do site.
 *
 * `max-width: var(--container)` (1440px) e `padding-inline: var(--gutter)`,
 * que é fluido de 1.25rem a 5rem. Nenhuma seção define margem própria: se o
 * site precisar respirar mais, muda-se o token, não trinta arquivos.
 *
 * `comRail` abre espaço para o RailLateral a partir de `lg`. O rail é
 * posicionado em relação à seção, não ao container, justamente para que o
 * texto continue alinhado ao mesmo eixo com e sem ele.
 *
 * ## Por que `relative z-[2]`
 *
 * O Traço mora entre o fundo da seção e o texto dela. São três camadas, e a
 * ordem só funciona com as três declaradas:
 *
 *   Secao      position: relative, z-index auto  → pinta o fundo
 *   Traco      position: fixed,    z-index 1     → desenha sobre o fundo
 *   Container  position: relative, z-index 2     → o texto, sempre por cima
 *
 * `Secao` deliberadamente NÃO leva z-index: com um valor positivo ela criaria
 * stacking context própria e o fundo opaco esconderia o Traço inteiro. Com
 * `auto`, ela pinta antes de qualquer z-index positivo, e o Traço passa a
 * aparecer sobre a superfície sem nunca cruzar a leitura.
 *
 * O briefing § 5.8 é explícito: "Nunca cruza texto. Nunca compete com a
 * leitura." Esta é a linha que garante isso.
 */

type Props = {
  readonly children: ReactNode;
  readonly as?: "div" | "section" | "header" | "footer" | "nav";
  readonly comRail?: boolean;
  readonly className?: string;
  readonly id?: string;
};

export function Container({
  children,
  as = "div",
  comRail = false,
  className,
  id,
}: Props) {
  const Tag = as;

  return (
    <Tag
      id={id}
      className={cn(
        "relative z-[2] mx-auto w-full max-w-[var(--container)] px-[var(--gutter)]",
        comRail && "lg:pl-[calc(var(--gutter)+var(--rail))]",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
