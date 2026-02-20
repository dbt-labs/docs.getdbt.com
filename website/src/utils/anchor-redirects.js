/**
 * Client-side anchor redirects
 * 
 * Vercel redirects don't support anchor/hash links because hash fragments
 * are never sent to the server. This file defines client-side redirects
 * that handle anchor links.
 * 
 * Format:
 * - source: The path + hash to match (e.g., "/docs/page#old-section")
 * - destination: Where to redirect (e.g., "/docs/new-page#new-section")
 * 
 * You can redirect:
 * - From anchor to anchor: "/docs/page#old" -> "/docs/page#new"
 * - From anchor to page: "/docs/page#section" -> "/docs/other-page"
 * - From anchor to anchor on different page: "/docs/page#old" -> "/docs/other#new"
 */

export const anchorRedirects = [
  // Example redirects (uncomment and modify as needed):
  // {
  //   source: "/docs/example-page#old-section",
  //   destination: "/docs/example-page#new-section",
  // },
  // {
  //   source: "/docs/old-page#section",
  //   destination: "/docs/new-page#section",
  // },
];

/**
 * Find a matching redirect for the current URL
 * @param {string} pathname - Current pathname (e.g., "/docs/page")
 * @param {string} hash - Current hash (e.g., "#section")
 * @returns {string|null} - Destination URL or null if no match
 */
export function findAnchorRedirect(pathname, hash) {
  if (!hash) return null;
  
  const currentPath = pathname + hash;
  
  for (const redirect of anchorRedirects) {
    if (redirect.source === currentPath) {
      return redirect.destination;
    }
  }
  
  return null;
}

