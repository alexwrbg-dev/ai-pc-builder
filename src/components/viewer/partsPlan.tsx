"use client";
// Modèles du style « plan » : volumes simples, tracés au trait, à partir des dimensions réelles.
// Le style « rendu » a ses propres modèles détaillés dans partsReal.tsx.
import { useContext, useMemo } from "react";
import * as THREE from "three";
import type { Layout, Vec3 } from "@/lib/layout3d";
import type { ComponentOf, Finish } from "@/lib/types";
import { Block, Cyl, Fan, LookContext, Mat } from "./primitives";

const FINISH: Record<Finish, { body: string; trim: string; dark: string }> = {
  black: { body: "#262a33", trim: "#3a404c", dark: "#16181d" },
  white: { body: "#e9ecf0", trim: "#c8ced8", dark: "#aab2be" },
  silver: { body: "#b8bec8", trim: "#8f96a2", dark: "#5c626d" },
};

// ------------------------------------------------------------------ Boîtier

export function CaseShell({ pc, L }: { pc: ComponentOf<"CASE"> | undefined; L: Layout }) {
  const { h: H, w: W, d: D } = L.dims;
  const f = FINISH[pc?.finish ?? "black"];
  const front = pc?.specs.front ?? "mesh";
  const midY = L.feet + (H - L.feet) / 2;
  const tall = H - L.feet;
  const ghost = !pc;
  const post = 9;

  const slats = useMemo(() => {
    const n = Math.max(6, Math.floor((W - 24) / 15));
    return Array.from({ length: n }, (_, i) => -W / 2 + 14 + ((W - 28) / (n - 1)) * i);
  }, [W]);

  if (ghost) {
    // Aucun boîtier choisi : simple gabarit en pointillé, pour situer les pièces.
    return <Block at={[0, midY, 0]} size={[D, tall, W]} color="#7fd6ff" opacity={0.04} />;
  }

  return (
    <group>
      {/* Pieds et plancher */}
      {([[-1, -1], [-1, 1], [1, -1], [1, 1]] as const).map(([sx, sz]) => (
        <Block key={`${sx}${sz}`} at={[sx * (D / 2 - 45), L.feet / 2, sz * (W / 2 - 22)]} size={[46, L.feet, 22]} color={f.dark} outline={false} />
      ))}
      <Block at={[0, L.feet + 2, 0]} size={[D - 6, 4, W - 6]} color={f.body} />

      {/* Montants et traverses hautes */}
      {([[-1, -1], [-1, 1], [1, -1], [1, 1]] as const).map(([sx, sz]) => (
        <Block key={`p${sx}${sz}`} at={[sx * (D / 2 - post / 2), midY, sz * (W / 2 - post / 2)]} size={[post, tall, post]} color={f.body} />
      ))}
      <Block at={[0, H - post / 2, W / 2 - post / 2]} size={[D, post, post]} color={f.body} />
      <Block at={[0, H - post / 2, -W / 2 + post / 2]} size={[D, post, post]} color={f.body} />

      {/* Panneau droit, arrière et dessus ajouré */}
      <Block at={[0, midY, -W / 2 + 2]} size={[D - 2, tall - 2, 4]} color={f.body} />
      <Block at={[-D / 2 + 2, midY, 0]} size={[4, tall - 2, W - 2]} color={f.body} />
      <Block at={[0, H - 2, 0]} size={[D - 2 * post, 4, W - 2 * post]} color={f.dark} opacity={0.4} />

      {/* Plateau de carte mère */}
      <Block at={[0, midY, L.trayZ]} size={[D - 8, tall - 8, 2]} color={f.trim} />

      {/* Cache d'alimentation des boîtiers classiques */}
      {L.shroudTop !== null && (
        <>
          <Block at={[0, L.shroudTop, (L.trayZ + W / 2) / 2]} size={[D - 10, 3, W / 2 - L.trayZ - 6]} color={f.body} />
          <Block at={[0, (L.feet + L.shroudTop) / 2, W / 2 - 8]} size={[D - 10, L.shroudTop - L.feet, 3]} color={f.body} opacity={0.45} />
        </>
      )}

      {/* Façade */}
      {front === "glass" && <Block at={[D / 2 - 2, midY, (L.trayZ + W / 2) / 2]} size={[4, tall - 4, W / 2 - L.trayZ - 4]} color="#a9cdea" metalness={0.9} roughness={0.05} opacity={0.12} />}
      {front === "mesh" && <Block at={[D / 2 - 2, midY, 0]} size={[4, tall - 4, W - 4]} color={f.dark} opacity={0.5} />}
      {front === "solid" && <Block at={[D / 2 - 2, midY, 0]} size={[4, tall - 4, W - 4]} color={f.body} />}
      {front === "wood" && (
        <>
          <Block at={[D / 2 - 12, midY, 0]} size={[3, tall - 20, W - 12]} color={f.dark} opacity={0.5} />
          {slats.map((z) => (
            <Block key={z} at={[D / 2 - 4, midY, z]} size={[8, tall - 34, 9]} color={pc.finish === "white" ? "#c9a878" : "#6e4b2d"} roughness={0.85} metalness={0} outline={false} />
          ))}
        </>
      )}
    </group>
  );
}

/** Panneau latéral vitré : pièce à part pour pouvoir s'écarter en vue éclatée. */
export function GlassPanel({ L }: { L: Layout }) {
  const { h: H, w: W, d: D } = L.dims;
  return <Block at={[0, L.feet + (H - L.feet) / 2, W / 2 - 2]} size={[D - 20, H - L.feet - 20, 4]} color="#a9cdea" metalness={0.9} roughness={0.05} opacity={0.1} />;
}

/** Ventilateurs livrés avec le boîtier. Disposition schématique : avant ou latéral, plus un à l'arrière. */
export function CaseFans({ pc, L }: { pc: ComponentOf<"CASE">; L: Layout }) {
  const { h: H, w: W, d: D } = L.dims;
  const s = pc.specs;
  const size = W >= 235 ? 140 : 120;
  const f = FINISH[pc.finish];
  const n = s.includedFans;
  const rear = n >= 2 || n === 1;
  const intake = Math.min(3, n - (rear ? 1 : 0));
  const sideMounted = L.dual || s.front === "glass";
  const aio = L.cooler?.kind === "AIO" ? L.cooler.mount : null;
  const midZ = (L.surfaceZ + L.panelZ) / 2;
  const usable = H - L.feet - 60;
  const step = Math.min(size + 6, usable / Math.max(intake, 1));
  const y0 = L.feet + 30 + (usable - step * (intake - 1)) / 2;

  const fans: { at: Vec3; axis: "x" | "z" }[] = [];
  if (rear) fans.push({ at: [-D / 2 + 20, L.cpu.y, midZ], axis: "x" });
  for (let i = 0; i < intake; i++) {
    if (sideMounted) {
      if (aio !== "side") fans.push({ at: [D / 2 - 22 - size / 2, y0 + i * step, L.trayZ + 16], axis: "z" });
    } else if (aio !== "front") {
      fans.push({ at: [D / 2 - 24, y0 + i * step, midZ], axis: "x" });
    }
  }
  return <>{fans.map((fan, i) => <Fan key={i} at={fan.at} axis={fan.axis} size={size} rgb={s.rgbFans} color={f.dark} />)}</>;
}

// ------------------------------------------------------------------ Carte mère et processeur

export function Board({ mb, L }: { mb: ComponentOf<"MOTHERBOARD">; L: Layout }) {
  const f = FINISH[mb.finish];
  const white = mb.finish === "white";
  const z = L.surfaceZ;
  const [bw, bh] = L.board.size;
  const itx = L.board.formFactor === "Mini-ITX";
  const slotX = L.xRear + (itx ? 138 : 196);
  return (
    <group>
      <Block at={L.board.center} size={L.board.size} color={white ? "#dfe3e8" : "#111317"} roughness={0.8} />
      {/* Carénage des connecteurs arrière et dissipateurs des étages d'alimentation */}
      <Block at={[L.xRear + 10, L.yTop - 86, z + 20]} size={[20, 150, 40]} color={f.body} />
      <Block at={[L.xRear + 34, L.yTop - 76, z + 14]} size={[22, 104, 28]} color={f.trim} metalness={0.7} roughness={0.35} />
      <Block at={[L.cpu.x + 6, L.yTop - 17, z + 12]} size={[104, 20, 24]} color={f.trim} metalness={0.7} roughness={0.35} />
      {/* Socket */}
      <Block at={[L.cpu.x, L.cpu.y, z + 3]} size={[54, 54, 6]} color="#22252c" outline={false} />
      {/* Emplacements mémoire */}
      {Array.from({ length: mb.specs.ramSlots >= 4 ? 4 : 2 }, (_, i) => (mb.specs.ramSlots >= 4 ? i * 9 : 9 + i * 18)).map((o) => (
        <Block key={o} at={[slotX + o, L.yTop - 14 - 66.5, z + 3]} size={[5, 140, 6]} color="#2a2d35" outline={false} />
      ))}
      {/* Port PCIe x16 et connecteur 24 broches */}
      <Block at={[L.xRear + 112, L.slotY, z + 5]} size={[92, 8, 10]} color="#2a2d35" outline={false} />
      <Block at={[L.xRear + bw - 7, L.yTop - 108, z + 7]} size={[9, 52, 13]} color="#2a2d35" outline={false} />
      {/* Dissipateur du chipset et des SSD */}
      {!itx && <Block at={[L.xRear + bw - 58, L.yTop - bh + 62, z + 6]} size={[66, 66, 11]} color={f.trim} metalness={0.7} roughness={0.35} />}
      {!itx && <Block at={[L.xRear + 116, L.slotY - 44, z + 5]} size={[96, 24, 8]} color={f.trim} metalness={0.7} roughness={0.35} />}
    </group>
  );
}

export function Cpu({ L }: { L: Layout }) {
  return <Block at={[L.cpu.x, L.cpu.y, L.surfaceZ + 8]} size={[40, 40, 4]} color="#c9ced6" metalness={0.9} roughness={0.25} />;
}

// ------------------------------------------------------------------ Carte graphique

export function Gpu({ gpu, L }: { gpu: ComponentOf<"GPU">; L: Layout }) {
  const g = L.gpu!;
  const f = FINISH[gpu.finish];
  const [len, thick, height] = g.size;
  const [cx, cy, cz] = g.center;
  const fans = gpu.specs.fans;
  const fanR = Math.min(height * 0.44, len / (fans * 2) - 5);
  const pitch = len / fans;
  return (
    <group>
      {/* Équerre de fixation, circuit, carénage, plaque arrière */}
      <Block at={[g.startX - 1, cy, cz + 6]} size={[3, thick + 6, height + 14]} color="#c9ced6" metalness={0.9} roughness={0.3} outline={false} />
      <Block at={[cx, cy, cz]} size={[len, thick, height]} color={f.body} roughness={0.45} />
      <Block at={[cx, cy + thick / 2 + 1, cz]} size={[len - 4, 2.5, height - 4]} color={f.trim} metalness={0.8} roughness={0.3} outline={false} />
      {/* Tranche visible depuis la vitre : bandeau et connecteur d'alimentation */}
      <Block at={[cx + len * 0.12, cy, cz + height / 2 + 1]} size={[len * 0.5, thick * 0.3, 2]} color={f.trim} metalness={0.8} roughness={0.25} outline={false} />
      <Block at={[cx + len * 0.18, cy + thick / 2 + 4, cz + height / 2 - 12]} size={[gpu.specs.power16pin ? 20 : 18 * Math.max(1, gpu.specs.power8pin), 6, 10]} color="#0d0e12" outline={false} />
      {/* Ventilateurs, face tournée vers le bas */}
      {Array.from({ length: fans }, (_, i) => (
        <group key={i}>
          <Cyl at={[g.startX + pitch * (i + 0.5), cy - thick / 2 - 0.5, cz]} r={fanR} len={3} axis="y" color="#0d0e12" outline={false} />
          <Cyl at={[g.startX + pitch * (i + 0.5), cy - thick / 2 - 2, cz]} r={fanR * 0.3} len={4} axis="y" color={f.trim} outline={false} />
        </group>
      ))}
    </group>
  );
}

// ------------------------------------------------------------------ Mémoire, stockage, alimentation

export function Ram({ ram, L }: { ram: ComponentOf<"RAM">; L: Layout }) {
  const f = FINISH[ram.finish];
  return (
    <group>
      {L.ram.map((b, i) => (
        <group key={i}>
          <Block at={b.center} size={b.size} color={f.body} metalness={0.6} roughness={0.4} />
          {ram.specs.rgb && <Block at={[b.center[0], b.center[1], b.center[2] + b.size[2] / 2 + 2]} size={[5, b.size[1] - 6, 4]} color="#ffffff" glow={1.8} outline={false} />}
        </group>
      ))}
    </group>
  );
}

export function Ssd({ L }: { L: Layout }) {
  const s = L.ssd!;
  return s.m2
    ? <Block at={s.center} size={s.size} color="#3a3f4a" metalness={0.8} roughness={0.35} />
    : <Block at={s.center} size={s.size} color="#22252c" metalness={0.6} roughness={0.4} />;
}

export function Psu({ psu, L }: { psu: ComponentOf<"PSU">; L: Layout }) {
  const p = L.psu!;
  const f = FINISH[psu.finish];
  const [cx, cy, cz] = p.center;
  return (
    <group>
      <Block at={p.center} size={p.size} color={f.body} metalness={0.5} roughness={0.5} />
      {/* Grille du ventilateur et étiquette, sur la face tournée vers la vitre */}
      <Cyl at={[cx, cy, cz + p.size[2] / 2 + 0.5]} r={Math.min(p.size[0], p.size[1]) * 0.36} len={2} axis="z" color={f.dark} outline={false} />
      <Block at={[cx + p.size[0] / 2 - 18, cy, cz + p.size[2] / 2 + 0.5]} size={[22, p.size[1] * 0.7, 1.5]} color={f.trim} outline={false} />
    </group>
  );
}

// ------------------------------------------------------------------ Refroidissement

export function AirCooler({ cooler, L }: { cooler: ComponentOf<"COOLER">; L: Layout }) {
  const look = useContext(LookContext);
  const c = L.cooler as Extract<Layout["cooler"], { kind: "AIR" }>;
  const f = FINISH[cooler.finish];
  const [cx, cy, cz] = c.box.center;
  const height = c.box.size[2];
  const base = cz - height / 2;
  const depth = 46;
  const towersX = c.towers === 2 ? [-35, 35] : [-12];
  const finStart = base + 34;
  const finEnd = base + height - 6;
  const fins = useMemo(() => {
    const n = Math.floor((finEnd - finStart) / 5);
    return Array.from({ length: n }, (_, i) => finStart + i * 5);
  }, [finStart, finEnd]);
  const metal = cooler.finish === "black" ? "#2a2d35" : cooler.finish === "white" ? "#e9ecf0" : "#c3c8d0";

  return (
    <group>
      <Block at={[cx, cy, base + 7]} size={[46, 46, 14]} color="#b08d57" metalness={0.9} roughness={0.3} outline={false} />
      {towersX.map((tx) => (
        <group key={tx}>
          {look.plan
            ? <Block at={[cx + tx, cy, (finStart + finEnd) / 2]} size={[depth, 122, finEnd - finStart]} color={metal} />
            : fins.map((z) => <Block key={z} at={[cx + tx, cy, z]} size={[depth, 122, 1.4]} color={metal} metalness={0.85} roughness={0.35} outline={false} />)}
          {[-42, -14, 14, 42].map((dy) => (
            <Cyl key={dy} at={[cx + tx, cy + dy, (base + 14 + finEnd) / 2]} r={3} len={finEnd - base - 14} color="#b08d57" metalness={0.9} roughness={0.3} outline={false} segments={10} />
          ))}
          <Block at={[cx + tx, cy, base + height - 3]} size={[depth + 2, 124, 5]} color={f.body} />
        </group>
      ))}
      {/* Un ventilateur par tour : devant la tour simple, entre les deux et devant pour la double */}
      {(c.towers === 2 ? [0, 72] : [26]).map((fx) => (
        <Fan key={fx} at={[cx + fx, cy, (finStart + finEnd) / 2]} axis="x" size={Math.min(120, finEnd - finStart + 6)} rgb={cooler.specs.rgb} color={f.dark} />
      ))}
    </group>
  );
}

export function LiquidCooler({ cooler, L }: { cooler: ComponentOf<"COOLER">; L: Layout }) {
  const look = useContext(LookContext);
  const c = L.cooler as Extract<Layout["cooler"], { kind: "AIO" }>;
  const f = FINISH[cooler.finish];
  const r = c.radiator;
  const [rx, ry, rz] = r.center;

  // Ventilateurs plaqués contre le radiateur, côté intérieur du boîtier.
  const fans: { at: Vec3; axis: "x" | "y" | "z" }[] = [];
  for (let i = 0; i < c.fans; i++) {
    const o = (i - (c.fans - 1) / 2) * c.fanSize;
    if (c.mount === "top") fans.push({ at: [rx + o, ry - 13.5 - 12.5, rz], axis: "y" });
    else if (c.mount === "front") fans.push({ at: [rx + 13.5 + 12.5, ry + o, rz], axis: "x" });
    else fans.push({ at: [rx, ry + o, rz + 13.5 + 12.5], axis: "z" });
  }

  // Deux tuyaux souples entre la pompe et l'extrémité la plus proche du radiateur.
  const tubes = useMemo(() => {
    const [px, py, pz] = c.pump;
    const end: Vec3 =
      c.mount === "top" ? [rx - r.size[0] / 2 + 22, ry - 14, rz]
      : c.mount === "front" ? [rx - 14, ry - r.size[1] / 2 + 22, rz]
      : [rx, ry - r.size[1] / 2 + 22, rz + 14];
    return [-9, 9].map((d) => {
      const start = new THREE.Vector3(px + 26, py + d, pz);
      const stop = new THREE.Vector3(end[0], end[1], end[2] + d);
      const bulge = new THREE.Vector3((start.x + stop.x) / 2 + 30, (start.y + stop.y) / 2, Math.max(start.z, stop.z) + 55);
      return new THREE.TubeGeometry(new THREE.CatmullRomCurve3([start, new THREE.Vector3(px + 50, py + d, pz + 20), bulge, stop]), 40, 5.5, 10);
    });
  }, [c.pump, c.mount, rx, ry, rz, r.size]);

  return (
    <group>
      <Cyl at={c.pump} r={35} len={46} color={f.body} metalness={0.5} roughness={0.35} />
      <Cyl at={[c.pump[0], c.pump[1], c.pump[2] + 23.5]} r={27} len={1.5} color="#0d0e12" glow={cooler.specs.rgb ? 1.4 : 0} outline={false} />
      <Block at={r.center} size={r.size} color={f.dark} metalness={0.4} roughness={0.6} />
      {fans.map((fan, i) => <Fan key={i} at={fan.at} axis={fan.axis} size={c.fanSize} rgb={cooler.specs.rgb} color={cooler.finish === "black" ? f.dark : f.body} />)}
      {tubes.map((geo, i) => (
        <mesh key={i} geometry={geo}>
          {look.plan
            ? <meshBasicMaterial color="#7fd6ff" wireframe transparent opacity={0.5} />
            : <meshStandardMaterial color="#0d0e12" roughness={0.7} />}
        </mesh>
      ))}
    </group>
  );
}

export { Mat };
