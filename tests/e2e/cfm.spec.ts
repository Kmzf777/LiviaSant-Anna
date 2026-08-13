import { expect, test } from "@playwright/test";

import { getMedica, listarRotas } from "@/content";

/**
 * Bloco de identificação — Resolução CFM nº 2.336/2023, art. 3º.
 * Briefing § 3.1, spec § 3.3.
 *
 * A norma exige que fonte, tamanho e cor sejam os mesmos em todo o bloco, sem
 * alteração de tamanho e sem negrito. O teste unitário garante a estrutura do
 * markup; este garante o resultado renderizado, que é o que o CRM veria: lê
 * `getComputedStyle` de cada nó de texto do bloco e reprova se houver mais de
 * um valor distinto de `font-weight`, `font-size`, `font-family` ou `color`.
 *
 * As rotas vêm de `listarRotas()`, a mesma função que alimenta o sitemap e os
 * testes de a11y. Rota nova entra em cobertura de compliance sozinha — não
 * escreva rota à mão aqui.
 *
 * O seletor está escrito literalmente: um teste de auditoria não deve importar
 * o componente que audita. Se alguém trocar o atributo no componente, o teste
 * falha por ausência do bloco, que é exatamente o alarme certo.
 */

const SELETOR = '[data-cfm="identificacao"]';

const PROPRIEDADES = ["fontFamily", "fontSize", "fontWeight", "color"] as const;

type Tipografia = Record<(typeof PROPRIEDADES)[number], string>;

const ROTAS = listarRotas();

test.describe("bloco de identificação CFM", () => {
  test("há rotas para auditar", () => {
    // Guarda contra o teste "passar" varrendo uma lista vazia.
    expect(ROTAS.length).toBeGreaterThan(0);
  });

  for (const rota of ROTAS) {
    test(`presente e tipograficamente uniforme em ${rota}`, async ({
      page,
    }) => {
      const resposta = await page.goto(rota);
      expect(resposta?.status(), `rota ${rota} não respondeu 200`).toBe(200);

      const blocos = page.locator(SELETOR);
      const quantos = await blocos.count();

      expect(
        quantos,
        `nenhum bloco de identificação em ${rota}. A norma exige o bloco em ` +
          "local visível de TODAS as páginas.",
      ).toBeGreaterThan(0);

      const { identificacao } = getMedica();

      for (let i = 0; i < quantos; i += 1) {
        const bloco = blocos.nth(i);
        await expect(bloco, `bloco ${i} de ${rota} está oculto`).toBeVisible();

        // ---------------------------------------------------------------
        // Conteúdo: nome, designação, CRM, especialidade e RQE.
        // ---------------------------------------------------------------
        const texto = (await bloco.innerText()).replace(/\s+/g, " ").trim();
        for (const parte of [
          identificacao.nome,
          "Médica",
          identificacao.crm,
          identificacao.especialidade,
          identificacao.rqe,
        ]) {
          expect(texto, `bloco ${i} de ${rota} sem "${parte}"`).toContain(
            parte,
          );
        }

        // ---------------------------------------------------------------
        // Tipografia: um valor por propriedade, em todo nó de texto.
        // ---------------------------------------------------------------
        const estilos = await bloco.evaluate((raiz) => {
          const percorrer = document.createTreeWalker(
            raiz,
            NodeFilter.SHOW_TEXT,
          );
          const encontrados: {
            fontFamily: string;
            fontSize: string;
            fontWeight: string;
            color: string;
          }[] = [];

          let no = percorrer.nextNode();
          while (no) {
            const pai = no.parentElement;
            if (pai && (no.textContent ?? "").trim() !== "") {
              const estilo = window.getComputedStyle(pai);
              encontrados.push({
                fontFamily: estilo.fontFamily,
                fontSize: estilo.fontSize,
                fontWeight: estilo.fontWeight,
                color: estilo.color,
              });
            }
            no = percorrer.nextNode();
          }

          return encontrados;
        });

        expect(
          estilos.length,
          `bloco ${i} de ${rota} não tem nó de texto`,
        ).toBeGreaterThan(0);

        for (const propriedade of PROPRIEDADES) {
          const distintos = new Set(estilos.map((e) => e[propriedade]));
          expect(
            [...distintos],
            `bloco ${i} de ${rota}: ${propriedade} tem ${distintos.size} valores ` +
              "distintos. A norma exige fonte, tamanho e cor iguais em todo o bloco.",
          ).toHaveLength(1);
        }

        // ---------------------------------------------------------------
        // Sem negrito, e em mono — a família dos fatos verificáveis.
        // ---------------------------------------------------------------
        const primeiro: Tipografia | undefined = estilos[0];
        if (!primeiro) {
          throw new Error(`bloco ${i} de ${rota} sem tipografia legível`);
        }

        expect(
          Number(primeiro.fontWeight),
          `bloco ${i} de ${rota} está mais pesado que 400`,
        ).toBe(400);
        expect(
          primeiro.fontFamily,
          `bloco ${i} de ${rota} não usa a família mono`,
        ).toMatch(/mono/i);

        // ---------------------------------------------------------------
        // Nenhum elemento dentro do bloco: onde não há filho, não há como
        // destacar "Dra.", aumentar o nome ou apagar o CRM em cinza claro.
        // ---------------------------------------------------------------
        const filhos = await bloco.evaluate((raiz) => raiz.children.length);
        expect(
          filhos,
          `bloco ${i} de ${rota} tem elemento filho — a uniformidade deixa de ` +
            "ser garantida pela estrutura",
        ).toBe(0);
      }
    });
  }
});
