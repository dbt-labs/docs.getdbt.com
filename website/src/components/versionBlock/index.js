import React, { useContext } from 'react'
import VersionContext from '../../stores/VersionContext';
import { availableInCurrentVersion } from '../../utils/available-in-current-version';

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

/**
 * Conditionally renders children based on version range and optional product filter.
 *
 * @param {string} [firstVersion="0"] - Earliest version this content appears in
 * @param {string} [lastVersion] - Latest version this content appears in (omit for all future)
 * @param {string} [product] - If set, only renders when the selected product matches (case-sensitive)
 * @example
 * <VersionBlock firstVersion="1.12">Only in 1.12+</VersionBlock>
 * <VersionBlock firstVersion="2.0" product="Fusion">Only in Fusion 2.0+</VersionBlock>
 */
export default function VersionBlock({ firstVersion = "0", lastVersion = undefined, product = undefined, children }) {
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
  // It's hidden from readers on the page (the version switcher is their signal)
  // via `.version-md-note`, but it stays in the DOM, so it flows into the
  // generated per-page `.md` and tells AI agents which version they're reading.
  const note = versionNote(firstVersion, lastVersion, product);

  return (
    <>
      {note && (
        <span className="version-md-note" aria-hidden="true">{note} </span>
      )}
      {children}
    </>
  );
}
