/**
 * Captura de tela nos três breakpoints do briefing § 13: 390, 768 e 1440.
 *
 * Serve para crítica visual, não para teste de regressão — a comparação
 * automática de imagem vive em `tests/visual/`. Aqui o objetivo é olhar o
 * resultado e apontar o que está fraco antes de declarar pronto.
 *
 *   pnpm start --port 3100
 *   node scripts/capturar.mjs [pasta] [rota...]
 *
 * Sem rotas, captura tudo que `listarRotas()` conhece — então uma rota nova
 * entra na revisão visual sozinha.
 */

import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";
import { join } from "node:path";

const BASE = process.env.CAPTURA_BASE ?? "http://127.0.0.1:3100";

const LARGURAS = [
  { nome: "390", largura: 390, altura: 844 },
  { nome: "768", largura: 768, altura: 1024 },
  { nome: "1440", largura: 1440, altura: 900 },
];

const [, , pastaArg, ...rotasArg] = process.argv;
const PASTA = pastaArg ?? "capturas";

/** Lê as rotas do sitemap do próprio servidor: sem duplicar a lista. */
async function rotasDoSitemap() {
  const resposta = await fetch(`${BASE}/sitemap.xml`);
  const xml = await resposta.text();

  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)]
    .map((m) => new URL(m[1]).pathname)
    .sort();
}

const rotas = rotasArg.length > 0 ? rotasArg : await rotasDoSitemap();

mkdirSync(PASTA, { recursive: true });
console.log(`${rotas.length} rota(s) × ${LARGURAS.length} larguras\n`);

const navegador = await chromium.launch();
let total = 0;

for (const { nome, largura, altura } of LARGURAS) {
  const contexto = await navegador.newContext({
    viewport: { width: largura, height: altura },
    locale: "pt-BR",
    deviceScaleFactor: 1,
  });
  const pagina = await contexto.newPage();

  for (const rota of rotas) {
    // `load`, e não `networkidle`: o Next mantém conexões abertas em produção
    // e o networkidle nunca resolve.
    await pagina.goto(`${BASE}${rota}`, { waitUntil: "load", timeout: 60_000 });

    // Fontes assentadas antes de capturar, senão o clamp tipográfico é medido
    // sobre o fallback e a captura não corresponde ao site.
    await pagina.evaluate(() => document.fonts.ready);

    // Rola a página inteira para disparar o IntersectionObserver do reveal e
    // do Traço, e volta ao topo antes do fullPage.
    await pagina.evaluate(async () => {
      const passo = window.innerHeight;
      for (let y = 0; y < document.body.scrollHeight; y += passo) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 60));
      }
      window.scrollTo(0, 0);
    });

    await pagina.waitForTimeout(700);

    const slug =
      rota === "/" ? "home" : rota.replace(/\W+/g, "-").replace(/^-|-$/g, "");
    const arquivo = join(PASTA, `${slug}-${nome}.png`);

    await pagina.screenshot({ path: arquivo, fullPage: true });
    console.log(`  ${arquivo}`);
    total += 1;
  }

  await contexto.close();
}

await navegador.close();
console.log(`\n${total} capturas em ${PASTA}/`);
