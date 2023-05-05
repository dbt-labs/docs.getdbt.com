export default function createPostPreview(description, charCount) {
  if (description.length <= charCount) { return description } 
  const clippedDesc = description.slice(0, charCount-1);
  // return the version of the description clipped to the last instance of a space
  // this is so there are no cut-off words.
  return clippedDesc.slice(0, clippedDesc.lastIndexOf(" ")) + '...';
}
