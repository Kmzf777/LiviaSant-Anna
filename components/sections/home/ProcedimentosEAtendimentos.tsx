import Link from "next/link";

import { BotaoWhatsApp } from "@/components/form/BotaoWhatsApp";
import { Botao } from "@/components/ui/Botao";
import { Container } from "@/components/ui/Container";
import { CLASSES_EYEBROW } from "@/components/ui/Eyebrow";
import { Nota } from "@/components/ui/Nota";
import { Reveal } from "@/components/ui/Reveal";
import { Secao } from "@/components/ui/Secao";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { cn } from "@/components/ui/cn";
import { listarHubs } from "@/content";
import type {
  ConteudoHome,
  GrupoDeQueixas,
  HubSlug,
  Procedimento,
} from "@/content/tipos";
import { RITMO_RESPIRO, RITMO_SECAO } from "../ritmo";

/**
 * § 4 — Procedimentos e atendimentos, e o fecho. Areia, depois vinho.
 *
 * A última pergunta antes de agendar: "o meu caso está aqui?". Duas colunas
 * que respondem de dois jeitos, e a tipografia é o que separa os dois:
 *
 *   Cirurgias que realizo   mono, com link  — é o nome técnico, e é fato
 *   O que trato em consulta corpo, sem link — é a queixa, na língua de quem sente
 *
 * A assimetria é a tese do § 5.3 aplicada ao lugar em que ela mais rende.
 * Ninguém procura "timpanoplastia": procura "meu filho tem otite direto". A
 * coluna da direita é onde a pessoa se reconhece; a da esquerda é para onde
 * ela vai depois. Juntas, são o que faz a home passar no teste dos cinco
 * segundos do briefing § 2.
 *
 * ## A coluna de cirurgias não lista a toxina botulínica
 *
 * `listarProcedimentos()` devolve os 11 procedimentos dos três hubs, e o
 * décimo primeiro é toxina botulínica — que o próprio site descreve, no H1 do
 * hub de estética facial, como "procedimentos sem cirurgia". Publicá-lo sob o
 * título "Cirurgias que realizo" seria uma afirmação factualmente errada num
 * site médico, que é a mesma classe de erro que a curadoria de fotos evita ao
 * não legendar quem é quem.
 *
 * O hub de estética facial continua alcançável pelo Header, pelo menu mobile e
 * pelo rodapé — a lista de navegação nasce de `content/nav.ts`, e nada aqui a
 * afeta. Se o título mudar em `content/home.ts`, esta constante some.
 *
 * ## Por que o fecho NÃO é vinho
 *
 * Foi, e estava errado. Vinho é superfície e não detalhe (§ 5.2), e fechar a
 * página na cor em que ela abriu é uma simetria bonita — que aqui produzia dois
 * retângulos escuros empilhados, porque o rodapé é `wine-900` e vem logo
 * abaixo. Pior: o rodapé já traz "Uma consulta antes de qualquer decisão" em
 * display e o mesmo botão, então a página terminava dizendo "agende sua
 * consulta" duas vezes em meia tela.
 *
 * Dois agentes diferentes apontaram isso em revisões separadas, o que costuma
 * significar que não é preferência.
 *
 * `areia-100` resolve os dois: o fecho ganha degrau sem virar bloco escuro, e o
 * rodapé volta a ser o único fim da página. A alternância fica
 * areia → areia-100 → wine-900, que é uma descida, não uma repetição.
 *
 * Ele é uma `div` e não uma `section`: não abre assunto novo, é o desfecho do
 * H2 acima. Uma landmark a mais, sem título próprio, só acrescenta ruído para
 * quem navega por regiões.
 */

type Props = {
  readonly bloco: ConteudoHome["procedimentos"];
  readonly procedimentos: readonly Procedimento[];
};

/** Os hubs cujos procedimentos são, de fato, cirurgias. Ver o cabeçalho. */
const HUBS_CIRURGICOS: readonly HubSlug[] = [
  "otorrinolaringologia",
  "cirurgia-da-face",
];

const TITULO_COLUNA = "text-h3 text-ink-900";

export function ProcedimentosEAtendimentos({ bloco, procedimentos }: Props) {
  const grupos = listarHubs()
    .filter((hub) => HUBS_CIRURGICOS.includes(hub.slug))
    .map((hub) => ({
      hub,
      itens: procedimentos.filter((p) => p.hub === hub.slug),
    }))
    .filter((grupo) => grupo.itens.length > 0);

  return (
    <>
      <Secao
        superficie="areia"
        espacamento="nenhum"
        className={RITMO_SECAO}
        aria-labelledby="procedimentos-titulo"
      >
        <Container>
          <Reveal>
            <SectionTitle
              id="procedimentos-titulo"
              eyebrow={bloco.eyebrow}
              as="h2"
              tamanho="h2"
            >
              {bloco.h2}
            </SectionTitle>

            <p className="medida text-lead text-ink-600 mt-8">{bloco.texto}</p>
          </Reveal>

          <div
            className={cn(
              RITMO_RESPIRO,
              "grid gap-y-14 lg:grid-cols-12 lg:gap-x-[var(--gutter)]",
            )}
          >
            {/* 4 e 7 colunas, e não 5 e 6: a coluna de cirurgias carrega nomes
                curtos em mono e sobrava largura; a de queixas carrega três
                listas lado a lado e cada centímetro tira uma quebra de linha
                de cada item. */}
            <Reveal className="lg:col-span-4">
              <h3 className={TITULO_COLUNA}>{bloco.tituloCirurgias}</h3>

              <div className="mt-8 flex flex-col gap-10">
                {grupos.map((grupo) => (
                  <div key={grupo.hub.slug}>
                    <h4 className={CLASSES_EYEBROW}>{grupo.hub.nome}</h4>

                    <ul className="filete mt-4 flex list-none flex-col border-b">
                      {grupo.itens.map((procedimento) => (
                        <li
                          key={procedimento.slug}
                          className="filete flex border-t"
                        >
                          <Link
                            href={`/${procedimento.hub}/${procedimento.slug}`}
                            className="link-filete text-small text-wine-700 w-full font-mono tracking-[0.04em]"
                          >
                            {procedimento.nome}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal index={1} className="lg:col-span-7 lg:col-start-6">
              <h3 className={TITULO_COLUNA}>{bloco.tituloAtendimentos}</h3>

              <div className="mt-8 grid gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-[var(--gutter)]">
                {bloco.atendimentos.map((grupo) => (
                  <GrupoDeAtendimento key={grupo.orgao} grupo={grupo} />
                ))}
              </div>
            </Reveal>
          </div>
        </Container>
      </Secao>

      {/* Mais alto que uma seção normal e alinhado ao mesmo eixo esquerdo do
          resto da página (sem `comRail`), para o fecho ter corpo de fecho e não
          de barra de aviso. A superfície é `areia-100` — ver o cabeçalho. */}
      <Secao
        superficie="areia-100"
        as="div"
        espacamento="nenhum"
        className="py-[calc(clamp(3.5rem,2.25rem_+_5vw,var(--secao-y))*1.4)]"
      >
        <Container>
          {/* Sem `justify-between`: com um botão curto e uma nota curta, as
              duas pontas do container ficam a 1.100px uma da outra e o aviso
              deixa de pertencer à ação que ele qualifica. */}
          <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:gap-16">
            {/* A ação primeiro, a ressalva depois: na ordem de leitura e na
                ordem do DOM. A `Nota` em mono é a mesma voz do disclaimer de
                toda ficha técnica do site. */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <Botao href={bloco.cta.href}>{bloco.cta.texto}</Botao>
              <BotaoWhatsApp />
            </div>

            <Nota>{bloco.fecho}</Nota>
          </div>
        </Container>
      </Secao>
    </>
  );
}

/**
 * Um órgão e as queixas dele.
 *
 * Sem filete entre os itens, ao contrário da coluna de cirurgias: régua em
 * dezoito linhas viraria uma tabela, e o que se pede aqui é reconhecimento,
 * não consulta. O filete fica reservado ao que é índice.
 */
function GrupoDeAtendimento({
  grupo,
}: {
  readonly grupo: GrupoDeQueixas;
}) {
  return (
    <div>
      <h4 className={CLASSES_EYEBROW}>{grupo.orgao}</h4>

      <ul className="mt-5 flex list-none flex-col gap-3">
        {grupo.queixas.map((queixa) => (
          <li key={queixa} className="text-body text-ink-600">
            {queixa}
          </li>
        ))}
      </ul>

      {/* A saída para o hub, por grupo.

          A lista caiu de seis queixas para três em cada órgão — o dono do site
          chamou dezoito itens em três colunas de "informação embaralhada". As
          que saíram não sumiram: vivem nas páginas de procedimento, onde há
          espaço para explicá-las e onde elas trabalham para a busca. Este link
          é o caminho até lá, e é o que transforma o corte numa porta em vez de
          numa perda. */}
      <Link
        href="/otorrinolaringologia"
        className="link-filete text-small text-wine-700 mt-5 inline-block font-mono tracking-[0.04em]"
      >
        Ver tratamentos de {grupo.orgao.toLowerCase()}
      </Link>
    </div>
  );
}
