/**
 * Scrapes built-in SQL functions for one or all configured data platforms,
 * cross-references each with dbt Fusion's typechecking support list,
 * and writes per-platform JSON to website/static/data/functions/<platform>.json.
 *
 * Usage:
 *   node scripts/fetch-platform-functions.js                # all platforms
 *   node scripts/fetch-platform-functions.js snowflake      # single platform
 *   node scripts/fetch-platform-functions.js snowflake databricks
 *
 * Run via GitHub Actions (see .github/workflows/update-platform-functions.yml).
 * Not for prebuild/prestart — makes external network calls.
 *
 * Requires: node-html-parser, js-yaml (devDependencies)
 * Env vars (set as GitHub Actions secrets):
 *   FUSION_REPO_TOKEN   — PAT with read access to the Fusion functions repo
 *   FUSION_REPO         — owner/repo of the Fusion functions source
 *   FUSION_BASE_PATH    — base path within that repo to the per-platform YAML files
 */

const fs = require('fs');
const path = require('path');
const { PLATFORMS } = require('./platforms.config');
const { buildFusionIndex, isFunctionSupported, normalizeFunctionKey } = require('./fusion-match');

// Defaults match dbt-labs/fs (private; requires FUSION_REPO_TOKEN with repo read access).
const FUSION_REPO = process.env.FUSION_REPO || 'dbt-labs/fs';
const FUSION_BASE_PATH =
  process.env.FUSION_BASE_PATH || 'crates/sdf-sql-functions/assets';
const OUT_DIR = path.join(__dirname, '..', 'static', 'data', 'functions');

// ---------------------------------------------------------------------------
// Fetch helpers
// ---------------------------------------------------------------------------

async function fetchText(url, { token } = {}) {
  const headers = { 'User-Agent': 'dbt-docs-bot/1.0' };
  if (token) headers['Authorization'] = `token ${token}`;
  const res = await fetch(url, { headers });
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${url}`);
  return res.text();
}

async function fetchGitHubFile(repoPath, filePath, token) {
  const apiUrl = `https://api.github.com/repos/${repoPath}/contents/${filePath}`;
  const headers = { 'User-Agent': 'dbt-docs-bot/1.0', Accept: 'application/vnd.github.raw+json' };
  if (token) headers['Authorization'] = `token ${token}`;
  const res = await fetch(apiUrl, { headers });
  // Intentionally omit the URL from the error to avoid leaking repo details in logs
  if (!res.ok) {
    const err = new Error(`HTTP ${res.status} fetching fusion function list`);
    err.status = res.status;
    throw err;
  }
  return res.text();
}

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

// Per-platform spot-checks: functions Fusion is known to typecheck. Overloaded
// entries use their scraped parenthetical form so a regression in qualifier
// stripping fails the run instead of silently flipping them to false.
const SPOT_CHECKS = {
  snowflake: ['ABS'],
  bigquery: ['ABS', 'LAST_DAY (Datetime)', 'STRING (Timestamp)', 'PERCENTILE_CONT (Navigation)'],
  databricks: ['ABS'],
  redshift: ['ABS'],
  trino: ['ABS'],
  duckdb: ['ABS'],
};

function validate(platform, functions) {
  const minExpected = { snowflake: 400, databricks: 100, redshift: 100, bigquery: 100, trino: 100, duckdb: 50 };
  const min = minExpected[platform.id] ?? 50;

  if (functions.length < min) {
    throw new Error(
      `[${platform.id}] Expected ${min}+ functions, got ${functions.length} — ` +
      `${platform.name} may have changed their page structure`
    );
  }

  const missingNames = functions.filter((f) => !f.name);
  if (missingNames.length > 0) {
    throw new Error(
      `[${platform.id}] ${missingNames.length} functions are missing names — check the scraper selectors`
    );
  }

  const typecheckCount = functions.filter((f) => f.fusion_typecheck).length;
  if (typecheckCount === 0) {
    throw new Error(
      `[${platform.id}] No fusion-supported functions found — check YAML parsing`
    );
  }

  // Spot-check known stable functions to catch join-logic regressions. Each
  // listed name MUST resolve to fusion_typecheck: true. Overloaded names are
  // included in their scraped parenthetical form to guard the matching path
  // that strips qualifiers (e.g. "LAST_DAY (Datetime)" ↔ Fusion "last_day").
  for (const expected of SPOT_CHECKS[platform.id] ?? []) {
    const target = normalizeFunctionKey(expected);
    const fn = functions.find((f) => normalizeFunctionKey(f.name) === target);
    if (!fn) {
      throw new Error(`[${platform.id}] spot-check function "${expected}" not found — scraper may be broken`);
    }
    if (!fn.fusion_typecheck) {
      throw new Error(`[${platform.id}] spot-check "${expected}" is not marked fusion_typecheck — check the join logic`);
    }
  }

  console.log(`  ✓ ${functions.length} functions, ${typecheckCount} with typechecking support`);
}

// ---------------------------------------------------------------------------
// Per-platform processing
// ---------------------------------------------------------------------------

async function processPlatform(platform, token) {
  console.log(`\n[${platform.id}] Fetching ${platform.name} functions from ${platform.functionsUrl}`);
  const scraped = platform.fetchFunctions
    ? await platform.fetchFunctions((url) => fetchText(url, { token }))
    : platform.parseHtml(await fetchText(platform.functionsUrl));
  console.log(`[${platform.id}] Parsed ${scraped.length} functions from docs`);

  console.log(`[${platform.id}] Fetching Fusion typechecking support list`);
  let fusionIndex = null;
  try {
    if (!FUSION_REPO || !FUSION_BASE_PATH) {
      throw new Error('FUSION_REPO and FUSION_BASE_PATH env vars must be set');
    }
    const yamlPath = `${FUSION_BASE_PATH}/${platform.id}/functions.sdf.yml`;
    const yamlText = await fetchGitHubFile(FUSION_REPO, yamlPath, token);
    fusionIndex = buildFusionIndex(yamlText, platform.id);
    console.log(`[${platform.id}] Parsed ${fusionIndex.supportedNames.size} supported function names`);
  } catch (err) {
    console.warn(`[${platform.id}] Warning: could not fetch Fusion support list: ${err.message}`);
    if (err.status === 401) {
      console.warn(
        `[${platform.id}] FUSION_REPO_TOKEN was rejected (HTTP 401). Update the GitHub Actions ` +
          'secret with a PAT that can read dbt-labs/fs (fine-grained tokens need dbt-labs SSO authorization).'
      );
    } else if (err.status === 404) {
      console.warn(
        `[${platform.id}] Check FUSION_REPO (${FUSION_REPO}) and FUSION_BASE_PATH (${FUSION_BASE_PATH}).`
      );
    }
    console.warn(`[${platform.id}] fusion_typecheck will be false for all entries`);
  }

  const merged = scraped.map((fn) => ({
    name: fn.name,
    category: fn.category,
    docs_url: fn.docs_url,
    preview_status: fn.preview_status,
    fusion_typecheck: fusionIndex
      ? isFunctionSupported(fn, platform.id, fusionIndex)
      : false,
  }));

  merged.sort((a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name));

  validate(platform, merged);

  const outPath = path.join(OUT_DIR, `${platform.id}.json`);
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const output = {
    _meta: {
      platform: platform.id,
      platform_name: platform.name,
      fetched_at: new Date().toISOString(),
      count: merged.length,
    },
    functions: merged,
  };
  fs.writeFileSync(outPath, JSON.stringify(output, null, 2), 'utf8');
  console.log(`[${platform.id}] Wrote ${merged.length} functions to ${outPath}`);
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const token = process.env.FUSION_REPO_TOKEN;
  if (!token) console.warn('Warning: FUSION_REPO_TOKEN not set — Fusion support list will be unavailable');

  const args = process.argv.slice(2);
  const targets = args.length
    ? PLATFORMS.filter((p) => args.includes(p.id))
    : PLATFORMS;

  if (!targets.length) {
    console.error(`Unknown platform(s): ${args.join(', ')}`);
    console.error(`Available: ${PLATFORMS.map((p) => p.id).join(', ')}`);
    process.exit(1);
  }

  const errors = [];
  for (const platform of targets) {
    try {
      await processPlatform(platform, token);
    } catch (err) {
      console.error(`[${platform.id}] FAILED: ${err.message}`);
      errors.push({ platform: platform.id, error: err.message });
    }
  }

  if (errors.length) {
    console.error(`\n${errors.length} platform(s) failed:`);
    for (const { platform, error } of errors) console.error(`  ${platform}: ${error}`);
    process.exit(1);
  }

  console.log('\nAll platforms updated successfully.');
}

main();
