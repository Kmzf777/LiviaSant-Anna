import { expect, test } from "@playwright/test";

/**
 * Formulário de contato, no navegador de verdade.
 *
 * O teste unitário roda em jsdom, onde a Server Action é só uma função. Aqui
 * ela é uma requisição para um servidor Next em modo de produção — que é onde
 * as decisões que importam acontecem: a validação autoritativa, a armadilha, o
 * limite por IP e a recusa de fingir envio sem chave configurada.
 *
 * ---------------------------------------------------------------------------
 * POR QUE QUASE NENHUM TESTE AQUI ENVIA DE VERDADE
 * ---------------------------------------------------------------------------
 *
 * O limite é de 3 envios válidos por IP a cada 10 minutos, e a suíte roda em
 * três viewports contra o mesmo servidor, do mesmo IP. Um teste que envia em
 * todo projeto estouraria o limite e falharia nos dois últimos — sem nenhum
 * defeito no site.
 *
 * Então: envios inválidos e o envio com a armadilha não consomem cota (a
 * armadilha responde antes de qualquer contagem), e o único teste que atravessa
 * até o fim aceita as duas respostas honestas possíveis — "não está
 * configurado" ou "espere alguns minutos". As duas provam a mesma coisa, que é
 * o ponto: o servidor nunca responde "enviado" quando não enviou.
 */

const CAMPOS = {
  nome: "#contato-nome",
  whatsapp: "#contato-whatsapp",
  email: "#contato-email",
  assunto: "#contato-assunto",
  mensagem: "#contato-mensagem",
  consentimento: "#contato-consentimento",
} as const;

const VALIDOS = {
  nome: "Maria de Souza",
  whatsapp: "(31) 99999-9999",
  email: "maria@exemplo.com",
  mensagem: "Gostaria de avaliar a respiração e marcar uma consulta.",
};

test.describe("formulário de contato", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/contato");
  });

  test("campo vazio: resumo anunciado e foco no primeiro inválido", async ({
    page,
  }) => {
    await page.getByRole("button", { name: "Enviar mensagem" }).click();

    const regiao = page.getByRole("status");
    await expect(regiao).toContainText(/faltam \d+ campos/i);

    // O foco vai para o começo do problema, não para o meio dele.
    await expect(page.locator(CAMPOS.nome)).toBeFocused();
    await expect(page.locator(CAMPOS.nome)).toHaveAttribute(
      "aria-invalid",
      "true",
    );
  });

  test("e-mail inválido: erro ligado ao campo por aria-describedby", async ({
    page,
  }) => {
    await page.locator(CAMPOS.nome).fill(VALIDOS.nome);
    await page.locator(CAMPOS.whatsapp).fill(VALIDOS.whatsapp);
    await page.locator(CAMPOS.email).fill("maria arroba exemplo");
    await page.locator(CAMPOS.assunto).selectOption({ index: 1 });
    await page.locator(CAMPOS.mensagem).fill(VALIDOS.mensagem);
    await page.locator(CAMPOS.consentimento).check();

    await page.getByRole("button", { name: "Enviar mensagem" }).click();

    const campo = page.locator(CAMPOS.email);
    await expect(campo).toBeFocused();

    const descritores = (await campo.getAttribute("aria-describedby")) ?? "";
    expect(descritores).toContain("contato-email-erro");

    await expect(page.locator("#contato-email-erro")).toContainText(
      "nome@provedor.com",
    );
  });

  test("sem consentimento: não envia, e o foco vai para a caixa", async ({
    page,
  }) => {
    await page.locator(CAMPOS.nome).fill(VALIDOS.nome);
    await page.locator(CAMPOS.whatsapp).fill(VALIDOS.whatsapp);
    await page.locator(CAMPOS.email).fill(VALIDOS.email);
    await page.locator(CAMPOS.assunto).selectOption({ index: 1 });
    await page.locator(CAMPOS.mensagem).fill(VALIDOS.mensagem);

    await expect(page.locator(CAMPOS.consentimento)).not.toBeChecked();

    await page.getByRole("button", { name: "Enviar mensagem" }).click();

    await expect(page.locator(CAMPOS.consentimento)).toBeFocused();
    await expect(page.getByRole("status")).toContainText(
      /marque a caixa de consentimento/i,
    );
  });

  test("armadilha preenchida: descarte silencioso com resposta de sucesso", async ({
    page,
  }) => {
    await page.locator(CAMPOS.nome).fill(VALIDOS.nome);
    await page.locator(CAMPOS.whatsapp).fill(VALIDOS.whatsapp);
    await page.locator(CAMPOS.email).fill(VALIDOS.email);
    await page.locator(CAMPOS.assunto).selectOption({ index: 1 });
    await page.locator(CAMPOS.mensagem).fill(VALIDOS.mensagem);
    await page.locator(CAMPOS.consentimento).check();

    // É o que um robô faz: preenche tudo que parece campo de pessoa.
    await page.locator('input[name="sobrenome"]').fill("Souza");

    await page.getByRole("button", { name: "Enviar mensagem" }).click();

    // Sucesso, porque avisar o robô que ele foi detectado só ensina o robô.
    await expect(page.getByRole("status")).toContainText(/mensagem enviada/i);
  });

  test("envio completo: o servidor nunca finge ter enviado", async ({
    page,
  }) => {
    await page.locator(CAMPOS.nome).fill(VALIDOS.nome);
    await page.locator(CAMPOS.whatsapp).fill(VALIDOS.whatsapp);
    await page.locator(CAMPOS.email).fill(VALIDOS.email);
    await page.locator(CAMPOS.assunto).selectOption({ index: 1 });
    await page.locator(CAMPOS.mensagem).fill(VALIDOS.mensagem);
    await page.locator(CAMPOS.consentimento).check();

    await page.getByRole("button", { name: "Enviar mensagem" }).click();

    // Sem RESEND_API_KEY em produção, a resposta honesta é o erro explícito.
    // Se a cota do IP já tiver acabado nesta rodada, a resposta honesta é o
    // aviso de espera. As duas provam o mesmo: nada de sucesso falso.
    await expect(page.getByRole("status")).toContainText(
      /não está configurado|espere/i,
    );
  });

  test("rótulo de verdade em todo campo, e nenhum placeholder no lugar dele", async ({
    page,
  }) => {
    for (const [nome, seletor] of Object.entries(CAMPOS)) {
      const campo = page.locator(seletor);
      const id = await campo.getAttribute("id");

      await expect(
        page.locator(`label[for="${id}"]`),
        `campo ${nome} sem <label> associado`,
      ).toHaveCount(1);

      expect(await campo.getAttribute("placeholder")).toBeNull();
    }
  });
});

test.describe("canais pendentes", () => {
  test("nenhum link de WhatsApp enquanto o número não for confirmado", async ({
    page,
  }) => {
    for (const rota of ["/contato", "/consultorio", "/consulta"]) {
      await page.goto(rota);

      // Link para número não confirmado é pior do que a ausência do botão.
      await expect(page.locator('a[href*="wa.me"]')).toHaveCount(0);
    }
  });

  test("o mapa não carrega sozinho: nenhum iframe na primeira pintura", async ({
    page,
  }) => {
    await page.goto("/consultorio");

    await expect(page.locator("iframe")).toHaveCount(0);
  });
});
