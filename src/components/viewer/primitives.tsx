"use client";
// Briques de dessin de la vue 3D. Chaque volume existe en deux styles :
// « plan » (traits de dessin technique) et « rendu » (matières éclairées).
import { createContext, useContext, useMemo, useRef, type ReactNode } from "react";
import { useFrame } from "@react-three/fiber";
import { Edges, Html, Line } from "@react-three/drei";
import * as THREE from "three";
import type { ComponentCategory } from "@/lib/types";
import type { Vec3 } from "@/lib/layout3d";

export const INK = "#8fdcff";
export const AMBER = "#ffb44d";
export const RED = "#ff7d7d";
const PAPER = "#0b1a2e";

export interface Look {
  plan: boolean;
  /** Couleur des éléments RGB. */
  accent: string;
  /** Pièce survolée et pièces signalées par le moteur de compatibilité. */
  hot: ComponentCategory | null;
  flags: Partial<Record<ComponentCategory, "error" | "warning">>;
  /** « high » active le halo des LED et les ombres ; « low » les coupe sur les petits appareils. */
  quality: "high" | "low";
}

export const LookContext = createContext<Look>({ plan: false, accent: INK, hot: null, flags: {}, quality: "high" });
/** Emplacement auquel appartient le volume en cours de dessin. */
export const SlotContext = createContext<ComponentCategory | null>(null);

interface MatProps {
  color: string;
  metalness?: number;
  roughness?: number;
  /** Lumière propre : éclairage RGB. */
  glow?: number;
  glowColor?: string;
  opacity?: number;
  /** Le trait de contour est-il dessiné en mode plan ? */
  outline?: boolean;
}

/** Matière + contour d'un volume, selon le style courant et l'état de la pièce. */
export function Mat({ color, metalness = 0.3, roughness = 0.6, glow = 0, glowColor, opacity = 1, outline = true }: MatProps) {
  const look = useContext(LookContext);
  const slot = useContext(SlotContext);
  const flag = slot ? look.flags[slot] : undefined;
  const hot = slot !== null && look.hot === slot;
  const edge = flag === "error" ? RED : flag === "warning" || hot ? AMBER : INK;

  if (look.plan) {
    return (
      <>
        <meshBasicMaterial color={glow ? glowColor ?? look.accent : PAPER} transparent opacity={glow ? 0.35 : opacity < 1 ? 0.05 : 0.86} depthWrite={opacity >= 1} />
        {outline && <Edges threshold={20} color={edge} />}
      </>
    );
  }
  // En rendu, un filet discret souligne les arêtes : le dessin reste lisible même pour des pièces noires.
  const light = parseInt(color.slice(1, 3), 16) > 150;
  return (
    <>
      <meshStandardMaterial
        color={color} metalness={metalness} roughness={roughness}
        emissive={glow ? glowColor ?? look.accent : hot ? AMBER : "#000000"}
        emissiveIntensity={glow || (hot ? 0.12 : 0)}
        transparent={opacity < 1} opacity={opacity} depthWrite={opacity >= 1}
      />
      {outline && !glow && <Edges threshold={20} color={flag || hot ? edge : light ? "#8a94a6" : "#5a667e"} />}
    </>
  );
}

export function Block({ at, size, ...mat }: { at: Vec3; size: Vec3 } & MatProps) {
  return (
    <mesh position={at}>
      <boxGeometry args={size} />
      <Mat {...mat} />
    </mesh>
  );
}

/** Cylindre dont l'axe suit x, y ou z. */
export function Cyl({ at, r, len, axis = "z", segments = 28, ...mat }: { at: Vec3; r: number; len: number; axis?: "x" | "y" | "z"; segments?: number } & MatProps) {
  const rotation: Vec3 = axis === "z" ? [Math.PI / 2, 0, 0] : axis === "x" ? [0, 0, Math.PI / 2] : [0, 0, 0];
  return (
    <mesh position={at} rotation={rotation}>
      <cylinderGeometry args={[r, r, len, segments]} />
      <Mat {...mat} />
    </mesh>
  );
}

/**
 * Ventilateur : cadre carré, moyeu et pales qui tournent.
 * `axis` est la direction du flux d'air.
 */
export function Fan({ at, size = 120, axis, rgb = false, color = "#16181d" }: { at: Vec3; size?: number; axis: "x" | "y" | "z"; rgb?: boolean; color?: string }) {
  const look = useContext(LookContext);
  const rotor = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (rotor.current) rotor.current.rotation.z += dt * 5;
  });
  const rotation: Vec3 = axis === "x" ? [0, Math.PI / 2, 0] : axis === "y" ? [Math.PI / 2, 0, 0] : [0, 0, 0];
  const blades = useMemo(() => Array.from({ length: 7 }, (_, i) => (i / 7) * Math.PI * 2), []);
  const r = size / 2;
  const bar = size * 0.07;
  return (
    <group position={at} rotation={rotation}>
      {/* Cadre : quatre montants */}
      <Block at={[0, r - bar / 2, 0]} size={[size, bar, 25]} color={color} />
      <Block at={[0, -r + bar / 2, 0]} size={[size, bar, 25]} color={color} />
      <Block at={[r - bar / 2, 0, 0]} size={[bar, size - 2 * bar, 25]} color={color} />
      <Block at={[-r + bar / 2, 0, 0]} size={[bar, size - 2 * bar, 25]} color={color} />
      {rgb && (
        <mesh>
          <torusGeometry args={[r * 0.86, 2.2, 8, 40]} />
          <Mat color="#ffffff" glow={look.plan ? 1 : 1.6} outline={false} />
        </mesh>
      )}
      <group ref={rotor}>
        <Cyl at={[0, 0, 0]} r={r * 0.24} len={18} color={color} outline={false} />
        {blades.map((a) => (
          <mesh key={a} rotation={[0, 0, a]} position={[Math.cos(a) * r * 0.52, Math.sin(a) * r * 0.52, 0]}>
            <boxGeometry args={[r * 0.6, r * 0.3, 2.5]} />
            <Mat color={rgb && !look.plan ? "#cfd6e0" : color} roughness={0.5} opacity={rgb && !look.plan ? 0.75 : 1} outline={false} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

/** Cote de dessin technique : un trait entre deux points, deux butées et une étiquette. */
export function Cote({ from, to, label, color = AMBER, dashed = false }: { from: Vec3; to: Vec3; label: string; color?: string; dashed?: boolean }) {
  const mid: Vec3 = [(from[0] + to[0]) / 2, (from[1] + to[1]) / 2, (from[2] + to[2]) / 2];
  return (
    <group>
      <Line points={[from, to]} color={color} lineWidth={1.4} dashed={dashed} dashSize={8} gapSize={6} />
      {[from, to].map((p, i) => (
        <mesh key={i} position={p}>
          <sphereGeometry args={[2.6, 10, 10]} />
          <meshBasicMaterial color={color} />
        </mesh>
      ))}
      <Html position={mid} center zIndexRange={[20, 0]} style={{ pointerEvents: "none" }}>
        <span className="cote3d" style={{ color, borderColor: color }}>{label}</span>
      </Html>
    </group>
  );
}

/**
 * Enveloppe animée d'une pièce : elle arrive en glissant depuis sa position « éclatée »
 * et y retourne quand la vue éclatée est demandée.
 */
export function Part({ slot, away, delay, exploded, onHover, children }: {
  slot: ComponentCategory;
  away: Vec3;
  delay: number;
  exploded: boolean;
  onHover: (slot: ComponentCategory | null) => void;
  children: ReactNode;
}) {
  const ref = useRef<THREE.Group>(null);
  const clock = useRef(0);
  const t = useRef(1.6); // 0 = en place, 1 = éclaté, au-delà = hors champ à l'arrivée
  useFrame((_, dt) => {
    clock.current += dt;
    if (clock.current < delay) return;
    const target = exploded ? 1 : 0;
    t.current += (target - t.current) * (1 - Math.exp(-dt * 5.5));
    if (ref.current) ref.current.position.set(away[0] * t.current, away[1] * t.current, away[2] * t.current);
  });
  return (
    <SlotContext.Provider value={slot}>
      <group
        ref={ref}
        position={[away[0] * 1.6, away[1] * 1.6, away[2] * 1.6]}
        onPointerOver={(e) => { e.stopPropagation(); onHover(slot); }}
        onPointerOut={() => onHover(null)}
      >
        {children}
      </group>
    </SlotContext.Provider>
  );
}
