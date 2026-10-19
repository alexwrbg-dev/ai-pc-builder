// Apparence d'une pièce pour la vue 3D : la fiche relevée (src/data/looks.ts) si elle existe,
// sinon une apparence déduite de la finition (noir, blanc, argent) et des caractéristiques.
import { BOARD_LOOK, CASE_LOOK, COOLER_LOOK, GPU_LOOK, PSU_LOOK, RAM_LOOK } from "@/data/looks";
import type { BoardLook, CaseLook, CoolerLook, GpuLook, PsuLook, RamLook } from "@/data/looks";
import type { ComponentOf, Finish } from "./types";

export type { BoardLook, CaseLook, CoolerLook, GpuLook, PsuLook, RamLook };

const BODY: Record<Finish, string> = { black: "#1b1d21", white: "#e8eaed", silver: "#b9bec6" };

export function gpuLook(c: ComponentOf<"GPU">): GpuLook {
  return GPU_LOOK[c.id] ?? {
    body: BODY[c.finish], accent: c.finish === "white" ? "#b9bec6" : "#3a3f47", backplate: true,
    backplateColor: BODY[c.finish], blade: c.finish === "white" ? "white" : "black", rgb: "none", frame: "flat", flowThrough: false,
  };
}

export function coolerLook(c: ComponentOf<"COOLER">): CoolerLook {
  const white = c.finish === "white";
  const base: CoolerLook = {
    fanColor: white ? "#e8eaed" : "#1a1b1e", blade: c.specs.rgb ? "translucent" : white ? "white" : "black",
    fanSize: c.specs.radiatorMM && c.specs.radiatorMM % 140 === 0 ? 140 : 120, rgb: c.specs.rgb ? "both" : "none",
    towers: c.specs.fans >= 2 ? 2 : 1, heatpipes: 6, heatpipeColor: c.finish === "black" ? "black" : "nickel",
    finColor: c.finish === "black" ? "#25282d" : white ? "#eceef1" : "#c9cdd4", topCover: white ? "#e8eaed" : "#1e2024",
    tubeColor: white ? "#e6e9ed" : "#0c0d0f", pumpCap: white ? "#e8eaed" : "#16171a", pumpShape: "round", screen: false,
    radiatorColor: white ? "#e8eaed" : "#16171a",
  };
  return { ...base, ...(COOLER_LOOK[c.id] ?? {}) };
}

export function caseLook(c: ComponentOf<"CASE">): CaseLook {
  const s = c.specs;
  return CASE_LOOK[c.id] ?? {
    color: BODY[c.finish], front: s.front, sideGlass: true, topMesh: true,
    frontFans: Math.max(0, s.includedFans - 1), rearFans: s.includedFans > 0 ? 1 : 0, topFans: 0, bottomFans: 0, sideFans: 0,
    fanBlade: s.rgbFans ? "translucent" : c.finish === "white" ? "white" : "black", fansRgb: s.rgbFans,
    shroud: s.layout === "dual" ? "none" : "solid", feet: "low", accentColor: null,
  };
}

export function ramLook(c: ComponentOf<"RAM">): RamLook {
  return RAM_LOOK[c.id] ?? {
    spreader: BODY[c.finish], accent: null, rgb: c.specs.rgb, lightBar: c.specs.rgb ? "slim" : "none", profile: "flat",
  };
}

export function boardLook(c: ComponentOf<"MOTHERBOARD">): BoardLook {
  const white = c.finish === "white";
  return BOARD_LOOK[c.id] ?? {
    pcb: white ? "#e9ebee" : "#141619", heatsink: white ? "#e3e6ea" : "#2b2e35", accent: null,
    ioCover: c.specs.tier >= 2, rgb: false, m2Covers: c.specs.tier >= 2 ? 2 : 1,
  };
}

export function psuLook(c: ComponentOf<"PSU">): PsuLook {
  return PSU_LOOK[c.id] ?? { color: BODY[c.finish], fanGrill: "ring", sideLabel: "small", rgb: false };
}

/** Clair ou foncé : sert à choisir la teinte des détails (vis, joints, filets). */
export function isLight(hex: string): boolean {
  const n = parseInt(hex.slice(1), 16);
  const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  return 0.299 * r + 0.587 * g + 0.114 * b > 150;
}

/** Variante plus claire ou plus foncée d'une couleur, pour les arêtes et les reliefs. */
export function shade(hex: string, amount: number): string {
  const n = parseInt(hex.slice(1), 16);
  const f = (v: number) => Math.max(0, Math.min(255, Math.round(v + amount * 255)));
  const r = f((n >> 16) & 255), g = f((n >> 8) & 255), b = f(n & 255);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}
