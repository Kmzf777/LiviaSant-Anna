/**
 * Reduz os arquivos-fonte das fotos hospitalares.
 *
 * Os originais vieram do celular em 3024×4032, ~1 MB cada. O `next/image` gera
 * as variantes que o navegador consome, então o tamanho do fonte não afeta o
 * que o visitante baixa — mas o arquivo continua acessível pela URL crua em
 * `/public/fotos/...`, no tamanho em que foi commitado. Isso importa por dois
 * motivos:
 *
 *   1. PRIVACIDADE. Em `centro-cirurgico-equipe-corredor` há um crachá com foto
 *      e nome de uma colega, legíveis em 3024px. Na tela nunca passa de ~500px
 *      e é ilegível; no arquivo original, não. CSS não resolve isso — só
 *      resolver no pixel resolve.
 *
 *   2. PESO DO REPOSITÓRIO. Cinco fotos de 1 MB que nunca renderizam acima de
 *      ~1100px são 4 MB carregados para sempre no histórico do git.
 *
 * 1600px na maior aresta dá folga sobre o maior uso real (≈550 CSS px × 2 de
 * densidade) sem guardar detalhe que ninguém vê e que alguém não quer publicar.
 *
 *   node scripts/reduzir-fotos.mjs [--verificar]
 */

import { readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const sharp = require("sharp");

const PASTA = join(import.meta.dirname, "..", "public", "fotos");
const MAIOR_ARESTA = 1600;
const QUALIDADE = 82;

/** Só as fotos de ambiente hospitalar. Os retratos já vieram no tamanho certo. */
const ALVO = /^centro-cirurgico-.*\.jpeg$/;

const apenasVerificar = process.argv.includes("--verificar");
const pendentes = [];

for (const nome of readdirSync(PASTA).sort()) {
  if (!ALVO.test(nome)) continue;

  const caminho = join(PASTA, nome);
  const antes = statSync(caminho).size;
  const meta = await sharp(caminho).metadata();
  const maior = Math.max(meta.width ?? 0, meta.height ?? 0);

  if (maior <= MAIOR_ARESTA) {
    console.log(`  ok    ${nome}  ${meta.width}×${meta.height}`);
    continue;
  }

  if (apenasVerificar) {
    pendentes.push(`${nome} (${meta.width}×${meta.height})`);
    continue;
  }

  // Grava num temporário: sharp não pode ler e escrever o mesmo arquivo.
  const temporario = `${caminho}.tmp`;
  await sharp(caminho)
    .rotate() // aplica a orientação do EXIF antes de redimensionar
    .resize({ width: MAIOR_ARESTA, height: MAIOR_ARESTA, fit: "inside" })
    .jpeg({ quality: QUALIDADE, mozjpeg: true })
    .toFile(temporario);

  const { renameSync } = await import("node:fs");
  renameSync(temporario, caminho);

  const depois = statSync(caminho).size;
  const novo = await sharp(caminho).metadata();
  console.log(
    `  ↓     ${nome}  ${meta.width}×${meta.height} → ${novo.width}×${novo.height}` +
      `  ${(antes / 1024).toFixed(0)} kB → ${(depois / 1024).toFixed(0)} kB`,
  );
}

if (apenasVerificar && pendentes.length > 0) {
  console.error(
    `\nFALHA  ${pendentes.length} foto(s) acima de ${MAIOR_ARESTA}px:\n` +
      pendentes.map((p) => `  ${p}`).join("\n") +
      `\n\nRode: node scripts/reduzir-fotos.mjs\n`,
  );
  process.exit(1);
}

console.log("\npronto");
