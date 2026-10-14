// Markdown 404 for agents.
//
// vercel.json rewrites requests that send `Accept: text/markdown` here, but
// only when no file matches the path -- Vercel checks the filesystem before
// rewrites, so existing pages (and their .md twins) are never affected.
// Browsers keep getting the HTML 404 page (src/theme/NotFound/Content).

const SITE_URL = 'https://docs.getdbt.com'

// Keep in sync with the recovery links on the HTML 404 page.
const NOT_FOUND_MARKDOWN = `# Page not found (404)

We couldn't find that page on the dbt Developer Hub (${SITE_URL}). It may have moved, been renamed, or never existed.

Here's where to look next:

- [Docs home](${SITE_URL}/docs/introduction.md)
- [Guides](${SITE_URL}/guides)
- [Reference](${SITE_URL}/reference/references-overview.md)
- [Developer blog](${SITE_URL}/blog)
- [Sitemap](${SITE_URL}/sitemap.xml)
- [llms.txt](${SITE_URL}/llms.txt): index of every docs page, with a markdown link for each
- [llms-full.txt](${SITE_URL}/llms-full.txt): every docs page in a single file

Every docs page has a markdown version. Add \`.md\` to the end of a docs URL (for example, ${SITE_URL}/docs/introduction.md) to fetch it.
`

function markdownNotFound(request, response) {
  response.statusCode = 404
  response.setHeader('Content-Type', 'text/markdown; charset=utf-8')
  response.setHeader('Vary', 'Accept')
  // Don't let the CDN cache this under a path that browsers also request.
  // Vercel-CDN-Cache-Control takes precedence over the global Cache-Control
  // rule in vercel.json for Vercel's CDN.
  response.setHeader('Vercel-CDN-Cache-Control', 'no-store')
  response.setHeader('Cache-Control', 'no-store')
  response.end(request.method === 'HEAD' ? undefined : NOT_FOUND_MARKDOWN)
}

module.exports = markdownNotFound
module.exports.NOT_FOUND_MARKDOWN = NOT_FOUND_MARKDOWN
