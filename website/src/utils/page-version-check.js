import { availableInCurrentVersion } from "./available-in-current-version";

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

    pageAvailableObj.firstAvailableVersion = firstVersion || "0";

    pageAvailableObj.pageAvailable = availableInCurrentVersion(
      version,
      firstVersion,
      lastVersion
    );
  }

  return pageAvailableObj
}
