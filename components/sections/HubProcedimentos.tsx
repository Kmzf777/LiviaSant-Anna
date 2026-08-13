import Link from "next/link";

import type { Hub, HubSlug, Procedimento } from "@/content";
import { getMedica } from "@/content";
import { CardProcedimento } from "@/components/medical/CardProcedimento";
import { RailLateral } from "@/components/layout/RailLateral";
import { Botao } from "@/components/ui/Botao";
import { Citacao } from "@/components/ui/Citacao";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Filete } from "@/components/ui/Filete";
import { Nota } from "@/components/ui/Nota";
import { Reveal } from "@/components/ui/Reveal";
import { Secao } from "@/components/ui/Secao";
import { SectionTitle } from "@/components/ui/SectionTitle";

/**
 * HubProcedimentos — o layout dos hubs.
 *
 * Um único componente para `/otorrinolaringologia`, `/estetica-facial` e, no
 * que depender daqui, também para `/cirurgia-da-face`. Isso é a tese do site
 * virando código.
 *
 * O site atende duas pessoas que quase não se cruzam: a mãe que procura quem
 * opera a amígdala do filho e a mulher de 34 anos pesquisando rinoplastia. O
 * que as mantém no mesmo lugar é que ela é otorrinolaringologista **antes** de
 * operar a face. Se o hub de estética tivesse mais recursos visuais que o de
 * otorrino, o site desmentiria a tese na primeira rolagem — e o inverso
 * também. Por isso a diferenciação entre clínico e estético acontece só por
 * conteúdo e superfície, nunca por hierarquia de componente, e a garantia
 * disso é não existir um segundo template.
 *
 * ## Superfícies
 *
 *   hero            areia       mesma entrada da página de procedimento
 *   a premissa      vinho       a imersão, cedo, onde a dúvida ainda existe
 *   procedimentos   areia       o índice
 *   quem conduz     areia-100   a formação, em mono, porque é fato
 *   próximo passo   vinho       fecho
 *
 * Nenhuma seção repete a superfície da anterior — é o que dá o ritmo do § 5.2,
 * e é testado.
 *
 * **Hero em areia, e não em vinho.** Hub e procedimento abrem iguais, que é a
 * regra que `PaginaProcedimento` documenta. Um hero full-bleed vinho exigiria
 * `-mt-[var(--header-h)]` e compensação de padding para o Header transparente
 * não flutuar sobre a areia do body com tipografia blush ilegível; em areia,
 * nada disso é necessário e o Header cai sozinho para tinta.
 *
 * ## A premissa
 *
 * A abertura de `hub.introducao` vira citação em display. A primeira frase é
 * separada do resto do parágrafo de propósito: `Citacao` compõe em 22ch, e o
 * parágrafo de abertura do hub de otorrino tem 315 caracteres — inteiro, viria
 * uma parede de dezoito linhas em Bodoni de 3.25rem. Recortada, cada hub
 * ganha uma citação de tamanho parecido, que é o que mantém os três com o
 * mesmo peso visual. Não é reescrever conteúdo: é tipografar o que veio.
 */

// -----------------------------------------------------------------------------
// Copy de interface
//
// Rótulo de navegação, não conteúdo médico: muda com o layout, não com a
// medicina. Por isso fica aqui e não em `content/`.
// -----------------------------------------------------------------------------

const EYEBROW_PREMISSA = "A premissa";
const EYEBROW_LISTA = "O que eu trato";
const TITULO_LISTA = "Procedimentos";
const EYEBROW_MEDICA = "A médica";
const TITULO_MEDICA = "Quem conduz";
const CTA_MEDICA = "Conhecer a médica";
const EYEBROW_CTA = "Próximo passo";
const CTA_CONSULTA = "Ver como é a consulta";

const APOIO_CTA =
  "A avaliação é individual. O que é indicado no seu caso sai do exame e da " +
  "conversa, não desta página.";

const NOTA_RESULTADOS =
  "Resultados variam conforme anatomia, cicatrização e histórico de cada " +
  "paciente.";

/**
 * A ressalva que fecha a lista.
 *
 * Muda por hub porque a frase precisa ser verdadeira: a estética facial da v1
 * não tem procedimento cirúrgico, e abrir a seção com "toda cirurgia envolve
 * riscos" ali seria descrever errado o que ela faz. O que não muda é existir a
 * ressalva, e ela remeter à seção de riscos de cada página.
 */
const NOTA_RISCOS: Record<HubSlug, string> = {
  "otorrinolaringologia":
    "Toda cirurgia envolve riscos. Cada página traz a seção de riscos e " +
    "limites do procedimento, e eles são avaliados caso a caso na consulta e " +
    "no termo de consentimento.",
  "cirurgia-da-face":
    "Toda cirurgia envolve riscos. Cada página traz a seção de riscos e " +
    "limites do procedimento, e eles são avaliados caso a caso na consulta e " +
    "no termo de consentimento.",
  "estetica-facial":
    "Todo procedimento tem indicação, limite e risco. Cada página traz a " +
    "seção de riscos e limites, e eles são avaliados caso a caso na consulta.",
};

const ID_TITULO = "hub-titulo";
const ID_LISTA = "hub-procedimentos";
const ID_MEDICA = "hub-medica";
const ID_CTA = "hub-cta";

/** Acima disto, a frase deixa de caber numa citação e vira parede. */
const LIMITE_CITACAO = 200;

type Props = {
  readonly hub: Hub;
  readonly procedimentos: readonly Procedimento[];
};

/**
 * Separa a primeira frase do parágrafo de abertura.
 *
 * Frase longa demais não vira citação: melhor uma abertura em `text-lead` do
 * que uma parede em display. O corte é no primeiro ". " — não há abreviação
 * nos textos de `content/hubs.ts`, e o pior caso de um corte errado é uma
 * citação mais longa, nunca conteúdo perdido: o resto sempre é renderizado.
 */
export function separarAbertura(paragrafo: string): {
  readonly citacao: string | null;
  readonly resto: string;
} {
  const fim = paragrafo.indexOf(". ");

  if (fim === -1 || fim + 1 > LIMITE_CITACAO) {
    return { citacao: null, resto: paragrafo };
  }

  return {
    citacao: paragrafo.slice(0, fim + 1),
    resto: paragrafo.slice(fim + 2),
  };
}

export function HubProcedimentos({ hub, procedimentos }: Props) {
  const medica = getMedica();
  const [abertura, ...demais] = hub.introducao;
  const { citacao, resto } = separarAbertura(abertura);

  const apoio = [resto, ...demais].filter((texto) => texto.length > 0);

  return (
    <>
      {/* ---------------------------------------------------------------- Hero
          Areia, como a página de procedimento: hub e procedimento abrem
          igual, e o Header lê a superfície da primeira seção para decidir a
          própria cor.
          --------------------------------------------------------------- */}
      <Secao
        superficie="areia"
        espacamento="nenhum"
        aria-labelledby={ID_TITULO}
        className="pt-[calc(var(--secao-y)*0.55)] pb-[calc(var(--secao-y)*0.7)]"
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
                id={ID_TITULO}
                className="font-display text-h1 mt-7 font-normal text-balance"
              >
                {hub.h1}
              </h1>
            </div>

            <div className="lg:col-span-5 lg:pt-3">
              <p className="medida text-lead">{hub.lead}</p>
              <div className="mt-10">
                <Botao href="/contato">{hub.ctaFinal}</Botao>
              </div>
            </div>
          </div>

          <Filete className="mt-[calc(var(--secao-y)*0.55)]" />
        </Container>
      </Secao>

      {/* ----------------------------------------------------------- Premissa
          Vinho, e cedo: é a resposta para a pergunta que a audiência traz e
          quase nunca faz em voz alta.
          --------------------------------------------------------------- */}
      <Secao superficie="vinho" aria-label={EYEBROW_PREMISSA}>
        <RailLateral>{EYEBROW_PREMISSA}</RailLateral>

        <Container comRail>
          <div className="grid gap-x-16 gap-y-12 lg:grid-cols-12">
            <Reveal className="lg:col-span-6">
              <Eyebrow className="mb-8">{EYEBROW_PREMISSA}</Eyebrow>

              {citacao ? (
                <Citacao>{citacao}</Citacao>
              ) : (
                <p className="medida text-lead text-blush-200">{abertura}</p>
              )}
            </Reveal>

            <Reveal index={1} className="lg:col-span-5 lg:col-start-8 lg:pt-3">
              {apoio.map((paragrafo) => (
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

      {/* ------------------------------------------------------ Procedimentos
          Linhas separadas por filete, não a grade de três ícones de linha com
          título e um parágrafo cada que o § 15 manda refazer.
          --------------------------------------------------------------- */}
      <Secao superficie="areia" aria-labelledby={ID_LISTA}>
        <RailLateral>{TITULO_LISTA}</RailLateral>

        <Container comRail>
          <SectionTitle
            as="h2"
            id={ID_LISTA}
            eyebrow={EYEBROW_LISTA}
            classNameBloco="mb-16 lg:mb-20"
          >
            {TITULO_LISTA}
          </SectionTitle>

          <ul className="filete list-none border-t">
            {procedimentos.map((procedimento, indice) => (
              <Reveal
                as="li"
                key={procedimento.slug}
                index={Math.min(indice, 4)}
                className="w-full"
              >
                <CardProcedimento procedimento={procedimento} />
              </Reveal>
            ))}
          </ul>

          <Nota tom="atencao" className="mt-16">
            {NOTA_RISCOS[hub.slug]}
          </Nota>
        </Container>
      </Secao>

      {/* --------------------------------------------------------- A médica
          A formação em mono, que é como o site escreve fato.
          --------------------------------------------------------------- */}
      <Secao
        superficie="areia-100"
        espacamento="compacto"
        aria-labelledby={ID_MEDICA}
      >
        <Container comRail>
          <div className="grid gap-x-16 gap-y-10 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <SectionTitle as="h2" id={ID_MEDICA} eyebrow={EYEBROW_MEDICA}>
                {TITULO_MEDICA}
              </SectionTitle>
            </div>

            <div className="lg:col-span-7 lg:col-start-6">
              <p className="medida text-lead">{medica.descricaoAtuacao}.</p>

              <dl className="filete mt-12 border-t">
                {medica.formacao.map((item) => (
                  <div
                    key={item.rotulo}
                    className="filete grid gap-x-8 gap-y-1 border-b py-5 sm:grid-cols-[minmax(0,9rem)_minmax(0,1fr)]"
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
                  {CTA_MEDICA}
                </Botao>
              </div>
            </div>
          </div>
        </Container>
      </Secao>

      {/* --------------------------------------------------------- CTA final */}
      <Secao superficie="vinho" aria-labelledby={ID_CTA}>
        <Container comRail>
          <div className="grid gap-x-16 gap-y-12 lg:grid-cols-12">
            <div className="lg:col-span-6">
              <SectionTitle as="h2" id={ID_CTA} eyebrow={EYEBROW_CTA}>
                {`Conversar sobre ${hub.nome.toLocaleLowerCase("pt-BR")}`}
              </SectionTitle>
            </div>

            <div className="lg:col-span-5 lg:col-start-8">
              <p className="medida text-body text-sand-50">{APOIO_CTA}</p>

              <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-5">
                <Botao href="/contato">{hub.ctaFinal}</Botao>
                <Botao href="/consulta" variante="filete">
                  {CTA_CONSULTA}
                </Botao>
              </div>

              <Nota className="mt-12">{NOTA_RESULTADOS}</Nota>
            </div>
          </div>
        </Container>
      </Secao>
    </>
  );
}
