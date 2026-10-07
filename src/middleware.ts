// RBAC : /admin exige le rôle ADMIN (JWT). Sans AUTH_SECRET/DB → 401 explicite.
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export default async function middleware(req: Request) {
  const url = new URL(req.url);
  if (url.pathname.startsWith("/admin") || url.pathname.startsWith("/api/admin")) {
    try {
      const session = await auth();
      const role = (session?.user as { role?: string } | undefined)?.role;
      if (role !== "ADMIN") {
        return NextResponse.json({ error: "Admin requis (RBAC)" }, { status: 403 });
      }
    } catch {
      return NextResponse.json({ error: "Auth non configurée — voir .env.example" }, { status: 401 });
    }
  }
  return NextResponse.next();
}

export const config = { matcher: ["/admin/:path*", "/api/admin/:path*"] };
