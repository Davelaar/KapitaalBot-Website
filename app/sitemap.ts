import type { MetadataRoute } from "next";
import fs from "fs";
import path from "path";
import { locales } from "@/lib/i18n";
import { getSiteUrl } from "@/lib/site";
import { withLocale } from "@/lib/locale-path";
import { KENNIS_SLUGS } from "@/lib/kennis-slugs";

const DOCS_DIR = path.join(process.cwd(), "content", "docs");

function getDocSlugs(): string[] {
  if (!fs.existsSync(DOCS_DIR)) return [];
  return fs
    .readdirSync(DOCS_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
}

const PATHS = [
  "",
  "/dashboard",
  "/kennis",
  "/over",
  "/faq",
  "/changelog",
  "/tier2-request",
  "/docs",
  "/contact",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl().replace(/\/+$/, "");
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const p of PATHS) {
      const pathSeg = p === "" ? "/" : p;
      const urlPath = withLocale(locale, pathSeg);
      const url = `${base}${urlPath}`;
      const priority =
        p === ""
          ? 1
          : p === "/dashboard"
            ? 0.9
            : p === "/kennis"
              ? 0.85
              : p === "/over"
                ? 0.8
                : p === "/faq" || p === "/docs"
                  ? 0.65
                  : p === "/changelog"
                    ? 0.55
                    : p === "/tier2-request"
                      ? 0.5
                      : 0.45;
      entries.push({
        url,
        lastModified: now,
        changeFrequency: p === "" || p === "/dashboard" ? "daily" : "weekly",
        priority,
      });
    }

    for (const slug of KENNIS_SLUGS) {
      entries.push({
        url: `${base}${withLocale(locale, `/kennis/${slug}`)}`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.75,
      });
    }

    for (const slug of getDocSlugs()) {
      entries.push({
        url: `${base}${withLocale(locale, `/docs/${slug}`)}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.62,
      });
    }
  }

  return entries;
}
