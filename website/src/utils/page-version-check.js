import { sortVersions } from "./sort-versions";

export default function pageVersionCheck(version, versionedPages, path) {
  let pageAvailableObj = {
    pageAvailable: true
  }
  
  if(!path)
    return pageAvailableObj

  let updatedPath = path.charAt(0) === '/'
    ? path.substr(1)
    : path
  
  const itemFound = versionedPages.find(vpage => vpage.page === updatedPath) 
  
  if(itemFound) {
    const { firstVersion, lastVersion } = itemFound;

    // Get versions sorted from earliest to latest
    const sortedVersions = sortVersions([
      version,
      ...(firstVersion ? [firstVersion] : []),
      ...(lastVersion ? [lastVersion] : []),
    ]);

    // Get index of current version, and first/last version props passed into component
    const currentVersionIndex = sortedVersions?.indexOf(version);
    const firstVersionIndex = sortedVersions?.indexOf(firstVersion);
    const lastVersionIndex = sortedVersions?.indexOf(lastVersion);

    // const currentVersionVal = parseFloat(version);
    // const firstVersionVal = parseFloat(firstVersion) || 0;

    pageAvailableObj.firstAvailableVersion = firstVersion;

    // Determine if sidebar item within version range
    if (lastVersionIndex >= 0) {
      // If lastVersion set for sidebar item,
      // check if current version is higher than lastVersion
      // or if current version is less than firstVersion
      // If true, remove item in sidebar
      if (
        currentVersionIndex > lastVersionIndex ||
        currentVersionIndex < firstVersionIndex
      ) {
        pageAvailableObj.pageAvailable = false;
      }
    } else if (currentVersionIndex < firstVersionIndex) {
      // If firstVersion is greater than currentVersion
      // remove item from sidebar
      pageAvailableObj.pageAvailable = false;
    }
  }

  return pageAvailableObj
}
