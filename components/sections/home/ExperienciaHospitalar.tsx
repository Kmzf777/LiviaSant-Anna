import { Container } from "@/components/ui/Container";
import { Galeria } from "@/components/ui/Galeria";
import type { ItemGaleria } from "@/components/ui/Galeria";
import { Reveal } from "@/components/ui/Reveal";
import { Secao } from "@/components/ui/Secao";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { VideoSobClique } from "@/components/ui/VideoSobClique";
import type { Hospital } from "@/content/hospitais";
import type { ConteudoHome } from "@/content/tipos";
import { RITMO_RESPIRO, RITMO_SECAO } from "../ritmo";

/**
 * § 3 — Experiência hospitalar. Areia-100.
 *
 * Terceira pergunta de quem decide: onde ela opera. Esta é a única prova
 * social que um site médico pode fazer sem pisar na Resolução CFM 2.336/2023
 * — nome de hospital é fato verificável, não elogio. Nada aqui diz que ela é
 * melhor por causa disso; diz onde ela esteve, e quem lê tira a conclusão.
 *
 * Sem logotipos, por decisão registrada em `content/hospitais.ts`: marca de
 * hospital é propriedade do hospital, e usá-la sugere endosso institucional
 * que ninguém deu.
 *
 * ## Nenhuma legenda diz qual profissional é ela
 *
 * **Não é possível determinar isso com segurança em foto com máscara e
 * touca**, e legendar errado num site médico é erro grave — o tipo de erro que
 * nenhuma revisão pega depois, porque a legenda parece plausível. Todo `alt` e
 * toda legenda descrevem a CENA, que é verdadeira de qualquer forma.
 *
 * Pela mesma razão, nenhuma legenda afirma o que a foto não mostra. "Corredor
 * do centro cirúrgico, ANTES do procedimento" era invenção plausível: a foto
 * não diz se foi antes, entre dois ou no fim do dia. Descrever o que está no
 * quadro é o limite, e ele vale para o `alt` e para a legenda.
 *
 * A curadoria das imagens está no PLANO-HOME.md, arquivo a arquivo, com o
 * motivo de cada corte. O resumo da regra: foto de ambiente e de trabalho é
 * permitida e valiosa; foto do procedimento em si, com campo aberto ou
 * paciente posando, é o que os CRMs vêm punindo. Nenhum paciente aparece
 * identificável em nenhuma das imagens aprovadas.
 *
 * ## O vídeo entra sob clique
 *
 * Pôster estático, `preload="none"`, fora do caminho do LCP. Não é vídeo de
 * fundo: o briefing § 15 proíbe um segundo elemento disputando o papel de
 * assinatura com o Traço, e um vídeo em loop atrás de texto faria exatamente
 * isso. Ver `components/ui/VideoSobClique.tsx`.
 *
 * ## Duas linhas por hospital, e não quatro colunas
 *
 * A primeira versão era uma tabela de quatro colunas em largura inteira. Ficou
 * legível e ficou errada de duas maneiras, medidas em captura: a coluna do nome
 * absorvia toda a folga e abria 700px entre "Hospital Mater Dei" e "Belo
 * Horizonte", e o registro, ocupando a página toda, empurrava o vídeo para uma
 * linha só dele — que a 9/16 mede mais de uma tela de altura, com a coluna
 * esquerda vazia ao lado.
 *
 * Duas linhas por hospital cabem na coluna de texto, que é onde o registro
 * pertence: ele é a continuação da frase "estes são os lugares onde me formei e
 * onde opero hoje". O vídeo ganha a coluna da direita inteira e a seção deixa
 * de ter um vão de meia tela no meio. O mesmo desenho serve no celular sem
 * nenhuma variante — não há tabela para colapsar.
 */

type Props = {
  readonly experiencia: ConteudoHome["experiencia"];
  readonly hospitais: readonly Hospital[];
};

/**
 * As cinco fotos aprovadas de centro cirúrgico, todas 3024×4032.
 *
 * A ordem é a da composição, não a do arquivo: `Galeria` distribui os itens em
 * slots de larguras e desníveis diferentes, e o primeiro é o único que ocupa a
 * largura inteira no celular. A foto de abertura é a do corredor porque é a
 * que situa — pessoas, ambiente, escala — antes de qualquer plano fechado.
 *
 * O pôster do vídeo é um quadro extraído do próprio vídeo
 * (`centro-cirurgico-video-poster`), e não uma destas: uma foto que aparece
 * duas vezes na mesma seção lê como erro de montagem.
 */
export const FOTOS_CENTRO_CIRURGICO: readonly ItemGaleria[] = [
  {
    src: "/fotos/centro-cirurgico-equipe-corredor.jpeg",
    alt: "Três profissionais em uniforme cirúrgico, no corredor de um centro cirúrgico.",
    largura: 3024,
    altura: 4032,
    legenda: "Corredor do centro cirúrgico.",
  },
  {
    src: "/fotos/centro-cirurgico-close.jpeg",
    alt: "Profissional de touca, máscara e lupas de aumento, em plano fechado, durante uma cirurgia.",
    largura: 3024,
    altura: 4032,
    legenda: "Lupas de aumento, usadas na cirurgia que pede detalhe.",
  },
  {
    src: "/fotos/centro-cirurgico-bastidor.jpeg",
    alt: "Dois profissionais em uniforme cirúrgico e touca, na área de apoio de um centro cirúrgico.",
    largura: 3024,
    altura: 4032,
    legenda: "Área de apoio do centro cirúrgico.",
  },
  {
    src: "/fotos/centro-cirurgico-endoscopia.jpeg",
    alt: "Sala cirúrgica durante um procedimento endoscópico, com a torre de vídeo ao lado da mesa e o paciente coberto pelos campos cirúrgicos.",
    largura: 3024,
    altura: 4032,
    legenda: "Procedimento endoscópico, acompanhado pela torre de vídeo.",
  },
  {
    src: "/fotos/centro-cirurgico-microscopio.jpeg",
    alt: "Sala cirúrgica durante um procedimento com microscópio, com o paciente coberto pelos campos cirúrgicos.",
    largura: 3024,
    altura: 4032,
    legenda: "Procedimento conduzido sob microscópio cirúrgico.",
  },
];

/** Marcador das linhas de atuação corrente. Mono, como todo fato do site. */
const MARCA_ATUAL = "Atuação atual";

export function ExperienciaHospitalar({ experiencia, hospitais }: Props) {
  return (
    <Secao
      superficie="areia-100"
      espacamento="nenhum"
      className={RITMO_SECAO}
      aria-labelledby="experiencia-titulo"
    >
      <Container>
        <div className="grid gap-y-12 lg:grid-cols-12 lg:gap-x-[var(--gutter)]">
          <Reveal className="lg:col-span-5">
            <SectionTitle
              id="experiencia-titulo"
              eyebrow={experiencia.eyebrow}
              as="h2"
              tamanho="h2"
            >
              {experiencia.h2}
            </SectionTitle>

            <p className="medida text-lead text-ink-600 mt-8">
              {experiencia.texto}
            </p>

            <ul className="filete mt-12 flex list-none flex-col border-b">
              {hospitais.map((hospital) => (
                <li
                  key={hospital.nome}
                  className="filete flex flex-col gap-2 border-t py-5"
                >
                  <div className="flex items-baseline justify-between gap-6">
                    <p className="text-small text-ink-900 font-mono">
                      {hospital.nome}
                    </p>

                    {hospital.atual ? (
                      <p className="text-micro text-wine-700 shrink-0 font-mono tracking-[0.14em] uppercase">
                        {MARCA_ATUAL}
                      </p>
                    ) : null}
                  </div>

                  <p className="text-micro text-ink-400 font-mono tracking-[0.12em]">
                    {hospital.cidade} · {hospital.vinculo}
                  </p>
                </li>
              ))}
            </ul>
          </Reveal>

          {/* Quatro colunas, e não seis: o vídeo é 9/16, e cada coluna a mais
              vira quase duas de altura. Em seis ele media mais de uma tela e
              deixava a coluna de texto vazia ao lado. É também a largura que o
              `sizes` do componente declara (30vw). */}
          <Reveal index={1} className="lg:col-span-4 lg:col-start-9">
            <VideoSobClique
              src="/fotos/centro-cirurgico-video.mp4"
              poster="/fotos/centro-cirurgico-video-poster.jpeg"
              legenda="Trecho de uma cirurgia. O vídeo carrega quando você toca no play."
            />
          </Reveal>
        </div>

        <Reveal className={RITMO_RESPIRO}>
          <Galeria itens={FOTOS_CENTRO_CIRURGICO} />
        </Reveal>
      </Container>
    </Secao>
  );
}
