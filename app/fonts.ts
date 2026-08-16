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
 * ## Sobre o eixo de peso não aparecer aqui
 *
 * A lista `axes` só tem `opsz`, e isso NÃO significa que o peso ficou de fora.
 * No `next/font/google`, `axes` é a lista de eixos ADICIONAIS: o `wght` é
 * tratado pela opção `weight` e, quando ela é omitida numa família que tem
 * corte variável, o loader assume `variable` e pede o intervalo inteiro do
 * eixo. Declarar `axes: ["opsz", "wght"]` não é "mais completo" — é erro de
 * build ("Invalid axes value `wght`"), porque `wght` é filtrado da lista de
 * eixos declaráveis em `get-font-axes.js`.
 *
 * Conferido, e não suposto. Os metadados que o Next carrega dão
 * `wght: 400..900` para esta família, e o CSS que ele gera declara
 * `font-weight: 400 900` nos quatro `@font-face` da Bodoni. Medido no
 * navegador com `font-synthesis-weight: none` (que `app/globals.css` aplica no
 * body), "Lívia Sant'Anna" em 64px mede 452.97px em 400, 463.47 em 500, 490.34
 * em 700 e 527.81 em 900: uma rampa contínua, que só existe se o arquivo
 * variável estiver mesmo interpolando. Negrito sintético não produz degraus
 * intermediários — e, com `font-synthesis-weight: none`, não produz nada.
 *
 * Regra do design system: nunca abaixo de 1.5rem. A regra "nunca em bold" foi
 * revogada pelo cliente em 15/08/2026, e a display passou a 900 por
 * `--peso-display` (`styles/theme.css`). Ver scripts/verificar-bodoni.ts.
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
