import { z } from "zod";

/**
 * Contrato do formulário de contato — compartilhado entre cliente e servidor.
 *
 * O mesmo objeto é usado nos dois lados, mas eles não têm o mesmo peso: a
 * validação do cliente é conveniência (evita uma ida ao servidor para dizer
 * que faltou o e-mail), e a do servidor é a que conta. Quem envia um POST
 * direto para a Server Action, sem passar pelo formulário, encontra
 * exatamente estas mesmas regras — e mais a lista de assuntos válidos e o
 * limite por IP, que só existem no servidor.
 *
 * Por isso este arquivo não importa nada de `/content`: ele é carregado no
 * bundle do cliente, e arrastar os onze procedimentos (com riscos, ficha e
 * FAQ de cada um) para lá custaria dezenas de KB para validar um `<select>`.
 * A lista de assuntos vive em `lib/assuntos.ts`, que só o servidor importa.
 *
 * As mensagens de erro seguem a regra de copy do § 6: dizem o que houve e
 * como resolver, sem pedir desculpas e sem culpar quem escreveu.
 */

// -----------------------------------------------------------------------------
// Campos
// -----------------------------------------------------------------------------

export const CAMPOS_CONTATO = [
  "nome",
  "whatsapp",
  "email",
  "assunto",
  "mensagem",
  "consentimento",
] as const;

export type CampoContato = (typeof CAMPOS_CONTATO)[number];

/**
 * Ordem em que os campos aparecem na tela.
 *
 * É o que decide para onde o foco vai quando o envio falha: o primeiro campo
 * inválido na ordem de leitura, não o primeiro que o Zod reclamou. Alguém que
 * navega por teclado precisa cair no começo do problema, não no meio dele.
 */
export const ORDEM_DOS_CAMPOS: readonly CampoContato[] = CAMPOS_CONTATO;

export const ROTULOS: Record<CampoContato, string> = {
  nome: "Nome",
  whatsapp: "WhatsApp",
  email: "E-mail",
  assunto: "Assunto",
  mensagem: "Mensagem",
  consentimento: "Consentimento",
};

/**
 * Campo-armadilha.
 *
 * Nome plausível de propósito: um robô que preenche tudo que parece um campo
 * de pessoa cai nele. Quem preenche é descartado em silêncio, **com resposta
 * de sucesso** — avisar o robô que ele foi detectado só ensina o robô.
 *
 * O nome não pode colidir com nenhum campo real, e não deve ser "email2" nem
 * "url": robôs mais novos já ignoram esses. "sobrenome" é o que mais convence
 * num formulário que já pede "nome".
 */
export const CAMPO_ARMADILHA = "sobrenome";

export const LIMITE_MENSAGEM = 2000;

// -----------------------------------------------------------------------------
// Esquema
// -----------------------------------------------------------------------------

/** Só dígitos. É como o telefone é comparado, nunca como é exibido. */
function digitos(valor: string): string {
  return valor.replace(/\D/g, "");
}

/**
 * Aceita 10 ou 11 dígitos (DDD + número), com ou sem o DDI 55 na frente.
 * Não normaliza: o que a pessoa digitou é o que chega no e-mail, porque é o
 * que ela vai reconhecer se precisar corrigir.
 */
function whatsappPlausivel(valor: string): boolean {
  const so = digitos(valor);
  const semDdi = so.startsWith("55") && so.length > 11 ? so.slice(2) : so;
  return semDdi.length === 10 || semDdi.length === 11;
}

export const esquemaContato = z.object({
  nome: z
    .string()
    .trim()
    .min(2, "Escreva o seu nome, para eu saber com quem falo.")
    .max(120, "O nome passou de 120 caracteres. Use o nome pelo qual você é chamada."),

  whatsapp: z
    .string()
    .trim()
    .min(1, "Informe o WhatsApp com DDD — é por onde o consultório retorna.")
    .refine(
      whatsappPlausivel,
      "O número precisa ter DDD e oito ou nove dígitos. Exemplo: (31) 99999-9999.",
    ),

  email: z
    .string()
    .trim()
    .min(1, "Informe um e-mail — é para onde vai a confirmação.")
    .email("O e-mail precisa ter o formato nome@provedor.com.")
    .max(160, "O e-mail passou de 160 caracteres. Confira se não há algo repetido."),

  assunto: z
    .string()
    .trim()
    .min(1, "Escolha um assunto na lista — é o que define quem retorna primeiro."),

  mensagem: z
    .string()
    .trim()
    .min(
      10,
      "Escreva pelo menos uma frase sobre o que você precisa, para o retorno já vir com a informação certa.",
    )
    .max(
      LIMITE_MENSAGEM,
      `A mensagem passou de ${LIMITE_MENSAGEM} caracteres. Resuma o essencial; o detalhe cabe na consulta.`,
    ),

  consentimento: z
    .string()
    .refine(
      (valor) => valor === "on",
      "Marque a caixa de consentimento para o consultório poder usar estes dados no retorno.",
    ),
});

export type DadosContato = z.infer<typeof esquemaContato>;

// -----------------------------------------------------------------------------
// FormData
// -----------------------------------------------------------------------------

export type ValoresContato = Record<string, string>;

/**
 * Normaliza `FormData` num objeto de strings.
 *
 * Existe para que cliente e servidor validem **exatamente a mesma entrada**.
 * Se cada lado montasse o objeto do seu jeito, uma caixa desmarcada seria
 * `null` de um lado e `""` do outro, e as duas validações divergiriam no
 * único campo em que divergir é caro.
 */
export function dadosDoFormulario(formulario: FormData): ValoresContato {
  const valores: ValoresContato = {};

  for (const campo of CAMPOS_CONTATO) {
    const valor = formulario.get(campo);
    valores[campo] = typeof valor === "string" ? valor : "";
  }

  const armadilha = formulario.get(CAMPO_ARMADILHA);
  valores[CAMPO_ARMADILHA] = typeof armadilha === "string" ? armadilha : "";

  return valores;
}

export type ErrosContato = Partial<Record<CampoContato, string>>;

/** Primeira mensagem por campo. Duas mensagens no mesmo campo confundem. */
export function errosDe(erro: z.ZodError): ErrosContato {
  const erros: ErrosContato = {};

  for (const problema of erro.issues) {
    const campo = problema.path[0];
    if (typeof campo !== "string") continue;
    if (!(CAMPOS_CONTATO as readonly string[]).includes(campo)) continue;
    if (erros[campo as CampoContato] !== undefined) continue;

    erros[campo as CampoContato] = problema.message;
  }

  return erros;
}

/** O primeiro campo com erro na ordem da tela. */
export function primeiroCampoInvalido(erros: ErrosContato): CampoContato | null {
  return ORDEM_DOS_CAMPOS.find((campo) => erros[campo] !== undefined) ?? null;
}

// -----------------------------------------------------------------------------
// Estado da Server Action
//
// Mora aqui, e não em app/actions/contato.ts, por uma restrição do React: um
// módulo "use server" só pode exportar funções assíncronas. Tipo e constante
// precisam de outra casa, e o cliente já importa este arquivo.
// -----------------------------------------------------------------------------

export type StatusFormulario = "inicial" | "sucesso" | "erro";

export type EstadoFormulario = {
  readonly status: StatusFormulario;
  /** Frase de resumo. Vazia no estado inicial. */
  readonly mensagem: string;
  readonly erros: ErrosContato;
  /**
   * Muda a cada resposta do servidor, inclusive quando a resposta é idêntica
   * à anterior. É o que faz o efeito de foco disparar no segundo envio com o
   * mesmo erro — sem isso, quem erra duas vezes igual não recebe foco nenhum.
   */
  readonly carimbo: number;
};

export const ESTADO_INICIAL: EstadoFormulario = {
  status: "inicial",
  mensagem: "",
  erros: {},
  carimbo: 0,
};
