import type { MinTres, RiscoOuLimite } from "@/content";

/**
 * Riscos e limites — briefing § 8.10, obrigatório em toda página de
 * procedimento.
 *
 * "A seção 'Riscos e limites' não é rodapé jurídico: é a peça de maior
 * conversão do site. Um médico que escreve honestamente sobre risco ganha
 * mais confiança do que um que promete resultado."
 *
 * O tratamento tipográfico segue essa leitura ao pé da letra e é o principal
 * requisito deste componente:
 *
 *   - título em display, no mesmo tamanho de qualquer H2 do site;
 *   - descrição em `text-body` e `ink-900` — o mesmo corpo e a mesma tinta do
 *     texto que vende a cirurgia, não um cinza de nota de rodapé;
 *   - conteúdo aberto, nunca dentro de <details> fechado;
 *   - separação por filete, na mesma linguagem do resto (§ 5.6).
 *
 * Não há numeração. `Passos` é numerado porque a consulta é uma sequência
 * real (§ 6); risco não é sequência, e numerar aqui seria a decoração que o
 * briefing veta.
 *
 * O mínimo de três itens vem do tipo `MinTres` em content/tipos.ts: uma página
 * de procedimento com dois riscos não compila.
 */

const TITULO_PADRAO = "Riscos e limites";

/**
 * Fecho padrão. Vale para todo procedimento cirúrgico e fecha o buraco de uma
 * página que listasse riscos sem remeter à consulta e ao consentimento.
 */
const NOTA_PADRAO =
  "Toda cirurgia envolve riscos. Eles são avaliados caso a caso na consulta, " +
  "onde entram a sua anatomia, o seu histórico e o que é possível esperar, " +
  "e ficam registrados no termo de consentimento antes de qualquer decisão.";

type Props = {
  readonly riscos: MinTres<RiscoOuLimite>;
  readonly eyebrow?: string;
  readonly titulo?: string;
  /** Passe `null` só se a página já fechar a seção com texto próprio. */
  readonly nota?: string | null;
  /** Muda apenas se houver duas seções de riscos na mesma página. */
  readonly idBase?: string;
};

export function RiscosELimites({
  riscos,
  eyebrow,
  titulo = TITULO_PADRAO,
  nota = NOTA_PADRAO,
  idBase = "riscos-e-limites",
}: Props) {
  const idTitulo = `${idBase}-titulo`;

  return (
    <section aria-labelledby={idTitulo} className="w-full">
      {eyebrow ? (
        <p className="text-micro text-ink-400 mb-5 font-mono uppercase">
          {eyebrow}
        </p>
      ) : null}

      <h2 id={idTitulo} className="font-display text-h2 text-ink-900">
        {titulo}
      </h2>

      <ul className="border-sand-200 mt-12 border-t">
        {riscos.map((risco) => (
          <li
            key={risco.titulo}
            className="border-sand-200 grid gap-x-10 gap-y-3 border-b py-8 md:grid-cols-[minmax(0,14rem)_minmax(0,1fr)]"
          >
            <h3 className="text-h3 text-ink-900">{risco.titulo}</h3>
            <p className="medida text-body text-ink-900">{risco.descricao}</p>
          </li>
        ))}
      </ul>

      {nota ? (
        <p className="medida text-small text-ink-600 mt-10 font-mono">{nota}</p>
      ) : null}
    </section>
  );
}
