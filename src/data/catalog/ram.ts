import type { ComponentOf, Finish, RamSpecs, RamType } from "@/lib/types";

type Row = [
  id: string, brand: string, model: string, price: number, finish: Finish,
  type: RamType, sticks: number, stickGB: number, speedMTs: number, cl: number, heightMM: number, rgb: boolean,
];

// Les prix de la mémoire ont fortement monté en 2026 : ils pèsent lourd dans le budget.
const ROWS: Row[] = [
  // ---- DDR4 ----
  ["ram-textorm-d4-16", "Textorm", "16 Go (2x8) DDR4-3200 CL16", 90, "black", "DDR4", 2, 8, 3200, 16, 32, false],
  ["ram-lpx-d4-16", "Corsair", "Vengeance LPX 16 Go (2x8) DDR4-3200 CL16", 161, "black", "DDR4", 2, 8, 3200, 16, 34, false],
  ["ram-fury-d4-16", "Kingston", "Fury Beast 16 Go (2x8) DDR4-3200 CL16", 178, "black", "DDR4", 2, 8, 3200, 16, 34, false],
  ["ram-ripjaws-d4-32", "G.Skill", "Ripjaws V 32 Go (2x16) DDR4-3600 CL18", 266, "black", "DDR4", 2, 16, 3600, 18, 42, false],
  ["ram-vengeance-rs-d4-32", "Corsair", "Vengeance RGB RS 32 Go (2x16) DDR4-3200 CL16", 308, "black", "DDR4", 2, 16, 3200, 16, 45, true],
  ["ram-fury-d4-32", "Kingston", "Fury Beast 32 Go (2x16) DDR4-3200 CL16", 340, "black", "DDR4", 2, 16, 3200, 16, 34, false],
  // ---- DDR5 ----
  ["ram-vengeance-d5-16", "Corsair", "Vengeance 16 Go (2x8) DDR5-5200 CL40", 157, "black", "DDR5", 2, 8, 5200, 40, 35, false],
  ["ram-fury-d5-16", "Kingston", "Fury Beast 16 Go (2x8) DDR5-5600 CL36", 298, "black", "DDR5", 2, 8, 5600, 36, 35, false],
  ["ram-crucial-pro-d5-32", "Crucial", "Pro Overclocking 32 Go (2x16) DDR5-6400 CL38", 480, "black", "DDR5", 2, 16, 6400, 38, 34, false],
  ["ram-fury-d5-32-5600", "Kingston", "Fury Beast 32 Go (2x16) DDR5-5600 CL40", 500, "black", "DDR5", 2, 16, 5600, 40, 35, false],
  ["ram-fury-rgb-d5-32-5600", "Kingston", "Fury Beast RGB 32 Go (2x16) DDR5-5600 CL36", 500, "black", "DDR5", 2, 16, 5600, 36, 42, true],
  ["ram-fury-rgb-d5-32-6000-cl36", "Kingston", "Fury Beast RGB 32 Go (2x16) DDR5-6000 CL36", 549, "black", "DDR5", 2, 16, 6000, 36, 42, true],
  ["ram-flare-x5-d5-32", "G.Skill", "Flare X5 32 Go (2x16) DDR5-6000 CL36", 569, "black", "DDR5", 2, 16, 6000, 36, 33, false],
  ["ram-vengeance-d5-32", "Corsair", "Vengeance 32 Go (2x16) DDR5-6000 CL30", 579, "black", "DDR5", 2, 16, 6000, 30, 35, false],
  ["ram-fury-white-rgb-d5-32", "Kingston", "Fury Beast White RGB 32 Go (2x16) DDR5-6000 CL30", 639, "white", "DDR5", 2, 16, 6000, 30, 42, true],
  ["ram-fury-rgb-d5-32-6000-cl30", "Kingston", "Fury Beast RGB 32 Go (2x16) DDR5-6000 CL30", 650, "black", "DDR5", 2, 16, 6000, 30, 42, true],
  ["ram-trident-neo-white-d5-32", "G.Skill", "Trident Z5 Neo RGB White 32 Go (2x16) DDR5-6000 CL30", 789, "white", "DDR5", 2, 16, 6000, 30, 44, true],
  ["ram-fury-d5-64-6000", "Kingston", "Fury Beast 64 Go (2x32) DDR5-6000 CL30", 1189, "black", "DDR5", 2, 32, 6000, 30, 35, false],
  ["ram-fury-d5-64-5600", "Kingston", "Fury Beast 64 Go (2x32) DDR5-5600 CL36", 1200, "black", "DDR5", 2, 32, 5600, 36, 35, false],
  ["ram-trident-rgb-d5-64", "G.Skill", "Trident Z5 RGB 64 Go (2x32) DDR5-6800 CL34", 1712, "black", "DDR5", 2, 32, 6800, 34, 42, true],
];

export const RAMS: ComponentOf<"RAM">[] = ROWS.map(
  ([id, brand, model, price, finish, type, sticks, stickGB, speedMTs, cl, heightMM, rgb]) => ({
    id, category: "RAM", brand, model, finish, price, confidence: "KNOWN",
    specs: { type, capacityGB: sticks * stickGB, sticks, speedMTs, cl, heightMM, rgb } satisfies RamSpecs,
  }),
);
