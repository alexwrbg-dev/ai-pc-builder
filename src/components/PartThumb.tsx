// Image d'une pièce : la photo officielle si elle est renseignée, sinon notre rendu 3D (planche par catégorie).
import { THUMBS, THUMB_COLS, THUMB_ROWS } from "@/data/thumbs";
import type { Component } from "@/lib/types";

export default function PartThumb({ part, className = "" }: { part: Pick<Component, "id" | "category" | "brand" | "model" | "photo">; className?: string }) {
  if (part.photo) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img className={`thumb ${className}`} src={part.photo} alt={`${part.brand} ${part.model}`} loading="lazy" />;
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
