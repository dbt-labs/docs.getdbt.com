/**
 * Reads website/static/data/functions/<platform>.json and generates a
 * markdown table snippet at website/snippets/_functions-table-<platform>.md.
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

function buildTable(functions) {
  const header = [
    '| <div style={{width:"120px"}}>Function</div> | Category | L2 typechecking | L3 local exec | Availability | Docs |',
    '|------|----------|:---------------:|:-------------:|--------------|------|',
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
    const l3 = f.fusion_local_exec ? '✓' : '—';
    const safeName = escape(f.name);
    // Wrap in a constrained span so the column stays narrow regardless of table-layout.
    // title= shows the full name on hover when it's truncated.
    const nameCell = `<span style={{display:"inline-block",maxWidth:"240px",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",verticalAlign:"middle"}} title="${safeName}">${safeName}</span>`;
    return `| ${nameCell} | ${escape(f.category)} | ${l2} | ${l3} | ${f.preview_status} | [docs](${f.docs_url}) |`;
  });

  return [header, ...rows].join('\n');
}

function generateForPlatform(platform) {
  const dataPath = path.join(DATA_DIR, `${platform.id}.json`);
  const outPath = path.join(SNIPPETS_DIR, `_functions-table-${platform.id}.md`);

  if (!fs.existsSync(dataPath)) {
    console.warn(`[${platform.id}] Data file not found at ${dataPath}, skipping`);
    return;
  }

  const raw = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  const functions = raw.functions || [];
  const fetchedAt = raw._meta?.fetched_at ?? 'unknown';

  let content;
  if (functions.length === 0) {
    content = `<!-- Auto-generated from ${dataPath}. Do not edit directly. -->

_Function data has not yet been populated. Trigger the \`update-platform-functions\` GitHub Action to generate it._
`;
  } else {
    content = `<!-- Auto-generated from ${platform.id}.json (${functions.length} functions, fetched ${fetchedAt}). Do not edit directly. -->

${buildTable(functions)}
`;
  }

  fs.mkdirSync(SNIPPETS_DIR, { recursive: true });
  fs.writeFileSync(outPath, content, 'utf8');
  console.log(`[${platform.id}] Wrote ${functions.length} functions to ${outPath}`);
}

const args = process.argv.slice(2);
const targets = args.length
  ? PLATFORMS.filter((p) => args.includes(p.id))
  : PLATFORMS;

for (const platform of targets) {
  generateForPlatform(platform);
}
