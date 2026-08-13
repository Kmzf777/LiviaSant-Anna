import type { ReactNode } from "react";

import { cn } from "@/components/ui/cn";

/**
 * RailLateral — a coluna estreita da esquerda.
 *
 * Cerca de 80px (`--rail`), com o eyebrow em mono girado por
 * `writing-mode: vertical-rl`. Some abaixo de 1024px, onde não sobra largura
 * para uma coluna que não carrega conteúdo (§ 5.4).
 *
 * É o que impede a página de virar uma pilha de blocos centralizados. O § 15
 * lista "tudo centralizado" como motivo de refazer, e a assimetria precisa de
 * um eixo — o rail é esse eixo, visível e constante.
 *
 * Vai `aria-hidden` por padrão: em quase todo uso ele repete o eyebrow que já
 * está na seção, e um leitor de tela ouvindo o mesmo rótulo duas vezes por
 * seção é ruído. Quando o rail carregar um texto que não existe em nenhum
 * outro lugar, passe `decorativo={false}`.
 *
 * Posiciona-se em relação à Secao, que já nasce `relative`. O `left` acompanha
 * a margem do Container: enquanto o container não bate no `max-width`, o rail
 * fica na goteira; depois disso, fica alinhado à borda do container. Sem isso
 * ele descolaria do texto em telas acima de 1440px.
 *
 * Use junto de `<Container comRail>`, que reserva a largura correspondente.
 */

type Props = {
  readonly children: ReactNode;
  readonly decorativo?: boolean;
  readonly className?: string;
};

export function RailLateral({ children, decorativo = true, className }: Props) {
  return (
    <div
      aria-hidden={decorativo || undefined}
      className={cn(
        "pointer-events-none absolute top-[var(--secao-y)]",
        "left-[max(var(--gutter),calc((100%_-_var(--container))/2))]",
        "hidden w-[var(--rail)] justify-start lg:flex",
        className,
      )}
    >
      <p
        className={cn(
          "text-micro text-ink-400 font-mono tracking-[0.14em] uppercase",
          "[[data-superficie=vinho]_&]:text-wine-300",
          // vertical-rl + 180° faz o texto correr de baixo para cima, que é
          // como se lê a lombada de um livro em português.
          "[transform:rotate(180deg)] [writing-mode:vertical-rl]",
        )}
      >
        {children}
      </p>
    </div>
  );
}
