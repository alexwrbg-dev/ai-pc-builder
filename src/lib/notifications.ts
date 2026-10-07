// Notifications : email (Resend/SMTP) ou web push — architecture prête, provider via env.
// Sans EMAIL_PROVIDER configuré : file d'attente en mémoire + log (aucun envoi fantôme).
import { z } from "zod";

const AlertSchema = z.object({
  email: z.string().email().optional(),
  componentId: z.string().optional(),
  targetPrice: z.number().positive(),
});

const queue: unknown[] = [];

export async function enqueueAlert(input: unknown) {
  const parsed = AlertSchema.safeParse(input);
  if (!parsed.success) return { ok: false as const, error: "Alerte invalide" };
  queue.push({ ...parsed.data, at: new Date().toISOString() });
  const provider = process.env.EMAIL_PROVIDER ?? "none";
  if (provider === "none") {
    console.log("[notify] alerte en file (email non configuré)", parsed.data);
    return { ok: true as const, queued: true, sent: false };
  }
  // Prod : Resend/SMTP ici
  return { ok: true as const, queued: true, sent: false };
}

export function pendingAlerts() { return queue; }
