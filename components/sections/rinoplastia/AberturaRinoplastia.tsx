import { getHome } from "@/content";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Nota } from "@/components/ui/Nota";
import { Reveal } from "@/components/ui/Reveal";
import { Secao } from "@/components/ui/Secao";
import { FluxoDeAr } from "./FluxoDeAr";

/**
 * Abertura da página de rinoplastia — a composição extra do § 7.
 *
 * "Rinoplastia é a página mais importante do site depois da home. Ela recebe
 * tratamento de landing page completa: hero próprio, seção função vs.
 * estética. É onde a tese 'forma e função' vira argumento comercial."
 *
 * Esta seção é esse hero e essa seção ao mesmo tempo, e vem ANTES do template.
 * Ela não substitui o hero curto do `PaginaProcedimento`: ela o antecede, como
 * a capa antecede a folha de rosto. A página lê assim:
 *
 *   abertura (vinho)   a tese, desenhada e escrita — sem heading
 *   hero (areia)       o H1, "Rinoplastia estética e funcional"
 *   template           as onze seções do § 8.10
 *
 * ## Por que ela não tem heading
 *
 * Porque o `<h1>` da página é o do template, e um heading aqui viria antes
 * dele — salto de hierarquia que o § 9 não abre mão de evitar. O peso visual
 * vem da tipografia display e da superfície, não do nível semântico. A seção
 * se identifica por `aria-label`.
 *
 * ## Por que ela é vinho e o resto das páginas de procedimento abre em areia
 *
 * Porque é a única. Onze páginas de procedimento abrem em areia, com o mesmo
 * hero curto; a rinoplastia acrescenta um bloco antes. Se a diferença fosse
 * repetida, deixaria de ser diferença — e o § 5.2 é explícito: vinho é
 * superfície, e destaque vem de troca de superfície, não de cor nova.
 *
 * O `-mt-[var(--header-h)]` puxa a seção para debaixo do Header sticky. Sem
 * ele o header transparente flutuaria sobre areia com tipografia blush, a
 * 1.2:1 — o Header mede esse overlap e cai para tinta, então o erro seria
 * silencioso e feio em vez de silencioso e ilegível. O padding-top compensa a
 * altura de volta.
 *
 * ## O texto
 *
 * Nada aqui é inventado. O manifesto e o parágrafo de apoio são o § 8.3, e o
 * corpo é o § 8.5 — os dois blocos da home que apontam para esta página. A
 * home dá a versão curta do argumento e manda para cá; aqui ele abre. A
 * repetição é deliberada: é o mesmo argumento, dito de novo no lugar onde a
 * decisão acontece.
 */

const EYEBROW = "Forma e função";

const LEGENDA_ILUSTRACAO =
  "Esquema. As linhas de corrente se aproximam onde o canal estreita — a " +
  "válvula nasal, o ponto mais estreito da via aérea. Desenho esquemático, " +
  "sem escala anatômica.";

export function AberturaRinoplastia() {
  const home = getHome();

  return (
    <Secao
      superficie="vinho"
      espacamento="nenhum"
      aria-label={EYEBROW}
      className="-mt-[var(--header-h)] pt-[calc(var(--header-h)+var(--secao-y)*0.75)] pb-[calc(var(--secao-y)*0.85)]"
    >
      <Container comRail>
        <div className="grid items-center gap-x-16 gap-y-16 lg:grid-cols-12">
          <Reveal className="lg:col-span-6">
            <Eyebrow>{EYEBROW}</Eyebrow>

            {/*
              O manifesto do § 8.3, quebrado nas mesmas linhas curtas da home:
              a quebra é decisão de design, e por isso o conteúdo a entrega
              como array em vez de um parágrafo.
            */}
            <p className="font-display text-h1 text-blush-200 mt-8 font-normal">
              {home.manifesto.linhas.map((linha) => (
                <span key={linha} className="block text-balance">
                  {linha}
                </span>
              ))}
            </p>
          </Reveal>

          <Reveal
            as="figure"
            index={1}
            className="lg:col-span-4 lg:col-start-8"
          >
            <FluxoDeAr className="text-blush-200" />

            <figcaption className="border-wine-600 mt-8 border-t pt-6">
              <Nota>{LEGENDA_ILUSTRACAO}</Nota>
            </figcaption>
          </Reveal>
        </div>

        <div className="mt-[calc(var(--secao-y)*0.6)] grid gap-x-16 gap-y-10 lg:grid-cols-12">
          <Reveal index={2} className="lg:col-span-6">
            <p className="medida text-lead text-sand-50">
              {home.manifesto.apoio}
            </p>
          </Reveal>

          <Reveal index={3} className="lg:col-span-4 lg:col-start-8">
            <p className="medida text-body text-sand-50">
              {home.rinoplastia.corpo}
            </p>

            <Nota className="mt-10">{home.rinoplastia.nota}</Nota>
          </Reveal>
        </div>
      </Container>
    </Secao>
  );
}
