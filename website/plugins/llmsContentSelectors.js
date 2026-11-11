/**
 * Content selectors for @signalwire/docusaurus-plugin-llms-txt: the element of
 * each built HTML page that gets converted to that page's .md file. The first
 * selector that matches wins.
 *
 * This is the plugin's default list with one addition first: `[data-md-root]`
 * marks the element to convert on pages that have no <main> or <article>
 * wrapper. The homepage (src/pages/index.js) uses it so /index.md -- also
 * served for `Accept: text/markdown` on / by middleware.js -- carries the whole
 * page instead of only the first card.
 *
 * routeRules can't do this: in 2.0.0-alpha.2 per-route contentSelectors are
 * resolved but never passed to the HTML converter.
 */
const llmsContentSelectors = [
  "[data-md-root]",
  // Plugin defaults (DEFAULT_CONTENT_SELECTORS in the plugin's constants.js)
  ".theme-doc-markdown",
  "main .container .col",
  "main .theme-doc-wrapper",
  "article",
  "main .container",
  "main",
];

export default llmsContentSelectors;
