import Image from "next/image";
import Link from "next/link";
import type { JSX, ReactNode } from "react";

import { getHub, listarRelacionados } from "@/content";
import type { CasoAntesDepois, Procedimento } from "@/content";
import { Botao } from "@/components/ui/Botao";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { FAQ } from "@/components/ui/FAQ";
import { Filete } from "@/components/ui/Filete";
import { Nota } from "@/components/ui/Nota";
import { Reveal } from "@/components/ui/Reveal";
import { Secao } from "@/components/ui/Secao";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { RailLateral } from "@/components/layout/RailLateral";
import { AntesDepois } from "./AntesDepois";
import { FichaTecnica } from "./FichaTecnica";
import { RiscosELimites } from "./RiscosELimites";
import {
  breadcrumbJsonLd,
  faqPageJsonLd,
  grafoJsonLd,
  medicalProcedureJsonLd,
  serializarJsonLd,
} from "@/lib/jsonld";
import type { ItemTrilha } from "@/lib/jsonld";
import { itensConfirmados, textosConfirmados } from "@/lib/pendencias";

/**
 * Template de página de procedimento — briefing § 8.10.
 *
 * Onze rotas do site passam por aqui. A ordem das seções é a do briefing e não
 * muda entre procedimentos: quem lê a página da rinoplastia e depois a da
 * timpanoplastia encontra os mesmos assuntos no mesmo lugar, e é isso que
 * transforma cinco páginas em um documento só.
 *
 *   Hero curto · O que é · Quando é indicado · Como é feito · Ficha técnica ·
 *   Recuperação · Riscos e limites · Antes e depois (se houver) · FAQ ·
 *   Relacionados · CTA final
 *
 * ## Um único prop, de propósito
 *
 * `procedimento` carrega tudo, inclusive o hub — então o template deriva
 * sozinho a trilha, os relacionados, a metadata estrutural e os três blocos de
 * JSON-LD. Nenhuma rota precisa lembrar de passar nada, e nenhuma rota pode
 * esquecer. É o mesmo raciocínio do Header, que lê `data-superficie` em vez de
 * receber a cor por prop.
 *
 * ## As superfícies
 *
 * `data-superficie` é medido pelo Traço (§ 5.8), então a alternância é
 * decisão de composição e não de decoração:
 *
 *   hero            areia        entra claro; o Header fica com tipografia tinta
 *   o que é         areia        continuação do lead, separada por filete
 *   indicado        areia-100    primeiro degrau: sai da narrativa, entra o critério
 *   como é feito    vinho        a única imersão do meio da página
 *   ficha técnica   areia        volta à luz, e a mono recebe o contraste máximo
 *   recuperação     areia-100
 *   riscos          areia        MESMA superfície e mesma tinta do resto (ver abaixo)
 *   antes e depois  areia        vazio na v1
 *   FAQ             areia-100
 *   relacionados    areia
 *   CTA final       vinho        fecha onde o hero da home começou
 *
 * Nem tudo em areia, que seria monótono, nem vinho demais, que cansa numa
 * página desta extensão.
 *
 * ## Riscos e limites
 *
 * "Não é rodapé jurídico: é a peça de maior conversão do site." A seção fica
 * em superfície areia porque essa é a superfície do texto principal — o mesmo
 * corpo, a mesma tinta, o mesmo espaço de respiro das seções que descrevem a
 * cirurgia. Nada de `<details>` fechado, nada de cinza apagado, nada de corpo
 * menor. Um médico que escreve honestamente sobre risco ganha mais confiança
 * do que um que promete resultado, e o tratamento tipográfico é o que torna
 * essa frase verdadeira na tela em vez de verdadeira no briefing.
 *
 * ## A imagem
 *
 * O template só renderiza `procedimento.imagem` quando ela existe de fato.
 * Cinco páginas abrindo com o mesmo bloco `IMAGEM PENDENTE` seria o
 * "placeholder vazado" que o § 14 lista como reprovação — e nenhuma delas
 * precisa da figura para ler bem. Quando as ilustrações chegarem, elas
 * aparecem sozinhas, sem tocar em rota nenhuma.
 */

// -----------------------------------------------------------------------------
// Rótulos das seções. Ficam aqui, e não em /content, porque são estrutura do
// template — mudam para as onze páginas ao mesmo tempo ou não mudam.
// -----------------------------------------------------------------------------

const TITULOS = {
  oQueE: "O que é",
  indicacoes: "Quando é indicado",
  comoEFeito: "Como é feito",
  fichaTecnica: "Ficha técnica",
  recuperacao: "Recuperação",
  antesDepois: "Antes e depois",
  faq: "Perguntas frequentes",
  relacionados: "Procedimentos relacionados",
} as const;

const EYEBROWS = {
  oQueE: "O procedimento",
  indicacoes: "Critérios",
  comoEFeito: "Técnica",
  fichaTecnica: "Dados",
  recuperacao: "Semana a semana",
  riscos: "Antes de decidir",
  antesDepois: "Resultados",
  faq: "Dúvidas",
  relacionados: "Continuar lendo",
} as const;

/**
 * Fecho do CTA. Genérico de propósito: repetir a mesma promessa de método em
 * todas as páginas é coerente, e o que muda entre elas — o que é possível no
 * caso de cada pessoa — é justamente o que uma página não pode responder.
 */
const CTA_CORPO =
  "A avaliação é individual. O que é possível no seu caso sai do exame e da " +
  "conversa, não desta página.";

// -----------------------------------------------------------------------------
// Blocos internos
// -----------------------------------------------------------------------------

/**
 * O par título/conteúdo que se repete em quase toda seção: título numa coluna
 * estreita à esquerda, texto numa coluna larga que não passa da medida de
 * leitura. Assimetria por padrão (§ 5.4) — nada centralizado.
 */
function Duas({
  titulo,
  children,
}: {
  readonly titulo: ReactNode;
  readonly children: ReactNode;
}) {
  return (
    <div className="grid gap-x-16 gap-y-10 lg:grid-cols-12">
      <div className="lg:col-span-4">{titulo}</div>
      <div className="lg:col-span-6 lg:col-start-6">{children}</div>
    </div>
  );
}

function Paragrafos({
  textos,
  destacarPrimeiro = false,
}: {
  readonly textos: readonly string[];
  readonly destacarPrimeiro?: boolean;
}) {
  return (
    <div className="flex flex-col gap-7">
      {textos.map((texto, indice) => (
        <Reveal key={texto} index={Math.min(indice, 4)}>
          <p
            className={
              destacarPrimeiro && indice === 0
                ? "medida text-lead"
                : "medida text-body"
            }
          >
            {texto}
          </p>
        </Reveal>
      ))}
    </div>
  );
}

function Trilha({
  hubSlug,
  hubNome,
  nome,
}: {
  readonly hubSlug: string;
  readonly hubNome: string;
  readonly nome: string;
}) {
  return (
    <nav aria-label="Trilha de navegação">
      <ol className="text-micro text-ink-400 flex list-none flex-wrap items-center gap-x-3 gap-y-1 font-mono tracking-[0.12em] uppercase">
        <li>
          <Link href="/" className="link-filete">
            Início
          </Link>
        </li>
        <li aria-hidden="true">·</li>
        <li>
          <Link href={`/${hubSlug}`} className="link-filete">
            {hubNome}
          </Link>
        </li>
        <li aria-hidden="true">·</li>
        <li aria-current="page">{nome}</li>
      </ol>
    </nav>
  );
}

function Caso({
  caso,
  indice,
}: {
  readonly caso: CasoAntesDepois;
  readonly indice: number;
}) {
  return (
    <div className={indice > 0 ? "border-sand-200 mt-20 border-t pt-20" : ""}>
      <AntesDepois
        antes={caso.antes}
        depois={caso.depois}
        textoEducativo={caso.textoEducativo}
        autorizacaoId={caso.autorizacaoId}
        intervaloEntreFotos={caso.intervaloEntreFotos}
      />
    </div>
  );
}

// -----------------------------------------------------------------------------

export function PaginaProcedimento({
  procedimento,
}: {
  procedimento: Procedimento;
}): JSX.Element {
  const hub = getHub(procedimento.hub);
  const hubNome = hub?.nome ?? procedimento.hub;
  const caminho = `/${procedimento.hub}/${procedimento.slug}`;
  const relacionados = listarRelacionados(procedimento);

  /*
    Nada pendente chega ao paciente.

    O conteúdo marca com `[CONFIRMAR: …]` o que depende de informação que só a
    médica tem — convênios, apresentações de toxina, disponibilidade de
    navegação cirúrgica. Isso é correto: a alternativa seria inventar. Mas o
    marcador não pode ser renderizado, e era: oito páginas publicavam coisas
    como "[CONFIRMAR: convênios atendidos e política de reembolso]" no corpo do
    texto.

    A política é omitir, não avisar. Uma pergunta sem resposta some da FAQ;
    mostrar "esta informação está pendente" para quem procura um médico chama
    atenção para a lacuna sem resolvê-la.

    `riscosELimites` não é filtrado de propósito: o tipo garante o mínimo de
    três e nenhum risco é pendente. Se um dia for, é melhor o build reprovar em
    `verify:html` do que a seção encolher em silêncio.
  */
  const oQueE = textosConfirmados(procedimento.oQueE);
  const indicacoes = textosConfirmados(procedimento.indicacoes);
  const comoEFeito = textosConfirmados(procedimento.comoEFeito);
  const recuperacao = itensConfirmados(
    procedimento.recuperacao,
    "periodo",
    "descricao",
  );
  const faq = itensConfirmados(procedimento.faq, "pergunta", "resposta");

  const trilha: readonly ItemTrilha[] = [
    { nome: "Início", href: "/" },
    { nome: hubNome, href: `/${procedimento.hub}` },
    { nome: procedimento.nome, href: caminho },
  ];

  // Um script só, com MedicalProcedure, FAQPage e BreadcrumbList dentro do
  // mesmo @graph: é o formato em que os @id se resolvem entre blocos.
  const grafo = grafoJsonLd(
    medicalProcedureJsonLd(procedimento),
    faqPageJsonLd(faq),
    breadcrumbJsonLd(trilha),
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializarJsonLd(grafo) }}
      />

      {/* ---------------------------------------------------------------
          Hero curto — areia.

          Areia e não vinho: a página abre no mesmo tom em que se lê, o
          Header fica com tipografia tinta e nenhum `-mt-[var(--header-h)]`
          é necessário. O hub segue a mesma regra, então hub e procedimento
          têm a mesma entrada.
          --------------------------------------------------------------- */}
      <Secao
        superficie="areia"
        espacamento="nenhum"
        aria-labelledby="procedimento-titulo"
        className="pt-[calc(var(--secao-y)*0.55)] pb-[calc(var(--secao-y)*0.7)]"
      >
        <Container comRail>
          <Trilha
            hubSlug={procedimento.hub}
            hubNome={hubNome}
            nome={procedimento.nome}
          />

          <div className="mt-14 grid gap-x-16 gap-y-12 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <Eyebrow>{procedimento.eyebrow}</Eyebrow>
              <h1
                id="procedimento-titulo"
                className="font-display text-h1 mt-7 font-normal text-balance"
              >
                {procedimento.h1}
              </h1>
            </div>

            <div className="lg:col-span-4 lg:col-start-8 lg:pt-3">
              <p className="medida text-lead">{procedimento.lead}</p>
              <div className="mt-10">
                <Botao href="/contato">{procedimento.ctaFinal}</Botao>
              </div>
            </div>
          </div>

          <Filete className="mt-[calc(var(--secao-y)*0.55)]" />
        </Container>
      </Secao>

      {/* --------------------------------------------------------------- */}
      <Secao superficie="areia" aria-labelledby="secao-o-que-e">
        <RailLateral>{procedimento.nome}</RailLateral>
        <Container comRail>
          <Duas
            titulo={
              <SectionTitle as="h2" id="secao-o-que-e" eyebrow={EYEBROWS.oQueE}>
                {TITULOS.oQueE}
              </SectionTitle>
            }
          >
            <Paragrafos textos={oQueE} destacarPrimeiro />

            {procedimento.imagem.tipo === "imagem" ? (
              <figure className="mt-16">
                <Image
                  src={procedimento.imagem.imagem.src}
                  alt={procedimento.imagem.imagem.alt}
                  width={procedimento.imagem.imagem.largura}
                  height={procedimento.imagem.imagem.altura}
                  sizes="(min-width: 1024px) 46rem, 100vw"
                  className="rounded-filete h-auto w-full"
                />
              </figure>
            ) : null}
          </Duas>
        </Container>
      </Secao>

      {/* --------------------------------------------------------------- */}
      <Secao superficie="areia-100" aria-labelledby="secao-indicacoes">
        <RailLateral>{procedimento.nome}</RailLateral>
        <Container comRail>
          <Duas
            titulo={
              <SectionTitle
                as="h2"
                id="secao-indicacoes"
                eyebrow={EYEBROWS.indicacoes}
              >
                {TITULOS.indicacoes}
              </SectionTitle>
            }
          >
            <ul className="border-sand-200 list-none border-t">
              {indicacoes.map((item, indice) => (
                <Reveal
                  key={item}
                  as="li"
                  index={Math.min(indice, 4)}
                  className="border-sand-200 border-b py-6"
                >
                  <p className="medida text-body">{item}</p>
                </Reveal>
              ))}
            </ul>
          </Duas>
        </Container>
      </Secao>

      {/* ---------------------------------------------------------------
          Como é feito — vinho. A única imersão do meio da página: é o
          trecho mais técnico e o que mais se beneficia de sair da leitura
          corrida e virar bloco.
          --------------------------------------------------------------- */}
      <Secao superficie="vinho" aria-labelledby="secao-como-e-feito">
        <RailLateral>{procedimento.nome}</RailLateral>
        <Container comRail>
          <Duas
            titulo={
              <SectionTitle
                as="h2"
                id="secao-como-e-feito"
                eyebrow={EYEBROWS.comoEFeito}
              >
                {TITULOS.comoEFeito}
              </SectionTitle>
            }
          >
            <Paragrafos textos={comoEFeito} destacarPrimeiro />
          </Duas>
        </Container>
      </Secao>

      {/* --------------------------------------------------------------- */}
      <Secao
        superficie="areia"
        espacamento="compacto"
        aria-labelledby="secao-ficha"
      >
        <Container comRail>
          <Duas
            titulo={
              <SectionTitle
                as="h2"
                id="secao-ficha"
                eyebrow={EYEBROWS.fichaTecnica}
              >
                {TITULOS.fichaTecnica}
              </SectionTitle>
            }
          >
            <FichaTecnica
              ficha={procedimento.fichaTecnica}
              titulo={procedimento.nome}
              idBase={`ficha-${procedimento.slug}`}
            />
          </Duas>
        </Container>
      </Secao>

      {/* --------------------------------------------------------------- */}
      <Secao superficie="areia-100" aria-labelledby="secao-recuperacao">
        <RailLateral>{procedimento.nome}</RailLateral>
        <Container comRail>
          <Duas
            titulo={
              <SectionTitle
                as="h2"
                id="secao-recuperacao"
                eyebrow={EYEBROWS.recuperacao}
              >
                {TITULOS.recuperacao}
              </SectionTitle>
            }
          >
            {/* Lista ordenada porque a recuperação é sequência real, como os
                Passos da consulta. O período vai em mono: é fato, não
                persuasão. */}
            <ol className="border-sand-200 list-none border-t">
              {recuperacao.map((etapa, indice) => (
                <Reveal
                  key={etapa.periodo}
                  as="li"
                  index={Math.min(indice, 4)}
                  className="border-sand-200 grid gap-x-10 gap-y-3 border-b py-8 md:grid-cols-[minmax(0,11rem)_minmax(0,1fr)]"
                >
                  <h3 className="text-micro text-ink-400 font-mono font-normal tracking-[0.14em] uppercase md:pt-1">
                    {etapa.periodo}
                  </h3>
                  <p className="medida text-body">{etapa.descricao}</p>
                </Reveal>
              ))}
            </ol>
          </Duas>
        </Container>
      </Secao>

      {/* ---------------------------------------------------------------
          Riscos e limites — obrigatório, aberto, no mesmo corpo e na mesma
          tinta do resto. Superfície areia: a superfície do texto que vende
          a cirurgia é a mesma do texto que a limita.
          --------------------------------------------------------------- */}
      <Secao superficie="areia">
        <RailLateral>{procedimento.nome}</RailLateral>
        <Container comRail>
          <RiscosELimites
            riscos={procedimento.riscosELimites}
            eyebrow={EYEBROWS.riscos}
            idBase={`riscos-${procedimento.slug}`}
          />
        </Container>
      </Secao>

      {/* ---------------------------------------------------------------
          Antes e depois — só existe quando há caso autorizado. Vazio na v1:
          não há autorizações documentadas, e galeria inventada é processo
          ético, não deslize de conteúdo (§ 3.3).
          --------------------------------------------------------------- */}
      {procedimento.antesDepois.length > 0 ? (
        <Secao superficie="areia" aria-labelledby="secao-antes-depois">
          <Container comRail>
            <SectionTitle
              as="h2"
              id="secao-antes-depois"
              eyebrow={EYEBROWS.antesDepois}
              classNameBloco="mb-16"
            >
              {TITULOS.antesDepois}
            </SectionTitle>

            {procedimento.antesDepois.map((caso, indice) => (
              <Caso key={caso.autorizacaoId} caso={caso} indice={indice} />
            ))}
          </Container>
        </Secao>
      ) : null}

      {/* --------------------------------------------------------------- */}
      <Secao superficie="areia-100" aria-labelledby="secao-faq">
        <RailLateral>{procedimento.nome}</RailLateral>
        <Container comRail>
          <Duas
            titulo={
              <SectionTitle as="h2" id="secao-faq" eyebrow={EYEBROWS.faq}>
                {TITULOS.faq}
              </SectionTitle>
            }
          >
            <FAQ itens={faq} idBase={`faq-${procedimento.slug}`} />
          </Duas>
        </Container>
      </Secao>

      {/* --------------------------------------------------------------- */}
      {relacionados.length > 0 ? (
        <Secao
          superficie="areia"
          espacamento="compacto"
          aria-labelledby="secao-relacionados"
        >
          <Container comRail>
            <Duas
              titulo={
                <SectionTitle
                  as="h2"
                  id="secao-relacionados"
                  eyebrow={EYEBROWS.relacionados}
                >
                  {TITULOS.relacionados}
                </SectionTitle>
              }
            >
              <ul className="border-sand-200 list-none border-t">
                {relacionados.map((outro) => (
                  <li key={outro.slug} className="border-sand-200 border-b">
                    <Link
                      href={`/${outro.hub}/${outro.slug}`}
                      className="group grid gap-x-10 gap-y-2 py-7 no-underline md:grid-cols-[minmax(0,14rem)_minmax(0,1fr)]"
                    >
                      <span className="text-h3 group-hover:text-wine-700 font-medium">
                        {outro.nome}
                      </span>
                      <span className="medida text-small text-ink-600">
                        {outro.lead}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </Duas>
          </Container>
        </Secao>
      ) : null}

      {/* --------------------------------------------------------------- */}
      <Secao superficie="vinho" aria-labelledby="secao-cta">
        <Container comRail>
          <div className="grid gap-x-16 gap-y-12 lg:grid-cols-12">
            <div className="lg:col-span-6">
              <SectionTitle as="h2" id="secao-cta" eyebrow="Próximo passo">
                {`Conversar sobre ${procedimento.nome.toLowerCase()}`}
              </SectionTitle>
            </div>

            <div className="lg:col-span-4 lg:col-start-8">
              <p className="medida text-body text-sand-50">{CTA_CORPO}</p>

              <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-5">
                <Botao href="/contato">{procedimento.ctaFinal}</Botao>
                <Botao href={`/${procedimento.hub}`} variante="filete">
                  {`Ver ${hubNome.toLowerCase()}`}
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
