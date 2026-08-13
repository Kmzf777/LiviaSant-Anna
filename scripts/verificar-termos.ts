/**
 * Termos proibidos pela Resolução CFM nº 2.336/2023 e pelo briefing.
 *
 * Este é o script de compliance mais importante do projeto. O site é peça de
 * publicidade médica; violação gera processo ético no CRM. A regra vira falha
 * de build porque revisão humana de texto não escala e não é confiável.
 *
 * As regras propriamente ditas vivem em `lib/termos-proibidos.ts`, para poderem
 * ser testadas diretamente — ver `tests/unit/termos.spec.ts`, que cobre tanto
 * falso negativo quanto falso positivo. Aqui fica só a varredura de arquivos e
 * a allowlist.
 *
 * Escopo: /content (todo o texto do site) e o texto literal em /app, /components
 * e /lib. Comentários são ignorados — este projeto precisa poder citar em
 * comentário os termos que proíbe.
 *
 *   pnpm verify:termos
 */

import { encontrarTermosProibidos } from "../lib/termos-proibidos";
import {
  listarArquivos,
  ler,
  relatar,
  semComentarios,
  violacaoEm,
  type Violacao,
} from "./_util";

/**
 * Dispensas com justificativa escrita.
 *
 * Regra de ouro: a dispensa precisa explicar por que o texto NÃO é publicidade
 * enganosa naquele contexto. "É só uma palavra" não é justificativa.
 */
const ALLOWLIST: readonly {
  arquivo: string;
  contem: string;
  porque: string;
}[] = [
  {
    arquivo: "lib/termos-proibidos.ts",
    contem: "",
    porque: "Este arquivo define os próprios termos que proíbe.",
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
  ["content", "app", "components", "lib"],
  [".ts", ".tsx"],
);

const violacoes: Violacao[] = [];

for (const caminho of arquivos) {
  const original = ler(caminho);
  const conteudo = semComentarios(original);

  for (const encontrado of encontrarTermosProibidos(conteudo)) {
    const violacao = violacaoEm(
      caminho,
      original,
      encontrado.indice,
      `"${encontrado.termo}" — ${encontrado.motivo}`,
    );

    if (dispensado(violacao.arquivo, violacao.trecho)) continue;
    violacoes.push(violacao);
  }
}

console.log(
  `\nTermos proibidos (CFM 2.336/2023) — ${arquivos.length} arquivos\n`,
);
relatar("termos", violacoes);
