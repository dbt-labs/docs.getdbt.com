---
title: "Idempotence in dbt"
id: "idempotence"
description: "Idempotence is a foundational expectation in dbt: your transformations should be safe to re-run and always produce consistent results."
---

<Term id="idempotent">Idempotence</Term> is a foundational expectation in dbt. It means your transformations should be safe to re-run and always produce the same result, regardless of how many times they've run before.

:::info Why this matters early
If you're new to dbt, idempotence is worth understanding before you build incremental models. It's easy to accidentally write logic that works fine the first time but breaks on re-runs.
:::

## What idempotence means in dbt

A dbt model is idempotent if running it once and running it ten times in a row produces the same output. The final state of the data should be identical no matter how many times you've executed the model.

dbt is designed around this expectation. A dbt run doesn't need to "know" about previous runs — it just looks at the code and the current state of your database and produces the correct result.

This makes dbt-managed transformations:

- **Safe to retry** — if a run fails partway through, re-running it won't corrupt your data.
- **Easy to backfill** — you can re-run historical data without worrying about double-counting or drift.
- **Predictable in CI** — the same code always produces the same data, which makes testing reliable.

## How dbt's materializations support idempotence

Most dbt materializations are idempotent by default:

| Materialization | How it achieves idempotence |
|---|---|
| `table` | Drops and recreates the table on every run |
| `view` | Replaces the view definition on every run |
| `incremental` | Requires deliberate configuration — see below |
| `snapshot` | Uses `updated_at` or row hash to detect changes without duplicating rows |

Tables and views are straightforward — dbt always produces a fresh result from scratch. Incremental models are where idempotence requires more care.

## Idempotence and incremental models

Incremental models only process new or changed rows, which means they're inherently stateful. If you're not careful, re-running an incremental model can produce duplicate rows or inconsistent results.

The most common pitfall is appending rows without any deduplication logic:

```sql
-- ⚠️ Not idempotent — re-runs will duplicate rows
{{ config(materialized='incremental') }}

select * from {{ source('events', 'raw_events') }}
{% if is_incremental() %}
  where event_at > (select max(event_at) from {{ this }})
{% endif %}
```

If this model runs twice in a row with overlapping data, you'll get duplicate rows.

### Make incremental models idempotent

Use a `unique_key` with your incremental model to make it idempotent. dbt will use this key to perform an upsert (merge) instead of an append:

```sql
-- ✅ Idempotent — re-runs upsert instead of appending
{{ config(
  materialized='incremental',
  unique_key='event_id'
) }}

select * from {{ source('events', 'raw_events') }}
{% if is_incremental() %}
  where event_at > (select max(event_at) from {{ this }})
{% endif %}
```

With `unique_key` set, dbt will update existing rows and insert new ones — running it twice produces the same result.

You can also use [microbatch incremental models](/docs/build/incremental-microbatch), which treat each time period as an atomic, replaceable unit. Microbatch models are idempotent by design.

### Other common pitfalls

| Pitfall | Why it breaks idempotence | Fix |
|---|---|---|
| Using `current_timestamp()` in a model | Produces different values on every run | Use a column from the source data as the timestamp |
| Appending without a `unique_key` | Re-runs create duplicate rows | Add `unique_key` to your incremental config |
| Generating surrogate keys with random values | Different runs produce different keys for the same row | Use deterministic hashing (for example, `dbt_utils.generate_surrogate_key`) |
| Hardcoding "today's date" in logic | Results change based on when the model runs, not the data | Filter on source timestamps instead |

## Full-refresh as a safety net

When an incremental model gets into a bad state (for example, due to a schema change or logic bug), you can always run `dbt run --full-refresh` to drop and rebuild the table from scratch. This is the escape hatch that makes incremental models recoverable.

Think of full-refresh as proof that your underlying logic is still idempotent — even if the incremental path is optimized, the full result should always be reproducible.

## Further reading

- [State selection and stateless runs](/reference/node-selection/state-selection)
- [Incremental models](/docs/build/incremental-models)
- [Microbatch incremental models](/docs/build/incremental-microbatch)
- [dbt retry](/reference/commands/retry)
