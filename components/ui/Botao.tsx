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

/**
 * `min-h-[var(--alvo-toque)]` na base, e não só na variante filete.
 *
 * O `tamanho="compacto"` media 155×**40** — quatro pixels abaixo do mínimo de
 * toque. Escapou de duas redes ao mesmo tempo: da auditoria de mobile, que roda
 * até 430px, e do projeto `mobile-390` do Playwright, porque o único uso é o CTA
 * do header, que só aparece de `md` para cima (`hidden md:inline-flex`). Quem
 * pegou foi o projeto `tablet-768`, em 21 rotas.
 *
 * Na base porque a regra vale para todo botão: `tamanho="base"` já dava 46px e
 * não muda um pixel.
 */
const BASE =
  "inline-flex min-h-[var(--alvo-toque)] items-center justify-center " +
  "rounded-filete font-body text-small font-medium leading-none no-underline " +
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
 *
 * ## Por que o desenho mora num span
 *
 * O `py-1` desta variante dava um alvo de 124×**23** — metade do mínimo de
 * toque. Crescer a caixa do próprio `<a>` até 44px levaria o `border-b` junto,
 * e o filete descolaria do texto: deixaria de ser uma régua sob a palavra para
 * virar a borda de uma caixa. Então a caixa clicável cresce e o desenho fica
 * onde estava — texto, filete e underline dentro de um span que o `<a>` centra
 * verticalmente nos 44px.
 *
 * O span leva `link-filete-sem-alvo` porque o alvo já é do pai; sem isso, a
 * regra de `globals.css` daria 44px ao span também e o botão teria 67px.
 */
const FILETE_ALVO = [
  "min-h-[var(--alvo-toque)] px-0 py-0 text-wine-700",
  "[[data-superficie=vinho]_&]:text-blush-200",
  "disabled:cursor-not-allowed disabled:text-ink-400",
].join(" ");

const FILETE_DESENHO = "filete link-filete link-filete-sem-alvo border-b";

const TAMANHO_FILETE: Record<Tamanho, string> = {
  base: "py-1",
  compacto: "py-0.5",
};

function classesDe(
  variante: Variante,
  tamanho: Tamanho,
  className: string | undefined,
): string {
  return variante === "solido"
    ? cn(BASE, TAMANHO[tamanho], SOLIDO, className)
    : cn(BASE, "rounded-none", FILETE_ALVO, className);
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

  /*
    Na variante filete o `style` vai para o span, não para o `<a>`: ele existe
    para abrir o underline à mão (`{ backgroundSize: "100% 1px" }`, ver o
    comentário na prop) e o underline mora no span. No sólido segue no
    elemento clicável, como sempre.
   */
  const conteudo =
    variante === "filete" ? (
      <span
        className={cn(FILETE_DESENHO, TAMANHO_FILETE[tamanho])}
        style={style}
      >
        {children}
      </span>
    ) : (
      children
    );

  const estiloExterno = variante === "filete" ? undefined : style;

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
        style={estiloExterno}
        className={classes}
      >
        {conteudo}
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
    <button
      type={type}
      style={estiloExterno}
      className={classes}
      {...atributos}
    >
      {conteudo}
    </button>
  );
}
