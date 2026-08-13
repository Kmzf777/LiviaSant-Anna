/**
 * Limite de envios por IP — janela deslizante, em memória.
 *
 * ---------------------------------------------------------------------------
 * LIMITAÇÃO, ESCRITA AQUI PORQUE É AQUI QUE ELA MORDE
 * ---------------------------------------------------------------------------
 *
 * O contador vive num `Map` do processo. Na Vercel, o site roda em várias
 * instâncias serverless que sobem e descem sozinhas, e **cada uma tem o seu
 * próprio Map**. Na prática:
 *
 *   - com N instâncias quentes, o limite real é até N vezes o configurado;
 *   - uma instância nova nasce com o contador zerado;
 *   - uma instância ociosa é desligada e leva o contador junto.
 *
 * Ou seja: isto é proteção contra abuso casual — o dedo preso no botão, o
 * robô simples que já passou pela armadilha —, **não contra ataque
 * coordenado**. Quem quiser furar, fura.
 *
 * A alternativa correta é um contador compartilhado (Vercel KV / Redis), que
 * está no roadmap (`docs/ROADMAP.md`). Não foi feito na v1 porque acrescenta
 * uma dependência de infraestrutura, uma conta a administrar e uma chave a
 * girar, para um formulário que ainda não recebeu a primeira mensagem. A troca
 * é local: só `verificarLimite` muda, e a assinatura já é assíncrona por
 * fora — ver `app/actions/contato.ts`.
 *
 * A defesa que não depende disto continua valendo em qualquer cenário: a
 * armadilha do formulário, a validação do servidor e o fato de o envio custar
 * uma chamada autenticada de e-mail, não uma gravação em banco.
 */

export type OpcoesDeLimite = {
  /** Envios permitidos dentro da janela. */
  readonly limite?: number;
  readonly janelaMs?: number;
  /** Injetável para o teste não depender do relógio. */
  readonly agora?: number;
};

export type ResultadoDeLimite = {
  readonly permitido: boolean;
  /** Quantos envios ainda cabem na janela depois deste. */
  readonly restante: number;
  /** Segundos até liberar. `0` quando permitido. */
  readonly esperarSegundos: number;
};

export const LIMITE_PADRAO = 3;
export const JANELA_PADRAO_MS = 10 * 60 * 1000;

/**
 * Teto de chaves guardadas. Um `Map` sem teto é um vazamento de memória com
 * outro nome: basta um robô variar o IP para o processo crescer sem parar.
 * Ao estourar, a chave mais antiga sai — quem sai é quem parou de enviar.
 */
const MAXIMO_DE_CHAVES = 5000;

const memoria = new Map<string, number[]>();

/**
 * Registra um envio e diz se ele cabe na janela.
 *
 * Janela deslizante de verdade, não balde por período fixo: cada envio guarda
 * o próprio instante e os que saíram da janela são descartados. Um balde de
 * dez minutos deixaria alguém enviar o limite inteiro às 10h09 e o limite
 * inteiro de novo às 10h10.
 *
 * Só conta quando o envio é permitido. Tentativa barrada não estende o
 * bloqueio — castigar quem espera e tenta de novo é como se constrói um
 * bloqueio que nunca termina.
 */
export function verificarLimite(
  chave: string,
  opcoes: OpcoesDeLimite = {},
): ResultadoDeLimite {
  const limite = opcoes.limite ?? LIMITE_PADRAO;
  const janelaMs = opcoes.janelaMs ?? JANELA_PADRAO_MS;
  const agora = opcoes.agora ?? Date.now();
  const inicio = agora - janelaMs;

  const anteriores = (memoria.get(chave) ?? []).filter(
    (instante) => instante > inicio,
  );

  if (anteriores.length >= limite) {
    const maisAntigo = anteriores[0] ?? agora;
    const esperar = Math.max(1, Math.ceil((maisAntigo + janelaMs - agora) / 1000));

    memoria.set(chave, anteriores);
    return { permitido: false, restante: 0, esperarSegundos: esperar };
  }

  anteriores.push(agora);
  memoria.set(chave, anteriores);

  if (memoria.size > MAXIMO_DE_CHAVES) {
    const maisAntiga = memoria.keys().next();
    if (!maisAntiga.done) memoria.delete(maisAntiga.value);
  }

  return {
    permitido: true,
    restante: Math.max(0, limite - anteriores.length),
    esperarSegundos: 0,
  };
}

/** Só para teste. Em produção o contador nunca é zerado à mão. */
export function limparLimites(): void {
  memoria.clear();
}

/**
 * IP de quem enviou, a partir dos cabeçalhos do proxy.
 *
 * `x-forwarded-for` pode vir com uma cadeia de proxies; o primeiro item é o
 * cliente. Sem nenhum cabeçalho — ambiente local, teste — devolve uma chave
 * fixa: o limite continua existindo, aplicado à máquina inteira.
 */
export function ipDeCabecalhos(cabecalhos: Headers): string {
  const encaminhado = cabecalhos.get("x-forwarded-for");
  const primeiro = encaminhado?.split(",")[0]?.trim();
  if (primeiro) return primeiro;

  return cabecalhos.get("x-real-ip")?.trim() ?? "local";
}
