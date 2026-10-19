import { NextResponse } from "next/server";
import { byId } from "@/lib/catalog";
import { amazonConfig, getOffers } from "@/lib/amazon-api";

export const dynamic = "force-dynamic";

// GET /api/amazon?ids=gpu-msi-5070-ventus2x,cpu-r7-9800x3d
// Prix Amazon en direct, photo officielle et lien de chaque pièce demandée (40 au plus).
// Sans identifiants de l'API Creators dans .env, répond { enabled: false } et le site garde ses prix indicatifs.
export async function GET(req: Request) {
  if (!amazonConfig().enabled) {
    return NextResponse.json({ enabled: false, items: {} }, { headers: { "Cache-Control": "public, max-age=3600" } });
  }
  const ids = (new URL(req.url).searchParams.get("ids") ?? "").split(",").map((s) => s.trim()).filter(Boolean).slice(0, 40);
  const asinOf = new Map<string, string>();
  for (const id of ids) {
    const asin = byId(id)?.asin;
    if (asin) asinOf.set(id, asin);
  }
  const offers = await getOffers([...asinOf.values()]);
  const items: Record<string, unknown> = {};
  for (const [id, asin] of asinOf) if (offers[asin]) items[id] = offers[asin];
  return NextResponse.json({ enabled: true, items }, { headers: { "Cache-Control": "public, s-maxage=600, max-age=300" } });
}
