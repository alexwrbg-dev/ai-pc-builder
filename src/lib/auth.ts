// Auth : NextAuth v5 (Auth.js). OAuth activé UNIQUEMENT si env présents.
// Credentials (email/password, bcrypt) via Prisma si DATABASE_URL, sinon erreur explicite.
// AUCUN mot de passe en clair, sessions JWT (AUTH_SECRET obligatoire).
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { z } from "zod";

const hasDb = !!process.env.DATABASE_URL;
const prisma = hasDb ? new PrismaClient() : null;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const providers: any[] = [];
if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) providers.push(GitHub);
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) providers.push(Google);
providers.push(
  Credentials({
    credentials: { email: {}, password: {} },
    authorize: async (creds) => {
      const parsed = z.object({ email: z.string().email(), password: z.string().min(8) }).safeParse(creds);
      if (!parsed.success || !prisma) return null;
      const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });
      if (!user?.passwordHash) return null;
      const ok = await bcrypt.compare(parsed.data.password, user.passwordHash);
      if (!ok) return null;
      return { id: user.id, email: user.email, name: user.username, role: user.role };
    },
  })
);

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: (prisma ? PrismaAdapter(prisma) : undefined) as never,
  session: { strategy: "jwt" },
  trustHost: true,
  providers,
  callbacks: {
    // Le rôle voyage dans le jeton de session : sans cela, le contrôle ADMIN du middleware échoue toujours.
    jwt({ token, user }) {
      if (user) token.role = (user as { role?: string }).role ?? "USER";
      return token;
    },
    session({ session, token }) {
      if (session.user) (session.user as { role?: string }).role = token.role as string | undefined;
      return session;
    },
  },
});
