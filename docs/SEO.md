# SEO

Este documento registra as decisões de busca do site: que consulta cada rota
persegue, como as páginas se ligam entre si, o que o dado estruturado entrega,
por que os rastreadores de IA estão liberados, o que medir e o que ainda trava.

Não é um manual de otimização. É o registro de por que o site está assim, para
que a próxima pessoa não desfaça uma decisão sem saber que existia.

---

## 0. A premissa

**A home não é o ativo de SEO deste site. As páginas internas são.**

Quem digita "otorrino BH" está escolhendo entre dezenas de resultados e ainda
não decidiu nada. Quem digita "quanto tempo dura a recuperação da rinoplastia"
já decidiu quase tudo, e só falta escolher com quem. A segunda pessoa vale mais
e é mais barata de alcançar — a concorrência por cauda longa clínica é
pequena, e a resposta honesta a essa pergunta já está escrita em
`content/procedimentos/`.

Daí a arquitetura: uma home curta, três hubs e onze páginas de procedimento com
texto de verdade. O briefing § 7 chama isso de "as internas são o ativo"; o
PLANO-CONVERSAO-SEO.md repete que as 20 rotas ficam e recebem mais conteúdo,
não menos.

O corolário incômodo: **a seção "Riscos e limites" é a peça de SEO mais
valiosa de cada página**, não o rodapé jurídico dela. É o texto que ninguém
mais escreve, é o que responde à pergunta que a pessoa não faz em voz alta, e é
o que a Resolução CFM 2.336/2023 exige de qualquer jeito. Interesse comercial e
obrigação ética apontando para o mesmo lado é uma sorte que este projeto tem e
que convém não desperdiçar.

---

## 1. Título: uma fonte, um sufixo

O nome dela aparece **uma vez** no código, no `title.template` de
`app/layout.tsx`:

```
%s | Dra. Lívia Sant'Anna
```

`seo.titulo`, em `content/`, declara só a parte distintiva — "Rinoplastia em
Belo Horizonte", não "Rinoplastia em Belo Horizonte | Lívia Sant'Anna". Antes
eram quinze arquivos repetindo o sufixo, e por isso toda página precisava de
`title: { absolute: … }` para o template não duplicá-lo. Acrescentar o "Dra."
teria sido quinze edições, e a décima sexta página nasceria sem ele.

**Aritmética do orçamento.** O sufixo custa 23 caracteres. O Google trunca por
volta de 60. Logo a base cabe em **37**. Um único título estourava —
"Otorrinolaringologia em Belo Horizonte", 38 — e virou "Otorrinolaringologia em
BH", coerente com a decisão já registrada em PENDENCIAS.md de que "otorrino BH"
é a busca real. `/dra-livia-santanna` seguiu o mesmo caminho.

`tests/unit/seo.spec.ts` mede o título final de toda rota de `listarRotas()` e
reprova qualquer `seo.titulo` que traga o nome dela de volta.

### Sobre o "Dra."

Ele entra **apenas** em título de página, OpenGraph e JSON-LD. Nunca no bloco
`IdentificacaoCFM`, nunca em `MEDICA.identificacao.nome`. A norma trata da
uniformidade tipográfica **dentro** do bloco de identificação — um campo de
metadata não é aquele bloco. `SITE.nome` e `SITE.nomeSeo` existem separados
para que essa distinção sobreviva a refatorações;
`tests/unit/conteudo.spec.ts` reprova o título dentro do bloco.

### Descrição

Faixa de trabalho: **120 a 165 caracteres**. Acima disso o Google corta; abaixo
de 120 ele tende a descartar a descrição e escrever a própria a partir do corpo
da página, que é o texto sobre o qual ninguém tem controle. `content/tipos.ts`
impõe um teto mais apertado, 155, para deixar folga.

Toda descrição é única. Descrição repetida em duas rotas é o sinal clássico de
página de baixo valor, e o teste reprova.

---

## 2. Mapa palavra-chave → URL

Uma consulta principal por rota. Duas rotas competindo pela mesma consulta é
canibalização: o Google escolhe uma, quase sempre a errada, e as duas perdem
força.

| Rota | Consulta principal | Intenção |
|---|---|---|
| `/` | otorrino BH, otorrinolaringologista Belo Horizonte | Navegacional e comercial ampla — quem procura um profissional, sem procedimento em mente |
| `/dra-livia-santanna` | lívia sant'anna otorrino, dra lívia sant'anna | Navegacional por nome — quem foi indicado e está conferindo quem é |
| `/consulta` | como é a consulta com otorrino, primeira consulta otorrino | Informacional pré-agendamento — reduz o atrito de quem já quase marcou |
| `/consultorio` | consultório otorrino Belo Horizonte, onde atende | Local — endereço, horário, estacionamento. **Bloqueada por pendência**, ver § 8 |
| `/contato` | agendar consulta otorrino BH | Transacional — o fim do funil |
| `/otorrinolaringologia` | otorrinolaringologia BH, nariz ouvido garganta | Comercial de categoria — quem tem sintoma e ainda não sabe o nome do tratamento |
| `/otorrinolaringologia/desvio-de-septo` | cirurgia de desvio de septo, septoplastia BH | Comercial específica — já sabe o diagnóstico e avalia operar |
| `/otorrinolaringologia/amigdalas-e-adenoides` | cirurgia de amígdala, adenoide criança | Comercial específica, audiência majoritariamente materna |
| `/otorrinolaringologia/sinusite` | sinusite crônica cirurgia, cirurgia endoscópica de seios | Informacional que vira comercial: metade da consulta é "preciso operar?" |
| `/otorrinolaringologia/tubo-de-ventilacao` | tubo de ventilação ouvido, otite de repetição criança | Comercial pediátrica |
| `/otorrinolaringologia/timpanoplastia` | timpanoplastia, cirurgia de tímpano perfurado | Comercial específica, volume baixo e concorrência baixa |
| `/cirurgia-da-face` | cirurgia da face BH, cirurgia plástica facial Belo Horizonte | Comercial de categoria — e a página que responde por que uma otorrino opera a face |
| `/cirurgia-da-face/rinoplastia` | rinoplastia BH, rinoplastia Belo Horizonte preço/recuperação | Comercial de alto valor. Carro-chefe (§ 7), a rota mais disputada do site |
| `/cirurgia-da-face/otoplastia` | otoplastia, cirurgia de orelha de abano | Comercial, com pico pediátrico em férias escolares |
| `/cirurgia-da-face/blefaroplastia` | blefaroplastia BH, cirurgia de pálpebra | Comercial de alto valor, público 45+ |
| `/cirurgia-da-face/cantopexia` | cantopexia, cantoplastia | Comercial de nicho, volume baixo e intenção muito alta |
| `/cirurgia-da-face/frontoplastia` | frontoplastia, lifting de sobrancelha | Comercial de nicho |
| `/estetica-facial` | estética facial BH, procedimento sem cirurgia | Comercial de categoria |
| `/estetica-facial/toxina-botulinica` | toxina botulínica BH, aplicação de botox Belo Horizonte | Comercial de repetição — é o procedimento que traz a mesma pessoa de volta |
| `/politica-de-privacidade` | — | Nenhuma. Existe por obrigação legal e por confiança |
| `/aviso-legal` | — | Nenhuma. Existe por obrigação da Resolução CFM e por confiança |

**As duas últimas não perseguem consulta nenhuma, e isso é deliberado.** Elas
existem porque um site médico sem elas é um site em que não se confia — e
porque o Google lê a presença delas como sinal de legitimidade do domínio.

**A cauda longa não mora no título; mora no corpo.** "Quanto tempo dura o
inchaço da rinoplastia", "posso molhar o ouvido com tubo de ventilação", "a
cirurgia de amígdala dói" — nenhuma dessas tem página própria e nenhuma
deveria ter. Elas são respondidas na FAQ e na seção de recuperação da página do
procedimento, que é onde o `FAQPage` as entrega ao Google já estruturadas.

---

## 3. Arquitetura de links internos

Três níveis, e nenhum órfão:

```
/  ──►  /{hub}  ──►  /{hub}/{procedimento}
│                          │
│                          └──►  procedimentos relacionados (mesmo nível)
└──►  /dra-livia-santanna, /consulta, /consultorio, /contato
```

As regras que sustentam isso:

- **Nenhum href é escrito à mão em componente.** A navegação sai de
  `content/nav.ts`; as listas de procedimento saem de `listarProcedimentos()`;
  os relacionados saem de `relacionados`, e `conteudo.spec.ts` reprova um slug
  que aponte para o vazio. Um procedimento novo entra na navegação, no hub, no
  sitemap, no `llms.txt` e nos testes sem ninguém editar código.
- **O rodapé é o único lugar onde a árvore inteira aparece de uma vez.** É o
  que dá a toda página interna um caminho de dois cliques para qualquer outra.
- **Links laterais entre procedimentos existem e são curados**, não
  automáticos por categoria. Quem lê sobre desvio de septo tem chance real de
  precisar de rinoplastia funcional; quem lê sobre cantopexia raramente quer
  amígdala. A curadoria é o que separa link interno útil de bloco de "veja
  também".
- **Nenhum CTA tira a pessoa do funil.** Todo fecho de seção aponta para
  `/contato` ou para `/consulta`.

O que **não** existe, de propósito: blog, tags, paginação e categorias
cruzadas. Cada um deles multiplica URLs de baixo valor e dilui a autoridade
entre páginas que ninguém mantém. Vinte e uma rotas bem escritas superam
duzentas rasas — e vinte e uma é o número que uma médica consegue revisar.

---

## 4. Dado estruturado: o que cada tipo entrega

Tudo vive em `lib/jsonld.ts`, em helpers puros. Cada página monta o próprio
grafo com `grafoJsonLd(...)` — um `<script>` por página, com todos os tipos
dentro do mesmo `@graph`, que é o formato em que os `@id` se resolvem entre
blocos e o único que o Rich Results Test lê sem reclamar.

| Tipo | Onde | O que entrega |
|---|---|---|
| `Physician` | `/` e `/dra-livia-santanna` | A entidade profissional: nome com "Dra.", CRM e RQE como `identifier`, especialidade, cidade atendida, formação. É a base do Knowledge Panel e o que casa a busca por nome com o site |
| `MedicalBusiness` | `/` e `/consultorio` | O local. **Devolve `null` hoje** — ver § 8 |
| `MedicalProcedure` | 11 páginas de procedimento | Nome, descrição, `howPerformed` e `preparation`. É o que habilita o resultado enriquecido de procedimento e o que um assistente cita ao explicar a cirurgia |
| `FAQPage` | 11 páginas de procedimento | As perguntas confirmadas. Historicamente rendia o acordeão na SERP; hoje rende sobretudo presença em resposta gerada, que é onde a FAQ passou a valer mais |
| `BreadcrumbList` | hubs, procedimentos e institucionais | A trilha, que substitui a URL crua no resultado de busca e comunica hierarquia |

Três invariantes que não podem ser afrouxadas:

1. **`medicalSpecialty` é `Otolaryngologic`, e só.** Declarar `PlasticSurgery`
   afirmaria em dado legível por máquina uma especialidade que o RQE dela não
   registra. É exercício irregular perante o CFM, e em JSON-LD o erro se
   espalha para agregadores fora do alcance de quem o cometeu.
2. **Placeholder nunca vira dado estruturado.** Campo pendente é omitido;
   quando o que sobra não sustenta o bloco, o bloco inteiro devolve `null` e a
   página não o emite. `grafoJsonLd` descarta nulos para que esse seja o
   caminho fácil.
3. **O que o paciente lê e o que o Google lê são a mesma coisa.** Nenhum bloco
   declara pergunta, resposta ou etapa que não esteja renderizada na página.
   `FAQPage` com pergunta invisível é violação de diretriz e motivo de ação
   manual.

---

## 5. Rastreadores de IA e o papel do llms.txt

**Todos liberados**, com grupo explícito por agente em `app/robots.ts`.
Aprovado pelo dono do site.

A decisão não é sobre treinamento de modelo — é sobre onde a próxima paciente
procura um médico. Quem pergunta "quem faz rinoplastia em Belo Horizonte" a um
assistente recebe três ou quatro nomes e nenhuma segunda página de resultados.
Bloquear esses agentes tira o site dessa lista e não devolve nada: o conteúdo
aqui é público, informativo e escrito para ser citado. Não há dado de paciente
no domínio, não há área logada, e o único diretório fechado é `/_dev/`.

Os grupos são declarados um a um em vez de confiar no `User-agent: *` porque
vários desses agentes leem a própria linha antes da genérica, e porque
auditoria de terceiro reporta "não declarado" quando não acha o nome. A lista
está no arquivo, comentada, e `tests/unit/seo.spec.ts` reprova a remoção
silenciosa de qualquer um deles.

### llms.txt e llms-full.txt

Duas rotas geradas, não arquivos em `public/`:

- **`/llms.txt`** — o índice, na forma de llmstxt.org: quem ela é, CRM, RQE,
  cidades, os três hubs, os onze procedimentos com descrição, as páginas
  institucionais e os avisos do rodapé. Cerca de 5 kB.
- **`/llms-full.txt`** — o corpo: o texto integral dos onze procedimentos, com
  indicações, técnica, ficha técnica, recuperação, riscos e FAQ. Cerca de
  100 kB.

A separação é a da própria especificação e existe por economia de contexto: um
agente que só precisa saber o que existe lê 5 kB; quem precisa do texto de
risco da rinoplastia busca o outro.

**Por que rota, e não arquivo estático.** O domínio ainda é presumido e é
resolvido em tempo de execução por `SITE.url` — um arquivo escrito à mão traria
links absolutos errados em preview e em qualquer ambiente que não fosse aquele
onde ele foi escrito. E um `public/llms.txt` seria o único lugar do site que
continuaria com onze procedimentos depois do décimo segundo, sem nada quebrar
para avisar. `app/sitemap.ts` resolve o mesmo problema do mesmo jeito.

Nenhum marcador `[CONFIRMAR]` pode vazar para esses arquivos: um agente que lê
"[CONFIRMAR: telefone do consultório]" o repete como se fosse informação. Os
dois passam pelos helpers de `lib/pendencias.ts` e são medidos em teste.

---

## 6. O que medir, e com que frequência

Nada disso existe ainda — nenhuma ferramenta de análise está instalada, e a
decisão sobre instalar é dela e tem consequência de LGPD (ver
`content/legal.ts`). Esta seção é o que fazer quando existir.

| Frequência | O que olhar | Por quê |
|---|---|---|
| Semanal, no primeiro mês | Cobertura de indexação no Search Console | Página nova que não indexa em duas semanas tem problema estrutural, não de conteúdo |
| Mensal | Impressões e cliques por página, com CTR | Impressão alta e CTR baixo é problema de título ou descrição, e conserta em uma linha |
| Mensal | Posição média das cinco consultas comerciais principais | Rinoplastia, blefaroplastia, desvio de septo, amígdalas, toxina |
| Mensal | Core Web Vitals de campo (LCP, INP, CLS) | O site é estático e leve; uma regressão aqui é sempre uma mudança recente e localizada |
| Mensal | Origem dos contatos do formulário, por assunto | É a única métrica que fecha o ciclo. `?assunto=` já identifica a página de origem |
| Trimestral | Erros do Rich Results Test em uma rota de cada tipo | Vocabulário do schema.org muda e o Google deprecia formatos sem avisar |
| Trimestral | Consulta a um assistente de IA pelas cinco consultas principais | É a nova primeira página, e não há painel que a meça |
| Semestral | Auditoria de conteúdo: o que envelheceu, o que ficou raso | Texto médico envelhece por mudança de conduta, não por data |

Sobre CTR: em site médico ele é enganoso. Uma pessoa que lê a descrição, decide
que o procedimento não é para ela e não clica é um bom resultado — o clique que
importa é o que termina em contato, não o que termina em visita.

---

## 7. Checklist recorrente

**A cada página nova ou texto reescrito**

- [ ] `seo.titulo` sem o nome dela e com no máximo 37 caracteres
- [ ] `seo.descricao` entre 120 e 165, e diferente de toda outra
- [ ] Uma consulta principal, que ainda não é a de nenhuma outra rota
- [ ] Um `h1` só, sem salto de nível
- [ ] Links internos: sai para o hub, entra do hub, e os relacionados fazem
      sentido clínico
- [ ] Nenhum `[CONFIRMAR]` no que vai ser publicado
- [ ] `pnpm check` verde

**A cada deploy**

- [ ] `pnpm verify:html` — o gate que pega marcador vazado no HTML construído
- [ ] `/sitemap.xml`, `/robots.txt`, `/llms.txt` e `/llms-full.txt` respondendo
      com o domínio certo
- [ ] Canonical de três rotas conferido a olho

**Trimestral**

- [ ] Rich Results Test em uma rota de cada tipo
- [ ] Lista de rastreadores de IA revista — a indústria cria agentes novos
- [ ] Links externos do aviso legal e da política ainda vivos

---

## 8. As pendências que travam o SEO local

Esta seção não é decorativa. **O trabalho técnico deste documento está feito; o
que falta é dado que só ela tem.**

### Endereço e telefone — `BLOQUEIA`

`content/consultorio.ts` está com logradouro, bairro, CEP, telefone, e-mail e
horários em `[CONFIRMAR]`, e as coordenadas apontam para o centro de Belo
Horizonte como marcador. A consequência em cadeia:

1. `medicalBusinessJsonLd()` devolve `null`. O site **não tem** um
   `MedicalBusiness` — não há endereço, não há horário, não há telefone em dado
   estruturado. Para busca local, é a diferença entre existir e não existir.
2. **O Google Business Profile é inviável.** Ele exige endereço verificável, e
   é o principal fator de posição no pacote de mapas. Nenhum trabalho on-page
   compensa a ausência dele para a consulta "otorrino perto de mim".
3. **Não há NAP para citação.** Nome, endereço e telefone consistentes entre
   site, GBP e diretórios médicos são o alicerce do SEO local, e aqui faltam
   dois dos três.
4. `/consultorio` persegue uma consulta local sem poder responder à pergunta
   local.

É o item de maior impacto do documento e o mais barato de resolver.

### WhatsApp — `BLOQUEIA` conversão, não posição

`lib/whatsapp.ts` recusa placeholder e devolve `null`, então o botão não
renderiza. Não muda ranking; muda o que acontece depois do clique.

### Uberlândia — atende ou só opera?

A home, a metadata e o `llms.txt` anunciam Belo Horizonte e Uberlândia, com o
Uberlândia Medical Center listado como atuação cirúrgica atual. Se não houver
consulta ambulatorial ali, o site está perseguindo uma consulta local que não
pode atender — e o pior contato possível é o de quem se desloca e descobre que
precisava ir a BH. Ver PENDENCIAS.md § 2a.

### Domínio

`SITE.url` cai em `https://liviasantanna.com.br` por padrão, presumido. Todo
canonical, todo `@id` de JSON-LD e todo link absoluto do `llms.txt` derivam
dele. Confirmar antes de submeter qualquer coisa ao Search Console: canonical
apontando para domínio errado é o tipo de estrago que demora meses a aparecer e
outros tantos a desfazer.

### Imagens de resultado

Não há nenhuma autorizada, e a Resolução CFM 2.336/2023 impõe cinco condições
cumulativas (docs/COMPLIANCE-CFM.md § 3). Enquanto não houver, `/rinoplastia`
compete sem o ativo visual que a concorrência usa. A resposta do site é
converter a ausência em sinal de seriedade — é a única opção legal, e é
defensável.

---

## 9. O que este site não faz, e por quê

- **Sem blog.** Exige cadência que ninguém garantiu. Blog abandonado em 2026
  visível em 2029 é pior do que blog nenhum.
- **Sem página por bairro.** "Otorrino no Belvedere", "otorrino em Lourdes" é
  doorway page, viola diretriz do Google e rende ação manual.
- **Sem preço de procedimento cirúrgico.** Vedado pela Resolução CFM
  2.336/2023, mesmo sendo a consulta mais frequente da categoria.
- **Sem depoimento, sem estrela, sem contador de satisfação.** O briefing § 15
  veta o padrão visual e a norma veta o conteúdo.
- **Sem AMP, sem pop-up de saída, sem chat automático.** Nenhum dos três
  melhora posição, e os dois últimos degradam a experiência que o resto do site
  foi desenhado para ter.
