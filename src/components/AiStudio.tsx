"use client";
import { useState } from "react";

interface Build { variant: string; selection: Record<string, string>; explanation: string[];
  compat: { status: string; issues: { message: string; fix: string }[] };
  price: { total: number | null }; score: { total: number } }

export default function AiStudio() {
  const [prompt, setPrompt] = useState("Je veux un PC à 1500 € pour jouer en 1440p à Cyberpunk et Fortnite. RGB, config blanche, silencieux.");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [builds, setBuilds] = useState<Build[] | null>(null);
  const [req, setReq] = useState<{ budget: number | null; resolution: string | null } | null>(null);

  async function submit() {
    setLoading(true); setError(null);
    try {
      const res = await fetch("/api/ai/recommend", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, variant: "all" }),
      });
      if (!res.ok) throw new Error(`Erreur ${res.status}`);
      const json = await res.json();
      setReq(json.requirements);
      setBuilds([json.builds.value, json.builds.balanced, json.builds.max]);
      // Sauvegarde locale (historique)
      try {
        const h = JSON.parse(localStorage.getItem("aipcb-history") ?? "[]");
        h.unshift({ prompt, at: new Date().toISOString(), requirements: json.requirements });
        localStorage.setItem("aipcb-history", JSON.stringify(h.slice(0, 20)));
      } catch {}
    } catch (e) { setError(e instanceof Error ? e.message : "Erreur inconnue"); }
    finally { setLoading(false); }
  }

  return (
    <div>
      <div className="prompt-row" role="search">
        <label htmlFor="ai-prompt" className="skip">Quel PC veux-tu construire ?</label>
        <textarea id="ai-prompt" className="input" rows={3} value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ex : J'ai 1200 €, je veux un PC gaming 1440p silencieux et évolutif." />
      </div>
      <div style={{ marginTop: 12, display: "flex", gap: 10 }}>
        <button className="btn" onClick={submit} disabled={loading || prompt.length < 3}>
          {loading ? "L'IA construit…" : "Construire mon PC"}
        </button>
        <a className="btn-ghost" href="/builder">Ou configurateur manuel</a>
      </div>
      {error && <p role="alert" style={{ color: "#fca5a5" }}>{error}</p>}
      {req && (
        <div className="kpis" aria-live="polite">
          <span>Budget détecté : <strong>{req.budget ? `${req.budget} €` : "—"}</strong></span>
          <span>Résolution : <strong>{req.resolution ?? "—"}</strong></span>
          <span className="pill-ok">Moteur déterministe</span>
          <span className="pill-warn">Prix démo</span>
        </div>
      )}
      {builds && (
        <div className="grid3" style={{ marginTop: 16 }}>
          {[
            { t: "BEST VALUE", d: "Meilleur rapport perf/prix", b: builds[0] },
            { t: "BALANCED", d: "Équilibrée et évolutive", b: builds[1] },
            { t: "MAX PERFORMANCE", d: "Performances max du budget", b: builds[2] },
          ].map(({ t, d, b }) => (
            <article key={t} className="card">
              <h3>{t}</h3><p style={{ color: "#93a0c4" }}>{d}</p>
              <p>Score : <strong>{b.score.total}/100</strong> • {b.compat.status === "compatible" ? "🟢 Compatible" : b.compat.status === "warning" ? "🟡 Réserves" : "🔴 Incompatible"}</p>
              <p>Total démo : <strong>{b.price.total ? `~${b.price.total} €` : "—"}</strong></p>
              <ul style={{ fontSize: 13, color: "#c6d0ec" }}>{b.explanation.slice(0, 4).map((e, i) => <li key={i}>{e}</li>)}</ul>
              <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                <a className="btn-ghost" href={`/builder?s=${encodeURIComponent(JSON.stringify(b.selection))}`}>Ouvrir / modifier</a>
                <a className="btn-ghost" href="/compare">Comparer</a>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
