// Mise en place d'un modèle 3D importé dans l'emplacement d'une pièce, sans dépendre de ses unités
// ni de son orientation d'origine : on fait correspondre ses dimensions à celles de la pièce.

export type Vec3 = [number, number, number];

/** Les 6 façons d'associer les axes du modèle (colonnes) aux axes de la scène x, y, z. */
const PERMUTATIONS: [number, number, number][] = [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]];

export interface Fit {
  /** Matrice 3×3 (lignes) qui envoie les axes du modèle sur ceux de la scène ; déterminant +1 (rotation pure). */
  basis: [Vec3, Vec3, Vec3];
  /** Échelle uniforme : le modèle garde ses proportions. */
  scale: number;
}

/**
 * Choisit l'association d'axes qui rapproche le plus les proportions du modèle de celles de l'emplacement
 * (comparaison des rapports en logarithme), puis l'échelle qui fait tenir le modèle dans l'emplacement.
 */
export function fitToBox(source: Vec3, target: Vec3): Fit {
  const safe = (v: number) => Math.max(v, 1e-6);
  let best = PERMUTATIONS[0];
  let bestScore = Infinity;
  for (const p of PERMUTATIONS) {
    // Écart des proportions : on compare chaque rapport dimension du modèle / dimension visée à leur moyenne.
    const ratios = [0, 1, 2].map((i) => Math.log(safe(target[i]) / safe(source[p[i]])));
    const mean = (ratios[0] + ratios[1] + ratios[2]) / 3;
    const score = ratios.reduce((s, r) => s + (r - mean) ** 2, 0);
    if (score < bestScore - 1e-9) { bestScore = score; best = p; }
  }
  const basis: [Vec3, Vec3, Vec3] = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
  for (let i = 0; i < 3; i++) basis[i][best[i]] = 1;
  // Une permutation impaire est un miroir : on retourne un axe pour garder une vraie rotation.
  const odd = [[0, 2, 1], [1, 0, 2], [2, 1, 0]].some((q) => q.every((v, i) => v === best[i]));
  if (odd) basis[2][best[2]] = -1;
  const scale = Math.min(...[0, 1, 2].map((i) => safe(target[i]) / safe(source[best[i]])));
  return { basis, scale };
}
