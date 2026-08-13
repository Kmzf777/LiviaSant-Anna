/**
 * Testes dos hubs de procedimento e do card que os compõe.
 *
 * Dois contratos são testados aqui, e os dois quebrariam em silêncio:
 *
 *   1. **Simetria estrutural entre os hubs.** O site sustenta duas audiências
 *      que quase não se cruzam — quem procura cirurgia de amígdala e quem
 *      pesquisa rinoplastia — e o que as mantém no mesmo lugar é a tese de que
 *      ela é otorrinolaringologista antes de operar a face. Um hub com
 *      hierarquia visual diferente do outro desmente essa tese. O teste compara
 *      a sequência de superfícies e de níveis de heading dos três hubs: se
 *      alguém der um tratamento especial a um deles, a comparação falha.
 *
 *   2. **A copy do link.** "O link diz o que acontece" (§ 6). "Ver desvio de
 *      septo", nunca "Saiba mais" — `pnpm verify:termos` pega a string literal,
 *      mas não pegaria um texto montado em tempo de execução.
 *
 * O conteúdo real é usado de propósito, e não um fixture: o hub de estética
 * facial tem um procedimento e o de otorrino tem cinco, e é justamente essa
 * assimetria de conteúdo que o template precisa aguentar sem quebrar.
 */

import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";

import { getHub, listarHubs, listarProcedimentos } from "@/content";
import type { Hub, HubSlug, Procedimento } from "@/content";
import {
  CardProcedimento,
  hrefDoProcedimento,
  textoDoLink,
} from "@/components/medical/CardProcedimento";
import {
  HubProcedimentos,
  separarAbertura,
} from "@/components/sections/HubProcedimentos";

// -----------------------------------------------------------------------------

function hubDe(slug: HubSlug): Hub {
  const hub = getHub(slug);
  if (!hub) throw new Error(`Hub ${slug} não existe em content/hubs.ts.`);
  return hub;
}

function primeiroDe(slug: HubSlug): Procedimento {
  const procedimento = listarProcedimentos(slug)[0];
  if (!procedimento) throw new Error(`Hub ${slug} está sem procedimentos.`);
  return procedimento;
}

function renderizarHub(slug: HubSlug) {
  return render(
    <HubProcedimentos
      hub={hubDe(slug)}
      procedimentos={listarProcedimentos(slug)}
    />,
  );
}

/** Sequência de superfícies das seções, na ordem em que aparecem. */
function superficies(container: HTMLElement): string[] {
  return [...container.querySelectorAll("[data-superficie]")].map(
    (no) => no.getAttribute("data-superficie") ?? "",
  );
}

/** Sequência de níveis de heading, na ordem do documento. */
function niveis(container: HTMLElement): number[] {
  return [...container.querySelectorAll("h1, h2, h3, h4, h5, h6")].map((no) =>
    Number(no.tagName.slice(1)),
  );
}

// -----------------------------------------------------------------------------

describe("CardProcedimento", () => {
  const procedimento = primeiroDe("otorrinolaringologia");

  it("mostra título, linha de resumo e um único link", () => {
    render(<CardProcedimento procedimento={procedimento} />);

    expect(
      screen.getByRole("heading", { level: 3, name: procedimento.nome }),
    ).toBeInTheDocument();
    expect(screen.getByText(procedimento.lead)).toBeInTheDocument();

    // Um link por card: o alvo grande vem do ::after que cobre o article, não
    // de um segundo anchor para o mesmo destino.
    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(1);
    expect(links[0]).toHaveAttribute(
      "href",
      `/${procedimento.hub}/${procedimento.slug}`,
    );
  });

  it("o link diz o que acontece, e não 'Saiba mais'", () => {
    render(<CardProcedimento procedimento={procedimento} />);

    const link = screen.getByRole("link");
    expect(link).toHaveAccessibleName(`Ver ${procedimento.nome.toLowerCase()}`);
    expect(link.textContent ?? "").not.toMatch(/saiba mais|clique aqui/i);
  });

  it("textoDoLink mantém sentence case", () => {
    expect(textoDoLink("Desvio de septo")).toBe("Ver desvio de septo");
    expect(textoDoLink("Timpanoplastia")).toBe("Ver timpanoplastia");
  });

  it("hrefDoProcedimento nunca escreve o slug à mão", () => {
    expect(hrefDoProcedimento(procedimento)).toBe(
      `/${procedimento.hub}/${procedimento.slug}`,
    );
  });

  it("respeita o nível de heading pedido pela página", () => {
    render(<CardProcedimento procedimento={procedimento} nivelTitulo="h4" />);

    expect(
      screen.getByRole("heading", { level: 4, name: procedimento.nome }),
    ).toBeInTheDocument();
  });

  it("na variante bloco, a imagem pendente vira placeholder e não foto de banco", () => {
    const { container } = render(
      <CardProcedimento procedimento={procedimento} variante="bloco" />,
    );

    if (procedimento.imagem.tipo === "pendente") {
      expect(
        container.querySelector('[data-placeholder="imagem"]'),
      ).toBeInTheDocument();
      expect(container.querySelector("img")).toBeNull();
    }
  });
});

// -----------------------------------------------------------------------------

describe("HubProcedimentos", () => {
  it("tem um único h1, e ele é o título do hub", () => {
    renderizarHub("otorrinolaringologia");

    const h1 = screen.getAllByRole("heading", { level: 1 });
    expect(h1).toHaveLength(1);
    expect(h1[0]).toHaveTextContent(hubDe("otorrinolaringologia").h1);
  });

  it("abre em areia, como a página de procedimento", () => {
    const { container } = renderizarHub("otorrinolaringologia");

    const hero = container.querySelector("[data-superficie]");
    expect(hero?.getAttribute("data-superficie")).toBe("areia");

    // Hero em areia não passa por baixo do header: `-mt-[var(--header-h)]` é
    // o contrato do hero full-bleed vinho (§ 8.1), e aplicá-lo aqui deixaria
    // o header transparente flutuando sobre a areia do body.
    expect(hero?.className).not.toContain("-mt-[var(--header-h)]");
  });

  it("nunca repete a superfície da seção anterior", () => {
    const { container } = renderizarHub("otorrinolaringologia");

    // Duas seções seguidas na mesma superfície viram um bloco só e o ritmo do
    // § 5.2 — vinho e areia alternando — desaparece.
    const sequencia = superficies(container);
    expect(sequencia.length).toBeGreaterThan(3);

    for (const [indice, superficie] of sequencia.entries()) {
      if (indice === 0) continue;
      expect(superficie).not.toBe(sequencia[indice - 1]);
    }
  });

  it("lista um card por procedimento do hub, na ordem do conteúdo", () => {
    renderizarHub("otorrinolaringologia");

    const procedimentos = listarProcedimentos("otorrinolaringologia");
    const secao = screen.getByRole("region", { name: "Procedimentos" });

    const itens = within(secao).getAllByRole("listitem");
    expect(itens).toHaveLength(procedimentos.length);

    for (const [indice, procedimento] of procedimentos.entries()) {
      expect(itens[indice]).toHaveTextContent(procedimento.nome);
    }
  });

  it("fecha a lista com a ressalva de risco, e ela é verdadeira no hub", () => {
    const { unmount } = renderizarHub("otorrinolaringologia");
    expect(screen.getByText(/toda cirurgia envolve riscos/i)).toBeInTheDocument();
    unmount();

    // A estética facial da v1 não tem procedimento cirúrgico: abrir a seção
    // com "toda cirurgia envolve riscos" descreveria errado o que ela faz.
    renderizarHub("estetica-facial");
    expect(screen.queryByText(/toda cirurgia envolve riscos/i)).toBeNull();
    expect(
      screen.getByText(/todo procedimento tem indicação, limite e risco/i),
    ).toBeInTheDocument();
  });

  it("aguenta um hub de um procedimento só sem quebrar o template", () => {
    renderizarHub("estetica-facial");

    const procedimentos = listarProcedimentos("estetica-facial");
    expect(procedimentos).toHaveLength(1);

    for (const procedimento of procedimentos) {
      expect(
        screen.getByRole("link", { name: textoDoLink(procedimento.nome) }),
      ).toHaveAttribute("href", hrefDoProcedimento(procedimento));
    }
  });

  it("a abertura da premissa vira citação de tamanho comparável em todo hub", () => {
    for (const hub of listarHubs()) {
      const { citacao } = separarAbertura(hub.introducao[0]);

      // `Citacao` compõe em 22ch: sem o recorte da primeira frase, a abertura
      // do hub de otorrino (315 caracteres) viraria uma parede em display, e o
      // hub clínico ficaria visivelmente mais pesado que o estético.
      expect(citacao).not.toBeNull();
      expect(citacao?.length ?? 0).toBeLessThanOrEqual(200);
    }
  });

  it("não perde texto ao recortar a citação", () => {
    const paragrafo = "Primeira frase. Segunda frase, mais longa.";
    const { citacao, resto } = separarAbertura(paragrafo);

    expect(citacao).toBe("Primeira frase.");
    expect(resto).toBe("Segunda frase, mais longa.");
    expect(`${citacao} ${resto}`).toBe(paragrafo);
  });

  it("abre e fecha com o CTA do conteúdo, sempre apontando para o contato", () => {
    const hub = hubDe("otorrinolaringologia");
    renderizarHub("otorrinolaringologia");

    // Um no hero e um no fecho: a página é longa, e quem decidiu no primeiro
    // parágrafo não deveria ter que rolar até o fim para agendar.
    const ctas = screen.getAllByRole("link", { name: hub.ctaFinal });
    expect(ctas.length).toBeGreaterThanOrEqual(2);

    for (const cta of ctas) {
      expect(cta).toHaveAttribute("href", "/contato");
    }
  });

  it("não salta nível de heading", () => {
    const { container } = renderizarHub("otorrinolaringologia");
    const sequencia = niveis(container);

    expect(sequencia[0]).toBe(1);

    let maximo = 1;
    for (const nivel of sequencia) {
      expect(nivel).toBeLessThanOrEqual(maximo + 1);
      maximo = Math.max(maximo, nivel);
    }
  });

  // ---------------------------------------------------------------------------
  // A tese do site, como teste
  // ---------------------------------------------------------------------------

  it("os três hubs têm a mesma sequência de superfícies e de headings", () => {
    const hubs = listarHubs();

    const assinaturas = hubs.map((hub) => {
      const { container, unmount } = renderizarHub(hub.slug);

      const assinatura = {
        superficies: superficies(container),
        // Os níveis, sem a quantidade de cards: um hub tem cinco
        // procedimentos e outro tem um, e isso é diferença de conteúdo, não
        // de template.
        niveis: [...new Set(niveis(container))].sort(),
      };

      unmount();
      return assinatura;
    });

    for (const assinatura of assinaturas) {
      expect(assinatura).toEqual(assinaturas[0]);
    }
  });
});
