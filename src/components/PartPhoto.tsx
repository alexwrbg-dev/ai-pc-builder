"use client";
// Grande image de la fiche d'une pièce : photo officielle Amazon quand l'API est branchée (avec un bouton
// pour passer à la vue 3D), sinon directement la vue 3D.
import { useState } from "react";
import PartViewer from "@/components/PartViewer";
import { useLiveOffer } from "@/lib/amazon-client";

export default function PartPhoto({ id, asin, photo, alt }: { id: string; asin?: string; photo?: string; alt: string }) {
  const live = useLiveOffer(id, Boolean(asin));
  const [view3d, setView3d] = useState(false);
  const src = live?.image ?? photo;
  if (!src) return <PartViewer id={id} />;
  return (
    <div className="stack" style={{ gap: 8 }}>
      {view3d
        ? <PartViewer id={id} />
        // eslint-disable-next-line @next/next/no-img-element
        : <img className="part-photo" src={src} alt={alt} />}
      <div className="chips">
        <button type="button" className="toggle" aria-pressed={!view3d} onClick={() => setView3d(false)}>Photo</button>
        <button type="button" className="toggle" aria-pressed={view3d} onClick={() => setView3d(true)}>Vue 3D à l&apos;échelle</button>
        {live?.image && <span className="small muted">Photo fournie par Amazon.</span>}
      </div>
    </div>
  );
}
