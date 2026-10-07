import { NextResponse } from "next/server";
import { z } from "zod";

// POST /api/admin/import { format: "json", dryRun: true, items: [...] }
// Valide, rapporte, et n'écrit en DB que si dryRun=false + DATABASE_URL. Jamais de faux succès.
const Item = z.object({
  category: z.string(), brand: z.string(), model: z.string(), slug: z.string(),
  specs: z.record(z.unknown()),
});

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = z.object({ format: z.enum(["json", "csv", "xml"]).default("json"), dryRun: z.boolean().default(true), items: z.array(Item).max(5000) }).safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Import invalide", details: parsed.error.flatten() }, { status: 400 });
  const { items, dryRun } = parsed.data;
  if (dryRun || !process.env.DATABASE_URL) {
    return NextResponse.json({ ok: true, validated: items.length, written: 0, dryRun: true,
      note: "Mode dry-run : validation seule. dryRun=false + DATABASE_URL pour écrire en DB." });
  }
  const { PrismaClient } = await import("@prisma/client");
  const prisma = new PrismaClient();
  let written = 0;
  for (const it of items) {
    await prisma.component.upsert({ where: { slug: it.slug },
      update: { specs: it.specs as object }, create: { ...it, category: it.category as never, specs: it.specs as object, source: "ADMIN_IMPORT", confidence: "MEDIUM" } });
    written++;
  }
  await prisma.$disconnect();
  return NextResponse.json({ ok: true, validated: items.length, written, dryRun: false });
}
