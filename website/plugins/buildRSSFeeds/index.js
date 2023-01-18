const fs = require('fs')
const matter = require('gray-matter')
const Feed = require('feed').Feed
const { getDirectoryFiles } = require('../buildGlobalData/get-directory-files')

// const siteUrl = 'https://docs.getdbt.com'
const siteUrl = 'http://localhost:3000'

module.exports = function buildRSSFeedsPlugin(context, options) {
  return {
    name: 'docusaurus-build-rss-feeds-plugin',
    async loadContent() {
      // Release Notes directory
      const releaseNotesDirectory = 'docs/docs/dbt-versions/release-notes'

      // Get all files and file data within all release notes directories
      const releaseNotesFiles = getDirectoryFiles(releaseNotesDirectory, [], true)
      console.log('releaseNotesFiles', releaseNotesFiles)

      if(!releaseNotesFiles || !releaseNotesFiles.length) 
        return null
      
      // Generate RSS feeds
      const today = new Date()
      const feed = new Feed({
        title: "dbt Cloud Release Notes",
        description: "dbt provides release notes for dbt Cloud so you can see recent and historical changes.",
        id: siteUrl,
        link: siteUrl,
        language: "en",
        image: "https://www.getdbt.com/ui/img/blog/dbt-card.jpg",
        favicon: `${siteUrl}/img/favicon.png`,
        copyright: `Copyright © ${today.getFullYear()} dbt Labs™, Inc. All Rights Reserved.`,
        feedLinks: {
          rss2: `${siteUrl}/rss.xml`,
          atom: `${siteUrl}/atom.xml`,
          json: `${siteUrl}/rss.json`,
        }
      });

      // Prepare data and add all release notes to feeds
      await releaseNotesFiles.map(note => {
        const { data } = note
        // console.log('data', data)

        // TODO: Set date by date in frontmatter tags array
        let feedItemObj = {
          title: data.title,
          date: new Date(),
        }
        if(data?.id) feedItemObj.id = data.id
        if(data?.description) feedItemObj.description = data.description
        
        // Add url field
        feedItemObj.link = getLink(data)

        console.log('feedItemObj', feedItemObj)
        feed.addItem(feedItemObj)
      })

      // Create/update static feed files 
      fs.writeFileSync('./static/feeds/rss.xml', feed.rss2())
      fs.writeFileSync('./static/feeds/atom.xml', feed.atom1())
      fs.writeFileSync('./static/feeds/rss.json', feed.json1())
    },

  };
}

function getLink(data) {
  const { id, file, path } = data

  // Remove extra 'docs/' from path
  let urlPath = path.replace('docs/docs/', 'docs/')

  // Remove leading number/dash, and file name from release notes directory
  // For example, the path: docs/dbt-versions/release-notes/12-January-2022/IDE-autocomplete-more.md
  // is converted to docs/dbt-versions/release-notes/January-2022
  urlPath = urlPath.replace(/release-notes\/(.\d\-)(.*[a-zA-Z]\-)(\d{4})(.*.md)/g, 'release-notes/$2$3')

  // If frontmatter 'id' set, use as page name, otherwise revert to file name
  return id
    ? `${siteUrl}/${urlPath}/${id}`
    : `${siteUrl}/${urlPath}/${file.replace('.md', '')}`
}
