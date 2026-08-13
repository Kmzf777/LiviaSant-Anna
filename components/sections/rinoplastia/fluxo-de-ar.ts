/**
 * Geometria da ilustração do fluxo de ar — briefing § 12.3.
 *
 * "Uma ilustração vetorial abstrata do fluxo de ar pelo septo nasal — linha
 * filete no mesmo peso do logo. Essa ilustração é a peça onde a tese 'forma e
 * função' fica visível em vez de escrita."
 *
 * O desenho é esquemático, não anatômico, e por decisão explícita não tem
 * pessoa, rosto nem nada figurativo (§ 12.3 proíbe). São três famílias de
 * linha, todas com o mesmo peso de 1px:
 *
 *   ESTRUTURA   as duas paredes laterais e o septo no meio. Fecham um canal
 *               que estreita na altura da válvula nasal e reabre acima.
 *   FLUXO       seis linhas de corrente, três de cada lado. Elas se aproximam
 *               umas das outras exatamente onde o canal estreita: é assim que
 *               se desenha aceleração em diagrama de escoamento, e é a razão
 *               de a ilustração dizer alguma coisa em vez de decorar.
 *   COTA        a linha de medida horizontal na altura do estreitamento, com
 *               as marcas nas quatro interseções. É o que transforma o desenho
 *               em esquema clínico — a mesma função que a mono cumpre no texto.
 *
 * Sem movimento, deliberadamente. O orçamento de animação do § 5.7 tem três
 * itens e o Traço já é a assinatura; um segundo elemento animado disputando
 * esse papel é o que o § 15 manda refazer. Não havendo movimento, não há o que
 * desligar em `prefers-reduced-motion`.
 *
 * ## Por que a geometria mora aqui e não só no arquivo
 *
 * O asset canônico é `public/ilustracoes/fluxo-de-ar.svg`, isolado e
 * documentado para troca fácil (§ 12.3). O componente `FluxoDeAr` precisa da
 * mesma geometria inline, porque `currentColor` não atravessa um `<img>`: em
 * arquivo, a linha seria de cor fixa; inline, ela é blush sobre vinho e vinho
 * sobre areia, como o traço do logo.
 *
 * Duas cópias divergem em silêncio, então `tests/unit/procedimento.spec.tsx`
 * confere que todo `d` daqui existe literalmente no arquivo de `public`.
 */

/** Sistema de coordenadas do desenho. O septo cai em x = 320. */
export const VIEWBOX_FLUXO = "0 0 640 440";

/** Altura em que o canal estreita — a cota é desenhada nesta linha. */
export const Y_VALVULA = 250;

/**
 * Estrutura: parede esquerda, septo, parede direita.
 *
 * As paredes são espelhadas em torno de x = 320. O septo tem uma curvatura
 * mínima de propósito — uma reta perfeita pareceria régua, e o gesto do logo
 * é uma linha que nunca é reta.
 */
export const ESTRUTURA: readonly string[] = [
  // Parede esquerda: abre embaixo (narina), pinça em y=250, reabre em cima.
  "M 140 420 C 176 374, 226 340, 262 292 C 278 271, 273 240, 249 210 C 222 177, 197 130, 181 60",
  // Septo.
  "M 320 62 C 316 160, 324 260, 318 418",
  // Parede direita: o espelho exato da esquerda.
  "M 500 420 C 464 374, 414 340, 378 292 C 362 271, 367 240, 391 210 C 418 177, 443 130, 459 60",
];

/**
 * Linhas de corrente. Três à esquerda do septo, três à direita.
 *
 * O espaçamento entre elas cai de cerca de 40 unidades na base para 14 na
 * altura da válvula: é o estreitamento visto de dentro do escoamento.
 */
export const FLUXO: readonly string[] = [
  // Canal esquerdo, da mais próxima do septo à mais próxima da parede.
  "M 250 418 C 268 350, 292 300, 296 250 C 300 200, 288 140, 280 64",
  "M 210 418 C 235 350, 275 300, 282 250 C 288 195, 262 130, 248 64",
  "M 172 418 C 205 350, 260 300, 272 250 C 280 192, 236 125, 216 64",
  // Canal direito.
  "M 390 418 C 372 350, 348 300, 344 250 C 340 200, 352 140, 360 64",
  "M 430 418 C 405 350, 365 300, 358 250 C 352 195, 378 130, 392 64",
  "M 468 418 C 435 350, 380 300, 368 250 C 360 192, 404 125, 424 64",
];

/**
 * Sentido do escoamento: uma cheuronete por canal, apontando para cima.
 *
 * Sem elas o desenho lê como um feixe de linhas convergindo, que é bonito e
 * não diz nada. Com elas, lê como ar entrando. Ficam na parte larga, embaixo,
 * onde há espaço — no estreitamento virariam sujeira.
 */
export const DIRECAO: readonly string[] = [
  "M 226 361 L 235 350 L 244 361",
  "M 396 361 L 405 350 L 414 361",
];

/**
 * Cota do estreitamento: a linha de medida e as três marcas verticais nas
 * interseções com parede e septo.
 */
export const COTA: readonly string[] = [
  "M 120 250 L 520 250",
  "M 268 242 L 268 258",
  "M 320 242 L 320 258",
  "M 372 242 L 372 258",
];
