# Modèles 3D officiels des pièces

Le site sait afficher, pour chaque pièce, un **modèle 3D officiel** à la place de son rendu générique : c'est ce qui permet de reconnaître le modèle exact d'un coup d'œil. Il ne fournit pas ces modèles lui-même : il faut les obtenir auprès des marques, avec leur **accord écrit** pour un affichage sur un site commercial (voir plus bas : aucune marque ne les publie librement).

## Ajouter un modèle

1. Convertir le fichier reçu en **GLB** (une seule pièce par fichier) :
   - depuis un STEP ou un OBJ/FBX : Blender (Fichier > Importer, puis Fichier > Exporter > glTF 2.0, format « glTF Binary (.glb) ») ou FreeCAD / CAD Exchanger pour les STEP ;
   - alléger si le fichier dépasse quelques Mo : dans Blender, modificateur « Decimate », et à l'export cocher la compression Draco.
2. Le nommer avec l'identifiant de la pièce (fin de l'adresse de sa fiche) et le déposer dans `public/models/` :
   `public/models/gpu-msi-5070ti-gaming-trio.glb`.
   Watercooling : `<id>.glb` pour le bloc pompe, `<id>-radiateur.glb` pour le radiateur avec ses ventilateurs.
3. Relancer `npm run dev` (le recensement `scripts/modeles.mjs` tourne tout seul avant `dev` et `build`).
4. Vérifier sur `http://localhost:3000/atelier/modeles` puis sur la fiche de la pièce et dans une configuration.

**Échelle et orientation** : le site met le modèle à l'échelle exacte de la pièce (dimensions du catalogue) et devine son orientation d'après ses proportions. S'il est tourné dans le mauvais sens (ventilateurs côté carte mère, par exemple), ajouter une rotation en degrés dans `public/models/reglages.json` :

```json
{ "gpu-msi-5070ti-gaming-trio": { "rotation": [0, 180, 0] } }
```

Repère de la scène : x = profondeur du boîtier (vers l'avant), y = hauteur, z = largeur (vers la vitre).

**Vignettes** : après avoir ajouté des modèles, `npm run vignettes` refait les images du catalogue (il faut une fois `npx playwright install chromium`).

Un fichier illisible ne casse rien : la pièce garde son rendu générique et un message apparaît dans la console du navigateur.

---

*Recherche web du 19/10/2026 (environ 42 recherches et 15 pages officielles consultées).*

**Légende**
- ✅ **CONFIRMÉ** : j'ai vu la page ou le téléchargement officiel moi-même (lien fourni).
- ⚠️ **PARTIEL** : il existe quelque chose d'officiel, mais pas un modèle complet du produit, ou les conditions ne sont pas écrites.
- ❌ **NON TROUVÉ** : aucune source officielle trouvée dans le temps de recherche. Cela ne prouve pas que rien n'existe (un portail partenaire peut demander une connexion, par exemple).

> **Conclusion générale.** Aucune des 19 marques ne publie, à ma connaissance, une bibliothèque de modèles 3D (GLB/STEP) de ses produits **avec une licence qui autorise explicitement l'affichage sur un site commercial**. Les seuls fichiers officiels trouvés sont :
> - Cooler Master : les boîtiers complets en STEP sur Printables ;
> - Fractal Design, ASUS et Thermaltake : des accessoires imprimables ;
> - Noctua (hors liste) : les ventilateurs, prévus pour le rendu et l'intégration.
>
> Pour un usage commercial, il faut une **autorisation écrite** de la marque.

---

## 1. Tableau par marque

### MSI
| Marque | Ce qui existe | Format | Conditions | Lien |
|---|---|---|---|---|
| MSI | ❌ NON TROUVÉ : aucun modèle 3D/CAD officiel téléchargeable. Les seuls résultats sont des modèles d'artistes tiers (RenderHub, 3dcadbrowser). | n/a | Les modèles tiers sont faits par des artistes sans licence de la marque : à éviter en commercial | (tiers, non officiel) https://www.renderhub.com/dronwin/msi-z790-tomahawk |

### ASUS
| Marque | Ce qui existe | Format | Conditions | Lien |
|---|---|---|---|---|
| ASUS | ⚠️ PARTIEL, CONFIRMÉ : le « ASUS 3D Printing Project » (2016) fournit des pièces imprimables (logos ROG, cache I/O, cache-câbles, M.2 fan holder) pour quelques cartes mères ROG/TUF. **Pas de modèle complet de carte.** | STEP (.stp), archives .7z/.zip | Présentés seulement comme « free source files », sans licence écrite. Usage commercial non couvert. Projet ancien, liens peut-être morts | https://rog-forum.asus.com/t5/3d-printing/make-it-your-own-the-asus-3d-printing-project/m-p/652475 |

### Gigabyte
| Marque | Ce qui existe | Format | Conditions | Lien |
|---|---|---|---|---|
| Gigabyte | ❌ NON TROUVÉ | n/a | n/a | n/a |

### Sapphire
| Marque | Ce qui existe | Format | Conditions | Lien |
|---|---|---|---|---|
| Sapphire | ❌ NON TROUVÉ | n/a | n/a | n/a |

### Intel (Arc)
| Marque | Ce qui existe | Format | Conditions | Lien |
|---|---|---|---|---|
| Intel (Arc) | ❌ NON TROUVÉ pour les cartes Arc. Sur le forum Intel, des demandes de modèles 3D (cartes réseau) sont traitées au cas par cas. | n/a | n/a | https://community.intel.com/t5/Ethernet-Products/E810-XXVDA2-3D-model/m-p/1609586 |

### NVIDIA (Founders Edition)
| Marque | Ce qui existe | Format | Conditions | Lien |
|---|---|---|---|---|
| NVIDIA (Founders Edition) | ❌ NON TROUVÉ : aucun modèle 3D téléchargeable. ✅ CONFIRMÉ : les règles de marque de NVIDIA sont strictes. | n/a | Le texte dit : « Prior to using NVIDIA logos or any branded element, you must receive **written approval** ». Il interdit aussi de réutiliser des visuels de sites tiers portant la marque NVIDIA, et toute affiliation implicite. | https://nvidia.com/en-us/about-nvidia/legal-info/logo-brand-usage |

### AMD
| Marque | Ce qui existe | Format | Conditions | Lien |
|---|---|---|---|---|
| AMD | ❌ NON TROUVÉ : seulement des modèles tiers de RX 7900/9070 sur RenderHub et Superhive. | n/a | n/a | (tiers) https://www.renderhub.com/projectx3d/amd-radeon-rx-7900-xtx |

### Corsair
| Marque | Ce qui existe | Format | Conditions | Lien |
|---|---|---|---|---|
| Corsair | ❌ NON TROUVÉ : la page Downloads ne propose que des logiciels (iCUE, firmware, drivers), aucun fichier CAD. Il existe un newsroom (corsair.com/newsroom). | n/a | n/a | https://www.corsair.com/de/en/s/downloads |

### NZXT
| Marque | Ce qui existe | Format | Conditions | Lien |
|---|---|---|---|---|
| NZXT | ❌ NON TROUVÉ : aucun compte officiel Sketchfab ou Printables trouvé. Les fichiers « NZXT » sur MakerWorld, Printables et CGTrader sont des accessoires faits par des fans. | n/a | n/a | n/a |

### Fractal Design
| Marque | Ce qui existe | Format | Conditions | Lien |
|---|---|---|---|---|
| Fractal Design | ⚠️ PARTIEL, CONFIRMÉ : fichiers d'impression officiels du concept « North Pi » (boîtier Raspberry Pi façon North, Computex 2024). **Pas de modèle des vrais boîtiers.** | ZIP de fichiers STL + PDF d'instructions | Aucune licence écrite sur la page (seulement « Copyright 2026 Fractal Design »). Le compte Printables « @Fractal_design » **n'est pas officiel** : c'est un étudiant. | https://www.fractal-design.com/north-pi-3d-files/ |

### be quiet!
| Marque | Ce qui existe | Format | Conditions | Lien |
|---|---|---|---|---|
| be quiet! | ⚠️ CONFIRMÉ : un portail de téléchargement avec « Product material », « Brand material », wallpapers, et une **API pour les revendeurs** qui récupère automatiquement les visuels produits. **Aucun fichier 3D/CAD mentionné.** | Images (2D) | Conditions des visuels non vérifiées. Contact général : info@bequiet.com | https://www.bequiet.com/en/download |

### Cooler Master
| Marque | Ce qui existe | Format | Conditions | Lien |
|---|---|---|---|---|
| Cooler Master | ✅ **CONFIRMÉ, meilleure source trouvée.** Le compte officiel Printables @CoolerMaster publie des **modèles STEP complets** : boîtiers Qube 500, Qube 540 et MasterFrame 600, pompes AIO Atmos II et Elite Liquid, plus de nombreux accessoires. | STEP/STP + STL (+ PDF guide) | **Pas de licence explicite** sur la page Qube 540 : seulement les CGU Printables et une phrase marketing (« giving makers the tools (and permission) to experiment, remix… »). Ce public est celui des makers : l'affichage commercial sur un site **n'est pas couvert explicitement**, il faut demander confirmation écrite. Le STEP se convertit en GLB (via FreeCAD/Blender ou CAD Exchanger). | https://www.printables.com/@CoolerMaster/models · https://www.printables.com/model/1465171-qube-540-full-pc-case-step-model-3d-printing-base |

### Kingston (Fury)
| Marque | Ce qui existe | Format | Conditions | Lien |
|---|---|---|---|---|
| Kingston (Fury) | ❌ NON TROUVÉ | n/a | n/a | n/a |

### G.Skill
| Marque | Ce qui existe | Format | Conditions | Lien |
|---|---|---|---|---|
| G.Skill | ❌ NON TROUVÉ (pas de recherche dédiée faute de budget ; aucune mention dans les recherches générales) | n/a | n/a | n/a |

### Crucial
| Marque | Ce qui existe | Format | Conditions | Lien |
|---|---|---|---|---|
| Crucial | ❌ NON TROUVÉ (même remarque que G.Skill) | n/a | n/a | n/a |

### Samsung
| Marque | Ce qui existe | Format | Conditions | Lien |
|---|---|---|---|---|
| Samsung | ❌ NON TROUVÉ : seules les datasheets PDF (avec dimensions mécaniques) sont officielles. Elles peuvent servir à modéliser soi-même une forme générique. | PDF | n/a | https://download.semiconductor.samsung.com/resources/data-sheet/Samsung_NVMe_SSD_990_PRO_Datasheet_Rev.1.0_10129514072296.pdf |

### Western Digital
| Marque | Ce qui existe | Format | Conditions | Lien |
|---|---|---|---|---|
| Western Digital | ❌ NON TROUVÉ | n/a | n/a | n/a |

### Seasonic
| Marque | Ce qui existe | Format | Conditions | Lien |
|---|---|---|---|---|
| Seasonic | ❌ NON TROUVÉ | n/a | n/a | n/a |

### Lian Li
| Marque | Ce qui existe | Format | Conditions | Lien |
|---|---|---|---|---|
| Lian Li | ❌ NON TROUVÉ : seulement des modèles d'artistes tiers (RenderHub) et des accessoires de fans. | n/a | n/a | n/a |

### Bonus, hors liste (utiles)
| Marque | Ce qui existe | Format | Conditions | Lien |
|---|---|---|---|---|
| **Noctua** | ✅ CONFIRMÉ : modèles CAD officiels de nombreux ventilateurs (avril 2026). La page dit qu'ils conviennent pour « creating renderings, animations, and other visual outputs ». | Format non précisé sur la page consultée (à vérifier dans la section téléchargements) | « solely for reference, visualisation, and integration purposes ». Interdits : fabrication, reproduction, commercialisation des produits représentés, impression 3D. Fournis « as is ». L'affichage sur un site web n'est **ni autorisé ni interdit explicitement** : à demander. | https://www.noctua.at/en/3d-cad-models |
| **Thermaltake** | ⚠️ CONFIRMÉ : portail « Tt 3D Makers » avec des fichiers d'impression pour la série Core P (supports, grilles, quelques panneaux). Pas de boîtier complet. | Fichiers d'impression 3D | « All Rights Reserved », sans licence d'usage détaillée | https://3dmakers.thermaltake.com/Download.aspx |

---

## 2. Marketplaces et communautés : précautions de licence

| Plateforme | Constat (CONFIRMÉ) | Conséquence pour le site |
|---|---|---|
| **Sketchfab** | **Le Sketchfab Store a fermé** : « Models can no longer be bought or sold on Sketchfab ». Il reste des modèles gratuits téléchargeables, souvent sous Creative Commons. Les règles de l'ancien store disaient : licence **Standard** = usage commercial, mais « cannot include anything with identifiable branding, logos or designs » ; licence **Editorial** = modèles d'objets réels de marque, « non-commercial projects such as news items or documentaries ». Le staff pouvait forcer un modèle en Editorial s'il contenait la propriété intellectuelle d'un tiers. | Un modèle CC d'une « RTX 4090 » ou d'un « O11 Dynamic » publié par un particulier **ne transfère pas les droits sur le design ni sur la marque**. La licence CC ne couvre que le travail de l'artiste. **Aucun compte Sketchfab officiel** n'a été trouvé pour Fractal, NZXT, Corsair, MSI, Lian Li ou Cooler Master. |
| **Fab (Epic)** | Il a repris l'activité du store Sketchfab (fin 2024). Je n'ai pas vérifié ses règles précises sur les marques. | À vérifier avant tout achat. |
| **GrabCAD** | Usage privé : OK. Usage public non commercial : OK, avec crédit et lien vers l'auteur. **Usage commercial interdit par défaut** : il faut la permission explicite de l'auteur et créditer GrabCAD et l'auteur. Usage commercial « strongly discouraged » si le modèle contient le nom, le logo ou une autre propriété intellectuelle d'une entreprise. Sans réponse de l'auteur, « you cannot use it for commercial purposes ». | À exclure pour un site commercial, sauf accord écrit de l'auteur **et** de la marque. |
| **CGTrader** | Licence Royalty Free = usage commercial. Licence **Editorial** = « can only be used for non-commercial purposes » (éducation, projets personnels non monétisés, journalisme d'intérêt public). | Un configurateur commercial **ne peut pas** utiliser un modèle Editorial. |
| **TurboSquid** | Les produits de marque sont signalés « Editorial Use Only » : réservés aux usages d'actualité, ou aux parties qui ont une autorisation explicite du titulaire des droits. Exemple cité : « You may not use it, for example, in an advertisement ». Le texte ajoute : « It is wholly your responsibility to ensure that you are properly using any intellectual property depicted in the 3D Model ». | Même conclusion : l'éditorial est interdit sur un site marchand sans accord de la marque. |
| **Printables / RenderHub / 3dcadbrowser** | Les modèles de marque y sont faits par des artistes tiers, sauf les comptes officiels (Cooler Master sur Printables est vérifié comme tel). | Ne pas utiliser les modèles tiers de produits de marque en commercial. |

**Point juridique (à valider avec un juriste).** Afficher une reproduction 3D fidèle d'un produit de marque peut toucher à plusieurs droits :
- le droit d'auteur ou les dessins et modèles sur le design du produit ;
- le droit des marques sur les logos ;
- l'interdiction de laisser croire à un partenariat.

C'est pourquoi les marketplaces classent ces modèles en « éditorial ».

---

## 3. Procédure recommandée

1. **Priorité Cooler Master** : télécharger les STEP officiels (Qube 500/540, MasterFrame 600) pour un prototype interne, puis **écrire à Cooler Master** pour obtenir une autorisation écrite d'affichage en ligne.
2. **Noctua** : même démarche. C'est une source propre pour les ventilateurs, et la visualisation est explicitement prévue.
3. **Autres marques** : écrire au service **marketing / PR / relations partenaires** de chaque marque, idéalement de la filiale France ou EMEA. Mentionner que le site est un configurateur qui renvoie vers des revendeurs : c'est un argument commercial pour elles. Demander :
   - (a) s'ils ont des modèles 3D (GLB/glTF, FBX, STEP) pour les médias ou les partenaires ;
   - (b) une autorisation écrite d'affichage.
4. **En attendant les réponses** : utiliser des **modèles génériques sans marque** (boîtier ATX, GPU « 2,5 slots », barrette DDR5, etc.) modélisés soi-même à partir des dimensions des fiches techniques. Le nom et la photo officielle du produit restent dans la fiche texte.
5. **Archiver chaque autorisation** (e-mail signé, périmètre, durée, mentions obligatoires) et afficher les mentions de marque demandées.
6. **Pipeline technique** : STEP → GLB avec FreeCAD ou Blender (import STEP) ou CAD Exchanger, puis décimation et compression Draco/Meshopt pour le web.

### Modèle d'e-mail (FR)

> **Objet : Demande d'autorisation – modèles 3D de vos produits sur un configurateur PC**
>
> Bonjour,
>
> Je m'appelle Alexandre, je suis micro-entrepreneur en France et je développe [NOM DU SITE] ([URL]), un configurateur PC en 3D. Il permet aux utilisateurs de visualiser et d'assembler leur configuration, puis les redirige vers des revendeurs.
>
> Nous souhaitons présenter vos produits ([ex. : boîtiers Qube 540, MasterFrame 600]) de façon fidèle et valorisante. Pour cela, je me permets de vous demander :
>
> 1. si vous disposez de modèles 3D de ces produits destinés aux médias ou aux partenaires (formats glTF/GLB, FBX, OBJ ou STEP) ;
> 2. votre autorisation écrite pour afficher ces modèles (ou des modèles réalisés à partir de vos fichiers) dans le visualiseur 3D de notre site, qui est un site commercial ;
> 3. les éventuelles conditions à respecter : mentions de marque, crédits, durée, validation préalable des rendus.
>
> Les modèles seraient uniquement affichés en ligne (visualisation interactive). Ils ne seraient ni redistribués, ni téléchargeables, ni utilisés pour fabriquer quoi que ce soit.
>
> Je reste à votre disposition pour vous présenter le projet ou une démo.
>
> Cordialement,
> Alexandre [NOM]
> [Entreprise / SIRET] – [e-mail] – [téléphone] – [URL]

---

## 4. URLs consultées

- Cooler Master (Printables, officiel) : https://www.printables.com/@CoolerMaster/models
- Cooler Master Qube 540 STEP : https://www.printables.com/model/1465171-qube-540-full-pc-case-step-model-3d-printing-base
- ASUS 3D Printing Project : https://rog-forum.asus.com/t5/3d-printing/make-it-your-own-the-asus-3d-printing-project/m-p/652475
- Fractal Design North Pi : https://www.fractal-design.com/north-pi-3d-files/ (via https://www.hackster.io/news/build-your-own-north-pi-ceb1026bc35d)
- Compte Printables non officiel « Fractal_design » : https://www.printables.com/@Fractal_design
- be quiet! portail de téléchargement : https://www.bequiet.com/en/download
- Corsair téléchargements : https://www.corsair.com/de/en/s/downloads
- NVIDIA règles de marque : https://nvidia.com/en-us/about-nvidia/legal-info/logo-brand-usage
- Noctua modèles CAD : https://www.noctua.at/en/3d-cad-models ; https://www.digitalcitizen.life/noctua-releases-free-cad-files-for-its-fans-but-they-are-not-meant-for-cloning/
- Thermaltake Tt 3D Makers : https://3dmakers.thermaltake.com/Download.aspx
- Intel forum (demandes de modèles 3D) : https://community.intel.com/t5/Ethernet-Products/E810-XXVDA2-3D-model/m-p/1609586
- Datasheet Samsung 990 PRO : https://download.semiconductor.samsung.com/resources/data-sheet/Samsung_NVMe_SSD_990_PRO_Datasheet_Rev.1.0_10129514072296.pdf
- Sketchfab, fermeture du store : https://help.sketchfab.com/en/articles/16152225-store-license-usage-faq
- Sketchfab, licences Standard/Editorial : https://help.sketchfab.com/en/articles/16152221-choosing-your-model-s-license
- GrabCAD, utilisation des modèles : https://help.grabcad.com/article/246-how-can-models-be-used-and-shared
- CGTrader, Royalty Free vs Editorial : https://help.cgtrader.com/hc/en-us/articles/360015193418-What-is-the-difference-between-Royalty-Free-and-Editorial-licenses
- TurboSquid, marques associées : https://www.turbosquid.com/help/en/articles/9937426-associated-brands-information
- Exemples de modèles tiers (non officiels) : https://www.renderhub.com/dronwin/msi-z790-tomahawk ; https://www.renderhub.com/projectx3d/amd-radeon-rx-7900-xtx
