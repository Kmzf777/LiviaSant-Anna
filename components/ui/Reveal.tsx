"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";

import { cn } from "./cn";

/**
 * Reveal — a entrada de seção do orçamento de animação (§ 5.7, item 2).
 *
 * Fade + `translateY(16px)`, stagger de 60ms. Toda a aparência mora na classe
 * `.revelar` de `app/globals.css`; este componente só decide **quando** o
 * atributo `data-visivel` aparece. Duas razões para ser assim:
 *
 *   - `prefers-reduced-motion` desliga a animação em CSS, sem passar por JS,
 *     então não há caminho em que o JS reintroduza movimento;
 *   - não entra framer-motion no bundle inicial. Motion existe no projeto, mas
 *     fica reservado para gesto e interrupção (spec § 5), que não é o caso de
 *     um fade que roda uma vez.
 *
 * `once`: o observer se desconecta no primeiro cruzamento. Reanimar a cada
 * scroll é o tique de site gerado por IA que o § 15 manda evitar, e cansa
 * quem está lendo sobre a própria cirurgia.
 *
 * Sem IntersectionObserver (ou com o observer falhando), o efeito é revelar
 * imediatamente — o pior caso é o conteúdo aparecer sem graça, nunca sumir.
 */

type Props = {
  readonly children: ReactNode;
  /** Posição na sequência. Multiplica os 60ms do stagger. */
  readonly index?: number;
  readonly as?: "div" | "section" | "li" | "article" | "figure";
  readonly className?: string;
  readonly style?: CSSProperties;
  /** Fração visível para disparar. 0.15 evita disparo em blocos muito altos. */
  readonly limiar?: number;
};

export function Reveal({
  children,
  index = 0,
  as = "div",
  className,
  style,
  limiar = 0.15,
}: Props) {
  // O elemento muda, o contrato do ref não: todos são HTMLElement e nenhum
  // atributo específico de tag é usado aqui.
  const Tag = as as "div";
  const referencia = useRef<HTMLDivElement>(null);
  const [visivel, setVisivel] = useState(false);

  useEffect(() => {
    const no = referencia.current;

    if (!no || typeof IntersectionObserver === "undefined") {
      setVisivel(true);
      return;
    }

    // Já visível na primeira pintura (acima da dobra): sem observer, sem
    // esperar um frame de scroll que pode nunca vir.
    const observer = new IntersectionObserver(
      (entradas) => {
        for (const entrada of entradas) {
          if (entrada.isIntersecting) {
            setVisivel(true);
            observer.disconnect();
          }
        }
      },
      { threshold: limiar, rootMargin: "0px 0px -5% 0px" },
    );

    observer.observe(no);
    return () => observer.disconnect();
  }, [limiar]);

  return (
    <Tag
      ref={referencia}
      className={cn("revelar", className)}
      data-visivel={visivel ? "true" : "false"}
      style={{ ...style, "--revelar-index": String(index) } as CSSProperties}
    >
      {children}
    </Tag>
  );
}
