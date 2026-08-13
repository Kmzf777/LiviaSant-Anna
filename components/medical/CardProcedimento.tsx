import Image from "next/image";

import type { Procedimento } from "@/content";
import { Botao } from "@/components/ui/Botao";
import { PlaceholderImagem } from "@/components/ui/PlaceholderImagem";
import { cn } from "@/components/ui/cn";

/**
 * CardProcedimento — a entrada de um procedimento numa listagem.
 *
 * Imagem opcional, título, uma linha de resumo e um link. Retangular,
 * `--radius-filete` de 2px, sem pílula (§ 5.5): arco é retrato, reto é
 * interface.
 *
 * ## Por que não há numeração
 *
 * `Passos` é numerado porque a consulta é uma sequência real. Uma lista de
 * procedimentos não é sequência, e numerar aqui seria a decoração que o
 * briefing § 15 manda remover. Vale para `RiscosELimites` pelo mesmo motivo.
 *
 * ## Por que a variante `linha` é o padrão
 *
 * Nenhuma foto de procedimento existe ainda, e todas as `imagem` do conteúdo
 * são `pendente`. Numa grade de cinco cards, isso seriam cinco blocos
 * "IMAGEM PENDENTE" empilhados — o placeholder é honesto uma vez, e ruído
 * cinco vezes. A `linha` resolve o hub inteiro em tipografia e filete, que é
 * a linguagem do site, e tem a vantagem de escalar bem tanto para os cinco
 * procedimentos de otorrino quanto para o único da estética facial: uma lista
 * de um item é só uma lista curta, enquanto uma grade de três colunas com um
 * card é uma grade quebrada.
 *
 * A variante `bloco` existe para quando houver foto e para grades de
 * relacionados dentro da página de procedimento.
 *
 * ## O alvo de clique
 *
 * Um único link por card, e o texto dele diz o que acontece — "Ver desvio de
 * septo", nunca "Saiba mais" (§ 6, verificado por `pnpm verify:termos`). O
 * card inteiro fica clicável por um `::after` que cobre o `<article>`
 * relativo, então o alvo é grande sem duplicar o link na árvore de
 * acessibilidade e sem transformar o título em segundo link para o mesmo
 * lugar.
 */

type Variante = "linha" | "bloco";

type Props = {
  readonly procedimento: Procedimento;
  readonly variante?: Variante;
  /**
   * Nível do título. Semântica, não tamanho: a página é que sabe sob qual
   * heading a lista está pendurada (§ 9, hierarquia sem saltos).
   */
  readonly nivelTitulo?: "h2" | "h3" | "h4";
  readonly className?: string;
};

/** "Desvio de septo" -> "Ver desvio de septo". Sentence case, sempre. */
export function textoDoLink(nome: string): string {
  return `Ver ${nome.charAt(0).toLocaleLowerCase("pt-BR")}${nome.slice(1)}`;
}

export function hrefDoProcedimento(procedimento: Procedimento): string {
  return `/${procedimento.hub}/${procedimento.slug}`;
}

/**
 * O `group-hover` abre o underline do link quando o ponteiro está em qualquer
 * lugar do card. Precisa da variante de grupo e não de `bg-[length:…]` solto:
 * `.link-filete` mora no fim da camada de utilitários e vence classe de mesma
 * especificidade (ver docs/DESIGN-SYSTEM.md § 9). Com o prefixo, a regra ganha
 * um seletor a mais e passa a vencer.
 */
const LINK =
  "after:absolute after:inset-0 after:content-[''] " +
  "group-hover:bg-[length:100%_1px]";

const TITULO =
  "text-h3 text-ink-900 [[data-superficie=vinho]_&]:text-blush-200";

const RESUMO =
  "medida text-body text-ink-600 [[data-superficie=vinho]_&]:text-sand-50";

function Ilustracao({ procedimento }: { readonly procedimento: Procedimento }) {
  const { imagem } = procedimento;

  if (imagem.tipo === "pendente") {
    return (
      <PlaceholderImagem
        descricao={imagem.descricao}
        aspecto="4/3"
        className="mb-8"
      />
    );
  }

  const { src, alt, largura, altura } = imagem.imagem;

  return (
    <div
      style={{ aspectRatio: "4/3" }}
      className="rounded-filete bg-sand-300 relative mb-8 w-full overflow-hidden"
    >
      <Image
        src={src}
        alt={alt}
        width={largura}
        height={altura}
        sizes="(min-width: 1024px) 30vw, 100vw"
        className="zoom-suave h-full w-full object-cover"
      />
    </div>
  );
}

export function CardProcedimento({
  procedimento,
  variante = "linha",
  nivelTitulo = "h3",
  className,
}: Props) {
  const Titulo = nivelTitulo;
  const href = hrefDoProcedimento(procedimento);

  if (variante === "bloco") {
    return (
      <article
        className={cn("filete group relative flex flex-col border-t pt-8", className)}
      >
        <Ilustracao procedimento={procedimento} />

        <Titulo className={TITULO}>{procedimento.nome}</Titulo>
        <p className={cn(RESUMO, "mt-4")}>{procedimento.lead}</p>

        <Botao
          href={href}
          variante="filete"
          tamanho="compacto"
          className={cn(LINK, "mt-8 self-start")}
        >
          {textoDoLink(procedimento.nome)}
        </Botao>
      </article>
    );
  }

  return (
    <article
      className={cn(
        // A linha do índice: nome à esquerda numa coluna fixa, resumo e link
        // à direita. O filete de baixo fecha cada linha; quem monta a lista
        // abre com um `border-t` no <ul>.
        "filete group relative grid gap-x-12 gap-y-3 border-b py-9",
        "lg:grid-cols-[minmax(0,18rem)_minmax(0,1fr)]",
        className,
      )}
    >
      <Titulo className={cn(TITULO, "text-pretty")}>
        {procedimento.nome}
      </Titulo>

      <div>
        <p className={RESUMO}>{procedimento.lead}</p>

        <Botao
          href={href}
          variante="filete"
          tamanho="compacto"
          className={cn(LINK, "mt-5")}
        >
          {textoDoLink(procedimento.nome)}
        </Botao>
      </div>
    </article>
  );
}
