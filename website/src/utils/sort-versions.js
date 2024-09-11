// Sorts versions from earliest to latest and returns array
// For example: 1.7 will sort ahead of 1.8
// 1.9 will sort ahead of 1.9.1 & 1.10

export const sortVersions = (versionsArr) => {
  if (!Array?.isArray(versionsArr) || versionsArr?.length <= 0) return null

  console.log("versionsArr", versionsArr);
  
  const sortedVersions = versionsArr?.sort(function (a, b) {
    // When comparing a - b:
    // A negative value indicates that a should come before b.
    // A positive value indicates that a should come after b.
    // Zero or NaN indicates that a and b are considered equal.

    console.log('-------------------')
    console.log("a", a);
    console.log("b", b);

    // Split versions into arrays by decimal
    // split into max 3 length array (major, minor, patch versions)
    const aSegments = a?.split(".", 3);
    const bSegments = b?.split(".", 3);

    console.log("aSegments", aSegments);
    console.log("bSegments", bSegments);

    // Store each version part in variable to help readability below
    const aMajor = aSegments[0] || "0"
    const bMajor = bSegments[0] || "0"
    const aMinor = aSegments[1] || "0"
    const bMinor = bSegments[1] || "0"
    const aPatch = aSegments[2] || "0"
    const bPatch = bSegments[2] || "0"

    // Sort by major version
    console.log("Major version", aMajor - bMajor);
    if (aMajor - bMajor < 0) {
      console.log("major version difference, sorting a ahead of b");
      return -1;
    } 
    if (aMajor - bMajor > 0) {
      console.log("major version difference, sorting b ahead of a");
      return 1;
    } 

    // Sort by minor version
    console.log("Minor version", aMinor - bMinor);
    if (aMinor  - bMinor < 0) {
      console.log("minor version difference, sorting a ahead of b");
      return -1;
    }
    if (aMinor - bMinor > 0) {
      console.log("minor version difference, sorting b ahead of a");
      return 1;
    } 
   
    // Sort by patch version
    console.log("Patch version", aPatch - bPatch);
    if (aPatch - bPatch < 0) {
      console.log("patch version difference, sorting a ahead of b");
      return -1;
    }
    if (aPatch - bPatch > 0) {
      console.log("patch version difference, sorting b ahead of a");
      return 1;
    } 
    
    // If reached, a & b are equal
    return 0
  });

  console.log('sortedVersions', sortedVersions)

  return sortedVersions
}
