import type { Metadata } from "next";

const SITE = "AI PC Builder";
const BASE = process.env.AUTH_URL ?? "http://localhost:3000";

export function baseMetadata(over: Partial<Metadata> = {}): Metadata {
  return {
    metadataBase: new URL(BASE),
    title: { default: `${SITE} — Décris ton PC, l'IA le construit`, template: `%s · ${SITE}` },
    description:
      "Décris le PC dont tu rêves. L'IA le construit, vérifie chaque composant, l'optimise pour ton budget et te montre où acheter les pièces.",
    openGraph: {
      type: "website", siteName: SITE, locale: "fr_FR",
      images: [{ url: "/og-default.png", width: 1200, height: 630, alt: SITE }],
    },
    twitter: { card: "summary_large_image" },
    robots: { index: true, follow: true },
    ...over,
  };
}

export function buildJsonLd(args: { name: string; price: number | null; url: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: args.name,
    category: "Computer",
    offers: args.price ? { "@type": "Offer", priceCurrency: "EUR", price: args.price, availability: "https://schema.org/InStock" } : undefined,
    url: args.url,
  };
}
