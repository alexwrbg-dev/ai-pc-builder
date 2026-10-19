"use client";
// Briques du style « rendu » : matières réalistes, textures calculées, formes arrondies,
// ventilateurs à pales, ailettes, câbles. Aucune image externe : tout est généré dans le navigateur.
import { useContext, useLayoutEffect, useMemo, useRef, type ReactNode } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import type { Vec3 } from "@/lib/layout3d";
import type { Finish } from "@/lib/types";
import { LookContext } from "./primitives";

// ------------------------------------------------------------------ Teintes

export const TONE: Record<Finish, { paint: string; trim: string; dark: string; plastic: string }> = {
  black: { paint: "#202329", trim: "#343842", dark: "#0e0f12", plastic: "#17181c" },
  white: { paint: "#d9dce1", trim: "#c3c8d0", dark: "#a9b0ba", plastic: "#d2d6dc" },
  silver: { paint: "#b4bac4", trim: "#9299a5", dark: "#5e6570", plastic: "#a7adb7" },
};

// ------------------------------------------------------------------ Matières

type Kind = "paint" | "plastic" | "metal" | "brushed" | "rubber" | "copper" | "nickel" | "coated";
const PRESET: Record<Kind, { metalness: number; roughness: number; env: number }> = {
  paint: { metalness: 0.3, roughness: 0.5, env: 1.1 },
  plastic: { metalness: 0.0, roughness: 0.48, env: 0.7 },
  metal: { metalness: 0.95, roughness: 0.3, env: 1.2 },
  brushed: { metalness: 0.9, roughness: 0.45, env: 1.1 },
  rubber: { metalness: 0.0, roughness: 0.9, env: 0.3 },
  copper: { metalness: 1.0, roughness: 0.22, env: 1.3 },
  nickel: { metalness: 1.0, roughness: 0.18, env: 1.3 },
  /** Revêtement noir mat des ailettes et caloducs : ne reflète presque rien. */
  coated: { metalness: 0.15, roughness: 0.72, env: 0.45 },
};

/**
 * Les blancs relevés sur les produits (#e8eaed…) brûlent sous l'éclairage de studio : on les ramène
 * à un blanc légèrement grisé, comme sur une photo bien exposée.
 */
function exposed(color: string): THREE.Color {
  const c = new THREE.Color(color);
  const lum = 0.299 * c.r + 0.587 * c.g + 0.114 * c.b;
  return lum > 0.72 ? c.multiplyScalar(0.72 / lum + (lum - 0.72) * 0.5) : c;
}

export function M({ kind = "paint", color, map, opacity = 1 }: { kind?: Kind; color: string; map?: THREE.Texture | null; opacity?: number }) {
  const p = PRESET[kind];
  const tone = useMemo(() => exposed(color), [color]);
  return (
    <meshStandardMaterial
      color={tone} map={map ?? null} metalness={p.metalness} roughness={p.roughness} envMapIntensity={p.env}
      transparent={opacity < 1} opacity={opacity}
    />
  );
}

/** Matière lumineuse des LED : sort de la plage normale pour que le halo (bloom) la fasse rayonner. */
export function Glow({ color, power = 1 }: { color?: string; power?: number }) {
  const look = useContext(LookContext);
  const value = useMemo(() => {
    const c = new THREE.Color(color ?? look.accent);
    return c.multiplyScalar(look.quality === "high" ? 3.2 * power : 1);
  }, [color, look.accent, look.quality, power]);
  return <meshBasicMaterial color={value} toneMapped={false} />;
}

/** Verre trempé teinté : presque transparent, très réfléchissant. */
export function Glass({ tint = "#0d141b", opacity = 0.14 }: { tint?: string; opacity?: number }) {
  return (
    <meshStandardMaterial
      color={tint} metalness={0.1} roughness={0.03} transparent opacity={opacity} envMapIntensity={1.4}
      depthWrite={false} side={THREE.FrontSide}
    />
  );
}

// ------------------------------------------------------------------ Textures calculées

const cache = new Map<string, THREE.Texture>();

function canvasTexture(key: string, size: number, draw: (ctx: CanvasRenderingContext2D, size: number) => void): THREE.Texture {
  const hit = cache.get(key);
  if (hit) return hit;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  draw(canvas.getContext("2d")!, size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.anisotropy = 8;
  tex.colorSpace = THREE.SRGBColorSpace;
  cache.set(key, tex);
  return tex;
}

/** Tôle perforée : trous ronds en quinconce. Sert de masque de transparence. `hole` : rayon relatif des trous. */
function perforationBase(hole = 0.2): THREE.Texture {
  return canvasTexture(`perf-${hole}`, 64, (ctx, s) => {
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, s, s);
    ctx.fillStyle = "#000";
    for (const [x, y] of [[0, 0], [s, 0], [0, s], [s, s], [s / 2, s / 2]]) {
      ctx.beginPath();
      ctx.arc(x, y, s * hole, 0, Math.PI * 2);
      ctx.fill();
    }
  });
}

/** Une copie du masque, répétée selon la taille du panneau (un motif tous les `pitch` millimètres). */
export function usePerforation(w: number, h: number, pitch = 5, hole = 0.2): THREE.Texture {
  return useMemo(() => {
    const t = perforationBase(hole).clone();
    t.repeat.set(Math.max(1, Math.round(w / pitch)), Math.max(1, Math.round(h / pitch)));
    t.colorSpace = THREE.NoColorSpace;
    t.needsUpdate = true;
    return t;
  }, [w, h, pitch, hole]);
}

/** Circuit imprimé : pistes fines et pastilles, à peine visibles. */
export function usePcb(base: string): THREE.Texture {
  const white = parseInt(base.slice(1, 3), 16) > 150;
  return useMemo(() => canvasTexture(`pcb-${base}`, 512, (ctx, s) => {
    ctx.fillStyle = base;
    ctx.fillRect(0, 0, s, s);
    let seed = 7;
    const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    ctx.lineWidth = 1.2;
    for (let i = 0; i < 220; i++) {
      ctx.strokeStyle = white ? `rgba(120,132,148,${0.25 + rnd() * 0.3})` : `rgba(90,104,126,${0.2 + rnd() * 0.3})`;
      let x = rnd() * s, y = rnd() * s;
      ctx.beginPath();
      ctx.moveTo(x, y);
      for (let k = 0; k < 4; k++) {
        const len = 12 + rnd() * 60;
        const dir = Math.floor(rnd() * 4);
        x += dir === 0 ? len : dir === 1 ? -len : dir === 2 ? len * 0.7 : 0;
        y += dir === 3 ? len : dir === 2 ? len * 0.7 : 0;
        ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
    for (let i = 0; i < 160; i++) {
      ctx.fillStyle = white ? "rgba(150,160,175,0.6)" : "rgba(160,170,190,0.45)";
      ctx.beginPath();
      ctx.arc(rnd() * s, rnd() * s, 1.6, 0, Math.PI * 2);
      ctx.fill();
    }
  }), [base, white]);
}

/** Faisceau d'un radiateur : fines ailettes serrées. */
export function useRadiatorCore(repeatX: number, repeatY: number): THREE.Texture {
  return useMemo(() => {
    const base = canvasTexture("radiator", 64, (ctx, s) => {
      ctx.fillStyle = "#0b0c0f";
      ctx.fillRect(0, 0, s, s);
      ctx.strokeStyle = "#3a3f49";
      ctx.lineWidth = 2;
      for (let x = 2; x < s; x += 8) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, s); ctx.stroke(); }
      ctx.fillStyle = "#23262d";
      for (let y = 0; y < s; y += 32) ctx.fillRect(0, y, s, 5);
    });
    const t = base.clone();
    t.repeat.set(repeatX, repeatY);
    t.needsUpdate = true;
    return t;
  }, [repeatX, repeatY]);
}

// ------------------------------------------------------------------ Formes

/** Volume aux arêtes adoucies : c'est ce qui accroche la lumière sur un objet réel. */
export function RBox({ at, size, r = 2, children, rotation }: { at: Vec3; size: Vec3; r?: number; children: ReactNode; rotation?: Vec3 }) {
  const radius = Math.min(r, Math.min(...size) / 2 - 0.01);
  return (
    <RoundedBox args={size} radius={Math.max(0.2, radius)} smoothness={3} position={at} rotation={rotation} castShadow receiveShadow>
      {children}
    </RoundedBox>
  );
}

export function Box({ at, size, children, rotation, shadow = true }: { at: Vec3; size: Vec3; children: ReactNode; rotation?: Vec3; shadow?: boolean }) {
  return (
    <mesh position={at} rotation={rotation} castShadow={shadow} receiveShadow={shadow}>
      <boxGeometry args={size} />
      {children}
    </mesh>
  );
}

export function Rod({ at, r, len, axis = "z", children, segments = 24 }: { at: Vec3; r: number; len: number; axis?: "x" | "y" | "z"; children: ReactNode; segments?: number }) {
  const rotation: Vec3 = axis === "z" ? [Math.PI / 2, 0, 0] : axis === "x" ? [0, 0, Math.PI / 2] : [0, 0, 0];
  return (
    <mesh position={at} rotation={rotation} castShadow receiveShadow>
      <cylinderGeometry args={[r, r, len, segments]} />
      {children}
    </mesh>
  );
}

/** Panneau de tôle perforée (grille de boîtier, filtre). */
export function Mesh({ at, size, normal, color, pitch = 5, open = false }: { at: Vec3; size: [number, number]; normal: "x" | "y" | "z"; color: string; pitch?: number; open?: boolean }) {
  // `open` : grille très ajourée, assez transparente pour voir la configuration à travers un flanc grillagé.
  const alpha = usePerforation(size[0], size[1], pitch, open ? 0.34 : 0.2);
  const rotation: Vec3 = normal === "x" ? [0, Math.PI / 2, 0] : normal === "y" ? [-Math.PI / 2, 0, 0] : [0, 0, 0];
  return (
    <mesh position={at} rotation={rotation} receiveShadow>
      <planeGeometry args={size} />
      {open
        ? <meshStandardMaterial color={color} alphaMap={alpha} transparent opacity={0.5} depthWrite={false} metalness={0.5} roughness={0.5} side={THREE.DoubleSide} />
        : <meshStandardMaterial color={color} alphaMap={alpha} alphaTest={0.5} metalness={0.6} roughness={0.5} side={THREE.DoubleSide} />}
    </mesh>
  );
}

/** Rangée d'ailettes identiques, dessinée en une seule passe. */
export function Fins({ count, start, step, size, color, kind: wanted = "brushed" }: { count: number; start: Vec3; step: Vec3; size: Vec3; color: string; kind?: Kind }) {
  // Des ailettes noires sont revêtues (peinture) : elles ne doivent pas refléter le ciel comme de l'aluminium nu.
  const kind: Kind = parseInt(color.slice(1, 3), 16) < 80 && wanted === "brushed" ? "coated" : wanted;
  const tone = useMemo(() => exposed(color), [color]);
  const ref = useRef<THREE.InstancedMesh>(null);
  useLayoutEffect(() => {
    const m = new THREE.Matrix4();
    for (let i = 0; i < count; i++) {
      m.setPosition(start[0] + step[0] * i, start[1] + step[1] * i, start[2] + step[2] * i);
      ref.current?.setMatrixAt(i, m);
    }
    if (ref.current) ref.current.instanceMatrix.needsUpdate = true;
  }, [count, start, step]);
  const p = PRESET[kind];
  return (
    <instancedMesh key={count} ref={ref} args={[undefined, undefined, count]} castShadow receiveShadow>
      <boxGeometry args={size} />
      <meshStandardMaterial color={tone} metalness={p.metalness} roughness={p.roughness} envMapIntensity={p.env} />
    </instancedMesh>
  );
}

/** Câble gainé : un faisceau de brins parallèles le long d'une courbe. */
export function Cable({ points, strands = 1, radius = 3.4, color, spread = "z" }: { points: Vec3[]; strands?: number; radius?: number; color: string; spread?: "x" | "y" | "z" }) {
  const geos = useMemo(() => {
    return Array.from({ length: strands }, (_, i) => {
      const off = (i - (strands - 1) / 2) * radius * 2.05;
      const pts = points.map(([x, y, z]) => new THREE.Vector3(x + (spread === "x" ? off : 0), y + (spread === "y" ? off : 0), z + (spread === "z" ? off : 0)));
      return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts, false, "catmullrom", 0.45), 28, radius, 7);
    });
  }, [points, strands, radius, spread]);
  return (
    <>
      {geos.map((g, i) => (
        <mesh key={i} geometry={g} castShadow>
          <meshStandardMaterial color={color} roughness={0.85} metalness={0} />
        </mesh>
      ))}
    </>
  );
}

// ------------------------------------------------------------------ Ventilateur

const fanGeo = new Map<string, THREE.BufferGeometry>();

function frameGeometry(size: number, depth: number): THREE.BufferGeometry {
  const key = `frame-${size}-${depth}`;
  const hit = fanGeo.get(key);
  if (hit) return hit;
  const h = size / 2, r = 9;
  const shape = new THREE.Shape();
  shape.moveTo(-h + r, -h);
  shape.lineTo(h - r, -h); shape.quadraticCurveTo(h, -h, h, -h + r);
  shape.lineTo(h, h - r); shape.quadraticCurveTo(h, h, h - r, h);
  shape.lineTo(-h + r, h); shape.quadraticCurveTo(-h, h, -h, h - r);
  shape.lineTo(-h, -h + r); shape.quadraticCurveTo(-h, -h, -h + r, -h);
  const hole = new THREE.Path();
  hole.absarc(0, 0, size * 0.468, 0, Math.PI * 2, true);
  shape.holes.push(hole);
  const geo = new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: true, bevelSize: 0.8, bevelThickness: 0.8, bevelSegments: 2, curveSegments: 40 });
  geo.translate(0, 0, -depth / 2);
  fanGeo.set(key, geo);
  return geo;
}

/** Une pale en faucille, tracée du moyeu vers l'extérieur le long de l'axe x. */
function bladeGeometry(R: number): THREE.BufferGeometry {
  const key = `blade-${R}`;
  const hit = fanGeo.get(key);
  if (hit) return hit;
  const r0 = R * 0.3, r1 = R * 0.97, n = 10;
  const lead: THREE.Vector2[] = [], trail: THREE.Vector2[] = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const r = r0 + (r1 - r0) * t;
    const a = -0.55 * Math.pow(t, 1.25);
    const width = 0.5 + 0.32 * Math.sin(t * Math.PI * 0.9);
    lead.push(new THREE.Vector2(Math.cos(a) * r, Math.sin(a) * r));
    trail.push(new THREE.Vector2(Math.cos(a + width) * r, Math.sin(a + width) * r));
  }
  const shape = new THREE.Shape([...lead, ...trail.reverse()]);
  const geo = new THREE.ExtrudeGeometry(shape, { depth: 1.8, bevelEnabled: false });
  geo.translate(0, 0, -0.9);
  fanGeo.set(key, geo);
  return geo;
}

/**
 * Ventilateur complet. `axis` est la direction du flux ; `frameless` retire le cadre carré
 * (ventilateurs de carte graphique, logés dans un carénage).
 */
export function RealFan({ at, size = 120, axis, rgb = false, finish = "black", depth = 25, frameless = false, speed = 6, blade: bladeLook, frameColor }: {
  at: Vec3; size?: number; axis: "x" | "y" | "z" | "-y"; rgb?: boolean; finish?: Finish; depth?: number; frameless?: boolean; speed?: number;
  /** Teinte des pales relevée sur le produit ; à défaut, déduite de la finition et de l'éclairage. */
  blade?: "black" | "white" | "translucent" | "gray";
  /** Couleur du cadre, si elle diffère de la finition. */
  frameColor?: string;
}) {
  const look = useContext(LookContext);
  const rotor = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (rotor.current) rotor.current.rotation.z -= dt * speed;
  });
  const tone = TONE[finish];
  const R = size * 0.46;
  const frame = useMemo(() => frameGeometry(size, depth), [size, depth]);
  const blade = useMemo(() => bladeGeometry(R), [R]);
  const blades = frameless ? 9 : 7;
  const rotation: Vec3 = axis === "x" ? [0, Math.PI / 2, 0] : axis === "y" ? [-Math.PI / 2, 0, 0] : axis === "-y" ? [Math.PI / 2, 0, 0] : [0, 0, 0];
  const kind = bladeLook ?? (rgb ? "translucent" : finish === "white" ? "white" : "black");
  const bladeColor = kind === "translucent" ? (rgb ? "#dfe3e8" : "#8a919c") : kind === "white" ? "#d9dce1" : kind === "gray" ? "#5d626b" : "#17181c";
  const frameTone = frameColor ?? tone.plastic;

  return (
    <group position={at} rotation={rotation}>
      {!frameless && (
        <mesh geometry={frame} castShadow receiveShadow>
          <M kind="plastic" color={frameTone} />
        </mesh>
      )}
      {/* Bras du moteur, côté sortie d'air */}
      {!frameless && [0, 1, 2, 3].map((k) => (
        <Box key={k} at={[Math.cos(k * Math.PI / 2 + 0.5) * R * 0.62, Math.sin(k * Math.PI / 2 + 0.5) * R * 0.62, -depth / 2 + 2]} size={[R * 0.82, 3.2, 3]} rotation={[0, 0, k * Math.PI / 2 + 0.5]} shadow={false}>
          <M kind="plastic" color={frameTone} />
        </Box>
      ))}
      {rgb && (
        <mesh position={[0, 0, depth / 2 - 2]}>
          <torusGeometry args={[size * 0.474, 1.6, 8, 56]} />
          <Glow />
        </mesh>
      )}
      <group ref={rotor}>
        <Rod at={[0, 0, 1]} r={R * 0.3} len={depth * 0.62} segments={32}>
          <M kind="plastic" color={finish === "white" ? "#e9ecf0" : "#101114"} />
        </Rod>
        <Rod at={[0, 0, depth * 0.31 + 1.2]} r={R * 0.2} len={0.6} segments={32}>
          <M kind="brushed" color={finish === "white" ? "#cfd4db" : "#3a3e47"} />
        </Rod>
        {Array.from({ length: blades }, (_, k) => (
          <group key={k} rotation={[0, 0, (k / blades) * Math.PI * 2]}>
            <mesh geometry={blade} rotation={[0.38, 0, 0]} castShadow>
              {rgb
                ? <meshStandardMaterial color={bladeColor} transparent opacity={kind === "translucent" ? 0.78 : 1} roughness={0.25} metalness={0} emissive={look.accent} emissiveIntensity={(look.quality === "high" ? 2.6 : 0.9) * (kind === "translucent" ? 1 : 0.35)} />
                : kind === "translucent"
                  ? <meshStandardMaterial color={bladeColor} transparent opacity={0.6} roughness={0.2} metalness={0} />
                  : <M kind="plastic" color={bladeColor} />}
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
}
