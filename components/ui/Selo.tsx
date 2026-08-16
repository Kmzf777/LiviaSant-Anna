import { cn } from "./cn";

/**
 * Selo — aproximação vetorial do logo enquanto o SVG oficial não chega.
 *
 * O logo dela é um selo circular com um traço filete contínuo desenhando um
 * perfil de rosto e o monograma L. Aqui está a leitura mínima disso: dois
 * anéis de 1px, a curva do perfil no mesmo peso, o L em display.
 *
 * Dois usos, e só dois:
 *   - marca d'água do `PlaceholderImagem`, a 8% de opacidade (§ 12.2);
 *   - marcador do rodapé, onde o selo aparece uma única vez (§ 5.5).
 *
 * **Não é a assinatura do site.** A assinatura é o Traço, e o briefing § 15 é
 * explícito: mais de um elemento disputando esse papel é motivo de refazer. Por
 * isso o selo nunca é grande, nunca anima e nunca abre uma seção.
 *
 * Trocar pelo arquivo oficial é substituir este componente inteiro — nada
 * depende da geometria daqui. Ver PENDENCIAS.md, item 5.
 */

type Props = {
  readonly className?: string;
  /** `true` quando o selo é decorativo e o texto ao lado já nomeia a marca. */
  readonly decorativo?: boolean;
  readonly titulo?: string;
};

export function Selo({
  className,
  decorativo = true,
  titulo = "Selo Dra. Lívia Sant'Anna",
}: Props) {
  return (
    <svg
      viewBox="0 0 100 100"
      role={decorativo ? undefined : "img"}
      aria-hidden={decorativo || undefined}
      aria-label={decorativo ? undefined : titulo}
      focusable="false"
      className={cn("block", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth={1}
      vectorEffect="non-scaling-stroke"
    >
      <circle cx="50" cy="50" r="48" />
      <circle cx="50" cy="50" r="42.5" />

      {/* Perfil: testa, dorso nasal, base, lábio, queixo. Mesma espessura do
          anel — no logo, anel e rosto são o mesmo traço, sem interrupção. */}
      <path
        d="M63 24
           C 51 28, 44.5 38, 45.5 47
           C 46 51.5, 41 53.5, 41.5 56
           C 42 58.5, 46.5 58.5, 46.5 61
           C 46.5 65, 42.5 66, 44.5 68.5
           C 46 70.5, 51 70, 53 72.5
           C 55 75, 53 78, 49 79"
        strokeLinecap="round"
      />

      <text
        x="31"
        y="66"
        fill="currentColor"
        stroke="none"
        fontSize="26"
        fontWeight={400}
        style={{ fontFamily: "var(--font-display)" }}
      >
        L
      </text>
    </svg>
  );
}
