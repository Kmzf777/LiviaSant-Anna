import { cn } from "./cn";
import { Selo } from "./Selo";

/**
 * PlaceholderImagem — o lugar onde a foto real vai entrar.
 *
 * Bloco `sand-200`, selo em `wine-700` a 8% de opacidade, texto em mono
 * `IMAGEM PENDENTE — [descrição]`. É literalmente o § 12.2 do briefing.
 *
 * A regra que este componente existe para tornar possível: **nenhuma foto de
 * banco de imagens entra no repositório, nem provisoriamente.** As três fotos
 * dela foram feitas em fundo areia e são o que dá credibilidade ao site; uma
 * "médica genérica" sorrindo ao lado destrói isso de forma irreversível, e o
 * público de estética identifica rosto de banco (ou de IA) sem esforço.
 *
 * `aspecto` existe para o layout já nascer calibrado. Os placeholders usam a
 * proporção da foto que vai substituí-los, então trocar o arquivo não
 * reposiciona nada em volta — é o mitigante do risco listado no spec § 12.
 *
 * `arco` aplica a mesma máscara do RetratoArco, para os slots de retrato.
 */

type Props = {
  /** Vai literal para o texto em mono. Descreva a foto que falta, não o slot. */
  readonly descricao: string;
  /** `"3/4"`, `"4/5"`, `"1/1"`… Padrão 3/4, a proporção dos retratos dela. */
  readonly aspecto?: string;
  readonly arco?: boolean;
  readonly className?: string;
};

export function PlaceholderImagem({
  descricao,
  aspecto = "3/4",
  arco = false,
  className,
}: Props) {
  return (
    <div
      data-placeholder="imagem"
      style={{ aspectRatio: aspecto }}
      className={cn(
        "bg-sand-200 relative flex w-full items-end overflow-hidden",
        arco ? "rounded-arco" : "rounded-filete",
        className,
      )}
    >
      {/* Marca d'água a 8%: presente o bastante para o bloco ter dono, discreta
          o bastante para ninguém confundir com conteúdo. */}
      <Selo className="text-wine-700 absolute top-1/2 left-1/2 h-[45%] max-h-40 w-auto -translate-x-1/2 -translate-y-1/2 opacity-[0.08]" />

      {/* Caixa alta no próprio texto, e não só em CSS: o que aparece na tela é
          o que está no HTML, e é o que os testes e a revisão conferem. */}
      <p className="text-micro text-ink-600 relative z-10 w-full px-5 py-4 font-mono tracking-[0.12em]">
        IMAGEM PENDENTE — {descricao}
      </p>
    </div>
  );
}
