#!/usr/bin/env node
/**
 * Sync engine markdown from the Krakenbot repo into content/docs/.
 *
 * - Copies every docs/*.md from the bot repo (same basename).
 * - Copies systemd/README.md → SYSTEMD_README.md.
 * - If docs/OBSERVABILITY_SNAPSHOT_CONTRACT.md exists in the bot repo, copies it;
 *   otherwise leaves the website copy untouched (contract may live only here until restored in bot).
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
const destDir = path.join(__dirname, "..", "content", "docs");
const botDocsDir = path.join(repo, "docs");

if (!fs.existsSync(botDocsDir)) {
  console.error(`sync-docs-from-bot: bot docs dir missing: ${botDocsDir}`);
  process.exit(1);
}

fs.mkdirSync(destDir, { recursive: true });

let copied = 0;
for (const name of fs.readdirSync(botDocsDir).sort()) {
  if (!name.endsWith(".md")) continue;
  const src = path.join(botDocsDir, name);
  const dst = path.join(destDir, name);
  fs.copyFileSync(src, dst);
  copied += 1;
}

const systemdSrc = path.join(repo, "systemd", "README.md");
const systemdDst = path.join(destDir, "SYSTEMD_README.md");
if (fs.existsSync(systemdSrc)) {
  fs.copyFileSync(systemdSrc, systemdDst);
  copied += 1;
} else {
  console.warn(`sync-docs-from-bot: skip SYSTEMD_README (missing ${systemdSrc})`);
}

const obsBot = path.join(botDocsDir, "OBSERVABILITY_SNAPSHOT_CONTRACT.md");
const obsDst = path.join(destDir, "OBSERVABILITY_SNAPSHOT_CONTRACT.md");
if (fs.existsSync(obsBot)) {
  fs.copyFileSync(obsBot, obsDst);
  copied += 1;
} else {
  console.warn(
    "sync-docs-from-bot: OBSERVABILITY_SNAPSHOT_CONTRACT.md not in bot repo — keeping existing website file if present",
  );
}

console.log(`sync-docs-from-bot: wrote ${copied} file(s) from ${repo}`);
