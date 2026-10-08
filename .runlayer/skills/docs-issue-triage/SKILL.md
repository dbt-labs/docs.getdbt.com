---
name: docs-issue-triage
description: |
  Use this skill to triage, score, and label GitHub issues in the docs.getdbt.com repo. Triggers when the user asks to triage issues, rank issues by priority or size, label GitHub issues, review the issue backlog, or score open docs issues. Also use this skill when the user says things like "what should we work on next", "rank our issues", "apply priority labels", "apply size labels", or "what are our highest priority issues". Always use this skill for any request involving prioritizing or sizing docs GitHub issues.
---

# Docs Issue Triage Skill

This skill reads open GitHub issues in `dbt-labs/docs.getdbt.com`, scores them by priority and size using the definitions below, presents a ranked list to the user, and — with their confirmation — applies the appropriate labels directly to GitHub.

---

## Step 1: Fetch open issues

Use the `list_issues` tool to fetch open issues from `dbt-labs/docs.getdbt.com`. Fetch up to 100 at a time. For each issue, collect:
- Issue number and title
- Body / description
- Existing labels
- Comment count
- Created date
- Updated date

Skip issues that already have both a `priority:` label AND a `size:` label — they've already been triaged.

---

## Step 2: Score each issue

For each issue, assign one **priority label** and one **size label** based on the definitions below. Use the issue title, body, and any existing labels as signal. When in doubt, lean toward the more conservative (lower priority / smaller size) label and flag it for human review.

### Priority Labels

| Label | When to apply |
|---|---|
| `priority: high` | Technical inaccuracy, missing or incorrect information, or broken links that negatively affect user workflows |
| `priority: medium` | Fix or enhancement to existing information that is generating customer requests or confusion |
| `priority: low` | Improvements that don't block workflows — grammar fixes, nice-to-haves, minor clarity improvements |

**Priority signal heuristics:**
- High comment count or many reactions → likely medium or high
- Words like "wrong", "broken", "404", "incorrect", "missing" in title/body → likely high
- Words like "typo", "grammar", "style", "suggestion" → likely low
- Customer-facing language or mentions of support tickets → likely medium or high

### Size Labels

| Label | When to apply |
|---|---|
| `size: x-small` | Under 3 hours to fix (e.g. fix a typo, update a single code snippet, fix a broken link) |
| `size: small` | 1–2 days to address |
| `size: medium` | Up to a week to address |
| `size: large` | More than a week; may require more than one writer |
| `size: x-large` | 1+ weeks of research for 1+ writers — e.g. information architecture projects, major restructuring |

**Size signal heuristics:**
- Single broken link or typo → x-small
- One page needs updating → small
- Multiple related pages or a new section needed → medium
- New feature docs from scratch → large
- IA changes, navigation restructuring, multi-page rewrites → x-large

---

## Step 3: Present ranked results

Present the triaged issues as a ranked table, sorted by priority (high → medium → low), then by age (oldest first within each priority tier).

Format:
```
## Triage Results — [date]

### 🔴 Priority: High
| # | Title | Suggested Size | Confidence | Notes |
|---|---|---|---|---|
| #123 | Broken link in quickstart | x-small | High | 404 detected in title |
...

### 🟡 Priority: Medium
...

### 🟢 Priority: Low
...
```

Include a **Confidence** column (High / Medium / Low) to flag issues where the scoring is uncertain and human review is recommended before applying labels.

At the end of the table, ask:
> "Would you like me to apply these labels to GitHub? I can apply all of them, only the high-confidence ones, or you can tell me which specific issues to label."

---

## Step 4: Apply labels (with confirmation only)

Never apply labels without explicit user confirmation. Once confirmed:

1. For each confirmed issue, use `issue_write` with `method: update` to apply the priority and size labels.
2. Only apply the two triage labels — do not remove or change any existing labels.
3. Report back with a summary of what was applied and flag any failures.

**Label names must exactly match:**
- `priority: high`, `priority: medium`, `priority: low`
- `size: x-small`, `size: small`, `size: medium`, `size: large`, `size: x-large`

If a label doesn't exist in the repo yet, note it to the user — do not create labels automatically.

---

## Edge cases

- **Already partially labeled** (has priority but not size, or vice versa): Score the missing dimension only and flag it.
- **Ambiguous issues**: If the issue is too vague to score confidently, assign a Low confidence rating and suggest the user review before applying.
- **Large batch**: If there are more than 50 un-triaged issues, offer to triage in batches by priority tier or by date range.
