#!/usr/bin/env node
/**
 * Dotty Workflow Metrics Aggregator
 *
 * Queries GitHub (search API + issues API + central-release-notes repo) to compute
 * Dotty accuracy and docs backlog metrics, then updates a Notion dashboard page.
 *
 * Run locally:
 *   GH_TOKEN=ghp_... RUNLAYER_API_TOKEN=... NOTION_PAGE_ID=34cbb38ebda781f09d03d1e98527d6a8 node scripts/dotty-metrics.js
 */

const GH_TOKEN = process.env.GH_TOKEN;
const RUNLAYER_API_TOKEN = process.env.RUNLAYER_API_TOKEN;
const NOTION_PAGE_ID = process.env.NOTION_PAGE_ID;

if (!GH_TOKEN || !RUNLAYER_API_TOKEN || !NOTION_PAGE_ID) {
  console.error('Missing required env vars: GH_TOKEN, RUNLAYER_API_TOKEN, NOTION_PAGE_ID');
  process.exit(1);
}

const RUNLAYER_MCP_URL = 'https://dbt.runlayer.com/api/v1/proxy/24736211-1060-47e7-897e-fdf5a531a3d5/mcp';

// Repos where Dotty/Cursor analysis workflow runs — edit scripts/dotty-metrics-config.json to update
const { sourceRepos: SOURCE_REPOS } = require('./dotty-metrics-config.json');

// ─── GitHub helpers ────────────────────────────────────────────────────────────

async function ghFetch(path, options = {}, retries = 3) {
  const res = await fetch(`https://api.github.com${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${GH_TOKEN}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      ...options.headers,
    },
  });
  if (!res.ok) {
    const body = await res.text();
    if (retries > 0 && res.status >= 500) {
      await new Promise(r => setTimeout(r, 2000));
      return ghFetch(path, options, retries - 1);
    }
    throw new Error(`GitHub API ${path} → ${res.status}: ${body}`);
  }
  return res.json();
}

// Sequential search with 2s throttle to stay under GitHub's 30 req/min limit
async function searchCount(query) {
  await new Promise(r => setTimeout(r, 2000));
  const data = await ghFetch(`/search/issues?q=${encodeURIComponent(query)}&per_page=1`);
  return data.total_count;
}

async function ghPaginate(path, params = {}) {
  const results = [];
  let page = 1;
  const qs = new URLSearchParams({ ...params, per_page: '100' });
  while (true) {
    qs.set('page', String(page));
    const data = await ghFetch(`${path}?${qs}`);
    if (!Array.isArray(data) || data.length === 0) break;
    results.push(...data);
    if (data.length < 100) break;
    page++;
  }
  return results;
}

// ─── 1. GitHub search metrics per source repo ──────────────────────────────────

async function getSearchMetrics() {
  const repoMetrics = {};

  for (const repo of SOURCE_REPOS) {
    const repoSlug = repo.split('/')[1];
    const base = `repo:${repo} is:pr`;
    console.log(`  Querying ${repo}...`);

    // Sequential to respect rate limits
    const totalDotty     = await searchCount(`${base} "Dotty analysis" in:comments`);
    const totalCursor    = await searchCount(`${base} "Cursor analysis" in:comments`);
    const cfDotty        = await searchCount(`${base} "Added \`needs-docs\` label" "Dotty analysis" in:comments`);
    const notCfDotty     = await searchCount(`${base} "No label added" "Dotty analysis" in:comments`);
    const corrections    = await searchCount(`${base} "Dotty correction detected" in:comments`);
    const falsePositives = await searchCount(`${base} "FALSE_POSITIVE" "Dotty correction detected" in:comments`);
    const falseNegatives = await searchCount(`${base} "FALSE_NEGATIVE" "Dotty correction detected" in:comments`);

    // Sanity check: flag if Cursor count looks inflated by Cursor Bugbot code reviews
    if (totalCursor > totalDotty * 20 && totalDotty > 0) {
      console.warn(`  ⚠️  ${repo}: Cursor count (${totalCursor}) is >20x Dotty count — may include Cursor Bugbot code reviews`);
    }

    const totalAnalyzed = totalDotty + totalCursor;
    // Accuracy: only computable for Dotty era (correction tracking didn't exist for Cursor era)
    const accuracyRate = cfDotty > 0
      ? (((cfDotty - falsePositives) / cfDotty) * 100).toFixed(1) + '%'
      : 'N/A';

    repoMetrics[repoSlug] = {
      totalDotty,
      totalCursor,
      totalAnalyzed,
      cfDotty,
      notCfDotty,
      corrections,
      falsePositives,
      falseNegatives,
      accuracyRate,
    };

    console.log(`    analyzed=${totalAnalyzed} (dotty=${totalDotty}, cursor=${totalCursor}), cf=${cfDotty}, corrections=${corrections}`);
  }

  // Roll up totals
  const totals = Object.values(repoMetrics).reduce(
    (acc, r) => ({
      totalAnalyzed:  acc.totalAnalyzed  + r.totalAnalyzed,
      cfDotty:        acc.cfDotty        + r.cfDotty,
      notCfDotty:     acc.notCfDotty     + r.notCfDotty,
      corrections:    acc.corrections    + r.corrections,
      falsePositives: acc.falsePositives + r.falsePositives,
      falseNegatives: acc.falseNegatives + r.falseNegatives,
    }),
    { totalAnalyzed: 0, cfDotty: 0, notCfDotty: 0, corrections: 0, falsePositives: 0, falseNegatives: 0 }
  );
  totals.accuracyRate = totals.cfDotty > 0
    ? (((totals.cfDotty - totals.falsePositives) / totals.cfDotty) * 100).toFixed(1) + '%'
    : 'N/A';

  return { repoMetrics, totals };
}

// ─── 2. docs-internal issue backlog ────────────────────────────────────────────

async function getIssueBacklog() {
  // Only fetch the last 365 days — avoids paginating all historical issues on every run
  const since = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString();
  console.log('  Fetching docs-internal issues (last 365 days)...');

  const allIssues = await ghPaginate('/repos/dbt-labs/docs-internal/issues', {
    state: 'all',
    since,
  });

  const dottyIssues = allIssues.filter(i =>
    /^(Docs changes from|Release Note: Changes from)/i.test(i.title)
  );

  console.log(`  Found ${dottyIssues.length} Dotty-generated docs issues`);

  // Group by month, compute time-to-close
  const byMonth = {};
  const closeDays = [];

  for (const issue of dottyIssues) {
    const month = issue.created_at.slice(0, 7); // "2026-04"
    byMonth[month] ??= { created: 0, closed: 0, sourceRepos: {} };
    byMonth[month].created++;

    // Extract source repo from title: "Docs changes from cloud-ui PR #123"
    const repoMatch = issue.title.match(/from (\S+) PR/i);
    const sourceRepo = repoMatch ? repoMatch[1] : 'unknown';
    byMonth[month].sourceRepos[sourceRepo] = (byMonth[month].sourceRepos[sourceRepo] || 0) + 1;

    if (issue.state === 'closed' && issue.closed_at) {
      byMonth[month].closed++;
      const days = (new Date(issue.closed_at) - new Date(issue.created_at)) / 86400000;
      closeDays.push(days);
    }
  }

  const totalOpen = dottyIssues.filter(i => i.state === 'open').length;
  const totalClosed = dottyIssues.filter(i => i.state === 'closed').length;

  // Average and median time-to-close
  let avgDaysToClose = 'N/A';
  let medianDaysToClose = 'N/A';
  if (closeDays.length > 0) {
    avgDaysToClose = (closeDays.reduce((a, b) => a + b, 0) / closeDays.length).toFixed(1);
    const sorted = [...closeDays].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    medianDaysToClose = sorted.length % 2 !== 0
      ? sorted[mid].toFixed(1)
      : ((sorted[mid - 1] + sorted[mid]) / 2).toFixed(1);
  }

  // Sort months descending for display
  const sortedMonths = Object.entries(byMonth)
    .sort(([a], [b]) => b.localeCompare(a))
    .slice(0, 12); // last 12 months

  return { sortedMonths, totalOpen, totalClosed, avgDaysToClose, medianDaysToClose, total: dottyIssues.length };
}

// ─── 3. central-release-notes confidence metadata ─────────────────────────────

async function getConfidenceMetadata() {
  console.log('  Reading central-release-notes JSON files...');
  // Use the Git Trees API to get all file paths in one call
  const tree = await ghFetch('/repos/dbt-labs/central-release-notes/git/trees/main?recursive=1');
  const jsonPaths = tree.tree
    .filter(f => f.type === 'blob' && /^release-data\/.+\.json$/.test(f.path));

  console.log(`  Found ${jsonPaths.length} JSON files in central-release-notes`);

  const confDist = { HIGH: 0, MEDIUM: 0, LOW: 0, UNKNOWN: 0 };
  let featureFlagged = 0;

  for (const file of jsonPaths) {
    try {
      const raw = await ghFetch(`/repos/dbt-labs/central-release-notes/contents/${file.path}`);
      const json = JSON.parse(Buffer.from(raw.content, 'base64').toString());
      const conf = (json.confidence || 'UNKNOWN').toUpperCase();
      confDist[conf] = (confDist[conf] || 0) + 1;
      if (json.is_feature_flagged) featureFlagged++;
    } catch (e) {
      console.warn(`  Could not parse ${file.path}: ${e.message}`);
    }
  }

  const total = jsonPaths.length;
  return { confDist, featureFlagged, total };
}

// ─── 4. Notion updater (via RunLayer MCP) ────────────────────────────────────

async function runlayerCall(toolName, args) {
  const res = await fetch(RUNLAYER_MCP_URL, {
    method: 'POST',
    headers: {
      'x-runlayer-api-key': RUNLAYER_API_TOKEN,
      'Content-Type': 'application/json',
      Accept: 'application/json, text/event-stream',
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      method: 'tools/call',
      params: { name: toolName, arguments: args },
      id: Date.now(),
    }),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`RunLayer MCP ${toolName} → ${res.status}: ${body}`);
  }
  const json = await res.json();
  if (json.error) throw new Error(`RunLayer MCP ${toolName} error: ${JSON.stringify(json.error)}`);
  return json.result;
}

async function updateNotionPage(searchMetrics, issueBacklog, confData) {
  const { repoMetrics, totals } = searchMetrics;
  const repoNames = Object.keys(repoMetrics);
  const repoValues = Object.values(repoMetrics);
  const updatedAt = new Date().toUTCString();
  const pct = (n, total) => total ? ((n / total) * 100).toFixed(0) + '%' : 'N/A';

  const sep = `|---|${repoNames.map(() => '---').join('|')}|---|`;

  const md = [
    `> 🤖 Auto-updated: ${updatedAt} — Do not edit the sections below`,
    '',
    '---',
    '',
    '## 📊 Summary (all time)',
    '',
    `| Metric | ${repoNames.join(' | ')} | Total |`,
    sep,
    `| PRs analyzed (Dotty + Cursor) | ${repoValues.map(r => r.totalAnalyzed).join(' | ')} | ${totals.totalAnalyzed} |`,
    `| ↳ Dotty era (Apr 2026+) | ${repoValues.map(r => r.totalDotty).join(' | ')} | ${repoValues.reduce((s, r) => s + r.totalDotty, 0)} |`,
    `| ↳ Cursor era (older workflow) | ${repoValues.map(r => r.totalCursor).join(' | ')} | ${repoValues.reduce((s, r) => s + r.totalCursor, 0)} |`,
    `| Classified customer-facing (Dotty) | ${repoValues.map(r => r.cfDotty).join(' | ')} | ${totals.cfDotty} |`,
    `| Classified NOT customer-facing (Dotty) | ${repoValues.map(r => r.notCfDotty).join(' | ')} | ${totals.notCfDotty} |`,
    `| Human corrections (Dotty era) | ${repoValues.map(r => r.corrections).join(' | ')} | ${totals.corrections} |`,
    `| ↳ False positives (CF label removed) | ${repoValues.map(r => r.falsePositives).join(' | ')} | ${totals.falsePositives} |`,
    `| ↳ False negatives (CF label added) | ${repoValues.map(r => r.falseNegatives).join(' | ')} | ${totals.falseNegatives} |`,
    `| Accuracy rate (Dotty era) | ${repoValues.map(r => r.accuracyRate).join(' | ')} | ${totals.accuracyRate} |`,
    '',
    '_Note: accuracy data is for Dotty era only (Cursor era corrections were not tracked)._',
    '',
    '---',
    '',
    '## 📅 Docs Issue Backlog (last 12 months)',
    '',
    `Total open: **${issueBacklog.totalOpen}** | Total closed: **${issueBacklog.totalClosed}** | Avg days to close: **${issueBacklog.avgDaysToClose}** | Median: **${issueBacklog.medianDaysToClose}**`,
    '',
    '| Month | Created | Closed | Outstanding |',
    '|---|---|---|---|',
    ...issueBacklog.sortedMonths.map(([month, data]) =>
      `| ${month} | ${data.created} | ${data.closed} | ${data.created - data.closed} |`
    ),
    '',
    '---',
    '',
    '## 🎯 Confidence Distribution (confirmed customer-facing PRs)',
    '',
    `Based on ${confData.total} JSON files in central-release-notes (PRs merged with needs-docs label confirmed).`,
    '',
    '| Confidence level | Count | % of total |',
    '|---|---|---|',
    `| HIGH | ${confData.confDist.HIGH} | ${pct(confData.confDist.HIGH, confData.total)} |`,
    `| MEDIUM | ${confData.confDist.MEDIUM} | ${pct(confData.confDist.MEDIUM, confData.total)} |`,
    `| LOW | ${confData.confDist.LOW} | ${pct(confData.confDist.LOW, confData.total)} |`,
    `| Feature-flagged PRs | ${confData.featureFlagged} | ${pct(confData.featureFlagged, confData.total)} |`,
  ].join('\n');

  console.log('  Replacing Notion page content via RunLayer MCP...');
  await runlayerCall('notion-update-page', {
    page_id: NOTION_PAGE_ID,
    command: 'replace_content',
    properties: {},
    content_updates: [],
    new_str: md,
    allow_deleting_content: true,
  });

  console.log(`  ✅ Notion page updated: https://www.notion.so/${NOTION_PAGE_ID.replace(/-/g, '')}`);
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('🤖 Dotty Metrics — starting aggregation...\n');

  console.log('1/3 Querying GitHub search (per source repo)...');
  const searchMetrics = await getSearchMetrics();

  console.log('\n2/3 Fetching docs-internal issue backlog...');
  const issueBacklog = await getIssueBacklog();

  console.log('\n3/3 Reading central-release-notes confidence metadata...');
  const confData = await getConfidenceMetadata();

  console.log('\nUpdating Notion dashboard...');
  await updateNotionPage(searchMetrics, issueBacklog, confData);

  console.log('\n✅ Done.');
}

main().catch(err => {
  console.error('❌ Fatal error:', err);
  process.exit(1);
});
