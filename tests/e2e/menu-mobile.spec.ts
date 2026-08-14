import { expect, test, type Page } from "@playwright/test";

/**
 * O menu mobile — o teste que existe porque ele está CERTO.
 *
 * A auditoria de mobile (PLANO-MOBILE.md, tabela "O que NÃO está quebrado")
 * verificou à mão que o menu abre, é um diálogo modal de verdade, prende o
 * foco, trava o scroll de fundo, fecha no Esc e navega. Nada disso precisa de
 * correção — precisa de guarda.
 *
 * É a categoria de comportamento que quebra em silêncio: trocar o `div` por um
 * `<dialog>`, mover o `overflow: hidden` do body para um wrapper, ou adicionar
 * um botão fora do painel são mudanças que parecem inofensivas no diff e que
 * deixam quem navega por teclado preso atrás do menu, ou rolando o conteúdo de
 * baixo enquanto o menu está aberto. Sem teste, a próxima pessoa a descobrir é
 * a paciente.
 *
 * Cada teste abaixo fixa um item verificado à mão, com o mesmo nome que ele
 * tem no diagnóstico.
 */

/** O botão "Menu" é `lg:hidden`: de 1024px para cima não existe menu mobile. */
const LARGURA_MAXIMA = 1024;

const BOTAO_MENU = { role: "button" as const, name: /^menu$/i };

const FOCAVEIS = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

async function abrirMenu(page: Page) {
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);

  const botao = page.getByRole(BOTAO_MENU.role, { name: BOTAO_MENU.name });
  await expect(
    botao,
    "o botão Menu do header sumiu — sem ele não há navegação no celular",
  ).toBeVisible();

  await botao.click();

  const painel = page.getByRole("dialog");
  await expect(painel).toBeVisible();
  return { botao, painel };
}

const overflowDoBody = (page: Page) =>
  page.evaluate(() => getComputedStyle(document.body).overflow);

test.describe("menu mobile", () => {
  test.beforeEach(({ viewport }) => {
    test.skip(
      (viewport?.width ?? 0) >= LARGURA_MAXIMA,
      "Acima de lg o header mostra a navegação inteira e o menu não existe.",
    );
  });

  test("abre e é um diálogo modal de verdade", async ({ page }) => {
    // `role=dialog` sem `aria-modal` faz o leitor de tela continuar anunciando
    // o conteúdo de trás como se estivesse disponível — o menu ocupa a tela
    // inteira, e não está.
    const { painel } = await abrirMenu(page);

    await expect(painel).toHaveAttribute("aria-modal", "true");
    await expect(painel).toHaveAttribute("aria-label", /menu/i);

    // O botão que abriu precisa declarar o estado, senão o leitor de tela
    // anuncia "botão Menu" sem dizer que ele já está aberto.
    await expect(
      page.getByRole(BOTAO_MENU.role, { name: BOTAO_MENU.name }),
    ).toHaveAttribute("aria-expanded", "true");

    // O foco entra no painel ao abrir. Sem isso, o Tab seguinte continua do
    // ponto em que estava no documento — atrás do menu.
    const focoDentro = await page.evaluate(
      () => !!document.activeElement?.closest('[role="dialog"]'),
    );
    expect(focoDentro, "o foco não entrou no painel ao abrir").toBe(true);
  });

  test("trava o scroll do fundo enquanto está aberto", async ({ page }) => {
    // O menu é `fixed inset-0`. Sem travar o body, o dedo que rola o menu rola
    // a página de trás junto, e ao fechar a pessoa está em outro lugar.
    expect(await overflowDoBody(page)).not.toBe("hidden");

    const { painel } = await abrirMenu(page);
    expect(
      await overflowDoBody(page),
      "o body continua rolável com o menu aberto",
    ).toBe("hidden");

    await page.keyboard.press("Escape");
    await expect(painel).toBeHidden();

    expect(
      await overflowDoBody(page),
      "o scroll do fundo não voltou depois de fechar o menu",
    ).not.toBe("hidden");
  });

  test("prende o foco: o Tab dá a volta sem escapar", async ({ page }) => {
    const { painel } = await abrirMenu(page);

    const quantos = await painel.locator(FOCAVEIS).count();
    expect(quantos, "o painel do menu não tem nada focável").toBeGreaterThan(1);

    // Uma volta inteira e mais três: se houver fuga, ela acontece na virada.
    for (let i = 0; i < quantos + 3; i += 1) {
      await page.keyboard.press("Tab");

      const onde = await page.evaluate(() => {
        const ativo = document.activeElement as HTMLElement | null;
        if (!ativo) return "nenhum";
        if (ativo.closest('[role="dialog"]')) return "dentro";
        return `fora: ${ativo.tagName.toLowerCase()} "${(ativo.textContent ?? "")
          .trim()
          .slice(0, 30)}"`;
      });

      expect(
        onde,
        `o foco escapou do menu no Tab nº ${i + 1} de ${quantos + 3}`,
      ).toBe("dentro");
    }

    // E para trás também: do primeiro elemento, Shift+Tab volta para o último.
    await painel.locator(FOCAVEIS).first().focus();
    await page.keyboard.press("Shift+Tab");

    const noUltimo = await painel.locator(FOCAVEIS).last().evaluate(
      (el) => el === document.activeElement,
    );
    expect(
      noUltimo,
      "Shift+Tab no primeiro item não voltou para o último — o ciclo é aberto",
    ).toBe(true);
  });

  test("Esc fecha e devolve o foco a quem abriu", async ({ page }) => {
    const { botao, painel } = await abrirMenu(page);

    await page.keyboard.press("Escape");
    await expect(painel).toBeHidden();

    // Sem devolver o foco, o teclado recomeça no topo do documento e quem
    // navegava perde o lugar onde estava.
    await expect(
      botao,
      "o foco não voltou para o botão Menu depois de fechar",
    ).toBeFocused();
    await expect(botao).toHaveAttribute("aria-expanded", "false");
  });

  test("navegar por um link do menu leva à página e fecha o menu", async ({
    page,
  }) => {
    const { painel } = await abrirMenu(page);

    const link = painel.getByRole("link").first();
    const destino = await link.getAttribute("href");
    expect(destino, "o menu não tem link de navegação").toBeTruthy();

    await link.click();
    await page.waitForURL(`**${destino}`);

    // O menu tem de sumir sozinho na troca de rota: um menu que sobrevive à
    // navegação esconde a página que a pessoa acabou de pedir.
    await expect(painel).toBeHidden();
    expect(
      await overflowDoBody(page),
      "o scroll do fundo ficou travado depois de navegar pelo menu",
    ).not.toBe("hidden");
  });
});
