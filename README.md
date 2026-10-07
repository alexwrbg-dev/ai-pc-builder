# AI PC Builder

> « Décris le PC dont tu rêves. L'IA le construit, vérifie chaque composant, l'optimise pour ton budget et te montre où acheter les pièces. »

Configurateur PC + conseiller IA + **moteur de compatibilité déterministe** + comparateur prix/perf + visualiseur 3D + communauté + affiliation + alertes prix.

## ⚠️ Statut : version de démonstration fonctionnelle

- **Données DEMO** (`src/lib/demo-data.ts`, `source=DEMO_SEED`, `confidence=LOW`) : prix, stocks, FPS estimés **non contractuels**. Badge « DÉMO » affiché dans toute l'UI.
- **Aucun lien affilié actif** : aucun marchand configuré → aucun lien généré (voir `/affiliate-disclosure`).
- **IA par défaut 100 % offline** (`AI_PROVIDER=heuristic`) : parsing + recherche + moteur déterministe. Aucune clé requise.
- **Sans `DATABASE_URL`** : l'app tourne en mode démo in-memory (catalogue + builds). Avec Postgres : persistance complète via Prisma.

## Démarrage

```bash
cp .env.example .env
npm install
npm test            # 9 tests moteur compatibilité
npm run dev         # http://localhost:3000
```

Avec Postgres (optionnel) :

```bash
docker compose up -d db
npm run db:push && npm run db:seed
```

## Stack (justifiée dans ARCHITECTURE.md)

Next.js 14 + React + TypeScript · Tailwind · Prisma + PostgreSQL · NextAuth v5 · Three.js/R3F (lazy) · Vitest · Zod.

## Pipeline IA imposé

```
USER → interprétation IA → besoins structurés → recherche composants
→ MOTEUR DÉTERMINISTE (seule vérité compat) → optimisation → prix
→ explication IA → BUILD FINAL
```

Le LLM ne décide **jamais** compatibilité, prix, dimensions, connecteurs.

## Docs

ARCHITECTURE · DATABASE · API · COMPATIBILITY_ENGINE · AI_SYSTEM · AFFILIATE_SYSTEM · DATA_PIPELINE · DEPLOYMENT · SECURITY · CONTRIBUTING.
