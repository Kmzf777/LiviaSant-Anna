import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { getMedica } from "@/content";
import type {
  FichaTecnica as DadosFichaTecnica,
  Imagem,
  MinTres,
  RiscoOuLimite,
} from "@/content";
import {
  AntesDepois,
  MINIMO_TEXTO_EDUCATIVO,
} from "@/components/medical/AntesDepois";
import { FichaTecnica } from "@/components/medical/FichaTecnica";
import { IdentificacaoCFM } from "@/components/medical/IdentificacaoCFM";
import { RiscosELimites } from "@/components/medical/RiscosELimites";

/**
 * Compliance CFM 2.336/2023 em teste.
 *
 * Cada bloco aqui corresponde a uma exigência da norma. Se um destes testes
 * falhar, não é regressão de estilo: é uma violação publicável. Ver
 * docs/COMPLIANCE-CFM.md para a tabela regra -> mecanismo.
 */

// -----------------------------------------------------------------------------
// Dados fictícios. Marcados como tal: nenhuma imagem real de paciente existe
// no repositório, e nenhuma deve existir sem autorização arquivada.
// -----------------------------------------------------------------------------

const IMAGEM_ANTES: Imagem = {
  src: "/ilustracoes/exemplo-antes.jpg",
  alt: "Exemplo fictício, perfil recortado abaixo dos olhos, antes",
  largura: 1200,
  altura: 1500,
};

const IMAGEM_DEPOIS: Imagem = {
  src: "/ilustracoes/exemplo-depois.jpg",
  alt: "Exemplo fictício, perfil recortado abaixo dos olhos, depois",
  largura: 1200,
  altura: 1500,
};

const TEXTO_EDUCATIVO =
  "Caso fictício, usado apenas para exercitar o componente. A cirurgia foi " +
  "indicada por obstrução nasal associada a desvio de septo. A evolução " +
  "satisfatória inclui melhora da respiração e do contorno; evoluções " +
  "insatisfatórias incluem assimetria residual, retração de ponta e " +
  "necessidade de revisão. Sangramento, infecção e alteração do olfato são " +
  "complicações possíveis.";

const FICHA: DadosFichaTecnica = {
  duracao: "2 a 3 horas",
  anestesia: "Geral",
  internacao: "Alta no mesmo dia, em geral",
  retornoSocial: "7 a 14 dias",
  disclaimer:
    "Os valores acima são referências médias e variam conforme a anatomia, o " +
    "histórico e a evolução de cada paciente.",
};

const RISCOS: MinTres<RiscoOuLimite> = [
  {
    titulo: "Assimetria residual",
    descricao:
      "Nenhum rosto é simétrico antes da cirurgia, e a cicatrização não é " +
      "simétrica depois. Pequenas diferenças entre os lados podem permanecer.",
  },
  {
    titulo: "Necessidade de revisão",
    descricao:
      "Uma parte dos casos precisa de um segundo procedimento, geralmente " +
      "menor, depois que a cicatrização se estabiliza.",
  },
  {
    titulo: "Alteração do olfato",
    descricao:
      "Redução temporária do olfato é comum nas primeiras semanas. A perda " +
      "persistente é rara, mas existe e precisa ser considerada.",
  },
];

function silenciarConsole() {
  // React registra o erro de render antes de propagá-lo. O ruído esconde a
  // saída dos outros testes.
  return vi.spyOn(console, "error").mockImplementation(() => {});
}

// =============================================================================
// § 3.1 — bloco de identificação
// =============================================================================

describe("IdentificacaoCFM", () => {
  it("renderiza um único <p>, sem nenhum elemento filho", () => {
    const { container } = render(<IdentificacaoCFM />);

    const blocos = container.querySelectorAll('[data-cfm="identificacao"]');
    expect(blocos).toHaveLength(1);

    const bloco = blocos[0] as HTMLElement;
    expect(bloco.tagName).toBe("P");
    expect(bloco.children).toHaveLength(0);
  });

  it("renderiza um único nó de texto — a quebra de linha não vira elemento", () => {
    const { container } = render(<IdentificacaoCFM />);
    const bloco = container.querySelector('[data-cfm="identificacao"]');

    expect(bloco?.childNodes).toHaveLength(1);
    expect(bloco?.childNodes[0]?.nodeType).toBe(Node.TEXT_NODE);
  });

  it("não contém nenhum filho com estilo tipográfico próprio", () => {
    // A norma proíbe alteração de tamanho e negrito dentro do bloco. Estes são
    // os vetores: um <strong> no nome, um <span> com classe no CRM, um style
    // inline em qualquer trecho.
    const { container } = render(<IdentificacaoCFM />);
    const bloco = container.querySelector('[data-cfm="identificacao"]');

    const proibidos = bloco?.querySelectorAll(
      "strong, b, em, i, u, mark, small, big, font, span, [class], [style]",
    );
    expect(proibidos).toHaveLength(0);
  });

  it("declara peso 400 explicitamente e uma única família", () => {
    const { container } = render(<IdentificacaoCFM />);
    const bloco = container.querySelector('[data-cfm="identificacao"]');
    const classes = (bloco?.getAttribute("class") ?? "").split(/\s+/);

    expect(classes).toContain("font-normal");
    expect(classes).toContain("font-mono");
    expect(classes.filter((c) => c.startsWith("font-weight"))).toHaveLength(0);
    expect(
      classes.filter((c) => /^text-(hero|h1|h2|h3|lead|body|micro)$/.test(c)),
    ).toHaveLength(0);
    expect(
      classes.filter((c) => /^(font-bold|font-semibold|font-medium)$/.test(c)),
    ).toHaveLength(0);
  });

  it("traz nome, designação, CRM, especialidade e RQE, nessa ordem", () => {
    const { identificacao } = getMedica();
    const { container } = render(<IdentificacaoCFM />);
    const texto =
      container.querySelector('[data-cfm="identificacao"]')?.textContent ?? "";

    const esperado =
      `${identificacao.nome} — Médica — ${identificacao.crm}\n` +
      `${identificacao.especialidade} — ${identificacao.rqe}`;

    expect(texto).toBe(esperado);
  });

  it("mantém a estrutura em toda superfície — só a cor muda", () => {
    for (const sobre of ["areia", "areia-100", "vinho"] as const) {
      const { container, unmount } = render(<IdentificacaoCFM sobre={sobre} />);
      const bloco = container.querySelector('[data-cfm="identificacao"]');

      expect(bloco?.children, `superfície ${sobre}`).toHaveLength(0);
      expect(bloco?.childNodes, `superfície ${sobre}`).toHaveLength(1);
      unmount();
    }
  });

  it("não aceita className — não há como injetar peso ou tamanho por fora", () => {
    // @ts-expect-error `className` não faz parte da API: seria o furo por onde
    // entrariam font-bold, text-lg ou um cinza claro no CRM.
    const _comClasse = <IdentificacaoCFM className="text-h1 font-bold" />;
    expect(_comClasse).toBeDefined();
  });
});

// =============================================================================
// § 3.3 — antes e depois
// =============================================================================

describe("AntesDepois", () => {
  it("não compila sem textoEducativo e sem autorizacaoId", () => {
    // Este teste vive no `tsc --noEmit`, não no runtime: se as props deixarem
    // de ser obrigatórias, o @ts-expect-error passa a ser um erro e o
    // typecheck reprova.
    const _semNada = (
      // @ts-expect-error textoEducativo e autorizacaoId são obrigatórios pela
      // Resolução CFM 2.336/2023.
      <AntesDepois
        antes={IMAGEM_ANTES}
        depois={IMAGEM_DEPOIS}
        intervaloEntreFotos="6 meses"
      />
    );

    const _semTexto = (
      // @ts-expect-error textoEducativo é obrigatório: contexto educativo
      // junto à imagem.
      <AntesDepois
        antes={IMAGEM_ANTES}
        depois={IMAGEM_DEPOIS}
        autorizacaoId="AUT-0001"
        intervaloEntreFotos="6 meses"
      />
    );

    const _semAutorizacao = (
      // @ts-expect-error autorizacaoId é obrigatório: autorização formal e
      // documentada do paciente.
      <AntesDepois
        antes={IMAGEM_ANTES}
        depois={IMAGEM_DEPOIS}
        textoEducativo={TEXTO_EDUCATIVO}
        intervaloEntreFotos="6 meses"
      />
    );

    expect([_semNada, _semTexto, _semAutorizacao]).toHaveLength(3);
  });

  it("renderiza o texto educativo sempre visível, junto da imagem", () => {
    render(
      <AntesDepois
        antes={IMAGEM_ANTES}
        depois={IMAGEM_DEPOIS}
        textoEducativo={TEXTO_EDUCATIVO}
        autorizacaoId="AUT-0001"
        intervaloEntreFotos="6 meses"
      />,
    );

    const texto = screen.getByText(TEXTO_EDUCATIVO);
    expect(texto).toBeVisible();

    // Nem tooltip, nem accordion fechado: o texto está na legenda da figura.
    expect(texto.closest("figcaption")).not.toBeNull();
    expect(texto.closest("details")).toBeNull();
    expect(texto).not.toHaveAttribute("hidden");
  });

  it("renderiza o aviso de que resultados variam entre pacientes", () => {
    render(
      <AntesDepois
        antes={IMAGEM_ANTES}
        depois={IMAGEM_DEPOIS}
        textoEducativo={TEXTO_EDUCATIVO}
        autorizacaoId="AUT-0001"
        intervaloEntreFotos="6 meses"
      />,
    );

    expect(
      screen.getByText(/resultados variam entre pacientes/i),
    ).toBeVisible();
  });

  it("registra o intervalo entre as fotos e a referência da autorização", () => {
    render(
      <AntesDepois
        antes={IMAGEM_ANTES}
        depois={IMAGEM_DEPOIS}
        textoEducativo={TEXTO_EDUCATIVO}
        autorizacaoId="AUT-0001"
        intervaloEntreFotos="6 meses"
      />,
    );

    expect(screen.getByText(/AUT-0001/)).toBeVisible();
    expect(screen.getByText(/6 meses/)).toBeVisible();
  });

  it("recusa autorizacaoId vazio — o tipo string não impede, o invariante impede", () => {
    const espia = silenciarConsole();

    expect(() =>
      render(
        <AntesDepois
          antes={IMAGEM_ANTES}
          depois={IMAGEM_DEPOIS}
          textoEducativo={TEXTO_EDUCATIVO}
          autorizacaoId="   "
          intervaloEntreFotos="6 meses"
        />,
      ),
    ).toThrow(/autorizacaoId/);

    espia.mockRestore();
  });

  it("recusa texto educativo curto demais para cumprir a norma", () => {
    const espia = silenciarConsole();

    expect(() =>
      render(
        <AntesDepois
          antes={IMAGEM_ANTES}
          depois={IMAGEM_DEPOIS}
          textoEducativo={"ok".padEnd(MINIMO_TEXTO_EDUCATIVO - 1, " ")}
          autorizacaoId="AUT-0001"
          intervaloEntreFotos="6 meses"
        />,
      ),
    ).toThrow(/textoEducativo/);

    espia.mockRestore();
  });

  it("recusa fotos com enquadramento diferente entre antes e depois", () => {
    const espia = silenciarConsole();

    expect(() =>
      render(
        <AntesDepois
          antes={IMAGEM_ANTES}
          depois={{ ...IMAGEM_DEPOIS, largura: 1500, altura: 1200 }}
          textoEducativo={TEXTO_EDUCATIVO}
          autorizacaoId="AUT-0001"
          intervaloEntreFotos="6 meses"
        />,
      ),
    ).toThrow(/proporções diferentes/);

    espia.mockRestore();
  });

  describe("slider", () => {
    beforeEach(() => {
      render(
        <AntesDepois
          antes={IMAGEM_ANTES}
          depois={IMAGEM_DEPOIS}
          textoEducativo={TEXTO_EDUCATIVO}
          autorizacaoId="AUT-0001"
          intervaloEntreFotos="6 meses"
        />,
      );
    });

    it("expõe papel e valores de acessibilidade", () => {
      const slider = screen.getByRole("slider");
      expect(slider).toHaveAttribute("aria-valuemin", "0");
      expect(slider).toHaveAttribute("aria-valuemax", "100");
      expect(slider).toHaveAttribute("aria-valuenow", "50");
      expect(slider).toHaveAccessibleName();
      expect(slider).toHaveAttribute("aria-valuetext");
    });

    it("é alcançável por teclado", () => {
      const slider = screen.getByRole("slider");
      slider.focus();
      expect(slider).toHaveFocus();
    });

    it("move com as setas", () => {
      const slider = screen.getByRole("slider");

      fireEvent.keyDown(slider, { key: "ArrowRight" });
      expect(slider).toHaveAttribute("aria-valuenow", "52");

      fireEvent.keyDown(slider, { key: "ArrowLeft" });
      fireEvent.keyDown(slider, { key: "ArrowLeft" });
      expect(slider).toHaveAttribute("aria-valuenow", "48");

      fireEvent.keyDown(slider, { key: "ArrowUp" });
      expect(slider).toHaveAttribute("aria-valuenow", "50");
    });

    it("anda mais rápido com Shift e PageUp/PageDown", () => {
      const slider = screen.getByRole("slider");

      fireEvent.keyDown(slider, { key: "ArrowRight", shiftKey: true });
      expect(slider).toHaveAttribute("aria-valuenow", "60");

      fireEvent.keyDown(slider, { key: "PageDown" });
      expect(slider).toHaveAttribute("aria-valuenow", "50");
    });

    it("vai aos extremos com Home e End, sem passar do limite", () => {
      const slider = screen.getByRole("slider");

      fireEvent.keyDown(slider, { key: "Home" });
      expect(slider).toHaveAttribute("aria-valuenow", "0");

      fireEvent.keyDown(slider, { key: "ArrowLeft" });
      expect(slider).toHaveAttribute("aria-valuenow", "0");

      fireEvent.keyDown(slider, { key: "End" });
      expect(slider).toHaveAttribute("aria-valuenow", "100");

      fireEvent.keyDown(slider, { key: "ArrowRight" });
      expect(slider).toHaveAttribute("aria-valuenow", "100");
    });

    it("ignora teclas que não são do slider", () => {
      const slider = screen.getByRole("slider");
      fireEvent.keyDown(slider, { key: "a" });
      expect(slider).toHaveAttribute("aria-valuenow", "50");
    });
  });
});

// =============================================================================
// Ficha técnica — disclaimer obrigatório
// =============================================================================

describe("FichaTecnica", () => {
  it("mostra sempre o disclaimer", () => {
    render(<FichaTecnica ficha={FICHA} />);
    expect(screen.getByText(FICHA.disclaimer)).toBeVisible();
  });

  it("liga o disclaimer à tabela por aria-describedby", () => {
    const { container } = render(<FichaTecnica ficha={FICHA} />);
    const tabela = container.querySelector("table");
    const id = tabela?.getAttribute("aria-describedby");

    expect(id).toBeTruthy();
    expect(container.querySelector(`#${id}`)?.textContent).toBe(
      FICHA.disclaimer,
    );
  });

  it("recusa ficha sem disclaimer de verdade", () => {
    const espia = silenciarConsole();

    expect(() =>
      render(<FichaTecnica ficha={{ ...FICHA, disclaimer: "   " }} />),
    ).toThrow(/disclaimer/);

    espia.mockRestore();
  });

  it("usa semântica de tabela, com cabeçalho de linha", () => {
    const { container } = render(<FichaTecnica ficha={FICHA} />);

    const cabecalhos = [...container.querySelectorAll("th")];
    expect(cabecalhos).toHaveLength(4);
    for (const th of cabecalhos) {
      expect(th.getAttribute("scope")).toBe("row");
    }

    expect(container.querySelector("caption")).not.toBeNull();
  });

  it("mostra os quatro fatos do briefing § 8.10", () => {
    render(<FichaTecnica ficha={FICHA} />);

    for (const rotulo of [
      "Duração",
      "Anestesia",
      "Internação",
      "Retorno social",
    ]) {
      expect(screen.getByRole("rowheader", { name: rotulo })).toBeVisible();
    }
    expect(screen.getByText(FICHA.duracao)).toBeVisible();
    expect(screen.getByText(FICHA.anestesia)).toBeVisible();
    expect(screen.getByText(FICHA.internacao)).toBeVisible();
    expect(screen.getByText(FICHA.retornoSocial)).toBeVisible();
  });
});

// =============================================================================
// Riscos e limites
// =============================================================================

describe("RiscosELimites", () => {
  it("renderiza todos os riscos abertos, fora de <details>", () => {
    const { container } = render(<RiscosELimites riscos={RISCOS} />);

    expect(container.querySelector("details")).toBeNull();

    for (const risco of RISCOS) {
      const titulo = screen.getByRole("heading", { name: risco.titulo });
      expect(titulo).toBeVisible();
      expect(screen.getByText(risco.descricao)).toBeVisible();
    }
  });

  it("dá ao texto do risco o mesmo corpo e a mesma tinta do texto corrido", () => {
    // A seção é peça de conversão, não rodapé jurídico. Corpo menor ou cinza
    // apagado a transformaria em letra miúda.
    render(<RiscosELimites riscos={RISCOS} />);

    const primeiro = RISCOS[0];
    const classes = (
      screen.getByText(primeiro.descricao).getAttribute("class") ?? ""
    ).split(/\s+/);

    expect(classes).toContain("text-body");
    expect(classes).toContain("text-ink-900");
    expect(classes.filter((c) => /^text-(micro|small)$/.test(c))).toHaveLength(
      0,
    );
    expect(classes.filter((c) => /^text-ink-(400|600)$/.test(c))).toHaveLength(
      0,
    );
  });

  it("fecha com a remissão à consulta e ao termo de consentimento", () => {
    render(<RiscosELimites riscos={RISCOS} />);
    expect(screen.getByText(/termo de consentimento/i)).toBeVisible();
  });

  it("nomeia a seção para leitor de tela", () => {
    render(<RiscosELimites riscos={RISCOS} />);
    expect(
      screen.getByRole("region", { name: "Riscos e limites" }),
    ).toBeVisible();
  });

  it("não compila com menos de três riscos", () => {
    // @ts-expect-error MinTres exige três itens: uma página de procedimento
    // com dois riscos não existe.
    const _doisRiscos = <RiscosELimites riscos={[RISCOS[0], RISCOS[1]]} />;
    expect(_doisRiscos).toBeDefined();
  });
});

afterEach(() => {
  vi.restoreAllMocks();
});
