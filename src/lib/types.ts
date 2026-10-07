// ============================================================
// Types canoniques — source de vérité TypeScript du catalogue et du moteur.
// Toutes les dimensions sont en millimètres, les puissances en watts.
// ============================================================

/** Les 8 emplacements d'une configuration. */
export const CATEGORIES = ["CPU", "GPU", "MOTHERBOARD", "RAM", "SSD", "PSU", "CASE", "COOLER"] as const;
export type ComponentCategory = (typeof CATEGORIES)[number];

/** Pièces sans lesquelles un PC ne démarre pas (GPU et ventirad dépendent du CPU). */
export const ESSENTIAL: ComponentCategory[] = ["CPU", "MOTHERBOARD", "RAM", "SSD", "PSU", "CASE"];

export const CATEGORY_LABEL: Record<ComponentCategory, string> = {
  CPU: "Processeur",
  GPU: "Carte graphique",
  MOTHERBOARD: "Carte mère",
  RAM: "Mémoire",
  SSD: "Stockage",
  PSU: "Alimentation",
  CASE: "Boîtier",
  COOLER: "Refroidissement",
};

/**
 * VERIFIED : dimensions et connecteurs relus sur la fiche constructeur ou revendeur.
 * KNOWN    : specs publiques connues, pas relues une par une.
 */
export type Confidence = "VERIFIED" | "KNOWN";

export type FormFactor = "E-ATX" | "ATX" | "Micro-ATX" | "Mini-ITX";
export type RamType = "DDR4" | "DDR5";
export type Finish = "black" | "white" | "silver";

export interface CpuSpecs {
  socket: string;
  cores: number;
  threads: number;
  boostGHz: number;
  /** TDP annoncé. */
  tdpW: number;
  /** Consommation réelle maximale (PPT chez AMD, PL2 chez Intel). */
  peakW: number;
  memoryTypes: RamType[];
  igpu: boolean;
  coolerIncluded: boolean;
  /** Mois de sortie AAAA-MM, sert à détecter un BIOS trop ancien. */
  released: string;
  /** Indice de performance en jeu, Ryzen 7 9800X3D = 100 (estimation). */
  gamingIndex: number;
  /** Indice multi-cœur, Ryzen 9 9950X = 100 (estimation). */
  multiIndex: number;
}

export interface GpuSpecs {
  chipset: string;
  vramGB: number;
  lengthMM: number;
  /** Hauteur de la carte, du slot PCIe vers le panneau latéral. */
  heightMM: number;
  thicknessMM: number;
  fans: number;
  tdpW: number;
  /** Alimentation recommandée par le constructeur de la carte. */
  recommendedPsuW: number;
  power8pin: number;
  power16pin: number;
  /** Indice de performance en rastérisation 1440p, RTX 5070 = 100 (estimation). */
  perfIndex: number;
}

export interface MotherboardSpecs {
  socket: string;
  chipset: string;
  formFactor: FormFactor;
  ramType: RamType;
  ramSlots: number;
  maxRamGB: number;
  m2Slots: number;
  wifi: boolean;
  /** Mois de sortie de la carte ou de son chipset, AAAA-MM. */
  released: string;
  /** 1 = entrée de gamme, 2 = milieu, 3 = haut de gamme (étages d'alimentation). */
  tier: 1 | 2 | 3;
}

export interface RamSpecs {
  type: RamType;
  capacityGB: number;
  sticks: number;
  speedMTs: number;
  cl: number;
  heightMM: number;
  rgb: boolean;
}

export interface StorageSpecs {
  interface: "NVMe" | "SATA";
  capacityGB: number;
  /** Débit séquentiel en lecture, Mo/s. */
  readMBs: number;
}

export interface PsuSpecs {
  wattageW: number;
  efficiency: "Bronze" | "Gold" | "Platinum" | "Titanium";
  modular: "full" | "none";
  lengthMM: number;
  /** Nombre de connecteurs PCIe 6+2 broches. */
  pcie8: number;
  /** Nombre de connecteurs 16 broches natifs (12VHPWR / 12V-2x6). */
  hpwr16: number;
}

export interface CaseSpecs {
  formFactors: FormFactor[];
  maxGpuLengthMM: number;
  maxCoolerHeightMM: number;
  /** Plus grand radiateur accepté par emplacement, 0 = aucun. */
  radiatorTopMM: number;
  radiatorFrontMM: number;
  radiatorSideMM: number;
  psuMaxLengthMM: number;
  /** Dimensions extérieures : hauteur, largeur, profondeur. */
  dims: { h: number; w: number; d: number };
  /** dual = alimentation derrière la carte mère (boîtier « aquarium »). */
  layout: "standard" | "dual";
  front: "mesh" | "glass" | "wood" | "solid";
  includedFans: number;
  rgbFans: boolean;
}

export interface CoolerSpecs {
  kind: "AIR" | "AIO";
  sockets: string[];
  /** Ventirad : hauteur totale. */
  heightMM?: number;
  /** Watercooling : longueur nominale du radiateur (240, 280, 360, 420). */
  radiatorMM?: number;
  /** Puissance dissipable annoncée ou estimée. */
  tdpRatingW: number;
  fans: number;
  rgb: boolean;
}

export interface SpecsByCategory {
  CPU: CpuSpecs;
  GPU: GpuSpecs;
  MOTHERBOARD: MotherboardSpecs;
  RAM: RamSpecs;
  SSD: StorageSpecs;
  PSU: PsuSpecs;
  CASE: CaseSpecs;
  COOLER: CoolerSpecs;
}

export interface ComponentOf<C extends ComponentCategory> {
  id: string;
  category: C;
  brand: string;
  model: string;
  finish: Finish;
  /** Prix indicatif en euros relevé à la date PRICE_DATE du catalogue. */
  price: number;
  /** Identifiant produit Amazon, quand il est connu : donne un lien direct. */
  asin?: string;
  /**
   * Adresse d'une photo officielle du produit, quand on a le droit de l'afficher
   * (image fournie par l'API d'un programme d'affiliation, par exemple). Sinon, le site montre son propre rendu 3D.
   */
  photo?: string;
  confidence: Confidence;
  specs: SpecsByCategory[C];
}

export type Component = { [C in ComponentCategory]: ComponentOf<C> }[ComponentCategory];

export type BuildSelection = Partial<Record<ComponentCategory, string>>;
export type ResolvedBuild = { [C in ComponentCategory]?: ComponentOf<C> };

export type Severity = "error" | "warning" | "info";

export interface CompatibilityIssue {
  severity: Severity;
  code: string;
  /** Emplacements concernés, pour surligner les pièces dans l'interface. */
  slots: ComponentCategory[];
  message: string;
  fix: string;
}

export type CompatibilityStatus = "compatible" | "warning" | "incompatible" | "incomplete";

export interface CompatibilityResult {
  status: CompatibilityStatus;
  issues: CompatibilityIssue[];
  /** Pièces indispensables pas encore choisies. */
  missing: ComponentCategory[];
  /** Consommation maximale estimée de la configuration. */
  estimatedPeakW: number;
  engineVersion: string;
}

export type Resolution = "1080p" | "1440p" | "4K";
export type Usage = "gaming" | "creation" | "streaming" | "bureautique";

export interface PerfEstimate {
  game: string;
  fps: number;
  /** Ce qui limite le plus les images par seconde dans ce jeu. */
  limitedBy: "CPU" | "GPU";
}
