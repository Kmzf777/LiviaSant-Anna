import type { Procedimento } from "../tipos";

/**
 * Otorrinolaringologia — cinco procedimentos.
 *
 *   desvio-de-septo · amigdalas-e-adenoides · sinusite ·
 *   tubo-de-ventilacao · timpanoplastia
 *
 * Ordem de exibição no hub = ordem deste array.
 *
 * Regra de escrita destes textos: descrever o procedimento como ele é, com os
 * números que a literatura sustenta e sem atribuir estatística pessoal a ela.
 * Onde o dado depende de decisão ou de rotina próprias da médica, o texto traz
 * [CONFIRMAR] em vez de um número inventado.
 *
 * A seção `riscosELimites` é escrita para ser lida, não para se proteger. Ela
 * é a peça de maior conversão do site: quem lê risco escrito com honestidade
 * confia mais do que quem lê promessa.
 */
export const PROCEDIMENTOS_OTORRINO: readonly Procedimento[] = [
  // ---------------------------------------------------------------------------
  // Desvio de septo
  // ---------------------------------------------------------------------------
  {
    slug: "desvio-de-septo",
    hub: "otorrinolaringologia",
    nome: "Desvio de septo",
    seo: {
      titulo: "Cirurgia de desvio de septo em BH",
      descricao:
        "Septoplastia para quem não respira bem pelo nariz: como é a cirurgia, ficha técnica, recuperação semana a semana e riscos, sem eufemismo.",
    },

    eyebrow: "Otorrinolaringologia · Função",
    h1: "Desvio de septo e cirurgia para respirar melhor",
    lead: "Nem todo desvio precisa de cirurgia. O que decide não é a imagem do exame, é o quanto ele atrapalha a sua respiração.",

    oQueE: [
      "O septo é a parede que divide as duas narinas: cartilagem na frente, osso atrás, revestidos por mucosa dos dois lados. Quando essa parede não está no meio, um dos lados fica estreito e o ar passa com dificuldade.",
      "Quase todo mundo tem algum grau de desvio, e a maioria das pessoas nunca vai saber disso. Por isso a conversa na consulta não começa pelo laudo da tomografia: começa por como você dorme, por qual lado entope, se entope o tempo todo ou por crises, e pelo que já foi tentado com remédio.",
      "A cirurgia que corrige o septo chama-se septoplastia. Ela endireita a estrutura por dentro do nariz e não muda o formato externo. Quando os cornetos — as estruturas laterais que aquecem e umidificam o ar — também estão aumentados, os dois problemas são tratados no mesmo tempo cirúrgico.",
      "Se, além da respiração, o formato do nariz também te incomoda, a conversa muda: passa a ser uma rinosseptoplastia, mesma anestesia e mesmo acesso, planejamento diferente. Vale decidir isso antes, porque reoperar um nariz já operado é sempre mais difícil do que operar pela primeira vez.",
    ],

    indicacoes: [
      "Obstrução nasal persistente, de um lado ou dos dois, que não melhora com tratamento clínico bem conduzido — lavagem nasal, corticoide tópico e controle de alergia por tempo suficiente.",
      "Respiração pela boca durante o sono, ronco, boca seca ao acordar, sono que não descansa.",
      "Sinusites de repetição favorecidas pelo estreitamento da passagem de ar.",
      "Sangramentos nasais recorrentes vindos do ponto de desvio, onde a mucosa fica esticada e ressecada.",
      "Dificuldade de tolerar o aparelho de CPAP por obstrução nasal, em quem já tem apneia do sono diagnosticada.",
      "Necessidade de acesso cirúrgico aos seios da face que o septo desviado impede.",
    ],

    comoEFeito: [
      "A septoplastia é feita inteiramente por dentro das narinas. Não há corte externo e não há cicatriz aparente no rosto.",
      "Descolo a mucosa que reveste o septo dos dois lados, retiro ou reposiciono as porções desviadas de cartilagem e de osso, e devolvo a mucosa sobre a estrutura corrigida. Preservo o máximo de cartilagem possível: ela é o suporte do nariz, e um septo esvaziado demais compromete a sustentação da ponta e do dorso anos depois.",
      "Quando os cornetos inferiores estão hipertrofiados, reduzo o volume deles poupando a mucosa. Essa cobertura é o que aquece e umidifica o ar — retirar corneto em excesso resolve a queixa no primeiro mês e cria um nariz seco e desconfortável no longo prazo.",
      "No fim, uso pontos internos absorvíveis e, em parte dos casos, lâminas finas de silicone apoiando o septo por alguns dias. O tamponamento antigo, aquele bloco de gaze que assusta todo mundo, deixou de ser rotina.",
      "O procedimento é feito em centro cirúrgico, sob anestesia geral, e a alta costuma sair no mesmo dia.",
    ],

    fichaTecnica: {
      duracao:
        "40 a 90 minutos, conforme o desvio e a necessidade de tratar os cornetos",
      anestesia: "Geral",
      internacao: "Alta no mesmo dia, na maioria dos casos",
      retornoSocial: "5 a 7 dias",
      disclaimer:
        "Estas são faixas habituais, não um compromisso. Duração, tipo de anestesia, tempo de internação e recuperação variam conforme a anatomia, os achados durante a cirurgia e o histórico de cada paciente, e são definidos individualmente no planejamento.",
    },

    recuperacao: [
      {
        periodo: "Primeiras 48 horas",
        descricao:
          "Nariz entupido, como numa gripe forte — o inchaço interno é maior do que o desvio que foi corrigido, então a respiração melhora depois, não na saída do centro cirúrgico. Dor costuma ser leve a moderada e responde bem a analgésico comum. Sangramento discreto em gotas é esperado. Durma com a cabeceira elevada e mantenha gelo sobre o rosto em intervalos curtos.",
      },
      {
        periodo: "Dias 3 a 7",
        descricao:
          "Retirada das lâminas de silicone, quando foram usadas — incomoda por alguns segundos e alivia bastante. Começam as lavagens nasais com soro em volume generoso, várias vezes ao dia: elas são a parte mais importante da recuperação e a que mais depende de você. Crostas e secreção escura são normais nesta fase.",
      },
      {
        periodo: "Semanas 2 e 3",
        descricao:
          "A respiração fica alternada: dias bons e dias em que volta a entupir, conforme a mucosa cicatriza e desincha em ritmos diferentes. Liberação para trabalho sem esforço físico costuma acontecer no início da semana 2. Nada de academia, nada de peso, nada de assoar o nariz com força.",
      },
      {
        periodo: "Mês 1",
        descricao:
          "Retorno gradual à atividade física, começando por caminhada. A maioria das pessoas já percebe com clareza o ganho na respiração aqui, embora ainda com oscilações.",
      },
      {
        periodo: "Meses 2 a 3",
        descricao:
          "Cicatrização interna essencialmente concluída e resultado funcional estabilizado. É neste ponto que avaliamos, com você, se o objetivo da cirurgia foi atingido — e não antes.",
      },
    ],

    riscosELimites: [
      {
        titulo: "A obstrução pode não resolver por completo",
        descricao:
          "A respiração nasal depende de mais coisas do que o septo: alergia, rinite, tamanho dos cornetos, válvula nasal, pólipos. Corrigir o septo trata uma dessas causas. Em uma parcela dos casos, a queixa persiste em algum grau e o tratamento clínico continua sendo necessário depois da cirurgia. Isso é conversado antes, não descoberto depois.",
      },
      {
        titulo: "Sangramento",
        descricao:
          "Sangramento em gotas nos primeiros dias é esperado. Sangramento volumoso é incomum, mas acontece, e em casos raros exige tamponamento ou uma revisão em centro cirúrgico. Quem usa anticoagulante ou tem distúrbio de coagulação precisa dizer isso na consulta: muda o preparo e às vezes muda a indicação.",
      },
      {
        titulo: "Perfuração do septo",
        descricao:
          "Se a mucosa se rompe nos dois lados no mesmo ponto, pode ficar um furo comunicando as narinas. É pouco frequente e, quando pequeno, costuma ser assintomático. Quando maior, provoca crostas, sangramento e um assobio ao respirar, e pode exigir uma segunda cirurgia para fechar.",
      },
      {
        titulo: "Sinéquias e necessidade de revisão",
        descricao:
          "Sinéquia é uma aderência entre o septo e a parede lateral do nariz, formada durante a cicatrização. Costuma ser desfeita no consultório, com anestesia local. Uma parte dos pacientes precisa de algum ajuste cirúrgico posterior — a septoplastia é uma cirurgia de bom resultado, mas não é uma cirurgia de resultado idêntico em todo mundo.",
      },
      {
        titulo: "Alteração da sustentação e do formato do nariz",
        descricao:
          "Retirar cartilagem em excesso pode enfraquecer o suporte do dorso e da ponta, com afundamento perceptível meses ou anos depois. É um risco raro e diretamente ligado à técnica: por isso preservo cartilagem sempre que possível e reforço a estrutura quando o septo está muito comprometido.",
      },
      {
        titulo: "Alterações de olfato e dormência nos dentes",
        descricao:
          "Redução temporária do olfato nas primeiras semanas é comum, pelo inchaço. Perda permanente é rara. Dormência nos dentes superiores da frente e no palato aparece com alguma frequência e costuma regredir em semanas a poucos meses.",
      },
      {
        titulo: "Riscos da anestesia geral",
        descricao:
          "Existem e são discutidos na avaliação pré-anestésica, que é obrigatória. Não existe cirurgia sem riscos, e a conversa honesta sobre eles faz parte do consentimento — no papel e antes dele.",
      },
    ],

    antesDepois: [],

    faq: [
      {
        pergunta: "Todo desvio de septo precisa de cirurgia?",
        resposta:
          "Não. A maioria dos desvios não produz sintoma nenhum e não deve ser operada. A cirurgia entra quando a obstrução atrapalha o seu dia e o seu sono, e quando o tratamento clínico bem feito não resolveu. Desvio visto em tomografia pedida por outro motivo, sem queixa, não é indicação.",
      },
      {
        pergunta: "A cirurgia muda o formato do meu nariz?",
        resposta:
          "A septoplastia isolada trabalha por dentro e não tem como objetivo mudar o formato externo. Em desvios muito acentuados, que também entortam o nariz por fora, corrigir a função pode alterar levemente a aparência — e isso é conversado e planejado antes. Se você quer mudança estética, o procedimento indicado é a rinosseptoplastia.",
      },
      {
        pergunta: "Vou ficar com aquele tampão no nariz?",
        resposta:
          "O tamponamento clássico de gaze deixou de ser rotina. Em boa parte dos casos uso lâminas finas de silicone, muito mais confortáveis, retiradas entre o terceiro e o sétimo dia. Elas incomodam por poucos segundos na retirada.",
      },
      {
        pergunta: "Quando eu vou respirar bem de verdade?",
        resposta:
          "Não na primeira semana. O nariz sai da cirurgia inchado por dentro e entope mais do que antes por alguns dias. A melhora costuma aparecer entre a segunda e a quarta semana, com oscilações, e o resultado funcional estabiliza por volta do terceiro mês.",
      },
      {
        pergunta: "Posso operar junto com a cirurgia de sinusite?",
        resposta:
          "Sim, e é comum: o desvio muitas vezes é parte do que dificulta a drenagem dos seios da face. Fazer as duas coisas no mesmo tempo cirúrgico evita uma segunda anestesia. O que define isso é o exame de imagem e o quadro clínico.",
      },
      {
        pergunta: "Quanto tempo preciso ficar afastado do trabalho?",
        resposta:
          "Para trabalho sem esforço físico, de 5 a 7 dias costuma ser suficiente. Para atividade que exige força ou exposição a poeira e calor, o afastamento é maior. O número que vale para você sai da consulta.",
      },
      {
        pergunta: "Quanto custa e o meu convênio cobre?",
        resposta:
          "[CONFIRMAR: convênios atendidos e política de reembolso.] A septoplastia com indicação funcional tem cobertura prevista no rol da ANS quando os critérios clínicos são preenchidos, e o relatório médico é emitido no consultório.",
      },
    ],

    ctaFinal: "Agendar consulta",
    relacionados: ["sinusite", "rinoplastia"],

    imagem: {
      tipo: "pendente",
      descricao:
        "Ilustração vetorial em linha filete do septo nasal e do fluxo de ar pelas duas fossas",
    },
  },

  // ---------------------------------------------------------------------------
  // Amígdalas e adenoides
  // ---------------------------------------------------------------------------
  {
    slug: "amigdalas-e-adenoides",
    hub: "otorrinolaringologia",
    nome: "Amígdalas e adenoides",
    seo: {
      titulo: "Cirurgia de amígdalas e adenoides",
      descricao:
        "Quando operar amígdalas e adenoides em crianças e adultos: critérios, como é a cirurgia, recuperação dia a dia e riscos. Belo Horizonte, MG.",
    },

    eyebrow: "Otorrinolaringologia · Função",
    h1: "Cirurgia de amígdalas e adenoides",
    lead: "A pergunta certa não é se dá para operar, é se precisa. Existem critérios objetivos, e eles são explicados na consulta.",

    oQueE: [
      "Amígdalas e adenoide fazem parte do sistema de defesa da garganta e do nariz. Elas trabalham, sobretudo, nos primeiros anos de vida — e é justamente nessa fase que podem crescer a ponto de atrapalhar a respiração e o sono, ou infeccionar com frequência demais.",
      "A adenoide fica atrás do nariz, num lugar que não dá para ver pela boca: é preciso nasofibroscopia ou raio-x para avaliá-la. As amígdalas são as duas estruturas visíveis nas laterais da garganta.",
      "A cirurgia pode retirar as duas (adenotonsilectomia), só as amígdalas (tonsilectomia) ou só a adenoide (adenoidectomia). Em parte dos casos de obstrução em crianças, é possível reduzir as amígdalas em vez de retirá-las por completo — a chamada tonsilotomia, que dói menos e sangra menos, com a contrapartida de poder haver novo crescimento.",
      "Retirar as amígdalas não deixa a criança sem defesa. O tecido linfoide do restante do corpo assume a função, e as evidências não mostram aumento de infecções depois da cirurgia bem indicada.",
    ],

    indicacoes: [
      "Ronco alto com pausas na respiração durante o sono, respiração pela boca, sono agitado, xixi na cama, sonolência ou irritabilidade durante o dia — o quadro de distúrbio respiratório do sono, hoje a indicação mais frequente em crianças.",
      "Amigdalites de repetição: em geral sete episódios em um ano, cinco por ano em dois anos seguidos ou três por ano em três anos seguidos, com documentação dos episódios.",
      "Otites de repetição ou secreção persistente no ouvido médio ligadas ao aumento da adenoide.",
      "Obstrução nasal crônica em criança que respira pela boca, com repercussão no crescimento da face e na posição dos dentes.",
      "Abscesso peritonsilar recorrente ou histórico de complicação de amigdalite.",
      "Cálculos amigdalianos frequentes com mau hálito persistente, quando o tratamento clínico não resolveu — indicação menos comum, mas legítima.",
      "Assimetria de amígdalas ou lesão de aspecto suspeito, para investigação.",
    ],

    comoEFeito: [
      "É feita pela boca, sob anestesia geral. Não há corte externo e não há cicatriz visível.",
      "As amígdalas são retiradas do seu leito, entre os pilares da garganta, e o sangramento é controlado ponto a ponto. A adenoide é removida por trás do nariz, com visão endoscópica ou por espelho, poupando as estruturas vizinhas da tuba auditiva.",
      "A escolha entre retirar por completo ou reduzir as amígdalas depende da razão da cirurgia: obstrução do sono em criança admite redução em casos selecionados; infecção de repetição pede a retirada total, porque o tecido que sobra continua infeccionando.",
      "Não há pontos para retirar. A área operada cicatriza sozinha, coberta por uma placa esbranquiçada que assusta quem olha e é exatamente o esperado.",
    ],

    fichaTecnica: {
      duracao: "30 a 60 minutos",
      anestesia: "Geral",
      internacao:
        "Alta no mesmo dia ou após uma noite, conforme a idade e o quadro",
      retornoSocial: "Crianças, 7 a 10 dias. Adultos, 10 a 14 dias",
      disclaimer:
        "Estas são faixas habituais, não um compromisso. Duração, tempo de internação e recuperação variam conforme a idade, o motivo da cirurgia e o histórico de cada paciente. Adultos doem mais e por mais tempo do que crianças — esse dado costuma ser subestimado e é dito abertamente na consulta.",
    },

    recuperacao: [
      {
        periodo: "Primeiras 24 horas",
        descricao:
          "Dor de garganta importante, que responde melhor a analgésico em horário fixo do que a analgésico só quando dói. Líquidos gelados e alimentos frios são liberados e ajudam. Enjoo e um pouco de sangue nas primeiras secreções podem acontecer. Febre baixa é comum.",
      },
      {
        periodo: "Dias 2 a 5",
        descricao:
          "A dor tende a piorar antes de melhorar, e frequentemente irradia para os ouvidos — não é infecção de ouvido, é o mesmo nervo. Mau hálito forte e placas brancas na garganta são o processo normal de cicatrização. Hidratação é a prioridade: criança que não bebe é criança que volta ao hospital.",
      },
      {
        periodo: "Dias 6 a 10",
        descricao:
          "Janela do sangramento tardio, quando as placas se soltam. Qualquer sangramento pela boca ou pelo nariz nesta fase pede contato imediato e avaliação, mesmo que pare sozinho. A alimentação vai voltando ao normal, ainda evitando alimentos duros, ácidos e muito quentes.",
      },
      {
        periodo: "Semanas 2 e 3",
        descricao:
          "Dor residual ao engolir, principalmente pela manhã. Retorno à escola ou ao trabalho de escritório costuma acontecer aqui, e a maioria das crianças volta antes disso. Voz e respiração noturna já mudaram de forma perceptível.",
      },
      {
        periodo: "Mês 1",
        descricao:
          "Cicatrização concluída, liberação para esporte e para alimentação sem restrição. O ganho no sono é o que as famílias mais relatam nesta fase.",
      },
    ],

    riscosELimites: [
      {
        titulo: "Sangramento pós-operatório",
        descricao:
          "O risco mais relevante desta cirurgia. Acontece em torno de 2 a 5 dos 100 pacientes, com maior frequência entre o quinto e o décimo dia, quando as placas de cicatrização se soltam. A maioria para sozinha, mas parte dos casos exige retorno ao centro cirúrgico para cauterizar. É por isso que sangramento nessa fase nunca deve ser observado em casa.",
      },
      {
        titulo: "Dor, e dor maior em adultos",
        descricao:
          "A dor desta cirurgia é subestimada com frequência. Em adultos costuma durar de dez a quatorze dias, é intensa nos primeiros dias, irradia para os ouvidos e atrapalha a alimentação. Analgesia em horário fixo, e não sob demanda, é o que funciona. Prometer recuperação leve aqui seria mentira.",
      },
      {
        titulo: "Desidratação",
        descricao:
          "A causa mais comum de retorno ao pronto-socorro depois da cirurgia, sobretudo em crianças pequenas que se recusam a beber por dor. Prevenir é controlar a dor e oferecer líquido gelado com insistência. Sinais de alerta como boca seca, pouca urina e prostração pedem avaliação no mesmo dia.",
      },
      {
        titulo: "Alteração da voz e escape de ar pelo nariz",
        descricao:
          "Mudança discreta da ressonância da voz é comum e esperada, sobretudo após adenoidectomia. Insuficiência velofaríngea persistente, quando a fala sai anasalada e líquidos escapam pelo nariz, é rara e costuma exigir fonoterapia. Crianças com alterações do palato têm risco maior e são avaliadas com atenção específica antes.",
      },
      {
        titulo: "Novo crescimento do tecido",
        descricao:
          "A adenoide pode voltar a crescer em crianças pequenas, e a amígdala reduzida em vez de retirada também. Isso não significa cirurgia mal feita: significa idade e tecido linfoide ativo. Uma parcela desses casos precisa de nova abordagem anos depois.",
      },
      {
        titulo: "Alterações de paladar e infecção",
        descricao:
          "Alteração temporária do paladar ocorre em parte dos pacientes e costuma normalizar em semanas. Infecção da área operada é incomum. Lesão de dentes, lábios ou língua pelo instrumental é rara e é discutida no consentimento.",
      },
      {
        titulo: "Riscos da anestesia geral",
        descricao:
          "Existem e são discutidos na avaliação pré-anestésica. Crianças com apneia importante têm monitorização diferenciada no pós-operatório imediato, e essa é uma das razões para a internação de uma noite em alguns casos.",
      },
    ],

    antesDepois: [],

    faq: [
      {
        pergunta: "Meu filho vai ficar sem defesa se tirar as amígdalas?",
        resposta:
          "Não. Amígdalas e adenoide são parte de um sistema de defesa amplo, e o restante do tecido linfoide assume a função. Os estudos que acompanham crianças operadas não mostram aumento de infecções depois de uma cirurgia bem indicada. O que muda, e muda bastante, é a qualidade do sono.",
      },
      {
        pergunta: "Existe idade mínima para operar?",
        resposta:
          "Não existe um número fixo. A cirurgia é feita mesmo em crianças pequenas quando a obstrução do sono é significativa, com cuidados anestésicos específicos. O que define a indicação é o quadro clínico, não a idade isolada.",
      },
      {
        pergunta: "Dá para tirar só a adenoide e deixar as amígdalas?",
        resposta:
          "Dá, e é frequente. Se a obstrução vem principalmente da adenoide e as amígdalas não estão grandes nem infeccionando, retirar só a adenoide é a conduta correta. A nasofibroscopia é o que separa esses cenários.",
      },
      {
        pergunta: "Por que a dor piora no terceiro dia?",
        resposta:
          "Porque a área operada cicatriza por segunda intenção, coberta por uma placa que se forma e depois se solta. Esse processo inflama e dói mais entre o terceiro e o sétimo dia. Saber disso antes evita o susto e evita abandonar o analgésico justamente quando ele é mais necessário.",
      },
      {
        pergunta: "O que fazer se sangrar em casa?",
        resposta:
          "Procurar atendimento imediatamente, mesmo que o sangramento pare sozinho, e mesmo que pareça pouco. Não espere para ver. Mantenha a pessoa sentada, com gelo no pescoço, sem enxaguar a boca com força, e vá ao pronto-socorro do hospital onde a cirurgia foi feita.",
      },
      {
        pergunta: "Adulto pode operar amígdala?",
        resposta:
          "Pode, e a indicação mais comum em adultos é amigdalite de repetição ou cálculos amigdalianos com mau hálito persistente. A recuperação é mais dolorida e mais longa do que na criança, em torno de dez a quatorze dias, e isso precisa entrar no planejamento do seu trabalho.",
      },
      {
        pergunta: "O ronco acaba depois da cirurgia?",
        resposta:
          "Na maioria das crianças com obstrução por amígdala e adenoide, o ronco reduz muito ou desaparece. Em adultos, e em crianças com obesidade ou alterações craniofaciais, a cirurgia é uma parte do tratamento, e a apneia pode persistir em algum grau, exigindo reavaliação com polissonografia.",
      },
    ],

    ctaFinal: "Agendar consulta",
    relacionados: ["tubo-de-ventilacao", "desvio-de-septo"],

    imagem: {
      tipo: "pendente",
      descricao:
        "Ilustração vetorial em linha filete da via aérea alta mostrando amígdalas e adenoide",
    },
  },

  // ---------------------------------------------------------------------------
  // Sinusite
  // ---------------------------------------------------------------------------
  {
    slug: "sinusite",
    hub: "otorrinolaringologia",
    nome: "Sinusite",
    seo: {
      titulo: "Tratamento cirúrgico da sinusite",
      descricao:
        "Sinusite crônica e de repetição: quando o tratamento clínico basta, quando a cirurgia endoscópica entra, como é feita e quais são os riscos.",
    },

    eyebrow: "Otorrinolaringologia · Função",
    h1: "Tratamento cirúrgico da sinusite",
    lead: "A cirurgia não substitui o tratamento clínico da sinusite crônica. Ela abre caminho para que o tratamento clínico funcione.",

    oQueE: [
      "Os seios da face são cavidades cheias de ar dentro dos ossos ao redor do nariz. Cada uma delas se comunica com a fossa nasal por uma abertura estreita. Quando essa abertura fecha, a secreção não drena, a mucosa inflama e o quadro se instala.",
      "Sinusite aguda é aquela que dura até quatro semanas, quase sempre viral, e a maioria dos casos se resolve sem antibiótico. Sinusite crônica é a que persiste por doze semanas ou mais, com obstrução nasal, secreção, dor ou pressão na face e redução do olfato. São doenças diferentes com tratamentos diferentes, e confundi-las é a origem de boa parte dos antibióticos tomados sem necessidade.",
      "A cirurgia endoscópica dos seios da face — sigla FESS, na literatura — não retira a sinusite. Ela amplia as vias de drenagem e remove o que obstrui, para que a mucosa volte a se limpar sozinha e para que o corticoide tópico alcance onde precisa alcançar.",
      "Por isso a frase mais importante desta página: quem opera sinusite crônica continua fazendo lavagem nasal e usando medicação tópica depois. Quem para tudo no dia seguinte à cirurgia costuma recidivar.",
    ],

    indicacoes: [
      "Sinusite crônica com doze semanas ou mais de sintomas, confirmada por tomografia e por endoscopia nasal, que não respondeu a tratamento clínico completo e bem conduzido.",
      "Polipose nasossinusal com obstrução e perda do olfato.",
      "Sinusites agudas de repetição, bem documentadas, com vários episódios ao ano.",
      "Complicação de sinusite aguda, como envolvimento da órbita ou do sistema nervoso central — situação de urgência.",
      "Bola fúngica ou sinusite fúngica em um seio isolado.",
      "Mucocele, cisto de retenção sintomático ou lesão que precisa de biópsia.",
      "Alterações anatômicas que fecham a drenagem, como concha bolhosa, célula de Haller ou desvio de septo obstruindo o complexo ostiomeatal.",
    ],

    comoEFeito: [
      "É feita por dentro do nariz, com endoscópio, sem corte externo. A imagem ampliada permite trabalhar em espaços de poucos milímetros perto da órbita e da base do crânio.",
      "Removo o que bloqueia a drenagem — tecido inflamado, pólipos, lamelas ósseas, cistos — e amplio as aberturas naturais de cada seio envolvido. A extensão da cirurgia varia: pode ser limitada a um seio ou envolver todos, conforme a tomografia.",
      "Preservo mucosa sempre que possível. A mucosa saudável é o que faz a limpeza natural do seio; retirá-la em excesso troca um problema por outro.",
      "Quando o desvio de septo participa da obstrução, corrijo no mesmo tempo cirúrgico. É comum, e evita uma segunda anestesia.",
      "Em casos selecionados, a navegação cirúrgica por imagem é usada como apoio. [CONFIRMAR: disponibilidade de navegação nos hospitais em que ela opera e em quais casos ela indica.]",
    ],

    fichaTecnica: {
      duracao: "60 a 150 minutos, conforme quantos seios são abordados",
      anestesia: "Geral",
      internacao: "Alta no mesmo dia ou após uma noite",
      retornoSocial: "7 a 10 dias",
      disclaimer:
        "Estas são faixas habituais, não um compromisso. A extensão da cirurgia, a duração e o tempo de recuperação variam muito conforme quantos seios estão envolvidos, a presença de pólipos e o histórico de cada paciente.",
    },

    recuperacao: [
      {
        periodo: "Primeiras 48 horas",
        descricao:
          "Nariz obstruído, secreção com sangue, pressão na face e cansaço. Dor costuma ser menor do que as pessoas esperam e responde a analgésico comum. Cabeceira elevada, gelo no rosto e repouso relativo.",
      },
      {
        periodo: "Dias 3 a 10",
        descricao:
          "Fase das crostas. O nariz produz secreção espessa e escura, e a sensação é de piora — não é. As lavagens nasais com soro em volume alto começam aqui e são o que define o resultado. Primeira limpeza endoscópica no consultório costuma acontecer nesta janela.",
      },
      {
        periodo: "Semanas 2 a 4",
        descricao:
          "Retorno ao trabalho sem esforço físico, em geral a partir do sétimo ao décimo dia. Novas limpezas no consultório, conforme a necessidade. A respiração e o olfato começam a melhorar de forma perceptível, com oscilação entre os dias.",
      },
      {
        periodo: "Meses 2 e 3",
        descricao:
          "Cicatrização da mucosa se completando. Retomada do corticoide tópico ou de outra medicação de manutenção, conforme a causa da sua sinusite. É o momento de avaliar o resultado com honestidade e ajustar o tratamento clínico de longo prazo.",
      },
      {
        periodo: "Depois disso",
        descricao:
          "Acompanhamento periódico, sobretudo em polipose e em doença inflamatória tipo 2, que têm tendência real a recidivar. Cirurgia bem feita e seguimento abandonado é a combinação que traz o problema de volta.",
      },
    ],

    riscosELimites: [
      {
        titulo: "A sinusite pode voltar",
        descricao:
          "A cirurgia trata a obstrução, não a inflamação de base. Em rinossinusite com pólipos, especialmente associada a asma e a intolerância a anti-inflamatórios, a recidiva é frequente e uma parcela dos pacientes precisa de nova cirurgia anos depois. Dizer o contrário seria vender uma cura que não existe.",
      },
      {
        titulo: "Sangramento",
        descricao:
          "Sangramento discreto por alguns dias é esperado. Sangramento importante que exija tamponamento ou retorno ao centro cirúrgico é incomum. Uso de anticoagulante, hipertensão não controlada e doença com muitos pólipos aumentam esse risco e mudam o preparo.",
      },
      {
        titulo: "Complicações orbitárias",
        descricao:
          "Os seios da face são separados da órbita por uma lâmina óssea de espessura de papel. Lesão dessa parede pode causar hematoma na órbita, visão dupla por alteração de um músculo ocular e, muito raramente, perda visual. São eventos raros, medidos em fração de 1 por cento na literatura, e é por isso que a cirurgia é feita com endoscópio e com tomografia estudada antes.",
      },
      {
        titulo: "Fístula liquórica",
        descricao:
          "A parte alta dos seios etmoidais faz fronteira com a base do crânio. Uma lesão nesse ponto pode permitir a saída de líquido cefalorraquidiano pelo nariz. É rara, geralmente identificada e reparada no mesmo ato cirúrgico, e a principal preocupação associada é o risco de meningite se não for tratada.",
      },
      {
        titulo: "Sinéquias e reestenose",
        descricao:
          "Aderências entre as paredes internas do nariz podem se formar durante a cicatrização e fechar de novo o caminho que foi aberto. Costumam ser desfeitas no consultório, e é justamente para identificá-las cedo que as limpezas endoscópicas do pós-operatório existem.",
      },
      {
        titulo: "Alterações do olfato",
        descricao:
          "Boa parte das pessoas melhora o olfato depois da cirurgia, sobretudo quem tinha pólipos. Mas o olfato pode não voltar, e em casos raros pode piorar. Quem já perdeu o olfato há muitos anos tem chance menor de recuperá-lo, e isso é dito antes da cirurgia, não depois.",
      },
      {
        titulo: "Riscos da anestesia geral",
        descricao:
          "Existem e são discutidos na avaliação pré-anestésica, obrigatória antes de qualquer cirurgia sob anestesia geral.",
      },
    ],

    antesDepois: [],

    faq: [
      {
        pergunta: "Toda sinusite precisa de antibiótico?",
        resposta:
          "Não. A grande maioria das sinusites agudas é viral e melhora com lavagem nasal, analgésico e tempo. O antibiótico tem indicação em critérios específicos: sintomas muito intensos, quadro que dura além de dez dias sem melhora, ou piora depois de uma melhora inicial. Tomar antibiótico a cada resfriado não previne sinusite crônica.",
      },
      {
        pergunta: "Quando a cirurgia entra?",
        resposta:
          "Quando o tratamento clínico completo, feito por tempo suficiente, não resolveu, e a tomografia junto com a endoscopia mostram doença que justifique operar. Cirurgia de sinusite indicada sem tratamento clínico prévio bem feito é a receita para um resultado frustrante.",
      },
      {
        pergunta: "Vou parar de tomar remédio depois de operar?",
        resposta:
          "Provavelmente não, e essa é a parte que costuma surpreender. A cirurgia abre o caminho para que a medicação tópica alcance a mucosa. Em polipose, o tratamento de manutenção segue por tempo indeterminado, e é ele que segura a recidiva.",
      },
      {
        pergunta: "A cirurgia é feita por fora, com corte no rosto?",
        resposta:
          "Não. É endoscópica, feita inteiramente por dentro do nariz. Abordagens externas ficaram restritas a situações específicas, hoje pouco frequentes.",
      },
      {
        pergunta: "Dói muito?",
        resposta:
          "Menos do que a maioria imagina. O desconforto principal é a obstrução nasal e a pressão na face nos primeiros dias, e a dor costuma ser controlada com analgésico comum. O que mais incomoda é a fase de crostas, entre o terceiro e o décimo dia.",
      },
      {
        pergunta: "Por que preciso voltar tantas vezes ao consultório?",
        resposta:
          "Porque a limpeza endoscópica no pós-operatório é parte do tratamento, não formalidade. É nela que crostas e aderências em formação são removidas, e é ela que separa uma cavidade que cicatriza aberta de uma que fecha de novo.",
      },
      {
        pergunta: "Sinusite tem relação com desvio de septo e com alergia?",
        resposta:
          "Com frequência, sim. O desvio pode estreitar a região de drenagem, e a rinite alérgica mantém a mucosa inflamada. Tratar a sinusite sem tratar a alergia associada é resolver metade — e o mesmo raciocínio vale para o septo.",
      },
    ],

    ctaFinal: "Agendar consulta",
    relacionados: ["desvio-de-septo", "amigdalas-e-adenoides"],

    imagem: {
      tipo: "pendente",
      descricao:
        "Ilustração vetorial em linha filete dos seios da face e das vias de drenagem",
    },
  },

  // ---------------------------------------------------------------------------
  // Tubo de ventilação
  // ---------------------------------------------------------------------------
  {
    slug: "tubo-de-ventilacao",
    hub: "otorrinolaringologia",
    nome: "Tubo de ventilação",
    seo: {
      titulo: "Tubo de ventilação no ouvido",
      descricao:
        "Colocação de tubo de ventilação em crianças e adultos: quando é indicado, como é feito, cuidados com água, riscos e o que esperar depois.",
    },

    eyebrow: "Otorrinolaringologia · Função",
    h1: "Tubo de ventilação no ouvido",
    lead: "Um tubo de poucos milímetros que devolve ar ao ouvido médio — e, muitas vezes, devolve audição a uma criança que parecia distraída.",

    oQueE: [
      "O ouvido médio é uma câmara de ar atrás do tímpano, ventilada por um canal chamado tuba auditiva, que se abre na parte de trás do nariz. Quando essa tuba não funciona bem, o ar não entra, forma-se pressão negativa e a cavidade se enche de secreção.",
      "É a otite média com efusão, ou otite serosa: sem dor, sem febre, muitas vezes sem nenhum sinal evidente. A criança escuta menos, aumenta o volume da televisão, pede para repetir, parece desatenta na escola — e ninguém suspeita do ouvido.",
      "O tubo de ventilação é uma peça minúscula, de silicone ou fluoroplástico, colocada no tímpano. Ele não é um dreno permanente: é um respiradouro que substitui a função da tuba enquanto ela amadurece.",
      "A maioria dos tubos de curta permanência sai sozinha, empurrada pelo próprio crescimento do tímpano, entre seis e dezoito meses. O furo por onde ele estava fecha na sequência, na maioria dos casos.",
    ],

    indicacoes: [
      "Otite média com efusão persistente por três meses ou mais nos dois ouvidos, com perda auditiva documentada por audiometria e imitanciometria.",
      "Otites médias agudas de repetição, em geral três episódios em seis meses ou quatro em um ano, com secreção presente no ouvido entre as crises.",
      "Retração do tímpano com risco de aderência ou de formação de colesteatoma.",
      "Atraso de fala ou queda de desempenho escolar associados à perda auditiva por secreção no ouvido médio.",
      "Barotrauma de repetição em adultos, ligado a viagens aéreas ou a mergulho.",
      "Necessidade de ventilação do ouvido antes de radioterapia da região ou em disfunção tubária persistente do adulto.",
    ],

    comoEFeito: [
      "É um procedimento curto, feito pelo conduto auditivo, com microscópio ou endoscópio. Não há corte externo e não há cicatriz visível.",
      "Faço uma pequena incisão no tímpano — a miringotomia —, aspiro a secreção acumulada no ouvido médio e encaixo o tubo nessa abertura. O tímpano segura o tubo pela própria elasticidade.",
      "Em crianças, é feito sob anestesia geral, e é uma das anestesias mais curtas da otorrinolaringologia. Em adultos selecionados, pode ser feito no consultório com anestesia local.",
      "Quando a adenoide aumentada é parte da causa da disfunção da tuba, retirá-la no mesmo tempo cirúrgico reduz a chance de precisar de um segundo tubo mais adiante.",
      "A audição costuma melhorar imediatamente, ainda no mesmo dia — é a mudança mais rápida que existe em otorrinolaringologia pediátrica.",
    ],

    fichaTecnica: {
      duracao: "10 a 20 minutos",
      anestesia: "Geral em crianças. Local em adultos selecionados",
      internacao: "Alta no mesmo dia",
      retornoSocial: "1 a 2 dias",
      disclaimer:
        "Estas são faixas habituais, não um compromisso. Duração, tipo de anestesia e tempo de permanência do tubo variam conforme a idade, o modelo de tubo escolhido e o quadro de cada paciente.",
    },

    recuperacao: [
      {
        periodo: "Primeiro dia",
        descricao:
          "Dor mínima ou ausente. Pode haver saída de secreção pelo conduto nas primeiras horas e sensação de som mais alto, porque a audição melhora de imediato. Crianças costumam voltar à rotina no mesmo dia.",
      },
      {
        periodo: "Primeira semana",
        descricao:
          "Uso de gotas otológicas quando prescritas. Retorno à escola em um ou dois dias. Nesta fase se estabelece a rotina de proteger o ouvido da entrada de água, conforme a orientação dada no seu caso.",
      },
      {
        periodo: "Primeiros meses",
        descricao:
          "Consultas de acompanhamento para conferir se o tubo continua no lugar e permeável, e audiometria de controle. Episódios de secreção saindo pelo ouvido podem acontecer e costumam ser tratados com gotas, sem antibiótico por via oral.",
      },
      {
        periodo: "6 a 18 meses",
        descricao:
          "Período habitual em que o tubo de curta permanência se solta sozinho e é eliminado. O acompanhamento verifica se o tímpano fechou e se a secreção não voltou.",
      },
    ],

    riscosELimites: [
      {
        titulo: "Otorreia — secreção saindo pelo ouvido",
        descricao:
          "É a intercorrência mais comum com tubo, e acontece em cerca de 15 a 25 de cada 100 crianças em algum momento. Costuma ser tratada com gotas otológicas com antibiótico, sem necessidade de remédio por via oral. Não significa que o tubo falhou nem que precisa ser retirado.",
      },
      {
        titulo: "Perfuração que não fecha",
        descricao:
          "Depois que o tubo sai, o pequeno furo do tímpano costuma fechar sozinho. Em uma pequena parcela dos casos — a literatura descreve algo em torno de 1 a 3 por cento com tubos de curta permanência, e mais com tubos de longa permanência — ele permanece aberto e pode exigir uma timpanoplastia para fechar.",
      },
      {
        titulo: "Extrusão precoce ou tubo que não sai",
        descricao:
          "O tubo pode se soltar antes do tempo, e o problema volta, exigindo um novo procedimento. Pode também permanecer no lugar por tempo demais, e nesse caso precisa ser retirado. Nenhum dos dois cenários é falha de técnica: depende de como o tímpano cresce.",
      },
      {
        titulo: "Timpanosclerose e alterações do tímpano",
        descricao:
          "Placas esbranquiçadas de calcificação no tímpano são achado frequente depois de tubos e, na maioria das vezes, não afetam a audição. Retração ou afinamento localizado da membrana podem ocorrer, sobretudo em quem usou vários tubos ao longo dos anos.",
      },
      {
        titulo: "O problema pode voltar",
        descricao:
          "O tubo não corrige a tuba auditiva, apenas compensa a função dela enquanto está no lugar. Uma parcela das crianças precisa de um segundo conjunto de tubos, e nesses casos a retirada da adenoide costuma entrar na conversa.",
      },
      {
        titulo: "Riscos da anestesia geral em crianças",
        descricao:
          "A anestesia é curta, mas existe e é avaliada individualmente antes do procedimento. Qualquer condição respiratória em atividade, como uma virose recente, pode adiar a data — e adiar é a decisão correta quando isso acontece.",
      },
    ],

    antesDepois: [],

    faq: [
      {
        pergunta: "Meu filho vai poder tomar banho e nadar?",
        resposta:
          "Banho comum, sim, com cuidado para não jogar água diretamente dentro do ouvido. Sobre piscina e mar, a orientação mudou nos últimos anos e hoje é mais flexível do que era: boa parte das crianças pode nadar em superfície sem protetor. Mergulho profundo, água de qualidade duvidosa e mergulho em água doce pedem proteção. A orientação exata do seu caso é definida na consulta.",
      },
      {
        pergunta: "O tubo precisa ser retirado depois?",
        resposta:
          "Na maioria das vezes, não. O tubo de curta permanência é expelido sozinho entre seis e dezoito meses, empurrado pelo crescimento do tímpano. Retirada em consultório ou em centro cirúrgico só é necessária quando ele permanece por tempo excessivo ou causa problema.",
      },
      {
        pergunta: "A audição melhora na hora?",
        resposta:
          "Sim, quando a perda vinha da secreção no ouvido médio. É comum a criança estranhar o próprio volume de voz no primeiro dia. Se a perda auditiva tem outra causa, o tubo não a corrige — por isso a audiometria antes do procedimento é indispensável.",
      },
      {
        pergunta: "Dá para esperar em vez de operar?",
        resposta:
          "Muitas vezes sim, e observar por três meses é conduta correta em boa parte dos casos de otite com efusão, porque uma parcela resolve sozinha. O que muda a decisão é a duração, a perda auditiva medida, o impacto na fala e na escola, e o estado do tímpano.",
      },
      {
        pergunta: "Precisa tirar a adenoide junto?",
        resposta:
          "Depende. Quando a adenoide está aumentada e contribui para a disfunção da tuba, retirá-la no mesmo tempo cirúrgico reduz a chance de precisar de novos tubos. Em crianças que já estão no segundo conjunto de tubos, essa associação é considerada com mais peso.",
      },
      {
        pergunta: "Adulto também usa tubo de ventilação?",
        resposta:
          "Sim, em disfunção da tuba auditiva persistente, barotrauma de repetição e algumas situações específicas. Em adultos, a secreção unilateral no ouvido sem causa aparente exige avaliação do cavum antes de qualquer procedimento, para investigar outras causas.",
      },
    ],

    ctaFinal: "Agendar consulta",
    relacionados: ["timpanoplastia", "amigdalas-e-adenoides"],

    imagem: {
      tipo: "pendente",
      descricao:
        "Ilustração vetorial em linha filete do tímpano com tubo de ventilação e da tuba auditiva",
    },
  },

  // ---------------------------------------------------------------------------
  // Timpanoplastia
  // ---------------------------------------------------------------------------
  {
    slug: "timpanoplastia",
    hub: "otorrinolaringologia",
    nome: "Timpanoplastia",
    seo: {
      titulo: "Timpanoplastia em Belo Horizonte",
      descricao:
        "Cirurgia para fechar o furo no tímpano: quando é indicada, como é feita, recuperação semana a semana, chance de sucesso e riscos reais.",
    },

    eyebrow: "Otorrinolaringologia · Função",
    h1: "Timpanoplastia — correção do tímpano",
    lead: "Fechar o furo tem dois objetivos: parar as infecções de repetição e recuperar parte da audição. Nem sempre os dois acontecem na mesma medida.",

    oQueE: [
      "O tímpano é uma membrana fina que separa o conduto auditivo do ouvido médio e transforma o som em movimento. Quando ela tem um furo — uma perfuração —, duas coisas acontecem: a audição cai, porque a superfície que vibra diminuiu, e a água ou a contaminação que entram pelo conduto alcançam o ouvido médio, causando infecções repetidas.",
      "Perfurações aparecem depois de otites, de traumatismos, de explosões e barotraumas, ou permanecem depois que um tubo de ventilação se solta. Algumas fecham sozinhas em semanas. As que não fecham costumam permanecer abertas indefinidamente.",
      "A timpanoplastia é a cirurgia que reconstrói o tímpano usando tecido do próprio paciente: fáscia do músculo temporal ou pericôndrio e cartilagem da orelha. Não se coloca prótese sintética para fechar a membrana.",
      "Quando os ossículos do ouvido médio também estão lesados, a cirurgia pode envolver a reconstrução da cadeia ossicular. Isso muda o planejamento e a expectativa de ganho auditivo, e é avaliado com audiometria e tomografia antes.",
    ],

    indicacoes: [
      "Perfuração do tímpano que persiste por mais de três a seis meses, sem tendência a fechar sozinha.",
      "Otite média crônica com saída de secreção de repetição pelo ouvido.",
      "Perda auditiva condutiva atribuída à perfuração, confirmada em audiometria.",
      "Impossibilidade de entrar na água — nadar, mergulhar, praticar esporte aquático — pelo risco de infecção.",
      "Necessidade de ouvido seco e íntegro para adaptar aparelho auditivo.",
      "Retração ou bolsa de retração do tímpano com risco de evoluir para colesteatoma.",
    ],

    comoEFeito: [
      "O acesso pode ser pelo próprio conduto auditivo, com endoscópio, ou por uma incisão atrás da orelha, escondida na dobra natural. A escolha depende do tamanho e da posição da perfuração e da anatomia do seu conduto.",
      "Retiro o enxerto do próprio paciente: fáscia do músculo temporal, ou pericôndrio com cartilagem da orelha. Cartilagem é preferida em perfurações grandes, em reoperações e quando a tuba auditiva funciona mal, porque resiste melhor à retração ao longo do tempo.",
      "Reavivo as bordas da perfuração, posiciono o enxerto apoiando o remanescente do tímpano e sustento com material absorvível dos dois lados enquanto ele adere e é integrado.",
      "Se os ossículos estiverem erodidos ou fixos, a reconstrução da cadeia é feita no mesmo tempo, com cartilagem ou com prótese ossicular, conforme o achado.",
      "A cirurgia é feita sob anestesia geral. A alta costuma sair no mesmo dia ou após uma noite.",
    ],

    fichaTecnica: {
      duracao:
        "60 a 150 minutos, conforme a via de acesso e a necessidade de reconstruir ossículos",
      anestesia: "Geral",
      internacao: "Alta no mesmo dia ou após uma noite",
      retornoSocial: "7 a 10 dias",
      disclaimer:
        "Estas são faixas habituais, não um compromisso. A via de acesso, a duração, o tempo de recuperação e a expectativa de ganho auditivo variam conforme o tamanho da perfuração, o estado dos ossículos e o histórico de cada paciente.",
    },

    recuperacao: [
      {
        periodo: "Primeiras 48 horas",
        descricao:
          "Curativo sobre a orelha quando o acesso foi por trás. Dor leve a moderada, controlada com analgésico comum. Audição pior do que antes da cirurgia — o ouvido está preenchido com material de suporte, e isso é esperado. Pode haver zumbido e sensação de ouvido tampado.",
      },
      {
        periodo: "Primeira semana",
        descricao:
          "Retirada do curativo externo e dos pontos, quando houver. Proibido molhar o ouvido, assoar o nariz com força, espirrar de boca fechada e fazer esforço — tudo isso empurra ar pela tuba auditiva e pode deslocar o enxerto. Repouso relativo em casa.",
      },
      {
        periodo: "Semanas 2 a 4",
        descricao:
          "Retorno ao trabalho sem esforço físico. O material de suporte dentro do conduto vai sendo absorvido ou retirado em consultório, e a audição começa a melhorar de forma perceptível. Ainda sem piscina, sem mar e sem exercício intenso.",
      },
      {
        periodo: "Meses 2 e 3",
        descricao:
          "Avaliação do enxerto integrado e audiometria de controle, que é o momento em que se mede de fato o resultado auditivo. Liberação gradual para atividade física e, conforme o exame, para entrar na água.",
      },
      {
        periodo: "Meses 4 a 6",
        descricao:
          "Cicatrização consolidada. A audição pode continuar melhorando discretamente até aqui. Acompanhamento de longo prazo é recomendável em quem teve otite crônica, porque a doença de base não desaparece com a cirurgia.",
      },
    ],

    riscosELimites: [
      {
        titulo: "O enxerto pode não pegar",
        descricao:
          "É o principal risco desta cirurgia. As séries publicadas descrevem fechamento da perfuração em torno de 80 a 90 por cento dos casos primários, com resultados menores em perfurações grandes, em reoperações e em ouvidos com tuba auditiva ruim. Quando o enxerto não integra, a perfuração persiste ou reabre e uma segunda cirurgia pode ser necessária.",
      },
      {
        titulo: "A audição pode não melhorar",
        descricao:
          "Fechar o tímpano é uma coisa; recuperar audição é outra. Se a perda tem componente neurossensorial ou se os ossículos estão comprometidos, o ganho é parcial. Em uma fração pequena dos casos a audição piora, e em situações raras a perda é significativa e permanente. Esse cenário é discutido antes, com a audiometria na mesa.",
      },
      {
        titulo: "Alteração do paladar",
        descricao:
          "O nervo corda do tímpano, que leva o paladar de parte da língua, atravessa o ouvido médio bem no campo da cirurgia. Gosto metálico ou dormência em metade da língua é relativamente comum no pós-operatório e costuma regredir em semanas a meses. Alteração persistente é incomum.",
      },
      {
        titulo: "Zumbido e tontura",
        descricao:
          "Zumbido pode aparecer ou piorar temporariamente. Tontura nos primeiros dias é possível, sobretudo quando houve manipulação da cadeia ossicular. Vertigem intensa e persistente é rara e exige avaliação imediata, porque pode indicar comprometimento do ouvido interno.",
      },
      {
        titulo: "Infecção e problemas de cicatrização",
        descricao:
          "Infecção da área operada é incomum e costuma responder a tratamento clínico. A cicatriz atrás da orelha fica escondida na dobra natural, mas cicatrização hipertrófica ou queloide pode acontecer, especialmente em quem já tem esse histórico.",
      },
      {
        titulo: "Lateralização do enxerto e estreitamento do conduto",
        descricao:
          "O tímpano reconstruído pode cicatrizar deslocado da posição ideal, o que reduz o ganho auditivo mesmo com a perfuração fechada. Estreitamento do conduto auditivo é raro. Ambos podem exigir revisão cirúrgica.",
      },
      {
        titulo: "Riscos da anestesia geral",
        descricao:
          "Existem e são discutidos na avaliação pré-anestésica, obrigatória antes da cirurgia.",
      },
    ],

    antesDepois: [],

    faq: [
      {
        pergunta: "Toda perfuração de tímpano precisa de cirurgia?",
        resposta:
          "Não. Perfurações recentes, por trauma ou por otite, costumam fechar sozinhas em semanas, e a conduta inicial é observar mantendo o ouvido seco. A cirurgia é considerada quando o furo persiste por meses, quando há infecções de repetição ou quando a perda auditiva incomoda.",
      },
      {
        pergunta: "Vou voltar a ouvir como antes?",
        resposta:
          "Depende de por que você ouve menos. Se a perda vem apenas da perfuração, o ganho costuma ser bom. Se há comprometimento dos ossículos ou do ouvido interno, o ganho é parcial, e o principal benefício passa a ser ter um ouvido seco e protegido. A audiometria feita antes é o que permite dizer isso com honestidade.",
      },
      {
        pergunta: "Vai ficar cicatriz aparente?",
        resposta:
          "Quando o acesso é pelo conduto, com endoscópio, não há cicatriz externa. Quando é necessária a via atrás da orelha, a cicatriz fica escondida na dobra natural e se torna pouco perceptível com o tempo.",
      },
      {
        pergunta: "Quando poderei nadar de novo?",
        resposta:
          "Só depois que a cicatrização do enxerto estiver confirmada em consulta, o que costuma acontecer entre o segundo e o terceiro mês. Entrar na água antes disso é um dos motivos mais evitáveis de perder o resultado da cirurgia.",
      },
      {
        pergunta: "Existe idade certa para operar uma criança?",
        resposta:
          "Costuma-se preferir esperar, porque a tuba auditiva amadurece com a idade e o resultado tende a ser melhor em crianças mais velhas. Infecções frequentes ou risco para o ouvido podem antecipar a decisão. É uma conversa caso a caso.",
      },
      {
        pergunta: "Por que não posso assoar o nariz depois da cirurgia?",
        resposta:
          "Porque assoar com força, espirrar de boca fechada e fazer esforço empurram ar pela tuba auditiva direto contra o enxerto que ainda não aderiu. É uma das causas evitáveis de falha. Espirre de boca aberta e limpe o nariz com delicadeza nas primeiras semanas.",
      },
    ],

    ctaFinal: "Agendar consulta",
    relacionados: ["tubo-de-ventilacao", "amigdalas-e-adenoides"],

    imagem: {
      tipo: "pendente",
      descricao:
        "Ilustração vetorial em linha filete do tímpano e da cadeia ossicular do ouvido médio",
    },
  },
];
