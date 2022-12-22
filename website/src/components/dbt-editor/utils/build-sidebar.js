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
        packageNodes = {
          node,
          name: thisNode.name,
          isNode: true
        }
        packagesResources.nodes.push(packageNodes)
      }
    } else {
      // Add node to directory
      let directoryNode = packagesResources?.directories?.find(dir => {
          if(dir.name === directory) return true
        }
      )
      if(!directoryNode && directory) {
        directoryNode = {
          name: directory,
          nodes: []
        }
        packagesResources.directories.push(directoryNode)
      } else {
        directoryNode.nodes.push({
          node,
          name: thisNode.name,
          isNode: true
        })
      }
    }
  } 

  return projectData
}
