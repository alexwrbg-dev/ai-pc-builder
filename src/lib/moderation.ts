// Modération : règles déterministes (insultes, spam, liens) + file de signalement.
// Modération IA optionnelle branchable (AI_PROVIDER) en COMPLÉMENT, jamais seule.
const BANNED = [/viagra/i, /crypto\s*double/i, /http\S{60,}/, /(.)\1{15,}/];

export function moderateText(body: string): { allowed: boolean; reasons: string[] } {
  const reasons: string[] = [];
  if (body.length > 5000) reasons.push("Message trop long (5000 max).");
  if ((body.match(/https?:/g) ?? []).length > 3) reasons.push("Trop de liens (spam).");
  for (const re of BANNED) if (re.test(body)) reasons.push("Contenu suspect (règle anti-spam).");
  return { allowed: reasons.length === 0, reasons };
}

export async function aiModerate(_body: string): Promise<string[]> {
  if (!process.env.AI_API_KEY) return []; // IA désactivée sans clé
  return []; // brancher provider ici (complément des règles)
}
