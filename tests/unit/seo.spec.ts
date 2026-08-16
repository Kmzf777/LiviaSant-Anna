import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

import robots from "@/app/robots";
import { GET as llmsFull } from "@/app/llms-full.txt/route";
import { GET as llms } from "@/app/llms.txt/route";
import {
  getHome,
  getMedica,
  listarHospitais,
  listarHubs,
  listarPaginasInstitucionais,
  listarProcedimentos,
  listarRotas,
} from "@/content";
import { MARCADOR_PENDENTE, physicianJsonLd } from "@/lib/jsonld";
import { SITE, tituloSeo } from "@/lib/site";

/**
 * SEO técnico.
 *
 * O que estes testes protegem é uma decisão que se perde fácil: o nome dela
 * aparece uma vez só, no `title.template` do layout raiz, e `seo.titulo`
 * carrega apenas a parte distintiva. Enquanto isso valer, acrescentar "Dra." ou
 * trocar o domínio é uma edição em um arquivo. Basta um `seo.titulo` novo vir
 * com "| Lívia Sant'Anna" colado no fim para o site voltar a ter duas fontes
 * para a mesma decisão — e o título duplicado só aparece na SERP, semanas
 * depois.
 */

const RAIZ = resolve(import.meta.dirname, "../..");

/**
 * Limites de exibição.
 *
 * 60 é o ponto em que o Google passa a truncar o título. A faixa da descrição
 * tem piso e teto: acima de 165 ela é cortada, e abaixo de 120 o buscador
 * costuma descartá-la e escrever a própria a partir do corpo da página — o
 * texto sobre o qual ninguém tem controle. `content/tipos.ts` impõe um teto
 * mais apertado (155), conferido em `conteudo.spec.ts`.
 */
const LIMITE_TITULO = 60;
const MINIMO_DESCRICAO = 120;
const MAXIMO_DESCRICAO = 165;

type Metatexto = {
  readonly rota: string;
  readonly titulo: string;
  readonly descricao: string;
  /** Onde o texto está escrito, para a mensagem de falha apontar o arquivo. */
  readonly origem: string;
};

/**
 * As quatro rotas cujo texto de metadata mora na própria página.
 *
 * Elas não têm entrada em `content/` — são páginas de estrutura, não de
 * conteúdo editorial. Cada uma declara um `const SEO: Seo` com `titulo` e
 * `descricao`, no mesmo formato de `content/tipos.ts`. Em vez de duplicar os
 * textos aqui, o teste lê o arquivo e extrai o que ele declara: assim ele mede
 * o que o site publica, e não uma cópia que envelhece.
 */
const PAGINAS_COM_METADATA_PROPRIA: readonly { rota: string; arquivo: string }[] =
  [
    {
      rota: "/dra-livia-santanna",
      arquivo: "app/(institucional)/dra-livia-santanna/page.tsx",
    },
    { rota: "/consulta", arquivo: "app/(institucional)/consulta/page.tsx" },
    {
      rota: "/consultorio",
      arquivo: "app/(institucional)/consultorio/page.tsx",
    },
    { rota: "/contato", arquivo: "app/(institucional)/contato/page.tsx" },
  ];

function lerFonte(arquivo: string): string {
  return readFileSync(resolve(RAIZ, arquivo), "utf8");
}

function extrair(fonte: string, campo: string, arquivo: string): string {
  // O valor vem em literal de aspas duplas, eventualmente na linha seguinte
  // ao rótulo — é como o Prettier formata os campos longos.
  const encontrado = new RegExp(`${campo}:\\s*"((?:[^"\\\\]|\\\\.)*)"`).exec(
    fonte,
  );

  if (!encontrado?.[1]) {
    throw new Error(
      `Não achei "${campo}" no const SEO de ${arquivo}. Se o formato mudou, ` +
        `este teste precisa acompanhar — não o desligue.`,
    );
  }

  return encontrado[1];
}

/** Título e descrição de toda rota, venham de onde vierem. */
function metatextos(): readonly Metatexto[] {
  const home = getHome();

  const doConteudo: Metatexto[] = [
    { rota: "/", ...home.seo, origem: "content/home.ts" },
    ...listarHubs().map((hub) => ({
      rota: `/${hub.slug}`,
      ...hub.seo,
      origem: "content/hubs.ts",
    })),
    ...listarProcedimentos().map((procedimento) => ({
      rota: `/${procedimento.hub}/${procedimento.slug}`,
      ...procedimento.seo,
      origem: `content/procedimentos (${procedimento.slug})`,
    })),
    ...listarPaginasInstitucionais().map((pagina) => ({
      rota: `/${pagina.slug}`,
      ...pagina.seo,
      origem: "content/legal.ts",
    })),
  ];

  const dasPaginas = PAGINAS_COM_METADATA_PROPRIA.map(({ rota, arquivo }) => {
    const fonte = lerFonte(arquivo);
    return {
      rota,
      titulo: extrair(fonte, "titulo", arquivo),
      descricao: extrair(fonte, "descricao", arquivo),
      origem: arquivo,
    };
  });

  return [...doConteudo, ...dasPaginas];
}

describe("títulos", () => {
  it("cobre toda rota de listarRotas()", () => {
    // Sem isto, os testes abaixo passariam ignorando uma rota nova em silêncio.
    const cobertas = new Set(metatextos().map((item) => item.rota));
    for (const rota of listarRotas()) {
      expect(cobertas.has(rota), `rota "${rota}" sem título conhecido`).toBe(
        true,
      );
    }
  });

  it("cabe em 60 caracteres depois do sufixo do layout raiz", () => {
    for (const { rota, titulo, origem } of metatextos()) {
      const final = tituloSeo(titulo);
      expect(
        final.length,
        `${rota} (${origem}) — "${final}" tem ${final.length} caracteres`,
      ).toBeLessThanOrEqual(LIMITE_TITULO);
    }
  });

  it("não repete o nome dela: o sufixo vem do template", () => {
    for (const { rota, titulo, origem } of metatextos()) {
      expect(titulo, `${rota} (${origem})`).not.toMatch(/Lívia/i);
      expect(titulo, `${rota} (${origem})`).not.toMatch(/Sant'?Anna/i);
    }
  });

  it("declara o sufixo uma vez só, no layout raiz", () => {
    const layout = lerFonte("app/layout.tsx");
    // Dois templates: um para o <title>, outro para o og:title. O Next resolve
    // o og:title com o template de OpenGraph do pai, não com o de `title`.
    const templates = layout.match(/template: `%s \| \$\{SITE\.nomeSeo\}`/g);
    expect(templates?.length, "faltou um dos dois templates").toBe(2);

    expect(SITE.nomeSeo).toBe("Dra. Lívia Sant'Anna");
    // O bloco normativo do CFM continua sem título — ver COMPLIANCE-CFM.md § 1.
    expect(SITE.nome).toBe("Lívia Sant'Anna");
  });

  it("monta o sufixo à mão na home, que o template não alcança", () => {
    // O `title.template` do layout raiz vale para segmentos filhos; a home é o
    // `page` do mesmo segmento. Se alguém trocar isto por `home.seo.titulo`
    // cru, a home vira a única rota sem o nome dela no título — e só o HTML
    // construído mostra.
    const home = lerFonte("app/page.tsx");
    expect(home).toContain("title: tituloSeo(home.seo.titulo)");
    expect(tituloSeo("x")).toBe(`x | ${SITE.nomeSeo}`);
  });

  it("mantém o título padrão dentro do limite", () => {
    // Só aparece em rota sem título próprio (a 404, por exemplo), e mesmo lá
    // é o primeiro texto que alguém lê sobre ela numa aba de navegador.
    const padrao = `${SITE.nomeSeo} — Otorrino e cirurgia da face`;
    expect(lerFonte("app/layout.tsx")).toContain(
      "${SITE.nomeSeo} — Otorrino e cirurgia da face",
    );
    expect(padrao.length).toBeLessThanOrEqual(LIMITE_TITULO);
  });
});

describe("descrições", () => {
  it("fica entre 120 e 165 caracteres", () => {
    for (const { rota, descricao, origem } of metatextos()) {
      expect(
        descricao.length,
        `${rota} (${origem}) — ${descricao.length} caracteres: "${descricao}"`,
      ).toBeGreaterThanOrEqual(MINIMO_DESCRICAO);
      expect(
        descricao.length,
        `${rota} (${origem}) — ${descricao.length} caracteres: "${descricao}"`,
      ).toBeLessThanOrEqual(MAXIMO_DESCRICAO);
    }
  });

  it("não repete a mesma descrição em duas rotas", () => {
    // Descrição duplicada é o sinal clássico de página de baixo valor.
    const descricoes = metatextos().map((item) => item.descricao);
    expect(new Set(descricoes).size).toBe(descricoes.length);
  });
});

describe("llms.txt", () => {
  it("responde em texto puro, com charset", async () => {
    const resposta = llms();
    expect(resposta.headers.get("Content-Type")).toBe(
      "text/plain; charset=utf-8",
    );
    expect((await resposta.text()).length).toBeGreaterThan(500);
  });

  it("nunca publica marcador de pendência", async () => {
    // A mesma regra do JSON-LD: um agente que lê "[CONFIRMAR: telefone]" o
    // repete como se fosse informação, e o erro sai do controle de quem o
    // cometeu. Ver lib/pendencias.ts.
    expect(await llms().text()).not.toContain(MARCADOR_PENDENTE);
    expect(await llmsFull().text()).not.toContain(MARCADOR_PENDENTE);
  });

  it("segue a forma da especificação: H1, resumo e seções", async () => {
    const texto = await llms().text();
    const linhas = texto.split("\n");

    expect(linhas[0]?.startsWith("# ")).toBe(true);
    expect(linhas.some((linha) => linha.startsWith("> "))).toBe(true);
    expect(texto).toContain("## Avisos");
  });

  it("lista os três hubs, os onze procedimentos e as páginas legais", async () => {
    const texto = await llms().text();

    for (const hub of listarHubs()) {
      expect(texto, `hub ${hub.slug}`).toContain(`/${hub.slug})`);
    }
    for (const procedimento of listarProcedimentos()) {
      expect(texto, procedimento.slug).toContain(
        `/${procedimento.hub}/${procedimento.slug})`,
      );
    }
    for (const pagina of listarPaginasInstitucionais()) {
      expect(texto, pagina.slug).toContain(`/${pagina.slug})`);
    }
  });

  it("traz o texto integral de cada procedimento no llms-full", async () => {
    const texto = await llmsFull().text();

    for (const procedimento of listarProcedimentos()) {
      expect(texto, procedimento.slug).toContain(procedimento.lead);
      expect(texto, `riscos de ${procedimento.slug}`).toContain(
        procedimento.riscosELimites[0].descricao,
      );
    }
  });
});

describe("formação e vínculo não se misturam", () => {
  /*
    Os dois testes abaixo cobrem o mesmo defeito em dois formatos, porque ele
    apareceu nos dois: `content/medica.ts` lista, na mesma coleção, onde ela
    estudou e onde ela trabalha. Na página isso é a trajetória e se lê bem
    junto. Fora dela, cada saída precisa escolher.
  */

  it("declara como alumniOf só quem de fato a formou", () => {
    const nomes = (physicianJsonLd().alumniOf as { name: string }[]).map(
      (item) => item.name,
    );

    // `alumniOf` é `EducationalOrganization` no schema.org. Emitir aqui um
    // hospital onde ela opera afirma ao Google que ela se formou nele.
    for (const hospital of listarHospitais().filter((item) => item.atual)) {
      expect(nomes.join(" | "), `${hospital.nome} não é escola`).not.toContain(
        hospital.nome,
      );
    }

    expect(nomes).toHaveLength(
      getMedica().formacao.filter((item) => item.academico).length,
    );
  });

  it("lista os quatro hospitais no llms.txt, e não só os correntes", async () => {
    // Filtrar por `atual` apagava Vila da Serra e Madre Teresa — os dois que
    // respondem "onde ela se formou e com quem operou". Um agente que lê este
    // arquivo responde por ele.
    const texto = await llms().text();

    for (const hospital of listarHospitais()) {
      expect(texto, hospital.nome).toContain(hospital.nome);
    }
  });
});

describe("robots.txt", () => {
  const regras = robots().rules;
  const grupos = Array.isArray(regras) ? regras : [regras];

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
  ];

  it("declara um grupo explícito para cada rastreador de IA, liberado", () => {
    for (const bot of RASTREADORES_DE_IA) {
      const grupo = grupos.find((item) => item.userAgent === bot);
      expect(grupo, `sem grupo para ${bot}`).toBeDefined();
      expect(grupo?.allow, `${bot} deveria estar liberado`).toBe("/");
    }
  });

  it("fecha a galeria de componentes em todos os grupos", () => {
    for (const grupo of grupos) {
      expect(grupo.disallow, `grupo ${String(grupo.userAgent)}`).toContain(
        "/_dev/",
      );
    }
  });

  it("aponta o sitemap absoluto", () => {
    expect(robots().sitemap).toBe(`${SITE.url}/sitemap.xml`);
  });
});
