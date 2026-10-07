import { NextResponse } from "next/server";
import { checkCompatibility } from "@/lib/compatibility";
import { buildPrice } from "@/lib/pricing";
import { BuildSelectionSchema } from "@/lib/validation";

// POST /api/compatibility  { selection: { CPU: "id", GPU: "id", ... } }
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = BuildSelectionSchema.safeParse(body?.selection ?? body);
  if (!parsed.success) return NextResponse.json({ error: "Sélection invalide." }, { status: 400 });
  return NextResponse.json({ ...checkCompatibility(parsed.data), price: buildPrice(parsed.data) });
}
