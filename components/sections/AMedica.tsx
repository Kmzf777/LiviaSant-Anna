import { Botao } from "@/components/ui/Botao";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { RetratoArco } from "@/components/ui/RetratoArco";
import { Secao } from "@/components/ui/Secao";
import { SectionTitle } from "@/components/ui/SectionTitle";
import type { ConteudoHome, Medica } from "@/content/tipos";
import { RITMO_SECAO } from "./ritmo";

/**
 * § 8.6 — A médica. Areia.
 *
 * Retrato à esquerda com o arco no topo — o motivo assinatura de toda foto
 * dela (§ 5.5) —, texto e formação à direita. A foto pedida é a de jaleco
 * branco com blusa vinho: a blusa casa com `wine-700` e é o único lugar da
 * página em que a cor da marca aparece dentro de uma imagem em vez de atrás
 * dela.
 *
 * ## A formação é uma tabela, não um parágrafo
 *
 * `<dl>` em mono, rótulo à esquerda em coluna fixa, com um filete por linha.
 * Formação é o fato mais verificável que existe sobre um médico, e o site
 * inteiro combinou que fato aparece em mono (§ 5.3). Escrever a mesma
 * informação em prosa a transformaria em argumento — que é exatamente o que
 * ela não é.
 *
 * A biografia vem de `/content` e hoje tem um parágrafo só. O segundo,
 * pessoal, está em PENDENCIAS.md aguardando a médica: inventá-lo seria
 * inventar conteúdo médico sobre a autora do site.
 */

type Props = {
  readonly bloco: ConteudoHome["medica"];
  readonly medica: Medica;
};

export function AMedica({ bloco, medica }: Props) {
  return (
    <Secao
      superficie="areia"
      espacamento="nenhum"
      className={RITMO_SECAO}
      aria-labelledby="medica-titulo"
    >
      <Container>
        <div className="grid gap-y-10 lg:grid-cols-12 lg:gap-x-[var(--gutter)] lg:gap-y-16">
          <Reveal className="lg:col-span-4">
            <RetratoArco
              imagem={medica.retrato}
              aspecto="3/4"
              sizes="(min-width: 1024px) 30vw, 100vw"
            />
          </Reveal>

          {/* Colunas 6 a 11, e não 7 a 12: a faixa de duas colunas da direita
              é a pista do Traço. É aqui que a cauda da resolução — queixo e
              mandíbula voltando para a margem — atravessa a página, e é a
              única seção de texto corrido que ela alcança. Ver RespiroTraco. */}
          <Reveal index={1} className="lg:col-span-6 lg:col-start-6">
            <SectionTitle
              id="medica-titulo"
              eyebrow={bloco.eyebrow}
              as="h2"
              tamanho="h2"
            >
              {bloco.h2}
            </SectionTitle>

            {medica.biografia.map((paragrafo) => (
              <p key={paragrafo} className="medida text-body text-ink-600 mt-8">
                {paragrafo}
              </p>
            ))}

            <dl className="mt-10 flex flex-col lg:mt-14">
              {medica.formacao.map((item) => (
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
