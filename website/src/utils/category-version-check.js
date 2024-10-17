import { availableInCurrentVersion } from "./available-in-current-version";

export default function categoryVersionCheck(version, versionedCategories, category) {
    let categoryAvailableObj = {
      categoryAvailable: true
    }
  
    if (!category)
      return categoryAvailableObj
  
    const itemFound = versionedCategories.find(vcategory => vcategory.category === category)

    if (itemFound) {
      const { firstVersion, lastVersion } = itemFound

      categoryAvailableObj.firstAvailableVersion = firstVersion || "0";

      categoryAvailableObj.categoryAvailable = availableInCurrentVersion(
        version,
        firstVersion,
        lastVersion
      );
    }
  
    return categoryAvailableObj
  }
  