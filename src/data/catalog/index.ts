import type { Component } from "@/lib/types";
import { CPUS } from "./cpu";
import { GPUS } from "./gpu";
import { MOTHERBOARDS } from "./motherboard";
import { RAMS } from "./ram";
import { SSDS } from "./storage";
import { PSUS } from "./psu";
import { CASES } from "./case";
import { COOLERS } from "./cooler";

/** Date du relevé des prix indicatifs (comparateurs et revendeurs français). */
export const PRICE_DATE = "2026-10-07";

export const CATALOG: Component[] = [...CPUS, ...GPUS, ...MOTHERBOARDS, ...RAMS, ...SSDS, ...PSUS, ...CASES, ...COOLERS];

export { CPUS, GPUS, MOTHERBOARDS, RAMS, SSDS, PSUS, CASES, COOLERS };
