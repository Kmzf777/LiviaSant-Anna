/**
 * O template de página de procedimento e a composição da rinoplastia.
 *
 * O que se testa aqui é o que quebraria em silêncio e teria consequência:
 *
 *   - a seção de riscos existindo, aberta e no mesmo corpo do resto. É a
 *     obrigação do § 8.10 e o item que o § 14 lista na Definition of Done;
 *   - `data-superficie` em toda seção, porque o Traço mede esses retângulos e
 *     uma seção sem o atributo faz a assinatura do site sumir naquele trecho;
 *   - um único `<h1>` mesmo com a abertura extra da rinoplastia empilhada
 *     antes do template — o jeito mais fácil de essa composição dar errado;
 *   - a ficha técnica com disclaimer, e a galeria de antes e depois ausente
 *     enquanto não houver autorização documentada;
 *   - a ilustração do § 12.3 sem movimento e sem divergir do asset em
 *     `public/ilustracoes`.
 *
 * Aparência não se testa aqui. Para isso existem os scripts de verificação e
 * as capturas nos três breakpoints.
 */

import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";

import { getProcedimento, listarProcedimentos } from "@/content";
import { itensConfirmados } from "@/lib/pendencias";
import type { Procedimento } from "@/content";
import { PaginaProcedimento } from "@/components/medical/PaginaProcedimento";
import { AberturaRinoplastia } from "@/components/sections/rinoplastia/AberturaRinoplastia";
import { FluxoDeAr } from "@/components/sections/rinoplastia/FluxoDeAr";
import {
  COTA,
  DIRECAO,
  ESTRUTURA,
  FLUXO,
} from "@/components/sections/rinoplastia/fluxo-de-ar";

// -----------------------------------------------------------------------------

const HUB = "cirurgia-da-face";

function exigir(slug: string): Procedimento {
  const procedimento = getProcedimento(HUB, slug);
  if (!procedimento) throw new Error(`Procedimento ausente: ${slug}`);
  return procedimento;
}

const RINOPLASTIA = exigir("rinoplastia");
const PROCEDIMENTOS = listarProcedimentos(HUB);

/** Reproduz a composição da rota `[slug]` para o slug carro-chefe. */
function PaginaRinoplastia() {
  return (
    <>
      <AberturaRinoplastia />
      <PaginaProcedimento procedimento={RINOPLASTIA} />
    </>
  );
}

// -----------------------------------------------------------------------------
// O template
// -----------------------------------------------------------------------------

describe("PaginaProcedimento", () => {
  it("tem exatamente um h1, e ele é o h1 do conteúdo", () => {
    const { container } = render(
      <PaginaProcedimento procedimento={RINOPLASTIA} />,
    );

    const titulos = container.querySelectorAll("h1");
    expect(titulos).toHaveLength(1);
    expect(titulos[0]?.textContent).toBe(RINOPLASTIA.h1);
  });

  it("não salta níveis de heading", () => {
    const { container } = render(
      <PaginaProcedimento procedimento={RINOPLASTIA} />,
    );

    const niveis = [...container.querySelectorAll("h1,h2,h3,h4,h5,h6")].map(
      (elemento) => Number(elemento.tagName.slice(1)),
    );

    expect(niveis[0]).toBe(1);
    for (let i = 1; i < niveis.length; i += 1) {
      const anterior = niveis[i - 1] ?? 1;
      expect(niveis[i] ?? 1).toBeLessThanOrEqual(anterior + 1);
    }
  });

  it("declara data-superficie em todas as seções — o Traço mede isso", () => {
    const { container } = render(
      <PaginaProcedimento procedimento={RINOPLASTIA} />,
    );

    const superficies = [
      ...container.querySelectorAll("[data-superficie]"),
    ].map((elemento) => elemento.getAttribute("data-superficie"));

    // Nenhuma seção solta: toda <section> de primeiro nível carrega o atributo.
    const secoesDeTopo = [...container.children].filter(
      (elemento) => elemento.tagName === "SECTION",
    );
    for (const secao of secoesDeTopo) {
      expect(secao.getAttribute("data-superficie")).toBeTruthy();
    }

    // Alternância com intenção: nem tudo em areia, nem vinho demais.
    expect(superficies).toContain("areia");
    expect(superficies).toContain("areia-100");
    expect(superficies).toContain("vinho");
    expect(superficies.filter((s) => s === "vinho").length).toBeLessThanOrEqual(
      2,
    );
  });

  it("renderiza cada uma das seções do § 8.10", () => {
    render(<PaginaProcedimento procedimento={RINOPLASTIA} />);

    for (const titulo of [
      "O que é",
      "Quando é indicado",
      "Como é feito",
      "Ficha técnica",
      "Recuperação",
      "Riscos e limites",
      "Perguntas frequentes",
    ]) {
      expect(
        screen.getByRole("heading", { level: 2, name: titulo }),
      ).toBeInTheDocument();
    }
  });

  it.each(PROCEDIMENTOS.map((p) => [p.slug, p] as const))(
    "%s: a seção de riscos existe, está aberta e traz todos os itens",
    (_slug, procedimento) => {
      const { container } = render(
        <PaginaProcedimento procedimento={procedimento} />,
      );

      const titulo = screen.getByRole("heading", {
        level: 2,
        name: "Riscos e limites",
      });
      const secao = titulo.closest("section");
      expect(secao).not.toBeNull();

      // Nunca escondida: nada de <details> engolindo o conteúdo.
      expect(secao?.querySelector("details")).toBeNull();
      expect(secao?.closest("details")).toBeNull();
      expect(container.querySelector("[hidden]")).toBeNull();

      for (const risco of procedimento.riscosELimites) {
        expect(
          within(secao as HTMLElement).getByText(risco.titulo),
        ).toBeInTheDocument();
        expect(
          within(secao as HTMLElement).getByText(risco.descricao),
        ).toBeInTheDocument();
      }
    },
  );

  it("trata os riscos com o mesmo corpo e a mesma tinta do texto que vende", () => {
    render(<PaginaProcedimento procedimento={RINOPLASTIA} />);

    const primeiro = RINOPLASTIA.riscosELimites[0];
    const descricaoRisco = screen.getByText(primeiro.descricao);

    // O mesmo par de classes usado nos parágrafos de "O que é".
    expect(descricaoRisco.className).toContain("text-body");
    expect(descricaoRisco.className).toContain("text-ink-900");
    expect(descricaoRisco.className).not.toContain("text-ink-400");
  });

  it("renderiza a ficha técnica com o disclaimer obrigatório", () => {
    render(<PaginaProcedimento procedimento={RINOPLASTIA} />);

    expect(
      screen.getByText(RINOPLASTIA.fichaTecnica.duracao),
    ).toBeInTheDocument();
    expect(
      screen.getByText(RINOPLASTIA.fichaTecnica.disclaimer),
    ).toBeInTheDocument();
  });

  it("renderiza a FAQ confirmada em <details> nativo, e só ela", () => {
    const { container } = render(
      <PaginaProcedimento procedimento={RINOPLASTIA} />,
    );

    // A rinoplastia tem perguntas cuja resposta ainda depende da médica
    // (convênios, anestesia local). Elas ficam no conteúdo, marcadas com
    // [CONFIRMAR], e NÃO vão para a tela: mostrar "esta informação está
    // pendente" a quem procura um médico chama atenção para a lacuna sem
    // resolvê-la. Ver lib/pendencias.ts.
    const confirmadas = itensConfirmados(
      RINOPLASTIA.faq,
      "pergunta",
      "resposta",
    );

    expect(confirmadas.length).toBeGreaterThan(0);
    expect(container.querySelectorAll("details")).toHaveLength(
      confirmadas.length,
    );

    for (const item of confirmadas) {
      expect(screen.getByText(item.pergunta)).toBeInTheDocument();
      // A resposta continua no HTML mesmo com o item fechado.
      expect(screen.getByText(item.resposta)).toBeInTheDocument();
    }
  });

  it("não deixa marcador de pendência chegar à tela", () => {
    const { container } = render(
      <PaginaProcedimento procedimento={RINOPLASTIA} />,
    );

    // A garantia de verdade é scripts/verificar-html.ts, que varre o HTML
    // construído das 22 páginas. Este teste é o alarme que dispara primeiro.
    expect(container.textContent ?? "").not.toContain("[CONFIRMAR");
  });

  it("não inventa galeria de antes e depois quando não há autorização", () => {
    render(<PaginaProcedimento procedimento={RINOPLASTIA} />);

    expect(RINOPLASTIA.antesDepois).toHaveLength(0);
    expect(screen.queryByRole("slider")).toBeNull();
    expect(
      screen.queryByRole("heading", { name: "Antes e depois" }),
    ).toBeNull();
  });

  it("liga a trilha e os relacionados sem escrever slug à mão", () => {
    render(<PaginaProcedimento procedimento={RINOPLASTIA} />);

    const trilha = screen.getByRole("navigation", {
      name: "Trilha de navegação",
    });
    expect(
      within(trilha).getByRole("link", { name: "Cirurgia da face" }),
    ).toHaveAttribute("href", "/cirurgia-da-face");

    for (const slug of RINOPLASTIA.relacionados) {
      expect(document.querySelector(`a[href$="/${slug}"]`)).not.toBeNull();
    }
  });

  it("emite MedicalProcedure, FAQPage e BreadcrumbList num único grafo", () => {
    const { container } = render(
      <PaginaProcedimento procedimento={RINOPLASTIA} />,
    );

    const scripts = container.querySelectorAll(
      'script[type="application/ld+json"]',
    );
    expect(scripts).toHaveLength(1);

    const grafo = JSON.parse(
      (scripts[0]?.textContent ?? "").replace(/\\u003c/g, "<"),
    ) as { "@graph": { "@type": string }[] };

    const tipos = grafo["@graph"].map((bloco) => bloco["@type"]);
    expect(tipos).toContain("MedicalProcedure");
    expect(tipos).toContain("FAQPage");
    expect(tipos).toContain("BreadcrumbList");
  });

  it.each(PROCEDIMENTOS.map((p) => [p.slug, p] as const))(
    "%s: renderiza sem depender de nada além do procedimento",
    (_slug, procedimento) => {
      const { container } = render(
        <PaginaProcedimento procedimento={procedimento} />,
      );

      expect(container.querySelectorAll("h1")).toHaveLength(1);
      expect(
        screen.getAllByRole("link", { name: procedimento.ctaFinal }).length,
      ).toBeGreaterThan(0);
    },
  );
});

// -----------------------------------------------------------------------------
// A composição da rinoplastia
// -----------------------------------------------------------------------------

describe("Rinoplastia — composição sobre o template", () => {
  it("continua com um único h1 depois da abertura extra", () => {
    const { container } = render(<PaginaRinoplastia />);

    const titulos = container.querySelectorAll("h1");
    expect(titulos).toHaveLength(1);
    expect(titulos[0]?.textContent).toBe(RINOPLASTIA.h1);
  });

  it("abre em vinho, e compensa o header sticky", () => {
    const { container } = render(<AberturaRinoplastia />);

    const secao = container.querySelector("[data-superficie]");
    expect(secao?.getAttribute("data-superficie")).toBe("vinho");

    // Sem o puxão, o header transparente flutuaria sobre areia com tipografia
    // blush — 1.2:1. Ver Header.tsx.
    expect(secao?.className).toContain("-mt-[var(--header-h)]");
    expect(secao?.className).toContain("var(--header-h)+");
  });

  it("não introduz heading antes do h1 do template", () => {
    const { container } = render(<AberturaRinoplastia />);
    expect(container.querySelectorAll("h1,h2,h3,h4,h5,h6")).toHaveLength(0);
  });

  it("mantém a seção de riscos depois da composição", () => {
    render(<PaginaRinoplastia />);
    expect(
      screen.getByRole("heading", { level: 2, name: "Riscos e limites" }),
    ).toBeInTheDocument();
  });

  it("traz a FAQ estendida — dez perguntas escritas, as confirmadas na tela", () => {
    const { container } = render(<PaginaRinoplastia />);

    // O conteúdo tem dez perguntas: é a página carro-chefe e a FAQ mais longa
    // do site. O que chega à tela são as que já têm resposta.
    expect(RINOPLASTIA.faq.length).toBeGreaterThanOrEqual(10);

    const confirmadas = itensConfirmados(
      RINOPLASTIA.faq,
      "pergunta",
      "resposta",
    );
    expect(container.querySelectorAll("details")).toHaveLength(
      confirmadas.length,
    );
  });
});

// -----------------------------------------------------------------------------
// A ilustração do § 12.3
// -----------------------------------------------------------------------------

describe("FluxoDeAr", () => {
  const ARQUIVO = resolve(
    import.meta.dirname,
    "../../public/ilustracoes/fluxo-de-ar.svg",
  );

  it("é abstrata, vetorial e tem nome acessível", () => {
    const { container } = render(<FluxoDeAr />);

    const svg = container.querySelector("svg");
    expect(svg?.getAttribute("role")).toBe("img");
    expect(svg?.querySelector("title")?.textContent).toContain("Esquema");
    expect(svg?.querySelectorAll("image")).toHaveLength(0);
  });

  it("mantém o peso de traço do logo e herda a cor da superfície", () => {
    const { container } = render(<FluxoDeAr />);

    const svg = container.querySelector("svg");
    expect(svg?.getAttribute("stroke")).toBe("currentColor");
    expect(svg?.getAttribute("stroke-width")).toBe("1");
    expect(svg?.getAttribute("fill")).toBe("none");

    for (const path of svg?.querySelectorAll("path") ?? []) {
      expect(path.getAttribute("vector-effect")).toBe("non-scaling-stroke");
    }
  });

  it("não anima nada — o Traço é a única assinatura (§ 15)", () => {
    const { container } = render(<FluxoDeAr />);

    const svg = container.querySelector("svg");
    expect(
      svg?.querySelectorAll("animate, animateTransform, animateMotion"),
    ).toHaveLength(0);
    expect(svg?.outerHTML).not.toMatch(
      /animation|transition|stroke-dashoffset/,
    );
  });

  it("não divergiu do asset de public/ilustracoes", () => {
    const arquivo = readFileSync(ARQUIVO, "utf8");

    for (const d of [...ESTRUTURA, ...FLUXO, ...DIRECAO, ...COTA]) {
      expect(arquivo).toContain(d);
    }

    expect(arquivo).not.toMatch(/<animate/);
    expect(arquivo).not.toMatch(/#000\b|#fff\b/i);
  });
});
