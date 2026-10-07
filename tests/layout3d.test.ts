// La vue 3D doit dire la même chose que le moteur : ce qu'il accepte doit tenir dans le dessin.
import { describe, expect, it } from "vitest";
import { byCategory } from "@/lib/catalog";
import { computeLayout } from "@/lib/layout3d";

describe("mise en place 3D", () => {
  it("garde dans le boîtier toute carte graphique que le moteur accepte", () => {
    for (const pc of byCategory("CASE")) {
      for (const gpu of byCategory("GPU")) {
        if (gpu.specs.lengthMM > pc.specs.maxGpuLengthMM) continue;
        const L = computeLayout({ CASE: pc, GPU: gpu });
        expect(L.gpu!.startX + gpu.specs.lengthMM, `${gpu.id} dans ${pc.id}`).toBeLessThanOrEqual(pc.specs.dims.d / 2);
      }
    }
  });

  it("place le sommet d'un ventirad accepté sous le panneau vitré, et un ventirad trop haut au travers", () => {
    for (const pc of byCategory("CASE")) {
      for (const cooler of byCategory("COOLER").filter((c) => c.specs.kind === "AIR")) {
        const L = computeLayout({ CASE: pc, COOLER: cooler });
        if (L.cooler?.kind !== "AIR") throw new Error("ventirad attendu");
        const top = L.cooler.box.center[2] + L.cooler.box.size[2] / 2;
        const fits = cooler.specs.heightMM! <= pc.specs.maxCoolerHeightMM;
        if (fits) expect(top, `${cooler.id} dans ${pc.id}`).toBeLessThanOrEqual(pc.specs.dims.w / 2);
        // Le plateau est calé sur la hauteur annoncée : l'écart au panneau reflète la marge réelle.
        expect(L.cooler.maxTopZ - top).toBeCloseTo(pc.specs.maxCoolerHeightMM - cooler.specs.heightMM!, 5);
      }
    }
  });

  it("dessine les cartes mères dans le boîtier pour chaque format accepté", () => {
    for (const pc of byCategory("CASE")) {
      for (const mb of byCategory("MOTHERBOARD")) {
        if (!pc.specs.formFactors.includes(mb.specs.formFactor)) continue;
        const L = computeLayout({ CASE: pc, MOTHERBOARD: mb });
        const bottom = L.board.center[1] - L.board.size[1] / 2;
        const front = L.board.center[0] + L.board.size[0] / 2;
        expect(bottom, `${mb.id} dans ${pc.id}`).toBeGreaterThan(0);
        expect(front, `${mb.id} dans ${pc.id}`).toBeLessThan(pc.specs.dims.d / 2);
      }
    }
  });
});
