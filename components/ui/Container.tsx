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
 * ## O corredor do Traço
 *
 * O padding direito é `--gutter + --traco-corredor` em todas as larguras.
 * Aquele naco a mais não é margem sobrando: é a faixa em que a fita do Traço
 * vive, e é o que faz o briefing § 5.8 — *"nunca cruza texto"* — valer por
 * construção, sem que nenhuma página precise saber que a assinatura existe.
 *
 * Foi assim que o defeito nasceu, aliás: antes, cada página estreitava a
 * própria coluna à mão para desviar da fita. Resolvia um trecho de desktop e
 * nada do celular, onde não há coluna a estreitar. Medido em três larguras,
 * 85% dos blocos de texto a 390px eram atravessados pela linha. A reserva
 * mora aqui, num arquivo só, porque o problema nunca foi de página.
 *
 * A assimetria é deliberada e é a composição do site: o texto tem um eixo à
 * esquerda e uma pista à direita, onde uma linha de 1px sobe a página inteira.
 * Quem quiser mexer, mexa em `--traco-telas` (`styles/theme.css`) — corredor,
 * fita e rosto do respiro se movem juntos.
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
        "relative z-[2] mx-auto w-full max-w-[var(--container)] ps-[var(--gutter)] pe-[calc(var(--gutter)+var(--traco-corredor))]",
        comRail && "lg:ps-[calc(var(--gutter)+var(--rail))]",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
