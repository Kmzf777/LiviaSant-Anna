import { IdentificacaoCFM } from "@/components/medical/IdentificacaoCFM";
import { Botao } from "@/components/ui/Botao";
import { Container } from "@/components/ui/Container";
import { Filete } from "@/components/ui/Filete";
import { Reveal } from "@/components/ui/Reveal";
import { RetratoArco } from "@/components/ui/RetratoArco";
import { Secao } from "@/components/ui/Secao";
import { SectionTitle } from "@/components/ui/SectionTitle";
import type { ConteudoHome, Medica } from "@/content/tipos";
import { RITMO_SECAO } from "../ritmo";

/**
 * § 2 — A médica e a formação. Areia.
 *
 * Segunda pergunta de quem chega: quem resolve isso. Retrato de jaleco branco
 * à esquerda, com o arco no topo — o motivo assinatura de toda foto dela
 * (§ 5.5). A blusa vinho da foto bate com `wine-700`, então o retrato pertence
 * à paleta em vez de conviver com ela.
 *
 * ## Nome, papel e o bloco do CFM, nessa ordem
 *
 * Os três formam um cluster só, separados por um filete:
 *
 *     Lívia Sant'Anna            display, persuasão
 *     Otorrinolaringologista     corpo, o papel em uma linha
 *     ——————————————————————
 *     Lívia Sant'Anna — Médica — CRM-MG 83.288      mono, fato
 *     Otorrinolaringologia — RQE 70735
 *
 * O nome aparece duas vezes de propósito, e o filete é o que explica por quê:
 * acima dele está como ela se apresenta, abaixo está o que se pode conferir no
 * CRM. É a tese tipográfica do site inteiro (§ 5.3) aplicada ao caso em que
 * ela mais importa — e é a razão de o bloco normativo estar aqui, junto do
 * nome, e não perdido no rodapé.
 *
 * A Resolução CFM 2.336/2023 art. 3º exige o bloco em local visível. O rodapé
 * cumpre em todas as rotas (injetado no layout raiz); este é o segundo bloco
 * da página, e `tests/e2e/cfm.spec.ts` audita todos os que encontra.
 *
 * ## A formação é uma tabela, não um parágrafo
 *
 * `<dl>` em mono, rótulo à esquerda em coluna fixa, um filete por linha.
 * Formação é o fato mais verificável que existe sobre um médico, e o site
 * inteiro combinou que fato aparece em mono. Escrever a mesma informação em
 * prosa a transformaria em argumento — que é exatamente o que ela não é.
 *
 * Só os três degraus de formação entram. `getMedica().formacao` também traz
 * "Equipes" e "Cirurgias", que são hospitais e vivem na § 3: repeti-los aqui
 * diria a mesma coisa duas vezes em duas seções seguidas, e a § 3 diz melhor,
 * com cidade e vínculo.
 */

type Props = {
  readonly bloco: ConteudoHome["medica"];
  readonly medica: Medica;
};

/**
 * Os degraus de formação que pertencem a esta seção. Escrito por extenso, e
 * não como `slice(0, 3)`, para que acrescentar um item em `content/medica.ts`
 * não mude silenciosamente o que a home mostra.
 */
const DEGRAUS_DE_FORMACAO = ["Graduação", "Residência", "Fellowship"];

export function AMedicaEFormacao({ bloco, medica }: Props) {
  const formacao = medica.formacao.filter((item) =>
    DEGRAUS_DE_FORMACAO.includes(item.rotulo),
  );

  return (
    <Secao
      superficie="areia"
      espacamento="nenhum"
      className={RITMO_SECAO}
      aria-labelledby="medica-titulo"
    >
      <Container>
        <div className="grid gap-y-12 lg:grid-cols-12 lg:gap-x-[var(--gutter)] lg:gap-y-16">
          <Reveal className="lg:col-span-4">
            <RetratoArco
              imagem={medica.retrato}
              aspecto="3/4"
              sizes="(min-width: 1024px) 30vw, 100vw"
            />
          </Reveal>

          {/* Colunas 6 a 11, e não 7 a 12: a faixa da direita é a pista do
              Traço. É aqui que a cauda da resolução — queixo e mandíbula
              voltando para a margem — atravessa a página. Ver RespiroTraco. */}
          <Reveal index={1} className="lg:col-span-6 lg:col-start-6">
            <SectionTitle
              id="medica-titulo"
              eyebrow={bloco.eyebrow}
              as="h2"
              tamanho="h2"
            >
              {bloco.h2}
            </SectionTitle>

            <p className="text-lead text-ink-600 mt-4">{bloco.papel}</p>

            <div className="mt-8 flex flex-col gap-6">
              <Filete />
              <IdentificacaoCFM sobre="areia" />
            </div>

            {bloco.apresentacao.map((paragrafo) => (
              <p key={paragrafo} className="medida text-body text-ink-600 mt-8">
                {paragrafo}
              </p>
            ))}

            <dl className="mt-10 flex flex-col lg:mt-14">
              {formacao.map((item) => (
                <div
                  key={item.rotulo}
                  className="filete flex flex-col border-t py-4 sm:flex-row sm:gap-8"
                >
                  <dt className="text-micro text-ink-400 font-mono tracking-[0.14em] uppercase sm:w-[8.5rem] sm:shrink-0 sm:pt-1">
                    {item.rotulo}
                  </dt>
                  <dd className="text-small text-ink-900 mt-2 font-mono sm:mt-0">
                    {item.descricao}
                  </dd>
                </div>
              ))}
            </dl>

            <div className="mt-10 lg:mt-12">
              <Botao href={bloco.cta.href} variante="filete">
                {bloco.cta.texto}
              </Botao>
            </div>
          </Reveal>
        </div>
      </Container>
    </Secao>
  );
}
