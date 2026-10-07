// Moteur de compatibilité : chaque règle a son cas adverse, sur des pièces de test indépendantes du catalogue.
import { describe, expect, it } from "vitest";
import { checkBuild, checkCompatibility } from "@/lib/compatibility";
import type { ComponentOf, ResolvedBuild } from "@/lib/types";

const base = { finish: "black", price: 100, confidence: "KNOWN" } as const;

const cpu = (over: Partial<ComponentOf<"CPU">["specs"]> = {}): ComponentOf<"CPU"> => ({
  ...base, id: "cpu", category: "CPU", brand: "Test", model: "CPU",
  specs: { socket: "AM5", cores: 6, threads: 12, boostGHz: 5, tdpW: 65, peakW: 88, memoryTypes: ["DDR5"], igpu: true, coolerIncluded: false, released: "2023-01", gamingIndex: 70, multiIndex: 35, ...over },
});
const gpu = (over: Partial<ComponentOf<"GPU">["specs"]> = {}): ComponentOf<"GPU"> => ({
  ...base, id: "gpu", category: "GPU", brand: "Test", model: "GPU",
  specs: { chipset: "Test", vramGB: 12, lengthMM: 300, heightMM: 120, thicknessMM: 50, fans: 3, tdpW: 250, recommendedPsuW: 650, power8pin: 0, power16pin: 1, perfIndex: 100, ...over },
});
const mb = (over: Partial<ComponentOf<"MOTHERBOARD">["specs"]> = {}): ComponentOf<"MOTHERBOARD"> => ({
  ...base, id: "mb", category: "MOTHERBOARD", brand: "Test", model: "Carte mère",
  specs: { socket: "AM5", chipset: "B850", formFactor: "ATX", ramType: "DDR5", ramSlots: 4, maxRamGB: 192, m2Slots: 2, wifi: true, released: "2025-01", tier: 2, ...over },
});
const ram = (over: Partial<ComponentOf<"RAM">["specs"]> = {}): ComponentOf<"RAM"> => ({
  ...base, id: "ram", category: "RAM", brand: "Test", model: "RAM",
  specs: { type: "DDR5", capacityGB: 32, sticks: 2, speedMTs: 5600, cl: 36, heightMM: 35, rgb: false, ...over },
});
const ssd = (over: Partial<ComponentOf<"SSD">["specs"]> = {}): ComponentOf<"SSD"> => ({
  ...base, id: "ssd", category: "SSD", brand: "Test", model: "SSD",
  specs: { interface: "NVMe", capacityGB: 1000, readMBs: 7000, ...over },
});
const psu = (over: Partial<ComponentOf<"PSU">["specs"]> = {}): ComponentOf<"PSU"> => ({
  ...base, id: "psu", category: "PSU", brand: "Test", model: "Alim",
  specs: { wattageW: 750, efficiency: "Gold", modular: "full", lengthMM: 140, pcie8: 3, hpwr16: 1, ...over },
});
const pcCase = (over: Partial<ComponentOf<"CASE">["specs"]> = {}): ComponentOf<"CASE"> => ({
  ...base, id: "case", category: "CASE", brand: "Test", model: "Boîtier",
  specs: { formFactors: ["ATX", "Micro-ATX", "Mini-ITX"], maxGpuLengthMM: 380, maxCoolerHeightMM: 165, radiatorTopMM: 360, radiatorFrontMM: 0, radiatorSideMM: 0, psuMaxLengthMM: 200, dims: { h: 480, w: 230, d: 450 }, layout: "standard", front: "mesh", includedFans: 3, rgbFans: false, ...over },
});
const cooler = (over: Partial<ComponentOf<"COOLER">["specs"]> = {}): ComponentOf<"COOLER"> => ({
  ...base, id: "cooler", category: "COOLER", brand: "Test", model: "Ventirad",
  specs: { kind: "AIR", sockets: ["AM5", "AM4", "LGA1700", "LGA1851"], heightMM: 155, tdpRatingW: 220, fans: 1, rgb: false, ...over },
});

const full = (over: ResolvedBuild = {}): ResolvedBuild => ({
  CPU: cpu(), GPU: gpu(), MOTHERBOARD: mb(), RAM: ram(), SSD: ssd(), PSU: psu(), CASE: pcCase(), COOLER: cooler(), ...over,
});
const codes = (b: ResolvedBuild) => checkBuild(b, [], "2026-10").issues.map((i) => i.code);
const status = (b: ResolvedBuild) => checkBuild(b, [], "2026-10").status;

describe("moteur de compatibilité", () => {
  it("valide une configuration saine, sans aucune remarque", () => {
    const r = checkBuild(full(), [], "2026-10");
    expect(r.status).toBe("compatible");
    expect(r.issues).toEqual([]);
    expect(r.estimatedPeakW).toBe(88 + 250 + 60);
  });

  it("refuse un processeur sur le mauvais socket", () => {
    const b = full({ CPU: cpu({ socket: "AM4", memoryTypes: ["DDR4"] }) });
    expect(codes(b)).toContain("SOCKET_MISMATCH");
    expect(status(b)).toBe("incompatible");
  });

  it("refuse de la DDR4 sur une carte mère DDR5", () => {
    const b = full({ RAM: ram({ type: "DDR4", speedMTs: 3200 }) });
    expect(codes(b)).toEqual(expect.arrayContaining(["RAM_TYPE_MISMATCH", "CPU_RAM_TYPE"]));
  });

  it("refuse un kit de 4 barrettes sur une carte à 2 emplacements", () => {
    expect(codes(full({ RAM: ram({ sticks: 4 }), MOTHERBOARD: mb({ ramSlots: 2 }) }))).toContain("RAM_SLOTS");
  });

  it("refuse plus de mémoire que la carte mère n'en gère", () => {
    expect(codes(full({ RAM: ram({ capacityGB: 128 }), MOTHERBOARD: mb({ maxRamGB: 64 }) }))).toContain("RAM_CAPACITY");
  });

  it("signale le profil EXPO/XMP comme simple information", () => {
    const r = checkBuild(full({ RAM: ram({ speedMTs: 6000 }) }), [], "2026-10");
    expect(r.issues.map((i) => [i.code, i.severity])).toEqual([["RAM_PROFILE", "info"]]);
    expect(r.status).toBe("compatible");
  });

  it("refuse une carte mère ATX dans un boîtier Micro-ATX", () => {
    expect(codes(full({ CASE: pcCase({ formFactors: ["Micro-ATX", "Mini-ITX"] }) }))).toContain("FORM_FACTOR");
  });

  it("refuse une carte graphique plus longue que le boîtier, avec les deux mesures dans le message", () => {
    const r = checkBuild(full({ GPU: gpu({ lengthMM: 340 }), CASE: pcCase({ maxGpuLengthMM: 330 }) }), [], "2026-10");
    const issue = r.issues.find((i) => i.code === "GPU_LENGTH");
    expect(issue?.severity).toBe("error");
    expect(issue?.message).toMatch(/340 mm.*330 mm/);
  });

  it("prévient quand la carte graphique passe à moins de 20 mm", () => {
    const b = full({ GPU: gpu({ lengthMM: 370 }) });
    expect(codes(b)).toContain("GPU_LENGTH_TIGHT");
    expect(status(b)).toBe("warning");
  });

  it("refuse une alimentation trop faible en comptant le processeur ET la carte graphique", () => {
    // 253 W de processeur + 250 W de carte graphique + 60 W = 563 W en pointe
    const b = full({ CPU: cpu({ peakW: 253 }), PSU: psu({ wattageW: 600 }), COOLER: cooler({ tdpRatingW: 300 }) });
    expect(codes(b)).toContain("PSU_WATTAGE");
  });

  it("vérifie l'alimentation même sans carte graphique", () => {
    const b = full({ GPU: undefined, CPU: cpu({ peakW: 253 }), PSU: psu({ wattageW: 300 }), COOLER: cooler({ tdpRatingW: 300 }) });
    expect(codes(b)).toContain("PSU_WATTAGE");
  });

  it("prévient quand l'alimentation fonctionne mais sans marge", () => {
    const b = full({ PSU: psu({ wattageW: 500 }) });
    expect(codes(b)).toContain("PSU_HEADROOM");
    expect(status(b)).toBe("warning");
  });

  it("compte les connecteurs 8 broches au lieu de vérifier seulement leur présence", () => {
    const b = full({ GPU: gpu({ power8pin: 3, power16pin: 0 }), PSU: psu({ pcie8: 2 }) });
    const issue = checkBuild(b, [], "2026-10").issues.find((i) => i.code === "PSU_CONNECTOR");
    expect(issue?.severity).toBe("error");
    expect(issue?.message).toMatch(/3 connecteurs.*fournit 2/);
  });

  it("accepte l'adaptateur 16 broches si l'alimentation a assez de prises 8 broches", () => {
    const b = full({ PSU: psu({ hpwr16: 0, pcie8: 2 }) });
    expect(codes(b)).toContain("PSU_ADAPTER");
    expect(status(b)).toBe("warning");
  });

  it("refuse une carte 16 broches quand l'adaptateur ne peut pas être branché", () => {
    const b = full({ PSU: psu({ hpwr16: 0, pcie8: 1 }) });
    expect(codes(b)).toContain("PSU_CONNECTOR");
    expect(status(b)).toBe("incompatible");
  });

  it("refuse une alimentation trop longue pour le boîtier", () => {
    expect(codes(full({ PSU: psu({ lengthMM: 200 }), CASE: pcCase({ psuMaxLengthMM: 180 }) }))).toContain("PSU_LENGTH");
  });

  it("refuse un ventirad plus haut que le boîtier", () => {
    const b = full({ COOLER: cooler({ heightMM: 168 }), CASE: pcCase({ maxCoolerHeightMM: 160 }) });
    expect(codes(b)).toContain("COOLER_HEIGHT");
    expect(status(b)).toBe("incompatible");
  });

  it("refuse un radiateur plus grand que ce que le boîtier accepte", () => {
    const b = full({ COOLER: cooler({ kind: "AIO", heightMM: undefined, radiatorMM: 360 }), CASE: pcCase({ radiatorTopMM: 240, radiatorFrontMM: 280 }) });
    expect(codes(b)).toContain("RADIATOR_SUPPORT");
  });

  it("accepte un radiateur qui tient à l'avant même si le haut est trop court", () => {
    const b = full({ COOLER: cooler({ kind: "AIO", heightMM: undefined, radiatorMM: 360 }), CASE: pcCase({ radiatorTopMM: 240, radiatorFrontMM: 360 }) });
    expect(codes(b)).not.toContain("RADIATOR_SUPPORT");
  });

  it("refuse un refroidissement qui ne se fixe pas sur le socket", () => {
    expect(codes(full({ COOLER: cooler({ sockets: ["LGA1700"] }) }))).toContain("COOLER_SOCKET");
  });

  it("prévient quand le refroidissement est sous-dimensionné pour la consommation réelle", () => {
    expect(codes(full({ CPU: cpu({ tdpW: 125, peakW: 253 }), PSU: psu({ wattageW: 1000 }) }))).toContain("COOLER_TDP");
  });

  it("refuse un SSD NVMe sur une carte sans emplacement M.2", () => {
    expect(codes(full({ MOTHERBOARD: mb({ m2Slots: 0 }) }))).toContain("M2_SLOTS");
  });

  it("prévient pour le BIOS quand le processeur est récent et plus jeune que le chipset", () => {
    const b = full({ CPU: cpu({ released: "2026-01" }), MOTHERBOARD: mb({ released: "2025-01" }) });
    const issue = checkBuild(b, [], "2026-10").issues.find((i) => i.code === "BIOS_UPDATE");
    expect(issue?.severity).toBe("warning");
  });

  it("ne dit rien du BIOS quand le processeur a plus de deux ans et demi", () => {
    const b = full({ CPU: cpu({ released: "2023-06" }), MOTHERBOARD: mb({ released: "2022-10" }) });
    expect(codes(b)).not.toContain("BIOS_UPDATE");
  });
});

describe("configurations incomplètes", () => {
  it("ne déclare jamais « compatible » une sélection vide", () => {
    const r = checkBuild({});
    expect(r.status).toBe("incomplete");
    expect(r.missing).toEqual(["CPU", "MOTHERBOARD", "RAM", "SSD", "PSU", "CASE"]);
  });

  it("liste ce qui manque quand seul le processeur est choisi", () => {
    const r = checkBuild({ CPU: cpu() });
    expect(r.status).toBe("incomplete");
    expect(r.missing).toContain("MOTHERBOARD");
  });

  it("exige une carte graphique si le processeur n'a pas de puce graphique", () => {
    const r = checkBuild(full({ GPU: undefined, CPU: cpu({ igpu: false }) }), [], "2026-10");
    expect(r.status).toBe("incomplete");
    expect(r.missing).toEqual(["GPU"]);
    expect(r.issues.map((i) => i.code)).toContain("NO_DISPLAY");
  });

  it("accepte l'absence de carte graphique si le processeur a une puce graphique", () => {
    expect(status(full({ GPU: undefined }))).toBe("compatible");
  });

  it("exige un refroidissement si le processeur est vendu sans ventirad", () => {
    const r = checkBuild(full({ COOLER: undefined }), [], "2026-10");
    expect(r.status).toBe("incomplete");
    expect(r.missing).toEqual(["COOLER"]);
  });

  it("accepte l'absence de refroidissement si le ventirad est fourni, en le signalant", () => {
    const r = checkBuild(full({ COOLER: undefined, CPU: cpu({ coolerIncluded: true }) }), [], "2026-10");
    expect(r.status).toBe("compatible");
    expect(r.issues.map((i) => [i.code, i.severity])).toEqual([["STOCK_COOLER", "info"]]);
  });
});

describe("références du catalogue", () => {
  it("refuse un identifiant inconnu au lieu de l'ignorer", () => {
    const r = checkCompatibility({ CPU: "nimporte-quoi" });
    expect(r.status).toBe("incompatible");
    expect(r.issues[0].code).toBe("UNKNOWN_COMPONENT");
  });

  it("refuse une pièce rangée dans le mauvais emplacement", () => {
    const r = checkCompatibility({ CPU: "gpu-msi-5070-ventus2x" });
    expect(r.issues[0].code).toBe("UNKNOWN_COMPONENT");
  });
});
