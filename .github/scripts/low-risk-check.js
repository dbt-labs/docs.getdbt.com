// Decides whether a PR qualifies for low-risk auto-approval.
// Pure logic + read-only API calls: safe to run from pull_request_target because
// it never checks out or executes PR code.

const fs = require("fs");
const path = require("path");

const MAX_CHANGED_WORDS = 10; // added + removed words across the whole PR
const MAX_CHANGED_FILES = 3;
const TRUSTED_TEAM = "product-docs"; // team slug in the repo's org
const OPT_OUT_LABEL = "do-not-auto-approve"; // human kill switch, per PR

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

function countWords(text) {
  const t = text.trim();
  return t ? t.split(/\s+/).length : 0;
}

// Counts words added + removed in a unified diff patch, and flags risky lines.
function analyzePatch(patch) {
  let words = 0;
  let riskyFrontmatter = false;
  for (const line of (patch || "").split("\n")) {
    if (!line.startsWith("+") && !line.startsWith("-")) continue;
    if (line.startsWith("+++") || line.startsWith("---")) continue;
    if (RISKY_FRONTMATTER.test(line)) riskyFrontmatter = true;
    words += countWords(line.slice(1));
  }
  return { words, riskyFrontmatter };
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
    const org = require("@actions/github").getOctokit(orgToken);
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
    const { words, riskyFrontmatter } = analyzePatch(f.patch);
    if (riskyFrontmatter) reasons.push(`${f.filename} edits frontmatter that affects URLs or nav`);
    totalWords += words;
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
