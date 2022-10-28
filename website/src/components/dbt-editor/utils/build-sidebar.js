// Util: Get packages
export const buildSidebar = (nodes) => {
  const projectData = []
  for(let node in nodes) {
    const thisNode = nodes[node]
    const nodePath = thisNode?.path?.split('/')
    // If path not available in node, skip item in loop
    if(!nodePath) continue
    const filename = nodePath[nodePath.length - 1]

    // Set top-level directories
    let thisPackage = projectData.find(project => project?.project === thisNode.package_name)
    if(!thisPackage) {
      // Create new top-level package if not found
      thisPackage = {
        project: thisNode.package_name,
        resources: [],
      }
      projectData.push(thisPackage)
    }

    // Set resources
    let packagesResources = thisPackage?.resources?.find(resource => resource?.name === thisNode.resource_type)
    if(!packagesResources) {
      packagesResources = {
        name: thisNode.resource_type,
        nodes: [],
      }
      thisPackage.resources.push(packagesResources)
    }

    // Set nodes
    let packageNodes = thisPackage?.resources?.nodes?.find(node => node.name === thisNode.name)
    if(!packageNodes) {
      packageNodes = {
        node,
        name: thisNode.name,
      }
      packagesResources.nodes.push(packageNodes)
    }
  } 

  return projectData
}
