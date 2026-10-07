import { NextResponse } from "next/server";
import { llmExplain, recommendFromPrompt, recommendFromRequirements } from "@/lib/ai-orchestrator";
import { track } from "@/lib/analytics";
import { RecommendSchema } from "@/lib/validation";

// POST /api/ai/recommend  { prompt }  ou  { requirements }
// Répond avec ce qui a été compris et jusqu'à trois configurations vérifiées par le moteur.
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = RecommendSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Demande invalide." }, { status: 400 });

  const result = "prompt" in parsed.data
    ? recommendFromPrompt(parsed.data.prompt)
    : recommendFromRequirements(parsed.data.requirements);
  void track("recommend", { budget: result.requirements.budget, usage: result.requirements.usage });

  const explanation = "prompt" in parsed.data ? await llmExplain(parsed.data.prompt, result.builds) : null;
  return NextResponse.json({ ...result, explanation });
}
