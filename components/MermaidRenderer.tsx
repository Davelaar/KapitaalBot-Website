import React, { useEffect, useState } from "react";

interface MermaidRendererProps {
  code: string;
  id?: string;
}

export function MermaidRenderer({ code, id }: MermaidRendererProps) {
  const key = id || code;
  let filename = "";
  if (key === "home-arch-diagram") {
    filename = "/diagrams/home-architecture-flow.svg";
  } else if (key === "tier-flow") {
    filename = "/diagrams/tier-model-observability.svg";
  } else if (key === "bot-flow") {
    filename = "/diagrams/bot-export-pipeline.svg";
  }

  // Fallback: show nothing if we do not have a mapped SVG yet.
  if (!filename) {
    return null;
  }

  // GitHub injecteert Mermaid vaak als inline SVG markup in de pagina.
  // Dat is robuuster dan het tonen als external SVG via <img>/<object>.
  const [svgMarkup, setSvgMarkup] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setSvgMarkup(null);

    fetch(filename)
      .then((r) => {
        if (!r.ok) throw new Error(`failed to fetch svg: ${r.status}`);
        return r.text();
      })
      .then((t) => {
        if (cancelled) return;
        setSvgMarkup(t);
      })
      .catch(() => {
        if (cancelled) return;
        setSvgMarkup(null);
      });

    return () => {
      cancelled = true;
    };
  }, [filename]);

  const ariaLabel =
    key === "home-arch-diagram"
      ? "Architectuur van KapitaalBot observability en dataflow"
      : key === "tier-flow"
        ? "Tier-model van observability (Tier 1, Tier 2, Tier 3)"
        : "Data-exportpijplijn van bot naar observability-website";

  return (
    <div style={{ overflowX: "auto", marginBottom: "0.75rem" }}>
      {svgMarkup ? (
        <div
          aria-label={ariaLabel}
          // SVG wordt build-time gegenereerd; we geven het als pure markup weer.
          dangerouslySetInnerHTML={{ __html: svgMarkup }}
          style={{ maxWidth: "100%" }}
        />
      ) : (
        <img src={filename} alt={ariaLabel} style={{ maxWidth: "100%", height: "auto", display: "block" }} loading="lazy" />
      )}
    </div>
  );
}
