# Architecture

Un seul projet Next.js 14 (App Router) en TypeScript strict : pages, API et logique au même endroit.

## Chaîne de traitement

```
demande écrite → requirements.ts → optimizer.ts → compatibility.ts → perf.ts → interface
                 (besoins)         (candidats)    (verdict)          (estimation)
```

Aucune IA générative dans cette chaîne. Un modèle de langage peut, en option, rédiger une explication à partir des faits déjà calculés (`ai-orchestrator.ts`, variable `AI_PROVIDER`).

## Modules (`src/lib`)

| Fichier | Rôle |
|---|---|
| `types.ts` | Types des pièces et des résultats |
| `catalog.ts` | Accès au catalogue, liens de partage |
| `compatibility.ts` | Moteur de règles, fonction pure |
| `requirements.ts` | Lecture d'une demande en français |
| `optimizer.ts` | Recherche de la meilleure configuration sous un budget |
| `perf.ts` | Estimation des images par seconde |
| `layout3d.ts` | Position de chaque pièce dans le boîtier, en millimètres |
| `pricing.ts`, `affiliate.ts` | Totaux et liens d'achat |

Le moteur, l'optimiseur et la mise en place 3D sont des fonctions pures, testées sans navigateur.

## Vue 3D

Three.js via React Three Fiber, chargée à la demande (`next/dynamic`, sans rendu serveur). `layout3d.ts` calcule, `components/viewer/` dessine. Le plateau de carte mère est placé d'après la hauteur de ventirad annoncée par le fabricant du boîtier : ce qui dépasse dans le dessin dépasse en vrai.

| Fichier | Rôle |
|---|---|
| `Scene.tsx` | Configuration entière : caméra, éclairage de studio, ombres, halo, cotes |
| `PartScene.tsx` | Une pièce seule (fiche produit, vignettes) |
| `partsPlan.tsx` | Modèles simples du style « plan » |
| `partsReal.tsx` | Modèles détaillés du style « rendu » |
| `real.tsx` | Matières, textures calculées, ventilateur, ailettes, câbles |

Deux niveaux de qualité : « haut » (ombres, occlusion ambiante, halo) et « bas » pour les petits écrans et les machines modestes. `?rendu=haut` ou `?rendu=bas` dans l'adresse force le choix.

Aucune image ni modèle externe : textures et formes sont calculées dans le navigateur. Les modèles sont génériques, ils ne copient pas le dessin des produits ; ils lisent l'apparence relevée de chaque pièce dans `src/data/looks.ts` (via `src/lib/looks.ts`, qui déduit une apparence de la finition quand une fiche manque).

## Données

Le catalogue est embarqué dans le code (`src/data/catalog`). `catalog.ts` est le seul point d'accès : le jour où les pièces viennent d'une base ou d'un flux, lui seul change.

Prisma et PostgreSQL ne servent aujourd'hui qu'à l'authentification (rôle administrateur).

## Limites connues

- Pas de limitation de débit sur `/api/ai/recommend` : à poser avant une mise en ligne.
- Next 14.2.35 : garder la branche 14.2 à jour (correctifs de sécurité du middleware).

## Modèles 3D officiels

`scripts/modeles.mjs` (lancé avant `dev` et `build`) recense `public/models/*.glb` dans `src/data/models.ts`. `src/components/viewer/official.tsx` charge le fichier, l'oriente (réglage de `public/models/reglages.json`, sinon `src/lib/fit.ts` qui associe ses axes à ceux de l'emplacement d'après les proportions), le met à l'échelle de la boîte de la pièce (`boxesOf` dans `Scene.tsx`) et retombe sur le rendu générique s'il manque ou est illisible.

## Décor

`src/components/Backdrop.tsx` : lueurs, quadrillage et pistes de circuit animés en CSS/SVG, fixés derrière toutes les pages ; coupés si l'utilisateur demande moins d'animations.
