import { NextResponse } from "next/server";
import { z } from "zod";
import { CATEGORIES } from "@/lib/types";

// POST /api/admin/import { dryRun: true, items: [...] } — réservé aux administrateurs (voir middleware.ts).
// Valide un lot de composants. L'écriture en base n'est pas encore branchée : le catalogue vit dans src/data/catalog.
const Item = z.object({
  id: z.string().min(3).max(80),
  category: z.enum(CATEGORIES),
  brand: z.string().min(1).max(60),
  model: z.string().min(1).max(120),
  price: z.number().positive().max(20000),
  specs: z.record(z.unknown()),
});

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = z.object({ dryRun: z.boolean().default(true), items: z.array(Item).max(5000) }).safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Import invalide", details: parsed.error.flatten() }, { status: 400 });
  return NextResponse.json({
    ok: true, validated: parsed.data.items.length, written: 0, dryRun: true,
    note: "Validation seule : l'écriture en base sera branchée avec le flux d'affiliation.",
  });
}
