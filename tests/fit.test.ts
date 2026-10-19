import { describe, expect, it } from "vitest";
import { fitToBox } from "@/lib/fit";

describe("mise en place d'un modèle importé", () => {
  it("couche une carte graphique modélisée debout, en mètres, dans son emplacement en millimètres", () => {
    // Modèle : 0,05 m d'épaisseur (x), 0,338 m de long (y), 0,14 m de haut (z). Emplacement : 338 × 50 × 140 mm.
    const f = fitToBox([0.05, 0.338, 0.14], [338, 50, 140]);
    expect(f.scale).toBeCloseTo(1000, 0);
    expect(f.basis[0][1]).not.toBe(0); // la longueur du modèle (y) devient x
    expect(Math.abs(f.basis[1][0])).toBe(1);
  });
  it("garde une vraie rotation (pas de miroir)", () => {
    for (const src of [[1, 2, 3], [3, 2, 1], [2, 3, 1]] as [number, number, number][]) {
      const { basis: b } = fitToBox(src, [10, 30, 20]);
      const det = b[0][0] * (b[1][1] * b[2][2] - b[1][2] * b[2][1]) - b[0][1] * (b[1][0] * b[2][2] - b[1][2] * b[2][0]) + b[0][2] * (b[1][0] * b[2][1] - b[1][1] * b[2][0]);
      expect(det).toBe(1);
    }
  });
  it("tient dans l'emplacement sans le dépasser", () => {
    const f = fitToBox([2, 1, 1], [100, 60, 40]);
    expect(2 * f.scale).toBeLessThanOrEqual(100 + 1e-9);
    expect(1 * f.scale).toBeLessThanOrEqual(40 + 1e-9);
  });
});
