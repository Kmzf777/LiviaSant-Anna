/**
 * Baixa a Switzer variável da Fontshare para app/fonts/.
 *
 * A Switzer não está no Google Fonts, então não dá para usar next/font/google.
 * Auto-hospedamos com next/font/local: o runtime não faz nenhuma requisição
 * externa de fonte e não há flash de fonte trocada vindo de CDN de terceiro.
 *
 * O .woff2 é commitado. Este script existe para que o download seja
 * reproduzível e auditável, não para rodar no build.
 *
 *   pnpm fontes
 *
 * `f[]=switzer@1` é a variável romana (peso 100–900). `@2` é a itálica, que
 * não usamos: nesta direção o itálico não aparece — fato vai em mono, ênfase
 * vem de superfície. Se um dia precisar, troque VARIANTES abaixo.
 */

import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), "..");
const DESTINO = join(RAIZ, "app", "fonts");

const VARIANTES = [{ query: "switzer@1", arquivo: "Switzer-Variable.woff2" }];

async function urlDoWoff2(query) {
  const resposta = await fetch(`https://api.fontshare.com/v2/css?f[]=${query}`);
  if (!resposta.ok) {
    throw new Error(`Fontshare respondeu ${resposta.status} para ${query}`);
  }

  const css = await resposta.text();
  const match = css.match(/url\('(\/\/[^']+\.woff2)'\)\s*format\('woff2'\)/);
  if (!match?.[1]) {
    throw new Error(`Não achei um .woff2 no CSS da Fontshare para ${query}`);
  }

  return `https:${match[1]}`;
}

async function baixar({ query, arquivo }) {
  const url = await urlDoWoff2(query);
  const resposta = await fetch(url);
  if (!resposta.ok) {
    throw new Error(`Download de ${arquivo} falhou: ${resposta.status}`);
  }

  const bytes = Buffer.from(await resposta.arrayBuffer());
  await writeFile(join(DESTINO, arquivo), bytes);

  const kb = (bytes.byteLength / 1024).toFixed(1);
  console.log(`  ${arquivo}  ${kb} kB`);
}

await mkdir(DESTINO, { recursive: true });
console.log("Baixando Switzer da Fontshare:");

for (const variante of VARIANTES) {
  await baixar(variante);
}

console.log("Pronto. Os arquivos devem ser commitados.");
