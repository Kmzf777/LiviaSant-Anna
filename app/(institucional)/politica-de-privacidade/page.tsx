import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getPaginaInstitucional } from "@/content";
import { PaginaLegal } from "@/components/sections/PaginaLegal";

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

export const metadata: Metadata = {
  title: "Política de privacidade",
  description:
    "Quais dados este site coleta, por que, por quanto tempo, com quem são compartilhados e como exercer seus direitos como titular, conforme a LGPD.",
  alternates: { canonical: `/${SLUG}` },
};

export default function PaginaPoliticaDePrivacidade() {
  const pagina = getPaginaInstitucional(SLUG);
  if (!pagina) notFound();

  return <PaginaLegal pagina={pagina} />;
}
