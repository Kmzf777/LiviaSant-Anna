/**
 * Contrato da camada de conteúdo.
 *
 * Este arquivo é a interface entre conteúdo e apresentação. Páginas nunca
 * importam os arrays direto — sempre através das funções de `content/index.ts`.
 * Migrar para um CMS depois é reimplementar aquelas funções, não reescrever
 * páginas.
 *
 * Vários campos que poderiam ser opcionais são obrigatórios de propósito.
 * Não é rigor decorativo: é o mecanismo que impede uma página de procedimento
 * existir sem seção de riscos, sem ficha técnica ou sem disclaimer. A
 * Resolução CFM 2.336/2023 vira erro de compilação em vez de item de checklist.
 *
 * Ver docs/COMPLIANCE-CFM.md e o spec em docs/superpowers/specs/.
 */

// -----------------------------------------------------------------------------
// Utilitários de cardinalidade
//
// Tuplas abertas garantem mínimo de itens em tempo de compilação. É por isso
// que `riscosELimites` não pode ser um array vazio: o TypeScript recusa.
// -----------------------------------------------------------------------------

export type NaoVazio<T> = readonly [T, ...T[]];
export type MinDois<T> = readonly [T, T, ...T[]];
export type MinTres<T> = readonly [T, T, T, ...T[]];
export type MinCinco<T> = readonly [T, T, T, T, T, ...T[]];

// -----------------------------------------------------------------------------
// Vocabulário compartilhado
// -----------------------------------------------------------------------------

/**
 * Superfície da seção. Lido pelo CSS (`data-superficie`) e pelo Traço, que
 * usa os retângulos das seções para decidir a cor de cada segmento.
 */
export type Superficie = "areia" | "areia-100" | "vinho";

export type HubSlug =
  | "otorrinolaringologia"
  | "cirurgia-da-face"
  | "estetica-facial";

/** Texto que ainda precisa de confirmação da médica. Vai para PENDENCIAS.md. */
export type Pendente<T> = { readonly valor: T; readonly confirmar: string };

export type PerguntaResposta = {
  readonly pergunta: string;
  readonly resposta: string;
};

export type Link = {
  readonly texto: string;
  readonly href: string;
};

// -----------------------------------------------------------------------------
// SEO
//
// Limites do briefing § 10. Validados por teste, não só por convenção.
// -----------------------------------------------------------------------------

export type Seo = {
  /** ≤ 60 caracteres. */
  readonly titulo: string;
  /** ≤ 155 caracteres. */
  readonly descricao: string;
};

export const LIMITE_TITULO_SEO = 60;
export const LIMITE_DESCRICAO_SEO = 155;

// -----------------------------------------------------------------------------
// Imagem
//
// Enquanto não há fotos autorizadas, `PlaceholderImagem` renderiza o bloco
// sand-200 com o selo a 8%. Nenhuma foto de banco entra no repositório, nem
// provisoriamente — se vazar para produção, destrói a credibilidade que as
// fotos reais constroem.
// -----------------------------------------------------------------------------

export type Imagem = {
  readonly src: string;
  /** Descritivo. Decorativa usa string vazia. */
  readonly alt: string;
  readonly largura: number;
  readonly altura: number;
};

export type ImagemOuPendente =
  | { readonly tipo: "imagem"; readonly imagem: Imagem }
  | { readonly tipo: "pendente"; readonly descricao: string };

// -----------------------------------------------------------------------------
// Compliance CFM
// -----------------------------------------------------------------------------

/**
 * Bloco de identificação do briefing § 3.1.
 *
 * A norma exige fonte, tamanho e cor iguais em todo o bloco, sem alteração de
 * tamanho e sem negrito. O componente renderiza um único <p> com uma única
 * classe — não há como destacar "Dra." nem aumentar o nome sem quebrar o teste.
 */
export type IdentificacaoMedica = {
  /** Sem "Dra." — o título não faz parte do bloco normativo. */
  readonly nome: string;
  readonly crm: string;
  readonly especialidade: string;
  readonly rqe: string;
};

/**
 * Um caso de antes e depois.
 *
 * A Resolução CFM 2.336/2023 exige, cumulativamente: autorização formal e
 * documentada, paciente não identificável, imagem sem manipulação, contexto
 * educativo junto à imagem e aviso de que resultados variam.
 *
 * Nenhum campo aqui é opcional. Se falta autorização ou texto educativo, o
 * caso não existe como dado — não há como publicá-lo por engano.
 */
export type CasoAntesDepois = {
  /** Referência ao termo de autorização arquivado. Nunca placeholder. */
  readonly autorizacaoId: string;
  readonly antes: Imagem;
  readonly depois: Imagem;
  /** Indicação, evoluções satisfatórias e insatisfatórias, riscos. */
  readonly textoEducativo: string;
  readonly intervaloEntreFotos: string;
};

// -----------------------------------------------------------------------------
// Procedimento
// -----------------------------------------------------------------------------

export type FichaTecnica = {
  readonly duracao: string;
  readonly anestesia: string;
  readonly internacao: string;
  readonly retornoSocial: string;
  /**
   * Obrigatório. Toda ficha técnica carrega o aviso de que os valores variam
   * por paciente — números sem essa ressalva viram promessa implícita.
   */
  readonly disclaimer: string;
};

export type EtapaRecuperacao = {
  /** "Primeiras 48 horas", "Semana 1", "Mês 1"… */
  readonly periodo: string;
  readonly descricao: string;
};

export type RiscoOuLimite = {
  readonly titulo: string;
  readonly descricao: string;
};

/**
 * Uma página de procedimento.
 *
 * Segue o template do briefing § 8.10 campo a campo. A ordem das propriedades
 * é a ordem das seções na página.
 *
 * `riscosELimites` tem mínimo de 3 e `faq` mínimo de 5 em tempo de compilação.
 * A seção "Riscos e limites" não é rodapé jurídico: é a peça de maior conversão
 * do site. Um médico que escreve honestamente sobre risco ganha mais confiança
 * do que um que promete resultado.
 */
export type Procedimento = {
  readonly slug: string;
  readonly hub: HubSlug;
  readonly nome: string;
  readonly seo: Seo;

  readonly eyebrow: string;
  readonly h1: string;
  readonly lead: string;

  readonly oQueE: NaoVazio<string>;
  readonly indicacoes: NaoVazio<string>;
  readonly comoEFeito: NaoVazio<string>;

  readonly fichaTecnica: FichaTecnica;
  readonly recuperacao: NaoVazio<EtapaRecuperacao>;
  readonly riscosELimites: MinTres<RiscoOuLimite>;

  /** Vazio na v1: não há autorizações documentadas. */
  readonly antesDepois: readonly CasoAntesDepois[];

  readonly faq: MinCinco<PerguntaResposta>;
  readonly ctaFinal: string;

  /** Procedimentos relacionados, por slug. */
  readonly relacionados: readonly string[];

  readonly imagem: ImagemOuPendente;
};

export type Hub = {
  readonly slug: HubSlug;
  readonly nome: string;
  readonly seo: Seo;
  readonly eyebrow: string;
  readonly h1: string;
  readonly lead: string;
  readonly introducao: NaoVazio<string>;
  readonly ctaFinal: string;
};

// -----------------------------------------------------------------------------
// A médica
// -----------------------------------------------------------------------------

export type ItemFormacao = {
  /** Rótulo em mono, caixa alta: GRADUAÇÃO, RESIDÊNCIA, FELLOWSHIP… */
  readonly rotulo: string;
  readonly descricao: string;
  /**
   * `true` só quando a instituição de fato a formou.
   *
   * A lista mistura duas coisas que na página convivem bem — onde ela estudou
   * e onde ela trabalha — e que fora dela não podem se misturar. `alumniOf`, no
   * schema.org, declara `EducationalOrganization`: emitir "Hospital Mater Dei"
   * ali afirma ao Google que ela se formou num lugar onde ela opera. É uma
   * afirmação falsa em dado estruturado, do tipo que nada no site desmente.
   *
   * Por isso é um campo, e não uma lista de rótulos conhecidos em `lib/`: um
   * item novo obriga quem o escreve a decidir o que ele é, em vez de herdar a
   * classificação errada por descuido.
   */
  readonly academico: boolean;
};

export type Medica = {
  readonly identificacao: IdentificacaoMedica;
  /**
   * Como ela pode ser descrita. Nunca "cirurgiã plástica": o RQE é em
   * Otorrinolaringologia. Ela realiza cirurgia plástica da face dentro do
   * escopo da especialidade — a formulação é sempre "otorrinolaringologista,
   * com atuação em cirurgia plástica da face".
   */
  readonly descricaoAtuacao: string;
  readonly cidade: string;
  readonly biografia: NaoVazio<string>;
  readonly formacao: NaoVazio<ItemFormacao>;
  readonly retrato: ImagemOuPendente;
};

// -----------------------------------------------------------------------------
// Consultório e contato
// -----------------------------------------------------------------------------

export type HorarioAtendimento = {
  readonly dias: string;
  readonly horas: string;
};

export type Consultorio = {
  readonly nome: string;
  readonly logradouro: string;
  readonly bairro: string;
  readonly cidade: string;
  readonly uf: string;
  readonly cep: string;
  readonly telefone: string;
  readonly whatsapp: string;
  readonly email: string;
  readonly horarios: NaoVazio<HorarioAtendimento>;
  readonly estacionamento: string;
  readonly acessibilidade: string;
  /** Coordenadas para JSON-LD e para o mapa carregado sob interação. */
  readonly geo: { readonly latitude: number; readonly longitude: number };
  readonly mapaUrl: string;
};

// -----------------------------------------------------------------------------
// Home
// -----------------------------------------------------------------------------

export type PassoConsulta = {
  /** "01" … "04". Numerado porque é sequência real, não decoração. */
  readonly numero: string;
  readonly titulo: string;
  readonly descricao: string;
};

export type CardFrente = {
  readonly eyebrow: string;
  readonly titulo: string;
  readonly resumo: string;
  readonly itens: NaoVazio<string>;
  readonly cta: Link;
};

/**
 * Um grupo de queixas que a pessoa reconhece em si.
 *
 * Existe porque a home precisa passar no teste do briefing § 2: quem chega
 * buscando "amígdala" e quem chega buscando "rinoplastia" têm que saber, em
 * cinco segundos, que estão no lugar certo. Nome de procedimento não faz isso —
 * ninguém procura "timpanoplastia", procura "meu filho tem otite direto".
 */
export type GrupoDeQueixas = {
  readonly orgao: string;
  readonly queixas: NaoVazio<string>;
};

/**
 * A home, em quatro seções.
 *
 * Foi uma home editorial de nove seções e virou landing page de conversão. O
 * motivo está no próprio briefing: a § 2 define como métrica de sucesso que
 * *"um paciente que chega pela busca de 'amígdala' e um que chega por
 * 'rinoplastia' precisam, em 5 segundos, saber que estão no lugar certo"*, e a
 * abertura anterior — "Forma e função, nas mesmas mãos" — não dizia que
 * problema ela resolve.
 *
 * A tese "forma e função" não sumiu: desceu para a página de rinoplastia, que é
 * onde ela é argumento comercial em vez de manifesto.
 *
 * A ordem das quatro é a ordem em que alguém decide: reconhece o problema,
 * confia em quem resolve, vê onde ela opera, encontra o próprio caso, agenda.
 */
export type ConteudoHome = {
  readonly seo: Seo;

  /** § 1 — a chamada. */
  readonly hero: {
    readonly eyebrow: string;
    /** Quebrado em linhas curtas — a quebra é decisão de design. */
    readonly h1: NaoVazio<string>;
    readonly lead: string;
    readonly cta: Link;
    readonly imagem: ImagemOuPendente;
  };

  /** § 2 — quem é ela. A formação vem de `getMedica()`, não daqui. */
  readonly medica: {
    readonly eyebrow: string;
    readonly h2: string;
    readonly papel: string;
    readonly apresentacao: NaoVazio<string>;
    readonly cta: Link;
    /**
     * A saída para a página dela, em peso de link e não de botão.
     *
     * Existe separado de `cta` porque os dois competem: o botão desta seção
     * chegou a ser "Conhecer a trajetória", que era o único CTA do meio da
     * home e mandava o lead para fora do funil no ponto em que ele acabara de
     * decidir que confia. O botão agenda; este link continua oferecendo o
     * aprofundamento a quem o quiser.
     */
    readonly ctaSecundario: Link;
  };

  /** § 3 — onde ela opera. Os hospitais vêm de `listarHospitais()`. */
  readonly experiencia: {
    readonly eyebrow: string;
    readonly h2: string;
    readonly texto: string;
    /** Toda seção da home termina em ação. Ver PLANO-CONVERSAO-SEO.md. */
    readonly cta: Link;
  };

  /** § 4 — o que ela faz, e o fecho. */
  readonly procedimentos: {
    readonly eyebrow: string;
    readonly h2: string;
    readonly texto: string;
    readonly tituloCirurgias: string;
    readonly tituloAtendimentos: string;
    readonly atendimentos: MinTres<GrupoDeQueixas>;
    readonly cta: Link;
    readonly fecho: string;
  };
};

// -----------------------------------------------------------------------------
// Institucional
// -----------------------------------------------------------------------------

export type BlocoTexto = {
  readonly titulo: string;
  readonly paragrafos: NaoVazio<string>;
};

export type PaginaInstitucional = {
  readonly slug: string;
  readonly seo: Seo;
  readonly eyebrow: string;
  readonly h1: string;
  readonly lead: string;
  readonly blocos: NaoVazio<BlocoTexto>;
};

// -----------------------------------------------------------------------------
// Navegação
// -----------------------------------------------------------------------------

export type ItemNav = {
  readonly texto: string;
  readonly href: string;
  readonly filhos?: readonly Link[];
};
