import type { Metadata } from "next";

import { getConsultorio, type Seo } from "@/content";
import { RailLateral } from "@/components/layout/RailLateral";
import { BotaoWhatsAppFixo } from "@/components/form/BotaoWhatsApp";
import { ChamadaConsulta } from "@/components/sections/ChamadaConsulta";
import {
  estaPendente,
  MarcaPendente,
  valorConfirmado,
} from "@/components/sections/DadoPendente";
import { Mapa } from "@/components/sections/Mapa";
import { Container } from "@/components/ui/Container";
import { Filete } from "@/components/ui/Filete";
import { Nota } from "@/components/ui/Nota";
import { Secao } from "@/components/ui/Secao";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { RITMO_SECAO } from "@/components/sections/ritmo";
import {
  breadcrumbJsonLd,
  grafoJsonLd,
  medicalBusinessJsonLd,
  serializarJsonLd,
} from "@/lib/jsonld";
import type { ItemTrilha } from "@/lib/jsonld";

/**
 * Consultório — onde atendo, mapa, horários (briefing § 8.9).
 *
 * ---------------------------------------------------------------------------
 * ESTA PÁGINA É QUASE TODA PENDÊNCIA, E ELA ADMITE ISSO
 * ---------------------------------------------------------------------------
 *
 * Endereço, bairro, CEP, telefone, e-mail, horários, estacionamento,
 * acessibilidade e link do mapa estão `[CONFIRMAR]` em
 * `content/consultorio.ts`. As coordenadas de lá apontam para o centro de Belo
 * Horizonte, como marcador — não para o consultório.
 *
 * A única coisa que esta página não pode fazer é preencher esses campos com
 * algo plausível. Um endereço inventado manda uma paciente para o lugar
 * errado num dia de consulta; um horário inventado a faz encontrar a porta
 * fechada. Então cada campo pendente aparece marcado como pendente, em mono, e
 * um aviso no fim explica o motivo e oferece o caminho que funciona hoje: o
 * formulário de contato.
 *
 * Quando os dados chegarem, nada aqui muda — os valores entram em
 * `/content` e a página passa a mostrá-los.
 */

/* SEO em objeto próprio — ver a nota em `dra-livia-santanna/page.tsx`. */
const SEO: Seo = {
  titulo: "Consultório em Belo Horizonte",
  descricao:
    "Onde a Dra. Lívia Sant'Anna atende em Belo Horizonte: endereço, horários de atendimento, estacionamento e acessibilidade do prédio.",
};

export const metadata: Metadata = {
  title: SEO.titulo,
  description: SEO.descricao,
  alternates: { canonical: "/consultorio" },
  openGraph: {
    type: "website",
    title: SEO.titulo,
    description: SEO.descricao,
    url: "/consultorio",
  },
};

/**
 * ## O `MedicalBusiness` é chamado mesmo devolvendo `null` hoje
 *
 * `medicalBusinessJsonLd()` recusa emitir enquanto o logradouro for
 * `[CONFIRMAR]`, e `grafoJsonLd` descarta o nulo — hoje esta rota publica só a
 * trilha. A chamada fica escrita assim de propósito: o dia em que
 * `content/consultorio.ts` for preenchido, o bloco passa a existir sem que
 * ninguém precise lembrar de voltar aqui. É o mesmo arranjo da home.
 */
export default function PaginaConsultorio() {
  const consultorio = getConsultorio();

  const trilha: readonly ItemTrilha[] = [
    { nome: "Início", href: "/" },
    { nome: "Consultório", href: "/consultorio" },
  ];

  const enderecoCompleto = valorConfirmado(consultorio.logradouro);

  const dados = [
    { rotulo: "Endereço", valor: consultorio.logradouro },
    { rotulo: "Bairro", valor: consultorio.bairro },
    { rotulo: "Cidade", valor: `${consultorio.cidade} — ${consultorio.uf}` },
    { rotulo: "CEP", valor: consultorio.cep },
    { rotulo: "Telefone", valor: consultorio.telefone },
    { rotulo: "E-mail", valor: consultorio.email },
  ];

  const estrutura = [
    { rotulo: "Estacionamento", valor: consultorio.estacionamento },
    { rotulo: "Acessibilidade", valor: consultorio.acessibilidade },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializarJsonLd(
            grafoJsonLd(medicalBusinessJsonLd(), breadcrumbJsonLd(trilha)),
          ),
        }}
      />

      <Secao
        espacamento="nenhum"
        className={RITMO_SECAO}
        superficie="areia"
        aria-labelledby="titulo-da-pagina"
      >
        <RailLateral>Consultório</RailLateral>

        <Container comRail>
          <SectionTitle
            as="h1"
            tamanho="h1"
            eyebrow="Consultório"
            id="titulo-da-pagina"
            className="max-w-[12ch]"
          >
            Onde atendo
          </SectionTitle>

          <p className="text-lead text-ink-600 mt-10 max-w-[42ch]">
            O consultório fica em {consultorio.cidade}. O endereço completo, os
            horários e o mapa entram nesta página assim que forem confirmados —
            até lá, o formulário de contato é o caminho.
          </p>
        </Container>
      </Secao>

      <Secao
        espacamento="nenhum"
        className={RITMO_SECAO}
        superficie="areia-100"
        aria-labelledby="titulo-endereco"
      >
        <RailLateral>Endereço</RailLateral>

        <Container comRail>
          <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
            <div>
              <SectionTitle
                as="h2"
                tamanho="h2"
                eyebrow="Endereço"
                id="titulo-endereco"
                className="max-w-[12ch]"
              >
                {consultorio.nome}
              </SectionTitle>

              <dl className="mt-12 flex flex-col">
                {dados.map((item, indice) => (
                  <div key={item.rotulo}>
                    {indice > 0 ? <Filete /> : null}

                    <div className="grid grid-cols-[8rem_1fr] gap-6 py-5">
                      <dt className="text-micro text-ink-400 font-mono tracking-[0.14em] uppercase">
                        {item.rotulo}
                      </dt>
                      <dd className="text-body">
                        {estaPendente(item.valor) ? (
                          <MarcaPendente />
                        ) : (
                          item.valor
                        )}
                      </dd>
                    </div>
                  </div>
                ))}
              </dl>
            </div>

            <div className="flex flex-col gap-6">
              {/*
                O marcador de pendência não atravessa a fronteira servidor →
                cliente. `Mapa` é client component, então tudo que ele recebe
                vai serializado no payload RSC embutido no HTML — e um
                "[CONFIRMAR: link do Google Maps]" ali aparece na fonte da
                página. Ele já trata string vazia como "sem mapa", que é a
                mesma coisa que um marcador significa.
                Pego por scripts/verificar-html.ts.
              */}
              <Mapa
                url={valorConfirmado(consultorio.mapaUrl) ?? ""}
                endereco={enderecoCompleto}
              />
            </div>
          </div>
        </Container>
      </Secao>

      <Secao
        espacamento="nenhum"
        className={RITMO_SECAO}
        superficie="areia"
        aria-labelledby="titulo-horarios"
      >
        <RailLateral>Atendimento</RailLateral>

        <Container comRail>
          <SectionTitle
            as="h2"
            tamanho="h2"
            eyebrow="Atendimento"
            id="titulo-horarios"
            className="max-w-[16ch]"
          >
            Horários e o prédio
          </SectionTitle>

          <div className="mt-14 grid gap-12 md:grid-cols-2 lg:gap-20">
            <div className="flex flex-col gap-6">
              <h3 className="text-h3 font-body font-medium">Dias e horários</h3>

              {/* Chave é o índice puro: `horario.dias` pode ser um marcador de
                  pendência, e chave de React vai serializada no payload RSC
                  embutido no HTML. Pego por scripts/verificar-html.ts. */}
              <dl className="flex flex-col">
                {consultorio.horarios.map((horario, indice) => (
                  <div key={indice}>
                    {indice > 0 ? <Filete /> : null}

                    <div className="flex flex-col gap-2 py-5">
                      <dt className="text-micro text-ink-400 font-mono tracking-[0.14em] uppercase">
                        {estaPendente(horario.dias) ? (
                          <MarcaPendente>Dias a confirmar</MarcaPendente>
                        ) : (
                          horario.dias
                        )}
                      </dt>
                      <dd className="text-body">
                        {estaPendente(horario.horas) ? (
                          <MarcaPendente />
                        ) : (
                          horario.horas
                        )}
                      </dd>
                    </div>
                  </div>
                ))}
              </dl>
            </div>

            <div className="flex flex-col gap-10">
              {estrutura.map((item) => (
                <div key={item.rotulo} className="flex flex-col gap-3">
                  <h3 className="text-h3 font-body font-medium">
                    {item.rotulo}
                  </h3>

                  {estaPendente(item.valor) ? (
                    <MarcaPendente />
                  ) : (
                    <p className="text-body text-ink-600 max-w-[46ch]">
                      {item.valor}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-16">
            <Nota tom="atencao">
              Os dados marcados como em confirmação não estão publicados porque
              ainda não foram confirmados pelo consultório. Endereço, telefone,
              horários e mapa entram aqui assim que chegarem. Para marcar um
              horário agora, use o formulário de contato.
            </Nota>
          </div>
        </Container>
      </Secao>

      <ChamadaConsulta titulo="Agendar um horário" />

      <BotaoWhatsAppFixo />
    </>
  );
}
