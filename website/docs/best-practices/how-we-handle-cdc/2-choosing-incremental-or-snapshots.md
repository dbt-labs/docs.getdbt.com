---
title: "Choosing incremental models or snapshots"
id: "2-choosing-incremental-or-snapshots"
description: "Choose incremental models, snapshots, or both for change data capture in dbt."
sidebar_label: "Incremental vs snapshots"
hoverSnippet: "Choose incremental models, snapshots, or both for CDC"
availability: all_users
---

This page covers when to use [incremental models](/docs/build/incremental-models-overview), [snapshots](/docs/build/snapshots), or both for change data capture.

The same `unique_key` matches rows to update in an incremental model, and matches rows to store as versions in a snapshot. Refer to [`unique_key`](/reference/resource-configs/unique_key) for that config.

## Compare incremental models and snapshots

Start with this table if you already know what you need to keep. Use it to match the source to an incremental model, a snapshot, or both. Each approach has a section on this page.

| Approach | Use it when | Do not use it when |
| --- | --- | --- |
| [Incremental only](#incremental-only) | You need the latest row per id, and the source already lists changes or has a reliable change timestamp | You must answer "what did this row look like last month?" from this table |
| [Snapshot only](#snapshot-only) | The source overwrites rows in place, you need history, and scanning it each run is acceptable | The source only adds rows and never updates them, or the table is so large that a full snapshot run is too expensive |
| [Incremental models and snapshots together](#using-incremental-models-and-snapshots-together) | You want incremental staging so runs stay cheap, and a snapshot for history | You only need one of those jobs, or you would snapshot the final table people query |

<br />

## Incremental only

Use an incremental model when the source already tells you what changed, and later models only need the current row.

Typical sources:

- A loading tool or stream that writes inserts, updates, and deletes (for an example, refer to [CDC with Snowflake Streams](/best-practices/how-we-handle-real-time-data/2-incremental-patterns#cdc-with-snowflake-streams))
- A table that only adds rows
- A table that overwrites rows and has a reliable `updated_at` (or load timestamp) you can filter on

Configure `unique_key` and an incremental strategy such as `merge` so running the model twice with the same data does not create duplicates. Filter to new changes with `is_incremental()`. For configuration details, refer to [Configure incremental models](/docs/build/incremental-models) and [About incremental strategy](/docs/build/incremental-strategy).

After two runs where Alice moves from `pending` to `shipped`, the incremental table has one row per person. The old `pending` row is gone:

| id | name | status | updated_at |
| -- | ---- | ------ | ---------- |
| 1 | Alice | shipped | 2026-01-02 00:00:00 |
| 2 | Bob | pending | 2026-01-01 00:00:00 |

<br />

## Snapshot only

Use a snapshot when the source overwrites rows in place and you need history, but you do not need a separate incremental staging model.

A snapshot keeps old rows instead of overwriting them. Run `dbt snapshot` (or `dbt build`) on a schedule so you do not miss changes. [How often should I run the snapshot command?](/faqs/Runs/snapshot-frequency) recommends hourly to daily.

Choose a strategy:

- `timestamp` when `updated_at` is reliable and moves forward when the row changes
- `check` when you cannot trust `updated_at`. <Constant name="dbt" /> compares the columns you list (or all columns) and records a change when those values change

Refer to [Add snapshots to your DAG](/docs/build/snapshots) for configuration.

After the same Alice change, the snapshot keeps both versions:

| id | name | status | updated_at | dbt_valid_from | dbt_valid_to |
| -- | ---- | ------ | ---------- | -------------- | ------------ |
| 1 | Alice | pending | 2026-01-01 00:00:00 | 2026-01-01 00:00:00 | 2026-01-02 00:00:00 |
| 1 | Alice | shipped | 2026-01-02 00:00:00 | 2026-01-02 00:00:00 | `null` |
| 2 | Bob | pending | 2026-01-01 00:00:00 | 2026-01-01 00:00:00 | `null` |

<br />

The open row (`dbt_valid_to` is null) is the current version.

## Using incremental models and snapshots together

Use incremental models and snapshots together when you need cheap, current staging _and_ a history of each change.

A shape that works on <Constant name="core" /> and the <Constant name="fusion_engine" />:

```text
source (table that overwrites rows, or a list of changes)
  → stg_* (incremental: filter on change or load time, merge on unique_key)
    → snapshot (history of each version)
    → dim_* (current: where dbt_valid_to is null)
```

- The incremental model holds the latest row per id, so each run only processes new changes.
- The snapshot reads that staging table (or the source) and writes history.
- The current model selects snapshot rows where `dbt_valid_to` is null, which is the latest version the tables people query need.

Snapshot _staging models or sources_, not the finished table people query. Snapshotting a final reporting table is a common mistake. [Strategies for change data capture in dbt](/blog/change-data-capture) treats a later incremental history model and an earlier snapshot as two options, and warns against snapshotting the table people query. This approach keeps the snapshot before those tables.

The following example uses the same Alice and Bob rows as the tables on this page. `raw_customers` is the source table that overwrites `status` in place.

This staging model keeps one current row per customer. On later runs it only reads rows newer than the last `_loaded_at` value already in the table.

<File name="models/staging/stg_customers.sql">

```sql
{{
  config(
    materialized='incremental',
    unique_key='id',
    incremental_strategy='merge'
  )
}}

select
    id,
    name,
    status,
    updated_at,
    _loaded_at
from {{ ref('raw_customers') }}
{% if is_incremental() %}
where _loaded_at > (select coalesce(max(_loaded_at), '1970-01-01') from {{ this }})
{% endif %}
```

</File>

This snapshot reads `stg_customers` and stores a new version when `updated_at` moves forward.

<File name="snapshots/customers_snapshot.yml">

```yaml
snapshots:
  - name: customers_snapshot
    relation: ref('stg_customers')
    config:
      strategy: timestamp
      unique_key: id
      updated_at: updated_at
```

</File>

This model returns only the open snapshot row, which is the latest version of each customer.

<File name="models/marts/dim_customers_current.sql">

```sql
select *
from {{ ref('customers_snapshot') }}
where dbt_valid_to is null
```

</File>

After Alice changes from `pending` to `shipped`:

- `stg_customers` matches the incremental-only table (one row per id, Alice is `shipped`).
- `customers_snapshot` matches the snapshot-only table (Alice has two rows).
- `dim_customers_current` matches the latest row (Alice `shipped`, Bob `pending`).

If the source already includes from and to dates (or a list of changes you want to keep in full), you may not need a snapshot. Load those changes with incremental `append` or `merge`, and keep the latest row with a SQL filter.

## What else to consider

These come up often with CDC. They are not a third approach. Use the linked pages when you implement one of the three options on this page.

- Hard deletes: Loading tools often mark a row as deleted. Snapshots can close the old row or add a deletion record with [`hard_deletes`](/reference/resource-configs/hard-deletes). Incremental models must handle deletes in your merge (or a separate delete statement).
- Late-arriving changes: Widen the incremental filter so you look a bit further back than the last run, and know when a `--full-refresh` is the safe fix. For information on those options, refer to [Configure incremental models](/docs/build/incremental-models).
- Several changes in one run: Keep only the latest change per id before you merge.
- Source columns change: Use [`on_schema_change`](/docs/build/incremental-models#what-if-the-columns-of-my-incremental-model-change) on incremental models. Snapshots can add new columns as they appear.
- Tests: Unique on `(unique_key, dbt_valid_from)` for snapshots, no overlapping `dbt_valid_from` / `dbt_valid_to` ranges, and exactly one current row per id (`dbt_valid_to` is null). Freshness tests belong on the raw source.
- Cost: Organize the table on the change timestamp. Add extra filters so you do not scan full history on every run. For information on those filters, refer to [About incremental strategy](/docs/build/incremental-strategy).

## Related docs

- [About incremental models](/docs/build/incremental-models-overview)
- [Configure incremental models](/docs/build/incremental-models)
- [Add snapshots to your DAG](/docs/build/snapshots)
- [`unique_key`](/reference/resource-configs/unique_key)
- [CDC with Snowflake Streams](/best-practices/how-we-handle-real-time-data/2-incremental-patterns#cdc-with-snowflake-streams)
- [dbt blog: Strategies for change data capture in dbt](/blog/change-data-capture)
