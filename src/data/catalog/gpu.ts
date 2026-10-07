import type { ComponentOf, Confidence, Finish, GpuSpecs } from "@/lib/types";

/** Par puce : VRAM, consommation, indice de performance (RTX 5070 = 100, estimation). */
const CHIP: Record<string, { vramGB: number; tdpW: number; perfIndex: number }> = {
  "RTX 5050": { vramGB: 8, tdpW: 130, perfIndex: 47 },
  "Arc B580": { vramGB: 12, tdpW: 190, perfIndex: 56 },
  "RTX 5060": { vramGB: 8, tdpW: 145, perfIndex: 62 },
  "RTX 5060 Ti 8 Go": { vramGB: 8, tdpW: 180, perfIndex: 71 },
  "RX 9060 XT 16 Go": { vramGB: 16, tdpW: 160, perfIndex: 72 },
  "RTX 5060 Ti 16 Go": { vramGB: 16, tdpW: 180, perfIndex: 73 },
  "RTX 5070": { vramGB: 12, tdpW: 250, perfIndex: 100 },
  "RX 9070": { vramGB: 16, tdpW: 220, perfIndex: 104 },
  "RX 9070 XT": { vramGB: 16, tdpW: 304, perfIndex: 117 },
  "RTX 5070 Ti": { vramGB: 16, tdpW: 300, perfIndex: 123 },
  "RTX 5080": { vramGB: 16, tdpW: 360, perfIndex: 141 },
  "RTX 5090": { vramGB: 32, tdpW: 575, perfIndex: 195 },
};

type Row = [
  id: string, brand: string, model: string, chipset: string, price: number, finish: Finish,
  lengthMM: number, heightMM: number, thicknessMM: number, fans: number,
  recommendedPsuW: number, power8pin: number, power16pin: number, confidence: Confidence,
];

// Dimensions et connecteurs relus sur les fiches MSI, Gigabyte, ASUS et revendeurs (octobre 2026).
const ROWS: Row[] = [
  ["gpu-gb-5050-lp", "Gigabyte", "GeForce RTX 5050 OC Low Profile 8G", "RTX 5050", 404, "black", 182, 69, 36, 3, 550, 1, 0, "VERIFIED"],
  ["gpu-intel-b580-le", "Intel", "Arc B580 Limited Edition 12 Go", "Arc B580", 360, "black", 272, 115, 45, 2, 600, 1, 0, "KNOWN"],
  ["gpu-msi-5060-gaming-oc", "MSI", "GeForce RTX 5060 8G Gaming OC", "RTX 5060", 480, "black", 248, 135, 41, 2, 550, 1, 0, "VERIFIED"],
  ["gpu-gb-5060-gaming-oc", "Gigabyte", "GeForce RTX 5060 Gaming OC 8G", "RTX 5060", 525, "black", 281, 119, 40, 3, 550, 1, 0, "VERIFIED"],
  ["gpu-asus-5060-dual", "ASUS", "Dual GeForce RTX 5060 8GB OC", "RTX 5060", 560, "black", 228, 123, 50, 2, 550, 1, 0, "VERIFIED"],
  ["gpu-msi-5060ti8-ventus2x", "MSI", "GeForce RTX 5060 Ti 8G Ventus 2X OC Plus", "RTX 5060 Ti 8 Go", 440, "black", 227, 126, 41, 2, 600, 1, 0, "VERIFIED"],
  ["gpu-gb-5060ti8-windforce", "Gigabyte", "GeForce RTX 5060 Ti Windforce OC 8G", "RTX 5060 Ti 8 Go", 557, "black", 208, 120, 40, 2, 650, 1, 0, "VERIFIED"],
  ["gpu-gb-9060xt-gaming-oc", "Gigabyte", "Radeon RX 9060 XT Gaming OC 16G", "RX 9060 XT 16 Go", 620, "black", 281, 118, 40, 3, 450, 1, 0, "VERIFIED"],
  ["gpu-asus-9060xt-prime", "ASUS", "Prime Radeon RX 9060 XT 16GB OC", "RX 9060 XT 16 Go", 599, "black", 304, 126, 50, 3, 550, 1, 0, "VERIFIED"],
  ["gpu-asus-5060ti16-dual", "ASUS", "Dual GeForce RTX 5060 Ti 16GB OC", "RTX 5060 Ti 16 Go", 771, "black", 229, 120, 50, 2, 550, 1, 0, "VERIFIED"],
  ["gpu-asus-5060ti16-prime", "ASUS", "Prime GeForce RTX 5060 Ti 16GB OC", "RTX 5060 Ti 16 Go", 830, "black", 304, 120, 50, 3, 550, 1, 0, "VERIFIED"],
  ["gpu-sapphire-9070-pulse", "Sapphire", "Pulse Radeon RX 9070 16GB", "RX 9070", 825, "black", 280, 120, 52, 2, 650, 2, 0, "VERIFIED"],
  ["gpu-gb-5070-gaming-oc", "Gigabyte", "GeForce RTX 5070 Gaming OC 12G", "RTX 5070", 890, "black", 327, 132, 56, 3, 750, 0, 1, "VERIFIED"],
  ["gpu-msi-5070-ventus2x", "MSI", "GeForce RTX 5070 12G Ventus 2X OC", "RTX 5070", 900, "black", 236, 126, 50, 2, 650, 0, 1, "VERIFIED"],
  ["gpu-gb-5070-windforce-sff", "Gigabyte", "GeForce RTX 5070 Windforce OC SFF 12G", "RTX 5070", 900, "black", 282, 110, 50, 3, 750, 0, 1, "VERIFIED"],
  ["gpu-sapphire-9070xt-pulse", "Sapphire", "Pulse Radeon RX 9070 XT 16GB", "RX 9070 XT", 880, "black", 320, 120, 62, 3, 750, 2, 0, "VERIFIED"],
  ["gpu-asus-9070xt-prime", "ASUS", "Prime Radeon RX 9070 XT OC 16GB", "RX 9070 XT", 883, "black", 312, 130, 50, 3, 750, 3, 0, "VERIFIED"],
  ["gpu-sapphire-9070xt-pure", "Sapphire", "Pure Radeon RX 9070 XT 16GB", "RX 9070 XT", 890, "white", 320, 120, 62, 3, 750, 2, 0, "VERIFIED"],
  ["gpu-gb-9070xt-gaming-oc", "Gigabyte", "Radeon RX 9070 XT Gaming OC 16G", "RX 9070 XT", 931, "black", 288, 132, 56, 3, 850, 3, 0, "VERIFIED"],
  ["gpu-gb-5070ti-windforce-sff", "Gigabyte", "GeForce RTX 5070 Ti Windforce OC SFF 16G", "RTX 5070 Ti", 1280, "black", 304, 126, 50, 3, 750, 0, 1, "VERIFIED"],
  ["gpu-msi-5070ti-ventus3x", "MSI", "GeForce RTX 5070 Ti 16G Ventus 3X OC", "RTX 5070 Ti", 1300, "black", 303, 121, 49, 3, 750, 0, 1, "VERIFIED"],
  ["gpu-gb-5070ti-eagle-ice", "Gigabyte", "GeForce RTX 5070 Ti Eagle OC ICE SFF 16G", "RTX 5070 Ti", 1320, "white", 304, 126, 50, 3, 750, 0, 1, "VERIFIED"],
  ["gpu-msi-5070ti-gaming-trio", "MSI", "GeForce RTX 5070 Ti 16G Gaming Trio OC", "RTX 5070 Ti", 1350, "black", 338, 140, 50, 3, 750, 0, 1, "VERIFIED"],
  ["gpu-asus-5080-prime", "ASUS", "Prime GeForce RTX 5080 16GB OC", "RTX 5080", 1572, "black", 304, 126, 50, 3, 850, 0, 1, "VERIFIED"],
  ["gpu-msi-5080-gaming-trio", "MSI", "GeForce RTX 5080 16G Gaming Trio OC", "RTX 5080", 1611, "black", 338, 140, 50, 3, 850, 0, 1, "VERIFIED"],
  ["gpu-gb-5080-windforce-sff", "Gigabyte", "GeForce RTX 5080 Windforce OC SFF 16G", "RTX 5080", 1650, "black", 304, 126, 50, 3, 850, 0, 1, "VERIFIED"],
  ["gpu-gb-5080-aero-sff", "Gigabyte", "GeForce RTX 5080 Aero OC SFF 16G", "RTX 5080", 1800, "white", 304, 126, 50, 3, 850, 0, 1, "VERIFIED"],
  ["gpu-msi-5090-ventus3x", "MSI", "GeForce RTX 5090 32G Ventus 3X OC", "RTX 5090", 5900, "black", 325, 139, 67, 3, 1000, 0, 1, "VERIFIED"],
];

export const GPUS: ComponentOf<"GPU">[] = ROWS.map(
  ([id, brand, model, chipset, price, finish, lengthMM, heightMM, thicknessMM, fans, recommendedPsuW, power8pin, power16pin, confidence]) => ({
    id, category: "GPU", brand, model, finish, price, confidence,
    specs: { chipset, ...CHIP[chipset], lengthMM, heightMM, thicknessMM, fans, recommendedPsuW, power8pin, power16pin } satisfies GpuSpecs,
  }),
);
