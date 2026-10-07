import PartThumb from "@/components/PartThumb";
import { PRICE_DATE, byCategory, fullName } from "@/lib/catalog";
import { specLine } from "@/lib/describe";
import { formatEUR } from "@/lib/pricing";
import { CATEGORIES, CATEGORY_LABEL, type Component, type ComponentCategory } from "@/lib/types";

export const metadata = {
  title: "Catalogue des composants",
  description: "Processeurs, cartes graphiques, cartes mères, mémoire, stockage, alimentations, boîtiers et refroidissement actuellement en vente, avec prix indicatifs.",
};

export default function Page({ searchParams }: { searchParams: { c?: string } }) {
  const category: ComponentCategory = CATEGORIES.includes(searchParams.c as ComponentCategory) ? (searchParams.c as ComponentCategory) : "GPU";
  const items = (byCategory(category) as Component[]).sort((a, b) => a.price - b.price);
  return (
    <>
      <div className="page-head">
        <span className="label"><b>Planche 04</b> — Catalogue</span>
        <h2>{CATEGORY_LABEL[category]} · {items.length} références</h2>
        <p className="lede">Prix indicatifs relevés le {new Date(PRICE_DATE).toLocaleDateString("fr-FR")}. Le prix affiché chez le marchand fait foi.</p>
        <nav className="tabs" aria-label="Catégories">
          {CATEGORIES.map((c) => (
            <a key={c} className="tab" href={`/composants?c=${c}`} aria-current={c === category ? "page" : undefined}>{CATEGORY_LABEL[c]}</a>
          ))}
        </nav>
      </div>
      <div className="cards">
        {items.map((c) => (
          <a key={c.id} className="sheet part-card" href={`/composants/${c.id}`}>
            <PartThumb part={c} className="thumb-lg" />
            <span className="name">{fullName(c)}</span>
            <span className="spec small muted">{specLine(c)}</span>
            <span className="row">
              <span className="num">{formatEUR(c.price)}</span>
              {c.confidence === "VERIFIED" ? <span className="pill pill-ok">relue</span> : <span className="pill pill-plain">specs publiques</span>}
            </span>
          </a>
        ))}
      </div>
      <p className="small muted" style={{ marginTop: 14, maxWidth: "80ch" }}>
        « Relue » : dimensions et connecteurs vérifiés sur la documentation du fabricant ou d&apos;un revendeur.
        « Specs publiques » : caractéristiques connues, pas encore relues une par une. Les images sont des rendus 3D génériques, pas des photos des produits.
      </p>
    </>
  );
}
