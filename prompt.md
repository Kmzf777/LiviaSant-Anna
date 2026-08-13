# PROMPT MESTRE — Site Dra. Lívia Sant'Anna

> Cole este arquivo inteiro no Claude Code (ou salve na raiz do projeto e diga: "leia PROMPT-CLAUDE-CODE.md e execute").

---

## 0. COMO EXECUTAR

Você vai construir um site institucional completo, de nível "site premiado", para uma médica otorrinolaringologista que também realiza cirurgia plástica da face.

**Use a skill `superpowers`.** Siga o fluxo dela: brainstorm → plano escrito → execução com subagents → verificação. Se a skill não estiver instalada, siga mesmo assim as fases da Seção 13 deste documento.

**Regras de processo (obrigatórias):**

1. **Não comece a codar antes de escrever o plano.** Produza `PLANO.md` na raiz com: árvore de arquivos, ordem de execução, e o que cada subagent vai fazer. Pare e me mostre.
2. **Delegue para subagents em paralelo** sempre que as tarefas forem independentes (ver Seção 13). Um subagent = um domínio, com contexto próprio.
3. **Rode um subagent revisor** ao final de cada fase, com a Seção 14 (Definition of Done) como checklist. Ele reprova e devolve; não passe de fase com pendência.
4. **Tire screenshots** (Playwright) em 390px, 768px e 1440px ao final de cada página e critique visualmente o próprio trabalho antes de declarar pronto.
5. **Nunca invente conteúdo médico.** Onde faltar informação, use os placeholders da Seção 12 e registre em `PENDENCIAS.md`.
6. Commits pequenos e descritivos. Português nos textos do site, inglês no código.

---

## 1. BRIEFING

### A médica

**Dra. Lívia Sant'Anna** — Belo Horizonte, MG.

- Médica formada pela **Universidade Federal de Viçosa**
- Residência em **Otorrinolaringologia** no **Hospital Madre Teresa** (BH) — MEC/ABORL
- **Fellowship em Cirurgia Plástica da Face** — Hospital UMC, Uberlândia
- **CRM-MG 83.288**
- **RQE 70735** — Otorrinolaringologia
- Passagens: equipes de otorrino do **Hospital Vila da Serra** (BH) e do **Instituto de Otorrinolaringologia** (BH); procedimentos realizados no **Mater Dei**

### O que ela faz

**Otorrinolaringologia (função)**
- Desvio de septo e cirurgia para melhorar a respiração nasal
- Cirurgia de amígdalas e/ou adenoides
- Tratamento cirúrgico da sinusite
- Colocação de tubo de ventilação no ouvido
- Drenagem de abscessos
- Timpanoplastia (correção do tímpano)

**Cirurgia da face (forma)**
- Rinoplastia — estética e/ou funcional
- Otoplastia — correção e remodelação das orelhas
- Blefaroplastia superior e inferior
- Cantopexia
- Frontoplastia

**Estética facial não cirúrgica**
- Toxina botulínica — terço superior e *full face*

### O problema estratégico (leia com atenção)

Este site precisa sustentar **duas audiências que quase não se cruzam**: a mãe procurando quem opera a amígdala do filho, e a mulher de 34 anos pesquisando rinoplastia. Um site de estética puro afasta a primeira; um site clínico genérico não converte a segunda.

**A tese que resolve isso — e que é o conceito criativo do site inteiro:**

> Ela é otorrinolaringologista **antes** de operar a face. Trata o nariz como órgão que respira, não como forma isolada. Forma e função nas mesmas mãos.

Isso não é slogan de marketing: é o diferencial real dela e o argumento mais forte que existe em rinoplastia. Todo o site deve orbitar essa ideia.

---

## 2. OBJETIVOS

**Primário:** conversão em consulta (WhatsApp e formulário).
**Secundário:** posicionamento premium sóbrio + captura de busca orgânica ("rinoplastia BH", "otorrino BH", "desvio de septo cirurgia Belo Horizonte", "blefaroplastia BH").

**Métrica de sucesso do design:** um paciente que chega pela busca de "amígdala" e um que chega por "rinoplastia" precisam, em 5 segundos, saber que estão no lugar certo — sem que o site pareça duas coisas coladas.

---

## 3. RESTRIÇÕES LEGAIS — CFM (NÃO NEGOCIÁVEL)

O site é peça de publicidade médica sob a **Resolução CFM nº 2.336/2023** (em vigor desde 11/03/2024). Violação gera processo ético no CRM. Trate estas regras como requisitos de sistema, não como sugestões.

### 3.1 Bloco de identificação obrigatório

Deve aparecer em **local visível** em **todas** as páginas. Componente dedicado: `<IdentificacaoCFM />`.

```
Lívia Sant'Anna — Médica — CRM-MG 83.288
Otorrinolaringologia — RQE 70735
```

**Regra de estilo crítica:** a norma exige que **fonte, tamanho e cor sejam os mesmos em todo o bloco, sem alteração de tamanho e sem negrito.** Implemente isso literalmente — um único `<p>` com `font-weight: 400` uniforme, mesma `font-size`, mesma `color`. Não destaque "Dra.", não aumente o nome, não coloque o CRM em cinza claro. Escreva um teste que falhe se o bloco tiver mais de um peso, tamanho ou cor.

### 3.2 Proibido no site

- Termos superlativos e autopromocionais: "a melhor", "referência", "top", "premiada", "a mais procurada", "excelência incomparável".
- **Qualquer promessa ou garantia de resultado.** Nada de "resultados garantidos", "o nariz dos seus sonhos", "transformação garantida".
- Sensacionalismo, tom de propaganda agressiva, contagem regressiva, escassez artificial ("últimas vagas").
- Reivindicar exclusividade de técnica. **Não crie um nome comercial registrado para procedimento** (nada de "Rinoplastia Sant'Anna™"). Isso é o oposto do que o `garthfisher.com` faz com o "Pinnacle Facelift™" e não pode ser copiado.
- Divulgar-se como "cirurgiã plástica". O RQE dela é em **Otorrinolaringologia**. Ela **realiza** cirurgia plástica da face dentro do escopo da especialidade — escreva sempre assim: *"otorrinolaringologista, com atuação em cirurgia plástica da face"*. Nunca o título.
- Preços de procedimentos cirúrgicos. (Preço de consulta é permitido; deixe como opcional desligado por padrão.)

### 3.3 Antes e depois

Permitido, com condições cumulativas. Se qualquer uma faltar, **não publique**:
- Autorização formal e documentada do paciente
- Paciente **não identificável** (crop abaixo dos olhos ou acima do queixo conforme o caso; sem tatuagens, joias, marcas)
- Imagem **sem manipulação** (mesma iluminação, mesmo ângulo, mesma distância focal, sem filtro, sem retoque)
- **Contexto educativo obrigatório junto à imagem**: indicação, possíveis evoluções satisfatórias e insatisfatórias, riscos e complicações
- Aviso explícito de que resultados variam entre pacientes

**Implementação:** o componente `<AntesDepois />` deve ser *impossível* de renderizar sem o texto educativo. Torne `textoEducativo` e `autorizacaoId` props **obrigatórias em TypeScript**. Sem elas, erro de compilação. Se ainda não houver imagens autorizadas, renderize o estado vazio descrito na Seção 8.8.

### 3.4 Depoimentos

Repostar elogios é permitido, mas evite depoimento que descreva resultado como garantido. Prefira depoimentos sobre **atendimento e acolhimento**, não sobre resultado estético.

> Coloque tudo isso em `docs/COMPLIANCE-CFM.md` no repositório, com link para `https://publicidademedica.cfm.org.br/`. **Adicione no topo:** "Este documento é orientação de implementação, não parecer jurídico. Antes de publicar, submeta o site à revisão de advogado especializado em direito médico ou ao setor de fiscalização do CRM-MG."

---

## 4. STACK

```
Next.js 15 (App Router) + TypeScript strict
Tailwind CSS v4 (tokens via @theme no CSS)
Motion (framer-motion) — apenas onde a Seção 6.9 permitir
next/image + next/font
Conteúdo: arquivos .ts tipados em /content (sem CMS na v1)
Formulário: Server Action + Resend + honeypot + rate limit
Testes: Vitest (unit) + Playwright (e2e, a11y, visual)
Lint: ESLint + Prettier + eslint-plugin-jsx-a11y
Deploy: Vercel
```

**Por que conteúdo em `.ts` e não CMS:** ela precisa que funcione, não que seja editável por ela hoje. Estruture `/content` com tipos rígidos para que migrar para Sanity depois seja trocar a camada de fetch. Documente isso em `docs/ARQUITETURA.md`.

**Sem jQuery, sem bibliotecas de UI prontas (shadcn incluso), sem template.** Todos os componentes são escritos do zero a partir do design system abaixo.

---

## 5. DESIGN SYSTEM

### 5.1 Direção

**Nome interno da direção: "Bordô Editorial".**

Referência de estrutura e copy: `garthfisher.com` — narrativa editorial, seções full-bleed alternadas, citações grandes, filosofia antes de procedimento.
**O que NÃO copiar dele:** o preto absoluto, o culto à celebridade, os superlativos, o procedimento registrado. Nada disso é dela nem é legal aqui.

A identidade dela já está definida pelo logo: **selo circular, vinho profundo, traço filete contínuo desenhando um perfil de rosto com monograma L.** O site é a extensão desse traço.

### 5.2 Cor

Extraídas por amostragem direta do logo e das fotos enviadas — não são cores arbitrárias.

```css
@theme {
  /* Vinho — cor da marca, #6D1F3A amostrado do fundo do logo */
  --color-wine-900: #3F0F22;
  --color-wine-800: #55172D;
  --color-wine-700: #6D1F3A;  /* PRIMÁRIA */
  --color-wine-600: #863350;
  --color-wine-300: #C08D9E;

  /* Blush — #FBD8C9 amostrado do traço do logo */
  --color-blush-200: #FBD8C9;  /* traço, texto sobre vinho */
  --color-blush-100: #FDEBE3;

  /* Areia — amostrada do fundo das fotos dela */
  --color-sand-50:  #F6F1EC;   /* fundo padrão do site */
  --color-sand-100: #EDE4DA;
  --color-sand-200: #D9CCBF;
  --color-sand-300: #C5B7AE;   /* fundo real das fotos — casa perfeito */

  /* Tinta — quase-preto quente. NUNCA use #000 */
  --color-ink-900: #241A1E;    /* texto principal */
  --color-ink-600: #5A4A50;    /* texto secundário */
  --color-ink-400: #8A7A80;    /* legendas */
}
```

**Uso:**
- Fundo padrão: `sand-50`. Texto: `ink-900`.
- Seções de imersão full-bleed: `wine-700` com texto `blush-200` / `sand-50`.
- Vinho é **superfície**, não detalhe. Blocos inteiros em vinho, alternando com areia. É a decisão mais forte do design — o `garthfisher.com` faz isso com preto; aqui é o bordô dela.
- Um único acento vivo é desnecessário. Não introduza dourado, verde, azul ou terracota. Se algo precisa de destaque, use contraste de superfície, não uma cor nova.
- **Proibido:** `#000000`, `#FFFFFF` puro, gradientes coloridos, glassmorphism, sombras coloridas.

**Verifique contraste programaticamente** (script no build). Mínimo WCAG AA 4.5:1 em texto corrido, 3:1 em texto grande. Não confie nos valores acima sem medir.

### 5.3 Tipografia

Três papéis, três famílias. Cada uma tem função — nenhuma é decorativa.

| Papel | Fonte | Fonte de | Uso |
|---|---|---|---|
| **Display** | **Bodoni Moda** (variable, optical size) | Google Fonts | H1, H2, citações. O contraste hairline↔grosso ecoa o traço filete do logo. |
| **Corpo** | **Switzer** (variable) | Fontshare | Todo texto lido. Neutra, ótima acentuação PT-BR. |
| **Dados** | **IBM Plex Mono** | Google Fonts | Eyebrows, ficha técnica, bloco CFM, legendas, endereço. |

**Por que a mono:** ela é a *espinha clínica* do site. Tudo que é fato verificável — CRM, RQE, duração de cirurgia, endereço, disclaimers — aparece em mono. Tudo que é persuasão aparece em serifa ou sans. O leitor aprende a diferença sem que ninguém explique. Isso resolve visualmente a tensão entre "estética" e "médico".

```css
--font-display: 'Bodoni Moda', Georgia, serif;
--font-body: 'Switzer', -apple-system, sans-serif;
--font-mono: 'IBM Plex Mono', ui-monospace, monospace;
```

**Escala fluida:**

```css
--text-hero:  clamp(2.75rem, 1.2rem + 6.5vw, 7rem);    /* display, 400, tracking -0.03em, lh 0.95 */
--text-h1:    clamp(2.25rem, 1.2rem + 4.5vw, 4.5rem);  /* display, 400, tracking -0.025em, lh 1.02 */
--text-h2:    clamp(1.75rem, 1.1rem + 2.8vw, 3.25rem); /* display, 400, tracking -0.02em, lh 1.08 */
--text-h3:    clamp(1.25rem, 1rem + 1.1vw, 1.75rem);   /* body, 500, tracking -0.01em */
--text-lead:  clamp(1.125rem, 1rem + 0.6vw, 1.5rem);   /* body, 400, lh 1.5 */
--text-body:  1.0625rem;                                /* body, 400, lh 1.65 */
--text-small: 0.875rem;
--text-micro: 0.75rem;                                  /* mono, tracking 0.12em, uppercase */
```

**Regras:**
- Bodoni Moda **nunca abaixo de 1.5rem** (o hairline some) e **nunca em bold** — use `optical-size` alto em tamanhos grandes.
- Eyebrows em mono, uppercase, `letter-spacing: 0.14em`, `ink-400`.
- Medida de linha: 62–70 caracteres em texto corrido. Force com `max-width: 34em`.
- **Sentence case** em botões e labels. Nunca Title Case.

### 5.4 Grid e espaço

```css
--container: 1440px;
--gutter: clamp(1.25rem, 4vw, 5rem);
/* Grid de 12 colunas. Layouts assimétricos por padrão. */
```

Escala de espaço base 4: `4 8 12 16 24 32 48 64 96 128 160 200 256`.
Padding vertical de seção: `clamp(5rem, 12vh, 11rem)`.

**Assimetria é regra.** Nada de tudo centralizado. Rail esquerdo fino (≈80px no desktop) que carrega os eyebrows em mono na vertical (`writing-mode: vertical-rl`) — desaparece abaixo de 1024px.

### 5.5 Geometria

O logo é um **selo circular** com traço curvo. Então a linguagem geométrica é o **arco** — e só ele:

- **Retratos:** máscara de arco no topo (`border-radius: 50vw 50vw 0 0`). Motivo assinatura para toda foto dela.
- **Botões e cards:** retangulares, `border-radius: 2px`. Sem pílula.
- **Selo circular:** aparece uma vez, no footer, como o logo em si.

Não misture. Arco = retrato. Reto = interface.

### 5.6 Elevação

Sem `box-shadow` colorida. Profundidade vem de **superfície** (troca de fundo) e de **filete** (`1px solid` em `sand-200` sobre areia, `wine-600` sobre vinho). Uma única sombra permitida, para o header sticky:
`0 1px 0 var(--color-sand-200)`.

### 5.7 Movimento

```css
--ease-out: cubic-bezier(0.16, 1, 0.3, 1);
--ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
--dur-fast: 200ms;
--dur-base: 400ms;
--dur-slow: 700ms;
--dur-draw: 2400ms;  /* exclusivo do Traço */
```

**Orçamento de animação — respeite:**
1. O Traço (assinatura, Seção 5.8)
2. Reveal de entrada por seção: fade + translateY 16px, stagger 60ms
3. Hover: underline crescendo da esquerda, e escala 1.02 em imagem com `overflow: hidden`

**Só isso.** Nada de parallax, contador animado, texto letra-por-letra, cursor customizado, scroll suave sequestrado, elementos flutuantes. Excesso de animação é o que faz um site parecer gerado por IA.

`@media (prefers-reduced-motion: reduce)` desliga tudo, incluindo o Traço (renderiza estático, completo).

### 5.8 ⭐ ASSINATURA: "O Traço"

**Este é o elemento que o site vai ser lembrado. Execute com capricho.**

O logo dela é um traço filete contínuo que desenha um perfil de rosto. Extraia esse gesto e transforme-o na **linha condutora do site inteiro**: um único `<path>` SVG de 1px que percorre a página verticalmente, atravessando as seções, desenhando-se conforme o scroll.

**Especificação:**
- Um SVG fixo, `position: sticky`, largura total, `pointer-events: none`, `z-index` acima do fundo e abaixo do conteúdo
- `stroke-width: 1`, `vector-effect: non-scaling-stroke`
- Cor adaptativa: `blush-200` sobre vinho, `wine-700` sobre areia (troque via `mix-blend-mode` ou por segmentos)
- Animação por `stroke-dasharray` / `stroke-dashoffset` controlada por **scroll-driven animation nativa do CSS** (`animation-timeline: scroll()`) com fallback em IntersectionObserver
- **O momento:** entre a seção de manifesto e a seção de rinoplastia, o traço **resolve-se no perfil de rosto do logo** — a mesma curva, em escala grande — e depois volta a ser linha e segue. Dura ~1.5 viewport. É o único momento teatral do site.
- Nunca cruza texto. Nunca compete com a leitura.

Se a curva do logo não estiver disponível em vetor, construa uma aproximação em Bézier e deixe `TRACO_PATH` isolado em `lib/traco.ts` para eu trocar quando enviar o SVG oficial.

---

## 6. COMPONENTES

Construa em `components/`, cada um com sua própria história no Storybook **ou** uma rota `/_dev/componentes` (não indexada) mostrando todos os estados.

| Componente | Notas |
|---|---|
| `Header` | Sticky, transparente sobre o hero, ganha fundo `sand-50` + filete ao rolar. Logo à esquerda, nav ao centro, botão "Agendar consulta" à direita. Mobile: menu full-screen em `wine-700`. |
| `Traco` | Seção 5.8 |
| `Hero` | Seção 8.1 |
| `IdentificacaoCFM` | Seção 3.1. Teste que garante uniformidade tipográfica. |
| `Eyebrow` | mono, uppercase, tracking largo |
| `SectionTitle` | display + eyebrow opcional |
| `RetratoArco` | `next/image` com máscara de arco, `sizes` correto, blur placeholder |
| `CardFrente` | Card grande de "Otorrinolaringologia" / "Cirurgia da face" |
| `CardProcedimento` | Imagem opcional + título + linha de resumo + link |
| `FichaTecnica` | Tabela mono: duração, anestesia, internação, retorno social. Disclaimer obrigatório embutido. |
| `Citacao` | Display grande, aspas tipográficas corretas (`" "`), atribuição em mono |
| `Passos` | Numerado 01–04. **Numerado porque é sequência real** (a jornada da consulta), não decoração. |
| `AntesDepois` | Seção 3.3. Props obrigatórias. Slider de comparação com arrasto + teclado. |
| `FAQ` | `<details>`/`<summary>` nativos, estilizados. Gera JSON-LD FAQPage. |
| `FormularioContato` | Server Action, validação Zod, honeypot, estados de erro/sucesso explícitos |
| `BotaoWhatsApp` | Flutuante mobile, inline no desktop. Mensagem pré-preenchida por contexto de página. |
| `Footer` | Nav, selo circular, `IdentificacaoCFM`, disclaimers, mapa |

**Copy de interface (siga):** botão diz exatamente o que acontece — "Agendar consulta", "Enviar mensagem", "Ver procedimentos". Nunca "Saiba mais", "Clique aqui", "Enviar". Estado de erro explica o que houve e como resolver, sem pedir desculpas. Estado vazio convida à ação.

---

## 7. ARQUITETURA DE INFORMAÇÃO

```
/                                    Home
/dra-livia-santanna                  A médica
/otorrinolaringologia                Hub função
  /desvio-de-septo
  /amigdalas-e-adenoides
  /sinusite
  /tubo-de-ventilacao
  /timpanoplastia
/cirurgia-da-face                    Hub forma
  /rinoplastia                       ⭐ página carro-chefe
  /otoplastia
  /blefaroplastia
  /cantopexia
  /frontoplastia
/estetica-facial
  /toxina-botulinica
/consulta                            Como funciona + preparo
/consultorio                         Onde atendo, mapa, horários
/contato                             Formulário + WhatsApp
/politica-de-privacidade
/aviso-legal
```

**Rinoplastia é a página mais importante do site depois da home.** Ela recebe tratamento de landing page completa: hero próprio, seção função vs. estética, ficha técnica, jornada, FAQ extensa, antes/depois (quando houver). É onde a tese "forma e função" vira argumento comercial.

Cada página de procedimento segue o mesmo template (Seção 8.9) para consistência e velocidade de produção.

---

## 8. CONTEÚDO E COPY — HOME

Use os textos abaixo. São ponto de partida real, não lorem. Onde marcado `[CONFIRMAR]`, use e registre em `PENDENCIAS.md`.

### 8.1 Hero — fundo `wine-700`, altura ~90vh

- **Eyebrow (mono):** `OTORRINOLARINGOLOGIA · CIRURGIA DA FACE · BELO HORIZONTE`
- **H1 (display, blush-200):**
  > Forma e função,
  > nas mesmas mãos.
- **Lead (body, sand-50, max 34em):**
  > Otorrinolaringologista com atuação em cirurgia plástica da face. Opero o nariz que respira e o nariz que se vê — e trato os dois como o mesmo problema.
- **CTAs:** `Agendar consulta` (sólido `blush-200`, texto `wine-900`) · `Conhecer a médica` (texto com filete inferior)
- **Imagem:** retrato de blazer preto (`foto-blazer-preto`), à direita, arco no topo, sangrando na base
- O Traço começa aqui

### 8.2 Faixa de identificação — `sand-50`, altura baixa

`<IdentificacaoCFM />` + três credenciais em mono, separadas por filetes verticais:
`RESIDÊNCIA · HOSPITAL MADRE TERESA` | `FELLOWSHIP EM CIRURGIA PLÁSTICA DA FACE · UMC` | `FORMAÇÃO · UFV`

### 8.3 Manifesto — `sand-50`, muito respiro

- **Eyebrow:** `A PREMISSA`
- **Texto em display, tamanho `h2`**, quebrado em linhas curtas:
  > O nariz é o centro do rosto
  > e a porta da respiração.
  > Mudar um sem entender o outro
  > é resolver metade.
- **Parágrafo de apoio (body):**
  > Minha formação começou pela função: septo, seios da face, via aérea. A cirurgia plástica da face veio depois, e sobre essa base. Por isso, numa rinoplastia, a avaliação da respiração não é um adicional — é parte do planejamento desde a primeira consulta.

### 8.4 As duas frentes — `sand-100`

Dois cards grandes, lado a lado (empilhados no mobile). O corte visual entre eles é o momento em que o site assume sua dualidade abertamente.

**Card A — Otorrinolaringologia**
> Respirar, ouvir, dormir melhor. Diagnóstico e tratamento clínico e cirúrgico de nariz, ouvido e garganta — em adultos e crianças.
Lista: desvio de septo · amígdalas e adenoides · sinusite · tubo de ventilação · timpanoplastia
CTA: `Ver procedimentos de otorrino`

**Card B — Cirurgia e estética da face**
> Cirurgia da face conduzida por quem opera a função. Planejamento individual, resultado proporcional ao seu rosto.
Lista: rinoplastia · otoplastia · blefaroplastia · cantopexia · frontoplastia · toxina botulínica
CTA: `Ver cirurgias da face`

### 8.5 Rinoplastia em destaque — full-bleed `wine-700`

Aqui o Traço resolve no perfil de rosto.

- **Eyebrow:** `EM DESTAQUE`
- **H2 (display, blush-200):** Rinoplastia estética e funcional
- **Corpo (sand-50):**
  > Muita gente chega dizendo que não gosta do próprio nariz e descobre, na consulta, que também não respira bem por ele. Às vezes é o contrário: veio pelo septo e quer entender o que muda no rosto. Os dois caminhos cabem na mesma cirurgia, e é isso que avaliamos juntas antes de qualquer decisão.
- **Nota (mono, `wine-300`):** `RESULTADOS VARIAM CONFORME ANATOMIA, CICATRIZAÇÃO E HISTÓRICO DE CADA PACIENTE.`
- CTA: `Entender a rinoplastia`

### 8.6 A médica — `sand-50`

Retrato de jaleco branco com blusa vinho (`foto-jaleco-vinho`) — casa com a paleta —, arco no topo, coluna esquerda. Direita: texto + formação em mono, formato de lista datada.

- **Eyebrow:** `A MÉDICA`
- **H2:** Lívia Sant'Anna
- **Corpo:**
  > Formei-me pela Universidade Federal de Viçosa e fiz residência em Otorrinolaringologia no Hospital Madre Teresa, em Belo Horizonte. Depois, o fellowship em cirurgia plástica da face no Hospital UMC, em Uberlândia. Atendo e opero como otorrinolaringologista geral, e realizo as cirurgias plásticas da face dentro do escopo da especialidade.
  > `[CONFIRMAR: parágrafo pessoal — por que escolheu a especialidade, como conduz a consulta. Ver Seção 12.]`
- **Formação (mono):**
  ```
  GRADUAÇÃO       Universidade Federal de Viçosa
  RESIDÊNCIA      Otorrinolaringologia · Hospital Madre Teresa · BH
  FELLOWSHIP      Cirurgia Plástica da Face · Hospital UMC · Uberlândia
  EQUIPES         Hospital Vila da Serra · Instituto de Otorrinolaringologia · BH
  CIRURGIAS       Hospital Mater Dei
  ```

### 8.7 Como é a consulta — `sand-100`, componente `Passos`

Numerado 01–04 porque é sequência real.

1. **Conversa** — Você conta o que te incomoda. Eu escuto antes de examinar.
2. **Exame** — Avaliação completa de via aérea e da anatomia da face. Nasofibroscopia quando indicada.
3. **Planejamento** — Explico o que é possível, o que não é, os riscos e o tempo de recuperação. Sem pressa e sem pressão para decidir na hora.
4. **Decisão** — Se fizer sentido para você, agendamos. Se não fizer, também está certo.

Fecho (mono): `TODA CIRURGIA ENVOLVE RISCOS. ELES SÃO EXPLICADOS INDIVIDUALMENTE NA CONSULTA E NO TERMO DE CONSENTIMENTO.`

### 8.8 Resultados / Antes e depois

**Se ainda não houver imagens autorizadas (assuma que não há na v1):** não crie galeria falsa. Renderize esta seção:

- **Eyebrow:** `RESULTADOS`
- **H2:** Sobre imagens de antes e depois
- **Corpo:**
  > Imagens de resultado só são publicadas com autorização formal da paciente, sem qualquer edição, e acompanhadas da explicação clínica que a legislação exige. Enquanto essa curadoria não está pronta, prefiro mostrar os casos pessoalmente na consulta, onde consigo explicar a anatomia de cada um e por que o resultado seria diferente no seu rosto.

Isso converte a ausência em sinal de seriedade. Deixe o componente `<AntesDepois />` pronto e testado para quando as imagens chegarem.

### 8.9 FAQ, consultório, contato, footer

- **FAQ:** 6–8 perguntas transversais. Gere `FAQPage` JSON-LD.
- **Consultório:** endereço `[CONFIRMAR]`, mapa (embed leve, carregado sob interação — não bloqueie o LCP), horários, estacionamento, acessibilidade do prédio.
- **Contato:** formulário (nome, WhatsApp, e-mail, assunto por procedimento, mensagem, consentimento LGPD explícito não pré-marcado) + botão de WhatsApp.
- **Footer:** selo circular do logo, nav completa, `IdentificacaoCFM`, aviso legal, LGPD, ano.

### 8.10 Template de página de procedimento

```
Hero curto (eyebrow + H1 + lead + CTA)
O que é              — linguagem clara, sem jargão não explicado
Quando é indicado    — critérios objetivos
Como é feito         — técnica em termos compreensíveis
FichaTecnica         — mono: duração, anestesia, internação, retorno social
Recuperação          — dia a dia realista, semana a semana
Riscos e limites     — OBRIGATÓRIO. Escrito com honestidade, não escondido.
AntesDepois          — se houver
FAQ específica       — 5–8 perguntas, JSON-LD
CTA final
```

A seção "Riscos e limites" não é rodapé jurídico: é a peça de maior conversão do site. Um médico que escreve honestamente sobre risco ganha mais confiança do que um que promete resultado. Trate-a com o mesmo cuidado tipográfico do resto.

---

## 9. ACESSIBILIDADE E PERFORMANCE

**Piso obrigatório:**
- HTML semântico, um `<h1>` por página, hierarquia sem saltos
- Foco visível e customizado (filete `wine-700` de 2px, `outline-offset: 3px`) — nunca `outline: none`
- Navegação completa por teclado, incluindo o slider de antes/depois e o menu mobile
- `prefers-reduced-motion` respeitado em tudo
- Contraste AA mínimo, medido em script no CI
- `alt` descritivo em todas as imagens; imagens decorativas com `alt=""`
- Formulário: `<label>` real, `aria-describedby` para erros, erro anunciado em live region
- Teste automatizado com `axe-core` no Playwright, zero violações críticas

**Metas Lighthouse (mobile, 4G lento):** Performance ≥ 90 · Acessibilidade 100 · SEO 100.
LCP < 2.0s · CLS < 0.05 · INP < 200ms.

Fontes com `next/font` e `display: swap`. Imagens AVIF/WebP com `sizes` correto. Vídeo (se houver) `preload="none"`, poster estático, sem autoplay com som, `muted playsinline loop`.

---

## 10. SEO

- `metadata` por rota; títulos ≤ 60 caracteres, descrições ≤ 155
- JSON-LD: `Physician` + `MedicalBusiness` na home e no consultório; `MedicalProcedure` nas páginas de procedimento; `FAQPage` onde houver FAQ; `BreadcrumbList` em todas
- `sitemap.ts` e `robots.ts` gerados
- OG images geradas dinamicamente (`ImageResponse`) no padrão da marca: vinho, Bodoni, selo
- URLs em português, sem acento, com hífen (já definidas na Seção 7)
- Sem página `/blog` na v1 — mas deixe a rota preparada em `docs/ROADMAP.md`

---

## 11. ESTRUTURA DE PASTAS

```
app/
  layout.tsx                 fontes, metadata base, Traco, Header, Footer
  page.tsx                   home
  (institucional)/           médica, consulta, consultório, contato
  otorrinolaringologia/      hub + [slug]
  cirurgia-da-face/          hub + [slug]
  estetica-facial/           hub + [slug]
  _dev/componentes/          galeria de componentes (noindex)
components/
  layout/  ui/  sections/  medical/
content/
  medica.ts  procedimentos.ts  faq.ts  consultorio.ts  tipos.ts
lib/
  traco.ts  schema.ts  contraste.ts  whatsapp.ts
docs/
  ARQUITETURA.md  COMPLIANCE-CFM.md  DESIGN-SYSTEM.md  ROADMAP.md
styles/
  theme.css                  tokens @theme
tests/
  e2e/  a11y/  unit/
PLANO.md
PENDENCIAS.md
```

---

## 12. ASSETS

### 12.1 O que já existe (em `/assets-originais`)

| Arquivo | Uso |
|---|---|
| `logo-selo-vinho.png` | Logo, selo circular. **É PNG — preciso do SVG.** |
| `foto-blazer-preto.jpg` | Hero. Fundo greige, blazer preto, postura confiante. |
| `foto-jaleco-vinho.jpg` | Seção "A médica". A blusa vinho casa com `wine-700`. |
| `foto-jaleco-scrubs.jpg` | Páginas cirúrgicas / consultório. O scrub azul é a única cor fora da paleta — **desature levemente o azul** no tratamento ou reserve esta foto para contextos onde ela aparece pequena. |

Trate as três fotos com a mesma curva: leve aquecimento, contraste suave, sem filtro pesado. Elas já foram fotografadas em fundo areia — não recorte esse fundo, ele é parte da paleta.

### 12.2 Placeholders

Onde faltar imagem, gere um bloco `sand-200` com o selo circular em `wine-700` a 8% de opacidade e o texto em mono `IMAGEM PENDENTE — [descrição]`. Nunca use foto de banco de imagens genérica, nem provisoriamente: se vazar para produção, destrói a credibilidade construída pelas fotos reais.

### 12.3 Sobre imagens geradas por IA — leia antes de gerar qualquer coisa

**Não gere, em hipótese alguma:** pessoas, rostos, pacientes, "médica genérica", equipe, e **jamais** antes-e-depois sintético. Além de eticamente indefensável num site médico, antes/depois gerado ou editado viola diretamente a Resolução CFM 2.336/23 e é motivo de processo ético. Público de estética identifica rosto de IA com facilidade, e o custo em confiança é irreversível.

**Pode gerar, e recomendo:** texturas de fundo abstratas (gesso, linho, papel algodão em areia/vinho), grão sutil para overlay, e uma **ilustração vetorial abstrata do fluxo de ar pelo septo nasal** — linha filete no mesmo peso do logo — para a página de rinoplastia. Essa ilustração é a peça onde a tese "forma e função" fica visível em vez de escrita.

Deixe todos esses arquivos isolados em `/public/texturas` e `/public/ilustracoes`, documentados, para troca fácil.

---

## 13. FASES E SUBAGENTS

### Fase 0 — Plano
Escreva `PLANO.md`. **Pare e apresente.** Não avance sem meu OK.

### Fase 1 — Fundação (sequencial)
Scaffold Next.js, TypeScript strict, Tailwind v4, `theme.css` com todos os tokens, fontes, tipos de conteúdo em `content/tipos.ts`, layout base, script de contraste.

### Fase 2 — Paralela (4 subagents)

| Subagent | Escopo |
|---|---|
| **A — Design System** | Todos os primitivos de `components/ui/`, rota `_dev/componentes`, `docs/DESIGN-SYSTEM.md` |
| **B — Traço** | O SVG assinatura, scroll-driven animation, fallback, reduced-motion. Isolado porque é o mais arriscado. |
| **C — Conteúdo** | Popula `/content` com todo o texto da Seção 8, tipado. Sem tocar em componente. |
| **D — Compliance** | `IdentificacaoCFM`, `AntesDepois` com props obrigatórias, `FichaTecnica`, `docs/COMPLIANCE-CFM.md`, testes que reprovam violação |

### Fase 3 — Páginas (paralela, após 2)
Subagent E: home. Subagent F: rinoplastia + hub cirurgia da face. Subagent G: hub otorrino + demais procedimentos. Subagent H: institucionais + formulário + Server Action.

### Fase 4 — Qualidade (sequencial)
Subagent revisor: Lighthouse, axe, Playwright em 3 breakpoints, contraste, checklist da Seção 14. Screenshots de todas as páginas. **Critique visualmente e liste o que está fraco antes de me entregar.**

### Fase 5 — Entrega
`README.md` com setup e como editar conteúdo. `PENDENCIAS.md` consolidado. Deploy preview na Vercel.

---

## 14. DEFINITION OF DONE

- [ ] `PLANO.md` aprovado antes de qualquer código
- [ ] Bloco `IdentificacaoCFM` em todas as páginas, tipograficamente uniforme, com teste que garante isso
- [ ] Zero superlativo, zero promessa de resultado, zero uso de "cirurgiã plástica" como título — verificado por script de busca de termos proibidos no conteúdo
- [ ] `AntesDepois` não compila sem texto educativo e id de autorização
- [ ] Seção "Riscos e limites" presente em toda página de procedimento
- [ ] O Traço funciona, é bonito, não atrapalha leitura, e desliga em reduced-motion
- [ ] Nenhum `#000` ou `#fff` puro no CSS
- [ ] Bodoni nunca abaixo de 1.5rem, nunca em bold
- [ ] Contraste AA verificado por script, não por olho
- [ ] axe-core: zero violações críticas
- [ ] Lighthouse mobile: Perf ≥ 90, A11y 100, SEO 100
- [ ] Teclado navega tudo, foco sempre visível
- [ ] Nenhuma imagem de banco genérica, nem placeholder vazado
- [ ] JSON-LD válido no Rich Results Test
- [ ] Screenshots em 390 / 768 / 1440 revisados e criticados
- [ ] `PENDENCIAS.md` completo

---

## 15. ANTI-PADRÕES — se aparecer no resultado, refaça

- Hero com foto de banco de imagens de estetoscópio, jaleco genérico ou "mulher sorrindo tocando o rosto"
- Ícones de linha coloridos em grade de 3 colunas com título e um parágrafo cada
- Gradiente roxo/azul, glassmorphism, neon, sombra colorida
- Contador animado de "pacientes atendidos" / "anos de experiência" / "procedimentos realizados"
- Carrossel de depoimentos com estrelinhas
- "Saiba mais" como texto de botão
- Emoji em qualquer lugar da interface
- Cream #F4F1EA com serifa alto-contraste e acento terracota #D97757 — é o visual padrão de site gerado por IA em 2026. A paleta aqui vem do logo e das fotos dela: bordô e areia, sem terracota.
- Tudo centralizado
- Mais de um elemento disputando o papel de assinatura. O Traço é o único. Se algo mais gritar, remova.