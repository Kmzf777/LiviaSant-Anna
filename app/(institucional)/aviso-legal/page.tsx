import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getPaginaInstitucional } from "@/content";
import { PaginaLegal } from "@/components/sections/PaginaLegal";

/**
 * Aviso legal.
 *
 * Natureza informativa do conteúdo, identificação profissional e as regras de
 * publicidade médica da Resolução CFM 2.336/2023. Mesmo render da política de
 * privacidade: a forma é idêntica e a diferença é só o texto, que vem de
 * `content/legal.ts`.
 */

const SLUG = "aviso-legal";

export const metadata: Metadata = {
  title: "Aviso legal",
  description:
    "Natureza informativa do conteúdo deste site, identificação profissional e as regras de publicidade médica da Resolução CFM 2.336/2023.",
  alternates: { canonical: `/${SLUG}` },
};

export default function PaginaAvisoLegal() {
  const pagina = getPaginaInstitucional(SLUG);
  if (!pagina) notFound();

  return <PaginaLegal pagina={pagina} />;
}
