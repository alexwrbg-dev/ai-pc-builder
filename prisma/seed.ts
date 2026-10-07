// Seed Prisma : dataset DEMO_SEED (confidence LOW) + admin + badges + jeux.
// Ne JAMAIS présenter le seed comme des données marchandes réelles.
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const pwd = await bcrypt.hash(process.env.ADMIN_PASSWORD ?? "ChangeMe123!", 12);
  await prisma.user.upsert({
    where: { email: process.env.ADMIN_EMAIL ?? "admin@example.com" },
    update: {},
    create: { email: process.env.ADMIN_EMAIL ?? "admin@example.com", username: "admin",
      passwordHash: pwd, role: "ADMIN", profile: { create: { bio: "Admin" } } },
  });
  for (const code of ["FIRST_BUILD", "BUDGET_KING", "MASTER_1000", "MONSTER_4K", "COMMUNITY_FAVORITE"]) {
    await prisma.badge.upsert({ where: { code }, update: {}, create: { code, name: code } });
  }
  for (const g of ["Cyberpunk 2077", "Fortnite", "Valorant", "Call of Duty", "Alan Wake 2"]) {
    await prisma.game.upsert({ where: { slug: g.toLowerCase().replace(/[^a-z0-9]+/g, "-") },
      update: {}, create: { name: g, slug: g.toLowerCase().replace(/[^a-z0-9]+/g, "-") } });
  }
  console.log("Seed OK (structure). Import composants réels : voir DATA_PIPELINE.md.");
}

main().finally(() => prisma.$disconnect());
