"use client";
// Côté navigateur : regroupe les demandes de prix Amazon des pièces affichées sur la page
// en un seul appel à /api/amazon, et garde les réponses pour toute la visite.
import { useEffect, useState } from "react";

export interface LiveOffer {
  asin: string;
  price: number | null;
  displayPrice: string | null;
  availability: string | null;
  inStock: boolean;
  image: string | null;
  url: string | null;
  fetchedAt: number;
}

type Entry = LiveOffer | null;
const known = new Map<string, Entry>();
const listeners = new Map<string, Set<() => void>>();
let pending = new Set<string>();
let timer: ReturnType<typeof setTimeout> | null = null;
/** Devient faux dès que le serveur répond que l'API n'est pas configurée : plus aucun appel ensuite. */
let enabled = true;

function notify(id: string) {
  listeners.get(id)?.forEach((f) => f());
}

async function flush() {
  timer = null;
  const ids = [...pending];
  pending = new Set();
  for (let i = 0; i < ids.length; i += 40) {
    const chunk = ids.slice(i, i + 40);
    try {
      const res = await fetch(`/api/amazon?ids=${encodeURIComponent(chunk.join(","))}`);
      const data = (await res.json()) as { enabled: boolean; items: Record<string, LiveOffer> };
      if (!data.enabled) enabled = false;
      for (const id of chunk) { known.set(id, data.items?.[id] ?? null); notify(id); }
    } catch {
      for (const id of chunk) { known.set(id, null); notify(id); }
    }
  }
}

function request(id: string) {
  if (!enabled || known.has(id) || pending.has(id)) return;
  pending.add(id);
  if (!timer) timer = setTimeout(flush, 30);
}

/** Offre Amazon d'une pièce, ou null tant qu'elle n'est pas connue (ou si l'API n'est pas branchée). */
export function useLiveOffer(id: string | undefined, hasAsin: boolean): LiveOffer | null {
  const [, tick] = useState(0);
  useEffect(() => {
    if (!id || !hasAsin) return;
    const f = () => tick((n) => n + 1);
    if (!listeners.has(id)) listeners.set(id, new Set());
    listeners.get(id)!.add(f);
    request(id);
    return () => { listeners.get(id)?.delete(f); };
  }, [id, hasAsin]);
  return (id && known.get(id)) || null;
}

export function formatTime(ms: number): string {
  return new Date(ms).toLocaleString("fr-FR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });
}

/** Total d'une liste de pièces avec le prix Amazon en direct quand il est connu, le prix indicatif sinon. */
export function useLiveTotal(parts: { id: string; price: number; asin?: string }[]): { total: number; live: number } {
  const [, tick] = useState(0);
  const key = parts.map((p) => p.id).join(",");
  useEffect(() => {
    const f = () => tick((n) => n + 1);
    const ids = parts.filter((p) => p.asin).map((p) => p.id);
    for (const id of ids) {
      if (!listeners.has(id)) listeners.set(id, new Set());
      listeners.get(id)!.add(f);
      request(id);
    }
    return () => { for (const id of ids) listeners.get(id)?.delete(f); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  let total = 0;
  let live = 0;
  for (const p of parts) {
    const o = known.get(p.id);
    if (o?.price != null) { total += o.price; live += 1; } else total += p.price;
  }
  return { total: Math.round(total), live };
}
