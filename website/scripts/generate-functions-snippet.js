/**
 * Reads website/static/data/functions/<platform>.json and generates, for each
 * platform:
 *   1. a filterable markdown table snippet at
 *      website/snippets/_functions-table-<platform>.md
 *   2. a uniform reference page at
 *      website/docs/reference/fusion-function-support/<platform>.md
 *
 * Both outputs come from a single template here, so every platform page stays
 * identical in structure. To add a platform, add one entry to
 * platforms.config.js and a sidebar line — no prose to copy.
 *
 * Runs at prebuild/prestart (no network calls — transforms committed JSON to markdown).
 *
 * Usage:
 *   node scripts/generate-functions-snippet.js            # all platforms
 *   node scripts/generate-functions-snippet.js snowflake  # single platform
 */

const fs = require('fs');
const path = require('path');
const { PLATFORMS } = require('./platforms.config');

const DATA_DIR = path.join(__dirname, '..', 'static', 'data', 'functions');
const SNIPPETS_DIR = path.join(__dirname, '..', 'snippets');
const PAGES_DIR = path.join(__dirname, '..', 'docs', 'reference', 'fusion-function-support');

function buildTable(functions) {
  const header = [
    '| <div style={{minWidth:"200px"}}>Function</div> | Category | Fusion typechecking |',
    '|------|----------|:-------------------:|',
  ].join('\n');

  const escape = (s) => s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/\|/g, '&#124;');

  const rows = functions.map((f) => {
    const l2 = f.fusion_typecheck ? '✓' : '—';
    const safeName = escape(f.name);
    const nameCell = `<a href="${f.docs_url}">${safeName}</a>`;
    return `| ${nameCell} | ${escape(f.category)} | ${l2} |`;
  });

  return [header, ...rows].join('\n');
}

// Builds the uniform per-platform reference page. Every platform gets the same
// structure — only the name, reference link, and coverage numbers change.
function buildPage(platform, functions) {
  const total = functions.length;
  const supported = functions.filter((f) => f.fusion_typecheck).length;
  const slugLine = platform.slug ? `slug: "${platform.slug}"\n` : '';

  return `---
title: "Supported ${platform.name} functions in dbt Fusion"
sidebar_label: "${platform.name}"
id: "${platform.id}-function-support"
description: "Check which ${platform.name} built-in SQL functions dbt Fusion can typecheck during static analysis."
tags: ['${platform.name}', 'dbt Fusion', 'static_analysis']
${slugLine}---

{/* Auto-generated from ${platform.id}.json by scripts/generate-functions-snippet.js. Do not edit directly. */}

import FunctionsTable from '/snippets/_functions-table-${platform.id}.md';

<Constant name="fusion"/> can validate that your ${platform.name} function arguments match expected types directly in <Constant name="dbt_platform"/>, the CLI, or using the dbt VS Code extension. To turn it on, run \`dbt login\` and set [\`static_analysis: strict\`](/docs/fusion/new-concepts?version=2.0) in your project configuration.

Today, <Constant name="fusion"/> can typecheck **${supported} of ${total}** ${platform.name} built-in functions. The table below lists every function and its support status — use the search and filters to find a specific one.

:::info Refreshed weekly
This table is updated weekly from the [${platform.refName}](${platform.functionsUrl}) and cross-referenced with <Constant name="fusion"/>'s support list. Spot a discrepancy? We'd love a fix — [open an issue](https://github.com/dbt-labs/dbt-core/issues) in the dbt Core repository.
:::

<FunctionsTable />
`;
}

function generateForPlatform(platform) {
  const dataPath = path.join(DATA_DIR, `${platform.id}.json`);
  const outPath = path.join(SNIPPETS_DIR, `_functions-table-${platform.id}.md`);
  const pagePath = path.join(PAGES_DIR, `${platform.id}.md`);

  if (!fs.existsSync(dataPath)) {
    console.warn(`[${platform.id}] Data file not found at ${dataPath}, skipping`);
    return;
  }

  const raw = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  const functions = raw.functions || [];

  let content;
  if (functions.length === 0) {
    content = `<!-- Auto-generated from ${dataPath}. Do not edit directly. -->

_Function data has not yet been populated. Trigger the \`update-platform-functions\` GitHub Action to generate it._
`;
  } else {
    content = `<!-- Auto-generated from ${platform.id}.json (${functions.length} functions). Do not edit directly. -->

${buildTable(functions)}
`;
  }

  fs.mkdirSync(SNIPPETS_DIR, { recursive: true });
  fs.writeFileSync(outPath, content, 'utf8');

  fs.mkdirSync(PAGES_DIR, { recursive: true });
  fs.writeFileSync(pagePath, buildPage(platform, functions), 'utf8');

  console.log(`[${platform.id}] Wrote ${functions.length} functions to ${outPath} and ${pagePath}`);
}

const args = process.argv.slice(2);
const targets = args.length
  ? PLATFORMS.filter((p) => args.includes(p.id))
  : PLATFORMS;

for (const platform of targets) {
  generateForPlatform(platform);
}
