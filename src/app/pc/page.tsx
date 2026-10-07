import { GUIDES } from "@/lib/guides";

export const metadata = { title: "Guides par budget" };

export default function Page() {
  return (
    <>
      <div className="page-head">
        <span className="label"><b>Planche 05</b> — Guides</span>
        <h2>Ce qu&apos;on peut monter, budget par budget</h2>
        <p className="lede">Chaque guide est recalculé à partir du catalogue : quand les prix changent, les configurations changent avec eux.</p>
      </div>
      <div className="grid3">
        {GUIDES.map((g) => (
          <a key={g.slug} className="sheet step" href={`/pc/${g.slug}`}>
            <span className="label">{g.kicker}</span>
            <h3>{g.title}</h3>
            <span className="muted small">{g.intro}</span>
            <span>Voir les configurations →</span>
          </a>
        ))}
      </div>
    </>
  );
}
