// Pages produit Amazon.fr de chaque pièce (ASIN = code à 10 caractères après /dp/ dans l'adresse).
// Relevé le 19/10/2026 à partir des résultats de recherche limités à amazon.fr : le titre en commentaire est
// celui de la fiche retenue. Une pièce absente de cette liste garde un lien vers la recherche Amazon.
// Pour corriger un lien : ouvrir la bonne fiche sur amazon.fr et recopier le code après /dp/.
export const AMAZON_ASIN: Record<string, string> = {
  "cpu-r5-8400f": "B0D2JD6P86", // AMD Ryzen 5 8400F Processor (6 Cores/12 Threads, 65W DTP, Socket AM5, 22MB Cache, up to 4.7GHz Max Boost Frequ
  "cpu-r5-7500f": "B0D1CK42PV", // AMD Ryzen 5 7500F - 3.7 GHz - 6 cores - 12 Threads - 32 MB Cache - Socket AM5 - OEM
  "cpu-r5-9600x": "B0D6NN6TM7", // AMD Ryzen 5 9600X Processor (Integrated Graphics Radeon, 6 Cores/12 Threads, 65W TDP, Socket AM5, Cache 38MB, 
  "cpu-r5-7600": "B0BMQJWBDM", // AMD Ryzen 5 7600 Processor (Integrated Graphics Radeon, 6 Cores/12 Threads, 65W TDP, Socket AM5, 38MB Cache, U
  "cpu-r5-7600x": "B0BBJDS62N", // Processeur AMD Ryzen 5 7600X AMD AM5
  "cpu-r5-7500x3d": "B0FT8X951Z", // AMD Ryzen 5 7500X3D Box
  "cpu-r7-7700x": "B0BBHHT8LY", // AMD Ryzen 7 7700X Processor (Integrated Graphics Radeon, 8 Cores/16 Threads, 105W DTP, Socket AM5, Cache 40MB,
  "cpu-r7-7800x3d": "B0BTZB7F88", // AMD Ryzen 7 7800X3D Processor with 3D V-Cache Technology (Integrated Graphics Radeon, 8 Cores/16 Threads, 120W
  "cpu-r9-9900x": "B0D6NN87T8", // AMD Ryzen 9 9900X Processor (Integrated Graphics Radeon, 12 Cores/24 Threads, 120W TDP, Socket AM5, Cache 76MB
  "cpu-r7-9700x": "B0D6NMDNNX", // AMD Ryzen 7 9700X Processor (8 Cores/16 Threads), 65W DTP, Socket AM5, 40MB Cache, Up to 5.5 GHz Frequency Boo
  "cpu-r7-9800x3d": "B0DKFMSMYK", // AMD RYZEN 7 9800X3D 8 Cores/16 Unbridled Threads, Zen Architecture 5, 104 MB Cache, 120W TDP, Up to 5.2 GHz Fr
  "cpu-r7-9850x3d": "B0G8JMLXNQ", // AMD RYZEN 7 9850X3D 8 Cores / 16 Unlocked Threads Zen Architecture 5, 104MB Cache (L2+L3), TDP 120W, Up to 5.6
  "cpu-r9-9950x": "B0D6NNRBGP", // AMD Ryzen 9 9950X Processor (Integrated Graphics Radeon, 16 Cores/32 Threads, 170 W TDP, Socket AM5, 80MB Cach
  "cpu-r5-5500": "B09VCJ171S", // AMD Ryzen 5 5500 Processeur (6 Coeurs/12 Threads, 65W TDP, Socket AM4, Cache 19Mo, jusqu'à 4.2 GHz Fréquence B
  "cpu-r5-5600xt": "B0DJLWFRCH", // AMD Ryzen 5 5600XT Processor, 6 Cores/12 Unbridled Threads, 35MB Cache, 65W TDP, Up to 4.7GHz Frequency Boost,
  "cpu-r5-5600g": "B092L9GF5N", // AMD Ryzen 5 5600G Processor (Integrated Graphics Radeon, 6 Cores/12 Threads, 65W TDP, Socket AM4, 19MB Cache, 
  "cpu-i3-14100f": "B0CQ2ZVCWV", // Intel Core i3-14100F, 4-Core Desktop Processor (4 P-Cores + 0 E-Core) up to 4.7 GHz
  "cpu-i5-14400f": "B0CQ3142LB", // Intel Core i5-14400F, Desktop Processor, 10 Cores (6 P-Cores + 4 E-Cores) up to 4.7 GHz
  "cpu-i5-12400f": "B09MDFH5HY", // Intel Core i5-12400F, Desktop Processor 18 MB Cache, Up to 4.40 GHz
  "cpu-i5-14600kf": "B0CHBH63YX", // Intel Core i5-14600KF Desktop Processor 14 Cores (6 P-Cores + 8 E-Cores) up to 5.3 GHz
  "cpu-i7-14700kf": "B0CGJC178L", // Intel Computer Processor Core i7-14700KF, blue
  "cpu-i9-14900kf": "B0CHBJXG7G", // Intel Core i9-14900KF Desktop Processor 24 Cores (8 P-Cores + 16 E-Cores) up to 6.0 GHz, Black
  "cpu-u5-225f": "B0DTRMDXJ5", // Intel Core Ultra 5 Desktop Processor 225F, 10 Cores (6 P-Cores + 4 E-Cores) up to 4.9 GHz
  "cpu-u5-245k": "B0DFK2P311", // Intel Core Ultra 5 245K Desktop Processor 14 Cores (6 P-Cores + 8 E-Cores) up to 5.2 GHz
  "cpu-u5-250k-plus": "B0GMKXVVJQ", // Intel Core Ultra 5 Processor 250K Plus 18 (6 P-Cores + 12 E-Cores) up to 5.3 GHz
  "cpu-u7-265kf": "B0DFK2WHF8", // Intel Core Ultra 7 265KF Desktop Processor 20 Cores (8 P-Cores + 12 E-Cores) up to 5.5 GHz
  "cpu-u7-270k-plus": "B0GMLJCBBM", // Intel Core Ultra 7 Processor 270K Plus 24 (8 P-Cores + 16 E-Cores) up to 5.5 GHz
  "cpu-u9-285k": "B0DFKC99VL", // Intel Core Ultra 9 285K Desktop Processor 24 Cores (8 P-Cores + 16 E-Cores) up to 5.7 GHz
  "gpu-gb-5050-lp": "B0FFTQF9LK", // GIGABYTE GeForce RTX 5050 OC Low Profile 8G Graphics Card ... GV-N5050OC-8GL
  "gpu-intel-b580-le": "B0DPM9923G", // Intel Arc B580 Battlemage Limited Edition 12GB GDDR6
  "gpu-msi-5060-gaming-oc": "B0972C4MS9", // MSI NVIDIA GeForce RTX 5060 8G Gaming OC Graphics Card
  "gpu-gb-5060-gaming-oc": "B0F6NJT2K6", // GIGABYTE GeForce RTX 5060 Gaming OC 8G ... GV-N5060GAMING OC-8GD
  "gpu-asus-5060-dual": "B0F7HZ9QSZ", // ASUS Dual GeForce RTX 5060 8GB GDDR7 OC Edition Graphics Card Gaming
  "gpu-msi-5060ti8-ventus2x": "B0F32ND24S", // MSI NVIDIA GeForce RTX 5060 Ti 8G Ventus 2X OC Plus Graphics Card
  "gpu-gb-5060ti8-windforce": "B0F4ZFPVC1", // GIGABYTE GeForce RTX 5060 Ti WINDFORCE OC 8G ... GV-N506TWF2OC-8GD
  "gpu-gb-9060xt-gaming-oc": "B0F7HTR8DQ", // GIGABYTE Radeon RX 9060 XT Gaming OC 16G ... GV-R9060XTGAMING OC-16GD
  "gpu-asus-9060xt-prime": "B0F7LTBFZF", // ASUS Prime Radeon RX 9060 XT 16GB GDDR6 OC Edition
  "gpu-asus-5060ti16-dual": "B0F4DVKSZ4", // ASUS Dual GeForce RTX 5060 Ti 16GB GDDR7 OC Edition Graphics Card Gaming
  "gpu-asus-5060ti16-prime": "B0F4DQYLP5", // ASUS Prime GeForce RTX 5060 Ti 16GB GDDR7 OC Edition Graphics Card The SFF-Ready
  "gpu-sapphire-9070-pulse": "B0DRPSF34T", // Sapphire Pulse AMD Radeon RX 9070 Gaming 16GB Dual HDMI/Dual DP
  "gpu-gb-5070-gaming-oc": "B0DTGNTQ3C", // GIGABYTE GeForce RTX 5070 Gaming OC 12G ... GV-N5070GAMING OC-12GD
  "gpu-msi-5070-ventus2x": "B0DX7JJ87N", // MSI NVIDIA GeForce RTX 5070 12G Ventus 2X OC Graphics Card
  "gpu-gb-5070-windforce-sff": "B0DTGP2WMT", // GIGABYTE GeForce RTX 5070 WINDFORCE OC SFF 12G ... GV-N5070WF3OC-12GD
  "gpu-sapphire-9070xt-pulse": "B0DRPRZMK2", // Sapphire Pulse AMD Radeon RX 9070 XT Gaming 16GB Dual HDMI/Dual DP
  "gpu-asus-9070xt-prime": "B0DSG52H7D", // ASUS Prime Radeon RX 9070 XT 16GB GDDR6 OC Edition Graphics Card Gaming
  "gpu-sapphire-9070xt-pure": "B0DRPRKYR6", // Sapphire Pure AMD Radeon RX 9070 XT Gaming OC 16GB Dual HDMI/Dual DP
  "gpu-gb-9070xt-gaming-oc": "B0DT7B79K9", // GIGABYTE Radeon RX 9070 XT Gaming OC 16G ... GV-R9070XTGAMING OC-16GD
  "gpu-gb-5070ti-windforce-sff": "B0DTGNB9Q5", // GIGABYTE GeForce RTX 5070 Ti WINDFORCE OC SFF 16G ... GV-N507TWF3OC-16GD
  "gpu-msi-5070ti-ventus3x": "B0DV9GC9SR", // MSI NVIDIA GeForce RTX 5070 Ti 16G Ventus 3X OC Graphics Card
  "gpu-gb-5070ti-eagle-ice": "B0DTQT98M3", // GIGABYTE GeForce RTX 5070 Ti Eagle OC ICE SFF 16G ... GV-N507TEAGLEOC ICE-16GD
  "gpu-msi-5070ti-gaming-trio": "B0F1NJF1K4", // MSI NVIDIA GeForce RTX 5070 Ti 16G Gaming Trio OC Graphics Card
  "gpu-asus-5080-prime": "B0DS65VMC6", // ASUS Prime GeForce RTX 5080 16GB GDDR7 OC Edition Graphics Card Gaming
  "gpu-msi-5080-gaming-trio": "B0BX6LGM2X", // MSI NVIDIA GeForce RTX 5080 16G Gaming Trio OC Graphics Card
  "gpu-gb-5080-windforce-sff": "B0DT9Y2B49", // Gigabyte GeForce RTX 5080 WINDFORCE OC SFF 16G ... GV-N5080WF3OC-16GD
  "gpu-gb-5080-aero-sff": "B0DSQ3B6PH", // GIGABYTE GeForce RTX 5080 Aero OC SFF 16G ... GV-N5080AERO OC-16GD
  "gpu-msi-5090-ventus3x": "B0DT6S77JK", // MSI NVIDIA GeForce RTX 5090 32G Ventus 3X OC Graphics Card
  "mb-gb-b650m-gaming-wifi6e": "B0DTYZJQXC", // GIGABYTE B650M Gaming WIFI6E Motherboard - AMD Ryzen 9000 Series Processors, VRM 5+2+2 Phases...
  "mb-gb-b650-eagle-ax": "B0CSKH1NJF", // GIGABYTE B650 Eagle AX Motherboard - AMD Ryzen 9000 series, VRM 12+2+2 Phases...
  "mb-gb-b650-gaming-x-ax-v2": "B0CSKH56WN", // GIGABYTE B650 Gaming X AX V2 Motherboard - AMD Ryzen 9000 Series, VRM 8+2+2 Phases...
  "mb-asus-tuf-b650-plus-wifi": "B0BHJKR3BV", // ASUS TUF GAMING B650-PLUS WIFI AMD Ryzen AM5 ATX Gaming Motherboard (14 Power Phases, PCIe 5.0 M.2 Support, DD
  "mb-gb-b850-eagle-wifi6e": "B0DQNW4J1G", // GIGABYTE B850 Eagle WIFI6E Motherboard - AMD Ryzen 9000 Series CPUs, Digital VRM 8+2+2 Phases...
  "mb-msi-b850-gaming-plus-wifi": "B0DPKV94MX", // MSI B850 Gaming Plus WiFi Motherboard ATX, AM5
  "mb-gb-b850-aorus-elite-ice": "B0DQM7H82V", // GIGABYTE B850 AORUS Elite WIFI7 Ice Motherboard - AMD Ryzen 9000 Series CPUs, Digital VRM 14+2+2 Phases...
  "mb-msi-b850m-mortar-wifi": "B0F4Q45RKX", // MSI MAG B850M Mortar WiFi Motherboard Micro ATX, AM5
  "mb-gb-x870-eagle-wifi7": "B0DFYZCPYW", // GIGABYTE X870 Eagle WIFI7 Motherboard - Supports AMD Ryzen 9000 processors, VRM at 14+2+2 Phases...
  "mb-asus-strix-b850-a": "B0DP5FBV4P", // ASUS ROG Strix B850-A Gaming WiFi AMD ATX Motherboard, 14+2+2 Power Stages
  "mb-gb-x870-aorus-elite-ice": "B0DGVGRVLQ", // GIGABYTE X870 AORUS Elite WIFI7 Ice AM5 LGA 1718, ATX, DDR5, 4X M.2, PCIe 5.0, USB4, Wi-FI 7, 2.5GbE LAN, EZ-L
  "mb-gb-x870-aorus-elite": "B0DFQG1KYC", // GIGABYTE X870 AORUS Elite WIFI7 Carte Mère
  "mb-msi-x870e-tomahawk": "B0BT9Q9KTN", // MSI MAG X870E Tomahawk WiFi Motherboard ATX, AM5
  "mb-asus-strix-x870e-e": "B0DGQ7NHT2", // ASUS ROG Strix X870E-E Gaming WiFi - AMD Ryzen AM5 X870E ATX Gaming
  "mb-msi-a520m-a-pro": "B08HHMCCXV", // MSI A520M-A Pro Motherboard Micro-ATX, AM4
  "mb-gb-b550m-k": "B0BW66YHB5", // GIGABYTE B550M K Motherboard - AMD Ryzen 5000 processors, up to 4733 MHz DDR4...
  "mb-gb-b550m-aorus-elite": "B08BN8VD23", // GIGABYTE B550M AORUS Elite Motherboard - AMD Ryzen 5000 Processors, VRM 5+3 Phases...
  "mb-asus-prime-b550-plus": "B089HGSZ1J", // ASUS PRIME B550-PLUS AMD B550 (Ryzen AM4) Motherboard with Dual M.2, PCIe 4.0, DDR4 4400...
  "mb-msi-b550-a-pro": "B08BCQF1BD", // MSI B550-A Pro Motherboard ATX, AM4
  "mb-msi-h610m-e-ddr4": "B0BKRDV1V3", // MSI Pro H610M-E DDR4 Motherboard Micro-ATX, LGA 1700
  "mb-msi-b760m-p-ddr4": "B0BMM7M56F", // MSI Pro B760M-P DDR4 Motherboard Micro-ATX, LGA 1700
  "mb-asus-prime-b760m-a-wifi-d4": "B0BNQGQF43", // ASUS PRIME B760M-A WIFI D4 - Intel B760 LGA 1700 Micro-ATX Motherboard (DDR4, PCIe 4.0...)
  "mb-msi-b760-gaming-plus-wifi": "B0BZD3BMZL", // MSI B760 Gaming Plus WiFi Motherboard ATX, LGA 1700
  "mb-msi-z790-p-wifi": "B09XWR42S5", // MSI Pro Z790-P WiFi Motherboard, ATX, LGA 1700
  "mb-asus-tuf-b760-plus-wifi": "B0BVKYWPFT", // ASUS TUF GAMING B760-PLUS WIFI Intel B760 LGA 1700 ATX Gaming Motherboard (DDR5, PCIe 5.0...)
  "mb-msi-z790-tomahawk-wifi": "B09Y1FJBHX", // MSI MAG Z790 Tomahawk WiFi Motherboard, ATX, LGA 1700
  "mb-msi-b840m-b": "B0F84CBWVC", // MSI Pro B840M-B Micro ATX Motherboard for AMD Ryzen 9000/8000/7000, AM5...
  "mb-gb-b840m-ds3h": "B0DXFZCJSD", // GIGABYTE B840M DS3H Motherboard - AMD Ryzen 9000 Processors, VRM 8+2+2 Phases...
  "mb-asus-prime-b860m-k": "B0DPMPSGF6", // ASUS Prime B860M-K, Intel mATX Motherboard, 6+1+1 Power Stages DrMOS, DDR5...
  "mb-msi-b860-p-wifi": "B0BX6MRR8N", // MSI Pro B860-P WiFi Motherboard ATX, LGA 1851
  "mb-msi-b860-gaming-plus-wifi": "B0BSLLQ72R", // MSI B860 Gaming Plus WiFi ATX Motherboard, LGA1851
  "mb-msi-z890-s-wifi": "B0GMWKJT7G", // MSI Pro Z890-S WIFI6E Motherboard ATX, LGA 1851
  "mb-asus-strix-z890-f": "B0DJDFR3L5", // ASUS ROG Strix Z890-F Gaming WiFi - Intel ATX Gaming Motherboard (DDR5, 16+1+2+2 DrMOS...)
  "ram-lpx-d4-16": "B0143UM4TC", // Corsair CMK16GX4M2B3200C16, Vengeance LPX 16GB (2x8GB) DDR4 Up to 3200MHz C16 XMP 2.0 High Performance Memory 
  "ram-fury-d4-16": "B097K2WBL3", // Kingston FURY Beast 16GB (2x8GB) 3200MHz DDR4 CL16 Memory Kit for PC Kit of 2 KF432C16BBK2/16
  "ram-ripjaws-d4-32": "B07Z86WC1Z", // G.Skill F4-3600C18D-32GVK 32GB DIMM DDR4 Ripjaws V PC4-28800 (3600 MHz) Memory Kit (2x16GB) Black
  "ram-vengeance-rs-d4-32": "B09C5X1T7V", // Corsair Vengeance RGB RS 32GB (2x16GB) DDR4 up to 3200MHz C16 Desktop Memory Black
  "ram-fury-d4-32": "B097K2WKZW", // Kingston FURY Beast 32GB (2x16GB) 3200MHz DDR4 CL16 Memory Kit for PC Kit of 2 KF432C16BB1K2/32
  "ram-vengeance-d5-16": "B0BZHXGYWS", // CORSAIR Vengeance DDR5 16GB (2 x 8GB) Up to 5200MHz Intel RAM
  "ram-fury-d5-16": "B0BRTJCLBJ", // Kingston FURY Beast Black DDR5 16GB (2x8GB) 5600MT/s CL36 DIMM - KF556C36BBEK2-16
  "ram-crucial-pro-d5-32": "B0DHFD5625", // Crucial CP2K16G64C38U5B Pro RAM 32GB Kit (2x16GB) 6400MHz CL38, Overclocking Gaming, Black
  "ram-fury-d5-32-5600": "B09N63G5R7", // Kingston Fury Beast Black DDR5 32GB (2x16GB) 5600MT/s CL40 DIMM - KF556C40BBK2-32
  "ram-fury-rgb-d5-32-5600": "B0BD5VH64R", // Kingston FURY Beast RGB 32GB (2x16GB) 5600MT/s DDR5 CL36 DIMM - KF556C36BBEAK2-32
  "ram-fury-rgb-d5-32-6000-cl36": "B0BD5XBFS6", // Kingston FURY Beast DDR5 RGB 32GB (2x16GB) 6000MT/s DDR5 CL36 DIMM - KF560C36BBEAK2-32
  "ram-flare-x5-d5-32": "B0BFGB2D2Z", // G.Skill DDR5 32GB PC 6000 CL36 (2x16GB) 32-GX2-FX5 Flare AMD
  "ram-vengeance-d5-32": "B0C3RYHZJQ", // CORSAIR Vengeance DDR5 RAM 32GB (2x16GB) 6000MHz CL30 Intel XMP Compatible iCUE Computer Memory
  "ram-fury-white-rgb-d5-32": "B0CYM3WSHX", // Kingston FURY Beast RGB 32GB (2x16GB) 6000MT/s DDR5 CL30 DIMM - KF560C30BWEAK2-32 White
  "ram-fury-rgb-d5-32-6000-cl30": "B0CYM58GFS", // Kingston FURY Beast RGB 32GB (2x16GB) 6000MT/s DDR5 CL30 DIMM - KF560C30BBEAK2-32
  "ram-trident-neo-white-d5-32": "B0CJX8K4XT", // G.Skill Trident Z5 Neo RGB Series (AMD Expo) DDR5 RAM 32GB (2x16GB) 6000MT/s CL30-36-36-96 1.35V - Matte White
  "ram-fury-d5-64-6000": "B0CYHC9FQB", // Kingston FURY Beast Black DDR5 64GB (2x32GB) 6000MT/s CL30 DIMM - KF560C30BBEK2-64
  "ram-fury-d5-64-5600": "B0BRTK3R15", // Kingston FURY Beast Black DDR5 64GB (2x32GB) 5600MT/s CL36 DIMM - KF556C36BBEK2-64
  "ram-trident-rgb-d5-64": "B0C5Z8VJN5", // G.skill Trident Z5 Rgb - Ddr5 - Kit - 64GB: 2 x 32GB - 6800 MHz - Cl34 - Mattschwarz (F5-6800J3445G32GX2-TZ5RK
  "ssd-nv3-500": "B0DBR9RZLV", // Kingston NV3 NVMe PCIe 4.0 SSD Internal 500GB M.2 2280-SNV3S/500G
  "ssd-e100-1tb": "B0DQSJYD12", // Crucial E100 1TB PCIe Gen4 NVMe M.2 SSD Internal, Up to 5000MB/s - CT1000E100SSD8
  "ssd-nv3-1tb": "B0DBR3DZWG", // Kingston NV3 NVMe PCIe 4.0 Internal SSD 1TB M.2 2280-SNV3S/1000G
  "ssd-sn3000-1tb": "B0DMHKPC6J", // WESTERN DIGITAL WD Green SN3000 PCIe Gen4 x4 NVMe 1TB
  "ssd-990-evo-plus-1tb": "B0DGH2FH7T", // Samsung SSD Internal 990 Evo Plus MZ-V9S1T0BW, NVMe 2.0 PCIe 4.0 x 4/5.0x2, 1 TB
  "ssd-sn7100-1tb": "B0DN7CYYSD", // WD_BLACK SN7100 NVMe SSD 1TB (up to 7250MB/s/6900MB/s, M.2 2280, PCIe Gen4)
  "ssd-990-pro-1tb": "B0B9C3ZVHR", // Samsung 990 Pro NVMe M.2 PCIe 4.0 Internal SSD, 1TB, MZ-V9P1T0BW
  "ssd-9100-pro-1tb": "B0DWFMD52T", // Samsung Internal SSD 9100 Pro, NVMe 2.0 PCIe 5.0x4, 1TB, MZ-VAP1T0BW
  "ssd-kc3000-1tb": "B09K7F5VJQ", // Kingston KC3000 PCIe 4.0 NVMe M.2 2280 SSD 1024GB - SKC3000S/1024G
  "ssd-t705-1tb": "B0CTRV9CVP", // Crucial T705 SSD 1TB PCIe Gen5 NVMe M.2 - CT1000T705SSD3
  "ssd-sn3000-2tb": "B0DMHYRWG1", // WESTERN DIGITAL - WDS200T4G0E - Internal SSD - Green - SN3000 - NVMe - 2 TB
  "ssd-nv3-2tb": "B0DBR6TRZQ", // Kingston NV3 NVMe PCIe 4.0 Internal SSD 2TB M.2 2280-SNV3S/2000G
  "ssd-mp600-elite-2tb": "B0CSG68HF4", // Corsair MP600 Elite 2 to M.2 PCIe Gen4 x4 NVMe SSD - M.2 2280 - Black
  "ssd-p310-2tb": "B0DC8RVRBZ", // Crucial P310 SSD 2TB PCIe Gen4 NVMe M.2 2280 - CT2000P310SSD801
  "ssd-990-evo-plus-2tb": "B0DGHB9V34", // Samsung Internal SSD 990 EVO Plus, NVMe 2.0 PCIe 4.0 x4/5.0x2, 2TB, MZ-V9S2T0BW
  "ssd-kc3000-2tb": "B09K7DRMSC", // Kingston KC3000 Internal SSD 2TB 2TB SSD Hard Drive
  "ssd-990-pro-2tb": "B0B9C4DKKG", // Samsung 990 Pro NVMe M.2 PCIe 4.0 Internal SSD, 2TB, MZ-V9P2T0BW
  "ssd-9100-pro-2tb": "B0DWFLPMM5", // Samsung Internal SSD 9100 Pro, NVMe 2.0 PCIe 5.0x4, 2TB, MZ-VAP2T0BW
  "ssd-renegade-g5-2tb": "B0F4455L4R", // Kingston Fury Renegade G5 PCIe 5.0 NVMe M.2 2280 SSD 2T-SFYR2S/2T0
  "ssd-nv3-4tb": "B0DJ1QC42R", // Kingston NV3 NVMe PCIe 4.0 Internal SSD 4TB M.2 2280-SNV3S/4000G
  "ssd-990-evo-plus-4tb": "B0DGH3HBHJ", // Samsung Internal SSD 990 EVO Plus, NVMe 2.0 PCIe 4.0 x4/5.0x2, 4TB, MZ-V9S4T0BW
  "ssd-990-pro-4tb": "B0CBYZ6DD1", // Samsung 990 Pro NVMe M.2 PCIe 4.0 Internal SSD, 4TB, MZ-V9P4T0BW
  "ssd-a400-960": "B079XC5PVV", // Kingston A400 Internal SSD 2.5 Inch SATA Rev 3.0, 960GB - SA400S37/960G
  "ssd-870-evo-1tb": "B08PC5DKZQ", // Samsung SSD 870 Evo SATA III 2.5 Inch 1TB MZ-77E1T0B/EU
  "psu-corsair-cx550": "B0CK8MXWK1", // CORSAIR CX550 ATX 550W Power Supply - Black
  "psu-msi-a650bn": "B0991TZ399", // MSI MAG A650BN Power Supply, EU Plug - 650W, Certified 80 Plus Bronze
  "psu-bq-sp11-650": "B0F5X7QZKY", // be quiet! System Power 11 650W Power Supply, ATX 3.1
  "psu-bq-pp12-550": "B0DLH7PRGY", // be quiet! Pure Power 12 550W Power Supply, 80 Plus Gold, ATX 3.1
  "psu-bq-sp11-750": "B0F5WZZH54", // be quiet! System Power 11 750W Power Supply, ATX 3.1
  "psu-bq-pp12-650": "B0DLH776YJ", // be quiet! Pure Power 12 650W Power Supply, 80 Plus Gold, ATX 3.1
  "psu-corsair-rm650e": "B0DMTLB5LJ", // CORSAIR RM650e (2025) Fully Modular Quiet ATX Power Supply with 12V-2x6 Cable - ATX 3.1 - Black
  "psu-gb-ud750gm-pg5": "B0CNGY7CHH", // GIGABYTE 750W - GP-UD750GM PG5-80+ Gold
  "psu-bq-pp12-850": "B0DLH73G3W", // be quiet! Pure Power 12 850W Power Supply, 80 Plus Gold, ATX 3.1
  "psu-bq-pp13m-650": "B0F9YYVX6R", // be quiet! Pure Power 13 M 650W Modular PC Power Supply ATX 3.1, 80+ Gold
  "psu-corsair-rm750e": "B0DMTMK2Q5", // CORSAIR RM750e (2025) Modular & Silent ATX Power Supply - Black
  "psu-msi-a750gl": "B0C3M86HCB", // MSI MAG A750GL PCIE5 Modular Power Supply ATX 3.1, 80 Plus Gold
  "psu-msi-a850gl": "B0C3MC57D5", // MSI MAG A850GL PCIE5 Modular Power Supply ATX 3.1, 80 PLUS Gold
  "psu-corsair-rm750e-white": "B0F3DSGFSG", // CORSAIR RM750e (2025) Fully Modular Low Noise ATX Power Supply with 12V-2x6
  "psu-bq-pp12-1000": "B0DLHB1QVR", // be quiet! Pure Power 12 1000W Power Supply, 80 Plus Gold, ATX 3.1
  "psu-corsair-rm850e": "B0DMTN5WLB", // CORSAIR RM850e (2025) Modular & Silent ATX Power Supply - Black
  "psu-msi-a1000gls": "B0DMSWJL8G", // MSI MAG A1000GLS PCIE5 PC Power Supply, 1000W, ATX, 80 Plus Gold, ATX 3.1
  "psu-bq-pp13m-850": "B0F9YW611F", // be quiet! Pure Power 13 M 850W Modular PC Power Supply ATX 3.1, 80+ Gold
  "psu-msi-a1250gl": "B0CXQ67GZH", // MSI MAG A1250GL PCIE5 Modular Power Supply ATX 3.1, 80 Plus Gold
  "psu-corsair-rm850x": "B0D9C1DT62", // CORSAIR RM850x Fully Modular & Silent ATX Power Supply - Black
  "psu-corsair-rm1000e": "B0DMTN57C1", // CORSAIR RM1000e (2025) Modular & Silent ATX Power Supply - Black
  "psu-corsair-rm1000x": "B0D9C3P46P", // CORSAIR RM1000x Fully Modular & Silent ATX Power Supply - Black
  "case-msi-forge-100r": "B07YQ7HXBD", // MSI MAG Forge 100R Gaming Case ATX, Micro-ATX and Mini-ITX
  "case-corsair-3200d-black": "B0GBY1GSDX", // CORSAIR 3200D RS Medium Tower PC Case, 3 RS120 Fans Included - Black
  "case-corsair-3200d-white": "B0GBY5RGHM", // CORSAIR 3200D RS Medium Tower PC Case, 3 RS120 Fans Included - White
  "case-nzxt-h3-flow-white": "B0DQPNLC65", // NZXT H3 Flow Micro-ATX Airflow PC Case - White
  "case-msi-pano-110r-black": "B0BSLKQ1K3", // MSI MAG PANO 110R PZ Gaming Case ATX, Micro-ATX and Mini-ITX
  "case-msi-pano-110r-white": "B0DQD82GQP", // MSI MAG PANO 110R PZ White Gaming Case ATX, Micro-ATX and Mini-ITX
  "case-msi-forge-320r": "B0CFYKNHW7", // MSI MAG Forge 320R Airflow ATX, Micro-ATX and Mini-ITX Gaming Case
  "case-nzxt-h5-flow-rgb": "B0D2MJT1FY", // NZXT H5 Flow RGB Mid-Tower ATX Compact PC Case - Black
  "case-fractal-pop2-vision-black": "B0FV352BCT", // Fractal Design Pop 2 Vision Black RGB Gaming PC Case with Panoramic Glass
  "case-bq-pure-base-501": "B0DGXR6TTD", // be quiet! Pure Base 501 Airflow Black PC Gaming ATX Mid-Tower Case
  "case-fractal-pop2-vision-white": "B0FV32421Q", // Fractal Design Pop 2 Vision White RGB Gaming PC Case with Panoramic Glass - Dual Chamber Design - 4 Reverse RG
  "case-corsair-4000d-rs-argb": "B0DFHNV7TK", // CORSAIR FRAME 4000D RS ARGB Medium ATX Modular Case - Black
  "case-nzxt-h9-flow-black": "B0DQPPKNSS", // NZXT H9 Flow (2025) - Large ATX Mid-Tower Dual Chamber Air Flow Case - Includes 3 x 140mm Fans and 1x 120mm Fa
  "case-nzxt-h6-flow-white": "B0C89G9QDK", // NZXT H6 Flow - Compact Dual Chamber ATX PC Case - White
  "case-fractal-north-black": "B09V878FXQ", // Fractal Design North Charcoal Black - Wood Walnut front - Mesh side panels - Two 140mm Aspect PWM fans include
  "case-fractal-north-white": "B09Y9FSZFX", // Fractal Design North Chalk White - Wood Oak front - Mesh side panels - Two 140mm Aspect PWM fans included...
  "case-nzxt-h9-flow-white": "B0DQPRVD4C", // NZXT H9 Flow - ATX Double Chamber PC Case - White
  "case-corsair-5000d-rs-argb-white": "B0F3XMTVLV", // CORSAIR Frame 5000D RS ARGB High Airflow Mid-Tower Modular Enclosure - 4 x Pre-Installed RS Fans, InfiniRail F
  "case-fractal-north-xl": "B0CJCK95ZC", // Fractal Design North XL Charcoal Black Mesh- three 140mm Aspect PWM fans included- Type C USB- EATX airflow fu
  "case-bq-silent-base-802": "B08NW4MK1X", // be quiet! Silent Base 802 Window Black PC Gaming ATX Mid-Tower Case
  "cool-bq-pure-rock-pro-3-black": "B0DWZF7K1Y", // be quiet! Pure Rock Pro 3 Black Fan Heatsink ... 2 Pure Wings 3 120mm PWM Fans
  "cool-bq-dark-rock-5": "B0CJY3DYQ3", // be quiet! Dark Rock 5 ... Silent Wings 4 120mm PWM Fan ... BK035
  "cool-bq-dark-rock-elite": "B0CJY2QS2W", // be quiet! Dark Rock Elite Tower processor cooler, 280 W TDP
  "cool-msi-a13-240-black": "B0DLP34ZJX", // MSI MAG CORELIQUID A13 240 ARGB Watercooling Kit for Intel & AMD CPU
  "cool-msi-a13-240-white": "B0DLNZY23J", // MSI MAG CORELIQUID A13 240 WHITE ARGB Watercooling Kit for Intel & AMD CPU
  "cool-nzxt-kraken-plus-240": "B0F5S84X8P", // NZXT Kraken Plus 240 RGB - AIO Liquid CPU Cooler - 240mm ... - Black
  "cool-bq-pure-loop-3-240": "B0FLWQ7D4D", // be quiet! Pure Loop 3 240mm All-In-One Water Cooling System ... 2 Pure Wings 3 120mm
  "cool-msi-a13-360-white": "B0BSLS6YRG", // MSI MAG CORELIQUID A13 360 WHITE Watercooling AIO
  "cool-corsair-nautilus-240": "B0DF7DH5Z5", // CORSAIR NAUTILUS 240 RS Liquid CPU Cooler - Black
  "cool-bq-pure-loop-3-280": "B0FLWNY6VK", // be quiet! Pure Loop 3 280mm All-in-One Water Cooling System ... 2 Pure Wings 3
  "cool-corsair-nautilus-360": "B0DF7B7324", // CORSAIR NAUTILUS 360 RS Liquid CPU Cooler - Black
  "cool-corsair-nautilus-360-white": "B0DF7G8JFP", // CORSAIR NAUTILUS 360 RS ARGB Liquid CPU Cooler - 360mm AIO ... - White
  "cool-msi-a13-360-black": "B0DM4BRSV5", // MSI MAG Coreliquid A13 360 AIO ARGB CPU Liquid Cooler ... Triple 120mm ARGB PWM Fans, Black
  "cool-bq-silent-loop-3-360": "B0DWZJNH28", // be quiet! Silent Loop 3 360mm liquid cooling system ... 3 Silent Wings 4 120mm
};

/** Pièces sans fiche Amazon sûre : lien vers la recherche. */
export const AMAZON_MISSING = ["ram-textorm-d4-16", "psu-seasonic-gx1000-white", "cool-bq-pure-rock-3", "cool-bq-pure-rock-pro-3", "cool-bq-dark-rock-pro-5", "cool-cm-360-core-ii", "cool-bq-pure-loop-3-360", "cool-bq-light-loop-360-black", "cool-bq-light-loop-360-white", "cool-bq-silent-loop-3-420"];
