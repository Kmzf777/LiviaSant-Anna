import { expect, test, type Page } from "@playwright/test";

/**
 * O Traço — comportamento no navegador.
 *
 * Os testes cobrem os três contratos que não dá para verificar em unidade:
 * que a assinatura é decorativa (não intercepta ponteiro, não entra na árvore
 * de acessibilidade), que ela avança com o scroll, e que
 * `prefers-reduced-motion` a deixa completa, parada e sem nenhum trabalho
 * registrado.
 *
 * Enquanto o componente não estiver montado em `app/layout.tsx`, cada teste
 * se marca como pulado com a razão explícita — nunca passa em silêncio. No
 * dia em que o portão da Fase 2 fechar e o `<Traco />` entrar no layout, a
 * suíte inteira acorda sozinha.
 */

/**
 * A raiz da assinatura, e só ela. `[data-traco]` sozinho é frágil: a zona de
 * respiro reservada à fita se marca com `data-traco="livre"`, e um seletor que
 * pegasse as duas faria `page.locator()` estourar por modo estrito.
 */
const TRACO = "div.traco[data-traco]";

async function exigirTraco(page: Page) {
  const montado = (await page.locator(TRACO).count()) > 0;
  test.skip(!montado, "O <Traco /> ainda não foi montado em app/layout.tsx.");
}

/** Registra todo listener de scroll da página antes de qualquer script rodar. */
async function espionarScroll(page: Page) {
  await page.addInitScript(() => {
    const janela = window as unknown as { __listenersScroll: number };
    janela.__listenersScroll = 0;
    const original = EventTarget.prototype.addEventListener;
    EventTarget.prototype.addEventListener = function (tipo, ouvinte, opcoes) {
      if (tipo === "scroll") janela.__listenersScroll += 1;
      return original.call(this, tipo, ouvinte, opcoes);
    };
  });
}

async function rolarAte(page: Page, fracao: number) {
  await page.evaluate((f) => {
    const percurso = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo(0, percurso * f);
  }, fracao);
  // Duas rodadas: uma para o listener/timeline reagir, outra para o quadro pintar.
  await page.evaluate(
    () =>
      new Promise((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(resolve)),
      ),
  );
}

/**
 * Espera terminar só as animações conduzidas pelo RELÓGIO.
 *
 * As de `scroll()`/`view()` nunca "terminam" — a promessa `finished` delas não
 * resolve enquanto a timeline existir —, então filtrar por `DocumentTimeline` é
 * o que separa "o desenho de entrada acabou" de "esperar para sempre".
 */
async function aguardarDesenhoDeEntrada(page: Page) {
  await page
    .locator(`${TRACO} .traco__linha`)
    .first()
    .evaluate(async (el) => {
      const porTempo = el
        .getAnimations()
        .filter((a) => a.timeline instanceof DocumentTimeline);
      await Promise.all(
        porTempo.map((a) => a.finished.catch(() => undefined)),
      );
    });
}

const dashoffset = (page: Page) =>
  page
    .locator(`${TRACO} .traco__linha`)
    .first()
    .evaluate((el) => parseFloat(getComputedStyle(el).strokeDashoffset) || 0);

test.describe("O Traço", () => {
  test("existe, é decorativo e não intercepta o ponteiro", async ({ page }) => {
    await page.goto("/");
    await exigirTraco(page);

    const traco = page.locator(TRACO);
    await expect(traco).toHaveAttribute("aria-hidden", "true");
    await expect(traco.locator("svg.traco__fita")).toHaveCount(1);

    const estilo = await traco.evaluate((el) => {
      const calculado = getComputedStyle(el);
      return {
        position: calculado.position,
        pointerEvents: calculado.pointerEvents,
        overflow: calculado.overflow,
      };
    });

    expect(estilo.position).toBe("fixed");
    expect(estilo.pointerEvents).toBe("none");
    expect(estilo.overflow).toBe("hidden");

    // O SVG interno também: `pointer-events` não herda de forma confiável em
    // SVG, e um traço que engole clique é pior do que um traço ausente.
    const eventosDaFita = await traco
      .locator("svg.traco__fita")
      .evaluate((el) => getComputedStyle(el).pointerEvents);
    expect(eventosDaFita).toBe("none");
  });

  test("não fica na frente de nenhum link", async ({ page }) => {
    await page.goto("/");
    await exigirTraco(page);

    const links = page.locator("a[href]");
    const total = await links.count();
    test.skip(total === 0, "A página ainda não tem link para testar.");

    for (let i = 0; i < Math.min(total, 12); i += 1) {
      const link = links.nth(i);
      if (!(await link.isVisible())) continue;

      const caixa = await link.boundingBox();
      if (!caixa || caixa.width === 0 || caixa.height === 0) continue;

      const alcancavel = await page.evaluate(
        ({ x, y }) => {
          const alvo = document.elementFromPoint(x, y);
          return !alvo?.closest(".traco");
        },
        { x: caixa.x + caixa.width / 2, y: caixa.y + caixa.height / 2 },
      );

      expect(alcancavel, `o traço cobriu o link ${i}`).toBe(true);
    }
  });

  test("avança e se desenha conforme o scroll", async ({ page, viewport }) => {
    await page.goto("/");
    await exigirTraco(page);

    const temPercurso = await page.evaluate(
      () => document.documentElement.scrollHeight - window.innerHeight > 200,
    );
    test.skip(!temPercurso, "A página ainda é curta demais para rolar.");

    const posicao = () =>
      page.locator(`${TRACO} .traco__fita`).evaluate((el) => {
        const matriz = new DOMMatrixReadOnly(getComputedStyle(el).transform);
        return matriz.f;
      });

    await rolarAte(page, 0);
    const antes = { y: await posicao(), desenho: await dashoffset(page) };

    await rolarAte(page, 1);

    // Abaixo de 768px o desenho é uma animação de tempo (`--dur-draw`, 2400ms
    // com 120ms de atraso) que roda uma vez na entrada. Ler o dashoffset antes
    // dela terminar mede o meio do gesto, não o resultado — e o teste passava
    // ou falhava conforme a página carregasse rápido ou devagar. Esperar a
    // animação de tempo terminar tira a corrida sem afrouxar a asserção.
    await aguardarDesenhoDeEntrada(page);

    const depois = { y: await posicao(), desenho: await dashoffset(page) };

    // A fita sobe conforme a página desce. Vale em toda largura: a translação
    // é transform puro e é justamente o que sobrevive à degradação no celular.
    expect(depois.y).toBeLessThan(antes.y);

    // O desenho por scroll, não: abaixo de 768px ele acontece uma vez na
    // entrada e o caminho já chega inteiro (§ 4.5 do spec).
    if ((viewport?.width ?? 0) >= 768) {
      expect(depois.desenho).toBeLessThan(antes.desenho);
      expect(depois.desenho).toBeLessThan(1);
    } else {
      expect(depois.desenho).toBe(0);
    }
  });

  test("mede as superfícies para escolher a cor de cada trecho", async ({
    page,
    viewport,
  }) => {
    test.skip(
      (viewport?.width ?? 0) < 768,
      "Abaixo de 768px o Traço roda estático, sem medição — por decisão de performance.",
    );

    await page.goto("/");
    await exigirTraco(page);

    const traco = page.locator(TRACO);
    await expect(traco).toHaveAttribute("data-traco-medido", "true");

    // Cada cópia sai recortada pela superfície que lhe corresponde.
    const recortes = await traco.evaluate((el) => ({
      areia: getComputedStyle(el.querySelector(".traco__grupo--areia")!)
        .clipPath,
      vinho: getComputedStyle(el.querySelector(".traco__grupo--vinho")!)
        .clipPath,
    }));

    expect(recortes.areia).toContain("url(");
    expect(recortes.vinho).toContain("url(");
  });

  test.describe("com prefers-reduced-motion", () => {
    test("fica completo, parado e sem trabalho registrado", async ({
      page,
    }) => {
      // Emulado antes do goto: a preferência precisa valer já no primeiro
      // quadro, senão o teste mede um estado que o usuário nunca vê.
      await page.emulateMedia({ reducedMotion: "reduce" });
      await espionarScroll(page);
      await page.goto("/");
      await exigirTraco(page);

      // Completo: nada de dash pela metade.
      expect(await dashoffset(page)).toBe(0);

      const traco = page.locator(TRACO);

      // Sem observer: a medição nunca rodou.
      await expect(traco).not.toHaveAttribute("data-traco-medido", "true");

      const posicao = () =>
        page.locator(`${TRACO} .traco__fita`).evaluate((el) => {
          const matriz = new DOMMatrixReadOnly(getComputedStyle(el).transform);
          return matriz.f;
        });

      const antes = await posicao();
      await rolarAte(page, 1);

      // Parado: rolar a página inteira não move nem redesenha nada.
      expect(await posicao()).toBe(antes);
      expect(await dashoffset(page)).toBe(0);

      // O Traço não fez trabalho nenhum: nunca mediu as superfícies.
      //
      // Esta linha substitui uma asserção de "zero listeners de scroll na
      // página inteira", que era falsa e impossível. Medido: são três, e
      // nenhum é do Traço — dois vêm da delegação de eventos do próprio React
      // DOM na hidratação, e um do Header, que troca de cor ao rolar e é
      // anterior a todo este trabalho. A invariante só passava enquanto o
      // <Traco /> não estava montado e a suíte inteira se pulava sozinha.
      //
      // `data-traco-medido` é a prova certa e específica: o atributo só existe
      // depois que o ResizeObserver mede os retângulos de superfície. Ausente,
      // o componente não rodou observer nenhum — que é exatamente o que
      // `prefers-reduced-motion` exige dele, e é o que se quer garantir.
      await expect(
        page.locator(TRACO),
        "o Traço mediu superfícies mesmo sob reduced-motion",
      ).not.toHaveAttribute("data-traco-medido", /.*/);
    });
  });
});
