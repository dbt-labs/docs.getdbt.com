import { availableInCurrentVersion } from "./available-in-current-version";

export default function pageVersionCheck(version, versionedPages, path, product) {
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
    const { firstVersion, lastVersion, product: requiredProduct } = itemFound;

    // If the page requires a specific product, hide it when a different product is active
    if(requiredProduct) {
      if(!product || product !== requiredProduct) {
        pageAvailableObj.pageAvailable = false;
        return pageAvailableObj;
      }
      // Product matches — if no version constraints, we're done
      if(!firstVersion && !lastVersion)
        return pageAvailableObj;
    }

    pageAvailableObj.firstAvailableVersion = firstVersion || "0";

    pageAvailableObj.pageAvailable = availableInCurrentVersion(
      version,
      firstVersion,
      lastVersion
    );
  }

  return pageAvailableObj
}
