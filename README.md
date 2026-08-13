# Site — Dra. Lívia Sant'Anna

Site institucional de otorrinolaringologia e cirurgia da face, em Belo Horizonte.

Next.js 15 · TypeScript strict · Tailwind CSS v4 · sem CMS na v1.

---

## Começar

```bash
pnpm install
pnpm fontes        # baixa a Switzer da Fontshare (só na primeira vez)
pnpm dev
```

Copie `.env.example` para `.env.local` e preencha. O site roda sem nenhuma
variável; o que não funciona sem elas é o envio do formulário.

### Se o build estiver lento

Este projeto vive dentro de uma pasta do OneDrive, o que torna o build
patologicamente lento — cada arquivo que o bundler escreve passa pelo filtro de
sincronização. Medido: 33,5 minutos contra 30,6 segundos.

A correção já está aplicada nesta máquina (`node_modules` e `.next` são
junctions para fora do OneDrive). Em outra máquina, recrie:

```powershell
$cache = "$env:LOCALAPPDATA\claude-builds\site-livia"
New-Item -ItemType Directory -Force $cache
foreach ($d in @("node_modules", ".next")) {
  New-Item -ItemType Junction -Path ".\$d" -Target "$cache\$d"
}
```

Fora do OneDrive, nada disso é necessário. Detalhes em `docs/ARQUITETURA.md`.

---

## Comandos

| Comando | O que faz |
|---|---|
| `pnpm dev` | Servidor de desenvolvimento |
| `pnpm build` | Build de produção |
| `pnpm check` | typecheck + lint + verify + testes unitários |
| `pnpm verify` | Os quatro scripts de compliance e design system |
| `pnpm test` | Testes unitários (Vitest) |
| `pnpm test:e2e` | Playwright: e2e, acessibilidade e capturas em 390/768/1440 |
| `pnpm fontes` | Rebaixa a Switzer da Fontshare |

`pnpm check` é o que precisa passar antes de qualquer commit.

---

## Como editar o conteúdo

Todo o texto do site está em `/content`, em arquivos `.ts` tipados. Não há CMS —
editar o site é editar esses arquivos.

| Arquivo | O que tem |
|---|---|
| `content/home.ts` | Todo o texto da home |
| `content/medica.ts` | Formação, biografia, bloco de identificação CFM |
| `content/consultorio.ts` | Endereço, telefone, WhatsApp, horários |
| `content/hubs.ts` | Os três hubs: otorrino, cirurgia da face, estética |
| `content/procedimentos/` | Os 11 procedimentos, um arquivo por hub |
| `content/faq.ts` | Perguntas transversais da home |
| `content/legal.ts` | Política de privacidade e aviso legal |

### O editor te protege

Os tipos em `content/tipos.ts` recusam conteúdo incompleto. Se você tentar
adicionar um procedimento sem seção de riscos, ou com menos de 5 perguntas de
FAQ, ou com ficha técnica sem disclaimer, **o projeto não compila**. Isso é
deliberado: são exigências da Resolução CFM 2.336/2023, e checklist é esquecido
enquanto o compilador não é.

O erro do editor vai dizer exatamente o que falta.

### Trocar as fotos

Coloque o arquivo em `/public/fotos` e troque, no conteúdo:

```ts
imagem: { tipo: "pendente", descricao: "..." }
```

por:

```ts
imagem: {
  tipo: "imagem",
  imagem: { src: "/fotos/nome.jpg", alt: "descrição", largura: 1200, altura: 1600 },
}
```

Enquanto for `pendente`, o site renderiza um bloco de placeholder com o selo.
**Nunca use foto de banco de imagens**, nem provisoriamente.

### Trocar a curva do Traço

Quando o SVG do logo chegar, edite as três constantes de `TRACO_PATH` em
`lib/traco.ts`. Nenhum componente conhece a geometria.

---

## O que impede um erro de compliance

O site é peça de publicidade médica sob a Resolução CFM 2.336/2023. As regras
são impostas por build, não por revisão manual:

| Regra | Mecanismo |
|---|---|
| Sem superlativo, promessa de resultado, ou "cirurgiã plástica" como título | `pnpm verify:termos` |
| Contraste WCAG AA em todo par de cor usado | `pnpm verify:contraste` |
| Sem `#000`/`#fff`, gradiente, sombra colorida, `outline: none` | `pnpm verify:cores` |
| Bodoni nunca abaixo de 1.5rem, nunca em bold | `pnpm verify:bodoni` |
| Bloco de identificação tipograficamente uniforme | Vitest + Playwright, em toda rota |
| Antes/depois sem texto educativo e autorização | Erro de compilação |

Se um script reprovar um texto legítimo, a saída é a `ALLOWLIST` do próprio
script, **com justificativa escrita** — nunca afrouxar o padrão.

Leia `docs/COMPLIANCE-CFM.md` antes de escrever qualquer texto novo.

---

## Antes de publicar

`PENDENCIAS.md` lista o que falta. Quatro itens bloqueiam a publicação:

1. Dados do consultório (endereço, telefone, WhatsApp, horários)
2. Convênios atendidos
3. **Revisão por advogado especializado em direito médico ou pelo CRM-MG**
4. Domínio definitivo

---

## Documentação

| Documento | Assunto |
|---|---|
| `docs/ARQUITETURA.md` | Decisões técnicas e por quê |
| `docs/COMPLIANCE-CFM.md` | Resolução CFM 2.336/2023 e como cada regra é imposta |
| `docs/DESIGN-SYSTEM.md` | Cor, tipografia, geometria, movimento, o Traço |
| `docs/ROADMAP.md` | O que ficou fora da v1 e o gatilho de cada item |
| `PENDENCIAS.md` | O que falta para publicar |
| `PLANO.md` | Plano de implementação |
