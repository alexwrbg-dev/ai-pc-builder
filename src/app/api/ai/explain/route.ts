import { NextResponse } from "next/server";
import { byId } from "@/lib/demo-data";
import { checkCompatibility } from "@/lib/compatibility";
import { buildPrice } from "@/lib/pricing";

// POST /api/ai/explain { selection } — explication factuelle depuis specs+moteur (pas de LLM requis)
export async function POST(req: Request) {
  const { selection = {} } = await req.json().catch(() => ({}));
  const lines = Object.entries(selection as Record<string, string>).map(([cat, id]) => {
    const c = id ? byId(id) : undefined;
    return c ? `• ${cat} : ${c.brand} ${c.model} — ${JSON.stringify(c.specs)}` : `• ${cat} : non choisi`;
  });
  const compat = checkCompatibility(selection);
  const price = buildPrice(selection);
  return NextResponse.json({
    explanation: [
      "Choix justifiés par les specs structurées :",
      ...lines,
      compat.status === "compatible" ? "🟢 Ensemble validé par le moteur déterministe." : compat.issues.map((i) => `${i.message} Solution : ${i.fix}`).join("\n"),
      price.total ? `Total démo ~${price.total} € (prix de démonstration).` : "Prix partiels.",
    ].join("\n"),
    compat, price,
  });
}
