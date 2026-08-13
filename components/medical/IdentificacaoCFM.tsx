import { getMedica } from "@/content";
import type { Superficie } from "@/content";

/**
 * Bloco de identificação obrigatório — Resolução CFM nº 2.336/2023, art. 3º.
 * Briefing § 3.1, spec § 3.3.
 *
 *   Lívia Sant'Anna — Médica — CRM-MG 83.288
 *   Otorrinolaringologia — RQE 70735
 *
 * A norma exige que fonte, tamanho e cor sejam OS MESMOS em todo o bloco, sem
 * alteração de tamanho e sem negrito. Este componente implementa isso
 * literalmente, e a implementação é a garantia:
 *
 *   - um único <p>, sem nenhum elemento filho;
 *   - um único nó de texto, com a quebra de linha vinda de `\n` +
 *     `white-space: pre-line` — não de <br>, não de dois parágrafos;
 *   - uma única lista de classes, com `font-normal` explícito (400);
 *   - a cor é escolhida por superfície, não por trecho.
 *
 * Não existe prop `className`. É deliberado: um `className` livre é o furo por
 * onde entrariam `font-bold`, `text-lg` ou um cinza claro no CRM — as três
 * violações que a norma nomeia. Se um contexto novo precisar de outra cor,
 * acrescente uma superfície ao mapa TOM e ao script de contraste, onde a
 * escolha fica medida e revisável.
 *
 * A mono é a espinha clínica do site (spec § 1): tudo que é fato verificável
 * aparece nela. O bloco normativo é o fato mais verificável de todos.
 *
 * Protegido por tests/unit/cfm.spec.tsx (estrutura) e tests/e2e/cfm.spec.ts
 * (getComputedStyle em toda rota de listarRotas()).
 */

/**
 * Designação profissional. Faz parte do bloco normativo e não é editorial —
 * por isso não vem de /content junto com o nome.
 */
const DESIGNACAO = "Médica";

/**
 * Marca do bloco no DOM.
 *
 * O teste e2e varre por este seletor em toda rota de listarRotas(). Ele está
 * escrito literalmente lá também — o teste de compliance não deve depender de
 * importar o componente que audita.
 */
export const SELETOR_CFM = '[data-cfm="identificacao"]';

/**
 * Uma cor por superfície. Todos os pares abaixo estão medidos em
 * scripts/verificar-contraste.ts e passam AA em texto corrido.
 */
const TOM: Record<Superficie, string> = {
  areia: "text-ink-600",
  "areia-100": "text-ink-600",
  vinho: "text-blush-200",
};

const ALINHAMENTO = {
  inicio: "text-left",
  centro: "text-center",
} as const;

type Props = {
  /** Superfície onde o bloco é renderizado. Decide a cor — nada mais decide. */
  readonly sobre?: Superficie;
  readonly alinhamento?: keyof typeof ALINHAMENTO;
};

export function IdentificacaoCFM({
  sobre = "areia",
  alinhamento = "inicio",
}: Props = {}) {
  const { nome, crm, especialidade, rqe } = getMedica().identificacao;

  // Um único nó de texto. A quebra é `\n` porque `white-space: pre-line` a
  // respeita sem introduzir um elemento no meio do bloco.
  const texto =
    `${nome} — ${DESIGNACAO} — ${crm}\n` + `${especialidade} — ${rqe}`;

  return (
    <p
      data-cfm="identificacao"
      className={`text-small font-mono font-normal whitespace-pre-line ${TOM[sobre]} ${ALINHAMENTO[alinhamento]}`}
    >
      {texto}
    </p>
  );
}
