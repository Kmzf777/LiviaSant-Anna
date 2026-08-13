import { Botao } from "@/components/ui/Botao";
import { Container } from "@/components/ui/Container";
import { FAQ } from "@/components/ui/FAQ";
import { Filete } from "@/components/ui/Filete";
import { Reveal } from "@/components/ui/Reveal";
import { Secao } from "@/components/ui/Secao";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { CTA_AGENDAR } from "@/content/nav";
import type { Medica, PerguntaResposta } from "@/content/tipos";

/**
 * § 8.9 — FAQ transversal e fecho da página. Areia.
 *
 * Dois blocos numa seção só, separados por um filete: as perguntas que valem
 * para qualquer motivo de consulta e, logo abaixo, a ação. A FAQ é a última
 * objeção; o CTA responde a ela na mesma respiração.
 *
 * ## `<details>` nativo, e o que vem de graça com ele
 *
 * Teclado, `Ctrl+F` do navegador, funcionamento sem JavaScript e a resposta
 * dentro do HTML mesmo com o item fechado — o que importa numa página onde a
 * pessoa procura uma dúvida específica sobre a própria cirurgia, e o que faz o
 * `FAQPage` do JSON-LD corresponder ao que está visível.
 *
 * ## As perguntas pendentes não aparecem
 *
 * `content/faq.ts` tem uma resposta ainda em `[CONFIRMAR]` (convênios). Ela é
 * filtrada aqui e no JSON-LD pela mesma função, `ehPendente`. Mostrar o
 * colchete ao paciente seria pior do que a pergunta faltar, e o texto está
 * registrado em PENDENCIAS.md — some da página, não do backlog.
 *
 * ## O fecho
 *
 * O corpo do bloco de contato é a `descricaoAtuacao` e a cidade, direto de
 * `/content`: a formulação autorizada, palavra por palavra, e um fato. Nada de
 * frase de encerramento inventada — o site termina como começou, dizendo o que
 * ela faz e onde.
 */

type Props = {
  readonly perguntas: readonly PerguntaResposta[];
  readonly medica: Medica;
};

export function PerguntasEContato({ perguntas, medica }: Props) {
  return (
    <Secao superficie="areia" aria-labelledby="faq-titulo">
      <Container>
        <div className="grid gap-y-14 lg:grid-cols-12 lg:gap-x-[var(--gutter)]">
          <div className="lg:col-span-4">
            <SectionTitle
              id="faq-titulo"
              eyebrow="Dúvidas frequentes"
              as="h2"
              tamanho="h2"
            >
              Perguntas antes da consulta
            </SectionTitle>
          </div>

          <Reveal className="lg:col-span-7 lg:col-start-6">
            <FAQ itens={perguntas} idBase="faq-home" />
          </Reveal>
        </div>

        <Reveal className="mt-[var(--secao-y)]">
          <Filete />

          <div className="mt-14 grid gap-y-10 lg:grid-cols-12 lg:gap-x-[var(--gutter)]">
            <div className="lg:col-span-5">
              <SectionTitle eyebrow="Contato" as="h2" tamanho="h2">
                Marcar uma consulta
              </SectionTitle>
            </div>

            <div className="lg:col-span-6 lg:col-start-7">
              <p className="medida text-lead text-ink-600">
                {medica.descricaoAtuacao}. {medica.cidade}.
              </p>

              <div className="mt-10 flex flex-wrap items-center gap-x-10 gap-y-6">
                <Botao href={CTA_AGENDAR.href}>{CTA_AGENDAR.texto}</Botao>
                <Botao href="/consultorio" variante="filete">
                  Ver onde atendo
                </Botao>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </Secao>
  );
}
