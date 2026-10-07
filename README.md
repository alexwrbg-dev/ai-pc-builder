# AI PC Builder

Décris le PC que tu veux et ton budget : le site propose des configurations qui s'assemblent vraiment, chiffrées, et montées en 3D à l'échelle.

## Ce qui fonctionne

- **Catalogue** de 198 pièces en vente (octobre 2026), avec dimensions, connecteurs et prix indicatifs datés — `src/data/catalog/`.
- **Moteur de compatibilité** déterministe : socket, mémoire, formats, longueur de carte graphique, hauteur de ventirad, radiateurs, puissance et connecteurs d'alimentation, BIOS — `src/lib/compatibility.ts`.
- **Optimiseur de budget** : essaie toutes les paires processeur × carte graphique, complète, garde la meilleure sous le budget — `src/lib/optimizer.ts`.
- **Vue 3D** à l'échelle, pilotée par les dimensions des pièces : style plan ou rendu réaliste (matières, reflets, ombres, halo des LED), vue éclatée, cotes — `src/components/viewer/`.
- **Accueil** : une configuration d'exemple s'assemble en 3D à l'ouverture — `src/components/HeroShowcase.tsx`.
- **Fiche par pièce** avec vue 3D, et une image pour chacune des 198 pièces — `src/app/composants/[id]/`, `public/parts/`.
- **Liens d'achat** Amazon.fr, avec identifiant d'affiliation facultatif — `src/lib/affiliate.ts`.

## Ce qui n'est pas fait

- Les **prix** sont relevés à la main à une date fixe (`PRICE_DATE`). Pas encore de flux automatique.
- Les **images par seconde** sont des estimations issues d'un modèle simple, pas des mesures.
- La **3D** et les images sont des rendus **génériques** : bonnes dimensions, bonne couleur, bon nombre de ventilateurs, mais pas le dessin exact ni les logos des produits. Pour de vraies photos, renseigner le champ `photo` d'une pièce avec une image que l'on a le droit d'afficher (voir `DATA_PIPELINE.md`).
- Sur 198 fiches, 60 ont été relues sur la documentation du fabricant (`confidence: "VERIFIED"`). Les autres reposent sur des specs publiques (`"KNOWN"`) et restent à relire.
- Pas de comptes utilisateurs actifs, pas de quiz, d'actualités ni de mini-jeux : à venir.

## Démarrer (Windows, PowerShell)

```powershell
cd C:\Users\warem\ai-pc-builder
npm install
npm test
npm run dev
```

Puis ouvrir http://localhost:3000.

## Commandes

| Commande | Rôle |
|---|---|
| `npm run dev` | Lance le site en local |
| `npm test` | 82 tests : moteur, catalogue, optimiseur, mise en place 3D, fiches |
| `npm run typecheck` | Vérifie les types TypeScript |
| `npm run build` | Compile la version de production |
| `npm run vignettes` | Régénère les images des pièces (voir l'en-tête de `scripts/vignettes.mjs`) |

## Affiliation Amazon

Dans `.env`, renseigner `NEXT_PUBLIC_AMAZON_TAG="monsite-21"` une fois le compte Partenaires créé. Tant que la variable est vide, les liens sont de simples liens. Voir `AFFILIATE_SYSTEM.md`.

## Où trouver quoi

| Dossier | Contenu |
|---|---|
| `src/data/catalog/` | Les pièces, une catégorie par fichier |
| `src/lib/` | Moteur, optimiseur, performances, lecture de la demande, mise en place 3D |
| `src/components/` | Interface : studio d'accueil, configurateur, vue 3D |
| `src/app/` | Pages et routes d'API |
| `tests/` | Tests automatiques |
