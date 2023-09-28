const fs = require('fs')
const Feed = require('feed').Feed
const { getDirectoryFiles } = require('../buildGlobalData/get-directory-files')

const siteUrl = 'https://docs.getdbt.com'

module.exports = function buildRSSFeedsPlugin() {
  return {
    name: 'docusaurus-build-rss-feeds-plugin',
    async loadContent() {
      // Release Notes directory
      const releaseNotesDirectory = 'docs/docs/dbt-versions/release-notes'

      // Get all files and file data within all release notes directories
      const releaseNotesFiles = getDirectoryFiles(releaseNotesDirectory, [], true)

      if(!releaseNotesFiles || !releaseNotesFiles.length) 
        return null
      
      // Generate RSS feeds
      console.log('Generating RSS Feeds for dbt Cloud Release Notes')

      // Prepare data and sort by update date
      const releaseNotesData = releaseNotesFiles.map(note => {
        const { data } = note

        // Set properties for feed
        let feedItemObj = { title: data.title }
        if(data?.id) feedItemObj.id = data.id
        if(data?.description) feedItemObj.description = data.description

        // Set link property
        feedItemObj.link = getLink(data)

        // Set post date
        feedItemObj.date = data?.date || data?.tags 
          && getDate(data?.date ? data.date : data.tags) 

        return feedItemObj
      }).sort((a, b) => (a.date > b.date) ? -1 : 1)
      
      const today = new Date()
      const feedObj = {
        title: "dbt Cloud Release Notes",
        description: "dbt provides release notes for dbt Cloud so you can see recent and historical changes.",
        id: siteUrl,
        link: siteUrl,
        language: "en",
        image: "https://www.getdbt.com/ui/img/blog/dbt-card.jpg",
        favicon: `${siteUrl}/img/favicon.svg`,
        copyright: `Copyright © ${today.getFullYear()} dbt Labs™, Inc. All Rights Reserved.`,
        feedLinks: {
          rss2: `${siteUrl}/rss.xml`,
          atom: `${siteUrl}/atom.xml`,
          json: `${siteUrl}/rss.json`,
        }
      }

      // Set feed date to latest date 
      const latestUpdate = releaseNotesData[0]
      console.log(`Latest release note: ${latestUpdate.title}`)
      
      feedObj.updated = latestUpdate?.date
        ? latestUpdate.date
        : new Date()

      // Initialize feed
      const feed = new Feed(feedObj);

      // Add all release notes to feeds
      releaseNotesData.map(item => feed.addItem(item))

      // Create/update static feed files 
      fs.writeFileSync('./static/feeds/rss.xml', feed.rss2())
      fs.writeFileSync('./static/feeds/atom.xml', feed.atom1())
      fs.writeFileSync('./static/feeds/rss.json', feed.json1())

      console.log('RSS Feeds for dbt Cloud Release Notes created successfully.')
    },

  };
}

function getLink(data) {
  const { id, file, path } = data

  // Remove extra 'docs/' from path
  let urlPath = path.replace('docs/docs/', 'docs/')

  // Remove leading number/dash from path
  // For example, the path: docs/dbt-versions/release-notes/12-January-2022
  // is converted to docs/dbt-versions/release-notes/January-2022
  urlPath = urlPath.replace(/release-notes\/(\d{2}-)/g, 'release-notes/')

  // Remove file name from path
  urlPath = urlPath.replace(/\/[^/]+$/g, '')

  // If frontmatter 'id' set, use as page name, otherwise revert to file name
  return id
    ? `${siteUrl}/${urlPath}/${id}`
    : `${siteUrl}/${urlPath}/${file.replace('.md', '')}`
}

function getDate(tags) {
  if(!tags) return new Date('2020-01-01')

  // Find tag with the format 'day-year'
  const expr = /(-\d{4})/g
  const dateTag = tags.find(str => expr.test(str))

  // If date not found, default to oldest release note date.
  // This prevents the RSS feed from showing older release notes
  // as recently published.
  return dateTag
    ? new Date(dateTag)
    : new Date('2020-01-01')
}
