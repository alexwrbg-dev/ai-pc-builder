// Éléments d'interface partagés, sans état : utilisables côté serveur comme côté navigateur.
import PartThumb from "@/components/PartThumb";
import { amazonUrl } from "@/lib/affiliate";
import { STATUS_LABEL } from "@/lib/compatibility";
import { fullName } from "@/lib/catalog";
import { specLine } from "@/lib/describe";
import { formatEUR } from "@/lib/pricing";
import { CATEGORIES, CATEGORY_LABEL, type CompatibilityResult, type CompatibilityStatus, type Component, type PerfEstimate, type ResolvedBuild } from "@/lib/types";

const STATUS_CLASS: Record<CompatibilityStatus, string> = {
  compatible: "pill-ok", warning: "pill-warn", incompatible: "pill-err", incomplete: "",
};

export function StatusPill({ status }: { status: CompatibilityStatus }) {
  return <span className={`pill ${STATUS_CLASS[status]}`}>{STATUS_LABEL[status]}</span>;
}

export function IssueList({ compat }: { compat: CompatibilityResult }) {
  if (!compat.issues.length && !compat.missing.length) {
    return <p className="muted small">Aucune remarque : toutes les pièces vont ensemble.</p>;
  }
  return (
    <ul className="issues">
      {compat.missing.length > 0 && (
        <li className="issue info">Il manque : {compat.missing.map((s) => CATEGORY_LABEL[s].toLowerCase()).join(", ")}.</li>
      )}
      {compat.issues.map((i, k) => (
        <li key={k} className={`issue ${i.severity}`}>
          {i.message}
          <span className="fix">{i.fix}</span>
        </li>
      ))}
    </ul>
  );
}

export function BuyLink({ part, children = "Voir sur Amazon" }: { part: Component; children?: React.ReactNode }) {
  return (
    <a className="buy" href={amazonUrl(part)} target="_blank" rel="sponsored nofollow noopener noreferrer">
      {children} <span aria-hidden="true">↗</span>
    </a>
  );
}

export function PartsTable({ build, total }: { build: ResolvedBuild; total: number }) {
  return (
    <div className="table-scroll">
      <table className="parts">
        <thead>
          <tr><th>Pièce</th><th>Référence</th><th className="amount">Prix indicatif</th><th><span className="skip">Achat</span></th></tr>
        </thead>
        <tbody>
          {CATEGORIES.filter((s) => build[s]).map((s) => {
            const c = build[s]!;
            return (
              <tr key={s}>
                <td className="slot">{CATEGORY_LABEL[s]}</td>
                <td><span className="part-cell"><PartThumb part={c} className="thumb-sm" /><span><a href={`/composants/${c.id}`}>{fullName(c)}</a><span className="spec" style={{ display: "block" }}>{specLine(c)}</span></span></span></td>
                <td className="amount num">{formatEUR(c.price)}</td>
                <td className="amount"><BuyLink part={c} /></td>
              </tr>
            );
          })}
          <tr className="total"><td className="slot">Total</td><td /><td className="amount num">{formatEUR(total)}</td><td /></tr>
        </tbody>
      </table>
    </div>
  );
}

export function FpsBars({ fps }: { fps: PerfEstimate[] }) {
  if (!fps.length) return null;
  const max = Math.max(144, ...fps.map((f) => f.fps));
  return (
    <div className="fps">
      {fps.map((f) => (
        <div key={f.game} style={{ display: "contents" }}>
          <span>{f.game}</span>
          <span className="bar"><i style={{ width: `${Math.min(100, (f.fps / max) * 100)}%` }} /></span>
          <span className="num" style={{ textAlign: "right" }}>{f.fps}</span>
        </div>
      ))}
    </div>
  );
}

export function BudgetMeter({ total, budget }: { total: number; budget: number }) {
  const ratio = total / budget;
  return (
    <div className={`meter${ratio > 1 ? " over" : ratio > 0.97 ? " warn" : ""}`} role="img" aria-label={`${formatEUR(total)} sur ${formatEUR(budget)}`}>
      <i style={{ width: `${Math.min(100, ratio * 100)}%` }} />
    </div>
  );
}
