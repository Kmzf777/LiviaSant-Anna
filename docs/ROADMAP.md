# Roadmap

O que ficou deliberadamente fora da v1, e o que precisa acontecer para entrar.

Isto não é lista de desejos: cada item aqui tem um motivo para ter ficado de
fora, e um gatilho que justifica trazê-lo para dentro.

---

## v1.1 — depois que as fotos chegarem

### Substituir os placeholders
Os componentes já apontam para os caminhos finais. Trocar é substituir o arquivo
em `/public/fotos` e mudar `imagem: { tipo: "pendente" }` para
`{ tipo: "imagem", imagem: {...} }` no conteúdo.

Tratamento combinado: leve aquecimento, contraste suave, sem filtro pesado. Não
recorte o fundo areia — ele é parte da paleta.

### Curva oficial do Traço
Trocar as três constantes de `TRACO_PATH` em `lib/traco.ts` pela geometria
extraída do SVG do logo. Nenhum componente conhece a curva, então é uma edição
isolada.

---

## v1.2 — antes e depois

O componente `<AntesDepois />` está pronto, testado e é seguro por construção:
não compila sem `textoEducativo` e `autorizacaoId`.

**Gatilho:** existir pelo menos um caso com as cinco condições da Resolução CFM
2.336/2023 cumpridas (ver `PENDENCIAS.md` § 8). Sem as cinco, não publique.

Quando houver, considere também:
- Um índice de autorizações fora do repositório, com o `autorizacaoId` apontando
  para o termo arquivado
- Revisão jurídica específica dessa seção, separada da revisão geral

---

## v2 — CMS

**Por que não agora:** ela precisa que o site funcione, não que seja editável por
ela hoje. Um CMS na v1 acrescentaria custo, uma conta a administrar e uma
superfície de erro sem resolver problema nenhum.

**Gatilho:** ela querer editar texto sem depender de desenvolvedor — na prática,
quando a frequência de mudança passar de algumas vezes por ano.

**Como migrar:** `/content` foi estruturado para isso. Páginas nunca importam os
arrays direto; todo acesso passa por `content/index.ts`. Migrar é reimplementar
aquelas funções como `async` e ajustar as chamadas para `await`.

O que exige atenção na migração:
- As cardinalidades mínimas (`MinTres`, `MinCinco`) são garantias de compilação
  que um CMS não tem. Elas viram validação de schema no Sanity, **e** validação
  em runtime na camada de fetch — não largue a garantia no caminho.
- `scripts/verificar-termos.ts` varre arquivos `.ts`. Com CMS, ele precisa rodar
  contra o conteúdo publicado, provavelmente em webhook de publicação.

---

## v2 — blog

**Por que não agora:** um blog médico mal alimentado é pior do que blog nenhum —
o último post de dois anos atrás diz mais sobre o consultório do que qualquer
texto. E cada post é publicidade médica sujeita às mesmas regras do CFM.

**Gatilho:** compromisso real de cadência, e alguém responsável por escrever.

Rota prevista: `/blog` e `/blog/[slug]`. O template de conteúdo pode reaproveitar
`PaginaInstitucional` com data e autoria. O `verify:termos` já cobriria os posts
se eles forem arquivos `.ts`; se vierem de CMS, ver o item acima.

---

## Infraestrutura

### Rate limit distribuído
Hoje o rate limit do formulário é em memória, por IP. Funciona em uma instância;
na Vercel, com várias instâncias serverless, cada uma tem seu contador. É
proteção contra abuso casual, não contra ataque coordenado.

**Gatilho:** primeiro sinal de spam real no formulário.
**Como:** Vercel KV ou Upstash Redis, mesma interface em `lib/rate-limit.ts`.

### Preço de consulta
O CFM permite divulgar preço de consulta (não de procedimento cirúrgico). Ficou
desligado por padrão porque é decisão dela, não técnica.

**Como ligar:** campo opcional em `content/consultorio.ts` e uma linha no
componente de consultório. Não crie tabela de preços de cirurgia — isso é
proibido.

### Depoimentos
Permitido repostar elogios, mas evite depoimento que descreva resultado como
garantido. Prefira depoimentos sobre atendimento e acolhimento, não sobre
resultado estético.

**Se entrar:** nada de carrossel com estrelinhas (briefing § 15). Formato
editorial, citação em display, atribuição em mono — reaproveitando `<Citacao />`.

---

## Não faça

Itens que parecem melhorias e não são, para este site:

- **Contador animado** de pacientes, anos de experiência ou procedimentos.
  Briefing § 15, e beira o superlativo proibido pelo CFM.
- **Chat/bot de captação.** O site converte em consulta agendada, não em lead
  frio. Um bot no meio dilui a voz que o texto inteiro constrói.
- **Segundo elemento de assinatura.** O Traço é o único. Se algo mais gritar,
  remova — briefing § 15.
- **Antes e depois gerado ou editado por IA.** Viola diretamente a Resolução CFM
  2.336/2023 e é motivo de processo ético.
- **Foto de banco de imagens**, nem provisoriamente. Se vazar para produção,
  destrói a credibilidade que as fotos reais constroem.
