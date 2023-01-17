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

      // Get all files within all release notes directories
      const releaseNotesFiles = getDirectoryFiles(releaseNotesDirectory)

      // Build release note data for feeds
      const releaseNotesData = releaseNotesFiles.reduce((arr, releaseNote) => {
        const fileData = fs.readFileSync(
          releaseNote.filePath, 
          { encoding: 'utf8' }
        )
        
        if(!fileData)
          return null
        
        // convert frontmatter to json
        const fileJson = matter(fileData)

        if(!fileJson)
          return null

        let noteObj = fileJson.data

        // TODO: Get url for current page
        // and pass to link property
        noteObj.link = releaseNote.filePath

        arr.push(noteObj)

        return arr
      }, [])
      
      if(!releaseNotesData || !releaseNotesData.length) 
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

      // Add all release notes to feeds
      await releaseNotesData.map(note => {
        // TODO: Set date by date in frontmatter tags array
        let feedItemObj = {
          title: note.title,
          date: new Date()
        }
        if(note?.id) feedItemObj.id = note.id
        if(note?.description) feedItemObj.description = note.description
        feed.addItem(feedItemObj)
      })

      // Create/update static feed files 
      fs.writeFileSync('./static/feeds/rss.xml', feed.rss2())
      fs.writeFileSync('./static/feeds/atom.xml', feed.atom1())
      fs.writeFileSync('./static/feeds/rss.json', feed.json1())
    },

  };
}
