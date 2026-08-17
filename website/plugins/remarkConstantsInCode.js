/**
 * Remark plugin that resolves `<Constant name="..." />` inside code.
 *
 * `<Constant>` is a render-time React component wired through the MDX theme
 * override, so MDX only turns it into the component in JSX positions. Inside
 * inline code (single backticks) and fenced code blocks the tag is literal
 * text, so the reader sees the raw `<Constant name="core" />` string instead of
 * the product name.
 *
 * This runs on the mdast before compilation and substitutes the tag with its
 * value from `constants.js` (the single source of truth) directly in the code
 * node's text. It works for both inline (`inlineCode`) and fenced (`code`)
 * nodes, and happens before rehype/Prism highlighting so fenced blocks are
 * highlighted with the substituted text already in place.
 *
 * Unknown names are left untouched (visible literal) rather than blanked, so a
 * typo is noticeable rather than silently dropped.
 */
import { visit } from "unist-util-visit";
import { CONSTANTS } from "../constants.js";

// Matches <Constant name="x" /> or <Constant name='x'>, self-closing or not.
const CONSTANT_IN_CODE_RE = /<Constant\s+name\s*=\s*["']([^"']+)["']\s*\/?>/g;

export default function remarkConstantsInCode() {
  return (tree) => {
    visit(tree, ["inlineCode", "code"], (node) => {
      if (!node.value || !node.value.includes("<Constant")) return;

      node.value = node.value.replace(CONSTANT_IN_CODE_RE, (match, name) =>
        Object.prototype.hasOwnProperty.call(CONSTANTS, name) ? CONSTANTS[name] : match
      );
    });
  };
}
