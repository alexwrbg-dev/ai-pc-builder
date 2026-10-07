# API

| Route | Méthode | Corps | Réponse |
|---|---|---|---|
| `/api/ai/recommend` | POST | `{ "prompt": "PC gamer 1500 €" }` ou `{ "requirements": {…} }` | Besoins compris et jusqu'à trois configurations |
| `/api/compatibility` | POST | `{ "selection": { "CPU": "id", "GPU": "id", … } }` | Verdict du moteur et total |
| `/api/components` | GET | `?category=GPU&q=5070` | Pièces du catalogue |
| `/api/admin/import` | POST | `{ "items": […] }` | Validation d'un lot (rôle ADMIN) |
| `/api/auth/*` | — | — | Auth.js |

Les entrées sont validées avec Zod (`src/lib/validation.ts`).
