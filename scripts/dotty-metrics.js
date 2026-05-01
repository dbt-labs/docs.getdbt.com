#!/usr/bin/env node
/**
 * Dotty Workflow Metrics Aggregator
 *
 * Queries GitHub (search API + issues API + central-release-notes repo) to compute
 * Dotty accuracy and docs backlog metrics, then syncs results to Notion databases.
 *
 * Run locally:
 *   GH_TOKEN=ghp_... RUNLAYER_API_TOKEN=... NOTION_PAGE_ID=34cbb38ebda781f09d03d1e98527d6a8 node scripts/dotty-metrics.js
 */

const { readFileSync, writeFileSync } = require('fs');
const { join } = require('path');

const GH_TOKEN = process.env.GH_TOKEN;
const RUNLAYER_API_TOKEN = process.env.RUNLAYER_API_TOKEN;
const NOTION_PAGE_ID = process.env.NOTION_PAGE_ID;

if (!GH_TOKEN || !RUNLAYER_API_TOKEN || !NOTION_PAGE_ID) {
  console.error('Missing required env vars: GH_TOKEN, RUNLAYER_API_TOKEN, NOTION_PAGE_ID');
  process.exit(1);
}

const RUNLAYER_MCP_URL = 'https://dbt.runlayer.com/api/v1/proxy/24736211-1060-47e7-897e-fdf5a531a3d5/mcp';
const CONFIG_PATH = join(__dirname, 'dotty-metrics-config.json');

// Repos where Dotty/Cursor analysis workflow runs — edit scripts/dotty-metrics-config.json to update
const config = JSON.parse(readFileSync(CONFIG_PATH, 'utf8'));
const SOURCE_REPOS = config.sourceRepos;

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

    const totalDotty     = await searchCount(`${base} "Dotty analysis" in:comments`);
    const totalCursor    = await searchCount(`${base} "Cursor analysis" in:comments`);
    const cfDotty        = await searchCount(`${base} "Added \`needs-docs\` label" "Dotty analysis" in:comments`);
    const notCfDotty     = await searchCount(`${base} "No label added" "Dotty analysis" in:comments`);
    const corrections    = await searchCount(`${base} "Dotty correction detected" in:comments`);
    const falsePositives = await searchCount(`${base} "FALSE_POSITIVE" "Dotty correction detected" in:comments`);
    const falseNegatives = await searchCount(`${base} "FALSE_NEGATIVE" "Dotty correction detected" in:comments`);

    if (totalCursor > totalDotty * 20 && totalDotty > 0) {
      console.warn(`  ⚠️  ${repo}: Cursor count (${totalCursor}) is >20x Dotty count — may include Cursor Bugbot code reviews`);
    }

    const totalAnalyzed = totalDotty + totalCursor;
    const accuracyRate = cfDotty > 0
      ? (((cfDotty - falsePositives) / cfDotty) * 100).toFixed(1) + '%'
      : 'N/A';

    repoMetrics[repoSlug] = {
      totalDotty, totalCursor, totalAnalyzed, cfDotty, notCfDotty,
      corrections, falsePositives, falseNegatives, accuracyRate,
    };

    console.log(`    analyzed=${totalAnalyzed} (dotty=${totalDotty}, cursor=${totalCursor}), cf=${cfDotty}, corrections=${corrections}`);
  }

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

  const byMonth = {};
  const closeDays = [];

  for (const issue of dottyIssues) {
    const month = issue.created_at.slice(0, 7);
    byMonth[month] ??= { created: 0, closed: 0, sourceRepos: {} };
    byMonth[month].created++;

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

  const sortedMonths = Object.entries(byMonth)
    .sort(([a], [b]) => b.localeCompare(a))
    .slice(0, 12);

  return { sortedMonths, totalOpen, totalClosed, avgDaysToClose, medianDaysToClose, total: dottyIssues.length };
}

// ─── 3. central-release-notes confidence metadata ─────────────────────────────

async function getConfidenceMetadata() {
  console.log('  Reading central-release-notes JSON files...');
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

  return { confDist, featureFlagged, total: jsonPaths.length };
}

// ─── 4. Notion database sync ──────────────────────────────────────────────────

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

function parseDataSourceId(text) {
  const m = text.match(/collection:\/\/([a-f0-9-]{36})/);
  if (!m) throw new Error(`Could not find data source ID in response: ${text.slice(0, 300)}`);
  return m[1];
}

function extractPageId(url) {
  const m = String(url).match(/([a-f0-9]{32})/i);
  return m ? m[1] : url;
}

async function createDatabase(title, schema) {
  console.log(`  Creating Notion database: ${title}`);
  const result = await runlayerCall('notion-create-database', {
    parent: { page_id: NOTION_PAGE_ID },
    title,
    schema,
  });
  return parseDataSourceId(result.content[0].text);
}

async function ensureDatabases() {
  let updated = false;
  if (!config.notionDatabases) config.notionDatabases = {};

  if (!config.notionDatabases.accuracy) {
    config.notionDatabases.accuracy = await createDatabase(
      '📊 Accuracy by Repo',
      `CREATE TABLE ("Repo" TITLE, "PRs Analyzed" NUMBER, "Dotty Era" NUMBER, "Cursor Era" NUMBER, "Customer-Facing" NUMBER, "Not Customer-Facing" NUMBER, "Corrections" NUMBER, "False Positives" NUMBER, "False Negatives" NUMBER, "Accuracy Rate" RICH_TEXT)`
    );
    updated = true;
  }
  if (!config.notionDatabases.backlog) {
    config.notionDatabases.backlog = await createDatabase(
      '📅 Issue Backlog by Month',
      `CREATE TABLE ("Month" TITLE, "Created" NUMBER, "Closed" NUMBER, "Outstanding" NUMBER)`
    );
    updated = true;
  }
  if (!config.notionDatabases.confidence) {
    config.notionDatabases.confidence = await createDatabase(
      '🎯 Confidence Distribution',
      `CREATE TABLE ("Level" TITLE, "Count" NUMBER, "Percentage" RICH_TEXT)`
    );
    updated = true;
  }

  if (updated) {
    writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2) + '\n');
    console.log('  ✅ Database IDs saved to config');
  }

  return config.notionDatabases;
}

async function getExistingRows(dataSourceId, keyProp) {
  const dsUrl = `collection://${dataSourceId}`;
  const result = await runlayerCall('notion-query-data-sources', {
    data: {
      data_source_urls: [dsUrl],
      query: `SELECT url, "${keyProp}" FROM "${dsUrl}"`,
    },
  });
  const text = result.content[0].text;
  const map = {};
  try {
    const rows = JSON.parse(text);
    for (const row of (Array.isArray(rows) ? rows : (rows.results || []))) {
      if (row[keyProp] && row.url) map[String(row[keyProp])] = extractPageId(row.url);
    }
  } catch {
    console.warn(`  Could not parse existing rows for "${keyProp}", will create all rows fresh`);
  }
  return map;
}

async function upsertRows(dataSourceId, keyProp, rows) {
  const existing = await getExistingRows(dataSourceId, keyProp);
  for (const row of rows) {
    const key = String(row[keyProp]);
    const pageId = existing[key];
    if (pageId) {
      await runlayerCall('notion-update-page', {
        page_id: pageId,
        command: 'update_properties',
        properties: row,
        content_updates: [],
      });
    } else {
      await runlayerCall('notion-create-pages', {
        parent: { data_source_id: dataSourceId },
        pages: [{ properties: row }],
      });
    }
  }
}

async function syncToNotionDatabases(searchMetrics, issueBacklog, confData) {
  const { repoMetrics, totals } = searchMetrics;
  const dbs = await ensureDatabases();
  const pct = (n, total) => total ? ((n / total) * 100).toFixed(0) + '%' : 'N/A';

  console.log('  Syncing accuracy database...');
  const accuracyRows = [
    ...Object.entries(repoMetrics).map(([repo, r]) => ({
      'Repo': repo,
      'PRs Analyzed': r.totalAnalyzed,
      'Dotty Era': r.totalDotty,
      'Cursor Era': r.totalCursor,
      'Customer-Facing': r.cfDotty,
      'Not Customer-Facing': r.notCfDotty,
      'Corrections': r.corrections,
      'False Positives': r.falsePositives,
      'False Negatives': r.falseNegatives,
      'Accuracy Rate': r.accuracyRate,
    })),
    {
      'Repo': '⬤ Total',
      'PRs Analyzed': totals.totalAnalyzed,
      'Dotty Era': Object.values(repoMetrics).reduce((s, r) => s + r.totalDotty, 0),
      'Cursor Era': Object.values(repoMetrics).reduce((s, r) => s + r.totalCursor, 0),
      'Customer-Facing': totals.cfDotty,
      'Not Customer-Facing': totals.notCfDotty,
      'Corrections': totals.corrections,
      'False Positives': totals.falsePositives,
      'False Negatives': totals.falseNegatives,
      'Accuracy Rate': totals.accuracyRate,
    },
  ];
  await upsertRows(dbs.accuracy, 'Repo', accuracyRows);

  console.log('  Syncing backlog database...');
  const backlogRows = issueBacklog.sortedMonths.map(([month, data]) => ({
    'Month': month,
    'Created': data.created,
    'Closed': data.closed,
    'Outstanding': data.created - data.closed,
  }));
  await upsertRows(dbs.backlog, 'Month', backlogRows);

  console.log('  Syncing confidence database...');
  const confRows = [
    { 'Level': 'HIGH',            'Count': confData.confDist.HIGH,    'Percentage': pct(confData.confDist.HIGH, confData.total) },
    { 'Level': 'MEDIUM',          'Count': confData.confDist.MEDIUM,  'Percentage': pct(confData.confDist.MEDIUM, confData.total) },
    { 'Level': 'LOW',             'Count': confData.confDist.LOW,     'Percentage': pct(confData.confDist.LOW, confData.total) },
    { 'Level': 'Feature-Flagged', 'Count': confData.featureFlagged,   'Percentage': pct(confData.featureFlagged, confData.total) },
  ];
  await upsertRows(dbs.confidence, 'Level', confRows);

  console.log(`  ✅ Notion databases updated: https://www.notion.so/${NOTION_PAGE_ID.replace(/-/g, '')}`);
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
  await syncToNotionDatabases(searchMetrics, issueBacklog, confData);

  console.log('\n✅ Done.');
}

main().catch(err => {
  console.error('❌ Fatal error:', err);
  process.exit(1);
});
