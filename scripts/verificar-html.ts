/**
 * Varre o HTML **construído** em busca do que nunca pode chegar ao paciente.
 *
 * Os outros verificadores leem código-fonte. Este lê o resultado, e por isso
 * pega uma classe de erro que nenhum deles alcança: um marcador de pendência
 * que existe legitimamente no conteúdo, atravessa componentes e sai renderizado.
 *
 * Foi escrito depois de oito páginas publicarem
 *   "[CONFIRMAR: convênios atendidos e política de reembolso]"
 * no corpo do texto. Cada arquivo, isoladamente, estava certo: o conteúdo
 * marca o que falta, e é assim que deve ser. O erro estava na costura, que é
 * exatamente onde revisão por leitura não chega.
 *
 *   pnpm build && pnpm verify:html
 */

import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";

import { RAIZ, relatar, type Violacao } from "./_util";

const DIRETORIO = join(RAIZ, ".next", "server", "app");

type Regra = { padrao: RegExp; motivo: string };

const REGRAS: readonly Regra[] = [
  {
    padrao: /\[\s*CONFIRMAR[^\]]{0,200}\]?/g,
    motivo:
      "Marcador de pendência renderizado. O conteúdo pode e deve marcar o que " +
      "falta, mas o componente precisa filtrar antes de exibir — use `ehPendente` " +
      "de lib/jsonld.ts, ou renderize um bloco de pendência explícito.",
  },
  {
    padrao: /\bIMAGEM PENDENTE\b/g,
    motivo:
      "Placeholder de imagem em produção. Na v1 isso é esperado enquanto as " +
      "fotos não chegam (PENDENCIAS.md § 5) — mas precisa ser decisão consciente, " +
      "não descuido. Ver a ALLOWLIST deste script.",
  },
  {
    padrao: /\blorem ipsum\b/gi,
    motivo: "Texto de preenchimento.",
  },
  {
    padrao: /\bTODO\b|\bFIXME\b/g,
    motivo: "Marcador de trabalho pendente visível na página.",
  },
];

/**
 * Dispensas conscientes.
 *
 * A regra é a mesma dos outros verificadores: a dispensa explica por que aquilo
 * é aceitável para quem lê a página, não por que é chato de consertar.
 */
const ALLOWLIST: readonly { padrao: RegExp; porque: string }[] = [
  {
    padrao: /\bIMAGEM PENDENTE\b/,
    porque:
      "A v1 sai sem as fotos originais (PENDENCIAS.md § 5). O placeholder é " +
      "deliberadamente honesto sobre a ausência, e a alternativa — foto de " +
      "banco de imagens — destruiria a credibilidade que as fotos reais " +
      "constroem. Remova esta dispensa quando as fotos chegarem.",
  },
];

function listarHtml(dir: string): string[] {
  const achados: string[] = [];

  const percorrer = (atual: string): void => {
    let entradas: string[];
    try {
      entradas = readdirSync(atual);
    } catch {
      return;
    }

    for (const entrada of entradas) {
      const caminho = join(atual, entrada);
      if (statSync(caminho).isDirectory()) percorrer(caminho);
      else if (entrada.endsWith(".html")) achados.push(caminho);
    }
  };

  percorrer(dir);
  return achados.sort();
}

const arquivos = listarHtml(DIRETORIO);

if (arquivos.length === 0) {
  console.error(
    `\nFALHA  nenhum HTML em ${relative(RAIZ, DIRETORIO).split(sep).join("/")}.` +
      `\n       Rode \`pnpm build\` antes de \`pnpm verify:html\`.\n`,
  );
  process.exit(1);
}

const violacoes: Violacao[] = [];

for (const caminho of arquivos) {
  const html = readFileSync(caminho, "utf8");

  for (const regra of REGRAS) {
    const vistos = new Set<string>();

    for (const match of html.matchAll(regra.padrao)) {
      const trecho = match[0];
      if (ALLOWLIST.some((item) => item.padrao.test(trecho))) continue;

      // Uma linha por ocorrência distinta: a mesma pendência costuma aparecer
      // várias vezes na página (texto visível + JSON-LD) e listar todas só
      // esconde as outras.
      if (vistos.has(trecho)) continue;
      vistos.add(trecho);

      violacoes.push({
        arquivo: relative(RAIZ, caminho).split(sep).join("/"),
        linha: 0,
        trecho: trecho.length > 110 ? `${trecho.slice(0, 107)}…` : trecho,
        motivo: regra.motivo,
      });
    }
  }
}

console.log(`\nHTML construído — ${arquivos.length} páginas\n`);
relatar("html", violacoes);
