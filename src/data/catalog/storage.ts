import type { ComponentOf, StorageSpecs } from "@/lib/types";

type Row = [id: string, brand: string, model: string, price: number, iface: "NVMe" | "SATA", capacityGB: number, readMBs: number];

const ROWS: Row[] = [
  // ---- NVMe M.2 ----
  ["ssd-nv3-500", "Kingston", "NV3 500 Go", 104, "NVMe", 500, 5000],
  ["ssd-e100-1tb", "Crucial", "E100 1 To", 150, "NVMe", 1000, 5000],
  ["ssd-nv3-1tb", "Kingston", "NV3 1 To", 154, "NVMe", 1000, 6000],
  ["ssd-sn3000-1tb", "Western Digital", "WD Green SN3000 1 To", 158, "NVMe", 1000, 5000],
  ["ssd-990-evo-plus-1tb", "Samsung", "990 EVO Plus 1 To", 180, "NVMe", 1000, 7150],
  ["ssd-sn7100-1tb", "Western Digital", "WD Black SN7100 1 To", 196, "NVMe", 1000, 7250],
  ["ssd-990-pro-1tb", "Samsung", "990 PRO 1 To", 200, "NVMe", 1000, 7450],
  ["ssd-9100-pro-1tb", "Samsung", "9100 PRO 1 To", 200, "NVMe", 1000, 14700],
  ["ssd-kc3000-1tb", "Kingston", "KC3000 1 To", 222, "NVMe", 1000, 7000],
  ["ssd-t705-1tb", "Crucial", "T705 1 To", 246, "NVMe", 1000, 13600],
  ["ssd-sn3000-2tb", "Western Digital", "WD Green SN3000 2 To", 244, "NVMe", 2000, 5000],
  ["ssd-nv3-2tb", "Kingston", "NV3 2 To", 250, "NVMe", 2000, 6000],
  ["ssd-mp600-elite-2tb", "Corsair", "MP600 Elite 2 To", 260, "NVMe", 2000, 7000],
  ["ssd-p310-2tb", "Crucial", "P310 2 To", 266, "NVMe", 2000, 7100],
  ["ssd-990-evo-plus-2tb", "Samsung", "990 EVO Plus 2 To", 280, "NVMe", 2000, 7250],
  ["ssd-kc3000-2tb", "Kingston", "KC3000 2 To", 346, "NVMe", 2000, 7000],
  ["ssd-990-pro-2tb", "Samsung", "990 PRO 2 To", 350, "NVMe", 2000, 7450],
  ["ssd-9100-pro-2tb", "Samsung", "9100 PRO 2 To", 412, "NVMe", 2000, 14700],
  ["ssd-renegade-g5-2tb", "Kingston", "Fury Renegade G5 2 To", 412, "NVMe", 2000, 14700],
  ["ssd-nv3-4tb", "Kingston", "NV3 4 To", 549, "NVMe", 4000, 6000],
  ["ssd-990-evo-plus-4tb", "Samsung", "990 EVO Plus 4 To", 599, "NVMe", 4000, 7250],
  ["ssd-990-pro-4tb", "Samsung", "990 PRO 4 To", 600, "NVMe", 4000, 7450],
  // ---- SATA 2,5 pouces ----
  ["ssd-a400-960", "Kingston", "A400 960 Go SATA", 140, "SATA", 960, 500],
  ["ssd-870-evo-1tb", "Samsung", "870 EVO 1 To SATA", 266, "SATA", 1000, 560],
];

export const SSDS: ComponentOf<"SSD">[] = ROWS.map(([id, brand, model, price, iface, capacityGB, readMBs]) => ({
  id, category: "SSD", brand, model, finish: "black", price, confidence: "KNOWN",
  specs: { interface: iface, capacityGB, readMBs } satisfies StorageSpecs,
}));
