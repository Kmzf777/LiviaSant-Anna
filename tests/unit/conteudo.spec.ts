import { describe, expect, it } from "vitest";

import {
  getHome,
  getMedica,
  listarHubs,
  listarProcedimentos,
  listarRotas,
  LIMITE_DESCRICAO_SEO,
  LIMITE_TITULO_SEO,
  type Seo,
} from "@/content";

/**
 * Invariantes do conteúdo.
 *
 * Os tipos já garantem cardinalidade (mínimo de riscos, mínimo de FAQ) em
 * tempo de compilação. Estes testes cobrem o que o tipo não alcança: limites
 * de tamanho, unicidade de slug e referências que apontam para o vazio.
 */

function checarSeo(seo: Seo, onde: string): void {
  expect(seo.titulo.length, `título SEO de ${onde}: "${seo.titulo}"`).toBeLessThanOrEqual(
    LIMITE_TITULO_SEO,
  );
  expect(
    seo.descricao.length,
    `descrição SEO de ${onde}: "${seo.descricao}"`,
  ).toBeLessThanOrEqual(LIMITE_DESCRICAO_SEO);
  expect(seo.titulo.trim().length, `título SEO vazio em ${onde}`).toBeGreaterThan(0);
  expect(seo.descricao.trim().length, `descrição SEO vazia em ${onde}`).toBeGreaterThan(0);
}

describe("SEO", () => {
  it("respeita os limites na home", () => {
    checarSeo(getHome().seo, "home");
  });

  it("respeita os limites em todo hub", () => {
    for (const hub of listarHubs()) checarSeo(hub.seo, `hub ${hub.slug}`);
  });

  it("respeita os limites em todo procedimento", () => {
    for (const p of listarProcedimentos()) checarSeo(p.seo, `procedimento ${p.slug}`);
  });
});

describe("procedimentos", () => {
  it("tem slug único", () => {
    const slugs = listarProcedimentos().map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("só usa slugs de URL: minúsculas, sem acento, com hífen", () => {
    for (const p of listarProcedimentos()) {
      expect(p.slug, `slug "${p.slug}"`).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    }
  });

  it("aponta 'relacionados' só para procedimentos que existem", () => {
    const existentes = new Set(listarProcedimentos().map((p) => p.slug));
    for (const p of listarProcedimentos()) {
      for (const slug of p.relacionados) {
        expect(existentes.has(slug), `${p.slug} → relacionado inexistente "${slug}"`).toBe(true);
      }
      expect(p.relacionados, `${p.slug} não pode se relacionar consigo mesmo`).not.toContain(
        p.slug,
      );
    }
  });

  it("carrega disclaimer em toda ficha técnica", () => {
    // O tipo exige o campo; este teste exige que ele diga alguma coisa.
    for (const p of listarProcedimentos()) {
      expect(
        p.fichaTecnica.disclaimer.trim().length,
        `ficha técnica de ${p.slug} sem disclaimer`,
      ).toBeGreaterThan(20);
    }
  });

  it("escreve riscos de verdade, não rótulos", () => {
    for (const p of listarProcedimentos()) {
      for (const risco of p.riscosELimites) {
        expect(
          risco.descricao.trim().length,
          `risco "${risco.titulo}" de ${p.slug} está raso demais`,
        ).toBeGreaterThan(40);
      }
    }
  });
});

describe("rotas", () => {
  it("não repete rota", () => {
    const rotas = listarRotas();
    expect(new Set(rotas).size).toBe(rotas.length);
  });

  it("começa toda rota com barra e sem barra final", () => {
    for (const rota of listarRotas()) {
      expect(rota.startsWith("/"), `rota "${rota}"`).toBe(true);
      if (rota !== "/") {
        expect(rota.endsWith("/"), `rota "${rota}" termina com barra`).toBe(false);
      }
    }
  });
});

describe("identificação CFM", () => {
  it("não traz título junto do nome no bloco normativo", () => {
    // A norma pede o nome, o CRM e o RQE em bloco uniforme. "Dra." não faz
    // parte do bloco e não pode entrar por aqui.
    const { nome } = getMedica().identificacao;
    expect(nome).not.toMatch(/\bdra?\.?\b/i);
  });

  it("mantém o CRM e o RQE no formato esperado", () => {
    const { crm, rqe } = getMedica().identificacao;
    expect(crm).toMatch(/^CRM-[A-Z]{2}\s[\d.]+$/);
    expect(rqe).toMatch(/^RQE\s\d+$/);
  });

  it("nunca descreve a atuação como título de especialidade que ela não tem", () => {
    const { descricaoAtuacao } = getMedica();
    expect(descricaoAtuacao).toMatch(/otorrinolaringologista/i);
    expect(descricaoAtuacao).not.toMatch(/cirurgi(ã|ão|ãs|ões)\s+plástic/i);
  });
});
