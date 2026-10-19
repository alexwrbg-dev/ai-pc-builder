"use client";
// Configurateur : chaque changement de pièce est revérifié par le moteur, et redessiné en 3D, dans le navigateur.
import { useEffect, useMemo, useState } from "react";
import BuildViewer from "@/components/BuildViewer";
import Money from "@/components/Money";
import { PartPrice } from "@/components/PartPrice";
import { useLiveTotal } from "@/lib/amazon-client";
import PartThumb from "@/components/PartThumb";
import { BudgetMeter, BuyLink, FpsBars, IssueList, StatusPill } from "@/components/ui";
import { PRICE_DATE, byCategory, decodeSelection, encodeSelection, fullName, resolveBuild } from "@/lib/catalog";
import { checkBuild, recommendedPsuW } from "@/lib/compatibility";
import { specLine } from "@/lib/describe";
import { estimateFps } from "@/lib/perf";
import { formatEUR } from "@/lib/pricing";
import { CATEGORIES, CATEGORY_LABEL, type BuildSelection, type Component, type ComponentCategory, type Resolution } from "@/lib/types";

/** Configuration d'exemple, saine, affichée quand on arrive sans lien de partage. */
const STARTER: BuildSelection = {
  CPU: "cpu-r5-7500f", GPU: "gpu-msi-5070-ventus2x", MOTHERBOARD: "mb-gb-b650-gaming-x-ax-v2", RAM: "ram-vengeance-d5-16",
  SSD: "ssd-nv3-1tb", PSU: "psu-corsair-rm750e", CASE: "case-corsair-4000d-rs-argb", COOLER: "cool-bq-pure-rock-pro-3-black",
};

const RESOLUTIONS: Resolution[] = ["1080p", "1440p", "4K"];

function Picker({ slot, sel, onPick, onClose }: { slot: ComponentCategory; sel: BuildSelection; onPick: (id: string | null) => void; onClose: () => void }) {
  const [q, setQ] = useState("");
  const [onlyOk, setOnlyOk] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Pour chaque candidat, on simule le remplacement et on regarde si le moteur lève une erreur qui le concerne.
  const options = useMemo(() => {
    const { build } = resolveBuild(sel);
    return (byCategory(slot) as Component[])
      .map((c) => {
        const blocker = checkBuild({ ...build, [slot]: c }).issues.find((i) => i.severity === "error" && i.slots.includes(slot));
        return { c, blocker: blocker?.message ?? null };
      })
      .sort((a, b) => a.c.price - b.c.price);
  }, [slot, sel]);

  const needle = q.trim().toLowerCase();
  const shown = options.filter((o) => (!onlyOk || !o.blocker) && (!needle || `${fullName(o.c)} ${specLine(o.c)}`.toLowerCase().includes(needle)));

  return (
    <>
      <div className="drawer-back" onClick={onClose} />
      <aside className="drawer" role="dialog" aria-modal="true" aria-label={`Choisir : ${CATEGORY_LABEL[slot]}`}>
        <div className="drawer-head">
          <div><span className="label">Choisir</span><h3>{CATEGORY_LABEL[slot]}</h3></div>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Fermer">×</button>
        </div>
        <div className="drawer-tools">
          <input className="input" autoFocus placeholder="Filtrer : 5070, blanc, AM5…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Filtrer la liste" />
          <button type="button" className="toggle" aria-pressed={onlyOk} onClick={() => setOnlyOk((v) => !v)} style={{ whiteSpace: "nowrap" }}>Compatibles</button>
        </div>
        <div className="drawer-list">
          {sel[slot] && <button type="button" className="option option-wide" onClick={() => onPick(null)}><span className="muted">Retirer cette pièce</span></button>}
          {shown.map(({ c, blocker }) => (
            <button key={c.id} type="button" className={`option${blocker ? " blocked" : ""}`} aria-pressed={sel[slot] === c.id} onClick={() => onPick(c.id)}>
              <PartThumb part={c} />
              <span>{fullName(c)}</span>
              <PartPrice part={c} />
              <span className="spec">{specLine(c)}</span>
              {blocker && <span className="why">{blocker}</span>}
            </button>
          ))}
          {!shown.length && <p className="muted small">Aucune pièce ne correspond.</p>}
        </div>
      </aside>
    </>
  );
}

export default function Builder() {
  const [sel, setSel] = useState<BuildSelection>(STARTER);
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState<ComponentCategory | null>(null);
  const [budget, setBudget] = useState("");
  const [res, setRes] = useState<Resolution>("1440p");
  const [copied, setCopied] = useState(false);

  // Lecture du lien de partage, puis mise à jour de l'adresse à chaque changement.
  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get("c");
    const fromLink = decodeSelection(code);
    if (Object.keys(fromLink).length) setSel(fromLink);
    setReady(true);
  }, []);
  useEffect(() => {
    if (!ready) return;
    window.history.replaceState(null, "", `/builder?c=${encodeURIComponent(encodeSelection(sel))}`);
  }, [sel, ready]);

  const { build, unknown } = useMemo(() => resolveBuild(sel), [sel]);
  const compat = useMemo(() => checkBuild(build, unknown), [build, unknown]);
  const chosen = useMemo(() => CATEGORIES.flatMap((slot) => (build[slot] ? [build[slot]!] : [])), [build]);
  const { total, live: liveCount } = useLiveTotal(chosen);
  const fps = useMemo(() => estimateFps(build, res), [build, res]);
  const budgetN = Number(budget) > 0 ? Number(budget) : null;

  const slotState = (slot: ComponentCategory) => {
    const worst = compat.issues.filter((i) => i.slots.includes(slot) && i.severity !== "info").map((i) => i.severity);
    return worst.includes("error") ? "error" : worst.includes("warning") ? "warning" : build[slot] ? "ok" : "";
  };

  async function share() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="builder">
      <div className="side">
        <div className="sheet">
          <div className="sheet-head"><span className="label"><b>Nomenclature</b></span><StatusPill status={compat.status} /></div>
          <div className="slots">
            {CATEGORIES.map((slot) => {
              const c = build[slot];
              return (
                <button key={slot} type="button" className={`slot-row ${slotState(slot)}`} onClick={() => setOpen(slot)}>
                  <span className="mark" />
                  {c ? <PartThumb part={c} className="thumb-sm" /> : <span className="thumb thumb-sm thumb-empty" aria-hidden="true" />}
                  <span style={{ minWidth: 0 }}>
                    <span className="label">{CATEGORY_LABEL[slot]}</span>
                    <span className={`name${c ? "" : " empty"}`}>{c ? fullName(c) : "À choisir"}</span>
                  </span>
                  <span className="amount">{c ? <PartPrice part={c} className="" /> : "+"}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="sheet stack">
          <div className="sheet-head" style={{ marginBottom: 0 }}><span className="label">Total</span><span className="label">{liveCount ? `${liveCount} prix Amazon en direct` : `indicatif, relevé le ${new Date(PRICE_DATE).toLocaleDateString("fr-FR")}`}</span></div>
          <Money value={total} className="price price-lg" />
          <label className="stack" style={{ gap: 6 }}>
            <span className="label">Mon budget (facultatif)</span>
            <input className="input" inputMode="numeric" placeholder="1500" value={budget} onChange={(e) => setBudget(e.target.value.replace(/[^\d]/g, "").slice(0, 5))} />
          </label>
          {budgetN && (
            <>
              <BudgetMeter total={total} budget={budgetN} />
              <span className="small muted">{total <= budgetN ? `Il reste ${formatEUR(budgetN - total)}.` : `Dépassement de ${formatEUR(total - budgetN)}.`}</span>
            </>
          )}
          {compat.estimatedPeakW > 0 && (
            <span className="small muted">Consommation en pointe estimée : <span className="num">{compat.estimatedPeakW} W</span> · alimentation conseillée : <span className="num">{recommendedPsuW(build)} W</span></span>
          )}
          <div className="chips">
            <button type="button" className="btn-ghost btn-sm" onClick={share}>{copied ? "Lien copié" : "Copier le lien de cette config"}</button>
          </div>
        </div>
      </div>

      <div className="main stack">
        <BuildViewer build={build} issues={compat.issues} tall />
        <div className="grid3">
          <div className="sheet">
            <div className="sheet-head"><span className="label">Verdict du moteur</span></div>
            <IssueList compat={compat} />
          </div>

          <div className="sheet stack">
            <div className="sheet-head" style={{ marginBottom: 0 }}>
              <span className="label">Images/s estimées</span>
              <span className="seg" role="group" aria-label="Définition d'écran">
                {RESOLUTIONS.map((r) => <button key={r} type="button" aria-pressed={res === r} onClick={() => setRes(r)}>{r}</button>)}
              </span>
            </div>
            {fps.length > 0 ? <FpsBars fps={fps} /> : <p className="small muted">Choisis un processeur et une carte graphique.</p>}
            <span className="small muted">Estimation, pas une mesure.</span>
          </div>

          <div className="sheet">
            <div className="sheet-head"><span className="label">Acheter les pièces</span></div>
            <ul className="notes">
              {CATEGORIES.filter((s) => build[s]).map((s) => (
                <li key={s}><BuyLink part={build[s]!}>{fullName(build[s]!)}</BuyLink></li>
              ))}
            </ul>
            <p className="small muted" style={{ marginTop: 12 }}>Le prix affiché chez le marchand fait foi : les nôtres sont indicatifs.</p>
          </div>
        </div>
      </div>

      {open && (
        <Picker
          slot={open} sel={sel} onClose={() => setOpen(null)}
          onPick={(id) => {
            setSel((s) => { const n = { ...s }; if (id) n[open] = id; else delete n[open]; return n; });
            setOpen(null);
          }}
        />
      )}
    </div>
  );
}
