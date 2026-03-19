"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import mermaid from "mermaid";

interface MermaidLiveDiagramProps {
  chart: string;
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

export function MermaidLiveDiagram({ chart }: MermaidLiveDiagramProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const chartId = useMemo(() => `mermaid-live-${hashText(chart)}`, [chart]);

  useEffect(() => {
    let cancelled = false;

    async function render() {
      if (!mermaidInitialized) {
        mermaid.initialize({
          startOnLoad: false,
          securityLevel: "loose",
          theme: "default",
          flowchart: {
            htmlLabels: false,
            useMaxWidth: false,
          },
        });
        mermaidInitialized = true;
      }

      try {
        const { svg } = await mermaid.render(chartId, chart.trim());
        if (!cancelled && ref.current) {
          ref.current.innerHTML = svg;
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError("Diagram kon niet worden gerenderd.");
          if (ref.current) {
            ref.current.innerHTML = "";
          }
        }
        console.error("Mermaid render error", err);
      }
    }

    render();
    return () => {
      cancelled = true;
    };
  }, [chart, chartId]);

  return (
    <div className="mermaid-wrapper">
      {error ? (
        <p className="mermaid-error">{error}</p>
      ) : (
        <div ref={ref} className="mermaid-diagram" />
      )}
    </div>
  );
}

