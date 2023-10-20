const fs = require('fs')
const yaml = require('js-yaml')

module.exports = function buildAuthorPagesPlugin() {
  return {
    name: 'docusaurus-build-author-pages-plugin',
    async loadContent() {
      // Get all authors
      const authors = yaml.load(fs.readFileSync(`blog/authors.yml`, { encoding: 'utf8' }))
      return authors
    },
       
    async contentLoaded({content, actions}) {
      const {createData, addRoute} = actions;

      for(let author in content) {
        const authorJson = content[author]
        authorJson.slug = author

        // Create json with author data
        const authorData = await createData(
          `author-${author}.json`,
          JSON.stringify(authorJson),
        );
        
        // Add the author routes, and ensure it receives the author's data as props
        addRoute({
          path: `/author/${authorJson.slug}`,
          component: '@site/src/components/author/index.js',
          modules: {
            // propName -> JSON file path
            authorData,
          },
          exact: false,
        });
      }

    },
  };
}
