import type { Metadata } from "next";
import Link from "next/link";

import { getConsultorio } from "@/content";
import { gruposDeAssunto, valoresDeAssunto } from "@/lib/assuntos";
import { RailLateral } from "@/components/layout/RailLateral";
import {
  BotaoWhatsApp,
  BotaoWhatsAppFixo,
} from "@/components/form/BotaoWhatsApp";
import { FormularioContato } from "@/components/form/FormularioContato";
import {
  estaPendente,
  MarcaPendente,
} from "@/components/sections/DadoPendente";
import { Container } from "@/components/ui/Container";
import { Filete } from "@/components/ui/Filete";
import { Nota } from "@/components/ui/Nota";
import { Secao } from "@/components/ui/Secao";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { RITMO_SECAO } from "@/components/sections/ritmo";

/**
 * Contato — formulário e WhatsApp (briefing § 8.9).
 *
 * A página tem uma tarefa só, e a composição obedece a isso: à esquerda os
 * canais e o que a pessoa precisa saber antes de escrever; à direita, largo, o
 * formulário. Nada mais compete com ele — nenhuma citação, nenhum retrato,
 * nenhuma segunda chamada para ação.
 *
 * O `<select>` de assunto é montado aqui, no servidor, a partir de
 * `listarProcedimentos()` (via `lib/assuntos.ts`), e desce como prop. O
 * componente de formulário é cliente e nunca importa `/content`: os onze
 * procedimentos, com riscos, ficha técnica e FAQ de cada um, não têm por que
 * viajar até o navegador para preencher uma lista de opções.
 *
 * `?assunto=rinoplastia` pré-seleciona o assunto para quem chega de uma página
 * de procedimento. O valor é conferido contra a lista antes de virar
 * `defaultValue` — um parâmetro de URL é entrada de usuário como qualquer
 * outra.
 */

export const metadata: Metadata = {
  title: "Contato",
  description:
    "Escreva para o consultório da Dra. Lívia Sant'Anna em Belo Horizonte: nome, WhatsApp, assunto e mensagem. O retorno vem pelo canal que você indicar.",
  alternates: { canonical: "/contato" },
};

type Props = {
  readonly searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function PaginaContato({ searchParams }: Props) {
  const consultorio = getConsultorio();
  const parametros = await searchParams;

  const pedido = parametros["assunto"];
  const assuntoPedido = typeof pedido === "string" ? pedido : undefined;
  const assuntoInicial =
    assuntoPedido && valoresDeAssunto().includes(assuntoPedido)
      ? assuntoPedido
      : undefined;

  const canais = [
    { rotulo: "Telefone", valor: consultorio.telefone },
    { rotulo: "E-mail", valor: consultorio.email },
  ];

  return (
    <>
      <Secao
        espacamento="nenhum"
        className={RITMO_SECAO}
        superficie="areia"
        aria-labelledby="titulo-da-pagina"
      >
        <RailLateral>Contato</RailLateral>

        <Container comRail>
          <SectionTitle
            as="h1"
            tamanho="h1"
            eyebrow="Contato"
            id="titulo-da-pagina"
            className="max-w-[14ch]"
          >
            Escrever para o consultório
          </SectionTitle>

          <p className="text-lead text-ink-600 mt-10 max-w-[42ch]">
            Conte em poucas linhas o que você precisa. A mensagem chega no
            consultório e o retorno vem pelo WhatsApp ou pelo e-mail que você
            informar.
          </p>
        </Container>
      </Secao>

      <Secao
        espacamento="nenhum"
        className={RITMO_SECAO}
        superficie="areia-100"
        aria-label="Formulário de contato"
      >
        <RailLateral>Formulário</RailLateral>

        <Container comRail>
          <div className="grid gap-16 lg:grid-cols-[0.7fr_1.3fr] lg:gap-24">
            {/* Coluna estreita: o que saber antes de escrever. */}
            <div className="flex flex-col gap-10">
              <div className="flex flex-col gap-6">
                <h2 className="text-h3 font-body font-medium">Outros canais</h2>

                <dl className="flex flex-col">
                  {canais.map((canal, indice) => (
                    <div key={canal.rotulo}>
                      {indice > 0 ? <Filete /> : null}

                      <div className="flex flex-col gap-1 py-4">
                        <dt className="text-micro text-ink-400 font-mono tracking-[0.14em] uppercase">
                          {canal.rotulo}
                        </dt>
                        <dd className="text-body">
                          {estaPendente(canal.valor) ? (
                            <MarcaPendente />
                          ) : (
                            canal.valor
                          )}
                        </dd>
                      </div>
                    </div>
                  ))}
                </dl>

                <BotaoWhatsApp />

                <p className="text-small text-ink-600">
                  O endereço e os horários estão em{" "}
                  <Link
                    href="/consultorio"
                    className="link-filete text-wine-700"
                  >
                    consultório
                  </Link>
                  .
                </p>
              </div>

              <Filete />

              {/*
                Os dois avisos que precisam existir antes do primeiro campo, e
                não depois do botão: um formulário de site médico não é canal de
                urgência, e o que a pessoa escreve aqui não tem o sigilo de uma
                consulta. Ver a política de privacidade, que descreve o mesmo
                tratamento em detalhe.
              */}
              <div className="flex flex-col gap-6">
                <Nota tom="atencao">
                  Este formulário não é canal de urgência. Em caso de urgência,
                  procure um serviço de emergência.
                </Nota>

                <Nota>
                  Não descreva sintomas, exames nem histórico médico aqui. Esse
                  é o assunto da consulta, onde existe sigilo médico e um
                  ambiente adequado para tratá-lo.
                </Nota>
              </div>
            </div>

            {/* Coluna larga: a tarefa. */}
            <div>
              <FormularioContato
                assuntos={gruposDeAssunto()}
                assuntoInicial={assuntoInicial}
              />
            </div>
          </div>
        </Container>
      </Secao>

      <BotaoWhatsAppFixo />
    </>
  );
}
