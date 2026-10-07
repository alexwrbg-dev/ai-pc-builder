// ============================================================
// Types canoniques — source de vérité TypeScript (miroir Prisma + specs)
// ============================================================

export type ComponentCategory =
  | "CPU" | "GPU" | "MOTHERBOARD" | "RAM" | "SSD_NVME" | "SSD_SATA" | "HDD"
  | "PSU" | "CASE" | "CPU_COOLER" | "AIO" | "FAN" | "THERMAL_PASTE"
  | "NIC" | "SOUND_CARD" | "EXPANSION" | "OS" | "MONITOR" | "PERIPHERAL";

export type Confidence = "LOW" | "MEDIUM" | "HIGH" | "VERIFIED_MANUFACTURER";
export type Severity = "ok" | "warning" | "error";

export interface CpuSpecs {
  socket: string; chipset?: string[]; cores: number; threads: number;
  baseClockGHz: number; boostClockGHz: number; tdpW: number;
  memoryType: ("DDR4" | "DDR5")[]; maxMemorySpeedMTs: number;
  pcieVersion: string; integratedGraphics: boolean; cacheMB?: number;
}
export interface GpuSpecs {
  lengthMM: number; slots: number; tdpW: number; recommendedPsuW: number;
  powerConnectors: string[]; pcie: string; vramGB: number; vramType: string;
}
export interface MotherboardSpecs {
  socket: string; chipset: string; formFactor: "ATX" | "Micro-ATX" | "Mini-ITX" | "E-ATX";
  ramType: "DDR4" | "DDR5"; ramSlots: number; maxRamGB: number;
  maxRamSpeedMTs: number; m2Slots: number; sataPorts: number;
  pcieX16Version: string; wifi: boolean;
}
export interface RamSpecs {
  type: "DDR4" | "DDR5"; capacityGB: number; sticks: number;
  speedMTs: number; latencyCL?: number;
}
export interface PsuSpecs {
  wattageW: number; efficiency: string; modular: boolean;
  connectors: Record<string, number>; // ex: { "8pin_CPU": 2, "16pin_12VHPWR": 1, "8pin_PCIe": 3 }
}
export interface CaseSpecs {
  supportedFormFactors: string[]; maxGpuLengthMM: number; maxCoolerHeightMM: number;
  radiatorSupportMM: number[]; maxFans?: number; psuFormat?: string;
}
export interface CoolerSpecs {
  sockets: string[]; heightMM?: number; tdpRatingW: number; type: "AIR" | "AIO";
  radiatorMM?: number;
}
export interface StorageSpecs {
  interface: "NVMe" | "SATA" | "HDD"; capacityGB: number; formFactor?: string;
}

export type AnySpecs =
  | CpuSpecs | GpuSpecs | MotherboardSpecs | RamSpecs
  | PsuSpecs | CaseSpecs | CoolerSpecs | StorageSpecs | Record<string, unknown>;

export interface Component {
  id: string; category: ComponentCategory; brand: string; model: string;
  slug: string; imageUrl?: string; msrp?: number;
  specs: AnySpecs;
  source: string; confidence: Confidence; updatedAt: string;
}

export interface MerchantOffer {
  merchant: string; price: number; currency: string;
  inStock: boolean; shipping?: number; url?: string;
  fetchedAt: string; source: string; bestPrice?: boolean;
}

export interface BuildSelection {
  CPU?: string; GPU?: string; MOTHERBOARD?: string; RAM?: string;
  SSD_NVME?: string; PSU?: string; CASE?: string;
  CPU_COOLER?: string; AIO?: string; [k: string]: string | undefined;
}

export interface CompatibilityIssue {
  severity: Severity; // ok n'est jamais stocké, réservé au statut global
  code: string; // ex: SOCKET_MISMATCH
  components: string[]; // ids concernés
  message: string; // explication humaine FR
  fix: string; // solution proposée FR
}

export type CompatibilityStatus = "compatible" | "warning" | "incompatible";

export interface CompatibilityResult {
  status: CompatibilityStatus;
  issues: CompatibilityIssue[];
  checkedAt: string;
  engineVersion: string;
}

export interface BuildScore {
  total: number;
  details: Record<"performance" | "value" | "compatibility" | "balance" | "upgradeability" | "efficiency" | "cooling" | "noise" | "aesthetics", number>;
  reasons: string[];
}

export interface PerfEstimate {
  game: string;
  res1080p: number | null; res1440p: number | null; res4K: number | null;
  estimated: true; confidence: Confidence; note: string;
}
