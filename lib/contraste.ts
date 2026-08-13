/**
 * Contraste WCAG 2.1.
 *
 * O briefing manda verificar contraste programaticamente e não confiar nos
 * valores da paleta sem medir. Este módulo é a medição; scripts/verificar-
 * contraste.ts é a lista do que medir.
 *
 * Fórmula: WCAG 2.1, relative luminance + contrast ratio.
 * https://www.w3.org/TR/WCAG21/#dfn-contrast-ratio
 */

export const AA_TEXTO_CORRIDO = 4.5;
export const AA_TEXTO_GRANDE = 3;

export type Rgb = { r: number; g: number; b: number };

/** Aceita #rgb e #rrggbb. Lança em qualquer outra coisa — inclusive em nomes
 *  de cor e rgb(), que não deveriam existir no projeto. */
export function hexParaRgb(hex: string): Rgb {
  const limpo = hex.trim().replace(/^#/, "");

  const cheio =
    limpo.length === 3
      ? limpo
          .split("")
          .map((c) => c + c)
          .join("")
      : limpo;

  if (!/^[0-9a-fA-F]{6}$/.test(cheio)) {
    throw new Error(`Cor hex inválida: "${hex}"`);
  }

  return {
    r: Number.parseInt(cheio.slice(0, 2), 16),
    g: Number.parseInt(cheio.slice(2, 4), 16),
    b: Number.parseInt(cheio.slice(4, 6), 16),
  };
}

/** Luminância relativa. Canais linearizados antes da soma ponderada. */
export function luminanciaRelativa({ r, g, b }: Rgb): number {
  const linearizar = (canal: number): number => {
    const s = canal / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };

  return (
    0.2126 * linearizar(r) + 0.7152 * linearizar(g) + 0.0722 * linearizar(b)
  );
}

/** Razão de contraste entre duas cores, de 1 a 21. Ordem não importa. */
export function razaoDeContraste(corA: string, corB: string): number {
  const a = luminanciaRelativa(hexParaRgb(corA));
  const b = luminanciaRelativa(hexParaRgb(corB));

  const clara = Math.max(a, b);
  const escura = Math.min(a, b);

  return (clara + 0.05) / (escura + 0.05);
}

export type Exigencia = "corrido" | "grande";

export function minimoPara(exigencia: Exigencia): number {
  return exigencia === "grande" ? AA_TEXTO_GRANDE : AA_TEXTO_CORRIDO;
}

export function passaAA(
  frente: string,
  fundo: string,
  exigencia: Exigencia = "corrido",
): boolean {
  return razaoDeContraste(frente, fundo) >= minimoPara(exigencia);
}

/** Arredonda para baixo em 2 casas: nunca reporta 4.5 quando é 4.497. */
export function formatarRazao(razao: number): string {
  return `${(Math.floor(razao * 100) / 100).toFixed(2)}:1`;
}
