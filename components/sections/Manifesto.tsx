import { RailLateral } from "@/components/layout/RailLateral";
import { Container } from "@/components/ui/Container";
import { Filete } from "@/components/ui/Filete";
import { Reveal } from "@/components/ui/Reveal";
import { Secao } from "@/components/ui/Secao";
import { SectionTitle } from "@/components/ui/SectionTitle";
import type { ConteudoHome } from "@/content/tipos";

/**
 * § 8.3 — Manifesto. Areia, muito respiro.
 *
 * As quatro linhas são a tese do site inteiro, e a quebra delas é decisão de
 * design: cada linha carrega uma ideia fechada. Por isso vêm de `/content`
 * já quebradas e cada uma vira um `<span class="block">` — nunca um parágrafo
 * corrido que o navegador reflui.
 *
 * Elas são o heading da seção. Não há título "além" do manifesto porque não
 * existe nada a anunciar antes dele: o manifesto é o anúncio.
 *
 * A composição é a assimetria em estado puro (§ 5.4): o bloco em display ocupa
 * as colunas 1–9 e o parágrafo de apoio cai na linha de baixo, começando na
 * coluna 7. A sobreposição de faixas de coluna é o que empurra o segundo bloco
 * para a segunda linha da grade sem que ninguém escreva `row-start`.
 */

type Props = {
  readonly manifesto: ConteudoHome["manifesto"];
};

export function Manifesto({ manifesto }: Props) {
  return (
    <Secao superficie="areia" aria-labelledby="manifesto-titulo">
      <RailLateral>{manifesto.eyebrow}</RailLateral>

      <Container comRail>
        <div className="grid gap-y-16 lg:grid-cols-12 lg:gap-x-[var(--gutter)] lg:gap-y-28">
          <Reveal className="lg:col-span-9">
            <SectionTitle
              id="manifesto-titulo"
              eyebrow={manifesto.eyebrow}
              as="h2"
              tamanho="h2"
              className="text-ink-900"
            >
              {manifesto.linhas.map((linha) => (
                <span key={linha} className="block">
                  {linha}
                </span>
              ))}
            </SectionTitle>
          </Reveal>

          <Reveal index={1} className="lg:col-span-5 lg:col-start-7">
            <Filete />
            <p className="medida text-body text-ink-600 mt-8">
              {manifesto.apoio}
            </p>
          </Reveal>
        </div>
      </Container>
    </Secao>
  );
}
