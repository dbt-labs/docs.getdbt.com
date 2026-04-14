---
name: slack-capture
description: Scan #ask-product-docs for doc requests that haven't been captured yet. Handles both formal intake messages and scattered @mention requests. Creates GitHub issues for concrete tasks, posts summaries for ambiguous ones, and reacts to each captured message to signal it's been tracked. Run every few hours via GitHub Actions or manually with /slack-capture.
---

# Slack Request Capture

Monitors `#ask-product-docs` for untracked documentation requests and either creates GitHub issues or flags them for the team.

## When to Use

- Every 4 hours via GitHub Actions (or on a schedule the team configures)
- Manually: `/slack-capture` to process unread requests right now

## Prerequisites

Read `triage/config.json` and `triage/TRIAGE_AGENTS.md` before starting. You need the `ask_product_docs` channel ID from `config.team.slack_channels`.

## Workflow

### 1. Read the channel

Use `mcp__claude_ai_Slack__slack_read_channel` on the `ask_product_docs` channel. Read the last 50 messages (or since `last_run.json` timestamp if available).

For each message, also fetch its thread replies with `mcp__claude_ai_Slack__slack_read_thread` if `reply_count > 0`.

### 2. Filter — skip already-handled messages

Skip a message if any of the following are true:
- It has a ✅ emoji reaction
- It has a 👀 emoji reaction (already captured by this bot in a prior run)
- It's from a bot/integration (check `subtype: "bot_message"` or `bot_id` field)
- It's a system message (channel join, topic change, etc.)
- The thread contains a reply linking to an existing GitHub issue
- The message is >7 days old (stale, team has had time to handle manually)

### 3. Classify each message

For each remaining message, classify it as one of:

**A — Concrete request**: The message clearly describes a specific doc change needed.
- Signals: "can you update", "this page is wrong", "missing documentation for", "broken link", "add an example", "the docs say X but it should be Y"
- Action: Create a GitHub issue

**B — Vague request / question**: The message is asking a question or the scope is unclear.
- Signals: "where are the docs for", "is there a page about", "does dbt support", "not sure if this is the right place"
- Action: Post a summary to the team channel for manual triage

**C — @mention request**: A message that tags the docs team or a specific writer with a request.
- Signals: Includes `@docs-team` or a writer's Slack ID, plus a request
- Action: Treat as A or B based on specificity

**D — Not a request**: General discussion, praise, announcement, off-topic.
- Action: Skip (no reaction, no action)

### 4A. Create GitHub issue (for Class A and C-specific)

Use `mcp__claude_ai_Github_Runlayer__issue_write` on `dbt-labs/docs.getdbt.com`:

```markdown
Title: [Concise description of what's needed, ~60 chars]

Body:
## Request from Slack
Captured from #ask-product-docs by the docs triage bot.

**Requested by:** @slack_username
**Date:** YYYY-MM-DD
**Original message:** [paste first 300 chars of message]
**Thread context:** [1–2 sentence summary of relevant thread replies, if any]

## What's needed
[AI-written clear description of the doc change requested]

## Notes
- Source: Slack #ask-product-docs
- Auto-captured — please verify the scope before starting work
```

Apply labels: `from-slack`, plus a product area label if detectable.

After creating the issue, reply in the Slack thread: `Thanks! I've logged this as <https://github.com/...|#1234>. A docs team member will review it during triage.`

### 4B. Post summary for vague requests (Class B)

Use `mcp__claude_ai_Slack__slack_send_message` to post in the `docs_team_digest` channel:

```
👀 Untracked request in #ask-product-docs — needs human triage

From: @username | 2026-04-14
> [First 200 chars of their message]

This looks like it might be about [product area], but the scope is unclear. Recommend someone reply to clarify before creating an issue.

<https://slack.com/archives/CHANNEL/p....|View thread>
```

### 5. React to processed messages

For every message you handled (created an issue or posted a summary), react with 👀 using `mcp__claude_ai_Slack__slack_send_message` (or the appropriate reaction tool if available).

This prevents double-processing on the next run.

### 6. Log result

Print:
```
Slack capture complete — 2026-04-14 15:00 UTC
  Scanned: 50 messages in #ask-product-docs
  Skipped (already handled): 38
  Created GitHub issues: 4
  Flagged for manual triage: 2
  Skipped (not a request): 6
```

Update `triage/state/last_run.json` with `slack_capture_at` timestamp.

## Tone for Slack replies

- Be brief and friendly, not robotic
- Never say "A bot has processed your request" — say "Thanks! I've logged this as..."
- If the request is vague, don't shame the requester — just ask the team to follow up
- Don't promise timelines ("we'll fix this within X days")
