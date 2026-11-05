---
title: "Control cost"
id: 6-control-cost
description: Learn how to put limits on AI spend before a run starts and keep a record of what each run used.
displayText: Control cost
hoverSnippet: Learn how to limit AI spend and track what each run used.
---

Every other transformation in your project is effectively free to re-run. It's just compute on a warehouse you already pay for. AI calls aren't. This page shows how to build limits and a spending record into the pipeline, so a routine `dbt run` never turns into a surprise invoice.

In this section, you'll learn how to:

- Stop oversized runs before they start
- Cap the part of the bill the model controls
- Keep a safe, append-only record of what each run used

Stuck on a term? Check the [glossary](/best-practices/how-we-context-engineer/1-guide-overview#glossary).

## Why does AI cost need its own controls?

Analytics engineers carry a good instinct: "just run it again." AI breaks it for two reasons:

- **Each row costs money.** Cost grows with your data volume.
- **Part of the cost is the model's decision, not yours.** You're billed per **token**, the sub-word piece a model reads and writes, roughly four characters of English. You pay for what you send (input tokens) and what comes back (output tokens). The model decides how many output tokens to spend, and it can spend hundreds "thinking" before a one-word answer.

Here's what that looks like in practice. In our own testing, one generation run over 10 one-sentence rows on BigQuery produced 65,825 output tokens, about 6,600 per row. Nearly all of it was the model's default "thinking," which is billed as output. The inputs were tiny. The cost wasn't.

<!-- MEME: "it's just ten one-sentence rows" next to the invoice -->

So we treat cost as a first-class output of the pipeline, not an afterthought. A report the next morning tells you what you already spent, and it can't prevent anything. The control has to fire before the tokens are spent.

## Use a circuit breaker and a meter

We use two tools you'd want around any expensive, hard-to-undo operation:

| Tool | What it does | When it runs |
|------|--------------|--------------|
| Guard | Counts the rows and the estimated tokens for the whole call, and raises an error if either is over your ceiling | Before the model runs, as a pre-hook (SQL dbt runs before a model builds) |
| Run log | Records what the run actually used | After the run, as an append to a log table |

### Guard every AI call

Our recommendations:

- **Ship the guard with the first AI call.** If the guard is optional or arrives later, there's always an ungoverned call somewhere. "We'll add it later" is how unguarded AI reaches production.
- **Estimate the whole call, not just the text.** A row sent to a generative function (generate, classify, or extract) is billed for its text plus the prompt template and schema, plus the model's reply. On one Snowflake extraction workload, billed input plus output tokens were about 6.4 times an input-text-only estimate. For those functions, the guard estimates input text, prompt template, schema, and an output allowance for every row. Embedding calls send only the text, so they count the text alone.
- **Name the prompt once.** Set `meta.ai_prompt` (a prompt name and version) in the model's config. The AI function in the model body and both hooks read it, so a version bump can't leave a hook undercounting. Here's the shape:

```sql
{{ config(
    meta={'ai_prompt': {'name': 'jaffle_content_type', 'version': 'v1'}},
    pre_hook="{{ dbt_context_engineering.guard_batch(ref('call_transcripts_hashed'), 'chunk_text') }}"
) }}

select
    chunk_id,
    {{ dbt_context_engineering.classify(
        'chunk_text',
        prompt=dbt_context_engineering.config_prompt(),
        output_schema=dbt_context_engineering.config_schema()
    ) }} as content_type
from {{ ref('call_transcripts_hashed') }}
```

- **Set ceilings in configuration.** A deliberate large batch should be a one-line override, which makes the guard a safety net and not an obstacle.
- **On incremental models, guard only the new rows.** Pass the same filter the model uses, so the guard counts the delta, not the whole table.
- **Test the trip path.** Confirm in CI that an oversized batch actually raises, not just that a normal one passes.

### Cap the output, too

The guard can only _estimate_ the reply, because the model decides how long it is. Input cost and output cost are different variables, and each needs its own lever:

- **Set a maximum output size** for every call, across all engines. The guard uses it as the output allowance, so a lower cap also makes the estimate tighter.
- **Turn off default "thinking" where you can.** On BigQuery with Gemini models, setting the thinking budget to `0` disables it. That default caused the 65,825-token run above.

### Keep a run log

Record each run's function, model, row count, estimated tokens, estimated cost, timestamp, and invocation id in an append-only table. Spend becomes observable and comparable run to run.

- **Record the dbt node, too.** One invocation can run several models that call the same function with the same model. The log's `node_id` is the node's unique id, so you can tell their rows apart and join the log to warehouse query history, where dbt query comments carry the same id.
- **Keep the log in the current target.** When a CI job [defers](/reference/node-selection/defer) to production (reads production's models instead of rebuilding them), the run log should still be written in the environment doing the work, never in production's table.
- **Treat the log as observability, not an invoice.** It's built from estimates. Reconciling it against each engine's billing tables is separate work, and it's yours to add.

The jaffle project shows the gates, the guard, and the event-sourced run log on its embedding models.

## Make spend an opt-in

### Turn AI functions off by default

A plain `dbt build` in a fresh environment, or a CI job that never meant to call a model, shouldn't be able to bill you. Add a setting that's `false` by default and raises an error unless you've set it to `true` for the target.

Our recommendations:

- **Put the check inside the AI function, not in a value you pass.** A wrapper around a config value only protects people who remember to use it, and skipping it is the easy path. If calling the function triggers the check, there's nothing to forget.
- **Enable it per target.** Turn it on for production and leave it off elsewhere.

### Gate full refreshes

A bare `--full-refresh` shouldn't be able to silently re-embed and re-bill your whole corpus. Require an explicit opt-in on the model itself, so a rebuild is a deliberate choice.

### Don't use views for AI models

A view re-runs its query every time someone reads it. Materialize AI models as tables or incremental models, so the model call happens once per build and not once per read.

### Sample while you iterate

When you're developing, cap each model to a small random sample of rows, so nothing runs against the full corpus by accident. Switch the sample off when you're ready for the real run.

## Keep the run log safe under concurrency

This section is advanced. Skim it now and come back when you see run log failures.

dbt runs independent models on different threads, with no coordination between their hooks. Every AI model writes to the same log table, so unsafe writes can turn your audit mechanism into a source of build failures. We found two separate causes:

| Problem | What went wrong | Fix |
|---------|-----------------|-----|
| Redundant creation | Every model's hook tried to create the log table the first time it ran, so ten models selected together made ten concurrent attempts at the same statement | Create the table once, in an `on-run-start` hook. Those hooks run serially, before any model starts. |
| Updates colliding | Marking a run as complete with an `update` conflicted with other concurrent writes to the same table | Never update. Append a new `completed` row instead. |

The second fix is **event sourcing**. Instead of flipping a field on an existing row, you append a second row. Whether a run finished becomes an existence check: is there a `completed` row for this run? Two inserts into one table don't touch the same row, so they can't conflict.

To see the effect, we ran eight independent models on eight threads. With an update, 7 of 8 failed on Databricks and 1 of 8 failed on BigQuery. With only inserts, all 8 succeeded on both.

## Adapter notes

| Topic | Snowflake | Databricks | BigQuery |
|-------|-----------|------------|----------|
| Turning off default thinking | Not applicable | Not applicable | Set the thinking budget to `0` (Gemini models) |
| Concurrent writes to the run log | Use append-only writes | Updates conflict with concurrent writes | Updates hit a table-update rate limit |
| Group-level ceiling for aggregation | Handled by the engine | You set a token ceiling | Handled by the engine |
| Extra requirements | None | A recent runtime (DBR 15.4 LTS or above, not Databricks SQL Classic) | A connection is optional |

- **Use an append-only log on every engine.** Concurrency failures show up differently per engine, with a transaction conflict on Databricks and a rate-limit error on BigQuery, but the fix is the same.
- **Don't pay for an index you forgot.** A managed vector index is billed separately and charges even when idle. Create it as a deliberate operation, and drop it when you're done. See [Embed and retrieve](/best-practices/how-we-context-engineer/3-embed-and-retrieve).
