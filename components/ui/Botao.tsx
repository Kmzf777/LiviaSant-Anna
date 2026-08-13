import Link from "next/link";
import type { ButtonHTMLAttributes, CSSProperties, ReactNode } from "react";

import { cn } from "./cn";

/**
 * Botao — a única forma de ação do site.
 *
 * Duas variantes, e o briefing (§ 5.5) fecha a geometria: retangular,
 * `--radius-filete` de 2px. Sem pílula em lugar nenhum. O arco é exclusivo de
 * retrato; misturar as duas linguagens dissolveria o motivo assinatura.
 *
 * ## O hover
 *
 * O preenchimento escorre e sobra o filete: o botão sólido perde o fundo e
 * fica só com a borda de 1px e o texto na cor da borda. É o mesmo gesto do
 * logo — uma linha que basta — e tem uma vantagem prática: não introduz
 * nenhuma cor nova. Os quatro pares envolvidos já estão medidos em
 * `scripts/verificar-contraste.ts`.
 *
 * ## Superfície
 *
 * As variantes de ancestral (`[[data-superficie=vinho]_&]`) fazem o botão se
 * adaptar sozinho ao bloco em que caiu. Não existe prop de cor, de propósito:
 * a superfície é decidida pela Secao, e um botão que aceitasse a cor por prop
 * permitiria blush sobre areia, que reprova AA.
 */

type Variante = "solido" | "filete";
type Tamanho = "base" | "compacto";

type PropsComuns = {
  readonly children: ReactNode;
  readonly variante?: Variante;
  readonly tamanho?: Tamanho;
  readonly className?: string;
  /**
   * Escape hatch para o que classe não alcança. Existe por um motivo
   * concreto: `.link-filete` mora no fim da camada de utilitários e vence
   * qualquer classe de mesma especificidade que tente abrir o
   * `background-size` do underline. Não use para cor.
   */
  readonly style?: CSSProperties;
};

type PropsLink = PropsComuns & {
  /** Presente: renderiza `<Link>`. Ausente: renderiza `<button>`. */
  readonly href: string;
  readonly "aria-label"?: string;
  readonly rel?: string;
  readonly target?: string;
  readonly prefetch?: boolean;
  /** Só para efeito colateral local (fechar o menu). Nunca para navegar. */
  readonly onClick?: () => void;
};

type PropsBotao = PropsComuns & {
  readonly href?: undefined;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children">;

export type BotaoProps = PropsLink | PropsBotao;

// -----------------------------------------------------------------------------
// Classes
// -----------------------------------------------------------------------------

const BASE =
  "inline-flex items-center justify-center rounded-filete font-body " +
  "text-small font-medium leading-none no-underline " +
  "transition-colors duration-fast ease-out";

const TAMANHO: Record<Tamanho, string> = {
  base: "px-7 py-4",
  compacto: "px-5 py-3",
};

/**
 * Sólido. Sobre areia: vinho cheio, texto areia. Sobre vinho: blush cheio,
 * texto vinho-900. O hover esvazia o fundo nos dois casos.
 */
const SOLIDO = [
  "border border-wine-700 bg-wine-700 text-sand-50",
  "hover:bg-transparent hover:text-wine-700",
  "[[data-superficie=vinho]_&]:border-blush-200",
  "[[data-superficie=vinho]_&]:bg-blush-200",
  "[[data-superficie=vinho]_&]:text-wine-900",
  "[[data-superficie=vinho]_&]:hover:bg-transparent",
  "[[data-superficie=vinho]_&]:hover:text-blush-200",
  // Desabilitado: superfície areia-200 com tinta secundária, medido em 4.63:1.
  "disabled:cursor-not-allowed disabled:border-sand-200",
  "disabled:bg-sand-200 disabled:text-ink-600",
  "disabled:hover:bg-sand-200 disabled:hover:text-ink-600",
  "[[data-superficie=vinho]_&]:disabled:border-sand-200",
  "[[data-superficie=vinho]_&]:disabled:bg-sand-200",
  "[[data-superficie=vinho]_&]:disabled:text-ink-600",
].join(" ");

/**
 * Filete inferior. Não é um botão fantasma com borda em volta: é texto com uma
 * régua de 1px embaixo, e o underline em `currentColor` cresce da esquerda no
 * hover — a segunda das três animações que o orçamento do § 5.7 permite.
 */
const FILETE = [
  "filete link-filete rounded-none border-b px-0 py-1 text-wine-700",
  "[[data-superficie=vinho]_&]:text-blush-200",
  "disabled:cursor-not-allowed disabled:text-ink-400",
].join(" ");

const TAMANHO_FILETE: Record<Tamanho, string> = {
  base: "px-0 py-1",
  compacto: "px-0 py-0.5",
};

function classesDe(
  variante: Variante,
  tamanho: Tamanho,
  className: string | undefined,
): string {
  return variante === "solido"
    ? cn(BASE, TAMANHO[tamanho], SOLIDO, className)
    : cn(BASE, TAMANHO_FILETE[tamanho], FILETE, className);
}

// -----------------------------------------------------------------------------

export function Botao(props: BotaoProps) {
  const {
    children,
    variante = "solido",
    tamanho = "base",
    className,
    style,
  } = props;

  const classes = classesDe(variante, tamanho, className);

  if (props.href !== undefined) {
    const { href, prefetch, rel, target, onClick, ...resto } = props;
    return (
      <Link
        href={href}
        prefetch={prefetch}
        rel={rel}
        target={target}
        onClick={onClick}
        aria-label={resto["aria-label"]}
        style={style}
        className={classes}
      >
        {children}
      </Link>
    );
  }

  const {
    children: _filhos,
    variante: _variante,
    tamanho: _tamanho,
    className: _className,
    href: _href,
    style: _style,
    type = "button",
    ...atributos
  } = props;

  return (
    <button type={type} style={style} className={classes} {...atributos}>
      {children}
    </button>
  );
}
