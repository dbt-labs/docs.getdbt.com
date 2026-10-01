/**
 * Rehype plugin that restructures Docusaurus tabs for markdown conversion.
 *
 * A `<Tabs>` block renders as:
 *
 *   <div class="tabs-container">
 *     <ul role="tablist"><li role="tab">Models</li><li role="tab">Seeds</li>...</ul>
 *     <div><div role="tabpanel">...</div><div role="tabpanel" hidden>...</div>...</div>
 *   </div>
 *
 * Converted to markdown as-is, the labels become an orphaned bullet list and
 * every panel's content is concatenated with nothing marking where one tab
 * ends and the next begins. Replace the tablist with a heading per panel,
 * carrying that panel's label, so the generated markdown keeps the structure:
 *
 *   ### Models
 *   ...panel content...
 *   ### Seeds
 *   ...
 *
 * Labels map to panels by order, which is how Docusaurus renders them. Panels
 * are un-hidden so downstream processing treats them all alike. Nested tabs
 * inside a panel are handled by the continuing traversal.
 *
 * Runs in the @signalwire/docusaurus-plugin-llms-txt conversion pipeline only
 * (beforeDefaultRehypePlugins); the rendered site is unaffected.
 */
import { visit } from "unist-util-visit";

function isElement(node) {
  return node?.type === "element";
}

function textOf(node) {
  if (node.type === "text") {
    return node.value;
  }
  return (node.children || []).map(textOf).join("");
}

export default function rehypeTabsToHeadings() {
  return (tree) => {
    visit(tree, "element", (node) => {
      const className = node.properties?.className;
      if (!Array.isArray(className) || !className.includes("tabs-container")) {
        return;
      }

      const tablist = node.children?.find(
        (child) => isElement(child) && child.properties?.role === "tablist"
      );
      if (!tablist) {
        return;
      }

      const labels = (tablist.children || [])
        .filter((child) => isElement(child) && child.properties?.role === "tab")
        .map((child) => textOf(child).trim());

      // Panels sit either directly in the container or one wrapper div down.
      const panels = [];
      for (const child of node.children) {
        if (child === tablist || !isElement(child)) {
          continue;
        }
        if (child.properties?.role === "tabpanel") {
          panels.push(child);
          continue;
        }
        for (const grandchild of child.children || []) {
          if (isElement(grandchild) && grandchild.properties?.role === "tabpanel") {
            panels.push(grandchild);
          }
        }
      }
      if (panels.length === 0) {
        return;
      }

      const rebuilt = [];
      panels.forEach((panel, index) => {
        const label = labels[index];
        if (label) {
          rebuilt.push({
            type: "element",
            tagName: "h3",
            properties: {},
            children: [{ type: "text", value: label }],
          });
        }
        if (panel.properties) {
          delete panel.properties.hidden;
        }
        rebuilt.push(panel);
      });
      node.children = rebuilt;
    });
  };
}
