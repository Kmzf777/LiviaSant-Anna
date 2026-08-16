import { getMedica, listarProcedimentos, type Procedimento } from "@/content";
import { AVISOS_RODAPE } from "@/content/nav";
import { itensConfirmados, textosConfirmados } from "@/lib/pendencias";
import { SITE, urlAbsoluta } from "@/lib/site";

/**
 * /llms-full.txt — o conteúdo dos onze procedimentos, inteiro, em um arquivo.
 *
 * O `/llms.txt` é o índice: diz o que existe e onde. Este é o corpo. A
 * separação é a da própria especificação e existe por economia de contexto —
 * um agente que só precisa saber quais procedimentos existem lê 3 kB em vez de
 * 90 kB, e quem precisa do texto de risco da rinoplastia busca aqui.
 *
 * Gerado por rota pelo mesmo motivo do `/llms.txt`: o domínio vem do ambiente
 * e o conteúdo vem de `content/`. Ver o cabeçalho de `app/llms.txt/route.ts`.
 *
 * ## O que entra, e em que ordem
 *
 * A mesma ordem da página, que é a ordem do briefing § 8.10: o que é, para
 * quem, como é feito, ficha técnica, recuperação, riscos e limites, perguntas.
 * A seção de riscos entra por inteiro e no meio do texto, como na página —
 * resumi-la aqui seria entregar ao agente uma versão do procedimento mais
 * otimista do que a que a paciente lê.
 *
 * ## Marcador de pendência
 *
 * Todo texto passa por `textosConfirmados` / `itensConfirmados`. Um agente que
 * lesse "[CONFIRMAR: apresentações que ela trabalha]" — que existe hoje na
 * toxina botulínica — repetiria o marcador como se fosse conteúdo.
 */

/** Entra no build estático, como o sitemap e o robots. */
export const dynamic = "force-static";

const HUBS: Record<Procedimento["hub"], string> = {
  "otorrinolaringologia": "Otorrinolaringologia",
  "cirurgia-da-face": "Cirurgia da face",
  "estetica-facial": "Estética facial",
};

function lista(titulo: string, textos: readonly string[]): readonly string[] {
  const confirmados = textosConfirmados(textos);
  if (confirmados.length === 0) return [];

  return [`### ${titulo}`, "", ...confirmados.map((texto) => `${texto}\n`)];
}

function fichaTecnica(procedimento: Procedimento): readonly string[] {
  const { fichaTecnica: ficha } = procedimento;

  const campos: readonly [string, string][] = [
    ["Duração", ficha.duracao],
    ["Anestesia", ficha.anestesia],
    ["Internação", ficha.internacao],
    ["Retorno social", ficha.retornoSocial],
  ];

  const linhas = campos
    .filter(([, valor]) => textosConfirmados([valor]).length === 1)
    .map(([rotulo, valor]) => `- ${rotulo}: ${valor}`);

  if (linhas.length === 0) return [];

  // O disclaimer é obrigatório no tipo e nunca deve faltar; ainda assim passa
  // pelo filtro, porque um marcador colado ali sairia como se fosse a ressalva.
  const disclaimer = textosConfirmados([ficha.disclaimer]);

  return [
    "### Ficha técnica",
    "",
    ...linhas,
    "",
    ...disclaimer.map((texto) => `${texto}\n`),
  ];
}

function procedimentoEmMarkdown(procedimento: Procedimento): string {
  const url = urlAbsoluta(`/${procedimento.hub}/${procedimento.slug}`);

  const recuperacao = itensConfirmados(
    [...procedimento.recuperacao],
    "periodo",
    "descricao",
  ).map((etapa) => `- ${etapa.periodo}: ${etapa.descricao}`);

  const riscos = itensConfirmados(
    [...procedimento.riscosELimites],
    "titulo",
    "descricao",
  ).map((risco) => `- ${risco.titulo}: ${risco.descricao}`);

  const faq = itensConfirmados(
    [...procedimento.faq],
    "pergunta",
    "resposta",
  ).flatMap((item) => [`**${item.pergunta}**`, "", `${item.resposta}\n`]);

  return [
    `## ${procedimento.nome} (${HUBS[procedimento.hub]})`,
    "",
    `URL: ${url}`,
    "",
    `${procedimento.lead}\n`,
    ...lista("O que é", procedimento.oQueE),
    ...lista("Indicações", procedimento.indicacoes),
    ...lista("Como é feito", procedimento.comoEFeito),
    ...fichaTecnica(procedimento),
    ...(recuperacao.length > 0
      ? ["### Recuperação", "", ...recuperacao, ""]
      : []),
    ...(riscos.length > 0
      ? ["### Riscos e limites", "", ...riscos, ""]
      : []),
    ...(faq.length > 0 ? ["### Perguntas frequentes", "", ...faq] : []),
  ].join("\n");
}

function montar(): string {
  const medica = getMedica();
  const { identificacao } = medica;

  return [
    `# ${SITE.nomeSeo} — conteúdo integral dos procedimentos`,
    "",
    `> ${medica.descricaoAtuacao}. ${identificacao.crm}, ` +
      `${identificacao.especialidade}, ${identificacao.rqe}. ` +
      `Consultório em ${medica.cidade}.`,
    "",
    `Índice das páginas do site: ${urlAbsoluta("/llms.txt")}`,
    "",
    ...AVISOS_RODAPE.map((aviso) => `- ${aviso}`),
    "",
    ...listarProcedimentos().map(procedimentoEmMarkdown),
    "",
  ].join("\n");
}

export function GET(): Response {
  return new Response(montar(), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
