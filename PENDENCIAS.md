# PENDÊNCIAS

O que falta para o site poder ir ao ar. Nada aqui foi inventado — onde faltou
informação, ficou `[CONFIRMAR]` no conteúdo e uma linha nesta lista.

**Legenda de bloqueio**
`BLOQUEIA PUBLICAÇÃO` — não publique com este item em aberto.
`DEGRADA` — o site funciona, mas fica pior ou incompleto.

---

## Bloqueiam a publicação

### 1. Dados do consultório — `content/consultorio.ts`
`BLOQUEIA PUBLICAÇÃO`

Todos os campos abaixo estão como `[CONFIRMAR]`. Eles alimentam o JSON-LD
`MedicalBusiness`, o mapa e o botão de WhatsApp. Endereço ou telefone errado
publicado é pior do que ausente.

- [ ] Logradouro, número e sala
- [ ] Bairro e CEP
- [ ] Telefone do consultório
- [ ] WhatsApp com DDI e DDD (formato `5531999999999`)
- [ ] E-mail de contato
- [ ] Dias e horários de atendimento
- [ ] Estacionamento: existe no prédio? é conveniado? qual valor?
- [ ] Acessibilidade do prédio: elevador, rampa, banheiro adaptado
- [ ] Coordenadas do consultório (hoje apontam para o centro de BH, como marcador)
- [ ] Link do Google Maps

> O botão de WhatsApp **não renderiza** enquanto o número não for válido —
> `lib/whatsapp.ts` devolve `null` em vez de gerar um link quebrado.

### 2. Convênios
`BLOQUEIA PUBLICAÇÃO`

Aparece em quatro lugares: `content/faq.ts`, e as páginas de
`desvio-de-septo`, `rinoplastia` e `blefaroplastia`.

- [ ] Quais convênios são atendidos, ou confirmação de que o atendimento é
      particular com recibo para reembolso.
- [ ] Em `blefaroplastia`: como ela conduz a documentação de campo visual
      (necessária quando a indicação é funcional e há cobertura).

### 2b. Dados da política de privacidade — `content/legal.ts`
`BLOQUEIA PUBLICAÇÃO`

Uma política de privacidade que descreve um tratamento de dados diferente do
real é exatamente o que a LGPD pune. Nenhum destes campos pode ser preenchido
por suposição.

- [ ] Razão social, CNPJ e endereço do controlador — pessoa física ou clínica
- [ ] O site usará ferramenta de análise de audiência ou pixel de rede social?
      **Se sim**, a política precisa listar os cookies e o site precisa de
      banner de consentimento. **Se não**, o texto passa a afirmar isso.
- [ ] Nomes dos fornecedores contratados, para citação nominal: hospedagem,
      e-mail transacional, sistema de agendamento
- [ ] Prazo de retenção das mensagens do formulário e rotina de exclusão
- [ ] E-mail para pedidos de titular de dados
- [ ] Nome e contato do encarregado (DPO), art. 41 da LGPD
- [ ] Data da última atualização — da política e do aviso legal
- [ ] E-mail e telefone oficiais no aviso legal

### 3. Revisão jurídica
`BLOQUEIA PUBLICAÇÃO`

- [ ] Submeter o site a advogado especializado em direito médico ou ao setor de
      fiscalização do CRM-MG antes de publicar.

`docs/COMPLIANCE-CFM.md` é orientação de implementação, não parecer jurídico.
Os scripts de verificação reduzem o risco; não o eliminam.

### 4. Domínio — `lib/site.ts`
`BLOQUEIA PUBLICAÇÃO`

- [ ] Domínio definitivo. Hoje: `liviasantanna.com.br`, presumido.
      Alimenta metadata, sitemap, robots, JSON-LD e as OG images.

---

## Degradam o resultado

### 5. Assets originais — `/assets-originais` não existe
`DEGRADA`

O site foi construído com placeholders (bloco areia com o selo a 8% e o texto
`IMAGEM PENDENTE`), conforme briefing § 12.2. Os caminhos e componentes já
apontam para os arquivos finais: trocar é substituir o arquivo.

- [ ] `logo-selo-vinho.png` — e, de preferência, **o SVG**
- [ ] `foto-blazer-preto.jpg` — hero da home
- [ ] `foto-jaleco-vinho.jpg` — seção "A médica"
- [ ] `foto-jaleco-scrubs.jpg` — páginas cirúrgicas e consultório

Tratamento combinado para as três fotos: leve aquecimento, contraste suave, sem
filtro pesado. Não recorte o fundo areia — ele é parte da paleta. No
`foto-jaleco-scrubs.jpg`, desature levemente o azul do scrub, que é a única cor
fora da paleta.

> **Nenhuma foto de banco de imagens entra no repositório, nem provisoriamente.**
> Se vazar para produção, destrói a credibilidade que as fotos reais constroem.

### 6. Curva oficial do logo — `lib/traco.ts`
`DEGRADA`

O Traço usa hoje uma aproximação em Bézier do perfil de rosto do logo.

- [ ] Enviar o SVG do logo para extrair a curva real.

Trocar é editar as três constantes de `TRACO_PATH`. Nenhum componente conhece
a geometria.

### 7. Parágrafo pessoal da médica — `content/medica.ts`
`DEGRADA`

- [ ] Por que escolheu a especialidade, e como conduz a consulta.

É o que separa a página "A médica" de um currículo. Precisa vir dela — não será
escrito por terceiros.

### 8. Antes e depois
`DEGRADA`

O componente `<AntesDepois />` está implementado e testado, mas nenhuma imagem
foi publicada: não há autorização documentada. A home renderiza a seção que
explica a ausência (briefing § 8.8).

Para publicar um caso, a Resolução CFM 2.336/2023 exige, **cumulativamente**:

- [ ] Autorização formal e documentada da paciente (o `autorizacaoId` referencia
      o termo arquivado)
- [ ] Paciente não identificável — sem olhos, sem tatuagem, sem joia, sem marca
- [ ] Imagem sem manipulação — mesma iluminação, mesmo ângulo, mesma distância
      focal, sem filtro, sem retoque
- [ ] Texto educativo junto da imagem: indicação, evoluções satisfatórias e
      insatisfatórias, riscos e complicações
- [ ] Aviso de que resultados variam entre pacientes

O componente **não compila** sem `textoEducativo` e `autorizacaoId`.

### 9. Envio do formulário — Resend
`DEGRADA`

- [ ] `RESEND_API_KEY`, `CONTATO_EMAIL_DESTINO`, `CONTATO_EMAIL_REMETENTE`

Sem a chave, o formulário falha explicitamente em produção. Ele nunca retorna
sucesso falso: um formulário que finge ter enviado é pior do que um quebrado.

### 10. Deploy
`DEGRADA`

- [ ] Deploy na Vercel. Exige a conta autenticada — não foi executado.

### 11. Detalhes clínicos que dependem da prática dela
`DEGRADA`

O conteúdo dos 11 procedimentos foi escrito com clínica geral correta e faixas
de literatura, sempre com ressalva explícita ("as séries publicadas descrevem",
"em torno de") e **nunca atribuídas a ela**. Nenhum número pessoal, taxa de
sucesso, contagem de casos ou tempo de fila foi inventado.

Ainda assim, estes pontos precisam do aval dela — são troca de número ou de
frase, não de estrutura:

- [ ] `sinusite` — há navegação cirúrgica por imagem nos hospitais onde opera, e
      em quais casos ela a indica?
- [ ] `rinoplastia` — realiza com anestesia local e sedação em algum cenário?
- [ ] `rinoplastia` — como conduz a parte funcional e a estética no mesmo tempo
      cirúrgico?
- [ ] `toxina-botulinica` — com quais apresentações trabalha, e qual a política
      de retorno para ajuste de dose?
- [ ] **Faixas percentuais usadas:** revisão em rinoplastia 5–15%; sangramento
      pós-amigdalectomia 2–5%; otorreia com tubo 15–25%; perfuração persistente
      pós-tubo 1–3%; fechamento em timpanoplastia primária 80–90%; ptose
      pós-toxina 1–5%.
- [ ] **Critérios de indicação citados:** Paradise para amigdalite (7/5/3
      episódios), 3 meses de efusão bilateral, 12 semanas para sinusite crônica.
      São consensuais, mas médico ajusta ao próprio julgamento.
- [ ] **Afirmações sobre a rotina dela:** que o tamponamento nasal em bloco de
      gaze "deixou de ser rotina"; a orientação sobre natação com tubo de
      ventilação; e as escolhas técnicas descritas em primeira pessoa
      (preservação de cartilagem, enxerto autólogo, cartilagem em timpanoplastia
      de risco, reposicionamento de gordura em blefaroplastia inferior).

### 12. Compliance: o que nenhum código consegue verificar
`DEGRADA` — mas **crítico** quando as imagens chegarem

Os testes automatizados cobrem tudo que é verificável em software. Estes cinco
itens exigem conferência humana, e dois deles são graves:

- [ ] **Que o paciente não é identificável.** O componente compara a proporção
      das duas fotos e reprova enquadramento divergente, mas nenhum código
      decide se um rosto é reconhecível.
- [ ] **Que a imagem não foi retocada nem refotografada sob outra luz.** O
      guarda de proporção não pega filtro nem retoque.
- [ ] Que o termo de autorização referenciado por `autorizacaoId` **existe em
      papel**. O código verifica que o campo foi preenchido, não que o documento
      existe.
- [ ] Que o `autorizacaoId` **não é dado reidentificante**. Ele é renderizado na
      página. Se alguém preencher com iniciais ou data de nascimento, vira
      identificação da paciente. Nenhum regex distingue um código de arquivo de
      um dado pessoal.
- [ ] Se algum depoimento for publicado no futuro, o texto precisa entrar em
      `content/` para passar por `verify:termos`. Republicar é assumir o texto.

**Nota técnica:** `<AntesDepois />` hoje assume superfície areia. Se for
colocado em seção `data-superficie="vinho"`, a legenda em `ink-900` perde
contraste. Parametrizar antes de usar.

---

## Decisões tomadas por mim, para você revisar

| # | Decisão | Motivo |
|---|---|---|
| 1 | `ink-400` mudou de `#8A7A80` para `#6E6266` | O valor do briefing dá 3.62:1 sobre areia e reprova WCAG AA. Este token carrega os eyebrows em mono 0.75rem. Escurecido 20%, mesmo matiz, 5.19:1. |
| 2 | `wine-300` mudou de `#C08D9E` para `#CF98AB` | 3.96:1 sobre vinho, reprova AA. A nota do § 8.5 usa este token em texto corrido. Clareado 8%, 4.58:1. |
| 3 | Título SEO da home usa "Otorrino", não "Otorrinolaringologia" | O termo completo estourava o limite de 60 caracteres, e "otorrino BH" é a busca real (briefing § 2). |
| 4 | Next.js fixado em 15, não 16 | O briefing § 4 especifica 15. O `create-next-app` hoje entrega 16.3. |
| 5 | Reveal de seção em CSS puro, não framer-motion | Não adiciona JS ao bundle inicial. Motion fica só no menu mobile e no slider de antes/depois. |
| 6 | Switzer sem itálico | Nesta direção o itálico não aparece: fato vai em mono, ênfase vem de superfície. Economiza ~30 kB. |
| 7 | Identificadores de código em português | O briefing § 0.6 pede "inglês no código", mas as § 6 e § 11 especificam nominalmente `lib/traco.ts`, `lib/contraste.ts`, `content/tipos.ts`, `content/medica.ts`, `IdentificacaoCFM`, `AntesDepois`, `FichaTecnica`, `RetratoArco`, `BotaoWhatsApp` — todos em português. Segui as seções específicas, que são o que a entrega será conferida contra. Um híbrido (`content/tipos.ts` exportando `Procedure`) seria pior que qualquer um dos dois. **Se você preferir inglês, diga agora** — converter depois da Fase 3 fica caro. |

---

## Verificado, não pendente

- Contraste AA em 21 pares de cor — `pnpm verify:contraste`
- Termos proibidos pelo CFM — `pnpm verify:termos`
- Preto e branco puros, gradiente, sombra colorida, `outline: none` — `pnpm verify:cores`
- Bodoni abaixo de 1.5rem ou em bold — `pnpm verify:bodoni`
