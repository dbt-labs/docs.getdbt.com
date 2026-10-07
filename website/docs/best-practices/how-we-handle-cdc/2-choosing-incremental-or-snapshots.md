---
title: "Choosing incremental models or snapshots"
id: "2-choosing-incremental-or-snapshots"
description: "Choose incremental models, snapshots, or both for change data capture in dbt."
sidebar_label: "Choosing incremental models or snapshots"
hoverSnippet: "Choose incremental models, snapshots, or both for change data capture"
availability: all_users
---

Use [incremental models](/docs/build/incremental-models-overview), [snapshots](/docs/build/snapshots), or both depending on whether you need current values, historical versions, or both.

## Compare incremental models and snapshots

Start with this table if you already know what you need to keep. Use it to match the source to an incremental model, a snapshot, or both.
<SimpleTable>
| Approach | Use it when | Do not use it when |
| --- | --- | --- |
| [Incremental only](#incremental-only) | You need the latest row per id, and the source already lists changes or has a reliable change timestamp | You must answer "what did this row look like last month?" from this table |
| [Snapshot only](#snapshot-only) | The source overwrites rows in place, you need history, and scanning it each run is acceptable | The source only adds rows and never updates them, or the table is so large that a full snapshot run is too expensive |
| [Incremental models and snapshots together](#using-incremental-models-and-snapshots-together) | You want incremental staging so runs stay cheap, and a snapshot for history | You only need one of those jobs, or you would snapshot the final table people query |
</SimpleTable>
<br />

## Incremental only

Choose this approach when you only need each row's current values. Your source must let you identify new or updated rows from:

- A loading tool or stream that writes inserts, updates, and deletes (for an example, refer to [CDC with Snowflake Streams](/best-practices/how-we-handle-real-time-data/2-incremental-patterns#cdc-with-snowflake-streams))
- A table that only adds rows
- A table that overwrites rows and has a reliable `updated_at` (or load timestamp) you can filter on

These examples follow two customers, Alice and Bob. After the first run, both have a `trial` status:

<SimpleTable>
| id | name | status | updated_at |
| -- | ---- | ------ | ---------- |
| 1 | Alice | trial | 2026-01-01 00:00:00 |
| 2 | Bob | trial | 2026-01-01 00:00:00 |
</SimpleTable>

<br />

Alice then becomes an `active` customer the next day. With a `merge` strategy and `id` as the `unique_key`, the next run updates her existing row:

<SimpleTable>
| id | name | status | updated_at |
| -- | ---- | ------ | ---------- |
| 1 | Alice | active | 2026-01-02 00:00:00 |
| 2 | Bob | trial | 2026-01-01 00:00:00 |
</SimpleTable>

<br />

Alice's current status is `active`. Her earlier `trial` status is no longer stored in this table.

To configure this behavior:

- Use `is_incremental()` to apply a filter for new or updated rows on later runs
- Set [`unique_key`](/reference/resource-configs/unique_key) to the customer ID so <Constant name="dbt" /> can match incoming rows to existing ones
- Choose a strategy such as `merge`, which updates matching rows and inserts new ones

Refer to [Configure incremental models](/docs/build/incremental-models) and [About incremental strategy](/docs/build/incremental-strategy) for details.

## Snapshot only

Choose this approach when your source overwrites rows and you need the history to answer questions such as "When did Alice become an active customer?"

Using the same example, run a snapshot before and after Alice's status changes. With the `timestamp` strategy, the snapshot keeps both versions:

<SimpleTable>
| id | name | status | updated_at | dbt_valid_from | dbt_valid_to |
| -- | ---- | ------ | ---------- | -------------- | ------------ |
| 1 | Alice | trial | 2026-01-01 00:00:00 | 2026-01-01 00:00:00 | 2026-01-02 00:00:00 |
| 1 | Alice | active | 2026-01-02 00:00:00 | 2026-01-02 00:00:00 | `null` |
| 2 | Bob | trial | 2026-01-01 00:00:00 | 2026-01-01 00:00:00 | `null` |
</SimpleTable>

<br />

The `dbt_valid_from` and `dbt_valid_to` columns show you when each version was valid. By default, `dbt_valid_to` is `null` for the current version.

To configure your snapshot, set `unique_key` to the customer ID and choose how to detect changes:

- Use `timestamp` (recommended) when you have a reliable `updated_at` column that advances whenever a row changes
- Use `check` when a table has no reliable `updated_at` column. <Constant name="dbt" /> tracks changes by comparing the columns you specify, or all columns

Run `dbt snapshot` or `dbt build` regularly on a schedule. Snapshots capture the values available when they run, so they cannot recover intermediate changes that were overwritten between runs. Choose a schedule based on how often your data changes and how much detail you need in its history.

Refer to [Add snapshots to your DAG](/docs/build/snapshots) and [How often should I run the snapshot command?](/faqs/Runs/snapshot-frequency) for configuration and scheduling.

## Using incremental models and snapshots together

Use incremental models and snapshots together when you need an incremental staging model to prepare incoming data before capturing its history.

The following example continues with Alice and Bob. It uses a source named `raw` with a `customers` table that stores one current row per customer. Replace these names with a [source defined in your project](/docs/build/sources).

The source includes two timestamps:

- `updated_at`: When the customer's data changed.
- `_loaded_at`: When your loading tool wrote that version to the warehouse. This example assumes it is populated and advances with each loaded change.

### 1. Process incoming changes

Create an incremental staging model that uses `_loaded_at` to find recently loaded rows and `id` to update the matching customer.

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
from {{ source('raw', 'customers') }}
{% if is_incremental() %}
where _loaded_at >= (
    select coalesce(max(_loaded_at), '1970-01-01')
    from {{ this }}
)
{% endif %}
```

</File>

The first run reads all rows. Later runs read rows at or after the latest stored `_loaded_at` value. Using `>=` includes rows that share that timestamp.

### 2. Capture historical versions

Create a snapshot of the staging model. It uses `updated_at` to detect changes to each customer's data.

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

Snapshot sources or lightly transformed staging models. Keep business logic in downstream models so changes to that logic do not become part of your source history.

### 3. Select current values for reporting

Create a model that selects the current version of each customer:

<File name="models/marts/dim_customers_current.sql">

```sql
select
    id,
    name,
    status,
    updated_at
from {{ ref('customers_snapshot') }}
where dbt_valid_to is null
```

</File>

Run these resources in dependency order: staging model, snapshot, then reporting model. You can use `dbt build` with all three selected.

After a run captures Alice's change, the staging and reporting models show her as `active`. The snapshot keeps both her `trial` and `active` versions, as shown in the earlier examples.

If the source already includes from and to dates (or a list of changes you want to keep in full), you may not need a snapshot. Load those changes with incremental `append` or `merge`, and keep the latest row with a SQL filter.

## What else to consider

- Hard deletes: Loading tools often mark a row as deleted. Snapshots can close the old row or add a deletion record with [`hard_deletes`](/reference/resource-configs/hard-deletes). Incremental models must handle deletes in your merge (or a separate delete statement).
- Late-arriving changes: Widen the incremental filter so you look a bit further back than the last run, and know when a `--full-refresh` is the safe fix. Refer to [Configure incremental models](/docs/build/incremental-models).
- Several changes in one run: On incremental models, keep only the latest change per id before you merge.
- Source columns change: Use [`on_schema_change`](/docs/build/incremental-models#what-if-the-columns-of-my-incremental-model-change) to control how incremental models handle schema changes. Snapshots can add new columns, but you may need to update [`check_cols`](/docs/build/snapshots#check-strategy) if you use the `check` strategy.
- Tests: Test that the source or staging `unique_key` is unique and not null. For snapshots, also test that `(unique_key, dbt_valid_from)` is unique, that `dbt_valid_from` / `dbt_valid_to` ranges do not overlap, and that each ID has at most one current version (`dbt_valid_to` is null). Monitor [source freshness](/docs/build/sources#source-data-freshness) to identify loading delays.
- Cost: Organize your table by the change timestamp and use filters to limit how much data each run scans. Refer to [About incremental strategy](/docs/build/incremental-strategy).

## Related docs

- [About incremental models](/docs/build/incremental-models-overview)
- [Configure incremental models](/docs/build/incremental-models)
- [Add snapshots to your DAG](/docs/build/snapshots)
- [`unique_key`](/reference/resource-configs/unique_key)
- [CDC with Snowflake Streams](/best-practices/how-we-handle-real-time-data/2-incremental-patterns#cdc-with-snowflake-streams)
- [dbt blog: Strategies for change data capture in dbt](/blog/change-data-capture)
