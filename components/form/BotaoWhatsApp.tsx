import { getConsultorio } from "@/content";
import { linkWhatsapp } from "@/lib/whatsapp";
import { cn } from "@/components/ui/cn";

/**
 * BotaoWhatsApp — a conversa direta, com a mensagem já escrita.
 *
 * ---------------------------------------------------------------------------
 * ELE PODE NÃO EXISTIR, E ISSO É O COMPORTAMENTO CORRETO
 * ---------------------------------------------------------------------------
 *
 * `linkWhatsapp` devolve `null` quando o número não passa na validação de DDI,
 * DDD e dígitos. Hoje o número em `content/consultorio.ts` é um `[CONFIRMAR]`,
 * então ele devolve `null` e **estes componentes não renderizam nada**.
 *
 * Não é um bug a corrigir: é a decisão. Um botão que abre uma conversa com um
 * número inválido gasta a confiança de quem clicou e some com o contato — pior
 * do que a ausência do botão, que ao menos empurra para o formulário. Quando o
 * número for confirmado (ver PENDENCIAS.md), os botões aparecem sozinhos, em
 * todas as páginas, sem tocar em componente nenhum.
 *
 * ---------------------------------------------------------------------------
 * FLUTUANTE NO MOBILE, INLINE NO DESKTOP
 * ---------------------------------------------------------------------------
 *
 * São dois componentes porque são dois papéis. `BotaoWhatsApp` é uma ação
 * dentro do texto, onde o assunto acabou de ser explicado. `BotaoWhatsAppFixo`
 * é o atalho persistente do celular, e some a partir de `lg` — no desktop ele
 * seria um adesivo cobrindo o canto de uma página que já tem a ação no fluxo.
 *
 * A mensagem muda por contexto: quem sai da página de timpanoplastia não
 * deveria ter que digitar "queria falar sobre timpanoplastia".
 */

type Props = {
  /** Nome do procedimento ou do assunto. Entra na mensagem pré-preenchida. */
  readonly procedimento?: string;
  readonly children?: string;
  readonly className?: string;
};

const BASE =
  "inline-flex items-center justify-center rounded-filete font-body " +
  "text-small font-medium leading-none no-underline " +
  "transition-colors duration-fast ease-out";

/**
 * Mesmo desenho do `Botao variante="filete"`, mas com borda inteira: o link
 * sai do site, e a borda fechada é o que diferencia "abre outro aplicativo" de
 * "continua aqui" sem precisar de um ícone.
 */
const INLINE =
  "border-wine-700 text-wine-700 hover:bg-wine-700 hover:text-sand-50 " +
  "[[data-superficie=vinho]_&]:border-blush-200 " +
  "[[data-superficie=vinho]_&]:text-blush-200 " +
  "[[data-superficie=vinho]_&]:hover:bg-blush-200 " +
  "[[data-superficie=vinho]_&]:hover:text-wine-900 " +
  "border px-7 py-4";

function usarLink(procedimento: string | undefined): string | null {
  return linkWhatsapp(getConsultorio().whatsapp, { procedimento });
}

export function BotaoWhatsApp({ procedimento, children, className }: Props) {
  const href = usarLink(procedimento);
  if (!href) return null;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(BASE, INLINE, className)}
    >
      {children ?? "Falar pelo WhatsApp"}
      <span className="sr-only"> (abre o WhatsApp em outra aba)</span>
    </a>
  );
}

/**
 * Atalho persistente do celular. Retangular, como todo elemento de interface
 * do site — a pílula flutuante é justamente o clichê que o § 5.5 recusa.
 */
export function BotaoWhatsAppFixo({ procedimento, children }: Props) {
  const href = usarLink(procedimento);
  if (!href) return null;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        BASE,
        "border-wine-800 bg-wine-700 text-sand-50 border px-6 py-4",
        "hover:bg-wine-800",
        "fixed right-4 bottom-4 z-40 lg:hidden",
        "mb-[env(safe-area-inset-bottom)]",
      )}
    >
      {children ?? "WhatsApp"}
      <span className="sr-only"> (abre o WhatsApp em outra aba)</span>
    </a>
  );
}
