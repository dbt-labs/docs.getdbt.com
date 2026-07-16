import { availableInCurrentVersion } from "./available-in-current-version";

export default function categoryVersionCheck(version, versionedCategories, category, product) {
    let categoryAvailableObj = {
      categoryAvailable: true
    }

    if (!category)
      return categoryAvailableObj

    const itemFound = versionedCategories.find(vcategory => vcategory.category === category)

    if (itemFound) {
      const { firstVersion, lastVersion, product: requiredProduct } = itemFound

      // If the category requires a specific product, hide it when a different product is active
      if(requiredProduct) {
        if(!product || product !== requiredProduct) {
          categoryAvailableObj.categoryAvailable = false;
          return categoryAvailableObj;
        }
        // Product matches — if no version constraints, we're done
        if(!firstVersion && !lastVersion)
          return categoryAvailableObj;
      }

      categoryAvailableObj.firstAvailableVersion = firstVersion || "0";

      categoryAvailableObj.categoryAvailable = availableInCurrentVersion(
        version,
        firstVersion,
        lastVersion
      );
    }

    return categoryAvailableObj
  }
  