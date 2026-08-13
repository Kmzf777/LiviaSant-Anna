/**
 * Link de WhatsApp com mensagem pré-preenchida por contexto de página.
 *
 * A mensagem muda conforme onde a pessoa clicou: quem sai da página de
 * timpanoplastia não deveria ter que digitar "queria falar sobre
 * timpanoplastia". Reduz atrito e, na prática, chega uma mensagem que a
 * secretária consegue triar.
 *
 * O número vem de content/consultorio.ts e está pendente de confirmação —
 * `linkWhatsapp` recusa número não confirmado em vez de gerar um link quebrado.
 */

const MENSAGEM_PADRAO = "Olá! Gostaria de agendar uma consulta.";

export type ContextoWhatsapp = {
  /** Nome do procedimento, quando a pessoa vem de uma página específica. */
  procedimento?: string;
};

/** Deixa só dígitos. O wa.me não aceita espaço, parênteses nem hífen. */
export function normalizarNumero(numero: string): string {
  return numero.replace(/\D/g, "");
}

/**
 * Um número utilizável tem DDI 55, DDD e 8 ou 9 dígitos: 12 ou 13 no total.
 * Serve para barrar o placeholder `[CONFIRMAR: ...]` antes de virar link.
 */
export function numeroValido(numero: string): boolean {
  // O marcador de pendência precisa ser barrado ANTES da contagem de dígitos.
  // O texto em content/consultorio.ts é
  //   "[CONFIRMAR: WhatsApp com DDI e DDD, ex. 5531999999999]"
  // e `normalizarNumero` descarta as letras, deixando 5531999999999 — treze
  // dígitos começando em 55, que passariam na regra abaixo. O site publicaria
  // um botão abrindo conversa com um número de exemplo. Encontrado pelo teste
  // tests/unit/formulario.spec.tsx.
  if (/\[\s*CONFIRMAR/i.test(numero)) return false;

  const digitos = normalizarNumero(numero);
  return /^55\d{10,11}$/.test(digitos);
}

export function mensagemPara({ procedimento }: ContextoWhatsapp = {}): string {
  if (!procedimento) return MENSAGEM_PADRAO;
  return `Olá! Gostaria de agendar uma consulta sobre ${procedimento}.`;
}

/**
 * Devolve o link, ou `null` quando o número ainda não foi confirmado.
 *
 * `null` é deliberado: o componente que consome isto deve esconder o botão
 * em vez de renderizar um link que não abre conversa nenhuma. Ver PENDENCIAS.md.
 */
export function linkWhatsapp(
  numero: string,
  contexto: ContextoWhatsapp = {},
): string | null {
  if (!numeroValido(numero)) return null;

  const texto = encodeURIComponent(mensagemPara(contexto));
  return `https://wa.me/${normalizarNumero(numero)}?text=${texto}`;
}
