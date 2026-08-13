# PLANO DE IMPLEMENTAÇÃO — Site Dra. Lívia Sant'Anna

**Spec:** `docs/superpowers/specs/2026-08-13-site-livia-santanna-design.md`
**Briefing:** `prompt.md`
**Status:** aprovado — execução liberada

---

## Decisões travadas antes do código

| Questão | Decisão |
|---|---|
| Assets (`/assets-originais` não existe) | Construir com placeholders da Seção 12.2. Caminhos e componentes já apontam para os arquivos finais. |
| Escopo v1 | Todas as 17 rotas completas. Home e rinoplastia com profundidade de landing page. |
| Fonte Switzer | Baixada da Fontshare e auto-hospedada via `next/font/local`. |
| Gerenciador de pacotes | `pnpm` (10.22 instalado) |
| Deploy | Preparado, não executado — exige conta Vercel autenticada |
| Skill obrigatória | **Todo subagent que toca frontend usa `frontend-design`** |

---

## Árvore de arquivos alvo

```
app/
  layout.tsx                          fontes, metadata base, Traco, Header, Footer
  page.tsx                            home
  globals.css                         importa styles/theme.css
  fonts/                              Switzer .woff2 (commitado)
  opengraph-image.tsx                 OG dinâmica no padrão da marca
  sitemap.ts  robots.ts
  (institucional)/
    dra-livia-santanna/page.tsx
    consulta/page.tsx
    consultorio/page.tsx
    contato/page.tsx
    politica-de-privacidade/page.tsx
    aviso-legal/page.tsx
  otorrinolaringologia/
    page.tsx                          hub função
    [slug]/page.tsx                   5 procedimentos
  cirurgia-da-face/
    page.tsx                          hub forma
    [slug]/page.tsx                   5 procedimentos (rinoplastia com composição extra)
  estetica-facial/
    page.tsx                          hub
    [slug]/page.tsx                   toxina botulínica
  _dev/componentes/page.tsx           galeria, noindex

components/
  layout/     Header, Footer, Traco, RailLateral, MenuMobile
  ui/         Eyebrow, SectionTitle, Botao, Filete, RetratoArco,
              PlaceholderImagem, Citacao, Passos, Reveal
  sections/   Hero, Manifesto, DuasFrentes, RinoplastiaDestaque, AMedica,
              ComoEAConsulta, ResultadosVazio, FaqSecao, CtaFinal
  medical/    IdentificacaoCFM, AntesDepois, FichaTecnica, RiscosELimites,
              CardProcedimento, CardFrente, PaginaProcedimento
  form/       FormularioContato, CampoTexto, CampoConsentimento, BotaoWhatsApp

content/
  tipos.ts       index.ts       medica.ts
  procedimentos/ otorrino.ts    cirurgia-face.ts    estetica.ts
  faq.ts         consultorio.ts  home.ts   legal.ts

lib/
  traco.ts       schema.ts      contraste.ts    whatsapp.ts
  jsonld.ts      metadata.ts    rate-limit.ts

scripts/
  baixar-switzer.mjs
  verificar-termos.ts   verificar-contraste.ts
  verificar-cores.ts    verificar-bodoni.ts

docs/
  ARQUITETURA.md   COMPLIANCE-CFM.md   DESIGN-SYSTEM.md   ROADMAP.md
  superpowers/specs/2026-08-13-site-livia-santanna-design.md

styles/
  theme.css                             tokens @theme

tests/
  unit/   e2e/   a11y/   visual/

public/
  texturas/   ilustracoes/   fontes/

PLANO.md   PENDENCIAS.md   README.md
```

---

## Ordem de execução

### Fase 1 — Fundação (sequencial, sem subagent)

Feita por mim, porque tudo na Fase 2 depende destes contratos. Nada aqui pode estar errado.

1. `pnpm create next-app` — App Router, TypeScript strict, Tailwind v4, sem `src/`, alias `@/`
2. `tsconfig.json`: `strict`, `noUncheckedIndexedAccess`, `noImplicitOverride`
3. `styles/theme.css` — **todos** os tokens da Seção 5 do briefing: cor, tipografia fluida, grid, espaço, movimento
4. `scripts/baixar-switzer.mjs` + fontes carregadas em `app/layout.tsx`
5. `content/tipos.ts` — **o contrato mais importante do projeto**; a Fase 2 inteira depende dele
6. `lib/contraste.ts` + os 4 scripts de verificação, ligados em `pnpm verify`
7. `app/layout.tsx` mínimo, `globals.css`, `sitemap.ts`, `robots.ts`
8. Vitest + Playwright + ESLint (`jsx-a11y`) + Prettier configurados e rodando
9. `.gitignore`, `.env.example`, commit inicial

**Portão:** `pnpm build`, `pnpm test`, `pnpm verify` e `pnpm lint` passam. Sem isso, não abro a Fase 2.

---

### Fase 2 — Paralela, 4 subagents

Todos partem do mesmo commit. Fronteiras de arquivo são disjuntas — nenhum subagent escreve onde o outro escreve.

| # | Subagent | Escreve em | Não toca em |
|---|---|---|---|
| **A** | **Design System** — primitivos de `components/ui/` e `components/layout/` (menos Traco), rota `_dev/componentes` com todos os estados, `docs/DESIGN-SYSTEM.md` | `components/ui/**`, `components/layout/{Header,Footer,RailLateral,MenuMobile}`, `app/_dev/**`, `docs/DESIGN-SYSTEM.md` | `content/**`, `components/medical/**`, `Traco` |
| **B** | **O Traço** — `lib/traco.ts` com os 3 segmentos, `components/layout/Traco.tsx`, scroll-driven CSS + fallback IO, reduced-motion, clipPath de superfície, testes | `lib/traco.ts`, `components/layout/Traco.tsx`, `tests/e2e/traco.spec.ts` | tudo o mais |
| **C** | **Conteúdo** — popula `/content` com todo o texto da Seção 8 do briefing, tipado; escreve os 11 procedimentos com clínica real e concisa; marca `[CONFIRMAR]` em `PENDENCIAS.md` | `content/**`, `PENDENCIAS.md` | qualquer componente, qualquer CSS |
| **D** | **Compliance** — `IdentificacaoCFM`, `AntesDepois` com props obrigatórias, `FichaTecnica`, `RiscosELimites`, `docs/COMPLIANCE-CFM.md`, testes que reprovam violação | `components/medical/**`, `docs/COMPLIANCE-CFM.md`, `tests/unit/cfm.spec.ts`, `tests/e2e/cfm.spec.ts` | `content/**`, `components/ui/**` |

**A, B e D usam a skill `frontend-design`.** C não escreve frontend.

**Portão:** subagent revisor com a Seção 14 do briefing como checklist. Reprova e devolve. Não avanço com pendência.

---

### Fase 3 — Paralela, 4 subagents (após o portão da Fase 2)

Todos usam a skill `frontend-design`. Todos consomem os primitivos da Fase 2 — nenhum cria componente de UI novo sem antes verificar se já existe.

| # | Subagent | Escopo | Escreve em |
|---|---|---|---|
| **E** | **Home** — as 9 seções da Seção 8, JSON-LD `Physician` + `MedicalBusiness`, OG image | `app/page.tsx`, `components/sections/**`, `app/opengraph-image.tsx` |
| **F** | **Rinoplastia + hub forma** — `PaginaProcedimento`, hub `/cirurgia-da-face`, rota `[slug]`, composição extra da rinoplastia, ilustração do fluxo de ar | `app/cirurgia-da-face/**`, `components/medical/PaginaProcedimento.tsx`, `public/ilustracoes/**` |
| **G** | **Hub otorrino + estética** — `/otorrinolaringologia` e `/estetica-facial`, rotas `[slug]`, `MedicalProcedure` + `FAQPage` JSON-LD | `app/otorrinolaringologia/**`, `app/estetica-facial/**`, `lib/jsonld.ts` |
| **H** | **Institucionais + formulário** — 6 rotas institucionais, Server Action, Zod, honeypot, rate limit, Resend, `BotaoWhatsApp`, mapa sob interação | `app/(institucional)/**`, `components/form/**`, `lib/{schema,rate-limit,whatsapp}.ts` |

Conflito previsto: F cria `PaginaProcedimento`, G consome. Resolvo entregando **F primeiro em ~10 minutos de vantagem**, ou definindo o componente na Fase 1 como stub tipado. Escolha: **stub tipado na Fase 1** — elimina a corrida.

**Portão:** revisor + `pnpm build && pnpm test && pnpm verify && pnpm lint`.

---

### Fase 4 — Qualidade (sequencial)

Subagent revisor dedicado:

1. `pnpm build` de produção, `pnpm start`
2. Lighthouse mobile em toda rota — Perf ≥ 90, A11y 100, SEO 100
3. axe-core em toda rota — zero violações críticas
4. Playwright: screenshots 390 / 768 / 1440 de todas as 17 rotas
5. Os 4 scripts de verificação
6. Navegação completa por teclado, foco sempre visível
7. JSON-LD validado
8. **Crítica visual escrita** — o que está fraco, listado antes de entregar

Falha em qualquer item volta para o subagent responsável. Não declaro pronto com pendência.

---

### Fase 5 — Entrega

`README.md` (setup, como editar conteúdo, como trocar as fotos, como trocar o `TRACO_PATH`), `PENDENCIAS.md` consolidado, instruções de deploy Vercel para você executar.

---

## Convenções

- **Commits pequenos e descritivos**, um por unidade de trabalho concluída. Português na mensagem.
- **Código em inglês, textos do site em português.**
- Nenhum subagent commita — eu commito ao fechar cada portão, depois de verificar.
- Nenhum subagent instala dependência sem justificar. A lista da Seção 4 do briefing é fechada: sem shadcn, sem biblioteca de UI, sem jQuery, sem template.

---

## O que eu não farei sem você

1. **Deploy na Vercel** — precisa da sua conta.
2. **Publicar qualquer antes/depois** — não há autorização documentada.
3. **Gerar imagem de pessoa, rosto ou paciente** — proibido pelo briefing e pela Resolução CFM 2.336/23.
4. **Inventar conteúdo médico** — onde faltar, `[CONFIRMAR]` e `PENDENCIAS.md`.
