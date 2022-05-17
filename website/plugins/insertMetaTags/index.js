// Inject metatags to head
module.exports = function insertMetaTagsPlugin(context, options) {
  return {
    name: 'docusaurus-insert-meta-tags-plugin',
    injectHtmlTags() {
      const { metatags } = options

      if(!metatags || metatags.length <= 0)
        return false

      return {
        headTags: metatags.map(tag => tag)
      }
    }
  }
}
