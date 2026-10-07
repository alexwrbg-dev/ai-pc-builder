import { MetadataRoute } from "next";
export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.AUTH_URL ?? "http://localhost:3000";
  const slugs = ["pc-gamer-1000-euros", "pc-gamer-1500-euros", "pc-gamer-2000-euros", "pc-1440p", "pc-4k"];
  return [
    { url: `${base}/`, changeFrequency: "daily", priority: 1 },
    { url: `${base}/builder`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/compare`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/community`, changeFrequency: "daily", priority: 0.8 },
    ...slugs.map((s) => ({ url: `${base}/pc/${s}`, changeFrequency: "weekly" as const, priority: 0.8 })),
    { url: `${base}/affiliate-disclosure`, changeFrequency: "monthly" as const, priority: 0.3 },
  ];
}
