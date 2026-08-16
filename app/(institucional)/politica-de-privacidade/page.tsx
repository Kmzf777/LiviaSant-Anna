import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getPaginaInstitucional } from "@/content";
import { PaginaLegal } from "@/components/sections/PaginaLegal";
import { breadcrumbJsonLd, grafoJsonLd, serializarJsonLd } from "@/lib/jsonld";
import type { ItemTrilha } from "@/lib/jsonld";

/**
 * Política de privacidade.
 *
 * Todo o texto vem de `content/legal.ts`, inclusive os pontos que dependem de
 * uma decisão dela (prazo de retenção, encarregado, fornecedores, ferramenta
 * de análise). Esses aparecem marcados como pendentes em vez de preenchidos
 * com um valor razoável: uma declaração de tratamento de dados que não
 * corresponde à realidade é exatamente o que a LGPD pune.
 *
 * `notFound()` em vez de `!` no acesso: se alguém renomear o slug em
 * `/content`, a rota devolve 404 em vez de estourar em runtime.
 */

const SLUG = "politica-de-privacidade";

/* Título e descrição vêm de `content/legal.ts` — ver a nota em `aviso-legal`. */
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

export default function PaginaPoliticaDePrivacidade() {
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
