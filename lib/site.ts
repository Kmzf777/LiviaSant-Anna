/**
 * Configuração do site. Fonte única para metadata, sitemap, JSON-LD e OG.
 */

export const SITE = {
  nome: "Lívia Sant'Anna",
  /**
   * Domínio definitivo pendente. Trocar aqui atualiza metadata, sitemap,
   * robots, JSON-LD e as OG images de uma vez. Ver PENDENCIAS.md.
   */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://liviasantanna.com.br",
  locale: "pt-BR",
  descricaoPadrao:
    "Otorrinolaringologista em Belo Horizonte, com atuação em cirurgia plástica da face. " +
    "Nariz, ouvido e garganta, rinoplastia, otoplastia e blefaroplastia.",
} as const;

export function urlAbsoluta(caminho: string): string {
  return new URL(caminho, SITE.url).toString();
}
