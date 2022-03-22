const fs = require('fs')
const matter = require('gray-matter')

module.exports = function buildAuthorPagesPlugin(context, options) {
  return {
    name: 'docusaurus-build-term-pages-plugin',
    async loadContent() {
      // Get all glossary terms
      let termArr = []
      fs.readdir('terms', async (err, files) => {
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

      console.log('content', content)
      
      content.map(async term => {
          const data = fs.readFileSync(`terms/${term}.md`, 'utf8')
          console.log('data', data)
          const frontmatter = matter(data)
          console.log('fm', frontmatter)
          
          // Create json with term data
          const termData = await createData(
            `term-${term}.json`,
            JSON.stringify(frontmatter),
          );

        // Add the term routes, and pass data as props
        addRoute({
          path: `/terms/${term}`,
          component: '@site/src/theme/Term/index.js',
          modules: {
            // propName -> JSON file path
            termData,
          },
          exact: false,
        });
      })
        // authorJson.slug = author

        // // Create json with author data
        // const authorData = await createData(
        //   `author-${author}.json`,
        //   JSON.stringify(authorJson),
        // );
        
        // // Add the author routes, and ensure it receives the author's data as props
        // addRoute({
        //   path: `/author/${authorJson.slug}`,
        //   component: '@site/src/components/author/index.js',
        //   modules: {
        //     // propName -> JSON file path
        //     authorData,
        //   },
        //   exact: false,
        // });

    },
  };
}
