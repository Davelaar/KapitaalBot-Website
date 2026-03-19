#!/usr/bin/env node
/**
 * Sync key engine docs from the bot repo into this site's content/docs directory.
 *
 * Source of truth: /Users/raymonddavelaar/KRAKENBOTMAART/docs
 * Target:         content/docs
 *
 * This script is intentionally simple and deterministic:
 * - It only copies a fixed allowlist of files.
 * - It overwrites the targets on each run.
 * - It prints a short report for CI/manual inspection.
 */

/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require("fs");
const path = require("path");

const BOT_REPO_ROOT = path.resolve(__dirname, "..", "..", "KRAKENBOTMAART");
const BOT_DOCS_DIR = path.join(BOT_REPO_ROOT, "docs");
const SITE_DOCS_DIR = path.join(__dirname, "..", "content", "docs");

/** Mapping from site doc basename → source doc basename in bot repo. */
const MAPPING = {
  ENGINE_SSOT: "ENGINE_SSOT.md",
  DOC_INDEX: "DOC_INDEX.md",
  ARCHITECTURE_ENGINE_CURRENT: "ARCHITECTURE_ENGINE_CURRENT.md",
  LIVE_RUNBOOK_CURRENT: "LIVE_RUNBOOK_CURRENT.md",
  VALIDATION_MODEL_CURRENT: "VALIDATION_MODEL_CURRENT.md",
  CHANGELOG_ENGINE: "CHANGELOG_ENGINE.md",
  LOGGING: "LOGGING.md",
  DB_ARCHITECTURE_STALE_EDGE_SAFE: "DB_ARCHITECTURE_STALE_EDGE_SAFE.md",
  VALIDATION_REPORT_REFRESH_15MIN_RESET: "VALIDATION_REPORT_REFRESH_15MIN_RESET.md",
  OBSERVABILITY_SNAPSHOT_CONTRACT: "OBSERVABILITY_SNAPSHOT_CONTRACT.md",
  SYSTEMD_README: path.join("..", "systemd", "README.md"),
};

function main() {
  if (!fs.existsSync(BOT_DOCS_DIR)) {
    console.error(
      `Bot docs directory not found: ${BOT_DOCS_DIR}. ` +
        "Ensure KRAKENBOTMAART is checked out next to KapitaalBot-Website."
    );
    process.exit(1);
  }

  fs.mkdirSync(SITE_DOCS_DIR, { recursive: true });

  const entries = Object.entries(MAPPING);
  const report = [];

  for (const [siteBase, sourceRel] of entries) {
    const sourcePath = path.isAbsolute(sourceRel)
      ? sourceRel
      : path.join(
          sourceRel.startsWith("..") ? BOT_REPO_ROOT : BOT_DOCS_DIR,
          sourceRel.startsWith("..") ? sourceRel.replace(/^(\.\.\/)+/, "") : ""
        );
    const targetPath = path.join(SITE_DOCS_DIR, `${siteBase}.md`);

    if (!fs.existsSync(sourcePath)) {
      report.push({ siteBase, status: "missing-source", sourcePath, targetPath });
      continue;
    }

    fs.copyFileSync(sourcePath, targetPath);
    const srcStat = fs.statSync(sourcePath);
    report.push({
      siteBase,
      status: "copied",
      sourcePath,
      targetPath,
      mtime: srcStat.mtime.toISOString(),
      size: srcStat.size,
    });
  }

  console.log("DOC_SYNC_REPORT_BEGIN");
  for (const r of report) {
    console.log(JSON.stringify(r));
  }
  console.log("DOC_SYNC_REPORT_END");
}

main();

