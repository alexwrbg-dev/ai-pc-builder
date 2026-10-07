import { NextResponse } from "next/server";
import { parseRequirements, recommendThreeProfiles, recommendBuild, llmExplain } from "@/lib/ai-orchestrator";
import { checkCompatibility } from "@/lib/compatibility";
import { buildPrice } from "@/lib/pricing";
import { scoreBuild } from "@/lib/scoring";
import { RecommendSchema } from "@/lib/validation";
import { track } from "@/lib/analytics";

// POST /api/ai/recommend { prompt, variant }
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = RecommendSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: "prompt invalide" }, { status: 400 });
    const req0 = parseRequirements(parsed.data.prompt);
    void track("recommend", { budget: req0.budget, resolution: req0.resolution });

    const one = (v: "value" | "balanced" | "max") => {
      const { selection, explanation } = recommendBuild(req0, v);
      const compat = checkCompatibility(selection);
      const { total, lines } = buildPrice(selection);
      const score = scoreBuild(selection, total);
      return { variant: v, selection, explanation, compat, price: { total, lines }, score };
    };

    if (parsed.data.variant === "all") {
      const profiles = recommendThreeProfiles(req0);
      const enrich = (v: "value" | "balanced" | "max") => one(v);
      // Explication LLM optionnelle (ne remplace jamais les faits moteur)
      const ctx = JSON.stringify({ requirements: req0 });
      const llm = await llmExplain(parsed.data.prompt, ctx);
      return NextResponse.json({
        requirements: profiles.requirements,
        builds: { value: enrich("value"), balanced: enrich("balanced"), max: enrich("max") },
        llm: llm ? { ...llm, warning: "Explication générative — compatibilité/prix issus du moteur uniquement." } : null,
        meta: { demo: true, notice: "Données de démonstration. Compatibilité = moteur déterministe." },
      });
    }
    return NextResponse.json({ requirements: req0, build: one(parsed.data.variant as "value" | "balanced" | "max"), meta: { demo: true } });
  } catch {
    return NextResponse.json({ error: "Requête illisible" }, { status: 400 });
  }
}
