import { NextResponse } from "next/server";
import { CATALOG, PRICE_DATE } from "@/lib/catalog";
import { CATEGORIES, type ComponentCategory } from "@/lib/types";

// GET /api/components?category=GPU&q=5070
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const q = (searchParams.get("q") ?? "").toLowerCase().slice(0, 60);
  let list = CATALOG;
  if (category && CATEGORIES.includes(category as ComponentCategory)) list = list.filter((c) => c.category === category);
  if (q) list = list.filter((c) => `${c.brand} ${c.model}`.toLowerCase().includes(q));
  return NextResponse.json({ data: list, meta: { count: list.length, priceDate: PRICE_DATE, priceNote: "Prix indicatifs relevés à la date indiquée." } });
}
