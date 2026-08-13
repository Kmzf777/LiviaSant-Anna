import Link from "next/link";

import { cn } from "@/components/ui/cn";
import { Nota } from "@/components/ui/Nota";

/**
 * Consentimento LGPD — caixa nunca pré-marcada, obrigatória no esquema.
 *
 * A LGPD exige consentimento livre, informado e inequívoco (art. 5º, XII) para
 * o tratamento de dado sensível — e o assunto escolhido no formulário revela
 * interesse relacionado à saúde, que é exatamente isso. Caixa pré-marcada não
 * é consentimento: é a ausência de uma recusa que ninguém pediu.
 *
 * Por isso não há `defaultChecked` neste componente, e não deve haver. A
 * obrigatoriedade é imposta no servidor (`lib/schema.ts`), não pelo navegador:
 * quem posta direto na Server Action sem o campo recebe o mesmo erro.
 *
 * O link para a política abre na mesma aba, de propósito. Uma nova aba aqui
 * faria a pessoa perder o formulário preenchido de vista; a política é curta e
 * o botão "voltar" resolve.
 */

type Props = {
  readonly id: string;
  readonly nome: string;
  readonly erro?: string;
  readonly aoAlterar?: () => void;
};

export function CampoConsentimento({ id, nome, erro, aoAlterar }: Props) {
  const idErro = `${id}-erro`;
  const idRotulo = `${id}-rotulo`;

  return (
    <div className="flex flex-col gap-3">
      {/*
        O controle mora dentro do `<label>`, e não ao lado dele com `htmlFor`.
        As duas formas são válidas, mas esta amplia a área de clique para o
        texto inteiro — o que importa numa caixa de 20px tocada com o polegar.
        O `htmlFor` continua ali por redundância barata.
      */}
      <label htmlFor={id} className="flex items-start gap-4">
        <input
          id={id}
          name={nome}
          type="checkbox"
          value="on"
          aria-required={true}
          aria-invalid={erro ? true : undefined}
          aria-describedby={erro ? idErro : undefined}
          // O `<label>` já associa. O `aria-labelledby` aponta para o mesmo
          // texto e existe para o eslint-plugin-jsx-a11y enxergar a
          // associação, que ele não resolve através de `htmlFor`.
          aria-labelledby={idRotulo}
          onChange={aoAlterar}
          className={cn(
            "accent-wine-700 mt-1 h-5 w-5 shrink-0",
            erro && "outline-wine-700 outline-2 outline-offset-2",
          )}
        />

        <span id={idRotulo} className="text-small text-ink-600 max-w-[62ch]">
          Autorizo o uso dos dados acima para o consultório entrar em contato
          comigo sobre este pedido.
        </span>
      </label>

      {/*
        O link fica FORA do rótulo, de propósito. Um `<a>` dentro de um
        `<label>` é armadilha clássica: o clique no link navega e, de quebra,
        marca ou desmarca a caixa — a pessoa volta da política com o
        consentimento invertido sem ter pedido nada.
      */}
      <p className="text-small text-ink-600 max-w-[62ch] pl-9">
        Você pode pedir a exclusão dos seus dados quando quiser. O tratamento
        está descrito na{" "}
        <Link
          href="/politica-de-privacidade"
          className="link-filete text-wine-700"
        >
          política de privacidade
        </Link>
        .
      </p>

      {erro ? (
        <Nota tom="atencao" id={idErro}>
          {erro}
        </Nota>
      ) : null}
    </div>
  );
}
