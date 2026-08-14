import { RailLateral } from "@/components/layout/RailLateral";
import { Botao } from "@/components/ui/Botao";
import { Container } from "@/components/ui/Container";
import { Nota } from "@/components/ui/Nota";
import { Reveal } from "@/components/ui/Reveal";
import { Secao } from "@/components/ui/Secao";
import { SectionTitle } from "@/components/ui/SectionTitle";
import type { ConteudoHome } from "@/content/tipos";
import { RITMO_SECAO } from "./ritmo";

/**
 * § 8.5 — Rinoplastia em destaque. Full-bleed vinho.
 *
 * A segunda superfície vinho da página, e a única depois do hero. Vinho é
 * superfície e não detalhe (§ 5.2): quando a página troca de bloco inteiro, o
 * leitor entende que mudou de assunto sem que nada precise gritar. É por isso
 * que não existe acento vivo no design system — o destaque desta seção É a
 * troca de superfície.
 *
 * ## Por que o texto para na coluna 7
 *
 * O Traço acaba de resolver no perfil de rosto e sai dele por aqui. A fita é
 * ancorada na borda direita da viewport e o rosto vive entre x 103 e 210 de um
 * viewBox de 240 — ou seja, na faixa direita da tela. Deixar as colunas 8–12
 * livres é o que garante o § 5.8: "nunca cruza texto, nunca compete com a
 * leitura".
 *
 * ## O tamanho do título
 *
 * `as="h2"` com `tamanho="h1"`. Semântica e composição são independentes no
 * `SectionTitle` exatamente para isto: a hierarquia continua correta (um H1 na
 * página, o do hero) e esta seção pesa mais que as outras H2, que é o que
 * "carro-chefe" significa em tipografia.
 *
 * A nota em mono não é letra miúda escondida: é a ressalva que a Resolução CFM
 * 2.336/2023 exige junto de qualquer menção a resultado, no mesmo corpo de
 * texto do resto da ficha clínica do site.
 */

type Props = {
  readonly rinoplastia: ConteudoHome["rinoplastia"];
};

export function RinoplastiaDestaque({ rinoplastia }: Props) {
  return (
    <Secao
      superficie="vinho"
      espacamento="nenhum"
      className={RITMO_SECAO}
      aria-labelledby="rinoplastia-titulo"
    >
      <RailLateral>{rinoplastia.eyebrow}</RailLateral>

      <Container comRail>
        <div className="grid lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <SectionTitle
              id="rinoplastia-titulo"
              eyebrow={rinoplastia.eyebrow}
              as="h2"
              tamanho="h1"
            >
              {rinoplastia.h2}
            </SectionTitle>

            <p className="medida text-lead text-sand-50 mt-9 lg:mt-12">
              {rinoplastia.corpo}
            </p>

            <div className="mt-10 flex flex-col items-start gap-8 lg:mt-14 lg:gap-10">
              <Botao href={rinoplastia.cta.href}>{rinoplastia.cta.texto}</Botao>
              <Nota>{rinoplastia.nota}</Nota>
            </div>
          </Reveal>
        </div>
      </Container>
    </Secao>
  );
}
