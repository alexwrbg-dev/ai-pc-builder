import { z } from "zod";

const id = z.string().min(1).max(80).optional();

export const BuildSelectionSchema = z.object({
  CPU: id, GPU: id, MOTHERBOARD: id, RAM: id, SSD: id, PSU: id, CASE: id, COOLER: id,
}).strict();

export const RequirementsSchema = z.object({
  budget: z.number().int().min(100).max(50000).nullable(),
  usage: z.enum(["gaming", "creation", "streaming", "bureautique"]),
  resolution: z.enum(["1080p", "1440p", "4K"]).nullable(),
  games: z.array(z.string().max(40)).max(12),
  white: z.boolean(),
  rgb: z.boolean().nullable(),
  silent: z.boolean(),
  compact: z.boolean(),
  wifi: z.boolean(),
  cpuBrand: z.enum(["AMD", "Intel"]).nullable(),
  gpuBrand: z.enum(["NVIDIA", "AMD", "Intel"]).nullable(),
  storageGB: z.number().int().min(100).max(16000).nullable(),
});

/** Une demande écrite, ou des besoins déjà structurés. */
export const RecommendSchema = z.union([
  z.object({ prompt: z.string().min(3).max(2000) }).strict(),
  z.object({ requirements: RequirementsSchema }).strict(),
]);
