# DATA_PIPELINE

## Sources autorisées

APIs officielles et flux marchands/constructeurs uniquement. **Interdit** : scraping agressif, contournement robots.txt/CGU. Chaque source = 1 connecteur (`sources/<nom>.ts` à créer) avec `{ fetch(), normalize(), provenance }`.

## Formats d'entrée

`POST /api/admin/import` : JSON (actif) · CSV/XML (normaliser vers le même schéma avant envoi). `dryRun:true` par défaut → rapport de validation sans écriture. Jobs d'actualisation (prix, stock, benchmarks, images) : cron externe → import ; `DATA_INGEST_ENABLED`/`DATA_INGEST_CRON` en env.

## Provenance

Tout item importé : `source=<connecteur>`, `confidence` (MEDIUM par défaut, HIGH si flux officiel signé, VERIFIED_MANUFACTURER si fiche constructeur). Le seed `DEMO_SEED/LOW` est remplacé progressivement, jamais mélangé sans marquage.

## Seed actuel

`src/lib/demo-data.ts` : 25 composants cohérents (AM5/AM4/LGA1700, DDR4/DDR5, 4 GPU, 3 boîtiers…) + prix démo + table FPS démo. Suffisant pour démo, tests moteur et dev offline. Données réelles : documenter chaque import (licence + date) dans `prisma/seed.ts`.
