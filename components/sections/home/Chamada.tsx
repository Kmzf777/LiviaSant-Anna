import { Botao } from "@/components/ui/Botao";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { RetratoArco } from "@/components/ui/RetratoArco";
import { Secao } from "@/components/ui/Secao";
import type { ConteudoHome } from "@/content/tipos";

/**
 * § 1 — A chamada. Superfície vinho.
 *
 * A home deixou de abrir com a tese ("Forma e função, nas mesmas mãos") e
 * passou a abrir com o problema. O motivo está no briefing § 2, que define
 * como métrica de sucesso que *"um paciente que chega pela busca de 'amígdala'
 * e um que chega por 'rinoplastia' precisam, em 5 segundos, saber que estão no
 * lugar certo"*. A tese não dizia isso; nariz, ouvido e garganta dizem.
 *
 * ## O contrato com o Header
 *
 * `-mt-[var(--header-h)]` puxa a seção para debaixo do header sticky, e o
 * `padding-top` compensa o puxão. É o que autoriza o header a ficar
 * transparente com tipografia blush: sem o puxão ele flutuaria sobre o fundo
 * do body (areia) em vez do vinho, e o Header — que mede o overlap em runtime
 * — cairia sozinho para tinta, sem erro em lugar nenhum. Ver
 * `components/layout/Header.tsx` e o teste em `tests/unit/home.spec.tsx`.
 *
 * ## Por que o H1 não usa `text-hero`
 *
 * O H1 anterior era um slogan de 16 caracteres e cabia em `--text-hero` (até
 * 7rem). Este é uma frase de três linhas, e a mais longa tem 27 caracteres:
 * em 112px ela pede ~1330px de medida contra os ~1240px que o `Container`
 * oferece em 1440, e transborda. Em 390, onde sobram 323px de coluna, nem
 * `--text-h1` cabe.
 *
 * Daí a rampa própria: `clamp(1.6rem, 0.5rem + 4.7vw, 4.5rem)` — 26px em 390,
 * 72px a partir de ~1360. É a única medida do arquivo que não sai de um token,
 * e existe porque a quebra de linha do H1 é decisão de conteúdo
 * (`content/home.ts`), não sobra de layout: cada uma das três linhas carrega
 * uma ideia inteira, e a terceira é a única que fala do desfecho. O teto de
 * 4.5rem é o mesmo de `--text-h1`, e o piso respeita o mínimo de 1.5rem da
 * Bodoni (§ 5.3). `leading` e `tracking` vêm à mão porque um `text-[…]`
 * arbitrário não herda os pares `--text-h1--*` do tema.
 *
 * ## O retrato sangrando na base
 *
 * A seção é `items-end` e o retrato carrega margem inferior negativa do
 * tamanho exato do padding: a base dele encosta na borda da seção, sem faixa
 * de vinho embaixo, e a foto parece seguir por baixo da seção seguinte. É a
 * razão do `overflow-hidden`. O `clamp(2.5rem, 7vh, 6rem)` aparece três vezes,
 * literal, e as três precisam continuar iguais — escrito à mão porque o
 * scanner do Tailwind lê o texto do arquivo, e classe montada por template
 * literal não é gerada.
 *
 * Sem `Reveal`: o H1 e o retrato são os candidatos a LCP e não podem nascer em
 * `opacity: 0`. `prioridade` no retrato existe por isso, e só aqui.
 */

type Props = {
  readonly hero: ConteudoHome["hero"];
};

export function Chamada({ hero }: Props) {
  return (
    <Secao
      superficie="vinho"
      espacamento="nenhum"
      aria-labelledby="chamada-titulo"
      className="-mt-[var(--header-h)] flex min-h-[92vh] items-end overflow-hidden pt-[calc(var(--header-h)+clamp(2.5rem,7vh,6rem))] pb-[clamp(2.5rem,7vh,6rem)]"
    >
      <Container>
        <div className="grid w-full items-end gap-y-10 lg:grid-cols-12 lg:gap-x-[var(--gutter)] lg:gap-y-14">
          <div className="lg:col-span-12">
            <Eyebrow>{hero.eyebrow}</Eyebrow>

            <h1
              id="chamada-titulo"
              className="font-display text-blush-200 mt-7 font-normal text-[clamp(1.6rem,0.5rem_+_4.7vw,4.5rem)] leading-[1.02] tracking-[-0.025em]"
            >
              {hero.h1.map((linha) => (
                <span key={linha} className="block">
                  {linha}
                </span>
              ))}
            </h1>
          </div>

          {/* `self-start`: a linha é tão alta quanto o retrato, e o lead
              alinhado ao fim dela empurraria o CTA para fora da dobra. */}
          <div className="lg:col-span-6 lg:self-start">
            <p className="medida text-lead text-sand-50">{hero.lead}</p>

            <div className="mt-8 lg:mt-10">
              <Botao href={hero.cta.href}>{hero.cta.texto}</Botao>
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
