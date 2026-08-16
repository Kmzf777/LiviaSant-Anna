/**
 * Configuração do site. Fonte única para metadata, sitemap, JSON-LD e OG.
 *
 * ## Por que resolver a URL é mais complicado do que parece
 *
 * A versão anterior era uma linha:
 *
 *   url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://liviasantanna.com.br"
 *
 * e derrubou o primeiro deploy na Vercel. `??` só cai no padrão quando o valor
 * é `null` ou `undefined` — **string vazia passa direto**. Uma variável de
 * ambiente declarada e vazia é exatamente isso, então `SITE.url` virava `""`,
 * o `metadataBase: new URL("")` do layout raiz estourava, e o build morria com
 * `TypeError: Invalid URL` apontando para um chunk minificado, sem dizer qual
 * variável estava errada.
 *
 * Este módulo é server-only na prática (layout, sitemap, robots e jsonld são os
 * únicos consumidores), então pode ler as variáveis que a Vercel injeta sozinha
 * e que não são `NEXT_PUBLIC_`.
 */

/** Domínio presumido. Pendente de confirmação — ver PENDENCIAS.md. */
const PADRAO = "https://liviasantanna.com.br";

/**
 * Descarta vazio, espaço em branco e aspas coladas.
 *
 * As aspas não são paranoia: `.env.example` traz os valores entre aspas, que é
 * a sintaxe correta num arquivo `.env` — e é errada no painel da Vercel, onde o
 * campo já é o valor. Copiar de um para o outro produz `"https://..."`, uma URL
 * inválida por causa de dois caracteres invisíveis no meio de um formulário.
 */
function limpar(valor: string | undefined): string | undefined {
  const texto = valor?.trim().replace(/^["']|["']$/g, "").trim();
  return texto ? texto : undefined;
}

/** `VERCEL_URL` e afins vêm sem esquema: `meu-site.vercel.app`. */
function comProtocolo(valor: string): string {
  return /^https?:\/\//i.test(valor) ? valor : `https://${valor}`;
}

function normalizar(valor: string): string {
  return comProtocolo(valor).replace(/\/+$/, "");
}

function ehUrlValida(valor: string): boolean {
  try {
    const url = new URL(valor);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function resolverUrl(): string {
  const explicita = limpar(process.env.NEXT_PUBLIC_SITE_URL);

  if (explicita) {
    const normalizada = normalizar(explicita);

    // Configurada e inválida é erro de quem configurou, e falhar alto é a
    // resposta certa: publicar com canonical apontando para o lugar errado é
    // pior do que não publicar, e o estrago é silencioso e demora a aparecer.
    if (!ehUrlValida(normalizada)) {
      throw new Error(
        `NEXT_PUBLIC_SITE_URL não é uma URL válida: ${JSON.stringify(
          process.env.NEXT_PUBLIC_SITE_URL,
        )}. ` +
          `Use o domínio completo, sem aspas e sem barra final — ` +
          `por exemplo ${PADRAO}. Para usar o padrão, deixe a variável ausente.`,
      );
    }

    return normalizada;
  }

  /*
    Sem configuração explícita, a Vercel sabe responder.

    `VERCEL_PROJECT_PRODUCTION_URL` é o domínio de produção do projeto e é
    estável entre deploys. `VERCEL_URL` é o endereço único deste deploy — serve
    para preview, onde apontar metadata e OG para produção mostraria a página
    errada em revisão. Fora da Vercel, ambos são ausentes e cai no padrão.
  */
  const daVercel =
    limpar(process.env.VERCEL_PROJECT_PRODUCTION_URL) ??
    limpar(process.env.VERCEL_URL);

  if (daVercel) {
    const normalizada = normalizar(daVercel);
    if (ehUrlValida(normalizada)) return normalizada;
  }

  return PADRAO;
}

export const SITE = {
  /**
   * O nome sem título. É o que o bloco normativo do CFM exige — ver
   * `content/medica.ts` e docs/COMPLIANCE-CFM.md § 1.
   */
  nome: "Lívia Sant'Anna",

  /**
   * O nome como ele aparece para quem busca.
   *
   * "Dra." é o que a pessoa digita e o que ela reconhece na SERP, e a
   * Resolução CFM 2.336/2023 não veda o título — ela veda destacá-lo *dentro*
   * do bloco de identificação. Título de página, OpenGraph e JSON-LD estão
   * fora desse bloco, e é só lá que este valor entra.
   *
   * A separação é deliberada: enquanto forem duas constantes, um `SITE.nome`
   * dentro do `IdentificacaoCFM` continua correto e nenhum "Dra." chega ao
   * bloco por descuido de refatoração.
   */
  nomeSeo: "Dra. Lívia Sant'Anna",

  url: resolverUrl(),
  locale: "pt-BR",
  descricaoPadrao:
    "Otorrinolaringologista em Belo Horizonte, com atuação em cirurgia plástica da face. " +
    "Nariz, ouvido e garganta, rinoplastia, otoplastia e blefaroplastia.",
} as const;

export function urlAbsoluta(caminho: string): string {
  return new URL(caminho, SITE.url).toString();
}

/**
 * O título final, montado como o `title.template` do layout raiz o monta.
 *
 * Quase nenhuma página precisa disto: o template do Next resolve o sufixo
 * sozinho. A exceção é a home — o Next não aplica o template do layout ao
 * `page` do **mesmo** segmento, e o layout raiz e a home são o mesmo segmento.
 * Sem esta função, a home seria a única rota do site sem o nome dela no título,
 * e o defeito só apareceria no HTML construído.
 *
 * Também é o que `tests/unit/seo.spec.ts` usa para medir o título de toda rota.
 */
export function tituloSeo(base: string): string {
  return `${base} | ${SITE.nomeSeo}`;
}

/** Exportado para teste. Não use em componente — prefira `SITE.url`. */
export const _internos = { limpar, normalizar, ehUrlValida, resolverUrl, PADRAO };
