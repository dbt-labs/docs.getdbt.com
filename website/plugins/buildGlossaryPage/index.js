const fs = require('fs')
const matter = require('gray-matter')

module.exports = function buildGlossaryPagePlugin(context, options) {
  return {
    name: 'docusaurus-build-glossary-page-plugin',
    async loadContent() {
      // Get all glossary terms
      let termArr = []
      fs.readdir('docs/terms', async (err, files) => {
        console.log('files', files)
        if(!files || err)
          return null

        files.map(file => {
          const updatedStr = file.replace('.md', '')
          termArr.push(updatedStr)
        })
      })
      if(termArr)
        return termArr
    },

    async contentLoaded({content, actions}) {
      const {createData, addRoute} = actions;

      if(!content || content.length <= 0) 
        return null

      let promises = content.map(async term => {
        const data = await fs.readFileSync(`docs/terms/${term}.md`, 'utf8')
        if(data) {
          const frontmatter = matter(data)
          return {
            data: frontmatter.data,
            content: frontmatter.content
          }
        }
      })

      const termFrontmatter = await Promise.all(promises)

      if(!termFrontmatter) 
        return null

      // Create json with term data
      const termData = await createData(
        `term-data.json`,
        JSON.stringify(termFrontmatter),
      );

      if(!termData)
        return null

      // Create the glossary route, and pass data as props
      addRoute({
        path: `/glossary`,
        component: '@site/src/theme/Glossary/index.js',
        modules: {
          // propName -> JSON file path
          termData,
        },
        exact: false,
      });
    },
  };
}
