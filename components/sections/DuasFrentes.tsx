import { Botao } from "@/components/ui/Botao";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Filete } from "@/components/ui/Filete";
import { Reveal } from "@/components/ui/Reveal";
import { Secao } from "@/components/ui/Secao";
import { cn } from "@/components/ui/cn";
import type { CardFrente, ConteudoHome } from "@/content/tipos";
import { RITMO_SECAO } from "./ritmo";

/**
 * § 8.4 — As duas frentes. Areia-100.
 *
 * O corte visual entre os dois cards é o momento em que o site assume sua
 * dualidade abertamente: a mãe que procura quem opera a amígdala do filho e a
 * mulher pesquisando rinoplastia veem, na mesma tela, que as duas coisas são
 * feitas pela mesma pessoa.
 *
 * Peso visual idêntico — mesma largura, mesma tipografia, mesmo tratamento de
 * lista. Um card maior que o outro já responderia a pergunta que o site
 * inteiro se recusa a responder.
 *
 * ## O que este bloco deliberadamente NÃO é
 *
 * A grade de três colunas com ícone de linha, título e um parágrafo cada — o
 * primeiro item do § 15. Aqui são dois blocos editoriais grandes, sem ícone
 * nenhum, com o título em display no mesmo degrau de um H2 de seção.
 *
 * ## Os cards não são caixas
 *
 * O que os delimita é um filete: uma régua de 1px em cima de cada um e, no
 * desktop, uma vertical no vão entre eles. Caixa fechada com fundo próprio
 * exigiria uma quarta superfície e não existe uma. O card B desce 7rem, então
 * a vertical começa mais abaixo que a horizontal do card A: é o corte, e é o
 * que impede a seção de virar duas colunas simétricas.
 *
 * Nenhum dos dois títulos é o título da seção — são dois H2 irmãos, e a seção
 * se identifica por `aria-label`.
 */

type Props = {
  readonly duasFrentes: ConteudoHome["duasFrentes"];
};

export function DuasFrentes({ duasFrentes }: Props) {
  return (
    <Secao
      superficie="areia-100"
      espacamento="nenhum"
      className={RITMO_SECAO}
      aria-label="As duas frentes de atendimento"
    >
      <Container>
        {/* No mobile os dois cards viram uma pilha, e cada um já abre com o
            próprio filete: 56px separam sem que a pilha se solte em dois
            blocos órfãos. */}
        <div className="grid gap-y-14 lg:grid-cols-2 lg:gap-y-0">
          <Frente
            frente={duasFrentes.otorrino}
            index={0}
            className="lg:pr-16"
          />
          <Frente
            frente={duasFrentes.face}
            index={1}
            className="filete lg:mt-28 lg:border-l lg:pl-16"
          />
        </div>
      </Container>
    </Secao>
  );
}

function Frente({
  frente,
  index,
  className,
}: {
  readonly frente: CardFrente;
  readonly index: number;
  readonly className?: string;
}) {
  return (
    <Reveal
      as="article"
      index={index}
      className={cn("flex flex-col items-start", className)}
    >
      <Filete />

      <div className="mt-8 lg:mt-10">
        <Eyebrow>{frente.eyebrow}</Eyebrow>
      </div>

      <h2 className="font-display text-h2 mt-5 font-normal text-balance">
        {frente.titulo}
      </h2>

      <p className="text-lead text-ink-600 mt-6 max-w-[34ch] lg:mt-8">
        {frente.resumo}
      </p>

      {/* Lista em mono: são procedimentos, e procedimento é fato.
          A medida é a mesma do resumo acima, e não a largura da coluna: um
          filete indo até a borda do container entraria na faixa por onde o
          Traço passa, e a assinatura não divide lugar com régua de lista. */}
      <ul className="mt-9 flex w-full max-w-[34ch] list-none flex-col lg:mt-12">
        {frente.itens.map((item) => (
          <li
            key={item}
            className="filete text-small text-ink-900 border-b py-3 font-mono tracking-[0.04em]"
          >
            {item}
          </li>
        ))}
      </ul>

      <div className="mt-9 lg:mt-12">
        <Botao href={frente.cta.href} variante="filete">
          {frente.cta.texto}
        </Botao>
      </div>
    </Reveal>
  );
}
