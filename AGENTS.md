# AGENTS.md — docs.getdbt.com

This file serves two different kinds of agents. Read the section that matches your task — you don't need both.

- **Answering a question using dbt docs?** → [Fetching these docs](#fetching-these-docs)
- **Editing or creating a page in this repo?** → [Contributing to this repository](#contributing-to-this-repository)

---

## Fetching these docs

Use this section if you're answering a user's question about dbt and need to ground your answer in the current, canonical documentation — especially if you don't have this repository checked out locally.

### Fast path: the page index

Fetch `https://docs.getdbt.com/llms.txt` first. It's a categorized index of every page with a one-line description — enough to identify which page(s) are relevant to a query without fetching full content. This is usually sufficient on its own.

### Fetching a specific page

Every docs page is available as clean Markdown by appending `.md` to its URL path:

```
https://docs.getdbt.com/docs/build/incremental-models-overview.md
```

Always prefer this over fetching the rendered HTML page — the Markdown version strips navigation, footers, and styling chrome, and is far more token-efficient.

### If the index doesn't surface what you need

Fall back to full-text search rather than guessing:

- `https://docs.getdbt.com/llms-full.txt` contains the complete content of every page in one file, for direct full-text search.
- The `fetching-dbt-docs` skill (from the separate [`dbt-labs/dbt-agent-skills`](https://github.com/dbt-labs/dbt-agent-skills) repo — **not bundled in this repo**, install separately via the Claude Code plugin marketplace or Vercel Skills CLI) ships a local search script with a 24-hour cache, with a flag to force a fresh fetch if the docs may have changed recently.

> **Open question for this repo**: `docs.getdbt.com`'s own `.claude/skills` currently only ships the authoring skills (`create-docs-skeleton`, `add-availability-badge`). Someone working in this repo may reasonably want both — for example, "check how existing pages describe X before I draft a new page about Y" is a retrieval task and an authoring task at once. Worth deciding whether `fetching-dbt-docs` should be vendored in here too, or left as a separate install.

### If you're connected to the dbt MCP server

Prefer the native **Product Docs** toolset over ad hoc web fetches:

- `search_product_docs` — searches docs.getdbt.com and returns titles, URLs, and relevance-ranked descriptions
- `get_product_doc_pages` — fetches full Markdown content for one or more pages by path or URL

This is the same search-then-fetch workflow as above, but happens natively inside the tool you're already using.

### Things to watch for

- **Version ambiguity**: some page titles/paths are shared between dbt Core (v1.x) and the dbt Fusion engine (v2.x) — e.g. connection profile and `profiles.yml` pages exist under both `docs/local/` and `docs/fusion/connect-data-platform-fusion/`. Check the URL path, not just the title, before citing one as authoritative for a user's version.
- **Plan/lifecycle tags**: page titles in `llms.txt` may carry plan-gating suffixes (Starter/Enterprise/Enterprise+) and lifecycle tags (Preview/Beta). These can run together without clear delimiters in the flat index — read them carefully, and don't assume the absence of a lifecycle tag means a feature is GA (some pages simply haven't had a stale tag removed).
- **Don't cite the marketing site as a technical source.** `getdbt.com` (no `docs.` prefix) contains promotional copy and customer testimonials, not the canonical reference — use `docs.getdbt.com` for anything you're stating as fact.

---

## Contributing to this repository

Use this section if you're drafting, editing, or reviewing content in this repo.

### Project overview

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
| --- | --- |
| `website/docusaurus.config.js` | Site config, navbar, footer, plugins |
| `website/sidebars.js` | Left sidebar navigation structure |
| `website/dbt-versions.js` | Version definitions, versioned pages/categories |
| `website/constants.js` | Global terminology constants |
| `website/blog/authors.yml` | Blog post author profiles |
| `website/blog/categories.yml` | Blog tag/category definitions |
| `website/vercel.json` | Contains page redirects |

### Dev commands

```bash
cd website
npm start          # Local dev server (port 3000)
npm i              # Install dependencies
npm run build      # Production build
npm test           # Jest tests (watch mode)
npm run lint       # ESLint with cache
npm run lintAll    # ESLint auto-fix
```

### Branding & terminology

These rules are **mandatory** — incorrect branding is the most common docs error.

**Product names (all case-sensitive):**

| Name | Usage | Notes |
| --- | --- | --- |
| **dbt** | Always lowercase | Generic references across all products |
| **dbt Core** | Lowercase `dbt`, capital `C` | dbt versions ≤ 1.x |
| **dbt Fusion engine** | Or just "Fusion" in docs | dbt versions ≥ 2.x |
| **dbt platform** | Not "dbt Cloud" | The cloud-based platform (formerly dbt Cloud) |
| **dbt Labs** | The company | When docs say "we," this is who "we" is |

**Feature proper nouns (capitalize these)**: Studio IDE, Canvas, Insights, Catalog, Mesh, Orchestrator, Semantic Layer, Copilot. All other features (models, environments, configs, settings) are common nouns.

**Use `<Constant>` for product names when available:**

<Constant name="dbt_platform" />   // → "dbt platform"
<Constant name="fusion_engine" />  // → "dbt Fusion engine"
<Constant name="studio_ide" />     // → "Studio IDE"
```

Refer to `website/constants.js` for constant names.

**Third-party brands**: respect their branding. Use official names (VS Code, not VScode; Microsoft Entra ID, not Azure AD).

**Acronyms**: all caps except `dbt` — YAML, SQL, JSON, IDE. Spell out on first use.

### Writing style

- **Voice**: Active, second person ("you"), conversational
- **Commas**: Oxford comma required
- **Titles**: Sentence case (not Title Case)
- **Spelling**: US English (standardize, not standardise)
- **Emphasis**: Italics for emphasis, bold for UI elements only
- **Code font**: Filenames, commands, params, directory paths, branch names
- **Placeholder text**: `SCREAMING_SNAKE_CASE` (no brackets, no angular brackets)
- **Avoid**: Latin abbreviations (i.e., e.g., etc.) — use "that is," "for example," "and more"
- **UI elements**: Bold the element name — "Click **Submit**" (not "Click the **Submit** button")
- **Links**: Never "Click here" — use descriptive text, for example use "refer to the [dbt Labs, Inc. product documentation](https://docs.getdbt.com/)"

Full guide: `contributing/content-style-guide.md`

### Content types & title conventions

| Type | Title pattern | Example |
| --- | --- | --- |
| Conceptual | "About [noun]" | "About incremental models" |
| Referential | Descriptive noun phrase | "Supported data platforms" |
| Procedural | Gerund (verb + -ing) | "Setting up continuous integration" |
| Guide | Gerund, general scope | "Managing repository settings" |
| Quickstart | Gerund, no "quickstart" in title | "Getting started with Snowflake" |
| Cookbook | "How to [verb] [topic]" | "How to calculate ARR using metrics" |

Full guide: `contributing/content-types.md`

### Frontmatter

**Docs pages:**

```yaml
---
title: "Page title"
id: "unique-identifier"
description: "SEO description"
sidebar_label: "Sidebar text"
availability: <preset-or-object>   # see availability-badge skill; omit only if truly universal
pagination_next: "docs/path/to/next-page"
pagination_prev: null
hide_table_of_contents: false
---
```

Do not use constants in frontmatter.

**Blog posts** (filename: `website/blog/YYYY-MM-DD-slug.md`):

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

Insert `<!-- truncate -->` after intro paragraphs (before first `##`). Authors: `website/blog/authors.yml` · Tags: `website/blog/categories.yml`

### Versioning

**Version definitions** — managed in `website/dbt-versions.js`. First entry = latest/default.

| Version | Display | Status |
| --- | --- | --- |
| 2.0 | dbt Fusion engine (Latest) | Prerelease |
| 1.12 | dbt platform (Latest Core) | Stable |
| 1.11 | Core v1.11 | EOL 2026-12-18 |
| 1.10 | Core v1.10 (Compatible/Extended) | EOL 2026-06-15 |

**Version content blocks** — show/hide content based on selected version:

```
<VersionBlock firstVersion="1.5" lastVersion="1.9">
Content only visible for versions 1.5 through 1.9
</VersionBlock>

<VersionBlock firstVersion="2.0">
Content only visible for version 2.0+
</VersionBlock>
```

**Version entire pages** — add to `versionedPages` in `website/dbt-versions.js`:

```
{ page: "docs/path/to/page", firstVersion: "2.0" }   // 2.0+ only
{ page: "docs/path/to/page", lastVersion: "1.99" }   // 1.x only
```

This hides the page from the sidebar and shows a banner when the version doesn't match.

**Version sidebar categories** — add to `versionedCategories` in `website/dbt-versions.js` (same `firstVersion`/`lastVersion` pattern).

**URL version param** — `?version=2.0` sets the active version, managed by `VersionContext` (React context), synced to localStorage + URL via `replaceState`.

Full guide: `contributing/single-sourcing-content.md`

### Components for MDX

**Images:**
```
<Lightbox src="/img/docs/example.jpg" title="Description" width="80%" />
```
Store in `website/static/img/`. Always include `title` for accessibility.

**File blocks:**
```
<File name="models/my_model.sql">

​```sql
select * from {{ ref('stg_customers') }}
​```

</File>
```

**Callouts:**
```
:::note Optional title
Note content here.
:::
```
Types: `note`, `info`, `tip`, `caution`

**Tabs:**
```
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

**Warehouse-specific code:** use `<WHCode>` with per-warehouse `<div warehouse="...">` blocks.

**Glossary terms:**
```
<Term id="cte" />                              <!-- Renders hover tooltip -->
<Term id="cte">Common Table Expression</Term>  <!-- Custom display text -->
```
Terms defined in `website/docs/terms/hover-terms.md`.

**Lifecycle badges:**
```
<Lifecycle status="preview" />
<Lifecycle status="deprecated" />
<Lifecycle status="beta" />
```
Source for statuses: `website/src/components/lifeCycle/index.js`. GA is not used as a status — when a feature graduates to general availability, **remove the `<Lifecycle>` tag entirely** rather than looking for a "GA" value. If you're reviewing or updating an existing page, check whether a lingering Preview/Beta tag is actually still accurate.

**FAQ:**
```
<FAQ path="Warehouse/bq-copy-grants" />
```
Loads from `website/docs/faqs/` directory.

**Cards:**
```
<div className="grid--3-col">
<Card
  title="Studio IDE"
  body="Build and test dbt models in the browser."
  link="/docs/cloud/studio-ide/develop-in-studio"
  icon="pencil-paper"
/>
</div>
```
Grid options: `grid--2-col`, `grid--3-col`, `grid--4-col` (sparingly), `grid--5-col` (sparingly). Do not use constants in Cards.

**Intro text:**
```
<IntroText>
Brief overview paragraph at the top of the page.
</IntroText>
```

### Availability badges (plan/engine gating)

Every docs page should declare an `availability` frontmatter field so it renders the correct applicability badge (engine, surface, access/plan) — this also feeds the machine-readable index that AI agents use to answer plan-gating questions correctly. See the `add-availability-badge` skill for the full preset table and field reference. Two rules worth calling out:

- Use the `platform_login` preset instead of bare `platform` — they render identically, but the preset documents the login requirement for future editors.
- Never set both `minPlan` and `plans` — pick one.

### Reusable content

**Partials (preferred):**
1. Create `website/snippets/_my-partial.md`
2. Import and use in any doc:
```
import MyPartial from '/snippets/_my-partial.md';

<MyPartial />
```
Supports props: `<MyPartial feature="Fusion" />` → access as `{props.feature}` in the partial.

**Snippets (legacy):**
```
<Snippet path="my-snippet" />
```
Source file: `website/snippets/my-snippet.md` (no underscore prefix).

### Sidebar

Config: `website/sidebars.js`. Only edit when adding or removing pages.

```
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

### Links

- Internal: relative paths starting with `/docs/`, `/guides/`, `/reference/`, `/community/`
- Section anchors: `/docs/build/incremental-models#understand-incremental-models`
- External: full URLs with descriptive link text
- Never use raw URLs or "Click here"

### Icons

SVG icons live in two locations (for light + dark mode):
- `website/static/img/icons/`
- `website/static/img/icons/white/`

### Testing

- **Unit tests**: Jest + React Testing Library (`npm test`)
- **E2E tests**: Cypress (`website/cypress/`)
- **Linting**: ESLint with markdown plugin, pre-commit via Husky
- **Vale**: Style linting config at `.vale.ini`

### Common tasks

**Add a new docs page:**
1. Create `website/docs/section/page-name.md` with frontmatter (including `availability`)
2. Add the page ID to `website/sidebars.js`
3. If version-specific, add to `versionedPages` in `dbt-versions.js`

**Add a blog post:**
1. Create `website/blog/YYYY-MM-DD-slug.md` with blog frontmatter
2. Add author to `website/blog/authors.yml` if new
3. Add images to `website/static/img/blog/YYYY-MM-DD-slug/`

**Add a reusable partial:**
1. Create `website/snippets/_descriptive-name.md`
2. Import in target doc: `import Name from '/snippets/_descriptive-name.md';`
3. Use: `<Name />`
