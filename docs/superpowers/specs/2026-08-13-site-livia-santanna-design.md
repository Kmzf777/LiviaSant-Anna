# Spec — Site Dra. Lívia Sant'Anna

**Data:** 2026-08-13
**Status:** aprovado
**Briefing de origem:** `prompt.md` na raiz do repositório

---

## 0. O que este documento é

`prompt.md` define **o que** construir: briefing, restrições legais, design system, copy, arquitetura de informação. Este spec define **como** — as decisões de engenharia que o briefing deixou em aberto e que precisam estar fechadas antes de qualquer subagent tocar em código.

Onde os dois divergirem, `prompt.md` vence.

---

## 1. Tese e restrição central

O site atende duas audiências que quase não se cruzam (mãe buscando cirurgia de amígdala; mulher de 34 anos pesquisando rinoplastia). A tese que as une:

> Ela é otorrinolaringologista antes de operar a face. Forma e função nas mesmas mãos.

A consequência arquitetural: **os dois hubs são estruturalmente simétricos** — mesmo template, mesma tipografia, mesmo peso visual. A diferenciação entre "clínico" e "estético" acontece por *conteúdo e superfície*, nunca por hierarquia de componente. Um hub mais bonito que o outro quebra a tese.

A segunda consequência: **a fonte mono é a espinha clínica**. Todo fato verificável (CRM, RQE, duração, anestesia, endereço, disclaimer) em `--font-mono`. Toda persuasão em display ou body. Essa regra é o que faz o site parecer uma coisa só em vez de duas coladas, e vale para as duas audiências igualmente.

---

## 2. Camada de conteúdo

### 2.1 Decisão

Conteúdo em arquivos `.ts` tipados sob `/content`, sem CMS na v1. Acesso **sempre** através de funções em `content/index.ts` (`getProcedimento`, `listarProcedimentos`, `getFaq`, …), nunca por import direto do array em uma página.

**Razão:** migrar para Sanity depois é reimplementar essas funções. Se as páginas importarem os arrays direto, a migração vira reescrita de páginas.

### 2.2 O tipo que carrega o compliance

`Procedimento` tem exatamente os campos que o template da Seção 8.10 do briefing exige, e os campos de risco são **obrigatórios**:

```ts
export type Procedimento = {
  slug: string
  hub: 'otorrinolaringologia' | 'cirurgia-da-face' | 'estetica-facial'
  nome: string
  tituloSeo: string          // ≤ 60 caracteres — validado em teste
  descricaoSeo: string       // ≤ 155 caracteres — validado em teste
  eyebrow: string
  lead: string
  oQueE: string[]
  indicacoes: string[]
  comoEFeito: string[]
  fichaTecnica: FichaTecnica
  recuperacao: EtapaRecuperacao[]
  riscosELimites: RiscoOuLimite[]   // NÃO opcional, mínimo 3 — validado em teste
  faq: PerguntaResposta[]           // NÃO opcional, mínimo 5
  antesDepois?: CasoAntesDepois[]
  ctaFinal: string
}
```

**A não-opcionalidade de `riscosELimites` e `faq` é o mecanismo de compliance.** Nenhuma página de procedimento pode existir sem seção de riscos, porque o TypeScript não compila sem ela e o teste falha se o array tiver menos de 3 itens. Isso substitui "lembrar de escrever a seção de riscos" por uma garantia estrutural.

`FichaTecnica` tem `disclaimer: string` obrigatório pelo mesmo motivo.

### 2.3 Rotas de procedimento

As 10 páginas de procedimento **não** são 10 arquivos. São três rotas dinâmicas:

```
app/otorrinolaringologia/[slug]/page.tsx
app/cirurgia-da-face/[slug]/page.tsx
app/estetica-facial/[slug]/page.tsx
```

Cada uma com `generateStaticParams()` derivado do content e `generateMetadata()` derivado do mesmo objeto. Um único componente `<PaginaProcedimento />` renderiza o template.

**Exceção deliberada:** `/cirurgia-da-face/rinoplastia` recebe tratamento de landing page (hero próprio, seção função vs. estética, ilustração do fluxo de ar, FAQ estendida). Implementada como *composição adicional* sobre o template — a rota `[slug]` detecta o slug `rinoplastia` e envolve o template com as seções extras. Não é um segundo template.

---

## 3. Compliance CFM como gate de build

O briefing trata a Resolução CFM 2.336/2023 como requisito de sistema. A implementação segue: **cada regra vira um teste ou um erro de compilação.** Documento não impede violação; build quebrado impede.

### 3.1 Verificações automáticas

Todas ligadas em `pnpm verify` e no CI.

| Script | Reprova quando encontra |
|---|---|
| `scripts/verificar-termos.ts` | superlativo (`a melhor`, `referência`, `premiada`, `top`, `a mais procurada`, …), promessa de resultado (`garantido`, `dos seus sonhos`, `transformação garantida`), escassez artificial, ou `cirurgiã plástica` usado como título |
| `scripts/verificar-contraste.ts` | par de tokens usado no site abaixo de 4.5:1 (texto corrido) ou 3:1 (texto grande) |
| `scripts/verificar-cores.ts` | `#000`, `#fff`, `#ffffff`, `#000000`, gradiente colorido, `box-shadow` com cor, `backdrop-filter` |
| `scripts/verificar-bodoni.ts` | `--font-display` aplicada abaixo de `1.5rem`, ou com `font-weight` ≥ 600 |

`verificar-termos.ts` varre `/content/**/*.ts` e o texto literal em JSX. Falsos positivos se resolvem por allowlist explícita e comentada, nunca por afrouxar o regex.

### 3.2 Garantias em tipo

`AntesDepois` recebe `textoEducativo: string` e `autorizacaoId: string` como props **obrigatórias**. Sem elas: erro de compilação. É a exigência literal do briefing (Seção 3.3) e a razão de o componente ser seguro por construção.

### 3.3 `IdentificacaoCFM`

Renderiza **um único `<p>`**, uma única classe, `font-weight: 400`, uma `font-size`, uma `color`. Nenhum `<strong>`, nenhum `<span>` com estilo próprio.

Dois testes o protegem:

1. **Vitest** — o markup renderizado não contém elemento filho com estilo tipográfico.
2. **Playwright** — em **todas** as rotas do sitemap, lê `getComputedStyle` de cada nó de texto do bloco e falha se houver mais de um valor distinto de `font-weight`, `font-size`, `font-family` ou `color`.

O teste Playwright roda contra rotas enumeradas a partir do `sitemap.ts`, então uma rota nova entra na cobertura automaticamente.

### 3.4 Antes e depois na v1

Não há imagens autorizadas. A home renderiza a seção da 8.8 (texto explicando por que não há galeria). O componente `<AntesDepois />` fica implementado, testado e exercitado em `/_dev/componentes` com dados fictícios marcados como tal.

---

## 4. O Traço

O elemento de assinatura e o item de maior risco técnico. Isolado em um subagent próprio.

### 4.1 Estrutura

`lib/traco.ts` exporta o path em três segmentos nomeados:

```ts
export const TRACO_PATH = {
  entrada: '…',     // hero → manifesto
  resolucao: '…',   // manifesto → rinoplastia: resolve no perfil de rosto
  saida: '…',       // rinoplastia → footer
} as const
```

Trocar pela curva oficial do logo quando o SVG chegar = editar essas três constantes. Nenhum componente conhece a geometria.

### 4.2 Renderização

Um único `<svg>` `position: fixed`, cobrindo a viewport, `pointer-events: none`, `z-index` acima do fundo e abaixo do conteúdo. `stroke-width: 1`, `vector-effect: non-scaling-stroke`.

### 4.3 Progresso por scroll

- **Caminho preferido:** `animation-timeline: scroll()` dentro de `@supports (animation-timeline: scroll())`, animando `stroke-dashoffset`. Zero JS.
- **Fallback:** `IntersectionObserver` + um listener de scroll com `requestAnimationFrame` escrevendo a custom property `--traco-progresso`. Um listener para a página inteira, passivo.
- **`prefers-reduced-motion: reduce`:** path completo, estático, sem JS e sem observer.

### 4.4 Cor adaptativa — e por que não `mix-blend-mode`

O briefing sugere `mix-blend-mode` *ou* segmentos. Decisão: **segmentos com `clipPath`**. `mix-blend-mode` sobre `wine-700` produz um blush sujo e imprevisível, e a cor da assinatura não pode ser imprevisível.

Implementação: cada seção declara `data-superficie="vinho" | "areia"`. Um `ResizeObserver` sobre `<main>` mede os retângulos das seções. O SVG desenha o path **duas vezes** — uma em `blush-200`, outra em `wine-700` — cada cópia recortada por um `<clipPath>` composto dos retângulos da superfície correspondente. Estado inicial antes da medição: `wine-700` (fundo padrão é areia), então nunca há flash de cor errada.

### 4.5 Orçamento de performance

O Traço é o único candidato real a custar INP no mobile. Se na Fase 4 ele não couber nas metas Lighthouse, **degrada no mobile** (desenha uma vez na entrada, estático depois) em vez de baixar a meta. Decisão já tomada — não precisa voltar para aprovação.

---

## 5. Movimento

Orçamento fechado, conforme Seção 5.7 do briefing:

1. O Traço
2. Reveal de entrada por seção: fade + `translateY(16px)`, stagger 60ms
3. Hover: underline crescendo da esquerda; escala 1.02 em imagem com `overflow: hidden`

Nada além disso. Sem parallax, contador animado, texto letra-por-letra, cursor customizado, scroll sequestrado, elementos flutuantes.

O reveal usa `IntersectionObserver` + classe CSS, **não** Motion/framer-motion — é mais leve e não adiciona JS ao bundle inicial. Motion fica reservado para o menu mobile e para o slider do `AntesDepois`, onde gesto e interrupção justificam a biblioteca.

`prefers-reduced-motion: reduce` desliga os três.

---

## 6. Fontes

| Papel | Fonte | Carregamento |
|---|---|---|
| Display | Bodoni Moda (variable) | `next/font/google` |
| Corpo | Switzer (variable) | `next/font/local` |
| Dados | IBM Plex Mono | `next/font/google` |

Switzer não está no Google Fonts. `scripts/baixar-switzer.mjs` (versionado) busca o `.woff2` variável da Fontshare e grava em `app/fonts/`. O arquivo é commitado. Runtime não faz nenhuma requisição externa de fonte.

Subset `latin-ext` para acentuação PT-BR correta. `display: swap` em todas.

---

## 7. Formulário de contato

- **Server Action**, não route handler.
- Validação **Zod** compartilhada entre cliente e servidor (`lib/schema.ts`), servidor como fonte da verdade.
- **Honeypot**: campo oculto de nome plausível; preenchido = descarta silenciosamente com resposta de sucesso.
- **Rate limit**: em memória, por IP, janela deslizante. Documentado em `docs/ARQUITETURA.md` como insuficiente para multi-instância; Vercel KV entra no `ROADMAP.md`.
- **Envio**: Resend atrás de `RESEND_API_KEY`. Sem a chave: erro explícito em produção, log em desenvolvimento. **Nunca sucesso falso** — um formulário que finge ter enviado é pior do que um formulário quebrado.
- **LGPD**: checkbox não pré-marcado, obrigatório no schema Zod, com link para a política de privacidade.
- **Erros**: `aria-describedby` por campo, resumo em live region, foco movido para o primeiro campo inválido.

---

## 8. Acessibilidade e performance

Piso obrigatório conforme Seção 9 do briefing. O que este spec acrescenta:

- **axe-core roda em toda rota**, enumerada a partir do `sitemap.ts` — cobertura cresce sozinha.
- **Foco**: `outline: 2px solid var(--color-wine-700); outline-offset: 3px`. `outline: none` é proibido e verificado por `verificar-cores.ts`.
- **Mapa do consultório**: carregado sob interação (clique em um placeholder estático). Nunca no caminho do LCP.
- **Imagens**: AVIF/WebP, `sizes` explícito, blur placeholder. Enquanto não houver fotos reais, o componente `PlaceholderImagem` renderiza o bloco `sand-200` com o selo a 8% e o texto mono `IMAGEM PENDENTE — [descrição]`.

**Nenhuma foto de banco de imagens entra no repositório, nem provisoriamente.** Se vazar para produção, destrói a credibilidade que as fotos reais constroem.

---

## 9. Imagens geradas

**Proibido gerar:** pessoas, rostos, pacientes, "médica genérica", equipe e — em qualquer hipótese — antes/depois sintético. Além de indefensável, viola diretamente a Resolução CFM 2.336/23.

**Permitido:** texturas abstratas (gesso, linho, papel algodão em areia/vinho), grão sutil para overlay, e a **ilustração vetorial do fluxo de ar pelo septo nasal** — linha filete no mesmo peso do logo — para a página de rinoplastia. Essa ilustração é onde a tese "forma e função" fica visível em vez de escrita.

Isolados em `/public/texturas` e `/public/ilustracoes`, documentados.

---

## 10. Testes

| Camada | Ferramenta | Cobre |
|---|---|---|
| Unit | Vitest | `lib/contraste`, `lib/whatsapp`, `lib/schema`, uniformidade do `IdentificacaoCFM`, limites de SEO, mínimos de `riscosELimites`/`faq` |
| E2E | Playwright | navegação, formulário, menu mobile, slider do `AntesDepois` por teclado |
| A11y | Playwright + axe-core | toda rota, zero violações críticas |
| Visual | Playwright | screenshots 390 / 768 / 1440 de toda rota |
| Compliance | scripts + Vitest | Seção 3 deste spec |

---

## 11. Fora de escopo na v1

- CMS (Sanity entra no `ROADMAP.md`)
- `/blog` (rota preparada no roadmap, não implementada)
- Preço de consulta (permitido pelo CFM, mas desligado por padrão)
- Galeria de antes/depois (componente pronto, sem imagens autorizadas)
- Deploy na Vercel — exige conta autenticada do cliente; preparado e documentado, não executado

---

## 12. Riscos conhecidos

| Risco | Mitigação |
|---|---|
| Traço custa INP no mobile | Degradação para estático no mobile, decidida na Seção 4.5 |
| `verificar-termos.ts` com falso positivo travando o build | Allowlist explícita e comentada, nunca afrouxar o regex |
| Placeholders vazarem para produção | `scripts/verificar-html.ts` varre o HTML construído e reprova o build. A v1 sai com placeholders de propósito (as fotos não chegaram), então `IMAGEM PENDENTE` está numa allowlist explícita e comentada — remova-a quando as fotos entrarem. **Nota:** a ideia original era uma flag `PERMITIR_PLACEHOLDERS`; ela nunca foi implementada e a varredura do HTML resolve melhor, sem variável de ambiente. |
| Ausência das fotos reais deixar o layout mal calibrado | Placeholders com as mesmas proporções das fotos originais descritas na Seção 12.1 do briefing |
| Rate limit em memória insuficiente | Documentado; Vercel KV no roadmap |

---

## 13. Aviso

`docs/COMPLIANCE-CFM.md` abre com:

> Este documento é orientação de implementação, não parecer jurídico. Antes de publicar, submeta o site à revisão de advogado especializado em direito médico ou ao setor de fiscalização do CRM-MG.

Link: https://publicidademedica.cfm.org.br/
