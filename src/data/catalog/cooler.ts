import type { ComponentOf, Confidence, CoolerSpecs, Finish } from "@/lib/types";

const ALL = ["AM4", "AM5", "LGA1700", "LGA1851"];

type Row = [
  id: string, brand: string, model: string, price: number, finish: Finish, kind: "AIR" | "AIO",
  /** hauteur du ventirad, ou longueur nominale du radiateur */ size: number,
  tdpRatingW: number, fans: number, rgb: boolean, confidence: Confidence,
];

const ROWS: Row[] = [
  // ---- Ventirads ----
  ["cool-bq-pure-rock-3", "be quiet!", "Pure Rock 3 Black", 26, "black", "AIR", 155, 190, 1, false, "KNOWN"],
  ["cool-bq-pure-rock-pro-3", "be quiet!", "Pure Rock Pro 3", 40, "silver", "AIR", 155, 250, 2, false, "VERIFIED"],
  ["cool-bq-pure-rock-pro-3-black", "be quiet!", "Pure Rock Pro 3 Black", 44, "black", "AIR", 155, 250, 2, false, "VERIFIED"],
  ["cool-bq-dark-rock-5", "be quiet!", "Dark Rock 5", 57, "black", "AIR", 161, 210, 1, false, "KNOWN"],
  ["cool-bq-dark-rock-pro-5", "be quiet!", "Dark Rock Pro 5", 77, "black", "AIR", 168, 270, 2, false, "KNOWN"],
  ["cool-bq-dark-rock-elite", "be quiet!", "Dark Rock Elite", 92, "black", "AIR", 168, 280, 2, true, "KNOWN"],
  // ---- Watercooling tout-en-un ----
  ["cool-msi-a13-240-black", "MSI", "MAG Coreliquid A13 240 Noir", 60, "black", "AIO", 240, 250, 2, true, "KNOWN"],
  ["cool-msi-a13-240-white", "MSI", "MAG Coreliquid A13 240 Blanc", 60, "white", "AIO", 240, 250, 2, true, "KNOWN"],
  ["cool-cm-360-core-ii", "Cooler Master", "MasterLiquid 360 Core II ARGB Noir", 65, "black", "AIO", 360, 320, 3, true, "KNOWN"],
  ["cool-nzxt-kraken-plus-240", "NZXT", "Kraken Plus 240 RGB Noir", 69, "black", "AIO", 240, 250, 2, true, "KNOWN"],
  ["cool-bq-pure-loop-3-240", "be quiet!", "Pure Loop 3 240 mm", 72, "black", "AIO", 240, 250, 2, false, "KNOWN"],
  ["cool-msi-a13-360-black", "MSI", "MAG Coreliquid A13 360 Noir", 75, "black", "AIO", 360, 320, 3, true, "VERIFIED"],
  ["cool-msi-a13-360-white", "MSI", "MAG Coreliquid A13 360 Blanc", 75, "white", "AIO", 360, 320, 3, true, "VERIFIED"],
  ["cool-corsair-nautilus-240", "Corsair", "Nautilus 240 RS", 75, "black", "AIO", 240, 250, 2, false, "KNOWN"],
  ["cool-bq-pure-loop-3-280", "be quiet!", "Pure Loop 3 280 mm", 80, "black", "AIO", 280, 280, 2, false, "KNOWN"],
  ["cool-bq-pure-loop-3-360", "be quiet!", "Pure Loop 3 360 mm", 80, "black", "AIO", 360, 320, 3, false, "KNOWN"],
  ["cool-corsair-nautilus-360", "Corsair", "Nautilus 360 RS", 94, "black", "AIO", 360, 320, 3, false, "KNOWN"],
  ["cool-corsair-nautilus-360-white", "Corsair", "Nautilus 360 RS ARGB Blanc", 100, "white", "AIO", 360, 320, 3, true, "KNOWN"],
  ["cool-bq-light-loop-360-black", "be quiet!", "Light Loop 360 mm Noir", 120, "black", "AIO", 360, 320, 3, true, "KNOWN"],
  ["cool-bq-light-loop-360-white", "be quiet!", "Light Loop 360 mm Blanc", 125, "white", "AIO", 360, 320, 3, true, "KNOWN"],
  ["cool-bq-silent-loop-3-360", "be quiet!", "Silent Loop 3 360 mm", 125, "black", "AIO", 360, 330, 3, false, "KNOWN"],
  ["cool-bq-silent-loop-3-420", "be quiet!", "Silent Loop 3 420 mm", 130, "black", "AIO", 420, 360, 3, false, "KNOWN"],
];

export const COOLERS: ComponentOf<"COOLER">[] = ROWS.map(
  ([id, brand, model, price, finish, kind, size, tdpRatingW, fans, rgb, confidence]) => ({
    id, category: "COOLER", brand, model, finish, price, confidence,
    specs: {
      kind, sockets: ALL, tdpRatingW, fans, rgb,
      ...(kind === "AIR" ? { heightMM: size } : { radiatorMM: size }),
    } satisfies CoolerSpecs,
  }),
);
