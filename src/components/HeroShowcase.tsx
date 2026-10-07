"use client";
// Tête de la page d'accueil : une configuration d'exemple qui s'assemble au trait, puis prend matière.
import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import { useQuality } from "@/components/BuildViewer";
import { encodeSelection, fullName, resolveBuild } from "@/lib/catalog";
import { formatEUR } from "@/lib/pricing";
import { SHOWCASE } from "@/lib/showcase";
import { CATEGORIES, CATEGORY_LABEL, type ComponentCategory } from "@/lib/types";

const Scene = dynamic(() => import("./viewer/Scene"), { ssr: false });

/** Teintes que l'éclairage parcourt lentement. */
const HUES = ["#7fd6ff", "#b18cff", "#ff5fa2", "#ffb44d", "#8cff9b"];
const NO_FLAGS = {};

export default function HeroShowcase() {
  const quality = useQuality();
  const [plan, setPlan] = useState(true);
  const [sweep, setSweep] = useState(false);
  const [hue, setHue] = useState(0);
  const [hot, setHot] = useState<ComponentCategory | null>(null);
  const { build } = useMemo(() => resolveBuild(SHOWCASE), []);
  const total = useMemo(() => CATEGORIES.reduce((s, slot) => s + (build[slot]?.price ?? 0), 0), [build]);

  useEffect(() => {
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const toReal = window.setTimeout(() => { setPlan(false); setSweep(true); }, still ? 0 : 2800);
    const cycle = still ? 0 : window.setInterval(() => setHue((h) => (h + 1) % HUES.length), 7000);
    return () => { window.clearTimeout(toReal); if (cycle) window.clearInterval(cycle); };
  }, []);

  const hotPart = hot ? build[hot] : undefined;

  return (
    <div className="showcase">
      <div className="showcase-stage" role="img" aria-label="Exemple de configuration montée, en 3D">
        <Scene
          build={build} plan={plan} exploded={false} cotes={false} accent={HUES[hue]} hot={hot} flags={NO_FLAGS}
          quality={quality} onHover={setHot} zoom={false} motion="sway"
        />
        {sweep && <div className="viewer-sweep" aria-hidden="true" />}
      </div>
      <div className="showcase-caption">
        <span className="label">{hot && hotPart ? CATEGORY_LABEL[hot] : <><b>Fig. 1</b> — Config d&apos;exemple</>}</span>
        <span className="showcase-name">{hot && hotPart ? fullName(hotPart) : `${build.CPU?.model} · ${build.GPU?.specs.chipset} · ${build.RAM?.specs.capacityGB} Go`}</span>
        <span className="num">{formatEUR(hot && hotPart ? hotPart.price : total)}</span>
        <a className="btn-ghost btn-sm" href={`/builder?c=${encodeURIComponent(encodeSelection(SHOWCASE))}`}>Ouvrir cette config →</a>
      </div>
    </div>
  );
}
