# AI_SYSTEM

`src/lib/ai-orchestrator.ts`. Pipeline imposé : interprétation → besoins structurés → recherche → **moteur déterministe** → optimisation → prix → explication.

## `parseRequirements` (heuristic, offline)

Budget (€), résolution (1080p/1440p/4K), jeux connus, blanc/RGB/silence/évolutif, usage. Vérifié : « PC à 1500 € … 1440p … Cyberpunk … blanc, silencieux » → `{ budget:1500, resolution:1440p, games:[cyberpunk,fortnite], white:true, silent:true }`.

## `recommendBuild(req, value|balanced|max)`

Calibre GPU (budget × résolution : 4060 / 7800 XT / 4070 SUPER / 4090), CPU assorti, **carte mère choisie PAR socket CPU** (jamais l'inverse), RAM par plateforme, PSU par TDP, boîtier pré-dimensionné (GPU+10mm), puis **vérification moteur + auto-réparation documentée** (boîtier XL + 850W si 🔴).

## Providers (`AI_PROVIDER`)

`heuristic` (défaut, aucune clé) · `openai` (explication seule, contexte moteur fourni, jamais de faits inventés) · `anthropic|mistral|ollama` : brancher dans `llmExplain` (même contrat). Sans `AI_API_KEY` → `llm:null`, produit 100% fonctionnel.

## Chat (`/api/ai/chat`)

Actions structurées sur la sélection + re-vérification moteur + re-calcul prix : remplacement GPU, optimisation budget, silence (AIO), questions « pourquoi » (réponse depuis specs). Historique + contexte config courante.

## Optimisation / score / bottleneck

`optimize` : recherche exhaustive dataset × moteur (perf-per-euro, max-fps, min-price…). `scoring.ts` : score /100 + 9 sous-scores expliqués. Bottleneck : heuristique documentée CPU-vs-GPU (prévue pour benchmarks réels jeu par jeu). `performance` : **estimations marquées `estimated:true`, confidence LOW** — jamais présentées comme mesures.
