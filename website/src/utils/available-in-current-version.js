import { sortVersions } from "./sort-versions";

export const availableInCurrentVersion = (
  currentVersion, 
  firstVersion = "0", 
  lastVersion = undefined
) => {
  // If `firstVersion` prop set on VersionBlock component without a value,
  // it defaults to boolean `true`. This overrides to ensure `firstVersion` is string.
  if(typeof firstVersion === "boolean") {
    firstVersion = "0"
  }
  // Do the same to ensure `lastVersion` cannot be a boolean
  if (typeof lastVersion === "boolean") {
    lastVersion = undefined;
  }

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
