export default function categoryVersionCheck(version, versionedCategories, category) {
    let categoryAvailableObj = {
      categoryAvailable: true
    }
  
    if (!category)
      return categoryAvailableObj
  
    const itemFound = versionedCategories.find(vcategory => vcategory.category === category)
  
    if (itemFound) {
  
      const { firstVersion, lastVersion } = itemFound
      const currentVersionVal = parseFloat(version)
      const firstVersionVal = parseFloat(firstVersion) || 0
  
      categoryAvailableObj.firstAvailableVersion = firstVersion
  
      // Determine if category within version range
      if (lastVersion) {
        const lastVersionVal = parseFloat(lastVersion)
        // If lastVersion set for category,
        // check if current version is higher than lastVersion
        // or if current version is less than firstVersion
        // If true, remove category in sidebar
        if (currentVersionVal > lastVersionVal || currentVersionVal < firstVersionVal) {
          categoryAvailableObj.categoryAvailable = false
        }
      } else if (firstVersionVal > currentVersionVal) {
        // If firstVersion is greater than currentVersion
        // remove category from sidebar
        categoryAvailableObj.categoryAvailable = false
      }
    }
  
    return categoryAvailableObj
  }
  