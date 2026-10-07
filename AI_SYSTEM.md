# Lecture de la demande et recommandation

## `requirements.ts`

Transforme une phrase en besoins : budget (`1500 €`, `1,5k`, `1200 balles`…), usage, définition d'écran, jeux cités, blanc, RGB, silence, compact, WiFi, marques. Règles écrites à la main. Ce qui est compris est renvoyé à l'utilisateur (« Compris : … ») pour qu'il puisse le vérifier.

## `optimizer.ts`

1. Parcourt toutes les paires processeur × carte graphique (et les capacités de mémoire possibles).
2. Complète chaque paire : carte mère, stockage, refroidissement, boîtier, alimentation — la moins chère qui convient.
3. Écarte ce que le moteur de compatibilité refuse.
4. Note chaque configuration (`perf.ts`) et garde la meilleure sous le plafond de prix.

Trois profils : **économe** (85 % du budget), **équilibrée** (plateforme récente, alimentation Gold modulaire, carte mère solide), **performance** (tout dans les images par seconde). Deux profils identiques n'en font qu'un. Si le budget ne suffit pas, seule la configuration la moins chère est proposée, avec un message clair.

## `perf.ts`

Estimation : indice de la carte graphique × référence du jeu, plafonnée par l'indice du processeur. Les indices viennent de moyennes de tests publics. À remplacer par des mesures jeu par jeu quand elles seront disponibles.

## Modèle de langage (facultatif)

`AI_PROVIDER=openai` et `AI_API_KEY` dans `.env` activent une explication rédigée. Le modèle reçoit les faits calculés et ne peut rien modifier.
