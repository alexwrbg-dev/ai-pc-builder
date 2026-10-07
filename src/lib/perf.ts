// Estimations de performance. Ce ne sont PAS des mesures : un modèle simple bâti sur des indices relatifs
// (moyennes de tests publics). Il sert à comparer des configurations entre elles, pas à promettre un chiffre.
import type { PerfEstimate, ResolvedBuild, Resolution, Usage } from "./types";

interface GameProfile {
  name: string;
  /** Images par seconde d'une carte d'indice 100 (RTX 5070), réglages élevés, sans upscaling. */
  gpu: Record<Resolution, number>;
  /** Plafond imposé par un processeur d'indice 100 (Ryzen 7 9800X3D). */
  cpuCap: number;
  /** Mots qui désignent ce jeu dans une demande écrite. */
  keywords: string[];
}

export const GAMES: GameProfile[] = [
  { name: "Cyberpunk 2077", gpu: { "1080p": 130, "1440p": 85, "4K": 40 }, cpuCap: 190, keywords: ["cyberpunk"] },
  { name: "Fortnite", gpu: { "1080p": 180, "1440p": 125, "4K": 65 }, cpuCap: 300, keywords: ["fortnite"] },
  { name: "Call of Duty", gpu: { "1080p": 150, "1440p": 105, "4K": 60 }, cpuCap: 260, keywords: ["call of duty", "warzone", "cod"] },
  { name: "Counter-Strike 2", gpu: { "1080p": 380, "1440p": 260, "4K": 130 }, cpuCap: 550, keywords: ["counter-strike", "counter strike", "cs2"] },
  { name: "Valorant", gpu: { "1080p": 520, "1440p": 420, "4K": 260 }, cpuCap: 650, keywords: ["valorant"] },
  { name: "League of Legends", gpu: { "1080p": 450, "1440p": 400, "4K": 280 }, cpuCap: 480, keywords: ["league of legends", "lol"] },
  { name: "GTA V", gpu: { "1080p": 150, "1440p": 110, "4K": 60 }, cpuCap: 190, keywords: ["gta"] },
  { name: "Baldur's Gate 3", gpu: { "1080p": 150, "1440p": 105, "4K": 55 }, cpuCap: 150, keywords: ["baldur"] },
  { name: "Alan Wake 2", gpu: { "1080p": 95, "1440p": 65, "4K": 35 }, cpuCap: 160, keywords: ["alan wake"] },
  { name: "Elden Ring", gpu: { "1080p": 140, "1440p": 100, "4K": 55 }, cpuCap: 170, keywords: ["elden ring"] },
];

/** Jeux pris comme référence quand la demande n'en cite aucun. */
const REFERENCE = ["Cyberpunk 2077", "Fortnite", "Call of Duty", "Baldur's Gate 3"];

/** Une carte avec peu de mémoire vidéo décroche quand la définition monte. */
function vramFactor(vramGB: number, res: Resolution): number {
  if (res === "4K") return vramGB <= 8 ? 0.7 : vramGB <= 12 ? 0.93 : 1;
  if (res === "1440p") return vramGB <= 8 ? 0.9 : 1;
  return 1;
}

function ramFactor(capacityGB: number | undefined): number {
  if (!capacityGB) return 1;
  return capacityGB < 16 ? 0.8 : capacityGB < 32 ? 0.96 : 1;
}

export function estimateFps(build: ResolvedBuild, res: Resolution, gameNames: string[] = []): PerfEstimate[] {
  const { CPU: cpu, GPU: gpu, RAM: ram } = build;
  if (!cpu || !gpu) return [];
  const wanted = gameNames.length ? gameNames : REFERENCE;
  return GAMES.filter((g) => wanted.includes(g.name)).map((g) => {
    const gpuFps = g.gpu[res] * (gpu.specs.perfIndex / 100) * vramFactor(gpu.specs.vramGB, res);
    const cpuFps = g.cpuCap * (cpu.specs.gamingIndex / 100);
    const fps = Math.min(gpuFps, cpuFps) * ramFactor(ram?.specs.capacityGB);
    return { game: g.name, fps: Math.round(fps), limitedBy: cpuFps < gpuFps ? "CPU" : "GPU" };
  });
}

/**
 * Note unique servant à classer des configurations pour un usage donné.
 * Jeu : moyenne géométrique des images par seconde, plafonnées (au-delà de 240, le gain ne se voit plus).
 */
export function perfScore(build: ResolvedBuild, usage: Usage, res: Resolution, gameNames: string[] = []): number {
  const { CPU: cpu, GPU: gpu, RAM: ram } = build;
  if (!cpu) return 0;
  const ramGB = ram?.specs.capacityGB ?? 0;

  if (usage === "bureautique") {
    // Au-delà d'un processeur correct et de 16 Go, rien ne se ressent en bureautique.
    return Math.min(cpu.specs.multiIndex, 32) + (ramGB >= 16 ? 10 : 0);
  }
  if (usage === "creation") {
    const ramBonus = ramGB >= 64 ? 1.1 : ramGB >= 32 ? 1 : 0.75;
    const gpuPart = gpu ? Math.min(gpu.specs.perfIndex, 130) * (gpu.specs.vramGB >= 16 ? 1.1 : 1) : 0;
    return (cpu.specs.multiIndex * 0.65 + gpuPart * 0.35) * ramBonus;
  }
  const fps = estimateFps(build, res, gameNames);
  if (!fps.length) return 0;
  const geo = Math.exp(fps.reduce((sum, f) => sum + Math.log(Math.max(1, Math.min(f.fps, 240))), 0) / fps.length);
  // Les jeux récents saccadent sur moins de 6 cœurs, même quand la moyenne d'images reste correcte.
  const smooth = cpu.specs.cores < 6 ? geo * 0.88 : geo;
  // Le streaming encode en même temps que le jeu tourne : les cœurs supplémentaires comptent.
  return usage === "streaming" ? smooth * (cpu.specs.cores >= 8 ? 1.05 : 0.92) : smooth;
}

export function bottleneck(build: ResolvedBuild, res: Resolution): { limitedBy: "CPU" | "GPU" | "équilibré"; detail: string } | null {
  const fps = estimateFps(build, res);
  if (!fps.length) return null;
  const cpuBound = fps.filter((f) => f.limitedBy === "CPU").length;
  if (cpuBound === fps.length) {
    return { limitedBy: "CPU", detail: `En ${res}, le processeur bride la carte graphique dans tous les jeux de référence : une partie du budget carte graphique est perdue.` };
  }
  if (cpuBound === 0) {
    return { limitedBy: "GPU", detail: `En ${res}, c'est la carte graphique qui fixe les performances : c'est la situation normale pour une machine de jeu.` };
  }
  return { limitedBy: "équilibré", detail: `En ${res}, processeur et carte graphique se limitent tour à tour selon les jeux : la config est équilibrée.` };
}
