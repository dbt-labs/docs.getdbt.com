/**
 * Rehype plugin that removes page chrome from the HTML before it is converted
 * to markdown by @signalwire/docusaurus-plugin-llms-txt. Two rules:
 *
 * 1. Heading anchor links (a.hash-link). Docusaurus appends a "Direct link to"
 *    anchor to every heading; converted to markdown it becomes an empty link
 *    wrapping a zero-width space (U+200B, shown as <ZWSP>) on every heading:
 *
 *      ## Usage[<ZWSP>](#usage "Direct link to Usage")
 *
 * 2. aria-hidden elements. aria-hidden="true" marks an element as purely
 *    presentational (decorative icons, visual duplicates), so it carries no
 *    content worth keeping in markdown -- e.g. the availability pill's tooltip
 *    icon rendered a stray U+24D8 after "Available in v2".
 *
 * 3. HTML comment nodes. React SSR emits `<!-- -->` markers between adjacent
 *    JSX expressions, and they survive into the markdown as literal comments,
 *    e.g. every generated category-index card: `## [<icon><!-- --> <!-- -->Title](...)`.
 *
 * Runs in the conversion pipeline only (beforeDefaultRehypePlugins); the
 * rendered site is unaffected.
 */
import { visit, SKIP } from "unist-util-visit";

export default function rehypeCleanMarkdown() {
  return (tree) => {
    visit(tree, "comment", (node, index, parent) => {
      if (parent === undefined) {
        return;
      }
      parent.children.splice(index, 1);
      return [SKIP, index];
    });

    visit(tree, "element", (node, index, parent) => {
      if (parent === undefined) {
        return;
      }

      const className = node.properties?.className;
      const isHashLink =
        node.tagName === "a" &&
        Array.isArray(className) &&
        className.includes("hash-link");

      const ariaHidden = node.properties?.ariaHidden;
      const isAriaHidden = ariaHidden === true || ariaHidden === "true";

      if (!isHashLink && !isAriaHidden) {
        return;
      }

      parent.children.splice(index, 1);
      // Re-visit the node now occupying this index.
      return [SKIP, index];
    });
  };
}
