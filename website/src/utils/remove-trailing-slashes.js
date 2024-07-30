// Util function to remove trailing dashes from ID attribute on headers
export default function removeTrailingDashes(header) {
  // Create copy of header element
  const updatedHeader = header;

  // Get id attribute
  const thisId = updatedHeader?.getAttribute("id");

  // If header's id ends with trailing dash, remove dash
  if (thisId?.endsWith("-")) {
    // Remove `-` from end of ID string
    updatedHeader.id = thisId?.substring(0, thisId?.length - 1);

    // Recursively run function to check for another trailing slash
    removeTrailingDashes(updatedHeader);
  }

  return updatedHeader;
}
