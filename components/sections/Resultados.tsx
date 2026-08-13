import { Container } from "@/components/ui/Container";
import { Filete } from "@/components/ui/Filete";
import { Reveal } from "@/components/ui/Reveal";
import { Secao } from "@/components/ui/Secao";
import { SectionTitle } from "@/components/ui/SectionTitle";
import type { ConteudoHome } from "@/content/tipos";

/**
 * § 8.8 — Resultados / antes e depois. Areia.
 *
 * Não há imagens autorizadas na v1, e a resposta a isso não é uma galeria
 * fraca nem um "em breve": é explicar a ausência. A Resolução CFM 2.336/2023
 * exige, cumulativamente, autorização formal, paciente não identificável,
 * imagem sem manipulação e contexto educativo junto de cada foto. Dito assim,
 * com honestidade, a ausência vira sinal de seriedade — e é a única opção
 * legal.
 *
 * O componente `<AntesDepois />` já existe, tipado e testado, com
 * `textoEducativo` e `autorizacaoId` obrigatórios em TypeScript. Quando as
 * imagens chegarem, esta seção troca de corpo sem mudar de lugar.
 *
 * ## Por que a seção é quieta
 *
 * Nenhum placeholder de imagem aqui, e isso é regra e não economia: um bloco
 * com aparência de foto pendente numa seção de resultados sugere que existem
 * fotos guardadas. Só tipografia, um filete de largura inteira e muito ar. A
 * seção mais silenciosa da página é a que fala do assunto mais barulhento do
 * mercado — a composição diz isso antes do texto.
 */

type Props = {
  readonly resultados: ConteudoHome["resultados"];
};

export function Resultados({ resultados }: Props) {
  return (
    <Secao superficie="areia" aria-labelledby="resultados-titulo">
      <Container>
        <Reveal>
          <Filete />

          <div className="mt-14 grid gap-y-10 lg:grid-cols-12 lg:gap-x-[var(--gutter)]">
            <div className="lg:col-span-5">
              <SectionTitle
                id="resultados-titulo"
                eyebrow={resultados.eyebrow}
                as="h2"
                tamanho="h2"
              >
                {resultados.h2}
              </SectionTitle>
            </div>

            <p className="text-lead text-ink-600 medida lg:col-span-6 lg:col-start-7">
              {resultados.corpo}
            </p>
          </div>
        </Reveal>
      </Container>
    </Secao>
  );
}
