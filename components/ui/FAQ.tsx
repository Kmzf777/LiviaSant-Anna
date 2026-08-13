import type { PerguntaResposta } from "@/content/tipos";
import { cn } from "./cn";

/**
 * FAQ — `<details>` e `<summary>` nativos, estilizados.
 *
 * Sem estado em React, sem `aria-expanded` escrito à mão, sem gerenciamento de
 * foco: o elemento nativo já é acessível por teclado (Enter e Espaço), já
 * anuncia expandido/recolhido, já funciona sem JavaScript e já é encontrado
 * pelo Ctrl+F do navegador — o que importa numa página onde a pessoa procura
 * uma dúvida específica sobre a própria cirurgia.
 *
 * O indicador é um mais que vira menos por troca de visibilidade da barra
 * vertical, **sem transição**. O orçamento de animação do § 5.7 tem três itens
 * e nenhum deles é chevron girando; um a mais aqui seria o começo do excesso
 * que faz um site parecer gerado por IA.
 *
 * O JSON-LD de `FAQPage` não é gerado aqui: é responsabilidade da página, que
 * conhece a URL e o restante do grafo (§ 10).
 */

type Props = {
  readonly itens: readonly PerguntaResposta[];
  /** Prefixo dos ids, quando há mais de uma FAQ na mesma página. */
  readonly idBase?: string;
  /** Abre o primeiro item. Útil quando a FAQ é a única coisa na dobra. */
  readonly primeiroAberto?: boolean;
  readonly className?: string;
};

export function FAQ({
  itens,
  idBase = "faq",
  primeiroAberto = false,
  className,
}: Props) {
  if (itens.length === 0) {
    return null;
  }

  return (
    <div className={cn("flex w-full flex-col", className)}>
      {itens.map((item, indice) => (
        <details
          key={item.pergunta}
          id={`${idBase}-${indice + 1}`}
          open={primeiroAberto && indice === 0}
          className="filete group border-b first:border-t"
        >
          <summary
            className={cn(
              "flex cursor-pointer list-none items-start justify-between gap-6",
              "text-h3 py-6 font-medium",
              // O marcador nativo é retirado nos dois motores; o indicador
              // desenhado abaixo o substitui com a geometria do site.
              "[&::-webkit-details-marker]:hidden [&::marker]:content-none",
              "hover:text-wine-700 [[data-superficie=vinho]_&]:hover:text-blush-200",
            )}
          >
            <span className="max-w-[52ch]">{item.pergunta}</span>

            {/* Mais/menos em filete de 1px: a barra vertical some quando abre. */}
            <span
              aria-hidden="true"
              className="relative mt-3 block h-3 w-3 shrink-0"
            >
              <span className="filete absolute top-1/2 left-0 w-3 border-t" />
              <span className="filete absolute top-0 left-1/2 h-3 border-l group-open:hidden" />
            </span>
          </summary>

          <div className="pr-10 pb-8">
            <p className="text-body text-ink-600 [[data-superficie=vinho]_&]:text-sand-50 max-w-[62ch]">
              {item.resposta}
            </p>
          </div>
        </details>
      ))}
    </div>
  );
}
