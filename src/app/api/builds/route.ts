import { NextResponse } from "next/server";

// Builds / community / price-alerts : implémentation MVP sans DB obligatoire.
// Persistance navigateur (localStorage) côté client + API de validation.
// Prod : brancher Prisma (schéma fourni). Voir DATABASE.md.
const mem: Record<string, unknown[]> = { builds: [], alerts: [] };

export async function GET() {
  return NextResponse.json({ builds: mem.builds, demo: true,
    notice: "Stockage en mémoire (MVP). Prod : PostgreSQL via Prisma." });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body?.title || !body?.selection) return NextResponse.json({ error: "title + selection requis" }, { status: 400 });
  const slug = `${String(body.title).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").slice(0, 60)}-${Date.now().toString(36)}`;
  const build = { ...body, slug, id: slug, createdAt: new Date().toISOString(), likes: 0 };
  (mem.builds as unknown[]).unshift(build);
  return NextResponse.json({ build }, { status: 201 });
}
