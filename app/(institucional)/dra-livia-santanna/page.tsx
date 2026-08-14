import type { Metadata } from "next";

import { getMedica } from "@/content";
import { IdentificacaoCFM } from "@/components/medical/IdentificacaoCFM";
import { RailLateral } from "@/components/layout/RailLateral";
import { ChamadaConsulta } from "@/components/sections/ChamadaConsulta";
import { Container } from "@/components/ui/Container";
import { Filete } from "@/components/ui/Filete";
import { RetratoArco } from "@/components/ui/RetratoArco";
import { Reveal } from "@/components/ui/Reveal";
import { Secao } from "@/components/ui/Secao";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { RITMO_SECAO } from "@/components/sections/ritmo";

/**
 * A médica — a trajetória (briefing § 8.6).
 *
 * A página inteira é uma decisão tipográfica: a formação vai em mono, em lista
 * datada, porque formação é fato verificável; a biografia vai em corpo, porque
 * é a voz dela. Quem lê aprende a diferença sem que ninguém explique, e é essa
 * separação que segura a tensão entre as duas audiências do site.
 *
 * **A biografia tem um parágrafo só.** O segundo — por que escolheu a
 * especialidade, como conduz a consulta — está `[CONFIRMAR]` em
 * `content/medica.ts` e precisa vir dela. Não há texto de preenchimento aqui:
 * inventar a voz de uma médica na página que existe para apresentá-la seria o
 * pior lugar do site para inventar qualquer coisa. A página funciona com um
 * parágrafo; ela fica melhor com dois, quando os dois forem dela.
 */

export const metadata: Metadata = {
  title: "Otorrinolaringologista em Belo Horizonte",
  description:
    "Graduação pela Universidade Federal de Viçosa, residência em otorrinolaringologia no Hospital Madre Teresa e fellowship em cirurgia plástica da face.",
  alternates: { canonical: "/dra-livia-santanna" },
};

export default function PaginaMedica() {
  const medica = getMedica();
  const [primeiroParagrafo, ...demaisParagrafos] = medica.biografia;

  return (
    <>
      <Secao
        espacamento="nenhum"
        className={RITMO_SECAO}
        superficie="areia"
        aria-labelledby="titulo-da-pagina"
      >
        <RailLateral>A médica</RailLateral>

        <Container comRail>
          <SectionTitle
            as="h1"
            tamanho="h1"
            eyebrow="A médica"
            id="titulo-da-pagina"
          >
            {medica.identificacao.nome}
          </SectionTitle>

          <p className="text-lead text-ink-600 mt-10 max-w-[38ch]">
            {medica.descricaoAtuacao}. {medica.cidade}.
          </p>
        </Container>
      </Secao>

      <Secao
        espacamento="nenhum"
        className={RITMO_SECAO}
        superficie="areia-100"
        aria-label="Trajetória"
      >
        <RailLateral>Trajetória</RailLateral>

        <Container comRail>
          <div className="grid gap-14 lg:grid-cols-[0.85fr_1fr] lg:items-start lg:gap-24">
            <Reveal>
              <RetratoArco
                imagem={medica.retrato}
                aspecto="3/4"
                sizes="(min-width: 1024px) 38vw, 100vw"
              />
            </Reveal>

            <Reveal index={1} className="flex flex-col gap-8">
              <p className="text-lead medida">{primeiroParagrafo}</p>

              {demaisParagrafos.map((paragrafo) => (
                <p key={paragrafo} className="text-body text-ink-600 medida">
                  {paragrafo}
                </p>
              ))}
            </Reveal>
          </div>
        </Container>
      </Secao>

      <Secao
        espacamento="nenhum"
        className={RITMO_SECAO}
        superficie="areia"
        aria-labelledby="titulo-formacao"
      >
        <RailLateral>Formação</RailLateral>

        <Container comRail>
          <SectionTitle as="h2" tamanho="h2" eyebrow="Formação">
            Onde me formei
          </SectionTitle>

          {/*
            Lista datada em mono (§ 8.6): rótulo à esquerda, instituição à
            direita, um filete entre as linhas. É a mesma família tipográfica
            do bloco do CFM logo abaixo, e isso é de propósito — as duas coisas
            são registro, não argumento.
          */}
          <dl className="mt-14 flex flex-col">
            {medica.formacao.map((item, indice) => (
              <div key={item.rotulo}>
                {indice > 0 ? <Filete /> : null}

                <div className="grid gap-2 py-7 md:grid-cols-[12rem_1fr] md:gap-10">
                  <dt className="text-micro text-ink-400 font-mono tracking-[0.14em] uppercase">
                    {item.rotulo}
                  </dt>
                  <dd className="text-body max-w-[52ch]">{item.descricao}</dd>
                </div>
              </div>
            ))}
          </dl>

          <Filete className="mt-4" />

          <div className="pt-10">
            <IdentificacaoCFM />
          </div>
        </Container>
      </Secao>

      <ChamadaConsulta titulo="Levar o seu caso para a consulta" />
    </>
  );
}
