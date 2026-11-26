// Decides whether a PR qualifies for low-risk auto-approval.
// Pure logic + read-only API calls: safe to run from pull_request_target because
// it never checks out or executes PR code.

const fs = require("fs");
const path = require("path");

const MAX_CHANGED_WORDS = 30; // added + removed words across the whole PR
const MAX_CHANGED_FILES = 3;
const TRUSTED_TEAM = "product-docs"; // team slug in the repo's org
const OPT_OUT_LABEL = "do-not-auto-approve"; // human kill switch, per PR
const CONFIG_FILE = "website/docusaurus.config.js";

// Frontmatter keys that change URLs, nav, or build behavior. Any edit to these
// lines is treated as risky no matter how small.
const RISKY_FRONTMATTER = /^[+-]\s*(id|slug|title|sidebar_label|sidebar_position|pagination_next|pagination_prev|displayed_sidebar|hide_table_of_contents|tags|keywords)\s*:/;

function globToRegex(glob) {
  let out = "";
  for (let i = 0; i < glob.length; i++) {
    const c = glob[i];
    if (c === "*") {
      if (glob[i + 1] === "*") {
        i++;
        if (glob[i + 1] === "/") {
          i++;
          out += "(?:.*/)?"; // "**/" matches zero or more directories
        } else {
          out += ".*"; // trailing "**" matches everything below this point
        }
      } else {
        out += "[^/]*";
      }
    } else if (c === "?") {
      out += "[^/]";
    } else if (".+^${}()|[]\\".includes(c)) {
      out += "\\" + c;
    } else {
      out += c;
    }
  }
  return new RegExp("^" + out + "$");
}

function loadPatterns(root) {
  const raw = fs.readFileSync(path.join(root, ".github/safe-file-patterns.txt"), "utf8");
  const allow = [];
  const deny = [];
  for (const line of raw.split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    if (t.startsWith("!")) deny.push(globToRegex(t.slice(1)));
    else allow.push(globToRegex(t));
  }
  return { allow, deny };
}

function tokenize(text) {
  const t = text.trim();
  return t ? t.split(/\s+/) : [];
}

// Words that differ between a removed block and the added block that replaces
// it: (removed - common) + (added - common), where common is the LCS of the two
// word lists. A one-word swap in a 300-word paragraph line counts as 2, not 600.
function wordDelta(removed, added) {
  const a = tokenize(removed.join(" "));
  const b = tokenize(added.join(" "));
  if (!a.length || !b.length) return a.length + b.length;
  // Huge rewrites are over the limit anyway; skip the quadratic LCS.
  if (a.length * b.length > 4_000_000) return a.length + b.length;
  let prev = new Array(b.length + 1).fill(0);
  for (let i = 1; i <= a.length; i++) {
    const cur = new Array(b.length + 1).fill(0);
    for (let j = 1; j <= b.length; j++) {
      cur[j] = a[i - 1] === b[j - 1] ? prev[j - 1] + 1 : Math.max(prev[j], cur[j - 1]);
    }
    prev = cur;
  }
  const common = prev[b.length];
  return a.length - common + (b.length - common);
}

// Walks a unified diff patch. Returns changed words, whether a risky frontmatter
// line was touched, and the old/new line numbers of every changed line.
function analyzePatch(patch) {
  let words = 0;
  let riskyFrontmatter = false;
  const removedLines = [];
  const addedLines = [];
  let oldNo = 0;
  let newNo = 0;
  let removed = [];
  let added = [];
  const flush = () => {
    words += wordDelta(removed, added);
    removed = [];
    added = [];
  };
  for (const line of patch.split("\n")) {
    const hunk = line.match(/^@@ -(\d+)(?:,\d+)? \+(\d+)(?:,\d+)? @@/);
    if (hunk) {
      flush();
      oldNo = Number(hunk[1]);
      newNo = Number(hunk[2]);
      continue;
    }
    if (line.startsWith("\\")) continue; // "\ No newline at end of file"
    if (line.startsWith("-")) {
      if (RISKY_FRONTMATTER.test(line)) riskyFrontmatter = true;
      removed.push(line.slice(1));
      removedLines.push(oldNo++);
    } else if (line.startsWith("+")) {
      if (RISKY_FRONTMATTER.test(line)) riskyFrontmatter = true;
      added.push(line.slice(1));
      addedLines.push(newNo++);
    } else {
      flush();
      oldNo++;
      newNo++;
    }
  }
  flush();
  return { words, riskyFrontmatter, removedLines, addedLines };
}

// Line range (1-indexed, inclusive) of the announcement banner settings in
// docusaurus.config.js: the `announcementBar: { ... }` object plus the
// announcementBarActive / announcementBarLink keys that follow it.
function bannerRange(source) {
  const lines = source.split("\n");
  const start = lines.findIndex((l) => /^\s*announcementBar\s*:\s*\{/.test(l));
  if (start === -1) return null;
  let depth = 0;
  let end = start;
  for (; end < lines.length; end++) {
    for (const ch of lines[end]) {
      if (ch === "{") depth++;
      else if (ch === "}") depth--;
    }
    if (depth === 0) break;
  }
  if (depth !== 0) return null;
  // Sibling keys, including a value that wraps onto the next line.
  while (end + 1 < lines.length) {
    const next = lines[end + 1];
    if (/^\s*announcementBar(Active|Link)\s*:/.test(next)) {
      end++;
    } else if (/^\s*announcementBarLink\s*:\s*$/.test(lines[end]) && /^\s*["'`].*["'`],?\s*$/.test(next)) {
      end++;
    } else {
      break;
    }
  }
  return [start + 1, end + 1];
}

async function fileAt(github, owner, repo, filePath, ref) {
  const { data } = await github.rest.repos.getContent({ owner, repo, path: filePath, ref });
  return Buffer.from(data.content, data.encoding).toString("utf8");
}

async function evaluate({ github, context, core }) {
  const pr = context.payload.pull_request;
  const { owner, repo } = context.repo;
  const reasons = [];

  if (pr.draft) reasons.push("PR is a draft");
  if (pr.head.repo.full_name !== `${owner}/${repo}`) reasons.push("PR comes from a fork");

  // Human override: anyone can stop the bot by adding this label.
  if ((pr.labels || []).some((l) => l.name === OPT_OUT_LABEL)) {
    reasons.push(`the ${OPT_OUT_LABEL} label is applied`);
  }

  // A human asking for changes always outranks the bot. Only the latest review
  // per person counts, so a resolved "changes requested" stops blocking.
  const reviews = await github.paginate(github.rest.pulls.listReviews, {
    owner,
    repo,
    pull_number: pr.number,
    per_page: 100,
  });
  const latestByUser = new Map();
  for (const r of reviews) {
    if (r.user.type === "Bot") continue;
    if (!["APPROVED", "CHANGES_REQUESTED", "DISMISSED"].includes(r.state)) continue;
    latestByUser.set(r.user.login, r.state);
  }
  for (const [login, state] of latestByUser) {
    if (state === "CHANGES_REQUESTED") reasons.push(`${login} requested changes`);
  }

  // Author must be an active member of the trusted team. Needs a token with
  // read:org — GITHUB_TOKEN cannot read org team membership.
  const orgToken = process.env.ORG_TOKEN;
  if (!orgToken) {
    reasons.push("ORG_TOKEN is not available, cannot verify team membership");
  } else {
    const org = new github.constructor({ auth: orgToken });
    try {
      const membership = await org.rest.teams.getMembershipForUserInOrg({
        org: owner,
        team_slug: TRUSTED_TEAM,
        username: pr.user.login,
      });
      if (membership.data.state !== "active") {
        reasons.push(`author ${pr.user.login} has pending membership in @${owner}/${TRUSTED_TEAM}`);
      }
    } catch (e) {
      // Fail closed: an unreadable membership answer is not a yes.
      if (e.status === 404) {
        reasons.push(`author ${pr.user.login} is not in @${owner}/${TRUSTED_TEAM}`);
      } else {
        reasons.push(`could not verify team membership (${e.message})`);
      }
    }
  }

  const files = await github.paginate(github.rest.pulls.listFiles, {
    owner,
    repo,
    pull_number: pr.number,
    per_page: 100,
  });

  if (files.length > MAX_CHANGED_FILES) {
    reasons.push(`${files.length} files changed (max ${MAX_CHANGED_FILES})`);
  }

  const { allow, deny } = loadPatterns(process.env.GITHUB_WORKSPACE || ".");
  let totalWords = 0;

  for (const f of files) {
    if (f.status !== "modified") {
      reasons.push(`${f.filename} is ${f.status} (only modifications qualify)`);
      continue;
    }
    if (deny.some((re) => re.test(f.filename))) {
      reasons.push(`${f.filename} is on the deny list`);
      continue;
    }
    if (!allow.some((re) => re.test(f.filename))) {
      reasons.push(`${f.filename} is not on the safe-file list`);
      continue;
    }
    // GitHub omits the patch for very large diffs. No patch means we can't see
    // what changed, so it can't be low-risk.
    if (typeof f.patch !== "string") {
      reasons.push(`${f.filename} has no diff available to inspect`);
      continue;
    }
    const { words, riskyFrontmatter, removedLines, addedLines } = analyzePatch(f.patch);
    totalWords += words;

    if (f.filename === CONFIG_FILE) {
      // Site-wide build config: only the announcement banner settings qualify.
      // Check real line positions in both versions of the file, not line shapes.
      const [base, head] = await Promise.all([
        fileAt(github, owner, repo, f.filename, pr.base.sha),
        fileAt(github, owner, repo, f.filename, pr.head.sha),
      ]);
      const baseRange = bannerRange(base);
      const headRange = bannerRange(head);
      const inside = (n, r) => r && n >= r[0] && n <= r[1];
      if (!removedLines.every((n) => inside(n, baseRange)) || !addedLines.every((n) => inside(n, headRange))) {
        reasons.push(`${f.filename} changes outside the announcementBar block`);
      }
      continue;
    }

    if (riskyFrontmatter) reasons.push(`${f.filename} edits frontmatter that affects URLs or nav`);
  }

  if (totalWords > MAX_CHANGED_WORDS) {
    reasons.push(`${totalWords} words changed (max ${MAX_CHANGED_WORDS})`);
  }

  return { eligible: reasons.length === 0, reasons, totalWords };
}

// Any unexpected failure means "not low-risk" rather than a red X on the PR:
// the bot stays quiet and the change goes through normal review.
module.exports = async ({ github, context, core }) => {
  let result;
  try {
    result = await evaluate({ github, context, core });
  } catch (e) {
    core.warning(`Risk check failed, treating PR as not low-risk: ${e.message}`);
    result = { eligible: false, reasons: [`risk check errored: ${e.message}`], totalWords: 0 };
  }
  core.setOutput("eligible", String(result.eligible));
  core.setOutput("reasons", result.reasons.join("; "));
  core.info(result.eligible
    ? `Eligible: ${result.totalWords} word(s) changed`
    : `Not eligible: ${result.reasons.join("; ")}`);
  return result;
};

// Exposed for local testing only.
module.exports._internals = { analyzePatch, wordDelta, bannerRange, globToRegex };
