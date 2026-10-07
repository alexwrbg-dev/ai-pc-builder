// Génère les images des pièces à partir du rendu 3D du site.
//
//   1. lancer le site :            npm run build ; npm start
//   2. dans un autre terminal :    node scripts/vignettes.mjs http://localhost:3000
//
// Demande Playwright (npm install --no-save playwright ; npx playwright install chromium).
// Écrit une planche d'images par catégorie dans public/parts/ et l'index dans src/data/thumbs.ts.
import { writeFileSync, mkdirSync } from "node:fs";
import { chromium } from "playwright";

const base = process.argv[2] ?? "http://localhost:3000";
const COLS = 8, W = 240, H = 180;
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || undefined,
  args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"],
});
const { data } = await (await fetch(`${base}/api/components`)).json();
const byCategory = {};
for (const c of data) (byCategory[c.category] ??= []).push(c.id);

// Plusieurs onglets photographient en parallèle, chacun sa file de pièces.
const WORKERS = Number(process.env.WORKERS ?? 3);
// ONLY=CPU,PSU ne refait que ces catégories ; les autres planches sont conservées.
const only = process.env.ONLY ? process.env.ONLY.split(",") : Object.keys(byCategory);
const queue = data.filter((c) => only.includes(c.category)).map((c) => c.id);
const shots = {};
let done = 0;
await Promise.all(Array.from({ length: WORKERS }, async () => {
  const page = await (await browser.newContext({ viewport: { width: 900, height: 700 }, deviceScaleFactor: 1 })).newPage();
  await page.goto(`${base}/atelier/vignette?rendu=haut`, { waitUntil: "networkidle" });
  for (let id = queue.shift(); id; id = queue.shift()) {
    await page.evaluate((h) => { window.location.hash = h; }, id);
    await page.waitForFunction((want) => document.title === `ok:${want}`, id, { timeout: 120000 });
    await page.waitForTimeout(200);
    shots[id] = (await page.locator("#vignette canvas").screenshot({ type: "png" })).toString("base64");
    done += 1;
    if (done % 20 === 0) console.log(`${done} / ${queue.length + done}`);
  }
  await page.close();
}));

// Assemblage : le navigateur compose lui-même chaque planche, ce qui évite toute dépendance d'image.
mkdirSync("public/parts", { recursive: true });
const index = {}, rowsOf = {};
for (const [category, ids] of Object.entries(byCategory)) {
  const rows = Math.ceil(ids.length / COLS);
  rowsOf[category] = rows;
  ids.forEach((id, i) => { index[id] = [i % COLS, Math.floor(i / COLS)]; });
  if (!only.includes(category)) continue;
  const html = `<body style="margin:0;background:#071120"><div style="display:grid;grid-template-columns:repeat(${COLS},${W}px);width:${COLS * W}px">${ids
    .map((id) => `<img src="data:image/png;base64,${shots[id]}" width="${W}" height="${H}" style="display:block">`).join("")}</div></body>`;
  const sheet = await browser.newPage({ viewport: { width: COLS * W, height: rows * H } });
  await sheet.setContent(html, { waitUntil: "load" });
  writeFileSync(`public/parts/${category}.jpg`, await sheet.screenshot({ type: "jpeg", quality: 84 }));
  await sheet.close();
}
await browser.close();

writeFileSync("src/data/thumbs.ts", `// Fichier généré par scripts/vignettes.mjs — ne pas modifier à la main.
// Pour chaque pièce : sa position (colonne, ligne) dans la planche d'images de sa catégorie.
export const THUMB_COLS = ${COLS};
export const THUMB_ROWS: Record<string, number> = ${JSON.stringify(rowsOf)};
export const THUMBS: Record<string, [col: number, row: number]> = ${JSON.stringify(index)};
`);
console.log(`${data.length} vignettes, ${Object.keys(byCategory).length} planches.`);
