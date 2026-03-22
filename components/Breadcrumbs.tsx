"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { useLocale } from "@/lib/locale";
import { stripLocalePathname } from "@/lib/locale-path";
import { t } from "@/lib/i18n";
import { getSiteUrl } from "@/lib/site";
import { buildBreadcrumbItems } from "@/lib/breadcrumb-labels";

export function Breadcrumbs() {
  const pathname = usePathname();
  const locale = useLocale();

  const items = useMemo(() => {
    const stripped = stripLocalePathname(pathname);
    return buildBreadcrumbItems(locale, stripped);
  }, [pathname, locale]);

  const jsonLd = useMemo(() => {
    if (items.length < 2) return null;
    const base = getSiteUrl().replace(/\/+$/, "");
    return {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: items.map((it, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: it.label,
        item: `${base}${it.href.startsWith("/") ? it.href : `/${it.href}`}`,
      })),
    };
  }, [items]);

  if (items.length < 2) return null;

  return (
    <>
      <nav
        aria-label={t(locale, "breadcrumb.ariaLabel")}
        style={{
          width: "100%",
          maxWidth: 1440,
          margin: "0 auto",
          padding: "0.5rem 1.5rem 0",
          fontSize: "0.8125rem",
          color: "var(--muted)",
        }}
      >
        <ol
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: "0.35rem",
            listStyle: "none",
            margin: 0,
            padding: 0,
          }}
        >
          {items.map((it, i) => {
            const isLast = i === items.length - 1;
            return (
              <li
                key={`${it.href}-${i}`}
                style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem" }}
              >
                {i > 0 ? (
                  <span aria-hidden style={{ color: "var(--border)", userSelect: "none" }}>
                    /
                  </span>
                ) : null}
                {isLast ? (
                  <span style={{ color: "var(--fg)", fontWeight: 500 }} aria-current="page">
                    {it.label}
                  </span>
                ) : (
                  <Link href={it.href} style={{ color: "var(--accent)", textDecoration: "none" }}>
                    {it.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
      {jsonLd ? (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      ) : null}
    </>
  );
}
