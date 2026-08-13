import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { HubProcedimentos } from "@/components/sections/HubProcedimentos";
import type { HubSlug } from "@/content";
import { getHub, listarProcedimentos } from "@/content";
import { breadcrumbJsonLd, grafoJsonLd, serializarJsonLd } from "@/lib/jsonld";

/**
 * Hub de estética facial.
 *
 * Mesmo componente, mesmo template e mesmo peso visual do hub de
 * otorrinolaringologia — ver a nota em `HubProcedimentos`. Um hub tem cinco
 * procedimentos e o outro tem um; essa é a única diferença que o visitante
 * deve conseguir apontar.
 */

const SLUG: HubSlug = "estetica-facial";

export function generateMetadata(): Metadata {
  const hub = getHub(SLUG);
  if (!hub) return {};

  return {
    title: { absolute: hub.seo.titulo },
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

export default function HubEsteticaFacial() {
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
          __html: serializarJsonLd(grafoJsonLd(trilha)),
        }}
      />

      <HubProcedimentos hub={hub} procedimentos={listarProcedimentos(SLUG)} />
    </>
  );
}
