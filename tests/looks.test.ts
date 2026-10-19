import { describe, expect, it } from "vitest";
import { BOARD_LOOK, CASE_LOOK, COOLER_LOOK, GPU_LOOK, PSU_LOOK, RAM_LOOK } from "@/data/looks";
import { CATALOG } from "@/lib/catalog";
import { computeLayout } from "@/lib/layout3d";
import { caseLook, coolerLook, gpuLook, shade } from "@/lib/looks";
import type { ComponentOf } from "@/lib/types";

const HEX = /^#[0-9a-f]{6}$/i;
const TABLES = { GPU: GPU_LOOK, COOLER: COOLER_LOOK, CASE: CASE_LOOK, RAM: RAM_LOOK, MOTHERBOARD: BOARD_LOOK, PSU: PSU_LOOK } as const;

describe("apparence relevée des pièces", () => {
  it("chaque pièce visible a sa fiche d'apparence, et aucune fiche n'est orpheline", () => {
    for (const [cat, table] of Object.entries(TABLES)) {
      const ids = CATALOG.filter((c) => c.category === cat).map((c) => c.id);
      expect(Object.keys(table).sort()).toEqual([...ids].sort());
    }
  });
  it("les couleurs sont des codes hexadécimaux valides", () => {
    for (const table of Object.values(TABLES)) {
      for (const [id, look] of Object.entries(table)) {
        for (const [k, v] of Object.entries(look)) {
          if (typeof v === "string" && v.startsWith("#")) expect(v, `${id}.${k}`).toMatch(HEX);
        }
      }
    }
  });
  it("le nombre de ventilateurs relevé correspond à la fiche technique", () => {
    for (const c of CATALOG) {
      if (c.category === "CASE") {
        const l = caseLook(c as ComponentOf<"CASE">);
        expect(l.frontFans + l.rearFans + l.topFans + l.bottomFans + l.sideFans, c.id).toBe(c.specs.includedFans);
      }
      if (c.category === "COOLER") expect(coolerLook(c as ComponentOf<"COOLER">).fanSize, c.id).toBeGreaterThanOrEqual(120);
      if (c.category === "GPU") expect(gpuLook(c as ComponentOf<"GPU">).body, c.id).toMatch(HEX);
    }
  });
  it("les hauts pieds surélèvent le plancher", () => {
    const north = CATALOG.find((c) => c.id === "case-fractal-north-black") as ComponentOf<"CASE">;
    expect(computeLayout({ CASE: north }).feet).toBeGreaterThan(computeLayout({}).feet);
  });
  it("shade éclaircit et assombrit sans sortir des bornes", () => {
    expect(shade("#000000", -0.5)).toBe("#000000");
    expect(shade("#ffffff", 0.5)).toBe("#ffffff");
    expect(shade("#808080", 0.1)).toBe("#9a9a9a");
  });
});
