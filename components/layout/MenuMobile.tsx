"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef } from "react";
import type { KeyboardEvent } from "react";

import type { ItemNav } from "@/content/tipos";
import { AVISOS_RODAPE, CTA_AGENDAR } from "@/content/nav";
import { Botao } from "@/components/ui/Botao";
import { Filete } from "@/components/ui/Filete";
import { Nota } from "@/components/ui/Nota";

/**
 * MenuMobile — o menu de tela cheia em vinho.
 *
 * É um diálogo modal de verdade, não uma gaveta que finge ser: `role="dialog"`,
 * `aria-modal`, foco preso enquanto aberto, Esc fecha, e o foco volta para o
 * botão que abriu. O briefing § 9 exige navegação completa por teclado, e um
 * menu de tela cheia que deixa o Tab escapar para o conteúdo atrás é
 * exatamente o caso em que a pessoa se perde sem saber por quê.
 *
 * Sem animação de entrada. O orçamento do § 5.7 tem três itens e este não é
 * um deles; além disso, o menu ocupa a tela inteira — não há de onde ele
 * "vir" que não seja arbitrário.
 *
 * O `<dialog>` nativo resolveria parte disso, mas não permite o fundo
 * `wine-700` cobrindo a viewport sem lutar contra o `::backdrop`, e o suporte
 * a `showModal` exigiria efeito extra para sincronizar com o estado do React.
 */

type Props = {
  readonly aberto: boolean;
  readonly aoFechar: () => void;
  readonly itens: readonly ItemNav[];
  /** Rota atual, para marcar `aria-current`. */
  readonly rotaAtual?: string;
};

const FOCAVEIS =
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function MenuMobile({ aberto, aoFechar, itens, rotaAtual }: Props) {
  const painel = useRef<HTMLDivElement>(null);
  const fechar = useRef<HTMLButtonElement>(null);

  const aoTeclar = useCallback(
    (evento: KeyboardEvent<HTMLDivElement>) => {
      if (evento.key === "Escape") {
        evento.stopPropagation();
        aoFechar();
        return;
      }

      if (evento.key !== "Tab" || !painel.current) return;

      const focaveis = Array.from(
        painel.current.querySelectorAll<HTMLElement>(FOCAVEIS),
      );
      const primeiro = focaveis[0];
      const ultimo = focaveis[focaveis.length - 1];
      if (!primeiro || !ultimo) return;

      // Ciclo fechado: do último volta ao primeiro e vice-versa.
      if (evento.shiftKey && document.activeElement === primeiro) {
        evento.preventDefault();
        ultimo.focus();
      } else if (!evento.shiftKey && document.activeElement === ultimo) {
        evento.preventDefault();
        primeiro.focus();
      }
    },
    [aoFechar],
  );

  useEffect(() => {
    if (!aberto) return;

    const anterior = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";
    fechar.current?.focus();

    return () => {
      document.body.style.overflow = overflow;
      // Foco de volta em quem abriu — sem isso o teclado recomeça no topo do
      // documento e a pessoa perde o lugar onde estava.
      anterior?.focus();
    };
  }, [aberto]);

  if (!aberto) return null;

  return (
    <div
      ref={painel}
      role="dialog"
      aria-modal="true"
      aria-label="Menu de navegação"
      data-superficie="vinho"
      onKeyDown={aoTeclar}
      className="bg-wine-700 fixed inset-0 z-50 flex flex-col overflow-y-auto lg:hidden"
    >
      <div className="flex items-center justify-between px-[var(--gutter)] py-5">
        <span className="font-display text-blush-200 text-[1.5rem] leading-none font-normal tracking-[-0.02em]">
          Lívia Sant&apos;Anna
        </span>

        <button
          ref={fechar}
          type="button"
          onClick={aoFechar}
          className="text-micro text-blush-200 font-mono tracking-[0.14em] uppercase"
        >
          Fechar
        </button>
      </div>

      <Filete />

      <nav aria-label="Navegação principal" className="px-[var(--gutter)] py-8">
        <ul className="flex list-none flex-col gap-1">
          {itens.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={aoFechar}
                aria-current={rotaAtual === item.href ? "page" : undefined}
                className="link-filete font-display text-h2 text-blush-200 inline-block py-2 font-normal"
              >
                {item.texto}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-auto flex flex-col gap-8 px-[var(--gutter)] pb-12">
        <Botao href={CTA_AGENDAR.href} onClick={aoFechar} className="w-full">
          {CTA_AGENDAR.texto}
        </Botao>

        <Nota>{AVISOS_RODAPE[0]}</Nota>
      </div>
    </div>
  );
}
