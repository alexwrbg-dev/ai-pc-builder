"use client";
// Une pièce seule, présentée comme sur une table de studio. Sert à la fiche produit et aux vignettes.
import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Bounds, Center, OrbitControls } from "@react-three/drei";
import { computeLayout } from "@/lib/layout3d";
import { boardLook, caseLook, coolerLook, gpuLook, isLight, psuLook, ramLook } from "@/lib/looks";
import type { Component } from "@/lib/types";
import { LookContext, type Look } from "./primitives";
import { RealAirCooler, RealBoard, RealCase, RealCaseFans, RealCpu, RealGlass, RealGpu, RealPsu, RealSsd } from "./partsReal";
import { BACKDROP, Boundary, Effects, Official, OfficialLiquid, OfficialRam, SCALE, Studio, boxesOf } from "./Scene";

const NO_FLAGS = {};

function Model({ part }: { part: Component }) {
  const L = useMemo(() => computeLayout({ [part.category]: part }), [part]);
  switch (part.category) {
    case "CASE": return (
      <Official id={part.id} box={boxesOf(L, "CASE")[0]}>
        <RealCase pc={part} L={L} cableColor="#0d0e10" cables={false} /><RealCaseFans pc={part} L={L} /><RealGlass L={L} pc={part} />
      </Official>
    );
    case "MOTHERBOARD": return <Official id={part.id} box={boxesOf(L, "MOTHERBOARD")[0]}><RealBoard mb={part} L={L} /></Official>;
    case "CPU": return <Official id={part.id} box={boxesOf(L, "CPU")[0]}><RealCpu L={L} socket={part.specs.socket} /></Official>;
    case "GPU": return <Official id={part.id} box={L.gpu}><RealGpu gpu={part} L={L} cableColor="#0d0e10" cable={false} /></Official>;
    case "RAM": return <OfficialRam ram={part} L={L} />;
    case "SSD": return <Official id={part.id} box={L.ssd}><RealSsd L={L} /></Official>;
    case "PSU": return <Official id={part.id} box={L.psu}><RealPsu psu={part} L={L} /></Official>;
    case "COOLER": return L.cooler?.kind === "AIR"
      ? <Official id={part.id} box={L.cooler.box}><RealAirCooler cooler={part} L={L} /></Official>
      : <OfficialLiquid cooler={part} L={L} />;
  }
}

/** Couleur dominante de la pièce : une pièce blanche demande moins de lumière de face pour ne pas « brûler ». */
function mainColor(part: Component): string {
  switch (part.category) {
    case "GPU": return gpuLook(part).body;
    case "COOLER": return coolerLook(part).fanColor;
    case "CASE": return caseLook(part).color;
    case "RAM": return ramLook(part).spreader;
    case "MOTHERBOARD": return boardLook(part).pcb;
    case "PSU": return psuLook(part).color;
    default: return "#202329";
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
  const front = isLight(mainColor(part)) ? 0.45 : 1;
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
          <directionalLight position={[-4, 5, 6]} intensity={2.6 * front} />
          <directionalLight position={[2, 1.5, 6]} intensity={2.2 * front} />
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
