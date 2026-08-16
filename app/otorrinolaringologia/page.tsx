import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { HubProcedimentos } from "@/components/sections/HubProcedimentos";
import type { HubSlug } from "@/content";
import { getHub, listarProcedimentos } from "@/content";
import { breadcrumbJsonLd, grafoJsonLd, serializarJsonLd } from "@/lib/jsonld";

/**
 * Hub de otorrinolaringologia — a página de quem chega buscando "cirurgia de
 * amígdala" ou "desvio de septo BH".
 *
 * Estruturalmente idêntica a `/estetica-facial`: mesmo componente, mesmo ritmo
 * de superfície, mesma tipografia. A tese do site é que forma e função são o
 * mesmo trabalho, nas mesmas mãos, e um hub clínico com menos cuidado visual
 * que o estético a desmentiria antes da primeira seção.
 *
 * Nenhum slug de procedimento é escrito aqui: a lista sai de
 * `listarProcedimentos()`.
 */

const SLUG: HubSlug = "otorrinolaringologia";

export function generateMetadata(): Metadata {
  const hub = getHub(SLUG);
  if (!hub) return {};

  return {
    // Sem `absolute`: `seo.titulo` declara só a parte distintiva e o template
    // do layout raiz acrescenta " | Dra. Lívia Sant'Anna" — aqui e no
    // `og:title`, que o Next resolve com o mesmo template.
    title: hub.seo.titulo,
    description: hub.seo.descricao,
    alternates: { canonical: `/${SLUG}` },
    openGraph: {
      type: "website",
      title: hub.seo.titulo,
      description: hub.seo.descricao,
      url: `/${SLUG}`,
    },
  };
}

export default function HubOtorrinolaringologia() {
  const hub = getHub(SLUG);
  if (!hub) notFound();

  const trilha = breadcrumbJsonLd([
    { nome: "Início", href: "/" },
    { nome: hub.nome, href: `/${SLUG}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          // `grafoJsonLd` acrescenta o `@context`, sem o qual o bloco não é
          // JSON-LD válido e o Rich Results Test o ignora.
          __html: serializarJsonLd(grafoJsonLd(trilha)),
        }}
      />

      <HubProcedimentos hub={hub} procedimentos={listarProcedimentos(SLUG)} />
    </>
  );
}
