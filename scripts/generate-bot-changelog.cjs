#!/usr/bin/env node
/**
 * Build content/bot_changelog.json from the Krakenbot git history.
 *
 * Repo resolution (first match with a .git directory wins):
 *   1) CLI arg: node scripts/generate-bot-changelog.cjs /path/to/bot
 *   2) BOT_GIT_REPO
 *   3) /srv/krakenbot (production server canonical clone)
 *   4) ../../KRAKENBOTMAART (local dev: sibling of KapitaalBot-Website)
 *   5) ../../krakenbot (local or /srv sibling name)
 *
 * Every production `npm run build` runs this first — the changelog page must never
 * ship stale JSON from an old manual snapshot.
 */
const { execFileSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const SEP = "\x1f";
const outPath = path.join(__dirname, "..", "content", "bot_changelog.json");

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
    "generate-bot-changelog: no bot git repo found. Tried:\n  " +
      candidates.join("\n  "),
  );
  process.exit(1);
}

const repo = resolveBotRepo();

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
