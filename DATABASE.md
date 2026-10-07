# DATABASE

Schéma : `prisma/schema.prisma` (PostgreSQL). Sans DB : `src/lib/demo-data.ts` (mêmes types).

## Tables

- **Catalogue** : `Component` (category, brand, model, slug unique, specs JSON validé, source, confidence, updatedAt) · `Merchant` · `Price` + `PriceHistory` · `Game` · `Benchmark` (source + confidence + context).
- **Builds** : `Build` (slug SEO, isPublic, views) · `BuildItem` · `BuildVersion` (historique/restauration).
- **Communauté** : `User`/`Profile`/`Account`/`Session` · `Like` · `Comment` · `Follow` · `Badge`/`UserBadge` · `Report`.
- **Commerce** : `PriceAlert` · `Notification`.
- **Ops** : `AnalyticsEvent` (aucun PII).

## Provenance (fiabilité des données)

Chaque fait important porte `source` + `updatedAt` + `confidence` (LOW/MEDIUM/HIGH/VERIFIED_MANUFACTURER). Seed actuel : `DEMO_SEED/LOW` partout → UI badge DÉMO. Import réel : `POST /api/admin/import` (`source=ADMIN_IMPORT/MEDIUM`, dry-run par défaut).

## Indexes

`Component(category)`, `(brand)`, `Price(componentId, fetchedAt)`, `Benchmark(componentId)`, `Build(isPublic, createdAt)`, `Notification(userId, read, createdAt)`.

## Commandes

```bash
docker compose up -d db
npm run db:push && npm run db:seed   # crée ADMIN_* + badges + jeux
```
