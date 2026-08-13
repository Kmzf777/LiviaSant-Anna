import { FAQ_TRANSVERSAL } from "./faq";
import type { ConteudoHome } from "./tipos";

/**
 * Conteúdo da home. Copy do briefing § 8, textual.
 *
 * A ordem das chaves é a ordem das seções na página. A alternância de
 * superfície (vinho / areia / areia-100) está nos componentes de seção, não
 * aqui — este arquivo é texto, não layout.
 */
export const HOME: ConteudoHome = {
  seo: {
    // 51 caracteres. "Otorrino" em vez do termo completo é deliberado: é a
    // forma como as pessoas efetivamente buscam ("otorrino BH", briefing § 2),
    // e o termo completo estourava o limite de 60.
    titulo: "Otorrino e cirurgia da face em BH | Lívia Sant'Anna",
    descricao:
      "Otorrinolaringologista em Belo Horizonte, com atuação em cirurgia plástica da face. Rinoplastia, desvio de septo, amígdalas, blefaroplastia e otoplastia.",
  },

  // ---------------------------------------------------------------------------
  // § 8.1 — Hero, superfície vinho
  // ---------------------------------------------------------------------------
  hero: {
    eyebrow: "Otorrinolaringologia · Cirurgia da face · Belo Horizonte",
    h1: ["Forma e função,", "nas mesmas mãos."],
    lead: "Otorrinolaringologista com atuação em cirurgia plástica da face. Opero o nariz que respira e o nariz que se vê — e trato os dois como o mesmo problema.",
    ctaPrimario: { texto: "Agendar consulta", href: "/contato" },
    ctaSecundario: { texto: "Conhecer a médica", href: "/dra-livia-santanna" },
    imagem: {
      tipo: "pendente",
      descricao: "Retrato de blazer preto, fundo areia, postura confiante",
    },
  },

  // ---------------------------------------------------------------------------
  // § 8.2 — Faixa de identificação
  // ---------------------------------------------------------------------------
  credenciais: [
    "Residência · Hospital Madre Teresa",
    "Fellowship em cirurgia plástica da face · UMC",
    "Formação · UFV",
  ],

  // ---------------------------------------------------------------------------
  // § 8.3 — Manifesto
  //
  // As linhas são quebradas à mão porque a quebra é decisão de design: cada
  // linha carrega uma ideia inteira. Não junte em um parágrafo.
  // ---------------------------------------------------------------------------
  manifesto: {
    eyebrow: "A premissa",
    linhas: [
      "O nariz é o centro do rosto",
      "e a porta da respiração.",
      "Mudar um sem entender o outro",
      "é resolver metade.",
    ],
    apoio:
      "Minha formação começou pela função: septo, seios da face, via aérea. A cirurgia plástica da face veio depois, e sobre essa base. Por isso, numa rinoplastia, a avaliação da respiração não é um adicional — é parte do planejamento desde a primeira consulta.",
  },

  // ---------------------------------------------------------------------------
  // § 8.4 — As duas frentes
  //
  // O corte visual entre os dois cards é o momento em que o site assume sua
  // dualidade abertamente. Peso visual idêntico: nenhum dos dois é o principal.
  // ---------------------------------------------------------------------------
  duasFrentes: {
    otorrino: {
      eyebrow: "Função",
      titulo: "Otorrinolaringologia",
      resumo:
        "Respirar, ouvir, dormir melhor. Diagnóstico e tratamento clínico e cirúrgico de nariz, ouvido e garganta — em adultos e crianças.",
      itens: [
        "Desvio de septo",
        "Amígdalas e adenoides",
        "Sinusite",
        "Tubo de ventilação",
        "Timpanoplastia",
      ],
      cta: {
        texto: "Ver procedimentos de otorrino",
        href: "/otorrinolaringologia",
      },
    },
    face: {
      eyebrow: "Forma",
      titulo: "Cirurgia e estética da face",
      resumo:
        "Cirurgia da face conduzida por quem opera a função. Planejamento individual, resultado proporcional ao seu rosto.",
      itens: [
        "Rinoplastia",
        "Otoplastia",
        "Blefaroplastia",
        "Cantopexia",
        "Frontoplastia",
        "Toxina botulínica",
      ],
      cta: { texto: "Ver cirurgias da face", href: "/cirurgia-da-face" },
    },
  },

  // ---------------------------------------------------------------------------
  // § 8.5 — Rinoplastia em destaque, full-bleed vinho
  //
  // É aqui que o Traço resolve no perfil de rosto do logo. Ver lib/traco.ts.
  // ---------------------------------------------------------------------------
  rinoplastia: {
    eyebrow: "Em destaque",
    h2: "Rinoplastia estética e funcional",
    corpo:
      "Muita gente chega dizendo que não gosta do próprio nariz e descobre, na consulta, que também não respira bem por ele. Às vezes é o contrário: veio pelo septo e quer entender o que muda no rosto. Os dois caminhos cabem na mesma cirurgia, e é isso que avaliamos juntas antes de qualquer decisão.",
    nota: "Resultados variam conforme anatomia, cicatrização e histórico de cada paciente.",
    cta: {
      texto: "Entender a rinoplastia",
      href: "/cirurgia-da-face/rinoplastia",
    },
  },

  // ---------------------------------------------------------------------------
  // § 8.6 — A médica
  // ---------------------------------------------------------------------------
  medica: {
    eyebrow: "A médica",
    h2: "Lívia Sant'Anna",
    cta: { texto: "Conhecer a trajetória", href: "/dra-livia-santanna" },
  },

  // ---------------------------------------------------------------------------
  // § 8.7 — Como é a consulta
  //
  // Numerado 01–04 porque é sequência real, não decoração.
  // ---------------------------------------------------------------------------
  consulta: {
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
    ],
    fecho:
      "Toda cirurgia envolve riscos. Eles são explicados individualmente na consulta e no termo de consentimento.",
  },

  // ---------------------------------------------------------------------------
  // § 8.8 — Resultados
  //
  // Não há imagens autorizadas na v1. Esta seção explica a ausência em vez de
  // inventar galeria: converter a ausência em sinal de seriedade é melhor do
  // que uma galeria fraca, e é a única opção legal.
  // ---------------------------------------------------------------------------
  resultados: {
    eyebrow: "Resultados",
    h2: "Sobre imagens de antes e depois",
    corpo:
      "Imagens de resultado só são publicadas com autorização formal da paciente, sem qualquer edição, e acompanhadas da explicação clínica que a legislação exige. Enquanto essa curadoria não está pronta, prefiro mostrar os casos pessoalmente na consulta, onde consigo explicar a anatomia de cada um e por que o resultado seria diferente no seu rosto.",
  },

  faq: FAQ_TRANSVERSAL,
};
