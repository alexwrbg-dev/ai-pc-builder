# COMPATIBILITY_ENGINE

`src/lib/compatibility.ts` — **v1.0.0, seule source de vérité compatibilité. Le LLM ne la contourne jamais.**

## Statuts

🟢 `compatible` · 🟡 `warning` (compatible avec réserve) · 🔴 `incompatible`.

## Règles (9 familles)

1. `SOCKET_MISMATCH` (error) — CPU.socket ≠ MB.socket
2. `RAM_TYPE_MISMATCH` / `CPU_RAM_TYPE` (error) — DDR carte mère + contrôleur CPU
3. `RAM_SPEED_OC` (warning) / `RAM_CAPACITY` / `RAM_SLOTS` (errors)
4. `FORM_FACTOR` (error) — ATX/Micro-ATX/Mini-ITX/E-ATX vs boîtier
5. `GPU_LENGTH` (error, message exact « mesure X mm alors que le boîtier accepte maximum Y mm ») / `GPU_LENGTH_TIGHT` (<15mm marge, warning) / `GPU_THICK`
6. `PSU_WATTAGE` (error vs `recommendedPsuW`) / `PSU_HEADROOM` (<25% marge, warning) / `PSU_CONNECTOR` (error) / `PSU_ADAPTER` (warning 16pin via adaptateur)
7. `COOLER_SOCKET` (error) / `COOLER_TDP` (warning) / `COOLER_HEIGHT` (error) / `RADIATOR_SUPPORT` (error)
8. `M2_SLOTS` (error)
9. `PCIE_GEN` (warning si écart >1 génération)

Chaque issue : `{ severity, code, components[], message (FR humain), fix (FR solution) }`.

## Tests

`tests/compatibility.test.ts` — **9/9 ✅** : config saine, mauvais socket, DDR incompatible, GPU trop long (340 vs 330mm), PSU insuffisant, format incompatible, connecteur manquant, XMP, cooler/boîtier.

## Évolutions prévues

BIOS-vs-CPU (table `minBiosVersion`), contrôle longueurs AIO vs GPU, nombre de ventilateurs, connecteurs USB-C façade. Ajouter une règle = 1 `if` + 1 test (convention : 1 code = 1 test adverse).
