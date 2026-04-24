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

// Parses a date from a bullet entry starting with mm/dd/yyyy
function parseBulletDate(line) {
  const match = line.match(/^-\s+(\d{2})\/(\d{2})\/(\d{4})/)
  if (!match) return null
  const [, mm, dd, yyyy] = match
  const date = new Date(parseInt(yyyy), parseInt(mm) - 1, parseInt(dd))
  return isNaN(date.getTime()) ? null : date
}

function headingToAnchor(heading) {
  return heading.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-')
}

// Parses content into RSS items. If any bullet entries have mm/dd/yyyy dates,
// returns one item per dated entry (linked to its parent month section).
// Falls back to one item per month section if no dated entries are found.
function parseItems(content, pageUrl) {
  const items = []
  let currentSection = null
  let hasDatedEntries = false

  for (const line of content.split('\n')) {
    const headingMatch = line.match(/^##\s+(.+)$/)
    if (headingMatch) {
      const heading = headingMatch[1].trim()
      const date = parseMonthYearHeading(heading)
      if (date) {
        currentSection = { heading, date, anchor: headingToAnchor(heading) }
      }
      continue
    }

    if (!currentSection) continue

    const bulletDate = parseBulletDate(line)
    if (bulletDate) {
      hasDatedEntries = true
      const sectionLink = `${pageUrl}#${currentSection.anchor}`
      items.push({
        title: `dbt platform release notes — ${currentSection.heading}`,
        id: `${sectionLink}-${bulletDate.toISOString().slice(0, 10)}`,
        link: sectionLink,
        description: `New dbt platform release notes published on ${line.replace(/^-\s+/, '').trim()}. Visit the page to see what's new, updated, and fixed.`,
        date: bulletDate,
      })
    }
  }

  if (hasDatedEntries) return items

  // Fallback: one item per month section
  const sections = []
  for (const line of content.split('\n')) {
    const match = line.match(/^##\s+(.+)$/)
    if (!match) continue
    const heading = match[1].trim()
    const date = parseMonthYearHeading(heading)
    if (date) sections.push({ heading, date, anchor: headingToAnchor(heading) })
  }
  return sections.map(({ heading, date, anchor }) => ({
    title: `dbt platform release notes — ${heading}`,
    id: `${pageUrl}#${anchor}`,
    link: `${pageUrl}#${anchor}`,
    description: `New dbt platform release notes for ${heading}. Visit the page to see what's new, updated, and fixed.`,
    date,
  }))
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

        items.sort((a, b) => (a.date > b.date ? -1 : 1))

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
