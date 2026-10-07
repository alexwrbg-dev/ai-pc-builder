// Accès au catalogue. Aujourd'hui : données embarquées (src/data/catalog).
// Demain : même interface branchée sur la base Prisma ou un flux d'affiliation.
import { CATALOG, PRICE_DATE } from "@/data/catalog";
import type { BuildSelection, Component, ComponentCategory, ComponentOf, ResolvedBuild } from "./types";
import { CATEGORIES } from "./types";

export { CATALOG, PRICE_DATE };

const INDEX = new Map<string, Component>(CATALOG.map((c) => [c.id, c]));

export type Resolver = (id: string) => Component | undefined;

export const byId: Resolver = (id) => INDEX.get(id);

export function byCategory<C extends ComponentCategory>(category: C): ComponentOf<C>[] {
  return CATALOG.filter((c) => c.category === category) as unknown as ComponentOf<C>[];
}

export function fullName(c: Pick<Component, "brand" | "model">): string {
  return `${c.brand} ${c.model}`;
}

/** Transforme une sélection d'identifiants en pièces. Les identifiants inconnus sont renvoyés à part. */
export function resolveBuild(sel: BuildSelection, resolve: Resolver = byId): { build: ResolvedBuild; unknown: ComponentCategory[] } {
  const build: Record<string, Component> = {};
  const unknown: ComponentCategory[] = [];
  for (const slot of CATEGORIES) {
    const id = sel[slot];
    if (!id) continue;
    const c = resolve(id);
    if (!c || c.category !== slot) unknown.push(slot);
    else build[slot] = c;
  }
  return { build: build as ResolvedBuild, unknown };
}

/** Sélection → chaîne courte pour les liens de partage, et inverse. */
export function encodeSelection(sel: BuildSelection): string {
  return CATEGORIES.map((slot) => sel[slot] ?? "").join("~");
}

export function decodeSelection(code: string | null | undefined): BuildSelection {
  if (!code) return {};
  const parts = code.split("~");
  const sel: BuildSelection = {};
  CATEGORIES.forEach((slot, i) => {
    const id = parts[i];
    if (id && byId(id)?.category === slot) sel[slot] = id;
  });
  return sel;
}
