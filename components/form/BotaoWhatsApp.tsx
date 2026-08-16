import Link from "next/link";

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
 *
 * ## Por que este, ao contrário do inline, NÃO some sem o número
 *
 * O `BotaoWhatsApp` inline pode desaparecer sem custo: ele mora no meio de uma
 * seção que já tem um botão de agendar ao lado. Este é o único CTA visível em
 * boa parte da rolagem no celular, e sumir significa a pessoa chegar ao fim da
 * página sem nenhuma ação à mão — que é exatamente a reclamação que originou
 * esta barra ("CTAs escondidos e fracos", 15/08/2026).
 *
 * Então ele degrada em vez de sumir: com número confirmado abre a conversa;
 * sem número, leva ao formulário de `/contato`. A promessa do rótulo muda
 * junto — não diz "WhatsApp" quando não vai abrir o WhatsApp, porque um botão
 * que mente gasta mais confiança do que um botão que não existe.
 *
 * Quando o número entrar em `content/consultorio.ts`, os dois modos trocam
 * sozinhos, sem tocar em componente nenhum.
 */
export function BotaoWhatsAppFixo({ procedimento, children }: Props) {
  const href = usarLink(procedimento);

  const classes = cn(
    BASE,
    "border-wine-800 bg-wine-700 text-sand-50 border px-6 py-4",
    "hover:bg-wine-800",
    // Barra de largura inteira, e não um adesivo no canto: no celular o alvo
    // que converte é o que não exige mira. `pb` com a área segura do iOS para
    // não ficar sob a barra de gestos.
    "fixed inset-x-0 bottom-0 z-40 rounded-none lg:hidden",
    "pb-[calc(1rem+env(safe-area-inset-bottom))] pt-4",
  );

  if (!href) {
    return (
      <Link href="/contato" className={classes}>
        {children ?? "Agendar consulta"}
      </Link>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={classes}
    >
      {children ?? "Agendar pelo WhatsApp"}
      <span className="sr-only"> (abre o WhatsApp em outra aba)</span>
    </a>
  );
}
