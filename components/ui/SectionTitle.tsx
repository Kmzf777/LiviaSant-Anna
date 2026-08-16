import type { ReactNode } from "react";

import { cn } from "./cn";
import { Eyebrow } from "./Eyebrow";

/**
 * SectionTitle — eyebrow opcional + título em display.
 *
 * `as` e `tamanho` são independentes de propósito. O nível do heading é
 * semântica (uma página tem um `h1` e nenhum salto de nível); o tamanho é
 * composição. Amarrar os dois obrigaria a escolher entre uma hierarquia
 * correta e um ritmo visual correto, e o briefing § 9 não abre mão do
 * primeiro.
 *
 * `tamanho` só oferece degraus de 1.5rem para cima. A Bodoni nunca desce disso
 * (§ 5.3): abaixo, o hairline some e vira borrão. `scripts/verificar-bodoni.ts`
 * reprova a combinação, então não é possível burlar por className.
 *
 * O peso não aparece aqui, e é de propósito. Ele vem de `--peso-display`
 * (`styles/theme.css`), que os degraus `text-hero`/`text-h1`/`text-h2` e a
 * regra `.font-display` de `app/globals.css` já aplicam. Escrever `font-black`
 * neste arquivo faria a home mudar e o rodapé não — foi essa dispersão que
 * levou o cliente a dizer, em 15/08/2026, que a fonte não tinha mudado.
 */

type Tamanho = "hero" | "h1" | "h2";

type Props = {
  readonly children: ReactNode;
  readonly eyebrow?: ReactNode;
  readonly as?: "h1" | "h2" | "h3";
  readonly tamanho?: Tamanho;
  readonly id?: string;
  readonly className?: string;
  /** Classes do bloco inteiro (eyebrow + título). */
  readonly classNameBloco?: string;
};

const TAMANHO: Record<Tamanho, string> = {
  hero: "text-hero",
  h1: "text-h1",
  h2: "text-h2",
};

export function SectionTitle({
  children,
  eyebrow,
  as = "h2",
  tamanho = "h2",
  id,
  className,
  classNameBloco,
}: Props) {
  const Tag = as;

  return (
    <div className={cn("flex flex-col gap-5", classNameBloco)}>
      {eyebrow !== undefined ? <Eyebrow>{eyebrow}</Eyebrow> : null}

      <Tag
        id={id}
        className={cn(
          // `font-display` explícito porque em `as="h3"` o reset de globals.css
          // mandaria a família do corpo e peso 500. A classe traz junto o
          // `--peso-display`, então o h3 sai com a mesma display dos irmãos.
          "font-display text-balance",
          TAMANHO[tamanho],
          className,
        )}
      >
        {children}
      </Tag>
    </div>
  );
}
