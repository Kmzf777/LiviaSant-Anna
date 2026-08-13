import { Nota } from "@/components/ui/Nota";

/**
 * Pendências, visíveis.
 *
 * Metade do conteúdo do consultório e vários parágrafos das páginas legais são
 * `[CONFIRMAR: …]` em `/content`. Existem três formas de lidar com isso, e duas
 * são ruins:
 *
 *   - **Inventar.** Endereço plausível, horário plausível, prazo de retenção
 *     plausível. Num site médico isso é o pior desfecho possível: um endereço
 *     errado manda alguém para o lugar errado, e um prazo de retenção inventado
 *     é uma declaração falsa de tratamento de dados, que é exatamente o que a
 *     LGPD pune.
 *   - **Esconder.** A página fica bonita e ninguém percebe que falta coisa.
 *     Pendência que não incomoda ninguém não é resolvida, e o buraco vai para
 *     produção.
 *   - **Mostrar que falta.** É o que estes componentes fazem.
 *
 * O `[CONFIRMAR: …]` cru também não vai para a tela: o colchete é anotação de
 * quem escreve, não texto de quem lê. O que aparece é uma marca em mono, com o
 * que falta dito em português.
 */

const PADRAO = /^\s*\[\s*CONFIRMAR\s*:?\s*([\s\S]*?)\]\s*$/i;

/** `true` quando o valor é um marcador de pendência, não conteúdo. */
export function estaPendente(valor: string | undefined | null): boolean {
  return typeof valor === "string" && PADRAO.test(valor);
}

/** O que falta, sem os colchetes. Devolve `null` para valor já confirmado. */
export function descricaoPendente(valor: string): string | null {
  const encontrado = PADRAO.exec(valor);
  const dentro = encontrado?.[1]?.trim();
  return dentro ? dentro : null;
}

/** O valor, ou `null` quando ele ainda é um marcador. Para montar strings. */
export function valorConfirmado(valor: string): string | null {
  return estaPendente(valor) ? null : valor;
}

/**
 * Marca curta, para o lugar do valor dentro de uma lista de dados.
 *
 * Fica em mono como todo fato do site — inclusive o fato de que este ainda não
 * é um fato.
 */
export function MarcaPendente({ children }: { readonly children?: string }) {
  return (
    <span className="text-micro text-wine-700 [[data-superficie=vinho]_&]:text-blush-200 font-mono tracking-[0.12em] uppercase">
      {children ?? "Em confirmação"}
    </span>
  );
}

/**
 * Bloco para um parágrafo inteiro que ainda é pendência — o caso das páginas
 * legais, onde o texto pendente está no meio do texto final.
 */
export function ParagrafoPendente({ children }: { readonly children: string }) {
  // O texto vem da anotação entre colchetes, que começa em minúscula
  // ("prazo de retenção adotado…"). Numa página lida como documento, uma
  // frase que começa em caixa baixa parece defeito de renderização.
  const texto = children.charAt(0).toUpperCase() + children.slice(1);

  return (
    <Nota tom="atencao" as="div">
      <span className="block">Pendente de confirmação</span>
      <span className="mt-2 block">{texto}</span>
    </Nota>
  );
}
