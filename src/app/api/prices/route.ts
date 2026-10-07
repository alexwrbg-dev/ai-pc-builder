import { NextResponse } from "next/server";
import { offersFor } from "@/lib/pricing";

// GET /api/prices?component=rx... — offres DEMO badgées + historique simulé vide
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const component = searchParams.get("component") ?? "";
  if (!component) return NextResponse.json({ error: "param component requis" }, { status: 400 });
  const offers = offersFor(component);
  return NextResponse.json({
    component, offers, bestPrice: offers.length ? [...offers].sort((a, b) => a.price - b.price)[0] : null,
    history: [], meta: { source: "DEMO_SEED", demo: true,
      notice: "Prix de démonstration, non contractuels. Connecteurs marchands : voir AFFILIATE_SYSTEM.md." },
  });
}
