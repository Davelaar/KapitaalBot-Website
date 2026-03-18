// Render selected Mermaid diagrams to static SVG files in public/diagrams.
// Run manually or wire into the build pipeline:
//   node scripts/render-mermaid-diagrams.cjs

/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require("fs");
const path = require("path");
const { JSDOM } = require("jsdom");

async function getMermaid() {
  // Use ESM default export in Node context.
  const mod = await import("mermaid");
  return mod.default || mod;
}

async function renderDiagram(code, id, outName) {
  const outDir = path.join(process.cwd(), "public", "diagrams");
  fs.mkdirSync(outDir, { recursive: true });

  const mermaid = await getMermaid();

  // Mermaid's Node rendering path expects a DOM (document/window) because it uses d3-selection.
  // Provide a minimal headless DOM.
  const dom = new JSDOM("<!doctype html><html><body></body></html>", {
    pretendToBeVisual: true,
  });
  global.window = dom.window;
  global.document = dom.window.document;
  global.SVGElement = dom.window.SVGElement;
  global.HTMLElement = dom.window.HTMLElement;
  global.navigator = dom.window.navigator;

  mermaid.initialize({
    startOnLoad: false,
    theme: "dark",
    securityLevel: "loose",
  });

  const { svg } = await mermaid.render(id, code.trim());
  const outPath = path.join(outDir, outName);
  fs.writeFileSync(outPath, svg, "utf-8");
  console.log(`Rendered ${id} -> ${outPath}`);
}

async function main() {
  const homeArch = `
flowchart LR
  Ingest["Ingest (ticker/trades/L2/L3)"] --> State["State-first: run_symbol_state"]
  State --> Route["Route engine + universe selection"]
  Route --> Exec["Execution engine (queue-aware + safety)"]
  State --> Snap["Observability snapshots (read-model)"]
  Snap --> Tier1["Tier 1: public dashboards"]
  Snap --> Tier2["Tier 2: extended dashboards"]
`;

  const tierFlow = `
flowchart LR
  Tier1["Tier 1 (publiek)"] --> Tier2["Tier 2 (op aanvraag)"]
  Tier2 --> Tier3["Tier 3 (admin)"]

  Tier1 --> SnapPublic["public_* snapshots"]
  Tier2 --> SnapTier2["tier2_* snapshots"]
  Tier3 --> SnapAdmin["admin_observability_snapshot"]
`;

  const botFlow = `
flowchart TB
  BotEngine["Krakenbot Engine"] --> Export["export-observability-snapshots"]
  Export --> Dir["OBSERVABILITY_EXPORT_DIR"]
  Dir --> SiteTier1["KapitaalBot Observability (Tier 1)"]
  Dir --> SiteTier2["KapitaalBot Observability (Tier 2)"]
`;

  await renderDiagram(homeArch, "home-architecture-flow", "home-architecture-flow.svg");
  await renderDiagram(tierFlow, "tier-model-observability", "tier-model-observability.svg");
  await renderDiagram(botFlow, "bot-export-pipeline", "bot-export-pipeline.svg");
}

main().catch((err) => {
  console.error("render-mermaid-diagrams failed:", err);
  process.exit(1);
});

