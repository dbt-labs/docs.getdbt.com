/**
 * Per-platform configuration for function support data collection.
 *
 * Each entry describes:
 *  - id:             Machine identifier used as the platform key and directory name
 *  - name:           Display name used in docs and logs
 *  - functionsUrl:   Primary docs URL (used in logs; may redirect)
 *  - parseHtml:      Sync scraper for single-page sources (optional if fetchFunctions set)
 *  - fetchFunctions: Async scraper for multi-page sources (optional)
 *
 * To add a new platform: add one entry here and implement parseHtml or fetchFunctions.
 * The fetch and snippet-generation scripts are fully generic — no other files change.
 * Fusion typechecking source paths are configured via environment variables in the
 * GitHub Action (FUSION_REPO and FUSION_BASE_PATH) and is not stored here.
 */

const { parse: parseHtml } = require('node-html-parser');

const REDSHIFT_BASE = 'https://docs.aws.amazon.com/redshift/latest/dg/';
const DUCKDB_BASE = 'https://duckdb.org';

// ---------------------------------------------------------------------------
// URL resolution
// ---------------------------------------------------------------------------

/**
 * Resolve a function link's href against the page it was scraped from.
 *
 * Uses the WHATWG URL parser so every href shape resolves correctly:
 *  - absolute        ("https://…")                  → returned as-is
 *  - relative        ("functions/abs")              → resolved against the page dir
 *  - root-relative   ("/sql-reference/functions/x") → resolved against the origin
 *
 * Naive string concatenation (`base + href`) breaks on root-relative hrefs,
 * producing duplicated path segments like
 *   https://docs.snowflake.com/en/sql-reference//sql-reference/functions/finetune-show
 * which 404. Always resolve through this helper instead.
 */
function resolveDocsUrl(href, pageUrl) {
  if (!href) return '';
  try {
    return new URL(href, pageUrl).href;
  } catch {
    return href;
  }
}

// ---------------------------------------------------------------------------
// Shared HTML parsing helpers
// ---------------------------------------------------------------------------

const SNOWFLAKE_FUNCTIONS_URL = 'https://docs.snowflake.com/en/sql-reference/functions-all';

/**
 * Snowflake all-functions page uses a single flat table with columns:
 * [Function Name, Summary, Category]. Alphabetical separator rows (e.g. "A")
 * have no anchor in column 0 and are skipped automatically.
 */
function scrapeSnowflakeFlatTable(html) {
  const root = parseHtml(html);
  const functions = [];
  const table = root.querySelector('table');
  if (!table) return functions;

  for (const row of table.querySelectorAll('tr')) {
    const cells = row.querySelectorAll('td');
    if (cells.length < 3) continue;

    const anchor = cells[0].querySelector('a');
    if (!anchor) continue;

    const name = anchor.textContent.trim().toUpperCase();
    const href = anchor.getAttribute('href') || '';
    // Snowflake's hrefs are inconsistent: some are root-relative with the
    // locale ("/en/sql-reference/functions/abs"), some without it
    // ("/sql-reference/functions/abs"). Resolve against the page URL, then
    // guarantee the /en/ prefix so the link doesn't 301-redirect.
    let docsUrl = resolveDocsUrl(href, SNOWFLAKE_FUNCTIONS_URL);
    if (docsUrl.startsWith('https://docs.snowflake.com/sql-reference/')) {
      docsUrl = docsUrl.replace(
        'https://docs.snowflake.com/sql-reference/',
        'https://docs.snowflake.com/en/sql-reference/'
      );
    }

    const categoryAnchor = cells[2].querySelector('a');
    const category = categoryAnchor
      ? categoryAnchor.textContent.trim().replace(/\s*functions?$/i, '').trim()
      : cells[2].textContent.trim() || 'Uncategorized';

    const rowText = row.textContent;
    let previewStatus = 'GA';
    if (/private preview/i.test(rowText)) previewStatus = 'Private Preview';
    else if (/public preview/i.test(rowText)) previewStatus = 'Public Preview';

    functions.push({ name, category, docs_url: docsUrl, preview_status: previewStatus });
  }
  return functions;
}

// Derives a short display qualifier from a BigQuery docs URL path segment.
// Used to disambiguate functions that appear under multiple reference pages.
// e.g. aggregate-dp-functions → "Differential Privacy", date_functions → "Date"
function bigQueryUrlContext(url) {
  const match = url.match(/\/([a-z][a-z0-9_-]+[-_]functions)#/);
  if (!match) return null;
  const slug = match[1];
  if (slug === 'aggregate-dp-functions') return 'Differential Privacy';
  const label = slug.replace(/[-_]functions$/, '').replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
  return label.replace(/\bJson\b/, 'JSON').replace(/\bSql\b/, 'SQL');
}

function scrapeBigQueryFlatTable(html) {
  const root = parseHtml(html);
  const raw = [];
  const table = root.querySelector('main table') || root.querySelector('table');
  if (!table) return raw;

  const baseUrl = 'https://docs.cloud.google.com';
  for (const row of table.querySelectorAll('tr')) {
    const cells = row.querySelectorAll('td');
    if (cells.length < 2) continue;

    const anchor = cells[0].querySelector('a');
    const code = anchor?.querySelector('code') || anchor;
    if (!code) continue;

    const name = code.textContent.trim().toUpperCase();
    const href = anchor.getAttribute('href') || '';
    const docsUrl = href.startsWith('http') ? href : `${baseUrl}${href}`;

    raw.push({ name, docs_url: docsUrl });
  }

  // Count occurrences so we know which names need disambiguation
  const counts = {};
  for (const f of raw) counts[f.name] = (counts[f.name] || 0) + 1;

  // For duplicates: keep the aggregate_functions entry as the base name,
  // qualify everything else with its URL context
  const canonicalUrl = /\/aggregate_functions#/;
  const seen = new Set();
  const functions = [];

  for (const f of raw) {
    let displayName = f.name;
    if (counts[f.name] > 1 && !canonicalUrl.test(f.docs_url)) {
      const ctx = bigQueryUrlContext(f.docs_url);
      if (ctx) displayName = `${f.name} (${ctx})`;
    }
    if (seen.has(displayName)) continue;
    seen.add(displayName);
    functions.push({ name: displayName, category: 'Built-in', docs_url: f.docs_url, preview_status: 'GA' });
  }

  return functions;
}

function scrapeTrinoListPage(html) {
  const root = parseHtml(html);
  const article = root.querySelector('article') || root.querySelector('main');
  if (!article) return [];

  const functions = [];
  let currentCategory = 'Uncategorized';

  for (const section of article.querySelectorAll('section')) {
    const heading = section.querySelector('h2, h3');
    if (heading) {
      currentCategory = heading.textContent.trim().replace(/\s*¶.*$/, '');
    }

    for (const anchor of section.querySelectorAll('a.reference.internal')) {
      const code = anchor.querySelector('code');
      const text = (code || anchor).textContent.trim();
      const match = text.match(/^([a-z_][a-z0-9_]*)\(\)/i);
      if (!match) continue;

      const href = anchor.getAttribute('href') || '';
      const docsUrl = href.startsWith('http')
        ? href
        : `https://trino.io/docs/current/functions/${href.replace(/^\.\//, '')}`;

      functions.push({
        name: match[1].toUpperCase(),
        category: currentCategory,
        docs_url: docsUrl,
        preview_status: 'GA',
      });
    }
  }

  return [...new Map(functions.map((f) => [f.name, f])).values()];
}

function parseDuckdbFunctionName(codeText) {
  const trimmed = codeText.trim();
  const match =
    trimmed.match(/^@?\(?([a-z_][a-z0-9_]*)\s*\(/i) ||
    trimmed.match(/^([a-z_][a-z0-9_]*)\s*\(/i);
  return match ? match[1].toUpperCase() : null;
}

function scrapeDuckdbCategoryPage(html, pageUrl, category) {
  const root = parseHtml(html);
  const article = root.querySelector('article') || root.querySelector('main') || root;
  const functions = [];

  for (const table of article.querySelectorAll('table')) {
    const header = table.querySelector('th')?.textContent?.trim() || '';
    if (/operator/i.test(header)) continue;

    for (const row of table.querySelectorAll('tr')) {
      const cells = row.querySelectorAll('td');
      if (!cells.length) continue;

      const anchor = cells[0].querySelector('a');
      const code = anchor?.querySelector('code') || cells[0].querySelector('code');
      if (!code) continue;

      const name = parseDuckdbFunctionName(code.textContent);
      if (!name) continue;

      const hash = anchor?.getAttribute('href') || '';
      const docsUrl = hash.startsWith('#') ? `${pageUrl}${hash}` : pageUrl;

      functions.push({ name, category, docs_url: docsUrl, preview_status: 'GA' });
    }
  }

  return functions;
}

function scrapeRedshiftCategoryPage(html, category) {
  const root = parseHtml(html);
  const main = root.querySelector('#main-content') || root;
  const functions = [];

  for (const anchor of main.querySelectorAll('a')) {
    const href = anchor.getAttribute('href') || '';
    if (!/\.html$/.test(href)) continue;

    const baseName = href.replace(/^\.\//, '').split('/').pop();
    if (/^c_/.test(baseName) || /conventions|postgres-sql/i.test(baseName)) continue;

    let name = anchor.textContent.trim();
    const fnMatch = name.match(/^([A-Za-z0-9_]+)\s+function/i);
    if (fnMatch) name = fnMatch[1];
    name = name.toUpperCase().replace(/\s+FUNCTION$/, '').trim();

    if (!name || name.length > 60 || /\s/.test(name)) continue;
    if (/DOCUMENT|CONVENTION|POSTGRESQL|AMAZON REDSHIFT AND/i.test(name)) continue;

    const docsUrl = href.startsWith('http') ? href : `${REDSHIFT_BASE}${href.replace(/^\.\//, '')}`;
    functions.push({ name, category, docs_url: docsUrl, preview_status: 'GA' });
  }

  return functions;
}

function scrapeDatabricksPage(html) {
  const root = parseHtml(html);
  const functions = [];
  const anchors = root.querySelectorAll('article a[href*="functions/"]');
  for (const anchor of anchors) {
    const href = anchor.getAttribute('href') || '';
    const hrefMatch = href.match(/\/functions\/([a-z0-9_]+)(?:\.html)?$/i);
    const name = hrefMatch
      ? hrefMatch[1].toUpperCase()
      : anchor.textContent.trim().toUpperCase().replace(/\s+FUNCTION$/, '');
    // Only accept valid SQL function identifiers — filters out operators (IS TRUE, +, etc.)
    if (!name || !/^[A-Z][A-Z0-9_]*$/.test(name) || name.length > 60) continue;
    const docsUrl = href.startsWith('http')
      ? href
      : `https://docs.databricks.com${href}`;
    functions.push({ name, category: 'Built-in', docs_url: docsUrl, preview_status: 'GA' });
  }
  return [...new Map(functions.map((f) => [f.name, f])).values()];
}

// ---------------------------------------------------------------------------
// Platform definitions
// ---------------------------------------------------------------------------

const PLATFORMS = [
  {
    id: 'snowflake',
    name: 'Snowflake',
    functionsUrl: SNOWFLAKE_FUNCTIONS_URL,
    parseHtml(html) {
      return scrapeSnowflakeFlatTable(html);
    },
  },
  {
    id: 'databricks',
    name: 'Databricks',
    functionsUrl: 'https://docs.databricks.com/en/sql/language-manual/sql-ref-functions-builtin-alpha.html',
    parseHtml(html) {
      return scrapeDatabricksPage(html);
    },
  },
  {
    id: 'redshift',
    name: 'Amazon Redshift',
    functionsUrl: 'https://docs.aws.amazon.com/redshift/latest/dg/c_SQL_functions.html',
    async fetchFunctions(fetchText) {
      const indexHtml = await fetchText(this.functionsUrl);
      const indexRoot = parseHtml(indexHtml);
      const main = indexRoot.querySelector('#main-content') || indexRoot;

      const skip = /conventions|postgres-sql|leader_node_only/i;
      const categoryHrefs = [
        ...new Set(
          [...main.querySelectorAll('a')]
            .map((a) => a.getAttribute('href'))
            .filter((href) => href && /^\.\//.test(href) && href.endsWith('.html') && !skip.test(href))
        ),
      ];

      const all = [];
      for (const href of categoryHrefs) {
        const url = `${REDSHIFT_BASE}${href.replace(/^\.\//, '')}`;
        const category = href
          .replace(/^\.\//, '')
          .replace(/\.html$/, '')
          .replace(/^c_/, '')
          .replace(/_/g, ' ');
        const html = await fetchText(url);
        all.push(...scrapeRedshiftCategoryPage(html, category));
      }

      return [...new Map(all.map((f) => [f.name, f])).values()];
    },
  },
  {
    id: 'bigquery',
    name: 'BigQuery',
    functionsUrl: 'https://docs.cloud.google.com/bigquery/docs/reference/standard-sql/functions-all',
    parseHtml(html) {
      return scrapeBigQueryFlatTable(html);
    },
  },
  {
    id: 'trino',
    name: 'Trino',
    functionsUrl: 'https://trino.io/docs/current/functions/list.html',
    parseHtml(html) {
      return scrapeTrinoListPage(html);
    },
  },
  {
    id: 'duckdb',
    name: 'DuckDB',
    functionsUrl: 'https://duckdb.org/docs/current/sql/functions/overview',
    async fetchFunctions(fetchText) {
      const overviewHtml = await fetchText(this.functionsUrl);
      const overviewRoot = parseHtml(overviewHtml);
      const article = overviewRoot.querySelector('article') || overviewRoot.querySelector('main');
      if (!article) return [];

      const categoryHrefs = [
        ...new Set(
          [...article.querySelectorAll('a')]
            .map((a) => a.getAttribute('href'))
            .filter((href) => href && /\/sql\/functions\//.test(href) && !/overview/.test(href))
        ),
      ];

      const all = [];
      for (const href of categoryHrefs) {
        const pageUrl = href.startsWith('http') ? href : `${DUCKDB_BASE}${href}`;
        const category = href.split('/').filter(Boolean).pop().replace(/\.html$/, '');
        const html = await fetchText(pageUrl);
        all.push(...scrapeDuckdbCategoryPage(html, pageUrl, category));
      }

      return [...new Map(all.map((f) => [f.name, f])).values()];
    },
  },
];

module.exports = { PLATFORMS };
