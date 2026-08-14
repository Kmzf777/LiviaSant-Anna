import type { Metadata } from "next";
import Link from "next/link";

import { getHome } from "@/content";
import { RailLateral } from "@/components/layout/RailLateral";
import { ChamadaConsulta } from "@/components/sections/ChamadaConsulta";
import { ParagrafoPendente } from "@/components/sections/DadoPendente";
import { Container } from "@/components/ui/Container";
import { Passos } from "@/components/ui/Passos";
import { Reveal } from "@/components/ui/Reveal";
import { Secao } from "@/components/ui/Secao";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { RITMO_SECAO } from "@/components/sections/ritmo";

/**
 * A consulta — como funciona e preparo (briefing § 7 e § 8.7).
 *
 * Os quatro passos vêm de `getHome().consulta.passos` e são renderizados pelo
 * primitivo `Passos`, o mesmo da home. Uma segunda redação da mesma jornada,
 * escrita à mão aqui, sairia de sincronia na primeira revisão de copy — e as
 * duas versões discordando sobre como é a consulta é o tipo de detalhe que o
 * paciente nota.
 *
 * **O preparo ainda não existe como conteúdo.** O que levar, quais exames
 * anteriores importam, como funciona o agendamento: nada disso está em
 * `/content`, e nada disso pode ser deduzido. É orientação clínica e
 * administrativa de um consultório específico — escrever "leve seus exames"
 * porque soa razoável seria inventar procedimento alheio numa página que a
 * paciente vai seguir ao pé da letra. A seção existe, marcada como pendente,
 * porque uma pendência visível é resolvida e uma pendência escondida vai para
 * o ar.
 */

export const metadata: Metadata = {
  title: "Como é a consulta",
  description:
    "As quatro etapas da consulta: conversa, exame, planejamento e decisão. Sem pressa e sem pressão para decidir na hora.",
  alternates: { canonical: "/consulta" },
};

const ATALHOS = [
  {
    eyebrow: "Onde",
    titulo: "Consultório",
    descricao: "Endereço, horários, estacionamento e acessibilidade do prédio.",
    href: "/consultorio",
  },
  {
    eyebrow: "Como",
    titulo: "Contato",
    descricao: "Formulário para escrever ao consultório e pedir um horário.",
    href: "/contato",
  },
] as const;

export default function PaginaConsulta() {
  const { consulta } = getHome();

  return (
    <>
      <Secao
        espacamento="nenhum"
        className={RITMO_SECAO}
        superficie="areia"
        aria-labelledby="titulo-da-pagina"
      >
        <RailLateral>{consulta.eyebrow}</RailLateral>

        <Container comRail>
          <SectionTitle
            as="h1"
            tamanho="h1"
            eyebrow={consulta.eyebrow}
            id="titulo-da-pagina"
            className="max-w-[14ch]"
          >
            {consulta.h2}
          </SectionTitle>

          <p className="text-lead text-ink-600 mt-10 max-w-[40ch]">
            Quatro etapas, nesta ordem: conversa, exame, planejamento e decisão.
          </p>
        </Container>
      </Secao>

      <Secao
        espacamento="nenhum"
        className={RITMO_SECAO}
        superficie="areia-100"
        aria-label="Etapas da consulta"
      >
        <RailLateral>Etapas</RailLateral>

        <Container comRail>
          {/*
            Os passos ocupam a faixa da direita, não a largura inteira. A
            coluna vazia à esquerda é o eixo de assimetria do § 5.4 — e é o
            mesmo lugar onde a home encaixa o título da seção, o que mantém as
            duas páginas com o mesmo ritmo mesmo sem repetir o título aqui (ele
            já é o h1 desta página).
          */}
          <div className="lg:grid lg:grid-cols-12 lg:gap-x-[var(--gutter)]">
            <div className="lg:col-span-8 lg:col-start-5">
              <Passos passos={consulta.passos} fecho={consulta.fecho} />
            </div>
          </div>
        </Container>
      </Secao>

      <Secao
        espacamento="nenhum"
        className={RITMO_SECAO}
        superficie="areia"
        aria-labelledby="titulo-preparo"
      >
        <RailLateral>Preparo</RailLateral>

        <Container comRail>
          <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:gap-24">
            <SectionTitle
              as="h2"
              tamanho="h2"
              eyebrow="Preparo"
              id="titulo-preparo"
              className="max-w-[14ch]"
            >
              Antes da consulta
            </SectionTitle>

            <ParagrafoPendente>
              Orientações de preparo: o que levar, quais exames anteriores
              ajudam, documentos, e como funciona a confirmação do horário. O
              texto precisa vir da médica — nada aqui é dedutível de fora do
              consultório.
            </ParagrafoPendente>
          </div>

          <div className="mt-20 grid gap-8 md:grid-cols-2">
            {ATALHOS.map((atalho, indice) => (
              <Reveal key={atalho.href} index={indice}>
                <Link
                  href={atalho.href}
                  className="filete rounded-filete hover:border-wine-700 group flex h-full flex-col gap-4 border p-8 no-underline transition-colors duration-200"
                >
                  <span className="text-micro text-ink-400 font-mono tracking-[0.14em] uppercase">
                    {atalho.eyebrow}
                  </span>
                  <span className="text-h3 font-body font-medium">
                    {atalho.titulo}
                  </span>
                  <span className="text-body text-ink-600 max-w-[38ch]">
                    {atalho.descricao}
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </Container>
      </Secao>

      <ChamadaConsulta titulo="Marcar a sua consulta" />
    </>
  );
}
