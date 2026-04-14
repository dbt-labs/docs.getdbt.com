# TRIAGE_AGENTS.md — dbt Docs AI Triage System

Agent-facing guide for the docs team's AI triage system. Read this before executing any triage skill.

## System overview

258 open items across 4 channels overwhelm a 5-person docs team. This agent system:
1. **Scores** every issue nightly and sorts it into one of 5 buckets
2. **Triages** new GitHub issues automatically (within ~15 minutes of filing)
3. **Digests** the week's top items into a Monday Slack message per writer
4. **Captures** requests from Slack before they fall through

All config lives in `triage/config.json`. State (last scoring run) is written to `triage/state/`. Always read config before acting.

---

## Data sources

| Source | Identifier | MCP tool |
|--------|-----------|----------|
| Public GitHub | `dbt-labs/docs.getdbt.com` | `mcp__claude_ai_Github_Runlayer__*` |
| Internal GitHub | `dbt-labs/docs-internal` | `mcp__claude_ai_Github_Runlayer__*` |
| Jira | PRODDOCS board | REST API (disabled until token added) |
| Slack | `#ask-product-docs` | `mcp__claude_ai_Slack__*` |

---

## Scoring algorithm

**Score = (priority\_score + age\_bonus + comment\_bonus + size\_modifier) × reporter\_multiplier**

All weights are defined in `triage/config.json → scoring`. Key rules:

- **Priority**: Read GitHub labels first (`critical`, `high`, `medium`, `low`). For Jira, use P1–P4.
- **Reporter type**: Check if the issue filer's GitHub username is in `pm_github_users`. If they're from `dbt-labs` org but not in PM list, treat as `engineering_internal`. Everyone else is `community`.
- **Age**: Calculate days since issue was opened (not last updated — that's for Stale detection).
- **Comment count**: More comments = more community interest. Use total comment count.
- **Size**: Read from GitHub labels (`XS`, `S`, `M`, `L`, `XL`). If missing, estimate from issue length and scope and leave a note.

---

## Bucket assignment (apply in order — first match wins)

1. **Needs Info** — Has label in `trigger_labels` OR the last comment is a question from the docs team with no response > 7 days
2. **Stale** — Last update > 90 days AND score < 8
3. **Quick Wins** — Score ≥ 8 AND size label is XS or S
4. **Active** — Score ≥ 12 AND has an assignee
5. **Watch** — Everything else with score ≥ 5
6. **Stale** (fallback) — Score < 5 (very low priority, catch-all)

The goal is a visible queue of **10–15 items** max per writer at any time.

---

## Product area detection

Scan the issue title and first 300 characters of the body against signal keywords in `triage/config.json → product_area_signals`. If multiple areas match, pick the strongest signal. If none match, use `Reference` as fallback and flag uncertainty with `(inferred)`.

---

## Triage comment format

Post to the **public** GitHub repo (`dbt-labs/docs.getdbt.com`). Never post internal scoring data, writer assignments, or team-internal reasoning in public comments.

```markdown
> [!NOTE]
> 🤖 **AI Triage Suggestion** — Automated analysis. A human reviewer will make the final call on labels and priority.

**TL;DR:** [1–2 sentence plain-English summary of what the reporter is asking for]

| | Suggestion | Reasoning |
|---|---|---|
| **Priority** | HIGH / MEDIUM / LOW | [1 sentence — what drives this score] |
| **Size** | XS / S / M / L / XL | [brief scope explanation] |
| **Product area** | [area] | [why this area] |

_Labels won't be applied automatically. To confirm or adjust, apply labels directly to this issue._
```

Priority mapping for the comment (simplified from internal scores):
- Score ≥ 10 after multipliers → **HIGH**
- Score 5–9 → **MEDIUM**
- Score < 5 → **LOW**

---

## Slack digest format

Post to the `docs_team_digest` channel. Tag each writer with their Slack ID.

```
📋 *Weekly Docs Triage — [Date]*

*<@WRITER_SLACK_ID> — [N] items need attention:*

*[Product Area]*
• <https://github.com/...|Issue #123 — Title> — [one-line context] `HIGH` `M`
• <https://github.com/...|Issue #456 — Title> — [one-line context] `MEDIUM` `S`

*Quick wins this week:* [2–3 items with XS/S size across all product areas]

Need help drafting an outline for any of these? React with ✏️ and I'll generate one.
```

Keep the digest to **3–5 items per writer**. If there are more, surface only the highest-scored items in each of their product areas.

---

## Slack capture rules

When reading `#ask-product-docs`, look for:

1. **Formal intake** — Messages that look like a request (contain words like "can you update", "docs need", "missing page", "wrong info", "broken link"). Extract: what page/feature, what change needed, who's asking.
2. **@mention requests** — Any message that @mentions the docs team or a specific writer with a request embedded.
3. **Already triaged** — Skip messages that already have a ✅ reaction or link to an existing issue.

For each untracked request, either:
- Create a GitHub issue on `dbt-labs/docs.getdbt.com` if it looks like a concrete doc task
- Or post a summary to `#docs-team-digest` for the team to triage manually

Always react to the original Slack message with 👀 to signal it's been captured.

---

## State files

After each scoring run, write to `triage/state/`:

- `scores.json` — full list of scored items with bucket assignment
- `last_run.json` — metadata: timestamp, item counts per bucket, new issues triaged

These files are committed to `docs-internal`. They are **never published** to the public repo.

---

## What NOT to do

- Never post Jira ticket content, internal GitHub issues, or writer assignments to the public `docs.getdbt.com` repo
- Never auto-apply labels — always mark suggestions as suggestions
- Never close or reassign issues autonomously — surface for human review only
- Never include scoring numbers or bucket names in public-facing triage comments
- Don't re-triage issues that already have a `triage-bot` label (check before posting)
