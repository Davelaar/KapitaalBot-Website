"use client";

import { useState, useCallback } from "react";
import { useLocale } from "@/lib/locale";
import { t } from "@/lib/i18n";

interface MermaidRendererProps {
  code: string;
  id?: string;
}

function fnv1a32Hex(input: string): string {
  let hash = 0x811c9dc5; // FNV offset basis
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = (hash + (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24)) >>> 0;
  }
  return hash.toString(16).padStart(8, "0");
}

const MIN_ZOOM = 0.5;
const MAX_ZOOM = 2;
const ZOOM_STEP = 1.25;

export function MermaidRenderer({ code, id }: MermaidRendererProps) {
  const locale = useLocale();
  const [zoom, setZoom] = useState(1.25);
  const [naturalSize, setNaturalSize] = useState<{ w: number; h: number } | null>(null);

  const trimmed = code?.trim() ?? "";
  if (!trimmed) return null;

  let filename = "";
  if (id === "home-arch-diagram") {
    filename = "/diagrams/home-architecture-flow.svg";
  } else if (id === "tier-flow") {
    filename = "/diagrams/tier-model-observability.svg";
  } else if (id === "bot-flow") {
    filename = "/diagrams/bot-export-pipeline.svg";
  } else {
    const hash = fnv1a32Hex(trimmed);
    filename = `/diagrams/mermaid-${hash}.svg`;
  }

  const ariaLabel =
    id === "home-arch-diagram"
      ? t(locale, "mermaid.alt.homeArch")
      : id === "tier-flow"
        ? t(locale, "mermaid.alt.tierFlow")
        : id === "bot-flow"
          ? t(locale, "mermaid.alt.botFlow")
          : t(locale, "mermaid.alt.generic");

  const onLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    if (img.naturalWidth && img.naturalHeight) {
      setNaturalSize({ w: img.naturalWidth, h: img.naturalHeight });
    }
  }, []);

  const zoomIn = () => setZoom((z) => Math.min(MAX_ZOOM, z * ZOOM_STEP));
  const zoomOut = () => setZoom((z) => Math.max(MIN_ZOOM, z / ZOOM_STEP));
  const zoomReset = () => setZoom(1.25);

  const w = naturalSize?.w ?? 800;
  const h = naturalSize?.h ?? 400;

  return (
    <div style={{ marginBottom: "0.75rem", width: "100%", minWidth: 0 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          marginBottom: "0.5rem",
          flexWrap: "wrap",
        }}
      >
        <span style={{ fontSize: "0.8125rem", color: "var(--muted)" }}>{t(locale, "mermaid.control.label")}</span>
        <button
          type="button"
          onClick={zoomOut}
          disabled={zoom <= MIN_ZOOM}
          aria-label={t(locale, "mermaid.control.zoomOut")}
          style={{
            padding: "0.25rem 0.5rem",
            fontSize: "0.875rem",
            background: "var(--card-bg)",
            border: "1px solid var(--border)",
            borderRadius: 6,
            color: "var(--muted)",
            cursor: zoom <= MIN_ZOOM ? "not-allowed" : "pointer",
            opacity: zoom <= MIN_ZOOM ? 0.5 : 1,
          }}
        >
          −
        </button>
        <button
          type="button"
          onClick={zoomReset}
          aria-label={t(locale, "mermaid.control.zoomReset")}
          style={{
            padding: "0.25rem 0.5rem",
            fontSize: "0.8125rem",
            background: "var(--card-bg)",
            border: "1px solid var(--border)",
            borderRadius: 6,
            color: "var(--muted)",
            cursor: "pointer",
          }}
        >
          {Math.round(zoom * 100)}%
        </button>
        <button
          type="button"
          onClick={zoomIn}
          disabled={zoom >= MAX_ZOOM}
          aria-label={t(locale, "mermaid.control.zoomIn")}
          style={{
            padding: "0.25rem 0.5rem",
            fontSize: "0.875rem",
            background: "var(--card-bg)",
            border: "1px solid var(--border)",
            borderRadius: 6,
            color: "var(--muted)",
            cursor: zoom >= MAX_ZOOM ? "not-allowed" : "pointer",
            opacity: zoom >= MAX_ZOOM ? 0.5 : 1,
          }}
        >
          +
        </button>
      </div>
      <div
        style={{
          overflow: "auto",
          width: "100%",
          maxHeight: "70vh",
          border: "1px solid var(--border)",
          borderRadius: 8,
          background: "var(--card-bg)",
        }}
      >
        <div
          style={{
            width: w * zoom,
            height: h * zoom,
          }}
        >
          <img
            src={filename}
            alt={ariaLabel}
            width={w}
            height={h}
            style={{
              display: "block",
              width: w * zoom,
              height: h * zoom,
              maxWidth: "none",
              verticalAlign: "top",
            }}
            loading="lazy"
            onLoad={onLoad}
            onError={() => {
              console.warn("MermaidRenderer missing svg:", filename);
            }}
          />
        </div>
      </div>
    </div>
  );
}
