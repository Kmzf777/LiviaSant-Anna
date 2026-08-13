"use server";

import { headers } from "next/headers";

import { rotuloDeAssunto, valoresDeAssunto } from "@/lib/assuntos";
import { ipDeCabecalhos, verificarLimite } from "@/lib/rate-limit";
import {
  CAMPO_ARMADILHA,
  dadosDoFormulario,
  errosDe,
  esquemaContato,
  type DadosContato,
  type EstadoFormulario,
} from "@/lib/schema";

/**
 * Envio do formulário de contato — Server Action, não route handler.
 *
 * Não é preferência de estilo. Um route handler exigiria um endpoint público,
 * um `fetch` no cliente, serialização à mão dos dois lados e um caminho de
 * erro que só existe no JavaScript do navegador. A Server Action recebe o
 * `FormData` que o próprio `<form>` monta, o que faz o formulário continuar
 * funcionando enquanto o JS não hidratou, e mantém a validação autoritativa do
 * lado de cá sem duplicar contrato.
 *
 * ---------------------------------------------------------------------------
 * A ORDEM DAS PORTAS IMPORTA
 * ---------------------------------------------------------------------------
 *
 *   1. Armadilha    — descarta o robô em silêncio, com resposta de SUCESSO.
 *                     Antes de tudo: não gasta cota, não gera erro, não
 *                     ensina nada a quem está sondando.
 *   2. Validação    — o servidor é a fonte da verdade. O cliente valida por
 *                     conveniência; quem posta direto na action encontra
 *                     exatamente as mesmas regras aqui.
 *   3. Limite       — só depois de válido. Um erro de digitação não pode
 *                     consumir a cota de quem está tentando marcar consulta.
 *   4. Envio        — e, se ele falhar, a resposta diz que falhou.
 *
 * ---------------------------------------------------------------------------
 * SEM CHAVE DE ENVIO
 * ---------------------------------------------------------------------------
 *
 * Em produção, falta de `RESEND_API_KEY` (ou dos endereços) é ERRO explícito.
 * Em desenvolvimento, a mensagem vai para o log do servidor e a resposta diz
 * isso com todas as letras.
 *
 * O que nunca acontece, em nenhum ambiente: responder "enviado" sem que nada
 * tenha sido enviado. Um formulário que finge ter enviado é pior do que um
 * formulário quebrado — o quebrado a pessoa vê e liga; o que finge, ela espera
 * um retorno que não vem.
 */

const ASSUNTO_INVALIDO =
  "Escolha um assunto na lista — é o que define quem retorna primeiro.";

function agora(): number {
  return Date.now();
}

function sucesso(mensagem: string): EstadoFormulario {
  return { status: "sucesso", mensagem, erros: {}, carimbo: agora() };
}

function erro(
  mensagem: string,
  erros: EstadoFormulario["erros"] = {},
): EstadoFormulario {
  return { status: "erro", mensagem, erros, carimbo: agora() };
}

const MENSAGEM_SUCESSO =
  "Mensagem enviada. O retorno vem pelo WhatsApp ou pelo e-mail que você informou.";

// -----------------------------------------------------------------------------
// Envio
// -----------------------------------------------------------------------------

type Configuracao = {
  readonly chave: string;
  readonly destino: string;
  readonly remetente: string;
};

function lerConfiguracao(): Configuracao | null {
  const chave = process.env.RESEND_API_KEY?.trim();
  const destino = process.env.CONTATO_EMAIL_DESTINO?.trim();
  const remetente = process.env.CONTATO_EMAIL_REMETENTE?.trim();

  if (!chave || !destino || !remetente) return null;
  return { chave, destino, remetente };
}

function corpoDoEmail(dados: DadosContato, assunto: string, ip: string): string {
  return [
    "Mensagem enviada pelo formulário de contato do site.",
    "",
    `Nome:      ${dados.nome}`,
    `WhatsApp:  ${dados.whatsapp}`,
    `E-mail:    ${dados.email}`,
    `Assunto:   ${assunto}`,
    "",
    "Mensagem:",
    dados.mensagem,
    "",
    "---",
    `Consentimento de tratamento de dados registrado no envio (LGPD, art. 11, I).`,
    `Recebido em ${new Date().toISOString()} — origem ${ip}.`,
  ].join("\n");
}

/**
 * `import` dinâmico de propósito: sem chave configurada, o SDK do Resend nunca
 * é carregado. Em desenvolvimento isso significa que o formulário funciona num
 * clone recém-baixado, sem nenhuma variável de ambiente.
 */
async function enviarPorEmail(
  configuracao: Configuracao,
  dados: DadosContato,
  assunto: string,
  ip: string,
): Promise<{ ok: true } | { ok: false; detalhe: string }> {
  try {
    const { Resend } = await import("resend");
    const resend = new Resend(configuracao.chave);

    const resposta = await resend.emails.send({
      from: configuracao.remetente,
      to: configuracao.destino,
      replyTo: dados.email,
      subject: `Contato pelo site — ${assunto} — ${dados.nome}`,
      text: corpoDoEmail(dados, assunto, ip),
    });

    if (resposta.error) {
      return { ok: false, detalhe: resposta.error.message };
    }

    return { ok: true };
  } catch (causa) {
    return {
      ok: false,
      detalhe: causa instanceof Error ? causa.message : String(causa),
    };
  }
}

// -----------------------------------------------------------------------------
// A action
// -----------------------------------------------------------------------------

export async function enviarContato(
  _anterior: EstadoFormulario,
  formulario: FormData,
): Promise<EstadoFormulario> {
  const valores = dadosDoFormulario(formulario);

  // 1. Armadilha. Sucesso de mentira para o robô, silêncio no resto.
  if (valores[CAMPO_ARMADILHA]) {
    return sucesso(MENSAGEM_SUCESSO);
  }

  // 2. Validação — a que conta.
  const resultado = esquemaContato.safeParse(valores);

  if (!resultado.success) {
    const erros = errosDe(resultado.error);
    const quantos = Object.keys(erros).length;

    return erro(
      quantos === 1
        ? "Falta um campo para enviar."
        : `Faltam ${quantos} campos para enviar.`,
      erros,
    );
  }

  const dados = resultado.data;

  // O `<select>` do navegador aceita ser reescrito por quem quiser. A lista
  // válida é conferida aqui, contra o conteúdo, não contra o que chegou.
  if (!valoresDeAssunto().includes(dados.assunto)) {
    return erro("Falta um campo para enviar.", { assunto: ASSUNTO_INVALIDO });
  }

  // 3. Limite por IP.
  const cabecalhos = await headers();
  const ip = ipDeCabecalhos(cabecalhos);
  const limite = verificarLimite(`contato:${ip}`);

  if (!limite.permitido) {
    const minutos = Math.max(1, Math.ceil(limite.esperarSegundos / 60));

    return erro(
      `Este dispositivo já enviou algumas mensagens agora há pouco. ` +
        `Espere ${minutos} minuto${minutos > 1 ? "s" : ""} e envie de novo, ` +
        `ou fale direto com o consultório.`,
    );
  }

  // 4. Envio.
  const assunto = rotuloDeAssunto(dados.assunto) ?? dados.assunto;
  const configuracao = lerConfiguracao();

  if (!configuracao) {
    if (process.env.NODE_ENV === "production") {
      console.error(
        "[contato] RESEND_API_KEY, CONTATO_EMAIL_DESTINO ou " +
          "CONTATO_EMAIL_REMETENTE ausente. A mensagem NÃO foi enviada.",
      );

      return erro(
        "O envio de mensagens não está configurado neste servidor, e nada foi " +
          "enviado. Nenhuma mensagem se perdeu no caminho: ela não saiu. " +
          "Fale direto com o consultório enquanto isso.",
      );
    }

    console.info(
      `[contato] Ambiente de desenvolvimento, sem chave de envio.\n` +
        corpoDoEmail(dados, assunto, ip),
    );

    return sucesso(
      "Ambiente de desenvolvimento: nada foi enviado por e-mail. A mensagem " +
        "foi registrada no log do servidor, que é onde você a encontra.",
    );
  }

  const envio = await enviarPorEmail(configuracao, dados, assunto, ip);

  if (!envio.ok) {
    console.error(`[contato] Falha no envio: ${envio.detalhe}`);

    return erro(
      "O serviço de e-mail recusou o envio e a mensagem não saiu. Tente de " +
        "novo em alguns minutos, ou fale direto com o consultório.",
    );
  }

  return sucesso(MENSAGEM_SUCESSO);
}
