/**
 * Closes open dbt-fusion gap issues that are false positives (function already
 * exists in functions.sdf.yml under a different spelling or docs URL).
 *
 * Usage:
 *   node scripts/close-fusion-false-positive-issues.js           # dry-run
 *   node scripts/close-fusion-false-positive-issues.js --apply   # close issues
 *
 * Env: FUSION_ISSUES_TOKEN (issues:write on dbt-labs/dbt-fusion)
 *      FUSION_REPO_TOKEN   (read dbt-labs/fs — same as fetch script)
 */

const { execSync } = require('child_process');
const {
  buildFusionIndex,
  isFunctionSupported,
  normalizeFunctionUrl,
} = require('./fusion-match');

const ISSUES_REPO = 'dbt-labs/dbt-fusion';
const FUSION_REPO = process.env.FUSION_REPO || 'dbt-labs/fs';
const FUSION_BASE_PATH =
  process.env.FUSION_BASE_PATH || 'crates/sdf-sql-functions/assets';

const PLATFORM_MAP = {
  snowflake: 'snowflake',
  databricks: 'databricks',
  duckdb: 'duckdb',
  redshift: 'redshift',
  'amazon redshift': 'redshift',
  bigquery: 'bigquery',
  trino: 'trino',
};

function fetchFusionYaml(platformId, token) {
  const filePath = `${FUSION_BASE_PATH}/${platformId}/functions.sdf.yml`;
  if (token) {
    return fetch(`https://api.github.com/repos/${FUSION_REPO}/contents/${filePath}`, {
      headers: {
        'User-Agent': 'dbt-docs-bot/1.0',
        Accept: 'application/vnd.github.raw+json',
        Authorization: `token ${token}`,
      },
    }).then((res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status} fetching ${platformId} functions.sdf.yml`);
      return res.text();
    });
  }
  // Local triage: use authenticated `gh` when no PAT is in the environment.
  return execSync(
    `gh api repos/${FUSION_REPO}/contents/${filePath} -H "Accept: application/vnd.github.raw"`,
    { encoding: 'utf8', maxBuffer: 50 * 1024 * 1024 }
  );
}

function listWorkflowIssues() {
  const raw = execSync(
    `gh issue list --repo ${ISSUES_REPO} --author mirnawong1 --state open --limit 500 ` +
      '--json number,title,body',
    { encoding: 'utf8', maxBuffer: 30 * 1024 * 1024 }
  );
  return JSON.parse(raw).filter((i) => /Add typechecking support for/.test(i.title));
}

function parseIssue(issue) {
  const titleMatch = issue.title.match(/^\[([^\]]+)\] Add typechecking support for (.+)$/);
  if (!titleMatch) return null;
  const platformId = PLATFORM_MAP[titleMatch[1].toLowerCase()];
  if (!platformId) return null;
  const bodyMatch = issue.body?.match(/\*\*Function:\*\* \[([^\]]+)\]\(([^)]+)\)/);
  return {
    number: issue.number,
    title: issue.title,
    platformId,
    name: titleMatch[2].trim().toUpperCase(),
    docs_url: bodyMatch?.[2] || '',
  };
}

function supportReason(fn, platformId, index) {
  const name = fn.name.toUpperCase();
  if (index.supportedNames.has(name)) return `name: ${name}`;
  if (platformId === 'redshift') {
    const alt = name.replace(/TIMESTAMPTZ/g, 'TIMESTAMPZ');
    if (alt !== name && index.supportedNames.has(alt)) return `Redshift TIMESTAMPZ alias`;
  }
  const url = normalizeFunctionUrl(fn.docs_url);
  if (url && index.linkIndex.has(url)) {
    return `docs URL → ${index.linkIndex.get(url)}`;
  }
  const normKey = name.replace(/_/g, '');
  const fusion = index.normIndex.get(normKey);
  if (fusion && fusion.toUpperCase() !== name) return `spelling: ${fusion}`;
  return null;
}

async function closeIssue(number, platformId, reason, token) {
  const comment = [
    'Closing as false positive: this function is already covered in Fusion typechecking support',
    `(\`${FUSION_REPO}\` → \`${FUSION_BASE_PATH}/${platformId}/functions.sdf.yml\`).`,
    '',
    `Match: ${reason}.`,
    '',
    '_Automated triage via docs.getdbt.com `close-fusion-false-positive-issues.js`._',
  ].join('\n');

  const res = await fetch(`https://api.github.com/repos/${ISSUES_REPO}/issues/${number}`, {
    method: 'PATCH',
    headers: {
      'User-Agent': 'dbt-docs-bot/1.0',
      Accept: 'application/vnd.github+json',
      Authorization: `token ${token}`,
      'X-GitHub-Api-Version': '2022-11-28',
    },
    body: JSON.stringify({ state: 'closed', state_reason: 'not_planned' }),
  });
  if (!res.ok) throw new Error(`close #${number}: HTTP ${res.status} ${await res.text()}`);

  await fetch(`https://api.github.com/repos/${ISSUES_REPO}/issues/${number}/comments`, {
    method: 'POST',
    headers: {
      'User-Agent': 'dbt-docs-bot/1.0',
      Accept: 'application/vnd.github+json',
      Authorization: `token ${token}`,
      'X-GitHub-Api-Version': '2022-11-28',
    },
    body: JSON.stringify({ body: comment }),
  });
}

async function main() {
  const apply = process.argv.includes('--apply');
  const issuesToken = process.env.FUSION_ISSUES_TOKEN;
  const fusionToken = process.env.FUSION_REPO_TOKEN;

  if (apply && !issuesToken) {
    console.error('FUSION_ISSUES_TOKEN is required with --apply');
    process.exit(1);
  }

  const issues = listWorkflowIssues();
  console.log(`Scanning ${issues.length} open workflow issues...`);

  const indexCache = {};
  const toClose = [];

  for (const issue of issues) {
    const parsed = parseIssue(issue);
    if (!parsed) continue;

    if (!indexCache[parsed.platformId]) {
      const yamlText = await Promise.resolve(fetchFusionYaml(parsed.platformId, fusionToken));
      indexCache[parsed.platformId] = buildFusionIndex(yamlText, parsed.platformId);
    }

    const index = indexCache[parsed.platformId];
    const fn = { name: parsed.name, docs_url: parsed.docs_url };

    if (isFunctionSupported(fn, parsed.platformId, index)) {
      const reason = supportReason(fn, parsed.platformId, index);
      toClose.push({ ...parsed, reason });
    }
  }

  console.log(`\nFalse positives to close: ${toClose.length}`);
  for (const item of toClose) {
    console.log(`  #${item.number} — ${item.reason} | ${item.title}`);
  }

  if (!apply) {
    if (toClose.length) console.log('\nRe-run with --apply to close these issues.');
    return;
  }

  for (const item of toClose) {
    try {
      await closeIssue(item.number, item.platformId, item.reason, issuesToken);
      console.log(`  [closed] #${item.number}`);
    } catch (err) {
      console.error(`  [error] #${item.number}: ${err.message}`);
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
