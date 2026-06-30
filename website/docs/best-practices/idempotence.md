---
title: "Idempotence in dbt"
id: "idempotence"
description: "Learn about best practices for configuring your dbt project to ensure idempotent results."
---

<Term id="idempotent">Idempotence</Term> is a foundational goal for every dbt project. It means your transformations should be safe to re-run and always produce the same result, regardless of how many times they've run before.

:::info Why this matters early
If you're new to dbt, idempotence is worth understanding before you build incremental models. It's easy to accidentally write logic that works fine the first time but breaks on re-runs.
:::

## What idempotence means in dbt

A dbt model is idempotent if it produces the same results whether you run it once or a hundred times. The final state of the data should be identical regardless of how many times you've run the model.

This is because each model is a pure function of your code and the current state of your database, not of how many times it's run before. Given the same inputs, it always produces the same output.

This makes dbt transformations:

- Safe to retry if a run fails partway through, re-running it won't corrupt your data.
- Easy to backfill so you can re-run historical data without worrying about double-counting or drift.
- Predictable in CI so the same code always produces the same data, which makes testing reliable.

## Materializations and idempotence
 
Most dbt materializations are idempotent by default:

<SimpleTable>

| Materialization | How it achieves idempotence |
|---|---|
| `table` | Rebuilds the table from scratch on every run (`create or replace`) |
| `view` | Replaces the view definition on every run |
| `incremental` | Requires deliberate configuration.  |
| `materialized_view` | Creates or replaces the materialized view definition on each run; the warehouse manages data refresh |

</SimpleTable>

## Idempotence and incremental models

Incremental models only process new or changed rows, which means they depend on the existing state of the target table. If you're not careful, re-running an incremental model can produce duplicate rows or inconsistent results.

The most common pitfall is appending rows without deduplication or a reliable unique key. Compare these side by side:

<div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '24px'}}>

<div>

**Non-idempotent incremental model:**

This example filters incrementally but doesn't define a `unique_key`, so rows at the boundary can be appended again on each subsequent run, which might result in duplicate rows.

```sql
-- ❌ Not idempotent: re-runs can duplicate rows 
{{ config(materialized='incremental') }}

select * from {{ source('events', 'raw_events') }}

{% if is_incremental() %}
  where event_at >= (select max(event_at) from {{ this }})
{% endif %}
```

</div>

<div>

**Idempotent incremental model:**

This example adds a `unique_key`, so matching rows are updated or replaced instead of appended as duplicates.

```sql
-- ✅ Idempotent when event_id is unique
{{ config(
  materialized='incremental',
  unique_key='event_id'
) }}

select * from {{ source('events', 'raw_events') }}

{% if is_incremental() %}
  where event_at >= (select max(event_at) from {{ this }})
{% endif %}
```

</div>

</div>

With `unique_key` set, dbt updates existing rows and inserts new rows instead of appending duplicates. Depending on your adapter and [incremental strategy](/docs/build/incremental-strategy), dbt does this with `merge` or `delete+insert`.

You can also use [microbatch incremental models](/docs/build/incremental-microbatch) for large time-series datasets. Microbatch models process data in batches based on an `event_time` column, and can be more resilient for very large incremental workloads.


### Common risks

<SimpleTable>

| Risk | Why it breaks idempotence | Fix |
|---|---|---|
| Using `current_timestamp()` in a model | Produces different values on every run | Use a column from the source data as the timestamp |
| Appending without a `unique_key` | Without a `unique_key`, most adapters/strategies append rows and can duplicate on re-runs.| Add `unique_key` to your incremental config |
| Generating surrogate keys with random values | Different runs produce different keys for the same row | Use deterministic hashing (for example, `dbt_utils.generate_surrogate_key`) |
| Hardcoding "today's date" in logic | Results change based on when the model runs, not the data | Filter on source timestamps |

</SimpleTable>

## Full-refresh as a safety net

When an incremental model gets into a bad state (for example, due to a schema change or logic bug), you can always run `dbt run --full-refresh` to drop and rebuild the table from scratch. This is the escape hatch that makes incremental models recoverable.

Think of `--full-refresh` as proof that your underlying logic is still idempotent. Even if the incremental path is optimized, the full result should always be reproducible.

## Related docs

These docs cover the dbt features most affected by idempotence:

- [State selection and stateless runs](/reference/node-selection/state-selection)
- [Incremental models](/docs/build/incremental-models)
- [Microbatch incremental models](/docs/build/incremental-microbatch)
