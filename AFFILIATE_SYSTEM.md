# Liens d'achat et affiliation

`src/lib/affiliate.ts`

- Chaque pièce a un lien Amazon.fr : fiche directe si le champ `asin` est renseigné, recherche sur la marque et le modèle sinon.
- `NEXT_PUBLIC_AMAZON_TAG` vide : simples liens, aucune commission.
- `NEXT_PUBLIC_AMAZON_TAG="monsite-21"` : l'identifiant est ajouté à chaque lien, et la mention obligatoire « En tant que Partenaire Amazon, je réalise un bénéfice sur les achats remplissant les conditions requises. » s'affiche en pied de page et sur `/affiliate-disclosure`.
- Les liens portent `rel="sponsored nofollow"`.

## Mettre en place l'affiliation

1. Créer un compte sur le Programme Partenaires Amazon (partenaires.amazon.fr) avec l'adresse du site.
2. Copier l'identifiant (il finit par `-21`) dans `.env`.
3. Redémarrer le site.
4. Lire les conditions du programme, en particulier sur l'affichage des prix et les mentions obligatoires.

## Passer aux liens directs

Renseigner `asin` sur une pièce dans `src/data/catalog/` (dix caractères, visibles dans l'adresse de la fiche Amazon après `/dp/`).
