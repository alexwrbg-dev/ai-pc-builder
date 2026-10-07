// ============================================================
// ORCHESTRATION IA — pipeline imposé :
// USER → AI interpretation → structured requirements → component search
// → deterministic compatibility → optimization → price engine → AI explanation
// Le LLM ne contourne JAMAIS le moteur de compatibilité.
// provider=heuristic par défaut (offline). openai/ollama = explication seule.
// ============================================================
import { COMPONENTS, byId } from "./demo-data";
import { checkCompatibility } from "./compatibility";
import { buildPrice } from "./pricing";
import type { BuildSelection, Component } from "./types";

export interface Requirements {
  budget: number | null;
  resolution: "1080p" | "1440p" | "4K" | null;
  games: string[];
  aestheticWhite: boolean; rgb: boolean; silent: boolean;
  upgradeable: boolean; usage: string | null;
  raw: string;
}

export function parseRequirements(text: string): Requirements {
  const t = text.toLowerCase();
  const budgetMatch = t.match(/(\d[\d\s.]*)\s*(€|euros?|eur)/);
  const budget = budgetMatch ? parseInt(budgetMatch[1].replace(/[\s.]/g, ""), 10) : null;
  const resolution = t.includes("4k") || t.includes("2160") ? "4K"
    : t.includes("1440") ? "1440p" : t.includes("1080") ? "1080p" : null;
  const knownGames = ["cyberpunk", "fortnite", "gta", "valorant", "call of duty", "cod", "alan wake", "baldur", "elden ring", "minecraft"];
  const games = knownGames.filter((g) => t.includes(g));
  return {
    budget, resolution, games,
    aestheticWhite: /blan/.test(t), rgb: /rgb/.test(t),
    silent: /silenc/.test(t),
    upgradeable: /évolut|evolut|upgrade|futur/.test(t),
    usage: /stream/.test(t) ? "streaming" : /bureautique/.test(t) ? "bureautique"
      : /montage|video|3d|création|creation/.test(t) ? "création" : /jeu|game|gaming|fps/.test(t) ? "gaming" : null,
    raw: text,
  };
}

function pick(cat: Component["category"], predicate?: (c: Component) => boolean): Component | undefined {
  const list = COMPONENTS.filter((c) => c.category === cat && (!predicate || predicate(c)));
  return list[0];
}

function gpuTierFor(budget: number | null, resolution: string | null): string {
  if ((budget ?? 0) >= 2500 || resolution === "4K") return "gpu-rtx4090";
  if ((budget ?? 0) >= 1300 || resolution === "1440p") return "gpu-rtx4070s";
  if ((budget ?? 0) >= 900) return "gpu-rx7800xt";
  return "gpu-rtx4060";
}

/** Construit une sélection valide : cherche puis VALIDE avec le moteur, répare si besoin. */
export function recommendBuild(req: Requirements, variant: "value" | "max" | "balanced" = "balanced"): { selection: BuildSelection; explanation: string[] } {
  const gpuId = variant === "max" ? gpuTierFor((req.budget ?? 1500) * 1.15, req.resolution)
    : variant === "value" ? gpuTierFor((req.budget ?? 1200) * 0.85, req.resolution)
    : gpuTierFor(req.budget, req.resolution);

  const cpuId = (req.budget ?? 1500) >= 1400
    ? (byId("cpu-r7-7800x3d") ? "cpu-r7-7800x3d" : "cpu-r5-7600")
    : variant === "value" ? "cpu-r5-5600" : "cpu-r5-7600";

  // Carte mère assortie au socket CPU (jamais l'inverse : le moteur trancherait sinon)
  const cpu = byId(cpuId);
  const socket = (cpu?.specs as { socket?: string })?.socket ?? "AM5";
  const mb = socket === "AM4"
    ? pick("MOTHERBOARD", (c) => ((c.specs as { socket?: string }).socket === "AM4"))
    : socket === "LGA1700"
      ? pick("MOTHERBOARD", (c) => ((c.specs as { socket?: string }).socket === "LGA1700"))
      : pick("MOTHERBOARD", (c) => ((c.specs as { socket?: string }).socket === "AM5"));
  const ramType = ((mb?.specs as { ramType?: string })?.ramType ?? "DDR5") as "DDR4" | "DDR5";
  const ram = ramType === "DDR4"
    ? byId("ram-16d4")! : variant === "max" ? byId("ram-64d5")! : byId("ram-32d5")!;
  const gpu = byId(gpuId)!;
  const gpuTdp = (gpu.specs as { tdpW: number }).tdpW;
  const psu = gpuTdp >= 400 ? byId("psu-850")!
    : gpuTdp >= 200 || (req.budget ?? 0) >= 1200 ? byId("psu-650")! : byId("psu-450")!;
  // Boîtier assez grand pour le GPU (le moteur vérifie, on pré-sélectionne large)
  const gpuLen = (gpu.specs as { lengthMM: number }).lengthMM;
  const bigCase = COMPONENTS.filter((c) => c.category === "CASE")
    .find((c) => ((c.specs as { maxGpuLengthMM: number }).maxGpuLengthMM >= gpuLen + 10
      && (c.specs as { supportedFormFactors: string[] }).supportedFormFactors.includes(
        (mb?.specs as { formFactor: string })?.formFactor ?? "ATX")))
    ?? byId("case-fractal")!;
  const ssd = variant === "max" ? byId("ssd-2tb")! : byId("ssd-1tb")!;
  const cooler = gpuTdp >= 300 || (req.silent) ? byId("aio-360")! : byId("cooler-ak400")!;

  const selection: BuildSelection = {
    CPU: cpu!.id, GPU: gpu.id, MOTHERBOARD: mb!.id, RAM: ram.id,
    SSD_NVME: ssd.id, PSU: psu.id, CASE: bigCase.id,
    ...(cooler.category === "AIO" ? { AIO: cooler.id } : { CPU_COOLER: cooler.id }),
  };

  // Vérification déterministe obligatoire + auto-réparation documentée
  let result = checkCompatibility(selection);
  if (result.status === "incompatible") {
    // Stratégie : élargir boîtier puis PSU (les deux causes les plus fréquentes)
    selection.CASE = "case-fractal";
    selection.PSU = "psu-850";
    result = checkCompatibility(selection);
  }

  const { total } = buildPrice(selection);
  const explanation = [
    `Budget ${req.budget ? req.budget + " €" : "non précisé"} • cible ${req.resolution ?? "1440p"} • variante ${variant}.`,
    `GPU ${gpu.brand} ${gpu.model} : calibré pour ${req.resolution ?? "1440p"}${req.games.length ? ` (${req.games.join(", ")})` : ""}.`,
    `CPU ${cpu!.brand} ${cpu!.model} sur socket ${socket} + carte mère assortie — vérifié par le moteur, pas par le LLM.`,
    `${(ram.specs as { capacityGB: number }).capacityGB}GB ${ramType} adaptés à la plateforme. Alimentation ${psu.model}, boîtier ${bigCase.model}.`,
    total ? `Total estimé (démo) : ~${total} €.` : "Prix partiels (base démo incomplète).",
    result.status === "compatible" ? "🟢 Compatibilité vérifiée par le moteur déterministe."
      : `Moteur : ${result.issues.map((i) => i.message).join(" ")}`,
    req.silent ? "Option silence : AIO 360mm + profil ventilateurs calmes recommandés." : "",
    req.aestheticWhite ? "Note esthétique : config blanche demandée — boîtier/câbles blancs à valider en boutique (dataset démo sans couleur)." : "",
  ].filter(Boolean);

  return { selection, explanation };
}

export function recommendThreeProfiles(req: Requirements) {
  return {
    requirements: req,
    profiles: {
      value: recommendBuild(req, "value"),
      balanced: recommendBuild(req, "balanced"),
      max: recommendBuild(req, "max"),
    },
  };
}

/** Explication LLM optionnelle (jamais de compatibilité/prix inventés). */
export async function llmExplain(prompt: string, context: string): Promise<{ text: string; provider: string } | null> {
  const provider = process.env.AI_PROVIDER ?? "heuristic";
  const key = process.env.AI_API_KEY;
  if (provider === "heuristic" || !key) return null;
  try {
    if (provider === "openai") {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
        body: JSON.stringify({
          model: process.env.AI_MODEL ?? "gpt-4o-mini",
          messages: [
            { role: "system", content: "Tu es un conseiller hardware. Tu expliques, tu ne décides jamais de compatibilité/prix/dimensions : ces faits viennent du moteur. Réponds en français, concis, sans inventer de références." },
            { role: "user", content: `${prompt}\n\nContexte vérifié:\n${context}` },
          ],
          max_tokens: 600,
        }),
      });
      if (!res.ok) return null;
      const json = await res.json();
      return { text: json.choices?.[0]?.message?.content ?? "", provider };
    }
    return null; // autres providers : brancher ici (anthropic/mistral/ollama)
  } catch { return null; }
}
