import { RailLateral } from "@/components/layout/RailLateral";
import { Container } from "@/components/ui/Container";
import { Passos } from "@/components/ui/Passos";
import { Reveal } from "@/components/ui/Reveal";
import { Secao } from "@/components/ui/Secao";
import { SectionTitle } from "@/components/ui/SectionTitle";
import type { ConteudoHome } from "@/content/tipos";
import { RITMO_SECAO } from "./ritmo";

/**
 * § 8.7 — Como é a consulta. Areia-100, componente `Passos`.
 *
 * Numerado 01–04 porque é sequência real: a pessoa faz a etapa 1 antes da 2, e
 * a última é "decidir, inclusive por não operar". Numeração como enfeite é o
 * que o § 15 manda refazer; numeração como cronologia é a razão de o markup
 * ser `<ol>`.
 *
 * O título fica grudado no topo enquanto os quatro passos passam ao lado. Não
 * é animação — é `position: sticky`, layout puro, e por isso não consome nada
 * do orçamento fechado do § 5.7. Ele resolve um problema real: a lista é longa
 * e, sem a âncora, o leitor chega ao passo 04 sem lembrar do que é a lista.
 *
 * O sticky cria stacking context própria, o que seria fatal numa `Secao`
 * (esconderia o Traço). Aqui é seguro: mora dentro do `Container`, que já é
 * `z-[2]` — a camada onde o texto sempre fica por cima da assinatura.
 */

type Props = {
  readonly consulta: ConteudoHome["consulta"];
};

export function ComoEaConsulta({ consulta }: Props) {
  return (
    <Secao
      superficie="areia-100"
      espacamento="nenhum"
      className={RITMO_SECAO}
      aria-labelledby="consulta-titulo"
    >
      <RailLateral>{consulta.eyebrow}</RailLateral>

      <Container comRail>
        <div className="grid gap-y-10 lg:grid-cols-12 lg:gap-x-[var(--gutter)] lg:gap-y-14">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-[calc(var(--header-h)+3rem)]">
              <SectionTitle
                id="consulta-titulo"
                eyebrow={consulta.eyebrow}
                as="h2"
                tamanho="h2"
              >
                {consulta.h2}
              </SectionTitle>
            </div>
          </div>

          {/* Para na coluna 11: os filetes de cada passo indo até a borda do
              container entrariam na faixa por onde o Traço desce. */}
          <Reveal className="lg:col-span-6 lg:col-start-6">
            <Passos passos={consulta.passos} fecho={consulta.fecho} />
          </Reveal>
        </div>
      </Container>
    </Secao>
  );
}
