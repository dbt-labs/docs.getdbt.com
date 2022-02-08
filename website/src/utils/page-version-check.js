export default function pageVersionCheck(version, versionedPages, path) {
  let pageAvailable = true
  
  if(!path)
    return pageAvailable

  let updatedPath = path.charAt(0) === '/'
    ? path.substr(1)
    : path
  
  const itemFound = versionedPages.find(vpage => vpage.page === updatedPath) 
  
  if(itemFound) {
    
    const { firstVersion, lastVersion } = itemFound

    // Determine if sidebar item within version range
    if(lastVersion) {
      // If lastVersion set for sidebar item, 
      // check if current version is higher than lastVersion
      // or if current version is less than firstVersion
      // If true, remove item in sidebar
      if(version > lastVersion || version < firstVersion) {
        pageAvailable = false
      }
    } else if(firstVersion > version) {
      // If firstVersion is greater than currentVersion
      // remove item from sidebar
      pageAvailable = false
    }
  }
  return pageAvailable
}
