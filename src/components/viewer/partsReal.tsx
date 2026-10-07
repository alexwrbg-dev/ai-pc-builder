"use client";
// Modèles du style « rendu ». Formes génériques mais détaillées : chaque pièce garde ses dimensions réelles,
// sa teinte, son nombre de ventilateurs et son éclairage. Ce ne sont pas des copies des produits des marques.
import { useMemo } from "react";
import * as THREE from "three";
import type { Layout, Vec3 } from "@/lib/layout3d";
import type { ComponentOf } from "@/lib/types";
import { Box, Cable, Fins, Glass, Glow, M, Mesh, RBox, RealFan, Rod, TONE, usePcb, useRadiatorCore } from "./real";

const STEEL = "#c4c9d1";
const SOCKET = "#22252b";

// ================================================================== Boîtier

export function RealCase({ pc, L, cableColor, cables = true }: { pc: ComponentOf<"CASE">; L: Layout; cableColor: string; cables?: boolean }) {
  const { h: H, w: W, d: D } = L.dims;
  const s = pc.specs;
  const t = TONE[pc.finish];
  const tall = H - L.feet;
  const midY = L.feet + tall / 2;
  const post = 10;
  const mainMidZ = (L.trayZ + W / 2) / 2;
  const mainW = W / 2 - L.trayZ;
  const panoramic = s.front === "glass";

  const slats = useMemo(() => {
    const n = Math.max(8, Math.floor((W - 30) / 13));
    return Array.from({ length: n }, (_, i) => ({ z: -W / 2 + 16 + ((W - 32) / (n - 1)) * i, shade: 0.9 + ((i * 37) % 10) / 50 }));
  }, [W]);
  const wood = useMemo(() => new THREE.Color(pc.finish === "white" ? "#c8a678" : "#6b472b"), [pc.finish]);

  return (
    <group>
      {/* Pieds */}
      {([[-1, -1], [-1, 1], [1, -1], [1, 1]] as const).map(([sx, sz]) => (
        <group key={`${sx}${sz}`}>
          <RBox at={[sx * (D / 2 - 48), L.feet / 2 + 2, sz * (W / 2 - 24)]} size={[52, L.feet - 3, 24]} r={3}><M color={t.paint} /></RBox>
          <Box at={[sx * (D / 2 - 48), 1.5, sz * (W / 2 - 24)]} size={[46, 3, 20]} shadow={false}><M kind="rubber" color="#0a0a0b" /></Box>
        </group>
      ))}

      {/* Structure : plancher, montants, traverses */}
      <Box at={[0, L.feet + 2, 0]} size={[D - 4, 4, W - 4]}><M color={t.paint} /></Box>
      {([[-1, -1], [-1, 1], [1, -1], [1, 1]] as const).filter(([sx, sz]) => !(panoramic && sx === 1 && sz === 1)).map(([sx, sz]) => (
        <RBox key={`p${sx}${sz}`} at={[sx * (D / 2 - post / 2), midY, sz * (W / 2 - post / 2)]} size={[post, tall, post]} r={2.5}><M color={t.paint} /></RBox>
      ))}
      <RBox at={[0, H - post / 2, W / 2 - post / 2]} size={[D, post, post]} r={2.5}><M color={t.paint} /></RBox>
      <RBox at={[0, H - post / 2, -W / 2 + post / 2]} size={[D, post, post]} r={2.5}><M color={t.paint} /></RBox>
      <RBox at={[D / 2 - post / 2, H - post / 2, 0]} size={[post, post, W]} r={2.5}><M color={t.paint} /></RBox>
      <RBox at={[-D / 2 + post / 2, H - post / 2, 0]} size={[post, post, W]} r={2.5}><M color={t.paint} /></RBox>

      {/* Panneau droit plein */}
      <Box at={[0, midY, -W / 2 + 1.5]} size={[D - 2, tall - 2, 3]}><M color={t.paint} /></Box>

      {/* Dessus : grille, avec le bandeau des prises de façade */}
      <Mesh at={[-14, H - 1.5, 0]} size={[D - 60, W - 26]} normal="y" color={t.trim} pitch={4} />
      <Box at={[D / 2 - 26, H - 1.2, 0]} size={[34, 2.4, W - 22]}><M color={t.paint} /></Box>
      <Rod at={[D / 2 - 26, H + 0.6, W / 2 - 34]} r={6.5} len={2} axis="y"><M kind="brushed" color={t.trim} /></Rod>
      <mesh position={[D / 2 - 26, H + 1.7, W / 2 - 34]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[4.6, 5.8, 32]} />
        <Glow color="#ffffff" power={0.9} />
      </mesh>
      {[58, 76].map((dz) => <Box key={dz} at={[D / 2 - 26, H + 0.1, W / 2 - dz]} size={[7, 0.6, 13]} shadow={false}><M kind="plastic" color="#08090a" /></Box>)}
      <Rod at={[D / 2 - 26, H + 0.2, W / 2 - 94]} r={2.6} len={0.6} axis="y"><M kind="plastic" color="#08090a" /></Rod>

      {/* Arrière : tôle, grille d'extraction, caches des slots, découpe des connecteurs */}
      <Box at={[-D / 2 + 1.5, midY, 0]} size={[3, tall - 2, W - 2]}><M color={t.paint} /></Box>
      <Mesh at={[-D / 2 - 0.4, L.cpu.y, (L.surfaceZ + L.panelZ) / 2]} size={[Math.min(124, L.panelZ - L.surfaceZ - 8), 124]} normal="x" color={t.dark} pitch={5} />
      <Box at={[-D / 2 - 0.3, L.yTop - 92, L.surfaceZ + 23]} size={[1, 150, 44]} shadow={false}><M kind="plastic" color="#060607" /></Box>
      {Array.from({ length: 7 }, (_, i) => (
        <Box key={i} at={[-D / 2 - 0.4, L.slotY + 6 - i * 20.3, L.surfaceZ + 58]} size={[1.2, 13, 112]} shadow={false}><M kind="brushed" color={pc.finish === "white" ? "#dfe3e8" : "#3a3e46"} /></Box>
      ))}

      {/* Plateau de carte mère et passe-câbles en caoutchouc */}
      <Box at={[0, midY, L.trayZ]} size={[D - 6, tall - 6, 2]}><M color={t.paint} /></Box>
      {[0, 1].map((k) => (
        <RBox key={k} at={[L.xRear + L.board.size[0] + 22, L.yTop - 70 - k * 130, L.trayZ + 1.6]} size={[20, 84, 2]} r={8}><M kind="rubber" color="#0b0b0c" /></RBox>
      ))}
      <RBox at={[L.cpu.x + 20, L.yTop + 16, L.trayZ + 1.6]} size={[92, 16, 2]} r={7}><M kind="rubber" color="#0b0b0c" /></RBox>

      {/* Cache d'alimentation : ouvert à l'arrière pour laisser voir le bloc */}
      {L.shroudTop !== null && (() => {
        const psuEnd = L.psu ? L.psu.center[0] + L.psu.size[0] / 2 + 14 : -D / 2 + 180;
        const len = D / 2 - 6 - psuEnd;
        return (
          <>
            <Box at={[0, L.shroudTop, mainMidZ]} size={[D - 8, 3, mainW - 6]}><M color={t.paint} /></Box>
            <Mesh at={[D / 2 - 110, L.shroudTop + 1.7, mainMidZ]} size={[150, mainW - 40]} normal="y" color={t.dark} pitch={5} />
            <Box at={[psuEnd + len / 2, (L.feet + L.shroudTop) / 2, W / 2 - 7]} size={[len, L.shroudTop - L.feet, 2.5]}><M color={t.paint} /></Box>
          </>
        );
      })()}

      {/* Façade */}
      {s.front === "mesh" && (
        <>
          <Mesh at={[D / 2 - 0.5, midY, 0]} size={[W - 22, tall - 22]} normal="x" color={t.trim} pitch={4} />
          <Box at={[D / 2 - 1.5, L.feet + 6, 0]} size={[3, 12, W - 2]}><M color={t.paint} /></Box>
        </>
      )}
      {s.front === "solid" && <RBox at={[D / 2 - 3, midY, 0]} size={[6, tall - 2, W - 2]} r={3}><M color={t.paint} /></RBox>}
      {s.front === "glass" && (
        <>
          <mesh position={[D / 2 - 2, midY, mainMidZ]}><boxGeometry args={[4, tall - 6, mainW - 4]} /><Glass /></mesh>
          <Box at={[D / 2 - 2, midY, L.trayZ - (W / 2 + L.trayZ) / 2]} size={[4, tall - 2, W / 2 + L.trayZ]}><M color={t.paint} /></Box>
        </>
      )}
      {s.front === "wood" && (
        <>
          <Mesh at={[D / 2 - 12, midY, 0]} size={[W - 16, tall - 20]} normal="x" color={t.dark} pitch={4} />
          {slats.map(({ z, shade }) => (
            <RBox key={z} at={[D / 2 - 4, midY, z]} size={[9, tall - 30, 8.5]} r={2}>
              <meshStandardMaterial color={wood.clone().multiplyScalar(shade)} roughness={0.78} metalness={0} />
            </RBox>
          ))}
        </>
      )}

      {/* Câbles gainés : 24 broches et alimentation du processeur */}
      {cables && (<>
      <Cable color={cableColor} strands={5} radius={2.6} spread="y" points={[
        [L.xRear + L.board.size[0] - 4, L.yTop - 108, L.surfaceZ + 14],
        [L.xRear + L.board.size[0] + 10, L.yTop - 108, L.surfaceZ + 30],
        [L.xRear + L.board.size[0] + 22, L.yTop - 108, L.surfaceZ + 14],
        [L.xRear + L.board.size[0] + 22, L.yTop - 108, L.trayZ + 2],
      ]} />
      <Cable color={cableColor} strands={3} radius={2.4} spread="x" points={[
        [L.cpu.x - 30, L.yTop - 6, L.surfaceZ + 10],
        [L.cpu.x - 30, L.yTop + 8, L.surfaceZ + 16],
        [L.cpu.x - 20, L.yTop + 16, L.surfaceZ + 4],
        [L.cpu.x - 20, L.yTop + 16, L.trayZ + 2],
      ]} />
      </>)}
    </group>
  );
}

/** Panneau latéral en verre trempé, avec sa bordure sérigraphiée noire. */
export function RealGlass({ L, white = false }: { L: Layout; white?: boolean }) {
  const { h: H, w: W, d: D } = L.dims;
  const tall = H - L.feet - 14;
  const y = L.feet + 7 + tall / 2;
  const z = W / 2 - 2;
  const b = 11;
  return (
    <group>
      <mesh position={[0, y, z]}><boxGeometry args={[D - 14, tall, 4]} /><Glass /></mesh>
      {([[0, tall / 2 - b / 2, D - 14, b], [0, -tall / 2 + b / 2, D - 14, b], [-(D - 14) / 2 + b / 2, 0, b, tall], [(D - 14) / 2 - b / 2, 0, b, tall]] as const).map(([dx, dy, w, h], i) => (
        <Box key={i} at={[dx, y + dy, z - 2.2]} size={[w, h, 0.4]} shadow={false}><meshStandardMaterial color={white ? "#cfd3d9" : "#050506"} roughness={0.3} /></Box>
      ))}
    </group>
  );
}

export function RealCaseFans({ pc, L }: { pc: ComponentOf<"CASE">; L: Layout }) {
  const { h: H, w: W, d: D } = L.dims;
  const s = pc.specs;
  const size = W >= 235 ? 140 : 120;
  const n = s.includedFans;
  const intake = Math.min(3, n - 1);
  const sideMounted = L.dual || s.front === "glass";
  const aio = L.cooler?.kind === "AIO" ? L.cooler.mount : null;
  const midZ = (L.surfaceZ + L.panelZ) / 2;
  const usable = H - L.feet - 60;
  const step = Math.min(size + 5, usable / Math.max(intake, 1));
  const y0 = L.feet + 30 + (usable - step * (intake - 1)) / 2;

  const fans: { at: Vec3; axis: "x" | "z" }[] = [];
  if (n >= 1) fans.push({ at: [-D / 2 + 18, L.cpu.y, midZ], axis: "x" });
  for (let i = 0; i < intake; i++) {
    if (sideMounted) {
      if (aio !== "side") fans.push({ at: [D / 2 - 24 - size / 2, y0 + i * step, L.trayZ + 16], axis: "z" });
    } else if (aio !== "front") {
      fans.push({ at: [D / 2 - 26, y0 + i * step, midZ], axis: "x" });
    }
  }
  return <>{fans.map((f, i) => <RealFan key={i} at={f.at} axis={f.axis} size={i === 0 ? 120 : size} rgb={s.rgbFans} finish={pc.finish === "white" ? "white" : "black"} />)}</>;
}

// ================================================================== Carte mère et processeur

/** Dissipateur rainuré : un socle et des nervures. */
function Heatsink({ at, size, ridges, along, color }: { at: Vec3; size: Vec3; ridges: number; along: "x" | "y"; color: string }) {
  const [w, h, d] = size;
  const span = along === "x" ? w : h;
  const pitch = span / ridges;
  return (
    <group>
      <RBox at={[at[0], at[1], at[2] - d * 0.2]} size={[w, h, d * 0.6]} r={1.5}><M kind="brushed" color={color} /></RBox>
      <Fins
        count={ridges} color={color}
        start={along === "x" ? [at[0] - w / 2 + pitch / 2, at[1], at[2] + d * 0.3] : [at[0], at[1] - h / 2 + pitch / 2, at[2] + d * 0.3]}
        step={along === "x" ? [pitch, 0, 0] : [0, pitch, 0]}
        size={along === "x" ? [pitch * 0.55, h - 2, d * 0.4] : [w - 2, pitch * 0.55, d * 0.4]}
      />
    </group>
  );
}

export function RealBoard({ mb, L }: { mb: ComponentOf<"MOTHERBOARD">; L: Layout }) {
  const white = mb.finish === "white";
  const t = TONE[mb.finish];
  const sink = white ? "#e3e6ea" : mb.specs.tier === 1 ? "#2b2e35" : "#23262c";
  const z = L.surfaceZ;
  const [bw, bh] = L.board.size;
  const itx = L.board.formFactor === "Mini-ITX";
  const slotX = L.xRear + (itx ? 138 : 196);
  const pcb = usePcb(white);
  const slots = mb.specs.ramSlots >= 4 ? [0, 9, 18, 27] : [9, 27];
  const bottom = L.yTop - bh;
  const caps = useMemo(() => {
    const out: Vec3[] = [];
    for (let i = 0; i < 9; i++) out.push([L.cpu.x - 40 + i * 10, L.cpu.y + 38, z + 5]);
    for (let i = 0; i < 6; i++) out.push([L.cpu.x - 42, L.cpu.y + 24 - i * 10, z + 5]);
    return out;
  }, [L.cpu.x, L.cpu.y, z]);

  return (
    <group>
      <mesh position={L.board.center} castShadow receiveShadow>
        <boxGeometry args={L.board.size} />
        <meshStandardMaterial map={pcb} color="#ffffff" roughness={0.62} metalness={0.15} />
      </mesh>

      {/* Connecteurs arrière et leur carénage */}
      <Box at={[L.xRear + 9, L.yTop - 86, z + 12]} size={[16, 138, 24]}><M kind="metal" color={STEEL} /></Box>
      {mb.specs.tier >= 2 && <RBox at={[L.xRear + 13, L.yTop - 78, z + 30]} size={[26, 128, 26]} r={4}><M color={white ? t.paint : "#17191d"} /></RBox>}

      {/* Dissipateurs des étages d'alimentation */}
      <Heatsink at={[L.xRear + 37, L.yTop - 74, z + (mb.specs.tier >= 2 ? 15 : 9)]} size={[20, 96, mb.specs.tier >= 2 ? 30 : 18]} ridges={12} along="y" color={sink} />
      {mb.specs.tier >= 2 && <Heatsink at={[L.cpu.x + 6, L.yTop - 16, z + 13]} size={[96, 18, 26]} ridges={12} along="x" color={sink} />}

      {/* Condensateurs et bobines autour du socket */}
      {caps.map((p, i) => (i % 3 === 0
        ? <Rod key={i} at={p} r={3.2} len={8} segments={12}><M kind="metal" color="#2a2c31" /></Rod>
        : <Box key={i} at={p} size={[7, 7, 7]} shadow={false}><M kind="plastic" color="#3a3d44" /></Box>))}

      {/* Socket et son cadre de rétention */}
      <Box at={[L.cpu.x, L.cpu.y, z + 2.5]} size={[58, 58, 5]}><M kind="plastic" color={SOCKET} /></Box>
      {mb.specs.socket.startsWith("LGA")
        ? <Box at={[L.cpu.x, L.cpu.y, z + 5.5]} size={[52, 62, 1.5]}><M kind="metal" color={STEEL} /></Box>
        : <Box at={[L.cpu.x, L.cpu.y, z + 5.5]} size={[56, 56, 1.5]}><M kind="plastic" color="#15171a" /></Box>}

      {/* Emplacements mémoire, avec leurs loquets */}
      {slots.map((o) => (
        <group key={o}>
          <Box at={[slotX + o, L.yTop - 14 - 66.5, z + 3.5]} size={[6, 140, 7]}><M kind="plastic" color={white ? "#cfd4db" : "#1b1d21"} /></Box>
          <Box at={[slotX + o, L.yTop - 14 + 5, z + 7]} size={[6, 6, 12]} shadow={false}><M kind="plastic" color={white ? "#e9ecf0" : "#2c2f35"} /></Box>
        </group>
      ))}

      {/* Ports PCIe : le premier est renforcé d'acier */}
      <Box at={[L.xRear + 112, L.slotY, z + 6]} size={[92, 9, 11]}><M kind="metal" color={STEEL} /></Box>
      {!itx && [1, 2].map((k) => (
        <Box key={k} at={[L.xRear + 112, L.slotY - 20.3 * (k + 1) - 20, z + 5]} size={[k === 1 ? 26 : 92, 7.5, 9]}><M kind="plastic" color={white ? "#cfd4db" : "#1b1d21"} /></Box>
      ))}

      {/* Dissipateurs des SSD M.2 et du chipset */}
      {!itx && <RBox at={[L.xRear + 150, L.slotY - 44, z + 5]} size={[100, 26, 8]} r={2}><M kind="brushed" color={sink} /></RBox>}
      {!itx && <RBox at={[L.xRear + bw - 52, bottom + 58, z + 6]} size={[70, 62, 11]} r={3}><M kind="brushed" color={sink} /></RBox>}
      {!itx && <Box at={[L.xRear + bw - 52, bottom + 58, z + 11.8]} size={[40, 2.4, 0.6]} shadow={false}><Glow power={0.7} /></Box>}

      {/* Connecteurs d'alimentation, SATA, pile, embases du bas */}
      <Box at={[L.xRear + bw - 7, L.yTop - 108, z + 7]} size={[10, 54, 14]}><M kind="plastic" color="#0c0d0f" /></Box>
      <Box at={[L.cpu.x - 30, L.yTop - 6, z + 7]} size={[22, 10, 14]}><M kind="plastic" color="#0c0d0f" /></Box>
      {!itx && <Box at={[L.xRear + bw - 6, bottom + 120, z + 8]} size={[12, 44, 16]}><M kind="plastic" color="#0c0d0f" /></Box>}
      <Rod at={[L.xRear + 78, L.slotY - 22, z + 2.6]} r={10} len={3.2} segments={24}><M kind="metal" color="#d5d8dd" /></Rod>
      {!itx && Array.from({ length: 6 }, (_, i) => (
        <Box key={i} at={[L.xRear + 44 + i * 30, bottom + 7, z + 5]} size={[20, 6, 9]} shadow={false}><M kind="plastic" color={i % 2 ? "#0c0d0f" : "#1d2026"} /></Box>
      ))}
    </group>
  );
}

export function RealCpu({ L, socket = "AM5" }: { L: Layout; socket?: string }) {
  // Les processeurs LGA récents sont rectangulaires, les AM4 / AM5 carrés.
  const [w, h] = socket.startsWith("LGA") ? [37.5, 45] : [40, 40];
  return (
    <group>
      <Box at={[L.cpu.x, L.cpu.y, L.surfaceZ + 6.5]} size={[w, h, 1.4]}><M kind="plastic" color="#2f6b3d" /></Box>
      <RBox at={[L.cpu.x, L.cpu.y, L.surfaceZ + 8.6]} size={[w - 6, h - 6, 3.4]} r={1.4}>
        <meshStandardMaterial color="#c9cdd3" metalness={0.85} roughness={0.42} envMapIntensity={1.3} />
      </RBox>
    </group>
  );
}

// ================================================================== Carte graphique

function shroudGeometry(len: number, height: number, fans: number, fanR: number): THREE.BufferGeometry {
  const shape = new THREE.Shape();
  const r = 6, hx = len / 2, hz = height / 2;
  shape.moveTo(-hx + r, -hz);
  shape.lineTo(hx - 14, -hz); shape.lineTo(hx, -hz + 14);
  shape.lineTo(hx, hz - r); shape.quadraticCurveTo(hx, hz, hx - r, hz);
  shape.lineTo(-hx + r, hz); shape.quadraticCurveTo(-hx, hz, -hx, hz - r);
  shape.lineTo(-hx, -hz + r); shape.quadraticCurveTo(-hx, -hz, -hx + r, -hz);
  const pitch = len / fans;
  for (let i = 0; i < fans; i++) {
    const hole = new THREE.Path();
    hole.absarc(-hx + pitch * (i + 0.5), 0, fanR, 0, Math.PI * 2, true);
    shape.holes.push(hole);
  }
  const geo = new THREE.ExtrudeGeometry(shape, { depth: 7, bevelEnabled: true, bevelSize: 1, bevelThickness: 1, bevelSegments: 2, curveSegments: 36 });
  geo.translate(0, 0, -3.5);
  return geo;
}

export function RealGpu({ gpu, L, cableColor, cable = true }: { gpu: ComponentOf<"GPU">; L: Layout; cableColor: string; cable?: boolean }) {
  const g = L.gpu!;
  const t = TONE[gpu.finish];
  const [len, thick, height] = g.size;
  const [cx, cy, cz] = g.center;
  const fans = gpu.specs.fans;
  const pitch = len / fans;
  const fanR = Math.min(height * 0.44, pitch / 2 - 5);
  const top = cy + thick / 2;
  const bottom = cy - thick / 2;
  const shroud = useMemo(() => shroudGeometry(len, height, fans, fanR + 1.5), [len, height, fans, fanR]);
  const finCount = Math.max(8, Math.floor((len - 24) / 3.2));
  const connX = cx + len * 0.16;
  const cables = gpu.specs.power16pin ? 1 : gpu.specs.power8pin;

  return (
    <group>
      {/* Équerre et sorties vidéo */}
      <Box at={[g.startX - 1, cy + 4, cz + 4]} size={[1.6, thick + 12, height + 12]}><M kind="metal" color={STEEL} /></Box>
      {[0, 1, 2, 3].map((k) => <Box key={k} at={[g.startX - 2.2, top - 8, cz - height * 0.3 + k * height * 0.2]} size={[1, 6, height * 0.13]} shadow={false}><M kind="plastic" color="#050506" /></Box>)}

      {/* Plaque arrière et circuit */}
      <RBox at={[cx, top - 1.3, cz]} size={[len, 2.6, height]} r={1.2}><M kind="brushed" color={gpu.finish === "black" ? "#24272d" : t.paint} /></RBox>
      {[0.2, 0.4].map((f) => <Box key={f} at={[cx + len * (f - 0.1), top + 0.1, cz]} size={[len * 0.12, 0.4, height * 0.55]} shadow={false}><M kind="brushed" color={gpu.finish === "black" ? "#34383f" : t.trim} /></Box>)}
      <Box at={[cx - len * 0.08, top - 4, cz - 3]} size={[len * 0.8, 1.6, height * 0.86]}><M kind="plastic" color="#0d0f12" /></Box>

      {/* Radiateur : ailettes sur toute la longueur, traversées par les caloducs */}
      <Fins count={finCount} color="#b9bec6" kind="brushed" start={[g.startX + 12, cy - 1, cz]} step={[3.2, 0, 0]} size={[0.9, thick - 16, height - 8]} />
      {[-0.25, 0, 0.25].map((f) => <Rod key={f} at={[cx, cy - 1, cz + height * f]} r={3} len={len - 30} axis="x" segments={12}><M kind="nickel" color="#cfd3d9" /></Rod>)}

      {/* Carénage : face des ventilateurs et flancs */}
      <mesh geometry={shroud} position={[cx, bottom + 3.5, cz]} rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
        <M kind="plastic" color={t.plastic} />
      </mesh>
      <RBox at={[cx, bottom + thick * 0.26, cz + height / 2 - 1.5]} size={[len, thick * 0.52, 3]} r={1.4}><M kind="plastic" color={t.plastic} /></RBox>
      <RBox at={[cx, bottom + thick * 0.26, cz - height / 2 + 1.5]} size={[len, thick * 0.52, 3]} r={1.4}><M kind="plastic" color={t.plastic} /></RBox>
      <RBox at={[g.startX + len - 2, cy - 2, cz]} size={[4, thick - 6, height]} r={1.6}><M kind="plastic" color={t.plastic} /></RBox>
      {/* Liseré sur la tranche visible à travers la vitre */}
      <Box at={[cx - len * 0.12, bottom + thick * 0.3, cz + height / 2 + 0.2]} size={[len * 0.46, thick * 0.2, 0.6]} shadow={false}><M kind="brushed" color={gpu.finish === "black" ? "#3d424b" : "#b4bbc5"} /></Box>
      <Box at={[cx + len * 0.3, bottom + thick * 0.3, cz + height / 2 + 0.3]} size={[len * 0.16, 2, 0.6]} shadow={false}><Glow color="#ffffff" power={0.45} /></Box>

      {Array.from({ length: fans }, (_, i) => (
        <RealFan key={i} at={[g.startX + pitch * (i + 0.5), bottom + 7, cz]} axis="-y" size={fanR * 2.14} depth={10} frameless finish={gpu.finish === "white" ? "white" : "black"} speed={i % 2 ? -9 : 9} />
      ))}

      {/* Connecteur d'alimentation et son câble */}
      <Box at={[connX, top - 5, cz + height / 2 - 6]} size={[cables > 1 || !gpu.specs.power16pin ? 20 * Math.max(1, cables) : 22, 9, 11]}><M kind="plastic" color="#0b0c0e" /></Box>
      {cable && <Cable color={cableColor} strands={gpu.specs.power16pin ? 4 : 3 * Math.max(1, cables)} radius={2.3} spread="x" points={[
        [connX, top - 5, cz + height / 2],
        [connX, top - 2, cz + height / 2 + 26],
        [connX + 30, top + 24, cz + height / 2 + 10],
        [Math.min(L.xRear + L.board.size[0] + 22, connX + 110), top + 44, L.surfaceZ + 6],
        [Math.min(L.xRear + L.board.size[0] + 22, connX + 110), top + 44, L.trayZ + 2],
      ]} />}
    </group>
  );
}

// ================================================================== Mémoire, stockage, alimentation

function spreaderGeometry(h: number): THREE.BufferGeometry {
  // Profil vu de bout : flancs droits, sommet chanfreiné.
  const shape = new THREE.Shape();
  shape.moveTo(-3.6, 0); shape.lineTo(3.6, 0); shape.lineTo(3.6, h * 0.72); shape.lineTo(1.6, h); shape.lineTo(-1.6, h); shape.lineTo(-3.6, h * 0.72); shape.closePath();
  const geo = new THREE.ExtrudeGeometry(shape, { depth: 133, bevelEnabled: false });
  geo.translate(0, 0, -66.5);
  return geo;
}

export function RealRam({ ram, L }: { ram: ComponentOf<"RAM">; L: Layout }) {
  const t = TONE[ram.finish];
  const h = ram.specs.heightMM;
  const geo = useMemo(() => spreaderGeometry(ram.specs.rgb ? h - 6 : h), [h, ram.specs.rgb]);
  return (
    <group>
      {L.ram.map((b, i) => {
        const base = b.center[2] - h / 2;
        return (
          // Le profil est extrudé le long de y ; sa hauteur part de la carte vers la vitre.
          <group key={i} position={[b.center[0], b.center[1], base]} rotation={[Math.PI / 2, 0, 0]}>
            <mesh geometry={geo} rotation={[0, 0, 0]} castShadow receiveShadow>
              <M kind="brushed" color={ram.finish === "black" ? "#1d1f24" : t.paint} />
            </mesh>
            {ram.specs.rgb && (
              <RBox at={[0, h - 3.4, 0]} size={[5.4, 6.4, 131]} r={2}><Glow power={0.85} /></RBox>
            )}
          </group>
        );
      })}
    </group>
  );
}

export function RealSsd({ L }: { L: Layout }) {
  const s = L.ssd!;
  const [cx, cy, cz] = s.center;
  if (!s.m2) return <RBox at={s.center} size={s.size} r={2}><M kind="brushed" color="#2a2d33" /></RBox>;
  return (
    <group>
      <Box at={[cx, cy, cz - 1.5]} size={[80, 22, 1.2]}><M kind="plastic" color="#10331d" /></Box>
      <RBox at={[cx, cy, cz + 1.5]} size={[76, 22, 4.5]} r={1.2}><M kind="brushed" color="#3b3f47" /></RBox>
    </group>
  );
}

export function RealPsu({ psu, L }: { psu: ComponentOf<"PSU">; L: Layout }) {
  const p = L.psu!;
  const t = TONE[psu.finish];
  const [cx, cy, cz] = p.center;
  const face = cz + p.size[2] / 2;
  const R = Math.min(p.size[0], p.size[1]) * 0.42;
  return (
    <group>
      <RBox at={p.center} size={p.size} r={2.5}><M color={t.paint} /></RBox>
      {/* Grille du ventilateur : disque sombre, anneaux concentriques et croisillon */}
      <Rod at={[cx, cy, face + 0.3]} r={R} len={0.8} segments={40}><M kind="plastic" color="#060607" /></Rod>
      {[0.28, 0.46, 0.64, 0.82, 1].map((f) => (
        <mesh key={f} position={[cx, cy, face + 1.2]}>
          <torusGeometry args={[R * f, 0.9, 6, 48]} />
          <M kind="metal" color={psu.finish === "white" ? "#e2e5ea" : "#30333a"} />
        </mesh>
      ))}
      {[0, Math.PI / 2].map((a) => <Box key={a} at={[cx, cy, face + 1.2]} size={[R * 2, 1.8, 1.4]} rotation={[0, 0, a + Math.PI / 4]} shadow={false}><M kind="metal" color={psu.finish === "white" ? "#e2e5ea" : "#30333a"} /></Box>)}
      {/* Étiquette et prises modulaires */}
      <Box at={[cx + p.size[0] / 2 - 16, cy, face + 0.3]} size={[20, p.size[1] * 0.7, 0.5]} shadow={false}><M kind="plastic" color={psu.finish === "white" ? "#cfd4db" : "#2b2e35"} /></Box>
      {psu.specs.modular === "full" && Array.from({ length: 8 }, (_, i) => (
        <Box key={i} at={[cx + p.size[0] / 2 + 0.4, cy - p.size[1] * 0.28 + (i % 2) * p.size[1] * 0.3, cz - p.size[2] * 0.36 + Math.floor(i / 2) * p.size[2] * 0.24]} size={[1, p.size[1] * 0.2, p.size[2] * 0.16]} shadow={false}><M kind="plastic" color="#050506" /></Box>
      ))}
    </group>
  );
}

// ================================================================== Refroidissement

export function RealAirCooler({ cooler, L }: { cooler: ComponentOf<"COOLER">; L: Layout }) {
  const c = L.cooler as Extract<Layout["cooler"], { kind: "AIR" }>;
  const t = TONE[cooler.finish];
  const [cx, cy, cz] = c.box.center;
  const height = c.box.size[2];
  const base = cz - height / 2;
  const depth = 46;
  const towers = c.towers === 2 ? [-35, 35] : [-12];
  const finStart = base + 36;
  const finEnd = base + height - 7;
  const count = Math.floor((finEnd - finStart) / 2.4);
  const finColor = cooler.finish === "black" ? "#26292f" : cooler.finish === "white" ? "#eceef1" : "#c9cdd4";
  const fanSize = Math.min(120, Math.max(92, finEnd - finStart + 8));

  return (
    <group>
      {/* Semelle et barre de fixation */}
      <RBox at={[cx, cy, base + 6]} size={[44, 44, 12]} r={2}><M kind="nickel" color="#cdd1d7" /></RBox>
      <Box at={[cx, cy, base + 13]} size={[14, 96, 3]}><M kind="metal" color={STEEL} /></Box>
      {towers.map((tx) => (
        <group key={tx}>
          <Fins count={count} color={finColor} start={[cx + tx, cy, finStart]} step={[0, 0, 2.4]} size={[depth, 122, 0.7]} />
          {[-45, -27, -9, 9, 27, 45].map((dy) => (
            <Rod key={dy} at={[cx + tx + (Math.abs(dy) % 18 === 9 ? -8 : 8), cy + dy, (base + 12 + finEnd) / 2 + 2]} r={3} len={finEnd - base - 8} segments={12}>
              <M kind={cooler.finish === "black" ? "metal" : "nickel"} color={cooler.finish === "black" ? "#1c1e22" : "#d2d6dc"} />
            </Rod>
          ))}
          <RBox at={[cx + tx, cy, base + height - 3]} size={[depth + 3, 125, 6]} r={2.5}><M kind="brushed" color={cooler.finish === "black" ? "#16181b" : t.paint} /></RBox>
        </group>
      ))}
      {(c.towers === 2 ? [0, 71] : [25]).map((fx) => (
        <RealFan key={fx} at={[cx + fx, cy, (finStart + finEnd) / 2]} axis="x" size={fanSize} rgb={cooler.specs.rgb} finish={cooler.finish === "white" ? "white" : "black"} />
      ))}
    </group>
  );
}

export function RealLiquidCooler({ cooler, L }: { cooler: ComponentOf<"COOLER">; L: Layout }) {
  const c = L.cooler as Extract<Layout["cooler"], { kind: "AIO" }>;
  const t = TONE[cooler.finish];
  const r = c.radiator;
  const [rx, ry, rz] = r.center;
  const long = c.mount === "top" ? r.size[0] : r.size[1];
  const core = useRadiatorCore(Math.round(long / 8), 1);
  const finish = cooler.finish === "white" ? "white" : "black";

  const fans: { at: Vec3; axis: "x" | "-y" | "z" }[] = [];
  for (let i = 0; i < c.fans; i++) {
    const o = (i - (c.fans - 1) / 2) * c.fanSize;
    if (c.mount === "top") fans.push({ at: [rx + o, ry - 13.5 - 12.5, rz], axis: "-y" });
    else if (c.mount === "front") fans.push({ at: [rx + 13.5 + 12.5, ry + o, rz], axis: "x" });
    else fans.push({ at: [rx, ry + o, rz + 13.5 + 12.5], axis: "z" });
  }

  // Extrémité du radiateur où arrivent les tuyaux, et dimensions du faisceau.
  const end: Vec3 = c.mount === "top" ? [rx - r.size[0] / 2 + 10, ry, rz] : [rx, ry - r.size[1] / 2 + 10, rz];
  const coreSize: Vec3 = c.mount === "top" ? [r.size[0] - 40, r.size[1] - 3, r.size[2] - 14]
    : c.mount === "front" ? [r.size[0] - 3, r.size[1] - 40, r.size[2] - 14] : [r.size[0] - 14, r.size[1] - 40, r.size[2] - 3];
  const tankSize: Vec3 = c.mount === "top" ? [18, r.size[1], r.size[2]] : [r.size[0], 18, r.size[2]];
  const far: Vec3 = c.mount === "top" ? [rx + r.size[0] / 2 - 9, ry, rz] : [rx, ry + r.size[1] / 2 - 9, rz];
  const near: Vec3 = c.mount === "top" ? [rx - r.size[0] / 2 + 9, ry, rz] : [rx, ry - r.size[1] / 2 + 9, rz];

  const tubes = useMemo(() => {
    const [px, py, pz] = c.pump;
    return [-10, 10].map((d) => {
      const start: Vec3 = [px + 30, py + d, pz + 4];
      const stop: Vec3 = c.mount === "top" ? [end[0], end[1] - 16, end[2] + d] : c.mount === "front" ? [end[0] - 16, end[1], end[2] + d] : [end[0] + d, end[1], end[2] + 16];
      const bulge: Vec3 = [(start[0] + stop[0]) / 2 + 46, (start[1] + stop[1]) / 2 - 6, Math.max(start[2], stop[2]) + 52];
      return [start, [px + 58, py + d, pz + 22] as Vec3, bulge, stop];
    });
  }, [c.pump, c.mount, end]);

  return (
    <group>
      {/* Bloc pompe : corps, couronne lumineuse, capot */}
      <Rod at={c.pump} r={36} len={44} segments={48}><M kind="plastic" color={t.plastic} /></Rod>
      <Rod at={[c.pump[0], c.pump[1], c.pump[2] + 22.4]} r={31} len={1.2} segments={48}><M kind="brushed" color={cooler.finish === "white" ? "#dfe3e8" : "#0e0f12"} /></Rod>
      {cooler.specs.rgb && (
        <mesh position={[c.pump[0], c.pump[1], c.pump[2] + 23.2]}>
          <torusGeometry args={[32.5, 1.5, 8, 64]} />
          <Glow />
        </mesh>
      )}
      <RBox at={[c.pump[0] + 30, c.pump[1], c.pump[2] + 2]} size={[16, 34, 18]} r={3}><M kind="plastic" color={t.plastic} /></RBox>

      {/* Radiateur : faisceau d'ailettes entre deux réservoirs */}
      <mesh position={r.center} castShadow receiveShadow>
        <boxGeometry args={coreSize} />
        <meshStandardMaterial map={core} color={cooler.finish === "white" ? "#d9dde3" : "#ffffff"} roughness={0.6} metalness={0.5} />
      </mesh>
      <RBox at={far} size={tankSize} r={3}><M color={t.paint} /></RBox>
      <RBox at={near} size={tankSize} r={3}><M color={t.paint} /></RBox>
      {[-1, 1].map((sgn) => (
        c.mount === "top"
          ? <Box key={sgn} at={[rx, ry, rz + sgn * (r.size[2] / 2 - 3.5)]} size={[r.size[0] - 34, r.size[1], 7]}><M color={t.paint} /></Box>
          : c.mount === "front"
            ? <Box key={sgn} at={[rx, ry, rz + sgn * (r.size[2] / 2 - 3.5)]} size={[r.size[0], r.size[1] - 34, 7]}><M color={t.paint} /></Box>
            : <Box key={sgn} at={[rx + sgn * (r.size[0] / 2 - 3.5), ry, rz]} size={[7, r.size[1] - 34, r.size[2]]}><M color={t.paint} /></Box>
      ))}

      {fans.map((f, i) => <RealFan key={i} at={f.at} axis={f.axis} size={c.fanSize} rgb={cooler.specs.rgb} finish={finish} />)}
      {tubes.map((pts, i) => <Cable key={i} points={pts} radius={6.2} color={cooler.finish === "white" ? "#e6e9ed" : "#0c0d0f"} />)}
    </group>
  );
}
