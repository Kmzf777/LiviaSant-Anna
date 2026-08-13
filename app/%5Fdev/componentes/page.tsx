import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

import type { PassoConsulta, PerguntaResposta } from "@/content/tipos";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { RailLateral } from "@/components/layout/RailLateral";
import { Botao } from "@/components/ui/Botao";
import { Citacao } from "@/components/ui/Citacao";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { FAQ } from "@/components/ui/FAQ";
import { Filete } from "@/components/ui/Filete";
import { Nota } from "@/components/ui/Nota";
import { Passos } from "@/components/ui/Passos";
import { PlaceholderImagem } from "@/components/ui/PlaceholderImagem";
import { RetratoArco } from "@/components/ui/RetratoArco";
import { Reveal } from "@/components/ui/Reveal";
import { Secao } from "@/components/ui/Secao";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Selo } from "@/components/ui/Selo";

/**
 * Galeria de componentes — rota de desenvolvimento, fora do índice.
 *
 * ## Por que a pasta se chama `%5Fdev` e não `_dev`
 *
 * O briefing (§ 6 e § 11) pede a rota `/_dev/componentes`. No App Router, uma
 * pasta iniciada por underscore é uma *private folder*: o Next a exclui do
 * roteamento inteiro, e `app/_dev/componentes/page.tsx` simplesmente não gera
 * rota nenhuma — a galeria existiria como arquivo e daria 404 no navegador.
 * `%5F` é a forma percent-encoded do underscore, que o Next decodifica de
 * volta ao montar o segmento. O caminho no disco fica feio; a URL fica sendo
 * exatamente `/_dev/componentes`, que é o que `app/robots.ts` já bloqueia e o
 * que o briefing pediu.
 *
 * Existe no lugar do Storybook (§ 6): mostra cada primitivo em todos os
 * estados, nas duas superfícies, na mesma página. O valor não é catalogar; é
 * que uma regressão de contraste ou de superfície aparece aqui antes de
 * aparecer numa página de procedimento.
 *
 * Hover e foco são estados de interação e não podem ser capturados em markup
 * estático. Em vez de inventar uma prop de demonstração que poluiria a API dos
 * componentes, as amostras marcadas como "hover" e "foco" recebem por
 * `className` exatamente as classes que aquelas pseudoclasses aplicam.
 */

export const metadata: Metadata = {
  title: "Galeria de componentes",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#6d1f3a",
};

// -----------------------------------------------------------------------------
// Dados de amostra. Não são conteúdo do site — nada aqui vai para produção.
// -----------------------------------------------------------------------------

const PASSOS_AMOSTRA: readonly PassoConsulta[] = [
  {
    numero: "01",
    titulo: "Conversa",
    descricao: "Você conta o que te incomoda. Eu escuto antes de examinar.",
  },
  {
    numero: "02",
    titulo: "Exame",
    descricao:
      "Avaliação completa de via aérea e da anatomia da face. Nasofibroscopia quando indicada.",
  },
  {
    numero: "03",
    titulo: "Planejamento",
    descricao:
      "Explico o que é possível, o que não é, os riscos e o tempo de recuperação.",
  },
  {
    numero: "04",
    titulo: "Decisão",
    descricao:
      "Se fizer sentido para você, agendamos. Se não fizer, também está certo.",
  },
];

const FAQ_AMOSTRA: readonly PerguntaResposta[] = [
  {
    pergunta: "A cirurgia de septo muda a aparência do nariz?",
    resposta:
      "Depende do que precisa ser corrigido. A septoplastia trabalha por dentro e, sozinha, costuma não alterar a forma externa. Quando há indicação de mudar o contorno, isso é planejado e conversado antes.",
  },
  {
    pergunta: "Quanto tempo depois consigo voltar ao trabalho?",
    resposta:
      "Varia por procedimento e por pessoa. O intervalo estimado de cada cirurgia está na ficha técnica da página correspondente, sempre com a ressalva de que é estimativa.",
  },
  {
    pergunta: "Crianças são atendidas?",
    resposta:
      "Sim. Amígdalas, adenoides e tubo de ventilação são procedimentos frequentes na infância.",
  },
];

// -----------------------------------------------------------------------------
// Andaime da própria galeria
// -----------------------------------------------------------------------------

function Grupo({
  titulo,
  nota,
  children,
}: {
  readonly titulo: string;
  readonly nota?: string;
  readonly children: ReactNode;
}) {
  return (
    <section className="flex flex-col gap-8 py-14">
      <div className="flex flex-col gap-2">
        <h2 className="text-micro text-ink-400 font-mono tracking-[0.14em] uppercase">
          {titulo}
        </h2>
        {nota !== undefined ? (
          <p className="text-small text-ink-600 max-w-[68ch]">{nota}</p>
        ) : null}
      </div>

      {children}

      <Filete />
    </section>
  );
}

function Estado({
  rotulo,
  children,
  superficie = "areia",
}: {
  readonly rotulo: string;
  readonly children: ReactNode;
  readonly superficie?: "areia" | "areia-100" | "vinho";
}) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-micro text-ink-400 font-mono tracking-[0.14em] uppercase">
        {rotulo}
      </p>
      <div
        data-superficie={superficie}
        className="filete rounded-filete border p-6"
      >
        {children}
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------

export default function GaleriaDeComponentes() {
  return (
    <>
      <Header />

      <Secao superficie="areia" espacamento="compacto">
        <Container comRail>
          <RailLateral>Galeria</RailLateral>

          <SectionTitle eyebrow="Rota de desenvolvimento" as="h1" tamanho="h1">
            Componentes
          </SectionTitle>

          <Nota className="mt-8">
            Rota não indexada. Cada primitivo aparece aqui em todos os estados,
            nas superfícies areia, areia-100 e vinho.
          </Nota>
        </Container>
      </Secao>

      <Secao superficie="areia" espacamento="nenhum">
        <Container>
          {/* ------------------------------------------------------------- */}
          <Grupo
            titulo="Botao"
            nota="Duas variantes. O sólido perde o preenchimento no hover e fica só com o filete de 1px; o de filete inferior ganha o underline crescendo da esquerda. Nenhuma cor nova entra em nenhum dos dois estados."
          >
            <div className="grid gap-8 md:grid-cols-2">
              <Estado rotulo="Sólido sobre areia — normal">
                <div className="flex flex-wrap items-center gap-4">
                  <Botao href="/contato">Agendar consulta</Botao>
                  <Botao href="/contato" tamanho="compacto">
                    Agendar consulta
                  </Botao>
                </div>
              </Estado>

              <Estado rotulo="Sólido sobre areia — hover">
                <Botao href="/contato" className="text-wine-700 bg-transparent">
                  Agendar consulta
                </Botao>
              </Estado>

              <Estado rotulo="Sólido sobre areia — foco">
                <Botao
                  href="/contato"
                  className="outline-wine-700 outline outline-2 outline-offset-[3px]"
                >
                  Agendar consulta
                </Botao>
              </Estado>

              <Estado rotulo="Sólido — desabilitado">
                <Botao disabled>Agendar consulta</Botao>
              </Estado>

              <Estado rotulo="Sólido sobre vinho — normal" superficie="vinho">
                <Botao href="/contato">Agendar consulta</Botao>
              </Estado>

              <Estado rotulo="Sólido sobre vinho — hover" superficie="vinho">
                <Botao
                  href="/contato"
                  className="text-blush-200 bg-transparent"
                >
                  Agendar consulta
                </Botao>
              </Estado>

              <Estado rotulo="Filete sobre areia — normal">
                <Botao href="/dra-livia-santanna" variante="filete">
                  Conhecer a médica
                </Botao>
              </Estado>

              <Estado rotulo="Filete sobre areia — hover">
                {/* O underline aberto vai inline: `.link-filete` fecha o
                    background-size no fim da camada de utilitários e venceria
                    qualquer classe de mesma especificidade. */}
                <Botao
                  href="/dra-livia-santanna"
                  variante="filete"
                  style={{ backgroundSize: "100% 1px" }}
                >
                  Conhecer a médica
                </Botao>
              </Estado>

              <Estado rotulo="Filete sobre vinho — normal" superficie="vinho">
                <Botao href="/dra-livia-santanna" variante="filete">
                  Conhecer a médica
                </Botao>
              </Estado>

              <Estado rotulo="Filete — desabilitado">
                <Botao variante="filete" disabled>
                  Conhecer a médica
                </Botao>
              </Estado>

              <Estado rotulo="Como botão, não como link">
                <Botao type="submit">Enviar mensagem</Botao>
              </Estado>
            </div>
          </Grupo>

          {/* ------------------------------------------------------------- */}
          <Grupo
            titulo="Eyebrow"
            nota="Mono, caixa alta, tracking 0.14em. ink-400 sobre areia (5.19:1) e wine-300 sobre vinho (4.58:1). A troca é automática, por ancestral."
          >
            <div className="grid gap-8 md:grid-cols-3">
              <Estado rotulo="Sobre areia">
                <Eyebrow>A premissa</Eyebrow>
              </Estado>
              <Estado rotulo="Sobre areia-100" superficie="areia-100">
                <Eyebrow>As duas frentes</Eyebrow>
              </Estado>
              <Estado rotulo="Sobre vinho" superficie="vinho">
                <Eyebrow>Em destaque</Eyebrow>
              </Estado>
            </div>
          </Grupo>

          {/* ------------------------------------------------------------- */}
          <Grupo
            titulo="SectionTitle"
            nota="Nível do heading e tamanho são props independentes: um é semântica, o outro é composição. Só há degraus de 1.5rem para cima — a Bodoni não desce disso."
          >
            <div className="flex flex-col gap-10">
              <Estado rotulo="tamanho hero, as h2">
                <SectionTitle tamanho="hero" eyebrow="Otorrinolaringologia">
                  Forma e função, nas mesmas mãos.
                </SectionTitle>
              </Estado>

              <Estado rotulo="tamanho h1, sem eyebrow">
                <SectionTitle tamanho="h1">Lívia Sant&apos;Anna</SectionTitle>
              </Estado>

              <Estado
                rotulo="tamanho h2, as h3, sobre vinho"
                superficie="vinho"
              >
                <SectionTitle as="h3" eyebrow="Em destaque">
                  Rinoplastia estética e funcional
                </SectionTitle>
              </Estado>
            </div>
          </Grupo>

          {/* ------------------------------------------------------------- */}
          <Grupo
            titulo="Citacao"
            nota="Aspas curvas U+201C e U+201D, aria-hidden, com a de abertura pendurada na margem para a primeira letra alinhar com a coluna."
          >
            <div className="grid gap-8 md:grid-cols-2">
              <Estado rotulo="Com atribuição">
                <Citacao atribuicao="Lívia Sant'Anna">
                  O nariz é o centro do rosto e a porta da respiração.
                </Citacao>
              </Estado>

              <Estado rotulo="Sem atribuição, sobre vinho" superficie="vinho">
                <Citacao>
                  Mudar um sem entender o outro é resolver metade.
                </Citacao>
              </Estado>
            </div>
          </Grupo>

          {/* ------------------------------------------------------------- */}
          <Grupo
            titulo="Passos"
            nota="Numerado 01 a 04 porque é sequência real, não decoração. Lista vazia não renderiza andaime nenhum."
          >
            <div className="flex flex-col gap-8">
              <Estado rotulo="Quatro passos, com fecho">
                <Passos
                  passos={PASSOS_AMOSTRA}
                  fecho="TODA CIRURGIA ENVOLVE RISCOS. ELES SÃO EXPLICADOS INDIVIDUALMENTE NA CONSULTA E NO TERMO DE CONSENTIMENTO."
                />
              </Estado>

              <Estado rotulo="Estado vazio — não renderiza nada">
                <Passos passos={[]} />
                <p className="text-small text-ink-600">
                  (Sem passos, o componente devolve null em vez de uma lista
                  vazia com filetes soltos.)
                </p>
              </Estado>
            </div>
          </Grupo>

          {/* ------------------------------------------------------------- */}
          <Grupo
            titulo="FAQ"
            nota="details e summary nativos: teclado, Ctrl+F do navegador e funcionamento sem JavaScript vêm de graça. O indicador é mais/menos em filete, sem transição."
          >
            <div className="grid gap-8 lg:grid-cols-2">
              <Estado rotulo="Fechado">
                <FAQ itens={FAQ_AMOSTRA} idBase="faq-demo" />
              </Estado>

              <Estado
                rotulo="Primeiro item aberto, sobre vinho"
                superficie="vinho"
              >
                <FAQ
                  itens={FAQ_AMOSTRA}
                  idBase="faq-demo-vinho"
                  primeiroAberto
                />
              </Estado>

              <Estado rotulo="Estado vazio — não renderiza nada">
                <FAQ itens={[]} />
                <p className="text-small text-ink-600">
                  (Sem perguntas, nada é desenhado.)
                </p>
              </Estado>
            </div>
          </Grupo>

          {/* ------------------------------------------------------------- */}
          <Grupo
            titulo="Nota"
            nota="O disclaimer em mono. tom=atencao é também o estado de erro: filete vinho à esquerda, sem cor nova — a paleta não tem vermelho de erro e não vai ganhar um."
          >
            <div className="grid gap-8 md:grid-cols-2">
              <Estado rotulo="Neutro">
                <Nota>
                  RESULTADOS VARIAM CONFORME ANATOMIA, CICATRIZAÇÃO E HISTÓRICO
                  DE CADA PACIENTE.
                </Nota>
              </Estado>

              <Estado rotulo="Atenção / erro">
                <Nota tom="atencao" live="polite">
                  O número de WhatsApp precisa de DDD. Exemplo: 31 seguido dos
                  nove dígitos.
                </Nota>
              </Estado>

              <Estado rotulo="Neutro sobre vinho" superficie="vinho">
                <Nota>
                  RESULTADOS VARIAM CONFORME ANATOMIA, CICATRIZAÇÃO E HISTÓRICO
                  DE CADA PACIENTE.
                </Nota>
              </Estado>

              <Estado rotulo="Atenção sobre vinho" superficie="vinho">
                <Nota tom="atencao">
                  Imagens de antes e depois exigem autorização documentada.
                </Nota>
              </Estado>
            </div>
          </Grupo>

          {/* ------------------------------------------------------------- */}
          <Grupo
            titulo="PlaceholderImagem e RetratoArco"
            nota="Enquanto as fotos originais não chegam. A proporção é a mesma da foto que vai substituir o bloco, então trocar o arquivo não reposiciona nada em volta."
          >
            <div className="grid gap-8 md:grid-cols-3">
              <Estado rotulo="3/4 — retrato">
                <PlaceholderImagem descricao="Retrato de blazer preto" />
              </Estado>

              <Estado rotulo="3/4 com arco">
                <PlaceholderImagem
                  descricao="Retrato de jaleco com blusa vinho"
                  arco
                />
              </Estado>

              <Estado rotulo="16/9 — faixa">
                <PlaceholderImagem
                  descricao="Fachada do consultório"
                  aspecto="16/9"
                />
              </Estado>

              <Estado rotulo="RetratoArco com imagem pendente">
                <RetratoArco
                  imagem={{
                    tipo: "pendente",
                    descricao: "Retrato de jaleco com scrubs",
                  }}
                  sizes="(min-width: 1024px) 33vw, 100vw"
                />
              </Estado>

              <Estado rotulo="Selo — marca d'água">
                <Selo className="text-wine-700 h-24 w-24 opacity-[0.08]" />
              </Estado>

              <Estado rotulo="Selo — traço cheio">
                <Selo className="text-wine-700 h-24 w-24" />
              </Estado>
            </div>
          </Grupo>

          {/* ------------------------------------------------------------- */}
          <Grupo
            titulo="Filete"
            nota="A única forma de separação do site. A cor vem da superfície, não do componente."
          >
            <div className="grid gap-8 md:grid-cols-2">
              <Estado rotulo="Horizontal sobre areia">
                <Filete />
              </Estado>

              <Estado rotulo="Horizontal sobre vinho" superficie="vinho">
                <Filete />
              </Estado>

              <Estado rotulo="Vertical, entre credenciais">
                <div className="flex items-center gap-6">
                  <span className="text-micro text-ink-600 font-mono tracking-[0.14em] uppercase">
                    Residência · Hospital Madre Teresa
                  </span>
                  <Filete orientacao="vertical" />
                  <span className="text-micro text-ink-600 font-mono tracking-[0.14em] uppercase">
                    Formação · UFV
                  </span>
                </div>
              </Estado>
            </div>
          </Grupo>

          {/* ------------------------------------------------------------- */}
          <Grupo
            titulo="Reveal"
            nota="Fade e translateY de 16px, com stagger de 60ms por índice. Toda a aparência mora na classe .revelar; o componente só decide quando data-visivel aparece. prefers-reduced-motion desliga em CSS, sem passar por JavaScript."
          >
            <div className="grid gap-4 md:grid-cols-4">
              {[0, 1, 2, 3].map((indice) => (
                <Reveal key={indice} index={indice}>
                  <div className="filete rounded-filete border p-6">
                    <p className="text-micro text-ink-400 font-mono tracking-[0.14em] uppercase">
                      index {indice}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </Grupo>

          {/* ------------------------------------------------------------- */}
          <Grupo
            titulo="Secao, Container e RailLateral"
            nota="Secao emite data-superficie, e é esse retângulo que o Traço mede para decidir a cor de cada segmento. O rail some abaixo de 1024px."
          >
            <p className="text-small text-ink-600">
              As três superfícies aparecem em sequência abaixo, fora do
              Container desta galeria, em largura total.
            </p>
          </Grupo>
        </Container>
      </Secao>

      <Secao superficie="areia-100">
        <Container comRail>
          <RailLateral>Superfície areia-100</RailLateral>
          <SectionTitle eyebrow="Superfície" as="h2">
            Areia-100
          </SectionTitle>
          <p className="medida text-body text-ink-600 mt-6">
            Usada para separar dois blocos claros vizinhos sem recorrer a filete
            nem a sombra. É a troca de superfície fazendo o trabalho de
            elevação.
          </p>
        </Container>
      </Secao>

      <Secao superficie="vinho">
        <Container comRail>
          <RailLateral>Superfície vinho</RailLateral>
          <SectionTitle eyebrow="Superfície" as="h2">
            Vinho
          </SectionTitle>
          <p className="medida text-lead text-sand-50 mt-6">
            Vinho é superfície, não detalhe: blocos inteiros alternando com
            areia. É a decisão mais forte do design, e é o que dá ao site um
            ritmo editorial em vez de uma sequência de cartões.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-6">
            <Botao href="/contato">Agendar consulta</Botao>
            <Botao href="/dra-livia-santanna" variante="filete">
              Conhecer a médica
            </Botao>
          </div>
        </Container>
      </Secao>

      <Footer />
    </>
  );
}
