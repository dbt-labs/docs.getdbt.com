// Weekly auto-approval summary: collects PRs the bot approved that merged in
// the last 7 days or are still open, then reports them to a GitHub issue,
// Slack, and Notion. Slack and Notion are optional and never block each other.

const NOTION_VERSION = "2025-09-03";
const BOT_LOGIN = "github-actions[bot]";

async function collect({ github, owner, repo, sinceISO }) {
  const search = async (q) =>
    github.paginate(github.rest.search.issuesAndPullRequests, { q, per_page: 100 });

  const merged = await search(`repo:${owner}/${repo} is:pr is:merged label:auto-approved merged:>=${sinceISO}`);
  // The bot removes the label when it withdraws, so a labeled open PR is one
  // that currently carries a bot approval.
  const open = await search(`repo:${owner}/${repo} is:pr is:open label:auto-approved`);

  const prs = [];
  for (const [items, state] of [[merged, "Merged"], [open, "Open"]]) {
    for (const item of items) {
      const reviews = await github.paginate(github.rest.pulls.listReviews, {
        owner, repo, pull_number: item.number, per_page: 100,
      });
      const approval = reviews.filter((r) => r.user.login === BOT_LOGIN && r.state === "APPROVED").pop();

      // GitHub's revert PRs say "Reverts owner/repo#123" in the body.
      let reverted = false;
      if (state === "Merged") {
        const { data } = await github.rest.search.issuesAndPullRequests({
          q: `repo:${owner}/${repo} is:pr in:body "Reverts ${owner}/${repo}#${item.number}"`,
          per_page: 1,
        });
        reverted = data.total_count > 0;
      }

      prs.push({
        number: item.number,
        title: item.title,
        url: item.html_url,
        author: item.user.login,
        state,
        approvedAt: approval ? approval.submitted_at : null,
        mergedAt: item.pull_request?.merged_at || null,
        reverted,
      });
    }
  }
  return prs;
}

function line(pr) {
  const flag = pr.reverted ? " — **possibly reverted**" : "";
  return `- [ ] #${pr.number} ${pr.title} (@${pr.author})${flag}`;
}

async function createIssue({ github, owner, repo, sinceISO, prs }) {
  const merged = prs.filter((p) => p.state === "Merged");
  const open = prs.filter((p) => p.state === "Open");
  const body = [
    `Auto-approved PRs since ${sinceISO}: **${merged.length} merged**, **${open.length} still open**.`,
    "",
    "Tick each one you have eyeballed. If the bot approved something it should not have:",
    "",
    "1. Note the PR here.",
    "2. Tighten `.github/safe-file-patterns.txt` or the thresholds in `.github/scripts/low-risk-check.js`.",
    "3. If it is urgent, set the `AUTO_APPROVE_MODE` repo variable to `off`.",
    "",
    "### Merged",
    ...(merged.length ? merged.map(line) : ["_None_"]),
    "",
    "### Approved, still open",
    ...(open.length ? open.map(line) : ["_None_"]),
  ].join("\n");

  const { data } = await github.rest.issues.create({
    owner, repo,
    title: `Auto-approval audit: week of ${sinceISO}`,
    body,
    labels: ["auto-approval-audit"],
  });
  return { body, issueUrl: data.html_url };
}

async function postSlack({ webhook, sinceISO, prs, issueUrl }) {
  const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const item = (p) => `• <${p.url}|#${p.number}> ${esc(p.title)} (${p.author})${p.reverted ? " :warning: possibly reverted" : ""}`;
  const merged = prs.filter((p) => p.state === "Merged");
  const open = prs.filter((p) => p.state === "Open");

  const text = prs.length === 0
    ? `*Auto-approval weekly summary* (since ${sinceISO})\nNo auto-approved PRs this week.`
    : [
        `*Auto-approval weekly summary* (since ${sinceISO})`,
        `${merged.length} merged, ${open.length} approved and still open.`,
        "",
        ...(merged.length ? ["*Merged*", ...merged.map(item), ""] : []),
        ...(open.length ? ["*Approved, still open*", ...open.map(item), ""] : []),
        issueUrl ? `Review and tick them off in the <${issueUrl}|audit issue>.` : "",
      ].join("\n");

  const res = await fetch(webhook, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
  if (!res.ok) throw new Error(`Slack returned ${res.status}: ${await res.text()}`);
}

async function notion(token, method, endpoint, body) {
  const res = await fetch(`https://api.notion.com/v1/${endpoint}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Notion-Version": NOTION_VERSION,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new Error(`Notion ${method} ${endpoint} returned ${res.status}: ${await res.text()}`);
  return res.json();
}

// One row per PR, keyed on "PR number". Re-running the audit updates the row
// (for example Open -> Merged) and never touches the "Human reviewed" box.
async function upsertNotion({ token, dataSourceId, weekISO, prs }) {
  const date = (iso) => (iso ? { date: { start: iso } } : { date: null });
  for (const pr of prs) {
    const properties = {
      Name: { title: [{ text: { content: pr.title.slice(0, 2000) } }] },
      "PR number": { number: pr.number },
      Link: { url: pr.url },
      Author: { rich_text: [{ text: { content: pr.author } }] },
      State: { select: { name: pr.state } },
      "Approved at": date(pr.approvedAt),
      "Merged at": date(pr.mergedAt),
      "Audit week": date(weekISO),
      "Possibly reverted": { checkbox: pr.reverted },
    };
    const existing = await notion(token, "POST", `data_sources/${dataSourceId}/query`, {
      filter: { property: "PR number", number: { equals: pr.number } },
      page_size: 1,
    });
    if (existing.results.length) {
      await notion(token, "PATCH", `pages/${existing.results[0].id}`, { properties });
    } else {
      await notion(token, "POST", "pages", {
        parent: { type: "data_source_id", data_source_id: dataSourceId },
        properties,
      });
    }
  }
}

module.exports = async ({ github, context, core }) => {
  const { owner, repo } = context.repo;
  const sinceISO = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
  const weekISO = new Date().toISOString().slice(0, 10);

  const prs = await collect({ github, owner, repo, sinceISO });
  core.info(`Found ${prs.length} auto-approved PR(s) since ${sinceISO}.`);

  let issueUrl = null;
  if (prs.length) {
    const issue = await createIssue({ github, owner, repo, sinceISO, prs });
    issueUrl = issue.issueUrl;
    core.summary.addRaw(issue.body);
  } else {
    core.summary.addRaw(`No auto-approved PRs since ${sinceISO}.`);
  }

  // Slack and Notion are best-effort: a failure warns but doesn't fail the
  // audit, and one failing doesn't stop the other.
  if (process.env.SLACK_WEBHOOK_URL) {
    try {
      await postSlack({ webhook: process.env.SLACK_WEBHOOK_URL, sinceISO, prs, issueUrl });
    } catch (e) {
      core.warning(`Slack post failed: ${e.message}`);
    }
  } else {
    core.info("SLACK_WEBHOOK_URL not set; skipping Slack.");
  }

  if (process.env.NOTION_TOKEN && prs.length) {
    try {
      await upsertNotion({
        token: process.env.NOTION_TOKEN,
        dataSourceId: process.env.NOTION_DATA_SOURCE_ID,
        weekISO,
        prs,
      });
    } catch (e) {
      core.warning(`Notion update failed: ${e.message}`);
    }
  } else if (!process.env.NOTION_TOKEN) {
    core.info("NOTION_TOKEN not set; skipping Notion.");
  }

  await core.summary.write();
};
