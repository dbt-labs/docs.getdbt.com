/**
 * Rehype plugin that drops any element marked with a data-md-hide attribute
 * (and its whole subtree) from the HTML before it is converted to markdown.
 *
 * Runs only inside the @signalwire/docusaurus-plugin-llms-txt conversion
 * pipeline (beforeDefaultRehypePlugins), so the rendered site is untouched:
 * the element still appears on the page, it just never reaches the generated
 * per-page .md / llms-full.txt.
 *
 * To keep any component out of the markdown output, add the attribute to its
 * root element:
 *
 *   <div className={styles.feedbackContainer} data-md-hide="true">
 *
 * No selector or class matching -- CSS-module class names are hashed per
 * build, so a stable marker attribute is the reliable contract.
 */
import { visit, SKIP } from "unist-util-visit";

export default function rehypeMdHide() {
  return (tree) => {
    visit(tree, "element", (node, index, parent) => {
      const hide = node.properties?.dataMdHide;
      if (hide === undefined || hide === false || parent === undefined) {
        return;
      }
      parent.children.splice(index, 1);
      // Re-visit the node now occupying this index.
      return [SKIP, index];
    });
  };
}
