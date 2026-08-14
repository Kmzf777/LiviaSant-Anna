import type { MinTres, PassoConsulta } from "./tipos";

/**
 * Como é a consulta — a jornada, em quatro passos.
 *
 * Vivia em `content/home.ts` e mudou para cá quando a home virou landing page
 * de quatro seções. O conteúdo é o mesmo; o consumidor agora é só a página
 * `/consulta`, que é onde alguém procura por isso.
 *
 * A numeração 01–04 é sequência real, não decoração. É a diferença entre uma
 * lista numerada e um enfeite numerado, e o briefing § 6 pede exatamente essa
 * distinção.
 */
export const CONSULTA = {
  eyebrow: "A consulta",
  h2: "Como é a consulta",

  passos: [
    {
      numero: "01",
      titulo: "Conversa",
      descricao: "Você conta o que te incomoda. Eu escuto antes de examinar.",
    },
    {
      numero: "02",
      titulo: "Exame",
      descricao:
        "Avaliação completa de via aérea e da anatomia da face. Nasofibroscopia quando indicada.",
    },
    {
      numero: "03",
      titulo: "Planejamento",
      descricao:
        "Explico o que é possível, o que não é, os riscos e o tempo de recuperação. Sem pressa e sem pressão para decidir na hora.",
    },
    {
      numero: "04",
      titulo: "Decisão",
      descricao:
        "Se fizer sentido para você, agendamos. Se não fizer, também está certo.",
    },
  ] as MinTres<PassoConsulta>,

  fecho:
    "Toda cirurgia envolve riscos. Eles são explicados individualmente na consulta e no termo de consentimento.",
} as const;
