/**
 * Concatenação de classes.
 *
 * Deliberadamente ingênua: junta o que for string e descarta o resto. Não há
 * `clsx` nem `tailwind-merge` no projeto e não deve haver — os primitivos deste
 * diretório compõem as próprias classes e recebem `className` só no fim da
 * lista, então "quem chama por último vence" já resolve os conflitos que
 * apareceriam. Uma dependência a mais aqui não pagaria o próprio peso.
 */
export function cn(
  ...partes: readonly (string | false | null | undefined)[]
): string {
  return partes.filter((parte): parte is string => Boolean(parte)).join(" ");
}
