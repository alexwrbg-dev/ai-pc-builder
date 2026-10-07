"use client";
import { Suspense, lazy, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

const Viewer3D = lazy(() => import("@/components/Viewer3D"));
const ChatBox = lazy(() => import("@/components/ChatBox"));

interface Comp { id: string; category: string; brand: string; model: string; specs: Record<string, unknown> }
type Sel = Record<string, string>;

const CATS = ["CPU", "GPU", "MOTHERBOARD", "RAM", "SSD_NVME", "PSU", "CASE", "CPU_COOLER", "AIO"];

export default function BuilderClient() {
  const params = useSearchParams();
  const [catalog, setCatalog] = useState<Comp[]>([]);
  const [sel, setSel] = useState<Sel>({ CPU: "cpu-r5-7600", GPU: "gpu-rtx4070s", MOTHERBOARD: "mb-b650", RAM: "ram-32d5", SSD_NVME: "ssd-1tb", PSU: "psu-650", CASE: "case-nzxt", CPU_COOLER: "cooler-ak400" });
  const [compat, setCompat] = useState<{ status: string; issues: { severity: string; message: string; fix: string }[] } | null>(null);
  const [price, setPrice] = useState<{ total: number | null } | null>(null);
  const [color, setColor] = useState("#22d3ee");

  useEffect(() => {
    fetch("/api/components").then((r) => r.json()).then((j) => setCatalog(j.data ?? []));
    const s = params.get("s");
    if (s) { try { setSel((prev) => ({ ...prev, ...JSON.parse(s) })); } catch {} }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let dead = false;
    (async () => {
      const [c, p] = await Promise.all([
        fetch("/api/compatibility", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ selection: sel }) }).then((r) => r.json()),
        fetch("/api/ai/explain", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ selection: sel }) }).then((r) => r.json()),
      ]);
      if (!dead) { setCompat(c); setPrice(p.price); }
    })();
    return () => { dead = true; };
  }, [sel]);

  const byCat = useMemo(() => {
    const m: Record<string, Comp[]> = {};
    for (const c of catalog) { (m[c.category] ??= []).push(c); }
    return m;
  }, [catalog]);

  function share() {
    const url = `${location.origin}/config/${btoa(JSON.stringify(sel)).replace(/[^a-zA-Z0-9]/g, "").slice(0, 12)}?s=${encodeURIComponent(JSON.stringify(sel))}`;
    navigator.clipboard?.writeText(url).catch(() => {});
    alert("Lien copié : " + url);
  }

  return (
    <div>
      <h1>Configurateur manuel</h1>
      <p style={{ color: "#93a0c4" }}>Chaque modification recalcule compatibilité, prix et estimations. <span className="pill-warn">Données démo</span></p>
      <div className="grid2">
        <div className="card">
          {CATS.map((cat) => (
            <div key={cat} style={{ marginBottom: 12 }}>
              <label htmlFor={`sel-${cat}`} style={{ fontSize: 12, color: "#93a0c4" }}>{cat}</label>
              <select id={`sel-${cat}`} className="select" value={sel[cat] ?? ""}
                onChange={(e) => setSel((s) => { const n = { ...s }; if (!e.target.value) delete n[cat]; else n[cat] = e.target.value; return n; })}>
                <option value="">— Aucun —</option>
                {(byCat[cat] ?? []).map((c) => <option key={c.id} value={c.id}>{c.brand} {c.model}</option>)}
              </select>
            </div>
          ))}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button className="btn-ghost" onClick={share}>Partager / copier le lien</button>
            <label style={{ fontSize: 13 }}>Couleur RGB <input type="color" value={color} onChange={(e) => setColor(e.target.value)} aria-label="Couleur RGB" /></label>
          </div>
        </div>
        <div className="card">
          <h2>Compatibilité {compat ? (compat.status === "compatible" ? "🟢 Compatible" : compat.status === "warning" ? "🟡 Réserves" : "🔴 Incompatible") : "…"}</h2>
          <ul>{compat?.issues.map((i, k) => <li key={k} style={{ fontSize: 14 }}><strong>{i.severity === "error" ? "🔴" : "🟡"}</strong> {i.message} <em>→ {i.fix}</em></li>)}
            {compat && compat.issues.length === 0 && <li>🟢 Aucun problème détecté par le moteur v1.</li>}</ul>
          <p>Total estimé (démo) : <strong>{price?.total ? `~${price.total} €` : "—"}</strong></p>
        </div>
      </div>
      <div className="card" style={{ marginTop: 16 }}>
        <h2>Visualisation 3D <span className="pill-warn">Modèles génériques</span></h2>
        <p style={{ fontSize: 13, color: "#93a0c4" }}>Prévisualisation schématique (boîtier + GPU + RAM + refroidissement). Les dimensions ne sont pas à l&apos;échelle certifiée.</p>
        <Suspense fallback={<p>Chargement 3D…</p>}>
          <Viewer3D color={color} hasGpu={!!sel.GPU} />
        </Suspense>
      </div>
      <div className="card" style={{ marginTop: 16 }}>
        <h2>Assistant — modifie la config en langage naturel</h2>
        <Suspense fallback={<p>Chargement chat…</p>}>
          <ChatBox selection={sel} onApply={setSel} />
        </Suspense>
      </div>
    </div>
  );
}
