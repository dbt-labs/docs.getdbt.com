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

// Parses a "Month Day, Year" heading (for example, "July 13, 2026") into a
// Date. Returns null for anything that isn't a full date heading, so category
// headings such as "Enhancements" or "Fixes" are skipped.
function parseFullDateHeading(heading) {
  const match = heading.trim().match(/^([a-z]+)\s+(\d{1,2}),\s*(\d{4})$/i)
  if (!match) return null
  const monthIdx = MONTH_NAMES.indexOf(match[1].toLowerCase())
  const day = parseInt(match[2], 10)
  const year = parseInt(match[3], 10)
  if (monthIdx === -1 || isNaN(day) || isNaN(year)) return null
  return new Date(year, monthIdx, day)
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

// Parses the single-tenant release notes into RSS items — one item per weekly
// release date. Dates are H2 headings in "Month Day, Year" form; the category
// headings nested under each date ("New", "Enhancements", "Fixes", and so on)
// are skipped so each weekly release surfaces as a single feed entry.
function parseDatedItems(content, pageUrl) {
  const items = []

  content.split('\n').forEach((line, order) => {
    const h2Match = line.match(/^##\s+(.+)$/)
    if (!h2Match) return

    const heading = h2Match[1].trim()
    const date = parseFullDateHeading(heading)
    if (!date) return

    const link = `${pageUrl}#${headingToAnchor(heading)}`
    items.push({
      title: `dbt single-tenant release notes — ${heading}`,
      id: link,
      link,
      description: `New dbt single-tenant release notes for ${heading}. Visit the page to see what's new, updated, and fixed.`,
      date,
      order,
    })
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

// Each entry describes one feed: the source page to read, the parser to run
// over it, the public page URL its items link to, and the feed metadata.
const FEEDS = [
  {
    sourcePath: 'docs/docs/dbt-versions/release-notes.md',
    parse: parseItems,
    pageUrl: `${siteUrl}/docs/dbt-versions/dbt-cloud-release-notes`,
    feedPathPrefix: 'release-notes',
    title: 'dbt platform release notes',
    description: 'dbt provides release notes for the dbt platform so you can see recent and historical changes.',
  },
  {
    sourcePath: 'docs/docs/dbt-versions/dbt-platform-release-notes-gen.md',
    parse: parseDatedItems,
    pageUrl: `${siteUrl}/docs/dbt-versions/dbt-platform-release-notes-gen`,
    feedPathPrefix: 'release-notes-st',
    title: 'dbt single-tenant release notes',
    description: 'dbt provides release notes for single-tenant so you can see recent and historical changes.',
  },
]

module.exports = function buildRSSFeedsPlugin() {
  return {
    name: 'docusaurus-build-rss-feeds-plugin',
    async loadContent() {
      if (!process.env.VERCEL_ENV) {
        console.log('RSS Feeds are only generated on Vercel. Skipping creation of RSS Feed.')
        return null
      }

      console.log('Generating RSS Feeds for dbt release notes')

      FEEDS.forEach(({ sourcePath, parse, pageUrl, feedPathPrefix, title, description }) => {
        try {
          const raw = fs.readFileSync(sourcePath, 'utf8')
          const { content } = matter(raw)
          const items = parse(content, pageUrl)

          if (!items.length) {
            console.warn(`No items found in ${sourcePath}. Skipping feed generation.`)
            return
          }

          items.sort((a, b) =>
            a.date.getTime() !== b.date.getTime()
              ? b.date - a.date
              : a.order - b.order
          )

          buildFeed({ title, description, pageUrl, feedPathPrefix, items })
        } catch (e) {
          console.warn(`Could not generate ${title} feed: ${e.message}`)
        }
      })
    },
  }
}
