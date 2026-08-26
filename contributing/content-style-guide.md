# Content style guide

This guide defines standards for writing documentation on docs.getdbt.com. Follow these rules to ensure clarity, consistency, and accessibility.

For questions not covered here, refer to the [Microsoft Writing Style Guide](https://docs.microsoft.com/en-us/style-guide/welcome/) and the [Chicago Manual of Style](https://www.chicagomanualofstyle.org/home.html).

## Quick reference

| Category | Rule |
|----------|------|
| Voice | Use active voice |
| Tense | Use present tense |
| Person | Use second person ("you") |
| Capitalization | Use sentence case for titles and headings |
| Lists | Use parallel structure; no ending punctuation unless complete sentences |
| Code | Use backticks for inline code, code blocks for multi-line |
| Links | Use relative paths; descriptive link text |

## Table of contents

- [Naming conventions and branding](#naming-conventions-and-branding)
- [File and folder structure](#file-and-folder-structure)
- [Markdown syntax](#markdown-syntax)
- [Text formatting](#text-formatting)
- [UI elements](#ui-elements)
- [Capitalization](#capitalization)
- [Titles and headings](#titles-and-headings)
- [Lists](#lists)
- [Tables](#tables)
- [Cards](#cards)
- [Code formatting](#code-formatting)
- [Links](#links)
- [Images](#images)
- [Word choice and terminology](#word-choice-and-terminology)
- [Callouts](#callouts)

---

## Naming conventions and branding

### dbt products

Always use these exact names (case-sensitive):

| Product | Usage | Notes |
|---------|-------|-------|
| dbt Labs | The company | Always lowercase "dbt", capital "L" |
| dbt | Generic reference | Use when content applies to all dbt offerings |
| dbt Core | Versions ≤1.x | Lowercase "dbt", capital "C" |
| dbt Fusion engine | Versions ≥2.x | Can shorten to "Fusion" in docs |
| dbt | Cloud-based offering | Formerly "dbt Cloud"; use "managed dbt" or "dbt platform" for clarity |

Plan tiers (capitalize): Developer, Starter, Enterprise, Enterprise+

### dbt features

**Capitalize these product names:**
- Studio IDE
- Canvas
- Insights
- Catalog
- dbt Mesh
- Orchestrator
- Semantic Layer
- Copilot
- dbt MCP server
- dbt Agents

**Do not capitalize these features:**
- dbt platform
- models
- environments
- configs
- settings
- column-level lineage

### Third-party brands

We have many official and unofficial partners in the world of dbt and we must respect their branding. Use official branding. Update when vendors rebrand.

| ❌ Avoid | ✅ Use |
|----------|--------|
| Microsoft Azure Active Directory | Microsoft Entra ID |
| VScode | VS Code |
| Visual Studio Code | VS Code (acceptable shorthand) |

### Acronyms and initialisms

Use all caps unless another standard exists (such as in code blocks):

| ❌ Avoid | ✅ Use |
|----------|--------|
| yaml | YAML |
| sql | SQL |
| json | JSON |
| DBT | dbt |

**Exception:** File extensions use lowercase (`.sql`, `.yml`) or inside code blocks (```yaml)


## File and folder structure

### File naming rules

1. Use lowercase with hyphens (`kebab-case`)
2. Keep names short. They appear in the URL
3. Be descriptive but concise
4. Avoid redundant words:
| ❌ Redundant (avoid) | ✅  Prefer |
|----------------------|-----------|
| `users_model.sql`     | `users.sql` or `user_orders.sql` |
| `macros_utils.sql`     | `utils.sql` |
| `schema_schema.yml` | `schema.yml` |

| ❌ Avoid | ✅ Use |
|----------|--------|
| `/docs/deploy/how-we-think-about-architecture` | `/docs/platform/about-platform/architecture` |
| `getting-started-with-dbt-setup.md` | `dbt-setup.md` |

### Sidebar configuration

- Edit `sidebar.js` only when adding or removing pages
- The left sidebar (leftbar) is defined in `sidebar.js`
- The right sidebar (page TOC) generates automatically from H2 (##) and H3 (###) headings
- Expect merge conflicts in `sidebar.js`. Review carefully and accept other contributors' changes
- Ensure content is placed into proper directory (/docs, /guides, /reference, etc.)
- Keep sidebar ordering consistent with the existing content hierarchy

---

## Markdown syntax

### Link syntax

| Element | Syntax |
|---------|--------|
| External link | `[Title](https://www.example.com)` |
| Internal link | `[Title](/docs/folder/file-name)` |
| Anchor link (same page) | `[Title](#section-name)` |
| Relative link (other page) | `[Title](/docs/folder/file-name#section-name)` |

**Valid path prefixes:**
- `/docs/`
- `/guides/`
- `/reference/`
- `/community/`

Do not include file extensions (like .md) in internal links.

### Image syntax

We use the Lightbox feature for image posting. Use the following syntax for posting images (width optional. Use it to resize large images):

```markdown
<Lightbox src="/img/docs/image-name.jpg" width=60% title="Concise description"/>
```

---

## Text formatting

### When to use each format

| Format | Use for | Example |
|--------|---------|---------|
| *Italics* | Emphasis | Do *not* leave belongings on the bus. |
| **Bold** | UI elements, titles, headers | Click **Submit**. |
| `Code` | Code, paths, filenames, commands, parameters | Update `dbt_project.yml` |

### Code formatting rules

Use code font for:
- Source code (SQL, YAML, JavaScript)
- Placeholder text
- Directory paths (`/opt/homebrew/bin/`)
- Directory names (the `etc` directory)
- Filenames (`dbt_project.yml`)
- Git branch names (`main`)
- Commands (`ghe-cluster-status`)
- Arguments, parameters, keys
- Adapter names (`dbt-snowflake`)

**Do not:**
- Combine multiple text decorations
- Use inline links within command names (❌ Use [`dbt run`](/docs/commands/run) to build your models.

---

## UI elements

### Standard terminology

| Element | Verb | Example |
|---------|------|---------|
| Button | Click | Click **Submit**. |
| Checkbox | Select / Clear | Select the **New** option. |
| Dropdown | Select / Choose | In **Create**, select **From a template**. |
| Radio button | Select / Choose / Clear | Choose **Small size**. |
| Text field | Enter | In **Address**, enter your company's address. |

**Avoid:** "Click the button", "Check/Uncheck", "Hit", "Tap"

### Describing UI location

Use positional terms: upper, lower, center, left, right

✅ Use the search box in the upper left corner.  
✅ Access guides from the **Guides** menu at the top of the page.

### UI sections

Bold section names. Avoid "panel" and "pane."

✅ In the **Settings** section, choose the default address.  
❌ Review orders from the **History** pane.

---

## Capitalization

### Rules

1. Use sentence case for titles and headings
2. Capitalize product names (see [product list](#dbt-features))
3. Capitalize acronyms and proper nouns
4. Do not capitalize common features

---

## Titles and headings

### Rules

1. Use sentence case
2. Be descriptive and action-oriented
3. Keep concise
4. Match the content type (see [content types](https://github.com/dbt-labs/docs.getdbt.com/blob/current/contributing/content-types.md))

---

## Lists

### When to use each type

| Type | Use when |
|------|----------|
| Bulleted (unordered) | Items can appear in any order |
| Numbered (ordered) | Steps must follow a sequence |

### List rules

1. Include at least two items
2. Use parallel grammatical structure
3. Start each item with a capital letter
4. Do not end items with commas, semicolons, or conjunctions
5. Use periods only for complete sentences
6. Introduce with a heading or complete sentence/fragment followed by a colon

### Examples

**Bulleted list:**
> A dbt project must contain at minimum:
> - Models: Single `.sql` files containing `select` statements
> - A project file: `dbt_project.yml` that configures your project

**Numbered list:**
> ## Create a new branch
> 1. Navigate to the **Develop** interface.
> 2. Click **+ create new branch** and enter `add-customers-model`.

---

## Tables

### Table rules

1. Introduce with a heading or sentence/fragment followed by a colon
2. Use a header row
3. Use sentence case for all content
4. Keep content concise

### When to avoid tables

- Content becomes hard to read
- Cells require excessive text
- Mobile display suffers
- The content is step-by-step
- There are only one or two items
- It isn’t meant for side-by-side comparison
- A list or headings would be clearer
**Alternative formats:** Definition lists, separate subsections, tabs, separate pages.

---

## Cards

Use the `<Card` component to display content and actions on a single topic. These are primarily used on landing pages that link out to multiple related subjects.

### Grid options

| Class | Columns | Use case |
|-------|---------|----------|
| `grid--2-col` | 2 | Default choice |
| `grid--3-col` | 3 | Common use |
| `grid--4-col` | 4 | Limited text only (≤15 words) |
| `grid--5-col` | 5 | Limited text only (≤15 words) |

**For 4-5 columns:** Set `hide_table_of_contents: true` in the frontmatter to hide the right table of contents and prevent crowding.

### Card component syntax

```jsx
<div className="grid--3-col">

<Card
    title="Studio IDE"
    body="The IDE is the easiest way to develop dbt models."
    link="/docs/platform/studio-ide/develop-in-studio"
    icon="pencil-paper"/>

<Card
    title="Another feature"
    body="Description with <a href='https://example.com'>inline link</a>"
    icon="pencil-paper"/>

</div>
```

### Card props

| Prop | Required | Description |
|------|----------|-------------|
| `title` | Yes | Clear, action-oriented title |
| `body` | Yes | Actionable or informative text; supports `<a href>` |
| `link` | No | Makes entire card clickable; overrides body links |
| `icon` | No | Icon from `/website/static/img/icons/` |

---

## Code formatting

### Code blocks

1. Keep lines under 60 characters
2. Place explanatory text before the code block
3. Specify the language for syntax highlighting
4. Show context from the larger file

**Common language tags:** `yaml`, `sql`, `shell`, `python`, `javascript`

### Code block rules

- Avoid markup inside command output
- Only use `$` prefix when showing command output in the same block

### Example with context

✅ **Good:**
```yaml
name: my_dbt_project
version: 1.0.0

config-version: 2

vars:
  start_date: '2021-06-01'
```

❌ **Avoid** (missing context):
```yaml
config-version: 2

vars:
  start_date: '2021-06-01'
```

### Placeholder text

Use SCREAMING_SNAKE_CASE for values users must replace:

```yaml
my-redshift-db:
  target: dev
  outputs:
    dev:
      type: redshift
      cluster_id: CLUSTER_ID
```

Explain placeholders in the preceding paragraph. For example, you'd explain CLUSTER_ID:
> Replace CLUSTER_ID with the ID assigned to this cluster.

---

## Links

### Internal links

1. Use relative paths from content root
2. Do not include file extensions
3. Do not use paths relative to the current document

**Valid prefixes:** `/docs/`, `/guides/`, `/reference/`, `/community/`

**Example:**
```markdown
[Regions & IP Addresses](/docs/platform/about-platform/access-regions-ip-addresses)
```

**Section links:**
```markdown
[incremental models](/docs/build/incremental-models#understand-incremental-models)
```

### Link text rules

| ❌ Avoid | ✅ Use |
|----------|--------|
| `https://some.site.com` | [Some site](https://some.site.com) |
| [Click here](url) | [dbt Labs docs](url) |
| Visit our website | Read the [setup guide](/docs/setup) |

**Acceptable verbs:** visit, read, refer to

### Link destinations to avoid

- Sales or promotional material
- General landing pages
- Paywalled content
- Untrusted sites
- Personal sites or file shares
- Instant downloads

---

## Images

### Alt text

Every image must include descriptive alt text for screen readers.

### File requirements

1. Save images to `/website/static/img/`
2. Use `kebab-case` or `snake_case` filenames
3. Use JPEG or PNG format
4. Add icons to both `/img/icons/` and `/img/icons/white/`

### Screenshot guidelines

**When to use screenshots:**
- Highlighting navigation
- Showing on-screen elements
- Demonstrating product visuals

**When not to use screenshots:**
- Code inputs/outputs (use code blocks)
- Content that changes frequently

### Screenshot rules

- Redact all PII (names, emails, phone numbers) and sensitive info (like account numbers, internal IDs, tokens, environment details)
- Exclude URL and bookmark bars
- Use generic names (John Doe, Jane Doe) in account fields
- Capture only the relevant area 
- Crop to the relevant UI area only
- Use a consistent theme (default / light)

### Callout annotations

When highlighting UI elements:
- Use transparent boxes with red borders (medium line thickness)
- Place callouts near elements without covering details
- For multiple elements, use numbered callouts with a legend

**Numbered callout format:**
- Font: Helvetica, 30pt, Red, Bold

### Icon reference

Use [Google Material Icons](https://fonts.google.com/icons?selected=Material+Icons) for icon names.

✅ Click the menu icon  
❌ Click the hamburger menu icon

---

## Word choice and terminology

### Voice and tense

| Rule | ✅ Use | ❌ Avoid |
|------|--------|----------|
| Active voice | Developers add files. | Files are added by developers. |
| Present tense | This command runs the job. | This command will run the job. |
| Second person | You can configure... | Users can configure... |

### Spelling

Use US English spelling:

| ❌ Avoid | ✅ Use |
|----------|--------|
| standardise | standardize |
| licence | license |
| colour | color |

### Abbreviations and acronyms

1. Spell out acronyms on first use (except in titles)
2. Do not use an acronym that appears only once
3. Format: Full phrase (ACRONYM)

**Example:** Integrated Development Environment (IDE)

### Latin abbreviations

Avoid Latin abbreviations. Use plain language:

| ❌ Avoid | ✅ Use |
|----------|--------|
| i.e. | that is |
| e.g. | for example, like |
| etc. | and more, and so forth |
| N.B. | note |
| via  | using, through |

### Product terminology

| ❌ Avoid | ✅ Use |
|----------|--------|
| CLI (alone) | dbt CLI or dbt Core |
| dbt CLI | dbt platform CLI (full name) |
| enter (in UI) | type |
| type (in command line) | enter |
| e-mail | email |
| client, customer | person, human |
| organization | plan(s), account |
| hit, tap | press |
| soft limit | recommended limit |
| log in, login | sign in |
| signup | sign up |
| shell | terminal |
| login (noun) | username |

### Regional language

Avoid regional idioms. Write for a global audience.

❌ "Do the needful"  
✅ "Complete the required steps"

---

## Callouts

Use callouts sparingly for important information. Overuse reduces impact.

### Callout types

| Type | Syntax | Use for |
|------|--------|---------|
| Note | `:::note` | General notices |
| Info | `:::info` | Highlighted information |
| Tip | `:::tip` | Helpful suggestions |
| Caution | `:::caution` | Warnings and considerations |

### Syntax

```markdown
:::note Optional title

Callout content here.

:::
```

### Rules

1. Keep content minimal
2. Avoid general information, permissions, or prerequisites in callouts
3. One key point per callout

---

## Contributing

Your feedback helps drive us forward. At dbt Labs, we want you to get involved if you see areas in the documentation that need improvement. That might include becoming a docs contributor or simply filing a GitHub issue so we know where to look. We have an incredible community of contributors, and our documents reflect that.

Your feedback improves these docs. To contribute:
- File a [GitHub issue](https://github.com/dbt-labs/docs.getdbt.com/issues)
- Submit a pull request
- Join the community discussions

This style guide evolves as we identify improvements. The dbt Labs technical writing team reviews all contributions.
