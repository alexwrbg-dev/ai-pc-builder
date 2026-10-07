// Prix indicatifs : relevés à la main à la date PRICE_DATE, à remplacer par un flux marchand.
import { byId, fullName, resolveBuild, type Resolver } from "./catalog";
import type { BuildSelection, ComponentCategory } from "./types";
import { CATEGORIES } from "./types";

export interface PriceLine {
  slot: ComponentCategory;
  id: string;
  label: string;
  price: number;
}

export function buildPrice(sel: BuildSelection, resolve: Resolver = byId): { total: number; lines: PriceLine[] } {
  const { build } = resolveBuild(sel, resolve);
  const lines: PriceLine[] = [];
  for (const slot of CATEGORIES) {
    const c = build[slot];
    if (c) lines.push({ slot, id: c.id, label: fullName(c), price: c.price });
  }
  return { total: lines.reduce((sum, l) => sum + l.price, 0), lines };
}

export function formatEUR(value: number): string {
  return `${Math.round(value).toLocaleString("fr-FR")} €`;
}
