#!/usr/bin/env node
/**
 * Sync engine markdown from the Krakenbot repo into content/docs/<locale>/.
 *
 * - Writes canonical copies to `content/docs/nl/` (same basenames as bot `docs/*.md`).
 * - Replicates every nl file to `en/` only (DE/FR markdown dirs are added later when translations exist).
 * - Copies systemd/README.md → nl/SYSTEMD_README.md (+ en replica).
 * - If docs/OBSERVABILITY_SNAPSHOT_CONTRACT.md exists in the bot repo, copies it;
 *   otherwise leaves the website nl copy untouched (contract may live only here until restored in bot).
 *
 * Usage: node scripts/sync-docs-from-bot.cjs [path/to/bot-repo]
 */
const fs = require("fs");
const path = require("path");

function resolveBotRepo() {
  const repoArg = process.argv[2];
  const candidates = [
    repoArg,
    process.env.BOT_GIT_REPO,
    "/srv/krakenbot",
    path.join(__dirname, "..", "..", "KRAKENBOTMAART"),
    path.join(__dirname, "..", "..", "krakenbot"),
  ].filter(Boolean);

  for (const c of candidates) {
    const abs = path.resolve(c);
    if (fs.existsSync(path.join(abs, ".git"))) {
      return abs;
    }
  }
  console.error(
    "sync-docs-from-bot: no bot git repo found. Tried:\n  " +
      candidates.join("\n  "),
  );
  process.exit(1);
}

const repo = resolveBotRepo();
const destRoot = path.join(__dirname, "..", "content", "docs");
/** Locales to receive a copy from nl (besides nl itself). DE/FR site routes use nl fallback until translated. */
const replicateLocales = ["en"];
const destNl = path.join(destRoot, "nl");
const botDocsDir = path.join(repo, "docs");

if (!fs.existsSync(botDocsDir)) {
  console.error(`sync-docs-from-bot: bot docs dir missing: ${botDocsDir}`);
  process.exit(1);
}

fs.mkdirSync(destNl, { recursive: true });

let copiedNl = 0;
for (const name of fs.readdirSync(botDocsDir).sort()) {
  if (!name.endsWith(".md")) continue;
  const src = path.join(botDocsDir, name);
  const dst = path.join(destNl, name);
  fs.copyFileSync(src, dst);
  copiedNl += 1;
}

const systemdSrc = path.join(repo, "systemd", "README.md");
const systemdDstNl = path.join(destNl, "SYSTEMD_README.md");
if (fs.existsSync(systemdSrc)) {
  fs.copyFileSync(systemdSrc, systemdDstNl);
  copiedNl += 1;
} else {
  console.warn(`sync-docs-from-bot: skip SYSTEMD_README (missing ${systemdSrc})`);
}

const obsBot = path.join(botDocsDir, "OBSERVABILITY_SNAPSHOT_CONTRACT.md");
const obsDstNl = path.join(destNl, "OBSERVABILITY_SNAPSHOT_CONTRACT.md");
if (fs.existsSync(obsBot)) {
  fs.copyFileSync(obsBot, obsDstNl);
  copiedNl += 1;
} else {
  console.warn(
    "sync-docs-from-bot: OBSERVABILITY_SNAPSHOT_CONTRACT.md not in bot repo — keeping existing website nl file if present",
  );
}

let replicated = 0;
for (const loc of replicateLocales) {
  const destLoc = path.join(destRoot, loc);
  fs.mkdirSync(destLoc, { recursive: true });
  for (const name of fs.readdirSync(destNl)) {
    if (!name.endsWith(".md")) continue;
    fs.copyFileSync(path.join(destNl, name), path.join(destLoc, name));
    replicated += 1;
  }
}

console.log(
  `sync-docs-from-bot: wrote ${copiedNl} file(s) under content/docs/nl from ${repo}; replicated ${replicated} file(s) to en/`,
);
