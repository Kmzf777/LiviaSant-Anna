import { Botao } from "@/components/ui/Botao";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { RetratoArco } from "@/components/ui/RetratoArco";
import { Secao } from "@/components/ui/Secao";
import type { ConteudoHome } from "@/content/tipos";

/**
 * § 8.1 — Hero. Superfície vinho, ~90vh.
 *
 * ## O contrato com o Header
 *
 * `-mt-[var(--header-h)]` puxa a seção para debaixo do header sticky, e o
 * `padding-top` compensa o puxão. É o que autoriza o header a ficar
 * transparente com tipografia blush: sem o puxão ele flutuaria sobre o fundo
 * do body (areia) em vez do vinho, e o Header — que mede o overlap em runtime
 * — cairia sozinho para tinta. Ver components/layout/Header.tsx.
 *
 * ## Por que o padding não é `--secao-y`
 *
 * Onze rem em cima e embaixo, somados ao H1 em `text-hero`, jogavam os CTAs
 * para fora da primeira tela em 1440×900 — e um hero cujo botão principal não
 * é visto não é um hero. O `clamp(2.5rem, 7vh, 6rem)` mantém a mesma
 * respiração proporcional sem esse custo. Ele aparece três vezes, literal, e
 * as três precisam continuar iguais: padding-top, padding-bottom e a margem
 * negativa do retrato. Escrito à mão porque o scanner do Tailwind lê o texto
 * do arquivo — classe montada por template literal não é gerada.
 *
 * ## Por que o H1 ocupa as doze colunas
 *
 * "Forma e função," em `text-hero` pede cerca de 960px de medida. Numa coluna
 * de sete, ele quebrava em "Forma e / função," — e a quebra de linha desse H1
 * é decisão de conteúdo, não sobra de layout: cada uma das duas linhas carrega
 * uma metade da tese. Com a largura inteira as duas linhas ficam inteiras, e o
 * retrato ganha a companhia do lead em vez de disputar espaço com a display.
 *
 * ## O retrato sangrando na base
 *
 * A seção é `items-end` e o retrato carrega margem inferior negativa do
 * tamanho exato do padding: a base dele encosta na borda da seção, sem faixa
 * de vinho embaixo, e a foto parece seguir por baixo da faixa de
 * identificação. É o que o § 8.1 pede, e é a razão do `overflow-hidden`.
 *
 * Sem `Reveal`: o H1 é o candidato a LCP e não pode nascer em `opacity: 0`.
 */

type Props = {
  readonly hero: ConteudoHome["hero"];
};

export function HeroHome({ hero }: Props) {
  return (
    <Secao
      superficie="vinho"
      espacamento="nenhum"
      aria-labelledby="hero-titulo"
      className="-mt-[var(--header-h)] flex min-h-[90vh] items-end overflow-hidden pt-[calc(var(--header-h)+clamp(2.5rem,7vh,6rem))] pb-[clamp(2.5rem,7vh,6rem)]"
    >
      <Container>
        <div className="grid w-full items-end gap-y-10 lg:grid-cols-12 lg:gap-x-[var(--gutter)] lg:gap-y-14">
          <div className="lg:col-span-12">
            <Eyebrow>{hero.eyebrow}</Eyebrow>

            <h1
              id="hero-titulo"
              className="font-display text-hero text-blush-200 mt-7 font-normal"
            >
              {hero.h1.map((linha) => (
                <span key={linha} className="block">
                  {linha}
                </span>
              ))}
            </h1>
          </div>

          {/* `self-start`: a linha é tão alta quanto o retrato, e o lead
              alinhado ao fim dela empurraria os CTAs para fora da dobra. */}
          <div className="lg:col-span-6 lg:self-start">
            <p className="medida text-lead text-sand-50">{hero.lead}</p>

            <div className="mt-8 flex flex-wrap items-center gap-x-10 gap-y-6 lg:mt-10">
              <Botao href={hero.ctaPrimario.href}>
                {hero.ctaPrimario.texto}
              </Botao>
              <Botao href={hero.ctaSecundario.href} variante="filete">
                {hero.ctaSecundario.texto}
              </Botao>
            </div>
          </div>

          <div className="-mb-[clamp(2.5rem,7vh,6rem)] self-end lg:col-span-4 lg:col-start-9">
            <RetratoArco
              imagem={hero.imagem}
              aspecto="3/4"
              prioridade
              sizes="(min-width: 1024px) 30vw, 100vw"
            />
          </div>
        </div>
      </Container>
    </Secao>
  );
}
