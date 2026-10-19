# Liens d'achat, prix Amazon et affiliation

## Liens directs vers la fiche produit

`src/data/amazon.ts` donne, pour 188 pièces sur 198, le code de leur fiche Amazon.fr (ASIN, les 10 caractères après `/dp/` dans l'adresse). Le bouton « Voir sur Amazon » ouvre directement cette fiche. Les 10 pièces sans fiche sûre (`AMAZON_MISSING`) gardent un lien « Chercher sur Amazon ».

Les codes ont été relevés le 19/10/2026 dans les résultats de recherche limités à amazon.fr ; le titre de la fiche retenue est en commentaire à côté de chaque code. Un code peut être faux (mauvaise variante, couleur) : vérifier en cliquant, et corriger en recopiant le code de la bonne fiche. `npm test` vérifie le format et l'absence de doublons.

## Tag d'affiliation

- `NEXT_PUBLIC_AMAZON_TAG` vide : simples liens, aucune commission.
- `NEXT_PUBLIC_AMAZON_TAG="monsite-21"` : ajouté à chaque lien (`https://www.amazon.fr/dp/ASIN?tag=monsite-21`), et la mention obligatoire « En tant que Partenaire Amazon, je réalise un bénéfice sur les achats remplissant les conditions requises. » s'affiche en pied de page et sur `/affiliate-disclosure`.
- Cette variable est lue **au moment du build** : relancer `npm run build` (ou `npm run dev`) après l'avoir changée.
- Les liens portent `rel="sponsored nofollow"`.

## Prix en direct et photos officielles : l'API Creators

PA-API 5 a été arrêtée en 2026 ; Amazon la remplace par l'**API Creators**. Elle donne, pour chaque fiche : le prix affiché, la disponibilité, la photo officielle et le lien affilié. C'est le seul moyen autorisé d'afficher un prix ou une photo Amazon sur le site.

**Conditions d'accès** : compte Partenaires validé et au moins **10 ventes qualifiées sur les 30 derniers jours**. Au départ : 1 requête par seconde, 8 640 par jour.

**Brancher** :
1. Partenaires Central > Creators API : s'inscrire, puis créer des identifiants (région Europe, version 3.2 pour amazon.fr).
2. Dans `.env` : `AMAZON_CREATORS_CLIENT_ID`, `AMAZON_CREATORS_CLIENT_SECRET` et `AMAZON_PARTNER_TAG` (ou `NEXT_PUBLIC_AMAZON_TAG`).
3. Redémarrer le site. Rien d'autre à changer.

**Ce qui se passe alors** :
- `src/lib/amazon-api.ts` (côté serveur) obtient un jeton, demande les fiches par lots de 10, les garde 1 h pour les prix et 24 h pour photos et liens, et espace les requêtes d'au moins 1,1 s.
- `/api/amazon?ids=…` sert ces données aux pages ; `src/lib/amazon-client.ts` regroupe les demandes de la page en un seul appel.
- Les prix affichés deviennent les prix Amazon (en bleu), avec l'heure du relevé et la mention « Prix et disponibilité exacts à la date et à l'heure indiquées… ». Les totaux des configurations suivent.
- La photo officielle remplace le rendu 3D dans les listes et sur les fiches (un bouton garde la vue 3D).
- Si l'API ne répond pas ou si une fiche n'est pas accessible, la pièce garde son prix indicatif et son rendu 3D.

**Ce qui ne change pas** : l'optimiseur de budget calcule toujours avec les prix indicatifs du catalogue, pour donner des résultats stables. Le total affiché, lui, suit les prix Amazon.
