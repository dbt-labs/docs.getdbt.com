const fs = require('fs')
const yaml = require('js-yaml')

// Pass custom data to blog
module.exports = function buildBlogDataPlugin(context, options) {
  return {
    name: 'docusaurus-build-blog-data-plugin',
    async loadContent() {
      const blogData = yaml.load(fs.readFileSync(`blog/metadata.yml`, { encoding: 'utf8' }))
      return blogData
    },
    async contentLoaded({content, actions}) {
      const { setGlobalData } = actions;
      setGlobalData(content);
    },
  }
}
