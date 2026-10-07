// Guides par budget : le texte est fixe, les configurations sont recalculées à partir du catalogue.
import { DEFAULT_REQUIREMENTS, type Requirements } from "./requirements";

export interface Guide {
  slug: string;
  title: string;
  kicker: string;
  intro: string;
  prompt: string;
  requirements: Requirements;
}

const gamer = (budget: number, intro: string): Guide => ({
  slug: `pc-gamer-${budget}-euros`,
  title: `PC gamer à ${budget.toLocaleString("fr-FR")} €`,
  kicker: "PC gamer",
  intro,
  prompt: `PC gamer à ${budget} €`,
  requirements: { ...DEFAULT_REQUIREMENTS, budget, usage: "gaming" },
});

export const GUIDES: Guide[] = [
  gamer(1000, "À ce budget, la mémoire et la carte graphique se disputent chaque euro. On vise le jeu en 1080p, avec une plateforme qui garde une marge d'évolution quand c'est possible."),
  gamer(1500, "Le budget où le 1440p devient confortable. Le choix se joue entre plus de carte graphique tout de suite, ou une plateforme plus récente à faire évoluer."),
  gamer(2000, "De quoi jouer en 1440p avec tous les réglages poussés, et garder de la marge sur l'alimentation et le boîtier."),
  gamer(3000, "Le haut de gamme raisonnable : 1440p à très haute fréquence, ou 4K avec l'upscaling."),
  {
    slug: "pc-bureautique-700-euros", title: "PC de bureautique à 700 €", kicker: "Bureautique",
    intro: "Pour le travail, la navigation et la vidéo, une carte graphique est inutile : la puce intégrée au processeur suffit. Le budget part dans le confort.",
    prompt: "PC de bureautique à 700 €",
    requirements: { ...DEFAULT_REQUIREMENTS, budget: 700, usage: "bureautique" },
  },
  {
    slug: "pc-montage-video-2500-euros", title: "PC de montage vidéo à 2 500 €", kicker: "Création",
    intro: "Le montage et le rendu demandent des cœurs, de la mémoire et du stockage rapide, avant la carte graphique.",
    prompt: "PC pour le montage vidéo à 2500 €",
    requirements: { ...DEFAULT_REQUIREMENTS, budget: 2500, usage: "creation" },
  },
];
