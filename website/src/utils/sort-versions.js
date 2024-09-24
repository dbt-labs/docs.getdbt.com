// Sorts versions from earliest to latest and returns array
// For example: 1.7 will sort ahead of 1.8
// 1.9 will sort ahead of 1.9.1 & 1.10

export const sortVersions = (versionsArr) => {
  if (!Array?.isArray(versionsArr) || versionsArr?.length <= 0) return null
  
  const sortedVersions = versionsArr?.sort(function (a, b) {
    // When comparing a - b:
    // A negative value indicates that a should come before b.
    // A positive value indicates that a should come after b.
    // Zero or NaN indicates that a and b are considered equal.

    // Ensure compare items are strings which can be split
    if(!a?.length || !b?.length) return null

    // Split versions into arrays by decimal
    // split into max 3 length array (major, minor, patch versions)
    const aSegments = a?.split(".", 3);
    const bSegments = b?.split(".", 3);

    // Store each version part in variable to help readability below
    const aMajor = aSegments[0] || "0"
    const bMajor = bSegments[0] || "0"
    const aMinor = aSegments[1] || "0"
    const bMinor = bSegments[1] || "0"
    const aPatch = aSegments[2] || "0"
    const bPatch = bSegments[2] || "0"

    // Sort by major version
    if (aMajor - bMajor < 0) { return -1; } 
    if (aMajor - bMajor > 0) { return 1; } 

    // Sort by minor version
    if (aMinor  - bMinor < 0) { return -1; }
    if (aMinor - bMinor > 0) { return 1; } 
   
    // Sort by patch version
    if (aPatch - bPatch < 0) { return -1; }
    if (aPatch - bPatch > 0) { return 1; } 
    
    // If reached, a & b are equal
    return 0
  });

  return sortedVersions
}
