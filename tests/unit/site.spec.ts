import { afterEach, describe, expect, it, vi } from "vitest";

import { _internos } from "@/lib/site";

/**
 * Resolução da URL do site.
 *
 * Existe por um deploy quebrado. `NEXT_PUBLIC_SITE_URL ?? PADRAO` parecia
 * suficiente e não era: `??` só cai no padrão para `null`/`undefined`, e uma
 * variável de ambiente declarada e vazia é string vazia. `SITE.url` virava
 * `""`, o `metadataBase: new URL("")` do layout estourava, e o build da Vercel
 * morria com `TypeError: Invalid URL` apontando para um chunk minificado.
 *
 * O caso da string vazia é o primeiro teste da lista, e o motivo de todos os
 * outros: se um valor vazio passa, qualquer valor estranho também passa.
 */

const { limpar, normalizar, ehUrlValida, resolverUrl, PADRAO } = _internos;

const VARIAVEIS = [
  "NEXT_PUBLIC_SITE_URL",
  "VERCEL_PROJECT_PRODUCTION_URL",
  "VERCEL_URL",
] as const;

function definir(valores: Partial<Record<(typeof VARIAVEIS)[number], string>>) {
  for (const nome of VARIAVEIS) {
    if (nome in valores) vi.stubEnv(nome, valores[nome] as string);
    else vi.stubEnv(nome, "");
  }
}

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("limpar", () => {
  it("trata vazio e espaço em branco como ausente", () => {
    // O caso que derrubou o deploy.
    expect(limpar("")).toBeUndefined();
    expect(limpar("   ")).toBeUndefined();
    expect(limpar(undefined)).toBeUndefined();
  });

  it("descarta aspas coladas ao copiar do .env para o painel", () => {
    expect(limpar('"https://exemplo.com.br"')).toBe("https://exemplo.com.br");
    expect(limpar("'https://exemplo.com.br'")).toBe("https://exemplo.com.br");
  });

  it("apara espaço", () => {
    expect(limpar("  https://exemplo.com.br  ")).toBe("https://exemplo.com.br");
  });
});

describe("normalizar", () => {
  it("acrescenta o esquema que a Vercel não manda", () => {
    // VERCEL_URL vem como "meu-site.vercel.app", sem protocolo.
    expect(normalizar("meu-site.vercel.app")).toBe("https://meu-site.vercel.app");
  });

  it("preserva o esquema quando ele existe", () => {
    expect(normalizar("http://localhost:3000")).toBe("http://localhost:3000");
  });

  it("tira a barra final, para não gerar caminhos com barra dupla", () => {
    expect(normalizar("https://exemplo.com.br/")).toBe("https://exemplo.com.br");
    expect(normalizar("https://exemplo.com.br///")).toBe("https://exemplo.com.br");
  });
});

describe("ehUrlValida", () => {
  it("aceita http e https", () => {
    expect(ehUrlValida("https://exemplo.com.br")).toBe(true);
    expect(ehUrlValida("http://localhost:3000")).toBe(true);
  });

  it("recusa o que não é URL", () => {
    expect(ehUrlValida("")).toBe(false);
    expect(ehUrlValida("nao é uma url")).toBe(false);
  });

  it("recusa esquema que não serve para uma página", () => {
    // `new URL` aceita estes; `metadataBase` não faz nada de útil com eles.
    expect(ehUrlValida("file:///c:/site")).toBe(false);
    expect(ehUrlValida("javascript:alert(1)")).toBe(false);
  });
});

describe("resolverUrl", () => {
  it("usa a variável explícita quando ela existe", () => {
    definir({ NEXT_PUBLIC_SITE_URL: "https://liviasantanna.com.br" });
    expect(resolverUrl()).toBe("https://liviasantanna.com.br");
  });

  it("cai no padrão quando a variável está vazia", () => {
    // A regressão exata. Antes: "" → new URL("") → build quebrado.
    definir({ NEXT_PUBLIC_SITE_URL: "" });
    expect(resolverUrl()).toBe(PADRAO);
  });

  it("cai no padrão quando não há variável nenhuma", () => {
    definir({});
    expect(resolverUrl()).toBe(PADRAO);
  });

  it("falha alto quando a variável existe e está errada", () => {
    // Silenciar aqui publicaria canonical apontando para o lugar errado —
    // estrago silencioso que demora a aparecer. O erro diz qual variável é.
    definir({ NEXT_PUBLIC_SITE_URL: "isso não é uma url" });
    expect(() => resolverUrl()).toThrow(/NEXT_PUBLIC_SITE_URL/);
  });

  it("usa o domínio de produção da Vercel quando não há configuração", () => {
    definir({ VERCEL_PROJECT_PRODUCTION_URL: "livia.vercel.app" });
    expect(resolverUrl()).toBe("https://livia.vercel.app");
  });

  it("usa a URL do deploy em preview", () => {
    definir({ VERCEL_URL: "livia-git-branch-abc.vercel.app" });
    expect(resolverUrl()).toBe("https://livia-git-branch-abc.vercel.app");
  });

  it("prefere o domínio de produção à URL do deploy", () => {
    definir({
      VERCEL_PROJECT_PRODUCTION_URL: "producao.vercel.app",
      VERCEL_URL: "preview.vercel.app",
    });
    expect(resolverUrl()).toBe("https://producao.vercel.app");
  });

  it("prefere a configuração explícita a qualquer coisa da Vercel", () => {
    definir({
      NEXT_PUBLIC_SITE_URL: "https://liviasantanna.com.br",
      VERCEL_PROJECT_PRODUCTION_URL: "producao.vercel.app",
    });
    expect(resolverUrl()).toBe("https://liviasantanna.com.br");
  });

  it("aceita a variável explícita com aspas e barra final", () => {
    definir({ NEXT_PUBLIC_SITE_URL: '"https://liviasantanna.com.br/"' });
    expect(resolverUrl()).toBe("https://liviasantanna.com.br");
  });
});
