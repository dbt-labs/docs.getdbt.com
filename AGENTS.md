# AI Agent Guidelines for docs.getdbt.com

This guide provides AI agents with essential rules and patterns for making editorial changes to the dbt documentation repository. These guidelines are derived from the [content style guide](contributing/content-style-guide.md).

## Quick Reference

### Critical Rules
1. **Use `-` for bullet points**, never `*` (asterisks)
2. **Replace "e.g." with "for example"** (except in code comments)
3. **Replace "i.e." with "that is"**
4. **Use Oxford commas** for lists with 3+ items
5. **Use sentence case** for all titles and headings
6. **Use US spelling** (color not colour, license not licence)

### Product Names (Case Sensitive)
- **dbt Labs** - The company (capital L)
- **dbt** - Always lowercase (never DBT)
- **dbt Core** - The open source version (capital C)
- **dbt Fusion engine** - The next-gen engine (capital F)
- **dbt platform** or **cloud-based dbt platform** - Formerly "dbt Cloud"

### Feature Names (Capitalize These)
- Studio IDE
- Canvas
- Insights
- Catalog
- Mesh
- Orchestrator
- Semantic Layer
- Copilot

### Text Formatting

#### When to Use Bold
- UI elements: buttons, checkboxes, dropdown menus, radio buttons, text fields
- Section names in the interface

**Examples:**
- ✅ Click **Submit** to save
- ❌ Click the Submit button

#### When to Use Code Font
Use backticks for:
- Source code (SQL, YAML, JavaScript)
- File paths: `/opt/homebrew/bin/`
- Directory names: `etc`
- Filenames: `dbt_project.yml`
- Git branches: `main`
- Commands: `dbt run`
- Arguments/parameters/keys

#### When to Use Italics
- For emphasis only
- Example: Do _not_ delete this file

### Lists

**Bullet Lists:**
```markdown
- First item
- Second item
- Third item
```

**Never use:**
```markdown
* First item  ❌
* Second item ❌
```

**List Guidelines:**
- Minimum 2 items
- Consistent grammatical structure
- No commas, semicolons, or conjunctions at end
- Use periods only if complete sentences

### Oxford Comma

**Always use Oxford comma (serial comma) for 3+ items:**
- ✅ models, tests, and snapshots
- ❌ models, tests and snapshots

**No comma needed for 2 items:**
- ✅ models and tests

### Latin Abbreviations

Replace these in prose (not in code):

| Avoid | Replace With | Example |
|-------|-------------|---------|
| e.g. | for example, like | Join the #db-sqlserver and #db-athena channels (for example, #adapter-ecosystem) |
| i.e. | that is | Use incremental models when runs are slow (that is, don't start with incremental models) |
| etc. | and more, and so forth | Running in GitHub, GitLab, and more |

### Capitalization

- **Products/Features:** Capitalize (Catalog, Canvas, Studio IDE)
- **Common features:** Lowercase (models, environments, configs, column-level lineage)
- **Acronyms and initialisms:** All caps (SQL, YAML, JSON) except dbt
- **Titles:** Sentence case only

### Links

**Internal links use relative paths:**
```markdown
[Link text](/docs/path/to/page)
[Link to section](/docs/path/to/page#section-name)
```

**Paths must start with:**
- `/docs/`
- `/guides/`
- `/reference/`
- `/community/`

**Link text should be descriptive:**
- ✅ Read the [dbt Core documentation](/docs/core/about-core)
- ❌ Click [here](/docs/core/about-core)

### Images

Use Lightbox component:
```markdown
<Lightbox src="/img/docs/image-name.jpg" title="Concise description"/>
```

**Guidelines:**
- Add descriptive `title` attribute (required for accessibility)
- Use JPEG or PNG format
- Store in `static/img/` folder
- Use descriptive filenames: `viewing-admins-01.jpg` not `screenshot.jpg`

### Callouts

```markdown
:::note Optional title
Your text here
:::
```

**Types:** `note`, `info`, `tip`, `caution`

## Common Patterns

### Button Instructions
```markdown
✅ Click **Save** to continue
❌ Click the Save button
```

### Code References
```markdown
✅ Update your `dbt_project.yml` file
✅ Run the `dbt build` command
❌ Update your dbt_project.yml file
```

### Placeholder Text
```markdown
✅ Replace CLUSTER_ID with your cluster ID
❌ Replace <CLUSTER_ID> with your cluster ID
```

Use SCREAMING_SNAKE_CASE for placeholders (no brackets or braces).

### UI Navigation
```markdown
✅ Select **Create** > **From a template**
✅ In the **Settings** section, click **Save**
❌ Go to the Settings pane
```

### Active Voice
```markdown
✅ Developers add files
❌ Files are added by developers
```

## File Organization

### Frontmatter
Every markdown file should have YAML frontmatter:
```yaml
---
title: "Page title in sentence case"
id: "page-id"
description: "Brief description"
---
```

## What NOT to Change

1. **Code blocks** - Any content in triple backticks
2. **Configuration examples** - YAML, SQL, JSON examples
3. **File extensions** - Keep `.sql`, `.yml`, `.py` as-is
4. **URLs** - Don't modify external links
5. **Product constants** - Leave `<Constant name="..." />` as-is
6. **Comments in code** - Latin abbreviations in code comments are acceptable

## Validation Checklist

Before submitting changes:
- [ ] All bullet points use `-` not `*`
- [ ] No "e.g." or "i.e." in prose (only in code comments)
- [ ] Oxford commas in all 3+ item lists
- [ ] Sentence case for all titles
- [ ] Product names use correct capitalization
- [ ] No changes to code blocks or configurations
- [ ] Links use relative paths starting with `/docs/`, `/guides/`, or `/reference/`
- [ ] Images use Lightbox component with title attribute
- [ ] Active voice preferred over passive

## Common Mistakes to Avoid

1. ❌ Using asterisks (`*`) for bullet points - Use hyphens (`-`)
2. ❌ Writing "e.g." in prose - Write "for example"
3. ❌ Missing Oxford commas - Add before "and" in 3+ item lists
4. ❌ Title case headings - Use sentence case
5. ❌ "dbt Cloud" - Use "dbt platform" or "cloud-based dbt platform"
6. ❌ "DBT" - Always "dbt" (lowercase)
7. ❌ "Click the button" - Say "Click **Button**"
8. ❌ Absolute links - Use relative paths for internal links
9. ❌ "Click here" links - Use descriptive link text
10. ❌ Changing code examples - Never modify code blocks

## Resources

- Full style guide: [contributing/content-style-guide.md](contributing/content-style-guide.md)
- Microsoft Style Guide: https://learn.microsoft.com/en-us/style-guide/
- Chicago Manual of Style: https://www.chicagomanualofstyle.org/
