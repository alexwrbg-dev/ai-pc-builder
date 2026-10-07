"use client";
import dynamic from "next/dynamic";
import { useQuality } from "@/components/BuildViewer";
import { byId } from "@/lib/catalog";

const PartScene = dynamic(() => import("./viewer/PartScene"), {
  ssr: false,
  loading: () => <div className="viewer-loading"><span>Mise en lumière…</span></div>,
});

/** Vue 3D d'une pièce seule, que l'on peut faire tourner. */
export default function PartViewer({ id }: { id: string }) {
  const quality = useQuality();
  const part = byId(id);
  if (!part) return null;
  return (
    <div className="viewer">
      <div className="viewer-stage part-stage" role="img" aria-label="Rendu 3D de la pièce">
        <PartScene part={part} quality={quality} />
        <div className="viewer-corner tl" aria-hidden="true" /><div className="viewer-corner br" aria-hidden="true" />
      </div>
      <p className="viewer-note">Rendu 3D générique à l&apos;échelle, pas une photo du produit. Glisse pour tourner.</p>
    </div>
  );
}
