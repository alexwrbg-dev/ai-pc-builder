// ============================================================
// MOTEUR DE COMPATIBILITÉ DÉTERMINISTE — v2
// Seule source de vérité sur la compatibilité : aucune IA n'intervient ici.
// Fonction pure : une sélection + un résolveur de pièces → un verdict expliqué.
// ============================================================
import type {
  BuildSelection, CompatibilityIssue, CompatibilityResult, CompatibilityStatus,
  ComponentCategory, ResolvedBuild, Severity,
} from "./types";
import { CATEGORY_LABEL, ESSENTIAL } from "./types";
import { PRICE_DATE, byId, fullName, resolveBuild, type Resolver } from "./catalog";

export const ENGINE_VERSION = "2.0.0";

/** Consommation hors CPU et GPU : carte mère, mémoire, stockage, ventilateurs. */
const BASE_LOAD_W = 60;

function issue(severity: Severity, code: string, slots: ComponentCategory[], message: string, fix: string): CompatibilityIssue {
  return { severity, code, slots, message, fix };
}

function monthsBetween(from: string, to: string): number {
  const [fy, fm] = from.split("-").map(Number);
  const [ty, tm] = to.split("-").map(Number);
  return (ty - fy) * 12 + (tm - fm);
}

/** Consommation maximale estimée : pic CPU + GPU + reste de la machine. */
export function estimatePeakW(build: ResolvedBuild): number {
  if (!build.CPU && !build.GPU) return 0;
  return (build.CPU?.specs.peakW ?? 0) + (build.GPU?.specs.tdpW ?? 0) + BASE_LOAD_W;
}

/** Puissance d'alimentation conseillée pour une config, arrondie aux 50 W supérieurs. */
export function recommendedPsuW(build: ResolvedBuild): number {
  const need = Math.max(estimatePeakW(build) * 1.4, build.GPU?.specs.recommendedPsuW ?? 0);
  return Math.ceil(need / 50) * 50;
}

/**
 * @param asOf mois de référence AAAA-MM pour juger si un processeur est « récent » (par défaut : date du catalogue).
 */
export function checkBuild(build: ResolvedBuild, unknown: ComponentCategory[] = [], asOf: string = PRICE_DATE.slice(0, 7)): CompatibilityResult {
  const issues: CompatibilityIssue[] = [];
  const { CPU: cpu, GPU: gpu, MOTHERBOARD: mb, RAM: ram, SSD: ssd, PSU: psu, CASE: pcCase, COOLER: cooler } = build;

  for (const slot of unknown) {
    issues.push(issue("error", "UNKNOWN_COMPONENT", [slot],
      `Référence inconnue pour l'emplacement « ${CATEGORY_LABEL[slot]} ».`,
      "Choisissez une pièce du catalogue."));
  }

  // --- 1. Processeur ↔ carte mère ---
  if (cpu && mb && cpu.specs.socket !== mb.specs.socket) {
    issues.push(issue("error", "SOCKET_MISMATCH", ["CPU", "MOTHERBOARD"],
      `Le ${fullName(cpu)} se monte sur un socket ${cpu.specs.socket}, la ${fullName(mb)} a un socket ${mb.specs.socket}.`,
      `Prenez un processeur ${mb.specs.socket} ou une carte mère ${cpu.specs.socket}.`));
  }
  if (cpu && mb && cpu.specs.socket === mb.specs.socket) {
    // Un processeur sorti après le chipset a besoin d'un BIOS récent. Le risque est réel tant que le
    // processeur est nouveau ; au-delà d'un an, les cartes en vente ont été mises à jour en usine.
    const gap = monthsBetween(mb.specs.released, cpu.specs.released);
    const cpuAge = monthsBetween(cpu.specs.released, asOf);
    if (gap > 0 && cpuAge <= 30) {
      issues.push(issue(cpuAge <= 12 ? "warning" : "info", "BIOS_UPDATE", ["CPU", "MOTHERBOARD"],
        `Le ${cpu.model} est sorti après le chipset ${mb.specs.chipset} : une carte restée en stock peut avoir un BIOS trop ancien pour le reconnaître.`,
        "Vérifiez la version de BIOS auprès du vendeur, ou mettez-le à jour (fonction BIOS Flashback si la carte en dispose)."));
    }
  }

  // --- 2. Mémoire ---
  if (mb && ram && mb.specs.ramType !== ram.specs.type) {
    issues.push(issue("error", "RAM_TYPE_MISMATCH", ["MOTHERBOARD", "RAM"],
      `La ${fullName(mb)} accepte de la ${mb.specs.ramType}, le kit choisi est en ${ram.specs.type}.`,
      `Prenez un kit ${mb.specs.ramType}.`));
  }
  if (cpu && ram && !cpu.specs.memoryTypes.includes(ram.specs.type)) {
    issues.push(issue("error", "CPU_RAM_TYPE", ["CPU", "RAM"],
      `Le ${cpu.model} ne gère pas la ${ram.specs.type} (il gère : ${cpu.specs.memoryTypes.join(", ")}).`,
      `Prenez un kit ${cpu.specs.memoryTypes.join(" ou ")}.`));
  }
  if (mb && ram) {
    if (ram.specs.sticks > mb.specs.ramSlots) {
      issues.push(issue("error", "RAM_SLOTS", ["MOTHERBOARD", "RAM"],
        `Le kit compte ${ram.specs.sticks} barrettes, la carte mère n'a que ${mb.specs.ramSlots} emplacements.`,
        `Prenez un kit de ${mb.specs.ramSlots} barrettes au plus.`));
    }
    if (ram.specs.capacityGB > mb.specs.maxRamGB) {
      issues.push(issue("error", "RAM_CAPACITY", ["MOTHERBOARD", "RAM"],
        `${ram.specs.capacityGB} Go dépassent le maximum de ${mb.specs.maxRamGB} Go de la carte mère.`,
        "Réduisez la capacité ou changez de carte mère."));
    }
  }
  if (ram && ((ram.specs.type === "DDR5" && ram.specs.speedMTs > 5600) || (ram.specs.type === "DDR4" && ram.specs.speedMTs > 3200))) {
    issues.push(issue("info", "RAM_PROFILE", ["RAM"],
      `Le kit n'atteint ses ${ram.specs.speedMTs} MT/s qu'avec le profil EXPO ou XMP activé.`,
      "Activez le profil mémoire dans le BIOS au premier démarrage."));
  }

  // --- 3. Carte mère ↔ boîtier ---
  if (mb && pcCase && !pcCase.specs.formFactors.includes(mb.specs.formFactor)) {
    issues.push(issue("error", "FORM_FACTOR", ["MOTHERBOARD", "CASE"],
      `Le boîtier ${fullName(pcCase)} n'accepte pas le format ${mb.specs.formFactor} (formats acceptés : ${pcCase.specs.formFactors.join(", ")}).`,
      `Prenez un boîtier ${mb.specs.formFactor} ou une carte mère plus compacte.`));
  }

  // --- 4. Carte graphique ---
  if (cpu && !gpu && !cpu.specs.igpu) {
    issues.push(issue("warning", "NO_DISPLAY", ["CPU", "GPU"],
      `Le ${cpu.model} n'a pas de puce graphique intégrée : sans carte graphique, aucun écran ne s'allumera.`,
      "Ajoutez une carte graphique, ou prenez un processeur avec graphiques intégrés."));
  }
  if (gpu && pcCase) {
    const margin = pcCase.specs.maxGpuLengthMM - gpu.specs.lengthMM;
    if (margin < 0) {
      issues.push(issue("error", "GPU_LENGTH", ["GPU", "CASE"],
        `La carte graphique mesure ${gpu.specs.lengthMM} mm, le boîtier en accepte ${pcCase.specs.maxGpuLengthMM} mm au maximum.`,
        `Prenez une carte de ${pcCase.specs.maxGpuLengthMM} mm ou moins, ou un boîtier plus profond.`));
    } else if (margin < 20) {
      issues.push(issue("warning", "GPU_LENGTH_TIGHT", ["GPU", "CASE"],
        `Il ne reste que ${margin} mm entre la carte graphique et l'avant du boîtier.`,
        "Le montage passe, mais sans place pour un radiateur ou des ventilateurs épais à l'avant."));
    }
  }

  // --- 5. Alimentation ---
  const peak = estimatePeakW(build);
  if (psu && (cpu || gpu)) {
    if (psu.specs.wattageW < peak * 1.15) {
      issues.push(issue("error", "PSU_WATTAGE", ["PSU"],
        `Alimentation de ${psu.specs.wattageW} W pour une consommation en pointe estimée à ${peak} W : la marge est insuffisante.`,
        `Visez au moins ${recommendedPsuW(build)} W.`));
    } else if (psu.specs.wattageW < recommendedPsuW(build)) {
      const reco = gpu && gpu.specs.recommendedPsuW > psu.specs.wattageW
        ? `Le constructeur de la carte graphique recommande ${gpu.specs.recommendedPsuW} W.`
        : `Consommation en pointe estimée à ${peak} W.`;
      issues.push(issue("warning", "PSU_HEADROOM", ["PSU"],
        `Alimentation de ${psu.specs.wattageW} W : ça fonctionne, avec peu de marge. ${reco}`,
        `${recommendedPsuW(build)} W laisseraient de la marge pour le silence et une future carte graphique.`));
    }
  }
  if (psu && gpu) {
    if (gpu.specs.power8pin > psu.specs.pcie8) {
      issues.push(issue("error", "PSU_CONNECTOR", ["GPU", "PSU"],
        `La carte graphique demande ${gpu.specs.power8pin} connecteurs PCIe 8 broches, l'alimentation en fournit ${psu.specs.pcie8}.`,
        `Prenez une alimentation avec au moins ${gpu.specs.power8pin} connecteurs PCIe 8 broches.`));
    }
    if (gpu.specs.power16pin > psu.specs.hpwr16) {
      // Les cartes sont livrées avec un adaptateur : 2, 3 ou 4 prises 8 broches selon leur consommation.
      const adapterNeeds = gpu.specs.tdpW > 450 ? 4 : gpu.specs.tdpW > 300 ? 3 : 2;
      if (psu.specs.pcie8 >= adapterNeeds) {
        issues.push(issue("warning", "PSU_ADAPTER", ["GPU", "PSU"],
          `L'alimentation n'a pas de connecteur 16 broches natif : il faudra l'adaptateur fourni avec la carte (${adapterNeeds} prises 8 broches).`,
          "Une alimentation ATX 3.1 avec câble 12V-2x6 natif est plus propre et plus sûre."));
      } else {
        issues.push(issue("error", "PSU_CONNECTOR", ["GPU", "PSU"],
          `La carte graphique se branche en 16 broches. L'alimentation n'en a pas, et ses ${psu.specs.pcie8} prises 8 broches ne suffisent pas pour l'adaptateur (${adapterNeeds} nécessaires).`,
          "Prenez une alimentation ATX 3.1 avec connecteur 12V-2x6."));
      }
    }
  }
  if (psu && pcCase && psu.specs.lengthMM > pcCase.specs.psuMaxLengthMM) {
    issues.push(issue("error", "PSU_LENGTH", ["PSU", "CASE"],
      `L'alimentation mesure ${psu.specs.lengthMM} mm de long, le boîtier en accepte ${pcCase.specs.psuMaxLengthMM} mm.`,
      "Prenez une alimentation plus courte."));
  }

  // --- 6. Refroidissement ---
  if (cpu && !cooler) {
    if (cpu.specs.coolerIncluded) {
      issues.push(issue("info", "STOCK_COOLER", ["CPU", "COOLER"],
        `Le ${cpu.model} est livré avec un ventirad : il suffit, mais il est plus bruyant qu'un modèle tour.`,
        "Un ventirad tour à partir de 25 € rend la machine nettement plus silencieuse."));
    } else {
      issues.push(issue("warning", "NO_COOLER", ["CPU", "COOLER"],
        `Le ${cpu.model} est vendu sans ventirad.`,
        "Ajoutez un ventirad ou un watercooling."));
    }
  }
  if (cpu && cooler) {
    if (!cooler.specs.sockets.includes(cpu.specs.socket)) {
      issues.push(issue("error", "COOLER_SOCKET", ["CPU", "COOLER"],
        `Le ${fullName(cooler)} ne se fixe pas sur un socket ${cpu.specs.socket}.`,
        `Prenez un refroidissement compatible ${cpu.specs.socket}.`));
    }
    if (cooler.specs.tdpRatingW < cpu.specs.peakW) {
      issues.push(issue("warning", "COOLER_TDP", ["CPU", "COOLER"],
        `Le ${fullName(cooler)} est donné pour ${cooler.specs.tdpRatingW} W, le ${cpu.model} peut en dégager ${cpu.specs.peakW} en charge.`,
        "Le processeur ralentira en charge soutenue. Prenez un refroidissement plus gros."));
    }
  }
  if (cooler && pcCase) {
    if (cooler.specs.kind === "AIR" && cooler.specs.heightMM && cooler.specs.heightMM > pcCase.specs.maxCoolerHeightMM) {
      issues.push(issue("error", "COOLER_HEIGHT", ["COOLER", "CASE"],
        `Le ventirad mesure ${cooler.specs.heightMM} mm de haut, le boîtier en accepte ${pcCase.specs.maxCoolerHeightMM} mm : le panneau latéral ne fermera pas.`,
        `Prenez un ventirad de ${pcCase.specs.maxCoolerHeightMM} mm ou moins, ou un watercooling.`));
    }
    if (cooler.specs.kind === "AIO" && cooler.specs.radiatorMM) {
      const biggest = Math.max(pcCase.specs.radiatorTopMM, pcCase.specs.radiatorFrontMM, pcCase.specs.radiatorSideMM);
      if (cooler.specs.radiatorMM > biggest) {
        issues.push(issue("error", "RADIATOR_SUPPORT", ["COOLER", "CASE"],
          `Le radiateur de ${cooler.specs.radiatorMM} mm ne rentre pas : le boîtier accepte ${biggest || "aucun radiateur"}${biggest ? " mm au maximum" : ""}.`,
          biggest ? `Prenez un watercooling de ${biggest} mm ou moins.` : "Prenez un ventirad."));
      }
    }
  }

  // --- 7. Stockage ---
  if (ssd && mb && ssd.specs.interface === "NVMe" && mb.specs.m2Slots < 1) {
    issues.push(issue("error", "M2_SLOTS", ["SSD", "MOTHERBOARD"],
      "La carte mère n'a pas d'emplacement M.2 pour ce SSD NVMe.",
      "Prenez un SSD SATA ou une autre carte mère."));
  }

  // Pièces manquantes : les six indispensables, plus la carte graphique et le ventirad quand le processeur les exige.
  const missing = ESSENTIAL.filter((slot) => !build[slot] && !unknown.includes(slot));
  if (cpu && !gpu && !cpu.specs.igpu && !unknown.includes("GPU")) missing.push("GPU");
  if (cpu && !cooler && !cpu.specs.coolerIncluded && !unknown.includes("COOLER")) missing.push("COOLER");

  // Les blocages d'abord, puis les réserves, puis les simples informations.
  const rank = { error: 0, warning: 1, info: 2 } as const;
  issues.sort((a, b) => rank[a.severity] - rank[b.severity]);

  const hasError = issues.some((i) => i.severity === "error");
  const hasWarning = issues.some((i) => i.severity === "warning");
  const status: CompatibilityStatus = hasError ? "incompatible" : missing.length ? "incomplete" : hasWarning ? "warning" : "compatible";

  return { status, issues, missing, estimatedPeakW: peak, engineVersion: ENGINE_VERSION };
}

/** Point d'entrée habituel : vérifie une sélection d'identifiants. */
export function checkCompatibility(sel: BuildSelection, resolve: Resolver = byId): CompatibilityResult {
  const { build, unknown } = resolveBuild(sel, resolve);
  return checkBuild(build, unknown);
}

export const STATUS_LABEL: Record<CompatibilityStatus, string> = {
  compatible: "Compatible",
  warning: "Compatible avec réserves",
  incompatible: "Incompatible",
  incomplete: "Incomplète",
};
