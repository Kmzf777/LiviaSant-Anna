import type { Metadata, Viewport } from "next";

import { classesDeFonte } from "./fonts";
import { SITE } from "@/lib/site";
import "./globals.css";

/**
 * Layout raiz.
 *
 * Ordem de montagem prevista:
 *   <Traco />     fixo, atrás de tudo, acima do fundo   — subagent B
 *   <Header />    sticky                                 — subagent A
 *   <main>        conteúdo da rota
 *   <Footer />    selo, nav, IdentificacaoCFM            — subagent A
 *
 * O <main> carrega os retângulos de superfície que o Traço mede para decidir
 * a cor de cada segmento — ver docs/DESIGN-SYSTEM.md.
 */

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.nome} — Otorrinolaringologia e cirurgia da face`,
    template: `%s | ${SITE.nome}`,
  },
  description: SITE.descricaoPadrao,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: SITE.nome,
    url: SITE.url,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export const viewport: Viewport = {
  // Cor da barra do navegador: o vinho da marca, que é a cor do hero.
  themeColor: "#6d1f3a",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={classesDeFonte}>
      <body className="min-h-dvh antialiased">
        {/* Pular para o conteúdo: primeiro nó focável da página. */}
        <a
          href="#conteudo"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-wine-700 focus:px-4 focus:py-2 focus:text-sand-50"
        >
          Pular para o conteúdo
        </a>

        <main id="conteudo">{children}</main>
      </body>
    </html>
  );
}
