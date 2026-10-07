// ============================================================
// ORCHESTRATION — demande écrite → besoins structurés → optimiseur → moteur de compatibilité.
// Le parcours par défaut n'utilise aucune IA générative : il est entièrement déterministe.
// Un modèle de langage peut, en option, rédiger une explication à partir des faits déjà calculés.
// ============================================================
import { fullName, resolveBuild } from "./catalog";
import { recommendAll, type Recommendation } from "./optimizer";
import { describeRequirements, parseRequirements, type Requirements } from "./requirements";
import { CATEGORIES, CATEGORY_LABEL } from "./types";

export interface RecommendResponse {
  requirements: Requirements;
  understood: string[];
  builds: Recommendation[];
}

export function recommendFromPrompt(prompt: string): RecommendResponse {
  return recommendFromRequirements(parseRequirements(prompt));
}

export function recommendFromRequirements(requirements: Requirements): RecommendResponse {
  return { requirements, understood: describeRequirements(requirements), builds: recommendAll(requirements) };
}

/** Résumé factuel d'une recommandation, donné en contexte au modèle de langage. */
function factSheet(r: Recommendation): string {
  const { build } = resolveBuild(r.selection);
  const parts = CATEGORIES.filter((s) => build[s]).map((s) => `${CATEGORY_LABEL[s]} : ${fullName(build[s]!)} (${build[s]!.price} €)`);
  return [`Profil ${r.profile} — total ${r.total} € pour un budget de ${r.budget} €`, ...parts, ...r.notes].join("\n");
}

/**
 * Explication rédigée par un modèle de langage, facultative (AI_PROVIDER=openai + AI_API_KEY).
 * Le modèle ne reçoit que des faits calculés et n'a aucun moyen de modifier la configuration.
 */
export async function llmExplain(prompt: string, builds: Recommendation[]): Promise<string | null> {
  const provider = process.env.AI_PROVIDER ?? "heuristic";
  const key = process.env.AI_API_KEY;
  if (provider !== "openai" || !key) return null;
  try {
    const res = await fetch(`${process.env.AI_BASE_URL || "https://api.openai.com/v1"}/chat/completions`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        model: process.env.AI_MODEL ?? "gpt-4o-mini",
        max_tokens: 500,
        messages: [
          { role: "system", content: "Tu es un conseiller en matériel PC. Tu expliques en français, simplement, les configurations fournies. Tu n'inventes aucune référence, aucun prix, aucune compatibilité : tout vient du contexte." },
          { role: "user", content: `Demande : ${prompt}\n\nConfigurations calculées :\n${builds.map(factSheet).join("\n\n")}` },
        ],
      }),
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.choices?.[0]?.message?.content ?? null;
  } catch {
    return null;
  }
}
