import React, { useContext } from 'react'
import VersionContext from '../../stores/VersionContext';
import styles from './styles.module.css';
import { products } from '../../../dbt-versions';
import { availableInCurrentVersion } from '../../utils/available-in-current-version';
import MDXCode from '@theme/MDXComponents/Code';
import MDXA from '@theme/MDXComponents/A';
import MDXImg from '@theme/MDXComponents/Img';
import MDXUl from '@theme/MDXComponents/Ul';
import Admonition from '@theme/Admonition';
import Tabs from '@theme/Tabs';

/**
 * Builds a human-readable version note (such as "Applies to dbt v1.12 and
 * later") from the block's version range and optional product. Returns null
 * when the block has no version constraint, so unversioned blocks stay untagged.
 */
function versionNote(firstVersion, lastVersion, product) {
  const first = firstVersion && firstVersion !== "0" && typeof firstVersion !== "boolean" ? firstVersion : null;
  const last = lastVersion && typeof lastVersion !== "boolean" ? lastVersion : null;

  let range;
  if (first && last) range = `v${first} to v${last}`;
  else if (first) range = `v${first} and later`;
  else if (last) range = `v${last} and earlier`;
  else return null;

  return `(Applies to ${product ? `${product} ` : "dbt "}${range})`;
}

// Highest v1 release listed in the version picker. `lastVersion="1.99"` is a
// "all of v1" sentinel, so display it as this version instead.
const LATEST_V1 = products.find((p) => p.name === "v1")?.subProducts?.[0]?.version;

// Docusaurus swaps some tags for components, so match those by component
// reference. Matching by `type.name` breaks in production builds, where the
// minifier mangles function names.
const INLINE_TAGS = new Set(['a', 'code', 'strong', 'em', 'del', 'span', 'br', 'img', 'sup', 'sub', 'kbd']);
const INLINE_COMPONENTS = new Set([MDXA, MDXCode, MDXImg]);

// A VersionBlock used inline ("models<VersionBlock> and functions</VersionBlock>")
// only contains text, links, code and similar inline elements, and must not be
// wrapped in a box. Anything else (paragraphs, lists, tables, code fences,
// admonitions, imported partials, and so on) is treated as block content.
function hasBlockContent(children) {
  return React.Children.toArray(children).some((c) => {
    if (!React.isValidElement(c)) return false;
    if (typeof c.type === 'string') return !INLINE_TAGS.has(c.type);
    // Our own inline components opt in with `Component.isInline = true`, which
    // (unlike `type.name`) survives minification.
    return !(INLINE_COMPONENTS.has(c.type) || c.type?.isInline);
  });
}

// Children without whitespace-only text between MDX blocks.
function meaningfulChildren(children) {
  return React.Children.toArray(children).filter((c) => !(typeof c === 'string' && !c.trim()));
}

const isListNode = (c) =>
  React.isValidElement(c) && (c.type === MDXUl || ['ul', 'ol'].includes(c.type));

// A block holding only a list continues the surrounding list, so a box would split it.
function isListOnly(nodes) {
  return nodes.length > 0 && nodes.every(isListNode);
}

const isOnly = (nodes, component) =>
  nodes.length === 1 && React.isValidElement(nodes[0]) && nodes[0].type === component;

function legendText(firstVersion, lastVersion, product) {
  const last = lastVersion === "1.99" && LATEST_V1 ? LATEST_V1 : lastVersion;
  const note = versionNote(firstVersion, last, product);
  return note?.replace(/^\(Applies to /, "").replace(/\)$/, "");
}

/**
 * Conditionally renders children based on version range and optional product filter.
 *
 * @param {string} [firstVersion="0"] - Earliest version this content appears in
 * @param {string} [lastVersion] - Latest version this content appears in (omit for all future)
 * @param {"off"|"auto"|"on"} [border="auto"] - Version border. "auto" boxes block content, except when the only content is a callout or list items; "off" never boxes; "on" always boxes (block content only, since a box can't sit inside a paragraph)
 * @param {string} [product] - If set, only renders when the selected product matches (case-sensitive)
 * @example
 * <VersionBlock firstVersion="1.12">Only in 1.12+</VersionBlock>
 * <VersionBlock firstVersion="2.0" product="Fusion">Only in Fusion 2.0+</VersionBlock>
 */
export default function VersionBlock({ firstVersion = "0", lastVersion = undefined, product = undefined, border = "auto", children }) {
  const { version, product: currentProduct } = useContext(VersionContext);

  // `version` falls back to the default version in VersionContext, so these
  // checks resolve during SSR. Rendering the default version's content at build
  // time (rather than null until a client-side effect runs) is what lets the
  // generated per-page `.md` include versioned tables and code blocks. The
  // client still swaps to the selected version after mount, since the first
  // client render uses the same default and matches the server output.
  if (version) {
    // Product filter: hide if a specific product is required but doesn't match
    if (product && currentProduct && product !== currentProduct) return null;

    // Version range filter
    if (!availableInCurrentVersion(version, firstVersion, lastVersion)) return null;
  }

  // A version note tags the block with the dbt version its content applies to.
  // `.version-md-note` visually hides it from sighted readers on the page (the
  // version switcher is their signal), but it stays in the DOM as real content,
  // so it flows into the generated per-page `.md` and tells AI agents which
  // version they're reading. It is deliberately NOT `aria-hidden`: the repo's
  // rehypeCleanMarkdown plugin strips aria-hidden nodes from the markdown, and
  // exposing the note to screen readers gives them the same version cue.
  const note = versionNote(firstVersion, lastVersion, product);

  const nodes = meaningfulChildren(children);
  const onlyCallout = isOnly(nodes, Admonition);
  const listOnly = isListOnly(nodes);

  // Block-level blocks with a version constraint get a hairline outline with the
  // range embedded in its top-left corner. A callout already has its own frame,
  // and a list can't be split by a box, so `auto` leaves those unboxed.
  const boxed = note && border !== "off" &&
    (border === "on" || (hasBlockContent(children) && !onlyCallout && !listOnly));

  if (boxed) {
    const tabsOnly = isOnly(nodes, Tabs);
    return (
      <fieldset className={styles.outline} data-tabs-only={tabsOnly || undefined}>
        <legend className={styles.legend}>{legendText(firstVersion, lastVersion, product)}</legend>
        <span className="version-md-note">{note} </span>
        {children}
      </fieldset>
    );
  }

  return (
    <>
      {note && (
        <span className="version-md-note">{note} </span>
      )}
      {children}
    </>
  );
}
