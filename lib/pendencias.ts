/**
 * Pendências de conteúdo.
 *
 * O conteúdo do site marca com `[CONFIRMAR: …]` tudo que depende de informação
 * que só a médica tem. Isso é correto e deve continuar: a alternativa seria
 * inventar convênio, prazo de retenção de dados ou protocolo cirúrgico.
 *
 * O que não pode acontecer é o marcador chegar ao paciente. Já aconteceu: oito
 * páginas publicaram coisas como
 *
 *   "[CONFIRMAR: convênios atendidos e política de reembolso]"
 *
 * no corpo do texto. Nenhum arquivo estava errado isoladamente — o conteúdo
 * marcava o que devia marcar, e os componentes renderizavam o que recebiam. O
 * erro morava na costura, que é onde revisão por leitura não chega.
 *
 * Daí este módulo e o `scripts/verificar-html.ts`, que varre o HTML construído
 * e reprova o build se algum marcador escapar. Aqui fica a regra; lá fica a
 * garantia.
 *
 * ## Qual é a política
 *
 * Um texto pendente é **omitido**, não substituído por aviso. Uma pergunta de
 * FAQ sem resposta some da lista; um parágrafo pendente some do bloco. Mostrar
 * "esta informação está pendente" para quem procura um médico é pior do que
 * não mostrar a pergunta: chama atenção para a lacuna sem resolvê-la.
 *
 * A exceção é a página do consultório, onde a ausência do dado é a informação
 * relevante (não há endereço a mostrar) — lá o componente `DadoPendente`
 * assume o caso explicitamente.
 */

const MARCADOR = "[CONFIRMAR";

export function ehPendente(valor: string | undefined | null): boolean {
  return typeof valor !== "string" || valor.includes(MARCADOR);
}

/** O valor, ou `undefined` se for pendente — para ser omitido de um objeto. */
export function confirmado(valor: string | undefined): string | undefined {
  return ehPendente(valor) ? undefined : valor;
}

/** Só os textos confirmados. Preserva a ordem. */
export function textosConfirmados(
  textos: readonly string[],
): readonly string[] {
  return textos.filter((texto) => !ehPendente(texto));
}

/**
 * Só os itens cujos campos de texto estão todos confirmados.
 *
 * Serve para FAQ (`pergunta` + `resposta`), etapas de recuperação
 * (`periodo` + `descricao`) e riscos (`titulo` + `descricao`) — qualquer
 * registro em que um campo pendente invalida o item inteiro.
 */
export function itensConfirmados<T extends Record<string, unknown>>(
  itens: readonly T[],
  ...campos: readonly (keyof T)[]
): readonly T[] {
  return itens.filter((item) =>
    campos.every((campo) => {
      const valor = item[campo];
      return typeof valor !== "string" || !ehPendente(valor);
    }),
  );
}
