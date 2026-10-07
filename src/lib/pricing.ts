// Price engine + affiliation — AUCUN lien inventé.
// Les offres viennent de DEMO_PRICES (marquées démo) ou de la DB.
// Les liens affiliés ne sont générés QUE pour les marchands configurés
// (table Merchant active + env AFFILIATE_*). Sinon : pas de lien.
import { DEMO_PRICES, byId } from "./demo-data";
import type { BuildSelection, MerchantOffer } from "./types";

export function offersFor(componentId: string): MerchantOffer[] {
  return (DEMO_PRICES[componentId] ?? []).map((o) => ({ ...o }));
}

export function bestOffer(componentId: string): MerchantOffer | null {
  const offers = offersFor(componentId);
  if (!offers.length) return null;
  const best = [...offers].sort((a, b) => a.price - b.price)[0];
  return { ...best, bestPrice: true };
}

export function buildPrice(sel: BuildSelection): { total: number | null; lines: { id: string; label: string; price: number | null }[] } {
  const lines = Object.entries(sel)
    .filter(([, id]) => !!id)
    .map(([cat, id]) => {
      const c = byId(id as string);
      const best = bestOffer(id as string);
      return { id: id as string, label: `${cat}: ${c ? `${c.brand} ${c.model}` : id}`, price: best?.price ?? null };
    });
  const priced = lines.filter((l) => l.price != null);
  if (!priced.length) return { total: null, lines };
  return { total: Math.round(priced.reduce((s, l) => s + (l.price ?? 0), 0)), lines };
}

/** Construit une URL affiliée UNIQUEMENT si le marchand est configuré. Sinon null. */
export function affiliateUrl(merchantName: string, productUrl?: string): string | null {
  // En prod : lookup DB Merchant(active=true) + trackingTpl, redirect via /api/go.
  // Ici : aucun marchand réel configuré → null (l'UI affiche "lien non configuré").
  void merchantName; void productUrl;
  const configured = (process.env.AFFILIATE_MERCHANTS ?? "").trim();
  if (!configured || !productUrl) return null;
  return null; // branché à la table Merchant en prod
}

export const AFFILIATE_DISCLOSURE =
  "Certains liens vers les marchands peuvent générer une commission pour le site, sans surcoût pour vous. Les recommandations restent indépendantes des commissions.";
