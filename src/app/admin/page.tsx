import { CATALOG, PRICE_DATE } from "@/lib/catalog";
import { CATEGORIES, CATEGORY_LABEL } from "@/lib/types";

export const metadata = { title: "Administration", robots: { index: false } };

// Accès réservé au rôle ADMIN (voir src/middleware.ts). Lecture seule pour l'instant.
export default function Page() {
  return (
    <>
      <div className="page-head"><span className="label"><b>Administration</b></span><h2>État du catalogue</h2></div>
      <div className="grid3">
        {CATEGORIES.map((c) => (
          <div key={c} className="sheet step">
            <span className="label">{CATEGORY_LABEL[c]}</span>
            <span className="price">{CATALOG.filter((x) => x.category === c).length}</span>
          </div>
        ))}
        <div className="sheet step"><span className="label">Relevé des prix</span><span className="price">{new Date(PRICE_DATE).toLocaleDateString("fr-FR")}</span></div>
      </div>
    </>
  );
}
