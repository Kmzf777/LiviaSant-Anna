import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PaginaProcedimento } from "@/components/medical/PaginaProcedimento";
import type { HubSlug } from "@/content";
import { getProcedimento, listarProcedimentos } from "@/content";

/**
 * Páginas de procedimento de otorrinolaringologia.
 *
 * Cinco rotas estáticas, todas derivadas de `listarProcedimentos()`: desvio de
 * septo, amígdalas e adenoides, sinusite, tubo de ventilação e timpanoplastia.
 * Nenhum slug aparece escrito aqui — um procedimento novo em `content/` vira
 * rota, entrada no sitemap e cobertura de teste sem ninguém tocar nesta pasta.
 *
 * O corpo é o template compartilhado do § 8.10, o mesmo que as cirurgias da
 * face e a estética facial usam. A simetria é o argumento: quem pesquisa
 * amígdala e quem pesquisa rinoplastia leem a mesma estrutura, com a seção de
 * riscos escrita com o mesmo cuidado tipográfico.
 *
 * ## Por que não há JSON-LD aqui
 *
 * `PaginaProcedimento` já emite `MedicalProcedure`, `FAQPage` e
 * `BreadcrumbList` a partir do mesmo objeto que recebe. Repetir os blocos na
 * rota entregaria dois de cada por página, que é pior do que não ter nenhum:
 * o Rich Results Test acusa duplicidade e o Google escolhe sozinho qual
 * acreditar. Um gerador só, no lugar onde os dados estão.
 */

const HUB: HubSlug = "otorrinolaringologia";

type Params = { readonly slug: string };

export function generateStaticParams(): Params[] {
  return listarProcedimentos(HUB).map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const procedimento = getProcedimento(HUB, slug);

  if (!procedimento) return {};

  const { seo } = procedimento;

  return {
    // O nome dela entra pelo template do layout raiz, no título e no
    // `og:title`. Ver o comentário do orçamento de caracteres lá.
    title: seo.titulo,
    description: seo.descricao,
    alternates: { canonical: `/${HUB}/${slug}` },
    openGraph: {
      type: "article",
      title: seo.titulo,
      description: seo.descricao,
      url: `/${HUB}/${slug}`,
    },
  };
}

export default async function ProcedimentoDeOtorrinolaringologia({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const procedimento = getProcedimento(HUB, slug);

  if (!procedimento) notFound();

  return <PaginaProcedimento procedimento={procedimento} />;
}
