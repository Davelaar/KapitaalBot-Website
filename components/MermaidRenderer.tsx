interface MermaidRendererProps {
  code: string;
  id?: string;
}

function fnv1a32Hex(input: string): string {
  let hash = 0x811c9dc5; // FNV offset basis
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    // FNV prime: 0x01000193
    hash = (hash + (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24)) >>> 0;
  }
  return hash.toString(16).padStart(8, "0");
}

export function MermaidRenderer({ code, id }: MermaidRendererProps) {
  let filename = "";

  const trimmed = code?.trim() ?? "";
  if (!trimmed) return null;

  if (id === "home-arch-diagram") {
    filename = "/diagrams/home-architecture-flow.svg";
  } else if (id === "tier-flow") {
    filename = "/diagrams/tier-model-observability.svg";
  } else if (id === "bot-flow") {
    filename = "/diagrams/bot-export-pipeline.svg";
  } else {
    // Generic fallback for Mermaid blocks coming from markdown/docs.
    // Must match `scripts/render-mermaid-diagrams.cjs` hashing.
    const hash = fnv1a32Hex(trimmed);
    filename = `/diagrams/mermaid-${hash}.svg`;
  }

  const ariaLabel =
    id === "home-arch-diagram"
      ? "Architectuur van KapitaalBot observability en dataflow"
      : id === "tier-flow"
        ? "Tier-model van observability (Tier 1, Tier 2, Tier 3)"
        : id === "bot-flow"
          ? "Data-exportpijplijn van bot naar observability-website"
          : "Mermaid diagram";

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
