import type { Component } from "@/lib/types";
import { CPUS } from "./cpu";
import { GPUS } from "./gpu";
import { MOTHERBOARDS } from "./motherboard";
import { RAMS } from "./ram";
import { SSDS } from "./storage";
import { PSUS } from "./psu";
import { CASES } from "./case";
import { COOLERS } from "./cooler";
import { AMAZON_ASIN } from "../amazon";

/** Date du relevé des prix indicatifs (comparateurs et revendeurs français). */
export const PRICE_DATE = "2026-10-07";

/** Toutes les pièces, avec le code de leur fiche Amazon.fr quand il est connu (src/data/amazon.ts). */
export const CATALOG: Component[] = [...CPUS, ...GPUS, ...MOTHERBOARDS, ...RAMS, ...SSDS, ...PSUS, ...CASES, ...COOLERS].map(
  (c) => (AMAZON_ASIN[c.id] ? { ...c, asin: AMAZON_ASIN[c.id] } : c) as Component,
);

export { CPUS, GPUS, MOTHERBOARDS, RAMS, SSDS, PSUS, CASES, COOLERS };
