import React, { useState, useEffect, useContext } from 'react'
import VersionContext from '../../stores/VersionContext';
import { availableInCurrentVersion } from '../../utils/available-in-current-version';

export default function VersionBlock({ firstVersion = "0", lastVersion = undefined, children }) {
  const { version } = useContext(VersionContext);

  const [loading, setLoading] = useState(true);

  // Hide versionBlock components until version ready
  useEffect(() => {
    version && setLoading(false);
  }, [version]);

  // Only check version if current version set
  if (version) {
    if (!availableInCurrentVersion(
      version, 
      firstVersion, 
      lastVersion
    )) return null;
  }

  return loading ? null : <>{children}</>;
}
