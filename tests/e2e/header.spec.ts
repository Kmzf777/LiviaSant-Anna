import { expect, test } from "@playwright/test";

/**
 * O header depende de coisas que só existem no navegador: media queries, altura
 * real do elemento, e a ordem em que o Tailwind emite as regras. Nenhuma delas
 * aparece em teste unitário com jsdom.
 *
 * Estes testes existem por um bug concreto. O botão "Agendar consulta" recebia
 * `className="hidden md:inline-flex"`, e continuava visível em 390px: o `BASE`
 * do Botão traz `inline-flex`, o Tailwind emite essa regra depois de `hidden`,
 * e a ordem dos nomes no atributo `class` não decide nada. Foi encontrado por
 * dois subagents olhando capturas — o que não escala para 17 rotas.
 */

const BOTAO_AGENDAR = 'header a:has-text("Agendar consulta")';

test.describe("header", () => {
  test("esconde o CTA no mobile e mostra o menu", async ({ page }, info) => {
    const largura = info.project.use.viewport?.width ?? 0;
    test.skip(largura >= 768, "Só vale abaixo de md.");

    await page.goto("/");

    await expect(page.locator(BOTAO_AGENDAR)).toBeHidden();
    await expect(page.getByRole("button", { name: /menu/i })).toBeVisible();
  });

  test("mostra o CTA no desktop", async ({ page }, info) => {
    const largura = info.project.use.viewport?.width ?? 0;
    test.skip(largura < 768, "Só vale de md para cima.");

    await page.goto("/");
    await expect(page.locator(BOTAO_AGENDAR)).toBeVisible();
  });

  test("não estoura a largura da viewport", async ({ page }) => {
    await page.goto("/");

    const { scroll, cliente } = await page.evaluate(() => ({
      scroll: document.documentElement.scrollWidth,
      cliente: document.documentElement.clientWidth,
    }));

    // Overflow horizontal é sempre bug, e no mobile é o mais comum de todos.
    expect(scroll).toBeLessThanOrEqual(cliente);
  });

  test("a altura real bate com o token --header-h", async ({ page }) => {
    // O hero se encaixa sob o header com `-mt-[var(--header-h)]`. Se a altura
    // real divergir do token, sobra ou falta uma faixa no topo do site inteiro.
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);

    const { real, token } = await page.evaluate(() => {
      const header = document.querySelector("header");
      const declarado = getComputedStyle(document.documentElement)
        .getPropertyValue("--header-h")
        .trim();

      return {
        real: header?.getBoundingClientRect().height ?? 0,
        token: Number.parseFloat(declarado),
      };
    });

    expect(Math.abs(real - token)).toBeLessThanOrEqual(1);
  });

  test("o nome não quebra em duas linhas", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);

    const linhas = await page.evaluate(() => {
      const logo = document.querySelector<HTMLElement>("header a");
      if (!logo) return 0;
      const alturaDaLinha = Number.parseFloat(getComputedStyle(logo).fontSize);
      return Math.round(logo.getBoundingClientRect().height / alturaDaLinha);
    });

    expect(linhas).toBeLessThanOrEqual(1);
  });
});
