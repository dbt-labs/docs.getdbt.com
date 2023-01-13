// Util: Get packages
export const buildSidebar = (nodes, tag) => {
  const projectData = []
  for(let node in nodes) {
    const thisNode = nodes[node]
    
    // If node does not included the current tag, continue to next node
    if(!thisNode?.tags?.includes(tag)) continue

    const nodePath = thisNode?.path?.split('/')
    // If path not available in node, skip item in loop
    if(!nodePath) continue

    // Build node object
    const nodeObject = {
      node,
      name: thisNode.name,
      isNode: true,
      resourceType: thisNode.resource_type
    }

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
        directories: [],
        nodes: []
      }
      thisPackage.resources.push(packagesResources)
    }

    // Set directories
    const directory = thisNode.path.substr(0, thisNode.path.indexOf('/'))
   
    if(!directory) {
      // Add node to top level
      let packageNodes = packagesResources?.nodes?.find(node => node.name === thisNode.name)
      if(!packageNodes) {
        packageNodes = nodeObject
        packagesResources.nodes.push(packageNodes)
      }
    } else {
      // Add node to directory
      let directoryNode = packagesResources?.directories?.find(dir => {
        if(dir.name === directory) return true
      })
      // If this directory does not exist
      // create new directory and add current node
      // Else, add node to existing directory
      if(!directoryNode && directory) {
        directoryNode = {
          name: directory,
          nodes: [nodeObject]
        }
        packagesResources.directories.push(directoryNode)
      } else {
        directoryNode.nodes.push(nodeObject)
      }
    }
  } 

  return projectData
}
