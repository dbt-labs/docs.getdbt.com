import React, { useState, useEffect, useContext } from 'react'
import VersionContext from '../../stores/VersionContext';
import { availableInCurrentVersion } from '../../utils/available-in-current-version';

export default function VersionBlock({ firstVersion = "0", lastVersion = undefined, children }) {
  const { version } = useContext(VersionContext);

  const [versionReady, setVersionReady] = useState(false);

  // Wait until version is resolved before filtering content
  useEffect(() => {
    if (version) setVersionReady(true);
  }, [version]);

  // Once version is known, apply version filtering normally
  if (versionReady) {
    if (!availableInCurrentVersion(version, firstVersion, lastVersion)) {
      return null;
    }
    return <>{children}</>;
  }

  // SSR and initial client render: keep content in the DOM so that static
  // markdown output (e.g. llms-txt .md files) includes all version block
  // content, but hide it visually so users don't see a flash of wrong content.
  return <div style={{ display: 'none' }}>{children}</div>;
}
