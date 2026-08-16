import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getHub, getMedica, listarProcedimentos } from "@/content";
import { Botao } from "@/components/ui/Botao";
import { Citacao } from "@/components/ui/Citacao";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Filete } from "@/components/ui/Filete";
import { Nota } from "@/components/ui/Nota";
import { Reveal } from "@/components/ui/Reveal";
import { Secao } from "@/components/ui/Secao";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { RailLateral } from "@/components/layout/RailLateral";
import { breadcrumbJsonLd, grafoJsonLd, serializarJsonLd } from "@/lib/jsonld";
import type { ItemTrilha } from "@/lib/jsonld";
import {
  RITMO_HERO,
  RITMO_RESPIRO,
  RITMO_SECAO,
  RITMO_SECAO_COMPACTA,
} from "@/components/sections/ritmo";

/**
 * Hub de cirurgia da face — briefing § 7.
 *
 * O hub tem duas tarefas e elas competem. Precisa listar cinco procedimentos
 * de forma que quem chegou buscando "blefaroplastia BH" ache a página em dois
 * segundos, e precisa dizer por que essas cinco cirurgias estão nas mãos de
 * uma otorrinolaringologista — que é a única pergunta que essa audiência
 * realmente faz e quase nunca em voz alta.
 *
 * Por isso a ordem: a lista não é a primeira coisa, mas é a segunda. Entre o
 * hero e ela entra a premissa, em vinho, com a frase dela em primeira pessoa.
 * Depois da lista, a formação em mono — fato, não adjetivo.
 *
 * ## Superfícies
 *
 *   hero            areia       mesma entrada das páginas de procedimento
 *   a premissa      vinho       a imersão, cedo, onde a dúvida ainda existe
 *   procedimentos   areia
 *   quem conduz     areia-100
 *   CTA final       vinho
 *
 * O hero é areia pelo mesmo motivo do template: hub e procedimento abrem
 * igual, e a única exceção do site é a abertura da rinoplastia, que só é
 * exceção porque é única.
 */

const SLUG = "cirurgia-da-face";

export function generateMetadata(): Metadata {
  const hub = getHub(SLUG);
  if (!hub) return {};

  return {
    // O template do layout raiz acrescenta " | Dra. Lívia Sant'Anna" ao
    // título e ao `og:title`. `seo.titulo` traz só a parte distintiva.
    title: hub.seo.titulo,
    description: hub.seo.descricao,
    alternates: { canonical: `/${SLUG}` },
    openGraph: {
      type: "website",
      title: hub.seo.titulo,
      description: hub.seo.descricao,
      url: `/${SLUG}`,
    },
  };
}

export default function HubCirurgiaDaFace() {
  const hub = getHub(SLUG);
  if (!hub) notFound();

  const procedimentos = listarProcedimentos(SLUG);
  const medica = getMedica();

  const trilha: readonly ItemTrilha[] = [
    { nome: "Início", href: "/" },
    { nome: hub.nome, href: `/${SLUG}` },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializarJsonLd(grafoJsonLd(breadcrumbJsonLd(trilha))),
        }}
      />

      {/* --------------------------------------------------------------- */}
      <Secao
        superficie="areia"
        espacamento="nenhum"
        aria-labelledby="hub-titulo"
        className={RITMO_HERO}
      >
        <Container comRail>
          <nav aria-label="Trilha de navegação">
            <ol className="text-micro text-ink-400 flex list-none flex-wrap items-center gap-x-3 gap-y-1 font-mono tracking-[0.12em] uppercase">
              <li>
                <Link href="/" className="link-filete">
                  Início
                </Link>
              </li>
              <li aria-hidden="true">·</li>
              <li aria-current="page">{hub.nome}</li>
            </ol>
          </nav>

          <div className="mt-14 grid gap-x-16 gap-y-12 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <Eyebrow>{hub.eyebrow}</Eyebrow>
              <h1
                id="hub-titulo"
                className="font-display text-h1 mt-7 font-normal text-balance"
              >
                {hub.h1}
              </h1>
            </div>

            <div className="lg:col-span-4 lg:col-start-8 lg:pt-3">
              <p className="medida text-lead">{hub.lead}</p>
              <div className="mt-10">
                <Botao href="/contato">{hub.ctaFinal}</Botao>
              </div>
            </div>
          </div>

          <Filete className={RITMO_RESPIRO} />
        </Container>
      </Secao>

      {/* ---------------------------------------------------------------
          A premissa — vinho.

          A citação é a introdução do hub em primeira pessoa. Vem cedo
          porque é a resposta para a pergunta que essa audiência traz e não
          faz: por que uma otorrinolaringologista opera a face.
          --------------------------------------------------------------- */}
      <Secao
        espacamento="nenhum"
        className={RITMO_SECAO}
        superficie="vinho"
        aria-label="A premissa"
      >
        <RailLateral>{hub.nome}</RailLateral>
        <Container comRail>
          <div className="grid gap-x-16 gap-y-12 lg:grid-cols-12">
            <Reveal className="lg:col-span-6">
              <Eyebrow className="mb-8">A premissa</Eyebrow>
              <Citacao>{hub.introducao[0]}</Citacao>
            </Reveal>

            <Reveal
              index={1}
              className="lg:col-span-4 lg:col-start-8 lg:self-end lg:pb-2"
            >
              {hub.introducao.slice(1).map((paragrafo) => (
                <p
                  key={paragrafo}
                  className="medida text-body text-sand-50 mt-6 first:mt-0"
                >
                  {paragrafo}
                </p>
              ))}
            </Reveal>
          </div>
        </Container>
      </Secao>

      {/* ---------------------------------------------------------------
          Os cinco procedimentos.

          Linhas separadas por filete, não a grade de três ícones de linha
          com título e um parágrafo cada que o § 15 manda refazer. A linha
          inteira é o link: o alvo de toque é a linha, não o nome.
          --------------------------------------------------------------- */}
      <Secao
        espacamento="nenhum"
        className={RITMO_SECAO}
        superficie="areia"
        aria-labelledby="hub-procedimentos"
      >
        <RailLateral>{hub.nome}</RailLateral>
        <Container comRail>
          <SectionTitle
            as="h2"
            id="hub-procedimentos"
            eyebrow="O que eu opero"
            classNameBloco="mb-16 lg:mb-20"
          >
            Procedimentos
          </SectionTitle>

          <ul className="border-sand-200 list-none border-t">
            {procedimentos.map((procedimento, indice) => (
              <Reveal
                key={procedimento.slug}
                as="li"
                index={Math.min(indice, 4)}
                className="border-sand-200 border-b"
              >
                <Link
                  href={`/${procedimento.hub}/${procedimento.slug}`}
                  className="group grid gap-x-12 gap-y-3 py-9 no-underline lg:grid-cols-[minmax(0,18rem)_minmax(0,1fr)]"
                >
                  <h3 className="text-h3 group-hover:text-wine-700 duration-fast font-medium transition-colors">
                    {procedimento.nome}
                  </h3>

                  <span className="medida text-body text-ink-600">
                    {procedimento.lead}
                  </span>
                </Link>
              </Reveal>
            ))}
          </ul>

          <Nota tom="atencao" className="mt-16">
            Toda cirurgia envolve riscos. Cada página traz a seção de riscos e
            limites do procedimento, e eles são avaliados caso a caso na
            consulta e no termo de consentimento.
          </Nota>
        </Container>
      </Secao>

      {/* ---------------------------------------------------------------
          Quem conduz — a formação em mono, que é como o site escreve fato.
          --------------------------------------------------------------- */}
      <Secao
        superficie="areia-100"
        espacamento="nenhum"
        className={RITMO_SECAO_COMPACTA}
        aria-labelledby="hub-medica"
      >
        <Container comRail>
          <div className="grid gap-x-16 gap-y-10 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <SectionTitle as="h2" id="hub-medica" eyebrow="A médica">
                Quem conduz
              </SectionTitle>
            </div>

            <div className="lg:col-span-6 lg:col-start-6">
              <p className="medida text-lead">{medica.descricaoAtuacao}.</p>

              <dl className="border-sand-200 mt-12 border-t">
                {medica.formacao.map((item) => (
                  <div
                    key={item.rotulo}
                    className="border-sand-200 grid gap-x-8 gap-y-1 border-b py-5 sm:grid-cols-[minmax(0,9rem)_minmax(0,1fr)]"
                  >
                    <dt className="text-micro text-ink-400 font-mono tracking-[0.14em] uppercase">
                      {item.rotulo}
                    </dt>
                    <dd className="text-small text-ink-900 font-mono">
                      {item.descricao}
                    </dd>
                  </div>
                ))}
              </dl>

              <div className="mt-10">
                <Botao href="/dra-livia-santanna" variante="filete">
                  Conhecer a médica
                </Botao>
              </div>
            </div>
          </div>
        </Container>
      </Secao>

      {/* --------------------------------------------------------------- */}
      <Secao
        espacamento="nenhum"
        className={RITMO_SECAO}
        superficie="vinho"
        aria-labelledby="hub-cta"
      >
        <Container comRail>
          <div className="grid gap-x-16 gap-y-12 lg:grid-cols-12">
            <div className="lg:col-span-6">
              <SectionTitle as="h2" id="hub-cta" eyebrow="Próximo passo">
                {`Conversar sobre ${hub.nome.toLowerCase()}`}
              </SectionTitle>
            </div>

            <div className="lg:col-span-4 lg:col-start-8">
              <p className="medida text-body text-sand-50">
                A avaliação é individual. O que é possível no seu rosto sai do
                exame e da conversa, não desta página.
              </p>

              <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-5">
                <Botao href="/contato">{hub.ctaFinal}</Botao>
                <Botao href="/consulta" variante="filete">
                  Ver como é a consulta
                </Botao>
              </div>

              <Nota className="mt-12">
                Resultados variam conforme anatomia, cicatrização e histórico de
                cada paciente.
              </Nota>
            </div>
          </div>
        </Container>
      </Secao>
    </>
  );
}
