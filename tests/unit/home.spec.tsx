/**
 * Home — os contratos que quebrariam em silêncio.
 *
 * Aparência não se testa aqui: para isso existem as capturas nos três
 * breakpoints e a crítica visual. O que este arquivo protege é o que um
 * screenshot não mostra e um refactor derruba sem avisar:
 *
 *   - o puxão que põe a chamada sob o header (sem ele o header cai para tinta
 *     e a chamada perde o efeito, sem nenhum erro em lugar nenhum);
 *   - a ordem de `data-superficie`, que três sistemas leem — o CSS, o foco e
 *     o Traço;
 *   - o respiro sem texto entre a § 3 e a § 4, que é onde o Traço resolve no
 *     perfil de rosto;
 *   - a hierarquia de heading;
 *   - a regra de curadoria das fotos de centro cirúrgico: nenhuma legenda
 *     afirma qual profissional é ela;
 *   - e a regra mais séria do JSON-LD: placeholder não vira dado estruturado.
 */

import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

import Home from "@/app/page";
import {
  getConsultorio,
  getHome,
  getMedica,
  listarHospitais,
  listarProcedimentos,
} from "@/content";
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
  it("tem exatamente um h1, e é o problema que ela resolve", () => {
    renderizarHome();

    const titulos = screen.getAllByRole("heading", { level: 1 });
    expect(titulos).toHaveLength(1);

    // A métrica do briefing § 2: quem chega buscando "amígdala" e quem chega
    // buscando "rinoplastia" precisam se reconhecer em cinco segundos. Um
    // slogan sobre a filosofia da médica não faz isso; os três órgãos fazem.
    const texto = titulos[0]?.textContent ?? "";
    for (const orgao of ["nariz", "ouvido", "garganta"]) {
      expect(texto.toLowerCase(), `o h1 não nomeia "${orgao}"`).toContain(orgao);
    }
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

  it("as três seções seguintes à chamada são h2", () => {
    renderizarHome();

    const titulos = screen
      .getAllByRole("heading", { level: 2 })
      .map((titulo) => titulo.textContent);

    expect(titulos).toEqual([
      HOME.medica.h2,
      HOME.experiencia.h2,
      HOME.procedimentos.h2,
    ]);
  });

  it("puxa a chamada para debaixo do header sticky", () => {
    const { container } = renderizarHome();
    const chamada = container.querySelector<HTMLElement>("[data-superficie]");

    // Sem este puxão o header transparente flutua sobre o fundo do body e a
    // tipografia blush cai para ~1.2:1. O Header mede o overlap e se protege
    // caindo para tinta — a seção fica correta, mas perde o efeito, e nada
    // falha. Este teste é o alarme que falta lá.
    expect(chamada?.className).toContain("-mt-[var(--header-h)]");
    expect(chamada?.dataset["superficie"]).toBe("vinho");
  });

  it("alterna as superfícies na ordem das quatro seções", () => {
    const { container } = renderizarHome();

    expect(superficies(container)).toEqual([
      "vinho", // § 1 chamada
      "areia", // § 2 a médica
      "areia-100", // § 3 experiência hospitalar
      "areia", // respiro do Traço
      "areia", // § 4 procedimentos e atendimentos
      // O fecho já foi vinho. Virou areia-100 porque o rodapé é wine-900 e vem
      // logo abaixo: eram dois retângulos escuros empilhados, com "agende sua
      // consulta" repetido em meia tela. A descida areia → areia-100 → wine-900
      // devolve ao rodapé o papel de único fim da página.
      "areia-100", // § 4 fecho
    ]);
  });

  it("não termina a página em duas superfícies escuras seguidas", () => {
    const { container } = renderizarHome();
    const ultima = superficies(container).at(-1);

    // O rodapé (fora deste container) é wine-900. Se a última seção da página
    // também for vinho, o site fecha com dois blocos escuros e o CTA duplicado.
    expect(ultima, "o fecho da home não pode ser vinho").not.toBe("vinho");
  });

  it("reserva o respiro sem texto antes da § 4", () => {
    const { container } = renderizarHome();

    const secoes = Array.from(
      container.querySelectorAll<HTMLElement>("[data-superficie]"),
    );
    const respiro = secoes[3];

    // O Traço resolve no perfil de rosto do logo exatamente aqui. Qualquer
    // texto nesta faixa faz o rosto se desenhar por cima da leitura. Ver
    // components/layout/Traco.tsx.
    expect(respiro?.textContent?.trim()).toBe("");
    expect(respiro?.dataset["superficie"]).toBe("areia");

    // A faixa é declarada por atributo, não por uma altura literal: quem
    // precisa da medida é o desenho do rosto, e o e2e a localiza pelo mesmo
    // seletor.
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
  it("mostra o bloco de identificação do CFM junto do nome da médica", () => {
    renderizarHome();

    // Resolução CFM 2.336/2023 art. 3º: bloco em local visível, e não só no
    // rodapé. Ele mora na § 2, no mesmo cluster do nome e do papel.
    const secaoDaMedica = screen
      .getByRole("heading", { level: 2, name: HOME.medica.h2 })
      .closest("[data-superficie]");

    const bloco = secaoDaMedica?.querySelector('[data-cfm="identificacao"]');

    expect(bloco).not.toBeNull();
    expect(bloco?.textContent).toContain(getMedica().identificacao.crm);
    expect(bloco?.textContent).toContain(getMedica().identificacao.rqe);
  });

  it("nomeia os hospitais onde ela atuou e atua", () => {
    const { container } = renderizarHome();

    for (const hospital of listarHospitais()) {
      expect(
        container.textContent,
        `a § 3 não cita ${hospital.nome}`,
      ).toContain(hospital.nome);
    }
  });

  it("nenhuma legenda de centro cirúrgico afirma quem é a médica", () => {
    renderizarHome();

    const secao = screen
      .getByRole("heading", { level: 2, name: HOME.experiencia.h2 })
      .closest("[data-superficie]");

    expect(secao).not.toBeNull();

    // Não é possível determinar com segurança qual profissional é ela numa
    // foto com máscara e touca, e legendar errado num site médico é erro
    // grave. Vale para o texto visível, para os `alt` e para os `poster`.
    const textos = [
      secao?.textContent ?? "",
      ...Array.from(secao?.querySelectorAll("img") ?? []).map(
        (img) => img.getAttribute("alt") ?? "",
      ),
      ...Array.from(secao?.querySelectorAll("video") ?? []).map(
        (video) => video.getAttribute("aria-label") ?? "",
      ),
    ].join(" ");

    for (const proibido of ["Lívia", "Dra.", "Sant'Anna"]) {
      expect(
        textos,
        `a § 3 identifica "${proibido}" numa foto de centro cirúrgico`,
      ).not.toContain(proibido);
    }
  });

  it("liga para a página de cada cirurgia que ela realiza", () => {
    renderizarHome();

    const cirurgias = listarProcedimentos().filter(
      (p) => p.hub !== "estetica-facial",
    );

    expect(cirurgias.length).toBeGreaterThan(0);

    for (const procedimento of cirurgias) {
      const destino = `/${procedimento.hub}/${procedimento.slug}`;
      expect(
        document.querySelector(`a[href="${destino}"]`),
        `nenhum link para ${destino}`,
      ).not.toBeNull();
    }
  });

  it("não anuncia a toxina botulínica como cirurgia", () => {
    const { container } = renderizarHome();

    // O hub de estética facial se descreve como "procedimentos sem cirurgia".
    // Listá-lo sob "Cirurgias que realizo" seria afirmação falsa num site
    // médico. Ele continua alcançável pelo Header e pelo rodapé.
    expect(container.textContent).not.toContain("Toxina botulínica");
  });

  it("nomeia a queixa antes do procedimento, agrupada por órgão", () => {
    const { container } = renderizarHome();

    for (const grupo of HOME.procedimentos.atendimentos) {
      expect(container.textContent).toContain(grupo.orgao);

      for (const queixa of grupo.queixas) {
        expect(container.textContent, `falta a queixa "${queixa}"`).toContain(
          queixa,
        );
      }
    }
  });

  it("fecha com a chamada para consulta e com o aviso de risco", () => {
    const { container } = renderizarHome();

    const secoes = Array.from(
      container.querySelectorAll<HTMLElement>("[data-superficie]"),
    );
    const fecho = secoes[secoes.length - 1];

    // A superfície do fecho é asserida em "não termina a página em duas
    // superfícies escuras seguidas". Aqui o que importa é o conteúdo: a ação e
    // a ressalva que a qualifica precisam estar no mesmo bloco, sempre.
    expect(fecho?.textContent).toContain(HOME.procedimentos.cta.texto);
    expect(fecho?.textContent).toContain(HOME.procedimentos.fecho);
    expect(
      fecho?.querySelector(`a[href="${HOME.procedimentos.cta.href}"]`),
    ).not.toBeNull();
  });

  it("não mostra ao paciente nenhum marcador de pendência", () => {
    const { container } = renderizarHome();

    expect(container.textContent).not.toContain("[CONFIRMAR");
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
