import type { GrupoDeAssuntos } from "@/lib/assuntos";
import { cn } from "@/components/ui/cn";
import { Nota } from "@/components/ui/Nota";

/**
 * CampoTexto — rótulo, controle e erro, nesta ordem, sempre.
 *
 * ## O rótulo é um `<label>` de verdade
 *
 * Não existe modo "placeholder como rótulo". Placeholder some quando a pessoa
 * começa a digitar, e some junto a única pista do que aquele campo era — o que
 * é ruim para todo mundo e inutilizável para quem usa leitor de tela. Aqui o
 * placeholder não é usado em campo nenhum: quando um formato precisa ser
 * explicado, ele vira `dica`, que é texto permanente e entra no
 * `aria-describedby`.
 *
 * A dica fica **abaixo** do controle, e isso é decisão de layout com uma razão
 * medida: com ela acima, dois campos lado a lado só se alinham quando os dois
 * têm dica, e a linha "Nome / WhatsApp" saía com os campos em alturas
 * diferentes. Abaixo, a caixa começa sempre no mesmo lugar. A ordem de leitura
 * não sofre: `aria-describedby` liga dica e erro ao campo, e o leitor de tela
 * anuncia os dois junto com o rótulo, independentemente da posição no DOM.
 *
 * ## Erro
 *
 * O erro é ligado ao campo por `aria-describedby` e o campo ganha
 * `aria-invalid`. Visualmente ele é uma `Nota tom="atencao"`: filete vinho à
 * esquerda, texto em mono. A paleta do site não tem vermelho (§ 5.2) e não
 * ganha um só para este componente — destaque vem de contraste e de filete,
 * e o vinho já é a cor de alerta do sistema.
 *
 * ## Sem `required` nativo
 *
 * O formulário roda com `noValidate` e a obrigatoriedade é anunciada por
 * `aria-required`. Dois motivos: a bolha nativa do navegador aparece numa
 * ordem que o resumo de erros não controla, e o texto dela não é o nosso —
 * teríamos duas vozes dizendo coisas diferentes sobre o mesmo campo.
 */

const CLASSES_ROTULO =
  "text-micro text-ink-600 font-mono font-normal uppercase tracking-[0.14em]";

const CLASSES_DICA =
  "text-micro text-ink-400 font-mono tracking-[0.06em] leading-relaxed";

const CLASSES_CONTROLE = [
  "filete w-full rounded-filete border bg-sand-50 px-4 py-3.5",
  "font-body text-body text-ink-900",
  "transition-colors duration-fast ease-out",
  "hover:border-ink-400",
].join(" ");

const CLASSES_INVALIDO = "border-wine-700";

type Comum = {
  readonly id: string;
  readonly nome: string;
  readonly rotulo: string;
  readonly dica?: string;
  readonly erro?: string;
  readonly valorInicial?: string;
  readonly autoComplete?: string;
  readonly aoAlterar?: () => void;
};

type Props = Comum &
  (
    | { readonly tipo: "texto" | "email" | "tel" }
    | { readonly tipo: "area"; readonly linhas?: number; readonly maximo?: number }
    | {
        readonly tipo: "selecao";
        readonly grupos: readonly GrupoDeAssuntos[];
        readonly opcaoVazia: string;
      }
  );

const TIPO_HTML = {
  texto: "text",
  email: "email",
  tel: "tel",
} as const;

export function CampoTexto(props: Props) {
  const { id, nome, rotulo, dica, erro, valorInicial, autoComplete, aoAlterar } =
    props;

  const idDica = `${id}-dica`;
  const idErro = `${id}-erro`;

  const descritores =
    [dica ? idDica : null, erro ? idErro : null].filter(Boolean).join(" ") ||
    undefined;

  const comuns = {
    id,
    name: nome,
    "aria-required": true,
    "aria-invalid": erro ? true : undefined,
    "aria-describedby": descritores,
    defaultValue: valorInicial,
    autoComplete,
    className: cn(CLASSES_CONTROLE, erro && CLASSES_INVALIDO),
  } as const;

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className={CLASSES_ROTULO}>
        {rotulo}
      </label>

      {props.tipo === "area" ? (
        <textarea
          {...comuns}
          rows={props.linhas ?? 6}
          maxLength={props.maximo}
          onChange={aoAlterar}
          className={cn(comuns.className, "resize-y")}
        />
      ) : props.tipo === "selecao" ? (
        <select {...comuns} onChange={aoAlterar}>
          <option value="">{props.opcaoVazia}</option>

          {props.grupos.map((grupo) => (
            <optgroup key={grupo.rotulo} label={grupo.rotulo}>
              {grupo.opcoes.map((opcao) => (
                <option key={opcao.valor} value={opcao.valor}>
                  {opcao.rotulo}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      ) : (
        <input {...comuns} type={TIPO_HTML[props.tipo]} onChange={aoAlterar} />
      )}

      {dica ? (
        <p id={idDica} className={CLASSES_DICA}>
          {dica}
        </p>
      ) : null}

      {erro ? (
        <Nota tom="atencao" id={idErro} className="mt-1">
          {erro}
        </Nota>
      ) : null}
    </div>
  );
}
