import { NextResponse } from "next/server";
import { AFFILIATE_DISCLOSURE } from "@/lib/pricing";

// GET /api/merchants — AUCUN lien affilié inventé : actifs=false tant que non configurés
export async function GET() {
  const configured = (process.env.AFFILIATE_MERCHANTS ?? "").trim();
  return NextResponse.json({
    merchants: [
      { name: "Amazon", active: false, note: "Non configuré — renseigner AFFILIATE_MERCHANTS / table Merchant." },
      { name: "LDLC", active: false, note: "Non configuré." },
      { name: "Materiel.net", active: false, note: "Non configuré." },
      { name: "TopAchat", active: false, note: "Non configuré." },
    ],
    configured: configured.length > 0,
    disclosure: AFFILIATE_DISCLOSURE,
  });
}
