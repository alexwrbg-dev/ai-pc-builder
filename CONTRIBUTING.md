# CONTRIBUTING

1. `cp .env.example .env && npm install`
2. Branche par module (`moteur-compat`, `prix`, `3d`…). 1 règle moteur = 1 test adverse dans `tests/`.
3. `npm test && npx tsc --noEmit && npm run build` avant PR.
4. Interdits : données hardware inventées comme réelles, prix/liens inventés, estimations FPS présentées comme mesures, secrets committés, pages SEO pauvres auto-générées.
5. Toute donnée externe : `source` + `confidence` + badge démo si non vérifiée.
