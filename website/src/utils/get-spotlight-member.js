import spotlightData from './../../.docusaurus/docusaurus-build-spotlight-index-page-plugin/default/spotlight-page-data.json'

/*
 * Returns the spotlight member for the
 * 'Community spotlight' section on the homepage.
 * This tries to:
 * 1. Find a spotlight member by the id entered in docusaurus.config.js.
 * 2. If not found, find the latest spotlight member by dateCreated property.
 * 3. Otherwise, this returns null, and the `featuredResource`
 *    will show in this section instead.
*/  
export const getSpotlightMember = (spotlightMember) => {
  if(!spotlightData) return null

  // Get latest spotlight member
  const latestMember = getLatestMember()

  // If spotlightMember not passed in from docusaurus.config.js
  // Try to find latest spotlight member by date
  if(!spotlightMember) {
    return latestMember || null
  } else {
    // If spotlight member data found from ID, return this member 
    // Otherwise, return latestMember if available, or return null
    const memberFound = findMemberById(spotlightMember)
    return memberFound
      ? memberFound
      : latestMember 
        ? latestMember : null
  }
}

/*
 * Gets latest community spotlight member
 * This sorts all members by the `dateCreated` field
*/
function getLatestMember() {
  // Sort members by dateCreated
  let sortedMembers = spotlightData.sort((a, b) => {
    return new Date(b?.data?.dateCreated) - new Date(a?.data?.dateCreated)
  })

  if(!sortedMembers || sortedMembers?.length <= 0) return null

  // Return latest community spotlight member
  const latestMember = sortedMembers[0]?.data
  return setAdditionalProperties(latestMember)
}

/*
 * Checks if member available which matches `communitySpotlightMember` 
 * field within docusaurus.config.js
*/ 
function findMemberById(spotlightMember) {
  // Find member by ID
  const thisMember = spotlightData?.find(member => member?.data?.id === spotlightMember)?.data

  if(!thisMember) return null

  // Return member found by ID
  return setAdditionalProperties(thisMember)
}

/* 
 * Adds sectionTitle & link properties
*/
function setAdditionalProperties(member) {
  if(!member) return null
  const thisMember = member
  thisMember.sectionTitle = 'Community spotlight'
  thisMember.link = `/community/spotlight/${member.id}`
  return thisMember
}
