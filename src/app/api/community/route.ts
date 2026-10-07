import { NextResponse } from "next/server";

// GET /api/community — MVP en mémoire. Prod : Prisma (Build publics + likes).
export async function GET() {
  return NextResponse.json({
    builds: [
      { slug: "tour-blanche-silencieuse-1440p-demo", title: "Tour blanche silencieuse 1440p (démo)", likes: 42, budget: 1500, demo: true },
      { slug: "petit-budget-esport-demo", title: "Petit budget esport 1080p (démo)", likes: 27, budget: 800, demo: true },
    ],
    meta: { demo: true },
  });
}
