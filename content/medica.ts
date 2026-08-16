import type { Medica } from "./tipos";

/**
 * Dados da médica.
 *
 * O bloco `identificacao` é normativo: alimenta o componente <IdentificacaoCFM />,
 * que aparece em todas as páginas com fonte, tamanho e cor uniformes conforme a
 * Resolução CFM 2.336/2023. Não acrescente "Dra." ao nome — o título não faz
 * parte do bloco.
 *
 * `descricaoAtuacao` é a única formulação autorizada. Ela NÃO é cirurgiã
 * plástica: o RQE é em Otorrinolaringologia, e ela realiza cirurgia plástica da
 * face dentro do escopo da especialidade. O script verify:termos reprova o
 * título em qualquer arquivo.
 */
export const MEDICA: Medica = {
  identificacao: {
    nome: "Lívia Sant'Anna",
    crm: "CRM-MG 83.288",
    especialidade: "Otorrinolaringologia",
    rqe: "RQE 70735",
  },

  descricaoAtuacao:
    "Otorrinolaringologista, com atuação em cirurgia plástica da face",

  cidade: "Belo Horizonte, MG",

  biografia: [
    "Formei-me pela Universidade Federal de Viçosa e fiz residência em Otorrinolaringologia no Hospital Madre Teresa, em Belo Horizonte. Depois, o fellowship em cirurgia plástica da face no Hospital UMC, em Uberlândia. Atendo e opero como otorrinolaringologista geral, e realizo as cirurgias plásticas da face dentro do escopo da especialidade.",
    // [CONFIRMAR] Parágrafo pessoal — por que escolheu a especialidade e como
    // conduz a consulta. Registrado em PENDENCIAS.md. Não invente: este
    // parágrafo é o que diferencia a página "A médica" de um currículo, e
    // precisa vir dela.
  ],

  /*
    Os três primeiros itens são formação; os dois últimos são vínculo de
    trabalho. Na página eles convivem na mesma lista de propósito — quem lê quer
    a trajetória inteira de uma vez. Fora dela, `academico` separa os dois: só
    os três primeiros viram `alumniOf` no JSON-LD e só eles aparecem sob
    "Formação" no /llms.txt. Ver o comentário de `ItemFormacao` em tipos.ts.
  */
  formacao: [
    {
      rotulo: "Graduação",
      descricao: "Universidade Federal de Viçosa",
      academico: true,
    },
    {
      rotulo: "Residência",
      descricao: "Otorrinolaringologia · Hospital Madre Teresa · Belo Horizonte",
      academico: true,
    },
    {
      rotulo: "Fellowship",
      descricao: "Cirurgia plástica da face · Hospital UMC · Uberlândia",
      academico: true,
    },
    {
      rotulo: "Equipes",
      descricao:
        "Hospital Vila da Serra · Instituto de Otorrinolaringologia · Belo Horizonte",
      academico: false,
    },
    {
      rotulo: "Cirurgias",
      descricao: "Hospital Mater Dei",
      academico: false,
    },
  ],

  /*
    A blusa vinho desta foto é a razão de ela ser a escolhida para a seção "A
    médica": o tom bate com `wine-700`, então o retrato pertence à paleta em vez
    de conviver com ela. Está no briefing § 12.1, e conferido na foto real.
  */
  retrato: {
    tipo: "imagem",
    imagem: {
      src: "/fotos/livia-jaleco-branco.jpeg",
      alt: "Lívia Sant'Anna, de jaleco branco sobre blusa vinho, diante de um fundo claro.",
      largura: 1024,
      altura: 1536,
    },
  },
};
