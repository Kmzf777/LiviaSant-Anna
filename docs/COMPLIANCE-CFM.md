# Compliance — Resolução CFM nº 2.336/2023

> Este documento é orientação de implementação, não parecer jurídico. Antes de publicar, submeta o site à revisão de advogado especializado em direito médico ou ao setor de fiscalização do CRM-MG.

**Fonte oficial:** <https://publicidademedica.cfm.org.br/>

A Resolução CFM nº 2.336/2023 está em vigor desde 11/03/2024 e disciplina a publicidade médica. Este site é peça de publicidade médica. Violação gera processo ético no CRM.

---

## 0. A premissa deste documento

Documento não impede violação. Build quebrado impede.

Cada regra abaixo está ligada a um mecanismo que reprova antes de publicar: um erro de compilação, um teste, um script de `pnpm verify`, ou a ausência de uma API que permitiria a violação. Onde não foi possível automatizar, a regra aparece na seção 6 — **o que a máquina não checa** — e é conferência humana obrigatória, não sugestão.

O comando que roda tudo:

```
pnpm check      # typecheck + lint + verify + test
pnpm test:e2e   # inclui tests/e2e/cfm.spec.ts em toda rota
```

---

## 1. Bloco de identificação obrigatório

### A regra

O bloco precisa aparecer em **local visível** de **todas** as páginas:

```
Lívia Sant'Anna — Médica — CRM-MG 83.288
Otorrinolaringologia — RQE 70735
```

A norma exige que **fonte, tamanho e cor sejam os mesmos em todo o bloco, sem alteração de tamanho e sem negrito**. Não se destaca "Dra.", não se aumenta o nome, não se põe o CRM em cinza claro para "não poluir o layout".

### Como está imposto

`components/medical/IdentificacaoCFM.tsx` renderiza:

- **um único `<p>`**, sem nenhum elemento filho;
- **um único nó de texto** — a quebra de linha é `\n` com `white-space: pre-line`, não `<br>`, não dois parágrafos;
- **uma única lista de classes**, com `font-normal` (400) explícito, `font-mono` e uma cor por superfície;
- **nenhuma prop `className`**. Essa ausência é deliberada: um `className` livre seria o furo por onde entrariam `font-bold`, `text-lg` ou um cinza claro no CRM — exatamente as três violações que a norma nomeia. Contexto novo entra pelo mapa `TOM`, onde a cor fica medida em `scripts/verificar-contraste.ts`.

Onde não houver filho, não há como destacar trecho. A uniformidade não é uma convenção de estilo que alguém precisa lembrar: é uma propriedade estrutural do markup.

Os dados vêm de `getMedica().identificacao` em `content/medica.ts`. `content/tipos.ts` documenta que `nome` não carrega "Dra." — o título não faz parte do bloco normativo — e `tests/unit/conteudo.spec.ts` reprova se ele entrar.

**Múltiplos blocos na mesma página** (a faixa de identificação da home e o footer, por exemplo) podem ter cores diferentes entre si, porque cada um está sobre uma superfície diferente. A norma trata da uniformidade **dentro** do bloco, e é isso que o teste mede: bloco a bloco.

### Onde ele aparece

O `Footer` monta `<IdentificacaoCFM />` e o footer está no layout raiz, então toda rota herda o bloco. A home acrescenta a faixa de identificação da § 8.2 do briefing. O teste e2e não confia nisso: ele varre `listarRotas()` e reprova qualquer rota sem o bloco.

---

## 2. Proibido no site (§ 3.2 do briefing)

| Proibição                             | Exemplo do que não pode                                                                                                                                            |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Superlativo e autopromoção            | "a melhor", "referência em", "premiada", "a mais procurada", "excelência incomparável", "pioneira"                                                                 |
| Promessa ou garantia de resultado     | "resultados garantidos", "o nariz dos seus sonhos", "transformação garantida", "100% de satisfação", "sem riscos", "indolor"                                       |
| Sensacionalismo e escassez artificial | contagem regressiva, "últimas vagas", "promoção", "aproveite agora"                                                                                                |
| Exclusividade de técnica              | nome comercial registrado para procedimento ("Rinoplastia Sant'Anna™"). É o que o `garthfisher.com` faz com o "Pinnacle Facelift™" e é o que **não** se copia dele |
| Título de "cirurgiã plástica"         | o RQE dela é em **Otorrinolaringologia** (RQE 70735)                                                                                                               |
| Preço de procedimento cirúrgico       | preço de consulta é permitido; está desligado por padrão na v1                                                                                                     |

### Sobre o título de especialidade

Este é o item mais fácil de errar e um dos mais graves: usar título de especialidade não registrada é exercício irregular perante o CFM.

- **Errado:** "cirurgiã plástica", "especialista em cirurgia plástica".
- **Certo:** _"otorrinolaringologista, com atuação em cirurgia plástica da face"_.

`content/medica.ts` guarda a única formulação autorizada em `descricaoAtuacao`. O til é o que separa os dois casos, e o script sabe disso: `cirurgiA plástica da face` é o campo de atuação, permitido; `cirurgiÃ plástica` é a pessoa, proibido.

### Como está imposto

`scripts/verificar-termos.ts` (`pnpm verify:termos`) varre `content/`, `app/`, `components/` e `lib/` e reprova o build em cada uma das categorias acima. Comentários são ignorados, para que este documento e o próprio script possam citar os termos que proíbem.

**Falso positivo se resolve na `ALLOWLIST`, com justificativa escrita — nunca afrouxando o regex.** A justificativa precisa explicar por que aquele texto não é publicidade enganosa naquele contexto. "É só uma palavra" não é justificativa. Um regex frouxo aqui é um processo ético depois.

---

## 3. Antes e depois (§ 3.3 do briefing)

Permitido, sob condições **cumulativas**. Se qualquer uma faltar, **não publique**.

| #   | Condição                                                                                                                            |
| --- | ----------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Autorização formal e documentada do paciente                                                                                        |
| 2   | Paciente **não identificável** — crop abaixo dos olhos ou acima do queixo conforme o caso; sem tatuagem, joia ou marca reconhecível |
| 3   | Imagem **sem manipulação** — mesma iluminação, mesmo ângulo, mesma distância focal, sem filtro, sem retoque                         |
| 4   | **Contexto educativo junto à imagem** — indicação, possíveis evoluções satisfatórias e insatisfatórias, riscos e complicações       |
| 5   | Aviso explícito de que **resultados variam entre pacientes**                                                                        |

### Como está imposto

`components/medical/AntesDepois.tsx` é seguro por construção:

- **(1)** `autorizacaoId` é prop **obrigatória em TypeScript**. Sem ela, erro de compilação. O tipo `string` não impede `""`, então um invariante em tempo de execução lança se a string vier vazia.
- **(3)** as duas imagens precisam ter a **mesma proporção** (tolerância de 1%). Enquadramento diferente entre antes e depois é a manipulação mais comum e a única mensurável a partir dos metadados que o tipo `Imagem` já carrega. Divergiu, lança.
- **(4)** `textoEducativo` é prop **obrigatória em TypeScript**, com mínimo de 120 caracteres — um campo obrigatório preenchido com "ok" satisfaz o compilador e não satisfaz a norma. É renderizado **sempre visível**, em `<figcaption>`, no mesmo corpo do texto corrido do site: nunca em tooltip, nunca em `<details>` fechado.
- **(5)** o aviso de variação é renderizado **por construção**, com texto padrão. A prop `avisoVariacao` sobrescreve o texto; não existe prop que o remova.
- O rodapé da figura registra o intervalo entre as fotos e a referência da autorização arquivada.

`CasoAntesDepois` em `content/tipos.ts` tem os mesmos campos, todos obrigatórios: **um caso sem autorização ou sem texto educativo não existe como dado**, então não há como publicá-lo por engano a partir do conteúdo.

O falhar-alto é deliberado. Uma seção quebrada é um incidente de desenvolvimento; uma imagem publicada sem os requisitos da norma é um processo ético.

### Situação na v1

**Não há imagens autorizadas.** Nenhuma foto de paciente existe no repositório.

A home renderiza a seção da § 8.8 do briefing, que explica a ausência em vez de inventar galeria — converter a ausência em sinal de seriedade é melhor do que uma galeria fraca, e é a única opção legal. O componente fica pronto e testado, exercitado em `/_dev/componentes` com dados **explicitamente marcados como fictícios**.

### Regras operacionais para quando as imagens chegarem

1. O termo de autorização assinado é arquivado **fora do repositório**, em local sob controle do consultório. O repositório guarda apenas a referência opaca.
2. `autorizacaoId` **nunca** contém nome, iniciais, CPF, data de nascimento ou qualquer dado que reidentifique o paciente. Esse valor é renderizado na página.
3. Nenhuma imagem gerada ou editada por IA. **Antes e depois sintético viola diretamente a norma** e é motivo de processo ético, além de indefensável em um site médico.
4. O crop de anonimização é feito antes de o arquivo entrar no repositório. Não confie em CSS para esconder rosto: o arquivo original continua acessível pela URL.
5. Antes de publicar, alguém confere item a item as cinco condições da tabela acima. As condições 2 e 3 não têm mecanismo automático — ver seção 6.

---

## 4. Depoimentos (§ 3.4 do briefing)

Repostar elogios é permitido. As restrições:

- **Evite depoimento que descreva resultado como garantido.** Um paciente escrevendo "ficou perfeito, recomendo de olhos fechados" é, republicado pelo médico, promessa de resultado.
- **Prefira depoimentos sobre atendimento e acolhimento**, não sobre resultado estético. "Ela explicou tudo com calma e não me pressionou a decidir" é seguro e diz mais sobre a prática dela do que uma nota de satisfação.
- Sem estrelinhas, sem carrossel, sem contador de satisfação — o briefing § 15 veta o padrão visual e a norma veta o conteúdo.

### Como está imposto

Não há componente de depoimento na v1, e **essa é a imposição mais forte disponível**: a superfície não existe.

Se um for construído, o texto do depoimento entra em `content/` e passa por `verificar-termos.ts` como qualquer outro texto do site — "garantido", "perfeito", "dos seus sonhos" e "100% de satisfação" reprovam o build vindos de um paciente exatamente como vindos da médica. Republicar é assumir o texto.

---

## 5. Regra → mecanismo

| Regra                                              | Mecanismo                                                                                                                                    | Onde                                                                                             |
| -------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| Bloco de identificação em todas as páginas         | Teste e2e sobre `listarRotas()`; falha se a rota não tiver o bloco                                                                           | `tests/e2e/cfm.spec.ts`                                                                          |
| Bloco com fonte, tamanho e cor uniformes           | `getComputedStyle` de cada nó de texto do bloco; falha com mais de um valor distinto de `font-family`, `font-size`, `font-weight` ou `color` | `tests/e2e/cfm.spec.ts`                                                                          |
| Bloco sem negrito                                  | Mesmo teste: `font-weight` computado precisa ser 400                                                                                         | `tests/e2e/cfm.spec.ts`                                                                          |
| Bloco sem trecho destacado                         | Estrutura: um `<p>`, zero filhos, um nó de texto — verificado no markup e no DOM renderizado                                                 | `IdentificacaoCFM.tsx`, `tests/unit/cfm.spec.tsx`, `tests/e2e/cfm.spec.ts`                       |
| Ninguém injeta peso/tamanho no bloco por fora      | Ausência de prop `className`; `@ts-expect-error` reprova se ela voltar a existir                                                             | `IdentificacaoCFM.tsx`, `tests/unit/cfm.spec.tsx`                                                |
| "Dra." fora do bloco normativo                     | Teste sobre o conteúdo                                                                                                                       | `tests/unit/conteudo.spec.ts`                                                                    |
| Zero superlativo e autopromoção                    | Script de termos proibidos                                                                                                                   | `scripts/verificar-termos.ts`                                                                    |
| Zero promessa ou garantia de resultado             | Script de termos proibidos                                                                                                                   | `scripts/verificar-termos.ts`                                                                    |
| Zero escassez artificial e sensacionalismo         | Script de termos proibidos                                                                                                                   | `scripts/verificar-termos.ts`                                                                    |
| Nunca o título "cirurgiã plástica"                 | Script de termos proibidos + teste sobre `descricaoAtuacao`                                                                                  | `scripts/verificar-termos.ts`, `tests/unit/conteudo.spec.ts`                                     |
| Antes e depois exige autorização                   | Prop `autorizacaoId` obrigatória (erro de compilação) + invariante contra string vazia                                                       | `AntesDepois.tsx`, `tests/unit/cfm.spec.tsx`                                                     |
| Antes e depois exige contexto educativo            | Prop `textoEducativo` obrigatória (erro de compilação) + mínimo de conteúdo + render sempre visível                                          | `AntesDepois.tsx`, `tests/unit/cfm.spec.tsx`                                                     |
| Antes e depois exige aviso de variação             | Renderizado por construção; não há prop que o remova                                                                                         | `AntesDepois.tsx`, `tests/unit/cfm.spec.tsx`                                                     |
| Antes e depois sem manipulação de enquadramento    | Proporção das duas imagens comparada; divergência acima de 1% lança                                                                          | `AntesDepois.tsx`, `tests/unit/cfm.spec.tsx`                                                     |
| Caso de antes/depois não existe incompleto         | Todos os campos de `CasoAntesDepois` obrigatórios                                                                                            | `content/tipos.ts`                                                                               |
| Ficha técnica sempre com disclaimer                | Campo `disclaimer` obrigatório no tipo + invariante de conteúdo mínimo + teste                                                               | `content/tipos.ts`, `FichaTecnica.tsx`, `tests/unit/cfm.spec.tsx`, `tests/unit/conteudo.spec.ts` |
| Toda página de procedimento tem "Riscos e limites" | `riscosELimites: MinTres<RiscoOuLimite>` — menos de três não compila                                                                         | `content/tipos.ts`                                                                               |
| Riscos escritos de verdade, não rótulos            | Teste de comprimento mínimo por descrição                                                                                                    | `tests/unit/conteudo.spec.ts`                                                                    |
| Riscos não escondidos nem apagados                 | Render aberto (sem `<details>`), em `text-body`/`ink-900`; teste reprova corpo menor ou tinta apagada                                        | `RiscosELimites.tsx`, `tests/unit/cfm.spec.tsx`                                                  |
| Slider de antes/depois navegável por teclado       | `role="slider"` com `aria-valuenow`/`min`/`max`/`label`; setas, Shift, PageUp/PageDown, Home/End                                             | `AntesDepois.tsx`, `tests/unit/cfm.spec.tsx`                                                     |
| Nenhuma foto de banco ou placeholder vazado        | `PlaceholderImagem` + `PENDENCIAS.md`                                                                                                        | spec § 8 e § 12                                                                                  |
| Contraste AA em todo par de cor em uso             | Medição programática                                                                                                                         | `scripts/verificar-contraste.ts`                                                                 |

---

## 6. O que a máquina **não** checa

Estas são conferências humanas obrigatórias antes de publicar. Nenhum script as cobre, e fingir que cobre é pior do que não ter script.

1. **Que o paciente não é identificável** na foto de antes e depois. Crop, tatuagem, joia, sinal, formato de orelha, plano de fundo reconhecível. Nenhum código lê uma imagem e decide isso.
2. **Que a imagem não foi retocada, filtrada ou refotografada sob outra luz.** A verificação de proporção pega enquadramento diferente; não pega filtro nem retoque.
3. **Que a autorização referenciada por `autorizacaoId` de fato existe, está assinada e cobre a publicação em site.** O código verifica que a referência foi preenchida, não que o papel existe.
4. **Que o texto educativo é clinicamente correto.** O componente exige que ele exista e tenha corpo; a correção do conteúdo é da médica.
5. **Superlativo que o regex não conhece.** A lista de padrões é finita e a língua não é. Leia o texto novo com a § 3.2 do briefing ao lado.
6. **Contexto que transforma texto lícito em promessa.** "Retorno social em 7 dias" é fato com disclaimer; a mesma frase em manchete, sem a ficha técnica em volta, vira promessa.
7. **Imagens de terceiros e direitos de uso** — fora do escopo da resolução, dentro do escopo do risco jurídico.

---

## 7. Antes de publicar

- [ ] `pnpm check` verde
- [ ] `pnpm test:e2e` verde, incluindo `tests/e2e/cfm.spec.ts` em toda rota
- [ ] Bloco de identificação conferido a olho em uma página de cada tipo, em 390px e 1440px
- [ ] Nenhuma imagem de antes e depois publicada sem as cinco condições da seção 3 conferidas item a item
- [ ] Nenhum placeholder de imagem em produção
- [ ] Texto novo lido com a § 3.2 do briefing ao lado
- [ ] **Revisão por advogado especializado em direito médico ou pelo setor de fiscalização do CRM-MG**

O último item não é opcional e não é substituível pelos anteriores. Todo o resto deste documento existe para que a revisão jurídica encontre um site já correto, não para dispensá-la.
