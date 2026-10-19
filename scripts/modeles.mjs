// Recense les modèles 3D officiels déposés dans public/models et écrit src/data/models.ts.
// Lancé tout seul avant `npm run dev` et `npm run build` (scripts predev / prebuild de package.json).
//
// Nommage : public/models/<identifiant de la pièce>.glb, par exemple gpu-msi-5070ti-gaming-trio.glb
// (l'identifiant figure dans l'adresse de la fiche : /composants/<identifiant>).
// Watercooling : <id>.glb pour le bloc pompe, <id>-radiateur.glb pour le radiateur avec ses ventilateurs.
// Réglages facultatifs dans public/models/reglages.json : { "<id>": { "rotation": [x, y, z] } } en degrés,
// pour corriger l'orientation quand l'orientation automatique se trompe.
import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const dir = join(root, "public", "models");
const files = existsSync(dir) ? readdirSync(dir).filter((f) => f.toLowerCase().endsWith(".glb")) : [];
let settings = {};
const settingsFile = join(dir, "reglages.json");
if (existsSync(settingsFile)) {
  try { settings = JSON.parse(readFileSync(settingsFile, "utf8")); } catch (e) { console.warn("reglages.json illisible :", e.message); }
}

const entries = {};
for (const f of files.sort()) {
  const base = f.slice(0, -4);
  const radiator = base.endsWith("-radiateur");
  const id = radiator ? base.slice(0, -"-radiateur".length) : base;
  entries[id] ??= {};
  entries[id][radiator ? "radiator" : "file"] = `/models/${f}`;
}
for (const [id, s] of Object.entries(settings)) {
  if (!entries[id]) continue;
  if (Array.isArray(s.rotation) && s.rotation.length === 3) entries[id].rotation = s.rotation.map(Number);
  if (Array.isArray(s.rotationRadiateur) && s.rotationRadiateur.length === 3) entries[id].radiatorRotation = s.rotationRadiateur.map(Number);
}

const out = `// Généré par scripts/modeles.mjs à partir de public/models : ne pas modifier à la main.
export interface OfficialModel {
  /** Fichier .glb de la pièce (ou du bloc pompe d'un watercooling). */
  file?: string;
  /** Watercooling : fichier .glb du radiateur. */
  radiator?: string;
  /** Rotation forcée en degrés (x, y, z) ; sinon l'orientation est déduite des proportions. */
  rotation?: [number, number, number];
  radiatorRotation?: [number, number, number];
}

export const MODELS: Record<string, OfficialModel> = ${JSON.stringify(entries, null, 2)};
`;
writeFileSync(join(root, "src", "data", "models.ts"), out);
console.log(`${Object.keys(entries).length} modèle(s) 3D officiel(s) recensé(s) dans public/models.`);
