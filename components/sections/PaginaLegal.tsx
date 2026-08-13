import type { PaginaInstitucional } from "@/content";
import { Container } from "@/components/ui/Container";
import { Filete } from "@/components/ui/Filete";
import { RailLateral } from "@/components/layout/RailLateral";
import { Secao } from "@/components/ui/Secao";
import { SectionTitle } from "@/components/ui/SectionTitle";
import {
  descricaoPendente,
  estaPendente,
  ParagrafoPendente,
} from "./DadoPendente";

/**
 * O render das duas páginas legais.
 *
 * Política de privacidade e aviso legal têm a mesma forma — eyebrow, h1, lead,
 * blocos de título e parágrafos — e nenhuma razão para terem composições
 * diferentes. Aqui a decisão de design é quase toda tipográfica: medida de
 * linha curta, hierarquia sem enfeite, e um sumário que gruda na lateral para
 * quem chegou procurando uma seção específica (que é como se lê uma política
 * de privacidade: ninguém lê da primeira à última linha).
 *
 * Os títulos de bloco vão em `font-body`, não em Bodoni. São onze numa página;
 * em display, no degrau `h2`, virariam onze manchetes competindo com o `h1` e
 * a página perderia o eixo. A display continua reservada ao título da página.
 *
 * Parágrafos `[CONFIRMAR: …]` não são impressos crus: viram um bloco de
 * pendência, com o que falta escrito em português. Ver `DadoPendente`.
 */

function ancora(titulo: string): string {
  return titulo
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function numero(indice: number): string {
  return String(indice + 1).padStart(2, "0");
}

type Props = {
  readonly pagina: PaginaInstitucional;
};

export function PaginaLegal({ pagina }: Props) {
  return (
    <>
      <Secao superficie="areia" aria-labelledby="titulo-da-pagina">
        <RailLateral>{pagina.eyebrow}</RailLateral>

        <Container comRail>
          <SectionTitle
            as="h1"
            tamanho="h1"
            eyebrow={pagina.eyebrow}
            id="titulo-da-pagina"
            className="max-w-[16ch]"
          >
            {pagina.h1}
          </SectionTitle>

          <p className="text-lead text-ink-600 medida mt-10">{pagina.lead}</p>
        </Container>
      </Secao>

      <Secao superficie="areia-100" aria-label="Conteúdo">
        <Container comRail>
          <div className="grid gap-14 lg:grid-cols-[16rem_1fr] lg:gap-20">
            <nav
              aria-label="Nesta página"
              className="lg:sticky lg:top-[calc(var(--header-h)+3rem)] lg:self-start"
            >
              <ul className="flex list-none flex-col gap-3">
                {pagina.blocos.map((bloco, indice) => (
                  <li key={bloco.titulo} className="flex gap-4">
                    <span
                      aria-hidden="true"
                      className="text-micro text-ink-400 font-mono tracking-[0.14em]"
                    >
                      {numero(indice)}
                    </span>
                    <a
                      href={`#${ancora(bloco.titulo)}`}
                      className="link-filete text-small text-ink-600 self-start"
                    >
                      {bloco.titulo}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="flex flex-col">
              {pagina.blocos.map((bloco, indice) => (
                <section
                  key={bloco.titulo}
                  id={ancora(bloco.titulo)}
                  aria-labelledby={`${ancora(bloco.titulo)}-titulo`}
                  className="scroll-mt-[calc(var(--header-h)+2rem)] pb-14"
                >
                  {indice > 0 ? <Filete className="mb-14" /> : null}

                  <div className="flex items-baseline gap-4">
                    <span
                      aria-hidden="true"
                      className="text-micro text-ink-400 font-mono tracking-[0.14em]"
                    >
                      {numero(indice)}
                    </span>
                    <h2
                      id={`${ancora(bloco.titulo)}-titulo`}
                      className="text-h3 font-body font-medium"
                    >
                      {bloco.titulo}
                    </h2>
                  </div>

                  <div className="mt-6 flex flex-col gap-5 lg:pl-10">
                    {/*
                      A chave é o índice, não o texto do parágrafo.

                      Com o texto, o `[CONFIRMAR: …]` cru virava chave de React
                      e ia parar no payload RSC embutido no HTML — invisível na
                      tela, mas presente na fonte da página, que é onde qualquer
                      um olha primeiro. Pego por scripts/verificar-html.ts.

                      Índice é chave segura aqui: a lista é estática e nunca é
                      reordenada nem filtrada em runtime.
                    */}
                    {bloco.paragrafos.map((paragrafo, indice) =>
                      estaPendente(paragrafo) ? (
                        <ParagrafoPendente key={indice}>
                          {descricaoPendente(paragrafo) ?? paragrafo}
                        </ParagrafoPendente>
                      ) : (
                        <p
                          key={indice}
                          className="text-body text-ink-900 medida"
                        >
                          {paragrafo}
                        </p>
                      ),
                    )}
                  </div>
                </section>
              ))}
            </div>
          </div>
        </Container>
      </Secao>
    </>
  );
}
