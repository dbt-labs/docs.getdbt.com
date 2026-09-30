// Weekly auto-approval summary: collects PRs the bot approved that merged in
// the last 7 days or are still open, and opens a GitHub issue listing them.
// The Slack post and Notion rows come from a separate Runlayer agent that reads
// this issue (and the auto-approved label) every Monday.

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

module.exports = async ({ github, context, core }) => {
  const { owner, repo } = context.repo;
  const sinceISO = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

  const prs = await collect({ github, owner, repo, sinceISO });
  core.info(`Found ${prs.length} auto-approved PR(s) since ${sinceISO}.`);

  if (prs.length) {
    const issue = await createIssue({ github, owner, repo, sinceISO, prs });
    core.summary.addRaw(issue.body);
  } else {
    core.summary.addRaw(`No auto-approved PRs since ${sinceISO}.`);
  }

  await core.summary.write();
};
