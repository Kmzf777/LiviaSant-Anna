import type { NaoVazio } from "./tipos";

/**
 * A tese do site: forma e função nas mesmas mãos.
 *
 * Este texto abria a home. Saiu de lá quando a home virou landing page, e não
 * porque tenha deixado de valer — porque estava no lugar errado.
 *
 * Como manifesto de abertura, ele pedia que a pessoa comprasse uma ideia antes
 * de saber se aquele médico trata o problema dela. Na página de rinoplastia ele
 * é outra coisa: quem chega ali já quer operar o nariz, e o argumento de que
 * quem opera a forma precisa entender a função é a informação mais útil que
 * essa pessoa vai receber no dia.
 *
 * Mesmo texto, muda o momento em que é dito.
 */
export const TESE = {
  /** Quebrado em linhas curtas — a quebra é decisão de design. */
  linhas: [
    "O nariz é o centro do rosto",
    "e a porta da respiração.",
    "Mudar um sem entender o outro",
    "é resolver metade.",
  ] as NaoVazio<string>,

  apoio:
    "Minha formação começou pela função: septo, seios da face, via aérea. A cirurgia plástica da face veio depois, e sobre essa base. Por isso, numa rinoplastia, a avaliação da respiração não é um adicional — é parte do planejamento desde a primeira consulta.",

  /**
   * Os dois caminhos que levam à mesma cirurgia. É o parágrafo que faz a
   * paciente da estética e o paciente do septo se reconhecerem no mesmo texto.
   */
  corpo:
    "Muita gente chega dizendo que não gosta do próprio nariz e descobre, na consulta, que também não respira bem por ele. Às vezes é o contrário: veio pelo septo e quer entender o que muda no rosto. Os dois caminhos cabem na mesma cirurgia, e é isso que avaliamos juntas antes de qualquer decisão.",

  /** Em mono. Acompanha qualquer promessa implícita de resultado. */
  nota: "Resultados variam conforme anatomia, cicatrização e histórico de cada paciente.",
} as const;
