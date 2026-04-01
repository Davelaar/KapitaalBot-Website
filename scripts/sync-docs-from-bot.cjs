#!/usr/bin/env node
/**
 * Overwrite content/docs/*.md from the Krakenbot repo (same resolve order as
 * generate-bot-changelog.cjs). Website must not ship stale ENGINE_SSOT etc.
 *
 * Override paths (website filename -> path inside bot repo):
 */
const fs = require("fs");
const path = require("path");

const OVERRIDES = {
  "SYSTEMD_README.md": "systemd/README.md",
};

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
const names = fs
  .readdirSync(destDir)
  .filter((f) => f.endsWith(".md"))
  .sort();

let copied = 0;
for (const file of names) {
  const relInBot = OVERRIDES[file] || path.join("docs", file);
  const src = path.join(repo, relInBot);
  const dst = path.join(destDir, file);
  if (!fs.existsSync(src)) {
    console.error(`sync-docs-from-bot: MISSING in bot repo: ${src}`);
    process.exit(1);
  }
  fs.copyFileSync(src, dst);
  copied += 1;
}
console.log(
  `sync-docs-from-bot: copied ${copied} markdown file(s) from ${repo}`,
);
