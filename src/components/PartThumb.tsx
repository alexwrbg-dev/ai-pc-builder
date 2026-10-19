"use client";
// Image d'une pièce, dans cet ordre : photo officielle fournie par l'API Amazon (si elle est branchée),
// photo renseignée dans le catalogue, sinon notre rendu 3D (planche d'images par catégorie).
import { THUMBS, THUMB_COLS, THUMB_ROWS } from "@/data/thumbs";
import { useLiveOffer } from "@/lib/amazon-client";
import type { Component } from "@/lib/types";

type Part = Pick<Component, "id" | "category" | "brand" | "model" | "photo" | "asin">;

export default function PartThumb({ part, className = "" }: { part: Part; className?: string }) {
  const live = useLiveOffer(part.id, Boolean(part.asin));
  const photo = live?.image ?? part.photo;
  if (photo) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img className={`thumb thumb-photo ${className}`} src={photo} alt={`${part.brand} ${part.model}`} loading="lazy" />;
  }
  const cell = THUMBS[part.id];
  const rows = THUMB_ROWS[part.category] ?? 1;
  if (!cell) return <span className={`thumb thumb-empty ${className}`} aria-hidden="true" />;
  return (
    <span
      className={`thumb ${className}`} role="img" aria-label={`Rendu 3D : ${part.brand} ${part.model}`}
      style={{
        backgroundImage: `url(/parts/${part.category}.jpg)`,
        backgroundSize: `${THUMB_COLS * 100}% ${rows * 100}%`,
        backgroundPosition: `${(cell[0] / (THUMB_COLS - 1)) * 100}% ${rows > 1 ? (cell[1] / (rows - 1)) * 100 : 0}%`,
      }}
    />
  );
}
