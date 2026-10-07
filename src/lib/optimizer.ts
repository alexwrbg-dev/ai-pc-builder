// ============================================================
// OPTIMISEUR DE BUDGET
// Parcourt toutes les paires processeur × carte graphique du catalogue, complète chaque
// configuration avec les pièces adaptées les moins chères, écarte tout ce que le moteur de
// compatibilité refuse, puis garde la meilleure note de performance sous le plafond de prix.
// ============================================================
import { byCategory, fullName } from "./catalog";
import { checkBuild, recommendedPsuW } from "./compatibility";
import { bottleneck, estimateFps, perfScore } from "./perf";
import { formatEUR } from "./pricing";
import type { Requirements } from "./requirements";
import type {
  BuildSelection, CompatibilityResult, Component, ComponentOf, PerfEstimate, ResolvedBuild, Resolution,
} from "./types";
import { CATEGORIES } from "./types";

export type Profile = "eco" | "equilibre" | "performance";

export const PROFILE_INFO: Record<Profile, { title: string; tagline: string }> = {
  eco: { title: "Économe", tagline: "Le meilleur résultat en gardant 15 % du budget." },
  equilibre: { title: "Équilibrée", tagline: "Plateforme récente et évolutive, alimentation Gold modulaire, carte mère solide." },
  performance: { title: "Performance", tagline: "Tout le budget dans les images par seconde, le reste au plus juste." },
};

export interface Recommendation {
  profile: Profile;
  selection: BuildSelection;
  total: number;
  budget: number;
  /** Faux quand même la configuration la moins chère dépasse le budget. */
  withinBudget: boolean;
  resolution: Resolution;
  fps: PerfEstimate[];
  compat: CompatibilityResult;
  notes: string[];
}

const DEFAULT_BUDGET = 1200;

/** Définition visée quand la demande n'en donne pas : dépend de ce que le budget permet aux prix actuels. */
export function targetResolution(req: Requirements, budget: number): Resolution {
  if (req.resolution) return req.resolution;
  return budget < 1300 ? "1080p" : budget < 3000 ? "1440p" : "4K";
}

const byPrice = (a: Component, b: Component) => a.price - b.price;

/** La moins chère ; ou la moins chère en blanc si elle ne coûte pas plus de `extra` euros de plus. */
function cheapest<T extends Component>(candidates: T[], white: boolean, extra: number): T | undefined {
  const sorted = [...candidates].sort(byPrice);
  if (!sorted.length) return undefined;
  if (white) {
    const w = sorted.find((c) => c.finish === "white");
    if (w && w.price <= sorted[0].price + extra) return w;
  }
  return sorted[0];
}

interface Ctx {
  req: Requirements;
  profile: Profile;
  budget: number;
  comfort: boolean;
  whiteExtra: number;
}

function ramCapacities(ctx: Ctx): number[] {
  const { req, profile, budget } = ctx;
  if (req.usage === "bureautique") return [16];
  if (req.usage === "creation") return profile === "eco" || budget < 1500 ? [16, 32] : [32, 64];
  if (profile === "equilibre" && budget >= 2500) return [32];
  return [16, 32];
}

function storageTarget(ctx: Ctx): number {
  const { req, profile, budget } = ctx;
  if (req.storageGB) return req.storageGB;
  if (req.usage === "bureautique") return 500;
  if (req.usage === "creation") return profile === "eco" || budget < 1500 ? 1000 : 2000;
  return profile === "equilibre" && budget >= 1800 ? 2000 : 1000;
}

/** Complète une paire CPU/GPU en configuration entière. Renvoie null si aucune pièce ne convient. */
function completeBuild(cpu: ComponentOf<"CPU">, gpu: ComponentOf<"GPU"> | undefined, ram: ComponentOf<"RAM">, ctx: Ctx): ResolvedBuild | null {
  const { req, comfort, whiteExtra } = ctx;

  // Carte mère : bon socket, bon type de mémoire, étages d'alimentation à la hauteur du processeur.
  // Une carte mère d'entrée de gamme ne va ni avec un processeur gourmand, ni avec une grosse carte graphique.
  const minTier = cpu.specs.peakW >= 150 || (gpu?.specs.perfIndex ?? 0) >= 115 || comfort ? 2 : 1;
  let boards = byCategory("MOTHERBOARD").filter((m) =>
    m.specs.socket === cpu.specs.socket && m.specs.ramType === ram.specs.type
    && m.specs.ramSlots >= ram.specs.sticks && m.specs.maxRamGB >= ram.specs.capacityGB
    && (!req.wifi || m.specs.wifi) && (!req.compact || m.specs.formFactor === "Micro-ATX"));
  boards = boards.filter((m) => m.specs.tier >= minTier);
  const mb = cheapest(boards, req.white, whiteExtra);
  if (!mb) return null;

  // Stockage
  const target = storageTarget(ctx);
  const ssd = cheapest(byCategory("SSD").filter((s) =>
    s.specs.interface === "NVMe" && s.specs.capacityGB >= target && (!comfort || s.specs.readMBs >= 6000)), false, 0);
  if (!ssd) return null;

  // Refroidissement : rien si le ventirad fourni suffit, sinon le moins cher qui tient la charge.
  const stockOk = cpu.specs.coolerIncluded && cpu.specs.peakW <= 90 && !comfort && !req.silent;
  const coolMargin = req.silent ? 1.35 : comfort ? 1.15 : 1;
  const coolers = stockOk ? [] : byCategory("COOLER")
    .filter((c) => c.specs.tdpRatingW >= cpu.specs.peakW * coolMargin && (req.rgb !== false || !c.specs.rgb))
    .sort(byPrice);
  if (!stockOk && !coolers.length) return null;

  // Boîtier : on prend le moins cher qui accepte la carte mère, la carte graphique et un refroidissement.
  let cases = byCategory("CASE").filter((k) =>
    k.specs.formFactors.includes(mb.specs.formFactor)
    && (!gpu || k.specs.maxGpuLengthMM >= gpu.specs.lengthMM + 20)
    && (!comfort || req.compact || k.specs.includedFans >= 2)
    && (req.rgb !== false || !k.specs.rgbFans)
    // Compact : moins de 40 litres.
    && (!req.compact || k.specs.dims.h * k.specs.dims.w * k.specs.dims.d < 40e6));
  if (req.white) {
    const white = cases.filter((k) => k.finish === "white");
    if (white.length) cases = white;
  }
  cases.sort(byPrice);

  for (const pcCase of cases) {
    const fitting = coolers.filter((c) =>
      c.specs.kind === "AIR"
        ? (c.specs.heightMM ?? 0) <= pcCase.specs.maxCoolerHeightMM
        : (c.specs.radiatorMM ?? 0) <= Math.max(pcCase.specs.radiatorTopMM, pcCase.specs.radiatorFrontMM, pcCase.specs.radiatorSideMM));
    const cooler = stockOk ? undefined : cheapest(fitting, req.white, whiteExtra);
    if (!stockOk && !cooler) continue;

    const partial: ResolvedBuild = { CPU: cpu, GPU: gpu, MOTHERBOARD: mb, RAM: ram, SSD: ssd, CASE: pcCase, COOLER: cooler };
    const needW = recommendedPsuW(partial);
    const wantGold = comfort || (gpu?.specs.tdpW ?? 0) >= 220;
    const psu = cheapest(byCategory("PSU").filter((p) =>
      p.specs.wattageW >= needW
      && p.specs.pcie8 >= (gpu?.specs.power8pin ?? 0) && p.specs.hpwr16 >= (gpu?.specs.power16pin ?? 0)
      && p.specs.lengthMM <= pcCase.specs.psuMaxLengthMM
      && (!wantGold || p.specs.efficiency !== "Bronze")
      && (!comfort || p.specs.modular === "full")), req.white, whiteExtra);
    if (!psu) continue;

    return { ...partial, PSU: psu };
  }
  return null;
}

function totalOf(build: ResolvedBuild): number {
  return CATEGORIES.reduce((sum, slot) => sum + (build[slot]?.price ?? 0), 0);
}

function toSelection(build: ResolvedBuild): BuildSelection {
  const sel: BuildSelection = {};
  for (const slot of CATEGORIES) {
    const c = build[slot];
    if (c) sel[slot] = c.id;
  }
  return sel;
}

interface Candidate {
  build: ResolvedBuild;
  total: number;
  score: number;
}

function enumerate(ctx: Ctx, res: Resolution): Candidate[] {
  const { req } = ctx;
  const office = req.usage === "bureautique";

  let cpus = byCategory("CPU");
  if (req.cpuBrand) {
    const f = cpus.filter((c) => c.brand === req.cpuBrand);
    if (f.length) cpus = f;
  }
  let gpus: (ComponentOf<"GPU"> | undefined)[] = byCategory("GPU");
  if (req.gpuBrand) {
    const f = gpus.filter((g) => g!.brand === req.gpuBrand || (req.gpuBrand === "NVIDIA" && g!.specs.chipset.startsWith("RTX")) || (req.gpuBrand === "AMD" && g!.specs.chipset.startsWith("RX")));
    if (f.length) gpus = f;
  }
  // En bureautique, la puce graphique intégrée au processeur suffit.
  if (office) gpus = [undefined];
  // Profil équilibré : une plateforme encore vendue en neuf et qui accepte les processeurs à venir.
  if (ctx.comfort) {
    const current = cpus.filter((c) => c.specs.socket === (req.cpuBrand === "Intel" ? "LGA1851" : "AM5"));
    if (current.length) cpus = current;
  }
  // Pas de carte graphique haut de gamme derrière un processeur d'entrée de gamme.
  const pairingFloor = (g: ComponentOf<"GPU"> | undefined) => (g ? 35 + 0.3 * g.specs.perfIndex - (ctx.comfort ? 0 : 6) : 0);

  // Par type de mémoire et capacité : le kit le moins cher (blanc ou RGB si demandé et proche en prix).
  const kits = new Map<string, ComponentOf<"RAM">>();
  for (const type of ["DDR4", "DDR5"] as const) {
    for (const cap of ramCapacities(ctx)) {
      const pool = byCategory("RAM").filter((r) => r.specs.type === type && r.specs.capacityGB === cap && (req.rgb !== false || !r.specs.rgb));
      let kit = cheapest(pool, req.white, ctx.whiteExtra);
      if (req.rgb && kit && !kit.specs.rgb) {
        const lit = cheapest(pool.filter((r) => r.specs.rgb), req.white, ctx.whiteExtra);
        if (lit && lit.price <= kit.price + ctx.whiteExtra) kit = lit;
      }
      if (kit) kits.set(`${type}-${cap}`, kit);
    }
  }

  const out: Candidate[] = [];
  for (const cpu of cpus) {
    if (office && !cpu.specs.igpu) continue;
    for (const gpu of gpus) {
      if (cpu.specs.gamingIndex < pairingFloor(gpu)) continue;
      for (const type of cpu.specs.memoryTypes) {
        for (const cap of ramCapacities(ctx)) {
          const ram = kits.get(`${type}-${cap}`);
          if (!ram) continue;
          const build = completeBuild(cpu, gpu, ram, ctx);
          if (!build) continue;
          const compat = checkBuild(build);
          if (compat.status === "incompatible" || compat.status === "incomplete") continue;
          let score = perfScore(build, req.usage, res, req.games);
          if (req.white) {
            // À performances égales, on préfère la configuration qui respecte le mieux le thème blanc.
            const whites = (["GPU", "CASE", "RAM", "COOLER", "MOTHERBOARD"] as const).filter((s) => build[s]?.finish === "white").length;
            score *= 1 + whites * 0.012;
          }
          out.push({ build, total: totalOf(build), score });
        }
      }
    }
  }
  return out;
}

function explain(c: Candidate, ctx: Ctx, res: Resolution, withinBudget: boolean, fps: PerfEstimate[]): string[] {
  const { req, budget } = ctx;
  const { CPU: cpu, GPU: gpu, RAM: ram, COOLER: cooler, CASE: pcCase } = c.build;
  const notes: string[] = [];

  if (!withinBudget) {
    notes.push(`Aux prix actuels, la configuration viable la moins chère pour cet usage coûte ${formatEUR(c.total)} : le budget de ${formatEUR(budget)} ne suffit pas.`);
  } else if (budget - c.total >= 30) {
    notes.push(`Il reste ${formatEUR(budget - c.total)} sur le budget${req.usage === "bureautique" ? " : dépenser plus ne se sentirait pas pour cet usage" : ""}.`);
  }
  if (gpu && fps.length) {
    const main = fps[0];
    notes.push(`${gpu.specs.chipset} : environ ${main.fps} images/s estimées en ${res} dans ${main.game}.`);
  }
  if (gpu && fps.length && fps[0].fps < 45 && req.usage !== "creation") {
    notes.push(`Moins de 45 images/s en ${res} : à ce budget, mieux vaut viser une définition plus basse ou activer l'upscaling (DLSS, FSR).`);
  }
  const bn = bottleneck(c.build, res);
  if (bn && bn.limitedBy === "CPU") notes.push(bn.detail);
  if (!gpu && cpu) notes.push(`Pas de carte graphique : la puce intégrée au ${cpu.model} suffit pour la bureautique et la vidéo.`);
  if (ram && ram.specs.capacityGB === 16 && req.usage !== "bureautique") {
    notes.push("16 Go de mémoire : suffisant pour jouer aujourd'hui. La mémoire a fortement augmenté en 2026, passer à 32 Go coûte plusieurs centaines d'euros.");
  }
  if (cpu && !cooler) notes.push(`Ventirad fourni avec le ${cpu.model} : fonctionnel, mais audible en charge.`);
  if (req.white && pcCase) {
    const black = (["GPU", "RAM", "COOLER", "MOTHERBOARD"] as const).filter((s) => c.build[s] && c.build[s]!.finish !== "white");
    notes.push(black.length
      ? `Boîtier blanc. Restent en noir, faute de version blanche à prix proche : ${black.map((s) => fullName(c.build[s]!)).join(", ")}.`
      : "Tout le montage visible est blanc.");
  }
  if (req.silent && cooler) notes.push(`Refroidissement surdimensionné (${fullName(cooler)}) pour tourner lentement, donc en silence.`);
  return notes;
}

export function recommend(req: Requirements, profile: Profile): Recommendation | null {
  const budget = req.budget ?? DEFAULT_BUDGET;
  const ctx: Ctx = {
    req, profile, budget,
    comfort: profile === "equilibre",
    whiteExtra: profile === "equilibre" ? 70 : 25,
  };
  const res = targetResolution(req, budget);
  const all = enumerate(ctx, res);
  if (!all.length) return null;

  const cap = profile === "eco" ? budget * 0.85 : budget;
  const affordable = all.filter((c) => c.total <= cap);
  let pick: Candidate;
  if (affordable.length) {
    // Parmi les configurations à moins de 3 % de la meilleure note, on garde la moins chère.
    const best = Math.max(...affordable.map((c) => c.score));
    const tolerance = profile === "eco" ? 0.95 : 0.97;
    pick = affordable.filter((c) => c.score >= best * tolerance).sort((a, b) => a.total - b.total)[0];
  } else {
    pick = [...all].sort((a, b) => a.total - b.total)[0];
  }

  const withinBudget = pick.total <= budget;
  const fps = estimateFps(pick.build, res, req.games);
  const notes = explain(pick, ctx, res, withinBudget, fps);
  if (!req.budget) notes.unshift(`Budget non précisé : hypothèse de ${formatEUR(DEFAULT_BUDGET)}.`);

  return {
    profile, selection: toSelection(pick.build), total: pick.total, budget, withinBudget,
    resolution: res, fps, compat: checkBuild(pick.build), notes,
  };
}

/** Les trois profils, sans doublon : deux profils qui aboutissent à la même configuration n'en font qu'un. */
export function recommendAll(req: Requirements): Recommendation[] {
  const seen = new Set<string>();
  const out: Recommendation[] = [];
  for (const p of ["eco", "equilibre", "performance"] as const) {
    const r = recommend(req, p);
    if (!r) continue;
    const key = JSON.stringify(r.selection);
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(r);
  }
  // Un profil qui dépasse le budget n'est montré que si aucun n'y tient : dans ce cas, seul le moins cher.
  const fitting = out.filter((r) => r.withinBudget);
  if (fitting.length) return fitting;
  return out.sort((a, b) => a.total - b.total).slice(0, 1);
}
