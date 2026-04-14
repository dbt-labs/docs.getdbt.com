---
name: monday-digest
description: Generate and post the Monday morning Slack digest for the docs team. Reads last night's scoring results and sends each writer their top 3–5 items grouped by product area, plus a team-wide quick wins section. Run every Monday at 9am ET via GitHub Actions or manually with /monday-digest.
---

# Monday Morning Slack Digest

Reads `triage/state/scores.json` (from last night's scoring run) and posts a personalized digest to Slack for each writer on the docs team.

## When to Use

- Every Monday at 13:00 UTC (9am ET) via GitHub Actions
- Manually: `/monday-digest` to send the digest right now

## Prerequisites

Read `triage/config.json` and `triage/TRIAGE_AGENTS.md` before starting. Confirm `triage/state/scores.json` exists and was scored within the last 24 hours (check `scored_at` field). If missing or stale, run `/score-issues` first.

## Workflow

### 1. Load scores

Read `triage/state/scores.json`. Extract items with bucket = `active`, `quick_wins`, or `watch`.

### 2. Build per-writer queues

For each writer in `config.team.writers`:
- Filter items whose `product_area` is in the writer's `product_areas` list
- Sort by `score` descending
- Take the top 3–5 items (prefer 3 if all are HIGH, up to 5 if mix of MEDIUM)
- If a writer has no items, note "No high-priority items this week" — still send their section

**Priority mapping for display:**
- Score ≥ 10 → `HIGH`
- Score 5–9 → `MEDIUM`
- Score < 5 → `LOW`

### 3. Identify team-wide quick wins

From bucket = `quick_wins`, take items NOT already in any writer's queue. Limit to 3. These are surfaced in the team section.

### 4. Format the Slack message

Use Slack Block Kit formatting via `mcp__claude_ai_Slack__slack_send_message`. Send to the `docs_team_digest` channel from `config.team.slack_channels`.

```
📋 *Weekly Docs Triage — Monday, April 14*
_258 open items · 8 Active · 12 Quick Wins · 45 Watch · 23 Needs Info · 170 Stale_

━━━━━━━━━━━━━━━━━

<@WRITER1_SLACK_ID> — *3 items this week*

*Core*
• <https://github.com/dbt-labs/docs.getdbt.com/issues/123|#123 — Incremental models missing example for BigQuery> — PM-filed, no assignee `HIGH` `M`
• <https://github.com/dbt-labs/docs.getdbt.com/issues/456|#456 — Snapshot config docs are outdated> — 12 comments, 90+ days old `MEDIUM` `S`

*Developer Experience*
• <https://github.com/dbt-labs/docs.getdbt.com/issues/789|#789 — dbt init docs don't mention --profiles-dir flag> — Quick win candidate `MEDIUM` `XS`

━━━━━━━━━━━━━━━━━

<@WRITER2_SLACK_ID> — *4 items this week*
...

━━━━━━━━━━━━━━━━━

⚡ *Team Quick Wins (any taker)*
• <https://...|#890 — Fix broken anchor link in Mesh docs> `S`
• <https://...|#901 — Add note about Snowflake connection timeout> `XS`

Need help drafting an outline for any of these? React with ✏️ and I'll generate one.
```

### 5. Send the message

Use `mcp__claude_ai_Slack__slack_send_message` with `channel` set to the `docs_team_digest` channel ID.

If the Slack channel ID is not configured (`FILL_IN`), print the formatted digest to the terminal instead and warn: "Slack channel not configured — printed to terminal. Update config.team.slack_channels.docs_team_digest."

### 6. Handle ✏️ reactions (optional interactive mode)

If a writer reacts to a digest item with ✏️ within 1 hour of the digest being sent, and this skill is invoked interactively:
- Read the issue the writer reacted to
- Draft a short outline (H2 headers + bullet points) for the doc change needed
- Post the outline as a Slack thread reply

This is optional — the digest is useful even without the outline feature.

### 7. Log result

Print: `Monday digest sent to #docs-team — 5 writers, 18 items surfaced, 3 quick wins`

## Tone guidance

- Keep each item description to one short clause — context should be clear in 10 words or fewer
- Use `HIGH`/`MEDIUM`/`LOW` not internal scores
- The digest should feel like a helpful colleague, not a ticket system — avoid words like "escalated", "SLA", "violation"
- If a writer's queue is clean, celebrate it: "🎉 Nothing urgent this week!"
