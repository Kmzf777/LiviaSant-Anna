import type { Superficie } from "@/content";
import { Botao } from "@/components/ui/Botao";
import { Container } from "@/components/ui/Container";
import { Secao } from "@/components/ui/Secao";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { BotaoWhatsApp } from "@/components/form/BotaoWhatsApp";

/**
 * O fecho das páginas institucionais.
 *
 * Título em display, duas ações, nada mais. Sem parágrafo de enchimento: a
 * página inteira já foi o argumento, e um texto a mais aqui seria repetição
 * travestida de persuasão.
 *
 * ## Por que não é um bloco vinho
 *
 * A tentação óbvia era fechar em `wine-700`, como o § 8.5 faz na home. Mas o
 * rodapé é `wine-900` e já traz a mesma chamada e o mesmo botão em todas as
 * páginas: um bloco vinho aqui empilharia dois escuros seguidos e diria
 * "agendar consulta" duas vezes em meia tela. Areia-100 com filete fecha a
 * leitura sem competir com o rodapé — e o contraste de superfície continua
 * fazendo o trabalho, que é a regra do § 5.2.
 *
 * O botão de WhatsApp some sozinho enquanto o número não for confirmado (ver
 * `BotaoWhatsApp`). Quando some, sobra o CTA sólido, que é o caminho que de
 * fato funciona hoje.
 */

type Props = {
  readonly titulo: string;
  readonly eyebrow?: string;
  readonly superficie?: Superficie;
  /** Contexto da mensagem pré-preenchida do WhatsApp. */
  readonly procedimento?: string;
};

export function ChamadaConsulta({
  titulo,
  eyebrow = "Consulta",
  superficie = "areia-100",
  procedimento,
}: Props) {
  return (
    <Secao
      superficie={superficie}
      aria-labelledby="chamada-consulta"
    >
      <Container comRail>
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between lg:gap-20">
          <SectionTitle
            as="h2"
            tamanho="h2"
            eyebrow={eyebrow}
            id="chamada-consulta"
            className="max-w-[18ch]"
          >
            {titulo}
          </SectionTitle>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <Botao href="/contato">Agendar consulta</Botao>
            <BotaoWhatsApp procedimento={procedimento} />
          </div>
        </div>
      </Container>
    </Secao>
  );
}
