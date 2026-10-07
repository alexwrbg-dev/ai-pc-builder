// ============================================================
// DONNÉES DE DÉMONSTRATION — NE PAS PRÉSENTER COMME DES DONNÉES RÉELLES
// source="DEMO_SEED", confidence="LOW".
// Toute l'UI doit afficher le badge "Données de démonstration".
// Specs = ordres de grandeur publics (vérifier via constructeur avant achat).
// Import réel : voir DATA_PIPELINE.md + prisma/seed.ts + /api/admin/import.
// ============================================================
import type { Component, MerchantOffer } from "./types";

export const DEMO_NOTICE =
  "Données de démonstration — prix, stocks et disponibilités non contractuels. Vérifiez toujours les fiches constructeurs et marchands.";

export const COMPONENTS: Component[] = [
  // ---------- CPU ----------
  { id: "cpu-r5-7600", category: "CPU", brand: "AMD", model: "Ryzen 5 7600", slug: "ryzen-5-7600",
    specs: { socket: "AM5", cores: 6, threads: 12, baseClockGHz: 3.8, boostClockGHz: 5.1, tdpW: 65,
      memoryType: ["DDR5"], maxMemorySpeedMTs: 5200, pcieVersion: "5.0", integratedGraphics: true, cacheMB: 38 },
    source: "DEMO_SEED", confidence: "LOW", updatedAt: "2026-10-07" },
  { id: "cpu-r7-7800x3d", category: "CPU", brand: "AMD", model: "Ryzen 7 7800X3D", slug: "ryzen-7-7800x3d",
    specs: { socket: "AM5", cores: 8, threads: 16, baseClockGHz: 4.2, boostClockGHz: 5.0, tdpW: 120,
      memoryType: ["DDR5"], maxMemorySpeedMTs: 5200, pcieVersion: "5.0", integratedGraphics: true, cacheMB: 104 },
    source: "DEMO_SEED", confidence: "LOW", updatedAt: "2026-10-07" },
  { id: "cpu-i5-14600k", category: "CPU", brand: "Intel", model: "Core i5-14600K", slug: "core-i5-14600k",
    specs: { socket: "LGA1700", cores: 14, threads: 20, baseClockGHz: 3.5, boostClockGHz: 5.3, tdpW: 125,
      memoryType: ["DDR4", "DDR5"], maxMemorySpeedMTs: 5600, pcieVersion: "5.0", integratedGraphics: true, cacheMB: 44 },
    source: "DEMO_SEED", confidence: "LOW", updatedAt: "2026-10-07" },
  { id: "cpu-r5-5600", category: "CPU", brand: "AMD", model: "Ryzen 5 5600", slug: "ryzen-5-5600",
    specs: { socket: "AM4", cores: 6, threads: 12, baseClockGHz: 3.5, boostClockGHz: 4.4, tdpW: 65,
      memoryType: ["DDR4"], maxMemorySpeedMTs: 3200, pcieVersion: "4.0", integratedGraphics: false, cacheMB: 35 },
    source: "DEMO_SEED", confidence: "LOW", updatedAt: "2026-10-07" },
  // ---------- GPU ----------
  { id: "gpu-rtx4060", category: "GPU", brand: "NVIDIA", model: "GeForce RTX 4060 8GB", slug: "rtx-4060-8gb",
    specs: { lengthMM: 240, slots: 2, tdpW: 115, recommendedPsuW: 450, powerConnectors: ["8pin_PCIe"], pcie: "4.0 x8", vramGB: 8, vramType: "GDDR6" },
    source: "DEMO_SEED", confidence: "LOW", updatedAt: "2026-10-07" },
  { id: "gpu-rtx4070s", category: "GPU", brand: "NVIDIA", model: "GeForce RTX 4070 SUPER 12GB", slug: "rtx-4070-super-12gb",
    specs: { lengthMM: 267, slots: 2, tdpW: 220, recommendedPsuW: 650, powerConnectors: ["16pin_12VHPWR"], pcie: "4.0 x16", vramGB: 12, vramType: "GDDR6X" },
    source: "DEMO_SEED", confidence: "LOW", updatedAt: "2026-10-07" },
  { id: "gpu-rx7800xt", category: "GPU", brand: "AMD", model: "Radeon RX 7800 XT 16GB", slug: "rx-7800-xt-16gb",
    specs: { lengthMM: 287, slots: 2, tdpW: 263, recommendedPsuW: 700, powerConnectors: ["8pin_PCIe", "8pin_PCIe"], pcie: "4.0 x16", vramGB: 16, vramType: "GDDR6" },
    source: "DEMO_SEED", confidence: "LOW", updatedAt: "2026-10-07" },
  { id: "gpu-rtx4090", category: "GPU", brand: "NVIDIA", model: "GeForce RTX 4090 24GB (340mm)", slug: "rtx-4090-24gb",
    specs: { lengthMM: 340, slots: 3, tdpW: 450, recommendedPsuW: 850, powerConnectors: ["16pin_12VHPWR"], pcie: "4.0 x16", vramGB: 24, vramType: "GDDR6X" },
    source: "DEMO_SEED", confidence: "LOW", updatedAt: "2026-10-07" },
  // ---------- Motherboards ----------
  { id: "mb-b650", category: "MOTHERBOARD", brand: "MSI", model: "B650 Tomahawk WiFi (ATX)", slug: "b650-tomahawk-wifi",
    specs: { socket: "AM5", chipset: "B650", formFactor: "ATX", ramType: "DDR5", ramSlots: 4, maxRamGB: 128, maxRamSpeedMTs: 6400, m2Slots: 3, sataPorts: 6, pcieX16Version: "4.0 x16", wifi: true },
    source: "DEMO_SEED", confidence: "LOW", updatedAt: "2026-10-07" },
  { id: "mb-b550m", category: "MOTHERBOARD", brand: "Gigabyte", model: "B550M DS3H (Micro-ATX)", slug: "b550m-ds3h",
    specs: { socket: "AM4", chipset: "B550", formFactor: "Micro-ATX", ramType: "DDR4", ramSlots: 4, maxRamGB: 128, maxRamSpeedMTs: 4733, m2Slots: 2, sataPorts: 4, pcieX16Version: "4.0 x16", wifi: false },
    source: "DEMO_SEED", confidence: "LOW", updatedAt: "2026-10-07" },
  { id: "mb-z790", category: "MOTHERBOARD", brand: "ASUS", model: "Z790-P WiFi (ATX)", slug: "z790-p-wifi",
    specs: { socket: "LGA1700", chipset: "Z790", formFactor: "ATX", ramType: "DDR5", ramSlots: 4, maxRamGB: 192, maxRamSpeedMTs: 7200, m2Slots: 4, sataPorts: 4, pcieX16Version: "5.0 x16", wifi: true },
    source: "DEMO_SEED", confidence: "LOW", updatedAt: "2026-10-07" },
  // ---------- RAM ----------
  { id: "ram-32d5", category: "RAM", brand: "Corsair", model: "Vengeance 32GB (2x16) DDR5-6000", slug: "vengeance-32gb-ddr5-6000",
    specs: { type: "DDR5", capacityGB: 32, sticks: 2, speedMTs: 6000, latencyCL: 30 },
    source: "DEMO_SEED", confidence: "LOW", updatedAt: "2026-10-07" },
  { id: "ram-16d4", category: "RAM", brand: "Kingston", model: "Fury 16GB (2x8) DDR4-3200", slug: "fury-16gb-ddr4-3200",
    specs: { type: "DDR4", capacityGB: 16, sticks: 2, speedMTs: 3200, latencyCL: 16 },
    source: "DEMO_SEED", confidence: "LOW", updatedAt: "2026-10-07" },
  { id: "ram-64d5", category: "RAM", brand: "G.Skill", model: "Trident Z 64GB (2x32) DDR5-6400", slug: "trident-z-64gb-ddr5-6400",
    specs: { type: "DDR5", capacityGB: 64, sticks: 2, speedMTs: 6400, latencyCL: 32 },
    source: "DEMO_SEED", confidence: "LOW", updatedAt: "2026-10-07" },
  // ---------- Storage ----------
  { id: "ssd-1tb", category: "SSD_NVME", brand: "Samsung", model: "980 Pro 1TB NVMe", slug: "980-pro-1tb",
    specs: { interface: "NVMe", capacityGB: 1000, formFactor: "M.2 2280" },
    source: "DEMO_SEED", confidence: "LOW", updatedAt: "2026-10-07" },
  { id: "ssd-2tb", category: "SSD_NVME", brand: "WD", model: "Black SN850X 2TB NVMe", slug: "sn850x-2tb",
    specs: { interface: "NVMe", capacityGB: 2000, formFactor: "M.2 2280" },
    source: "DEMO_SEED", confidence: "LOW", updatedAt: "2026-10-07" },
  // ---------- PSU ----------
  { id: "psu-650", category: "PSU", brand: "Corsair", model: "RM650e 650W Gold", slug: "rm650e-650w",
    specs: { wattageW: 650, efficiency: "80+ Gold", modular: true, connectors: { "8pin_CPU": 2, "8pin_PCIe": 3, "16pin_12VHPWR": 1 } },
    source: "DEMO_SEED", confidence: "LOW", updatedAt: "2026-10-07" },
  { id: "psu-850", category: "PSU", brand: "Seasonic", model: "Focus GX-850 850W Gold", slug: "focus-gx-850",
    specs: { wattageW: 850, efficiency: "80+ Gold", modular: true, connectors: { "8pin_CPU": 2, "8pin_PCIe": 4, "16pin_12VHPWR": 2 } },
    source: "DEMO_SEED", confidence: "LOW", updatedAt: "2026-10-07" },
  { id: "psu-450", category: "PSU", brand: "be quiet!", model: "System Power 450W", slug: "system-power-450w",
    specs: { wattageW: 450, efficiency: "80+ Bronze", modular: false, connectors: { "8pin_CPU": 1, "8pin_PCIe": 1 } },
    source: "DEMO_SEED", confidence: "LOW", updatedAt: "2026-10-07" },
  // ---------- Cases ----------
  { id: "case-nzxt", category: "CASE", brand: "NZXT", model: "H5 Flow (ATX, 330mm GPU max)", slug: "h5-flow",
    specs: { supportedFormFactors: ["ATX", "Micro-ATX", "Mini-ITX"], maxGpuLengthMM: 330, maxCoolerHeightMM: 165, radiatorSupportMM: [240, 280, 360] },
    source: "DEMO_SEED", confidence: "LOW", updatedAt: "2026-10-07" },
  { id: "case-nr200", category: "CASE", brand: "Cooler Master", model: "NR200 (Mini-ITX, 330mm)", slug: "nr200",
    specs: { supportedFormFactors: ["Mini-ITX"], maxGpuLengthMM: 330, maxCoolerHeightMM: 155, radiatorSupportMM: [240, 280] },
    source: "DEMO_SEED", confidence: "LOW", updatedAt: "2026-10-07" },
  { id: "case-fractal", category: "CASE", brand: "Fractal", model: "North XL (E-ATX, 413mm GPU)", slug: "north-xl",
    specs: { supportedFormFactors: ["E-ATX", "ATX", "Micro-ATX", "Mini-ITX"], maxGpuLengthMM: 413, maxCoolerHeightMM: 185, radiatorSupportMM: [240, 280, 360, 420] },
    source: "DEMO_SEED", confidence: "LOW", updatedAt: "2026-10-07" },
  // ---------- Cooling ----------
  { id: "cooler-ak400", category: "CPU_COOLER", brand: "DeepCool", model: "AK400 (air, 155mm)", slug: "ak400",
    specs: { sockets: ["AM4", "AM5", "LGA1700"], heightMM: 155, tdpRatingW: 220, type: "AIR" },
    source: "DEMO_SEED", confidence: "LOW", updatedAt: "2026-10-07" },
  { id: "cooler-nhd15", category: "CPU_COOLER", brand: "Noctua", model: "NH-D15 (air, 165mm)", slug: "nh-d15",
    specs: { sockets: ["AM4", "AM5", "LGA1700"], heightMM: 165, tdpRatingW: 280, type: "AIR" },
    source: "DEMO_SEED", confidence: "LOW", updatedAt: "2026-10-07" },
  { id: "aio-360", category: "AIO", brand: "Arctic", model: "Liquid Freezer 360mm", slug: "liquid-freezer-360",
    specs: { sockets: ["AM4", "AM5", "LGA1700"], tdpRatingW: 350, type: "AIO", radiatorMM: 360 },
    source: "DEMO_SEED", confidence: "LOW", updatedAt: "2026-10-07" },
];

export const byId = (id: string): Component | undefined => COMPONENTS.find((c) => c.id === id);
export const byCategory = (cat: Component["category"]): Component[] =>
  COMPONENTS.filter((c) => c.category === cat);

// Prix DEMO — clairement non contractuels
export const DEMO_PRICES: Record<string, MerchantOffer[]> = {
  "cpu-r5-7600": [
    { merchant: "Amazon (démo)", price: 199, currency: "EUR", inStock: true, fetchedAt: "2026-10-07", source: "DEMO_SEED" },
    { merchant: "LDLC (démo)", price: 219, currency: "EUR", inStock: true, fetchedAt: "2026-10-07", source: "DEMO_SEED" },
  ],
  "cpu-r7-7800x3d": [
    { merchant: "Amazon (démo)", price: 349, currency: "EUR", inStock: true, fetchedAt: "2026-10-07", source: "DEMO_SEED" },
    { merchant: "TopAchat (démo)", price: 369, currency: "EUR", inStock: false, fetchedAt: "2026-10-07", source: "DEMO_SEED" },
  ],
  "cpu-i5-14600k": [
    { merchant: "Amazon (démo)", price: 289, currency: "EUR", inStock: true, fetchedAt: "2026-10-07", source: "DEMO_SEED" },
  ],
  "gpu-rtx4060": [
    { merchant: "Amazon (démo)", price: 299, currency: "EUR", inStock: true, fetchedAt: "2026-10-07", source: "DEMO_SEED" },
    { merchant: "LDLC (démo)", price: 329, currency: "EUR", inStock: true, fetchedAt: "2026-10-07", source: "DEMO_SEED" },
  ],
  "gpu-rtx4070s": [
    { merchant: "Amazon (démo)", price: 649, currency: "EUR", inStock: true, fetchedAt: "2026-10-07", source: "DEMO_SEED" },
    { merchant: "Materiel.net (démo)", price: 679, currency: "EUR", inStock: true, fetchedAt: "2026-10-07", source: "DEMO_SEED" },
  ],
  "gpu-rx7800xt": [
    { merchant: "TopAchat (démo)", price: 499, currency: "EUR", inStock: true, fetchedAt: "2026-10-07", source: "DEMO_SEED" },
  ],
  "gpu-rtx4090": [
    { merchant: "LDLC (démo)", price: 1799, currency: "EUR", inStock: true, fetchedAt: "2026-10-07", source: "DEMO_SEED" },
  ],
};

export function demoBestPrice(id: string): MerchantOffer | null {
  const offers = DEMO_PRICES[id];
  if (!offers?.length) return null;
  const sorted = [...offers].sort((a, b) => a.price - b.price);
  return { ...sorted[0], bestPrice: true };
}

// Estimation FPS — ORDRES DE GRANDEUR, jamais des mesures. Marqué estimated:true.
export const DEMO_FPS: Record<string, Record<string, { p1080: number; p1440: number; p2160: number }>> = {
  "gpu-rtx4060": {
    "Cyberpunk 2077": { p1080: 75, p1440: 52, p2160: 28 },
    "Fortnite": { p1080: 165, p1440: 120, p2160: 65 },
    "Valorant": { p1080: 380, p1440: 300, p2160: 180 },
  },
  "gpu-rtx4070s": {
    "Cyberpunk 2077": { p1080: 110, p1440: 82, p2160: 48 },
    "Fortnite": { p1080: 240, p1440: 175, p2160: 95 },
    "Call of Duty": { p1080: 170, p1440: 130, p2160: 75 },
  },
  "gpu-rx7800xt": {
    "Cyberpunk 2077": { p1080: 105, p1440: 78, p2160: 44 },
    "Fortnite": { p1080: 230, p1440: 165, p2160: 90 },
  },
  "gpu-rtx4090": {
    "Cyberpunk 2077": { p1080: 165, p1440: 135, p2160: 95 },
    "Alan Wake 2": { p1080: 140, p1440: 110, p2160: 75 },
  },
};
