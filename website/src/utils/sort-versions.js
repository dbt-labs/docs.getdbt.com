export const sortVersions = (versionsArr) => {
  if (!Array?.isArray(versionsArr) || versionsArr?.length <= 0) return null

  console.log("versionsArr", versionsArr);
  
  const sortedVersions = versionsArr?.sort(function (a, b) {
    console.log('a', a)
    console.log('b', b)
    // Split versions into arrays by decimal
    const aSegments = a?.split('.', 2)
    const bSegments = b?.split('.', 2)
    console.log("aSegments", aSegments)
    console.log("bSegments", bSegments)
    // Sort by major version
    if (aSegments[0] < bSegments[0]) return -1
    if (aSegments[0] > bSegments[0]) return 1
    
    // Sort by minor version
    return aSegments[1] - bSegments[1]
  });

  console.log('sortedVersions', sortedVersions)

  return sortedVersions
}
