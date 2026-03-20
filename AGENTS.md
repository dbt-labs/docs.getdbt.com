# AGENTS.md — docs.getdbt.com

Agent-facing guide for working in the dbt documentation repository.

## Project overview

- **Framework**: Docusaurus 3.7.0, deployed on Vercel
- **PR base branch**: `current`
- **Content format**: Markdown (`.md`) and MDX (`.mdx`)

### Key directories

```
website/
  docs/           # Product documentation
  blog/           # Developer blog posts
  snippets/       # Reusable partials and snippets
  src/components/ # React components available in MDX
  src/theme/      # Docusaurus theme overrides
  static/img/     # Images and icons
  plugins/        # Custom Docusaurus plugins
```

### Key config files

| File | Purpose |
|------|---------|
| `website/docusaurus.config.js` | Site config, navbar, footer, plugins |
| `website/sidebars.js` | Left sidebar navigation structure |
| `website/dbt-versions.js` | Version definitions, versioned pages/categories |
| `website/constants.js` | Global terminology constants |
| `website/blog/authors.yml` | Blog post author profiles |
| `website/blog/categories.yml` | Blog tag/category definitions |
| `website/vercel.json` | Contains page redirects |
## Dev commands

```bash
cd website
npm start          # Local dev server (port 3000)
npm i              #  Install dependencies
npm run build      # Production build
npm test           # Jest tests (watch mode)
npm run lint       # ESLint with cache
npm run lintAll    # ESLint auto-fix
```

## Branding & terminology

These rules are **mandatory** — incorrect branding is the most common docs error.

### Product names (all case-sensitive)

| Name | Usage | Notes |
|------|-------|-------|
| **dbt** | Always lowercase | Generic references across all products |
| **dbt Core** | Lowercase `dbt`, capital `C` | dbt versions ≤ 1.x |
| **dbt Fusion engine** | Or just "Fusion" in docs | dbt versions ≥ 2.x |
| **dbt platform** | Not "dbt Cloud" | The cloud-based platform (formerly dbt Cloud) |
| **dbt Labs** | The company | When docs say "we," this is who "we" is |

### Feature proper nouns (capitalize these)

Studio IDE, Canvas, Insights, Catalog, Mesh, Orchestrator, Semantic Layer, Copilot

All other features (models, environments, configs, settings) are common nouns.

### Use `<Constant>` for product names when available

```jsx
<Constant name="dbt_platform" />   // → "dbt platform"
<Constant name="fusion_engine" />  // → "dbt Fusion engine"
<Constant name="studio_ide" />      // → "Studio IDE"
```

Refer to `website/constants.js` for constant names

### Third-party brands

Respect their branding. Use official names (VS Code, not VScode; Microsoft Entra ID, not Azure AD).

### Acronyms

All caps except `dbt`: YAML, SQL, JSON, IDE. Spell out on first use.

## Writing style

- **Voice**: Active, second person ("you"), conversational
- **Commas**: Oxford comma required
- **Titles**: Sentence case (not Title Case)
- **Spelling**: US English (standardize, not standardise)
- **Emphasis**: Italics for emphasis, bold for UI elements only
- **Code font**: Filenames, commands, params, directory paths, branch names
- **Placeholder text**: `SCREAMING_SNAKE_CASE` (no brackets and no angular brackets)
- **Avoid**: Latin abbreviations (i.e., e.g., etc.) — use "that is," "for example," "and more"
- **UI elements**: Bold the element name — "Click **Submit**" (not "Click the **Submit** button")
- **Links**: Never "Click here" — use descriptive text: "refer to the [dbt Labs doc site](https://docs.getdbt.com/)"

Full guide: `contributing/content-style-guide.md`

## Content types & title conventions

| Type | Title pattern | Example |
|------|---------------|---------|
| Conceptual | "About [noun]" | "About incremental models" |
| Referential | Descriptive noun phrase | "Supported data platforms" |
| Procedural | Gerund (verb + -ing) | "Setting up continuous integration" |
| Guide | Gerund, general scope | "Managing repository settings" |
| Quickstart | Gerund, no "quickstart" in title | "Getting started with Snowflake" |
| Cookbook | "How to [verb] [topic]" | "How to calculate ARR using metrics" |

Full guide: `contributing/content-types.md`

## Frontmatter

### Docs pages

```yaml
---
title: "Page title"
id: "unique-identifier"
description: "SEO description"
sidebar_label: "Sidebar text"
pagination_next: "docs/path/to/next-page"
pagination_prev: null
hide_table_of_contents: false
---
```
Do not use constants in frontmatter.

### Blog posts

Filename: `website/blog/YYYY-MM-DD-slug.md`

```yaml
---
title: "Post title"
description: "Compelling sentence from the article"
slug: seo-optimized-slug
authors: [author_slug]
tags: [appropriate-tag]
hide_table_of_contents: false
date: YYYY-MM-DD
is_featured: true
---
```

Insert `<!-- truncate -->` after intro paragraphs (before first `##`).

Authors: `website/blog/authors.yml` · Tags: `website/blog/categories.yml`

## Versioning

### Version definitions

Managed in `website/dbt-versions.js`. First entry = latest/default.

| Version | Display | Status |
|---------|---------|--------|
| 2.0 | dbt Fusion engine (Latest) | Prerelease |
| 1.12 | dbt platform (Latest Core) | Stable |
| 1.11 | Core v1.11 | EOL 2026-12-18 |
| 1.10 | Core v1.10 (Compatible/Extended) | EOL 2026-06-15 |

### Version content blocks

Show/hide content based on selected version:

```jsx
<VersionBlock firstVersion="1.5" lastVersion="1.9">
Content only visible for versions 1.5 through 1.9
</VersionBlock>

<VersionBlock firstVersion="2.0">
Content only visible for version 2.0+
</VersionBlock>
```

### Version entire pages

Add to `versionedPages` in `website/dbt-versions.js`:

```js
{ page: "docs/path/to/page", firstVersion: "2.0" }      // 2.0+ only
{ page: "docs/path/to/page", lastVersion: "1.99" }       // 1.x only
```

This hides the page from the sidebar and shows a banner when version doesn't match.

### Version sidebar categories

Add to `versionedCategories` in `website/dbt-versions.js` (same `firstVersion`/`lastVersion` pattern).

### URL version param

`?version=2.0` in the URL sets the active version. Managed by `VersionContext` (React context) which syncs to localStorage + URL via `replaceState`.

Full guide: `contributing/single-sourcing-content.md`

## Components for MDX

### Images

```jsx
<Lightbox src="/img/docs/example.jpg" title="Description" width="80%" />
```

Store images in `website/static/img/`. Always include `title` for accessibility.

### File blocks

```jsx
<File name="models/my_model.sql">

```sql
select * from {{ ref('stg_customers') }}
```

</File>
```

### Callouts

```
:::note Optional title
Note content here.
:::
```

Types: `note`, `info`, `tip`, `caution`

### Tabs

```jsx
<Tabs defaultValue="snowflake" values={[
  { label: 'Snowflake', value: 'snowflake' },
  { label: 'BigQuery', value: 'bigquery' }
]}>
<TabItem value="snowflake">
Snowflake content
</TabItem>
<TabItem value="bigquery">
BigQuery content
</TabItem>
</Tabs>
```

### Warehouse-specific code

```jsx
<WHCode>
<div warehouse="Snowflake">

```sql
select * from my_table
```

</div>
<div warehouse="BigQuery">

```sql
select * from `project.dataset.my_table`
```

</div>
</WHCode>
```

### Collapsible / Expandable sections

```jsx
<Collapsible header="Click to expand">
Hidden content here.
</Collapsible>

<Expandable alt_header="Section title">
Content with anchor link support.
</Expandable>
```

### Glossary terms

```jsx
<Term id="cte" />                          <!-- Renders hover tooltip -->
<Term id="cte">Common Table Expression</Term>  <!-- Custom display text -->
```

Terms defined in `website/docs/terms/hover-terms.md`.

### Lifecycle badges

```jsx
<Lifecycle status="preview" />
<Lifecycle status="deprecated" />
<Lifecycle status="beta" />

Source for additional lifecycle statuses: `website/src/components/lifeCycle/index.js`.

GA is not used usually.
```

### FAQ

```jsx
<FAQ path="Warehouse/bq-copy-grants" />
```

Loads from `website/docs/faqs/` directory.

### Cards

```jsx
<div className="grid--3-col">
<Card
  title="Studio IDE"
  body="Build and test dbt models in the browser."
  link="/docs/cloud/studio-ide/develop-in-studio"
  icon="pencil-paper"
/>
</div>
```

Grid options: `grid--2-col`, `grid--3-col`, `grid--4-col` (sparingly), `grid--5-col` (sparingly).
Do not use constants in Cards.
### Intro text

```jsx
<IntroText>
Brief overview paragraph at the top of the page.
</IntroText>
```

## Reusable content

### Partials (preferred)

1. Create `website/snippets/_my-partial.md`
2. Import and use in any doc:

```jsx
import MyPartial from '/snippets/_my-partial.md';

<MyPartial />
```

Supports props: `<MyPartial feature="Fusion" />` → access as `{props.feature}` in the partial.

### Snippets (legacy)

```jsx
<Snippet path="my-snippet" />
```

Source file: `website/snippets/my-snippet.md` (no underscore prefix).

## Sidebar

Config: `website/sidebars.js`

Only edit when adding or removing pages. Structure:

```js
{
  type: "category",
  label: "Section name",
  collapsed: true,
  link: { type: "doc", id: "docs/section-overview" },
  items: [
    "docs/page-id",
    { type: "category", label: "Subsection", items: [...] }
  ]
}
```

## Links

- Internal: relative paths starting with `/docs/`, `/guides/`, `/reference/`, `/community/`
- Section anchors: `/docs/build/incremental-models#understand-incremental-models`
- External: full URLs with descriptive link text
- Never use raw URLs or "Click here"

## Icons

SVG icons live in two locations (for light + dark mode):

- `website/static/img/icons/`
- `website/static/img/icons/white/`

## Testing

- **Unit tests**: Jest + React Testing Library (`npm test`)
- **E2E tests**: Cypress (`website/cypress/`)
- **Linting**: ESLint with markdown plugin, pre-commit via Husky
- **Vale**: Style linting config at `.vale.ini`

## Common tasks

### Add a new docs page

1. Create `website/docs/section/page-name.md` with frontmatter
2. Add the page ID to `website/sidebars.js`
3. If version-specific, add to `versionedPages` in `dbt-versions.js`

### Add a blog post

1. Create `website/blog/YYYY-MM-DD-slug.md` with blog frontmatter
2. Add author to `website/blog/authors.yml` if new
3. Add images to `website/static/img/blog/YYYY-MM-DD-slug/`

### Add a reusable partial

1. Create `website/snippets/_descriptive-name.md`
2. Import in target doc: `import Name from '/snippets/_descriptive-name.md';`
3. Use: `<Name />`
