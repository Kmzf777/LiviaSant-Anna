# PLANO — Home de conversão + SEO técnico

**Status:** aprovado pelo cliente (15/08/2026)
**Origem:** áudio do dono do site + `textos-arthur-guardrails.md`

---

## O que ele reclamou, e o que cada reclamação significa em código

| Reclamação (áudio) | Diagnóstico | Onde |
|---|---|---|
| *"não converte, CTAs escondidos e fracos"* | Hero é `min-h-[92vh]` com `items-end`: o botão nasce no rodapé da primeira tela. Só 2 CTAs na página inteira, e o do meio manda o lead embora. | `Chamada.tsx:67`, `home.ts:42,68,133` |
| *"muita informação embaralhada"* | § 4 despeja 18 queixas em 3 colunas mais 11 procedimentos. § 3 soma 4 hospitais + 5 fotos + vídeo. | `home.ts:97-131`, `ExperienciaHospitalar.tsx` |
| *"as 4 seções estão gigantes"* | Cada seção foi desenhada como página. A home precisa ser leitura de 30 segundos. | `components/sections/home/**` |
| *"não mudou a fonte que eu falei"* / *"deixe mais bold que conseguir"* | Bodoni Moda travada em `font-normal` por regra de design system, com script que reprova o build. | `fonts.ts:20`, `scripts/verificar-bodoni.ts` |
| *"as fotos tudo bagunçadas"* | `Galeria` distribui em slots de larguras e desníveis diferentes — mosaico escalonado. Lê como bagunça. | `components/ui/Galeria.tsx` |
| *"o texto tá saindo"* | Overflow horizontal com fonte de sistema aumentada. Já houve um fix (`ed25bd9`), insuficiente. | `styles/**` |
| *"vídeo com sangue"* | Só existe um vídeo no repositório; os originais foram descartados. | `public/fotos/centro-cirurgico-video.mp4` |

**O menu NÃO é o problema.** As 20 rotas ficam. As páginas internas são o ativo de SEO de cauda longa e recebem mais conteúdo, não menos.

---

## Decisões tomadas (premissas declaradas, não perguntadas)

1. **Vídeo sai da home.** Não há alternativa no repositório e não há ffmpeg para inspecionar os quadros além do pôster. Tirar atende à preocupação dele sem risco e alivia a seção. O arquivo permanece versionado.
2. **Bodoni Moda no peso 900**, mantendo a família. A regra "nunca em bold" do § 5.3 é revogada por ordem do cliente; o script e o design system são atualizados junto, não desligados.
3. **Todas as rotas permanecem.** Só a home é reescrita.
4. **CTA prefere WhatsApp, com fallback para `/contato`.** O número é `[CONFIRMAR]` (`consultorio.ts:24`) — enquanto não vier, o botão aponta para o formulário.

---

## Pendência que bloqueia conversão de verdade

> **O número de WhatsApp.** `linkWhatsapp()` recusa placeholder e devolve `null`. Sem esse dado, todo o trabalho de CTA converte para um formulário em vez de uma conversa. É o item de maior impacto e o mais barato de resolver.

---

## Regras invioláveis (compliance CFM 2.336/2023)

Valem para todos os agentes. Violar qualquer uma reprova o build.

- **Nunca** "cirurgiã plástica" como título. Ela é otorrinolaringologista (RQE 70735) com atuação em cirurgia plástica da face.
- **Nunca** "Dra." dentro do bloco `IdentificacaoCFM`. `tests/unit/conteudo.spec.ts:115` reprova.
- **Nunca** superlativo, promessa de resultado, escassez artificial ou emoji. `pnpm verify:termos`.
- **Nunca** marcador `[CONFIRMAR]` em JSON-LD ou em texto publicado.
- Toda alteração passa em `pnpm check`.

---

## Execução — três ondas

### Onda 1 (paralela, arquivos disjuntos)

**Agente A — SEO técnico, robots, llms.txt, JSON-LD**

Escreve em: `app/robots.ts`, `app/llms.txt/route.ts`, `app/llms-full.txt/route.ts`, `app/(institucional)/**/page.tsx`, `app/{hub}/[slug]/page.tsx`, `app/{hub}/page.tsx`, `content/hubs.ts`, `content/procedimentos/**`, `content/legal.ts`, `lib/site.ts`, `lib/jsonld.ts`, `app/layout.tsx`, `docs/SEO.md`, `tests/unit/seo.spec.ts`.

Não toca em: `content/home.ts`, `components/**`, `styles/**`, `app/page.tsx`.

**Agente B — Tipografia bold e overflow**

Escreve em: `app/fonts.ts`, `styles/**`, `scripts/verificar-bodoni.ts`, `docs/DESIGN-SYSTEM.md`, `components/ui/SectionTitle.tsx`, `components/ui/Eyebrow.tsx`.

Não toca em: `content/**`, `app/page.tsx`, `components/sections/**`.

### Onda 2 (depois que A e B entrarem)

**Agente C — Home de conversão**

Escreve em: `content/home.ts`, `components/sections/home/**`, `components/ui/Galeria.tsx`, `components/ui/CtaFixo.tsx` (novo), `app/page.tsx`.

Depende de: tokens de peso do Agente B, convenção de título do Agente A.

### Onda 3

Verificação: `pnpm check`, `pnpm build`, `pnpm verify:html`, `pnpm test:e2e`.

---

## Alvo da home reescrita

Leitura de 30 segundos, CTA visível em qualquer ponto do scroll.

| § | Conteúdo | Corte |
|---|---|---|
| 1 | Chamada + CTA **acima da dobra** | `min-h` de 92vh → 78vh, `items-center`, CTA junto do H1 |
| 2 | Quem é ela: foto, nome em peso 900, 3 linhas de formação, CTA | 2 parágrafos → 1 frase + ficha de 3 linhas |
| 3 | Onde opera: 4 hospitais + 2 fotos em grade regular, CTA | 5 fotos escalonadas + vídeo → 2 fotos alinhadas |
| 4 | O que ela resolve + CTA final | 18 queixas → 3 grupos de 3, com link para o hub |
| — | CTA fixo no rodapé do celular | novo |

Cada seção termina em CTA. Nenhum CTA manda o lead para fora do funil.
