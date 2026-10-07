// Intégrité du catalogue : des données fausses donneraient des verdicts faux.
import { describe, expect, it } from "vitest";
import { CATALOG, byCategory, decodeSelection, encodeSelection } from "@/lib/catalog";
import { amazonUrl } from "@/lib/affiliate";
import { CATEGORIES } from "@/lib/types";

describe("catalogue", () => {
  it("contient au moins 150 pièces, dans les 8 catégories", () => {
    expect(CATALOG.length).toBeGreaterThanOrEqual(150);
    for (const c of CATEGORIES) expect(byCategory(c).length).toBeGreaterThan(10);
  });

  it("n'a aucun identifiant en double", () => {
    const ids = CATALOG.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("donne un prix plausible à chaque pièce", () => {
    for (const c of CATALOG) {
      expect(c.price, c.id).toBeGreaterThan(15);
      expect(c.price, c.id).toBeLessThan(8000);
    }
  });

  it("a des dimensions de carte graphique réalistes", () => {
    for (const g of byCategory("GPU")) {
      expect(g.specs.lengthMM, g.id).toBeGreaterThan(150);
      expect(g.specs.lengthMM, g.id).toBeLessThan(380);
      expect(g.specs.power8pin + g.specs.power16pin, g.id).toBeGreaterThan(0);
    }
  });

  it("propose pour chaque processeur au moins une carte mère et un kit mémoire", () => {
    for (const cpu of byCategory("CPU")) {
      const boards = byCategory("MOTHERBOARD").filter((m) => m.specs.socket === cpu.specs.socket);
      expect(boards.length, cpu.id).toBeGreaterThan(0);
      expect(byCategory("RAM").some((r) => boards.some((b) => b.specs.ramType === r.specs.type)), cpu.id).toBe(true);
    }
  });

  it("peut loger chaque carte graphique dans au moins un boîtier", () => {
    for (const g of byCategory("GPU")) {
      expect(byCategory("CASE").some((k) => k.specs.maxGpuLengthMM >= g.specs.lengthMM), g.id).toBe(true);
    }
  });

  it("peut alimenter chaque carte graphique avec au moins une alimentation, sans adaptateur", () => {
    for (const g of byCategory("GPU")) {
      const ok = byCategory("PSU").some((p) =>
        p.specs.wattageW >= g.specs.recommendedPsuW && p.specs.pcie8 >= g.specs.power8pin && p.specs.hpwr16 >= g.specs.power16pin);
      expect(ok, g.id).toBe(true);
    }
  });
});

describe("liens", () => {
  it("encode puis décode une sélection sans perte", () => {
    const sel = { CPU: "cpu-r5-7500f", GPU: "gpu-msi-5070-ventus2x", CASE: "case-fractal-north-black" };
    expect(decodeSelection(encodeSelection(sel))).toEqual(sel);
  });

  it("donne deux liens différents à deux configurations différentes", () => {
    expect(encodeSelection({ CPU: "cpu-r5-7500f" })).not.toBe(encodeSelection({ CPU: "cpu-r5-7600" }));
  });

  it("ignore les identifiants inconnus d'un lien trafiqué", () => {
    expect(decodeSelection("<script>~gpu-msi-5070-ventus2x")).toEqual({ GPU: "gpu-msi-5070-ventus2x" });
  });

  it("construit un lien de recherche Amazon, avec le tag seulement s'il est fourni", () => {
    const c = { brand: "AMD", model: "Ryzen 5 7500F" };
    expect(amazonUrl(c, "")).toBe("https://www.amazon.fr/s?k=AMD+Ryzen+5+7500F");
    expect(amazonUrl(c, "monsite-21")).toBe("https://www.amazon.fr/s?k=AMD+Ryzen+5+7500F&tag=monsite-21");
    expect(amazonUrl({ ...c, asin: "B0CQ4H4H7X" }, "monsite-21")).toBe("https://www.amazon.fr/dp/B0CQ4H4H7X?tag=monsite-21");
  });
});
