"use client";
// Une pièce seule, présentée comme sur une table de studio. Sert à la fiche produit et aux vignettes.
import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Bounds, Center, OrbitControls } from "@react-three/drei";
import { computeLayout } from "@/lib/layout3d";
import type { Component } from "@/lib/types";
import { LookContext, type Look } from "./primitives";
import { RealAirCooler, RealBoard, RealCase, RealCaseFans, RealCpu, RealGlass, RealGpu, RealLiquidCooler, RealPsu, RealRam, RealSsd } from "./partsReal";
import { BACKDROP, Boundary, Effects, SCALE, Studio } from "./Scene";

const NO_FLAGS = {};

function Model({ part }: { part: Component }) {
  const L = useMemo(() => computeLayout({ [part.category]: part }), [part]);
  switch (part.category) {
    case "CASE": return <><RealCase pc={part} L={L} cableColor="#0d0e10" cables={false} /><RealCaseFans pc={part} L={L} /><RealGlass L={L} white={part.finish === "white"} /></>;
    case "MOTHERBOARD": return <RealBoard mb={part} L={L} />;
    case "CPU": return <RealCpu L={L} socket={part.specs.socket} />;
    case "GPU": return <RealGpu gpu={part} L={L} cableColor="#0d0e10" cable={false} />;
    case "RAM": return <RealRam ram={part} L={L} />;
    case "SSD": return <RealSsd L={L} />;
    case "PSU": return <RealPsu psu={part} L={L} />;
    case "COOLER": return L.cooler?.kind === "AIR" ? <RealAirCooler cooler={part} L={L} /> : <RealLiquidCooler cooler={part} L={L} />;
  }
}

/** Posées à plat dans le boîtier, ces pièces se présentent mieux debout, face visible vers l'avant. */
function standsUp(part: Component): boolean {
  return part.category === "GPU" || part.category === "RAM" || part.category === "COOLER";
}

/** Les pièces allongées paraîtraient petites si on cadrait leur sphère englobante : on resserre. */
function margin(part: Component): number {
  switch (part.category) {
    case "GPU": return 0.86;
    case "RAM": case "SSD": return 0.85;
    case "MOTHERBOARD": return 1;
    case "PSU": return 1.18;
    case "CPU": return 1.35;
    case "CASE": return 1.22;
    default: return 1.1;
  }
}

/** Prévient quand quelques images ont été dessinées : la vue est alors stable pour une capture. */
function Ready({ onReady }: { onReady?: () => void }) {
  const frames = useRef(0);
  useFrame(() => {
    frames.current += 1;
    if (frames.current === 8) onReady?.();
  });
  return null;
}

export default function PartScene({ part, quality = "high", still = false, accent = "#7fd6ff", onReady }: {
  part: Component; quality?: Look["quality"]; still?: boolean; accent?: string; onReady?: () => void;
}) {
  const look = useMemo<Look>(() => ({ plan: false, accent, hot: null, flags: NO_FLAGS, quality }), [accent, quality]);
  return (
    <Boundary>
      <Canvas
        dpr={quality === "high" ? [1, 2] : [1, 1.25]} shadows={quality === "high"}
        camera={{ position: [3.2, 2.4, 5], fov: 28, near: 0.02, far: 120 }}
        gl={{ antialias: true, preserveDrawingBuffer: still }}
      >
        <color attach="background" args={[BACKDROP]} />
        <LookContext.Provider value={look}>
          <Studio quality={quality} />
          {/* Éclairage de présentation : une pièce noire sur fond sombre a besoin de lumière de face */}
          <directionalLight position={[-4, 5, 6]} intensity={2.6} />
          <directionalLight position={[2, 1.5, 6]} intensity={2.2} />
          {/* La clé force un nouveau cadrage quand la pièce change */}
          <Bounds key={part.id} fit clip observe margin={margin(part) * (still ? 1 : 1.12)}>
            <Center top>
              <group scale={SCALE} rotation={standsUp(part) ? [-Math.PI / 2, 0, 0] : [0, 0, 0]}>
                <Model part={part} />
              </group>
            </Center>
          </Bounds>
          <Ready key={`ready-${part.id}`} onReady={onReady} />
        </LookContext.Provider>
        {quality === "high" && <Effects />}
        <OrbitControls makeDefault enableDamping enablePan={false} enableZoom={!still} autoRotate={!still} autoRotateSpeed={0.8} maxPolarAngle={Math.PI * 0.52} />
      </Canvas>
    </Boundary>
  );
}
