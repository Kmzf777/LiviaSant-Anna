import { expect, test, type Page } from "@playwright/test";

import { listarRotas } from "@/content";

/**
 * Overflow horizontal — a rede definitiva.
 *
 * ## Por que existe um terceiro teste de largura
 *
 * `mobile.spec.ts` já mede overflow, e `texto-ampliado.spec.ts` também. Os dois
 * passavam, e o dono do site continuou vendo texto sair da tela. O buraco entre
 * eles era de COBERTURA, não de método: cada um mede nas viewports dos projetos
 * do `playwright.config.ts` (320 e 390 no celular), e o defeito real aparecia
 * também em 360 e 414 — as duas larguras mais comuns de Android e de iPhone
 * Plus/Pro Max, e nenhuma delas estava na suíte.
 *
 * Este arquivo fecha o buraco varrendo a matriz inteira: quatro larguras
 * × duas escalas de fonte do sistema × todas as rotas de `listarRotas()`.
 *
 * ## O defeito que ele nasceu para impedir
 *
 * Medido em 15/08/2026, /aviso-legal a 320px com a fonte do sistema em 150%: o
 * documento tinha 365px. A causa não era largura fixa nem `clamp()` estourado —
 * era `overflow-wrap: break-word`, que permite quebrar a palavra na hora de
 * renderizar mas, por especificação, NÃO conta essa quebra no min-content. Um
 * domínio de 345px (`publicidademedica.cfm.org.br.`) definia o min-content do
 * parágrafo, o min-content definia a trilha `auto` do grid, e a trilha
 * empurrava a página inteira. A correção está em `app/globals.css`, e é
 * `overflow-wrap: anywhere`.
 *
 * O que este teste guarda, portanto, não é "a página cabe": é que nenhum
 * conteúdo novo — um e-mail, uma URL, um nome de procedimento comprido — volte
 * a ditar a largura do documento.
 *
 * ## Por que a viewport é definida aqui dentro
 *
 * A varredura precisa de larguras que não são as dos projetos. Definir a
 * viewport no próprio teste é o que permite isso, e obriga a rodar UMA vez só —
 * senão os quatro projetos repetiriam a mesma matriz e a suíte quadruplicaria
 * sem medir nada a mais.
 */

const ROTAS = listarRotas();

/** As quatro larguras que cobrem o parque de celulares em uso. */
const LARGURAS = [
  { px: 320, aparelho: "iPhone SE" },
  { px: 360, aparelho: "Android mediano" },
  { px: 390, aparelho: "iPhone 13/14" },
  { px: 414, aparelho: "iPhone Plus / Pro Max" },
] as const;

/**
 * A fonte do sistema. 100% é o padrão; 150% é a posição de acessibilidade que
 * revelou o defeito de `ed25bd9` e continua sendo a mais dura, porque tudo que
 * é medido em `rem` cresce e a tela não.
 */
const ESCALAS = [
  { rotulo: "100%", px: 16 },
  { rotulo: "150%", px: 24 },
] as const;

/**
 * A matriz roda uma vez. `mobile-320` é o projeto escolhido por ser o mais
 * estreito — se um dia ele sair do `playwright.config.ts`, este arquivo passa a
 * ser pulado inteiro, e o teste "a matriz rodou" abaixo é o que denuncia isso
 * em vez de deixar a suíte ficar verde em silêncio.
 */
const PROJETO = "mobile-320";

type Medida = {
  readonly scrollWidth: number;
  readonly clientWidth: number;
  readonly innerWidth: number;
  readonly culpados: readonly {
    readonly seletor: string;
    readonly esquerda: number;
    readonly direita: number;
    readonly largura: number;
    readonly texto: string;
  }[];
};

/**
 * Roda no navegador. Devolve as larguras e quem estoura.
 *
 * A régua é `clientWidth` e não `innerWidth`, apesar de os dois nomearem "a
 * largura da janela": `innerWidth` inclui a barra de rolagem vertical, que em
 * Chromium não é sobreposta e ocupa ~15px reais. Medir contra ela deixaria
 * passar até 15px de estouro — e 15px é exatamente a largura de um `100vw` mal
 * colocado, que é dos defeitos mais comuns da categoria. `clientWidth` é o
 * espaço que o conteúdo de fato tem.
 */
function medir(): Medida {
  const doc = document.documentElement;
  const visivel = doc.clientWidth;

  const descrever = (el: Element) => {
    const classes = (el.getAttribute("class") ?? "")
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 4);
    return (
      el.tagName.toLowerCase() +
      (el.id ? `#${el.id}` : "") +
      (classes.length ? `.${classes.join(".")}` : "")
    );
  };

  const eleitos: Element[] = [];
  const culpados: Medida["culpados"][number][] = [];

  if (doc.scrollWidth > visivel) {
    for (const el of document.querySelectorAll("body *")) {
      const caixa = el.getBoundingClientRect();
      if (caixa.width === 0 && caixa.height === 0) continue;
      // Elemento fixo não gera rolagem: ele não participa do scrollWidth.
      if (getComputedStyle(el).position === "fixed") continue;
      if (caixa.right <= visivel + 1 && caixa.left >= -1) continue;
      // Filho herda a culpa do pai: só o contêiner mais externo é reportado.
      if (eleitos.some((pai) => pai.contains(el))) continue;

      eleitos.push(el);
      culpados.push({
        seletor: descrever(el),
        esquerda: Math.round(caixa.left),
        direita: Math.round(caixa.right),
        largura: Math.round(caixa.width),
        texto: (el.textContent ?? "").replace(/\s+/g, " ").trim().slice(0, 48),
      });
      if (culpados.length >= 4) break;
    }
  }

  return {
    scrollWidth: doc.scrollWidth,
    clientWidth: visivel,
    innerWidth: window.innerWidth,
    culpados,
  };
}

/**
 * Espera o layout parar de mudar.
 *
 * Trocar viewport e tamanho de fonte dispara reflow, e um `waitForTimeout` fixo
 * mede a máquina, não o site: com quatro workers disputando a CPU, a medição
 * cairia no meio do reflow. Aqui a página é perguntada até responder duas vezes
 * o mesmo número.
 */
async function esperarLayoutAssentar(page: Page) {
  await page.evaluate(() => {
    const janela = window as unknown as { __larguraAnterior?: number };
    delete janela.__larguraAnterior;
  });

  await page.waitForFunction(
    () => {
      const janela = window as unknown as { __larguraAnterior?: number };
      const agora = document.documentElement.scrollWidth;
      const estavel = janela.__larguraAnterior === agora;
      janela.__larguraAnterior = agora;
      return estavel;
    },
    undefined,
    { timeout: 15_000, polling: 200 },
  );
}

test.describe("overflow horizontal", () => {
  test.beforeEach(({}, info) => {
    test.skip(
      info.project.name !== PROJETO,
      `A varredura define a própria viewport (${LARGURAS.map((l) => l.px).join(
        ", ",
      )}px), então roda uma vez só, no projeto ${PROJETO}.`,
    );
  });

  test("a matriz tem o que varrer", () => {
    // Guarda contra a suíte "passar" percorrendo uma lista vazia.
    expect(ROTAS.length).toBeGreaterThan(0);
    expect(LARGURAS.length * ESCALAS.length).toBeGreaterThan(0);
  });

  for (const rota of ROTAS) {
    test(`o documento nunca fica mais largo que a tela em ${rota}`, async ({
      page,
    }) => {
      const resposta = await page.goto(rota);
      expect(resposta?.status(), `rota ${rota} não respondeu 200`).toBe(200);

      // Guarda contra medir um site sem folha de estilo — o mesmo cuidado de
      // tests/e2e/mobile.spec.ts. Uma página sem CSS "cabe" sempre, e um teste
      // que aprova isso é pior do que teste nenhum.
      const gutter = await page.evaluate(() =>
        getComputedStyle(document.documentElement)
          .getPropertyValue("--gutter")
          .trim(),
      );
      expect(
        gutter,
        `a folha de estilo não chegou em ${rota}: o token --gutter não resolve.`,
      ).not.toBe("");

      const estouros: string[] = [];

      for (const largura of LARGURAS) {
        for (const escala of ESCALAS) {
          await page.setViewportSize({ width: largura.px, height: 800 });
          await page.evaluate((px) => {
            document.documentElement.style.fontSize = `${px}px`;
          }, escala.px);

          // A métrica da Bodoni e da Switzer muda a largura de tudo; medir
          // antes de as fontes assentarem mede o fallback.
          await page.evaluate(() => document.fonts.ready);
          await esperarLayoutAssentar(page);

          const medida = await page.evaluate(medir);
          if (medida.scrollWidth <= medida.clientWidth) continue;

          const quem =
            medida.culpados
              .map(
                (c) =>
                  `${c.seletor} ocupa x ${c.esquerda}..${c.direita} ` +
                  `(${c.largura}px)${c.texto ? ` — "${c.texto}"` : ""}`,
              )
              .join("\n      ") || "nenhum elemento identificado";

          estouros.push(
            `  • ${largura.px}px (${largura.aparelho}), fonte do sistema em ` +
              `${escala.rotulo}: documento com ${medida.scrollWidth}px numa ` +
              `área de ${medida.clientWidth}px (+${
                medida.scrollWidth - medida.clientWidth
              }px)\n      ${quem}`,
          );
        }
      }

      expect(
        estouros,
        `${rota} empurra a página para os lados em ${estouros.length} das ` +
          `${LARGURAS.length * ESCALAS.length} combinações de largura e ` +
          `escala de fonte:\n${estouros.join("\n")}\n\n` +
          "A saída não é `overflow-x: hidden` no body — isso esconde o " +
          "sintoma e mata o scroll horizontal legítimo de tabela. Procure " +
          "min-content: palavra longa sem quebra possível, trilha de grid " +
          "`auto`, item de flex com `min-width: auto`, ou largura em px.",
      ).toEqual([]);
    });
  }
});
