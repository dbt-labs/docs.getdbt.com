#!/usr/bin/env node
/**
 * Dotty Workflow Metrics Aggregator
 *
 * Queries GitHub (search API + issues API + central-release-notes repo) to compute
 * Dotty accuracy and docs backlog metrics, then updates a Notion dashboard page.
 *
 * Run locally:
 *   GH_TOKEN=ghp_... NOTION_TOKEN=secret_... NOTION_PAGE_ID=34cbb38ebda781f09d03d1e98527d6a8 node scripts/dotty-metrics.js
 */

const GH_TOKEN = process.env.GH_TOKEN;
const NOTION_TOKEN = process.env.NOTION_TOKEN;
const NOTION_PAGE_ID = process.env.NOTION_PAGE_ID;

if (!GH_TOKEN || !NOTION_TOKEN || !NOTION_PAGE_ID) {
  console.error('Missing required env vars: GH_TOKEN, NOTION_TOKEN, NOTION_PAGE_ID');
  process.exit(1);
}

// Repos where Dotty/Cursor analysis workflow runs
const SOURCE_REPOS = ['dbt-labs/cloud-ui', 'dbt-labs/studio', 'dbt-labs/dbt-ui'];

// ─── GitHub helpers ────────────────────────────────────────────────────────────

async function ghFetch(path, options = {}) {
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
    throw new Error(`GitHub API ${path} → ${res.status}: ${body}`);
  }
  return res.json();
}

// Sequential search with 300ms throttle to stay under GitHub's 30 req/min limit
async function searchCount(query) {
  await new Promise(r => setTimeout(r, 300));
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

// ─── 4. Notion updater ────────────────────────────────────────────────────────

async function notionFetch(path, options = {}) {
  const res = await fetch(`https://api.notion.com/v1${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${NOTION_TOKEN}`,
      'Notion-Version': '2022-06-28',
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Notion API ${path} → ${res.status}: ${body}`);
  }
  return res.json();
}

function makeHeading(text, level = 2) {
  const type = level === 1 ? 'heading_1' : level === 2 ? 'heading_2' : 'heading_3';
  return { object: 'block', type, [type]: { rich_text: [{ type: 'text', text: { content: text } }] } };
}

function makeParagraph(text) {
  return { object: 'block', type: 'paragraph', paragraph: { rich_text: [{ type: 'text', text: { content: text } }] } };
}

function makeCallout(text, emoji = 'ℹ️') {
  return {
    object: 'block', type: 'callout',
    callout: { rich_text: [{ type: 'text', text: { content: text } }], icon: { type: 'emoji', emoji } },
  };
}

function makeTable(headers, rows) {
  return {
    object: 'block',
    type: 'table',
    table: {
      table_width: headers.length,
      has_column_header: true,
      has_row_header: false,
      children: [
        {
          object: 'block', type: 'table_row',
          table_row: { cells: headers.map(h => [{ type: 'text', text: { content: h }, annotations: { bold: true } }]) },
        },
        ...rows.map(row => ({
          object: 'block', type: 'table_row',
          table_row: { cells: row.map(cell => [{ type: 'text', text: { content: String(cell) } }]) },
        })),
      ],
    },
  };
}

function makeDivider() {
  return { object: 'block', type: 'divider', divider: {} };
}

async function updateNotionPage(searchMetrics, issueBacklog, confData) {
  const { repoMetrics, totals } = searchMetrics;
  const updatedAt = new Date().toUTCString();

  // Build all blocks
  const blocks = [
    makeCallout(`Auto-updated: ${updatedAt} — Do not edit the sections below`, '🤖'),
    makeDivider(),

    // Section 1: Summary table
    makeHeading('📊 Summary (all time)'),
    makeTable(
      ['Metric', ...Object.keys(repoMetrics), 'Total'],
      [
        ['PRs analyzed (Dotty + Cursor)', ...Object.values(repoMetrics).map(r => r.totalAnalyzed), totals.totalAnalyzed],
        ['↳ Dotty era (Apr 2026+)', ...Object.values(repoMetrics).map(r => r.totalDotty), Object.values(repoMetrics).reduce((s, r) => s + r.totalDotty, 0)],
        ['↳ Cursor era (older workflow)', ...Object.values(repoMetrics).map(r => r.totalCursor), Object.values(repoMetrics).reduce((s, r) => s + r.totalCursor, 0)],
        ['Classified customer-facing (Dotty)', ...Object.values(repoMetrics).map(r => r.cfDotty), totals.cfDotty],
        ['Classified NOT customer-facing (Dotty)', ...Object.values(repoMetrics).map(r => r.notCfDotty), totals.notCfDotty],
        ['Human corrections (Dotty era)', ...Object.values(repoMetrics).map(r => r.corrections), totals.corrections],
        ['↳ False positives (CF label removed)', ...Object.values(repoMetrics).map(r => r.falsePositives), totals.falsePositives],
        ['↳ False negatives (CF label added)', ...Object.values(repoMetrics).map(r => r.falseNegatives), totals.falseNegatives],
        ['Accuracy rate (Dotty era)', ...Object.values(repoMetrics).map(r => r.accuracyRate), totals.accuracyRate],
      ]
    ),
    makeParagraph(`Note: accuracy data is for Dotty era only (Cursor era corrections were not tracked).`),
    makeDivider(),

    // Section 2: Docs issue backlog
    makeHeading('📅 Docs Issue Backlog (last 12 months)'),
    makeParagraph(`Total open: ${issueBacklog.totalOpen}  |  Total closed: ${issueBacklog.totalClosed}  |  Avg days to close: ${issueBacklog.avgDaysToClose}  |  Median: ${issueBacklog.medianDaysToClose}`),
    makeTable(
      ['Month', 'Created', 'Closed', 'Outstanding'],
      issueBacklog.sortedMonths.map(([month, data]) => [
        month,
        data.created,
        data.closed,
        data.created - data.closed,
      ])
    ),
    makeDivider(),

    // Section 3: Confidence distribution
    makeHeading('🎯 Confidence Distribution (confirmed customer-facing PRs)'),
    makeParagraph(`Based on ${confData.total} JSON files in central-release-notes (PRs merged with needs-docs label confirmed).`),
    makeTable(
      ['Confidence level', 'Count', '% of total'],
      [
        ['HIGH',    confData.confDist.HIGH,    confData.total ? ((confData.confDist.HIGH / confData.total) * 100).toFixed(0) + '%' : 'N/A'],
        ['MEDIUM',  confData.confDist.MEDIUM,  confData.total ? ((confData.confDist.MEDIUM / confData.total) * 100).toFixed(0) + '%' : 'N/A'],
        ['LOW',     confData.confDist.LOW,     confData.total ? ((confData.confDist.LOW / confData.total) * 100).toFixed(0) + '%' : 'N/A'],
        ['Feature-flagged PRs', confData.featureFlagged, confData.total ? ((confData.featureFlagged / confData.total) * 100).toFixed(0) + '%' : 'N/A'],
      ]
    ),
  ];

  // Delete existing page children and replace
  console.log('  Fetching existing Notion page blocks...');
  const existing = await notionFetch(`/blocks/${NOTION_PAGE_ID}/children?page_size=100`);
  for (const block of existing.results) {
    await notionFetch(`/blocks/${block.id}`, { method: 'DELETE' });
  }

  // Append in batches of 100 (Notion API limit per request)
  console.log(`  Appending ${blocks.length} blocks to Notion page...`);
  for (let i = 0; i < blocks.length; i += 100) {
    await notionFetch(`/blocks/${NOTION_PAGE_ID}/children`, {
      method: 'PATCH',
      body: JSON.stringify({ children: blocks.slice(i, i + 100) }),
    });
  }

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
