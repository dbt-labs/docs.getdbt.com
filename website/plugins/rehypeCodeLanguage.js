/**
 * Rehype plugin that copies language-* classes from <pre> to child <code>.
 *
 * Docusaurus renders code blocks as:
 *   <pre class="prism-code language-sql ..."><code class="codeBlockLines_xxx">
 *
 * But hast-util-to-mdast only looks for language-* on <code>, not <pre>.
 * This plugin bridges that gap so the llms-txt plugin preserves
 * code fence language identifiers (e.g. ```sql instead of ```).
 */
import { visit } from "unist-util-visit";

export default function rehypeCodeLanguage() {
  return (tree) => {
    visit(tree, "element", (node) => {
      if (node.tagName !== "pre") return;

      const preClasses = node.properties?.className;
      if (!Array.isArray(preClasses)) return;

      const langClass = preClasses.find(
        (c) => typeof c === "string" && c.startsWith("language-")
      );
      if (!langClass) return;

      const codeChild = node.children?.find(
        (child) => child.type === "element" && child.tagName === "code"
      );
      if (!codeChild) return;

      if (!codeChild.properties) {
        codeChild.properties = {};
      }
      if (!Array.isArray(codeChild.properties.className)) {
        codeChild.properties.className = [];
      }

      const alreadyHasLang = codeChild.properties.className.some(
        (c) => typeof c === "string" && c.startsWith("language-")
      );
      if (!alreadyHasLang) {
        codeChild.properties.className.push(langClass);
      }
    });
  };
}
