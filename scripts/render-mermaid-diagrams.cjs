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

  // Bounding box uit content halen en viewBox corrigeren.
  // Mermaid in jsdom zet viewBox op 816x616 terwijl nodes op 400–5000+ staan → diagram buiten beeld.
  function computeViewBox(svgStr) {
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    const pad = 24;
    let m;

    // translate(x, y) — node- en labelposities
    const transRe = /translate\(\s*([-\d.]+)\s*,\s*([-\d.]+)\s*\)/g;
    while ((m = transRe.exec(svgStr)) !== null) {
      const x = parseFloat(m[1]), y = parseFloat(m[2]);
      minX = Math.min(minX, x); minY = Math.min(minY, y);
      maxX = Math.max(maxX, x); maxY = Math.max(maxY, y);
    }

    // path d="M x,y L x,y ..." — lijnen
    const pathRe = /[ML]\s*([-\d.]+)\s*[, ]\s*([-\d.]+)/g;
    while ((m = pathRe.exec(svgStr)) !== null) {
      const x = parseFloat(m[1]), y = parseFloat(m[2]);
      minX = Math.min(minX, x); minY = Math.min(minY, y);
      maxX = Math.max(maxX, x); maxY = Math.max(maxY, y);
    }

    // rect x,y,width,height — clusters e.d.
    const rectRe = /<rect[^>]*\sx="([-\d.]+)"[^>]*\sy="([-\d.]+)"[^>]*\swidth="([-\d.]+)"[^>]*\sheight="([-\d.]+)"/gi;
    while ((m = rectRe.exec(svgStr)) !== null) {
      const x = parseFloat(m[1]), y = parseFloat(m[2]), w = parseFloat(m[3]), h = parseFloat(m[4]);
      minX = Math.min(minX, x); minY = Math.min(minY, y);
      maxX = Math.max(maxX, x + w); maxY = Math.max(maxY, y + h);
    }

    if (minX === Infinity) return null;
    minX -= pad; minY -= pad; maxX += pad; maxY += pad;
    return `${minX} ${minY} ${maxX - minX} ${maxY - minY}`;
  }

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

  const newViewBox = computeViewBox(svgFixed);
  if (newViewBox) {
    svgFixed = svgFixed.replace(/viewBox="[^"]*"/, `viewBox="${newViewBox}"`);
  }

  const outPath = path.join(outDir, outName);
  fs.writeFileSync(outPath, svgFixed, "utf-8");
  console.log(`Rendered ${id} -> ${outPath}`);
}

function fnv1a32Hex(input) {
  let hash = 0x811c9dc5; // FNV offset basis
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    // FNV prime: 0x01000193
    hash = (hash + (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24)) >>> 0;
  }
  return hash.toString(16).padStart(8, "0");
}

function extractMermaidBlocks(md) {
  const blocks = [];
  // Mermaid fenced code blocks in markdown:
  // ```mermaid
  // flowchart ...
  // ```
  const re = /```mermaid[^\n]*\n([\s\S]*?)```/g;
  let m;
  while ((m = re.exec(md)) !== null) {
    const code = String(m[1] ?? "").trim();
    if (code) blocks.push(code);
  }
  return blocks;
}

function walkMdFiles(dir, acc) {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      walkMdFiles(p, acc);
    } else if (e.isFile() && e.name.endsWith(".md")) {
      acc.push(p);
    }
  }
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

  // 1) Render the explicitly mapped diagrams used on the website UI.
  await renderDiagram(homeArch, "home-architecture-flow", "home-architecture-flow.svg");
  await renderDiagram(tierFlow, "tier-model-observability", "tier-model-observability.svg");
  await renderDiagram(botFlow, "bot-export-pipeline", "bot-export-pipeline.svg");

  // 2) Render any additional ```mermaid blocks found in repo docs/.
  // These are used by DocViewer via MermaidRenderer (hash-based filenames).
  const codeByHash = new Map();

  // On the server we don't have access to the repo root `docs/` folder.
  // So we support two modes:
  // - if ../docs exists: scan automatically
  // - otherwise: fall back to the mermaid blocks we know exist in this project
  //   (see `KRAKENBOTMAART/docs/*`).
  const docsDir = path.join(process.cwd(), "..", "docs");

  const fallbackMermaidBlocks = [
    // docs/ENGINE_SSOT.md (section 8 Runtime topology (diagram))
    `
flowchart TB
  subgraph Ingest["Persistent Ingest (run-ingest)"]
    WS[Public WS: ticker, trade, L2, L3]
    Writer[Async writer]
    UM[UniverseManager]
    Epoch[ingest_epochs / lineage]
    Snap[execution_universe_snapshots]
    Refresh[refresh_run_symbol_state]
    WS --> Writer
    Writer --> DB_Ingest[(DB Ingest)]
    UM --> Epoch
    Epoch --> Snap
    Snap --> DB_Ingest
    DB_Ingest --> Refresh
    Refresh --> State_Ingest[(run_symbol_state)]
  end

  Sync[sync_run_symbol_state_to_decision]

  subgraph Decision["DB Decision (bij 2 pools)"]
    DB_Decision[(DB Decision)]
    State_Decision[(run_symbol_state)]
    Epoch_D[ingest_epochs / snapshots]
    Orders[execution_orders / fills]
    DB_Decision --> State_Decision
    DB_Decision --> Epoch_D
    DB_Decision --> Orders
  end

  subgraph Execution["Execution (run-execution-live / execution-only)"]
    Eval[Evaluation loop]
    RefreshEval[refresh op ingest]
    Readiness[Readiness from state]
    Pipeline[Pipeline from state]
    Gate[Generation gate + route freshness]
    Submit[DB-first submit + OrderTracker]
    AuthWS[Private WS: orders, fills]
    Eval --> RefreshEval
    RefreshEval --> Sync
    Sync --> State_Decision
    State_Decision --> Readiness
    Readiness --> Pipeline
    Pipeline --> Gate
    Gate --> Submit
    Submit --> AuthWS
    AuthWS --> DB_Decision
  end

  State_Ingest --> Sync
  Epoch_D --> Eval
`.trim(),

    // docs/VALIDATION_MODEL_CURRENT.md (section 7 Diagram)
    `
flowchart LR
  Bootstrap[Bootstrap proof] --> Attach[Attach proof]
  Attach --> Eval[Evaluation proof]
  Eval --> Lifecycle[Lifecycle proof]
  Eval --> Economic[Economically empty]
  Eval --> DataBlocked[Data-blocked]
  Attach --> AttachBlocked[Attach-blocked]
`.trim(),

    // docs/ARCHITECTURE_ENGINE_CURRENT.md (multiple mermaid blocks)
    `
flowchart TB
  subgraph Ingest["Persistent Ingest (krakenbot run-ingest)"]
    Ticker[Ticker WS]
    Trade[Trade WS]
    L2[L2 feed]
    L3[L3 feed]
    Writer[Async writer]
    UM[UniverseManager]
    Lineage[ingest_lineage]
    Epoch[ingest_epochs]
    Snap[execution_universe_snapshots]
    Ticker --> Writer
    Trade --> Writer
    L2 --> Writer
    L3 --> Writer
    Writer --> DB_Ingest[(DB Ingest)]
    UM --> Lineage
    UM --> Epoch
    Epoch --> Snap
    Snap --> DB_Ingest
    Lineage --> DB_Ingest
  end

  RefreshState[refresh_run_symbol_state]
  Sync[sync → DB Decision]

  subgraph Decision["DB Decision (bij 2 pools)"]
    DB_Decision[(DB Decision)]
    State_D[(run_symbol_state)]
    Epoch_D[epochs / snapshots]
    ExecTables[execution_orders / fills]
  end

  subgraph Execution["Execution (run-execution-live / run-execution-only)"]
    EvalLoop[Evaluation loop]
    Readiness[run_readiness_analysis_for_run_from_state]
    Pipeline[run_strategy_pipeline_with_readiness]
    Choke[choke_decide]
    Submit[submit_and_wait_for_execution_reports]
    OT[OrderTracker]
    WS_Private[Private WS]
    EvalLoop --> RefreshState
    RefreshState --> Sync
    Sync --> State_D
    State_D --> Readiness
    Readiness --> Pipeline
    Pipeline --> Choke
    Choke --> Submit
    Submit --> OT
    Submit --> WS_Private
    WS_Private --> Fills[fills_ledger / state_machine]
    Fills --> DB_Decision
  end

  DB_Ingest --> RefreshState
  State_D --> Readiness
  Epoch_D --> EvalLoop
`.trim(),

    `
flowchart LR
  WS[Public WS] --> Writer[writer]
  Writer --> DB_Ingest[(DB Ingest: raw)]
  DB_Ingest --> Refresh[refresh_run_symbol_state]
  Refresh --> Sync[sync]
  Sync --> State_D[(state op DB Decision)]
  State_D --> Readiness[readiness from state]
  Readiness --> Pipeline[strategy_pipeline]
  Pipeline --> Gate[generation + route freshness]
  Gate --> Outcomes[Execute / Skip]
  Outcomes --> Runner[runner: 1st Execute]
  Runner --> DBFirst[on_submitted]
  DBFirst --> Kraken[Kraken add_order]
  Kraken --> PrivateWS[Private WS]
  PrivateWS --> OrderTracker[OrderTracker]
  PrivateWS --> Fills[fills_ledger]
  Fills --> DB_Decision[(DB Decision)]
`.trim(),

    `
flowchart TB
  Metrics[RegimeMetrics per pair]
  Regime[detect_regime]
  Strategies[candidate_strategies_for_regime]
  ReadinessGate[readiness_gate: strategy-specific]
  Rank[Rank by pair_score + edge]
  Risk[run_risk_gate]
  Plan[plan_execution]
  Metrics --> Regime
  Regime --> Strategies
  Strategies --> ReadinessGate
  ReadinessGate --> Rank
  Rank --> Risk
  Risk --> Plan
`.trim(),

    `
stateDiagram-v2
  [*] --> Candidate: pipeline Execute
  Candidate --> DB_FIRST: on_submitted
  DB_FIRST --> PendingSubmit: register OrderTracker
  PendingSubmit --> PendingAck: add_order sent
  PendingAck --> Filled: fill
  PendingAck --> Rejected: reject
  PendingAck --> Cancelled: cancel
  Filled --> fills_ledger: position + realized_pnl
  Rejected --> [*]
  Cancelled --> [*]
  Filled --> [*]
`.trim(),
  ];

  if (fs.existsSync(docsDir)) {
    const mdFiles = [];
    walkMdFiles(docsDir, mdFiles);
    for (const filePath of mdFiles) {
      const md = fs.readFileSync(filePath, "utf-8");
      const blocks = extractMermaidBlocks(md);
      for (const code of blocks) {
        const hash = fnv1a32Hex(code.trim());
        if (!codeByHash.has(hash)) codeByHash.set(hash, code);
      }
    }
  } else {
    for (const code of fallbackMermaidBlocks) {
      const hash = fnv1a32Hex(code.trim());
      if (!codeByHash.has(hash)) codeByHash.set(hash, code);
    }
  }

  for (const [hash, code] of codeByHash.entries()) {
    const id = `mermaid-${hash}`;
    const outName = `mermaid-${hash}.svg`;
    await renderDiagram(code, id, outName);
  }
}

main().catch((err) => {
  console.error("render-mermaid-diagrams failed:", err);
  process.exit(1);
});

