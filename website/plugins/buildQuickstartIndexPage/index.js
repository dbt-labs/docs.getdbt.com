const fs = require('fs')
const matter = require('gray-matter')

module.exports = function buildQuickstartIndexPage() {
  return {
    name: 'docusaurus-build-quickstart-index-page-plugin',
    async loadContent() {
      // Quickstart files directory
      // TODO: Combine dbt-cloud and dbt-core quickstarts
      const quickstartDirectory = 'docs/quickstarts'

      // Get all Quickstart Spotlight files and content
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

      // Sort quickstarts by date created if available
      const contentSorted = content.sort((a, b) => {
        if(!a?.data?.dateCreated || !b?.data?.dateCreated) return

        return new Date(b.data.dateCreated) - new Date(a.data.dateCreated)
      })

      // Create json with quickstart data
      const quickstartData = await createData(
        `quickstart-page-data.json`,
        JSON.stringify(contentSorted),
      );

      
      // Build the quickstart index page
      addRoute({
        path: `/quickstart/guides`,
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
