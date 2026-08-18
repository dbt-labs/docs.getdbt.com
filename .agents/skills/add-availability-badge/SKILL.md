---
name: add-availability-badge
description: Add or resolve an `availability` frontmatter field for a docs.getdbt.com page, so the page renders the correct applicability badge (where a feature runs, what plan/access it needs, which dbt engine version). Use when asked to add an availability badge, mark a page as platform/local/Enterprise-only, or figure out what availability value a feature needs.
---

Add the `availability` field to a page's frontmatter so it renders the right
applicability badge (engine, surface, access/plan). Source of truth:
[Notion: How to use and add applicability badges](https://app.notion.com/p/dbtlabs/How-to-use-and-add-applicability-badges-frontmatter-3a7bb38ebda780809baed78e3e893f51)
and `src/components/availability/availabilityPresets.js` (paths below are
relative to `website/`, the repo root for this project). The spec is inlined
below — re-fetching the Notion doc on every run wastes tokens on a stable,
code-backed spec. If something here looks wrong, check
`src/components/availability/availabilityPresets.js` first — it's the actual
render logic — before trusting the Notion doc or this file.

## Workflow

1. **Get the input**, either form:
   - A **preset name** directly ("use `platform_login`") — validate it exists
     in the preset table below, insert as-is.
   - A **plain-language description** ("this is an Enterprise+ platform
     feature", "CLI-only, no platform") — resolve it to a preset if one
     fits, otherwise build a custom object from the field reference. Ask a
     clarifying question ONLY when genuinely ambiguous — for example, if the
     feature skips a plan tier (needs `plans` array, not `minPlan`), or you
     can't tell if login is required outside the platform surface.
2. **Only add to pages that don't already have `availability`.** This skill
   inserts; it doesn't audit or fix existing badges. If asked to fix an
   existing one, say so and stop — that's out of scope.
3. **Insert as a top-level `availability` key** in the page's YAML
   frontmatter block — same level as `title`, `description`, etc.
4. **State what it renders as** (badge text) so the user can sanity-check
   without opening a browser — see rendering rules below.

## Step 1: try a preset first

Presets bundle `surface`/`access`/`engine` into one name. Confirmed current
list from `availabilityPresets.js`:

| Preset | Resolves to | Renders as |
|---|---|---|
| `all_users` | `access: free` (no surface/engine) | *(no badge — applies to everyone)* |
| `platform_login` | `surface: platform`, `access: login_required` | "dbt platform" (login segment suppressed on platform) |
| `local_free` | `surface: local`, `access: free` | "Local development" |
| `local_all` | `surface: local_development` | "Local development" |
| `everywhere_usage` | `access: usage_based` | "Usage-based" (+ "Login required" if not platform) |

```yaml
---
title: Managing environments
availability: platform_login
---
```

**Preset vs. location name:** a bare location value (`local`,
`local_development`, `platform`) used alone as `availability: local` is
valid too — it sets `surface` only, nothing else. Don't use bare `platform`
alone, though — it renders identically to `platform_login` but doesn't
document the login requirement for future editors. Always use the
`platform_login` preset instead of typing `platform` by itself.

## Step 2: custom config, if no preset fits

```yaml
---
availability:
  surface: platform        # local | local_development | platform | omit = every surface
  access: paid_plan        # free | login_required | usage_based | paid_plan | omit = every access level
  minPlan: enterprise      # only with access: paid_plan. starter | enterprise | enterprise_plus
  # plans: [starter, enterprise_plus]  # alternative to minPlan — use ONE, never both
  engine: v2                # v1 | v2 | omit (or "all") = both engines
---
```

Only include fields the page actually needs — every field is independently
optional.

### Field reference

| Field | Values | Notes |
|---|---|---|
| `surface` | `local`, `local_development`, `platform` | Omit = every surface. `local` = CLI-only, no platform equivalent. `local_development` = local tool that also works with platform-connected projects. |
| `access` | `free`, `login_required`, `usage_based`, `paid_plan` | Omit = every access level. `free` only renders a badge segment when paired with `surface: platform` (elsewhere free is assumed, no badge). `login_required` is hidden on `surface: platform` (login is already implied). |
| `minPlan` | `starter`, `enterprise`, `enterprise_plus` | Only with `access: paid_plan`. Expands **upward** — `minPlan: starter` renders "Starter, Enterprise, Enterprise+". Pick the lowest tier that has the feature. |
| `plans` | array, e.g. `[starter, enterprise_plus]` | Alternative to `minPlan`, for the rare case that skips a tier in the ladder. Use one or the other, never both. |
| `engine` | `v1`, `v2` | Omit or `all` = both. `v1` = dbt Core 1.x. `v2` = dbt Fusion engine 2.0+. |

### Rendering rules (so you can predict the output without a browser)

- Badge segment order is always **engine → surface → access**, e.g.
  "Available in v2 \| dbt platform \| Enterprise, Enterprise+" — regardless
  of the order fields appear in the YAML.
  `\|` denotes a rendered separator in the badge text, not `<VersionBlock>` or `<Tabs>` — don't insert literal `<VersionBlock>`/`<Tabs>` for this.
- `paid_plan` always spells out every tier `minPlan` expands to (e.g.
  "Enterprise, Enterprise+"), never just the highest or lowest one.
- Tooltip field labels: `engine` → "Version", `surface` → "Where",
  `access` → "Access".

## Examples

**CLI-only, dbt Core 1.x only:**
```yaml
availability:
  surface: local
  engine: v1
```
Renders: "Available in v1 \| Local development"

**Applies to literally everyone:**
```yaml
availability: all_users
```
Renders: nothing — intentional, a badge here would be noise.

**Enterprise+ platform feature:**
```yaml
availability:
  surface: platform
  access: paid_plan
  minPlan: enterprise
```
Renders: "dbt platform \| Enterprise, Enterprise+"

**Billed on usage, not plan-gated:**
```yaml
availability:
  surface: platform
  access: usage_based
```
Renders: "dbt platform \| Usage-based"

**Skips a tier (Starter and Enterprise+, not plain Enterprise):**
```yaml
availability:
  surface: platform
  access: paid_plan
  plans: [starter, enterprise_plus]
```
Renders: "dbt platform \| Starter, Enterprise+"

**Fusion-only, also works on platform-connected projects:**
```yaml
availability:
  surface: local_development
  engine: v2
```
Renders: "Available in v2 \| Local development"

## Gotchas

- Never set both `minPlan` and `plans` — pick one.
- Never write `availability: platform` bare — use the `platform_login`
  preset so the login requirement is documented for future editors, even
  though both render identically.
- A preset name can never collide with a location name (`local`,
  `local_development`, `platform`) — the renderer tells them apart by
  checking if the value matches a known surface first. If you invent a new
  preset name later, don't name it after a surface value.
- Out of scope for this skill: fixing/auditing `availability` blocks that
  already exist on a page. Flag it to the user and stop instead of editing.
- The `.vscode/docs.code-snippets` autocomplete snippet mentioned in the
  Notion doc (from PR #9677) wasn't found in this checkout as of this
  writing — don't assume it's present; check before telling a user to rely
  on it.
