"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useLocale } from "@/lib/locale";
import { t } from "@/lib/i18n";

interface MermaidLiveDiagramProps {
  chart: string;
  /** Optional i18n key prefix, e.g. 'diagram.home.arch'. */
  seoKeyPrefix?: string;
}

let mermaidInitialized = false;

function hashText(input: string): string {
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = (hash + (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24)) >>> 0;
  }
  return hash.toString(16);
}

export function MermaidLiveDiagram({ chart, seoKeyPrefix }: MermaidLiveDiagramProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  /** wait = not yet in view; busy = loading mermaid / rendering */
  const [phase, setPhase] = useState<"wait" | "busy" | "done">("wait");
  const chartId = useMemo(() => `mermaid-live-${hashText(chart)}`, [chart]);
  const locale = useLocale();

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    let cancelled = false;

    async function renderChart() {
      try {
        const mermaid = (await import("mermaid")).default;
        if (cancelled) return;

        if (!mermaidInitialized) {
          mermaid.initialize({
            startOnLoad: false,
            securityLevel: "loose",
            theme: "base",
            themeVariables: {
              darkMode: false,
              background: "#161f33",
              mainBkg: "#202c46",
              secondaryColor: "#1b2640",
              tertiaryColor: "#12192b",
              primaryTextColor: "#e7edf7",
              secondaryTextColor: "#b8c3d9",
              tertiaryTextColor: "#8b96ad",
              lineColor: "#6f7c91",
              primaryBorderColor: "#32415f",
              secondaryBorderColor: "#26324b",
              clusterBkg: "#1b2640",
              clusterBorder: "#32415f",
              defaultLinkColor: "#8b96ad",
              titleColor: "#e7edf7",
              edgeLabelBackground: "#202c46",
              actorBkg: "#161f33",
              actorBorder: "#32415f",
              actorTextColor: "#e7edf7",
              actorLineColor: "#59f8fc",
              signalColor: "#59f8fc",
              signalTextColor: "#e7edf7",
              labelBoxBkgColor: "#202c46",
              labelBoxBorderColor: "#32415f",
              labelTextColor: "#e7edf7",
              loopTextColor: "#b8c3d9",
              activationBorderColor: "#59f8fc",
              activationBkgColor: "rgba(89,248,252,0.12)",
              sectionBkgColor: "#202c46",
              altSectionBkgColor: "#161f33",
              gridColor: "#26324b",
              errorBkgColor: "rgba(201,75,89,0.18)",
              errorTextColor: "#c94b59",
            },
            flowchart: {
              htmlLabels: false,
              useMaxWidth: true,
            },
          });
          mermaidInitialized = true;
        }

        const { svg } = await mermaid.render(chartId, chart.trim());
        if (cancelled) return;
        if (ref.current) {
          ref.current.innerHTML = svg;
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(t(locale, "mermaid.error.render_failed"));
          if (ref.current) ref.current.innerHTML = "";
        }
        console.error("Mermaid render error", err);
      } finally {
        if (!cancelled) setPhase("done");
      }
    }

    function scheduleRender() {
      const run = () => {
        if (cancelled) return;
        setPhase("busy");
        void renderChart();
      };
      if (typeof window.requestIdleCallback === "function") {
        window.requestIdleCallback(run, { timeout: 2000 });
      } else {
        window.setTimeout(run, 1);
      }
    }

    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return;
        io.disconnect();
        scheduleRender();
      },
      { rootMargin: "180px 0px", threshold: 0 }
    );

    io.observe(node);
    return () => {
      cancelled = true;
      io.disconnect();
    };
  }, [chart, chartId, locale]);

  const title = seoKeyPrefix ? t(locale, `${seoKeyPrefix}.title`) : undefined;
  const caption = seoKeyPrefix ? t(locale, `${seoKeyPrefix}.caption`) : undefined;
  const desc = seoKeyPrefix ? t(locale, `${seoKeyPrefix}.desc`) : undefined;

  return (
    <figure
      className="mermaid-wrapper"
      style={{
        width: "100%",
        maxWidth: "100%",
        minWidth: 0,
        boxSizing: "border-box",
      }}
    >
      {error ? (
        <p className="mermaid-error">{error}</p>
      ) : (
        <div
          ref={ref}
          className="mermaid-diagram"
          {...(title
            ? { role: "img" as const, "aria-label": title }
            : {})}
          style={{ minHeight: phase === "busy" ? "4rem" : undefined }}
        />
      )}
      {phase === "busy" && !error ? (
        <p className="mermaid-loading" style={{ color: "var(--muted)", fontSize: "0.85rem", margin: "0.25rem 0 0" }}>
          …
        </p>
      ) : null}
      {(title || caption) && (
        <figcaption className="mermaid-caption">
          {title && <strong>{title}</strong>}
          {caption && (
            <span style={{ marginLeft: title ? "0.35rem" : 0, fontSize: "0.9em" }}>{caption}</span>
          )}
        </figcaption>
      )}
      {desc && (
        <p className="mermaid-longdesc">
          {desc}
        </p>
      )}
    </figure>
  );
}
