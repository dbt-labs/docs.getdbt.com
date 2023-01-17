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
    
    const { firstVersion, lastVersion } = itemFound
    const currentVersionVal = parseFloat(version)
    const firstVersionVal = parseFloat(firstVersion) || 0

    pageAvailableObj.firstAvailableVersion = firstVersion

    // Determine if sidebar item within version range
    if(lastVersion) {
      const lastVersionVal = parseFloat(lastVersion)
      // If lastVersion set for sidebar item, 
      // check if current version is higher than lastVersion
      // or if current version is less than firstVersion
      // If true, remove item in sidebar
      if(currentVersionVal > lastVersionVal || currentVersionVal < firstVersionVal) {
        pageAvailableObj.pageAvailable = false
      }
    } else if(firstVersionVal > currentVersionVal) {
      // If firstVersion is greater than currentVersion
      // remove item from sidebar
      pageAvailableObj.pageAvailable = false
    }
  }

  return pageAvailableObj
}
