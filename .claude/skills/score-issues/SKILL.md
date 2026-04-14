---
name: score-issues
description: Nightly scoring of all open docs issues from GitHub (public + internal). Scores each item, assigns to a bucket (Active/Watch/Quick Wins/Needs Info/Stale), and writes results to triage/state/. Run automatically each night or invoke manually to refresh the queue.
---

# Nightly Issue Scoring

Scores every open issue across all configured sources and writes the results to `triage/state/scores.json`.

## When to Use

- Nightly via GitHub Actions cron (automated)
- Manually when the team wants a fresh queue snapshot: `/score-issues`

## Prerequisites

Read `triage/config.json` and `triage/TRIAGE_AGENTS.md` before starting.

## Workflow

### 1. Fetch open issues — public GitHub

Use `mcp__claude_ai_Github_Runlayer__list_issues` for `dbt-labs/docs.getdbt.com`:
- State: `open`
- Fetch all pages (paginate until no more results)
- For each issue, read: number, title, body (first 500 chars), labels, assignee, created_at, updated_at, comments count, user (reporter)

### 2. Fetch open issues — internal GitHub

Repeat for `dbt-labs/docs-internal` using the same tool and fields.

### 3. Fetch Jira tickets (skip if `jira_enabled: false`)

If enabled, call the Jira REST API:
```
GET {jira_base_url}/rest/api/3/search?jql=project=PRODDOCS+AND+status!=Done&fields=summary,description,priority,labels,assignee,created,updated,comment,reporter
```
Use `JIRA_API_TOKEN` env var (Basic auth: email:token base64 encoded).

### 4. Score each item

Apply the algorithm from `triage/TRIAGE_AGENTS.md → Scoring algorithm`. For each item:

```json
{
  "id": "gh-public-123",
  "source": "github_public",
  "number": 123,
  "title": "...",
  "url": "https://github.com/dbt-labs/docs.getdbt.com/issues/123",
  "priority_label": "high",
  "reporter": "username",
  "reporter_type": "community",
  "age_days": 14,
  "comment_count": 3,
  "size_label": "M",
  "score": 8.5,
  "bucket": "watch",
  "product_area": "Core",
  "assignee": null,
  "last_updated": "2026-04-10T00:00:00Z",
  "scored_at": "2026-04-14T13:00:00Z"
}
```

### 5. Assign buckets

Apply bucket rules from `triage/TRIAGE_AGENTS.md → Bucket assignment` (first match wins).

### 6. Write state files

Write `triage/state/scores.json`:
```json
{
  "scored_at": "<ISO timestamp>",
  "total_items": 258,
  "buckets": {
    "active": 8,
    "quick_wins": 12,
    "watch": 45,
    "needs_info": 23,
    "stale": 170
  },
  "items": [ ...all scored items... ]
}
```

Write `triage/state/last_run.json`:
```json
{
  "scored_at": "<ISO timestamp>",
  "sources": {
    "github_public": { "fetched": 150, "errors": 0 },
    "github_internal": { "fetched": 15, "errors": 0 },
    "jira": { "fetched": 0, "skipped": true, "reason": "jira_enabled: false" }
  },
  "bucket_counts": { "active": 8, "quick_wins": 12, "watch": 45, "needs_info": 23, "stale": 170 },
  "score_changes": []
}
```

### 7. Report summary

Print a brief summary:
```
Scoring complete — 2026-04-14 13:00 UTC
  Sources: 150 public GH + 15 internal GH + 0 Jira = 165 total
  Buckets: 8 Active · 12 Quick Wins · 45 Watch · 23 Needs Info · 170 Stale
  Notable: 3 items moved to Quick Wins (new S-label issues with score ≥ 8)
```

## Error handling

- If a source is unreachable, log the error in `last_run.json` and continue with remaining sources
- If an issue is missing expected fields (no labels, no body), score it with defaults and note it
- Do not fail the entire run because one source had a pagination error
