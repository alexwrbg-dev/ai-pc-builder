import type { Metadata } from "next";

const SITE = "AI PC Builder";
const BASE = process.env.AUTH_URL ?? "http://localhost:3000";

export function baseMetadata(over: Partial<Metadata> = {}): Metadata {
  return {
    metadataBase: new URL(BASE),
    title: { default: `${SITE} — Décris ton PC, on en tire les plans`, template: `%s · ${SITE}` },
    description:
      "Donne ton budget et ton usage : des configurations de PC qui s'assemblent vraiment, chiffrées aux prix du moment et montées en 3D à l'échelle.",
    openGraph: { type: "website", siteName: SITE, locale: "fr_FR" },
    robots: { index: true, follow: true },
    ...over,
  };
}
