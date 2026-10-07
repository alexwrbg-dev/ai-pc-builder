# API

Validation Zod partout (`src/lib/validation.ts`). Erreurs : `{ error }` + status adapté. Métadonnées `demo:true` quand données démo.

## Catalogue & compatibilité

- `GET /api/components?category=GPU&q=4070` → `{ data, meta: { demo: true } }`
- `POST /api/compatibility` `{ selection }` → `{ status, issues[], engineVersion }`
- `GET /api/prices?component=gpu-rtx4070s` → `{ offers, bestPrice, history: [], meta.demo }`
- `GET /api/benchmarks?gpu=...` → `{ benchmarks, estimated: true }` (**estimations, jamais mesures**)
- `GET /api/merchants` → marchands `active:false` tant que non configurés + disclosure
- `GET|POST /api/builds` · `GET /api/community`

## IA (orchestration, jamais source de vérité)

- `POST /api/ai/recommend` `{ prompt, variant: value|balanced|max|all }` → besoins + 1-3 builds (sélection + compat moteur + prix + score + explications) + `llm` optionnel (null sans clé)
- `POST /api/ai/chat` `{ message, selection, history? }` → `{ reply, actions[], selection, compat, price }` (actions structurées : remplacement GPU, éco, silence…)
- `POST /api/ai/explain` `{ selection }` → justification factuelle depuis specs + moteur
- `POST /api/ai/optimize` `{ selection, goal }` → recherche exhaustive + moteur (perf-per-euro|max-fps|min-price)
- `POST /api/ai/compare` `{ a, b }` → `{ A, B, winner, verdict }`

## Auth / admin

- `GET|POST /api/auth/[...nextauth]` (NextAuth v5 ; OAuth seulement si env)
- `POST /api/admin/import` `{ format, dryRun, items[] }` → validation ; écriture DB seulement si `dryRun:false` + `DATABASE_URL` (protégé RBAC ADMIN via `src/middleware.ts`)
