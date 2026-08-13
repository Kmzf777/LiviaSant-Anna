# Arquitetura

## Stack

| Camada | Escolha |
|---|---|
| Framework | Next.js 15, App Router |
| Linguagem | TypeScript strict, com `noUncheckedIndexedAccess` |
| Estilo | Tailwind CSS v4, tokens via `@theme` em `styles/theme.css` |
| Fontes | `next/font/google` (Bodoni Moda, IBM Plex Mono) + `next/font/local` (Switzer) |
| Conteúdo | Arquivos `.ts` tipados em `/content`, sem CMS |
| Formulário | Server Action + Zod + Resend |
| Testes | Vitest (unit), Playwright (e2e, a11y, visual) |
| Verificação | Quatro scripts próprios em `/scripts`, ligados em `pnpm verify` |

Sem jQuery, sem biblioteca de componentes pronta (shadcn incluso), sem template.
Todo componente é escrito a partir do design system.

---

## Por que conteúdo em `.ts` e não CMS

Ela precisa que o site funcione, não que seja editável por ela hoje. Um CMS na
v1 acrescentaria custo, uma conta a administrar e uma superfície de erro, sem
resolver nenhum problema atual.

A decisão que importa não é "sem CMS", é **como sair dessa decisão depois**.

Páginas nunca importam os arrays de conteúdo direto. Todo acesso passa por
funções em `content/index.ts`:

```ts
getProcedimento(hub, slug)   listarProcedimentos(hub?)
getHome()                    getMedica()
getHub(slug)                 listarRotas()
```

Migrar para Sanity é reimplementar essas funções como `async` e ajustar as
páginas que as chamam para `await`. Se uma página importar `PROCEDIMENTOS`
direto, a migração vira reescrita — por isso a regra existe, e por isso vale a
pena checá-la em revisão.

---

## Tipos que carregam regra

`content/tipos.ts` não é só documentação de forma. Vários campos que poderiam
ser opcionais são obrigatórios de propósito, e alguns arrays têm cardinalidade
mínima garantida em tempo de compilação:

```ts
riscosELimites: MinTres<RiscoOuLimite>     // [T, T, T, ...T[]]
faq:            MinCinco<PerguntaResposta> // [T, T, T, T, T, ...T[]]
```

O efeito prático: **não existe página de procedimento sem seção de riscos**.
Não porque alguém lembrou de escrever, mas porque o TypeScript recusa o objeto.
O mesmo vale para o `disclaimer` da ficha técnica e para as props do
`<AntesDepois />`.

Isso substitui um item de checklist por uma garantia. Checklists são esquecidos;
o compilador não.

---

## Rotas

As 11 páginas de procedimento não são 11 arquivos. São três rotas dinâmicas,
uma por hub:

```
app/otorrinolaringologia/[slug]/page.tsx
app/cirurgia-da-face/[slug]/page.tsx
app/estetica-facial/[slug]/page.tsx
```

Cada uma com `generateStaticParams()` e `generateMetadata()` derivados do
conteúdo. Um único `<PaginaProcedimento />` renderiza o template do briefing
§ 8.10.

**Exceção deliberada:** `/cirurgia-da-face/rinoplastia` é a página carro-chefe e
recebe seções extras (hero próprio, função vs. estética, ilustração do fluxo de
ar). É composição *sobre* o template, não um segundo template — a rota `[slug]`
detecta o slug e envolve o padrão com as seções adicionais.

`listarRotas()` é a fonte única de rotas para o `sitemap.ts`, para os testes de
axe-core e para o teste do bloco CFM. Uma rota nova entra em cobertura de
acessibilidade e de compliance sozinha.

---

## Compliance como build gate

Ver `docs/COMPLIANCE-CFM.md` para as regras. O que importa aqui é o mecanismo:

| Regra | Onde é imposta |
|---|---|
| Sem superlativo, sem promessa de resultado, sem título de cirurgiã plástica | `scripts/verificar-termos.ts` |
| Contraste AA em todo par usado | `scripts/verificar-contraste.ts` |
| Sem `#000`/`#fff`, gradiente, sombra colorida, `outline: none` | `scripts/verificar-cores.ts` |
| Bodoni nunca < 1.5rem, nunca bold | `scripts/verificar-bodoni.ts` |
| Bloco CFM tipograficamente uniforme | Vitest + Playwright em toda rota |
| `AntesDepois` sem texto educativo | Erro de compilação |

`pnpm verify` roda os quatro scripts. `pnpm check` roda typecheck, lint, verify
e os testes unitários.

Falso positivo se resolve na `ALLOWLIST` de cada script, **com justificativa
escrita** — nunca afrouxando o padrão. Um regex frouxo aqui é um processo ético
depois.

---

## Movimento

O orçamento de animação é fechado (briefing § 5.7): o Traço, o reveal de seção,
e dois efeitos de hover. Nada além disso.

O reveal usa `IntersectionObserver` + classe CSS, **não** framer-motion — não
adiciona JS ao bundle inicial. `motion` fica reservado ao menu mobile e ao
slider do `<AntesDepois />`, onde gesto e interrupção justificam a biblioteca.

Ver `docs/DESIGN-SYSTEM.md` para o Traço.

---

## Formulário

Server Action, não route handler. Zod compartilhado entre cliente e servidor,
com o servidor como fonte da verdade. Honeypot descarta bot silenciosamente,
com resposta de sucesso. Rate limit por IP.

**O rate limit é em memória.** Funciona em uma instância; na Vercel, com várias
instâncias serverless, cada uma tem seu próprio contador. É proteção contra
abuso casual, não contra ataque coordenado. Migrar para Vercel KV está em
`docs/ROADMAP.md`.

Sem `RESEND_API_KEY`, o envio falha explicitamente em produção. Nunca retorna
sucesso falso: um formulário que finge ter enviado é pior do que um quebrado.

---

## Ambiente de desenvolvimento

O projeto está dentro de uma pasta sincronizada pelo OneDrive. Isso torna o
build patologicamente lento — cada arquivo que o bundler escreve passa pelo
filtro de sincronização. Medido: **33,5 minutos** de compilação.

Correção aplicada: `node_modules` e `.next` moveram-se para
`%LOCALAPPDATA%\claude-builds\site-livia\` e ficaram no lugar original como
**junctions**. O OneDrive não atravessa reparse points, então para de tentar
sincronizá-los. Ambos já eram ignorados pelo git, então nada muda para o
versionamento nem para a Vercel.

Resultado: **30,6 segundos**.

Se você clonar este repositório em outra máquina, ou se apagar as pastas, o
comportamento padrão volta — é só recriar as junctions:

```powershell
$cache = "$env:LOCALAPPDATA\claude-builds\site-livia"
New-Item -ItemType Directory -Force $cache
foreach ($d in @("node_modules", ".next")) {
  New-Item -ItemType Junction -Path ".\$d" -Target "$cache\$d"
}
```

Fora do OneDrive, nada disso é necessário.
