import type { MinCinco, PerguntaResposta } from "./tipos";

/**
 * FAQ transversal — perguntas que valem para qualquer motivo de consulta.
 *
 * As perguntas específicas de cada procedimento ficam no próprio procedimento,
 * em content/procedimentos/. Estas aparecem na home e alimentam o JSON-LD
 * FAQPage.
 *
 * Regra de escrita: responder de verdade, inclusive quando a resposta é "não
 * dá para saber sem examinar". Uma FAQ que só diz sim vende; uma que diz não
 * quando é não constrói confiança — e é a única compatível com a Resolução
 * CFM 2.336/2023.
 */
export const FAQ_TRANSVERSAL: MinCinco<PerguntaResposta> = [
  {
    pergunta: "Você atende crianças?",
    resposta:
      "Sim. Boa parte da otorrinolaringologia pediátrica passa por amígdalas, adenoides e ouvido — quadros de ronco, respiração pela boca, otites de repetição e infecções frequentes de garganta. A avaliação é a mesma em rigor, com a diferença de que a conversa acontece com a criança e com quem a acompanha.",
  },
  {
    pergunta: "Preciso de encaminhamento para marcar?",
    resposta:
      "Não. Você pode agendar diretamente. Se já tiver exames recentes, relatórios ou o resumo de uma cirurgia anterior, leve — isso encurta bastante a avaliação.",
  },
  {
    pergunta: "Vocês atendem por convênio?",
    resposta:
      "[CONFIRMAR: convênios atendidos, ou informar que o atendimento é particular com recibo para reembolso.]",
  },
  {
    pergunta: "Na primeira consulta já dá para marcar cirurgia?",
    resposta:
      "Dá, quando a indicação está clara e você se sente segura para decidir. Mas não é o esperado, e não há nenhuma pressão para que seja assim. O mais comum é sair da consulta com o diagnóstico, as opções e o tempo de recuperação explicados, e decidir depois — inclusive depois de uma segunda opinião, se você quiser.",
  },
  {
    pergunta: "Rinoplastia estética e cirurgia do septo podem ser feitas juntas?",
    resposta:
      "Na maior parte dos casos, sim, na mesma cirurgia — é a chamada rinosseptoplastia. Se as duas coisas te incomodam, avaliá-las juntas costuma fazer mais sentido do que operar duas vezes. O que define isso é o exame, não a preferência: existem situações em que separar é o mais prudente.",
  },
  {
    pergunta: "Quanto tempo de afastamento do trabalho eu preciso?",
    resposta:
      "Depende do procedimento e do que você faz. As páginas de cada cirurgia trazem uma faixa realista de retorno social e de retorno às atividades, mas o número que vale para você sai da consulta, depois do exame.",
  },
  {
    pergunta: "Onde as cirurgias são realizadas?",
    resposta:
      "No Hospital Mater Dei, em Belo Horizonte. A equipe, o tipo de anestesia e o tempo de internação previstos são explicados antes, no planejamento, junto com o termo de consentimento.",
  },
  {
    pergunta: "Por que o site não tem fotos de antes e depois?",
    resposta:
      "Porque a legislação exige autorização formal da paciente, imagem sem qualquer edição e explicação clínica junto de cada imagem — e essa curadoria ainda não está pronta. Enquanto isso, prefiro mostrar casos pessoalmente na consulta, onde consigo explicar a anatomia de cada um e por que o resultado seria diferente no seu rosto.",
  },
];
