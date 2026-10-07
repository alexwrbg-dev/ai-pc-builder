// La config d'exemple de l'accueil et les fiches des pièces.
import { describe, expect, it } from "vitest";
import { CATALOG, resolveBuild } from "@/lib/catalog";
import { checkCompatibility } from "@/lib/compatibility";
import { specLine, specRows } from "@/lib/describe";
import { computeLayout } from "@/lib/layout3d";
import { SHOWCASE } from "@/lib/showcase";
import { CATEGORIES } from "@/lib/types";

describe("config d'exemple de l'accueil", () => {
  it("est complète et passe le moteur sans blocage ni pièce manquante", () => {
    const { build, unknown } = resolveBuild(SHOWCASE);
    expect(unknown).toEqual([]);
    expect(Object.keys(build).sort()).toEqual([...CATEGORIES].sort());
    const r = checkCompatibility(SHOWCASE);
    expect(r.issues.filter((i) => i.severity === "error")).toEqual([]);
    expect(r.missing).toEqual([]);
  });
});

describe("fiches des pièces", () => {
  it("décrit chaque pièce du catalogue sans valeur vide", () => {
    for (const c of CATALOG) {
      expect(specLine(c).length, c.id).toBeGreaterThan(5);
      const rows = specRows(c);
      expect(rows.length, c.id).toBeGreaterThanOrEqual(3);
      for (const [label, value] of rows) {
        expect(value, `${c.id} / ${label}`).not.toMatch(/undefined|NaN|^$/);
      }
    }
  });

  it("sait placer chaque pièce seule pour sa vue 3D", () => {
    for (const c of CATALOG) {
      const L = computeLayout({ [c.category]: c });
      const numbers = JSON.stringify(L);
      expect(numbers, c.id).not.toMatch(/null,null|NaN/);
    }
  });
});
