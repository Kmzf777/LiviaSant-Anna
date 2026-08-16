/**
 * Testes dos primitivos de `components/ui` e do layout.
 *
 * O que é testado aqui é o que quebraria em silêncio: o contrato de
 * `data-superficie` (que três sistemas leem), a semântica dos elementos
 * (heading, `ol`, `details`, `blockquote`), os estados vazios e a navegação
 * por teclado do menu mobile. Aparência não é testada em unit — para isso
 * existem os screenshots do Playwright e os scripts de verificação.
 */

import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { act, fireEvent, render, screen, within } from "@testing-library/react";

import { NAV_LEGAL, NAV_PRINCIPAL, NAV_RODAPE } from "@/content/nav";
import type { PassoConsulta, PerguntaResposta } from "@/content/tipos";
import { Botao } from "@/components/ui/Botao";
import { Citacao } from "@/components/ui/Citacao";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { FAQ } from "@/components/ui/FAQ";
import { Filete } from "@/components/ui/Filete";
import { Nota } from "@/components/ui/Nota";
import { Passos } from "@/components/ui/Passos";
import { PlaceholderImagem } from "@/components/ui/PlaceholderImagem";
import { RetratoArco } from "@/components/ui/RetratoArco";
import { Reveal } from "@/components/ui/Reveal";
import { Secao } from "@/components/ui/Secao";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { MenuMobile } from "@/components/layout/MenuMobile";
import { Footer } from "@/components/layout/Footer";

// -----------------------------------------------------------------------------

const PASSOS: readonly PassoConsulta[] = [
  {
    numero: "01",
    titulo: "Conversa",
    descricao: "Eu escuto antes de examinar.",
  },
  { numero: "02", titulo: "Exame", descricao: "Avaliação de via aérea." },
];

const PERGUNTAS: readonly PerguntaResposta[] = [
  { pergunta: "Atende crianças?", resposta: "Sim." },
  { pergunta: "Quanto tempo de recuperação?", resposta: "Varia por pessoa." },
];

// -----------------------------------------------------------------------------

describe("Secao", () => {
  it("emite data-superficie — o atributo que o Traço mede", () => {
    render(
      <Secao superficie="vinho" aria-label="Destaque">
        <p>conteúdo</p>
      </Secao>,
    );

    const secao = screen.getByRole("region", { name: "Destaque" });
    expect(secao.dataset["superficie"]).toBe("vinho");
  });

  it("aplica o padding vertical do token --secao-y", () => {
    const { container } = render(
      <Secao superficie="areia">
        <p>conteúdo</p>
      </Secao>,
    );

    expect(container.firstElementChild?.className).toContain(
      "py-[var(--secao-y)]",
    );
  });

  it("não aplica padding quando espacamento é nenhum", () => {
    const { container } = render(
      <Secao superficie="areia" espacamento="nenhum">
        <p>conteúdo</p>
      </Secao>,
    );

    expect(container.firstElementChild?.className).not.toContain("py-[");
  });
});

describe("Eyebrow", () => {
  it("vai em mono, caixa alta e tracking de 0.14em", () => {
    render(<Eyebrow>A premissa</Eyebrow>);
    const eyebrow = screen.getByText("A premissa");

    expect(eyebrow.className).toContain("font-mono");
    expect(eyebrow.className).toContain("uppercase");
    expect(eyebrow.className).toContain("tracking-[0.14em]");
  });

  it("troca de cor sobre vinho por variante de ancestral", () => {
    render(<Eyebrow>Em destaque</Eyebrow>);
    expect(screen.getByText("Em destaque").className).toContain(
      "[[data-superficie=vinho]_&]:text-wine-300",
    );
  });
});

describe("SectionTitle", () => {
  it("separa nível semântico de tamanho visual", () => {
    render(
      <SectionTitle as="h3" tamanho="h1" eyebrow="A médica">
        Lívia Sant&apos;Anna
      </SectionTitle>,
    );

    const titulo = screen.getByRole("heading", { level: 3 });
    expect(titulo.className).toContain("text-h1");
    expect(screen.getByText("A médica")).toBeInTheDocument();
  });

  it("aplica font-display explicitamente, para o nível h3 não cair no corpo", () => {
    render(<SectionTitle as="h3">Rinoplastia</SectionTitle>);
    expect(screen.getByRole("heading", { level: 3 }).className).toContain(
      "font-display",
    );
  });

  /**
   * Este teste afirmava o contrário: que a display nunca ia em peso pesado, e
   * que `font-normal` estava sempre presente. A regra "nunca em bold" do
   * briefing § 5.3 foi revogada pelo cliente em 15/08/2026 — ver
   * `scripts/verificar-bodoni.ts` e `PLANO-CONVERSAO-SEO.md`, decisão 2.
   *
   * O que ficou no lugar é mais forte do que a asserção antiga: o componente
   * não pode carregar peso NENHUM na lista de classes. Peso é decisão de
   * `--peso-display` (`styles/theme.css`), num lugar só. Um `font-normal`
   * esquecido aqui deixaria os títulos de seção em 400 enquanto o resto do site
   * foi para 900, que é exatamente a reclamação que originou a mudança.
   */
  it("não decide o peso: ele vem do token da display", () => {
    render(<SectionTitle as="h2">Rinoplastia</SectionTitle>);
    const classes = screen.getByRole("heading", { level: 2 }).className;

    expect(classes).toContain("font-display");
    expect(classes).not.toMatch(
      /\bfont-(thin|extralight|light|normal|medium|semibold|bold|extrabold|black)\b/,
    );
  });
});

describe("Botao", () => {
  it("vira link quando recebe href", () => {
    render(<Botao href="/contato">Agendar consulta</Botao>);
    const link = screen.getByRole("link", { name: "Agendar consulta" });

    expect(link).toHaveAttribute("href", "/contato");
  });

  it("vira button quando não recebe href, com type button por padrão", () => {
    render(<Botao>Enviar mensagem</Botao>);
    const botao = screen.getByRole("button", { name: "Enviar mensagem" });

    expect(botao).toHaveAttribute("type", "button");
  });

  it("respeita disabled e não dispara onClick", () => {
    const aoClicar = vi.fn();
    render(
      <Botao disabled onClick={aoClicar}>
        Agendar consulta
      </Botao>,
    );

    const botao = screen.getByRole("button");
    fireEvent.click(botao);

    expect(botao).toBeDisabled();
    expect(aoClicar).not.toHaveBeenCalled();
  });

  it("usa o raio de 2px e nunca a pílula", () => {
    render(<Botao href="/contato">Agendar consulta</Botao>);
    const classes = screen.getByRole("link").className;

    expect(classes).toContain("rounded-filete");
    expect(classes).not.toContain("rounded-full");
  });

  it("na variante filete usa o underline que cresce da esquerda", () => {
    const { container } = render(
      <Botao href="/dra-livia-santanna" variante="filete">
        Conhecer a médica
      </Botao>,
    );

    // O desenho (filete + underline) mora num span interno; o `<a>` carrega
    // só a área de toque de 44px. Ver o comentário em ui/Botao.tsx.
    const desenho = container.querySelector("a > span");
    expect(desenho?.className).toContain("link-filete");
    expect(desenho?.className).toContain("border-b");
    expect(screen.getByRole("link").className).toContain("min-h-");
  });
});

describe("Citacao", () => {
  it("usa aspas tipográficas curvas, escondidas do leitor de tela", () => {
    const { container } = render(
      <Citacao atribuicao="Lívia Sant'Anna">
        O nariz é o centro do rosto.
      </Citacao>,
    );

    const citacao = container.querySelector("blockquote");
    expect(citacao?.textContent).toContain("“");
    expect(citacao?.textContent).toContain("”");

    const aspas = container.querySelectorAll('[aria-hidden="true"]');
    expect(aspas).toHaveLength(2);
  });

  it("dispensa a atribuição quando ela não existe", () => {
    const { container } = render(<Citacao>Resolver metade.</Citacao>);
    expect(container.querySelector("figcaption")).toBeNull();
  });
});

describe("Passos", () => {
  it("renderiza uma lista ordenada com os números em mono", () => {
    const { container } = render(<Passos passos={PASSOS} />);

    expect(container.querySelector("ol")).not.toBeNull();
    expect(container.querySelectorAll("li")).toHaveLength(2);
    expect(screen.getByText("01")).toBeInTheDocument();
  });

  it("anuncia a ordem para quem não vê o número", () => {
    render(<Passos passos={PASSOS} />);
    expect(
      screen.getByRole("heading", { name: /Passo 01: Conversa/ }),
    ).toBeInTheDocument();
  });

  it("renderiza o fecho quando ele existe", () => {
    render(<Passos passos={PASSOS} fecho="TODA CIRURGIA ENVOLVE RISCOS." />);
    expect(
      screen.getByText("TODA CIRURGIA ENVOLVE RISCOS."),
    ).toBeInTheDocument();
  });

  it("não desenha andaime nenhum com lista vazia", () => {
    const { container } = render(<Passos passos={[]} />);
    expect(container.innerHTML).toBe("");
  });
});

describe("FAQ", () => {
  it("usa details e summary nativos", () => {
    const { container } = render(<FAQ itens={PERGUNTAS} />);

    expect(container.querySelectorAll("details")).toHaveLength(2);
    expect(container.querySelectorAll("summary")).toHaveLength(2);
  });

  it("mantém as respostas no HTML mesmo fechadas, para busca e indexação", () => {
    render(<FAQ itens={PERGUNTAS} />);
    expect(screen.getByText("Varia por pessoa.")).toBeInTheDocument();
  });

  it("abre o primeiro item sob demanda", () => {
    const { container } = render(<FAQ itens={PERGUNTAS} primeiroAberto />);
    const abertos = container.querySelectorAll("details[open]");

    expect(abertos).toHaveLength(1);
    expect(
      within(abertos[0] as HTMLElement).getByText("Atende crianças?"),
    ).toBeInTheDocument();
  });

  it("não renderiza nada sem perguntas", () => {
    const { container } = render(<FAQ itens={[]} />);
    expect(container.innerHTML).toBe("");
  });
});

describe("PlaceholderImagem", () => {
  it("declara a pendência em texto, não só em cor", () => {
    render(<PlaceholderImagem descricao="Retrato de blazer preto" />);
    expect(
      screen.getByText(/IMAGEM PENDENTE — Retrato de blazer preto/),
    ).toBeInTheDocument();
  });

  it("assume a proporção da foto que vai substituí-lo", () => {
    const { container } = render(
      <PlaceholderImagem descricao="Fachada" aspecto="16/9" />,
    );

    const bloco = container.firstElementChild as HTMLElement;
    expect(bloco.style.aspectRatio).toBe("16/9");
  });
});

describe("RetratoArco", () => {
  it("cai no placeholder quando a imagem ainda não existe", () => {
    render(
      <RetratoArco
        imagem={{ tipo: "pendente", descricao: "Retrato de jaleco" }}
        sizes="100vw"
      />,
    );

    expect(
      screen.getByText(/IMAGEM PENDENTE — Retrato de jaleco/),
    ).toBeInTheDocument();
  });
});

describe("Filete", () => {
  it("é um separador com orientação declarada", () => {
    render(<Filete orientacao="vertical" />);
    const separador = screen.getByRole("separator");

    expect(separador).toHaveAttribute("aria-orientation", "vertical");
    expect(separador.className).toContain("filete");
  });
});

describe("Nota", () => {
  it("vai em mono, porque disclaimer é fato e não persuasão", () => {
    render(<Nota>Resultados variam por paciente.</Nota>);
    expect(
      screen.getByText("Resultados variam por paciente.").className,
    ).toContain("font-mono");
  });

  it("no tom de atenção usa filete vinho, sem introduzir cor nova", () => {
    render(<Nota tom="atencao">Informe o DDD.</Nota>);
    const classes = screen.getByText("Informe o DDD.").className;

    expect(classes).toContain("border-wine-700");
    expect(classes).toContain("text-wine-700");
  });
});

describe("Reveal", () => {
  type Retorno = { alvo: Element; disparar: () => void };
  const observadores: Retorno[] = [];

  beforeEach(() => {
    observadores.length = 0;

    class FakeObserver {
      private readonly cb: IntersectionObserverCallback;
      constructor(cb: IntersectionObserverCallback) {
        this.cb = cb;
      }
      observe(alvo: Element) {
        observadores.push({
          alvo,
          disparar: () =>
            this.cb(
              [
                {
                  isIntersecting: true,
                  target: alvo,
                } as IntersectionObserverEntry,
              ],
              this as unknown as IntersectionObserver,
            ),
        });
      }
      unobserve() {}
      disconnect() {}
      takeRecords() {
        return [];
      }
    }

    vi.stubGlobal("IntersectionObserver", FakeObserver);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("começa invisível e revela ao cruzar a dobra", () => {
    const { container } = render(<Reveal index={2}>bloco</Reveal>);
    const bloco = container.firstElementChild as HTMLElement;

    expect(bloco.className).toContain("revelar");
    expect(bloco.dataset["visivel"]).toBe("false");
    expect(bloco.style.getPropertyValue("--revelar-index")).toBe("2");

    act(() => observadores[0]?.disparar());
    expect(bloco.dataset["visivel"]).toBe("true");
  });

  it("revela imediatamente onde não há IntersectionObserver", () => {
    vi.stubGlobal("IntersectionObserver", undefined);

    const { container } = render(<Reveal>bloco</Reveal>);
    expect(
      (container.firstElementChild as HTMLElement).dataset["visivel"],
    ).toBe("true");
  });
});

describe("MenuMobile", () => {
  it("é um diálogo modal rotulado", () => {
    render(<MenuMobile aberto aoFechar={() => {}} itens={NAV_PRINCIPAL} />);

    const dialogo = screen.getByRole("dialog", { name: "Menu de navegação" });
    expect(dialogo).toHaveAttribute("aria-modal", "true");
  });

  it("não renderiza nada quando fechado", () => {
    const { container } = render(
      <MenuMobile aberto={false} aoFechar={() => {}} itens={NAV_PRINCIPAL} />,
    );

    expect(container.innerHTML).toBe("");
  });

  it("põe o foco no botão de fechar ao abrir", () => {
    render(<MenuMobile aberto aoFechar={() => {}} itens={NAV_PRINCIPAL} />);
    expect(screen.getByRole("button", { name: "Fechar" })).toHaveFocus();
  });

  it("fecha com Esc", () => {
    const aoFechar = vi.fn();
    render(<MenuMobile aberto aoFechar={aoFechar} itens={NAV_PRINCIPAL} />);

    fireEvent.keyDown(screen.getByRole("dialog"), { key: "Escape" });
    expect(aoFechar).toHaveBeenCalledTimes(1);
  });

  it("prende o foco: do último Tab volta ao primeiro", () => {
    render(<MenuMobile aberto aoFechar={() => {}} itens={NAV_PRINCIPAL} />);

    const dialogo = screen.getByRole("dialog");
    const focaveis = Array.from(
      dialogo.querySelectorAll<HTMLElement>("a[href], button:not([disabled])"),
    );
    const primeiro = focaveis[0] as HTMLElement;
    const ultimo = focaveis[focaveis.length - 1] as HTMLElement;

    ultimo.focus();
    fireEvent.keyDown(dialogo, { key: "Tab" });
    expect(primeiro).toHaveFocus();

    fireEvent.keyDown(dialogo, { key: "Tab", shiftKey: true });
    expect(ultimo).toHaveFocus();
  });

  it("marca a rota atual com aria-current", () => {
    render(
      <MenuMobile
        aberto
        aoFechar={() => {}}
        itens={NAV_PRINCIPAL}
        rotaAtual="/consulta"
      />,
    );

    expect(screen.getByRole("link", { name: "A consulta" })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });
});

describe("Footer", () => {
  it("declara superfície vinho, para o Traço e para o foco", () => {
    const { container } = render(<Footer />);
    const rodape = container.querySelector("footer");

    expect(rodape?.dataset["superficie"]).toBe("vinho");
  });

  it("aceita o bloco do CFM por injeção e o coloca em local visível", () => {
    render(<Footer identificacao={<p>Bloco de identificação</p>} />);
    expect(screen.getByText("Bloco de identificação")).toBeInTheDocument();
  });

  it("sem o bloco do CFM, avisa da pendência em vez de ficar em silêncio", () => {
    render(<Footer />);
    expect(
      screen.getByText(/Bloco de identificação profissional pendente/),
    ).toBeInTheDocument();
  });
});

describe("content/nav", () => {
  const todos = [
    ...NAV_PRINCIPAL,
    ...NAV_PRINCIPAL.flatMap((item) => item.filhos ?? []),
    ...NAV_RODAPE,
    ...NAV_RODAPE.flatMap((item) => item.filhos ?? []),
    ...NAV_LEGAL,
  ];

  it("usa apenas caminhos internos absolutos, em português e sem acento", () => {
    for (const item of todos) {
      expect(item.href).toMatch(/^\/[a-z0-9-]*(\/[a-z0-9-]+)*$/);
    }
  });

  it("não repete rota dentro da navegação principal", () => {
    const hrefs = NAV_PRINCIPAL.map((item) => item.href);
    expect(new Set(hrefs).size).toBe(hrefs.length);
  });

  it("mantém os dois hubs clínicos com o mesmo peso na navegação", () => {
    const otorrino = NAV_PRINCIPAL.find(
      (item) => item.href === "/otorrinolaringologia",
    );
    const face = NAV_PRINCIPAL.find(
      (item) => item.href === "/cirurgia-da-face",
    );

    expect(otorrino).toBeDefined();
    expect(face).toBeDefined();
    expect(
      NAV_PRINCIPAL.indexOf(face!) - NAV_PRINCIPAL.indexOf(otorrino!),
    ).toBe(1);
  });

  it("usa sentence case nos rótulos, nunca Title Case", () => {
    for (const item of todos) {
      const palavras = item.texto.split(" ").slice(1);
      const maiusculasIndevidas = palavras.filter(
        (palavra) =>
          /^[A-ZÀ-Þ]/.test(palavra) &&
          !["Lívia", "Sant'Anna"].includes(palavra),
      );
      expect(maiusculasIndevidas).toEqual([]);
    }
  });
});
