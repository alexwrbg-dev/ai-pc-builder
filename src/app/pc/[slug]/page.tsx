import { notFound } from "next/navigation";
import { BudgetMeter, FpsBars, PartsTable, StatusPill } from "@/components/ui";
import { PRICE_DATE, encodeSelection, resolveBuild } from "@/lib/catalog";
import { GUIDES } from "@/lib/guides";
import { PROFILE_INFO, recommendAll } from "@/lib/optimizer";
import { formatEUR } from "@/lib/pricing";

export function generateStaticParams() {
  return GUIDES.map((g) => ({ slug: g.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const g = GUIDES.find((x) => x.slug === params.slug);
  return g ? { title: g.title, description: g.intro } : { title: "Guide introuvable" };
}

export default function Page({ params }: { params: { slug: string } }) {
  const guide = GUIDES.find((g) => g.slug === params.slug);
  if (!guide) notFound();
  const builds = recommendAll(guide.requirements);
  return (
    <>
      <div className="page-head">
        <span className="label"><b>Guide</b> — {guide.kicker}</span>
        <h2>{guide.title}</h2>
        <p className="lede">{guide.intro}</p>
        <p className="small muted">Configurations calculées aux prix relevés le {new Date(PRICE_DATE).toLocaleDateString("fr-FR")}.</p>
        <div><a className="btn" href={`/?q=${encodeURIComponent(guide.prompt)}`}>Adapter à mon besoin <span className="arrow" aria-hidden="true">→</span></a></div>
      </div>
      <div className="stack" style={{ gap: 24 }}>
        {builds.map((b, k) => {
          const { build } = resolveBuild(b.selection);
          return (
            <article key={b.profile} className="sheet stack">
              <div className="sheet-head" style={{ marginBottom: 0 }}>
                <span className="label"><b>{String.fromCharCode(65 + k)}</b> — {PROFILE_INFO[b.profile].title}</span>
                <StatusPill status={b.compat.status} />
              </div>
              <div className="profile-top">
                <span className="price">{formatEUR(b.total)}</span>
                <a className="btn-ghost btn-sm" href={`/builder?c=${encodeURIComponent(encodeSelection(b.selection))}`}>Voir en 3D et modifier →</a>
              </div>
              <BudgetMeter total={b.total} budget={b.budget} />
              <p className="muted">{PROFILE_INFO[b.profile].tagline}</p>
              <div className="grid2">
                <PartsTable build={build} total={b.total} />
                <div className="stack">
                  <ul className="notes">{b.notes.map((n) => <li key={n}>{n}</li>)}</ul>
                  {b.fps.length > 0 && (
                    <>
                      <span className="label">Images par seconde estimées — {b.resolution}</span>
                      <FpsBars fps={b.fps} />
                      <span className="small muted">Estimation, pas une mesure.</span>
                    </>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </>
  );
}
