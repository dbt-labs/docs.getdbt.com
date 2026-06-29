/**
 * Remark plugin that fixes broken GFM footnote references in blog excerpts.
 *
 * On the blog landing page (/blog), Docusaurus truncates each post at the
 * `<!-- truncate -->` marker *before* MDX compilation. If a footnote reference
 * (e.g. `[^1]`) sits before the marker but its definition sits after, the
 * excerpt is compiled without the definition. GFM only treats `[^x]` as a
 * footnote when a matching definition exists, so the orphaned reference is
 * left as the literal text `[^1]` in the rendered preview.
 *
 * This plugin rewrites those orphaned references into links pointing at the
 * full article (the same destination as the "Read more" button) anchored to
 * `#footnote-label` — the stable id of the article's "Footnotes" heading.
 * (The per-footnote id, e.g. `user-content-fn-1`, gets an arbitrary hash
 * suffix at render time and can't be reconstructed here, so we link to the
 * footnotes section instead.) No extra network requests are involved: the URL
 * is derived entirely from the post's front matter at build time.
 *
 * On full article pages the definitions are present, so `[^1]` becomes a real
 * footnote node and never appears as literal text — meaning this transform is
 * naturally a no-op there.
 */
import { visit } from "unist-util-visit";

// A GFM footnote reference: `[^` then a label with no whitespace or `]`.
const FOOTNOTE_REF = /\[\^([^\]\s]+)\]/g;

export default function remarkBlogFootnoteLinks() {
  return (tree, file) => {
    const slug = file?.data?.frontMatter?.slug;
    // All blog posts set a relative `slug`; the blog lives at /blog, and the
    // site baseUrl is "/", so this matches the post's permalink exactly.
    if (!slug) return;

    const permalink = `/blog/${slug}`;

    visit(tree, "text", (node, index, parent) => {
      if (!parent || index === null || !node.value.includes("[^")) return;

      const value = node.value;
      const newNodes = [];
      let lastIndex = 0;
      let match;

      FOOTNOTE_REF.lastIndex = 0;
      while ((match = FOOTNOTE_REF.exec(value)) !== null) {
        // Leave footnote *definitions* (`[^1]:`) untouched.
        if (value[match.index + match[0].length] === ":") continue;

        if (match.index > lastIndex) {
          newNodes.push({ type: "text", value: value.slice(lastIndex, match.index) });
        }
        newNodes.push({
          type: "link",
          url: `${permalink}#footnote-label`,
          data: { hProperties: { className: ["blog-excerpt-footnote-ref"] } },
          children: [{ type: "text", value: match[1] }],
        });
        lastIndex = match.index + match[0].length;
      }

      if (newNodes.length === 0) return;

      if (lastIndex < value.length) {
        newNodes.push({ type: "text", value: value.slice(lastIndex) });
      }
      parent.children.splice(index, 1, ...newNodes);
      return index + newNodes.length;
    });
  };
}
