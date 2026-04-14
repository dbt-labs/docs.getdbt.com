---
name: triage-new-issue
description: Automatically triage a new GitHub issue on docs.getdbt.com. Posts a structured AI triage comment (TLDR, priority suggestion, size estimate, product area). Always flags as a suggestion — never applies labels. Triggered by polling (every 15 min) or manually with an issue number.
---

# Auto-Triage New GitHub Issue

Posts a triage comment on a newly filed issue in `dbt-labs/docs.getdbt.com`.

## When to Use

- Automatically, every 15 minutes via GitHub Actions (checks for issues opened in the last 20 minutes without a `triage-bot` label)
- Manually: `/triage-new-issue 1234` to triage issue #1234

## Prerequisites

Read `triage/config.json` and `triage/TRIAGE_AGENTS.md` before starting.

## Workflow

### 1. Identify issues to triage

**If invoked with an issue number** (e.g., `/triage-new-issue 1234`):
- Use `mcp__claude_ai_Github_Runlayer__issue_read` to fetch issue #1234 from `dbt-labs/docs.getdbt.com`
- Proceed to step 2

**If invoked automatically (no argument)**:
- Use `mcp__claude_ai_Github_Runlayer__list_issues` on `dbt-labs/docs.getdbt.com` with:
  - State: `open`
  - Sort: `created`, direction: `desc`
  - Limit: 20 (most recent issues)
- Filter to issues created within the last 20 minutes
- Filter out any issue that already has the `triage-bot` label
- If no issues remain after filtering, exit cleanly: "No new issues to triage."

### 2. Read the issue

For each issue to triage, use `mcp__claude_ai_Github_Runlayer__issue_read` to get the full body (not truncated).

### 3. Determine reporter type

Check if `issue.user.login` is in `config.pm_github_users`:
- If yes → `pm` (2.0× multiplier)
- If the user is a member of `dbt-labs` org but not in PM list → `engineering_internal` (1.5×)
- Otherwise → `community` (1.0×)

### 4. Detect product area

Scan the issue title and body against `config.product_area_signals`. Pick the area with the most keyword matches. If tied or none, default to `Reference (inferred)`.

### 5. Estimate priority

Score the issue using the algorithm (priority label, reporter type, age, size label if present). Map to a comment-facing priority:
- Score ≥ 10 → **HIGH**
- Score 5–9 → **MEDIUM**
- Score < 5 → **LOW**

### 6. Estimate size

If a size label exists (`XS`, `S`, `M`, `L`, `XL`), use it directly.

If no size label, estimate from issue content:
- **XS** — Typo, broken link, single sentence change
- **S** — Single page update, add a note or example (~1–2 hours)
- **M** — Meaningful rewrite of a section or new partial (~half day)
- **L** — New page or major restructure (~1–2 days)
- **XL** — Multi-page effort, new guide or feature area (>2 days)

Always add `(estimated)` suffix when inferring size without a label.

### 7. Post triage comment

Use `mcp__claude_ai_Github_Runlayer__add_issue_comment` on `dbt-labs/docs.getdbt.com` with the comment from `triage/TRIAGE_AGENTS.md → Triage comment format`.

Example:
```markdown
> [!NOTE]
> 🤖 **AI Triage Suggestion** — Automated analysis. A human reviewer will make the final call on labels and priority.

**TL;DR:** The reporter is asking for documentation on how to configure dbt Semantic Layer with Redshift. Currently no Redshift-specific guidance exists in the Semantic Layer section.

| | Suggestion | Reasoning |
|---|---|---|
| **Priority** | MEDIUM | Community-filed; Semantic Layer + adapter gap is a common pain point based on comment patterns |
| **Size** | M (estimated) | Likely requires a new subsection in the existing Semantic Layer page plus a code example |
| **Product area** | Semantic Layer | Keywords: "semantic layer", "MetricFlow", "Redshift" in body |

_Labels won't be applied automatically. To confirm or adjust, apply labels directly to this issue._
```

### 8. Apply triage-bot label

After posting the comment, add the `triage-bot` label to the issue using `mcp__claude_ai_Github_Runlayer__label_write`. This prevents re-triaging on the next poll cycle.

If the label doesn't exist in the repo yet, create it: color `#e4e669`, description `Automatically triaged by AI triage bot`.

### 9. Log result

Print: `Triaged issue #1234 (dbt-labs/docs.getdbt.com) — MEDIUM priority, M size, Semantic Layer`

## What NOT to include in the comment

- Internal scores or bucket names
- Writer assignments or team-internal notes
- Any content from Jira or internal GitHub issues
- Any language that sounds definitive ("this IS a P2") — always use "suggested" framing
