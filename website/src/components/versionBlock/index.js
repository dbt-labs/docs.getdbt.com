import React, { useState, useEffect, useContext } from 'react'
import VersionContext from '../../stores/VersionContext';
import { availableInCurrentVersion } from '../../utils/available-in-current-version';

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

  const [loading, setLoading] = useState(true);

  // Hide until version is resolved from context (prevents hydration mismatch)
  useEffect(() => {
    version && setLoading(false);
  }, [version]);

  if (version) {
    // Product filter: hide if a specific product is required but doesn't match
    if (product && currentProduct && product !== currentProduct) return null;

    // Version range filter
    if (!availableInCurrentVersion(version, firstVersion, lastVersion)) return null;
  }

  return loading ? null : <>{children}</>;
}
