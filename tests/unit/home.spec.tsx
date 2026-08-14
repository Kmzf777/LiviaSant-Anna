/**
 * Home — os contratos que quebrariam em silêncio.
 *
 * Aparência não se testa aqui: para isso existem `scripts/capturar.mjs` e a
 * crítica visual dos três breakpoints. O que este arquivo protege é o que um
 * screenshot não mostra e um refactor derruba sem avisar:
 *
 *   - o puxão que põe o hero sob o header (sem ele o header cai para tinta e
 *     o hero perde o efeito, sem nenhum erro em lugar nenhum);
 *   - a alternância de `data-superficie`, que três sistemas leem — o CSS, o
 *     foco e o Traço;
 *   - o respiro sem texto entre o manifesto e a rinoplastia, que é onde o
 *     Traço resolve no perfil de rosto;
 *   - a hierarquia de heading;
 *   - e a regra mais séria do JSON-LD: placeholder não vira dado estruturado.
 */

import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";

import Home from "@/app/page";
import { getConsultorio, getHome, getMedica } from "@/content";
import {
  breadcrumbJsonLd,
  ehPendente,
  faqPageJsonLd,
  grafoJsonLd,
  ID_MEDICA,
  medicalBusinessJsonLd,
  physicianJsonLd,
  serializarJsonLd,
} from "@/lib/jsonld";

const HOME = getHome();

function renderizarHome() {
  return render(<Home />);
}

/** As seções full-bleed, na ordem em que aparecem no DOM. */
function superficies(container: HTMLElement): string[] {
  return Array.from(
    container.querySelectorAll<HTMLElement>("[data-superficie]"),
  ).map((secao) => secao.dataset["superficie"] ?? "");
}

function grafoDaPagina(container: HTMLElement): Record<string, unknown>[] {
  const script = container.querySelector(
    'script[type="application/ld+json"]',
  ) as HTMLScriptElement | null;

  expect(script, "a home precisa emitir um bloco de JSON-LD").not.toBeNull();

  const grafo = JSON.parse(script?.textContent ?? "{}") as {
    "@graph"?: Record<string, unknown>[];
  };

  return grafo["@graph"] ?? [];
}

// -----------------------------------------------------------------------------
// Estrutura da página
// -----------------------------------------------------------------------------

describe("home — estrutura", () => {
  it("tem exatamente um h1, e é a tese do site", () => {
    renderizarHome();

    const titulos = screen.getAllByRole("heading", { level: 1 });
    expect(titulos).toHaveLength(1);
    expect(titulos[0]?.textContent).toContain("Forma e função");
  });

  it("não salta nível de heading", () => {
    const { container } = renderizarHome();

    const niveis = Array.from(
      container.querySelectorAll<HTMLElement>("h1, h2, h3, h4, h5, h6"),
    ).map((titulo) => Number(titulo.tagName.slice(1)));

    expect(niveis[0]).toBe(1);

    for (let i = 1; i < niveis.length; i += 1) {
      const anterior = niveis[i - 1] ?? 1;
      const atual = niveis[i] ?? 1;
      expect(
        atual - anterior,
        `salto de h${anterior} para h${atual}`,
      ).toBeLessThanOrEqual(1);
    }
  });

  it("puxa o hero para debaixo do header sticky", () => {
    const { container } = renderizarHome();
    const hero = container.querySelector<HTMLElement>("[data-superficie]");

    // Sem este puxão o header transparente flutua sobre o fundo do body e a
    // tipografia blush cai para ~1.2:1. O Header mede o overlap e se protege
    // caindo para tinta — o hero fica correto, mas perde o efeito, e nada
    // falha. Este teste é o alarme que falta lá.
    expect(hero?.className).toContain("-mt-[var(--header-h)]");
    expect(hero?.dataset["superficie"]).toBe("vinho");
  });

  it("alterna as superfícies na ordem do § 8", () => {
    const { container } = renderizarHome();

    expect(superficies(container)).toEqual([
      "vinho", // § 8.1 hero
      "areia", // § 8.2 faixa de identificação
      "areia", // § 8.3 manifesto
      "areia-100", // § 8.4 as duas frentes
      "areia", // respiro do Traço
      "vinho", // § 8.5 rinoplastia
      "areia", // § 8.6 a médica
      "areia-100", // § 8.7 como é a consulta
      "areia", // § 8.8 resultados
      "areia", // § 8.9 FAQ e contato
    ]);
  });

  it("reserva o respiro sem texto entre o manifesto e a rinoplastia", () => {
    const { container } = renderizarHome();

    const secoes = Array.from(
      container.querySelectorAll<HTMLElement>("[data-superficie]"),
    );
    const respiro = secoes[4];

    // O Traço resolve no perfil de rosto do logo exatamente aqui, e a
    // resolução dura ~1,5 tela. Qualquer texto nesta faixa faz o rosto se
    // desenhar por cima da leitura. Ver components/layout/Traco.tsx.
    expect(respiro?.textContent?.trim()).toBe("");
    expect(respiro?.dataset["superficie"]).toBe("areia");

    // A faixa é declarada por atributo, não por uma altura literal.
    //
    // Antes esta linha assertava `lg:min-h-[160vh]`. O número era o resultado
    // de uma tentativa de fazer o rosto encontrar uma zona livre que deriva
    // ~4.300px em relação a ele — e não encontrava. Hoje o rosto é ancorado
    // AQUI, e a altura da faixa é derivada da geometria da curva
    // (`450 × --traco-unidade`), não escolhida a olho.
    //
    // Assertar o valor amarrava o teste ao número; assertar o contrato amarra
    // ao que importa: existe uma faixa sem texto, e ela é a que o Traço lê.
    //
    // O atributo mora no palco dentro da seção, não na seção: quem precisa da
    // medida é o desenho do rosto, e o e2e o localiza pelo mesmo seletor.
    expect(
      respiro?.querySelector('[data-traco="livre"]'),
      "a faixa livre precisa se declarar por data-traco, que é como o Traço a encontra",
    ).not.toBeNull();
  });
});

// -----------------------------------------------------------------------------
// Conteúdo
// -----------------------------------------------------------------------------

describe("home — conteúdo", () => {
  it("mostra o bloco de identificação do CFM na faixa logo abaixo do hero", () => {
    const { container } = renderizarHome();

    const blocos = container.querySelectorAll('[data-cfm="identificacao"]');
    expect(blocos.length).toBeGreaterThan(0);
    expect(blocos[0]?.textContent).toContain(getMedica().identificacao.crm);
  });

  it("apresenta as duas frentes com o mesmo peso de heading", () => {
    renderizarHome();

    const otorrino = screen.getByRole("heading", {
      name: "Otorrinolaringologia",
    });
    const face = screen.getByRole("heading", {
      name: "Cirurgia e estética da face",
    });

    expect(otorrino.tagName).toBe(face.tagName);
    expect(otorrino.tagName).toBe("H2");
  });

  it("leva aos dois hubs e à rinoplastia", () => {
    renderizarHome();

    for (const destino of [
      "/otorrinolaringologia",
      "/cirurgia-da-face",
      "/cirurgia-da-face/rinoplastia",
      "/contato",
    ]) {
      expect(
        document.querySelector(`a[href="${destino}"]`),
        `nenhum link para ${destino}`,
      ).not.toBeNull();
    }
  });

  it("numera os passos da consulta, porque é sequência real", () => {
    const { container } = renderizarHome();

    const lista = container.querySelector("ol");
    expect(lista).not.toBeNull();
    expect(within(lista as HTMLElement).getByText("01")).toBeInTheDocument();
    expect(within(lista as HTMLElement).getByText("04")).toBeInTheDocument();
  });

  it("explica a ausência de antes e depois em vez de inventar galeria", () => {
    renderizarHome();

    expect(
      screen.getByRole("heading", { name: "Sobre imagens de antes e depois" }),
    ).toBeInTheDocument();

    // Nenhum bloco com cara de foto pendente nesta seção: sugeriria que
    // existem imagens guardadas esperando publicação.
    const secao = screen
      .getByRole("heading", { name: "Sobre imagens de antes e depois" })
      .closest("[data-superficie]");

    expect(secao?.querySelector("[data-placeholder]")).toBeNull();
  });

  it("não mostra ao paciente resposta ainda pendente de confirmação", () => {
    const { container } = renderizarHome();

    const pendentes = HOME.faq.filter((item) => ehPendente(item.resposta));
    expect(
      pendentes.length,
      "o teste só tem sentido enquanto houver pergunta pendente em content/faq.ts",
    ).toBeGreaterThan(0);

    expect(container.textContent).not.toContain("[CONFIRMAR");

    for (const pendente of pendentes) {
      expect(container.textContent).not.toContain(pendente.pergunta);
    }
  });
});

// -----------------------------------------------------------------------------
// JSON-LD
// -----------------------------------------------------------------------------

describe("home — dados estruturados", () => {
  it("emite Physician com CRM e RQE como identificadores", () => {
    const { container } = renderizarHome();

    const medico = grafoDaPagina(container).find(
      (bloco) => bloco["@type"] === "Physician",
    );

    expect(medico).toBeDefined();
    expect(JSON.stringify(medico)).toContain(getMedica().identificacao.crm);
    expect(JSON.stringify(medico)).toContain(getMedica().identificacao.rqe);
  });

  it("emite FAQPage apenas com as perguntas publicáveis", () => {
    const { container } = renderizarHome();

    const faq = grafoDaPagina(container).find(
      (bloco) => bloco["@type"] === "FAQPage",
    ) as { mainEntity?: unknown[] } | undefined;

    const publicaveis = HOME.faq.filter((item) => !ehPendente(item.resposta));

    expect(faq?.mainEntity).toHaveLength(publicaveis.length);
  });

  it("nunca publica um placeholder como dado estruturado", () => {
    const { container } = renderizarHome();
    const script = container.querySelector('script[type="application/ld+json"]');

    // Endereço, telefone e horários do consultório ainda são [CONFIRMAR]. Em
    // JSON-LD, um endereço de mentira é lido como verdade por buscador, mapa e
    // agregador — e o erro se espalha para fora do controle de quem o cometeu.
    expect(script?.textContent).not.toContain("CONFIRMAR");
  });
});

// -----------------------------------------------------------------------------
// lib/jsonld — os helpers, isolados
// -----------------------------------------------------------------------------

describe("lib/jsonld", () => {
  it("omite MedicalBusiness enquanto o endereço não estiver confirmado", () => {
    expect(ehPendente(getConsultorio().logradouro)).toBe(true);
    expect(medicalBusinessJsonLd()).toBeNull();
  });

  it("monta MedicalBusiness assim que o endereço existir", () => {
    const consultorio = {
      ...getConsultorio(),
      logradouro: "Rua Exemplo, 100, sala 4",
      bairro: "Funcionários",
      cep: "30140-000",
      telefone: "+553130000000",
      email: "contato@exemplo.com.br",
      horarios: [{ dias: "Segunda a sexta", horas: "08:00-18:00" }] as const,
    };

    const bloco = medicalBusinessJsonLd(consultorio);
    const endereco = bloco?.["address"] as Record<string, unknown> | undefined;

    expect(bloco?.["@type"]).toBe("MedicalBusiness");
    expect(endereco?.["streetAddress"]).toContain("Rua Exemplo");
    expect(endereco?.["addressRegion"]).toBe("MG");
    expect(bloco?.["employee"]).toEqual({ "@id": ID_MEDICA });
  });

  it("não declara especialidade que o RQE dela não registra", () => {
    const bloco = physicianJsonLd();

    expect(bloco["medicalSpecialty"]).toBe("Otolaryngologic");
    expect(JSON.stringify(bloco)).not.toContain("PlasticSurgery");
  });

  it("devolve null para FAQ sem nenhuma resposta publicável", () => {
    expect(
      faqPageJsonLd([
        { pergunta: "Atende convênio?", resposta: "[CONFIRMAR: convênios]" },
      ]),
    ).toBeNull();
  });

  it("devolve null para trilha de um item só", () => {
    expect(breadcrumbJsonLd([{ nome: "Início", href: "/" }])).toBeNull();
  });

  it("numera a trilha a partir de 1 e absolutiza as URLs", () => {
    const trilha = breadcrumbJsonLd([
      { nome: "Início", href: "/" },
      { nome: "Cirurgia da face", href: "/cirurgia-da-face" },
    ]) as { itemListElement: { position: number; item: string }[] };

    expect(trilha.itemListElement[0]?.position).toBe(1);
    expect(trilha.itemListElement[1]?.item).toMatch(
      /^https?:\/\/.+\/cirurgia-da-face$/,
    );
  });

  it("descarta blocos nulos ao montar o grafo", () => {
    const grafo = grafoJsonLd(physicianJsonLd(), null, undefined);
    expect(grafo["@graph"]).toHaveLength(1);
  });

  it("escapa `<` para nenhum conteúdo conseguir fechar a tag script", () => {
    const serializado = serializarJsonLd({ nome: "</script><img>" });

    expect(serializado).not.toContain("</script>");
    expect(serializado).toContain("\\u003c");
    expect(JSON.parse(serializado)).toEqual({ nome: "</script><img>" });
  });
});
