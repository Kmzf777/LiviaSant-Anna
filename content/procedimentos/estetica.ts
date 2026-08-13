import type { Procedimento } from "../tipos";

/**
 * Estética facial — um procedimento na v1.
 *
 *   toxina-botulinica
 *
 * O texto evita dois vícios comuns desta categoria: prometer resultado e citar
 * marca comercial como se fosse diferencial. Nenhum nome comercial de toxina
 * aparece aqui — a escolha da apresentação é decisão clínica, discutida na
 * consulta, e não argumento de venda.
 */
export const PROCEDIMENTOS_ESTETICA: readonly Procedimento[] = [
  {
    slug: "toxina-botulinica",
    hub: "estetica-facial",
    nome: "Toxina botulínica",
    seo: {
      titulo: "Toxina botulínica em Belo Horizonte | Lívia Sant'Anna",
      descricao:
        "Aplicação de toxina botulínica no terço superior e full face, com avaliação da anatomia e da expressão. Como funciona, duração e riscos reais.",
    },

    eyebrow: "Estética facial · Sem cirurgia",
    h1: "Toxina botulínica",
    lead: "Expressão é anatomia. Tratar músculo sem entender como o seu rosto se move é o que produz aquele resultado que todo mundo reconhece de longe.",

    oQueE: [
      "A toxina botulínica é uma proteína que bloqueia temporariamente o sinal entre o nervo e o músculo. Aplicada em pontos específicos, ela reduz a força de contração daquele músculo — e, com isso, suaviza a ruga que a contração produz na pele.",
      "É importante separar dois tipos de ruga. A ruga dinâmica aparece quando você faz a expressão e some quando o rosto relaxa: essa é a que a toxina trata. A ruga estática já está marcada na pele em repouso, resultado de anos de dobra e de perda de colágeno: essa a toxina suaviza parcialmente, com o tempo e com aplicações repetidas, mas não apaga.",
      "O tratamento clássico é do terço superior: testa, glabela — a região entre as sobrancelhas — e o canto dos olhos. O chamado full face acrescenta pontos em outras áreas, como o nariz, o lábio superior, o queixo, o pescoço e a musculatura que puxa o canto da boca para baixo, sempre em doses menores e mais calculadas.",
      "O planejamento não é um mapa de pontos igual para todo mundo. Músculos têm força e distribuição diferentes em cada pessoa, e o mesmo padrão de aplicação produz resultados distintos em rostos distintos. O exame começa pedindo que você faça as expressões — é olhando o rosto em movimento que se decide onde aplicar e o quanto.",
      "É um tratamento temporário, e isso não é um defeito: é o que permite ajustar a dose e o desenho a cada sessão, conforme a resposta do seu rosto.",
    ],

    indicacoes: [
      "Rugas dinâmicas do terço superior: linhas horizontais da testa, vinco entre as sobrancelhas e rugas do canto dos olhos.",
      "Sobrancelha com posição ou desenho que incomoda, quando um ajuste discreto de altura é possível pelo equilíbrio entre músculos.",
      "Rugas do nariz, do lábio superior e do queixo com aspecto irregular, e canto da boca puxado para baixo — pontos do chamado full face.",
      "Sorriso gengival em casos selecionados, com dose pequena e avaliação cuidadosa.",
      "Bandas do músculo platisma no pescoço.",
      "Bruxismo e hipertrofia do músculo masseter, com indicação funcional e estética.",
      "Suor excessivo nas axilas, nas mãos ou nos pés — a hiperidrose, uma indicação médica clássica.",
      "Não é indicada durante a gestação ou a amamentação, em doenças neuromusculares como miastenia gravis, em infecção ativa no local de aplicação, nem em quem já teve reação a alguma apresentação da toxina.",
    ],

    comoEFeito: [
      "A avaliação vem primeiro: examino o rosto em repouso e em movimento, observo a assimetria que já existe — e existe em todo rosto — e defino os pontos e as doses a partir disso.",
      "A aplicação é feita com agulha muito fina, em pontos marcados na pele, na dose calculada para cada músculo. O procedimento em si leva poucos minutos.",
      "O desconforto é pequeno e comparável a picadas rápidas. Anestésico tópico ou gelo podem ser usados em quem tem mais sensibilidade.",
      "Não há necessidade de repouso nem de afastamento. Você sai e retoma o dia, evitando por algumas horas deitar, massagear a região, fazer exercício intenso e calor forte.",
      "O efeito começa a aparecer entre o segundo e o quinto dia e se completa por volta de duas semanas. É nesse retorno que se avalia o resultado e se faz qualquer complemento de dose, quando necessário.",
      "A escolha da apresentação da toxina é decisão clínica, feita na consulta conforme a indicação e o histórico. [CONFIRMAR: apresentações que ela trabalha e política de retorno para ajuste de dose.]",
    ],

    fichaTecnica: {
      duracao: "15 a 30 minutos, incluindo a avaliação e a marcação",
      anestesia:
        "Nenhuma na maioria dos casos. Anestésico tópico ou gelo, se você preferir",
      internacao: "Nenhuma. Procedimento de consultório",
      retornoSocial:
        "Imediato, com possibilidade de vermelhidão ou pequeno hematoma nos pontos",
      disclaimer:
        "Estas são faixas habituais, não um compromisso. Doses, número de pontos, duração do efeito e resposta ao tratamento variam conforme a força muscular, o metabolismo e o histórico de cada paciente.",
    },

    recuperacao: [
      {
        periodo: "Primeiras 4 horas",
        descricao:
          "Pequenas elevações nos pontos de aplicação, que somem em minutos. Evite deitar, massagear ou esfregar a região, fazer exercício intenso, sauna e exposição a calor forte. Vermelhidão discreta é comum e passa no mesmo dia.",
      },
      {
        periodo: "Primeiras 48 horas",
        descricao:
          "Pode aparecer dor de cabeça leve, mais frequente na primeira aplicação da vida. Pequenos hematomas nos pontos são possíveis e cobríveis com maquiagem a partir do dia seguinte. Nenhuma restrição de trabalho ou de vida social.",
      },
      {
        periodo: "Dias 2 a 5",
        descricao:
          "O efeito começa a aparecer, geralmente de forma desigual entre os lados — um lado responde antes do outro, e isso não significa que ficou assimétrico. Não conclua nada sobre o resultado nesta fase.",
      },
      {
        periodo: "Dias 10 a 15",
        descricao:
          "Efeito completo e momento correto de avaliar. É neste retorno que se corrige o que precisa ser corrigido, com complemento de dose em pontos específicos, quando indicado.",
      },
      {
        periodo: "Meses 3 a 5",
        descricao:
          "O efeito vai reduzindo progressivamente e o movimento volta. A duração média fica entre três e cinco meses e varia bastante de pessoa para pessoa. Nova aplicação é feita conforme o retorno do movimento, não conforme o calendário.",
      },
    ],

    riscosELimites: [
      {
        titulo: "Queda da pálpebra ou da sobrancelha",
        descricao:
          "É a complicação mais temida e acontece em uma pequena parcela das aplicações, descrita na literatura em torno de 1 a 5 por cento conforme a região e a técnica. Resulta da difusão da toxina para um músculo vizinho. Não tem correção imediata: melhora sozinha ao longo de semanas, e colírios específicos podem atenuar a queda da pálpebra enquanto isso.",
      },
      {
        titulo: "Assimetria",
        descricao:
          "Os dois lados do rosto respondem em tempos e intensidades diferentes, e todo rosto já é assimétrico antes de qualquer aplicação. Diferença perceptível pode ocorrer e costuma ser ajustada no retorno de duas semanas com pequeno complemento de dose.",
      },
      {
        titulo: "Hematomas, dor de cabeça e reações locais",
        descricao:
          "Pequenos hematomas nos pontos de aplicação são comuns e desaparecem em poucos dias. Dor de cabeça leve nas primeiras 48 horas acontece com alguma frequência, sobretudo na primeira aplicação. Reação alérgica é rara.",
      },
      {
        titulo: "Expressão rígida ou artificial",
        descricao:
          "Dose alta demais ou pontos mal escolhidos produzem uma testa imóvel e um rosto que não expressa — o resultado que se reconhece de longe. É evitável com planejamento e dose conservadora, e é reversível, porque o efeito passa. Mas passar leva meses.",
      },
      {
        titulo: "O que a toxina não resolve",
        descricao:
          "Ela não trata flacidez, não repõe volume perdido, não elimina rugas já marcadas em repouso e não substitui cirurgia. Quando a queixa é queda de sobrancelha ou excesso de pele na pálpebra, o tratamento correto é cirúrgico, e insistir na toxina só adia a conversa.",
      },
      {
        titulo: "Efeito temporário e resistência",
        descricao:
          "O efeito dura em média de três a cinco meses e depois desaparece por completo. Uma parcela pequena de pessoas desenvolve anticorpos e responde cada vez menos ao longo dos anos — risco associado a doses altas e a aplicações com intervalos muito curtos, o que é um dos motivos para não antecipar sessões.",
      },
      {
        titulo: "Situações em que não se aplica",
        descricao:
          "Gestação, amamentação, doenças neuromusculares, infecção ativa no local e reação prévia à toxina são contraindicações. Alguns antibióticos e medicações interferem no efeito, e por isso a lista do que você usa é perguntada antes de qualquer aplicação.",
      },
    ],

    antesDepois: [],

    faq: [
      {
        pergunta: "Vou ficar com o rosto sem expressão?",
        resposta:
          "Não é o objetivo, e depende inteiramente de dose e de planejamento. Testa completamente imóvel é resultado de aplicação pesada, não uma consequência inevitável do tratamento. Quando a preferência é manter bastante movimento, isso é dito antes e a dose acompanha.",
      },
      {
        pergunta: "Quanto tempo dura?",
        resposta:
          "Em média de três a cinco meses, com variação grande entre pessoas. Musculatura forte, metabolismo acelerado e atividade física intensa tendem a reduzir a duração. O retorno é marcado pelo retorno do movimento, não por uma data fixa no calendário.",
      },
      {
        pergunta: "Se eu parar, minhas rugas ficam piores?",
        resposta:
          "Não. Ao parar, o músculo recupera a força que tinha e as rugas voltam a ser o que seriam com o passar dos anos, sem qualquer efeito rebote. A impressão de piora costuma vir da comparação com o rosto tratado, não com o rosto de antes.",
      },
      {
        pergunta: "A partir de que idade dá para fazer?",
        resposta:
          "Não existe uma idade correta. O que define é a presença de ruga dinâmica que incomoda e o padrão de movimento do seu rosto. Aplicar muito cedo, sem indicação, é tratar um problema que ainda não existe.",
      },
      {
        pergunta: "Dói?",
        resposta:
          "Pouco. São picadas rápidas com agulha muito fina, e o procedimento inteiro leva poucos minutos. Gelo ou anestésico tópico podem ser usados se você for mais sensível.",
      },
      {
        pergunta: "Posso fazer antes de um evento?",
        resposta:
          "Dá, com antecedência. O efeito só se completa por volta de duas semanas, e o retorno de avaliação acontece nesse ponto. Aplicar na véspera de um compromisso importante é a receita para ir ao evento com o resultado ainda pela metade e sem tempo de ajustar.",
      },
      {
        pergunta: "Posso fazer se estiver amamentando?",
        resposta:
          "Não. Gestação e amamentação são contraindicações, e o tratamento é adiado. Não é uma formalidade: é a conduta padrão diante da ausência de estudos que sustentem a segurança nesses períodos.",
      },
    ],

    ctaFinal: "Agendar consulta",
    relacionados: ["blefaroplastia", "frontoplastia"],

    imagem: {
      tipo: "pendente",
      descricao:
        "Ilustração vetorial em linha filete do terço superior da face com os grupos musculares tratados",
    },
  },
];
