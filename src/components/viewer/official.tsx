"use client";
// Modèles 3D officiels (fichiers .glb déposés dans public/models) : quand une pièce en a un, il remplace
// le rendu générique, mis à l'échelle exacte de la pièce et posé à sa place dans la configuration.
import { Component as ReactComponent, Suspense, useMemo, type ReactNode } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { MODELS } from "@/data/models";
import { fitToBox } from "@/lib/fit";
import type { Box } from "@/lib/layout3d";

export function officialModel(id: string | undefined) {
  return id ? MODELS[id] : undefined;
}

/** Un fichier illisible ou absent ne doit pas casser la vue : on retombe sur le rendu générique. */
class Fallback extends ReactComponent<{ fallback: ReactNode; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error: unknown) {
    console.warn("Modèle 3D officiel ignoré :", error);
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

function Placed({ url, box, rotation }: { url: string; box: Box; rotation?: [number, number, number] }) {
  const { scene } = useGLTF(url);
  // Les boîtes sont recalculées à chaque rendu : on ne refait la mise en place que si leurs valeurs changent.
  const sizeKey = box.size.join(",");
  const rotKey = rotation?.join(",") ?? "";
  const object = useMemo(() => {
    const root = scene.clone(true);
    root.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (mesh.isMesh) { mesh.castShadow = true; mesh.receiveShadow = true; }
    });
    // 1. Orientation : forcée par les réglages, sinon déduite des proportions.
    const holder = new THREE.Group();
    holder.add(root);
    const size0 = new THREE.Box3().setFromObject(root).getSize(new THREE.Vector3());
    if (rotation) {
      holder.rotation.set(...(rotation.map((d) => THREE.MathUtils.degToRad(d)) as [number, number, number]));
    } else {
      const { basis } = fitToBox([size0.x, size0.y, size0.z], box.size);
      const m = new THREE.Matrix4().set(
        basis[0][0], basis[0][1], basis[0][2], 0,
        basis[1][0], basis[1][1], basis[1][2], 0,
        basis[2][0], basis[2][1], basis[2][2], 0,
        0, 0, 0, 1,
      );
      holder.quaternion.setFromRotationMatrix(m);
    }
    holder.updateMatrixWorld(true);
    // 2. Échelle uniforme pour tenir exactement dans l'emplacement, puis centrage.
    const turned = new THREE.Box3().setFromObject(holder);
    const size = turned.getSize(new THREE.Vector3());
    const scale = Math.min(box.size[0] / Math.max(size.x, 1e-6), box.size[1] / Math.max(size.y, 1e-6), box.size[2] / Math.max(size.z, 1e-6));
    const center = turned.getCenter(new THREE.Vector3());
    const outer = new THREE.Group();
    outer.add(holder);
    holder.position.sub(center);
    outer.scale.setScalar(scale);
    return outer;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scene, sizeKey, rotKey]);
  return <primitive object={object} position={box.center} />;
}

/**
 * Affiche le modèle officiel `url` dans la boîte `box` (millimètres de la scène), ou `fallback`
 * tant qu'il charge, s'il n'existe pas ou s'il est illisible.
 */
export function OfficialOr({ url, box, rotation, fallback }: { url?: string; box: Box | null | undefined; rotation?: [number, number, number]; fallback: ReactNode }) {
  if (!url || !box) return <>{fallback}</>;
  return (
    <Fallback fallback={fallback}>
      <Suspense fallback={fallback}>
        <Placed url={url} box={box} rotation={rotation} />
      </Suspense>
    </Fallback>
  );
}
