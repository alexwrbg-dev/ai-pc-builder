"use client";
// Cadre de la vue 3D : barre d'outils, légende de la pièce survolée, chargement différé de la scène.
import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState } from "react";
import PartThumb from "@/components/PartThumb";
import { PartPrice } from "@/components/PartPrice";
import { fullName } from "@/lib/catalog";
import { CATEGORY_LABEL, type CompatibilityIssue, type ComponentCategory, type ResolvedBuild } from "@/lib/types";

const Scene = dynamic(() => import("./viewer/Scene"), {
  ssr: false,
  loading: () => <div className="viewer-loading"><span>Mise au net du plan…</span></div>,
});

const ACCENTS = ["#7fd6ff", "#ff5fa2", "#8cff9b", "#ffb44d", "#b18cff", "#ffffff"];

/** Dimensions utiles de la pièce survolée, pour la légende. */
function dimensions(build: ResolvedBuild, slot: ComponentCategory): string {
  switch (slot) {
    case "GPU": { const s = build.GPU!.specs; return `${s.lengthMM} × ${s.heightMM} × ${s.thicknessMM} mm · ${s.tdpW} W`; }
    case "CASE": { const s = build.CASE!.specs; return `${s.dims.h} × ${s.dims.w} × ${s.dims.d} mm`; }
    case "COOLER": { const s = build.COOLER!.specs; return s.kind === "AIR" ? `hauteur ${s.heightMM} mm` : `radiateur ${s.radiatorMM} mm`; }
    case "MOTHERBOARD": return build.MOTHERBOARD!.specs.formFactor;
    case "RAM": { const s = build.RAM!.specs; return `${s.sticks} × ${s.capacityGB / s.sticks} Go · ${s.heightMM} mm de haut`; }
    case "PSU": { const s = build.PSU!.specs; return `${s.wattageW} W · ${s.lengthMM} mm de long`; }
    case "CPU": return build.CPU!.specs.socket;
    case "SSD": return build.SSD!.specs.interface === "NVMe" ? "M.2 2280" : "2,5 pouces";
  }
}

/** Les petits écrans et les machines modestes se passent du halo et des ombres. `?rendu=haut` ou `?rendu=bas` force le choix. */
export function useQuality(): "high" | "low" {
  const [quality, setQuality] = useState<"high" | "low">("high");
  useEffect(() => {
    const forced = new URLSearchParams(window.location.search).get("rendu");
    if (forced === "haut" || forced === "bas") { setQuality(forced === "haut" ? "high" : "low"); return; }
    const weak = window.innerWidth < 700 || (navigator.hardwareConcurrency ?? 8) <= 4;
    setQuality(weak ? "low" : "high");
  }, []);
  return quality;
}

export default function BuildViewer({ build, issues = [], tall = false }: { build: ResolvedBuild; issues?: CompatibilityIssue[]; tall?: boolean }) {
  const quality = useQuality();
  const [plan, setPlan] = useState(true);
  const [exploded, setExploded] = useState(false);
  const [cotes, setCotes] = useState(true);
  const [accent, setAccent] = useState(ACCENTS[0]);
  const [hot, setHot] = useState<ComponentCategory | null>(null);
  const [sweep, setSweep] = useState(0);
  const touched = useRef(false);

  // Le tracé se matérialise tout seul une fois les pièces en place, sauf si l'utilisateur a déjà choisi un style.
  useEffect(() => {
    const id = window.setTimeout(() => {
      if (!touched.current) { setPlan(false); setSweep((n) => n + 1); }
    }, 2600);
    return () => window.clearTimeout(id);
  }, []);

  const flags = useMemo(() => {
    const out: Partial<Record<ComponentCategory, "error" | "warning">> = {};
    for (const i of issues) {
      if (i.severity === "info") continue;
      for (const slot of i.slots) if (out[slot] !== "error") out[slot] = i.severity;
    }
    return out;
  }, [issues]);

  const hotPart = hot ? build[hot] : undefined;
  const empty = Object.keys(build).length === 0;

  return (
    <div className={`viewer${tall ? " viewer-tall" : ""}`}>
      <div className="viewer-stage" aria-label="Vue 3D de la configuration, à l'échelle" role="img">
        {empty
          ? <div className="viewer-loading"><span>Choisis une première pièce pour commencer le tracé.</span></div>
          : <Scene build={build} plan={plan} exploded={exploded} cotes={cotes} accent={accent} hot={hot} flags={flags} quality={quality} onHover={setHot} />}
        {sweep > 0 && <div key={sweep} className="viewer-sweep" aria-hidden="true" />}
        <div className="viewer-corner tl" aria-hidden="true" /><div className="viewer-corner br" aria-hidden="true" />
        {/* Fiche de la pièce survolée : sa photo officielle quand l'API Amazon est branchée, sinon notre rendu */}
        {hot && hotPart && (
          <div key={hotPart.id} className="viewer-card" aria-hidden="true">
            <PartThumb part={hotPart} className="thumb-card" />
            <span className="label">{CATEGORY_LABEL[hot]}</span>
            <strong>{fullName(hotPart)}</strong>
            <PartPrice part={hotPart} className="num viewer-card-price" />
          </div>
        )}
        <div className="viewer-legend" aria-live="polite">
          {hot && hotPart
            ? <><span className="label">{CATEGORY_LABEL[hot]}</span><strong>{fullName(hotPart)}</strong><span>{dimensions(build, hot)}</span></>
            : <><span className="label">Échelle 1:10</span><span>Glisse pour tourner, molette pour zoomer, survole une pièce.</span></>}
        </div>
      </div>
      <div className="viewer-bar">
        <div className="seg" role="group" aria-label="Style de la vue">
          <button type="button" aria-pressed={plan} onClick={() => { touched.current = true; setPlan(true); setSweep((n) => n + 1); }}>Plan</button>
          <button type="button" aria-pressed={!plan} onClick={() => { touched.current = true; setPlan(false); setSweep((n) => n + 1); }}>Rendu</button>
        </div>
        <button type="button" className="toggle" aria-pressed={exploded} onClick={() => setExploded((v) => !v)}>Vue éclatée</button>
        <button type="button" className="toggle" aria-pressed={cotes} onClick={() => setCotes((v) => !v)}>Cotes</button>
        <div className="swatches" role="group" aria-label="Couleur de l'éclairage RGB">
          {ACCENTS.map((c) => (
            <button key={c} type="button" aria-label={`Éclairage ${c}`} aria-pressed={accent === c} style={{ background: c }} onClick={() => setAccent(c)} />
          ))}
        </div>
      </div>
      <p className="viewer-note">Rendu 3D à l&apos;échelle d&apos;après les dimensions des fabricants. Couleurs, ventilateurs et éclairage relevés sur chaque produit ; les formes restent génériques, ce n&apos;est pas une photo.</p>
    </div>
  );
}
