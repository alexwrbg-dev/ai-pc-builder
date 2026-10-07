import { notFound } from "next/navigation";
import PartViewer from "@/components/PartViewer";
import { BuyLink } from "@/components/ui";
import { CATALOG, PRICE_DATE, byId, encodeSelection, fullName } from "@/lib/catalog";
import { specLine, specRows } from "@/lib/describe";
import { formatEUR } from "@/lib/pricing";
import { CATEGORY_LABEL } from "@/lib/types";

export function generateStaticParams() {
  return CATALOG.map((c) => ({ id: c.id }));
}

export function generateMetadata({ params }: { params: { id: string } }) {
  const c = byId(params.id);
  return c ? { title: fullName(c), description: `${CATEGORY_LABEL[c.category]} — ${specLine(c)}. Prix indicatif ${formatEUR(c.price)}.` } : { title: "Pièce introuvable" };
}

export default function Page({ params }: { params: { id: string } }) {
  const c = byId(params.id);
  if (!c) notFound();
  return (
    <>
      <div className="page-head">
        <a className="label" href={`/composants?c=${c.category}`}>← {CATEGORY_LABEL[c.category]}</a>
        <h2>{fullName(c)}</h2>
        <p className="lede">{specLine(c)}</p>
      </div>
      <div className="part-page">
        {c.photo
          // eslint-disable-next-line @next/next/no-img-element
          ? <img className="part-photo" src={c.photo} alt={fullName(c)} />
          : <PartViewer id={c.id} />}
        <div className="stack">
          <div className="sheet stack">
            <div className="sheet-head" style={{ marginBottom: 0 }}>
              <span className="label">Prix indicatif</span>
              <span className="label">relevé le {new Date(PRICE_DATE).toLocaleDateString("fr-FR")}</span>
            </div>
            <span className="price price-lg">{formatEUR(c.price)}</span>
            <div className="chips">
              <a className="btn" href={`/builder?c=${encodeURIComponent(encodeSelection({ [c.category]: c.id }))}`}>Partir de cette pièce <span className="arrow" aria-hidden="true">→</span></a>
              <BuyLink part={c} />
            </div>
            <span className="small muted">Le prix affiché chez le marchand fait foi.</span>
          </div>
          <div className="sheet">
            <div className="sheet-head">
              <span className="label">Fiche technique</span>
              {c.confidence === "VERIFIED" ? <span className="pill pill-ok">fiche relue</span> : <span className="pill pill-plain">specs publiques</span>}
            </div>
            <table className="parts">
              <tbody>
                {specRows(c).map(([label, value]) => (
                  <tr key={label}><td className="slot">{label}</td><td>{value}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
