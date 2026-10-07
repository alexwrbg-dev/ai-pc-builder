import type { MetadataRoute } from "next";
import { GUIDES } from "@/lib/guides";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.AUTH_URL ?? "http://localhost:3000";
  return [
    { url: `${base}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/builder`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/composants`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/pc`, changeFrequency: "weekly", priority: 0.8 },
    ...GUIDES.map((g) => ({ url: `${base}/pc/${g.slug}`, changeFrequency: "weekly" as const, priority: 0.7 })),
    { url: `${base}/about`, changeFrequency: "monthly" as const, priority: 0.3 },
    { url: `${base}/affiliate-disclosure`, changeFrequency: "monthly" as const, priority: 0.3 },
  ];
}
