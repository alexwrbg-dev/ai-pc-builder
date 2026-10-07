# SECURITY

- **Secrets** : env uniquement (`.env.example` committé, `.env` ignoré). Aucune clé dans le code (vérifié).
- **Mots de passe** : bcrypt (12 rounds), jamais en clair. Sessions JWT via Auth.js (`AUTH_SECRET`).
- **RBAC** : `User.role` (USER/MODERATOR/ADMIN) ; `/admin` + `/api/admin/*` protégés par `src/middleware.ts` (403 sans ADMIN).
- **Injection** : Prisma (paramétré) + Zod à toutes les frontières API ; `dangerouslySetInnerHTML` limité au JSON-LD généré serveur.
- **XSS/CSRF** : React (échappement), headers (`nosniff`, `DENY`, `Referrer-Policy`, `Permissions-Policy`) dans `next.config.mjs` ; mutations CSRF via same-origin + tokens Auth.js.
- **Abus** : validation tailles (prompt ≤2000), modération déterministe (`moderation.ts`) + signalements (`Report`), rate limiting à poser au edge (noté).
- **Logs/audit** : `console` serveur + `AnalyticsEvent` (sans PII) ; actions admin à journaliser en prod.
