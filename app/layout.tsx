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

/**
 * ## O sufixo do título mora aqui, e só aqui
 *
 * Quinze arquivos de `content/` repetiam `"… | Lívia Sant'Anna"` dentro do
 * próprio `seo.titulo`, e por isso toda página precisava de
 * `title: { absolute: … }` para o template não duplicar o nome. Duas fontes
 * para a mesma decisão: acrescentar o "Dra." exigiria quinze edições e a
 * décima sexta página nasceria sem ele.
 *
 * Agora `seo.titulo` declara só a parte distintiva e o template costura o
 * nome. O orçamento é aritmético: `" | Dra. Lívia Sant'Anna"` custa 23
 * caracteres, então a base cabe em 37 para o título final ficar nos 60 que o
 * Google exibe. `tests/unit/seo.spec.ts` mede o título final de toda rota.
 */
export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    // "Otorrino", e não "Otorrinolaringologia", pela mesma aritmética: com o
    // nome já dentro do título, o termo por extenso levaria o default a 61
    // caracteres. É o padrão que a home adotou (PENDENCIAS.md, decisão 3).
    default: `${SITE.nomeSeo} — Otorrino e cirurgia da face`,
    template: `%s | ${SITE.nomeSeo}`,
  },
  description: SITE.descricaoPadrao,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: SITE.nomeSeo,
    url: SITE.url,
    /*
      O `og:title` tem template próprio, e ele precisa ser declarado aqui.

      O Next resolve o `og:title` de uma página com o template de OpenGraph do
      pai — não com o de `title`. Sem esta declaração, as páginas que definem
      `openGraph.title` saíam com o título sem o nome dela na prévia do
      WhatsApp, enquanto as que não definiam herdavam o título completo. Duas
      formas diferentes de prévia no mesmo site, e nada acusava.
    */
    title: {
      default: `${SITE.nomeSeo} — Otorrino e cirurgia da face`,
      template: `%s | ${SITE.nomeSeo}`,
    },
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
          className="focus:bg-wine-700 focus:text-sand-50 sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2"
        >
          Pular para o conteúdo
        </a>

        <Traco />
        <Header />

        {/* O `pb` no celular reserva a altura da barra de CTA fixa
            (`BotaoWhatsAppFixo`), que é `position: fixed` e por isso não ocupa
            espaço no fluxo. Sem ele a barra cobriria o fim da última seção — e
            no rodapé, o bloco de identificação do CFM, que a Resolução
            2.336/2023 exige visível. Some a partir de `lg`, junto com a barra. */}
        <main id="conteudo" className="pb-[5.5rem] lg:pb-0">
          {children}
        </main>

        <Footer identificacao={<IdentificacaoCFM sobre="vinho" />} />
      </body>
    </html>
  );
}
