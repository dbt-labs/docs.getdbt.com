---
name: oncall-weekly-summary
description: |
  Use this skill to generate an end-of-week on-call summary for the dbt Labs docs team. Triggers when the on-call writer asks for a weekly summary, wrap-up, or on-call report. Also triggers for phrases like "generate my on-call summary", "what did I do this week on-call", "end of week report", or "on-call wrap". Always use this skill when someone asks for a summary of docs issues worked on during their on-call week.
---

# On-Call Weekly Summary Skill

This skill pulls issue activity from the past week across GitHub (docs.getdbt.com and docs-internal) and Jira (PRODDOCS), and drafts a ready-to-post Slack summary for the on-call writer. The writer reviews it, adds any qualitative notes, and posts it to the docs team Slack channel.

---

## Step 1: Establish the week's date range

Determine the Monday–Friday date range for the current on-call week. Use today's date to calculate:
- `week_start` = most recent Monday (ISO 8601 format, e.g. `2026-04-13T00:00:00Z`)
- `week_end` = today or most recent Friday, whichever is earlier

If the user specifies a different week, use their dates instead.

---

## Step 2: Pull GitHub data

Query both repos using the `list_issues` tool with `since: week_start`.

### Repos to query:
- `owner: dbt-labs`, `repo: docs.getdbt.com`
- `owner: dbt-labs`, `repo: docs-internal`

### For each repo, fetch:
1. **Issues closed this week** — `state: CLOSED`, `since: week_start`
2. **Issues opened this week** — `state: OPEN`, `since: week_start`, `orderBy: CREATED_AT`
3. **Issues labeled "docs project" this week** — `labels: ["docs project"]`, `since: week_start`

For each result set, count the issues and note any that stand out (high comment count, priority labels, or notable titles).

---

## Step 3: Pull Jira data

Use `searchJiraIssuesUsingJql` with `cloudId: 907c0bf2-3f9d-44ec-b8b1-077f38550991` (dbtlabs.atlassian.net).

### Queries to run:

**Issues closed/resolved this week:**
```
project = PRODDOCS AND status changed to (Done, Resolved, Closed) AFTER "{week_start_date}"
```

**Issues created this week:**
```
project = PRODDOCS AND created >= "{week_start_date}"
```

**High priority issues updated this week:**
```
project = PRODDOCS AND priority in (High, Highest) AND updated >= "{week_start_date}"
```

Use `responseContentFormat: markdown` and `fields: ["summary", "status", "priority", "assignee", "created", "resolutiondate"]`.

For date placeholders, format as `YYYY-MM-DD` (e.g. `2026-04-13`).

---

## Step 4: Compile the numbers

Aggregate across all sources into these categories:

| Metric | Source |
|---|---|
| Issues triaged (labeled/prioritized, not resolved) | GitHub + Jira |
| Issues closed or resolved | GitHub (closed) + Jira (resolved) |
| Issues converted to Docs Projects | GitHub issues labeled "docs project" + Jira issues marked as epics/projects |
| New issues opened this week | GitHub + Jira created |
| High priority issues touched | Jira high/highest priority updated this week |

---

## Step 5: Draft the Slack summary

Format the summary exactly like this, ready to copy-paste into Slack:

```
📋 On-call wrap — week of [Monday date]

*Issues triaged:* X
*Issues closed/resolved:* X (GitHub: X | Jira: X)
*Docs Projects created:* X
*New issues opened this week:* X

*Notable this week:*
- [List 2-3 specific issues or themes worth calling out — highest priority closed, interesting patterns, anything that needs follow-up]

*Needs team attention:*
- [Anything flagged that requires a decision, input from another team, or follow-up next week — leave blank if nothing]

*[Add your own qualitative notes here before posting]*
```

For the "Notable this week" section, pick the 2-3 most significant items from your data — highest priority issues closed, any surprising volume trends, or issues that were converted to Docs Projects.

Leave a clear placeholder for the writer to add qualitative context before posting.

---

## Step 6: Present to the writer

After generating the draft:
1. Show the raw numbers clearly so the writer can verify them
2. Present the formatted Slack draft
3. Remind the writer to:
   - Fill in the "Notable this week" and "Needs team attention" sections with their own judgment
   - Add any qualitative context the numbers don't capture
   - Post in the docs team Slack channel

---

## Edge cases

- **Partial week**: If it's only Wednesday, note that the summary covers Monday–today and will be incomplete.
- **No activity found**: If a query returns zero results, say so explicitly rather than omitting the row — `Issues closed/resolved: 0` is meaningful data.
- **API errors**: If a GitHub or Jira query fails, note which source is missing and generate the summary with available data, flagging the gap.
- **docs-internal access**: If the writer doesn't have access to docs-internal, skip that repo and note it in the summary.
