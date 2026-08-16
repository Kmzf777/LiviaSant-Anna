import type { Hub } from "./tipos";

/**
 * Os três hubs.
 *
 * Simetria estrutural é deliberada: mesmo template, mesmo peso visual, mesma
 * tipografia. A diferenciação entre "clínico" e "estético" acontece por
 * conteúdo e superfície, nunca por hierarquia de componente.
 *
 * Um hub mais bonito que o outro quebra a tese do site — a de que forma e
 * função são o mesmo trabalho, nas mesmas mãos.
 */
export const HUBS: readonly Hub[] = [
  {
    slug: "otorrinolaringologia",
    nome: "Otorrinolaringologia",
    seo: {
      /*
        "BH", e não "Belo Horizonte": por extenso o título base tem 38
        caracteres e, com o sufixo do layout raiz (23), o título final passa
        dos 60 que o Google exibe. É o único dos dezessete que estourava.

        A abreviação não é só concessão ao orçamento — "otorrino BH" é a busca
        real (PENDENCIAS.md, decisão 3), e é o mesmo termo que a home usa.
      */
      titulo: "Otorrinolaringologia em BH",
      descricao:
        "Diagnóstico e tratamento clínico e cirúrgico de nariz, ouvido e garganta, em adultos e crianças, em Belo Horizonte. Nem todo caso termina em cirurgia.",
    },
    eyebrow: "Função",
    h1: "Respirar, ouvir, dormir melhor",
    lead: "Diagnóstico e tratamento clínico e cirúrgico de nariz, ouvido e garganta — em adultos e crianças.",
    introducao: [
      "A otorrinolaringologia cuida de três territórios que quase sempre trabalham juntos: a via aérea nasal, o ouvido e a garganta. Um problema em um deles costuma aparecer como sintoma em outro — quem ronca e acorda cansado nem sempre associa isso ao nariz, e quem tem dor de ouvido recorrente nem sempre suspeita da adenoide.",
      "Por isso a consulta começa por entender o conjunto antes de tratar a parte. Nem todo caso termina em cirurgia, e boa parte se resolve clinicamente.",
    ],
    ctaFinal: "Agendar consulta",
  },

  {
    slug: "cirurgia-da-face",
    nome: "Cirurgia da face",
    seo: {
      titulo: "Cirurgia da face em Belo Horizonte",
      descricao:
        "Rinoplastia, otoplastia, blefaroplastia, cantopexia e frontoplastia, conduzidas por otorrinolaringologista com atuação em cirurgia plástica da face.",
    },
    eyebrow: "Forma",
    h1: "Cirurgia da face conduzida por quem opera a função",
    lead: "Planejamento individual, resultado proporcional ao seu rosto.",
    introducao: [
      "Minha formação começou pela função: septo, seios da face, via aérea. A cirurgia plástica da face veio depois, e sobre essa base.",
      "Na prática, isso muda o planejamento. Numa rinoplastia, a avaliação da respiração não é um adicional — é parte da conversa desde a primeira consulta. Num rosto, o que se pode mudar é limitado pela anatomia de quem o tem, e a consulta serve justamente para separar o que é possível do que não é.",
    ],
    ctaFinal: "Agendar consulta",
  },

  {
    slug: "estetica-facial",
    nome: "Estética facial",
    seo: {
      titulo: "Estética facial em Belo Horizonte",
      descricao:
        "Toxina botulínica no terço superior e full face, com avaliação da anatomia e da expressão de cada rosto. Belo Horizonte, MG.",
    },
    eyebrow: "Estética",
    h1: "Procedimentos sem cirurgia",
    lead: "Avaliação da anatomia e da expressão antes de qualquer aplicação.",
    introducao: [
      "Procedimentos não cirúrgicos têm indicação, limite e tempo de duração. Nenhum substitui cirurgia, e nenhum resolve o que é estrutural.",
      "A avaliação começa pelo que incomoda você e passa por como o seu rosto se move — expressão é anatomia, e tratá-la sem entender isso é o que produz resultado artificial.",
    ],
    ctaFinal: "Agendar consulta",
  },
];
