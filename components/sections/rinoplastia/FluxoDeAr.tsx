import { cn } from "@/components/ui/cn";
import { COTA, DIRECAO, ESTRUTURA, FLUXO, VIEWBOX_FLUXO } from "./fluxo-de-ar";

/**
 * FluxoDeAr — a ilustração do § 12.3, inline.
 *
 * Abstrata e vetorial, só linha: nenhuma pessoa, nenhum rosto, nada
 * figurativo. O § 12.3 é categórico sobre isso, e num site médico a razão não
 * é estética — é que rosto gerado destrói a credibilidade que as fotos reais
 * dela constroem.
 *
 * Peso de traço idêntico ao do logo: `stroke-width: 1` com
 * `vector-effect: non-scaling-stroke`, que mantém o filete em 1px real em
 * qualquer escala. É o mesmo par que `Selo` usa.
 *
 * A cor sai de `currentColor`, então a ilustração é blush sobre vinho e vinho
 * sobre areia sem que a página decida nada — exatamente como o traço do logo
 * troca de cor conforme o fundo.
 *
 * Três níveis de opacidade, e só três: estrutura cheia, fluxo a 0.72, cota a
 * 0.42. É hierarquia de leitura, não decoração — a cota precisa existir sem
 * competir com o canal.
 *
 * **Sem animação.** O orçamento do § 5.7 tem três itens, o Traço é a
 * assinatura e o § 15 manda refazer quando um segundo elemento disputa esse
 * papel. Como não há movimento, não há nada a desligar em
 * `prefers-reduced-motion`.
 *
 * A geometria vive em `./fluxo-de-ar.ts` e é a mesma de
 * `public/ilustracoes/fluxo-de-ar.svg`, o asset canônico e trocável. O teste
 * `tests/unit/procedimento.spec.tsx` confere que as duas não divergiram.
 */

const DESCRICAO =
  "Esquema em linha do fluxo de ar pelas duas fossas nasais: as paredes " +
  "laterais e o septo ao centro formam um canal que estreita na altura da " +
  "válvula nasal, onde as linhas de corrente se aproximam.";

type Props = {
  readonly className?: string;
  /** `true` quando a legenda ao lado já descreve o desenho por extenso. */
  readonly decorativo?: boolean;
};

export function FluxoDeAr({ className, decorativo = false }: Props) {
  return (
    <svg
      viewBox={VIEWBOX_FLUXO}
      role={decorativo ? undefined : "img"}
      aria-hidden={decorativo || undefined}
      aria-label={decorativo ? undefined : DESCRICAO}
      focusable="false"
      fill="none"
      stroke="currentColor"
      strokeWidth={1}
      strokeLinecap="round"
      vectorEffect="non-scaling-stroke"
      className={cn("block h-auto w-full", className)}
    >
      {decorativo ? null : <title>{DESCRICAO}</title>}

      <g vectorEffect="non-scaling-stroke">
        {COTA.map((d) => (
          <path key={d} d={d} opacity={0.3} vectorEffect="non-scaling-stroke" />
        ))}

        {FLUXO.map((d) => (
          <path
            key={d}
            d={d}
            opacity={0.55}
            vectorEffect="non-scaling-stroke"
          />
        ))}

        {DIRECAO.map((d) => (
          <path key={d} d={d} opacity={0.7} vectorEffect="non-scaling-stroke" />
        ))}

        {ESTRUTURA.map((d) => (
          <path key={d} d={d} vectorEffect="non-scaling-stroke" />
        ))}
      </g>
    </svg>
  );
}
