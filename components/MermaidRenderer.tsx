"use client";

import { useEffect, useRef, useState } from "react";

interface MermaidRendererProps {
  code: string;
  id?: string;
}

export function MermaidRenderer({ code, id }: MermaidRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [svg, setSvg] = useState<string | null>(null);

  useEffect(() => {
    if (!code?.trim() || !containerRef.current) return;
    const uid = id || `mermaid-${Math.random().toString(36).slice(2, 9)}`;
    let cancelled = false;

    async function render() {
      try {
        const mermaid = (await import("mermaid")).default;
        mermaid.initialize({
          startOnLoad: false,
          theme: "dark",
          securityLevel: "loose",
        });
        const { svg: out } = await mermaid.render(uid, code.trim());
        if (!cancelled) {
          setSvg(out);
          setError(null);
        }
      } catch (e: unknown) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Diagram failed to render");
          setSvg(null);
        }
      }
    }

    render();
    return () => {
      cancelled = true;
    };
  }, [code, id]);

  if (error) {
    return (
      <div
        style={{
          padding: "1rem",
          border: "1px solid var(--border)",
          borderRadius: 8,
          fontSize: "0.875rem",
          color: "var(--muted)",
        }}
      >
        Diagram: {error}
      </div>
    );
  }

  if (svg) {
    return (
      <div
        ref={containerRef}
        className="mermaid-output"
        dangerouslySetInnerHTML={{ __html: svg }}
        style={{ overflowX: "auto", marginBottom: "0.75rem" }}
      />
    );
  }

  return (
    <div
      ref={containerRef}
      style={{
        minHeight: 60,
        padding: "1rem",
        border: "1px solid var(--border)",
        borderRadius: 8,
        fontSize: "0.875rem",
        color: "var(--muted)",
      }}
    >
      …
    </div>
  );
}
