import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PaginaProcedimento } from "@/components/medical/PaginaProcedimento";
import type { HubSlug } from "@/content";
import { getProcedimento, listarProcedimentos } from "@/content";

/**
 * Páginas de procedimento de estética facial.
 *
 * Uma rota na v1 (toxina botulínica), gerada a partir de
 * `listarProcedimentos()` como as outras dez. O arquivo é gêmeo do de
 * otorrinolaringologia de propósito: mesmo template, mesma ficha técnica,
 * mesma seção de riscos. Um procedimento estético descrito com menos rigor que
 * um cirúrgico seria exatamente o site que o briefing não quer.
 *
 * O JSON-LD (`MedicalProcedure`, `FAQPage`, `BreadcrumbList`) sai de
 * `PaginaProcedimento`, junto dos dados que o alimentam — emitir de novo aqui
 * duplicaria os três blocos. `medicalProcedureJsonLd` já sabe que a estética
 * facial não é cirúrgica e não a declara como `SurgicalProcedure`.
 */

const HUB: HubSlug = "estetica-facial";

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
    title: { absolute: seo.titulo },
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

export default async function ProcedimentoDeEsteticaFacial({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const procedimento = getProcedimento(HUB, slug);

  if (!procedimento) notFound();

  return <PaginaProcedimento procedimento={procedimento} />;
}
