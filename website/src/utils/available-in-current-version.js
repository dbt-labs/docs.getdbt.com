import { sortVersions } from "./sort-versions";

export const availableInCurrentVersion = (
  currentVersion, 
  firstVersion = "0", 
  lastVersion = undefined
) => {
  // Get versions sorted from earliest to latest
  const sortedVersions = sortVersions([
    currentVersion,
    firstVersion,
    ...(lastVersion ? [lastVersion] : []),
  ]);
  // Get index of current version, and first/last version props passed into component
  const currentVersionIndex = sortedVersions?.indexOf(currentVersion);
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
      return false;
  } else {
    if (currentVersionIndex < firstVersionIndex) {
      return false;
    }
  }

  return true
}
