// Mise en place des pièces dans le boîtier, en millimètres réels.
// Fonction pure : la vue 3D ne fait que dessiner ce qui est calculé ici.
//
// Repère : x = profondeur (arrière négatif, avant positif), y = hauteur (sol à 0),
// z = largeur (panneau vitré côté positif, plateau de carte mère côté négatif).
import type { FormFactor, ResolvedBuild } from "./types";

export type Vec3 = [number, number, number];
export interface Box {
  center: Vec3;
  size: Vec3;
}

const BOARD_SIZE: Record<FormFactor, { h: number; w: number }> = {
  "E-ATX": { h: 305, w: 277 },
  ATX: { h: 305, w: 244 },
  "Micro-ATX": { h: 244, w: 244 },
  "Mini-ITX": { h: 170, w: 170 },
};

/** Boîtier fictif quand aucun n'est choisi : une tour moyenne standard. */
const DEFAULT_CASE = { h: 480, w: 230, d: 450, maxCooler: 165, maxGpu: 380 };

export type RadiatorMount = "top" | "front" | "side";

export interface Layout {
  hasCase: boolean;
  dims: { h: number; w: number; d: number };
  dual: boolean;
  feet: number;
  /** Plan du plateau de carte mère, et surface de la carte où reposent les composants. */
  trayZ: number;
  surfaceZ: number;
  /** Face intérieure du panneau vitré. */
  panelZ: number;
  board: Box & { formFactor: FormFactor };
  /** Bord arrière et bord haut de la carte mère, et hauteur du premier slot PCIe. */
  xRear: number;
  yTop: number;
  slotY: number;
  shroudTop: number | null;
  cpu: { x: number; y: number };
  gpu: (Box & { maxEndX: number; startX: number }) | null;
  ram: Box[];
  cooler:
    | { kind: "AIR"; box: Box; towers: number; maxTopZ: number }
    | { kind: "AIO"; pump: Vec3; radiator: Box; mount: RadiatorMount; fanSize: number; fans: number }
    | null;
  psu: Box | null;
  ssd: (Box & { m2: boolean }) | null;
}

export function computeLayout(build: ResolvedBuild): Layout {
  const cs = build.CASE?.specs;
  const dims = cs?.dims ?? DEFAULT_CASE;
  const { h: H, w: W, d: D } = dims;
  const maxCooler = cs?.maxCoolerHeightMM ?? DEFAULT_CASE.maxCooler;
  const maxGpu = cs?.maxGpuLengthMM ?? DEFAULT_CASE.maxGpu;
  const dual = cs?.layout === "dual";
  const feet = 14;

  // Le plateau est placé pour que la hauteur libre au-dessus du processeur soit celle annoncée par le fabricant.
  const panelZ = W / 2 - 5;
  const trayZ = Math.max(-W / 2 + (dual ? 100 : 22), panelZ - maxCooler - 20);
  const surfaceZ = trayZ + 10;

  const formFactor: FormFactor = build.MOTHERBOARD?.specs.formFactor ?? "ATX";
  const bs = BOARD_SIZE[formFactor];
  const itx = formFactor === "Mini-ITX";
  const yTop = H - 38;
  const xRear = -D / 2 + 20;
  const board = {
    formFactor,
    center: [xRear + bs.w / 2, yTop - bs.h / 2, trayZ + 9] as Vec3,
    size: [bs.w, bs.h, 2] as Vec3,
  };
  const shroudTop = dual ? null : feet + Math.min(105, Math.max(60, yTop - bs.h - 14 - feet));

  const cpu = { x: xRear + (itx ? 85 : 98), y: yTop - (itx ? 62 : 72) };
  const slotY = yTop - (itx ? 158 : 155);

  // Carte graphique : fixée à l'arrière, elle s'étend vers l'avant sur toute sa longueur.
  let gpu: Layout["gpu"] = null;
  if (build.GPU) {
    const g = build.GPU.specs;
    const startX = -D / 2 + 6;
    gpu = {
      startX,
      maxEndX: startX + maxGpu,
      center: [startX + g.lengthMM / 2, slotY + 8 - g.thicknessMM / 2, surfaceZ + 2 + g.heightMM / 2],
      size: [g.lengthMM, g.thicknessMM, g.heightMM],
    };
  }

  // Mémoire : deux barrettes occupent les emplacements 2 et 4.
  const ram: Box[] = [];
  if (build.RAM) {
    const r = build.RAM.specs;
    const first = xRear + (itx ? 138 : 196);
    const offsets = r.sticks >= 4 ? [0, 9, 18, 27] : r.sticks === 2 ? [9, 27] : [9];
    for (const o of offsets) {
      ram.push({ center: [first + o, yTop - 14 - 66.5, surfaceZ + 4 + r.heightMM / 2], size: [7, 133, r.heightMM] });
    }
  }

  let cooler: Layout["cooler"] = null;
  if (build.COOLER) {
    const c = build.COOLER.specs;
    if (c.kind === "AIR") {
      const height = c.heightMM ?? 155;
      const towers = c.fans >= 2 ? 2 : 1;
      cooler = {
        kind: "AIR",
        towers,
        maxTopZ: surfaceZ + 8 + maxCooler,
        box: { center: [cpu.x, cpu.y, surfaceZ + 8 + height / 2], size: [towers === 2 ? 136 : 78, 126, height] },
      };
    } else {
      const rad = c.radiatorMM ?? 240;
      const fanSize = rad % 140 === 0 ? 140 : 120;
      const fans = Math.round(rad / fanSize);
      const len = rad + 38;
      const mount: RadiatorMount =
        (cs?.radiatorTopMM ?? 360) >= rad ? "top"
        : (cs?.radiatorFrontMM ?? 0) >= rad ? "front"
        : (cs?.radiatorSideMM ?? 0) >= rad ? "side" : "top";
      const midZ = (surfaceZ + panelZ) / 2 + 12;
      const radiator: Box =
        mount === "top" ? { center: [Math.min(D / 2 - 30 - len / 2, xRear + 30 + len / 2 + 40), H - 16 - 13.5, midZ], size: [len, 27, fanSize] }
        : mount === "front" ? { center: [D / 2 - 14 - 25 - 13.5, Math.min(H - 30 - len / 2, feet + 20 + len / 2 + 60), midZ], size: [27, len, fanSize] }
        : { center: [D / 2 - 24 - fanSize / 2, H / 2, surfaceZ + 2 + 25 + 13.5], size: [fanSize, len, 27] };
      cooler = { kind: "AIO", pump: [cpu.x, cpu.y, surfaceZ + 8 + 24], radiator, mount, fanSize, fans };
    }
  }

  let psu: Layout["psu"] = null;
  if (build.PSU) {
    const len = build.PSU.specs.lengthMM;
    psu = dual
      ? { center: [-D / 2 + 12 + len / 2, feet + 8 + 75, -W / 2 + 8 + 43], size: [len, 150, 86] }
      : { center: [-D / 2 + 12 + len / 2, feet + 5 + 43, 0], size: [len, 86, Math.min(150, W - 30)] };
  }

  let ssd: Layout["ssd"] = null;
  if (build.SSD) {
    ssd = build.SSD.specs.interface === "NVMe"
      ? { m2: true, center: [cpu.x + 22, slotY + 27, surfaceZ + 4], size: [80, 22, 6] }
      : { m2: false, center: [D / 2 - 110, (shroudTop ?? feet + 4) + 5, 0], size: [100, 7, 70] };
  }

  return {
    hasCase: Boolean(build.CASE), dims: { h: H, w: W, d: D }, dual, feet,
    trayZ, surfaceZ, panelZ, board, xRear, yTop, slotY, shroudTop, cpu, gpu, ram, cooler, psu, ssd,
  };
}
