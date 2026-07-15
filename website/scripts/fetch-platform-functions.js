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
const { buildFusionIndex, isFunctionSupported } = require('./fusion-match');

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

// How many functions to spot-check from each oracle pool per run.
const SPOT_CHECK_SAMPLE_SIZE = 8;

// Fisher-Yates pick of up to `n` items, using an injectable RNG so tests can
// seed it. Does not mutate the input.
function sampleRandom(arr, n, rng = Math.random) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a.slice(0, n);
}

// Spot-check the name/URL matching against regressions on every run, with a
// fresh random sample (no frozen list to maintain). Fusion's own support list
// is the oracle: any function Fusion lists that also appears in the scraped
// docs MUST come out as fusion_typecheck: true. Two pools are sampled, both
// derived independently of the matcher under test so the check isn't circular:
//   - exact:    scraped name is verbatim a Fusion name (guards the basic path)
//   - overload: scraped name has a trailing "(qualifier)" whose base is a
//               Fusion name (guards qualifier stripping — the regression that
//               flipped "LAST_DAY (Datetime)" to false)
// Deterministic coverage of the matching logic itself lives in
// fusion-match.test.js, which needs no network and runs in normal CI.
function spotCheckMatching(platform, functions, fusionIndex, { sampleSize = SPOT_CHECK_SAMPLE_SIZE, rng = Math.random } = {}) {
  if (!fusionIndex) return; // no Fusion oracle this run — nothing to check against
  const fusionNames = fusionIndex.supportedNames; // Set of UPPERCASE Fusion names

  const exact = [];
  const overload = [];
  for (const fn of functions) {
    const upper = fn.name.toUpperCase();
    if (fusionNames.has(upper)) {
      exact.push(fn);
    } else if (/\([^()]*\)\s*$/.test(upper)) {
      const base = upper.replace(/\s*\([^()]*\)\s*$/, '').trim();
      if (fusionNames.has(base)) overload.push(fn);
    }
  }

  const sampled = [
    ...sampleRandom(exact, sampleSize, rng),
    ...sampleRandom(overload, sampleSize, rng),
  ];
  const failures = sampled.filter((fn) => !fn.fusion_typecheck).map((fn) => fn.name);
  if (failures.length) {
    throw new Error(
      `[${platform.id}] spot-check failed — these functions are in Fusion's functions.sdf.yml ` +
      `but the build marked them fusion_typecheck:false: ${failures.join(', ')}.\n` +
      `    Cause: the name/URL matching in scripts/fusion-match.js is missing matches it should make ` +
      `(this is a fresh random sample, so a re-run may surface different functions with the same root cause).\n` +
      `    Next: reproduce locally with \`cd website && npx jest fusion-match\`, then check ` +
      `normalizeFunctionKey / isFunctionSupported — likely the docs introduced a new scraped-name format ` +
      `(e.g. a new qualifier or alias) that Fusion lists differently.`
    );
  }
  console.log(`  ✓ spot-checked ${sampled.length} random Fusion functions (${overload.length} overloaded available)`);
}

function validate(platform, functions, fusionIndex) {
  const minExpected = { snowflake: 400, databricks: 100, redshift: 100, bigquery: 100, trino: 100, duckdb: 50 };
  const min = minExpected[platform.id] ?? 50;

  if (functions.length < min) {
    throw new Error(
      `[${platform.id}] Expected ${min}+ functions, got ${functions.length}. ` +
      `${platform.name} likely changed their docs page layout.\n` +
      `    Next: open ${platform.functionsUrl} and update this platform's parseHtml/fetchFunctions ` +
      `selectors in scripts/platforms.config.js.`
    );
  }

  const missingNames = functions.filter((f) => !f.name);
  if (missingNames.length > 0) {
    throw new Error(
      `[${platform.id}] ${missingNames.length} scraped function(s) have an empty name.\n` +
      `    Next: the name selector in this platform's parseHtml in scripts/platforms.config.js is ` +
      `matching the wrong element — inspect ${platform.functionsUrl} and fix the selector.`
    );
  }

  const typecheckCount = functions.filter((f) => f.fusion_typecheck).length;
  if (typecheckCount === 0) {
    throw new Error(
      `[${platform.id}] 0 of ${functions.length} functions matched Fusion's support list. ` +
      `The scrape worked but the join produced nothing.\n` +
      `    Next: check the warnings above — usually the Fusion YAML failed to fetch (bad/expired ` +
      `FUSION_REPO_TOKEN) or moved (FUSION_REPO=${FUSION_REPO}, FUSION_BASE_PATH=${FUSION_BASE_PATH}). ` +
      `If both are fine, the YAML format may have changed — check buildFusionIndex in scripts/fusion-match.js.`
    );
  }

  spotCheckMatching(platform, functions, fusionIndex);

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

  validate(platform, merged, fusionIndex);

  const outPath = path.join(OUT_DIR, `${platform.id}.json`);
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const output = {
    // Intentionally no fetch timestamp: it would change on every run and open a
    // PR even when no function data changed. Git history records when data moves.
    _meta: {
      platform: platform.id,
      platform_name: platform.name,
      count: merged.length,
    },
    functions: merged,
  };
  fs.writeFileSync(outPath, JSON.stringify(output, null, 2) + '\n', 'utf8');
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

if (require.main === module) {
  main();
}

module.exports = { validate, spotCheckMatching, sampleRandom };
