/**
 * Protege a regra que sobrou da Bodoni Moda (briefing § 5.3).
 *
 *   1. Nunca abaixo de 1.5rem — o hairline some e vira borrão em tela.
 *
 * ---------------------------------------------------------------------------
 * A regra 2 ("nunca em bold") foi REVOGADA em 15/08/2026
 * ---------------------------------------------------------------------------
 *
 * Este script chegou a reprovar o build de quem escrevesse `font-display
 * font-bold`, com a justificativa de que a Didone quebra em peso alto e de que
 * o contraste dela já vem do desenho. O argumento tipográfico continua de pé;
 * a decisão não é mais nossa.
 *
 * O dono do site pediu o contrário, em áudio: *"a fonte onde está escrito
 * 'Lívia Sant'Anna' e os outros títulos, deixa ela o mais bold que conseguir"*.
 * A decisão foi aceita e está registrada em `PLANO-CONVERSAO-SEO.md` (decisão
 * 2). A display passou a 900 — o topo real do eixo `wght` da Bodoni Moda — por
 * `--peso-display` em `styles/theme.css`.
 *
 * Ou seja: se você está lendo isto daqui a seis meses e estranhando a ausência
 * da checagem de peso, ela não caiu por descuido nem por conveniência de quem
 * queria fazer o build passar. Caiu por ordem de quem manda no site, e o preço
 * estético foi discutido antes. Reintroduzi-la exige uma decisão nova, do
 * cliente, não uma correção de rota.
 *
 * A checagem de TAMANHO fica, e por um motivo independente: mesmo em 900 a
 * Bodoni é uma Didone, o serifado dela continua sendo um fio, e abaixo de
 * 1.5rem esse fio some na renderização. Peso não compra tamanho.
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

const violacoes: Violacao[] = [];

const arquivos = listarArquivos(["app", "components", "styles"], [".tsx", ".css"]);

for (const caminho of arquivos) {
  const original = ler(caminho);
  const conteudo = semComentarios(original);

  // ---------------------------------------------------------------------------
  // Combinações na mesma lista de classes: font-display + tamanho pequeno.
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

  // A varredura de CSS que existia aqui procurava blocos com
  // `font-family: var(--font-display)` e `font-weight` ≥ 600. Saiu junto com a
  // regra de peso: hoje o bloco que ela acusaria é justamente o certo — ver
  // `h1, h2` e `.font-display` em app/globals.css.
}

console.log(`\nBodoni Moda — ${arquivos.length} arquivos\n`);
relatar("bodoni", violacoes);
