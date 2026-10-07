// Lecture d'une demande en français → besoins structurés. Règles simples, sans IA :
// tout ce qui est compris est renvoyé dans `understood` pour que l'utilisateur puisse le vérifier.
import type { Resolution, Usage } from "./types";
import { GAMES } from "./perf";

export interface Requirements {
  budget: number | null;
  usage: Usage;
  resolution: Resolution | null;
  games: string[];
  white: boolean;
  rgb: boolean | null;
  silent: boolean;
  compact: boolean;
  wifi: boolean;
  cpuBrand: "AMD" | "Intel" | null;
  gpuBrand: "NVIDIA" | "AMD" | "Intel" | null;
  storageGB: number | null;
}

export const DEFAULT_REQUIREMENTS: Requirements = {
  budget: null, usage: "gaming", resolution: null, games: [],
  white: false, rgb: null, silent: false, compact: false, wifi: false,
  cpuBrand: null, gpuBrand: null, storageGB: null,
};

function toNumber(raw: string): number {
  return parseFloat(raw.replace(/[\s  ]/g, "").replace(",", "."));
}

export function parseBudget(text: string): number | null {
  const t = text.toLowerCase();
  const CUR = "(?:€|euros?|eur\\b|balles|boules)";
  // « 1,5k € », « 2k euros », « 1.5 k€ »
  let m = t.match(new RegExp(`(\\d+(?:[.,]\\d+)?)\\s?k\\s?${CUR}`));
  if (m) return Math.round(toNumber(m[1]) * 1000);
  // « 1,5k » : un nombre décimal suivi de k ne peut pas être une définition d'écran
  m = t.match(/(\d+[.,]\d+)\s?k\b/);
  if (m) return Math.round(toNumber(m[1]) * 1000);
  // « 1 500 € », « 1500€ », « 1200 balles »
  m = t.match(new RegExp(`(\\d{1,3}(?:[\\s\\u00a0\\u202f.]\\d{3})+|\\d{3,5})(?:[.,]\\d{1,2})?\\s?${CUR}`));
  if (m) return Math.round(toNumber(m[1].replace(/\./g, "")));
  // « budget de 1200 », « budget : 900 », « max 1500 »
  m = t.match(/(?:budget|maximum|max|jusqu'à|jusqu'a|pour)\s*(?:de|d'|:|est de|environ|~)?\s*(\d{3,5})\b(?!\s?(?:p\b|hz|go|gb|w\b|mm|fps|to\b))/);
  if (m) {
    const n = toNumber(m[1]);
    if (![1080, 1440, 2160].includes(n)) return n;
  }
  return null;
}

function has(t: string, pattern: RegExp): boolean {
  return pattern.test(t);
}

export function parseRequirements(text: string): Requirements {
  const t = ` ${text.toLowerCase()} `;

  const resolution: Resolution | null =
    has(t, /\b4k\b|2160|\buhd\b/) ? "4K"
    : has(t, /1440|\bqhd\b|\bwqhd\b|\b2k\b/) ? "1440p"
    : has(t, /1080|full ?hd|\bfhd\b/) ? "1080p" : null;

  const games = GAMES.filter((g) => g.keywords.some((k) => new RegExp(`\\b${k.replace(/[-\s]/g, "[-\\s]?")}\\b`).test(t))).map((g) => g.name);

  const noGaming = has(t, /(pas|sans|aucun) (de |du |pour (le |les )?)?(jeux?|jouer|gaming)/);
  const gaming = !noGaming && (games.length > 0 || has(t, /\bjeux?\b|\bjouer\b|gaming|gamer|\bfps\b|esport/));
  const usage: Usage =
    has(t, /stream|twitch|\bobs\b/) ? "streaming"
    : gaming ? "gaming"
    : has(t, /montage|vid[ée]o|blender|rendu|\b3d\b|photoshop|premiere|davinci|after effects|cr[ée]ation|cao\b|d[ée]velopp|programm|\bcode\b|\bcoder\b|compil|machine learning|\bia\b/) ? "creation"
    : has(t, /bureautique|bureau\b|word|excel|internet|navigation|mails?\b|t[ée]l[ée]travail|[ée]tudes?|famil/) ? "bureautique"
    : "gaming";

  const noRgb = has(t, /(sans|pas de|aucun|z[ée]ro) (rgb|leds?|lumi[èe]res?)|sobre/);
  const storage = t.match(/(\d+(?:[.,]\d+)?)\s?to\b/);

  return {
    budget: parseBudget(text),
    usage,
    resolution,
    games,
    white: has(t, /\bblanc(he|s|hes)?\b|\bwhite\b/),
    rgb: noRgb ? false : has(t, /rgb|\bleds?\b|lumineu/) ? true : null,
    silent: has(t, /silenc|discret|sans bruit|pas de bruit|\bcalme\b/),
    compact: has(t, /compact|petit (pc|bo[îi]tier|format)|\bmini\b|micro[- ]?atx|\bmatx\b|peu de place/),
    wifi: has(t, /wi-?fi/),
    cpuBrand: has(t, /ryzen|processeur amd|cpu amd|full amd/) ? "AMD" : has(t, /\bintel core\b|processeur intel|cpu intel|core i\d|core ultra/) ? "Intel" : null,
    gpuBrand: has(t, /nvidia|geforce|\brtx\b|dlss/) ? "NVIDIA" : has(t, /radeon|\brx ?\d|carte (graphique )?amd|full amd/) ? "AMD" : has(t, /\barc\b/) ? "Intel" : null,
    storageGB: storage ? Math.round(toNumber(storage[1]) * 1000) : null,
  };
}

const USAGE_LABEL: Record<Usage, string> = {
  gaming: "Jeu", creation: "Création", streaming: "Jeu + streaming", bureautique: "Bureautique",
};

/** Résumé lisible de ce qui a été compris, pour l'afficher à l'utilisateur. */
export function describeRequirements(r: Requirements): string[] {
  const out: string[] = [];
  out.push(r.budget ? `Budget ${r.budget.toLocaleString("fr-FR")} €` : "Budget non précisé");
  out.push(USAGE_LABEL[r.usage]);
  if (r.resolution) out.push(r.resolution);
  out.push(...r.games);
  if (r.white) out.push("Blanc");
  if (r.rgb === true) out.push("RGB");
  if (r.rgb === false) out.push("Sans RGB");
  if (r.silent) out.push("Silencieux");
  if (r.compact) out.push("Compact");
  if (r.wifi) out.push("WiFi");
  if (r.cpuBrand) out.push(`Processeur ${r.cpuBrand}`);
  if (r.gpuBrand) out.push(`Carte graphique ${r.gpuBrand}`);
  if (r.storageGB) out.push(`${r.storageGB >= 1000 ? `${r.storageGB / 1000} To` : `${r.storageGB} Go`} de stockage`);
  return out;
}
