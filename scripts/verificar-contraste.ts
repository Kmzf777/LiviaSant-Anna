/**
 * Verifica contraste WCAG AA em todos os pares de cor que o site realmente usa.
 *
 * O briefing (§ 5.2) manda medir e não confiar nos valores da paleta a olho.
 * Este script é a medição. As cores vêm de styles/theme.css — não há paleta
 * duplicada em TypeScript para sair de sincronia.
 *
 * Quando um par novo entrar em uso, adicione aqui. Um par não listado não é
 * verificado, então a lista é parte do design system, não um anexo.
 *
 *   pnpm verify:contraste
 */

import {
  AA_TEXTO_CORRIDO,
  AA_TEXTO_GRANDE,
  formatarRazao,
  minimoPara,
  razaoDeContraste,
  type Exigencia,
} from "../lib/contraste";
import { ler, RAIZ, relatar, type Violacao } from "./_util";
import { join } from "node:path";

// -----------------------------------------------------------------------------
// Paleta lida do CSS
// -----------------------------------------------------------------------------

function lerPaleta(): Record<string, string> {
  const css = ler(join(RAIZ, "styles", "theme.css"));
  const paleta: Record<string, string> = {};

  for (const [, nome, valor] of css.matchAll(
    /--color-([a-z0-9-]+):\s*(#[0-9a-fA-F]{3,8})\s*;/g,
  )) {
    if (nome && valor) paleta[nome] = valor;
  }

  return paleta;
}

const paleta = lerPaleta();

function cor(nome: string): string {
  const valor = paleta[nome];
  if (!valor) {
    throw new Error(
      `Token --color-${nome} não existe em styles/theme.css. ` +
        `Ou o token foi removido, ou este script está desatualizado.`,
    );
  }
  return valor;
}

// -----------------------------------------------------------------------------
// Pares em uso
//
// "grande" = ≥ 24px, ou ≥ 18.66px em peso 700. Na prática: hero, h1, h2.
// Todo o resto é "corrido".
// -----------------------------------------------------------------------------

type Par = {
  frente: string;
  fundo: string;
  exigencia: Exigencia;
  onde: string;
};

const PARES: readonly Par[] = [
  // Superfície areia — o padrão do site
  { frente: "ink-900", fundo: "sand-50", exigencia: "corrido", onde: "texto principal sobre areia" },
  { frente: "ink-600", fundo: "sand-50", exigencia: "corrido", onde: "texto secundário sobre areia" },
  { frente: "ink-400", fundo: "sand-50", exigencia: "corrido", onde: "legendas e eyebrows sobre areia" },
  { frente: "wine-700", fundo: "sand-50", exigencia: "corrido", onde: "links e foco sobre areia" },
  { frente: "ink-900", fundo: "sand-100", exigencia: "corrido", onde: "texto sobre areia-100" },
  { frente: "ink-600", fundo: "sand-100", exigencia: "corrido", onde: "texto secundário sobre areia-100" },
  { frente: "ink-400", fundo: "sand-100", exigencia: "corrido", onde: "legendas sobre areia-100" },
  { frente: "wine-700", fundo: "sand-100", exigencia: "corrido", onde: "links sobre areia-100" },
  { frente: "ink-900", fundo: "sand-200", exigencia: "corrido", onde: "texto sobre placeholder de imagem" },
  { frente: "ink-600", fundo: "sand-200", exigencia: "corrido", onde: "texto mono do placeholder" },

  // Superfície vinho — seções full-bleed
  { frente: "sand-50", fundo: "wine-700", exigencia: "corrido", onde: "texto corrido sobre vinho" },
  { frente: "blush-200", fundo: "wine-700", exigencia: "grande", onde: "H1 e H2 sobre vinho" },
  { frente: "blush-200", fundo: "wine-700", exigencia: "corrido", onde: "texto de apoio sobre vinho" },
  { frente: "blush-100", fundo: "wine-700", exigencia: "corrido", onde: "texto sobre vinho, variante clara" },
  { frente: "sand-50", fundo: "wine-800", exigencia: "corrido", onde: "menu mobile e hover de superfície" },
  { frente: "blush-200", fundo: "wine-900", exigencia: "corrido", onde: "footer" },
  { frente: "sand-50", fundo: "wine-900", exigencia: "corrido", onde: "footer, texto corrido" },

  { frente: "wine-300", fundo: "wine-700", exigencia: "corrido", onde: "nota em mono sobre vinho (§ 8.5)" },
  { frente: "wine-300", fundo: "wine-900", exigencia: "corrido", onde: "texto de apoio no footer" },

  // Botões
  { frente: "wine-900", fundo: "blush-200", exigencia: "corrido", onde: "CTA sólido sobre vinho" },
  { frente: "sand-50", fundo: "wine-700", exigencia: "corrido", onde: "CTA sólido sobre areia" },
];

/**
 * Pares em uso deliberado que NÃO atingem AA e por isso têm restrição de uso
 * documentada. Cada exceção precisa de justificativa e de uma regra que a
 * torne segura — nunca "é só decorativo".
 *
 * Vazio de propósito: as duas reprovações encontradas na primeira medição
 * (ink-400 e wine-300) foram corrigidas na paleta, não dispensadas. Ver os
 * comentários em styles/theme.css.
 */
const EXCECOES: readonly (Par & { justificativa: string })[] = [];

// -----------------------------------------------------------------------------

const violacoes: Violacao[] = [];

console.log(
  `\nContraste WCAG AA — corrido ≥ ${AA_TEXTO_CORRIDO}:1, grande ≥ ${AA_TEXTO_GRANDE}:1\n`,
);

for (const par of PARES) {
  const razao = razaoDeContraste(cor(par.frente), cor(par.fundo));
  const minimo = minimoPara(par.exigencia);
  const passa = razao >= minimo;

  const marca = passa ? "  ok " : "  XX ";
  console.log(
    `${marca} ${formatarRazao(razao).padStart(7)}  ${par.frente} / ${par.fundo}` +
      `  — ${par.onde}`,
  );

  if (!passa) {
    violacoes.push({
      arquivo: "styles/theme.css",
      linha: 0,
      trecho: `${par.frente} (${cor(par.frente)}) sobre ${par.fundo} (${cor(par.fundo)})`,
      motivo:
        `${par.onde}: ${formatarRazao(razao)}, precisa de ${minimo}:1 ` +
        `(texto ${par.exigencia}).`,
    });
  }
}

if (EXCECOES.length > 0) {
  console.log("\n  Exceções documentadas:");
  for (const e of EXCECOES) {
    const razao = razaoDeContraste(cor(e.frente), cor(e.fundo));
    console.log(
      `  ~~ ${formatarRazao(razao).padStart(7)}  ${e.frente} / ${e.fundo}  — ${e.onde}`,
    );
    console.log(`       ${e.justificativa.replace(/\s+/g, " ")}`);
  }
}

console.log("");
relatar("contraste", violacoes);
