# Moteur de compatibilité

`src/lib/compatibility.ts` — version 2.0.0. Fonction pure : une configuration → un verdict et des remarques expliquées.

## Verdicts

- `compatible` : complète, aucune réserve.
- `warning` : complète, avec des réserves.
- `incompatible` : au moins un blocage.
- `incomplete` : il manque une pièce indispensable (liste dans `missing`).

Chaque remarque porte une gravité (`error`, `warning`, `info`), un code, les emplacements concernés, un message et une correction proposée.

## Règles

| Code | Gravité | Vérifie |
|---|---|---|
| `UNKNOWN_COMPONENT` | error | Référence absente du catalogue ou rangée au mauvais emplacement |
| `SOCKET_MISMATCH` | error | Socket du processeur et de la carte mère |
| `BIOS_UPDATE` | warning / info | Processeur plus récent que le chipset (warning s'il a moins d'un an) |
| `RAM_TYPE_MISMATCH`, `CPU_RAM_TYPE` | error | DDR4 / DDR5 côté carte mère et processeur |
| `RAM_SLOTS`, `RAM_CAPACITY` | error | Nombre de barrettes et capacité maximale |
| `RAM_PROFILE` | info | Profil EXPO / XMP à activer |
| `FORM_FACTOR` | error | Format de carte mère accepté par le boîtier |
| `NO_DISPLAY` | warning + pièce manquante | Ni carte graphique, ni puce graphique intégrée |
| `GPU_LENGTH`, `GPU_LENGTH_TIGHT` | error / warning | Longueur de la carte contre la place du boîtier (alerte sous 20 mm) |
| `PSU_WATTAGE`, `PSU_HEADROOM` | error / warning | Puissance contre la pointe estimée (processeur + carte graphique + 60 W) |
| `PSU_CONNECTOR`, `PSU_ADAPTER` | error / warning | Nombre de connecteurs 8 broches, connecteur 16 broches ou adaptateur |
| `PSU_LENGTH` | error | Longueur de l'alimentation |
| `NO_COOLER`, `STOCK_COOLER` | warning + manquant / info | Processeur vendu sans ou avec ventirad |
| `COOLER_SOCKET`, `COOLER_TDP` | error / warning | Fixation et capacité de refroidissement |
| `COOLER_HEIGHT`, `RADIATOR_SUPPORT` | error | Hauteur du ventirad, taille du radiateur |
| `M2_SLOTS` | error | Emplacement M.2 pour un SSD NVMe |

## Pas encore couvert

Hauteur de la mémoire sous un gros ventirad, épaisseur de la carte graphique, boîtiers et alimentations Mini-ITX / SFX, version PCIe.

## Ajouter une règle

Une condition dans `checkBuild`, un test dans `tests/compatibility.test.ts` qui la déclenche avec des pièces de test.
