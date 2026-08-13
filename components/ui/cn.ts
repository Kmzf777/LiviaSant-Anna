/**
 * Concatenação de classes.
 *
 * Deliberadamente ingênua: junta o que for string e descarta o resto. Não há
 * `clsx` nem `tailwind-merge` no projeto, e essa escolha se mantém — mas ela
 * tem uma consequência que precisa estar escrita, porque custou um bug.
 *
 * ## `className` NÃO sobrescreve as classes base de um primitivo
 *
 * É tentador pensar que, como o `className` do chamador entra por último na
 * string, ele vence. Não vence. Em CSS quem decide não é a ordem dos nomes no
 * atributo `class`, é a ordem das regras na folha de estilo — e essa ordem quem
 * define é o Tailwind, não nós.
 *
 * O caso real: `<Botao className="hidden md:inline-flex" />`. O `BASE` do Botão
 * traz `inline-flex`, então a string final tinha `inline-flex` e `hidden` ao
 * mesmo tempo. O Tailwind emite `inline-flex` depois de `hidden`, e o botão
 * apareceu no mobile, onde deveria sumir. Silenciosamente — nenhum erro,
 * nenhum aviso, e só apareceu quando dois subagents olharam capturas em 390px.
 *
 * ## O que fazer quando precisar sobrescrever
 *
 * Envolva o componente em um elemento que carregue a classe:
 *
 *   ❌  <Botao className="hidden md:inline-flex" />
 *   ✅  <span className="hidden md:inline-flex"><Botao /></span>
 *
 * Ou adicione uma prop ao primitivo, se o caso for recorrente.
 *
 * `className` continua servindo para o que NÃO conflita com as classes base:
 * margem, largura, posicionamento, `col-span`. É a maioria dos usos.
 */
export function cn(
  ...partes: readonly (string | false | null | undefined)[]
): string {
  return partes.filter((parte): parte is string => Boolean(parte)).join(" ");
}
