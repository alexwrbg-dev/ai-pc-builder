import { NextResponse } from "next/server";
import { checkCompatibility } from "@/lib/compatibility";
import { buildPrice } from "@/lib/pricing";
import { scoreBuild } from "@/lib/scoring";
import { byId, COMPONENTS } from "@/lib/demo-data";

// POST /api/ai/optimize { selection, goal } goal=perf-per-euro|max-fps|min-noise|min-price|balanced
export async function POST(req: Request) {
  const { selection = {}, goal = "perf-per-euro" } = await req.json().catch(() => ({}));
  const cands = COMPONENTS.filter((c) => c.category === "GPU");
  let best: string | undefined; let bestScore = -Infinity;
  for (const g of cands) {
    const trial = { ...(selection as Record<string, string>), GPU: g.id };
    const compat = checkCompatibility(trial);
    if (compat.status === "incompatible") continue;
    const { total } = buildPrice(trial);
    if (!total) continue;
    const fps = ({ "gpu-rtx4060": 52, "gpu-rx7800xt": 78, "gpu-rtx4070s": 82, "gpu-rtx4090": 135 } as Record<string, number>)[g.id] ?? 50;
    const s = goal === "max-fps" ? fps : goal === "min-price" ? -total : fps / total;
    if (s > bestScore) { bestScore = s; best = g.id; }
  }
  if (!best) return NextResponse.json({ error: "aucune optimisation compatible trouvée" }, { status: 422 });
  const next = { ...(selection as Record<string, string>), GPU: best };
  return NextResponse.json({
    goal, selection: next, gpu: byId(best),
    compat: checkCompatibility(next), price: buildPrice(next),
    score: scoreBuild(next, buildPrice(next).total),
    note: "Optimisation par recherche exhaustive sur dataset + moteur déterministe (pas de LLM).",
  });
}
