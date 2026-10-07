import { NextResponse } from "next/server";
import { checkCompatibility } from "@/lib/compatibility";
import { BuildSelectionSchema } from "@/lib/validation";

// POST /api/compatibility { selection }
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = BuildSelectionSchema.safeParse(body.selection ?? body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Sélection invalide", details: parsed.error.flatten() }, { status: 400 });
    }
    const result = checkCompatibility(parsed.data);
    return NextResponse.json({ ...result, demo: false, note: "Moteur déterministe v1 — seule source de vérité compatibilité." });
  } catch {
    return NextResponse.json({ error: "Requête illisible" }, { status: 400 });
  }
}
