const fs = require('fs')
const matter = require('gray-matter')

module.exports = function buildQuickstartIndexPage() {
  return {
    name: 'docusaurus-build-quickstart-index-page-plugin',
    async loadContent() {
      // Quickstart files directory
      const quickstartDirectory = 'docs/quickstarts'

      // Get all Quickstart files and content
      const quickstartFiles = fs.readdirSync(quickstartDirectory)

      const quickstartData = quickstartFiles.reduce((arr, quickstartFile) => {
        const fileData = fs.readFileSync(
          `${quickstartDirectory}/${quickstartFile}`, 
          { encoding: 'utf8' }
        )
        if(!fileData)
          return null
        
        // convert frontmatter to json
        const fileJson = matter(fileData)
        if(!fileJson)
          return null

        arr.push(fileJson)
        return arr
      }, [])
   
      return quickstartData
    },

       
    async contentLoaded({content, actions}) {
      const {createData, addRoute} = actions;

      // Sort quickstarts by platform if available
      const contentSorted = content.sort((a, b) => {
        if(!a?.data?.platform || !b?.data?.platform) return

        // sort by platform
        if(a.data.platform < b.data.platform) return -1
        if(a.data.platform > b.data.platform) return 1
      })

      // Create json with quickstart data
      const quickstartData = await createData(
        `quickstart-page-data.json`,
        JSON.stringify(contentSorted),
      );

      
      // Build the quickstart index page
      addRoute({
        path: `/quickstarts`,
        component: '@site/src/components/quickstartGuideList/index.js',
        modules: {
          // propName -> JSON file path
          quickstartData,
        },
        exact: true,
      });

    },
  };
}
