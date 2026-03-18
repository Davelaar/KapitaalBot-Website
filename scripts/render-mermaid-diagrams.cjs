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

  // jsdom heeft geen echte layout engine; Mermaid gebruikt getBBox om labels te meten.
  // Monkey-patch een minimale getBBox zodat render niet crasht.
  if (dom.window.SVGElement) {
    // Geef een realistische bbox zodat Mermaid niet uitkomt op een tiny max-width
    // (in de gegenereerde SVG root verscheen anders `style="max-width: 16px;"`).
    dom.window.SVGElement.prototype.getBBox = () => ({
      x: 0,
      y: 0,
      width: 800,
      height: 600,
    });
  }

  // Mermaid gebruikt ook getComputedTextLength voor het formatteren van (SVG) labels.
  // jsdom implementeert dit vaak niet; patch een minimale waarde.
  if (dom.window.SVGTextContentElement && typeof dom.window.SVGTextContentElement.prototype.getComputedTextLength !== "function") {
    dom.window.SVGTextContentElement.prototype.getComputedTextLength = () => 120;
  }
  if (dom.window.SVGElement && typeof dom.window.SVGElement.prototype.getComputedTextLength !== "function") {
    dom.window.SVGElement.prototype.getComputedTextLength = () => 120;
  }

  // Mermaid expects DOMPurify to be an instance with .sanitize/.addHook.
  // With dompurify v3, the default export is a factory; patch it so Mermaid can use it.
  const dompurifyMod = await import("dompurify");
  const dompurifyFactory = dompurifyMod.default;
  if (typeof dompurifyFactory === "function" && typeof dompurifyFactory.sanitize !== "function") {
    const dompurifyInstance = dompurifyFactory(dom.window);
    dompurifyFactory.sanitize = dompurifyInstance.sanitize.bind(dompurifyInstance);
    if (typeof dompurifyInstance.addHook === "function") {
      dompurifyFactory.addHook = dompurifyInstance.addHook.bind(dompurifyInstance);
    }
  }

  mermaid.initialize({
    startOnLoad: false,
    theme: "dark",
    securityLevel: "loose",
    // Render labels as pure SVG (<text>) i.p.v. foreignObject.
    // Safari can render foreignObject inconsistently inside external SVG images.
    flowchart: { htmlLabels: false },
  });

  const { svg } = await mermaid.render(id, code.trim());
  // Defensieve fix: sommige Mermaid versies/evaluaties injecteren een max-width constraint in de root.
  // We verwijderen die constraint zodat de SVG normaal schaalbaar is via <img> of CSS.
  const escapeXml = (s) =>
    String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;");

  let svgFixed = svg
    // Schaal constraint breed weghalen: ook als Mermaid ineens een andere px waarde kiest.
    .replace(/max-width:\s*\d+(\.\d+)?px;/g, "max-width: 100%;")
    // Contrast boost: shapes/edges zichtbaar op donkere site.
    .replace(/fill:#1f2020/g, "fill:#2f2f2f")
    .replace(/stroke:#ccc/g, "stroke:#ffffff")
    .replace(/stroke:lightgrey/g, "stroke:#ffffff")
    .replace(/stroke-width:1px/g, "stroke-width:2px")
    // Mermaid kan foreignObject voor labels genereren (div + p).
    // Safari rendert dat vaak niet/anders bij SVG-in-SVG of external SVG.
    // We vervangen foreignObject labels door pure SVG <text>.
    .replace(
      /<foreignObject[^>]*>\s*<div[\s\S]*?<p>\s*([\s\S]*?)\s*<\/p>[\s\S]*?<\/foreignObject>/g,
      (_m, rawLabel) => {
        const label = String(rawLabel ?? "").replace(/\s+/g, " ").trim();
        const escaped = escapeXml(label);
        // Label groups zitten in een <g transform="..."> waarin (0,0) de box-center is.
        // We vermijden font-family quotes in het style attribuut; de root SVG zet al font-family.
        return `<text x="0" y="0" text-anchor="middle" dominant-baseline="middle" style="font-size:16px;fill:#ccc;">${escaped}</text>`;
      }
    );

  const outPath = path.join(outDir, outName);
  fs.writeFileSync(outPath, svgFixed, "utf-8");
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

