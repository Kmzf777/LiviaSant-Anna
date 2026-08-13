import { IdentificacaoCFM } from "@/components/medical/IdentificacaoCFM";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Filete } from "@/components/ui/Filete";
import { Secao } from "@/components/ui/Secao";
import type { ConteudoHome } from "@/content/tipos";

/**
 * § 8.2 — Faixa de identificação. Areia, altura baixa.
 *
 * ## Por que o bloco do CFM aparece aqui, e não só no rodapé
 *
 * O § 8.2 pede `<IdentificacaoCFM />` nesta faixa, textualmente. O bloco já
 * está no rodapé (injetado no layout raiz, o que garante a norma em todas as
 * rotas), então este é o segundo da página — e é deliberado por dois motivos:
 *
 *   1. A Resolução CFM 2.336/2023 exige "local visível". Rodapé cumpre; logo
 *      abaixo do hero cumpre melhor, e é a primeira coisa que o paciente lê
 *      depois da promessa da home.
 *   2. Editorialmente, é o momento em que a mono entra em cena. O hero é
 *      persuasão inteira; esta faixa é fato inteiro. O leitor aprende a regra
 *      do site — mono é o que se pode conferir — em duas linhas.
 *
 * O `tests/e2e/cfm.spec.ts` audita TODOS os blocos encontrados em cada rota,
 * então dois blocos são dois blocos auditados, não uma brecha.
 *
 * A faixa não tem heading: ela não abre assunto, apenas credencia o anterior.
 * Daí o `aria-label` em vez de `aria-labelledby`.
 */

type Props = {
  readonly credenciais: ConteudoHome["credenciais"];
};

export function FaixaCredenciais({ credenciais }: Props) {
  return (
    <Secao
      superficie="areia"
      espacamento="compacto"
      aria-label="Identificação profissional e formação"
    >
      <Container>
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between lg:gap-12">
          <ul className="flex list-none flex-col gap-4 lg:flex-row lg:items-center lg:gap-8">
            {credenciais.map((credencial, indice) => (
              <li key={credencial} className="flex items-center gap-8">
                {/* O filete vertical separa, e é o mesmo 1px de todo o site. */}
                {indice > 0 ? (
                  <Filete orientacao="vertical" className="hidden lg:block" />
                ) : null}
                <Eyebrow as="span">{credencial}</Eyebrow>
              </li>
            ))}
          </ul>

          <IdentificacaoCFM />
        </div>
      </Container>
    </Secao>
  );
}
