/**
 * Utilidades compartilhadas pelos scripts de verificação.
 *
 * Estes scripts são o mecanismo que transforma as regras do briefing e da
 * Resolução CFM 2.336/2023 em falha de build. Documento não impede violação;
 * build quebrado impede.
 */

import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";

export const RAIZ = join(import.meta.dirname, "..");

const IGNORAR = new Set([
  "node_modules",
  ".next",
  ".git",
  "playwright-report",
  "test-results",
  "docs",
  "app/fonts",
]);

/** Lista arquivos com as extensões dadas, sob os diretórios dados. */
export function listarArquivos(
  diretorios: readonly string[],
  extensoes: readonly string[],
): string[] {
  const encontrados: string[] = [];

  const percorrer = (dir: string): void => {
    let entradas: string[];
    try {
      entradas = readdirSync(dir);
    } catch {
      return; // diretório ainda não existe nesta fase
    }

    for (const entrada of entradas) {
      const caminho = join(dir, entrada);
      const relativo = relative(RAIZ, caminho).split(sep).join("/");

      if (IGNORAR.has(entrada) || IGNORAR.has(relativo)) continue;

      if (statSync(caminho).isDirectory()) {
        percorrer(caminho);
      } else if (extensoes.some((ext) => entrada.endsWith(ext))) {
        encontrados.push(caminho);
      }
    }
  };

  for (const dir of diretorios) {
    percorrer(join(RAIZ, dir));
  }

  return encontrados.sort();
}

export function ler(caminho: string): string {
  return readFileSync(caminho, "utf8");
}

export function caminhoRelativo(caminho: string): string {
  return relative(RAIZ, caminho).split(sep).join("/");
}

export type Violacao = {
  arquivo: string;
  linha: number;
  trecho: string;
  motivo: string;
};

/** Constrói uma violação a partir de um índice de caractere no arquivo. */
export function violacaoEm(
  caminho: string,
  conteudo: string,
  indice: number,
  motivo: string,
): Violacao {
  const antes = conteudo.slice(0, indice);
  const linha = antes.split("\n").length;
  const inicioDaLinha = antes.lastIndexOf("\n") + 1;
  const fimDaLinha = conteudo.indexOf("\n", indice);

  const trecho = conteudo
    .slice(inicioDaLinha, fimDaLinha === -1 ? undefined : fimDaLinha)
    .trim();

  return {
    arquivo: caminhoRelativo(caminho),
    linha,
    trecho: trecho.length > 110 ? `${trecho.slice(0, 107)}…` : trecho,
    motivo,
  };
}

/** Remove comentários para não acusar violação em texto explicativo. */
export function semComentarios(conteudo: string): string {
  return conteudo
    .replace(/\/\*[\s\S]*?\*\//g, (m) => " ".repeat(m.length))
    .replace(/(^|[^:])\/\/[^\n]*/g, (m, p1: string) =>
      p1 + " ".repeat(m.length - p1.length),
    );
}

export function relatar(titulo: string, violacoes: readonly Violacao[]): never {
  if (violacoes.length === 0) {
    console.log(`  OK  ${titulo}`);
    process.exit(0);
  }

  console.error(`\nFALHA  ${titulo} — ${violacoes.length} violação(ões)\n`);

  for (const v of violacoes) {
    console.error(`  ${v.arquivo}:${v.linha}`);
    console.error(`    ${v.motivo}`);
    console.error(`    ${v.trecho}\n`);
  }

  process.exit(1);
}
