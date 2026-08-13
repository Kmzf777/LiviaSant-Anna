import { listarHubs, listarProcedimentos } from "@/content";

/**
 * A lista de assuntos do formulário, derivada dos procedimentos.
 *
 * Um procedimento novo em `/content` aparece no `<select>` sozinho, e passa a
 * ser aceito pela Server Action sozinho. Nenhuma lista escrita à mão em dois
 * lugares para sair de sincronia.
 *
 * **Este módulo importa `/content` e por isso não entra no bundle do cliente.**
 * Quem o consome é a página (Server Component, para montar o `<select>`) e a
 * Server Action (para conferir o que chegou). O componente de formulário
 * recebe os grupos por prop e nunca importa daqui — ver `lib/schema.ts`.
 */

export type OpcaoDeAssunto = {
  readonly valor: string;
  readonly rotulo: string;
};

export type GrupoDeAssuntos = {
  readonly rotulo: string;
  readonly opcoes: readonly OpcaoDeAssunto[];
};

/** Assuntos que não são procedimento. Ficam no fim, na ordem de frequência. */
const OUTROS: GrupoDeAssuntos = {
  rotulo: "Outros assuntos",
  opcoes: [
    { valor: "primeira-consulta", rotulo: "Primeira consulta" },
    { valor: "retorno", rotulo: "Retorno ou pós-operatório" },
    { valor: "outro", rotulo: "Outro assunto" },
  ],
};

/**
 * Agrupado por hub, na ordem em que os hubs aparecem no site.
 *
 * Os dois hubs clínicos lado a lado, com o mesmo peso: a tese do site é que
 * forma e função estão nas mesmas mãos, e uma lista que enterrasse a otorrino
 * embaixo da estética desmentiria isso dentro do próprio formulário.
 */
export function gruposDeAssunto(): readonly GrupoDeAssuntos[] {
  const porHub = listarHubs()
    .map((hub) => ({
      rotulo: hub.nome,
      opcoes: listarProcedimentos(hub.slug).map((procedimento) => ({
        valor: procedimento.slug,
        rotulo: procedimento.nome,
      })),
    }))
    .filter((grupo) => grupo.opcoes.length > 0);

  return [...porHub, OUTROS];
}

/** Todos os valores aceitos. É a lista contra a qual o servidor confere. */
export function valoresDeAssunto(): readonly string[] {
  return gruposDeAssunto().flatMap((grupo) =>
    grupo.opcoes.map((opcao) => opcao.valor),
  );
}

/**
 * Rótulo legível de um valor. O e-mail que chega no consultório precisa dizer
 * "Rinoplastia", não "rinoplastia" — quem lê é uma pessoa, não um roteador.
 */
export function rotuloDeAssunto(valor: string): string | null {
  for (const grupo of gruposDeAssunto()) {
    const encontrado = grupo.opcoes.find((opcao) => opcao.valor === valor);
    if (encontrado) return encontrado.rotulo;
  }
  return null;
}
