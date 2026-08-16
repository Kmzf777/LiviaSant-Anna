import {
  getMedica,
  listarHospitais,
  listarHubs,
  listarProcedimentos,
  type Hub,
  type Procedimento,
} from "@/content";
import { AVISOS_RODAPE } from "@/content/nav";
import { ehPendente } from "@/lib/pendencias";
import { SITE, urlAbsoluta } from "@/lib/site";

/**
 * /llms.txt — o índice do site para agentes de IA.
 *
 * Segue a especificação de llmstxt.org: um `#` com o título, um blockquote de
 * resumo, um trecho livre de contexto e depois seções `##` com listas de
 * `- [nome](url): descrição`. O formato é markdown de propósito — é o que o
 * modelo lê melhor e o que uma pessoa consegue conferir a olho.
 *
 * ## Por que é rota gerada, e não um arquivo em /public
 *
 * Duas razões, e as duas já custaram caro em outros lugares deste repositório.
 *
 * A primeira é o domínio. `SITE.url` é resolvido em tempo de execução a partir
 * do ambiente — o domínio de produção ainda é presumido (PENDENCIAS.md) e, em
 * preview na Vercel, cada deploy tem endereço próprio. Um arquivo estático
 * traria links absolutos apontando para o domínio errado em todo ambiente que
 * não fosse aquele em que ele foi escrito à mão.
 *
 * A segunda é a desatualização silenciosa. Um procedimento novo em `content/`
 * vira rota, entra no sitemap e ganha cobertura de teste sozinho. Um
 * `public/llms.txt` seria o único lugar do site que continuaria com onze
 * procedimentos depois do décimo segundo — e ninguém percebe, porque nada
 * quebra. `app/sitemap.ts` resolve o mesmo problema do mesmo jeito.
 *
 * ## Marcador de pendência
 *
 * Vale aqui a regra de `lib/jsonld.ts`: texto pendente é omitido, nunca
 * publicado. Um agente que lê "[CONFIRMAR: telefone do consultório]" o repete
 * como se fosse informação. `tests/unit/seo.spec.ts` mede o arquivo inteiro.
 */

/** Entra no build estático, como o sitemap e o robots. */
export const dynamic = "force-static";

type Item = {
  readonly nome: string;
  readonly href: string;
  readonly descricao: string;
};

/**
 * Uma linha de lista da especificação.
 *
 * A descrição é opcional no formato, então uma descrição pendente vira uma
 * linha sem descrição — em vez de uma linha com marcador, ou de nenhuma linha.
 * A URL continua útil para o agente mesmo sem o resumo.
 */
function linha({ nome, href, descricao }: Item): string {
  const url = urlAbsoluta(href);
  return ehPendente(descricao)
    ? `- [${nome}](${url})`
    : `- [${nome}](${url}): ${descricao}`;
}

function secaoDeHub(hub: Hub, procedimentos: readonly Procedimento[]): string {
  const itens = [
    linha({
      nome: hub.nome,
      href: `/${hub.slug}`,
      descricao: hub.seo.descricao,
    }),
    ...procedimentos.map((procedimento) =>
      linha({
        nome: procedimento.nome,
        href: `/${procedimento.hub}/${procedimento.slug}`,
        descricao: procedimento.seo.descricao,
      }),
    ),
  ];

  return [`## ${hub.nome}`, "", ...itens].join("\n");
}

/**
 * As páginas institucionais.
 *
 * A descrição é escrita aqui e não sai de `seo.descricao`: o que interessa a um
 * agente é o que a página resolve para quem pergunta, e isso nem sempre é a
 * mesma frase que convence alguém a clicar num resultado de busca.
 */
const INSTITUCIONAL: readonly Item[] = [
  {
    nome: "A médica",
    href: "/dra-livia-santanna",
    descricao: "Formação, trajetória e onde ela opera hoje.",
  },
  {
    nome: "A consulta",
    href: "/consulta",
    descricao:
      "Como a consulta funciona, em quatro etapas: conversa, exame, planejamento e decisão.",
  },
  {
    nome: "Consultório",
    href: "/consultorio",
    descricao:
      "Onde ela atende em Belo Horizonte, com horários, estacionamento e acessibilidade.",
  },
  {
    nome: "Contato",
    href: "/contato",
    descricao:
      "Formulário para escrever ao consultório e pedir um horário de consulta.",
  },
  {
    nome: "Política de privacidade",
    href: "/politica-de-privacidade",
    descricao:
      "Quais dados o site coleta, com que base legal e como exercer os direitos da LGPD.",
  },
  {
    nome: "Aviso legal",
    href: "/aviso-legal",
    descricao:
      "Natureza informativa do conteúdo e as regras de publicidade médica da Resolução CFM 2.336/2023.",
  },
  {
    nome: "Texto integral dos procedimentos",
    href: "/llms-full.txt",
    descricao:
      "O conteúdo completo das onze páginas de procedimento em um único arquivo.",
  },
];

function montar(): string {
  const medica = getMedica();
  const { identificacao } = medica;

  const hubs = listarHubs().map((hub) =>
    secaoDeHub(hub, listarProcedimentos(hub.slug)),
  );

  // Só formação de verdade. Os itens de vínculo de trabalho descem para a
  // lista de hospitais, que é onde eles significam o que significam — sob
  // "Formação", "Cirurgias: Hospital Mater Dei" lê como escolaridade. Ver
  // `ItemFormacao` em content/tipos.ts.
  const formacao = medica.formacao
    .filter((item) => item.academico)
    .map((item) => `- ${item.rotulo}: ${item.descricao}`);

  const hospitaisTodos = listarHospitais();

  // As cidades saem dos hospitais em que ela opera hoje, não de uma lista
  // escrita à mão: "atende em BH e Uberlândia" é a informação que decide se
  // um agente cita este site para quem pergunta por uma das duas.
  const cidades = [
    ...new Set(
      hospitaisTodos
        .filter((hospital) => hospital.atual)
        .map((hospital) => hospital.cidade),
    ),
  ];

  /*
    Os quatro, e não só os dois correntes.

    Filtrar por `atual` deixava Vila da Serra e Madre Teresa de fora — os dois
    que respondem "onde ela se formou e com quem ela operou", que é metade da
    pergunta que alguém faz a um assistente antes de escolher um médico. O
    marcador distingue o que é hoje do que é histórico, sem esconder o
    histórico. `listarHospitais()` já devolve os correntes primeiro.
  */
  const hospitais = hospitaisTodos.map(
    (hospital) =>
      `- ${hospital.nome}, ${hospital.cidade} — ${hospital.vinculo}` +
      (hospital.atual ? " (atuação atual)" : ""),
  );

  return [
    // O H1 carrega a especialidade e a cidade: é a linha que um agente cita
    // ao responder "quem faz isso em Belo Horizonte", e o nome sozinho não
    // responde a pergunta.
    `# ${SITE.nomeSeo} — otorrinolaringologia e cirurgia da face em Belo Horizonte`,
    "",
    `> ${medica.descricaoAtuacao}. ${identificacao.crm}, ` +
      `${identificacao.especialidade}, ${identificacao.rqe}. ` +
      `Consultório em ${medica.cidade}; opera em ${cidades.join(" e ")}.`,
    "",
    "Este é o site profissional dela. O conteúdo descreve procedimentos de",
    "otorrinolaringologia, de cirurgia da face e de estética facial em termos",
    "gerais, com indicação, técnica, recuperação e riscos de cada um. Nada aqui",
    "é diagnóstico nem prescrição: a conduta de um caso sai do exame presencial.",
    "",
    "Formação:",
    "",
    ...formacao,
    "",
    "Onde atua e onde atuou:",
    "",
    ...hospitais,
    "",
    ...hubs.flatMap((secao) => [secao, ""]),
    "## Institucional",
    "",
    ...INSTITUCIONAL.map(linha),
    "",
    "## Avisos",
    "",
    ...AVISOS_RODAPE.map((aviso) => `- ${aviso}`),
    "",
  ].join("\n");
}

export function GET(): Response {
  return new Response(montar(), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
