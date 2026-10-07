// ============================================================
// MOTEUR DE COMPATIBILITÉ DÉTERMINISTE — v1.0.0
// Le LLM ne décide JAMAIS de la compatibilité. Ce moteur est la
// seule source de vérité. Voir COMPATIBILITY_ENGINE.md.
// Retourne 🟢 compatible / 🟡 warning / 🔴 incompatible + explications FR.
// ============================================================
import type {
  BuildSelection, CompatibilityIssue, CompatibilityResult,
  Component, CpuSpecs, GpuSpecs, MotherboardSpecs, RamSpecs,
  PsuSpecs, CaseSpecs, CoolerSpecs,
} from "./types";
import { byId } from "./demo-data";

export const ENGINE_VERSION = "1.0.0";

type Ctx = Record<string, Component>;

function err(code: string, components: string[], message: string, fix: string): CompatibilityIssue {
  return { severity: "error", code, components, message, fix };
}
function warn(code: string, components: string[], message: string, fix: string): CompatibilityIssue {
  return { severity: "warning", code, components, message, fix };
}

export function resolveSelection(sel: BuildSelection): { ctx: Ctx; missing: string[] } {
  const ctx: Ctx = {};
  const missing: string[] = [];
  for (const [cat, id] of Object.entries(sel)) {
    if (!id) { missing.push(cat); continue; }
    const c = byId(id);
    if (!c) { missing.push(`${cat}:${id}`); continue; }
    ctx[cat] = c;
  }
  return { ctx, missing };
}

export function checkCompatibility(sel: BuildSelection): CompatibilityResult {
  const issues: CompatibilityIssue[] = [];
  const { ctx } = resolveSelection(sel);
  const cpu = ctx["CPU"] as Component | undefined;
  const gpu = ctx["GPU"] as Component | undefined;
  const mb = ctx["MOTHERBOARD"] as Component | undefined;
  const ram = ctx["RAM"] as Component | undefined;
  const psu = ctx["PSU"] as Component | undefined;
  const pcCase = ctx["CASE"] as Component | undefined;
  const air = (ctx["CPU_COOLER"] ?? ctx["AIO"]) as Component | undefined;

  const cpuS = cpu?.specs as CpuSpecs | undefined;
  const mbS = mb?.specs as MotherboardSpecs | undefined;
  const ramS = ram?.specs as RamSpecs | undefined;
  const gpuS = gpu?.specs as GpuSpecs | undefined;
  const psuS = psu?.specs as PsuSpecs | undefined;
  const caseS = pcCase?.specs as CaseSpecs | undefined;
  const coolS = air?.specs as CoolerSpecs | undefined;

  // --- 1. CPU ↔ socket motherboard ---
  if (cpu && mb && cpuS && mbS && cpuS.socket !== mbS.socket) {
    issues.push(err("SOCKET_MISMATCH", [cpu.id, mb.id],
      `🔴 Socket incompatible : le ${cpu.brand} ${cpu.model} est en ${cpuS.socket} alors que la ${mb.model} est en ${mbS.socket}.`,
      `Choisissez un CPU ${mbS.socket} ou une carte mère ${cpuS.socket}.`));
  }
  // --- 2. RAM ↔ type DDR ---
  if (mb && ram && mbS && ramS && mbS.ramType !== ramS.type) {
    issues.push(err("RAM_TYPE_MISMATCH", [mb.id, ram.id],
      `🔴 RAM incompatible : la carte mère exige de la ${mbS.ramType} mais le kit est en ${ramS.type}.`,
      `Choisissez un kit ${mbS.ramType} ou une carte mère ${ramS.type}.`));
  }
  if (cpu && ram && cpuS && ramS) {
    const supported = (cpuS.memoryType as string[]).includes(ramS.type);
    if (!supported) {
      issues.push(err("CPU_RAM_TYPE", [cpu.id, ram.id],
        `🔴 Le contrôleur mémoire du ${cpu.model} ne supporte pas la ${ramS.type} (supporte : ${cpuS.memoryType.join(", ")}).`,
        `Choisissez un kit ${cpuS.memoryType.join(" ou ")}.`));
    }
  }
  // --- 3. RAM fréquence / capacité / slots ---
  if (mb && ram && mbS && ramS) {
    if (ramS.speedMTs > mbS.maxRamSpeedMTs) {
      issues.push(warn("RAM_SPEED_OC", [mb.id, ram.id],
        `🟡 Kit ${ramS.speedMTs} MT/s au-delà du support officiel ${mbS.maxRamSpeedMTs} MT/s (XMP/EXPO requis, non garanti).`,
        `Activez XMP/EXPO dans le BIOS, ou choisissez un kit ≤ ${mbS.maxRamSpeedMTs} MT/s pour du plug-and-play.`));
    }
    if (ramS.capacityGB > mbS.maxRamGB) {
      issues.push(err("RAM_CAPACITY", [mb.id, ram.id],
        `🔴 Kit ${ramS.capacityGB} GB supérieur au maximum ${mbS.maxRamGB} GB de la carte mère.`,
        `Réduisez la capacité ou changez de carte mère.`));
    }
    if (ramS.sticks > mbS.ramSlots) {
      issues.push(err("RAM_SLOTS", [mb.id, ram.id],
        `🔴 Kit de ${ramS.sticks} barrettes pour ${mbS.ramSlots} slots DIMM.`,
        `Choisissez un kit de ${mbS.ramSlots} barrettes maximum.`));
    }
  }
  // --- 4. Motherboard ↔ boîtier (format) ---
  if (mb && pcCase && mbS && caseS) {
    if (!caseS.supportedFormFactors.includes(mbS.formFactor)) {
      issues.push(err("FORM_FACTOR", [mb.id, pcCase.id],
        `🔴 Carte mère ${mbS.formFactor} non supportée par le boîtier ${pcCase.model} (accepte : ${caseS.supportedFormFactors.join(", ")}).`,
        `Choisissez un boîtier compatible ${mbS.formFactor} ou une carte mère ${caseS.supportedFormFactors.join("/")}.`));
    }
  }
  // --- 5. GPU ↔ longueur boîtier / épaisseur ---
  if (gpu && pcCase && gpuS && caseS) {
    if (gpuS.lengthMM > caseS.maxGpuLengthMM) {
      issues.push(err("GPU_LENGTH", [gpu.id, pcCase.id],
        `🔴 Cette carte graphique mesure ${gpuS.lengthMM} mm alors que le boîtier accepte maximum ${caseS.maxGpuLengthMM} mm.`,
        `Choisissez un GPU ≤ ${caseS.maxGpuLengthMM} mm ou un boîtier plus grand.`));
    } else if (caseS.maxGpuLengthMM - gpuS.lengthMM < 15) {
      issues.push(warn("GPU_LENGTH_TIGHT", [gpu.id, pcCase.id],
        `🟡 Seulement ${caseS.maxGpuLengthMM - gpuS.lengthMM} mm de marge pour le GPU — montage serré, câbles coudés conseillés.`,
        `Prévoyez un montage soigné ou un boîtier plus spacieux.`));
    }
    if (gpuS.slots > 3) {
      issues.push(warn("GPU_THICK", [gpu.id],
        `🟡 GPU très épais (${gpuS.slots} slots) : vérifiez le dégagement PCIe et la ventilation.`,
        `Vérifiez la fiche boîtier + espacement des slots PCIe.`));
    }
  }
  // --- 6. PSU ↔ puissance recommandée + connecteurs ---
  if (gpu && psu && gpuS && psuS) {
    const sysW = gpuS.tdpW + 150; // CPU+plateforme : estimation prudente documentée
    if (psuS.wattageW < gpuS.recommendedPsuW) {
      issues.push(err("PSU_WATTAGE", [gpu.id, psu.id],
        `🔴 Alimentation ${psuS.wattageW} W insuffisante : ${gpuS.recommendedPsuW} W recommandés pour la ${gpu.model}.`,
        `Choisissez une alimentation ≥ ${gpuS.recommendedPsuW} W de marque réputée.`));
    } else if (psuS.wattageW < Math.ceil(sysW * 1.25)) {
      issues.push(warn("PSU_HEADROOM", [gpu.id, psu.id],
        `🟡 Peu de marge : ${psuS.wattageW} W pour ~${sysW} W estimés (marge < 25%).`,
        `Visez ~${Math.ceil(sysW * 1.4)} W pour le silence, les pics transitoires et l'upgrade.`));
    }
    for (const conn of gpuS.powerConnectors) {
      const have = psuS.connectors[conn] ?? (conn === "16pin_12VHPWR" && (psuS.connectors["16pin_12VHPWR"] ?? 0));
      if (!have || have < 1) {
        // Tolère adaptateur fourni avec GPU récent si PSU a assez de PCIe 8pin
        const pcie8 = psuS.connectors["8pin_PCIe"] ?? 0;
        if (conn === "16pin_12VHPWR" && pcie8 >= 2) {
          issues.push(warn("PSU_ADAPTER", [gpu.id, psu.id],
            `🟡 GPU ${conn} mais PSU sans ce connecteur natif : adaptateur ${pcie8}×8pin→16pin généralement fourni.`,
            `Utilisez l'adaptateur officiel du GPU, ou une alimentation ATX 3.0 native ${conn}.`));
        } else {
          issues.push(err("PSU_CONNECTOR", [gpu.id, psu.id],
            `🔴 Connecteur manquant : le GPU exige ${gpuS.powerConnectors.join(" + ")} mais l'alimentation ne le fournit pas.`,
            `Choisissez une alimentation avec ${conn} ou un autre GPU.`));
        }
      }
    }
  }
  // --- 7. Cooler ↔ socket / hauteur / radiateur ---
  if (cpu && air && cpuS && coolS) {
    if (!coolS.sockets.includes(cpuS.socket)) {
      issues.push(err("COOLER_SOCKET", [cpu.id, air.id],
        `🔴 Ventirad incompatible avec le socket ${cpuS.socket}.`,
        `Choisissez un refroidissement supportant ${cpuS.socket} (kit de montage parfois fourni).`));
    }
    if (coolS.tdpRatingW < cpuS.tdpW) {
      issues.push(warn("COOLER_TDP", [cpu.id, air.id],
        `🟡 Refroidissement rated ${coolS.tdpRatingW} W pour un CPU ${cpuS.tdpW} W : limite en charge soutenue.`,
        `Prévoyez un modèle ≥ ${Math.ceil(cpuS.tdpW * 1.4)} W ou limitez le PBO/power-limit.`));
    }
  }
  if (air && pcCase && coolS && caseS) {
    if (coolS.type === "AIR" && coolS.heightMM && coolS.heightMM > caseS.maxCoolerHeightMM) {
      issues.push(err("COOLER_HEIGHT", [air.id, pcCase.id],
        `🔴 Ventirad ${coolS.heightMM} mm trop haut pour le boîtier (max ${caseS.maxCoolerHeightMM} mm).`,
        `Choisissez un ventirad ≤ ${caseS.maxCoolerHeightMM} mm ou un boîtier plus haut.`));
    }
    if (coolS.type === "AIO" && coolS.radiatorMM && !caseS.radiatorSupportMM.includes(coolS.radiatorMM)) {
      issues.push(err("RADIATOR_SUPPORT", [air.id, pcCase.id],
        `🔴 Radiateur ${coolS.radiatorMM} mm non supporté par le boîtier (supporte : ${caseS.radiatorSupportMM.join(", ")} mm).`,
        `Choisissez un radiateur ${caseS.radiatorSupportMM.join(" / ")} mm ou un autre boîtier.`));
    }
  }
  // --- 8. SSD ↔ slots M.2 ---
  const ssd = ctx["SSD_NVME"] as Component | undefined;
  if (ssd && mb && mbS) {
    if (mbS.m2Slots < 1) {
      issues.push(err("M2_SLOTS", [ssd.id, mb.id],
        `🔴 Aucun slot M.2 sur cette carte mère pour le SSD NVMe.`,
        `Choisissez une carte mère avec slot M.2 ou un SSD SATA.`));
    }
  }
  // --- 9. PCIe sanity (GPU x8 sur carte x16 : ok, juste info si vieux chipset) ---
  if (gpu && mb && gpuS && mbS) {
    const gpuGen = parseFloat(gpuS.pcie);
    const mbGen = parseFloat(mbS.pcieX16Version);
    if (!Number.isNaN(gpuGen) && !Number.isNaN(mbGen) && mbGen < gpuGen - 1) {
      issues.push(warn("PCIE_GEN", [gpu.id, mb.id],
        `🟡 GPU PCIe ${gpuS.pcie} sur slot ${mbS.pcieX16Version} : fonctionne, mais bande passante réduite sur les GPU x8.`,
        `Privilégiez une carte mère PCIe ≥ ${gpuS.pcie} pour les petits GPU, ou un GPU x16.`));
    }
  }

  const hasError = issues.some((i) => i.severity === "error");
  const hasWarn = issues.some((i) => i.severity === "warning");
  return {
    status: hasError ? "incompatible" : hasWarn ? "warning" : "compatible",
    issues,
    checkedAt: new Date().toISOString(),
    engineVersion: ENGINE_VERSION,
  };
}

export function statusEmoji(s: CompatibilityResult["status"]): string {
  return s === "compatible" ? "🟢" : s === "warning" ? "🟡" : "🔴";
}
