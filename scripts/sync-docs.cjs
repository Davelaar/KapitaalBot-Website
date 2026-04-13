/**
 * Sync engine docs from the bot repo into content/docs (fixed allowlist).
 *
 * Prefer: `node scripts/sync-docs-from-bot.cjs` (copies all bot docs/*.md + systemd).
 * This file remains for callers that expect DOC_SYNC_REPORT_* JSON lines.
 */
/* eslint-disable @typescript-eslint/no-var-requires */
const { spawnSync } = require("child_process");
const path = require("path");

const script = path.join(__dirname, "sync-docs-from-bot.cjs");
const r = spawnSync(process.execPath, [script, ...process.argv.slice(2)], {
  stdio: "inherit",
});
process.exit(r.status ?? 1);
