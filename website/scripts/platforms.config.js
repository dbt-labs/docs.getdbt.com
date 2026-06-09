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

/**
 * Generic scraper for pages that use heading → table layout (Trino, DuckDB, etc).
 * Walks body tracking category headings, then extracts anchors from table rows.
 */
function scrapeHeadingTablePage(html, pageUrl, skipHeadings = /^(see also|related|notes?)/i) {
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
      const docsUrl = resolveDocsUrl(href, pageUrl);

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
    if (cells.length < 3) continue; // skip header and separator rows

    const anchor = cells[0].querySelector('a');
    if (!anchor) continue; // alphabetical separator row — no link

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
      const root = parseHtml(html);
      const functions = [];
      // Databricks anchor text now includes " function" suffix (e.g. "abs function").
      // Extract the name from the href's last path segment instead — it's always just the
      // lowercase function name (e.g. href ends in "/functions/abs").
      const anchors = root.querySelectorAll('article a[href*="functions/"]');
      for (const anchor of anchors) {
        const href = anchor.getAttribute('href') || '';
        const slug = href.split('/').pop().replace(/\.html?$/, '');
        const name = slug.toUpperCase();
        if (!name || name.length > 60) continue;
        const docsUrl = resolveDocsUrl(href, this.functionsUrl);
        functions.push({ name, category: 'Built-in', docs_url: docsUrl, preview_status: 'GA' });
      }
      return [...new Map(functions.map((f) => [f.name, f])).values()];
    },
  },
  {
    id: 'redshift',
    name: 'Amazon Redshift',
    functionsUrl: 'https://docs.aws.amazon.com/redshift/latest/dg/c_SQL_functions.html',
    // Redshift index page links to category pages; each category page lists its functions.
    async scrape(fetchFn) {
      const indexHtml = await fetchFn(this.functionsUrl);
      const indexRoot = parseHtml(indexHtml);
      const content = indexRoot.querySelector('#main-content') || indexRoot;

      // Collect category page URLs from the first UL (uses mixed href patterns)
      const categoryUrls = [];
      for (const ul of content.querySelectorAll('ul')) {
        for (const anchor of ul.querySelectorAll('a')) {
          const href = anchor.getAttribute('href') || '';
          if (href.startsWith('./') && href.endsWith('.html')) {
            const url = resolveDocsUrl(href, this.functionsUrl);
            if (!categoryUrls.includes(url)) categoryUrls.push(url);
          }
        }
        if (categoryUrls.length > 0) break;
      }

      const functions = [];
      for (const catUrl of categoryUrls) {
        try {
          const catHtml = await fetchFn(catUrl);
          const catRoot = parseHtml(catHtml);
          const catContent = catRoot.querySelector('#main-content') || catRoot;
          const category = catRoot.querySelector('h1')?.textContent
            .trim().replace(/\s*functions?$/i, '').trim() || 'Built-in';

          // Function links on category pages use ./r_*.html hrefs
          for (const anchor of catContent.querySelectorAll('a[href]')) {
            const href = anchor.getAttribute('href') || '';
            if (!href.match(/\.\/r_/i)) continue;
            const linkText = anchor.textContent.trim();
            // Clean "AVG function" → "AVG", "STDDEV_SAMP and STDDEV_POP functions" → ["STDDEV_SAMP", "STDDEV_POP"]
            const cleaned = linkText.replace(/\s+functions?$/i, '').trim();
            const parts = cleaned.split(/\s+and\s+/i);
            const docsUrl = resolveDocsUrl(href, catUrl);
            for (const part of parts) {
              const name = part.trim().toUpperCase();
              if (!name || name.length > 80) continue;
              functions.push({ name, category, docs_url: docsUrl, preview_status: 'GA' });
            }
          }
        } catch (err) {
          console.warn(`[redshift] Warning: could not fetch ${catUrl}: ${err.message}`);
        }
      }
      return [...new Map(functions.map((f) => [f.name, f])).values()];
    },
  },
  {
    id: 'bigquery',
    name: 'BigQuery',
    functionsUrl: 'https://cloud.google.com/bigquery/docs/reference/standard-sql/functions-and-operators',
    parseHtml(html) {
      const root = parseHtml(html);
      const functions = [];
      const body = root.querySelector('.body-content') || root.querySelector('main') || root;
      // BigQuery's function table is nested inside divs — querySelectorAll finds it regardless of depth.
      // Each row: cell[0] = <a href="..."><code>FUNC_NAME</code></a>, cell[1] = description
      for (const table of body.querySelectorAll('table')) {
        for (const row of table.querySelectorAll('tbody tr')) {
          const cells = row.querySelectorAll('td');
          if (!cells.length) continue;
          const anchor = cells[0].querySelector('a');
          if (!anchor) continue;
          const name = anchor.textContent.trim().toUpperCase();
          if (!name || name.length > 60) continue;
          const href = anchor.getAttribute('href') || '';
          const docsUrl = resolveDocsUrl(href, this.functionsUrl);
          functions.push({ name, category: 'Built-in', docs_url: docsUrl, preview_status: 'GA' });
        }
      }
      return [...new Map(functions.map((f) => [f.name, f])).values()];
    },
  },
  {
    id: 'trino',
    name: 'Trino',
    // functions.html is now a category index; functions/list.html has the full alphabetical list
    functionsUrl: 'https://trino.io/docs/current/functions/list.html',
    parseHtml(html) {
      const root = parseHtml(html);
      const functions = [];
      const body = root.querySelector('.body-content') || root.querySelector('main') || root;
      // list.html: alphabetical sections (h2 "A", "B", ...) each with <li><a>func()</a></li>
      for (const section of body.querySelectorAll('section')) {
        const heading = section.querySelector('h2,h3,h4');
        const headingText = heading?.textContent.trim().replace(/[#¶]/g, '').trim() || '';
        // Only process single-letter alphabetical sections
        if (!/^[A-Z]$/i.test(headingText)) continue;

        for (const anchor of section.querySelectorAll('li a')) {
          const text = anchor.textContent.trim();
          // Strip argument list: "abs()" → "abs", "add_months(date, n)" → "add_months"
          const name = text.replace(/\s*\(.*$/, '').trim().toUpperCase();
          if (!name || name.length > 60) continue;

          const href = anchor.getAttribute('href') || '';
          // Derive category from href filename: "math.html#abs" → "Math"
          const hrefFile = href.split('#')[0].replace(/\.html?$/, '');
          const category = hrefFile
            ? hrefFile.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
            : 'Uncategorized';

          const docsUrl = resolveDocsUrl(href, this.functionsUrl);
          functions.push({ name, category, docs_url: docsUrl, preview_status: 'GA' });
        }
      }
      return [...new Map(functions.map((f) => [f.name, f])).values()];
    },
  },
  {
    id: 'duckdb',
    name: 'DuckDB',
    functionsUrl: 'https://duckdb.org/docs/current/sql/functions/overview.html',
    // DuckDB overview page links to category pages; each has tables with "Name"/"Function" columns.
    async scrape(fetchFn) {
      const indexHtml = await fetchFn(this.functionsUrl);
      const indexRoot = parseHtml(indexHtml);
      const body = indexRoot.querySelector('.body-content') || indexRoot.querySelector('main') || indexRoot;

      // Collect internal category page URLs (contain /functions/ but not overview, not external, no fragment anchors)
      const categoryUrls = [];
      for (const anchor of body.querySelectorAll('a[href]')) {
        const href = anchor.getAttribute('href') || '';
        if (!href.includes('/functions/') || href.includes('overview') || href.startsWith('http') || href.startsWith('#') || href.includes('#')) continue;
        const url = resolveDocsUrl(href, this.functionsUrl);
        if (url.includes('duckdb.org') && !categoryUrls.includes(url)) categoryUrls.push(url);
      }

      const functions = [];
      for (const catUrl of categoryUrls) {
        try {
          const catHtml = await fetchFn(catUrl);
          const catRoot = parseHtml(catHtml);
          const catBody = catRoot.querySelector('.body-content') || catRoot.querySelector('main') || catRoot;

          const catSlug = catUrl.split('/').pop().replace(/\.html?$/, '');
          const category = catSlug.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

          // Find tables whose first column header is "Name" or "Function"
          for (const table of catBody.querySelectorAll('table')) {
            const headerRow = table.querySelector('thead tr') || table.querySelector('tr');
            if (!headerRow) continue;
            const firstHeader = headerRow.querySelectorAll('th,td')[0]?.textContent.trim().toLowerCase();
            if (firstHeader !== 'name' && firstHeader !== 'function') continue;

            for (const row of table.querySelectorAll('tbody tr')) {
              const cells = row.querySelectorAll('td');
              if (!cells.length) continue;
              // Strip argument list: "abs(x)" → "abs", "any_value(arg)" → "any_value"
              const name = cells[0].textContent.trim().replace(/\s*\(.*$/, '').trim().toUpperCase();
              // Only accept identifier-like names (no operators like +, -, etc.)
              if (!name || !/^[A-Z][A-Z0-9_]*$/.test(name)) continue;
              functions.push({ name, category, docs_url: catUrl, preview_status: 'GA' });
            }
          }
        } catch (err) {
          console.warn(`[duckdb] Warning: could not fetch ${catUrl}: ${err.message}`);
        }
      }
      return [...new Map(functions.map((f) => [f.name, f])).values()];
    },
  },
];

module.exports = { PLATFORMS };
