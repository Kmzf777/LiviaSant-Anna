import { describe, expect, it } from "vitest";

import {
  formatarRazao,
  hexParaRgb,
  luminanciaRelativa,
  passaAA,
  razaoDeContraste,
} from "@/lib/contraste";

describe("hexParaRgb", () => {
  it("aceita a forma longa", () => {
    expect(hexParaRgb("#6D1F3A")).toEqual({ r: 109, g: 31, b: 58 });
  });

  it("expande a forma curta", () => {
    expect(hexParaRgb("#abc")).toEqual({ r: 170, g: 187, b: 204 });
  });

  it("aceita sem cerquilha", () => {
    expect(hexParaRgb("6d1f3a")).toEqual({ r: 109, g: 31, b: 58 });
  });

  it("recusa o que não é hex", () => {
    // Nome de cor e rgb() não deveriam existir no projeto: falhar alto aqui
    // é melhor do que calcular contraste sobre um valor inventado.
    expect(() => hexParaRgb("rebeccapurple")).toThrow();
    expect(() => hexParaRgb("rgb(0,0,0)")).toThrow();
    expect(() => hexParaRgb("#12345")).toThrow();
  });
});

describe("luminanciaRelativa", () => {
  it("ancora nos extremos da escala", () => {
    expect(luminanciaRelativa({ r: 0, g: 0, b: 0 })).toBe(0);
    expect(luminanciaRelativa({ r: 255, g: 255, b: 255 })).toBeCloseTo(1, 10);
  });
});

describe("razaoDeContraste", () => {
  it("dá 21:1 entre os extremos", () => {
    expect(razaoDeContraste("#000000", "#ffffff")).toBeCloseTo(21, 5);
  });

  it("dá 1:1 para a mesma cor", () => {
    expect(razaoDeContraste("#6D1F3A", "#6D1F3A")).toBeCloseTo(1, 10);
  });

  it("não depende da ordem dos argumentos", () => {
    const a = razaoDeContraste("#241A1E", "#F6F1EC");
    const b = razaoDeContraste("#F6F1EC", "#241A1E");
    expect(a).toBeCloseTo(b, 10);
  });
});

describe("passaAA", () => {
  it("aprova a tinta sobre a areia", () => {
    expect(passaAA("#241A1E", "#F6F1EC")).toBe(true);
  });

  it("aprova o blush sobre o vinho", () => {
    expect(passaAA("#FBD8C9", "#6D1F3A")).toBe(true);
  });

  it("reprova o valor original de ink-400 do briefing", () => {
    // O briefing trazia #8A7A80 para legendas e eyebrows. Medido, dá 3.62:1
    // sobre sand-50 — reprova AA. A paleta foi corrigida para #6E6266.
    // Este teste existe para que ninguém reverta a correção sem perceber.
    expect(passaAA("#8A7A80", "#F6F1EC")).toBe(false);
    expect(passaAA("#6E6266", "#F6F1EC")).toBe(true);
  });

  it("aceita limiar menor em texto grande", () => {
    const frente = "#8A7A80";
    const fundo = "#F6F1EC";
    expect(passaAA(frente, fundo, "corrido")).toBe(false);
    expect(passaAA(frente, fundo, "grande")).toBe(true);
  });
});

describe("formatarRazao", () => {
  it("arredonda para baixo, nunca reporta um AA que não existe", () => {
    expect(formatarRazao(4.4999)).toBe("4.49:1");
    expect(formatarRazao(21)).toBe("21.00:1");
  });
});
