/**
 * Rehype plugin that un-hides any element marked with a data-md-only attribute,
 * so content kept off the rendered page still reaches the generated markdown.
 * The inverse of rehypeMdHide.
 *
 * Runs only inside the @signalwire/docusaurus-plugin-llms-txt conversion
 * pipeline (beforeDefaultRehypePlugins). On the rendered site the element
 * keeps its `hidden` attribute, so readers never see it; in the per-page .md /
 * llms-full.txt it renders like any other content.
 *
 * Used by src/components/agentGuidance for the `agent_guidance` frontmatter.
 * The llms-txt plugin passes only the page's content element (not <head>) to
 * rehype plugins, so a meta tag can't carry this -- the element has to live in
 * the body:
 *
 *   <div hidden data-md-only="true">...</div>
 */
import { visit } from "unist-util-visit";

export default function rehypeMdOnly() {
  return (tree) => {
    visit(tree, "element", (node) => {
      const mdOnly = node.properties?.dataMdOnly;
      if (mdOnly === undefined || mdOnly === false) {
        return;
      }
      delete node.properties.hidden;
      delete node.properties.dataMdOnly;
    });
  };
}
