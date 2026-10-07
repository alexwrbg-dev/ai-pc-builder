# ARCHITECTURE

## Choix stack (arbitrage fiabilité / simplicité / coût / perf / sécu / maintenabilité)

| Besoin | Choix | Pourquoi (vs alternatives) |
|---|---|---|
| Frontend+Backend+SEO | **Next.js 14 App Router (monolithe modulaire)** | SSR/SSG natif (SEO prioritaire), API Routes colocalisées, 1 déploiement, 0 sync front/back. Rejeté : SPA + API séparée (2 déploiements, SEO plus faible). |
| Langage | **TypeScript strict** | Typage specs/moteur = garde-fous. Zod en validation runtime aux frontières. |
| Style | **Tailwind** | Design system utilitaire, petit bundle (purge), responsive simple. |
| DB prod | **PostgreSQL + Prisma** | Relationnel normalisé (composants, builds, prix, users), indexes, migrations. Rejeté : Mongo (relations prix/historique moins propres). |
| Sans DB | **Dataset DEMO in-memory** (`demo-data.ts`) | L'app fonctionne sans infra (démo, tests, CI). Même interfaces TypeScript → bascule Postgres sans changer l'UI. |
| Auth | **NextAuth v5 (Auth.js), JWT** | Credentials bcrypt + OAuth conditionnels, RBAC `role` (USER/MODERATOR/ADMIN). Secrets en env uniquement. |
| 3D | **Three.js + React Three Fiber, lazy + Suspense** | `next/dynamic` implicite via `React.lazy` : le chunk 3D (~500Ko) ne charge que sur `/builder`. Modèles **génériques étiquetés** (`Viewer3D.tsx`), jamais présentés comme officiels. |
| Cache | **Redis optionnel** (`REDIS_URL`, profil `cache` docker-compose) | Prix/sessions. Non requis en MVP. |
| Tests | **Vitest** | Moteur déterministe testé sans DOM (9 cas adverses). |

## Modules (`src/lib`)

`types` → `demo-data` → `compatibility` (vérité) → `scoring`/`pricing` → `ai-orchestrator` (lit les précédents, ne les contourne pas) → `validation` (zod) → `auth`/`moderation`/`notifications`/`analytics`/`seo`.

## Scalabilité (centaines → dizaines de milliers de composants)

- Specs JSON validées + colonnes requêtables (catégorie, marque) + indexes (`schema.prisma`).
- Listes : pagination API (`?category&?q`), virtualisation prévue côté client.
- Prix : table `Price` + `PriceHistory` (timeseries), jobs d'ingestion découplés (`DATA_PIPELINE.md`).
- 3D : registre de modèles par `slug` → passage à l'échelle sans toucher au viewer (voir `AI_SYSTEM.md` §3D).
- Extensibilité : `ComponentCategory` inclut déjà OS/écrans/périphériques ; laptops/NAS/serveurs = nouvelles catégories + règles moteur (voir §40 du cahier des charges : non développés, architecture prête).

## Performance

- First Load JS partagé : **87 Ko** (build vérifié). 3D hors bundle initial.
- SEO : pages statiques (`/pc/[slug]` pré-rendues), `sitemap.ts`/`robots.ts`, JSON-LD, metadata/OG par page.
- Headers sécu dans `next.config.mjs`. Rate limiting : à poser au reverse-proxy/middleware prod (noté dans `SECURITY.md` + `validation.ts`).
