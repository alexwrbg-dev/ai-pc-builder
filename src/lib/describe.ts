// Résumé d'une pièce en une ligne, pour les listes et les tableaux.
import type { Component } from "./types";

export function specLine(c: Component): string {
  switch (c.category) {
    case "CPU": return `${c.specs.socket} · ${c.specs.cores} cœurs · ${c.specs.boostGHz.toLocaleString("fr-FR")} GHz${c.specs.igpu ? " · puce graphique" : ""}`;
    case "GPU": return `${c.specs.vramGB} Go · ${c.specs.lengthMM} mm · ${c.specs.tdpW} W`;
    case "MOTHERBOARD": return `${c.specs.chipset} · ${c.specs.formFactor} · ${c.specs.ramType}${c.specs.wifi ? " · WiFi" : ""}`;
    case "RAM": return `${c.specs.type} · ${c.specs.speedMTs} MT/s · CL${c.specs.cl}${c.specs.rgb ? " · RGB" : ""}`;
    case "SSD": return `${c.specs.interface} · ${c.specs.readMBs.toLocaleString("fr-FR")} Mo/s`;
    case "PSU": return `${c.specs.wattageW} W · 80+ ${c.specs.efficiency} · ${c.specs.modular === "full" ? "modulaire" : "câbles fixes"}`;
    case "CASE": return `${c.specs.formFactors[0]} max · carte ${c.specs.maxGpuLengthMM} mm · ventirad ${c.specs.maxCoolerHeightMM} mm`;
    case "COOLER": return c.specs.kind === "AIR"
      ? `Ventirad · ${c.specs.heightMM} mm de haut · ${c.specs.tdpRatingW} W`
      : `Watercooling · radiateur ${c.specs.radiatorMM} mm`;
  }
}

const yes = (b: boolean) => (b ? "Oui" : "Non");

/** Fiche technique complète d'une pièce : libellé, valeur. */
export function specRows(c: Component): [string, string][] {
  switch (c.category) {
    case "CPU": return [
      ["Socket", c.specs.socket], ["Cœurs / threads", `${c.specs.cores} / ${c.specs.threads}`],
      ["Fréquence maximale", `${c.specs.boostGHz.toLocaleString("fr-FR")} GHz`],
      ["TDP annoncé", `${c.specs.tdpW} W`], ["Consommation en pointe", `${c.specs.peakW} W`],
      ["Mémoire gérée", c.specs.memoryTypes.join(", ")], ["Puce graphique intégrée", yes(c.specs.igpu)],
      ["Ventirad fourni", yes(c.specs.coolerIncluded)], ["Sortie", c.specs.released],
    ];
    case "GPU": return [
      ["Puce", c.specs.chipset], ["Mémoire vidéo", `${c.specs.vramGB} Go`],
      ["Dimensions", `${c.specs.lengthMM} × ${c.specs.heightMM} × ${c.specs.thicknessMM} mm`],
      ["Ventilateurs", String(c.specs.fans)], ["Consommation", `${c.specs.tdpW} W`],
      ["Alimentation recommandée", `${c.specs.recommendedPsuW} W`],
      ["Connecteurs", [c.specs.power16pin ? `${c.specs.power16pin} × 16 broches` : "", c.specs.power8pin ? `${c.specs.power8pin} × 8 broches` : ""].filter(Boolean).join(" + ")],
    ];
    case "MOTHERBOARD": return [
      ["Socket", c.specs.socket], ["Chipset", c.specs.chipset], ["Format", c.specs.formFactor],
      ["Mémoire", `${c.specs.ramType}, ${c.specs.ramSlots} emplacements, ${c.specs.maxRamGB} Go max`],
      ["Emplacements M.2", String(c.specs.m2Slots)], ["WiFi", yes(c.specs.wifi)],
    ];
    case "RAM": return [
      ["Type", c.specs.type], ["Capacité", `${c.specs.capacityGB} Go (${c.specs.sticks} × ${c.specs.capacityGB / c.specs.sticks} Go)`],
      ["Fréquence", `${c.specs.speedMTs} MT/s`], ["Latence", `CL${c.specs.cl}`],
      ["Hauteur", `${c.specs.heightMM} mm`], ["Éclairage RGB", yes(c.specs.rgb)],
    ];
    case "SSD": return [
      ["Interface", c.specs.interface === "NVMe" ? "NVMe (M.2)" : "SATA (2,5 pouces)"],
      ["Capacité", c.specs.capacityGB >= 1000 ? `${c.specs.capacityGB / 1000} To` : `${c.specs.capacityGB} Go`],
      ["Lecture séquentielle", `${c.specs.readMBs.toLocaleString("fr-FR")} Mo/s`],
    ];
    case "PSU": return [
      ["Puissance", `${c.specs.wattageW} W`], ["Certification", `80+ ${c.specs.efficiency}`],
      ["Câbles", c.specs.modular === "full" ? "Modulaires" : "Fixes"], ["Longueur", `${c.specs.lengthMM} mm`],
      ["Connecteurs PCIe 8 broches", String(c.specs.pcie8)], ["Connecteur 16 broches natif", String(c.specs.hpwr16)],
    ];
    case "CASE": return [
      ["Cartes mères acceptées", c.specs.formFactors.join(", ")],
      ["Dimensions (H × L × P)", `${c.specs.dims.h} × ${c.specs.dims.w} × ${c.specs.dims.d} mm`],
      ["Carte graphique", `${c.specs.maxGpuLengthMM} mm max`], ["Ventirad", `${c.specs.maxCoolerHeightMM} mm max`],
      ["Radiateur", [c.specs.radiatorTopMM ? `${c.specs.radiatorTopMM} mm en haut` : "", c.specs.radiatorFrontMM ? `${c.specs.radiatorFrontMM} mm à l'avant` : "", c.specs.radiatorSideMM ? `${c.specs.radiatorSideMM} mm sur le côté` : ""].filter(Boolean).join(", ") || "Aucun"],
      ["Alimentation", `${c.specs.psuMaxLengthMM} mm max`],
      ["Ventilateurs fournis", `${c.specs.includedFans}${c.specs.rgbFans ? " (RGB)" : ""}`],
    ];
    case "COOLER": return [
      ["Type", c.specs.kind === "AIR" ? "Ventirad" : "Watercooling tout-en-un"],
      c.specs.kind === "AIR" ? ["Hauteur", `${c.specs.heightMM} mm`] : ["Radiateur", `${c.specs.radiatorMM} mm`],
      ["Capacité de refroidissement", `${c.specs.tdpRatingW} W`], ["Ventilateurs", String(c.specs.fans)],
      ["Sockets", c.specs.sockets.join(", ")], ["Éclairage RGB", yes(c.specs.rgb)],
    ];
  }
}
