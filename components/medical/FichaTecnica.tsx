import type { FichaTecnica as DadosFichaTecnica } from "@/content";

/**
 * Ficha técnica de um procedimento — briefing § 6 e § 8.10.
 *
 * Quatro fatos em mono: duração, anestesia, internação, retorno social. A mono
 * é a espinha clínica do site (spec § 1) — é ela que separa fato verificável
 * de persuasão, e o leitor aprende a diferença sem que ninguém explique.
 *
 * Compliance: o disclaimer é embutido, não opcional. Números de duração e de
 * retorno social sem a ressalva de que variam por paciente são promessa
 * implícita de resultado, proibida pela Resolução CFM 2.336/2023. O tipo
 * `FichaTecnica` já exige o campo; aqui o invariante exige que ele diga
 * alguma coisa.
 *
 * Semântica: `<table>` de verdade, com `<th scope="row">`. Um leitor de tela
 * anuncia "Anestesia, sedação com bloqueio local" em vez de duas frases soltas.
 * Uma grade de divs perderia essa relação — e é justamente a relação entre
 * rótulo e valor que faz a ficha ser informação clínica e não decoração.
 */

/** O disclaimer precisa ser uma frase, não um rótulo. */
const MINIMO_DISCLAIMER = 20;

type Linha = {
  readonly rotulo: string;
  readonly valor: (ficha: DadosFichaTecnica) => string;
};

/**
 * A ordem é a do briefing § 8.10 e não muda entre procedimentos: quem lê duas
 * páginas encontra os mesmos quatro fatos no mesmo lugar.
 */
const LINHAS: readonly Linha[] = [
  { rotulo: "Duração", valor: (f) => f.duracao },
  { rotulo: "Anestesia", valor: (f) => f.anestesia },
  { rotulo: "Internação", valor: (f) => f.internacao },
  { rotulo: "Retorno social", valor: (f) => f.retornoSocial },
];

type Props = {
  readonly ficha: DadosFichaTecnica;
  /** Legenda da tabela. Visível, em mono. */
  readonly titulo?: string;
  /**
   * Base do id que liga a tabela ao disclaimer via `aria-describedby`.
   * Só precisa mudar se houver duas fichas na mesma página.
   */
  readonly idBase?: string;
};

export function FichaTecnica({
  ficha,
  titulo = "Ficha técnica",
  idBase = "ficha-tecnica",
}: Props) {
  if (ficha.disclaimer.trim().length < MINIMO_DISCLAIMER) {
    throw new Error(
      "FichaTecnica: disclaimer ausente ou vazio. Duração, internação e " +
        "retorno social sem a ressalva de que variam por paciente viram " +
        "promessa implícita de resultado — proibida pela Resolução CFM " +
        "2.336/2023.",
    );
  }

  const idDisclaimer = `${idBase}-disclaimer`;

  return (
    <div className="w-full">
      <table
        aria-describedby={idDisclaimer}
        className="w-full border-collapse text-left"
      >
        <caption className="text-micro text-ink-400 pb-5 text-left font-mono uppercase">
          {titulo}
        </caption>

        <tbody>
          {LINHAS.map((linha) => (
            <tr key={linha.rotulo} className="border-sand-200 border-t">
              <th
                scope="row"
                className="text-micro text-ink-400 w-[42%] py-5 pr-6 align-baseline font-mono font-normal uppercase sm:w-[32%]"
              >
                {linha.rotulo}
              </th>
              <td className="text-small text-ink-900 py-5 align-baseline font-mono">
                {linha.valor(ficha)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <p
        id={idDisclaimer}
        className="medida border-sand-200 text-small text-ink-600 mt-6 border-t pt-6 font-mono"
      >
        {ficha.disclaimer}
      </p>
    </div>
  );
}
