"use client";
// Page technique : affiche une pièce seule, immobile, pour que scripts/vignettes.mjs la photographie.
// L'identifiant de la pièce est lu après le # de l'adresse.
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { byId } from "@/lib/catalog";

const PartScene = dynamic(() => import("@/components/viewer/PartScene"), { ssr: false });

export default function Page() {
  const [id, setId] = useState("");
  useEffect(() => {
    const read = () => { document.title = "…"; setId(decodeURIComponent(window.location.hash.slice(1))); };
    read();
    window.addEventListener("hashchange", read);
    return () => window.removeEventListener("hashchange", read);
  }, []);
  const part = byId(id);
  return (
    <div id="vignette" style={{ width: 480, height: 360, margin: "24px auto" }}>
      {part ? <PartScene part={part} still onReady={() => { document.title = `ok:${part.id}`; }} /> : <p className="muted">Pièce inconnue.</p>}
    </div>
  );
}
