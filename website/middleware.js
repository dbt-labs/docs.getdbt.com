/**
 * Vercel Routing Middleware: Markdown content negotiation for the homepage.
 *
 * Agents that send `Accept: text/markdown` to https://docs.getdbt.com/ get the
 * generated homepage markdown (/index.md) at the same URL, instead of the HTML
 * page. Everyone else (browsers send text/html or wildcards, never
 * text/markdown) falls through untouched to the static index.html.
 *
 * Why middleware and not a vercel.json rewrite: Vercel checks the filesystem
 * before applying `rewrites`, so a rewrite on `/` never fires while
 * index.html exists. Middleware runs before the filesystem and the CDN cache.
 *
 * The matcher keeps this to the homepage only, so no other request invokes it.
 * Every other docs page already has a markdown twin at <path>.md, and missing
 * paths get a markdown 404 through the `has: accept` rewrite in vercel.json.
 *
 * The `Vary: Accept` response header comes from the global rule in vercel.json.
 */

export const config = {
  matcher: '/',
};

const MARKDOWN = 'text/markdown';
const HTML = 'text/html';

/**
 * Parse an Accept header into media ranges, keeping each range's quality
 * (q) and its position for tie-breaking.
 */
export function parseAccept(header) {
  if (!header) return [];
  return header
    .split(',')
    .map((part, index) => {
      const [rawType, ...params] = part.trim().split(';');
      const type = rawType.trim().toLowerCase();
      let q = 1;
      for (const param of params) {
        const [key, value] = param.trim().split('=');
        if (key && key.trim().toLowerCase() === 'q') {
          const parsed = Number.parseFloat(value);
          q = Number.isNaN(parsed) ? 0 : Math.min(Math.max(parsed, 0), 1);
        }
      }
      return {type, q, index};
    })
    .filter((range) => range.type);
}

/**
 * Find the most specific range that matches a media type:
 * exact type, then `type/*`, then `*\/*`.
 */
function matchRange(ranges, mediaType) {
  const [major] = mediaType.split('/');
  return (
    ranges.find((r) => r.type === mediaType) ||
    ranges.find((r) => r.type === `${major}/*`) ||
    ranges.find((r) => r.type === '*/*') ||
    null
  );
}

/**
 * True when the client explicitly asks for text/markdown and ranks it at
 * least as high as text/html. Wildcards alone (`*\/*`, `text/*`) never
 * select markdown, so existing HTML clients keep getting HTML.
 */
export function prefersMarkdown(acceptHeader) {
  const ranges = parseAccept(acceptHeader);
  const markdown = ranges.find((r) => r.type === MARKDOWN);
  if (!markdown || markdown.q === 0) return false;

  const html = matchRange(ranges, HTML);
  if (!html || html.q === 0) return true;
  if (markdown.q !== html.q) return markdown.q > html.q;

  // Equal quality: an explicit text/html listed first wins, otherwise the
  // explicit markdown request beats a wildcard.
  return !(html.type === HTML && html.index < markdown.index);
}

export default function middleware(request) {
  const url = new URL(request.url);
  // Guard on top of the matcher: never touch any path but the homepage.
  if (url.pathname !== '/' || !prefersMarkdown(request.headers.get('accept'))) {
    // Returning nothing continues to the static file as usual.
    return undefined;
  }

  // Same header that `rewrite()` from @vercel/functions sets; written
  // directly to avoid pulling that package's dependency tree into the build.
  return new Response(null, {
    headers: {
      'x-middleware-rewrite': new URL('/index.md', url).toString(),
    },
  });
}
