const fs = require('fs')
const matter = require('gray-matter')

module.exports = function buildGlossaryPagePlugin(context, options) {
  return {
    name: 'docusaurus-build-glossary-page-plugin',
    async loadContent() {
      // Get all glossary terms from docs/terms directory
      // This build an array of file names
      let termArr = []
      fs.readdir('docs/terms', async (err, files) => {

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

      // Build array of content and frontmatter from each term file
      let promises = content.map(async term => {
        const data = await fs.readFileSync(`docs/terms/${term}.md`, 'utf8')
        if(data) {
          let frontmatter = matter(data)
          frontmatter.data.id = term
          return {
            data: frontmatter.data,
            content: frontmatter.content
          }
        }
      })

      // Wait for all promises to finish
      const termFrontmatter = await Promise.all(promises)

      if(!termFrontmatter) 
        return null

      // Sort and hide terms which should be excluded from glossary 
      const filteredTerms = termFrontmatter.sort().filter(termFm => !termFm.data.hideInGlossary)

      // Create json with term data
      const termData = await createData(
        `term-data.json`,
        JSON.stringify(filteredTerms),
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
