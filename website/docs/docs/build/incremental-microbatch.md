---
title: "About microbatch incremental models"
description: "Learn about the 'microbatch' strategy for incremental models."
id: "incremental-microbatch"
---

# About microbatch incremental models <Lifecycle status="beta" />
:::info Microbatch <Lifecycle status="beta" />

The `microbatch` strategy is available in [dbt Cloud Versionless](/docs/dbt-versions/upgrade-dbt-version-in-cloud#versionless) and dbt Core v1.9.

Read and participate in the discussion: [dbt-core#10672](https://github.com/dbt-labs/dbt-core/discussions/10672)

:::

## What is microbatch?

Incremental models in dbt are a [materialization](https://docs.getdbt.com/docs/build/materializations) designed to efficiently update your data warehouse tables by only transforming and loading _new or changed data_ since the last run. Instead of reprocessing an entire dataset every time, incremental models append, update, or replace rows in the existing table with the new data just processed. This can significantly reduce the time and resources required for your data transformations.

Microbatch incremental models make it possible to process transformations on large time-series datasets with efficiency and resiliency. When dbt runs a microbatch model — whether for the first time, during incremental runs, or during manual backfills — it will split the processing into multiple queries (or "batches"), based on the `event_time` column you configure.

Where other incremental strategies operate only on "old" and "new" data, microbatch models treat each "batch" of data as a unit that can be built or replaced on its own. Each batch is independent and <Term id="idempotent" />. This is a powerful abstraction that makes it possible for dbt to run batches separately — in the future, concurrently — and to retry them independently.

### Available configs

- `event_time` - The column indicating "at what time did the row occur" (for both your microbatch model and its direct parents)
    
<Lightbox src="/img/docs/building-a-dbt-project/microbatch/event_time.png" title="The event_time column configures the real-world time of this record"/>
    
- `batch_size` (string, optional) - The granularity of your batches. The default is `day`, and currently that is the only granularity supported.
- `lookback` (integer, optional) - Process X batches prior to the latest bookmark, in order to capture late-arriving records. The default value is `0`.
- `begin` (date, optional) - The "beginning of time" for your data. This is the starting point for any initial or full-refresh builds. For example, a daily-grain microbatch model run on `2024-10-01` with `begin = '2023-10-01` will process 366 batches. (It's a leap year!)

As a best practice, we recommend configuring `full_refresh: False` on microbatch models so that they ignore invocations with the `--full-refresh` flag. If you need to reprocess historical data, do so with a targeted backfill.

### Usage

**You write your model query to process (read and return) one day of data**. You don’t need to think about `is_incremental` filtering or DML (upserting/merging/replacing) - we take care of that for you.

dbt will then evaluate which batches need to be loaded, break them up into a SQL query per batch, and load each one independently.

dbt will automatically filter upstream inputs (`source` or `ref`) that define `event_time`, based on the `lookback` and `batch_size` configs for this model.

During standard incremental runs, dbt will process new batches and any according to the configured `lookback` (with one query per batch)
    
<Lightbox src="/img/docs/building-a-dbt-project/microbatch/microbatch_lookback.png" title="Configure a lookback to reprocess additional batches during standard incremental runs"/>

If there’s an upstream model that configures `event_time`, but you *don’t* want the reference to it to be filtered, you can specify `ref('upstream_model').render()` to opt-out of auto-filtering.

dbt will evaluate which batches need to be loaded **by processing the current batch (current_timestamp) + any batches in your configured lookback**, break them up into a SQL query per batch, and load them all independently. 

### Backfills

Whether to fix erroneous source data, or retroactively apply a change in business logic, you may need to reprocess a large amount of historical data.

Backfilling a microbatch model is as simple as selecting it to run or build, and specifying a "start" and "end" for `event_time`. As always, dbt will process the batches between the start and end as independent queries.

```bash
dbt run --event-time-start "2024-09-01" --event-time-end "2024-09-04"
```

<Lightbox src="/img/docs/building-a-dbt-project/microbatch/microbatch_backfill.png" title="Configure a lookback to reprocess additional batches during standard incremental runs"/>

### Retry

If one or more of your batches fail, you can use `dbt retry` to reprocess _only_ the failed batches.

![Partial retry](https://github.com/user-attachments/assets/f94c4797-dcc7-4875-9623-639f70c97b8f)

### Timezones

For now, dbt assumes that all values supplied are in UTC:

- `event_time`
- `begin`
- `--event-time-start` and `--event-time-end`

While we may consider adding support for custom timezones in the future, we also believe that defining these values in UTC makes everyone's lives easier.

## How does `microbatch` compare to other incremental strategies?

Most incremental models rely on the end user (you) to explicitly tell dbt what "new" means, in the context of each model, by writing a filter in an `is_incremental()` block. You are responsibly for crafting this SQL in a way that queries `this` to check when the most recent record was last loaded, with an optional look-back window for late-arriving records. Other incremental strategies will control _how_ the data is being added into the table — whether append-only `insert`, `delete` + `insert`, `merge`, `insert overwrite`, etc — but they all have this in common.

As an example:

```sql
{{
    config(
        materialized='incremental',
        incremental_strategy='delete+insert',
        unique_key='date_day'
    )
}}

select * from {{ ref('stg_events') }}

    {% if is_incremental() %}
        -- this filter will only be applied on an incremental run
        -- add a lookback window of 3 days to account for late-arriving records
        where date_day >= (select {{ dbt.dateadd("day", -3, "max(date_day)") }} from {{ this }})  
    {% endif %}

```

For this incremental model:

- "New" records are those with a `date_day` greater than the maximum `date_day` that has previously been loaded
- The lookback window is 3 days
- When there are new records for a given `date_day`, the existing data for `date_day` is deleted and the new data is inserted

Let’s take our same example from before, and instead use the new `microbatch` incremental strategy:

```sql
{{
    config(
        materialized='incremental',
        incremental_strategy='microbatch',
        event_time='event_occured_at',
        batch_size='day',
        lookback=3,
        begin='2020-01-01',
        full_refresh=false
    )
}}

select * from {{ ref('stg_events') }} # this ref will be auto-filtered
```

Where you’ve also set an `event_time` for the model’s direct parents - in this case `stg_events`:

```yaml
models:
  - name: stg_events
     config:
       event_time: my_time_field
```

And that’s it! When you run the model, each batch templates a separate query. The batch for `2024-10-01` would template:

```sql
select * from (
    select * from {{ ref('stg_events') }}
    where my_time_field >= '2024-10-01 00:00:00'
      and my_time_field < '2024-10-02 00:00:00'
) # this ref will be auto-filtered
```
