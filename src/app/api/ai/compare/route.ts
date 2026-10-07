import { NextResponse } from "next/server";
import { checkCompatibility } from "@/lib/compatibility";
import { buildPrice } from "@/lib/pricing";
import { scoreBuild, estimatePerf, estimateBottleneck } from "@/lib/scoring";

// POST /api/ai/compare { a, b } — comparateur factuel
export async function POST(req: Request) {
  const { a = {}, b = {} } = await req.json().catch(() => ({}));
  const enrich = (s: Record<string, string>) => {
    const price = buildPrice(s);
    return { selection: s, compat: checkCompatibility(s), price,
      score: scoreBuild(s, price.total), perf: estimatePerf(s.GPU), bottleneck: estimateBottleneck(s) };
  };
  const A = enrich(a); const B = enrich(b);
  const winner =
    (A.score.total ?? 0) === (B.score.total ?? 0) ? "tie" : (A.score.total ?? 0) > (B.score.total ?? 0) ? "A" : "B";
  return NextResponse.json({ A, B, winner,
    verdict: winner === "tie" ? "Égalité au score global." : `Gagnant au score global : Build ${winner} (${winner === "A" ? A.score.total : B.score.total}/100). Prix : A=${A.price.total ?? "?"}€ vs B=${B.price.total ?? "?"}€.`,
  });
}
