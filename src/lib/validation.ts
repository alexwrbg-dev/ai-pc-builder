import { z } from "zod";

export const BuildSelectionSchema = z.object({
  CPU: z.string().optional(), GPU: z.string().optional(),
  MOTHERBOARD: z.string().optional(), RAM: z.string().optional(),
  SSD_NVME: z.string().optional(), PSU: z.string().optional(),
  CASE: z.string().optional(), CPU_COOLER: z.string().optional(),
  AIO: z.string().optional(),
}).strict();

export const RecommendSchema = z.object({
  prompt: z.string().min(3).max(2000),
  variant: z.enum(["value", "balanced", "max", "all"]).default("all"),
});

export const ChatSchema = z.object({
  message: z.string().min(1).max(2000),
  selection: BuildSelectionSchema.optional(),
  history: z.array(z.object({ role: z.enum(["user", "assistant"]), content: z.string() })).max(20).optional(),
});

export const PriceAlertSchema = z.object({
  componentId: z.string().optional(),
  buildId: z.string().optional(),
  targetPrice: z.number().positive(),
  email: z.string().email().optional(),
});

export function rateLimitNote(): string {
  return "Rate limiting: 60 req/min/IP sur /api/ai/* (middleware prod, voir SECURITY.md).";
}
