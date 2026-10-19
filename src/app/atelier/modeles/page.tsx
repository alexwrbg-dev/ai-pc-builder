// Page d'atelier : où en sont les modèles 3D officiels, et les dimensions que chaque fichier doit respecter.
// Non référencée (robots.txt exclut /atelier/).
import type { Metadata } from "next";
import { MODELS } from "@/data/models";
import { CATALOG, fullName } from "@/lib/catalog";
import { CATEGORIES, CATEGORY_LABEL, type Component } from "@/lib/types";

export const metadata: Metadata = { title: "Atelier : modèles 3D officiels", robots: { index: false } };

/** Dimensions de l'emplacement dans la scène (longueur × hauteur × profondeur, en mm). */
function slot(c: Component): string {
  switch (c.category) {
    case "GPU": return `${c.specs.lengthMM} × ${c.specs.thicknessMM} × ${c.specs.heightMM}`;
    case "CASE": return `${c.specs.dims.d} × ${c.specs.dims.h} × ${c.specs.dims.w}`;
    case "RAM": return `7 × 133 × ${c.specs.heightMM} (une barrette)`;
    case "PSU": return `${c.specs.lengthMM} × 86 × 150`;
    case "COOLER": return c.specs.kind === "AIR" ? `hauteur ${c.specs.heightMM}` : `pompe 74 × 74 × 48 · radiateur ${(c.specs.radiatorMM ?? 240) + 38}`;
    case "MOTHERBOARD": return c.specs.formFactor;
    case "SSD": return c.specs.interface === "NVMe" ? "80 × 22 × 6" : "100 × 7 × 70";
    case "CPU": return "44 × 44 × 8";
  }
}

export default function Page() {
  const count = Object.keys(MODELS).length;
  return (
    <div className="stack" style={{ paddingBottom: 48 }}>
      <div className="page-head">
        <span className="label">Atelier</span>
        <h2>Modèles 3D officiels · {count} / {CATALOG.length}</h2>
        <p className="lede">
          Dépose un fichier <code>.glb</code> par pièce dans <code>public/models</code>, nommé avec l&apos;identifiant ci-dessous,
          puis relance <code>npm run dev</code>. Ouvre la fiche de la pièce pour vérifier son orientation ; corrige-la au besoin
          dans <code>public/models/reglages.json</code>. Seulement des modèles que l&apos;on a le droit d&apos;afficher (voir <code>MODELES_3D.md</code>).
        </p>
      </div>
      {CATEGORIES.map((cat) => (
        <div key={cat} className="sheet">
          <div className="sheet-head"><span className="label">{CATEGORY_LABEL[cat]}</span></div>
          <div className="table-scroll">
            <table className="parts">
              <thead><tr><th>Pièce</th><th>Fichier attendu</th><th>Emplacement (mm)</th><th>État</th></tr></thead>
              <tbody>
                {CATALOG.filter((c) => c.category === cat).map((c) => {
                  const m = MODELS[c.id];
                  return (
                    <tr key={c.id}>
                      <td><a href={`/composants/${c.id}`}>{fullName(c)}</a></td>
                      <td><code className="small">{c.id}.glb{c.category === "COOLER" && c.specs.kind === "AIO" ? ` (+ ${c.id}-radiateur.glb)` : ""}</code></td>
                      <td className="small">{slot(c)}</td>
                      <td>{m ? <span className="pill pill-ok">{m.radiator && m.file ? "pompe + radiateur" : m.radiator ? "radiateur" : "modèle"}{m.rotation ? " · réglé" : ""}</span> : <span className="pill pill-plain">rendu générique</span>}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}
