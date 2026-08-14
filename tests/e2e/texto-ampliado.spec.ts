import { expect, test } from "@playwright/test";

import { listarRotas } from "@/content";

/**
 * O site com a fonte do sistema aumentada.
 *
 * ## Por que este arquivo existe
 *
 * O usuário relatou overflow horizontal no celular. A suíte inteira dizia que
 * não havia: `tests/e2e/mobile.spec.ts` mede overflow em 21 rotas × 4 larguras
 * e passava, a auditoria em `scripts/auditar-mobile.mjs` passava, e uma
 * varredura contínua de 300 a 520px também. Em Chromium e em WebKit.
 *
 * Estava tudo certo, e tudo errado pelo mesmo motivo: **todos rodavam com a
 * fonte padrão de 16px**. Com a fonte do sistema em 150% — que é uma opção de
 * acessibilidade comum, não um caso exótico — o header estourava 52px em TODAS
 * as 21 rotas.
 *
 * A causa era estrutural. Quase tudo no site é medido em `rem`: o nome no
 * header, o `--gutter`, o corredor do Traço. Com a fonte maior eles crescem, e
 * a tela não. Um celular de 390px passava a precisar de 464px só no header.
 *
 * Três correções vieram daí, e este arquivo é o que impede que voltem:
 *
 *   1. o nome do header trunca e o grupo de navegação não encolhe — em espaço
 *      apertado quem cede é a marca, nunca o acesso ao menu;
 *   2. `--gutter` e `--traco-corredor` passaram a ter piso em `px`: margem não
 *      deve crescer com o tamanho do texto, porque quem precisa de letra maior
 *      precisa de mais lugar para ela, não de mais margem;
 *   3. `hyphens: auto` no corpo. "otorrinolaringologia" em Bodoni de 42px
 *      ocupa ~380px, e um item de grid não encolhe abaixo da maior palavra que
 *      contém. Sem ponto de quebra, a coluna empurrava a página.
 *
 * ## A lição de método
 *
 * Um teste que só roda na configuração padrão testa uma configuração, não o
 * site. Se amanhã alguém acrescentar uma medida em `rem` que precisaria ser
 * `px`, é aqui que vai aparecer.
 */

/** 150% e 125% — as duas posições mais usadas do ajuste de texto do sistema. */
const ESCALAS = [
  { rotulo: "125%", px: 20 },
  { rotulo: "150%", px: 24 },
] as const;

/** Roda no navegador. Devolve o estouro e o elemento mais externo que o causa. */
function medirEstouro() {
  const doc = document.documentElement;
  const visivel = doc.clientWidth;
  const estouro = doc.scrollWidth - visivel;
  if (estouro <= 0) return null;

  const culpados: { seletor: string; direita: number; texto: string }[] = [];

  for (const el of Array.from(document.querySelectorAll("body *"))) {
    const caixa = el.getBoundingClientRect();
    if (caixa.width === 0 && caixa.height === 0) continue;
    if (caixa.right <= visivel + 1 && caixa.left >= -1) continue;

    // Só o mais externo: filho herda a culpa do pai.
    if (culpados.length > 0) {
      const jaCoberto = Array.from(document.querySelectorAll("body *")).some(
        (outro) =>
          outro !== el &&
          outro.contains(el) &&
          outro.getBoundingClientRect().right > visivel + 1,
      );
      if (jaCoberto) continue;
    }

    const classes = (el.getAttribute("class") ?? "")
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 4)
      .join(".");

    culpados.push({
      seletor: el.tagName.toLowerCase() + (classes ? `.${classes}` : ""),
      direita: Math.round(caixa.right),
      texto: (el.textContent ?? "").trim().slice(0, 40),
    });

    if (culpados.length >= 3) break;
  }

  return { visivel, estouro, culpados };
}

for (const escala of ESCALAS) {
  test.describe(`texto do sistema em ${escala.rotulo}`, () => {
    for (const rota of listarRotas()) {
      test(`sem overflow horizontal em ${rota}`, async ({ page }, info) => {
        const largura = info.project.use.viewport?.width ?? 0;
        test.skip(largura > 768, "O aperto acontece em tela estreita.");

        /*
          A fonte é aplicada ANTES do primeiro render, não depois do `goto`.

          A versão anterior fazia `goto` → `style.fontSize` → `waitForTimeout`,
          e passava sozinha mas falhava na suíte completa: com quatro workers
          disputando a máquina, a medida caía no meio do reflow provocado pela
          troca de fonte. Teste que depende de quanto a máquina está ocupada não
          mede o site, mede a máquina.
        */
        await page.addInitScript((px) => {
          const aplicar = () => {
            document.documentElement.style.fontSize = `${px}px`;
          };
          if (document.documentElement) aplicar();
          document.addEventListener("DOMContentLoaded", aplicar);
        }, escala.px);

        await page.goto(rota);
        await page.evaluate(() => document.fonts.ready);

        // Espera o layout parar de mudar em vez de torcer para um timeout.
        await page.waitForFunction(
          () => {
            const doc = document.documentElement;
            const janela = window as unknown as { __larguraAnterior?: number };
            const agora = doc.scrollWidth;
            const estavel = janela.__larguraAnterior === agora;
            janela.__larguraAnterior = agora;
            return estavel;
          },
          undefined,
          { timeout: 10_000, polling: 250 },
        );

        const achado = await page.evaluate(medirEstouro);

        const detalhe = achado
          ? `+${achado.estouro}px em ${achado.visivel}px — ` +
            achado.culpados
              .map((c) => `${c.seletor} chega a ${c.direita}px ("${c.texto}")`)
              .join(" | ")
          : "";

        expect(achado, detalhe).toBeNull();
      });
    }
  });
}
