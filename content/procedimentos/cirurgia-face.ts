import type { Procedimento } from "../tipos";

/**
 * Cirurgia da face — cinco procedimentos.
 *
 *   rinoplastia · otoplastia · blefaroplastia · cantopexia · frontoplastia
 *
 * Ordem de exibição no hub = ordem deste array. Rinoplastia vem primeiro
 * porque é a página carro-chefe do site depois da home.
 *
 * O texto de rinoplastia carrega a tese central: ela é otorrinolaringologista
 * ANTES de operar a face, e trata o nariz como órgão que respira, não como
 * forma isolada. Isso não é slogan — é o que muda o planejamento cirúrgico, e
 * o texto precisa mostrar isso em vez de anunciar.
 *
 * Nenhum texto aqui atribui a ela técnica exclusiva, número de casos ou
 * estatística pessoal. Os percentuais citados são de literatura geral e estão
 * escritos como faixa, não como promessa.
 */
export const PROCEDIMENTOS_CIRURGIA_FACE: readonly Procedimento[] = [
  // ---------------------------------------------------------------------------
  // Rinoplastia — página carro-chefe
  // ---------------------------------------------------------------------------
  {
    slug: "rinoplastia",
    hub: "cirurgia-da-face",
    nome: "Rinoplastia",
    seo: {
      titulo: "Rinoplastia em Belo Horizonte | Lívia Sant'Anna",
      descricao:
        "Rinoplastia estética e funcional com otorrinolaringologista: como é o planejamento, a cirurgia, a recuperação mês a mês e os riscos reais.",
    },

    eyebrow: "Cirurgia da face · Forma e função",
    h1: "Rinoplastia estética e funcional",
    lead: "Opero o nariz que respira e o nariz que se vê, e trato os dois como o mesmo problema. Quem opera a função planeja a forma de outro jeito.",

    oQueE: [
      "Rinoplastia é a cirurgia que muda a estrutura do nariz. A palavra costuma ser usada só no sentido estético, mas a estrutura que sustenta o formato é a mesma que sustenta a passagem de ar: cartilagens, ossos e a válvula nasal, que é o ponto mais estreito de toda a via respiratória.",
      "Isso significa que não existe mudança de forma sem consequência funcional. Afinar uma ponta larga, reduzir uma giba, estreitar o dorso — cada um desses gestos altera o caminho do ar. Feitos sem planejamento respiratório, produzem um nariz bonito na foto e obstruído na vida.",
      "Minha formação começou pela função. Fiz residência em otorrinolaringologia antes do fellowship em cirurgia plástica da face, e é nessa ordem que penso o nariz na consulta: primeiro como órgão, depois como parte central do rosto. Na prática, isso quer dizer que a avaliação da sua respiração não é um adicional cobrado à parte — é parte do planejamento desde a primeira conversa, mesmo quando você chegou só pela estética.",
      "Existem três conversas diferentes que chegam com o mesmo nome. A primeira é de quem não gosta do próprio nariz. A segunda é de quem não respira bem por ele. A terceira, a mais comum de todas, é de quem tem as duas coisas e só descobre a segunda quando examinada. Nos três casos a cirurgia se chama rinoplastia; o que muda é o que se planeja fazer lá dentro.",
      "Quando o septo desviado entra na conta — e ele entra com muita frequência —, o procedimento passa a se chamar rinosseptoplastia. É a mesma cirurgia, mesma anestesia, mesmo acesso, com um tempo dedicado a corrigir a parede interna que separa as narinas.",
      "O que a rinoplastia não é: uma cirurgia de catálogo. Não existe um nariz que fique bem em todo mundo, e o pedido por um nariz visto em foto de outra pessoa é o começo de uma conversa, não uma instrução. O que define o resultado possível é a sua pele, a sua cartilagem, o seu osso e a relação do nariz com o queixo, com os olhos e com a testa. Metade do trabalho da consulta é separar o que é possível do que não é — e dizer isso claramente, mesmo quando não é o que você queria ouvir.",
    ],

    indicacoes: [
      "Insatisfação com o formato do nariz — giba dorsal, ponta larga ou caída, dorso torto, nariz desproporcional em relação ao rosto — em pessoa com expectativa realista e com crescimento facial concluído.",
      "Obstrução nasal por alteração estrutural: desvio de septo, colapso de válvula nasal, cartilagens fracas que colabam na inspiração.",
      "As duas coisas juntas, que é o cenário mais frequente na prática.",
      "Deformidade pós-traumática, com ou sem obstrução, depois de fratura nasal consolidada.",
      "Nariz previamente operado com resultado insatisfatório, funcional ou estético — a chamada rinoplastia secundária, tecnicamente mais difícil e avaliada com critério maior.",
      "Alterações congênitas do nariz e da via aérea nasal, avaliadas caso a caso.",
      "Não é indicada para quem busca a cirurgia por pressão de outra pessoa, para quem tem expectativa de mudança de identidade a partir do nariz, ou durante um período de instabilidade emocional importante. Nesses casos, dizer não é parte do meu trabalho.",
    ],

    comoEFeito: [
      "A cirurgia começa muito antes do centro cirúrgico. Na consulta, examino o nariz por fora e por dentro, com endoscopia nasal quando indicado, avalio a força e o comportamento das cartilagens na inspiração, a espessura da sua pele e a proporção do nariz com o restante do rosto. A espessura da pele é um dos fatores que mais definem o resultado possível, e é o que menos aparece nas conversas sobre rinoplastia.",
      "Existem duas vias de acesso. Na via fechada, todas as incisões ficam dentro das narinas e não há cicatriz externa. Na via aberta, acrescenta-se uma incisão pequena na columela, a coluna de pele entre as narinas, que permite ver a estrutura diretamente e trabalhar com mais precisão em pontas complexas, narizes tortos e reoperações. Essa cicatriz fica discreta na maioria das pessoas, mas ela existe, e eu prefiro dizer isso do que omitir.",
      "Depois de descolar a pele da estrutura, o trabalho é sobre osso e cartilagem. Reduzir uma giba, remodelar a ponta, alinhar um dorso torto, estreitar a base óssea com osteotomias — cortes calculados no osso que permitem reposicioná-lo.",
      "A rinoplastia moderna é uma cirurgia de reconstrução, não de remoção. Durante décadas se retirou estrutura em excesso, e o resultado aparecia dez ou quinze anos depois, com pontas caídas e narizes que não passavam ar. Hoje se preserva o que sustenta e se reforça o que é fraco, com enxertos da própria cartilagem do paciente — em geral do septo, e quando não há material suficiente, da orelha ou da costela.",
      "É no mesmo tempo cirúrgico que a função é tratada: correção do septo desviado, redução dos cornetos hipertrofiados quando necessário, e enxertos que sustentam a válvula nasal, o ponto onde a maioria dos colapsos respiratórios acontece. Não é uma segunda cirurgia nem um segundo procedimento — é a mesma cirurgia, planejada por inteiro.",
      "Ao final, uso pontos internos absorvíveis, uma tala externa moldada sobre o dorso e, conforme o caso, lâminas finas de silicone apoiando o septo. O tamponamento de gaze antigo não é rotina.",
      "O procedimento é feito em centro cirúrgico, sob anestesia geral. [CONFIRMAR: se ela realiza rinoplastia com anestesia local e sedação em algum cenário, e em qual.]",
    ],

    fichaTecnica: {
      duracao:
        "2 a 4 horas, conforme a complexidade e a necessidade de enxertos",
      anestesia: "Geral",
      internacao: "Alta no mesmo dia ou após uma noite",
      retornoSocial:
        "10 a 14 dias, após a retirada da tala e a saída do roxo mais evidente",
      disclaimer:
        "Estas são faixas habituais, não um compromisso. Duração, tempo de internação e recuperação variam conforme a anatomia, a espessura da pele, os achados durante a cirurgia e o histórico de cada paciente. Rinoplastia secundária costuma exigir mais tempo e recuperação mais longa.",
    },

    recuperacao: [
      {
        periodo: "Primeiras 48 horas",
        descricao:
          "Tala sobre o nariz, inchaço da face e nariz completamente obstruído. Dor costuma ser menor do que as pessoas esperam e responde a analgésico comum — o que incomoda é a obstrução, não a dor. Roxo ao redor dos olhos começa a aparecer e piora antes de melhorar. Cabeceira elevada dia e noite, gelo na região das bochechas e da testa, nunca em cima da tala.",
      },
      {
        periodo: "Dias 3 a 7",
        descricao:
          "Pico do roxo entre o segundo e o quarto dia, com clareamento a partir daí. Retirada das lâminas de silicone, quando usadas, com alívio imediato da sensação de pressão. Começam as lavagens nasais com soro, que são a parte que mais depende de você. Ainda em casa, sem esforço, sem abaixar a cabeça, sem óculos apoiados no nariz.",
      },
      {
        periodo: "Dias 7 a 14",
        descricao:
          "Retirada da tala, em geral entre o sétimo e o décimo dia. O nariz que aparece nesse dia está inchado, endurecido e mais alto do que ficará — quase ninguém gosta do que vê nesse momento, e isso é esperado. Roxo residual ainda cobrível com maquiagem. Retorno ao trabalho sem esforço físico costuma acontecer nesta janela.",
      },
      {
        periodo: "Semanas 3 e 4",
        descricao:
          "Inchaço visível para você, discreto para os outros. Retorno gradual à atividade física leve, começando por caminhada. Ainda sem esporte de contato, sem musculação pesada, sem sol direto sem proteção. A respiração ainda oscila, porque a mucosa interna continua cicatrizando.",
      },
      {
        periodo: "Meses 2 e 3",
        descricao:
          "A maioria das pessoas já circula sem que ninguém perceba que operou. O nariz continua com edema, concentrado na ponta, que é a última região a desinchar. Liberação para exercício pleno costuma acontecer entre a quarta e a sexta semana, conforme o caso, e para esporte de contato bem mais tarde.",
      },
      {
        periodo: "Meses 6 a 12",
        descricao:
          "Refinamento progressivo do contorno. Sensibilidade da ponta e da columela vai voltando aos poucos, com dormência residual que costuma resolver. É aqui que o resultado começa a ser o que será.",
      },
      {
        periodo: "Meses 12 a 18",
        descricao:
          "Resultado final, sobretudo na ponta e em quem tem pele espessa, que retém edema por mais tempo. Avaliar o resultado antes deste ponto — e decidir sobre qualquer retoque antes dele — é avaliar uma cirurgia que ainda não terminou de acontecer.",
      },
    ],

    riscosELimites: [
      {
        titulo: "O resultado pode não ser o que você imaginou",
        descricao:
          "Este é o risco mais importante da rinoplastia e o menos falado. O nariz é esculpido em osso e cartilagem, mas quem decide o formato final é a cicatrização da sua pele, que não se controla. Duas pessoas com a mesma cirurgia terminam com resultados diferentes. Por isso a consulta insiste tanto em alinhar o que é possível: um resultado tecnicamente correto e diferente do que você imaginou continua sendo uma frustração, e evitá-la começa na conversa, não na cirurgia.",
      },
      {
        titulo: "Necessidade de retoque",
        descricao:
          "As séries publicadas descrevem taxas de revisão em rinoplastia em torno de 5 a 15 por cento, e maiores em narizes já operados. Assimetrias pequenas, irregularidades no dorso perceptíveis ao toque ou uma ponta que desinchou de forma desigual podem justificar um ajuste. Qualquer retoque só é considerado depois de doze meses, porque antes disso o que se está avaliando é edema, não resultado.",
      },
      {
        titulo: "A respiração pode piorar",
        descricao:
          "Estreitar um nariz sem reforçar o suporte pode fechar a válvula nasal e criar obstrução que não existia antes. É uma das causas mais comuns de rinoplastia secundária, e é exatamente o que a avaliação funcional prévia existe para evitar. Mesmo assim, alterações respiratórias podem acontecer, e podem exigir correção posterior.",
      },
      {
        titulo: "Inchaço prolongado e alterações de sensibilidade",
        descricao:
          "O edema da ponta dura de doze a dezoito meses, e mais em pele espessa. Dormência da ponta do nariz e dos dentes superiores da frente é comum nas primeiras semanas ou meses e costuma regredir, mas uma dormência residual permanente é possível.",
      },
      {
        titulo: "Sangramento e hematoma",
        descricao:
          "Sangramento em gotas nos primeiros dias é esperado. Sangramento volumoso é incomum e pode exigir tamponamento ou revisão em centro cirúrgico. Hematoma de septo é raro e precisa ser drenado com urgência, porque pode danificar a cartilagem e afundar o dorso.",
      },
      {
        titulo: "Infecção",
        descricao:
          "Incomum em rinoplastia, mas mais relevante quando há enxertos, porque uma infecção pode comprometer o enxerto e o resultado estrutural. Sinais de alerta são dor crescente depois do terceiro dia, vermelhidão que se expande e febre — nesses casos, contato imediato, não observação em casa.",
      },
      {
        titulo: "Cicatriz da columela e irregularidades palpáveis",
        descricao:
          "Na via aberta, existe uma cicatriz pequena na base do nariz, que se torna discreta na maioria das pessoas, mas pode ficar visível em quem cicatriza mal. Bordas de enxerto podem ficar palpáveis ou, em pele fina, visíveis, sobretudo no dorso.",
      },
      {
        titulo: "Alterações do olfato",
        descricao:
          "Redução do olfato nas primeiras semanas é comum e ligada ao inchaço interno. Perda permanente é rara, mas está descrita e faz parte do consentimento.",
      },
      {
        titulo: "Limites que a anatomia impõe",
        descricao:
          "Pele muito espessa limita o quanto uma ponta pode ser definida. Cartilagem fraca limita o quanto se pode estreitar sem comprometer a respiração. Um queixo retraído muda a percepção do tamanho do nariz mais do que qualquer coisa feita no próprio nariz. Nada disso é opinião: é anatomia, e é o que separa uma expectativa realista de uma decepção programada.",
      },
      {
        titulo: "Riscos da anestesia geral",
        descricao:
          "Existem e são discutidos na avaliação pré-anestésica, obrigatória. Não existe cirurgia sem riscos, e a conversa sobre eles acontece antes de qualquer agendamento, não no dia da internação.",
      },
    ],

    antesDepois: [],

    faq: [
      {
        pergunta: "Dá para operar a estética e o septo na mesma cirurgia?",
        resposta:
          "Sim, e na maioria dos casos é o que faz mais sentido. Chama-se rinosseptoplastia: mesma anestesia, mesmo acesso, mesma recuperação. Operar duas vezes o mesmo nariz é mais difícil, mais caro e mais arriscado do que planejar tudo de uma vez. Existem situações em que separar é o mais prudente, e isso é definido pelo exame.",
      },
      {
        pergunta: "Meu convênio cobre a parte funcional?",
        resposta:
          "A cirurgia funcional com indicação clínica documentada — septoplastia, turbinoplastia, correção de válvula — tem cobertura prevista quando os critérios são preenchidos; a parte estética não é coberta por nenhum convênio. Como isso se organiza na prática varia. [CONFIRMAR: convênios atendidos e como ela conduz a parte funcional e a estética no mesmo procedimento.]",
      },
      {
        pergunta: "Vai ficar cicatriz?",
        resposta:
          "Na via fechada, todas as incisões ficam dentro do nariz e não há cicatriz externa. Na via aberta há uma cicatriz pequena na columela, entre as narinas, que na maioria das pessoas se torna pouco perceptível depois de alguns meses. A escolha da via depende do que precisa ser feito, e é explicada antes.",
      },
      {
        pergunta: "Quando vou ver o resultado?",
        resposta:
          "Uma prévia por volta do terceiro mês, o contorno em boa parte definido entre o sexto e o décimo segundo mês, e o resultado final entre doze e dezoito meses — mais em quem tem pele espessa. O nariz que aparece na retirada da tala não é o resultado: é um nariz inchado, e quase ninguém gosta dele nesse dia.",
      },
      {
        pergunta: "Dói muito?",
        resposta:
          "A dor costuma ser menor do que as pessoas esperam e é controlada com analgésico comum. O que realmente incomoda nos primeiros dias é a obstrução nasal e a sensação de pressão, não a dor. Isso não significa que seja um procedimento leve — é uma cirurgia, com preparo, riscos e recuperação de semanas.",
      },
      {
        pergunta: "Posso levar uma foto do nariz que eu quero?",
        resposta:
          "Pode, e é útil — não como pedido a ser copiado, mas como forma de eu entender o que te agrada. O nariz de outra pessoa está apoiado no osso, na pele e no rosto dela. O que se planeja é o nariz que cabe no seu rosto, e essa tradução é justamente o trabalho da consulta.",
      },
      {
        pergunta: "Existe idade mínima?",
        resposta:
          "Espera-se a conclusão do crescimento facial, o que costuma acontecer por volta dos dezesseis anos em meninas e um pouco mais tarde em meninos. Correções funcionais podem ser antecipadas quando há obstrução importante ou deformidade pós-traumática. Em menores de idade, a decisão envolve os responsáveis e uma conversa sobre motivação.",
      },
      {
        pergunta: "E se eu já operei o nariz antes?",
        resposta:
          "É uma rinoplastia secundária, e ela é tecnicamente mais difícil: o tecido está cicatrizado, os planos não se separam com a mesma facilidade e a cartilagem do septo muitas vezes já foi usada, exigindo enxerto de orelha ou de costela. A avaliação é mais detalhada, a expectativa precisa ser mais contida e o relatório da cirurgia anterior ajuda muito.",
      },
      {
        pergunta: "Quando posso voltar à academia?",
        resposta:
          "Caminhada leve costuma ser liberada a partir da terceira ou quarta semana, exercício de maior intensidade entre a quarta e a sexta, e esporte de contato bem depois — um trauma no nariz nos primeiros meses pode desfazer o que foi feito. O calendário exato sai da sua consulta de retorno, não desta página.",
      },
      {
        pergunta: "Por que o site não mostra fotos de antes e depois?",
        resposta:
          "Porque a legislação exige autorização formal da paciente, imagem sem qualquer edição e explicação clínica junto de cada imagem, e essa curadoria ainda não está pronta. Enquanto isso, prefiro mostrar casos pessoalmente na consulta, onde consigo explicar a anatomia de cada um e por que o seu resultado seria diferente.",
      },
    ],

    ctaFinal: "Agendar consulta",
    relacionados: ["desvio-de-septo", "otoplastia", "blefaroplastia"],

    imagem: {
      tipo: "pendente",
      descricao:
        "Ilustração vetorial em linha filete do perfil nasal com o fluxo de ar atravessando a válvula nasal",
    },
  },

  // ---------------------------------------------------------------------------
  // Otoplastia
  // ---------------------------------------------------------------------------
  {
    slug: "otoplastia",
    hub: "cirurgia-da-face",
    nome: "Otoplastia",
    seo: {
      titulo: "Otoplastia em Belo Horizonte | Lívia Sant'Anna",
      descricao:
        "Cirurgia de correção das orelhas em crianças e adultos: idade indicada, como é feita, recuperação com a faixa, riscos e chance de recidiva.",
    },

    eyebrow: "Cirurgia da face · Forma",
    h1: "Otoplastia — correção das orelhas",
    lead: "Uma cirurgia de pouca dor e resultado imediato, feita para que a orelha deixe de ser o assunto — não para que vire outro.",

    oQueE: [
      "Otoplastia é a cirurgia que corrige a posição e o formato das orelhas. Duas alterações respondem pela maioria dos casos: a ausência ou o apagamento da dobra chamada antélice, que faz a orelha parecer aberta, e o excesso de cartilagem na concha, que empurra a orelha para longe da cabeça.",
      "As duas coisas costumam aparecer juntas, em graus diferentes de cada lado. Assimetria entre as orelhas é a regra, não a exceção, e faz parte do planejamento.",
      "É uma cirurgia de cartilagem: não se retira orelha, se remodela a estrutura e se refaz a dobra que não se formou. O objetivo é uma orelha de aparência natural, com curvas suaves e proporção adequada em relação à cabeça, e não uma orelha colada.",
      "Pode ser feita em crianças a partir dos cinco ou seis anos, quando a orelha já atingiu quase todo o tamanho adulto, e em adultos de qualquer idade. Em bebês de poucas semanas, alterações do contorno podem ser tratadas sem cirurgia, com moldagem — uma janela curta que costuma passar despercebida.",
    ],

    indicacoes: [
      "Orelhas proeminentes, com ângulo aumentado em relação à cabeça, em criança a partir dos cinco ou seis anos ou em adulto.",
      "Antélice pouco definida ou ausente, que faz a orelha parecer aberta de frente.",
      "Concha auricular com excesso de cartilagem, empurrando a orelha para fora.",
      "Assimetria significativa entre as duas orelhas.",
      "Constrangimento social ou apelidos na escola — uma indicação legítima, desde que o desejo seja da criança e não apenas da família.",
      "Lóbulo proeminente ou deformidades específicas do contorno, avaliadas caso a caso.",
    ],

    comoEFeito: [
      "A incisão fica atrás da orelha, na dobra natural entre a orelha e a cabeça, onde a cicatriz permanece escondida.",
      "A partir desse acesso, remodelo a cartilagem: crio ou reforço a dobra da antélice com pontos permanentes e, quando a concha tem excesso de cartilagem, reduzo esse volume ou reposiciono a orelha aproximando-a da mastoide.",
      "A técnica combina pontos que dobram a cartilagem com enfraquecimento controlado dela, para que a dobra fique suave em vez de angulada. Cartilagem apenas puxada por ponto, sem preparo, tende a voltar à posição original com o tempo.",
      "O objetivo é simetria razoável, e não simetria absoluta: orelhas humanas não são iguais entre si, e o resultado que parece natural é o que preserva pequenas diferenças.",
      "Em crianças, é feita sob anestesia geral. Em adultos, pode ser feita com anestesia local e sedação. A alta sai no mesmo dia.",
    ],

    fichaTecnica: {
      duracao: "60 a 120 minutos, para as duas orelhas",
      anestesia:
        "Geral em crianças. Local com sedação em adultos, conforme o caso",
      internacao: "Alta no mesmo dia",
      retornoSocial: "7 a 10 dias",
      disclaimer:
        "Estas são faixas habituais, não um compromisso. Duração, tipo de anestesia e tempo de recuperação variam conforme a idade, o grau da alteração e o histórico de cada paciente.",
    },

    recuperacao: [
      {
        periodo: "Primeiras 48 horas",
        descricao:
          "Curativo compressivo cobrindo as orelhas, que incomoda mais do que a cirurgia em si. Dor leve a moderada, controlada com analgésico comum. Dormir de barriga para cima, com a cabeceira elevada. Dor intensa e assimétrica em uma orelha só não é normal e pede avaliação no mesmo dia.",
      },
      {
        periodo: "Dias 3 a 7",
        descricao:
          "Troca do curativo pela faixa elástica. As orelhas aparecem inchadas, avermelhadas e mais coladas do que ficarão. Sensibilidade alterada e dormência local são esperadas. Retirada dos pontos, quando não absorvíveis, costuma acontecer no fim desta fase.",
      },
      {
        periodo: "Semanas 2 a 6",
        descricao:
          "Faixa elástica noturna, que é a parte mais chata e a mais importante da recuperação — é ela que protege os pontos enquanto a cartilagem consolida a nova posição. Retorno à escola ou ao trabalho a partir da segunda semana. Sem esporte de contato e sem nada que possa puxar a orelha.",
      },
      {
        periodo: "Meses 2 e 3",
        descricao:
          "Inchaço praticamente resolvido, contorno estabilizando. Liberação gradual para atividade física conforme a avaliação. Sensibilidade voltando ao normal, com dormência residual possível por mais alguns meses.",
      },
      {
        periodo: "Mês 6 em diante",
        descricao:
          "Resultado consolidado e cicatriz retroauricular amadurecendo, cada vez menos perceptível. Pequenas mudanças de posição ainda podem acontecer no primeiro ano.",
      },
    ],

    riscosELimites: [
      {
        titulo: "Recidiva — a orelha pode voltar a abrir",
        descricao:
          "Cartilagem tem memória, e uma parte dos casos apresenta perda parcial da correção ao longo dos meses ou anos, com necessidade de retoque. É o risco mais característico desta cirurgia. Uso de técnica que prepara a cartilagem, e não apenas a puxa com pontos, e o uso disciplinado da faixa nas primeiras semanas reduzem essa chance, mas não a eliminam.",
      },
      {
        titulo: "Assimetria entre as orelhas",
        descricao:
          "As orelhas já são diferentes entre si antes da cirurgia, e continuam diferentes depois. O objetivo é reduzir a diferença a um nível que ninguém note de frente, não igualá-las. Assimetria perceptível pode persistir e, em alguns casos, motiva um ajuste posterior.",
      },
      {
        titulo: "Hematoma",
        descricao:
          "Acúmulo de sangue sob a pele da orelha é incomum, mas é a complicação que exige ação mais rápida: se não for drenado, pode deformar a cartilagem de forma permanente. Dor intensa e desproporcional em uma orelha nas primeiras horas ou dias é o sinal de alerta e pede contato imediato.",
      },
      {
        titulo: "Infecção e condrite",
        descricao:
          "Infecção da pele é incomum. Infecção que atinge a cartilagem, a condrite, é rara mas séria, porque pode destruir o contorno da orelha e exige antibiótico específico e rápido. Vermelhidão que se expande, calor local e febre pedem avaliação no mesmo dia.",
      },
      {
        titulo: "Cicatriz hipertrófica ou queloide",
        descricao:
          "A cicatriz atrás da orelha costuma ficar escondida, mas é uma das regiões do corpo com maior tendência a queloide, sobretudo em pele mais escura e em quem já tem esse histórico. Quando existe histórico pessoal ou familiar, isso muda o planejamento e o acompanhamento pós-operatório.",
      },
      {
        titulo: "Pontos palpáveis ou que se exteriorizam",
        descricao:
          "Os pontos que sustentam a dobra são permanentes e podem ficar palpáveis sob a pele. Em alguns casos eles se exteriorizam meses depois e precisam ser retirados no consultório, com anestesia local.",
      },
      {
        titulo: "Correção excessiva e contorno artificial",
        descricao:
          "Colar demais a orelha, ou criar uma dobra angulada em vez de suave, produz um resultado que chama mais atenção do que a orelha original. É um risco real e é justamente por isso que o objetivo desta cirurgia é a orelha deixar de ser assunto, não virar outro.",
      },
    ],

    antesDepois: [],

    faq: [
      {
        pergunta: "A partir de que idade dá para operar?",
        resposta:
          "Costuma-se indicar a partir dos cinco ou seis anos, quando a orelha já atingiu quase o tamanho adulto e a criança consegue colaborar com os cuidados. Não há idade máxima. Em recém-nascidos, existe uma janela de poucas semanas em que a moldagem sem cirurgia pode corrigir o contorno.",
      },
      {
        pergunta: "Fica cicatriz visível?",
        resposta:
          "A incisão fica na dobra atrás da orelha e não aparece de frente nem de lado. Ela existe, e em pessoas com tendência a queloide pode ficar espessa — por isso o histórico de cicatrização é perguntado antes da cirurgia.",
      },
      {
        pergunta: "Preciso mesmo usar a faixa?",
        resposta:
          "Precisa, e é a parte da recuperação que mais influencia o resultado. A faixa protege os pontos enquanto a cartilagem consolida a nova posição e evita que a orelha seja dobrada durante o sono. Abandonar a faixa cedo é a causa evitável mais comum de perda parcial da correção.",
      },
      {
        pergunta: "A audição muda com a cirurgia?",
        resposta:
          "Não. A otoplastia trabalha na cartilagem da orelha externa e não toca no conduto auditivo, no tímpano nem em nenhuma estrutura ligada à audição.",
      },
      {
        pergunta: "Dá para operar só uma orelha?",
        resposta:
          "Dá, quando apenas um lado é proeminente. Mesmo nesses casos, muitas vezes é necessário algum ajuste no lado oposto para que as duas fiquem harmônicas — isso é avaliado no exame, e a decisão é conjunta.",
      },
      {
        pergunta: "Quando meu filho volta para a escola e para o esporte?",
        resposta:
          "Para a escola, em geral a partir da segunda semana, com a faixa usada à noite. Para esporte de contato e natação, a liberação é bem mais tardia, conforme a avaliação de retorno — um trauma na orelha nas primeiras semanas pode desfazer a correção.",
      },
    ],

    ctaFinal: "Agendar consulta",
    relacionados: ["rinoplastia", "blefaroplastia"],

    imagem: {
      tipo: "pendente",
      descricao:
        "Ilustração vetorial em linha filete do contorno da orelha, com destaque para a dobra da antélice",
    },
  },

  // ---------------------------------------------------------------------------
  // Blefaroplastia
  // ---------------------------------------------------------------------------
  {
    slug: "blefaroplastia",
    hub: "cirurgia-da-face",
    nome: "Blefaroplastia",
    seo: {
      titulo: "Blefaroplastia em Belo Horizonte | Lívia Sant'Anna",
      descricao:
        "Cirurgia das pálpebras superiores e inferiores: o que ela resolve, o que não resolve, como é feita, recuperação e riscos, explicados sem eufemismo.",
    },

    eyebrow: "Cirurgia da face · Forma",
    h1: "Blefaroplastia superior e inferior",
    lead: "Uma cirurgia que muda o olhar sem mudar a expressão — e que resolve menos coisas do que se costuma prometer.",

    oQueE: [
      "Blefaroplastia é a cirurgia das pálpebras. Na pálpebra superior, trata o excesso de pele que pesa sobre o olho e, em alguns casos, a bolsa de gordura na parte interna. Na inferior, trata as bolsas de gordura e o excesso de pele que formam o relevo abaixo do olho.",
      "A queixa que leva as pessoas ao consultório costuma ser de aparência cansada. A causa nem sempre é a pálpebra: pode ser a sobrancelha que desceu, pode ser perda de volume da região, pode ser o próprio sulco abaixo do olho. Operar a pálpebra quando o problema é a sobrancelha produz um resultado que decepciona — e é por isso que a avaliação começa pelo terço superior inteiro, não pelo que incomoda isoladamente.",
      "Na pálpebra inferior, boa parte do que se chama de olheira não é tratada por esta cirurgia. Olheira de pigmento e olheira de vascularização continuam iguais depois de operar. O que a cirurgia trata é o relevo: a bolsa que projeta sombra.",
      "Em casos em que a pele da pálpebra superior chega a cobrir o campo de visão, a cirurgia tem indicação funcional, e não apenas estética.",
    ],

    indicacoes: [
      "Excesso de pele na pálpebra superior, com sensação de peso, dobra que apoia sobre os cílios ou dificuldade de maquiar a região.",
      "Redução do campo visual superior causada pela pele da pálpebra — indicação funcional, confirmada por exame de campo visual.",
      "Bolsas de gordura na pálpebra inferior que projetam sombra e dão aparência cansada.",
      "Excesso de pele na pálpebra inferior com rugas finas e frouxidão.",
      "Assimetria entre as pálpebras que incomoda.",
      "Não é indicada para tratar olheira de pigmento, rugas de expressão do canto do olho, flacidez importante da sobrancelha isolada, ou em quem tem olho seco importante não controlado.",
    ],

    comoEFeito: [
      "Na pálpebra superior, a incisão segue a dobra natural da pálpebra, onde a cicatriz se esconde quando o olho está aberto. Removo o excesso de pele calculado com você acordada, ainda antes da cirurgia, e trato a bolsa de gordura interna quando ela participa do peso. Preservar pele suficiente é essencial: pele de menos impede o fechamento completo do olho.",
      "Na pálpebra inferior, há dois caminhos. Pela via transconjuntival, por dentro da pálpebra, sem cicatriz externa, indicada quando a queixa é de bolsa sem excesso de pele. Pela via externa, com incisão logo abaixo dos cílios, quando é necessário retirar pele.",
      "A gordura das bolsas nem sempre é retirada. Em boa parte dos casos ela é reposicionada para preencher o sulco abaixo do olho, o que costuma dar um resultado mais natural do que simplesmente esvaziar a região — esvaziar demais envelhece o olhar em vez de rejuvenescê-lo.",
      "Quando a pálpebra inferior tem frouxidão do tendão do canto lateral, a blefaroplastia sozinha pode puxar a pálpebra para baixo. Nesses casos, uma cantopexia é associada no mesmo tempo cirúrgico para sustentar a pálpebra.",
      "Costuma ser feita com anestesia local e sedação, com alta no mesmo dia. Anestesia geral é usada quando associada a outros procedimentos ou conforme a avaliação anestésica.",
    ],

    fichaTecnica: {
      duracao:
        "45 a 90 minutos para as superiores; 60 a 120 minutos quando envolve as inferiores",
      anestesia:
        "Local com sedação, na maioria dos casos. Geral quando associada a outro procedimento",
      internacao: "Alta no mesmo dia",
      retornoSocial: "10 a 14 dias",
      disclaimer:
        "Estas são faixas habituais, não um compromisso. Duração, tipo de anestesia e tempo de recuperação variam conforme a região tratada, a anatomia e o histórico de cada paciente.",
    },

    recuperacao: [
      {
        periodo: "Primeiras 48 horas",
        descricao:
          "Inchaço e roxo ao redor dos olhos, que pioram antes de melhorar. Compressa fria em intervalos curtos, cabeceira elevada para dormir, lubrificante ocular conforme prescrição. Visão pode ficar embaçada pela pomada e pelo inchaço. Sem esforço, sem abaixar a cabeça, sem leitura prolongada ou tela por muito tempo.",
      },
      {
        periodo: "Dias 3 a 7",
        descricao:
          "Pico do roxo por volta do terceiro dia e clareamento a partir daí. Retirada dos pontos costuma acontecer entre o quinto e o sétimo dia. Sensação de olho seco, areia ou ardência é comum nesta fase e melhora com lubrificação frequente.",
      },
      {
        periodo: "Dias 7 a 14",
        descricao:
          "Roxo residual já cobrível com maquiagem, liberada em geral depois da retirada dos pontos e conforme orientação. Retorno ao trabalho costuma acontecer nesta janela. As cicatrizes ainda estão avermelhadas e visíveis de perto.",
      },
      {
        periodo: "Semanas 3 a 6",
        descricao:
          "Inchaço residual que você percebe e os outros não, com frequência assimétrico entre os dois lados — um olho desincha antes do outro, e isso não significa que ficou torto. Retorno gradual à atividade física. Proteção solar rigorosa nas cicatrizes.",
      },
      {
        periodo: "Meses 3 a 6",
        descricao:
          "Cicatrizes clareando progressivamente até ficarem discretas. Contorno definitivo do olhar se estabelecendo. Sensibilidade da pálpebra retornando ao normal.",
      },
    ],

    riscosELimites: [
      {
        titulo: "Olho seco",
        descricao:
          "É a queixa mais frequente do pós-operatório. Ardência, sensação de areia e lacrimejamento paradoxal costumam durar semanas e melhoram com lubrificação. Em quem já tem olho seco antes da cirurgia, o quadro pode piorar de forma persistente — por isso essa condição é investigada antes, e às vezes contraindica ou adia a cirurgia.",
      },
      {
        titulo: "Alterações da posição da pálpebra inferior",
        descricao:
          "Retirar pele demais ou operar uma pálpebra frouxa sem sustentá-la pode deixar a pálpebra inferior puxada para baixo, mostrando a parte branca abaixo da íris ou, em casos mais graves, virando a borda para fora. Pode melhorar com massagem e tempo, mas parte dos casos exige correção cirúrgica.",
      },
      {
        titulo: "Dificuldade de fechar o olho por completo",
        descricao:
          "Se sobra pouca pele na pálpebra superior, o olho pode não fechar totalmente, sobretudo durante o sono, o que resseca a córnea. É incomum, costuma ser temporário pelo inchaço, e é a razão pela qual a marcação da pele é feita com cuidado e com você acordada.",
      },
      {
        titulo: "Assimetria e resultado insuficiente ou excessivo",
        descricao:
          "Os dois lados desincham em tempos diferentes e cicatrizam de forma diferente. Assimetria persistente pode acontecer, assim como pele residual que incomoda ou remoção excessiva de gordura, que produz um olho encovado e de aparência mais envelhecida. Retoques são possíveis, sempre depois de a cicatrização estar completa.",
      },
      {
        titulo: "Cicatrizes",
        descricao:
          "Na pálpebra superior, a cicatriz fica escondida na dobra e costuma ser discreta. Na inferior por via externa, fica abaixo dos cílios. Ambas podem ficar avermelhadas por meses, e em pessoas com tendência a cicatriz hipertrófica podem ficar visíveis. Sol sem proteção nos primeiros meses piora esse desfecho.",
      },
      {
        titulo: "Hematoma, incluindo o hematoma retrobulbar",
        descricao:
          "Hematoma superficial é incomum e costuma se resolver sozinho. O hematoma retrobulbar, atrás do globo ocular, é a complicação mais grave desta cirurgia: é raríssimo, descrito em fração de um caso em milhares, e pode comprometer a visão de forma permanente se não for tratado em caráter de urgência. Dor intensa e crescente com perda de visão nas primeiras horas é emergência absoluta.",
      },
      {
        titulo: "O que esta cirurgia não trata",
        descricao:
          "Olheira de pigmento, rugas do canto do olho, flacidez da sobrancelha e perda de volume da face não são resolvidas pela blefaroplastia. Prometer que serão é a origem da maioria das frustrações com este procedimento — por isso o exame avalia o terço superior inteiro antes de definir o que operar.",
      },
      {
        titulo: "Riscos da anestesia",
        descricao:
          "Mesmo com anestesia local e sedação, existe avaliação pré-anestésica obrigatória, com discussão dos riscos e revisão das medicações em uso.",
      },
    ],

    antesDepois: [],

    faq: [
      {
        pergunta: "A blefaroplastia tira as olheiras?",
        resposta:
          "Só a parte delas que é sombra, causada pelo relevo da bolsa. Olheira de pigmento, que é escurecimento da pele, e olheira de vascularização, que é o roxo dos vasos por transparência, continuam iguais depois da cirurgia. Essa é a expectativa que mais precisa ser alinhada antes de operar.",
      },
      {
        pergunta: "Vai mudar o formato do meu olho?",
        resposta:
          "O objetivo é abrir o olhar sem mudar a expressão nem o formato do olho. Mudança de formato é um desfecho indesejado, geralmente ligado a excesso de retirada ou a uma pálpebra inferior frouxa que não foi sustentada — e é para evitar isso que a cantopexia é associada em alguns casos.",
      },
      {
        pergunta: "Existe idade certa para fazer?",
        resposta:
          "Não. A indicação vem do exame, não do ano de nascimento. Há pessoas com trinta anos com excesso de pele de origem familiar e pessoas com sessenta sem indicação nenhuma. O que pesa é o que incomoda você e o que o exame mostra.",
      },
      {
        pergunta: "Quando posso usar maquiagem e voltar a trabalhar?",
        resposta:
          "Maquiagem costuma ser liberada depois da retirada dos pontos, em geral a partir do sétimo dia, conforme a cicatrização. O retorno ao trabalho normalmente acontece entre o décimo e o décimo quarto dia, quando o roxo já está cobrível.",
      },
      {
        pergunta: "O resultado é permanente?",
        resposta:
          "Duradouro, não permanente. A pele continua envelhecendo, e o tempo segue agindo sobre a região. A maioria das pessoas não precisa de nova cirurgia, mas mudanças ao longo dos anos são esperadas — dizer que o resultado é definitivo seria incorreto.",
      },
      {
        pergunta: "Posso fazer junto com outro procedimento?",
        resposta:
          "Com frequência sim. Blefaroplastia superior combina bem com frontoplastia quando a sobrancelha também desceu, e a inferior costuma ser associada à cantopexia quando há frouxidão. Toxina botulínica é feita separadamente, respeitando um intervalo em relação à cirurgia.",
      },
      {
        pergunta: "Meu convênio cobre?",
        resposta:
          "Quando o excesso de pele reduz o campo visual e isso é documentado por exame, existe indicação funcional com cobertura prevista em critérios específicos. A indicação estética não é coberta. [CONFIRMAR: convênios atendidos e como ela conduz a documentação do campo visual.]",
      },
    ],

    ctaFinal: "Agendar consulta",
    relacionados: ["cantopexia", "frontoplastia", "toxina-botulinica"],

    imagem: {
      tipo: "pendente",
      descricao:
        "Ilustração vetorial em linha filete do contorno palpebral superior e inferior",
    },
  },

  // ---------------------------------------------------------------------------
  // Cantopexia
  // ---------------------------------------------------------------------------
  {
    slug: "cantopexia",
    hub: "cirurgia-da-face",
    nome: "Cantopexia",
    seo: {
      titulo: "Cantopexia em Belo Horizonte | Lívia Sant'Anna",
      descricao:
        "Cantopexia e cantoplastia: sustentação do canto lateral do olho, quando é indicada, como é feita, recuperação e riscos. Belo Horizonte, MG.",
    },

    eyebrow: "Cirurgia da face · Forma",
    h1: "Cantopexia",
    lead: "Sustentar o canto do olho é, muitas vezes, o que faz uma blefaroplastia dar certo — e raramente é o procedimento pelo qual as pessoas chegam.",

    oQueE: [
      "O canto lateral do olho, onde a pálpebra superior encontra a inferior, é preso ao osso da órbita por um tendão. Com o tempo, esse tendão afrouxa, e a pálpebra inferior perde sustentação, desce e o canto do olho cai.",
      "A cantopexia é a cirurgia que reforça essa fixação sem desinserir o tendão. A cantoplastia é o procedimento mais extenso, em que o tendão é cortado, reposicionado e fixado em posição nova. São coisas diferentes, com indicações diferentes, e a escolha depende do grau de frouxidão medido no exame.",
      "Ela aparece em dois contextos. No primeiro, como procedimento de sustentação associado a uma blefaroplastia inferior, para impedir que a pálpebra seja puxada para baixo pela cicatrização. No segundo, como cirurgia de contorno, para elevar discretamente o canto do olho e produzir um olhar mais amendoado.",
      "É importante ser honesta sobre a segunda indicação: o efeito de mudança de formato do olhar é sutil, e pedidos de mudança acentuada costumam terminar em um olho de aparência artificial e tensa. A cantopexia é uma cirurgia de correção estrutural que tem efeito estético, e não uma cirurgia de transformação do olhar.",
    ],

    indicacoes: [
      "Frouxidão do tendão do canto lateral, identificada no exame por testes específicos de tração e retorno da pálpebra.",
      "Blefaroplastia inferior em pálpebra com frouxidão, em que a sustentação previne o deslocamento da pálpebra para baixo.",
      "Correção de pálpebra inferior já deslocada após cirurgia prévia, com exposição da parte branca abaixo da íris.",
      "Canto lateral do olho abaixado, com olhar de aparência caída ou cansada.",
      "Assimetria entre os cantos dos olhos que incomoda.",
      "Paralisia facial com má oclusão palpebral, em que a sustentação protege a córnea — indicação funcional.",
    ],

    comoEFeito: [
      "A incisão é pequena e fica no canto lateral do olho ou dentro da pálpebra, conforme a técnica escolhida, escondida na linha natural da região.",
      "Na cantopexia, reforço a fixação do tendão ao periósteo da borda da órbita com pontos, sem cortá-lo. É um procedimento de sustentação, mais conservador, com recuperação mais curta.",
      "Na cantoplastia, o tendão é desinserido, o excesso é ressecado e ele é refixado em uma posição mais alta e mais lateral. É indicada quando a frouxidão é maior ou quando é preciso corrigir uma pálpebra já deslocada.",
      "A altura da fixação é definida com muito critério: alguns milímetros a mais produzem um olho puxado e artificial, e alguns a menos não sustentam nada. É uma cirurgia de precisão milimétrica, e é por isso que ela quase nunca é feita como retoque improvisado.",
      "Costuma ser feita com anestesia local e sedação, e com muita frequência associada a uma blefaroplastia no mesmo tempo cirúrgico.",
    ],

    fichaTecnica: {
      duracao:
        "30 a 60 minutos quando isolada; mais tempo quando associada à blefaroplastia",
      anestesia: "Local com sedação, na maioria dos casos",
      internacao: "Alta no mesmo dia",
      retornoSocial: "10 a 14 dias",
      disclaimer:
        "Estas são faixas habituais, não um compromisso. Duração, técnica e tempo de recuperação variam conforme o grau de frouxidão, a associação com outros procedimentos e o histórico de cada paciente.",
    },

    recuperacao: [
      {
        periodo: "Primeiras 48 horas",
        descricao:
          "Inchaço e roxo no canto do olho, sensação de repuxamento e olho mais fechado do lado operado. Compressa fria, cabeceira elevada e lubrificante ocular. A sensação de que o olho ficou puxado demais é comum nesta fase e não representa o resultado.",
      },
      {
        periodo: "Dias 3 a 10",
        descricao:
          "Retirada dos pontos entre o quinto e o sétimo dia. Pode aparecer quemose — um inchaço gelatinoso da conjuntiva, que assusta bastante e costuma se resolver com colírio e tempo. Olho seco e lacrimejamento são frequentes.",
      },
      {
        periodo: "Semanas 2 a 4",
        descricao:
          "Retorno ao trabalho na maioria dos casos. O canto do olho ainda está mais elevado do que ficará, porque parte da correção é intencionalmente feita com margem, sabendo que haverá acomodação. Cicatriz ainda avermelhada.",
      },
      {
        periodo: "Meses 2 e 3",
        descricao:
          "Acomodação do canto e definição do contorno. A sensação de repuxamento vai cedendo. É a partir daqui que se pode avaliar o resultado com alguma segurança.",
      },
      {
        periodo: "Meses 4 a 6",
        descricao:
          "Resultado estabilizado e cicatriz discreta. Assimetrias residuais, quando existem, ficam evidentes nesta fase e é quando se discute qualquer ajuste.",
      },
    ],

    riscosELimites: [
      {
        titulo: "Correção excessiva ou insuficiente",
        descricao:
          "É o risco central deste procedimento, porque a margem de acerto é de milímetros. Elevar demais produz um olho de aparência puxada e artificial; elevar de menos não sustenta a pálpebra e não resolve a queixa. Ambos podem exigir revisão, e a revisão é tecnicamente mais difícil do que a cirurgia original.",
      },
      {
        titulo: "Assimetria entre os dois lados",
        descricao:
          "Os dois cantos cicatrizam e acomodam em ritmos diferentes, e diferenças de altura entre eles podem persistir. Como a região é pequena e a face é lida de forma simétrica, uma diferença de poucos milímetros já é perceptível para quem se olha no espelho todo dia.",
      },
      {
        titulo: "Quemose e olho seco",
        descricao:
          "Quemose, o inchaço gelatinoso da conjuntiva, é frequente, incômoda e costuma resolver em semanas com colírio. Olho seco pode aparecer ou piorar, principalmente em quem já tinha o quadro antes, e às vezes exige lubrificação por tempo prolongado.",
      },
      {
        titulo: "Recidiva ao longo do tempo",
        descricao:
          "O tendão continua envelhecendo depois da cirurgia. A sustentação obtida pode se perder parcialmente ao longo dos anos, sobretudo em quem tem frouxidão importante do tecido. Não é falha da cirurgia, é o tempo continuando a agir.",
      },
      {
        titulo: "Alterações de sensibilidade e cicatriz",
        descricao:
          "Dormência ou sensibilidade alterada no canto do olho é comum nas primeiras semanas e costuma normalizar. A cicatriz fica escondida na linha natural, mas pode permanecer visível de perto por alguns meses e, em raros casos, formar uma pequena membrana no canto do olho que exige ajuste.",
      },
      {
        titulo: "Riscos da anestesia",
        descricao:
          "Mesmo com anestesia local e sedação, a avaliação pré-anestésica é obrigatória, com discussão dos riscos e revisão das medicações em uso.",
      },
    ],

    antesDepois: [],

    faq: [
      {
        pergunta: "Qual a diferença entre cantopexia e cantoplastia?",
        resposta:
          "Na cantopexia, o tendão do canto do olho é reforçado sem ser cortado — é um procedimento de sustentação. Na cantoplastia, o tendão é desinserido e refixado em posição nova, o que permite corrigir frouxidões maiores. A escolha é definida pelo exame, não pela preferência.",
      },
      {
        pergunta: "Meu olho vai ficar puxado?",
        resposta:
          "Não é o objetivo. O efeito buscado é sutil: sustentar o canto e corrigir a queda. Um olho visivelmente puxado é um resultado indesejado, e é justamente por isso que pedidos de mudança acentuada do formato do olhar merecem uma conversa franca antes de qualquer agendamento.",
      },
      {
        pergunta: "Dá para fazer só a cantopexia, sem blefaroplastia?",
        resposta:
          "Dá, quando a queixa é a queda do canto e não há excesso de pele nem bolsa. Na prática, os dois procedimentos costumam aparecer juntos porque as duas alterações costumam aparecer juntas.",
      },
      {
        pergunta: "É o mesmo que fox eye?",
        resposta:
          "Não. Fox eye é um nome popular usado para vários procedimentos diferentes, cirúrgicos e não cirúrgicos, com resultados muito variáveis. A cantopexia é uma cirurgia definida, com indicação anatômica, e o efeito dela sobre o formato do olhar é discreto por natureza.",
      },
      {
        pergunta: "Quanto tempo até o resultado ficar natural?",
        resposta:
          "A sensação de repuxamento cede ao longo das primeiras semanas, o contorno acomoda entre o segundo e o terceiro mês, e o resultado estabiliza por volta do sexto. Avaliar antes disso é avaliar cicatrização em andamento.",
      },
      {
        pergunta: "É um procedimento doloroso?",
        resposta:
          "A dor costuma ser leve e controlada com analgésico comum. O que mais incomoda é a sensação de repuxamento e o olho seco nas primeiras semanas, e não a dor propriamente dita.",
      },
    ],

    ctaFinal: "Agendar consulta",
    relacionados: ["blefaroplastia", "frontoplastia"],

    imagem: {
      tipo: "pendente",
      descricao:
        "Ilustração vetorial em linha filete do canto lateral do olho e do tendão cantal",
    },
  },

  // ---------------------------------------------------------------------------
  // Frontoplastia
  // ---------------------------------------------------------------------------
  {
    slug: "frontoplastia",
    hub: "cirurgia-da-face",
    nome: "Frontoplastia",
    seo: {
      titulo: "Frontoplastia em Belo Horizonte | Lívia Sant'Anna",
      descricao:
        "Cirurgia de elevação da testa e das sobrancelhas: quando é indicada, vias de acesso, recuperação semana a semana e riscos reais.",
    },

    eyebrow: "Cirurgia da face · Forma",
    h1: "Frontoplastia — elevação da testa e das sobrancelhas",
    lead: "Quando a sobrancelha desce, a pálpebra parece pesada. Tratar a pálpebra sem tratar a sobrancelha resolve a metade errada do problema.",

    oQueE: [
      "A frontoplastia, também chamada de lifting frontal ou de sobrancelhas, é a cirurgia que reposiciona a testa e a sobrancelha. Com o tempo, o tecido do terço superior desce, o espaço entre a sobrancelha e o olho diminui e o olhar ganha aparência pesada e fechada.",
      "É uma cirurgia que costuma ser confundida com a blefaroplastia superior. As duas tratam a mesma queixa — o olho parece cansado — a partir de causas diferentes. Se a sobrancelha está no lugar e sobra pele na pálpebra, o procedimento é a blefaroplastia. Se a sobrancelha desceu, retirar pele da pálpebra só puxa a sobrancelha mais para baixo e piora a proporção.",
      "Há mais de uma via de acesso, e a escolha depende da altura da sua testa, da linha do cabelo e do quanto se pretende elevar. A via endoscópica usa pequenas incisões dentro do couro cabeludo. A via pré-capilar, na linha do cabelo, é usada quando a testa é alta e não se quer aumentá-la. Existem ainda acessos menores, apenas para a sobrancelha.",
      "O objetivo é devolver a posição, não elevar ao máximo. Sobrancelha alta demais produz uma expressão permanentemente surpresa, que é um dos resultados mais reconhecíveis e mais difíceis de desfazer em cirurgia da face.",
    ],

    indicacoes: [
      "Queda da sobrancelha com redução do espaço entre ela e o olho, dando aparência pesada ao olhar.",
      "Excesso de pele na pálpebra superior cuja causa principal é a descida da sobrancelha, e não a pálpebra em si.",
      "Assimetria entre as sobrancelhas que incomoda.",
      "Rugas profundas da testa e da glabela em quem já não responde satisfatoriamente à toxina botulínica, como parte do planejamento.",
      "Testa e sobrancelhas com queda em quem também tem indicação de blefaroplastia — os dois procedimentos costumam ser planejados em conjunto.",
      "Não é indicada para quem busca elevação acentuada da sobrancelha, nem como substituto da toxina botulínica em rugas dinâmicas.",
    ],

    comoEFeito: [
      "Na via endoscópica, faço algumas incisões pequenas dentro do couro cabeludo, atrás da linha do cabelo. Por elas, com uma câmera, descolo o tecido da testa, libero as aderências na borda da órbita, trato os músculos responsáveis pelas rugas da glabela quando indicado e fixo o tecido na posição mais alta.",
      "Na via pré-capilar, a incisão acompanha a linha do cabelo. É usada em testa alta, porque não aumenta a altura da fronte — e pode até reduzi-la. A cicatriz fica na transição do cabelo e costuma se tornar discreta, mas exige cuidado e é discutida antes.",
      "Em elevações pequenas ou assimetrias localizadas, um acesso restrito à região da sobrancelha ou associado à própria incisão da blefaroplastia pode ser suficiente.",
      "A fixação é a parte que define a durabilidade do resultado, e pode ser feita com pontos, com túneis ósseos ou com dispositivos absorvíveis, conforme a técnica escolhida.",
      "É frequentemente feita junto com blefaroplastia superior. Nesse caso, a ordem importa: primeiro se eleva a sobrancelha, depois se decide quanta pele da pálpebra realmente sobra — inverter essa ordem é o caminho mais curto para retirar pele demais.",
    ],

    fichaTecnica: {
      duracao:
        "60 a 150 minutos, conforme a via de acesso e a associação com outros procedimentos",
      anestesia:
        "Geral, ou local com sedação, conforme a técnica e a avaliação anestésica",
      internacao: "Alta no mesmo dia ou após uma noite",
      retornoSocial: "12 a 15 dias",
      disclaimer:
        "Estas são faixas habituais, não um compromisso. Duração, via de acesso, tipo de anestesia e tempo de recuperação variam conforme a anatomia, a altura da testa e o histórico de cada paciente.",
    },

    recuperacao: [
      {
        periodo: "Primeiras 72 horas",
        descricao:
          "Inchaço da testa e ao redor dos olhos, que costuma descer por gravidade e deixar os olhos bastante fechados no segundo e terceiro dia. Roxo é comum. Curativo ou faixa conforme a técnica, cabeceira bem elevada e compressa fria. Dor costuma ser leve, mas a sensação de aperto na cabeça é marcante.",
      },
      {
        periodo: "Dias 4 a 10",
        descricao:
          "Inchaço e roxo em franca redução. Retirada de pontos ou grampos, em geral entre o sétimo e o décimo dia. Começa a coceira no couro cabeludo, que é sinal de reinervação e costuma ser o sintoma mais irritante desta cirurgia. Lavagem do cabelo liberada conforme orientação.",
      },
      {
        periodo: "Semanas 2 a 4",
        descricao:
          "Retorno ao trabalho na maioria dos casos, a partir de doze a quinze dias. Dormência do couro cabeludo à frente das incisões é esperada e vai persistir por meses. A sobrancelha ainda está mais alta do que ficará: parte da elevação inicial é intencional e acomoda com o tempo.",
      },
      {
        periodo: "Meses 2 e 3",
        descricao:
          "Acomodação da posição da sobrancelha e da testa. A expressão volta a parecer natural. Liberação para atividade física plena conforme avaliação. Sensibilidade retornando aos poucos, com formigamento e coceira intermitentes.",
      },
      {
        periodo: "Meses 4 a 12",
        descricao:
          "Resultado estabilizado, cicatrizes maduras e sensibilidade do couro cabeludo em recuperação — que pode levar até um ano para normalizar por completo, e em algumas áreas pode não normalizar.",
      },
    ],

    riscosELimites: [
      {
        titulo: "Dormência e coceira no couro cabeludo",
        descricao:
          "É o efeito mais frequente e o mais subestimado desta cirurgia. A área atrás das incisões fica dormente por meses, e a fase de recuperação da sensibilidade vem acompanhada de coceira e formigamento incômodos. Na maioria dos casos normaliza dentro de um ano, mas áreas de dormência permanente são possíveis.",
      },
      {
        titulo: "Assimetria entre as sobrancelhas",
        descricao:
          "As sobrancelhas já são assimétricas antes da cirurgia, e a cicatrização acontece em ritmos diferentes de cada lado. Diferença perceptível de altura pode persistir e, em alguns casos, é ajustada depois, com cirurgia ou com toxina botulínica.",
      },
      {
        titulo: "Elevação excessiva e expressão surpresa",
        descricao:
          "Elevar demais a sobrancelha produz uma expressão permanentemente espantada, que é um dos resultados mais reconhecíveis em cirurgia da face e um dos mais difíceis de corrigir. Por isso o planejamento busca a posição natural da sua sobrancelha, não a mais alta possível.",
      },
      {
        titulo: "Queda de cabelo ao longo das incisões",
        descricao:
          "Rarefação temporária dos fios próximos às incisões é relativamente comum e costuma se recuperar em alguns meses. Falha permanente na linha da incisão é incomum, mas está descrita, e é mais relevante em quem já tem rarefação prévia.",
      },
      {
        titulo: "Lesão do ramo frontal do nervo facial",
        descricao:
          "O nervo que move o músculo da testa passa em um trajeto conhecido e vulnerável nessa região. Fraqueza temporária, com dificuldade de levantar uma sobrancelha, pode acontecer e costuma regredir em semanas ou meses. Lesão permanente é rara, mas é um dos riscos mais sérios desta cirurgia e faz parte do consentimento.",
      },
      {
        titulo: "Recidiva ao longo dos anos",
        descricao:
          "O tecido continua envelhecendo. Parte da elevação se perde progressivamente, com velocidade que varia conforme a técnica de fixação, a qualidade da pele e o tempo. O resultado é duradouro, não permanente.",
      },
      {
        titulo: "Mudança da linha do cabelo e cicatrizes",
        descricao:
          "A via endoscópica pode elevar discretamente a linha do cabelo, aumentando a altura da testa; a via pré-capilar evita isso, mas deixa uma cicatriz na transição, que pode ficar visível em quem cicatriza mal ou usa o cabelo preso para trás.",
      },
      {
        titulo: "Riscos da anestesia",
        descricao:
          "Existem e são discutidos na avaliação pré-anestésica, obrigatória, com revisão das medicações e das condições clínicas antes de qualquer agendamento.",
      },
    ],

    antesDepois: [],

    faq: [
      {
        pergunta: "Como sei se preciso de frontoplastia ou de blefaroplastia?",
        resposta:
          "Pelo exame. Se a sobrancelha está em posição adequada e sobra pele na pálpebra, é blefaroplastia. Se a sobrancelha desceu, retirar pele da pálpebra tende a piorar a proporção. Em boa parte dos casos a resposta é os dois, e a ordem em que se faz cada um importa.",
      },
      {
        pergunta: "Vou ficar com cara de espantada?",
        resposta:
          "Esse é o resultado que o planejamento existe para evitar. A meta é devolver a sobrancelha à posição que ela tinha, não elevá-la ao máximo. Nas primeiras semanas ela fica mais alta do que ficará, porque parte da elevação acomoda com o tempo.",
      },
      {
        pergunta: "A cirurgia substitui a toxina botulínica?",
        resposta:
          "Não. A frontoplastia reposiciona tecido; a toxina relaxa músculo. Rugas dinâmicas da testa e da glabela continuam sendo tratadas com toxina depois da cirurgia, na maioria dos casos, e as duas coisas se complementam em vez de competir.",
      },
      {
        pergunta: "Fica cicatriz visível?",
        resposta:
          "Na via endoscópica, são incisões pequenas escondidas dentro do couro cabeludo. Na via pré-capilar, a cicatriz fica na linha do cabelo e costuma se tornar discreta, mas é a que exige mais atenção — sobretudo em quem prende o cabelo para trás com frequência.",
      },
      {
        pergunta: "Quanto tempo dura o resultado?",
        resposta:
          "É duradouro, e costuma ser medido em anos, mas não é permanente: o tecido continua envelhecendo. A velocidade da perda varia conforme a técnica de fixação, a qualidade da pele e a genética.",
      },
      {
        pergunta: "Quando posso lavar o cabelo e pintar?",
        resposta:
          "A lavagem costuma ser liberada poucos dias após a cirurgia, conforme a orientação do seu caso. Coloração e química no cabelo pedem espera maior, em geral algumas semanas depois da cicatrização completa das incisões.",
      },
    ],

    ctaFinal: "Agendar consulta",
    relacionados: ["blefaroplastia", "cantopexia", "toxina-botulinica"],

    imagem: {
      tipo: "pendente",
      descricao:
        "Ilustração vetorial em linha filete do terço superior da face com a linha da sobrancelha",
    },
  },
];
