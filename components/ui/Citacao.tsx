import type { ReactNode } from "react";

import { cn } from "./cn";

/**
 * Citacao — display grande, aspas tipográficas, atribuição em mono.
 *
 * As aspas são as curvas de verdade (U+201C e U+201D), não a aspa reta de
 * máquina de escrever. Numa Didone isso não é preciosismo: a aspa reta é um
 * retângulo, e ao lado do contraste hairline da Bodoni ela denuncia texto não
 * tratado. Vão `aria-hidden` porque o leitor de tela já anuncia `blockquote`.
 *
 * A aspa de abertura fica pendurada na margem (`-ml-[0.5ch]`), para a primeira
 * letra alinhar com o resto da coluna. É o alinhamento óptico que todo livro
 * bem composto faz e quase nenhum site faz.
 *
 * Atribuição em mono porque atribuição é fato, não persuasão (§ 5.3).
 */

type Props = {
  readonly children: ReactNode;
  /** Quem disse. Ausente quando a citação é da própria médica no contexto. */
  readonly atribuicao?: string;
  readonly tamanho?: "h1" | "h2";
  readonly className?: string;
};

export function Citacao({
  children,
  atribuicao,
  tamanho = "h2",
  className,
}: Props) {
  return (
    <figure className={cn("flex flex-col gap-8", className)}>
      <blockquote
        className={cn(
          "font-display max-w-[22ch] font-normal text-pretty",
          tamanho === "h1" ? "text-h1" : "text-h2",
        )}
      >
        <span aria-hidden="true" className="-ml-[0.5ch]">
          {"“"}
        </span>
        {children}
        <span aria-hidden="true">{"”"}</span>
      </blockquote>

      {atribuicao !== undefined ? (
        <figcaption className="text-micro text-ink-400 [[data-superficie=vinho]_&]:text-wine-300 font-mono tracking-[0.14em] uppercase">
          {atribuicao}
        </figcaption>
      ) : null}
    </figure>
  );
}
