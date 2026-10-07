// Score /100 + bottleneck + estimations perf (ESTIMATIONS marquées comme telles)
import type { BuildScore, BuildSelection, Component, PerfEstimate } from "./types";
import { byId, DEMO_FPS } from "./demo-data";
import { checkCompatibility } from "./compatibility";

const FPS_DB = DEMO_FPS;

export function estimatePerf(gpuId?: string): PerfEstimate[] {
  if (!gpuId) return [];
  const table = FPS_DB[gpuId];
  if (!table) return [];
  return Object.entries(table).map(([game, v]) => ({
    game, res1080p: v.p1080, res1440p: v.p1440, res4K: v.p2160,
    estimated: true as const, confidence: "LOW" as const,
    note: "Estimation (données de démonstration), pas une mesure. Varie selon CPU, drivers, qualité et upscaling.",
  }));
}

export function estimateBottleneck(sel: BuildSelection): { primary: string; detail: string; cpuScore: number; gpuScore: number } {
  // Heuristique documentée v1 : indices synthétiques CPU (cores*boost) vs GPU (vram*tdp).
  // Architecture prévue pour brancher de vrais benchmarks jeu par jeu (voir AI_SYSTEM.md).
  const cpu = sel.CPU ? byId(sel.CPU) : undefined;
  const gpu = sel.GPU ? byId(sel.GPU) : undefined;
  const c = cpu?.specs as { cores?: number; boostClockGHz?: number } | undefined;
  const g = gpu?.specs as { vramGB?: number; tdpW?: number } | undefined;
  const cpuScore = c ? Math.round((c.cores ?? 6) * (c.boostClockGHz ?? 4) * 10) : 0;
  const gpuScore = g ? Math.round((g.vramGB ?? 8) * 22 + (g.tdpW ?? 150) * 0.35) : 0;
  if (!cpu || !gpu) return { primary: "unknown", detail: "Sélection incomplète — ajoutez CPU + GPU.", cpuScore, gpuScore };
  if (gpuScore > cpuScore * 1.35) return { primary: "CPU", detail: "Configuration principalement limitée par le CPU (estimation 1440p). Un CPU plus musclé lisserait les 1% lows.", cpuScore, gpuScore };
  if (cpuScore > gpuScore * 1.35) return { primary: "GPU", detail: "Configuration principalement limitée par le GPU — normal et souhaitable en gaming.", cpuScore, gpuScore };
  return { primary: "Balanced", detail: "Équilibre CPU/GPU sain (estimation).", cpuScore, gpuScore };
}

export function scoreBuild(sel: BuildSelection, totalPrice: number | null): BuildScore {
  const compat = checkCompatibility(sel);
  const bn = estimateBottleneck(sel);
  const cpu = sel.CPU ? byId(sel.CPU) : undefined;
  const gpu = sel.GPU ? byId(sel.GPU) : undefined;
  void cpu; void gpu;
  const reasons: string[] = [];
  let performance = 50, value = 60, compatibility = 100, balance = 70;
  let upgradeability = 60, efficiency = 60, cooling = 60, noise = 60, aesthetics = 50;

  if (compat.status === "incompatible") { compatibility = 20; reasons.push("Incompatibilités bloquantes détectées par le moteur."); }
  else if (compat.status === "warning") { compatibility = 65; reasons.push("Réserves mineures (marges, adaptateurs, XMP)."); }
  else reasons.push("Aucune incompatibilité détectée par le moteur déterministe.");

  if (bn.primary === "Balanced") { balance = 85; reasons.push("Équilibre CPU/GPU sain."); }
  else { balance = 60; reasons.push(bn.detail); }

  if (totalPrice && totalPrice > 0) {
    const fps = estimatePerf(sel.GPU).find((p) => p.game === "Cyberpunk 2077")?.res1440p ?? 60;
    const fpsPerEuro = (fps / totalPrice) * 1000;
    value = Math.max(10, Math.min(95, Math.round(fpsPerEuro * 22)));
    performance = Math.max(10, Math.min(98, Math.round(fps)));
    reasons.push(`~${fps} FPS estimés (1440p, Cyberpunk, démo) pour ${totalPrice} €.`);
  }
  const mb = sel.MOTHERBOARD ? byId(sel.MOTHERBOARD) : undefined;
  const mbS = mb?.specs as { socket?: string } | undefined;
  if (mbS?.socket === "AM5") { upgradeability = 85; reasons.push("Plateforme AM5 : bonne évolutivité annoncée."); }
  else if (mbS?.socket === "LGA1700") { upgradeability = 55; reasons.push("LGA1700 en fin de vie : évolutivité limitée."); }

  const psu = sel.PSU ? (byId(sel.PSU) as Component | undefined) : undefined;
  const psuS = psu?.specs as { efficiency?: string } | undefined;
  if (psuS?.efficiency?.includes("Gold")) efficiency = 80;

  const total = Math.round((performance + value + compatibility + balance + upgradeability + efficiency + cooling + noise + aesthetics) / 9);
  return { total, details: { performance, value, compatibility, balance, upgradeability, efficiency, cooling, noise, aesthetics }, reasons };
}
