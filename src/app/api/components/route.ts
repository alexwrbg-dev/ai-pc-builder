import { NextResponse } from "next/server";
import { COMPONENTS } from "@/lib/demo-data";

// GET /api/components?category=GPU&brand=AMD — données DEMO badgées
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const q = (searchParams.get("q") ?? "").toLowerCase();
  let list = COMPONENTS;
  if (category) list = list.filter((c) => c.category === category);
  if (q) list = list.filter((c) => `${c.brand} ${c.model}`.toLowerCase().includes(q));
  return NextResponse.json({
    data: list, meta: { source: "DEMO_SEED", demo: true, count: list.length,
      notice: "Données de démonstration — voir DATA_PIPELINE.md pour l'import réel." },
  });
}
