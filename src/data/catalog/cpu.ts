import type { ComponentOf, CpuSpecs, RamType } from "@/lib/types";

type Row = [
  id: string, brand: string, model: string, price: number,
  socket: string, cores: number, threads: number, boostGHz: number,
  tdpW: number, peakW: number, igpu: boolean, coolerIncluded: boolean,
  released: string, gamingIndex: number, multiIndex: number,
];

const MEM: Record<string, RamType[]> = {
  AM5: ["DDR5"], AM4: ["DDR4"], LGA1700: ["DDR4", "DDR5"], LGA1851: ["DDR5"],
};

// Prix : plus bas relevés début octobre 2026. Indices : estimations issues de moyennes de tests publics.
const ROWS: Row[] = [
  // ---- AMD AM5 ----
  ["cpu-r5-8400f", "AMD", "Ryzen 5 8400F", 140, "AM5", 6, 12, 4.7, 65, 88, false, true, "2024-04", 55, 30],
  ["cpu-r5-7500f", "AMD", "Ryzen 5 7500F", 150, "AM5", 6, 12, 5.0, 65, 88, false, false, "2023-07", 70, 34],
  ["cpu-r5-9600x", "AMD", "Ryzen 5 9600X", 175, "AM5", 6, 12, 5.4, 65, 88, true, false, "2024-08", 77, 40],
  ["cpu-r5-7600", "AMD", "Ryzen 5 7600", 179, "AM5", 6, 12, 5.1, 65, 88, true, true, "2023-01", 71, 35],
  ["cpu-r5-7600x", "AMD", "Ryzen 5 7600X", 190, "AM5", 6, 12, 5.3, 105, 142, true, false, "2022-09", 73, 37],
  ["cpu-r5-7500x3d", "AMD", "Ryzen 5 7500X3D", 210, "AM5", 6, 12, 4.5, 65, 88, true, false, "2025-11", 80, 33],
  ["cpu-r7-7700x", "AMD", "Ryzen 7 7700X", 236, "AM5", 8, 16, 5.4, 105, 142, true, false, "2022-09", 76, 47],
  ["cpu-r7-7800x3d", "AMD", "Ryzen 7 7800X3D", 300, "AM5", 8, 16, 5.0, 120, 162, true, false, "2023-04", 90, 44],
  ["cpu-r9-9900x", "AMD", "Ryzen 9 9900X", 312, "AM5", 12, 24, 5.6, 120, 162, true, false, "2024-08", 80, 78],
  ["cpu-r7-9700x", "AMD", "Ryzen 7 9700X", 321, "AM5", 8, 16, 5.5, 65, 88, true, false, "2024-08", 80, 50],
  ["cpu-r7-9800x3d", "AMD", "Ryzen 7 9800X3D", 380, "AM5", 8, 16, 5.2, 120, 162, true, false, "2024-11", 100, 54],
  ["cpu-r7-9850x3d", "AMD", "Ryzen 7 9850X3D", 433, "AM5", 8, 16, 5.6, 120, 162, true, false, "2026-01", 102, 55],
  ["cpu-r9-9950x", "AMD", "Ryzen 9 9950X", 507, "AM5", 16, 32, 5.7, 170, 230, true, false, "2024-08", 82, 100],
  // ---- AMD AM4 ----
  ["cpu-r5-5500", "AMD", "Ryzen 5 5500", 95, "AM4", 6, 12, 4.2, 65, 88, false, true, "2022-04", 46, 26],
  ["cpu-r5-5600xt", "AMD", "Ryzen 5 5600XT", 148, "AM4", 6, 12, 4.7, 65, 88, false, true, "2024-10", 56, 28],
  ["cpu-r5-5600g", "AMD", "Ryzen 5 5600G", 160, "AM4", 6, 12, 4.4, 65, 88, true, true, "2021-04", 48, 26],
  // ---- Intel LGA1700 ----
  ["cpu-i3-14100f", "Intel", "Core i3-14100F", 100, "LGA1700", 4, 8, 4.7, 58, 110, false, true, "2024-01", 50, 20],
  ["cpu-i5-14400f", "Intel", "Core i5-14400F", 147, "LGA1700", 10, 16, 4.7, 65, 148, false, true, "2024-01", 64, 38],
  ["cpu-i5-12400f", "Intel", "Core i5-12400F", 160, "LGA1700", 6, 12, 4.4, 65, 117, false, true, "2022-01", 58, 30],
  ["cpu-i5-14600kf", "Intel", "Core i5-14600KF", 218, "LGA1700", 14, 20, 5.3, 125, 181, false, false, "2023-10", 78, 58],
  ["cpu-i7-14700kf", "Intel", "Core i7-14700KF", 346, "LGA1700", 20, 28, 5.6, 125, 253, false, false, "2023-10", 84, 82],
  ["cpu-i9-14900kf", "Intel", "Core i9-14900KF", 475, "LGA1700", 24, 32, 6.0, 125, 253, false, false, "2023-10", 86, 92],
  // ---- Intel LGA1851 ----
  ["cpu-u5-225f", "Intel", "Core Ultra 5 225F", 163, "LGA1851", 10, 10, 4.9, 65, 121, false, true, "2025-01", 62, 36],
  ["cpu-u5-245k", "Intel", "Core Ultra 5 245K", 196, "LGA1851", 14, 14, 5.2, 125, 159, true, false, "2024-10", 74, 60],
  ["cpu-u5-250k-plus", "Intel", "Core Ultra 5 250K Plus", 233, "LGA1851", 18, 18, 5.3, 125, 159, true, false, "2026-03", 78, 70],
  ["cpu-u7-265kf", "Intel", "Core Ultra 7 265KF", 270, "LGA1851", 20, 20, 5.5, 125, 250, false, false, "2024-10", 80, 85],
  ["cpu-u7-270k-plus", "Intel", "Core Ultra 7 270K Plus", 338, "LGA1851", 24, 24, 5.5, 125, 250, true, false, "2026-03", 85, 96],
  ["cpu-u9-285k", "Intel", "Core Ultra 9 285K", 570, "LGA1851", 24, 24, 5.7, 125, 250, true, false, "2024-10", 82, 100],
];

export const CPUS: ComponentOf<"CPU">[] = ROWS.map(
  ([id, brand, model, price, socket, cores, threads, boostGHz, tdpW, peakW, igpu, coolerIncluded, released, gamingIndex, multiIndex]) => ({
    id, category: "CPU", brand, model, finish: "silver", price, confidence: "KNOWN",
    specs: { socket, cores, threads, boostGHz, tdpW, peakW, memoryTypes: MEM[socket], igpu, coolerIncluded, released, gamingIndex, multiIndex } satisfies CpuSpecs,
  }),
);
