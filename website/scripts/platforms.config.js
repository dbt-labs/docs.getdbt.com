/**
 * Per-platform configuration for function support data collection.
 *
 * Each entry describes:
 *  - id:           Machine identifier used as the platform key and directory name
 *  - name:         Display name used in docs and logs
 *  - functionsUrl: URL of the platform's "all functions" reference page to scrape
 *  - parseHtml:    Function that receives the HTML string and returns
 *                  [{name, category, docs_url, preview_status}]
 *
 * To add a new platform: add one entry here and implement a parseHtml function.
 * The fetch and snippet-generation scripts are fully generic — no other files change.
 * The Fusion typechecking source is configured via environment variables in the
 * GitHub Action (FUSION_REPO and FUSION_BASE_PATH) and is not stored here.
 */

const { parse: parseHtml } = require('node-html-parser');

// ---------------------------------------------------------------------------
// Shared HTML parsing helpers
// ---------------------------------------------------------------------------

/**
 * Generic scraper for pages that use heading → table layout (Trino, DuckDB, etc).
 * Walks body tracking category headings, then extracts anchors from table rows.
 */
function scrapeHeadingTablePage(html, baseUrl, skipHeadings = /^(see also|related|notes?)/i) {
  const root = parseHtml(html);
  const functions = [];
  const body = root.querySelector('.body-content') || root.querySelector('main') || root;
  let currentCategory = 'Uncategorized';

  for (const node of body.childNodes) {
    const tag = node.tagName?.toLowerCase();
    if (tag === 'h2' || tag === 'h3') {
      const text = node.textContent.trim().replace(/\s*[¶#]$/, '');
      if (!skipHeadings.test(text)) currentCategory = text;
      continue;
    }
    if (tag !== 'table') continue;

    for (const row of node.querySelectorAll('tbody tr')) {
      const cells = row.querySelectorAll('td');
      if (!cells.length) continue;
      const anchor = cells[0].querySelector('a');
      if (!anchor) continue;

      const name = anchor.textContent.trim().toUpperCase();
      const href = anchor.getAttribute('href') || '';
      const docsUrl = href.startsWith('http') ? href : `${baseUrl}${href}`;

      const rowText = row.textContent;
      let previewStatus = 'GA';
      if (/private preview/i.test(rowText)) previewStatus = 'Private Preview';
      else if (/public preview/i.test(rowText)) previewStatus = 'Public Preview';
      else if (/preview/i.test(rowText)) previewStatus = 'Preview';

      functions.push({ name, category: currentCategory, docs_url: docsUrl, preview_status: previewStatus });
    }
  }
  return functions;
}

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
    if (cells.length < 3) continue; // skip header and separator rows

    const anchor = cells[0].querySelector('a');
    if (!anchor) continue; // alphabetical separator row — no link

    const name = anchor.textContent.trim().toUpperCase();
    const href = anchor.getAttribute('href') || '';
    // hrefs are relative like "functions/abs" — resolve against base
    const docsUrl = href.startsWith('http')
      ? href
      : `https://docs.snowflake.com/en/sql-reference/${href}`;

    // Category is in column 2 as a link to the category page
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

// ---------------------------------------------------------------------------
// Platform definitions
// ---------------------------------------------------------------------------

const PLATFORMS = [
  {
    id: 'snowflake',
    name: 'Snowflake',
    functionsUrl: 'https://docs.snowflake.com/en/sql-reference/functions-all',
    parseHtml(html) {
      return scrapeSnowflakeFlatTable(html);
    },
  },
  {
    id: 'databricks',
    name: 'Databricks',
    functionsUrl: 'https://docs.databricks.com/en/sql/language-manual/sql-ref-functions-builtin-alpha.html',
    parseHtml(html) {
      const root = parseHtml(html);
      const functions = [];
      // Databricks uses a flat <ul> or <table> listing — try both
      const anchors = root.querySelectorAll('article a[href*="functions/"]');
      for (const anchor of anchors) {
        const name = anchor.textContent.trim().toUpperCase();
        if (!name || name.length > 60) continue;
        const href = anchor.getAttribute('href') || '';
        const docsUrl = href.startsWith('http')
          ? href
          : `https://docs.databricks.com${href}`;
        functions.push({ name, category: 'Built-in', docs_url: docsUrl, preview_status: 'GA' });
      }
      // Deduplicate by name
      return [...new Map(functions.map((f) => [f.name, f])).values()];
    },
  },
  {
    id: 'redshift',
    name: 'Amazon Redshift',
    functionsUrl: 'https://docs.aws.amazon.com/redshift/latest/dg/c_SQL_functions.html',
    parseHtml(html) {
      // Redshift docs use a <div class="highlights"> with links grouped by category
      const root = parseHtml(html);
      const functions = [];
      let currentCategory = 'Uncategorized';

      const content = root.querySelector('#main-content') || root;
      for (const node of content.childNodes) {
        const tag = node.tagName?.toLowerCase();
        if (tag === 'h2' || tag === 'h3') {
          currentCategory = node.textContent.trim().replace(/\s*[¶#]$/, '');
          continue;
        }
        if (tag !== 'ul' && tag !== 'table') continue;

        for (const anchor of node.querySelectorAll('a')) {
          const href = anchor.getAttribute('href') || '';
          if (!href.includes('.html')) continue;
          const name = anchor.textContent.trim().toUpperCase();
          if (!name || name.length > 60) continue;
          const docsUrl = href.startsWith('http')
            ? href
            : `https://docs.aws.amazon.com/redshift/latest/dg/${href}`;
          functions.push({ name, category: currentCategory, docs_url: docsUrl, preview_status: 'GA' });
        }
      }
      return [...new Map(functions.map((f) => [f.name, f])).values()];
    },
  },
  {
    id: 'bigquery',
    name: 'BigQuery',
    functionsUrl: 'https://docs.cloud.google.com/bigquery/docs/reference/standard-sql/functions-all',
    parseHtml(html) {
      const root = parseHtml(html);
      const functions = [];
      const table = root.querySelector('main table') || root.querySelector('table');
      if (!table) return functions;

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

        functions.push({ name, category: 'Built-in', docs_url: docsUrl, preview_status: 'GA' });
      }
      return functions;
    },
  },
  {
    id: 'trino',
    name: 'Trino',
    functionsUrl: 'https://trino.io/docs/current/functions.html',
    parseHtml(html) {
      return scrapeHeadingTablePage(html, 'https://trino.io', /^(see also|related)/i);
    },
  },
  {
    id: 'duckdb',
    name: 'DuckDB',
    functionsUrl: 'https://duckdb.org/docs/sql/functions/overview',
    parseHtml(html) {
      return scrapeHeadingTablePage(html, 'https://duckdb.org', /^(see also|related)/i);
    },
  },
];

module.exports = { PLATFORMS };
