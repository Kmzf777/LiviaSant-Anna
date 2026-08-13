# Design system — Bordô Editorial

Como o site é construído, e por quê. `prompt.md` § 5 define a direção; este
documento registra as decisões de implementação e as poucas divergências, com
motivo escrito.

Onde este documento e `prompt.md` divergirem sem justificativa aqui,
`prompt.md` vence.

---

## 1. A ideia

A identidade dela é um **selo circular, vinho profundo, com um traço filete
contínuo desenhando um perfil de rosto e o monograma L**. Tudo no site sai
daí:

| No logo               | No site                                                                                           |
| --------------------- | ------------------------------------------------------------------------------------------------- |
| Traço filete contínuo | O Traço (assinatura), os filetes de 1px, o underline que cresce da esquerda, o hairline da Bodoni |
| Selo circular         | O arco: máscara superior de todo retrato                                                          |
| Vinho profundo        | Superfície, não detalhe: blocos inteiros alternando com areia                                     |

E uma tensão a resolver: o site atende a mãe que procura quem opera a amígdala
do filho e a mulher de 34 anos pesquisando rinoplastia. A tipografia é o que
mantém os dois no mesmo lugar — **mono é fato, display e corpo são
persuasão**. Quem lê aprende a diferença sem que ninguém explique.

---

## 2. Tokens

Todos em `styles/theme.css`. Componente nenhum inventa valor.

### Cor

Amostrada do logo e das fotos. Não são valores arbitrários e não devem ser
"ajustados no olho".

```
wine-900 #3F0F22   wine-800 #55172D   wine-700 #6D1F3A (primária)
wine-600 #863350   wine-300 #CF98AB
blush-200 #FBD8C9  blush-100 #FDEBE3
sand-50 #F6F1EC    sand-100 #EDE4DA   sand-200 #D9CCBF   sand-300 #C5B7AE
ink-900 #241A1E    ink-600 #5A4A50    ink-400 #6E6266
```

Dois tokens divergem do briefing, e a razão é medição, não gosto:
`ink-400` e `wine-300` reprovavam AA nos usos reais (eyebrows e a nota do
§ 8.5, ambos em mono 0.75rem). Foram corrigidos mantendo o matiz. Ver
`PENDENCIAS.md`, decisões 1 e 2.

**Proibido, e verificado por `pnpm verify:cores`:** `#000`, `#fff`,
`bg-white`, `text-black`, gradiente, `backdrop-filter`, sombra colorida,
`rounded-full`, `outline: none`.

Não existe acento vivo. Destaque vem de **troca de superfície**. Se algo
precisa gritar, ele muda de bloco — não de cor.

### Tipografia

| Papel   | Fonte                          | Onde                                                     |
| ------- | ------------------------------ | -------------------------------------------------------- |
| Display | Bodoni Moda (variable, `opsz`) | H1, H2, citações                                         |
| Corpo   | Switzer (variable)             | Todo texto lido                                          |
| Dados   | IBM Plex Mono                  | Eyebrows, ficha técnica, bloco CFM, endereço, disclaimer |

Duas regras inegociáveis, verificadas por `pnpm verify:bodoni`:

1. **Bodoni nunca abaixo de 1.5rem.** O hairline some e vira borrão.
2. **Bodoni nunca em bold.** O contraste dela vem do desenho, não do peso.

Por isso `SectionTitle` só oferece os degraus `hero`, `h1` e `h2`, e aplica
`font-normal` explicitamente — em `as="h3"` o reset de `globals.css` mandaria
a família do corpo e peso 500.

### Geometria

```
--radius-filete  2px            botões, cards, inputs
--radius-arco    50vw 50vw 0 0  retratos
```

**Arco é retrato. Reto é interface.** Não se mistura, e não existe pílula em
lugar nenhum. O selo circular aparece uma única vez, no rodapé.

### Espaço

```
--container  1440px
--gutter     clamp(1.25rem, 4vw, 5rem)
--rail       80px
--secao-y    clamp(5rem, 12vh, 11rem)
```

Assimetria é regra (§ 5.4). O `RailLateral` é o eixo visível dessa assimetria:
some abaixo de 1024px, e é o que impede a página de virar uma pilha de blocos
centralizados.

---

## 3. `data-superficie` — o contrato central

O atributo mais importante do sistema. Três consumidores, uma fonte:

1. **CSS** (`app/globals.css`) pinta fundo e texto, e troca a cor do foco para
   blush sobre vinho, para o anel não desaparecer.
2. **O Traço** mede os retângulos das seções para decidir a cor de cada
   segmento do path (spec § 4.4). Uma seção vinho sem o atributo faz a
   assinatura do site desenhar vinho sobre vinho e sumir naquele trecho.
3. **Os componentes** se adaptam por variante de ancestral no Tailwind:
   `[[data-superficie=vinho]_&]:text-wine-300`.

Consequência prática: **nenhuma seção pinta o próprio fundo por classe
solta.** Use sempre `<Secao superficie="…">`.

E consequência de API: nenhum primitivo tem prop de cor. Um `Botao` que
aceitasse cor por prop permitiria blush sobre areia, que reprova AA. A
superfície é decidida pela seção; o botão obedece.

### Contraste

Só entram no site pares já medidos em `scripts/verificar-contraste.ts` — 21
pares, todos aprovados em AA. Um par novo se adiciona **lá primeiro**, e só
depois no componente. Contraste é simétrico, então um par listado vale nos
dois sentidos (texto claro sobre fundo escuro e o inverso).

---

## 4. Movimento

Orçamento fechado. Três itens, e nada além:

1. **O Traço** (subagent B).
2. **Reveal de seção** — fade + `translateY(16px)`, stagger de 60ms.
3. **Hover** — underline crescendo da esquerda (`.link-filete`); escala 1.02
   em imagem dentro de `overflow: hidden` (`.zoom-suave`).

Sem parallax, contador animado, texto letra-por-letra, cursor customizado,
scroll sequestrado, chevron girando na FAQ. Excesso de animação é o que faz um
site parecer gerado por IA, e é o item que o § 15 manda refazer.

`@media (prefers-reduced-motion: reduce)` desliga os três, em CSS, sem passar
por JavaScript.

**O `Reveal` não usa framer-motion.** Motion está no projeto, mas fica
reservado a gesto e interrupção (o slider do `AntesDepois`); um fade que roda
uma vez não paga o peso no bundle inicial.

> **Limitação conhecida.** O `Reveal` renderiza com `opacity: 0` no HTML do
> servidor e revela na hidratação. Sem JavaScript e sem
> `prefers-reduced-motion`, o conteúdo fica invisível — o HTML está lá, e
> rastreadores que executam JS o veem, mas é um custo real. Alternativas
> (revelar só depois de montar) trocam isso por um flash na hidratação, que é
> pior. Se o teste de a11y da Fase 4 apontar, a saída é um bloco `<style>`
> dentro de `<noscript>` no layout raiz.

---

## 5. Os componentes

Todos escritos do zero. Sem shadcn, sem biblioteca de UI, sem template.

### `components/ui`

| Componente          | Contrato                                                                                                                    |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `Secao`             | Emite `data-superficie` e aplica `--secao-y`. `espacamento`: `normal`, `compacto`, `nenhum`. Nasce `relative`, para o rail. |
| `Container`         | `max-width: var(--container)`, `padding-inline: var(--gutter)`. `comRail` reserva a coluna do rail a partir de `lg`.        |
| `Eyebrow`           | Mono, caixa alta, `tracking: 0.14em`. `ink-400` sobre areia, `wine-300` sobre vinho.                                        |
| `SectionTitle`      | Eyebrow opcional + heading. `as` (semântica) e `tamanho` (composição) são independentes.                                    |
| `Botao`             | `solido` e `filete`. `<Link>` com `href`, `<button>` sem. Raio de 2px.                                                      |
| `Filete`            | Divisor de 1px, `role="separator"`, horizontal ou vertical. Cor vem da superfície.                                          |
| `Nota`              | Disclaimer em mono. `tom="atencao"` é também o estado de erro.                                                              |
| `Citacao`           | `blockquote` em display, aspas curvas `aria-hidden`, atribuição em mono.                                                    |
| `Passos`            | `<ol>` numerado 01–04, números em mono, `fecho` opcional como `Nota`.                                                       |
| `FAQ`               | `<details>`/`<summary>` nativos. Indicador mais/menos em filete, sem transição.                                             |
| `RetratoArco`       | `next/image` com máscara de arco, `sizes` obrigatório, blur em `sand-300`. Cai no placeholder quando a foto é `pendente`.   |
| `PlaceholderImagem` | Bloco `sand-200`, selo a 8%, texto `IMAGEM PENDENTE — …`. `aspecto` casa com a foto que virá.                               |
| `Selo`              | Aproximação vetorial do logo. Marca d'água e marcador do rodapé. **Não é a assinatura do site.**                            |
| `Reveal`            | Client. IntersectionObserver escreve `data-visivel`. `index` alimenta o stagger.                                            |

### `components/layout`

| Componente    | Contrato                                                                            |
| ------------- | ----------------------------------------------------------------------------------- |
| `Header`      | Sticky. Transparente sobre o hero, `sand-50` + filete ao rolar.                     |
| `MenuMobile`  | Tela cheia em `wine-700`. Foco preso, Esc fecha, foco volta ao botão.               |
| `RailLateral` | Rail de 80px com eyebrow em `writing-mode: vertical-rl`. Some abaixo de 1024px.     |
| `Footer`      | Nav completa, selo, slot do `IdentificacaoCFM`, avisos, ano. Superfície `wine-900`. |

#### Como o `Header` sabe de que cor ser

O hero da home é vinho; o de uma página de procedimento é areia. Ele lê o
`data-superficie` da primeira seção dentro de `#conteudo` e se adapta. Nada de
prop por rota — a Fase 3 esqueceria em pelo menos uma página.

```
topo + hero vinho    transparente, tipografia blush
topo + hero areia    transparente, tipografia tinta
rolado               fundo sand-50 e o filete de 1px do § 5.6
```

A "sombra" do estado rolado é `--sombra-header` (`0 1px 0` em `sand-200`): a
única `box-shadow` autorizada no site, e ela também é um filete.

#### O bloco do CFM no rodapé

Entra por injeção (`<Footer identificacao={<IdentificacaoCFM />} />`), não por
import. O bloco precisa estar em **todas** as páginas (§ 3.1), então quem monta
o layout é que garante isso. Sem ele, o rodapé mostra um aviso de pendência em
vez de ficar em silêncio — um bloco obrigatório que falta precisa doer.

---

## 6. Copy de interface

- **O botão diz o que acontece.** "Agendar consulta", "Ver procedimentos de
  otorrino", "Enviar mensagem". Nunca "Saiba mais", nunca "Clique aqui" —
  verificado por `pnpm verify:termos`.
- **Sentence case** em botões e rótulos. Nunca Title Case.
- **Erro explica o que houve e como resolver**, sem pedir desculpas.
- **Estado vazio convida à ação** ou explica a ausência. A seção de antes e
  depois da home é o exemplo: a ausência de galeria, escrita com honestidade,
  vale mais que uma galeria fraca — e é a única opção legal.
- **Sem emoji.** Em lugar nenhum.

---

## 7. Acessibilidade

- Foco sempre visível: `outline: 2px solid var(--color-wine-700)`,
  `outline-offset: 3px`. Sobre vinho vira blush. `outline: none` é proibido e
  verificado.
- Teclado navega tudo. O menu mobile é um diálogo modal de verdade: foco
  preso, Esc fecha, foco volta ao botão que abriu, rolagem do corpo travada.
- A FAQ usa `<details>`/`<summary>` nativos — teclado, `Ctrl+F` do navegador e
  funcionamento sem JavaScript vêm de graça, e a resposta continua no HTML
  mesmo fechada.
- `RailLateral` vai `aria-hidden` por padrão: ele repete o eyebrow da seção, e
  ouvir o mesmo rótulo duas vezes por seção é ruído.
- Hierarquia de heading sem salto, um `<h1>` por página. `SectionTitle` separa
  `as` de `tamanho` exatamente para isso.

---

## 8. A galeria

`/_dev/componentes` — todos os primitivos, em todos os estados, nas três
superfícies. `robots.ts` já bloqueia `/_dev/`, e a rota declara
`robots: { index: false, follow: false }`.

Hover e foco não existem em markup estático. Em vez de uma prop de
demonstração que poluiria a API, as amostras marcadas recebem por `className`
exatamente as classes que aquelas pseudoclasses aplicam.

> **A pasta no disco é `app/%5Fdev/componentes/`, não `app/_dev/`.** No App
> Router, pasta iniciada por underscore é _private folder_: o Next a exclui do
> roteamento e a galeria daria 404. `%5F` é o underscore percent-encoded, que
> o Next decodifica ao montar o segmento. O caminho fica feio; a URL fica
> sendo `/_dev/componentes`, que é o que o briefing pediu e o que o
> `robots.ts` bloqueia.

---

## 9. Armadilhas encontradas

Registradas porque vão morder de novo.

**`.link-filete` vence classes de mesma especificidade.** Ela mora no fim da
camada de utilitários (vem de `globals.css`, que é processado depois das
utilidades geradas), então `bg-[length:100%_1px]` _não_ abre o underline. Para
deixar o filete permanentemente aberto — o link da página atual no Header —
use `style={{ backgroundSize: "100% 1px" }}`. É a razão de `Botao` aceitar
`style`.

**`rounded-full` é proibido, inclusive no selo.** O `verificar-cores.ts`
menciona uma allowlist para a classe `.selo` que não existe na lista. Onde for
preciso um círculo, use `rounded-[50%]` ou um `<svg>` — o `Selo` é SVG e não
esbarra nisso.

**Setas e símbolos Unicode reprovam no `verificar-termos.ts`.** O padrão de
emoji cobre `U+2190–U+21FF` (setas) e `U+2600–U+27BF`. Não use `→` nem `✓` em
`.ts`/`.tsx` sob `app`, `components`, `content` ou `lib`.

**`data-superficie="vinho"` pinta o fundo.** Para usar o atributo só pelo
efeito colateral (o Traço, a cor do foco) sem o `wine-700`, acrescente um
utilitário de fundo: o Footer faz isso com `bg-wine-900`, o Header com
`bg-transparent`.

---

## 10. Verificação

```
pnpm verify:cores       #000, #fff, gradiente, sombra colorida, outline none, pílula
pnpm verify:bodoni      display abaixo de 1.5rem ou em bold
pnpm verify:contraste   os 21 pares em uso, em AA
pnpm verify:termos      superlativo, promessa de resultado, copy vaga, emoji
pnpm test               contratos dos componentes e da navegação
```

Documento não impede violação; build quebrado impede.
