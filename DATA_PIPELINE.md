# Données du catalogue

## État actuel

`src/data/catalog/` : une catégorie par fichier, un tableau de lignes par fichier. Relevé du 7 octobre 2026 (`PRICE_DATE` dans `index.ts`).

- **Prix** : plus bas constatés sur des comparateurs et revendeurs français. Indicatifs.
- **Caractéristiques** : `confidence: "VERIFIED"` quand dimensions et connecteurs ont été relus sur la fiche du fabricant ou d'un revendeur ; `"KNOWN"` sinon.
- Quand un nombre de connecteurs n'a pas été relu, il est compté au plus bas : une alerte en trop vaut mieux qu'une compatibilité annoncée à tort.

## Ajouter une pièce

Ajouter une ligne dans le fichier de la catégorie, puis lancer `npm test` : les tests d'intégrité vérifient les identifiants, les prix et qu'aucune pièce n'est orpheline.

## Images des pièces

Chaque pièce a une image tirée du rendu 3D du site, rangée dans une planche par catégorie (`public/parts/`). Après avoir ajouté ou modifié des pièces, `npm run vignettes` les régénère (voir l'en-tête de `scripts/vignettes.mjs`).

Pour afficher une **photo officielle** à la place, renseigner le champ `photo` de la pièce avec l'adresse de l'image. N'y mettre que des images que l'on a le droit d'afficher : celles fournies par l'API d'un programme d'affiliation, ou un kit presse dont la licence le permet. Les photos copiées sur le site d'une marque ou d'un marchand ne sont pas libres de droits.

## Passer à des prix automatiques

Le relevé manuel ne tient pas dans le temps. La suite prévue : un flux produits d'un programme d'affiliation, importé par une tâche planifiée. `src/lib/catalog.ts` est le seul point d'accès aux données : c'est lui qu'il faudra brancher.

Les conditions du Programme Partenaires Amazon encadrent l'affichage de leurs prix : n'afficher un prix Amazon que s'il vient de leur API officielle.
