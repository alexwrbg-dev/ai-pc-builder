// Analytics minimaliste, respectueux (aucun tracker tiers, aucun PII).
// Les événements sont seulement écrits dans la console du serveur pour l'instant.
export type AnalyticsName =
  | "build_created" | "build_completed" | "merchant_click"
  | "search" | "recommend" | "configurator_abandon";

export async function track(name: AnalyticsName, props?: Record<string, unknown>): Promise<void> {
  if (process.env.ANALYTICS_ENABLED === "false") return;
  // Prod : insert Prisma AnalyticsEvent. Démo : log serveur uniquement.
  if (process.env.NODE_ENV !== "test") {
    console.log(`[analytics] ${name}`, props ?? {});
  }
}
