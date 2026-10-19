"use client";
// Scène 3D complète : boîtier, pièces, cotes, éclairage, effets. Chargée à la demande (voir BuildViewer).
import { Component as ReactComponent, useContext, useEffect, useMemo, useRef, type ReactNode } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Edges, Environment, Grid, Lightformer, OrbitControls } from "@react-three/drei";
import { Bloom, EffectComposer, N8AO, ToneMapping } from "@react-three/postprocessing";
import { ToneMappingMode } from "postprocessing";
import * as THREE from "three";
import { computeLayout, type Box as LBox, type Layout } from "@/lib/layout3d";
import type { ComponentCategory, ComponentOf, ResolvedBuild } from "@/lib/types";
import { AMBER, Cote, INK, LookContext, Part, RED, SlotContext, type Look } from "./primitives";
import { AirCooler, Board, CaseFans, CaseShell, Cpu, GlassPanel, Gpu, LiquidCooler, Psu, Ram, Ssd } from "./partsPlan";
import { RealAirCooler, RealBoard, RealCase, RealCaseFans, RealCpu, RealGlass, RealGpu, RealLiquidCooler, RealPsu, RealRam, RealSsd } from "./partsReal";
import { OfficialOr, officialModel } from "./official";

export interface SceneProps {
  build: ResolvedBuild;
  plan: boolean;
  exploded: boolean;
  cotes: boolean;
  accent: string;
  hot: ComponentCategory | null;
  flags: Look["flags"];
  quality: Look["quality"];
  onHover: (slot: ComponentCategory | null) => void;
  /** La molette zoome-t-elle ? À couper quand la vue est dans une page qui défile. */
  zoom?: boolean;
  /** Mouvement de caméra au repos : tour complet, balancement devant la vitre, ou rien. */
  motion?: "spin" | "sway" | "none";
}

/** 1 unité de scène = 100 mm. */
export const SCALE = 0.01;
export const BACKDROP = "#071120";

/**
 * Cadre la caméra pour que tout le boîtier tienne dans la vue, quelle que soit la forme du cadre,
 * et la recule en vue éclatée. Une fois le cadrage atteint, l'utilisateur reprend la main.
 */
function Rig({ exploded, radius, target }: { exploded: boolean; radius: number; target: THREE.Vector3 }) {
  const { camera, size } = useThree();
  const goal = useRef<number | null>(null);
  useEffect(() => {
    const half = (((camera as THREE.PerspectiveCamera).fov ?? 30) * Math.PI) / 360;
    const halfH = Math.atan(Math.tan(half) * (size.width / size.height));
    goal.current = (radius / Math.sin(Math.min(half, halfH))) * 0.95 * (exploded ? 1.45 : 1);
  }, [camera, exploded, radius, size.width, size.height]);
  useFrame((_, dt) => {
    if (goal.current === null) return;
    const dist = camera.position.distanceTo(target);
    const next = dist + (goal.current - dist) * (1 - Math.exp(-dt * 3.2));
    camera.position.sub(target).multiplyScalar(next / dist).add(target);
    if (Math.abs(goal.current - next) < 0.02) goal.current = null;
  });
  return null;
}

/** Cadre de couleur autour d'une pièce survolée ou signalée par le moteur (style rendu). */
function Cage({ boxes }: { boxes: (LBox | null | undefined)[] }) {
  const look = useContext(LookContext);
  const slot = useContext(SlotContext);
  const flag = slot ? look.flags[slot] : undefined;
  const hot = slot !== null && look.hot === slot;
  if (look.plan || (!flag && !hot)) return null;
  const color = flag === "error" ? RED : AMBER;
  return (
    <>
      {boxes.filter((b): b is LBox => Boolean(b)).map((b, i) => (
        <mesh key={i} position={b.center}>
          <boxGeometry args={[b.size[0] + 8, b.size[1] + 8, b.size[2] + 8]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
          <Edges color={color} />
        </mesh>
      ))}
    </>
  );
}

export function boxesOf(L: Layout, slot: ComponentCategory): (LBox | null)[] {
  switch (slot) {
    case "GPU": return [L.gpu];
    case "PSU": return [L.psu];
    case "SSD": return [L.ssd];
    case "RAM": {
      if (!L.ram.length) return [];
      const first = L.ram[0], last = L.ram[L.ram.length - 1];
      return [{ center: [(first.center[0] + last.center[0]) / 2, first.center[1], first.center[2]], size: [last.center[0] - first.center[0] + 8, first.size[1], first.size[2]] }];
    }
    case "COOLER": return L.cooler?.kind === "AIR" ? [L.cooler.box] : L.cooler ? [L.cooler.radiator, { center: L.cooler.pump, size: [74, 74, 48] }] : [];
    case "MOTHERBOARD": return [{ center: [L.board.center[0], L.board.center[1], L.board.center[2] + 14], size: [L.board.size[0], L.board.size[1], 34] }];
    case "CPU": return [{ center: [L.cpu.x, L.cpu.y, L.surfaceZ + 8], size: [44, 44, 8] }];
    case "CASE": return [{ center: [0, L.feet + (L.dims.h - L.feet) / 2, 0], size: [L.dims.d, L.dims.h - L.feet, L.dims.w] }];
  }
}

/** Pièce avec modèle officiel s'il existe, sinon son rendu générique (enfants). */
export function Official({ id, box, children }: { id: string; box: LBox | null | undefined; children: ReactNode }) {
  const m = officialModel(id);
  return <OfficialOr url={m?.file} rotation={m?.rotation} box={box} fallback={children} />;
}

/** Mémoire : le modèle officiel représente une barrette, posée dans chaque emplacement occupé. */
export function OfficialRam({ ram, L }: { ram: ComponentOf<"RAM">; L: Layout }) {
  const m = officialModel(ram.id);
  if (!m?.file) return <RealRam ram={ram} L={L} />;
  return <>{L.ram.map((b, i) => <OfficialOr key={i} url={m.file} rotation={m.rotation} box={b} fallback={i === 0 ? <RealRam ram={ram} L={L} /> : null} />)}</>;
}

/** Watercooling : bloc pompe et radiateur ont chacun leur fichier ; ce qui manque garde le rendu générique. */
export function OfficialLiquid({ cooler, L }: { cooler: ComponentOf<"COOLER">; L: Layout }) {
  const m = officialModel(cooler.id);
  const c = L.cooler;
  if (!m || !c || c.kind !== "AIO") return <RealLiquidCooler cooler={cooler} L={L} />;
  return (
    <>
      <RealLiquidCooler cooler={cooler} L={L} hidePump={Boolean(m.file)} hideRadiator={Boolean(m.radiator)} />
      {m.file && <OfficialOr url={m.file} rotation={m.rotation} box={{ center: c.pump, size: [74, 74, 48] }} fallback={null} />}
      {m.radiator && <OfficialOr url={m.radiator} rotation={m.radiatorRotation} box={{ center: c.radiator.center, size: [c.radiator.size[0] + (c.mount === "front" ? 25 : 0), c.radiator.size[1] + (c.mount === "top" ? 25 : 0), c.radiator.size[2] + (c.mount === "side" ? 25 : 0)] }} fallback={null} />}
    </>
  );
}

function Contents({ build, plan, exploded, cotes, accent, hot, flags, quality, onHover, target }: SceneProps & { target: THREE.Vector3 }) {
  const L = useMemo(() => computeLayout(build), [build]);
  const { h: H, w: W, d: D } = L.dims;
  const look = useMemo<Look>(() => ({ plan, accent, hot, flags, quality }), [plan, accent, hot, flags, quality]);
  const lit = Boolean(build.CASE?.specs.rgbFans || build.RAM?.specs.rgb || build.COOLER?.specs.rgb);
  const part = { exploded, onHover };
  const cable = build.PSU?.finish === "white" ? "#e4e7eb" : "#0d0e10";
  // Une cote passe au rouge quand la pièce dépasse la place disponible, indépendamment des autres remarques.
  const gpuTooLong = Boolean(build.GPU && build.CASE && build.GPU.specs.lengthMM > build.CASE.specs.maxGpuLengthMM);
  const coolerTooTall = Boolean(build.COOLER?.specs.heightMM && build.CASE && build.COOLER.specs.heightMM > build.CASE.specs.maxCoolerHeightMM);

  return (
    <LookContext.Provider value={look}>
      <group scale={SCALE}>
        {/* Les clés portent l'identifiant : changer de pièce rejoue son arrivée. */}
        <Part key={`case-${build.CASE?.id}`} slot="CASE" away={[0, -70, 0]} delay={0} {...part} exploded={false}>
          {plan || !build.CASE
            ? <><CaseShell pc={build.CASE} L={L} />{build.CASE && <CaseFans pc={build.CASE} L={L} />}</>
            : <OfficialOr url={officialModel(build.CASE.id)?.file} rotation={officialModel(build.CASE.id)?.rotation} box={boxesOf(L, "CASE")[0]}
                fallback={<><RealCase pc={build.CASE} L={L} cableColor={cable} cables={Boolean(build.MOTHERBOARD && build.PSU)} /><RealCaseFans pc={build.CASE} L={L} /></>} />}
          {build.CASE && <Cage boxes={boxesOf(L, "CASE")} />}
        </Part>
        {build.CASE && !(officialModel(build.CASE.id)?.file && !plan) && (
          <Part key={`glass-${build.CASE.id}`} slot="CASE" away={[0, 0, 560]} delay={0.1} {...part}>
            {plan ? <GlassPanel L={L} /> : <RealGlass L={L} pc={build.CASE} />}
          </Part>
        )}
        {build.PSU && L.psu && (
          <Part key={build.PSU.id} slot="PSU" away={[-260, 0, 0]} delay={0.25} {...part}>
            {plan ? <Psu psu={build.PSU} L={L} /> : <Official id={build.PSU.id} box={L.psu}><RealPsu psu={build.PSU} L={L} /></Official>}
            <Cage boxes={boxesOf(L, "PSU")} />
          </Part>
        )}
        {build.MOTHERBOARD && (
          <Part key={build.MOTHERBOARD.id} slot="MOTHERBOARD" away={[0, 0, 70]} delay={0.4} {...part}>
            {plan ? <Board mb={build.MOTHERBOARD} L={L} /> : <Official id={build.MOTHERBOARD.id} box={boxesOf(L, "MOTHERBOARD")[0]}><RealBoard mb={build.MOTHERBOARD} L={L} /></Official>}
            <Cage boxes={boxesOf(L, "MOTHERBOARD")} />
          </Part>
        )}
        {build.CPU && (
          <Part key={build.CPU.id} slot="CPU" away={[0, 0, 160]} delay={0.55} {...part}>
            {plan ? <Cpu L={L} /> : <Official id={build.CPU.id} box={boxesOf(L, "CPU")[0]}><RealCpu L={L} socket={build.CPU.specs.socket} /></Official>}
            <Cage boxes={boxesOf(L, "CPU")} />
          </Part>
        )}
        {build.SSD && L.ssd && (
          <Part key={build.SSD.id} slot="SSD" away={[150, -30, 210]} delay={0.65} {...part}>
            {plan ? <Ssd L={L} /> : <Official id={build.SSD.id} box={L.ssd}><RealSsd L={L} /></Official>}
            <Cage boxes={boxesOf(L, "SSD")} />
          </Part>
        )}
        {build.RAM && L.ram.length > 0 && (
          <Part key={build.RAM.id} slot="RAM" away={[130, 90, 250]} delay={0.75} {...part}>
            {plan ? <Ram ram={build.RAM} L={L} /> : <OfficialRam ram={build.RAM} L={L} />}
            <Cage boxes={boxesOf(L, "RAM")} />
          </Part>
        )}
        {build.COOLER && L.cooler && (
          <Part key={build.COOLER.id} slot="COOLER" away={[0, 70, 400]} delay={0.9} {...part}>
            {L.cooler.kind === "AIR"
              ? (plan ? <AirCooler cooler={build.COOLER} L={L} /> : <Official id={build.COOLER.id} box={L.cooler.box}><RealAirCooler cooler={build.COOLER} L={L} /></Official>)
              : (plan ? <LiquidCooler cooler={build.COOLER} L={L} /> : <OfficialLiquid cooler={build.COOLER} L={L} />)}
            <Cage boxes={boxesOf(L, "COOLER")} />
          </Part>
        )}
        {build.GPU && L.gpu && (
          <Part key={build.GPU.id} slot="GPU" away={[0, -150, 300]} delay={1.05} {...part}>
            {plan ? <Gpu gpu={build.GPU} L={L} /> : <Official id={build.GPU.id} box={L.gpu}><RealGpu gpu={build.GPU} L={L} cableColor={cable} cable={Boolean(build.PSU)} /></Official>}
            <Cage boxes={boxesOf(L, "GPU")} />
          </Part>
        )}

        {/* Cotes : dimensions réelles, comparées aux dégagements du boîtier */}
        {cotes && !exploded && (
          <group>
            {build.CASE && (
              <>
                <Cote from={[-D / 2, -18, W / 2 + 30]} to={[D / 2, -18, W / 2 + 30]} label={`${D} mm`} color={INK} />
                <Cote from={[D / 2 + 34, L.feet, W / 2]} to={[D / 2 + 34, H, W / 2]} label={`${H} mm`} color={INK} />
                <Cote from={[D / 2 + 34, H + 8, -W / 2]} to={[D / 2 + 34, H + 8, W / 2]} label={`${W} mm`} color={INK} />
              </>
            )}
            {build.GPU && L.gpu && (
              <>
                <Cote
                  from={[L.gpu.startX, L.gpu.center[1] - L.gpu.size[1] / 2 - 16, L.panelZ - 4]}
                  to={[L.gpu.startX + L.gpu.size[0], L.gpu.center[1] - L.gpu.size[1] / 2 - 16, L.panelZ - 4]}
                  label={`carte ${L.gpu.size[0]} mm`} color={gpuTooLong ? RED : AMBER}
                />
                {build.CASE && (
                  <Cote
                    from={[L.gpu.startX, L.gpu.center[1] - L.gpu.size[1] / 2 - 44, L.panelZ - 4]}
                    to={[L.gpu.maxEndX, L.gpu.center[1] - L.gpu.size[1] / 2 - 44, L.panelZ - 4]}
                    label={`place ${build.CASE.specs.maxGpuLengthMM} mm`} color={INK} dashed
                  />
                )}
              </>
            )}
            {build.COOLER && L.cooler?.kind === "AIR" && (
              <Cote
                from={[L.cpu.x - 80, L.yTop + 14, L.surfaceZ + 8]}
                to={[L.cpu.x - 80, L.yTop + 14, L.surfaceZ + 8 + L.cooler.box.size[2]]}
                label={`ventirad ${L.cooler.box.size[2]} / ${build.CASE?.specs.maxCoolerHeightMM ?? "—"} mm`}
                color={coolerTooTall ? RED : AMBER}
              />
            )}
          </group>
        )}
      </group>

      {!plan && <Studio quality={quality} />}
      {/* Éclairage intérieur : une lumière blanche douce, et la lueur des LED quand il y en a */}
      {!plan && (
        <>
          <pointLight position={[D * SCALE * 0.15, H * SCALE * 0.8, W * SCALE * 0.3]} intensity={lit ? 2.5 : 5} distance={7} decay={1.3} />
          {lit && <pointLight position={[D * SCALE * 0.3, H * SCALE * 0.45, W * SCALE * 0.1]} intensity={9} color={accent} distance={6} decay={1.3} />}
          {lit && <pointLight position={[-D * SCALE * 0.25, H * SCALE * 0.7, W * SCALE * 0.15]} intensity={6} color={accent} distance={5} decay={1.3} />}
        </>
      )}
      <Grid
        position={[0, -0.004, 0]} args={[40, 40]} infiniteGrid fadeDistance={26} fadeStrength={1.6}
        cellSize={0.5} cellThickness={0.6} cellColor="#1a3552" sectionSize={2.5} sectionThickness={1} sectionColor="#2a5a86"
      />
      <Rig exploded={exploded} radius={0.5 * Math.hypot(H, W, D) * SCALE} target={target} />
    </LookContext.Provider>
  );
}

/** Éclairage de studio : un environnement de panneaux lumineux pour les reflets, une lumière principale pour les ombres. */
export function Studio({ quality }: { quality: Look["quality"] }) {
  return (
    <>
      <Environment resolution={256} frames={1}>
        <mesh scale={60}>
          <sphereGeometry args={[1, 16, 16]} />
          <meshBasicMaterial color="#0a1420" side={THREE.BackSide} />
        </mesh>
        <Lightformer form="rect" intensity={2.2} position={[0, 9, 2]} rotation={[Math.PI / 2, 0, 0]} scale={[16, 10, 1]} />
        <Lightformer form="rect" intensity={1.5} position={[9, 4, 7]} rotation={[0, -Math.PI / 3, 0]} scale={[9, 7, 1]} color="#e6f0ff" />
        <Lightformer form="rect" intensity={1.1} position={[-9, 3, -3]} rotation={[0, Math.PI / 2.4, 0]} scale={[9, 6, 1]} color="#8fdcff" />
        <Lightformer form="rect" intensity={0.9} position={[0, 3, 11]} rotation={[0, Math.PI, 0]} scale={[12, 5, 1]} />
      </Environment>
      <ambientLight intensity={0.25} />
      <directionalLight
        position={[4, 8, 10]} intensity={3} castShadow={quality === "high"}
        shadow-mapSize={[2048, 2048]} shadow-bias={-0.0003} shadow-normalBias={0.02}
        shadow-camera-left={-7} shadow-camera-right={7} shadow-camera-top={8} shadow-camera-bottom={-3} shadow-camera-near={1} shadow-camera-far={30}
      />
      <directionalLight position={[-6, 4, -5]} intensity={0.5} color="#8fdcff" />
      {/* Sol invisible qui ne garde que l'ombre portée */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 0]} receiveShadow>
        <planeGeometry args={[40, 40]} />
        <shadowMaterial transparent opacity={0.5} />
      </mesh>
    </>
  );
}

/** Halo autour des LED, puis conversion des couleurs pour l'écran. */
export function Effects() {
  return (
    <EffectComposer multisampling={0} enableNormalPass={false}>
      {/* Ombres de contact dans les creux : c'est ce qui donne du relief aux pièces de même couleur */}
      <N8AO halfRes aoRadius={0.45} distanceFalloff={0.6} intensity={2.4} quality="medium" />
      <Bloom mipmapBlur luminanceThreshold={1.7} luminanceSmoothing={0.3} intensity={0.75} radius={0.7} />
      <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
    </EffectComposer>
  );
}

/** Balancement lent devant la vitre : on voit toujours l'intérieur. */
function Sway({ controls }: { controls: React.RefObject<React.ElementRef<typeof OrbitControls>> }) {
  useFrame(() => {
    const c = controls.current;
    if (!c || !c.autoRotate) return;
    const a = c.getAzimuthalAngle();
    if (a > 0.95) c.autoRotateSpeed = Math.abs(c.autoRotateSpeed);
    if (a < 0.05) c.autoRotateSpeed = -Math.abs(c.autoRotateSpeed);
  });
  return null;
}

/** Si WebGL est indisponible (vieux navigateur, pilote bloqué), on affiche un message au lieu d'une page cassée. */
export class Boundary extends ReactComponent<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    if (this.state.failed) {
      return <p className="viewer-fallback">La vue 3D n&apos;a pas pu démarrer sur ce navigateur. La configuration et la compatibilité restent utilisables.</p>;
    }
    return this.props.children;
  }
}

export default function Scene(props: SceneProps) {
  const { zoom = true, motion = "spin", quality, plan } = props;
  const dims = props.build.CASE?.specs.dims ?? { h: 480, w: 230, d: 450 };
  const target = useMemo(() => new THREE.Vector3(0, (dims.h * SCALE) / 2, 0), [dims.h]);
  const controls = useRef<React.ElementRef<typeof OrbitControls>>(null);
  return (
    <Boundary>
      <Canvas
        dpr={quality === "high" ? [1, 2] : [1, 1.25]}
        shadows={quality === "high"}
        camera={{ position: [9.5, 7, 16.5], fov: 30, near: 0.1, far: 160 }}
        gl={{ antialias: true, powerPreference: "high-performance" }}
        onPointerMissed={() => props.onHover(null)}
      >
        <color attach="background" args={[BACKDROP]} />
        <Contents {...props} target={target} />
        {!plan && quality === "high" && <Effects />}
        <OrbitControls
          ref={controls} target={target} enableDamping dampingFactor={0.08} enableZoom={zoom} enablePan={zoom}
          minDistance={4} maxDistance={48} maxPolarAngle={Math.PI * 0.52}
          autoRotate={motion !== "none"} autoRotateSpeed={motion === "sway" ? -0.9 : 0.55}
          onStart={() => { if (controls.current) controls.current.autoRotate = false; }}
        />
        {motion === "sway" && <Sway controls={controls} />}
      </Canvas>
    </Boundary>
  );
}
