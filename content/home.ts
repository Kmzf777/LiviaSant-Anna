import type { ConteudoHome } from "./tipos";

/**
 * Conteúdo da home.
 *
 * Quatro seções, na ordem em que alguém decide procurar um médico. Ver
 * PLANO-HOME.md e o comentário de `ConteudoHome` em `tipos.ts`.
 *
 * Regra de escrita que vale para tudo aqui: nomear a queixa antes de nomear o
 * procedimento. Ninguém procura "timpanoplastia" — procura "meu filho tem otite
 * direto". A palavra técnica entra depois, quando a pessoa já se reconheceu.
 */
export const HOME: ConteudoHome = {
  seo: {
    // 57 caracteres.
    titulo: "Otorrino em BH e Uberlândia | Lívia Sant'Anna",
    descricao:
      "Otorrinolaringologista em Belo Horizonte e Uberlândia. Nariz, ouvido e garganta em adultos e crianças, e cirurgia plástica da face.",
  },

  // ---------------------------------------------------------------------------
  // § 1 — Chamada
  // ---------------------------------------------------------------------------
  hero: {
    eyebrow:
      "Otorrinolaringologia · Cirurgia da face · Belo Horizonte e Uberlândia",

    /*
      A quebra é decisão de design: cada linha carrega uma ideia inteira, e a
      terceira é a única que fala do desfecho. "Viver melhor" é comparativo, não
      promessa — o que a norma veda é garantir resultado, não descrever para que
      serve um tratamento.
    */
    h1: [
      "Cuidado especializado",
      "em nariz, ouvido e garganta",
      "para você viver melhor.",
    ],

    lead: "Respirar pelo nariz, dormir sem roncar, ouvir bem. Atendo e opero adultos e crianças, e realizo cirurgia plástica da face dentro da especialidade.",

    cta: { texto: "Agende sua consulta", href: "/contato" },

    imagem: {
      tipo: "imagem",
      imagem: {
        src: "/fotos/livia-blazer-preto.jpeg",
        alt: "Lívia Sant'Anna, de blazer preto e braços cruzados, diante de um fundo claro.",
        largura: 1024,
        altura: 1536,
      },
    },
  },

  // ---------------------------------------------------------------------------
  // § 2 — A médica
  // ---------------------------------------------------------------------------
  medica: {
    eyebrow: "A médica",
    h2: "Lívia Sant'Anna",
    papel: "Otorrinolaringologista",

    apresentacao: [
      "Formei-me pela Universidade Federal de Viçosa e fiz residência em Otorrinolaringologia no Hospital Madre Teresa, em Belo Horizonte. Depois, o fellowship em cirurgia plástica da face no Hospital UMC, em Uberlândia.",
      "Atendo e opero como otorrinolaringologista geral — nariz, ouvido e garganta, em adultos e crianças — e realizo as cirurgias plásticas da face dentro do escopo da especialidade.",
    ],

    cta: { texto: "Conhecer a trajetória", href: "/dra-livia-santanna" },
  },

  // ---------------------------------------------------------------------------
  // § 3 — Experiência hospitalar
  // ---------------------------------------------------------------------------
  experiencia: {
    eyebrow: "Experiência",
    h2: "Onde eu opero",
    texto:
      "Cirurgia se aprende em centro cirúrgico, ao lado de quem já fez muitas. Estes são os lugares onde me formei e onde opero hoje.",
  },

  // ---------------------------------------------------------------------------
  // § 4 — Procedimentos e atendimentos
  // ---------------------------------------------------------------------------
  procedimentos: {
    eyebrow: "O que eu faço",
    h2: "Cirurgias e atendimento",
    texto:
      "Nem tudo termina em cirurgia — boa parte se resolve na consulta. O que segue é o que trato e o que opero.",

    tituloCirurgias: "Cirurgias que realizo",
    tituloAtendimentos: "O que trato em consulta",

    /*
      Queixa, não diagnóstico. É a coluna em que a pessoa se reconhece — e é o
      que faz a home passar no teste dos cinco segundos do briefing § 2.
    */
    atendimentos: [
      {
        orgao: "Nariz",
        queixas: [
          "Nariz entupido, de um lado ou dos dois",
          "Rinite e crises de espirro",
          "Sinusite de repetição",
          "Ronco e sono que não descansa",
          "Sangramento nasal frequente",
          "Perda de olfato",
        ],
      },
      {
        orgao: "Ouvido",
        queixas: [
          "Otite de repetição, em criança e em adulto",
          "Dificuldade para ouvir",
          "Zumbido",
          "Tontura e vertigem",
          "Sensação de ouvido tampado",
          "Perfuração do tímpano",
        ],
      },
      {
        orgao: "Garganta",
        queixas: [
          "Amigdalite de repetição",
          "Amígdalas e adenoides aumentadas",
          "Respiração pela boca na criança",
          "Rouquidão que não passa",
          "Dor de garganta persistente",
          "Dificuldade para engolir",
        ],
      },
    ],

    cta: { texto: "Agende sua consulta", href: "/contato" },
    fecho:
      "Toda cirurgia envolve riscos. Eles são explicados individualmente na consulta e no termo de consentimento.",
  },
};
