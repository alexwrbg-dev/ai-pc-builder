// Apparence relevée pour chaque pièce visible (octobre 2026) : couleurs, nombre et place des ventilateurs,
// éclairage, plaque arrière, tuyaux… à partir des pages des fabricants, de revendeurs et de tests.
// Ce sont des attributs descriptifs : les modèles 3D restent génériques (pas de logos ni de copie de design).
// Une valeur douteuse se corrige ici ; la source principale est en commentaire.

export type Blade = "black" | "white" | "translucent" | "gray";

export interface GpuLook { body: string; accent: string | null; backplate: boolean; backplateColor: string | null; blade: Blade; rgb: "none" | "strip" | "fans" | "both"; frame: "flat" | "angular" | "rounded"; flowThrough: boolean }
export interface CoolerLook { fanColor: string; blade: Blade; fanSize: number; rgb: "none" | "fans" | "top" | "both"; towers?: number; heatpipes?: number; heatpipeColor?: "copper" | "nickel" | "black"; finColor?: string; topCover?: string | null; tubeColor?: string; pumpCap?: string; pumpShape?: "round" | "square"; screen?: boolean; radiatorColor?: string }
export interface CaseLook { color: string; front: "mesh" | "glass" | "solid" | "wood" | "glass-corner"; sideGlass: boolean; topMesh: boolean; frontFans: number; rearFans: number; topFans: number; bottomFans: number; sideFans: number; fanBlade: Blade; fansRgb: boolean; shroud: "solid" | "perforated" | "none"; feet: "low" | "tall" | "rails"; accentColor: string | null }
export interface RamLook { spreader: string; accent: string | null; rgb: boolean; lightBar: "none" | "slim" | "tall"; profile: "flat" | "finned" | "stepped" }
export interface BoardLook { pcb: string; heatsink: string; accent: string | null; ioCover: boolean; rgb: boolean; m2Covers: number }
export interface PsuLook { color: string; fanGrill: "ring" | "honeycomb" | "slots"; sideLabel: "large" | "small"; rgb: boolean }

export const GPU_LOOK: Record<string, GpuLook> = {
  "gpu-gb-5050-lp": {"body": "#1b1d21", "accent": "#6b7078", "backplate": true, "backplateColor": "#1b1d21", "blade": "black", "rgb": "none", "frame": "flat", "flowThrough": false}, // https://gigante.co.uk/products/gigabyte-gv-n5050oc-8gl-geforce-rtx-5050-oc-low-profile-8g-gddr6-graphics-card-2560-cuda-core-2587mhz-core-clock-triple-fan-2x-displayports-2x-hdmi-ports
  "gpu-intel-b580-le": {"body": "#1b1d21", "accent": "#b9bec6", "backplate": true, "backplateColor": "#2a2c30", "blade": "black", "rgb": "strip", "frame": "flat", "flowThrough": true}, // https://www.club386.com/intel-arc-b580-limited-edition-review
  "gpu-msi-5060-gaming-oc": {"body": "#1b1d21", "accent": "#3a3f47", "backplate": true, "backplateColor": "#2b2e33", "blade": "black", "rgb": "strip", "frame": "angular", "flowThrough": true}, // https://www.profesionalreview.com/2025/05/21/msi-rtx-5060-gaming-oc-review/amp/
  "gpu-gb-5060-gaming-oc": {"body": "#1b1d21", "accent": "#6b7078", "backplate": true, "backplateColor": "#1b1d21", "blade": "black", "rgb": "strip", "frame": "angular", "flowThrough": true}, // https://www.hwcooling.net/en/gigabyte-geforce-rtx-5060-gaming-oc-8gb-needs-some-vram/2/
  "gpu-asus-5060-dual": {"body": "#1b1d21", "accent": "#6b7078", "backplate": true, "backplateColor": "#1b1d21", "blade": "black", "rgb": "none", "frame": "rounded", "flowThrough": true}, // https://www.asus.com/motherboards-components/graphics-cards/dual/dual-rtx5060ti-o16g/
  "gpu-msi-5060ti8-ventus2x": {"body": "#1b1d21", "accent": "#3a3f47", "backplate": true, "backplateColor": "#1b1d21", "blade": "black", "rgb": "none", "frame": "flat", "flowThrough": true}, // https://www.pccasegear.com/products/68659/msi-geforce-rtx-5070-ventus-2x-oc-gddr7-12gb
  "gpu-gb-5060ti8-windforce": {"body": "#1b1d21", "accent": "#6b7078", "backplate": true, "backplateColor": "#1b1d21", "blade": "black", "rgb": "none", "frame": "flat", "flowThrough": true}, // https://www.memoryexpress.com/Products/MX00133656
  "gpu-gb-9060xt-gaming-oc": {"body": "#1b1d21", "accent": "#6b7078", "backplate": true, "backplateColor": "#1b1d21", "blade": "black", "rgb": "strip", "frame": "angular", "flowThrough": true}, // https://itc.ua/en/articles/gigabyte-radeon-rx-9060-xt-gaming-oc-16g-video-card-review-popular-option-for-those-looking-for-an-alternative/
  "gpu-asus-9060xt-prime": {"body": "#1b1d21", "accent": "#6b7078", "backplate": true, "backplateColor": "#1b1d21", "blade": "black", "rgb": "none", "frame": "flat", "flowThrough": true}, // https://boxxe.com/shop/boxxe-shop-by-brand/asus/asus-prime-radeon-rx-9060-xt-o16g-amd-16-gb-gddr6
  "gpu-asus-5060ti16-dual": {"body": "#1b1d21", "accent": "#6b7078", "backplate": true, "backplateColor": "#1b1d21", "blade": "black", "rgb": "none", "frame": "rounded", "flowThrough": true}, // https://www.asus.com/motherboards-components/graphics-cards/dual/dual-rtx5060ti-o16g/
  "gpu-asus-5060ti16-prime": {"body": "#1b1d21", "accent": "#6b7078", "backplate": true, "backplateColor": "#1b1d21", "blade": "black", "rgb": "none", "frame": "flat", "flowThrough": true}, // https://www.pccasegear.com/products/69244/asus-geforce-rtx-5060-ti-prime-oc-gddr7-16gb
  "gpu-sapphire-9070-pulse": {"body": "#1b1d21", "accent": "#c8102e", "backplate": true, "backplateColor": "#1b1d21", "blade": "black", "rgb": "none", "frame": "flat", "flowThrough": true}, // https://www.digitec.ch/en/s1/product/sapphire-pulse-radeon-rx-9070-16-gb-gddr6-graphics-card-55629522
  "gpu-gb-5070-gaming-oc": {"body": "#1b1d21", "accent": "#6b7078", "backplate": true, "backplateColor": "#1b1d21", "blade": "black", "rgb": "strip", "frame": "angular", "flowThrough": true}, // https://www.caseking.de/en/gigabyte-geforce-rtx-5070-gaming-oc-12g-12288-mb-gddr7/GCGB-563.html
  "gpu-msi-5070-ventus2x": {"body": "#1b1d21", "accent": "#3a3f47", "backplate": true, "backplateColor": "#1b1d21", "blade": "black", "rgb": "none", "frame": "flat", "flowThrough": true}, // https://www.pccasegear.com/products/68659/msi-geforce-rtx-5070-ventus-2x-oc-gddr7-12gb
  "gpu-gb-5070-windforce-sff": {"body": "#1b1d21", "accent": "#6b7078", "backplate": true, "backplateColor": "#1b1d21", "blade": "black", "rgb": "none", "frame": "flat", "flowThrough": true}, // https://www.scan.co.uk/products/gigabyte-nvidia-geforce-rtx-5080-windforce-oc-v2-sff-16gb-gddr7-graphics-card-dlss-4-10752-cores
  "gpu-sapphire-9070xt-pulse": {"body": "#1b1d21", "accent": "#c8102e", "backplate": true, "backplateColor": "#1b1d21", "blade": "black", "rgb": "none", "frame": "flat", "flowThrough": true}, // https://lanoc.org/review/video-cards/sapphire-rx-9070-xt-pulse?start=2
  "gpu-asus-9070xt-prime": {"body": "#1b1d21", "accent": "#6b7078", "backplate": true, "backplateColor": "#1b1d21", "blade": "black", "rgb": "none", "frame": "flat", "flowThrough": true}, // https://www.digitalcitizen.life/asus-prime-radeon-rx-9070-xt-oc-edition-review/
  "gpu-sapphire-9070xt-pure": {"body": "#e8eaed", "accent": "#b9bec6", "backplate": true, "backplateColor": "#e8eaed", "blade": "white", "rgb": "strip", "frame": "flat", "flowThrough": true}, // https://www.hwcooling.net/test-sapphire-pure-amd-radeon-rx-9070-xt-skvely-i-v-bile/2/
  "gpu-gb-9070xt-gaming-oc": {"body": "#1b1d21", "accent": "#6b7078", "backplate": true, "backplateColor": "#1b1d21", "blade": "black", "rgb": "strip", "frame": "angular", "flowThrough": true}, // https://www.paradigit.ie/gigabyte-radeon-rx-9070-xt-gaming-oc/80068211/product
  "gpu-gb-5070ti-windforce-sff": {"body": "#1b1d21", "accent": "#6b7078", "backplate": true, "backplateColor": "#1b1d21", "blade": "black", "rgb": "none", "frame": "flat", "flowThrough": true}, // https://www.scan.co.uk/products/gigabyte-nvidia-geforce-rtx-5080-windforce-oc-v2-sff-16gb-gddr7-graphics-card-dlss-4-10752-cores
  "gpu-msi-5070ti-ventus3x": {"body": "#1b1d21", "accent": "#3a3f47", "backplate": true, "backplateColor": "#1b1d21", "blade": "black", "rgb": "none", "frame": "flat", "flowThrough": true}, // https://www.pccasegear.com/products/68151/msi-geforce-rtx-5090-ventus-3x-oc-gddr7-32gb
  "gpu-gb-5070ti-eagle-ice": {"body": "#e8eaed", "accent": "#b9bec6", "backplate": true, "backplateColor": "#e8eaed", "blade": "white", "rgb": "none", "frame": "angular", "flowThrough": true}, // https://pcper.com/2025/07/gigabytes-rtx-5070-eagle-oc-ice-sff-12g-is-made-for-mini-itx/
  "gpu-msi-5070ti-gaming-trio": {"body": "#1b1d21", "accent": "#3a3f47", "backplate": true, "backplateColor": "#1b1d21", "blade": "black", "rgb": "strip", "frame": "angular", "flowThrough": true}, // https://www.profesionalreview.com/2025/04/28/msi-rtx-5070-ti-gaming-trio-oc-plus-review/amp/
  "gpu-asus-5080-prime": {"body": "#1b1d21", "accent": "#6b7078", "backplate": true, "backplateColor": "#1b1d21", "blade": "black", "rgb": "none", "frame": "flat", "flowThrough": true}, // https://www.pccasegear.com/products/68056/asus-geforce-rtx-5080-prime-oc-gddr7-16gb
  "gpu-msi-5080-gaming-trio": {"body": "#1b1d21", "accent": "#3a3f47", "backplate": true, "backplateColor": "#1b1d21", "blade": "black", "rgb": "strip", "frame": "angular", "flowThrough": true}, // https://www.profesionalreview.com/2025/04/28/msi-rtx-5070-ti-gaming-trio-oc-plus-review/amp/
  "gpu-gb-5080-windforce-sff": {"body": "#1b1d21", "accent": "#6b7078", "backplate": true, "backplateColor": "#1b1d21", "blade": "black", "rgb": "none", "frame": "flat", "flowThrough": true}, // https://www.scan.co.uk/products/gigabyte-nvidia-geforce-rtx-5080-windforce-oc-v2-sff-16gb-gddr7-graphics-card-dlss-4-10752-cores
  "gpu-gb-5080-aero-sff": {"body": "#e8eaed", "accent": "#b9bec6", "backplate": true, "backplateColor": "#b9bec6", "blade": "white", "rgb": "strip", "frame": "flat", "flowThrough": true}, // https://www.club386.com/gigabyte-geforce-rtx-5080-aero-oc-sff-review/
  "gpu-msi-5090-ventus3x": {"body": "#1b1d21", "accent": "#3a3f47", "backplate": true, "backplateColor": "#1b1d21", "blade": "black", "rgb": "none", "frame": "flat", "flowThrough": true}, // https://www.pccasegear.com/products/68151/msi-geforce-rtx-5090-ventus-3x-oc-gddr7-32gb
};

export const COOLER_LOOK: Record<string, CoolerLook> = {
  "cool-bq-pure-rock-3": {"fanColor": "#1a1b1e", "blade": "black", "fanSize": 120, "rgb": "none", "towers": 1, "heatpipes": 4, "heatpipeColor": "black", "finColor": "#25282d", "topCover": "#1e2024"}, // https://tech4gamers.com/be-quiet-pure-rock-3-black-air-cooler-review/
  "cool-bq-pure-rock-pro-3": {"fanColor": "#1a1b1e", "blade": "black", "fanSize": 120, "rgb": "none", "towers": 1, "heatpipes": 6, "heatpipeColor": "nickel", "finColor": "#c9cdd4", "topCover": "#1e2024"}, // https://aphnetworks.com/reviews/be-quiet-pure-rock-pro-3/2
  "cool-bq-pure-rock-pro-3-black": {"fanColor": "#1a1b1e", "blade": "black", "fanSize": 120, "rgb": "none", "towers": 1, "heatpipes": 6, "heatpipeColor": "black", "finColor": "#25282d", "topCover": "#1e2024"}, // https://aphnetworks.com/reviews/be-quiet-pure-rock-pro-3/2
  "cool-bq-dark-rock-5": {"fanColor": "#1a1b1e", "blade": "black", "fanSize": 120, "rgb": "none", "towers": 1, "heatpipes": 6, "heatpipeColor": "black", "finColor": "#25282d", "topCover": "#1c1d20"}, // https://www.igorslab.de/en/be-quiet-dark-rock-5-test-compact-high-end-cooling-with-silent-genes-and-precision-claim/2/
  "cool-bq-dark-rock-pro-5": {"fanColor": "#1a1b1e", "blade": "black", "fanSize": 140, "rgb": "none", "towers": 2, "heatpipes": 7, "heatpipeColor": "black", "finColor": "#25282d", "topCover": "#1c1d20"}, // https://aphnetworks.com/reviews/be-quiet-dark-rock-pro-5/2
  "cool-bq-dark-rock-elite": {"fanColor": "#1a1b1e", "blade": "black", "fanSize": 140, "rgb": "top", "towers": 2, "heatpipes": 7, "heatpipeColor": "black", "finColor": "#25282d", "topCover": "#1c1d20"}, // https://www.club386.com/be-quiet-dark-rock-elite-review-german-rival-to-austrias-nh-d15
  "cool-msi-a13-240-black": {"fanColor": "#1a1b1e", "blade": "translucent", "fanSize": 120, "rgb": "both", "tubeColor": "#1a1b1e", "pumpCap": "#16171a", "pumpShape": "square", "screen": false, "radiatorColor": "#1a1b1e"}, // https://www.pccasegear.com/products/67605/msi-mag-coreliquid-a13-240mm-aio-cpu-cooler
  "cool-msi-a13-240-white": {"fanColor": "#eceef1", "blade": "translucent", "fanSize": 120, "rgb": "both", "tubeColor": "#eceef1", "pumpCap": "#eceef1", "pumpShape": "square", "screen": false, "radiatorColor": "#eceef1"}, // https://www.pccasegear.com/products/69503/msi-mag-coreliquid-a13-240mm-aio-cpu-cooler-white
  "cool-cm-360-core-ii": {"fanColor": "#1a1b1e", "blade": "translucent", "fanSize": 120, "rgb": "both", "tubeColor": "#1a1b1e", "pumpCap": "#101114", "pumpShape": "square", "screen": false, "radiatorColor": "#1a1b1e"}, // https://www.coolermaster.com/en-global/products/MLW-D36M-A18PA-R1.html
  "cool-nzxt-kraken-plus-240": {"fanColor": "#1a1b1e", "blade": "translucent", "fanSize": 120, "rgb": "fans", "tubeColor": "#1a1b1e", "pumpCap": "#16171a", "pumpShape": "round", "screen": true, "radiatorColor": "#1a1b1e"}, // https://nzxt.com/products/kraken-plus-240-rgb
  "cool-bq-pure-loop-3-240": {"fanColor": "#1a1b1e", "blade": "black", "fanSize": 120, "rgb": "none", "tubeColor": "#1a1b1e", "pumpCap": "#16171a", "pumpShape": "square", "screen": false, "radiatorColor": "#1a1b1e"}, // https://root-nation.com/en/pc-en/hardware-en/en-be-quiet-pure-loop-3-360-review/
  "cool-msi-a13-360-black": {"fanColor": "#1a1b1e", "blade": "translucent", "fanSize": 120, "rgb": "both", "tubeColor": "#1a1b1e", "pumpCap": "#16171a", "pumpShape": "square", "screen": false, "radiatorColor": "#1a1b1e"}, // https://www.pccasegear.com/products/69504/msi-mag-coreliquid-a13-360mm-aio-cpu-cooler-white
  "cool-msi-a13-360-white": {"fanColor": "#eceef1", "blade": "translucent", "fanSize": 120, "rgb": "both", "tubeColor": "#eceef1", "pumpCap": "#eceef1", "pumpShape": "square", "screen": false, "radiatorColor": "#eceef1"}, // https://www.pccasegear.com/products/69504/msi-mag-coreliquid-a13-360mm-aio-cpu-cooler-white
  "cool-corsair-nautilus-240": {"fanColor": "#1a1b1e", "blade": "black", "fanSize": 120, "rgb": "none", "tubeColor": "#1a1b1e", "pumpCap": "#16171a", "pumpShape": "square", "screen": false, "radiatorColor": "#1a1b1e"}, // https://www.corsair.com/uk/cs/explorer/diy-builder/cpu-coolers/corsair-nautilus-rs-and-rs-argb-aios-everything-you-need-to-know/
  "cool-bq-pure-loop-3-280": {"fanColor": "#1a1b1e", "blade": "black", "fanSize": 140, "rgb": "none", "tubeColor": "#1a1b1e", "pumpCap": "#16171a", "pumpShape": "square", "screen": false, "radiatorColor": "#1a1b1e"}, // https://www.igorslab.de/en/be-quiet-pure-loop-3-schlicht-leise-effizient/
  "cool-bq-pure-loop-3-360": {"fanColor": "#1a1b1e", "blade": "black", "fanSize": 120, "rgb": "none", "tubeColor": "#1a1b1e", "pumpCap": "#16171a", "pumpShape": "square", "screen": false, "radiatorColor": "#1a1b1e"}, // https://root-nation.com/en/pc-en/hardware-en/en-be-quiet-pure-loop-3-360-review/
  "cool-corsair-nautilus-360": {"fanColor": "#1a1b1e", "blade": "black", "fanSize": 120, "rgb": "none", "tubeColor": "#1a1b1e", "pumpCap": "#16171a", "pumpShape": "square", "screen": false, "radiatorColor": "#1a1b1e"}, // https://www.corsair.com/uk/cs/explorer/diy-builder/cpu-coolers/corsair-nautilus-rs-and-rs-argb-aios-everything-you-need-to-know/
  "cool-corsair-nautilus-360-white": {"fanColor": "#eceef1", "blade": "translucent", "fanSize": 120, "rgb": "both", "tubeColor": "#eceef1", "pumpCap": "#eceef1", "pumpShape": "square", "screen": false, "radiatorColor": "#eceef1"}, // https://www.corsair.com/uk/cs/explorer/diy-builder/cpu-coolers/corsair-nautilus-rs-and-rs-argb-aios-everything-you-need-to-know/
  "cool-bq-light-loop-360-black": {"fanColor": "#1a1b1e", "blade": "translucent", "fanSize": 120, "rgb": "both", "tubeColor": "#1a1b1e", "pumpCap": "#2a2c30", "pumpShape": "square", "screen": false, "radiatorColor": "#1a1b1e"}, // https://aphnetworks.com/reviews/be-quiet-light-loop-360mm/2
  "cool-bq-light-loop-360-white": {"fanColor": "#eceef1", "blade": "translucent", "fanSize": 120, "rgb": "both", "tubeColor": "#eceef1", "pumpCap": "#eceef1", "pumpShape": "square", "screen": false, "radiatorColor": "#eceef1"}, // https://www.watercoolinguk.co.uk/product/be-quiet-light-loop-all-in-one-water-cooling-argb-360-mm-white/
  "cool-bq-silent-loop-3-360": {"fanColor": "#1a1b1e", "blade": "black", "fanSize": 120, "rgb": "top", "tubeColor": "#1a1b1e", "pumpCap": "#16171a", "pumpShape": "square", "screen": false, "radiatorColor": "#1a1b1e"}, // https://www.bhphotovideo.com/c/product/1938162-REG/be_quiet_bw025_silent_loop_3_360mm.html
  "cool-bq-silent-loop-3-420": {"fanColor": "#1a1b1e", "blade": "black", "fanSize": 140, "rgb": "top", "tubeColor": "#1a1b1e", "pumpCap": "#16171a", "pumpShape": "square", "screen": false, "radiatorColor": "#1a1b1e"}, // https://aphnetworks.com/reviews/be-quiet-silent-loop-3-420mm/2
};

export const CASE_LOOK: Record<string, CaseLook> = {
  "case-msi-forge-100r": {"color": "#141517", "front": "mesh", "sideGlass": true, "topMesh": true, "frontFans": 2, "rearFans": 1, "topFans": 0, "bottomFans": 0, "sideFans": 0, "fanBlade": "translucent", "fansRgb": true, "shroud": "solid", "feet": "low", "accentColor": null}, // msi.com/PC-Case/MAG-FORGE-100R
  "case-corsair-3200d-black": {"color": "#141517", "front": "mesh", "sideGlass": true, "topMesh": true, "frontFans": 3, "rearFans": 0, "topFans": 0, "bottomFans": 0, "sideFans": 0, "fanBlade": "black", "fansRgb": false, "shroud": "perforated", "feet": "low", "accentColor": null}, // profesionalreview.com 3200D RS review
  "case-corsair-3200d-white": {"color": "#eeeff0", "front": "mesh", "sideGlass": true, "topMesh": true, "frontFans": 3, "rearFans": 0, "topFans": 0, "bottomFans": 0, "sideFans": 0, "fanBlade": "white", "fansRgb": false, "shroud": "perforated", "feet": "low", "accentColor": null}, // profesionalreview.com 3200D RS review
  "case-nzxt-h3-flow-white": {"color": "#eeeff0", "front": "mesh", "sideGlass": true, "topMesh": true, "frontFans": 0, "rearFans": 1, "topFans": 0, "bottomFans": 0, "sideFans": 0, "fanBlade": "white", "fansRgb": false, "shroud": "perforated", "feet": "low", "accentColor": null}, // pcper.com H3 Flow review
  "case-msi-pano-110r-black": {"color": "#141517", "front": "glass-corner", "sideGlass": true, "topMesh": true, "frontFans": 0, "rearFans": 1, "topFans": 0, "bottomFans": 0, "sideFans": 3, "fanBlade": "translucent", "fansRgb": true, "shroud": "perforated", "feet": "low", "accentColor": null}, // directcomputers.co.uk MAG Pano 110R PZ
  "case-msi-pano-110r-white": {"color": "#eeeff0", "front": "glass-corner", "sideGlass": true, "topMesh": true, "frontFans": 0, "rearFans": 1, "topFans": 0, "bottomFans": 0, "sideFans": 3, "fanBlade": "translucent", "fansRgb": true, "shroud": "perforated", "feet": "low", "accentColor": null}, // directcomputers.co.uk MAG Pano 110R PZ
  "case-msi-forge-320r": {"color": "#141517", "front": "mesh", "sideGlass": true, "topMesh": true, "frontFans": 3, "rearFans": 1, "topFans": 0, "bottomFans": 0, "sideFans": 0, "fanBlade": "translucent", "fansRgb": true, "shroud": "solid", "feet": "low", "accentColor": null}, // scan.co.uk (4x 120mm ARGB)
  "case-nzxt-h5-flow-rgb": {"color": "#141517", "front": "mesh", "sideGlass": true, "topMesh": true, "frontFans": 3, "rearFans": 1, "topFans": 0, "bottomFans": 0, "sideFans": 0, "fanBlade": "translucent", "fansRgb": true, "shroud": "perforated", "feet": "low", "accentColor": null}, // techpowerup H5 Flow RGB 2024 review
  "case-fractal-pop2-vision-black": {"color": "#141517", "front": "glass-corner", "sideGlass": true, "topMesh": true, "frontFans": 0, "rearFans": 0, "topFans": 0, "bottomFans": 2, "sideFans": 2, "fanBlade": "translucent", "fansRgb": true, "shroud": "perforated", "feet": "low", "accentColor": null}, // aphnetworks Pop 2 Vision RGB review
  "case-bq-pure-base-501": {"color": "#141517", "front": "mesh", "sideGlass": false, "topMesh": true, "frontFans": 1, "rearFans": 1, "topFans": 0, "bottomFans": 0, "sideFans": 0, "fanBlade": "black", "fansRgb": false, "shroud": "solid", "feet": "low", "accentColor": null}, // hwcooling.net Pure Base 501 Airflow review
  "case-fractal-pop2-vision-white": {"color": "#eeeff0", "front": "glass-corner", "sideGlass": true, "topMesh": true, "frontFans": 0, "rearFans": 0, "topFans": 0, "bottomFans": 2, "sideFans": 2, "fanBlade": "translucent", "fansRgb": true, "shroud": "perforated", "feet": "low", "accentColor": null}, // fractal-design.com pop-2-vision white-rgb
  "case-corsair-4000d-rs-argb": {"color": "#141517", "front": "mesh", "sideGlass": true, "topMesh": true, "frontFans": 3, "rearFans": 0, "topFans": 0, "bottomFans": 0, "sideFans": 0, "fanBlade": "translucent", "fansRgb": true, "shroud": "perforated", "feet": "low", "accentColor": null}, // funkykit Frame 4000D RS ARGB review
  "case-nzxt-h9-flow-black": {"color": "#141517", "front": "glass-corner", "sideGlass": true, "topMesh": true, "frontFans": 0, "rearFans": 1, "topFans": 0, "bottomFans": 0, "sideFans": 3, "fanBlade": "black", "fansRgb": false, "shroud": "none", "feet": "low", "accentColor": null}, // scan.co.uk H9 Flow (2025)
  "case-nzxt-h6-flow-white": {"color": "#eeeff0", "front": "glass-corner", "sideGlass": true, "topMesh": true, "frontFans": 0, "rearFans": 0, "topFans": 0, "bottomFans": 0, "sideFans": 3, "fanBlade": "white", "fansRgb": false, "shroud": "none", "feet": "low", "accentColor": null}, // hwbusters H6 Flow RGB review
  "case-fractal-north-black": {"color": "#141517", "front": "wood", "sideGlass": false, "topMesh": true, "frontFans": 2, "rearFans": 0, "topFans": 0, "bottomFans": 0, "sideFans": 0, "fanBlade": "black", "fansRgb": false, "shroud": "perforated", "feet": "tall", "accentColor": "#5a3b26"}, // club386 North XL review (family)
  "case-fractal-north-white": {"color": "#eeeff0", "front": "wood", "sideGlass": false, "topMesh": true, "frontFans": 2, "rearFans": 0, "topFans": 0, "bottomFans": 0, "sideFans": 0, "fanBlade": "black", "fansRgb": false, "shroud": "perforated", "feet": "tall", "accentColor": "#c9a676"}, // memoryexpress MX00124274
  "case-nzxt-h9-flow-white": {"color": "#eeeff0", "front": "glass-corner", "sideGlass": true, "topMesh": true, "frontFans": 0, "rearFans": 1, "topFans": 0, "bottomFans": 0, "sideFans": 3, "fanBlade": "white", "fansRgb": false, "shroud": "none", "feet": "low", "accentColor": null}, // scan.co.uk H9 Flow (2025) White
  "case-corsair-5000d-rs-argb-white": {"color": "#eeeff0", "front": "mesh", "sideGlass": true, "topMesh": true, "frontFans": 3, "rearFans": 1, "topFans": 0, "bottomFans": 0, "sideFans": 0, "fanBlade": "translucent", "fansRgb": true, "shroud": "perforated", "feet": "low", "accentColor": null}, // corsair.com CC-9011310-WW
  "case-fractal-north-xl": {"color": "#141517", "front": "wood", "sideGlass": false, "topMesh": true, "frontFans": 3, "rearFans": 0, "topFans": 0, "bottomFans": 0, "sideFans": 0, "fanBlade": "black", "fansRgb": false, "shroud": "perforated", "feet": "tall", "accentColor": "#5a3b26"}, // club386 North XL review
  "case-bq-silent-base-802": {"color": "#141517", "front": "solid", "sideGlass": true, "topMesh": false, "frontFans": 2, "rearFans": 1, "topFans": 0, "bottomFans": 0, "sideFans": 0, "fanBlade": "black", "fansRgb": false, "shroud": "solid", "feet": "tall", "accentColor": null}, // guru3d Silent Base 802 review
};

export const RAM_LOOK: Record<string, RamLook> = {
  "ram-textorm-d4-16": {"spreader": "#1b1c1e", "accent": null, "rgb": false, "lightBar": "none", "profile": "flat"}, // ldlc.pro PB00392932
  "ram-lpx-d4-16": {"spreader": "#1b1c1e", "accent": null, "rgb": false, "lightBar": "none", "profile": "stepped"}, // corsair.com DDR4 module dimensions (33.53 mm)
  "ram-fury-d4-16": {"spreader": "#1b1c1e", "accent": null, "rgb": false, "lightBar": "none", "profile": "stepped"}, // Kingston spec (knowledge)
  "ram-ripjaws-d4-32": {"spreader": "#1b1c1e", "accent": null, "rgb": false, "lightBar": "none", "profile": "finned"}, // G.Skill spec (knowledge)
  "ram-vengeance-rs-d4-32": {"spreader": "#1b1c1e", "accent": null, "rgb": true, "lightBar": "slim", "profile": "flat"}, // corsair.com DDR4 module dimensions (45 mm)
  "ram-fury-d4-32": {"spreader": "#1b1c1e", "accent": null, "rgb": false, "lightBar": "none", "profile": "stepped"}, // Kingston spec (knowledge)
  "ram-vengeance-d5-16": {"spreader": "#1b1c1e", "accent": null, "rgb": false, "lightBar": "none", "profile": "flat"}, // Corsair spec (knowledge)
  "ram-fury-d5-16": {"spreader": "#1b1c1e", "accent": null, "rgb": false, "lightBar": "none", "profile": "stepped"}, // Kingston spec
  "ram-crucial-pro-d5-32": {"spreader": "#1b1c1e", "accent": null, "rgb": false, "lightBar": "none", "profile": "stepped"}, // aphnetworks Crucial Pro OC review (35 mm)
  "ram-fury-d5-32-5600": {"spreader": "#1b1c1e", "accent": null, "rgb": false, "lightBar": "none", "profile": "stepped"}, // Kingston spec
  "ram-fury-rgb-d5-32-5600": {"spreader": "#1b1c1e", "accent": null, "rgb": true, "lightBar": "slim", "profile": "stepped"}, // multitronic.fi listing (42.23 mm)
  "ram-fury-rgb-d5-32-6000-cl36": {"spreader": "#1b1c1e", "accent": null, "rgb": true, "lightBar": "slim", "profile": "stepped"}, // multitronic.fi listing
  "ram-flare-x5-d5-32": {"spreader": "#1b1c1e", "accent": null, "rgb": false, "lightBar": "none", "profile": "flat"}, // G.Skill spec (knowledge)
  "ram-vengeance-d5-32": {"spreader": "#1b1c1e", "accent": null, "rgb": false, "lightBar": "none", "profile": "flat"}, // Corsair spec
  "ram-fury-white-rgb-d5-32": {"spreader": "#f1f1f1", "accent": null, "rgb": true, "lightBar": "slim", "profile": "stepped"}, // Kingston spec
  "ram-fury-rgb-d5-32-6000-cl30": {"spreader": "#1b1c1e", "accent": null, "rgb": true, "lightBar": "slim", "profile": "stepped"}, // Kingston spec
  "ram-trident-neo-white-d5-32": {"spreader": "#f1f1f1", "accent": "#c8c8c8", "rgb": true, "lightBar": "tall", "profile": "stepped"}, // G.Skill spec (42.1 mm); noctua.at lists 43.5
  "ram-fury-d5-64-6000": {"spreader": "#1b1c1e", "accent": null, "rgb": false, "lightBar": "none", "profile": "stepped"}, // Kingston spec
  "ram-fury-d5-64-5600": {"spreader": "#1b1c1e", "accent": null, "rgb": false, "lightBar": "none", "profile": "stepped"}, // Kingston spec
  "ram-trident-rgb-d5-64": {"spreader": "#1b1c1e", "accent": "#3c3e42", "rgb": true, "lightBar": "tall", "profile": "stepped"}, // G.Skill spec; noctua.at (43.5)
};

export const BOARD_LOOK: Record<string, BoardLook> = {
  "mb-gb-b650m-gaming-wifi6e": {"pcb": "#141619", "heatsink": "#5a5f66", "accent": null, "ioCover": false, "rgb": false, "m2Covers": 1},
  "mb-gb-b650-eagle-ax": {"pcb": "#141619", "heatsink": "#5a5f66", "accent": "#a9adb3", "ioCover": false, "rgb": false, "m2Covers": 1},
  "mb-gb-b650-gaming-x-ax-v2": {"pcb": "#141619", "heatsink": "#2c3036", "accent": "#a9adb3", "ioCover": true, "rgb": false, "m2Covers": 1},
  "mb-asus-tuf-b650-plus-wifi": {"pcb": "#141619", "heatsink": "#2c3036", "accent": "#c9a227", "ioCover": true, "rgb": true, "m2Covers": 2},
  "mb-gb-b850-eagle-wifi6e": {"pcb": "#141619", "heatsink": "#5a5f66", "accent": "#a9adb3", "ioCover": false, "rgb": false, "m2Covers": 1}, // https://www.maxmybuild.com/motherboards/gigabyte-b850-eagle-wifi6e
  "mb-msi-b850-gaming-plus-wifi": {"pcb": "#141619", "heatsink": "#1d2024", "accent": "#d8dadd", "ioCover": true, "rgb": false, "m2Covers": 2}, // https://www.memoryexpress.com/Products/MX00132293
  "mb-gb-b850-aorus-elite-ice": {"pcb": "#e9ebee", "heatsink": "#dfe2e6", "accent": "#a9adb3", "ioCover": true, "rgb": true, "m2Covers": 2},
  "mb-msi-b850m-mortar-wifi": {"pcb": "#141619", "heatsink": "#2c3036", "accent": "#a9adb3", "ioCover": true, "rgb": false, "m2Covers": 2}, // https://www.noobfeed.com/hardware/msi-b850m-mortar-wifi-review-m-2-slot
  "mb-gb-x870-eagle-wifi7": {"pcb": "#141619", "heatsink": "#5a5f66", "accent": "#2f7bd6", "ioCover": true, "rgb": true, "m2Covers": 1}, // https://www.alktech.co/articles/review-gigabyte-x870-eagle-wifi7-am5-motherboard
  "mb-asus-strix-b850-a": {"pcb": "#e9ebee", "heatsink": "#d6d9dd", "accent": "#b8a9d9", "ioCover": true, "rgb": true, "m2Covers": 3},
  "mb-gb-x870-aorus-elite-ice": {"pcb": "#e9ebee", "heatsink": "#dfe2e6", "accent": "#a9adb3", "ioCover": true, "rgb": true, "m2Covers": 3},
  "mb-gb-x870-aorus-elite": {"pcb": "#141619", "heatsink": "#2c3036", "accent": "#a9adb3", "ioCover": true, "rgb": true, "m2Covers": 3},
  "mb-msi-x870e-tomahawk": {"pcb": "#141619", "heatsink": "#3d4148", "accent": "#9a9ea4", "ioCover": true, "rgb": false, "m2Covers": 3},
  "mb-asus-strix-x870e-e": {"pcb": "#141619", "heatsink": "#1d2024", "accent": "#c8ccd1", "ioCover": true, "rgb": true, "m2Covers": 3},
  "mb-msi-a520m-a-pro": {"pcb": "#141619", "heatsink": "#a9adb3", "accent": null, "ioCover": false, "rgb": false, "m2Covers": 0},
  "mb-gb-b550m-k": {"pcb": "#141619", "heatsink": "#5a5f66", "accent": null, "ioCover": false, "rgb": false, "m2Covers": 0},
  "mb-gb-b550m-aorus-elite": {"pcb": "#141619", "heatsink": "#2c3036", "accent": "#e8742a", "ioCover": false, "rgb": true, "m2Covers": 1},
  "mb-asus-prime-b550-plus": {"pcb": "#141619", "heatsink": "#a9adb3", "accent": "#e9ebee", "ioCover": false, "rgb": true, "m2Covers": 1},
  "mb-msi-b550-a-pro": {"pcb": "#141619", "heatsink": "#a9adb3", "accent": null, "ioCover": false, "rgb": false, "m2Covers": 1},
  "mb-msi-h610m-e-ddr4": {"pcb": "#141619", "heatsink": "#a9adb3", "accent": null, "ioCover": false, "rgb": false, "m2Covers": 0},
  "mb-msi-b760m-p-ddr4": {"pcb": "#141619", "heatsink": "#a9adb3", "accent": null, "ioCover": false, "rgb": false, "m2Covers": 0},
  "mb-asus-prime-b760m-a-wifi-d4": {"pcb": "#141619", "heatsink": "#a9adb3", "accent": "#e9ebee", "ioCover": false, "rgb": false, "m2Covers": 1},
  "mb-msi-b760-gaming-plus-wifi": {"pcb": "#141619", "heatsink": "#1d2024", "accent": "#d8dadd", "ioCover": false, "rgb": false, "m2Covers": 2},
  "mb-msi-z790-p-wifi": {"pcb": "#141619", "heatsink": "#a9adb3", "accent": null, "ioCover": false, "rgb": false, "m2Covers": 2},
  "mb-asus-tuf-b760-plus-wifi": {"pcb": "#141619", "heatsink": "#2c3036", "accent": "#c9a227", "ioCover": true, "rgb": true, "m2Covers": 2},
  "mb-msi-z790-tomahawk-wifi": {"pcb": "#141619", "heatsink": "#3d4148", "accent": "#9a9ea4", "ioCover": true, "rgb": false, "m2Covers": 3},
  "mb-msi-b840m-b": {"pcb": "#141619", "heatsink": "#a9adb3", "accent": null, "ioCover": false, "rgb": false, "m2Covers": 0},
  "mb-gb-b840m-ds3h": {"pcb": "#141619", "heatsink": "#5a5f66", "accent": null, "ioCover": false, "rgb": false, "m2Covers": 1}, // https://www.maxmybuild.com/motherboards/gigabyte-b840m-ds3h
  "mb-asus-prime-b860m-k": {"pcb": "#141619", "heatsink": "#a9adb3", "accent": null, "ioCover": false, "rgb": false, "m2Covers": 1},
  "mb-msi-b860-p-wifi": {"pcb": "#141619", "heatsink": "#a9adb3", "accent": null, "ioCover": false, "rgb": false, "m2Covers": 1}, // https://www.msi.com/Motherboard/PRO-B860-P-WIFI
  "mb-msi-b860-gaming-plus-wifi": {"pcb": "#141619", "heatsink": "#1d2024", "accent": "#d8dadd", "ioCover": false, "rgb": false, "m2Covers": 2},
  "mb-msi-z890-s-wifi": {"pcb": "#141619", "heatsink": "#a9adb3", "accent": null, "ioCover": false, "rgb": false, "m2Covers": 2}, // https://th-store.msi.com/products/msi-pro-z890-s-wifi-d5
  "mb-asus-strix-z890-f": {"pcb": "#141619", "heatsink": "#1d2024", "accent": "#c8ccd1", "ioCover": true, "rgb": true, "m2Covers": 3}, // https://www.club386.com/asus-rog-strix-z890-f-gaming-wifi-review/
};

export const PSU_LOOK: Record<string, PsuLook> = {
  "psu-corsair-cx550": {"color": "#151618", "fanGrill": "honeycomb", "sideLabel": "large", "rgb": false},
  "psu-msi-a650bn": {"color": "#151618", "fanGrill": "honeycomb", "sideLabel": "large", "rgb": false},
  "psu-bq-sp11-650": {"color": "#151618", "fanGrill": "ring", "sideLabel": "small", "rgb": false},
  "psu-bq-pp12-550": {"color": "#151618", "fanGrill": "ring", "sideLabel": "small", "rgb": false}, // https://aphnetworks.com/reports/be-quiet-pure-power-12-m-1000w/2
  "psu-bq-sp11-750": {"color": "#151618", "fanGrill": "ring", "sideLabel": "small", "rgb": false},
  "psu-bq-pp12-650": {"color": "#151618", "fanGrill": "ring", "sideLabel": "small", "rgb": false}, // https://aphnetworks.com/reports/be-quiet-pure-power-12-m-1000w/2
  "psu-corsair-rm650e": {"color": "#151618", "fanGrill": "honeycomb", "sideLabel": "large", "rgb": false},
  "psu-gb-ud750gm-pg5": {"color": "#151618", "fanGrill": "honeycomb", "sideLabel": "large", "rgb": false},
  "psu-bq-pp12-850": {"color": "#151618", "fanGrill": "ring", "sideLabel": "small", "rgb": false}, // https://aphnetworks.com/reports/be-quiet-pure-power-12-m-1000w/2
  "psu-bq-pp13m-650": {"color": "#151618", "fanGrill": "ring", "sideLabel": "small", "rgb": false},
  "psu-corsair-rm750e": {"color": "#151618", "fanGrill": "honeycomb", "sideLabel": "large", "rgb": false},
  "psu-msi-a750gl": {"color": "#151618", "fanGrill": "honeycomb", "sideLabel": "large", "rgb": false}, // https://hwbusters.com/psus/msi-mag-a850gl-pcie5-850w-psu-review/
  "psu-msi-a850gl": {"color": "#151618", "fanGrill": "honeycomb", "sideLabel": "large", "rgb": false}, // https://hwbusters.com/psus/msi-mag-a850gl-pcie5-850w-psu-review/
  "psu-corsair-rm750e-white": {"color": "#e9ebee", "fanGrill": "honeycomb", "sideLabel": "large", "rgb": false},
  "psu-bq-pp12-1000": {"color": "#151618", "fanGrill": "ring", "sideLabel": "small", "rgb": false}, // https://aphnetworks.com/reports/be-quiet-pure-power-12-m-1000w/2
  "psu-corsair-rm850e": {"color": "#151618", "fanGrill": "honeycomb", "sideLabel": "large", "rgb": false},
  "psu-msi-a1000gls": {"color": "#151618", "fanGrill": "honeycomb", "sideLabel": "large", "rgb": false}, // https://hwbusters.com/psus/msi-mag-a850gls-pcie5-atx-v3-1-psu-review/
  "psu-bq-pp13m-850": {"color": "#151618", "fanGrill": "ring", "sideLabel": "small", "rgb": false},
  "psu-msi-a1250gl": {"color": "#151618", "fanGrill": "honeycomb", "sideLabel": "large", "rgb": false},
  "psu-corsair-rm850x": {"color": "#151618", "fanGrill": "honeycomb", "sideLabel": "large", "rgb": false}, // https://hwbusters.com/psus/corsair-rm1000x-atx-v3-1-psu-review/2
  "psu-corsair-rm1000e": {"color": "#151618", "fanGrill": "honeycomb", "sideLabel": "large", "rgb": false},
  "psu-corsair-rm1000x": {"color": "#151618", "fanGrill": "honeycomb", "sideLabel": "large", "rgb": false}, // https://hwbusters.com/psus/corsair-rm1000x-atx-v3-1-psu-review/2
  "psu-seasonic-gx1000-white": {"color": "#e9ebee", "fanGrill": "honeycomb", "sideLabel": "large", "rgb": false},
};
