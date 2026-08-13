import type { PassoConsulta } from "@/content/tipos";
import { cn } from "./cn";
import { Filete } from "./Filete";
import { Nota } from "./Nota";

/**
 * Passos — a jornada da consulta, 01 a 04.
 *
 * Numerado **porque é sequência real** (§ 6). Não é a grade de três ícones de
 * linha com título e um parágrafo cada que o § 15 manda refazer: aqui a ordem
 * significa alguma coisa, e por isso o markup é `<ol>` e os números aparecem.
 *
 * Os números vão em mono, com dois dígitos. Zero à esquerda é o que faz "01" e
 * "04" ocuparem a mesma largura e a coluna alinhar — e é o que o conteúdo já
 * entrega, porque `PassoConsulta.numero` é string, não number.
 *
 * Layout assimétrico (§ 5.4): número numa coluna estreita à esquerda, texto
 * numa coluna larga que não passa da medida de leitura. Nada centralizado.
 */

type Props = {
  readonly passos: readonly PassoConsulta[];
  /** O fecho em mono do § 8.7. Vai como Nota, no mesmo lugar sempre. */
  readonly fecho?: string;
  readonly className?: string;
};

export function Passos({ passos, fecho, className }: Props) {
  if (passos.length === 0) {
    return null;
  }

  return (
    <div className={cn("flex flex-col gap-12", className)}>
      <ol className="flex list-none flex-col">
        {passos.map((passo, indice) => (
          <li key={passo.numero}>
            {indice > 0 ? <Filete /> : null}

            <div className="grid grid-cols-[3.5rem_1fr] gap-x-6 gap-y-3 py-8 md:grid-cols-[7rem_1fr] md:gap-x-10">
              <span
                aria-hidden="true"
                className="text-micro text-ink-400 [[data-superficie=vinho]_&]:text-wine-300 font-mono tracking-[0.14em]"
              >
                {passo.numero}
              </span>

              <h3 className="font-body text-h3 font-medium">
                <span className="sr-only">{`Passo ${passo.numero}: `}</span>
                {passo.titulo}
              </h3>

              <p className="text-body text-ink-600 [[data-superficie=vinho]_&]:text-sand-50 col-start-2 max-w-[46ch]">
                {passo.descricao}
              </p>
            </div>
          </li>
        ))}
      </ol>

      {fecho !== undefined ? <Nota tom="atencao">{fecho}</Nota> : null}
    </div>
  );
}
