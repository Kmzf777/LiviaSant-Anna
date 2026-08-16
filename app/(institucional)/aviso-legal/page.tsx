import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getPaginaInstitucional } from "@/content";
import { PaginaLegal } from "@/components/sections/PaginaLegal";
import { breadcrumbJsonLd, grafoJsonLd, serializarJsonLd } from "@/lib/jsonld";
import type { ItemTrilha } from "@/lib/jsonld";

/**
 * Aviso legal.
 *
 * Natureza informativa do conteúdo, identificação profissional e as regras de
 * publicidade médica da Resolução CFM 2.336/2023. Mesmo render da política de
 * privacidade: a forma é idêntica e a diferença é só o texto, que vem de
 * `content/legal.ts`.
 */

const SLUG = "aviso-legal";

/*
  O título e a descrição saem de `content/legal.ts`, não de literais escritos
  aqui: eles já existiam nos dois lugares, e duas cópias do mesmo texto SEO
  divergem na primeira revisão de copy — com a rota mostrando a versão velha
  sem que nada acuse.
*/
const pagina = getPaginaInstitucional(SLUG);

export const metadata: Metadata = {
  title: pagina?.seo.titulo,
  description: pagina?.seo.descricao,
  alternates: { canonical: `/${SLUG}` },
  openGraph: {
    type: "article",
    title: pagina?.seo.titulo,
    description: pagina?.seo.descricao,
    url: `/${SLUG}`,
  },
};

export default function PaginaAvisoLegal() {
  if (!pagina) notFound();

  const trilha: readonly ItemTrilha[] = [
    { nome: "Início", href: "/" },
    { nome: pagina.h1, href: `/${SLUG}` },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializarJsonLd(grafoJsonLd(breadcrumbJsonLd(trilha))),
        }}
      />

      <PaginaLegal pagina={pagina} />
    </>
  );
}
