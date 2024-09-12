import React, { useState, useEffect, useContext } from 'react'
import VersionContext from '../../stores/VersionContext';
import { sortVersions } from '../../utils/sort-versions';

export default function VersionBlock({ firstVersion = "0", lastVersion = undefined, children }) {
  const { version } = useContext(VersionContext);

  const [loading, setLoading] = useState(true);

  // Hide versionBlock components until version ready
  useEffect(() => {
    version && setLoading(false);
  }, [version]);

  // Uncomment this to set the sortVersions util function
  // sortVersions([
  //   "1.11",
  //   "1.7",
  //   "2.1",
  //   "1.8",
  //   "1.6",
  //   "2.2.1",
  //   "1.10",
  //   "2.0.1",
  //   "1.9",
  //   "1.9.1",
  //   "1.10.1",
  //   "2.0",
  // ]);

  // Only check version if current version set
  if (version) {
    // Get versions sorted from earliest to latest
    const sortedVersions = sortVersions([
      version,
      firstVersion,
      ...(lastVersion ? [lastVersion] : []),
    ]);
    // Get index of current version, and first/last version props passed into component
    const currentVersionIndex = sortedVersions?.indexOf(version);
    const firstVersionIndex = sortedVersions?.indexOf(firstVersion);
    const lastVersionIndex = sortedVersions?.indexOf(lastVersion);
    {
      /*
       * If last version set, check if current version greater than last version
       * Or if current version less than first version
       * If either is true, hide block
       * Else, if current version less than first version, hide block
       */
    }
    if (lastVersionIndex >= 0) {
      if (
        currentVersionIndex > lastVersionIndex ||
        currentVersionIndex < firstVersionIndex
      )
        return null;
    } else {
      if (currentVersionIndex < firstVersionIndex) {
        return null;
      }
    }
  }

  return loading ? null : <>{children}</>;
}
