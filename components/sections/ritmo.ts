/**
 * Ritmo vertical — o espaçamento de seção que responde à LARGURA.
 *
 * ## O defeito, medido
 *
 * `--secao-y` é `clamp(5rem, 12vh, 11rem)`. A hipótese registrada no
 * PLANO-MOBILE (Defeito C) era que a âncora em `vh` faria o padding *crescer*
 * no celular. Não é isso que acontece — e o que acontece é pior, porque passa
 * despercebido:
 *
 *   390 × 844   (iPhone 13)     12vh = 101px
 *   430 × 932   (iPhone 15 Pro) 12vh = 112px
 *   1440 × 900  (notebook)      12vh = 108px
 *
 * Um telefone e um notebook têm praticamente a MESMA altura de viewport. O
 * token é fluido no papel e constante na prática: ~101–112px em qualquer
 * aparelho. O celular herda o ritmo do desktop palavra por palavra, com uma
 * coluna 3,7× mais estreita — e 202px de nada entre duas seções empilhadas
 * (24% de uma tela de 844) leem como "a página acabou".
 *
 * O padding de seção não é função da altura da tela. É função da LARGURA da
 * coluna de texto, porque é ela que define quanto vazio o olho aceita antes de
 * concluir que o documento terminou.
 *
 * ## A rampa
 *
 *   clamp(3.5rem, 2.25rem + 5vw, var(--secao-y))
 *
 *    320   56px      680   70px     1280  100px
 *    390   56px      768   74px     1440  108px  ← igual ao valor de hoje
 *    430   58px     1024   87px
 *
 * O teto continua sendo `var(--secao-y)`: o desktop não muda um pixel, e se o
 * M1 mexer no token o desktop acompanha sozinho. O que muda é o celular, onde
 * 56px é o dobro do maior respiro interno (28px de parágrafo) — um limite de
 * seção inequívoco, não um buraco.
 *
 * ## Por que constantes, e não uma prop de `Secao`
 *
 * `Secao` mora em `components/ui/`, que pertence a outro subagent nesta
 * rodada, e `--secao-y` mora em `styles/theme.css`, idem. A correção certa é
 * de uma linha em um desses dois lugares; enquanto ela não acontece, esta
 * folha faz o mesmo trabalho sem cruzar fronteira.
 *
 * As seções aplicam isto com `espacamento="nenhum"` — e NÃO por cima do
 * `espacamento="normal"`. Duas classes `py-[…]` na mesma string não se
 * sobrepõem por ordem no atributo: quem decide é a ordem das regras que o
 * Tailwind emite, e ela não é nossa. É a armadilha documentada em
 * `components/ui/cn.ts`, e ela já custou um bug neste projeto.
 *
 * Cada valor é uma string literal completa, e precisa continuar sendo: o
 * scanner do Tailwind lê o TEXTO do arquivo, então classe montada por
 * template literal simplesmente não é gerada.
 */

/** Padding vertical de seção. Substitui `espacamento="normal"`. */
export const RITMO_SECAO = "py-[clamp(3.5rem,2.25rem_+_5vw,var(--secao-y))]";

/** Faixas de altura baixa — identificação, ficha, relacionados. */
export const RITMO_SECAO_COMPACTA =
  "py-[calc(clamp(3.5rem,2.25rem_+_5vw,var(--secao-y))/2.5)]";

/** Hero curto de página interna: entra mais perto do topo, sai mais folgado. */
export const RITMO_HERO =
  "pt-[calc(clamp(3.5rem,2.25rem_+_5vw,var(--secao-y))*0.6)] pb-[calc(clamp(3.5rem,2.25rem_+_5vw,var(--secao-y))*0.8)]";

/** Respiro entre dois blocos DENTRO da mesma seção. Menor que o limite dela. */
export const RITMO_RESPIRO =
  "mt-[calc(clamp(3.5rem,2.25rem_+_5vw,var(--secao-y))*0.7)]";

/**
 * Topo do RailLateral. Tem de bater com o padding-top da seção, senão o
 * eyebrow vertical descola do texto que ele rotula.
 */
export const RITMO_RAIL = "top-[clamp(3.5rem,2.25rem_+_5vw,var(--secao-y))]";
