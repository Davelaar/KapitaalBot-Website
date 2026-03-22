import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site";
import { KENNIS_SLUGS } from "@/lib/kennis-slugs";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  const now = new Date();
  const kennis = KENNIS_SLUGS.map((slug) => ({
    url: `${base}/kennis/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.75,
  }));
  return [
    { url: base, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${base}/dashboard`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/kennis`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    ...kennis,
    { url: `${base}/faq`, lastModified: now, changeFrequency: "monthly", priority: 0.65 },
    { url: `${base}/changelog`, lastModified: now, changeFrequency: "weekly", priority: 0.55 },
    { url: `${base}/tier2-request`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/docs`, lastModified: now, changeFrequency: "weekly", priority: 0.65 },
    { url: `${base}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.45 },
  ];
}
