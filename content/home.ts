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
    // 27 caracteres; o layout raiz acrescenta " | Dra. Lívia Sant'Anna".
    titulo: "Otorrino em BH e Uberlândia",
    descricao:
      "Otorrinolaringologista em Belo Horizonte e Uberlândia. Nariz, ouvido e garganta em adultos e crianças, e cirurgia plástica da face.",
  },

  // ---------------------------------------------------------------------------
  // § 1 — Chamada
  // ---------------------------------------------------------------------------
  hero: {
    eyebrow: "Otorrinolaringologia · Cirurgia da face · BH e Uberlândia",

    /*
      Duas linhas, e não três.

      A terceira ("para você viver melhor") custava uma linha inteira de altura
      no celular e não dizia nada que a pessoa não soubesse — quem procura um
      otorrino já sabe que quer respirar melhor. Cada linha aqui empurra o CTA
      para baixo, e o CTA acima da dobra é o que esta página existe para
      entregar. "Dormir melhor" é comparativo e descreve desfecho clínico; o
      que a norma veda é garantir resultado.
    */
    h1: ["Nariz, ouvido e garganta —", "respirar e dormir melhor."],

    lead: "Atendo e opero adultos e crianças em Belo Horizonte e Uberlândia.",

    cta: { texto: "Agendar consulta", href: "/contato" },

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

    /*
      Um parágrafo, e não dois.

      O segundo repetia, em prosa, o que a ficha de formação logo abaixo já diz
      em mono — e o que o lead do hero já disse em uma linha. Numa página cuja
      função é levar ao agendamento, dizer três vezes a mesma coisa não
      convence mais: só adia o botão.
    */
    apresentacao: [
      "Atendo e opero como otorrinolaringologista geral, e realizo cirurgia plástica da face dentro do escopo da especialidade.",
    ],

    /*
      Era "Conhecer a trajetória", apontando para /dra-livia-santanna.

      Este é o único CTA do meio da página, e ele mandava o lead para fora do
      funil justamente no ponto em que ela acabou de decidir que confia. O link
      para a página dela continua existindo — vira texto discreto ao lado do
      botão, em `ctaSecundario`, que é o peso que ele merece.
    */
    cta: { texto: "Agendar consulta", href: "/contato" },
    ctaSecundario: { texto: "Ver a trajetória completa", href: "/dra-livia-santanna" },
  },

  // ---------------------------------------------------------------------------
  // § 3 — Experiência hospitalar
  // ---------------------------------------------------------------------------
  experiencia: {
    eyebrow: "Experiência",
    h2: "Onde eu opero",
    // Uma linha. O parágrafo anterior explicava por que hospital importa —
    // argumento que a própria lista faz sozinha, e mais rápido.
    texto: "Os lugares onde me formei e onde opero hoje.",
    cta: { texto: "Agendar consulta", href: "/contato" },
  },

  // ---------------------------------------------------------------------------
  // § 4 — Procedimentos e atendimentos
  // ---------------------------------------------------------------------------
  procedimentos: {
    eyebrow: "O que eu faço",
    h2: "O que eu trato",
    texto: "Nem tudo termina em cirurgia — boa parte se resolve na consulta.",

    tituloCirurgias: "Cirurgias que realizo",
    tituloAtendimentos: "O que trato em consulta",

    /*
      Três queixas por órgão, e não seis.

      Dezoito itens em três colunas produziam uma parede de texto exatamente
      onde a pessoa precisava decidir — o dono do site chamou isso de
      "informação embaralhada", e ele tem razão: uma lista longa não aumenta a
      chance de alguém se reconhecer, ela reduz a chance de alguém ler.

      As três que ficaram em cada órgão são as de maior volume de busca. As
      outras não sumiram do site: vivem nas páginas de procedimento e nos hubs,
      que é onde elas trabalham para o SEO e onde há espaço para explicá-las.
      Cada grupo agora termina em um link para o hub correspondente.

      Queixa, não diagnóstico. É onde a pessoa se reconhece — e é o que faz a
      home passar no teste dos cinco segundos do briefing § 2.
    */
    atendimentos: [
      {
        orgao: "Nariz",
        queixas: [
          "Nariz entupido",
          "Rinite e sinusite de repetição",
          "Ronco e sono que não descansa",
        ],
      },
      {
        orgao: "Ouvido",
        queixas: [
          "Otite de repetição",
          "Dificuldade para ouvir",
          "Zumbido e tontura",
        ],
      },
      {
        orgao: "Garganta",
        queixas: [
          "Amigdalite de repetição",
          "Amígdalas e adenoides aumentadas",
          "Respiração pela boca na criança",
        ],
      },
    ],

    cta: { texto: "Agendar consulta", href: "/contato" },
    fecho:
      "Toda cirurgia envolve riscos. Eles são explicados individualmente na consulta e no termo de consentimento.",
  },
};
