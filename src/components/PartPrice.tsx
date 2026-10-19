"use client";
// Prix d'une pièce : le prix Amazon relevé il y a moins d'une heure quand l'API est branchée,
// sinon le prix indicatif du catalogue (comparateurs français).
import { formatEUR } from "@/lib/pricing";
import { formatTime, useLiveOffer, useLiveTotal } from "@/lib/amazon-client";
import type { Component } from "@/lib/types";

/** Mention demandée par Amazon à côté d'un prix tiré de son API. */
export const AMAZON_PRICE_NOTE =
  "Prix et disponibilité exacts à la date et à l'heure indiquées, susceptibles de changer. Le prix affiché sur Amazon au moment de l'achat s'applique.";

type Part = Pick<Component, "id" | "price" | "asin">;

/** Montant seul, pour les listes et les tableaux. */
export function PartPrice({ part, className = "num" }: { part: Part; className?: string }) {
  const live = useLiveOffer(part.id, Boolean(part.asin));
  if (live?.price != null) {
    return (
      <span className={`${className} live-price`} title={`Prix Amazon au ${formatTime(live.fetchedAt)}. ${AMAZON_PRICE_NOTE}`}>
        {live.displayPrice ?? formatEUR(live.price)}
      </span>
    );
  }
  return <span className={className}>{formatEUR(part.price)}</span>;
}

/** Encadré de prix de la fiche d'une pièce. */
export function PriceBox({ part, priceDate }: { part: Part; priceDate: string }) {
  const live = useLiveOffer(part.id, Boolean(part.asin));
  if (live?.price != null) {
    return (
      <>
        <div className="sheet-head" style={{ marginBottom: 0 }}>
          <span className="label">Prix Amazon</span>
          <span className="label">au {formatTime(live.fetchedAt)}</span>
        </div>
        <span className="price price-lg live-price">{live.displayPrice ?? formatEUR(live.price)}</span>
        <span className="small">{live.availability ?? (live.inStock ? "En stock" : "Disponibilité non précisée")}</span>
        <span className="small muted">{AMAZON_PRICE_NOTE} Prix indicatif des comparateurs : {formatEUR(part.price)}.</span>
      </>
    );
  }
  return (
    <>
      <div className="sheet-head" style={{ marginBottom: 0 }}>
        <span className="label">Prix indicatif</span>
        <span className="label">relevé le {new Date(priceDate).toLocaleDateString("fr-FR")}</span>
      </div>
      <span className="price price-lg">{formatEUR(part.price)}</span>
      <span className="small muted">Relevé sur les comparateurs français. Le prix affiché chez le marchand fait foi.</span>
    </>
  );
}

/** Total d'une configuration, recalculé avec les prix Amazon en direct quand ils sont connus. */
export function TotalPrice({ parts, className = "num" }: { parts: Part[]; className?: string }) {
  const { total } = useLiveTotal(parts);
  return <span className={className}>{formatEUR(total)}</span>;
}
