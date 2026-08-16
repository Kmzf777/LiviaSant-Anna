import type { MetadataRoute } from "next";

import { urlAbsoluta } from "@/lib/site";

/**
 * robots.txt.
 *
 * ---------------------------------------------------------------------------
 * POR QUE OS RASTREADORES DE IA ESTÃO LIBERADOS
 * ---------------------------------------------------------------------------
 *
 * Aprovado pelo dono do site. A decisão não é sobre treinamento de modelo — é
 * sobre onde a próxima paciente procura um médico.
 *
 * Quem pergunta "quem faz rinoplastia em Belo Horizonte" para um assistente
 * recebe uma resposta com três ou quatro nomes e nenhuma segunda página de
 * resultados. Um site que bloqueia esses agentes não aparece nessa lista, e o
 * bloqueio não devolve nada em troca: o conteúdo aqui é público, informativo e
 * escrito justamente para ser citado — riscos, ficha técnica, recuperação. É a
 * mesma aposta que o site faz com o Google, com um canal a mais.
 *
 * Não há dado de paciente neste domínio. Não há área logada. O único diretório
 * fechado é a galeria de componentes, que é ruído em qualquer índice.
 *
 * ## Por que grupos explícitos, e não confiar no `*`
 *
 * O `User-agent: *` cobriria todos eles pela especificação. Só que vários
 * desses agentes historicamente leem a própria linha antes da genérica, e
 * alguns operadores publicam ferramentas de auditoria que reportam "não
 * declarado" quando não encontram o nome. Declarar caro custa uma linha por
 * bot e elimina a ambiguidade — inclusive a de quem revisa este arquivo daqui
 * a um ano e precisa saber que a liberação foi decidida, não esquecida.
 *
 * ## Os grupos
 *
 *   GPTBot              OpenAI — treinamento
 *   OAI-SearchBot       OpenAI — índice do ChatGPT Search
 *   ChatGPT-User        OpenAI — busca disparada por um usuário na conversa
 *   ClaudeBot           Anthropic — rastreamento
 *   Claude-User         Anthropic — busca disparada por um usuário
 *   anthropic-ai        Anthropic — agente legado, ainda citado por auditorias
 *   PerplexityBot       Perplexity — índice
 *   Perplexity-User     Perplexity — busca disparada por um usuário
 *   Google-Extended     Google — controla Gemini e AI Overviews, sem afetar
 *                       a Busca (que segue o grupo `*`)
 *   Applebot-Extended   Apple — mesma lógica do Google-Extended
 *   CCBot               Common Crawl — base de vários modelos e de pesquisa
 *   meta-externalagent  Meta — IA do WhatsApp e do Instagram
 *   Bytespider          ByteDance — TikTok
 *
 * Um bot novo entra aqui, na lista, e não em regra solta espalhada pelo
 * arquivo. Para bloquear algum deles depois, troque o `allow` daquele grupo
 * por `disallow: "/"` — a estrutura já está no lugar.
 */

/** Galeria de componentes: útil no desenvolvimento, ruído na busca. */
const FECHADO = ["/_dev/"];

const RASTREADORES_DE_IA = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-User",
  "anthropic-ai",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot-Extended",
  "CCBot",
  "meta-externalagent",
  "Bytespider",
] as const;

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: FECHADO,
      },
      ...RASTREADORES_DE_IA.map((userAgent) => ({
        userAgent,
        allow: "/",
        // Repetido em todo grupo de propósito: um agente que casa com o
        // próprio nome ignora o grupo `*` inteiro, incluindo o que ele proíbe.
        disallow: FECHADO,
      })),
    ],
    sitemap: urlAbsoluta("/sitemap.xml"),
  };
}
