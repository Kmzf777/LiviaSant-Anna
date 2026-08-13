/**
 * Protege as duas regras da Bodoni Moda (briefing § 5.3).
 *
 *   1. Nunca abaixo de 1.5rem — o hairline some e vira borrão em tela.
 *   2. Nunca em bold — a Didone quebra; o contraste dela já vem do desenho.
 *
 * A display é a voz da persuasão no site. Usá-la pequena ou pesada não é
 * um deslize de estilo: descaracteriza o eco do traço filete do logo, que é
 * a razão de ela ter sido escolhida.
 *
 *   pnpm verify:bodoni
 */

import {
  listarArquivos,
  ler,
  relatar,
  semComentarios,
  violacaoEm,
  type Violacao,
} from "./_util";

/** Degraus da escala que ficam abaixo de 1.5rem no mínimo do clamp. */
const TAMANHOS_PEQUENOS = ["text-h3", "text-lead", "text-body", "text-small", "text-micro"];

/** Utilitários de peso do Tailwind que estouram o limite. */
const PESOS_PESADOS = ["font-semibold", "font-bold", "font-extrabold", "font-black"];

const violacoes: Violacao[] = [];

const arquivos = listarArquivos(["app", "components", "styles"], [".tsx", ".css"]);

for (const caminho of arquivos) {
  const original = ler(caminho);
  const conteudo = semComentarios(original);

  // ---------------------------------------------------------------------------
  // Combinações na mesma lista de classes: font-display + tamanho pequeno,
  // ou font-display + peso pesado.
  // ---------------------------------------------------------------------------
  for (const match of conteudo.matchAll(
    /class(?:Name)?\s*=\s*(?:"([^"]*)"|'([^']*)'|\{`([^`]*)`\})/g,
  )) {
    if (match.index === undefined) continue;

    const classes = match[1] ?? match[2] ?? match[3] ?? "";
    const tokens = classes.split(/\s+/);
    if (!tokens.some((t) => t === "font-display" || t.endsWith(":font-display")))
      continue;

    const pequeno = tokens.find((t) =>
      TAMANHOS_PEQUENOS.some((p) => t === p || t.endsWith(`:${p}`)),
    );
    if (pequeno) {
      violacoes.push(
        violacaoEm(
          caminho,
          original,
          match.index,
          `font-display com ${pequeno}: abaixo de 1.5rem o hairline da Bodoni some. ` +
            `Use font-body, ou suba para text-h2/text-h1/text-hero.`,
        ),
      );
    }

    const pesado = tokens.find((t) =>
      PESOS_PESADOS.some((p) => t === p || t.endsWith(`:${p}`)),
    );
    if (pesado) {
      violacoes.push(
        violacaoEm(
          caminho,
          original,
          match.index,
          `font-display com ${pesado}: a Bodoni nunca vai em bold. ` +
            `Mantenha font-weight 400 e deixe o optical-size fazer o trabalho.`,
        ),
      );
    }

    const arbitrarioPequeno = tokens.find((t) => {
      const m = /^text-\[(\d*\.?\d+)(rem|px|em)\]$/.exec(t);
      if (!m?.[1] || !m[2]) return false;
      const valor = Number.parseFloat(m[1]);
      const rem = m[2] === "px" ? valor / 16 : valor;
      return rem < 1.5;
    });
    if (arbitrarioPequeno) {
      violacoes.push(
        violacaoEm(
          caminho,
          original,
          match.index,
          `font-display com ${arbitrarioPequeno}: abaixo de 1.5rem.`,
        ),
      );
    }
  }

  // ---------------------------------------------------------------------------
  // CSS: regras que combinam a família display com peso ≥ 600.
  // ---------------------------------------------------------------------------
  if (caminho.endsWith(".css")) {
    for (const match of conteudo.matchAll(/\{[^{}]*\}/g)) {
      if (match.index === undefined) continue;
      const bloco = match[0];

      if (!/font-family\s*:\s*var\(--font-display\)/.test(bloco)) continue;

      const peso = /font-weight\s*:\s*(\d{3}|bold(?:er)?)\b/.exec(bloco);
      const valor = peso?.[1];
      if (valor && (valor.startsWith("bold") || Number.parseInt(valor, 10) >= 600)) {
        violacoes.push(
          violacaoEm(
            caminho,
            original,
            match.index,
            `--font-display com font-weight: ${valor}. A Bodoni nunca vai em bold.`,
          ),
        );
      }
    }
  }
}

console.log(`\nBodoni Moda — ${arquivos.length} arquivos\n`);
relatar("bodoni", violacoes);
