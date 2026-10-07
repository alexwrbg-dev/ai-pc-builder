import type { ComponentOf, Confidence, Finish, FormFactor, MotherboardSpecs, RamType } from "@/lib/types";

/** Mois de sortie du chipset : sert à signaler un BIOS potentiellement trop ancien pour un CPU récent. */
const CHIPSET_RELEASED: Record<string, string> = {
  A520: "2020-08", B550: "2020-06",
  B650: "2022-10", B850: "2025-01", X870: "2024-09", X870E: "2024-09",
  H610: "2022-01", B760: "2023-01", Z790: "2022-10",
  B840: "2025-01", B860: "2025-01", Z890: "2024-10",
};

type Row = [
  id: string, brand: string, model: string, price: number, finish: Finish,
  socket: string, chipset: string, formFactor: FormFactor, ramType: RamType,
  ramSlots: number, maxRamGB: number, m2Slots: number, wifi: boolean, tier: 1 | 2 | 3, confidence: Confidence,
];

const ROWS: Row[] = [
  // ---- AM5 ----
  ["mb-gb-b650m-gaming-wifi6e", "Gigabyte", "B650M Gaming WiFi6E", 95, "black", "AM5", "B650", "Micro-ATX", "DDR5", 2, 96, 2, true, 1, "KNOWN"],
  ["mb-gb-b650-eagle-ax", "Gigabyte", "B650 Eagle AX", 125, "black", "AM5", "B650", "ATX", "DDR5", 4, 192, 3, true, 1, "KNOWN"],
  ["mb-gb-b650-gaming-x-ax-v2", "Gigabyte", "B650 Gaming X AX V2", 134, "black", "AM5", "B650", "ATX", "DDR5", 4, 192, 3, true, 2, "KNOWN"],
  ["mb-asus-tuf-b650-plus-wifi", "ASUS", "TUF Gaming B650-Plus WiFi", 149, "black", "AM5", "B650", "ATX", "DDR5", 4, 192, 3, true, 2, "KNOWN"],
  ["mb-gb-b850-eagle-wifi6e", "Gigabyte", "B850 Eagle WiFi6E", 150, "black", "AM5", "B850", "ATX", "DDR5", 4, 256, 3, true, 2, "KNOWN"],
  ["mb-msi-b850-gaming-plus-wifi", "MSI", "B850 Gaming Plus WiFi", 174, "black", "AM5", "B850", "ATX", "DDR5", 4, 256, 3, true, 2, "KNOWN"],
  ["mb-gb-b850-aorus-elite-ice", "Gigabyte", "B850 Aorus Elite WiFi7 ICE", 181, "white", "AM5", "B850", "ATX", "DDR5", 4, 256, 3, true, 2, "KNOWN"],
  ["mb-msi-b850m-mortar-wifi", "MSI", "MAG B850M Mortar WiFi", 184, "black", "AM5", "B850", "Micro-ATX", "DDR5", 4, 256, 2, true, 2, "KNOWN"],
  ["mb-gb-x870-eagle-wifi7", "Gigabyte", "X870 Eagle WiFi7", 202, "black", "AM5", "X870", "ATX", "DDR5", 4, 256, 3, true, 2, "KNOWN"],
  ["mb-asus-strix-b850-a", "ASUS", "ROG Strix B850-A Gaming WiFi", 217, "white", "AM5", "B850", "ATX", "DDR5", 4, 256, 4, true, 3, "KNOWN"],
  ["mb-gb-x870-aorus-elite-ice", "Gigabyte", "X870 Aorus Elite WiFi7 ICE", 253, "white", "AM5", "X870", "ATX", "DDR5", 4, 256, 4, true, 3, "KNOWN"],
  ["mb-gb-x870-aorus-elite", "Gigabyte", "X870 Aorus Elite WiFi7", 254, "black", "AM5", "X870", "ATX", "DDR5", 4, 256, 4, true, 3, "KNOWN"],
  ["mb-msi-x870e-tomahawk", "MSI", "MAG X870E Tomahawk WiFi", 330, "black", "AM5", "X870E", "ATX", "DDR5", 4, 256, 4, true, 3, "KNOWN"],
  ["mb-asus-strix-x870e-e", "ASUS", "ROG Strix X870E-E Gaming WiFi", 404, "black", "AM5", "X870E", "ATX", "DDR5", 4, 192, 5, true, 3, "KNOWN"],
  // ---- AM4 ----
  ["mb-msi-a520m-a-pro", "MSI", "A520M-A Pro", 55, "black", "AM4", "A520", "Micro-ATX", "DDR4", 2, 64, 1, false, 1, "VERIFIED"],
  ["mb-gb-b550m-k", "Gigabyte", "B550M K", 75, "black", "AM4", "B550", "Micro-ATX", "DDR4", 4, 128, 2, false, 1, "KNOWN"],
  ["mb-gb-b550m-aorus-elite", "Gigabyte", "B550M Aorus Elite", 88, "black", "AM4", "B550", "Micro-ATX", "DDR4", 4, 128, 2, false, 1, "KNOWN"],
  ["mb-asus-prime-b550-plus", "ASUS", "Prime B550-Plus", 102, "black", "AM4", "B550", "ATX", "DDR4", 4, 128, 2, false, 2, "KNOWN"],
  ["mb-msi-b550-a-pro", "MSI", "B550-A Pro", 113, "black", "AM4", "B550", "ATX", "DDR4", 4, 128, 2, false, 2, "KNOWN"],
  // ---- LGA1700 ----
  ["mb-msi-h610m-e-ddr4", "MSI", "Pro H610M-E DDR4", 65, "black", "LGA1700", "H610", "Micro-ATX", "DDR4", 2, 64, 1, false, 1, "VERIFIED"],
  ["mb-msi-b760m-p-ddr4", "MSI", "Pro B760M-P DDR4", 89, "black", "LGA1700", "B760", "Micro-ATX", "DDR4", 4, 128, 2, false, 1, "KNOWN"],
  ["mb-asus-prime-b760m-a-wifi-d4", "ASUS", "Prime B760M-A WiFi D4", 99, "black", "LGA1700", "B760", "Micro-ATX", "DDR4", 4, 128, 2, true, 1, "KNOWN"],
  ["mb-msi-b760-gaming-plus-wifi", "MSI", "B760 Gaming Plus WiFi", 141, "black", "LGA1700", "B760", "ATX", "DDR5", 4, 192, 2, true, 2, "KNOWN"],
  ["mb-msi-z790-p-wifi", "MSI", "Pro Z790-P WiFi", 164, "black", "LGA1700", "Z790", "ATX", "DDR5", 4, 192, 4, true, 2, "KNOWN"],
  ["mb-asus-tuf-b760-plus-wifi", "ASUS", "TUF Gaming B760-Plus WiFi", 170, "black", "LGA1700", "B760", "ATX", "DDR5", 4, 192, 3, true, 2, "KNOWN"],
  ["mb-msi-z790-tomahawk-wifi", "MSI", "MAG Z790 Tomahawk WiFi", 206, "black", "LGA1700", "Z790", "ATX", "DDR5", 4, 192, 4, true, 3, "KNOWN"],
  // ---- LGA1851 ----
  ["mb-msi-b840m-b", "MSI", "Pro B840M-B", 90, "black", "LGA1851", "B840", "Micro-ATX", "DDR5", 2, 128, 2, false, 1, "VERIFIED"],
  ["mb-gb-b840m-ds3h", "Gigabyte", "B840M DS3H", 116, "black", "LGA1851", "B840", "Micro-ATX", "DDR5", 4, 256, 2, false, 1, "VERIFIED"],
  ["mb-asus-prime-b860m-k", "ASUS", "Prime B860M-K", 140, "black", "LGA1851", "B860", "Micro-ATX", "DDR5", 2, 128, 2, false, 1, "VERIFIED"],
  ["mb-msi-b860-p-wifi", "MSI", "Pro B860-P WiFi", 171, "black", "LGA1851", "B860", "ATX", "DDR5", 4, 256, 3, true, 2, "KNOWN"],
  ["mb-msi-b860-gaming-plus-wifi", "MSI", "B860 Gaming Plus WiFi", 181, "black", "LGA1851", "B860", "ATX", "DDR5", 4, 256, 3, true, 2, "KNOWN"],
  ["mb-msi-z890-s-wifi", "MSI", "Pro Z890-S WiFi6E", 220, "black", "LGA1851", "Z890", "ATX", "DDR5", 4, 256, 4, true, 2, "KNOWN"],
  ["mb-asus-strix-z890-f", "ASUS", "ROG Strix Z890-F Gaming WiFi", 306, "black", "LGA1851", "Z890", "ATX", "DDR5", 4, 192, 5, true, 3, "KNOWN"],
];

export const MOTHERBOARDS: ComponentOf<"MOTHERBOARD">[] = ROWS.map(
  ([id, brand, model, price, finish, socket, chipset, formFactor, ramType, ramSlots, maxRamGB, m2Slots, wifi, tier, confidence]) => ({
    id, category: "MOTHERBOARD", brand, model, finish, price, confidence,
    specs: { socket, chipset, formFactor, ramType, ramSlots, maxRamGB, m2Slots, wifi, released: CHIPSET_RELEASED[chipset], tier } satisfies MotherboardSpecs,
  }),
);
