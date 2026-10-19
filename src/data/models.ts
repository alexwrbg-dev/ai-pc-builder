// Généré par scripts/modeles.mjs à partir de public/models : ne pas modifier à la main.
export interface OfficialModel {
  /** Fichier .glb de la pièce (ou du bloc pompe d'un watercooling). */
  file?: string;
  /** Watercooling : fichier .glb du radiateur. */
  radiator?: string;
  /** Rotation forcée en degrés (x, y, z) ; sinon l'orientation est déduite des proportions. */
  rotation?: [number, number, number];
  radiatorRotation?: [number, number, number];
}

export const MODELS: Record<string, OfficialModel> = {};
