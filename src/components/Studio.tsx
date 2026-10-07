"use client";
// Page d'accueil : on décrit son besoin, on reçoit jusqu'à trois configurations vérifiées, visibles en 3D.
import { useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from "react";
import BuildViewer from "@/components/BuildViewer";
import HeroShowcase from "@/components/HeroShowcase";
import Money from "@/components/Money";
import { BudgetMeter, FpsBars, IssueList, PartsTable, StatusPill } from "@/components/ui";
import type { RecommendResponse } from "@/lib/ai-orchestrator";
import { encodeSelection, resolveBuild } from "@/lib/catalog";
import { PROFILE_INFO } from "@/lib/optimizer";
import { formatEUR } from "@/lib/pricing";

const EXAMPLES = [
  "1000 € pour jouer à Fortnite en 1080p",
  "PC blanc et silencieux, 1800 €, Cyberpunk en 1440p",
  "Montage vidéo, 2500 €, carte NVIDIA",
  "PC de bureautique compact, 700 €",
];

const i = (n: number) => ({ "--i": n }) as CSSProperties;

export default function Studio({ children }: { children: ReactNode }) {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<RecommendResponse | null>(null);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [picked, setPicked] = useState(0);
  const resultsRef = useRef<HTMLElement>(null);

  async function run(text: string) {
    if (loading) return;
    if (text.trim().length < 3) {
      document.getElementById("besoin")?.focus();
      setError("Écris d'abord ce que tu cherches, ou clique sur un exemple.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/ai/recommend", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ prompt: text }),
      });
      if (!res.ok) throw new Error(res.status === 400 ? "Demande trop courte ou trop longue." : `Le serveur a répondu ${res.status}.`);
      const json = (await res.json()) as RecommendResponse & { explanation: string | null };
      setData(json);
      setExplanation(json.explanation);
      // Par défaut, on montre le profil équilibré quand il existe.
      setPicked(Math.max(0, json.builds.findIndex((b) => b.profile === "equilibre")));
      requestAnimationFrame(() => resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur inconnue.");
    } finally {
      setLoading(false);
    }
  }

  // Les pages de guide renvoient ici avec une demande préremplie (?q=...).
  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get("q");
    if (q) { setPrompt(q); void run(q); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const current = data?.builds[picked];
  const build = useMemo(() => (current ? resolveBuild(current.selection).build : {}), [current]);

  return (
    <>
      <div className="hero">
        <div className="hero-copy">
          {children}
      <div className="prompt fade-up" style={i(3)}>
        <label htmlFor="besoin" className="skip">Décris le PC que tu veux</label>
        <textarea
          id="besoin" className="input" value={prompt} maxLength={2000}
          placeholder="Ex. : 1500 € pour jouer en 1440p, boîtier blanc, le plus silencieux possible."
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) void run(prompt); }}
        />
        <div className="prompt-actions">
          <button className="btn" type="button" onClick={() => run(prompt)} disabled={loading}>
            {loading ? "Tracé en cours…" : "Tracer ma config"} <span className="arrow" aria-hidden="true">→</span>
          </button>
          <a className="btn-ghost" href="/builder">Choisir pièce par pièce</a>
        </div>
      </div>
      <div className="chips fade-up" style={i(4)}>
        {EXAMPLES.map((ex) => (
          <button key={ex} type="button" className="chip" onClick={() => { setPrompt(ex); void run(ex); }}>{ex}</button>
        ))}
      </div>
      {error && <p role="alert" style={{ color: "var(--err)" }}>{error}</p>}
        </div>
        <HeroShowcase />
      </div>

      {data && (
        <section ref={resultsRef} className="section" style={{ scrollMarginTop: 80 }} aria-live="polite">
          <div className="section-head">
            <span className="label"><b>Planche 02</b> — Résultat</span>
            <h2>{data.builds.length > 1 ? `${data.builds.length} tracés pour ta demande` : "Un tracé pour ta demande"}</h2>
            <div className="chips">
              <span className="label" style={{ alignSelf: "center" }}>Compris :</span>
              {data.understood.map((u) => <span key={u} className="pill pill-plain">{u}</span>)}
            </div>
          </div>

          {!current ? (
            <p className="muted">Aucune configuration du catalogue ne répond à cette demande. Essaie avec moins de contraintes.</p>
          ) : (
            <div className="results">
              <div className="stack">
                {data.builds.map((b, k) => (
                  <button key={b.profile} type="button" className="sheet profile" aria-pressed={k === picked} onClick={() => setPicked(k)}>
                    <span className="profile-top">
                      <span className="label"><b>{String.fromCharCode(65 + k)}</b> — {PROFILE_INFO[b.profile].title}</span>
                      <StatusPill status={b.compat.status} />
                    </span>
                    <span className="profile-top">
                      <Money value={b.total} className="price" />
                      <span className="label">sur {formatEUR(b.budget)}</span>
                    </span>
                    <BudgetMeter total={b.total} budget={b.budget} />
                    <span className="muted small">{PROFILE_INFO[b.profile].tagline}</span>
                  </button>
                ))}
                {explanation && <div className="sheet"><span className="label">Explication rédigée par IA</span><p className="small muted" style={{ marginTop: 8, whiteSpace: "pre-wrap" }}>{explanation}</p></div>}
                <div className="sheet">
                  <div className="sheet-head"><span className="label">Pourquoi ces choix</span></div>
                  <ul className="notes">{current.notes.map((n) => <li key={n}>{n}</li>)}</ul>
                </div>
                {current.fps.length > 0 && (
                  <div className="sheet">
                    <div className="sheet-head"><span className="label">Images par seconde estimées — {current.resolution}</span></div>
                    <FpsBars fps={current.fps} />
                    <p className="small muted" style={{ marginTop: 12 }}>Estimation d&apos;après des moyennes de tests publics, réglages élevés, sans upscaling. Ce n&apos;est pas une mesure.</p>
                  </div>
                )}
              </div>

              <div className="stack">
                <BuildViewer key={current.profile + encodeSelection(current.selection)} build={build} issues={current.compat.issues} />
                <div className="sheet">
                  <div className="sheet-head">
                    <span className="label">Nomenclature</span>
                    <a className="btn btn-sm" href={`/builder?c=${encodeURIComponent(encodeSelection(current.selection))}`}>Modifier cette config <span className="arrow" aria-hidden="true">→</span></a>
                  </div>
                  <PartsTable build={build} total={current.total} />
                </div>
                {current.compat.issues.length > 0 && (
                  <div className="sheet">
                    <div className="sheet-head"><span className="label">Remarques du moteur de compatibilité</span></div>
                    <IssueList compat={current.compat} />
                  </div>
                )}
              </div>
            </div>
          )}
        </section>
      )}
    </>
  );
}
