/**
 * Termos proibidos pela Resolução CFM nº 2.336/2023 e pelo briefing.
 *
 * Este é o script de compliance mais importante do projeto. O site é peça de
 * publicidade médica; violação gera processo ético no CRM. A regra vira falha
 * de build porque revisão humana de texto não escala e não é confiável.
 *
 * Escopo: /content (todo o texto do site) e o texto literal em /app e
 * /components. Comentários são ignorados — este arquivo e os docs precisam
 * poder citar os termos que proíbem.
 *
 *   pnpm verify:termos
 *
 * ATENÇÃO: falso positivo se resolve na ALLOWLIST, com justificativa escrita.
 * Nunca afrouxando o padrão. Um regex frouxo aqui é um processo ético depois.
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
  /**
   * Quando o texto imediatamente anterior casa com isto, não é violação.
   *
   * Existe por um motivo específico: a seção "Riscos e limites" precisa poder
   * escrever "não existe cirurgia sem riscos", que é o oposto de uma promessa.
   * Bloquear a frase honesta junto com a desonesta empurraria o texto para o
   * eufemismo — exatamente o que a norma quer evitar.
   */
  excetoApos?: RegExp;
};

/** Os 80 caracteres anteriores ao match, para avaliar `excetoApos`. */
const JANELA_ANTERIOR = 80;

/** \p{L} para funcionar com acentuação; `u` obrigatório. */
const REGRAS: readonly Regra[] = [
  // ---------------------------------------------------------------------------
  // § 3.2 — superlativos e autopromoção
  //
  // O artigo definido é o que separa superlativo de comparativo: "a melhor
  // médica" é proibido, "dormir melhor" é descrição de desfecho clínico e é
  // exatamente o que o briefing § 8.4 escreve.
  // ---------------------------------------------------------------------------
  {
    padrao:
      /\b(?:[ao]s?\s+(?:melhor(?:es)?|maior(?:es)?)|mais\s+procurad[ao]s?|mais\s+experiente|número\s*1|nº\s*1|n\.?º\s*1)\b/giu,
    motivo: "Superlativo. Proibido pelo CFM 2.336/2023 art. 3º e pelo briefing § 3.2.",
  },
  {
    padrao: /\breferência\s+(?:em|n[oa]s?|para)\b|\bé\s+referência\b/giu,
    motivo: "Autopromoção por 'referência'. Proibido pelo briefing § 3.2.",
  },
  {
    padrao:
      /\b(?:premiad[ao]s?|renomad[ao]s?|conceituad[ao]s?|consagrad[ao]s?|top\s+\d|excelência\s+incomparável|incomparável|inigualável|imbatível)\b/giu,
    motivo: "Termo autopromocional. Proibido pelo briefing § 3.2.",
  },
  {
    padrao:
      /\b(?:líder|pioneir[ao]s?|únic[ao]\s+(?:médic[ao]|profissional|cirurgi)|exclusividade\s+d[ae]\s+técnica)\b/giu,
    motivo:
      "Reivindicação de liderança ou exclusividade de técnica. Proibido pelo briefing § 3.2.",
  },

  // ---------------------------------------------------------------------------
  // § 3.2 — promessa ou garantia de resultado
  //
  // A mais grave da lista. Nenhum resultado em medicina é garantido, e
  // prometê-lo é o caminho mais curto para um processo ético.
  // ---------------------------------------------------------------------------
  {
    padrao:
      /\b(?:garantid[ao]s?|garantia\s+de\s+(?:resultado|satisfação)|assegurad[ao]\s+resultado)\b/giu,
    motivo: "Promessa de resultado. Proibido pelo CFM 2.336/2023 e pelo briefing § 3.2.",
  },
  {
    padrao:
      /\b(?:d[oa]s?\s+seus\s+sonhos|nariz\s+perfeito|resultado\s+perfeito|rosto\s+perfeito|transformação\s+(?:garantida|total)|sem\s+riscos?|risco\s+zero|indolor)\b/giu,
    motivo: "Promessa implícita de resultado ou negação de risco. Proibido pelo briefing § 3.2.",
    excetoApos: /\b(?:não|nenhum[ao]?|nunca|jamais|inexiste)\b[^.!?]{0,60}$/iu,
  },
  {
    padrao: /\b100\s*%\s*(?:de\s+)?(?:satisfação|sucesso|natural|segur[ao])\b/giu,
    motivo: "Promessa quantificada de resultado. Proibido pelo briefing § 3.2.",
  },

  // ---------------------------------------------------------------------------
  // § 3.2 — sensacionalismo e escassez artificial
  // ---------------------------------------------------------------------------
  {
    padrao:
      /\b(?:últimas?\s+vagas?|vagas?\s+limitadas?|por\s+tempo\s+limitado|corra|não\s+perca|aproveite\s+(?:agora|já)|imperdível|promoção|desconto|oferta\s+especial|condição\s+especial)\b/giu,
    motivo:
      "Escassez artificial ou tom de propaganda agressiva. Proibido pelo CFM 2.336/2023 e pelo briefing § 3.2.",
  },

  // ---------------------------------------------------------------------------
  // § 3.2 — título de cirurgiã plástica
  //
  // O RQE dela é em Otorrinolaringologia (RQE 70735). Ela REALIZA cirurgia
  // plástica da face dentro do escopo da especialidade. Usar o título é
  // exercício irregular de especialidade perante o CFM.
  //
  // "cirurgia plástica da face" é o campo de atuação, permitido e esperado.
  // "cirurgiã plástica" é o título, proibido. O til é o que separa os dois:
  // cirurgiA é o procedimento, cirurgiÃ é a pessoa.
  // ---------------------------------------------------------------------------
  {
    padrao: /\bcirurgi(?:ã|ão|ãs|ões)\s+plástic[ao]s?\b/giu,
    motivo:
      "Título de cirurgiã plástica. O RQE é em Otorrinolaringologia. " +
      "Escreva 'otorrinolaringologista, com atuação em cirurgia plástica da face'.",
  },
  {
    padrao: /\bcirurgi(?:a|ao|as|oes)\s+plastic[ao]s?\b(?!\s+d[ae]\s+face)/giu,
    motivo:
      "Grafia sem acento. Se a intenção era o título, é proibido; se era o " +
      "campo, escreva 'cirurgia plástica da face' com acento.",
  },
  {
    padrao: /\bespecialista\s+em\s+cirurgia\s+plástica\b/giu,
    motivo:
      "Atribui especialidade que ela não tem registrada. Ver briefing § 3.2.",
  },

  // ---------------------------------------------------------------------------
  // § 15 — anti-padrões de interface
  // ---------------------------------------------------------------------------
  {
    padrao: /\b(?:saiba\s+mais|clique\s+aqui|leia\s+mais|veja\s+mais)\b/giu,
    motivo:
      "Copy de botão vaga. O botão diz o que acontece: 'Agendar consulta', " +
      "'Ver procedimentos de otorrino'. Briefing § 6 e § 15.",
  },
  {
    padrao:
      /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}\u{2190}-\u{21FF}\u{2B00}-\u{2BFF}]/gu,
    motivo: "Emoji na interface. Proibido pelo briefing § 15.",
  },
];

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
    arquivo: "scripts/verificar-termos.ts",
    contem: "",
    porque: "Este arquivo contém os próprios termos que proíbe.",
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

  for (const regra of REGRAS) {
    for (const match of conteudo.matchAll(regra.padrao)) {
      if (match.index === undefined) continue;

      if (regra.excetoApos) {
        const anterior = conteudo.slice(
          Math.max(0, match.index - JANELA_ANTERIOR),
          match.index,
        );
        if (regra.excetoApos.test(anterior)) continue;
      }

      const violacao = violacaoEm(
        caminho,
        original,
        match.index,
        `"${match[0].trim()}" — ${regra.motivo}`,
      );

      if (dispensado(violacao.arquivo, violacao.trecho)) continue;
      violacoes.push(violacao);
    }
  }
}

console.log(`\nTermos proibidos (CFM 2.336/2023) — ${arquivos.length} arquivos\n`);
relatar("termos", violacoes);
