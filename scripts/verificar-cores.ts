/**
 * Proíbe as decisões visuais que o briefing (§ 5.2, § 5.6, § 15) veta.
 *
 * Preto e branco puros achatam a paleta quente que veio do logo e das fotos.
 * Gradiente colorido, glassmorphism e sombra colorida são o vocabulário do
 * site gerado por IA em 2026 — o oposto do que esta direção quer ser.
 * `outline: none` quebra a navegação por teclado.
 *
 *   pnpm verify:cores
 */

import {
  listarArquivos,
  ler,
  relatar,
  semComentarios,
  violacaoEm,
  type Violacao,
} from "./_util";

type Regra = {
  padrao: RegExp;
  motivo: string;
};

const REGRAS: readonly Regra[] = [
  {
    padrao: /#(?:000000|000)\b/gi,
    motivo:
      "Preto puro é proibido. A tinta do site é ink-900 (#241A1E), um quase-preto quente.",
  },
  {
    padrao: /#(?:ffffff|fff)\b/gi,
    motivo:
      "Branco puro é proibido. O fundo do site é sand-50 (#F6F1EC), amostrado das fotos.",
  },
  {
    padrao: /\b(?:rgb|hsl)a?\(\s*0\s*[, ]\s*0\s*[, ]\s*0\s*[,)]/gi,
    motivo: "Preto puro em rgb()/hsl(). Use var(--color-ink-900).",
  },
  {
    padrao: /\b(?:rgb)a?\(\s*255\s*[, ]\s*255\s*[, ]\s*255\s*[,)]/gi,
    motivo: "Branco puro em rgb(). Use var(--color-sand-50).",
  },
  {
    padrao: /\bbg-(?:black|white)\b|\btext-(?:black|white)\b|\bborder-(?:black|white)\b/g,
    motivo:
      "Utilitário Tailwind de preto/branco puro. Use os tokens da paleta (sand, ink, wine, blush).",
  },
  {
    padrao: /\b(?:linear|radial|conic)-gradient\s*\(/g,
    motivo:
      "Gradiente é proibido. Profundidade vem de troca de superfície e de filete. " +
      "A única exceção é o underline de .link-filete, que usa currentColor sólido.",
  },
  {
    padrao: /\bbg-gradient-to-|\bbg-linear-to-/g,
    motivo: "Gradiente via Tailwind. Ver acima.",
  },
  {
    padrao: /\bbackdrop-filter\s*:|\bbackdrop-blur\b/g,
    motivo: "Glassmorphism é proibido (§ 15).",
  },
  {
    padrao: /\boutline\s*:\s*(?:none|0)\b/g,
    motivo:
      "`outline: none` remove o foco visível. Use :focus-visible com o filete " +
      "vinho de 2px definido em app/globals.css.",
  },
  {
    padrao: /\bbox-shadow\s*:\s*(?![^;]*\bnone\b)[^;]*(?:#[0-9a-f]{3,8}|rgba?\(|hsla?\()/gi,
    motivo:
      "Sombra colorida é proibida. A única sombra do site é --sombra-header, " +
      "que usa var(--color-sand-200) como filete de 1px.",
  },
  {
    padrao: /\bshadow-(?:sm|md|lg|xl|2xl)\b/g,
    motivo:
      "Sombra do Tailwind. Elevação vem de superfície e filete, não de sombra (§ 5.6).",
  },
  {
    padrao: /\brounded-full\b|\bborder-radius\s*:\s*9999px/g,
    motivo:
      "Sem pílula. Botões e cards usam --radius-filete (2px); o arco é " +
      "exclusivo de retrato. Exceção: o selo circular do footer, que deve " +
      "usar a classe .selo (allowlist abaixo).",
  },
];

/**
 * Linhas dispensadas, com justificativa. Falso positivo se resolve aqui,
 * nunca afrouxando o regex.
 */
const ALLOWLIST: readonly { arquivo: string; contem: string; porque: string }[] =
  [
    {
      arquivo: "app/globals.css",
      contem: "linear-gradient(currentColor, currentColor)",
      porque:
        "Não é gradiente: são duas paradas da mesma cor, a técnica padrão " +
        "para animar um underline por background-size. Nenhuma cor nova entra.",
    },
    {
      arquivo: "scripts/verificar-cores.ts",
      contem: "",
      porque: "Este arquivo contém os próprios padrões proibidos.",
    },
  ];

function dispensado(arquivo: string, trecho: string): boolean {
  return ALLOWLIST.some(
    (item) =>
      arquivo === item.arquivo &&
      (item.contem === "" || trecho.includes(item.contem)),
  );
}

const arquivos = listarArquivos(
  ["app", "components", "styles", "lib", "content", "scripts"],
  [".css", ".ts", ".tsx", ".mjs"],
);

const violacoes: Violacao[] = [];

for (const caminho of arquivos) {
  const original = ler(caminho);
  const conteudo = semComentarios(original);

  for (const regra of REGRAS) {
    for (const match of conteudo.matchAll(regra.padrao)) {
      if (match.index === undefined) continue;

      const violacao = violacaoEm(caminho, original, match.index, regra.motivo);
      if (dispensado(violacao.arquivo, violacao.trecho)) continue;

      violacoes.push(violacao);
    }
  }
}

console.log(`\nCores e elevação — ${arquivos.length} arquivos\n`);
relatar("cores", violacoes);
