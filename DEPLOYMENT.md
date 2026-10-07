# DEPLOYMENT

## Option recommandée (simplicité/coût/perf) : Vercel + Neon/Supabase

1. Postgres managé → `DATABASE_URL`. 2. Projet Vercel → env (`AUTH_SECRET` via `openssl rand -base64 32`, `AI_*`, `EMAIL_*`, `AFFILIATE_*`, `ADMIN_*`). 3. `npm run db:push && npm run db:seed`. 4. `npm run build`.

## Option VPS : Docker

`docker compose up -d` (Postgres 16 + app via `npm run build && npm start` derrière Caddy/Nginx TLS). Redis : profil `cache`.

## Check-list prod

- [ ] `DATABASE_URL`, `AUTH_SECRET`, `AUTH_URL` renseignés
- [ ] `ADMIN_EMAIL`/`ADMIN_PASSWORD` changés, OAuth si besoin
- [ ] `AI_PROVIDER`/`AI_API_KEY` (ou heuristic assumé)
- [ ] Marchands affiliés configurés + disclosure relue
- [ ] Rate limiting CDN/reverse-proxy sur `/api/ai/*` (60 req/min/IP)
- [ ] `npm test && npm run build` verts
