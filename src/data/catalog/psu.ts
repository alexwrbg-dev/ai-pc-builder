import type { ComponentOf, Confidence, Finish, PsuSpecs } from "@/lib/types";

type Row = [
  id: string, brand: string, model: string, price: number, finish: Finish,
  wattageW: number, efficiency: PsuSpecs["efficiency"], modular: PsuSpecs["modular"],
  lengthMM: number, pcie8: number, hpwr16: number, confidence: Confidence,
];

// Quand le nombre de connecteurs n'a pas été relu sur la fiche, il est compté au plus bas :
// mieux vaut une alerte en trop qu'une compatibilité annoncée à tort.
const ROWS: Row[] = [
  ["psu-corsair-cx550", "Corsair", "CX550 550 W", 49, "black", 550, "Bronze", "none", 140, 2, 0, "KNOWN"],
  ["psu-msi-a650bn", "MSI", "MAG A650BN 650 W", 55, "black", 650, "Bronze", "none", 140, 2, 0, "VERIFIED"],
  ["psu-bq-sp11-650", "be quiet!", "System Power 11 650 W", 65, "black", 650, "Bronze", "none", 140, 2, 1, "VERIFIED"],
  ["psu-bq-pp12-550", "be quiet!", "Pure Power 12 550 W", 67, "black", 550, "Gold", "none", 160, 2, 1, "KNOWN"],
  ["psu-bq-sp11-750", "be quiet!", "System Power 11 750 W", 73, "black", 750, "Bronze", "none", 140, 2, 1, "KNOWN"],
  ["psu-bq-pp12-650", "be quiet!", "Pure Power 12 650 W", 78, "black", 650, "Gold", "none", 160, 2, 1, "KNOWN"],
  ["psu-corsair-rm650e", "Corsair", "RM650e (2025) 650 W", 85, "black", 650, "Gold", "full", 140, 2, 1, "KNOWN"],
  ["psu-gb-ud750gm-pg5", "Gigabyte", "UD750GM PG5 750 W", 88, "black", 750, "Gold", "full", 140, 2, 1, "KNOWN"],
  ["psu-bq-pp12-850", "be quiet!", "Pure Power 12 850 W", 100, "black", 850, "Gold", "none", 160, 3, 1, "VERIFIED"],
  ["psu-bq-pp13m-650", "be quiet!", "Pure Power 13 M 650 W", 104, "black", 650, "Gold", "full", 160, 2, 1, "KNOWN"],
  ["psu-corsair-rm750e", "Corsair", "RM750e (2025) 750 W", 105, "black", 750, "Gold", "full", 140, 3, 1, "KNOWN"],
  ["psu-msi-a750gl", "MSI", "MAG A750GL PCIE5 750 W", 105, "black", 750, "Gold", "full", 140, 3, 1, "VERIFIED"],
  ["psu-msi-a850gl", "MSI", "MAG A850GL PCIE5 850 W", 107, "black", 850, "Gold", "full", 140, 4, 1, "VERIFIED"],
  ["psu-corsair-rm750e-white", "Corsair", "RM750e (2025) 750 W Blanc", 110, "white", 750, "Gold", "full", 140, 3, 1, "KNOWN"],
  ["psu-bq-pp12-1000", "be quiet!", "Pure Power 12 1000 W", 115, "black", 1000, "Gold", "none", 160, 3, 1, "KNOWN"],
  ["psu-corsair-rm850e", "Corsair", "RM850e (2025) 850 W", 116, "black", 850, "Gold", "full", 140, 3, 1, "VERIFIED"],
  ["psu-msi-a1000gls", "MSI", "MAG A1000GLS PCIE5 1000 W", 120, "black", 1000, "Gold", "full", 150, 4, 1, "VERIFIED"],
  ["psu-bq-pp13m-850", "be quiet!", "Pure Power 13 M 850 W", 130, "black", 850, "Gold", "full", 160, 2, 1, "KNOWN"],
  ["psu-msi-a1250gl", "MSI", "MAG A1250GL PCIE5 1250 W", 130, "black", 1250, "Gold", "full", 150, 4, 1, "VERIFIED"],
  ["psu-corsair-rm850x", "Corsair", "RM850x (2024) 850 W", 135, "black", 850, "Gold", "full", 160, 3, 1, "KNOWN"],
  ["psu-corsair-rm1000e", "Corsair", "RM1000e (2025) 1000 W", 157, "black", 1000, "Gold", "full", 140, 3, 1, "KNOWN"],
  ["psu-corsair-rm1000x", "Corsair", "RM1000x (2024) 1000 W", 160, "black", 1000, "Gold", "full", 160, 3, 1, "KNOWN"],
  ["psu-seasonic-gx1000-white", "Seasonic", "Focus GX-1000 ATX 3 Blanc 1000 W", 170, "white", 1000, "Gold", "full", 140, 3, 1, "KNOWN"],
];

export const PSUS: ComponentOf<"PSU">[] = ROWS.map(
  ([id, brand, model, price, finish, wattageW, efficiency, modular, lengthMM, pcie8, hpwr16, confidence]) => ({
    id, category: "PSU", brand, model, finish, price, confidence,
    specs: { wattageW, efficiency, modular, lengthMM, pcie8, hpwr16 } satisfies PsuSpecs,
  }),
);
