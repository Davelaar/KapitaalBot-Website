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

  const ariaLabel =
    key === "home-arch-diagram"
      ? "Architectuur van KapitaalBot observability en dataflow"
      : key === "tier-flow"
        ? "Tier-model van observability (Tier 1, Tier 2, Tier 3)"
        : "Data-exportpijplijn van bot naar observability-website";

  return (
    <div style={{ overflowX: "auto", marginBottom: "0.75rem", width: "100%" }}>
      <img
        src={filename}
        alt={ariaLabel}
        style={{ maxWidth: "100%", width: "100%", height: "auto", display: "block" }}
        loading="lazy"
      />
    </div>
  );
}
