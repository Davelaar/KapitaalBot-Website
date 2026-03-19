#!/usr/bin/env node
/**
 * Build content/bot_changelog.json from the KapitaalBot (KRAKENBOTMAART) git history.
 *
 * Usage:
 *   node scripts/generate-bot-changelog.cjs [path-to-bot-repo]
 *   BOT_GIT_REPO=/path/to/KRAKENBOTMAART node scripts/generate-bot-changelog.cjs
 *
 * Regenerate after bot changes: npm run bot-changelog
 */
const { execFileSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const SEP = "\x1f";
const repoArg = process.argv[2];
const repo =
  repoArg ||
  process.env.BOT_GIT_REPO ||
  path.join(__dirname, "..", "..", "KRAKENBOTMAART");
const outPath = path.join(__dirname, "..", "content", "bot_changelog.json");

if (!fs.existsSync(path.join(repo, ".git"))) {
  console.error("generate-bot-changelog: not a git repo:", repo);
  process.exit(1);
}

function git(args) {
  return execFileSync("git", ["-C", repo, ...args], {
    encoding: "utf8",
    maxBuffer: 64 * 1024 * 1024,
  });
}

const hashes = git(["log", "--reverse", "--format=%H"])
  .trim()
  .split("\n")
  .filter(Boolean);

const entries = [];

for (const hash of hashes) {
  const block = git([
    "show",
    "-s",
    `--format=%H${SEP}%h${SEP}%cI${SEP}%s${SEP}%b`,
    hash,
  ]).trimEnd();
  const i = block.indexOf(SEP);
  const i2 = block.indexOf(SEP, i + 1);
  const i3 = block.indexOf(SEP, i2 + 1);
  const i4 = block.indexOf(SEP, i3 + 1);
  if (i < 0 || i2 < 0 || i3 < 0 || i4 < 0) continue;
  const full = block.slice(0, i);
  const short = block.slice(i + 1, i2);
  const committedAt = block.slice(i2 + 1, i3);
  const subject = block.slice(i3 + 1, i4);
  const body = block.slice(i4 + 1).trim();
  const summaryLine = subject.trim() || short;
  entries.push({
    hash: full,
    short,
    committed_at: committedAt,
    subject: subject.trim(),
    body: body || null,
    summary: {
      nl: summaryLine,
      en: summaryLine,
      de: summaryLine,
      fr: summaryLine,
    },
  });
}

const payload = {
  source_repo: repo,
  generated_at: new Date().toISOString(),
  commit_count: entries.length,
  entries,
};

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(payload, null, 2), "utf8");
console.log(
  `Wrote ${entries.length} commits to ${outPath} (repo: ${repo})`,
);
