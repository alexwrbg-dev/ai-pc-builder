"use client";
// Visualiseur 3D : modèles GÉNÉRIQUES (boîtier/GPU/RAM/ventirad), étiquetés comme tels.
// Lazy-loadé, isolé (Suspense), n'impacte jamais le reste de l'app.
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

export default function Viewer3D({ color = "#22d3ee", hasGpu = true }: { color?: string; hasGpu?: boolean }) {
  return (
    <div style={{ height: 340, background: "#060a16", borderRadius: 8 }} role="img"
      aria-label="Aperçu 3D schématique avec modèles génériques (boîtier, carte graphique, mémoire, refroidissement)">
      <Canvas camera={{ position: [4, 3, 6] }}>
        <ambientLight intensity={0.6} />
        <pointLight position={[5, 6, 4]} intensity={1.2} />
        <pointLight position={[-4, 2, -3]} intensity={0.5} color={color} />
        {/* Boîtier générique */}
        <mesh position={[0, 1.2, 0]}>
          <boxGeometry args={[3.4, 2.6, 1.6]} />
          <meshStandardMaterial color="#111827" transparent opacity={0.35} />
        </mesh>
        {/* Carte mère générique */}
        <mesh position={[-0.6, 1.2, 0]}>
          <boxGeometry args={[0.1, 1.8, 1.2]} />
          <meshStandardMaterial color="#1f2937" />
        </mesh>
        {/* GPU générique */}
        {hasGpu && (
          <mesh position={[0.3, 1.1, 0]}>
            <boxGeometry args={[1.8, 0.35, 0.9]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.35} />
          </mesh>
        )}
        {/* RAM générique */}
        <mesh position={[-0.2, 1.7, -0.3]}>
          <boxGeometry args={[0.5, 0.35, 0.08]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.6} />
        </mesh>
        <mesh position={[-0.2, 1.7, -0.1]}>
          <boxGeometry args={[0.5, 0.35, 0.08]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.6} />
        </mesh>
        {/* Ventirad générique */}
        <mesh position={[-0.2, 1.2, 0.35]}>
          <cylinderGeometry args={[0.35, 0.35, 0.5, 24]} />
          <meshStandardMaterial color="#374151" />
        </mesh>
        <OrbitControls enablePan enableZoom enableRotate />
      </Canvas>
    </div>
  );
}
