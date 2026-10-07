// Liens d'achat. Aucun prix marchand n'est affiché : seulement un lien vers la fiche ou la recherche Amazon.
// Le tag d'affiliation n'est ajouté que si NEXT_PUBLIC_AMAZON_TAG est renseigné dans .env.
import type { Component } from "./types";

export const AMAZON_TAG = (process.env.NEXT_PUBLIC_AMAZON_TAG ?? "").trim();

/** Mention imposée par le Programme Partenaires Amazon dès qu'un lien affilié est affiché. */
export const AMAZON_DISCLOSURE = "En tant que Partenaire Amazon, je réalise un bénéfice sur les achats remplissant les conditions requises.";

export function amazonUrl(c: Pick<Component, "brand" | "model" | "asin">, tag: string = AMAZON_TAG): string {
  const url = c.asin
    ? new URL(`https://www.amazon.fr/dp/${c.asin}`)
    : new URL("https://www.amazon.fr/s");
  if (!c.asin) url.searchParams.set("k", `${c.brand} ${c.model}`);
  if (tag) url.searchParams.set("tag", tag);
  return url.toString();
}
