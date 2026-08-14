import { expect, test, type Page } from "@playwright/test";

import { listarRotas } from "@/content";

/**
 * Mobile — a rede que transforma a auditoria manual em teste permanente.
 *
 * Cada checagem aqui nasceu de um defeito MEDIDO, não de rigor decorativo. O
 * diagnóstico está em `PLANO-MOBILE.md`, e foi produzido por
 * `scripts/auditar-mobile.mjs` em 21 rotas × 4 larguras. Esse script é a
 * bancada de laboratório: roda sob demanda, varre larguras que a suíte não
 * cobre e imprime relatório. Este arquivo é o alarme: roda no portão, em toda
 * rota de `listarRotas()`, e reprova o build.
 *
 * O que cada teste guarda, e de qual defeito ele nasceu:
 *
 *   1. Overflow horizontal — HOJE PASSA (zero em 21 rotas × 4 larguras). Está
 *      aqui como regressão a impedir: é o defeito de mobile mais comum e mais
 *      barato de reintroduzir (uma imagem sem `max-width`, um `100vw` com
 *      padding, um `whitespace-nowrap` numa frase longa).
 *
 *   2. Alvos de toque ≥ 44×44 — Defeito B. Medido: botão "Menu" 72×33, logo
 *      164×24, `link-filete` do rodapé ~100×18, `Botao` filete 124×23,
 *      checkbox de consentimento 20×20. Sistêmico, no design system.
 *
 *   3. Campos de formulário com `font-size` ≥ 16px — HOJE PASSA (17px). Abaixo
 *      de 16px o iOS dá zoom ao focar o campo e desmonta o layout inteiro; é o
 *      tipo de regressão que só aparece num iPhone de verdade, tarde demais.
 *
 *   4. O Traço não cruza texto — Defeito A, o mais grave, e o único que
 *      contraria uma regra escrita do briefing (§ 5.8: "Nunca cruza texto.
 *      Nunca compete com a leitura."). Medido: 98–100% dos blocos de texto em
 *      colisão a 390px, 60–80% a 768px, 33–65% a 1440px.
 *
 * ---------------------------------------------------------------------------
 * POR QUE A LARGURA IMPORTA PARA ALGUNS E NÃO PARA OUTROS
 * ---------------------------------------------------------------------------
 *
 * Alvo de toque e zoom de campo são propriedades do ponteiro, não da página:
 * só valem onde o dedo é o ponteiro. Rodam até 768px inclusive (celular e
 * tablet) e se pulam acima disso, com razão explícita — nunca em silêncio.
 *
 * Overflow e colisão do Traço valem em toda largura. O Traço em particular
 * colide também no desktop, e um teste que só olhasse o celular deixaria
 * passar 33–65% de colisão a 1440px.
 */

const ROTAS = listarRotas();

/** WCAG 2.5.5 (AAA) e as diretrizes de iOS e Android convergem nos 44px. */
const TOQUE_MINIMO = 44;

/** Abaixo disso o Safari do iOS dá zoom ao focar o campo. */
const FONTE_MINIMA_DE_CAMPO = 16;

/** Acima disso o ponteiro é mouse, e 44px deixa de ser o critério. */
const LARGURA_MAXIMA_DE_TOQUE = 768;

const SELETOR_DE_ALVOS =
  "a[href], button, input, select, textarea, summary, [role=button], [role=slider]";

/**
 * A zona onde o Traço PODE ocupar a largura toda.
 *
 * O `RespiroTraco` é a pausa teatral: uma faixa deliberadamente sem texto,
 * onde a fita resolve no perfil de rosto do logo. A exceção é tratada por
 * atributo, e não por seletor de seção, para que o teste não precise saber
 * quais páginas têm respiro — quem reserva a zona a marca, e pronto.
 *
 * As duas grafias são aceitas de propósito: o contrato foi combinado com o
 * subagent do Traço como `data-traco="livre"`, e a forma booleana é a variante
 * natural de quem escrever o atributo sem valor. Aceitar as duas custa um
 * seletor e evita um falso negativo por detalhe de grafia.
 */
const ZONA_LIVRE = '[data-traco="livre"], [data-traco-livre]';

// -----------------------------------------------------------------------------
// Utilidades de página
// -----------------------------------------------------------------------------

async function abrir(page: Page, rota: string) {
  const resposta = await page.goto(rota);
  expect(resposta?.status(), `rota ${rota} não respondeu 200`).toBe(200);
  await page.evaluate(() => document.fonts.ready);

  // Guarda contra medir um site sem estilo. Já aconteceu: o servidor ficou de
  // pé servindo um HTML cujo chunk de CSS tinha sido regerado com outro hash,
  // o CSS deu 404, e TODA medição desta suíte virou lixo plausível — inputs de
  // 177×21, `sr-only` sem `sr-only`, texto até a borda. Um teste que mede uma
  // página sem folha de estilo precisa parar, não reprovar por outra razão.
  const gutter = await page.evaluate(() =>
    getComputedStyle(document.documentElement).getPropertyValue("--gutter").trim(),
  );
  expect(
    gutter,
    `a folha de estilo não chegou em ${rota}: o token --gutter não resolve. ` +
      "Rebuild e reinicie o servidor antes de acreditar em qualquer medida.",
  ).not.toBe("");

  // Um quadro para o layout assentar depois das fontes trocarem de métrica.
  await page.evaluate(
    () =>
      new Promise((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(resolve)),
      ),
  );
}

const larguraDe = (viewport: { width: number } | null | undefined) =>
  viewport?.width ?? 0;

// -----------------------------------------------------------------------------
// 1. Overflow horizontal
// -----------------------------------------------------------------------------

/** Roda no navegador. Devolve o estouro e o elemento mais externo que o causa. */
function medirOverflow() {
  const doc = document.documentElement;
  const largura = doc.clientWidth;
  const estouro = doc.scrollWidth - largura;

  const culpados: { seletor: string; direita: number; largura: number }[] = [];

  if (estouro > 0) {
    const eleitos: Element[] = [];
    for (const el of document.querySelectorAll("body *")) {
      const caixa = el.getBoundingClientRect();
      if (caixa.width === 0 && caixa.height === 0) continue;
      if (getComputedStyle(el).position === "fixed") continue; // não gera scroll
      if (caixa.right <= largura + 1 && caixa.left >= -1) continue;
      // Filho herda a culpa do pai: só o contêiner mais externo é reportado.
      if (eleitos.some((pai) => pai.contains(el))) continue;

      eleitos.push(el);
      const classes = (el.getAttribute("class") ?? "")
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 3);
      culpados.push({
        seletor:
          el.tagName.toLowerCase() +
          (el.id ? `#${el.id}` : "") +
          (classes.length ? `.${classes.join(".")}` : ""),
        direita: Math.round(caixa.right),
        largura: Math.round(caixa.width),
      });
    }
  }

  return {
    scrollWidth: doc.scrollWidth,
    clientWidth: largura,
    estouro,
    culpados: culpados.slice(0, 5),
  };
}

// -----------------------------------------------------------------------------
// 2. Alvos de toque
// -----------------------------------------------------------------------------

/**
 * Roda no navegador. Devolve os alvos cuja área de toque não alcança 44×44.
 *
 * Duas sutilezas que a versão ingênua deste teste erra:
 *
 *   - `sr-only` não é alvo de toque. O link "Pular para o conteúdo" mede 1×1
 *     de propósito, e reprová-lo é o falso positivo registrado no
 *     PLANO-MOBILE.md.
 *
 *   - A caixa visual não é a área de toque. A correção prevista para o
 *     `link-filete` pode vir por `min-height` (que muda a caixa) OU por
 *     pseudo-elemento (que não muda). Então, quando a caixa é pequena, o teste
 *     pergunta ao navegador o que ele acerta: `elementsFromPoint` nos extremos
 *     do quadrado de 44px centrado no alvo. Hit em pseudo-elemento é atribuído
 *     ao elemento que o originou, então essa pergunta cobre as duas correções.
 *     `elementsFromPoint` devolve a pilha inteira, não só o topo — um header
 *     sticky passando por cima não vira falso negativo.
 *
 *   - O `<label>` faz parte do alvo. Tocar o rótulo marca a caixa: é assim que
 *     o consentimento de `/contato` alcança 44px sem ter um quadrado
 *     desproporcional de 44px. Medir só o `<input>` reprovaria a correção
 *     certa e empurraria para a errada.
 *
 *   - Link no meio de uma frase é exceção da própria norma. WCAG 2.5.5 e 2.5.8
 *     dispensam o alvo "em uma sentença ou bloco de texto, com tamanho
 *     limitado pela entrelinha do texto ao redor" — esticar "consultório"
 *     dentro de um parágrafo para 44px quebraria o ritmo da leitura para
 *     cumprir uma regra que não se aplica. A detecção é literal: link `inline`
 *     que tem nó de TEXTO irmão no mesmo pai.
 */
function medirAlvosDeToque(entrada: { minimo: number; seletor: string }) {
  const { minimo, seletor } = entrada;

  const ehOculto = (el: Element) => {
    for (let no: Element | null = el; no; no = no.parentElement) {
      const estilo = getComputedStyle(no);
      if (estilo.display === "none" || estilo.visibility === "hidden") {
        return true;
      }
      if (Number.parseFloat(estilo.opacity) === 0) return true;
      if (/rect\(0px[,\s]/.test(estilo.clip)) return true;
      if (/^inset\(\s*50%/.test(estilo.clipPath)) return true;

      const caixa = no.getBoundingClientRect();
      if (
        estilo.overflow === "hidden" &&
        caixa.width <= 1 &&
        caixa.height <= 1
      ) {
        return true;
      }
    }
    return false;
  };

  const descrever = (el: Element) => {
    const marco = el.closest(
      "header, footer, nav, main, form, [role=dialog], article",
    );
    const contexto =
      marco && marco !== el ? `${marco.tagName.toLowerCase()} ` : "";
    const classes = (el.getAttribute("class") ?? "")
      .split(/\s+/)
      .filter((c) => c && !c.includes("[") && !c.includes(":"))
      .slice(0, 2);
    const alvo =
      el.tagName.toLowerCase() +
      (el.id ? `#${el.id}` : "") +
      (classes.length ? `.${classes.join(".")}` : "");
    const texto = (el.textContent ?? "").replace(/\s+/g, " ").trim().slice(0, 34);
    const rotulo = texto || el.getAttribute("aria-label") || "";
    return `${contexto}${alvo}${rotulo ? ` "${rotulo}"` : ""}`;
  };

  /**
   * O alvo e tudo que o ativa: o próprio elemento e os `<label>` associados a
   * ele (envolvendo-o ou por `for`). Tocar o rótulo aciona o controle.
   */
  const familia = (el: Element): Element[] => {
    const rotulos =
      "labels" in el ? Array.from((el as HTMLInputElement).labels ?? []) : [];
    return [el, ...rotulos];
  };

  /**
   * A caixa que o dedo pode acertar: a união do controle com seus rótulos.
   *
   * Não é generosidade — o `<label>` do consentimento envolve a caixa de 24px
   * e tem 44px de altura própria, e tocar o texto marca a caixa. Medir só o
   * `<input>` reprovaria o desenho correto. A união vale só para `<label>`,
   * que é região de ativação contígua e declarada pelo HTML; nada mais entra.
   */
  const caixaDeAtivacao = (parentes: Element[]) => {
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

  /** O navegador acerta o alvo (ou seu rótulo) nos extremos do quadrado? */
  const alcanca = (parentes: Element[], x: number, y: number) => {
    if (x < 0 || y < 0 || x > innerWidth || y > innerHeight) return false;
    return document
      .elementsFromPoint(x, y)
      .some((achado) =>
        parentes.some((alvo) => alvo === achado || alvo.contains(achado)),
      );
  };

  /**
   * Exceção "inline" do WCAG 2.5.5/2.5.8: alvo dentro de uma sentença, cujo
   * tamanho é limitado pela entrelinha do texto ao redor. Detectada pela
   * estrutura, não por classe: link `inline` com nó de texto irmão.
   */
  const ehLinkNoMeioDeFrase = (el: Element) => {
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

  // `scroll-behavior: smooth` transformaria cada scrollIntoView numa animação,
  // e a medição leria posições intermediárias.
  const rolagemOriginal = document.documentElement.style.scrollBehavior;
  const posicaoOriginal = window.scrollY;
  document.documentElement.style.scrollBehavior = "auto";

  const pequenos: {
    seletor: string;
    largura: number;
    altura: number;
    alcancavel: boolean;
  }[] = [];

  for (const el of document.querySelectorAll(seletor)) {
    const caixa = el.getBoundingClientRect();
    if (caixa.width === 0 || caixa.height === 0) continue;
    if (ehOculto(el)) continue;
    if (caixa.width >= minimo && caixa.height >= minimo) continue;
    if (ehLinkNoMeioDeFrase(el)) continue;

    // Centraliza para que os extremos do quadrado de 44px caibam na viewport.
    el.scrollIntoView({ block: "center", inline: "center" });
    const agora = el.getBoundingClientRect();
    const cx = agora.left + agora.width / 2;
    const cy = agora.top + agora.height / 2;
    const braco = minimo / 2 - 1;
    const parentes = familia(el);
    const ativacao = caixaDeAtivacao(parentes);

    const cobreAltura =
      ativacao.altura >= minimo ||
      (alcanca(parentes, cx, cy - braco) && alcanca(parentes, cx, cy + braco));
    const cobreLargura =
      ativacao.largura >= minimo ||
      (alcanca(parentes, cx - braco, cy) && alcanca(parentes, cx + braco, cy));

    if (cobreAltura && cobreLargura) continue;

    pequenos.push({
      seletor: descrever(el),
      largura: Math.round(ativacao.largura),
      altura: Math.round(ativacao.altura),
      alcancavel: false,
    });
  }

  document.documentElement.style.scrollBehavior = rolagemOriginal;
  window.scrollTo(0, posicaoOriginal);

  return pequenos;
}

// -----------------------------------------------------------------------------
// 3. Fonte dos campos de formulário
// -----------------------------------------------------------------------------

function medirFonteDosCampos(minimo: number) {
  const pequenos: { seletor: string; fontSize: number }[] = [];

  for (const el of document.querySelectorAll("input, select, textarea")) {
    if (el instanceof HTMLInputElement && el.type === "hidden") continue;
    const tamanho = Number.parseFloat(getComputedStyle(el).fontSize);
    if (Number.isFinite(tamanho) && tamanho < minimo) {
      const nome = el.getAttribute("name") ?? el.getAttribute("id") ?? "";
      pequenos.push({
        seletor: `${el.tagName.toLowerCase()}${nome ? `[name="${nome}"]` : ""}`,
        fontSize: tamanho,
      });
    }
  }

  return pequenos;
}

// -----------------------------------------------------------------------------
// 4. Colisão do Traço com texto
// -----------------------------------------------------------------------------

type Colisao = {
  readonly texto: string;
  readonly seletor: string;
  readonly caixa: { x1: number; x2: number; y1: number; y2: number };
  readonly ponto: { x: number; y: number };
};

/**
 * Roda no navegador. Devolve os blocos de texto que a fita atravessa AGORA.
 *
 * Como a medição funciona, e por que não é a caixa do SVG:
 *
 *   - A fita é um `<path>` dentro de um SVG `fixed` de várias telas de altura.
 *     A caixa dele cobre de x≈103 a x≈228 do viewBox, mas o traço só entra até
 *     x=103 durante a `resolucao` — usar a caixa daria colisão onde não há.
 *     Então o caminho é AMOSTRADO com `getPointAtLength` e cada ponto é levado
 *     para coordenadas de tela pela caixa do SVG (o `preserveAspectRatio` é
 *     exato, então a escala é uniforme e a conta é uma regra de três).
 *
 *   - Só a parte JÁ DESENHADA conta. `stroke-dashoffset` esconde o resto, e
 *     linha que ninguém vê não cruza leitura nenhuma.
 *
 *   - O texto é medido por `Range.getClientRects()`, não pela caixa do
 *     elemento. Um `<p>` é um bloco da largura toda mesmo quando a última
 *     linha tem três palavras; a fita passando ao lado dessas três palavras
 *     não cruza texto, e a caixa do bloco diria que sim.
 */
function medirColisaoDoTraco(entrada: { zonaLivre: string; amostras: number }) {
  const { zonaLivre, amostras } = entrada;

  const fita = document.querySelector<SVGSVGElement>("svg.traco__fita");
  const caminho = fita?.querySelector<SVGPathElement>("path");
  if (!fita || !caminho) return null;

  const vazio = { pontos: 0, colisoes: [] as Colisao[] };

  const caixaFita = fita.getBoundingClientRect();
  if (caixaFita.width === 0 || caixaFita.height === 0) return vazio;

  const viewBox = fita.viewBox.baseVal;
  const escalaX = caixaFita.width / (viewBox.width || 1);
  const escalaY = caixaFita.height / (viewBox.height || 1);

  const total = caminho.getTotalLength();
  const estilo = getComputedStyle(caminho);
  const traco = Number.parseFloat(estilo.strokeDasharray);
  const salto = Number.parseFloat(estilo.strokeDashoffset);

  // `stroke-dasharray` é resolvido em pixels de TELA (`non-scaling-stroke`);
  // `getPointAtLength` fala em unidades de viewBox. A divisão pela escala faz a
  // ponte. Sem dash declarado, o caminho está inteiro.
  let desenhado = total;
  if (Number.isFinite(traco) && traco > 0 && Number.isFinite(salto)) {
    desenhado = Math.min(total, Math.max(0, (traco - salto) / (escalaX || 1)));
  }
  if (desenhado <= 0) return vazio;

  const pontos: { x: number; y: number }[] = [];
  for (let i = 0; i <= amostras; i += 1) {
    const p = caminho.getPointAtLength((desenhado * i) / amostras);
    const x = caixaFita.left + p.x * escalaX;
    const y = caixaFita.top + p.y * escalaY;
    if (y < -4 || y > innerHeight + 4) continue;
    if (x < -4 || x > innerWidth + 4) continue;
    pontos.push({ x, y });
  }
  if (pontos.length === 0) return vazio;

  const ehOculto = (el: Element) => {
    for (let no: Element | null = el; no; no = no.parentElement) {
      const calc = getComputedStyle(no);
      if (calc.display === "none" || calc.visibility === "hidden") return true;
      if (Number.parseFloat(calc.opacity) === 0) return true;
      if (/rect\(0px[,\s]/.test(calc.clip)) return true;
      if (/^inset\(\s*50%/.test(calc.clipPath)) return true;
    }
    return false;
  };

  const descrever = (el: Element) => {
    const classes = (el.getAttribute("class") ?? "")
      .split(/\s+/)
      .filter((c) => c && !c.includes("[") && !c.includes(":"))
      .slice(0, 2);
    return (
      el.tagName.toLowerCase() +
      (classes.length ? `.${classes.join(".")}` : "")
    );
  };

  const colisoes: Colisao[] = [];
  const percorrer = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);

  for (let no = percorrer.nextNode(); no; no = percorrer.nextNode()) {
    const conteudo = (no.textContent ?? "").replace(/\s+/g, " ").trim();
    if (!conteudo) continue;

    const pai = no.parentElement;
    if (!pai) continue;
    if (pai.closest("script, style, noscript, title")) continue;
    if (pai.closest(".traco")) continue; // a própria assinatura
    if (pai.closest(zonaLivre)) continue; // o respiro: reservado à fita
    if (ehOculto(pai)) continue;

    const intervalo = document.createRange();
    intervalo.selectNodeContents(no);

    for (const linha of intervalo.getClientRects()) {
      if (linha.width < 2 || linha.height < 2) continue;
      if (linha.bottom < 0 || linha.top > innerHeight) continue;

      const atingido = pontos.find(
        (p) =>
          p.x > linha.left &&
          p.x < linha.right &&
          p.y > linha.top &&
          p.y < linha.bottom,
      );
      if (!atingido) continue;

      colisoes.push({
        texto: conteudo.slice(0, 44),
        seletor: descrever(pai),
        caixa: {
          x1: Math.round(linha.left),
          x2: Math.round(linha.right),
          y1: Math.round(linha.top),
          y2: Math.round(linha.bottom),
        },
        ponto: { x: Math.round(atingido.x), y: Math.round(atingido.y) },
      });
      break; // uma linha basta para condenar o bloco
    }

    if (colisoes.length >= 6) break;
  }

  return { pontos: pontos.length, colisoes };
}

async function rolarAte(page: Page, fracao: number) {
  await page.evaluate((f) => {
    const percurso = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo(0, Math.max(0, percurso) * f);
  }, fracao);
  await page.evaluate(
    () =>
      new Promise((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(resolve)),
      ),
  );
  // O `Reveal` das seções entra com fade; medir antes dele terminar leria
  // opacidade 0 e esconderia texto que existe.
  await page.waitForTimeout(220);
}

// -----------------------------------------------------------------------------
// Testes
// -----------------------------------------------------------------------------

test.describe("mobile", () => {
  test("há rotas para auditar", () => {
    // Guarda contra a suíte inteira "passar" varrendo uma lista vazia.
    expect(ROTAS.length).toBeGreaterThan(0);
  });

  for (const rota of ROTAS) {
    test(`layout de toque e de largura em ${rota}`, async ({
      page,
      viewport,
    }) => {
      const largura = larguraDe(viewport);
      await abrir(page, rota);

      // -----------------------------------------------------------------
      // Overflow horizontal
      // -----------------------------------------------------------------
      const overflow = await page.evaluate(medirOverflow);
      const quemEstoura = overflow.culpados
        .map((c) => `${c.seletor} vai até x=${c.direita} (${c.largura}px)`)
        .join("; ");

      expect
        .soft(
          overflow.scrollWidth,
          `overflow horizontal em ${rota} @${largura}px: o documento tem ` +
            `${overflow.scrollWidth}px numa viewport de ${overflow.clientWidth}px ` +
            `(+${overflow.estouro}px). Culpados: ${quemEstoura || "não identificados"}`,
        )
        .toBeLessThanOrEqual(overflow.clientWidth);

      // -----------------------------------------------------------------
      // Alvos de toque e zoom de campo — só onde o dedo é o ponteiro
      // -----------------------------------------------------------------
      if (largura > LARGURA_MAXIMA_DE_TOQUE) return;

      const pequenos = await page.evaluate(medirAlvosDeToque, {
        minimo: TOQUE_MINIMO,
        seletor: SELETOR_DE_ALVOS,
      });

      const listaDeAlvos = pequenos
        .map((a) => `  • ${a.seletor} — ${a.largura}×${a.altura}`)
        .join("\n");

      expect
        .soft(
          pequenos,
          `alvos de toque abaixo de ${TOQUE_MINIMO}×${TOQUE_MINIMO} em ${rota} ` +
            `@${largura}px. A medida é da caixa; a área clicável real — ` +
            `contando pseudo-elemento e <label> — também não alcança, e ` +
            `nenhum deles é link no meio de frase (exceção do WCAG ` +
            `2.5.5/2.5.8):\n${listaDeAlvos}`,
        )
        .toEqual([]);

      const camposPequenos = await page.evaluate(
        medirFonteDosCampos,
        FONTE_MINIMA_DE_CAMPO,
      );

      const listaDeCampos = camposPequenos
        .map((c) => `  • ${c.seletor} — ${c.fontSize}px`)
        .join("\n");

      expect
        .soft(
          camposPequenos,
          `campo de formulário com fonte abaixo de ${FONTE_MINIMA_DE_CAMPO}px em ` +
            `${rota} @${largura}px — o iOS dá zoom ao focar e desmonta o ` +
            `layout:\n${listaDeCampos}`,
        )
        .toEqual([]);
    });
  }

  for (const rota of ROTAS) {
    test(`o Traço não cruza texto em ${rota}`, async ({ page, viewport }) => {
      const largura = larguraDe(viewport);
      await abrir(page, rota);

      const montado = (await page.locator("svg.traco__fita").count()) > 0;
      test.skip(!montado, "O <Traco /> ainda não foi montado em app/layout.tsx.");

      // Onze paradas ao longo do documento. A faixa horizontal da fita não
      // depende do scroll — ela é função da posição AO LONGO da curva —, então
      // não é preciso varrer pixel a pixel: basta ver a página inteira passar
      // por baixo dela.
      const PARADAS = 11;
      const encontradas: string[] = [];
      let pontosVistos = 0;

      for (let i = 0; i < PARADAS; i += 1) {
        const fracao = i / (PARADAS - 1);
        await rolarAte(page, fracao);

        const medida = await page.evaluate(medirColisaoDoTraco, {
          zonaLivre: ZONA_LIVRE,
          amostras: 3000,
        });

        if (medida === null) continue;
        pontosVistos += medida.pontos;
        if (medida.colisoes.length === 0) continue;

        for (const c of medida.colisoes.slice(0, 3)) {
          encontradas.push(
            `  • scroll ${Math.round(fracao * 100)}% — ${c.seletor} ` +
              `"${c.texto}" ocupa x ${c.caixa.x1}–${c.caixa.x2}, ` +
              `y ${c.caixa.y1}–${c.caixa.y2}; a fita passa em ` +
              `(${c.ponto.x}, ${c.ponto.y})`,
          );
        }
      }

      // Guarda contra o teste passar sem ter medido nada. Se a fita mudar de
      // classe, de tag ou sair da tela, este teste vira um "passou" mudo — que
      // é pior do que não existir, porque some da lista de suspeitos.
      expect(
        pontosVistos,
        `o Traço nunca apareceu na tela em ${rota} @${largura}px: nenhuma ` +
          "amostra da fita caiu na viewport nas 11 paradas. Ou a assinatura " +
          "sumiu, ou o seletor svg.traco__fita path deixou de valer.",
      ).toBeGreaterThan(0);

      // Briefing § 5.8: "Nunca cruza texto. Nunca compete com a leitura."
      // A exceção é a zona marcada com data-traco="livre" (o RespiroTraco),
      // que não tem texto e é onde a fita pode se expandir — ver ZONA_LIVRE.
      expect(
        encontradas,
        `o Traço cruza texto em ${rota} @${largura}px, em ` +
          `${encontradas.length} pontos:\n${encontradas.slice(0, 8).join("\n")}`,
      ).toEqual([]);
    });
  }
});
