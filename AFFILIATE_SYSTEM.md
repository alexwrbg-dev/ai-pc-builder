# AFFILIATE_SYSTEM

## Principe absolu

**Aucun lien affilié inventé.** `affiliateUrl()` (`src/lib/pricing.ts`) retourne `null` tant qu'aucun marchand n'est configuré → l'UI affiche le nom + « lien non configuré ». État actuel : **0 marchand actif, 0 lien généré**.

## Configuration (prod)

1. Table `Merchant` : `{ name, baseUrl, network, trackingTpl, active, priority, commission }` (ou `AFFILIATE_MERCHANTS` en env).
2. Seuls `active=true` génèrent des URLs (via redirect interne `/api/go` recommandé pour le tracking de clics + `AnalyticsEvent merchant_click`).
3. Emplacements : ACHETER / VOIR LE MEILLEUR PRIX / COMPAREZ LES OFFRES.

## Transparence

- Page `/affiliate-disclosure` + bandeau global + `disclosure` dans `GET /api/merchants`.
- Placements sponsorisés futurs : **clairement identifiés**, jamais présentés comme recommandations indépendantes ; le tri « meilleur prix » reste indépendant des commissions (priorité = prix, pas commission).
- Monétisation phase 2 (sponsorisé identifié, premium) : architecture prête, produit 100% utilisable sans paiement au lancement.
