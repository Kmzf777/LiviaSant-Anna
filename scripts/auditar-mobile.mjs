/**
 * Auditoria de mobile — evidência antes de hipótese.
 *
 * Percorre todas as rotas do sitemap em larguras reais de celular e mede o que
 * costuma quebrar, apontando o elemento culpado em cada caso:
 *
 *   1. Overflow horizontal do documento, e QUEM o causa
 *   2. Alvos de toque abaixo de 44×44 (WCAG 2.5.5 / diretriz de plataforma)
 *   3. Campos de formulário com fonte < 16px (o iOS dá zoom e desalinha tudo)
 *   4. Sobreposição de elementos fixos com o conteúdo
 *   5. Texto realmente cortado — caixa com `overflow: hidden` menor que o texto
 *   6. O menu mobile: abre, fecha, prende foco
 *
 * Não conserta nada. Só produz a lista do que está errado, com o seletor.
 *
 * ---------------------------------------------------------------------------
 * CALIBRAGEM (PLANO-MOBILE.md § "Falsos positivos")
 * ---------------------------------------------------------------------------
 *
 * A primeira rodada deste script acusou coisas que não existem, e um
 * instrumento que só dá alarme falso é pior do que instrumento nenhum:
 *
 *   - `sr-only`. O link "Pular para o conteúdo" (1×1) e rótulos como
 *     "Passo 01:" apareciam como alvo de toque minúsculo e como texto
 *     vazando. São conteúdo corretamente escondido para leitor de tela:
 *     `ehOculto()` agora os tira de todas as checagens visuais.
 *
 *   - `texto-vazando` dava 100% de falso positivo. A causa é boba e vale
 *     registrar: em elemento INLINE (`span`, `a`) `clientWidth` é sempre 0,
 *     então `scrollWidth > clientWidth` é sempre verdade. A checagem só mede
 *     algo real quando a caixa de fato recorta — `overflow-x: hidden|clip`,
 *     sem `text-overflow: ellipsis` (que é truncamento intencional) e com
 *     `clientWidth` maior que zero.
 *
 *   - Alvo de toque medido só pela caixa do elemento. Ignorava o `<label>` que
 *     amplia o alvo, a área ampliada por pseudo-elemento e a exceção "inline"
 *     do WCAG 2.5.5/2.5.8. Acusava, entre outros, o logo do header em 21 rotas
 *     × 4 larguras — que já tem 44px de área clicável. A régua agora é a mesma
 *     de `tests/e2e/mobile.spec.ts`, e está detalhada no bloco 2.
 *
 *   pnpm start --port 3100
 *   node scripts/auditar-mobile.mjs [saida.json]
 */

import { chromium, devices } from "@playwright/test";
import { writeFileSync } from "node:fs";

const BASE = process.env.AUDITORIA_BASE ?? "http://127.0.0.1:3100";

/** Larguras reais, não redondas. 320 é o piso que ainda importa (iPhone SE). */
const PERFIS = [
  { nome: "320", largura: 320, altura: 568 },
  { nome: "360", largura: 360, altura: 740 },
  { nome: "390", largura: 390, altura: 844 },
  { nome: "430", largura: 430, altura: 932 },
];

const TOQUE_MINIMO = 44;

async function rotas() {
  const resposta = await fetch(`${BASE}/sitemap.xml`);
  const xml = await resposta.text();
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)]
    .map((m) => new URL(m[1]).pathname)
    .sort();
}

/** Roda dentro da página. Devolve os achados com o seletor do culpado. */
function medir(TOQUE_MINIMO) {
  const seletor = (el) => {
    if (!el) return "?";
    const partes = [el.tagName.toLowerCase()];
    if (el.id) partes.push(`#${el.id}`);
    const cls = (el.getAttribute("class") ?? "").split(/\s+/).filter(Boolean);
    if (cls.length) partes.push(`.${cls.slice(0, 3).join(".")}`);
    return partes.join("");
  };

  /**
   * O elemento (ou algum ancestral) está escondido de olho humano?
   *
   * Cobre os três jeitos: `display/visibility`, opacidade zero, e a técnica
   * `sr-only` — 1×1 com `overflow: hidden` e `clip` recolhido, que é conteúdo
   * destinado só a leitor de tela e portanto não é alvo de toque nem texto
   * visível. Sem isso o script acusa o link de pular conteúdo em toda rota.
   */
  const ehOculto = (el) => {
    for (let no = el; no instanceof Element; no = no.parentElement) {
      const estilo = getComputedStyle(no);
      if (estilo.display === "none" || estilo.visibility === "hidden") {
        return true;
      }
      if (Number.parseFloat(estilo.opacity) === 0) return true;
      if (/rect\(0px[,\s]/.test(estilo.clip)) return true;
      if (/^inset\(\s*50%/.test(estilo.clipPath)) return true;

      const caixa = no.getBoundingClientRect();
      if (estilo.overflow === "hidden" && caixa.width <= 1 && caixa.height <= 1) {
        return true;
      }
    }
    return false;
  };

  const doc = document.documentElement;
  const larguraViewport = doc.clientWidth;
  const achados = [];

  // ---------------------------------------------------------------------------
  // 1. Overflow horizontal — e quem causa
  // ---------------------------------------------------------------------------
  const overflow = doc.scrollWidth - larguraViewport;
  if (overflow > 0) {
    const culpados = [];
    for (const el of document.querySelectorAll("body *")) {
      const r = el.getBoundingClientRect();
      if (r.width === 0 && r.height === 0) continue;
      const estilo = getComputedStyle(el);
      if (estilo.position === "fixed") continue; // fixo não gera scroll
      // Só o elemento mais externo que estoura: filhos herdam a culpa do pai.
      if (r.right > larguraViewport + 1 || r.left < -1) {
        const paiCulpado = culpados.some((c) => c.el.contains(el));
        if (!paiCulpado) {
          culpados.push({ el, direita: Math.round(r.right), largura: Math.round(r.width) });
        }
      }
    }

    achados.push({
      tipo: "overflow-horizontal",
      gravidade: "alta",
      detalhe: `documento tem ${doc.scrollWidth}px numa viewport de ${larguraViewport}px (+${overflow}px)`,
      culpados: culpados.slice(0, 6).map((c) => ({
        seletor: seletor(c.el),
        direita: c.direita,
        largura: c.largura,
        texto: (c.el.textContent ?? "").trim().slice(0, 60),
      })),
    });
  }

  // ---------------------------------------------------------------------------
  // 2. Alvos de toque pequenos demais
  //
  // A caixa visual não é a área de toque, e a norma tem exceções. Três coisas
  // precisam entrar na conta, ou o script acusa desenho correto:
  //
  //   - o `<label>` faz parte do alvo (tocar o rótulo marca a caixa);
  //   - pseudo-elemento pode ampliar a área clicável sem mudar a caixa — daí a
  //     pergunta ao navegador por `elementsFromPoint`, que atribui o hit no
  //     pseudo ao elemento que o originou;
  //   - link no meio de uma frase é exceção explícita do WCAG 2.5.5/2.5.8,
  //     "tamanho limitado pela entrelinha do texto ao redor".
  //
  // Mesma régua de `tests/e2e/mobile.spec.ts`. Os dois instrumentos precisam
  // concordar, senão um deles vira ruído.
  // ---------------------------------------------------------------------------
  const rotulosDe = (el) =>
    "labels" in el && el.labels ? Array.from(el.labels) : [];

  const caixaDeAtivacao = (parentes) => {
    let esquerda = Infinity;
    let topo = Infinity;
    let direita = -Infinity;
    let base = -Infinity;
    for (const alvo of parentes) {
      const r = alvo.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) continue;
      esquerda = Math.min(esquerda, r.left);
      topo = Math.min(topo, r.top);
      direita = Math.max(direita, r.right);
      base = Math.max(base, r.bottom);
    }
    return { largura: direita - esquerda, altura: base - topo };
  };

  const alcanca = (parentes, x, y) => {
    if (x < 0 || y < 0 || x > innerWidth || y > innerHeight) return false;
    return document
      .elementsFromPoint(x, y)
      .some((achado) => parentes.some((a) => a === achado || a.contains(achado)));
  };

  const ehLinkNoMeioDeFrase = (el) => {
    if (el.tagName !== "A") return false;
    if (getComputedStyle(el).display !== "inline") return false;
    const pai = el.parentElement;
    if (!pai) return false;
    for (const no of pai.childNodes) {
      if (no === el) continue;
      if (no.nodeType === Node.TEXT_NODE && (no.textContent ?? "").trim()) {
        return true;
      }
    }
    return false;
  };

  const rolagemOriginal = document.documentElement.style.scrollBehavior;
  const posicaoOriginal = window.scrollY;
  document.documentElement.style.scrollBehavior = "auto";

  const pequenos = [];
  for (const el of document.querySelectorAll(
    "a[href], button, input, select, textarea, summary, [role=button], [role=slider]",
  )) {
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) continue; // escondido
    if (ehOculto(el)) continue; // sr-only e afins: não são alvo de toque
    if (r.width >= TOQUE_MINIMO && r.height >= TOQUE_MINIMO) continue;
    if (ehLinkNoMeioDeFrase(el)) continue;

    // Centralizado, para que os extremos do quadrado de 44px caibam na tela.
    el.scrollIntoView({ block: "center", inline: "center" });
    const agora = el.getBoundingClientRect();
    const cx = agora.left + agora.width / 2;
    const cy = agora.top + agora.height / 2;
    const braco = TOQUE_MINIMO / 2 - 1;
    const parentes = [el, ...rotulosDe(el)];
    const ativacao = caixaDeAtivacao(parentes);

    const cobreAltura =
      ativacao.altura >= TOQUE_MINIMO ||
      (alcanca(parentes, cx, cy - braco) && alcanca(parentes, cx, cy + braco));
    const cobreLargura =
      ativacao.largura >= TOQUE_MINIMO ||
      (alcanca(parentes, cx - braco, cy) && alcanca(parentes, cx + braco, cy));

    if (cobreAltura && cobreLargura) continue;

    pequenos.push({
      seletor: seletor(el),
      w: Math.round(ativacao.largura),
      h: Math.round(ativacao.altura),
      texto: (el.textContent ?? "").trim().slice(0, 40),
    });
  }

  document.documentElement.style.scrollBehavior = rolagemOriginal;
  window.scrollTo(0, posicaoOriginal);
  if (pequenos.length > 0) {
    achados.push({
      tipo: "alvo-de-toque",
      gravidade: "media",
      detalhe: `${pequenos.length} alvos abaixo de ${TOQUE_MINIMO}×${TOQUE_MINIMO}`,
      culpados: pequenos.slice(0, 10),
    });
  }

  // ---------------------------------------------------------------------------
  // 3. Campos com fonte < 16px — o iOS dá zoom ao focar e quebra o layout
  // ---------------------------------------------------------------------------
  const camposPequenos = [];
  for (const el of document.querySelectorAll("input, select, textarea")) {
    const tamanho = Number.parseFloat(getComputedStyle(el).fontSize);
    if (tamanho < 16) {
      camposPequenos.push({
        seletor: seletor(el),
        fontSize: tamanho,
        name: el.getAttribute("name"),
      });
    }
  }
  if (camposPequenos.length > 0) {
    achados.push({
      tipo: "zoom-ios",
      gravidade: "alta",
      detalhe: "campo com fonte < 16px: o iOS dá zoom ao focar",
      culpados: camposPequenos,
    });
  }

  // ---------------------------------------------------------------------------
  // 4. Texto REALMENTE cortado
  //
  // Não basta `scrollWidth > clientWidth`: em elemento inline `clientWidth` é
  // 0 por definição, e a checagem ingênua acusa cada `<span>` da página. Só é
  // corte de verdade quando a caixa recorta (`overflow-x: hidden|clip`), tem
  // largura própria, e o conteúdo transborda dela sem reticências.
  // ---------------------------------------------------------------------------
  const cortados = [];
  for (const el of document.querySelectorAll("body *")) {
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) continue;
    if (ehOculto(el)) continue;

    const estilo = getComputedStyle(el);
    // `auto`/`scroll` é rolagem intencional; `visible` não corta nada.
    if (estilo.overflowX !== "hidden" && estilo.overflowX !== "clip") continue;
    // Truncar com reticências é decisão de desenho, não defeito.
    if (estilo.textOverflow === "ellipsis") continue;
    if (el.clientWidth === 0) continue;

    const excesso = el.scrollWidth - el.clientWidth;
    if (excesso > 2) {
      cortados.push({
        seletor: seletor(el),
        scrollW: el.scrollWidth,
        clientW: el.clientWidth,
        cortado: excesso,
        texto: (el.textContent ?? "").trim().slice(0, 50),
      });
    }
  }
  if (cortados.length > 0) {
    achados.push({
      tipo: "texto-cortado",
      gravidade: "media",
      detalhe: `${cortados.length} caixas recortam conteúdo mais largo que elas`,
      culpados: cortados.slice(0, 8),
    });
  }

  // ---------------------------------------------------------------------------
  // 5. Elementos fixos cobrindo conteúdo
  // ---------------------------------------------------------------------------
  const fixos = [];
  for (const el of document.querySelectorAll("body *")) {
    const estilo = getComputedStyle(el);
    if (estilo.position !== "fixed") continue;
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) continue;
    if (estilo.pointerEvents === "none") continue;
    fixos.push({
      seletor: seletor(el),
      w: Math.round(r.width),
      h: Math.round(r.height),
      areaDaTela: Math.round(
        ((r.width * r.height) / (larguraViewport * window.innerHeight)) * 100,
      ),
    });
  }
  if (fixos.length > 0) {
    achados.push({
      tipo: "elemento-fixo",
      gravidade: "info",
      detalhe: `${fixos.length} elementos fixos capturando toque`,
      culpados: fixos,
    });
  }

  return {
    larguraViewport,
    scrollWidth: doc.scrollWidth,
    alturaDocumento: doc.scrollHeight,
    telas: +(doc.scrollHeight / window.innerHeight).toFixed(1),
    achados,
  };
}

// -----------------------------------------------------------------------------

const lista = await rotas();
const navegador = await chromium.launch();
const relatorio = [];

console.log(`${lista.length} rotas × ${PERFIS.length} larguras\n`);

for (const perfil of PERFIS) {
  const contexto = await navegador.newContext({
    ...devices["iPhone 13"],
    viewport: { width: perfil.largura, height: perfil.altura },
    isMobile: true,
    hasTouch: true,
    locale: "pt-BR",
  });
  const pagina = await contexto.newPage();

  for (const rota of lista) {
    await pagina.goto(`${BASE}${rota}`, { waitUntil: "load", timeout: 60_000 });
    await pagina.evaluate(() => document.fonts.ready);
    await pagina.waitForTimeout(250);

    const medida = await pagina.evaluate(medir, TOQUE_MINIMO);

    if (medida.achados.length > 0) {
      relatorio.push({ largura: perfil.nome, rota, ...medida });

      const graves = medida.achados.filter((a) => a.gravidade === "alta");
      const marca = graves.length > 0 ? "XX" : "~~";
      console.log(
        `${marca} ${perfil.nome}px  ${rota}  — ${medida.achados
          .map((a) => a.tipo)
          .join(", ")}`,
      );
    }
  }

  await contexto.close();
}

await navegador.close();

const saida = process.argv[2];
if (saida) {
  writeFileSync(saida, JSON.stringify(relatorio, null, 2), "utf8");
  console.log(`\nrelatório: ${saida}`);
}

// -----------------------------------------------------------------------------
// Resumo por tipo
// -----------------------------------------------------------------------------

const porTipo = new Map();
for (const entrada of relatorio) {
  for (const achado of entrada.achados) {
    const atual = porTipo.get(achado.tipo) ?? { n: 0, gravidade: achado.gravidade };
    atual.n += 1;
    porTipo.set(achado.tipo, atual);
  }
}

console.log("\nResumo:");
for (const [tipo, { n, gravidade }] of [...porTipo].sort((a, b) => b[1].n - a[1].n)) {
  console.log(`  ${gravidade.padEnd(6)} ${String(n).padStart(3)} × ${tipo}`);
}
