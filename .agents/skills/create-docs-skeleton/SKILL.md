---
name: create-docs-skeleton
description: Scaffold a new skeleton markdown doc for docs.getdbt.com — standard guide, reference page, feature/product page, or release note entry. Use when asked to create a new doc page, scaffold a doc, start a new page, or add a page to the sidebar.
---

Scaffold a new docs.getdbt.com markdown page with correct frontmatter and section
structure, then optionally wire it into `sidebars.js`. All paths below are relative
to the `website/` directory (repo root for this project).

## Workflow

1. **Ask for the target path** if not given, e.g. `docs/docs/dbt-ai/new-feature.md`.
   The user always specifies this — don't infer it.
2. **Ask which doc type** (see table below) if not obvious from context.
3. **Build frontmatter.** Always include the full default set:
   `title`, `id`, `description`, `sidebar_label`. Then ask ONLY about the
   SEO fields (`meta_description` / `keywords`) — don't ask about the rest,
   don't skip the defaults.
4. **Apply brand rules** to all generated prose (title, description, headings,
   body): `dbt` always lowercase, `dbt Labs` capital L, job titles lowercase,
   sentence case headings, "dbt platform" not "dbt Cloud", `<Constant>` for
   product names where one exists in `constants.js`.
5. **Write the file** with the skeleton for the chosen doc type.
6. **Offer to add a sidebar entry** in `sidebars.js` (see below) — ask where
   in the tree it belongs (which category), don't guess.

## Doc types

| Type | Frontmatter extras | Body skeleton |
|---|---|---|
| Standard guide | none beyond defaults | `##` sections for the task, no special components |
| Reference page | `keywords` (list) | Property/config table, links to related build docs |
| New feature/product page | `tags`, `availability` block | `<IntroText>`, `<Lifecycle status="...">`, "Where to access", "Considerations"/FAQ |
| Release note entry | none — appended to existing file, no new frontmatter | Bullet under the current month's `##` heading, using **New:**/**Enhancement:**/**Fix:**/**Behavior change:** prefix |

Verified against real pages in this repo:
`docs/docs/dbt-ai/copilot-overview.md` (feature page),
`docs/reference/semantic-model-properties.md` (reference page),
`docs/docs/dbt-versions/release-notes.md` (release notes).

### Standard guide skeleton

```md
---
title: "<Title>"
id: "<slug>"
description: "<One-sentence description of what this page covers.>"
sidebar_label: "<Short nav label>"
---

# <Title>

<One-paragraph intro: what this is, who it's for.>

## <First task heading>

<Steps or explanation.>

## <Next task heading>

<Steps or explanation.>

## Related docs

- [<Related page>](<relative-link>)
```

### Reference page skeleton

```md
---
title: "<Title>"
id: "<slug>"
sidebar_label: "<Short nav label>"
description: "<One-sentence description of what this reference covers.>"
keywords:
  - <keyword one>
  - <keyword two>
---

<One-paragraph intro: what this configures/defines and where it's used, with a
link to the conceptual doc it supports.>

## <Property/section name>

| Field | Type | Required | Description |
|---|---|---|---|
| `field_name` | string | Yes | <what it does> |

## Related docs

- [<Related page>](<relative-link>)
```

### New feature/product page skeleton

```md
---
title: "<Product/feature name>"
id: "<slug>"
description: "<One-sentence description of what this feature does.>"
sidebar_label: "<Short nav label>"
tags: [<Tag>]
availability:
  surface: platform
  access: paid_plan
  minPlan: <plan>
---

# <Product/feature name>

<IntroText>
<One or two sentences: what it is, the core value.>
</IntroText>

<Lifecycle status="preview" />

## Where to access <feature name>

<Bulleted list of surfaces/entry points, each linking to its own doc.>

## Considerations

- <Prerequisite or limitation.>
- <Prerequisite or limitation.>
```

Drop `<Lifecycle>` if the feature is already generally available. Drop the
`availability` frontmatter block if the feature isn't platform/plan-gated.

### Release note entry

Don't create a new file — append to the current month's section in
`docs/docs/dbt-versions/release-notes.md`. If the current month has no `##`
heading yet, add one (`## <Month> <Year>`) above the previous month's.

```md
- **New:** <What shipped and why it matters. Link to the full doc.>
```

Use **Enhancement:**, **Fix:**, or **Behavior change:** instead of **New:**
as appropriate — see the categories defined at the top of that file.

## Sidebar wiring

`sidebars.js` at the repo root nests doc IDs (without `.md`) inside
`items: [...]` arrays under `type: "category"` blocks. Example, from the
"dbt Wizard" category (`sidebars.js:392-401`):

```js
{
  type: "category",
  label: "dbt Wizard",
  collapsed: true,
  link: { type: "doc", id: "docs/platform/wizard-overview" },
  items: [
    "docs/platform/wizard-overview",
    "docs/dbt-ai/wizard-quickstart",
    // ... add the new doc id here, e.g.:
    "docs/dbt-ai/new-feature",
  ],
},
```

To wire in a new page:

1. Find the category the user wants it under (ask if unclear).
2. Add `"<same path as the file, without .md extension>"` to that category's
   `items` array, in the position the user specifies (or logically, near
   related pages).
3. Don't create new categories or reorder existing entries unless asked.

## Gotchas

- `id` in frontmatter should match the filename (without `.md`) — Docusaurus
  doesn't require this, but every real example in this repo does it, and
  drift confuses cross-references.
- Release notes are **appended to one long file**, not created as new pages
  — don't scaffold a standalone file for a release note by mistake.
- `pagination_next: null` / `pagination_prev: null` only appears on
  standalone/landing-style pages (e.g. `release-notes.md`) — don't add it by
  default to a normal guide or reference page; it suppresses the
  next/previous nav links.
