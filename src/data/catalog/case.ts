import type { CaseSpecs, ComponentOf, Confidence, Finish, FormFactor } from "@/lib/types";

const ATX: FormFactor[] = ["ATX", "Micro-ATX", "Mini-ITX"];
const EATX: FormFactor[] = ["E-ATX", "ATX", "Micro-ATX", "Mini-ITX"];
const MATX: FormFactor[] = ["Micro-ATX", "Mini-ITX"];

type Row = [
  id: string, brand: string, model: string, price: number, finish: Finish, formFactors: FormFactor[],
  maxGpuLengthMM: number, maxCoolerHeightMM: number,
  radiatorTopMM: number, radiatorFrontMM: number, radiatorSideMM: number, psuMaxLengthMM: number,
  h: number, w: number, d: number, layout: CaseSpecs["layout"], front: CaseSpecs["front"],
  includedFans: number, rgbFans: boolean, confidence: Confidence,
];

// Dégagements relus sur les fiches NZXT, Fractal Design, Corsair, MSI et be quiet! (octobre 2026).
const ROWS: Row[] = [
  ["case-msi-forge-100r", "MSI", "MAG Forge 100R", 51, "black", ATX, 330, 160, 240, 240, 0, 200, 499, 210, 421, "standard", "mesh", 3, true, "VERIFIED"],
  ["case-corsair-3200d-black", "Corsair", "3200D RS Noir", 59, "black", ATX, 375, 165, 360, 0, 0, 180, 495, 219, 458, "standard", "mesh", 3, false, "VERIFIED"],
  ["case-corsair-3200d-white", "Corsair", "3200D RS Blanc", 60, "white", ATX, 375, 165, 360, 0, 0, 180, 495, 219, 458, "standard", "mesh", 3, false, "VERIFIED"],
  ["case-nzxt-h3-flow-white", "NZXT", "H3 Flow Blanc", 60, "white", MATX, 352, 170, 240, 280, 0, 185, 400, 225, 389, "standard", "mesh", 1, false, "VERIFIED"],
  ["case-msi-pano-110r-black", "MSI", "MAG Pano 110R PZ Noir", 68, "black", ATX, 400, 160, 360, 0, 0, 200, 485, 225, 420, "standard", "glass", 4, true, "VERIFIED"],
  ["case-msi-pano-110r-white", "MSI", "MAG Pano 110R PZ Blanc", 70, "white", ATX, 400, 160, 360, 0, 0, 200, 485, 225, 420, "standard", "glass", 4, true, "VERIFIED"],
  ["case-msi-forge-320r", "MSI", "MAG Forge 320R Airflow", 75, "black", ATX, 390, 160, 360, 240, 0, 200, 498, 210, 472, "standard", "mesh", 4, true, "VERIFIED"],
  ["case-nzxt-h5-flow-rgb", "NZXT", "H5 Flow RGB (2024) Noir", 75, "black", ATX, 410, 165, 240, 360, 0, 200, 465, 225, 430, "standard", "mesh", 4, true, "KNOWN"],
  ["case-fractal-pop2-vision-black", "Fractal Design", "Pop 2 Vision RGB Noir", 75, "black", EATX, 412, 172, 360, 0, 0, 190, 441, 297, 434, "dual", "glass", 4, true, "VERIFIED"],
  ["case-bq-pure-base-501", "be quiet!", "Pure Base 501 Airflow Noir", 79, "black", ATX, 368, 178, 240, 360, 0, 180, 463, 231, 450, "standard", "mesh", 2, false, "VERIFIED"],
  ["case-fractal-pop2-vision-white", "Fractal Design", "Pop 2 Vision RGB Blanc", 95, "white", EATX, 412, 172, 360, 0, 0, 190, 441, 297, 434, "dual", "glass", 4, true, "VERIFIED"],
  ["case-corsair-4000d-rs-argb", "Corsair", "Frame 4000D RS ARGB Noir", 98, "black", EATX, 430, 170, 360, 360, 360, 220, 486, 239, 490, "standard", "mesh", 3, true, "VERIFIED"],
  ["case-nzxt-h9-flow-black", "NZXT", "H9 Flow (2025) Noir", 99, "black", EATX, 459, 165, 420, 420, 0, 200, 506, 315, 481, "dual", "glass", 4, false, "KNOWN"],
  ["case-nzxt-h6-flow-white", "NZXT", "H6 Flow Blanc", 100, "white", ATX, 365, 163, 360, 0, 0, 200, 435, 287, 415, "dual", "glass", 3, false, "VERIFIED"],
  ["case-fractal-north-black", "Fractal Design", "North Mesh Noir", 109, "black", ATX, 355, 145, 240, 360, 0, 255, 469, 215, 447, "standard", "wood", 2, false, "VERIFIED"],
  ["case-fractal-north-white", "Fractal Design", "North Mesh Blanc", 112, "white", ATX, 355, 145, 240, 360, 0, 255, 469, 215, 447, "standard", "wood", 2, false, "VERIFIED"],
  ["case-nzxt-h9-flow-white", "NZXT", "H9 Flow (2025) Blanc", 118, "white", EATX, 459, 165, 420, 420, 0, 200, 506, 315, 481, "dual", "glass", 4, false, "KNOWN"],
  ["case-corsair-5000d-rs-argb-white", "Corsair", "Frame 5000D RS ARGB Blanc", 143, "white", EATX, 450, 175, 420, 360, 360, 220, 542, 250, 556, "standard", "mesh", 4, true, "VERIFIED"],
  ["case-fractal-north-xl", "Fractal Design", "North XL Mesh Noir", 148, "black", EATX, 413, 185, 360, 420, 0, 290, 509, 240, 503, "standard", "wood", 3, false, "VERIFIED"],
  ["case-bq-silent-base-802", "be quiet!", "Silent Base 802 Window Noir", 169, "black", EATX, 432, 185, 360, 420, 0, 288, 553, 281, 539, "standard", "solid", 3, false, "KNOWN"],
];

export const CASES: ComponentOf<"CASE">[] = ROWS.map(
  ([id, brand, model, price, finish, formFactors, maxGpuLengthMM, maxCoolerHeightMM, radiatorTopMM, radiatorFrontMM, radiatorSideMM,
    psuMaxLengthMM, h, w, d, layout, front, includedFans, rgbFans, confidence]) => ({
    id, category: "CASE", brand, model, finish, price, confidence,
    specs: {
      formFactors, maxGpuLengthMM, maxCoolerHeightMM, radiatorTopMM, radiatorFrontMM, radiatorSideMM,
      psuMaxLengthMM, dims: { h, w, d }, layout, front, includedFans, rgbFans,
    } satisfies CaseSpecs,
  }),
);
