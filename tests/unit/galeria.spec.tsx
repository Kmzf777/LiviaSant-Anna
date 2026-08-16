/**
 * Galeria e VideoSobClique.
 *
 * O que está coberto aqui é o que quebraria em silêncio e caro:
 *
 *   - o `sizes` por posição, que é o que separa um LCP de 1,8s de um de 6s no
 *     celular e que nenhuma inspeção visual pega;
 *   - a ausência do arco nas fotos de ambiente — o arco é o motivo assinatura
 *     do retrato DELA (§ 5.5), e vazá-lo para uma foto de centro cirúrgico
 *     dissolve a única geometria que identifica a médica;
 *   - a ausência de qualquer byte de vídeo antes do clique, que é requisito de
 *     performance do § 9 e some sem deixar rastro numa refatoração;
 *   - o alvo de toque de 44px e o rótulo acessível do botão de play.
 *
 * Aparência não se testa aqui. Composição é olho e screenshot.
 */

import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";

import { Galeria, type ItemGaleria } from "@/components/ui/Galeria";
import { VideoSobClique } from "@/components/ui/VideoSobClique";

// -----------------------------------------------------------------------------

const ITENS: readonly ItemGaleria[] = [
  {
    src: "/fotos/centro-cirurgico-equipe-corredor.jpeg",
    alt: "Três profissionais de pijama cirúrgico no corredor do centro cirúrgico.",
    largura: 3024,
    altura: 4032,
    legenda: "Centro cirúrgico — Hospital Madre Teresa",
  },
  {
    src: "/fotos/centro-cirurgico-close.jpeg",
    alt: "Cirurgiã de lupas e máscara, concentrada sobre o campo cirúrgico.",
    largura: 3024,
    altura: 4032,
  },
  {
    src: "/fotos/centro-cirurgico-microscopio.jpeg",
    alt: "Sala cirúrgica com microscópio e paciente coberto por campos.",
    largura: 3024,
    altura: 4032,
  },
];

// -----------------------------------------------------------------------------

describe("Galeria", () => {
  it("rende uma figura por item, com o alt de cada foto", () => {
    const { container } = render(<Galeria itens={ITENS} />);

    expect(container.querySelectorAll("img")).toHaveLength(ITENS.length);
    for (const item of ITENS) {
      expect(screen.getByAltText(item.alt)).toBeInTheDocument();
    }
  });

  /*
    Este teste exigia o oposto até 15/08/2026.

    A galeria era um mosaico escalonado, e o teste cobrava um `sizes` distinto
    por posição — "se um dia isso colapsar em um valor só, a grade regular
    voltou", dizia o comentário. A grade regular voltou, de propósito: o dono
    do site leu o mosaico como "fotos bagunçadas" e, num site médico,
    desalinhamento lê como descuido. Ver o comentário do `<ul>` em Galeria.tsx.

    O que o teste protege continua sendo o mesmo: que exista `sizes` declarado
    e que ele cubra o desktop. É a parte que era sobre desempenho, e essa não
    mudou — sem largura declarada, o Next serve a maior variante para qualquer
    viewport, e a diferença entre entregar 1920 e 640 num celular é o LCP.
  */
  it("declara `sizes` com breakpoint de desktop em toda foto", () => {
    const { container } = render(<Galeria itens={ITENS} />);

    const declarados = [...container.querySelectorAll("img")].map((img) =>
      img.getAttribute("sizes"),
    );

    expect(declarados).toHaveLength(ITENS.length);

    for (const sizes of declarados) {
      expect(sizes).toBeTruthy();
      expect(sizes).toContain("(min-width: 1024px)");
    }
  });

  it("alinha as peças: mesma largura e mesmo topo", () => {
    const { container } = render(<Galeria itens={ITENS} />);
    const lista = container.querySelector("ul");

    // Duas colunas iguais e `items-start`. O que NÃO pode voltar é a peça com
    // largura própria (`col-[7/span_4]`) ou desnível vertical (`lg:mt-28`).
    expect(lista?.className).toContain("grid-cols-2");
    expect(lista?.className).toContain("items-start");

    for (const item of container.querySelectorAll("li")) {
      expect(item.className).not.toMatch(/col-\[/);
      expect(item.className).not.toMatch(/mt-\d/);
    }
  });

  it("reserva a proporção do arquivo, para a foto não empurrar o layout ao chegar", () => {
    const { container } = render(<Galeria itens={ITENS} />);
    const caixa = container.querySelector<HTMLElement>("figure > div");

    expect(caixa?.style.aspectRatio).toContain("3024");
    expect(caixa?.style.aspectRatio).toContain("4032");
  });

  it("não usa o arco: ele é exclusivo do retrato da médica (§ 5.5)", () => {
    const { container } = render(<Galeria itens={ITENS} />);

    expect(container.querySelector(".rounded-arco")).toBeNull();
    expect(container.querySelector(".rounded-filete")).not.toBeNull();
  });

  it("não reage ao ponteiro: foto que não leva a lugar nenhum não tem hover", () => {
    const { container } = render(<Galeria itens={ITENS} />);

    expect(container.querySelector(".zoom-suave")).toBeNull();
    expect(container.querySelector("a")).toBeNull();
  });

  it("só mostra legenda de quem tem legenda", () => {
    const { container } = render(<Galeria itens={ITENS} />);

    expect(
      screen.getByText("Centro cirúrgico — Hospital Madre Teresa"),
    ).toBeInTheDocument();
    expect(container.querySelectorAll("figure")).toHaveLength(ITENS.length);
    expect(container.querySelectorAll("figcaption")).toHaveLength(1);
  });

  it("aguenta lista vazia sem quebrar a página em volta", () => {
    const { container } = render(<Galeria itens={[]} />);

    expect(container.querySelectorAll("li")).toHaveLength(0);
  });
});

// -----------------------------------------------------------------------------

const VIDEO = {
  src: "/fotos/centro-cirurgico-video.mp4",
  poster: "/fotos/centro-cirurgico-video-poster.jpeg",
  legenda: "Cirurgiã em procedimento no centro cirúrgico.",
} as const;

describe("VideoSobClique", () => {
  /*
    O jsdom não implementa `HTMLMediaElement.play` e imprime um "Not
    implemented" a cada clique. O componente já sobrevive a isso — é por causa
    dele que o `play()` vai embrulhado em `Promise.resolve` —, mas o ruído
    esconderia um erro de verdade na saída do teste.
  */
  beforeAll(() => {
    vi.spyOn(HTMLMediaElement.prototype, "play").mockImplementation(() =>
      Promise.resolve(),
    );
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  it("não põe nenhum vídeo no DOM antes do clique — são 3,5 MB fora do LCP", () => {
    const { container } = render(<VideoSobClique {...VIDEO} />);

    expect(container.querySelector("video")).toBeNull();
    expect(container.querySelector("source")).toBeNull();

    // O que existe antes do clique é uma imagem estática. `alt=""` porque o
    // botão em volta já carrega o nome acessível — daí a busca pela tag.
    const poster = container.querySelector("img");
    expect(poster).toHaveAttribute("alt", "");
    expect(poster?.getAttribute("src")).toContain("video-poster");
  });

  it("o botão de play tem rótulo acessível e alvo de toque de 44px", () => {
    const { container } = render(<VideoSobClique {...VIDEO} />);

    expect(
      screen.getByRole("button", {
        name: `Assistir ao vídeo: ${VIDEO.legenda}`,
      }),
    ).toBeInTheDocument();

    // `size-11` são os 44px de WCAG 2.5.5 no elemento que a pessoa mira.
    expect(container.querySelector(".size-11")).not.toBeNull();
  });

  it("o pôster não anima: não há o que prefers-reduced-motion desligar", () => {
    const { container } = render(<VideoSobClique {...VIDEO} />);
    const poster = container.querySelector("img");

    expect(poster?.className).not.toContain("transition");
    expect(poster?.className).not.toContain("animate");
    expect(container.querySelector(".zoom-suave")).toBeNull();
  });

  it("depois do clique entra um vídeo mudo, com controles nativos e sem autoplay", () => {
    const { container } = render(<VideoSobClique {...VIDEO} />);

    fireEvent.click(screen.getByRole("button"));

    const video = container.querySelector("video");

    expect(video).not.toBeNull();
    expect(video).toHaveAttribute("preload", "none");
    expect(video).toHaveAttribute("poster", VIDEO.poster);
    expect(video?.muted).toBe(true);
    expect(video?.controls).toBe(true);
    expect(video?.autoplay).toBe(false);
    expect(video?.loop).toBe(false);
  });

  it("mantém a legenda em figcaption antes e depois do clique", () => {
    render(<VideoSobClique {...VIDEO} />);

    expect(screen.getByText(VIDEO.legenda).tagName).toBe("FIGCAPTION");

    fireEvent.click(screen.getByRole("button"));

    expect(screen.getByText(VIDEO.legenda).tagName).toBe("FIGCAPTION");
  });
});
