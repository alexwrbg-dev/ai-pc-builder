import { NextResponse } from "next/server";
import { DEMO_FPS } from "@/lib/demo-data";

// GET /api/benchmarks?gpu=gpu-rtx4070s — estimations DEMO uniquement
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const gpu = searchParams.get("gpu") ?? "";
  const table = (DEMO_FPS as Record<string, unknown>)[gpu];
  return NextResponse.json({ gpu, benchmarks: table ?? null, estimated: true,
    meta: { demo: true, notice: "Estimations, pas des mesures. Ne jamais présenter comme du réel mesuré." } });
}
