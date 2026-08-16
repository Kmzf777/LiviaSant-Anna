import { Bodoni_Moda, IBM_Plex_Mono } from "next/font/google";
import localFont from "next/font/local";

/**
 * Três papéis, três famílias. Nenhuma é decorativa.
 *
 * As custom properties aqui são consumidas por styles/theme.css, que as
 * envolve com os fallbacks. Componentes usam `font-display` / `font-body` /
 * `font-mono` do Tailwind, nunca estas variáveis direto.
 */

/**
 * Display — H1, H2, citações.
 *
 * O contraste hairline↔grosso ecoa o traço filete do logo. O eixo `opsz`
 * é o motivo de escolher a Bodoni Moda e não uma Didone estática: em
 * tamanho grande o hairline afina como deve, e em tamanho pequeno
 * engrossa o suficiente para não sumir.
 *
 * Regra do design system: nunca abaixo de 1.5rem, nunca em bold.
 * Verificada por scripts/verificar-bodoni.ts.
 */
export const bodoni = Bodoni_Moda({
  subsets: ["latin", "latin-ext"],
  axes: ["opsz"],
  display: "swap",
  variable: "--fonte-bodoni",
});

/**
 * Corpo — todo texto lido.
 *
 * Auto-hospedada porque a Fontshare não é o Google Fonts e não queremos
 * requisição a CDN de terceiro em runtime. Ver scripts/baixar-switzer.mjs.
 */
export const switzer = localFont({
  src: [
    {
      path: "./fonts/Switzer-Variable.woff2",
      weight: "100 900",
      style: "normal",
    },
  ],
  display: "swap",
  variable: "--fonte-switzer",
  // Ajustado para reduzir CLS na troca do fallback pela Switzer.
  adjustFontFallback: "Arial",
});

/**
 * Dados — a espinha clínica do site.
 *
 * Eyebrows, ficha técnica, bloco CFM, endereço, disclaimers. Tudo que é
 * fato verificável aparece aqui; tudo que é persuasão aparece em display
 * ou body. O leitor aprende a diferença sem que ninguém explique — é o que
 * resolve visualmente a tensão entre "estética" e "médico".
 */
export const plexMono = IBM_Plex_Mono({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500"],
  display: "swap",
  variable: "--fonte-plex-mono",
});

export const classesDeFonte = [
  bodoni.variable,
  switzer.variable,
  plexMono.variable,
].join(" ");
