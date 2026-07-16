const fs = require('fs')
const Feed = require('feed').Feed
const matter = require('gray-matter')

const siteUrl = 'https://docs.getdbt.com'

const MONTH_NAMES = [
  'january', 'february', 'march', 'april', 'may', 'june',
  'july', 'august', 'september', 'october', 'november', 'december'
]

function parseMonthYearHeading(heading) {
  const parts = heading.trim().split(/\s+/)
  if (parts.length !== 2) return null
  const monthIdx = MONTH_NAMES.indexOf(parts[0].toLowerCase())
  const year = parseInt(parts[1], 10)
  if (monthIdx === -1 || isNaN(year)) return null
  return new Date(year, monthIdx, 1)
}

function headingToAnchor(heading) {
  return heading.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-')
}

// Parses content into RSS items — one item per H2 or H3 heading. A reader
// "fires" (surfaces a new item) when it sees a new anchor-based id, so adding
// a heading produces a new feed entry regardless of the heading text.
//
// Dates drive feed ordering: an H2 (month section) takes the date parsed from
// its "Month Year" text, and each H3 inherits the date of the month section it
// sits under. H2s that aren't month headings, and any H3 that appears before
// the first month section, are skipped so the page intro can't leak in.
function parseItems(content, pageUrl) {
  const items = []
  let currentMonthDate = null

  content.split('\n').forEach((line, order) => {
    const h2Match = line.match(/^##\s+(.+)$/)
    const h3Match = line.match(/^###\s+(.+)$/)

    if (h2Match) {
      const heading = h2Match[1].trim()
      const date = parseMonthYearHeading(heading)
      if (!date) return
      currentMonthDate = date
      const link = `${pageUrl}#${headingToAnchor(heading)}`
      items.push({
        title: `dbt platform release notes — ${heading}`,
        id: link,
        link,
        description: `New dbt platform release notes for ${heading}. Visit the page to see what's new, updated, and fixed.`,
        date,
        order,
      })
      return
    }

    if (h3Match) {
      const heading = h3Match[1].trim()
      if (!currentMonthDate) return
      const link = `${pageUrl}#${headingToAnchor(heading)}`
      items.push({
        title: `dbt platform release notes — ${heading}`,
        id: link,
        link,
        description: `New dbt platform release notes: ${heading}. Visit the page to see what's new, updated, and fixed.`,
        date: currentMonthDate,
        order,
      })
    }
  })

  return items
}

function buildFeed({ title, description, pageUrl, feedPathPrefix, items }) {
  const today = new Date()
  const feed = new Feed({
    title,
    description,
    id: siteUrl,
    link: pageUrl,
    language: 'en',
    image: 'https://www.getdbt.com/ui/img/blog/dbt-card.jpg',
    favicon: `${siteUrl}/img/favicon.svg`,
    copyright: `Copyright © ${today.getFullYear()} dbt Labs™, Inc. All Rights Reserved.`,
    updated: items[0].date,
    feedLinks: {
      rss2: `${siteUrl}/feeds/${feedPathPrefix}-rss.xml`,
      atom: `${siteUrl}/feeds/${feedPathPrefix}-atom.xml`,
      json: `${siteUrl}/feeds/${feedPathPrefix}-rss.json`,
    },
  })
  items.forEach(item => feed.addItem(item))
  fs.writeFileSync(`./static/feeds/${feedPathPrefix}-rss.xml`, feed.rss2())
  fs.writeFileSync(`./static/feeds/${feedPathPrefix}-atom.xml`, feed.atom1())
  fs.writeFileSync(`./static/feeds/${feedPathPrefix}-rss.json`, feed.json1())
  console.log(`"${title}" feed created with ${items.length} entries. Latest: ${items[0].title}`)
}

module.exports = function buildRSSFeedsPlugin() {
  return {
    name: 'docusaurus-build-rss-feeds-plugin',
    async loadContent() {
      if (!process.env.VERCEL_ENV) {
        console.log('RSS Feeds are only generated on Vercel. Skipping creation of RSS Feed.')
        return null
      }

      console.log('Generating RSS Feeds for dbt platform release notes')

      try {
        const raw = fs.readFileSync('docs/docs/dbt-versions/release-notes.md', 'utf8')
        const { content } = matter(raw)
        const pageUrl = `${siteUrl}/docs/dbt-versions/dbt-cloud-release-notes`
        const items = parseItems(content, pageUrl)

        if (!items.length) {
          console.warn('No items found in release-notes.md. Skipping feed generation.')
          return null
        }

        items.sort((a, b) =>
          a.date.getTime() !== b.date.getTime()
            ? b.date - a.date
            : a.order - b.order
        )

        buildFeed({
          title: 'dbt platform release notes',
          description: 'dbt provides release notes for the dbt platform so you can see recent and historical changes.',
          pageUrl,
          feedPathPrefix: 'release-notes',
          items,
        })
      } catch (e) {
        console.warn(`Could not generate release notes feed: ${e.message}`)
      }
    },
  }
}
