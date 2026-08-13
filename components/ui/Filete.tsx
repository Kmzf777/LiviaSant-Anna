import { cn } from "./cn";

/**
 * Filete — a única forma de separação do site.
 *
 * 1px, `sand-200` sobre areia e `wine-600` sobre vinho. A troca de cor vem da
 * classe `.filete` de `app/globals.css`, que já é sensível a
 * `data-superficie` — o componente não decide cor nenhuma.
 *
 * Elevação (§ 5.6) vem de superfície e de filete, nunca de sombra. A única
 * `box-shadow` autorizada no projeto é a do Header sticky, e ela também é um
 * filete: `0 1px 0 var(--color-sand-200)`.
 */

type Props = {
  readonly orientacao?: "horizontal" | "vertical";
  readonly className?: string;
};

export function Filete({ orientacao = "horizontal", className }: Props) {
  return (
    <div
      role="separator"
      aria-orientation={orientacao}
      className={cn(
        "filete",
        orientacao === "horizontal"
          ? "w-full border-t"
          : "h-full min-h-[1em] self-stretch border-l",
        className,
      )}
    />
  );
}
