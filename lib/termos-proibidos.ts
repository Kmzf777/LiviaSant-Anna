/**
 * Regras de termos proibidos pela Resolução CFM nº 2.336/2023 e pelo briefing.
 *
 * Vive em `lib/` e não em `scripts/` para poder ser testado diretamente. O
 * script `scripts/verificar-termos.ts` varre arquivos e aplica a allowlist;
 * aqui fica só a decisão sobre um trecho de texto.
 *
 * Um gate de compliance tem duas formas de falhar, e as duas são graves:
 *
 *   Falso NEGATIVO — deixa passar publicidade irregular. Consequência:
 *   processo ético no CRM.
 *
 *   Falso POSITIVO — reprova texto legítimo. Consequência menos óbvia e quase
 *   pior: empurra quem escreve para o eufemismo, ou faz alguém desligar o gate.
 *   Um verificador em que ninguém confia não protege ninguém.
 *
 * Por isso as regras têm `excetoApos` e lookaheads de exclusão, e por isso
 * `tests/unit/termos.spec.ts` cobre as duas direções.
 *
 * REGRA DE MANUTENÇÃO: falso positivo se resolve na ALLOWLIST do script, com
 * justificativa escrita, ou por um recorte cirúrgico aqui acompanhado de teste.
 * Nunca afrouxando o padrão no geral. Um regex frouxo aqui é um processo ético
 * depois.
 */

export type RegraDeTermo = {
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

/** Os caracteres anteriores ao match considerados por `excetoApos`. */
export const JANELA_ANTERIOR = 80;

export const REGRAS: readonly RegraDeTermo[] = [
  // ---------------------------------------------------------------------------
  // § 3.2 — superlativos e autopromoção
  //
  // O artigo definido separa superlativo de comparativo: "a melhor médica" é
  // proibido, "dormir melhor" é descrição de desfecho clínico e é exatamente o
  // que o briefing § 8.4 escreve.
  //
  // O lookahead de quantidade existe porque "a maior parte das pessoas" é
  // expressão de frequência, não alegação sobre ela. Sem ele, o script
  // reprovava texto clínico correto.
  // ---------------------------------------------------------------------------
  {
    padrao:
      /\b(?:[ao]s?\s+(?:melhor(?:es)?|maior(?:es)?)(?!\s+(?:parte|parcela|número|quantidade|frequência|risco|chance)\b)|mais\s+procurad[ao]s?|mais\s+experiente|número\s*1|nº\s*1|n\.?º\s*1)\b/giu,
    motivo:
      "Superlativo. Proibido pelo CFM 2.336/2023 art. 3º e pelo briefing § 3.2.",
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
    motivo:
      "Promessa de resultado. Proibido pelo CFM 2.336/2023 e pelo briefing § 3.2.",
  },
  {
    padrao:
      /\b(?:d[oa]s?\s+seus\s+sonhos|nariz\s+perfeito|resultado\s+perfeito|rosto\s+perfeito|transformação\s+(?:garantida|total)|sem\s+riscos?|risco\s+zero|indolor)\b/giu,
    motivo:
      "Promessa implícita de resultado ou negação de risco. Proibido pelo briefing § 3.2.",
    excetoApos: /\b(?:não|nenhum[ao]?|nunca|jamais|inexiste)\b[^.!?]{0,60}$/iu,
  },
  {
    padrao:
      /\b100\s*%\s*(?:de\s+)?(?:satisfação|sucesso|natural|segur[ao])\b/giu,
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
  // O til separa os dois casos: cirurgiA é o procedimento e é permitido;
  // cirurgiÃ é a pessoa e é proibido.
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
    motivo: "Atribui especialidade que ela não tem registrada. Ver briefing § 3.2.",
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
    // Faixas de emoji e pictogramas. Deliberadamente NÃO inclui travessão,
    // aspas curvas nem outros sinais tipográficos: o bloco CFM usa travessão e
    // as citações usam aspas curvas. Um padrão que pegasse pontuação reprovaria
    // metade do site.
    padrao:
      /[\u{1F300}-\u{1FAFF}\u{1F000}-\u{1F0FF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{FE0F}\u{2190}-\u{21FF}]/gu,
    motivo: "Emoji na interface. Proibido pelo briefing § 15.",
  },
];

export type TermoEncontrado = {
  /** Índice do caractere onde o termo começa. */
  indice: number;
  termo: string;
  motivo: string;
};

/** Aplica todas as regras a um trecho de texto já sem comentários. */
export function encontrarTermosProibidos(
  conteudo: string,
): readonly TermoEncontrado[] {
  const encontrados: TermoEncontrado[] = [];

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

      encontrados.push({
        indice: match.index,
        termo: match[0].trim(),
        motivo: regra.motivo,
      });
    }
  }

  return encontrados;
}
