# PLANO — Correção de mobile

**Status:** aprovado, execução liberada
**Diagnóstico:** medido em 21 rotas × 4 larguras (320, 360, 390, 430), com toque
e emulação de iPhone 13. Scripts: `scripts/auditar-mobile.mjs`.

---

## O que NÃO está quebrado

Medido antes de qualquer hipótese, e vale registrar para ninguém "consertar" o
que funciona:

| Verificação | Resultado |
|---|---|
| Overflow horizontal | **zero**, em 21 rotas × 4 larguras |
| Zoom do iOS em campo de formulário | zero — todos os campos em 17px |
| Menu mobile | abre, `role=dialog`, `aria-modal`, foco preso, scroll de fundo travado, Esc fecha, navegação funciona |
| Formulário | valida, move o foco para o primeiro campo inválido, anuncia em live region |
| Erros de JavaScript | nenhum |
| Altura mobile ÷ desktop | 1,2–1,6× — proporção saudável para coluna estreita |
| Campos do formulário | 350×58px — alvo de toque correto |

O site **funciona** no celular. O que ele não faz é ser confortável nem honrar a
própria regra de assinatura.

---

## Defeito A — O Traço cruza o texto

**O mais grave, e não é só mobile.**

O briefing § 5.8 é explícito: *"Nunca cruza texto. Nunca compete com a leitura."*

Medição (blocos de texto cuja faixa horizontal colide com a faixa da fita):

| Largura | Colisão |
|---|---|
| 390px | **98–100%** |
| 768px | 60–80% |
| 1440px | 33–65% |

**Causa raiz.** A fita ocupa uma faixa horizontal fixa que começa a ~59% da
largura no mobile (230px de 390), ~64% no tablet e ~74% no desktop. As colunas
de texto vão até a borda do `Container`. Ninguém reservou um corredor: o
subagent F mitigou nas páginas de procedimento estreitando colunas do grid à
mão, o que resolveu parte do desktop e nada do mobile — no mobile não existe
coluna a estreitar, o texto ocupa a largura toda.

**A correção não é por página.** Estreitar coluna caso a caso é o que já foi
tentado, e é por isso que o desktop ainda colide em 33–65%. O corredor precisa
existir na estrutura.

**Decisão de arquitetura (tomada, não em aberto):**

1. `Container` reserva um corredor à direita — `--traco-corredor` — em todas as
   larguras. Nenhuma página precisa saber que o Traço existe.
2. A fita fica **confinada ao corredor** por padrão. Largura do corredor:
   `clamp(28px, 4vw, 96px)`.
3. **Exceção: onde a página reserva uma zona sem texto, a fita pode usar a
   largura toda.** É o caso do `RespiroTraco`, e é exatamente ali que a
   resolução no perfil de rosto acontece. O momento teatral continua existindo,
   porque acontece no único lugar da página sem texto para atrapalhar.
4. Abaixo de `md`, a resolução em perfil de rosto **não** acontece: ela precisa
   de ~0,26 × altura de excursão horizontal, e num corredor de 28–40px o rosto
   seria irreconhecível. Abaixo de `md` a fita é linha condutora e nada mais.
   Degradação honesta, não desligamento.

---

## Defeito B — Alvos de toque abaixo de 44px

Sistêmico, no design system, não nas páginas.

| Elemento | Tamanho medido | Ocorrências |
|---|---|---|
| Botão "Menu" do header | 72×**33** | 21 rotas |
| Logo do header | 164×**24** | 21 rotas |
| `link-filete` da nav do rodapé | ~100×**18** | 18 rotas |
| `link-filete` da trilha | 52×**15** | 14 rotas |
| `Botao` variante filete | 124×**23** | 9 rotas |
| Checkbox de consentimento | **20×20** | /contato |

**Causa raiz.** `link-filete` é uma utilidade de sublinhado sem altura mínima, e
a variante filete do `Botao` usa `py-1`. Ambos foram desenhados como *texto com
filete*, o que é correto visualmente — mas nenhum reserva área de toque.

**Correção:** área de toque mínima de 44px **sem alterar a caixa visual** —
`min-height` no elemento com o filete ancorado ao texto, ou pseudo-elemento
expandindo a área clicável. O desenho não muda; o alvo sim.

---

## Defeito C — Vazios verticais no mobile

Blocos de 370–538px sem nada — cerca de meia tela de vazio, que no celular lê
como "a página acabou".

Rinoplastia tem **22 telas** no mobile; as demais páginas de procedimento, 14–16.

**Causa raiz.** Espaçamento calibrado no desktop. `--secao-y` é
`clamp(5rem, 12vh, 11rem)` — a âncora em `vh` faz o padding *crescer* em telas
altas e estreitas, que é o oposto do desejado.

---

## Execução — quatro subagents paralelos

Todos usam a skill `frontend-design`. Fronteiras de arquivo disjuntas.

| # | Subagent | Escreve em |
|---|---|---|
| **M1** | **O corredor do Traço** — token, confinamento da fita, exceção do respiro, degradação abaixo de `md` | `components/layout/Traco.tsx`, `lib/traco.ts`, `components/sections/RespiroTraco.tsx`, `components/ui/Container.tsx`, `styles/theme.css` |
| **M2** | **Alvos de toque** — `link-filete`, `Botao` filete, checkbox, `FAQ`, sem mudar o desenho | `components/ui/**` (exceto Container), `app/globals.css`, `components/form/**` |
| **M3** | **Ritmo vertical e composição mobile** — vazios, hero, header, menu, rodapé | `components/sections/**` (exceto RespiroTraco), `components/medical/PaginaProcedimento.tsx`, `components/layout/{Header,Footer,MenuMobile,RailLateral}.tsx` |
| **M4** | **Rede de testes** — transformar a auditoria em teste permanente | `tests/**`, `scripts/auditar-mobile.mjs`, `playwright.config.ts` |

**Portão:** `pnpm check`, `pnpm build`, `pnpm verify:html`, e a auditoria de
mobile com zero achados de gravidade alta ou média — exceto os falsos positivos
já identificados (`sr-only`).

---

## Falsos positivos conhecidos

Registrados para não serem "corrigidos" por engano:

- `a.sr-only` "Pular para o conteúdo" aparece como alvo de 1×1 e como texto
  vazando. É o link de pular conteúdo, corretamente oculto até receber foco.
- `span.sr-only` "Passo 01:" idem — rótulo para leitor de tela.

O `auditar-mobile.mjs` precisa passar a ignorar `sr-only` (tarefa do M4).
