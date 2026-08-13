import { Secao } from "@/components/ui/Secao";

/**
 * O respiro do Traço — a pausa teatral entre o manifesto e a rinoplastia.
 *
 * Não é decoração nem "espaço a mais". É um contrato explícito, escrito no
 * topo de `components/layout/Traco.tsx`:
 *
 *   > A pausa teatral — a `resolucao` dura ~1,5 tela e é o único momento em
 *   > que o traço entra na coluna de conteúdo. Entre o manifesto (§ 8.3) e a
 *   > rinoplastia (§ 8.5), a home deve reservar um respiro sem texto de
 *   > ~1,2 tela (`data-superficie="areia"`, sem conteúdo).
 *
 * É aqui que a linha filete resolve no perfil de rosto do logo, em escala
 * grande, sem competir com leitura nenhuma. Escrever qualquer coisa nesta
 * faixa faz o rosto se desenhar por cima de texto — que é a única forma de o
 * único momento teatral do site ficar feio.
 *
 * ## Por que a altura varia
 *
 * A `resolucao` só acontece por completo a partir de 768px: abaixo disso o
 * Traço degrada para desenho único na entrada (§ 4.5 do spec) e uma tela e
 * meia de areia vazia seria só peso morto no celular. A faixa acompanha:
 * curta no telefone, inteira onde o rosto se desenha.
 *
 * ## Por que 1,6 tela, e não 1,2
 *
 * O valor foi medido, não estimado. O Traço é uma fita `fixed` que percorre a
 * página inteira: a posição do rosto é uma FRAÇÃO do scroll total, não uma
 * âncora presa a uma seção. Com 1,2 tela de respiro, o crânio se desenhava
 * aqui, mas o nariz e o queixo caíam ~470px adiante — em cima da coluna de
 * texto de "A médica" (§ 8.6). Cruzar texto é a única coisa que o § 5.8
 * proíbe à assinatura.
 *
 * A aritmética: cada pixel acrescentado ACIMA de "A médica" empurra a seção
 * em 1px e o rosto em ~0,59px (a fração dele no documento maior). O ganho
 * líquido é de ~0,41px por pixel, então corrigir 470px de sobreposição custa
 * cerca de 1.100px de respiro a mais. Daí o salto de 100vh para 160vh.
 *
 * Ele é grande e é para ser: são duas telas em que a página não diz nada e
 * uma linha de 1px desenha um rosto. O § 5.8 chama isso de "o único momento
 * teatral do site" — teatro precisa de palco vazio.
 *
 * Se a página encolher ou crescer muito (uma seção a mais, um texto que
 * dobre), este número precisa ser remedido. O teste `tests/unit/home.spec.tsx`
 * garante que a faixa continua existindo e vazia; a altura certa se confere
 * olhando, com `scripts/capturar.mjs`.
 *
 * ## O que este respiro NÃO resolve
 *
 * Ele garante que o rosto se DESENHA sobre espaço limpo. Não garante que o
 * rosto já desenhado saia de cena antes de "A médica": a fita é `fixed` e sobe
 * a ~0,48px por pixel de scroll, então um ponto dela fica visível por cerca de
 * 2.400px de documento. Cobrir isso inteiro exigiria mais de três telas de
 * areia vazia — mais caro do que o defeito que evita.
 *
 * O que sobra é a cauda da resolução (queixo e mandíbula voltando para a
 * margem) passando ATRÁS do texto de "A médica", em x ≈ 1.060–1.350 numa tela
 * de 1440. É o mesmo comportamento que o traço tem em todas as outras seções,
 * e é a razão de `Container` ser `z-[2]`: a linha nunca cobre uma letra. Para
 * reduzir o encontro, aquela seção e a dos Passos param na coluna 11 em vez de
 * 12, deixando as duas colunas da direita como pista do Traço.
 *
 * Sem `aria-label` e sem heading de propósito: é uma `div`, não uma landmark.
 * Uma região anunciada e vazia é ruído para quem usa leitor de tela.
 */
export function RespiroTraco() {
  return (
    <Secao
      superficie="areia"
      as="div"
      espacamento="nenhum"
      className="min-h-[30vh] md:min-h-[80vh] lg:min-h-[160vh]"
    >
      {null}
    </Secao>
  );
}
