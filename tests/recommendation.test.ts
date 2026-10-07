// Analyse de la demande et optimiseur de budget.
import { describe, expect, it } from "vitest";
import { recommendFromPrompt } from "@/lib/ai-orchestrator";
import { resolveBuild } from "@/lib/catalog";
import { recommend } from "@/lib/optimizer";
import { DEFAULT_REQUIREMENTS, parseBudget, parseRequirements } from "@/lib/requirements";

describe("lecture du budget", () => {
  it.each([
    ["PC à 1500 €", 1500],
    ["1500€ max", 1500],
    ["1 500 euros", 1500],
    ["j'ai 1200 balles", 1200],
    ["budget 1,5k euros", 1500],
    ["environ 2k€", 2000],
    ["1.5k pour jouer", 1500],
    ["budget de 900", 900],
    ["un pc pour 1300 en 1440p", 1300],
  ])("« %s » → %i", (text, expected) => {
    expect(parseBudget(text)).toBe(expected);
  });

  it.each(["écran 4k 144 Hz", "jouer en 1440p", "32 Go de RAM", "un pc pour 1440p"])("ne prend pas « %s » pour un budget", (text) => {
    expect(parseBudget(text)).toBeNull();
  });
});

describe("lecture de la demande", () => {
  it("comprend usage, définition, jeux et préférences", () => {
    const r = parseRequirements("PC à 1500 € pour jouer en 1440p à Cyberpunk et Fortnite. RGB, config blanche, silencieux.");
    expect(r).toMatchObject({ budget: 1500, usage: "gaming", resolution: "1440p", white: true, rgb: true, silent: true });
    expect(r.games).toEqual(["Cyberpunk 2077", "Fortnite"]);
  });

  it("ne voit pas « Call of Duty » dans « je code »", () => {
    const r = parseRequirements("je code en 3d, pas de jeu, 700 euros");
    expect(r.games).toEqual([]);
    expect(r.usage).toBe("creation");
  });

  it("respecte une négation", () => {
    expect(parseRequirements("pc bureautique, pas de jeux, sans rgb")).toMatchObject({ usage: "bureautique", rgb: false });
  });

  it("distingue l'écran 4K d'un budget", () => {
    expect(parseRequirements("PC 4K à 3000 €")).toMatchObject({ resolution: "4K", budget: 3000 });
  });
});

describe("optimiseur", () => {
  const cases = [
    "PC à 1500 € pour jouer en 1440p à Cyberpunk et Fortnite. RGB, config blanche, silencieux.",
    "pc gamer 1000€", "pc gamer 2000 € nvidia", "pc gamer 3000 € 4k", "montage vidéo 2500 €",
    "PC pour stream sur twitch 1800 euros ryzen", "petit pc compact pour valorant, 900€, sans rgb",
  ];

  it.each(cases)("« %s » : chaque proposition tient dans le budget et passe le moteur", (prompt) => {
    const { builds, requirements } = recommendFromPrompt(prompt);
    expect(builds.length).toBeGreaterThan(0);
    for (const b of builds) {
      expect(b.total, b.profile).toBeLessThanOrEqual(requirements.budget!);
      expect(b.withinBudget).toBe(true);
      expect(["compatible", "warning"], b.profile).toContain(b.compat.status);
      expect(b.compat.issues.filter((i) => i.severity === "error")).toEqual([]);
      expect(b.compat.missing).toEqual([]);
    }
  });

  it("le total annoncé est la somme de TOUTES les pièces", () => {
    for (const b of recommendFromPrompt("pc gamer 1500€").builds) {
      const { build } = resolveBuild(b.selection);
      const sum = Object.values(build).reduce((s, c) => s + c.price, 0);
      expect(b.total).toBe(sum);
      expect(Object.keys(build).length).toBeGreaterThanOrEqual(7);
    }
  });

  it("le profil économe garde au moins 15 % du budget", () => {
    const eco = recommend({ ...DEFAULT_REQUIREMENTS, budget: 2000 }, "eco")!;
    expect(eco.total).toBeLessThanOrEqual(1700);
  });

  it("les profils d'un même budget ne sont pas trois fois la même configuration", () => {
    const { builds } = recommendFromPrompt("pc gamer 1500€ 1440p");
    expect(new Set(builds.map((b) => JSON.stringify(b.selection))).size).toBe(builds.length);
    expect(builds.length).toBeGreaterThanOrEqual(2);
  });

  it("plus de budget ne donne jamais moins d'images par seconde", () => {
    const fps = [1000, 1500, 2000, 3000].map((budget) =>
      recommend({ ...DEFAULT_REQUIREMENTS, budget, resolution: "1440p" }, "performance")!.fps[0].fps);
    expect([...fps].sort((a, b) => a - b)).toEqual(fps);
  });

  it("ne met pas de carte graphique dans un PC de bureautique", () => {
    const { builds } = recommendFromPrompt("PC bureautique à 800 €");
    for (const b of builds) expect(b.selection.GPU).toBeUndefined();
  });

  it("dit clairement quand le budget ne suffit pas, sans proposer une config hors de prix", () => {
    const { builds } = recommendFromPrompt("PC 4K à 800 € pour jouer");
    expect(builds).toHaveLength(1);
    expect(builds[0].withinBudget).toBe(false);
    expect(builds[0].total).toBeLessThan(1000);
    expect(builds[0].notes[0]).toMatch(/ne suffit pas/);
  });

  it("respecte la marque de carte graphique demandée", () => {
    for (const b of recommendFromPrompt("pc gamer 2000 € nvidia").builds) {
      expect(resolveBuild(b.selection).build.GPU?.specs.chipset).toMatch(/^RTX/);
    }
  });

  it("prend un boîtier blanc quand la config doit être blanche", () => {
    for (const b of recommendFromPrompt("pc gamer blanc 1800€").builds) {
      expect(resolveBuild(b.selection).build.CASE?.finish).toBe("white");
    }
  });

  it("fait une hypothèse annoncée quand le budget manque", () => {
    const { builds } = recommendFromPrompt("pc gaming");
    expect(builds[0].notes[0]).toMatch(/Budget non précisé/);
  });
});
