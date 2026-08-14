# PLANO — Home como landing page

**Status:** aprovado (briefing do cliente, 14/08/2026)

A home vira uma landing page de conversão com **quatro seções**, na ordem em que
a pessoa decide: reconhece o problema → confia em quem resolve → vê onde ela
opera → encontra o próprio procedimento → agenda.

---

## O que mudou, e por quê

O hero atual — *"Forma e função, nas mesmas mãos"* — é bonito e **falha no teste
que o próprio briefing definiu**. A § 2 diz que a métrica de sucesso é *"um
paciente que chega pela busca de 'amígdala' e um que chega por 'rinoplastia'
precisam, em 5 segundos, saber que estão no lugar certo"*. A frase não diz que
problema ela resolve.

A tese "forma e função" não some — desce para a página de rinoplastia, onde é
argumento comercial de verdade. Na home ela vira o que a pessoa procurava.

---

## As quatro seções

### 1. Chamada — superfície vinho

Retrato de blazer preto, `priority` (é o LCP).

> **Cuidado especializado em nariz, ouvido e garganta para você viver melhor.**

Eyebrow: `OTORRINOLARINGOLOGIA · CIRURGIA DA FACE · BELO HORIZONTE E UBERLÂNDIA`
CTA: `Agende sua consulta`

### 2. A médica e a formação — superfície areia

Retrato de jaleco branco. Nome, especialidade, `IdentificacaoCFM`.

| | |
|---|---|
| Graduação | Universidade Federal de Viçosa |
| Residência | Otorrinolaringologia · Hospital Madre Teresa |
| Fellowship | Cirurgia plástica da face · Hospital UMC · Uberlândia |

### 3. Experiência hospitalar — superfície areia-100

Onde ela atuou e onde atua:

- **Mater Dei** — Belo Horizonte
- **Hospital Vila da Serra** — Belo Horizonte
- **Hospital Madre Teresa** — Belo Horizonte
- **Uberlândia Medical Center (UMC)** — Uberlândia — *atuação cirúrgica atual*

Acompanhada das fotos de ambiente hospitalar aprovadas (ver curadoria abaixo).

### 4. Procedimentos e atendimentos — superfície areia + CTA vinho

Duas colunas: **cirurgias que realiza** e **o que trata em consulta**, agrupado
por nariz, ouvido e garganta. Cada item liga para a página do procedimento.

Fecho: `Agende sua consulta` (WhatsApp).

> Entre a seção 3 e a 4 fica o respiro do Traço — faixa sem texto onde a
> assinatura resolve no perfil de rosto. Não é seção de conteúdo; é o palco da
> assinatura, e sem ele o rosto se desenha por cima da leitura.

---

## Curadoria de mídia — decidida arquivo a arquivo

Os 13 arquivos entregues foram abertos e avaliados um a um.

### Aprovados

| Arquivo | O que é | Onde |
|---|---|---|
| `Livia-Jaleco-preto` | Retrato, blazer preto | § 1, hero |
| `Livia-Jaleco-Branco` | Retrato, jaleco e blusa vinho | § 2 |
| `14.00.10` | Equipe no corredor cirúrgico, marca Madre Teresa | § 3 |
| `14.00.07 (3)` | Dois médicos, bastidor, Madre Teresa | § 3 |
| `14.00.09 (1)` | Centro cirúrgico, torre de endoscopia, paciente coberto | § 3 |
| `14.00.08 (2)` | Centro cirúrgico, microscópio, paciente coberto | § 3 |
| `14.00.07 (2)` | Cirurgiã em close, lupas — melhor composição do conjunto | § 3 |
| `vid2` (14.00.10 (1)) | Vídeo, cirurgiã trabalhando | § 3, sob clique |

### Barrados, com o motivo

| Arquivo | Por que não |
|---|---|
| `14.00.08 (4)` | **Paciente plenamente identificável**, posando com frasco de material biológico. Violação direta da Resolução CFM 2.336/2023. Autorização não resolveria: soma paciente reconhecível a exibição de espécime. |
| `14.00.09` | Equipe posando com paciente anestesiada no enquadramento. |
| `14.00.08 (3)` | Equipe posando com campo cirúrgico ativo e instrumental em tecido. |
| `14.00.07 (1)` | Campo cirúrgico aberto, afastadores, sangue. Sensacionalismo. |
| `14.00.07` | Campo com sangue no canto. Evitável — há alternativas melhores. |
| `vid1` (14.00.10) | Monitor endoscópico com anatomia interna. |
| `14.00.08 (1)` | Selfie casual. Sem problema legal; fora do padrão editorial. |

**Regra que orientou o corte:** a Resolução CFM 2.336/2023 veda sensacionalismo
e exige que o paciente não seja identificável. Fotos do ambiente e do trabalho
são permitidas e valiosas; fotos do procedimento em si, com campo aberto ou
paciente posando, são o que os CRMs vêm punindo.

### Regras de aplicação

- Nenhuma legenda afirma qual profissional é a Dra. Lívia. **Não é possível
  determinar isso com segurança nas fotos com máscara e touca**, e legendar
  errado num site médico é erro grave. O `alt` descreve a cena, que é verdadeira
  de qualquer forma.
- O vídeo entra **sob clique**, com pôster estático, `preload="none"`, fora do
  caminho do LCP. Não é vídeo de fundo: o briefing § 15 proíbe um segundo
  elemento disputando o papel de assinatura com o Traço.
- Os arquivos aprovados são renomeados para nomes descritivos. Os barrados saem
  de `/public`, para não haver como referenciá-los por engano.

---

## Uberlândia

Informação nova: **atuação cirúrgica atual no Uberlândia Medical Center**.
Propaga para o eyebrow do hero, a seção 3, a metadata, o `MedicalBusiness` do
JSON-LD e a página de consultório.

`[CONFIRMAR]`: endereço de atendimento em Uberlândia, dias, e se há consulta
ambulatorial na cidade ou apenas cirurgia.

---

## O que sai da home

Manifesto, as duas frentes, rinoplastia em destaque, resultados e FAQ deixam a
home. Nada é apagado: o conteúdo continua vivo nas páginas de procedimento e nos
hubs, que é onde ele converte melhor. A home passa a ter uma função só.

---

## Execução

Eu escrevo o conteúdo (`content/**`), porque é o contrato de que as duas frentes
paralelas dependem. Depois, dois subagents com a skill `frontend-design`:

| # | Subagent | Escreve em |
|---|---|---|
| **A** | As quatro seções e a página | `components/sections/home/**`, `app/page.tsx` |
| **B** | Mídia: curadoria dos arquivos, galeria hospitalar, vídeo sob clique | `public/fotos/**`, `components/ui/Galeria.tsx`, `components/ui/VideoSobClique.tsx` |

Contrato entre as duas, fixado antes: `<Galeria itens={...} />` e
`<VideoSobClique src poster legenda />`.
