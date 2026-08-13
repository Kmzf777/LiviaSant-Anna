import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getProcedimento, listarProcedimentos } from "@/content";
import { PaginaProcedimento } from "@/components/medical/PaginaProcedimento";
import { AberturaRinoplastia } from "@/components/sections/rinoplastia/AberturaRinoplastia";

/**
 * As cinco páginas de cirurgia da face.
 *
 * Nenhum slug é escrito à mão em lugar nenhum deste arquivo: os parâmetros
 * estáticos, a metadata e o conteúdo saem todos de `listarProcedimentos` e
 * `getProcedimento`. Um procedimento novo em `/content` vira rota, entrada de
 * sitemap e cobertura de teste sem que ninguém edite código — e um slug que
 * não existe dá 404, não uma página meio renderizada.
 *
 * ## A composição da rinoplastia
 *
 * A rinoplastia é a página carro-chefe (§ 7) e recebe tratamento de landing
 * page. O que ela NÃO recebe é um segundo template: a rota detecta o slug e
 * envolve o mesmo `PaginaProcedimento` com a abertura extra. Duas
 * consequências que valem o incômodo de fazer assim:
 *
 *   - uma correção no template chega à rinoplastia junto com as outras quatro;
 *   - a página carro-chefe não pode divergir em silêncio das irmãs, que é o
 *     jeito mais comum de uma landing page perder a seção de riscos.
 *
 * A abertura vem antes porque é a capa, e porque ela não tem heading — o `h1`
 * da página continua sendo o do template, no hero logo abaixo.
 */

const HUB = "cirurgia-da-face";

/** A única página do site com composição própria. Ver AberturaRinoplastia. */
const CARRO_CHEFE = "rinoplastia";

type Props = {
  readonly params: Promise<{ readonly slug: string }>;
};

/** Slug fora desta lista não existe: 404 em vez de renderização dinâmica. */
export const dynamicParams = false;

export function generateStaticParams(): { slug: string }[] {
  return listarProcedimentos(HUB).map((procedimento) => ({
    slug: procedimento.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const procedimento = getProcedimento(HUB, slug);

  if (!procedimento) return {};

  const caminho = `/${HUB}/${slug}`;

  return {
    // `absolute`: o template do layout raiz acrescentaria o nome dela de novo,
    // e o título do conteúdo (≤ 60 caracteres) já o traz.
    title: { absolute: procedimento.seo.titulo },
    description: procedimento.seo.descricao,
    alternates: { canonical: caminho },
    openGraph: {
      type: "article",
      title: procedimento.seo.titulo,
      description: procedimento.seo.descricao,
      url: caminho,
    },
  };
}

export default async function PaginaDeProcedimento({ params }: Props) {
  const { slug } = await params;
  const procedimento = getProcedimento(HUB, slug);

  if (!procedimento) notFound();

  return (
    <>
      {procedimento.slug === CARRO_CHEFE ? <AberturaRinoplastia /> : null}
      <PaginaProcedimento procedimento={procedimento} />
    </>
  );
}
