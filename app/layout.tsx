import type { Metadata, Viewport } from "next";

import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { Traco } from "@/components/layout/Traco";
import { IdentificacaoCFM } from "@/components/medical/IdentificacaoCFM";
import { SITE } from "@/lib/site";
import { classesDeFonte } from "./fonts";
import "./globals.css";

/**
 * Layout raiz.
 *
 * A ordem de montagem não é arbitrária:
 *
 *   <Traco />   antes do <main>, para ficar sob o conteúdo na ordem de pintura
 *   <Header />  sticky
 *   <main>      as seções, que declaram data-superficie e são medidas pelo Traço
 *   <Footer />  com o bloco do CFM injetado
 *
 * ## Por que o bloco do CFM entra por injeção
 *
 * A Resolução CFM 2.336/2023 exige o bloco de identificação em local visível
 * em TODAS as páginas. Se o `Footer` o importasse sozinho, a garantia
 * dependeria de o rodapé nunca ser trocado. Montando aqui, a obrigação fica
 * no único lugar por onde toda rota passa.
 *
 * O teste `tests/e2e/cfm.spec.ts` percorre `listarRotas()` e confere, em cada
 * uma, que o bloco existe e é tipograficamente uniforme.
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
      <head>
        {/*
          O reveal de seção começa em opacity: 0 e só aparece quando o
          IntersectionObserver marca `data-visivel`. Sem JS, o conteúdo ficaria
          invisível — o HTML está lá, mas ninguém o vê.

          A alternativa seria começar visível e esconder na hidratação, o que
          troca este risco por um flash em toda visita. Este <noscript> resolve
          sem nenhum dos dois custos: quem tem JS nunca o aplica, quem não tem
          recebe o conteúdo estático e completo.
        */}
        <noscript>
          <style>{`.revelar { opacity: 1 !important; transform: none !important; }`}</style>
        </noscript>
      </head>

      <body className="min-h-dvh antialiased">
        {/* Primeiro nó focável da página. */}
        <a
          href="#conteudo"
          className="focus:bg-wine-700 focus:text-sand-50 sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:not-sr-only focus:px-4 focus:py-2"
        >
          Pular para o conteúdo
        </a>

        <Traco />
        <Header />

        <main id="conteudo">{children}</main>

        <Footer identificacao={<IdentificacaoCFM sobre="vinho" />} />
      </body>
    </html>
  );
}
