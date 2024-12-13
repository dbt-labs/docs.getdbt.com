---
title: "About microbatch incremental models"
description: "Learn about the 'microbatch' strategy for incremental models."
id: "incremental-microbatch"
---

# About microbatch incremental models <Lifecycle status="beta" />

:::info Microbatch

The new `microbatch` strategy is available in beta for [dbt Cloud "Latest"](/docs/dbt-versions/cloud-release-tracks) and dbt Core v1.9. 

If you use a custom microbatch macro, set a [distinct behavior flag](/reference/global-configs/behavior-changes#custom-microbatch-strategy) in your `dbt_project.yml` to enable batched execution. If you don't have a custom microbatch macro, you don't need to set this flag as dbt will handle microbatching automatically for any model using the [microbatch strategy](#how-microbatch-compares-to-other-incremental-strategies).

Read and participate in the discussion: [dbt-core#10672](https://github.com/dbt-labs/dbt-core/discussions/10672)

Refer to [Supported incremental strategies by adapter](/docs/build/incremental-strategy#supported-incremental-strategies-by-adapter) for a list of supported adapters. 

:::

## What is "microbatch" in dbt?

Incremental models in dbt are a [materialization](/docs/build/materializations) designed to efficiently update your data warehouse tables by only transforming and loading _new or changed data_ since the last run. Instead of reprocessing an entire dataset every time, incremental models process a smaller number of rows, and then append, update, or replace those rows in the existing table. This can significantly reduce the time and resources required for your data transformations.

Microbatch is an incremental strategy designed for large time-series datasets:
- It relies solely on a time column ([`event_time`](/reference/resource-configs/event-time)) to define time-based ranges for filtering. Set the `event_time` column for your microbatch model and its direct parents (upstream models). Note, this is different to `partition_by`, which groups rows into partitions.
- It complements, rather than replaces, existing incremental strategies by focusing on efficiency and simplicity in batch processing.
- Unlike traditional incremental strategies, microbatch enables you to [reprocess failed batches](/docs/build/incremental-microbatch#retry), auto-detect [parallel batch execution](#parallel-batch-execution), and eliminate the need to implement complex conditional logic for [backfilling](#backfills).

- Note, microbatch might not be the best strategy for all use cases. Consider other strategies for use cases such as not having a reliable `event_time` column or if you want more control over the incremental logic. Read more in [How `microbatch` compares to other incremental strategies](#how-microbatch-compares-to-other-incremental-strategies).

### How microbatch works

When dbt runs a microbatch model — whether for the first time, during incremental runs, or in specified backfills — it will split the processing into multiple queries (or "batches"), based on the `event_time` and `batch_size` you configure.

Each "batch" corresponds to a single bounded time period (by default, a single day of data). Where other incremental strategies operate only on "old" and "new" data, microbatch models treat every batch as an atomic unit that can be built or replaced on its own. Each batch is independent and <Term id="idempotent" />. 

This is a powerful abstraction that makes it possible for dbt to run batches [separately](#backfills), concurrently, and [retry](#retry) them independently.

## Example

A `sessions` model aggregates and enriches data that comes from two other models:
- `page_views` is a large, time-series table. It contains many rows, new records almost always arrive after existing ones, and existing records rarely update. It uses the `page_view_start` column as its `event_time`.
- `customers` is a relatively small dimensional table. Customer attributes update often, and not in a time-based manner — that is, older customers are just as likely to change column values as newer customers. The customers model doesn't configure an `event_time` column.

As a result:

- Each batch of `sessions` will filter `page_views` to the equivalent time-bounded batch.
- The `customers` table isn't filtered, resulting in a full scan for every batch. 

:::tip
In addition to configuring `event_time` for the target table, you should also specify it for any upstream models that you want to filter, even if they have different time columns.
:::

<File name="models/staging/page_views.yml">

```yaml
models:
  - name: page_views
    config:
      event_time: page_view_start
```
</File>

We run the `sessions` model for October 1, 2024, and then again for October 2. It produces the following queries:

<Tabs>

<TabItem value="Model definition">

The [`event_time`](/reference/resource-configs/event-time) for the `sessions` model is set to `session_start`, which marks the beginning of a user’s session on the website. This setting allows dbt to combine multiple page views (each tracked by their own `page_view_start` timestamps) into a single session. This way, `session_start` differentiates the timing of individual page views from the broader timeframe of the entire user session.
  
<File name="models/sessions.sql">

```sql
{{ config(
    materialized='incremental',
    incremental_strategy='microbatch',
    event_time='session_start',
    begin='2020-01-01',
    batch_size='day'
) }}

with page_views as (

    -- this ref will be auto-filtered
    select * from {{ ref('page_views') }}

),

customers as (

    -- this ref won't
    select * from {{ ref('customers') }}

),

select
  page_views.id as session_id,
  page_views.page_view_start as session_start,
  customers.*
  from page_views
  left join customers
    on page_views.customer_id = customer.id
```

</File>

</TabItem>

<TabItem value="Compiled (Oct 1, 2024)">

<File name="target/compiled/sessions.sql">

```sql

with page_views as (

    select * from (
        -- filtered on configured event_time
        select * from "analytics"."page_views"
        where page_view_start >= '2024-10-01 00:00:00'  -- Oct 1
        and page_view_start < '2024-10-02 00:00:00'
    )

),

customers as (

    select * from "analytics"."customers"

),

...
```

</File>

</TabItem>

<TabItem value="Compiled (Oct 2, 2024)">

<File name="target/compiled/sessions.sql">

```sql

with page_views as (

    select * from (
        -- filtered on configured event_time
        select * from "analytics"."page_views"
        where page_view_start >= '2024-10-02 00:00:00'  -- Oct 2
        and page_view_start < '2024-10-03 00:00:00'
    )

),

customers as (

    select * from "analytics"."customers"

),

...
```

</File>

</TabItem>

</Tabs>

dbt will instruct the data platform to take the result of each batch query and insert, update, or replace the contents of the `analytics.sessions` table for the same day of data. To perform this operation, dbt will use the most efficient atomic mechanism for "full batch" replacement that is available on each data platform.

It does not matter whether the table already contains data for that day. Given the same input data, the resulting table is the same no matter how many times a batch is reprocessed.

<Lightbox src="/img/docs/building-a-dbt-project/microbatch/microbatch_filters.png" title="Each batch of sessions filters page_views to the matching time-bound batch, but doesn't filter sessions, performing a full scan for each batch."/>

## Relevant configs

Several configurations are relevant to microbatch models, and some are required:


| Config   |  Description   | Default | Type | Required  |
|----------|---------------|---------|------|---------|
| [`event_time`](/reference/resource-configs/event-time)  | The column indicating "at what time did the row occur." Required for your microbatch model and any direct parents that should be filtered.   | N/A     |  Column  |  Required |
| [`begin`](/reference/resource-configs/begin)      |  The "beginning of time" for the microbatch model. This is the starting point for any initial or full-refresh builds. For example, a daily-grain microbatch model run on `2024-10-01` with `begin = '2023-10-01` will process 366 batches (it's a leap year!) plus the batch for "today."        | N/A     | Date   | Required |
| [`batch_size`](/reference/resource-configs/batch-size) |  The granularity of your batches. Supported values are `hour`, `day`, `month`, and `year`    | N/A     | String  | Required |
| [`lookback`](/reference/resource-configs/lookback)   | Process X batches prior to the latest bookmark to capture late-arriving records.    | `1`     | Integer | Optional |
| [`concurrent_batches`](/reference/resource-properties/concurrent_batches) | Overrides dbt's auto detect for running batches concurrently (at the same time). Read more about [configuring concurrent batches](/docs/build/incremental-microbatch#configure-concurrent_batches). Setting to <br />* `true` runs batches concurrently (in parallel). <br />* `false` runs batches sequentially (one after the other).  | `None` | Boolean | Optional |

<Lightbox src="/img/docs/building-a-dbt-project/microbatch/event_time.png" title="The event_time column configures the real-world time of this record"/>

### Required configs for specific adapters
Some adapters require additional configurations for the microbatch strategy. This is because each adapter implements the microbatch strategy differently.

The following table lists the required configurations for the specific adapters, in addition to the standard microbatch configs:

| Adapter  | `unique_key` config | `partition_by` config |
|----------|------------------|--------------------|
| [`dbt-postgres`](/reference/resource-configs/postgres-configs#incremental-materialization-strategies) | ✅ Required | N/A |
| [`dbt-spark`](/reference/resource-configs/spark-configs#incremental-models)    | N/A | ✅ Required |
| [`dbt-bigquery`](/reference/resource-configs/bigquery-configs#merge-behavior-incremental-models) | N/A | ✅ Required |

For example, if you're using `dbt-postgres`, configure `unique_key` as follows:

<File name="models/sessions.sql">

```sql
{{ config(
    materialized='incremental',
    incremental_strategy='microbatch',
    unique_key='sales_id', ## required for dbt-postgres
    event_time='transaction_date',
    begin='2023-01-01',
    batch_size='day'
) }}

select
    sales_id,
    transaction_date,
    customer_id,
    product_id,
    total_amount
from {{ source('sales', 'transactions') }}

```

 In this example, `unique_key` is required because `dbt-postgres` microbatch uses the `merge` strategy, which needs a `unique_key` to identify which rows in the data warehouse need to get merged. Without a `unique_key`, dbt won't be able to match rows between the incoming batch and the existing table.

</File>

### Full refresh

As a best practice, we recommend configuring `full_refresh: False` on microbatch models so that they ignore invocations with the `--full-refresh` flag. If you need to reprocess historical data, do so with a targeted backfill that specifies explicit start and end dates.

## Usage

**You must write your model query to process (read and return) exactly one "batch" of data**. This is a simplifying assumption and a powerful one:
- You don’t need to think about `is_incremental` filtering
- You don't need to pick among DML strategies (upserting/merging/replacing)
- You can preview your model, and see the exact records for a given batch that will appear when that batch is processed and written to the table

When you run a microbatch model, dbt will evaluate which batches need to be loaded, break them up into a SQL query per batch, and load each one independently.

dbt will automatically filter upstream inputs (`source` or `ref`) that define `event_time`, based on the `lookback` and `batch_size` configs for this model.

During standard incremental runs, dbt will process batches according to the current timestamp and the configured `lookback`, with one query per batch.

<Lightbox src="/img/docs/building-a-dbt-project/microbatch/microbatch_lookback.png" title="Configure a lookback to reprocess additional batches during standard incremental runs"/>

**Note:** If there’s an upstream model that configures `event_time`, but you *don’t* want the reference to it to be filtered, you can specify `ref('upstream_model').render()` to opt-out of auto-filtering. This isn't generally recommended — most models that configure `event_time` are fairly large, and if the reference is not filtered, each batch will perform a full scan of this input table.

## Backfills

Whether to fix erroneous source data or retroactively apply a change in business logic, you may need to reprocess a large amount of historical data.

Backfilling a microbatch model is as simple as selecting it to run or build, and specifying a "start" and "end" for `event_time`. Note that `--event-time-start` and `--event-time-end` are mutually necessary, meaning that if you specify one, you must specify the other. 

As always, dbt will process the batches between the start and end as independent queries.

```bash
dbt run --event-time-start "2024-09-01" --event-time-end "2024-09-04"
```


<Lightbox src="/img/docs/building-a-dbt-project/microbatch/microbatch_backfill.png" title="Configure a lookback to reprocess additional batches during standard incremental runs"/>

## Retry

If one or more of your batches fail, you can use `dbt retry` to reprocess _only_ the failed batches.

![Partial retry](https://github.com/user-attachments/assets/f94c4797-dcc7-4875-9623-639f70c97b8f)

## Timezones

For now, dbt assumes that all values supplied are in UTC:

- `event_time`
- `begin`
- `--event-time-start`
- `--event-time-end`

While we may consider adding support for custom time zones in the future, we also believe that defining these values in UTC makes everyone's lives easier.

## Parallel batch execution

The microbatch strategy offers the benefit of updating a model in smaller, more manageable batches. Depending on your use case, configuring your microbatch models to run in parallel offers faster processing, in comparison to running batches sequentially.

Parallel batch execution means that multiple batches are processed at the same time, instead of one after the other (sequentially) for faster processing of your microbatch models.  

dbt automatically detects whether a batch can be run in parallel in most cases, which means you don’t need to configure this setting. However, the [`concurrent_batches` config](/reference/resource-properties/concurrent_batches) is available as an override (not a gate), allowing you to specify whether batches should or shouldn’t be run in parallel in specific cases.

For example, if you have a microbatch model with 12 batches, you can execute those batches to run in parallel. Specifically they'll run in parallel limited by the number of [available threads](/docs/running-a-dbt-project/using-threads).

### Prerequisites

To enable parallel execution, you must:

- Use a supported adapter:
  - Snowflake
  - Databricks
  - More adapters coming soon!
    - We'll be continuing to test and add concurrency support for adapters. This means that some adapters might get concurrency support _after_ the 1.9 initial release.
    
- Meet [additional conditions](#how-parallel-batch-execution-works) described in the following section.

### How parallel batch execution works

A batch can only run in parallel if all of these conditions are met:

| Condition     |  Parallel execution   | Sequential execution|
| ---------------| :------------------: | :----------: |
| **Not** the first batch |  ✅         | -            |
| **Not** the last batch  |  ✅         | -            |
| [Adapter supports](#prerequisites) parallel batches | ✅  | -         |


After checking for the conditions in the previous table &mdash; and if `concurrent_batches` value isn't set, dbt will intelligently auto-detect if the model invokes the [`{{ this }}`](/reference/dbt-jinja-functions/this) Jinja function. If it references `{{ this }}`, the batches will run sequentially since  `{{ this }}` represents the database of the current model and referencing the same relation causes conflict. 

Otherwise, if `{{ this }}` isn't detected (and other conditions are met), the batches will run in parallel, which can be overriden when you [set a value for `concurrent_batches`](/reference/resource-properties/concurrent_batches).

### Parallel or sequential execution

Choosing between parallel batch execution and sequential processing depends on the specific requirements of your use case. 

- Parallel batch execution is faster but requires logic independent of batch execution order. For example, if you're developing a data pipeline for a system that processes user transactions in batches, each batch is executed in parallel for better performance. However, the logic used to process each transaction shouldn't depend on the order of how batches are executed or completed.
- Sequential processing is slower but essential for calculations like [cumulative metrics](/docs/build/cumulative)  in microbatch models. It processes data in the correct order, allowing each step to build on the previous one.

<!-- You can override the check for `this` by setting `concurrent_batches` to either `True` or `False`. If set to `False`, the batch will be run sequentially. If set to `True` the batch will be run in parallel (assuming [1], [2], and [3])
To override the `this` check, use the `concurrent_batches` configuration:


<File name='dbt_project.yml'>

```yaml
models:
  +concurrent_batches: True
```

</File>

or:

<File name='models/my_model.sql'>

```sql
{{
  config(
    materialized='incremental',
    concurrent_batches=True,
    incremental_strategy='microbatch'
    
    ...
  )
}}

select ...
```

</File>
-->

### Configure `concurrent_batches` 

By default, dbt auto-detects whether batches can run in parallel for microbatch models, and this works correctly in most cases. However, you can override dbt's detection by setting the [`concurrent_batches` config](/reference/resource-properties/concurrent_batches) in your `dbt_project.yml` or model `.sql` file to specify parallel or sequential execution, given you meet all the [conditions](#prerequisites):

<Tabs>
<TabItem value="yaml" label="dbt_project.yml">

<File name='dbt_project.yml'>

```yaml
models:
  +concurrent_batches: true # value set to true to run batches in parallel
```

</File>
</TabItem>

<TabItem value="sql" label="my_model.sql">

<File name='models/my_model.sql'>

```sql
{{
  config(
    materialized='incremental',
    incremental_strategy='microbatch',
    event_time='session_start',
    begin='2020-01-01',
    batch_size='day
    concurrent_batches=true, # value set to true to run batches in parallel
    ...
  )
}}

select ...
```
</File>
</TabItem>
</Tabs>

## How microbatch compares to other incremental strategies

As data warehouses roll out new operations for concurrently replacing/upserting data partitions, we may find that the new operation for the data warehouse is more efficient than what the adapter uses for microbatch. In such instances, we reserve the right the update the default operation for microbatch, so long as it works as intended/documented for models that fit the microbatch paradigm.

Most incremental models rely on the end user (you) to explicitly tell dbt what "new" means, in the context of each model, by writing a filter in an `{% if is_incremental() %}` conditional block. You are responsible for crafting this SQL in a way that queries [`{{ this }}`](/reference/dbt-jinja-functions/this) to check when the most recent record was last loaded, with an optional look-back window for late-arriving records. 

Other incremental strategies will control _how_ the data is being added into the table — whether append-only `insert`, `delete` + `insert`, `merge`, `insert overwrite`, etc — but they all have this in common.

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

<File name="models/staging/stg_events.sql">

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

select * from {{ ref('stg_events') }} -- this ref will be auto-filtered
```

</File>

Where you’ve also set an `event_time` for the model’s direct parents - in this case, `stg_events`:

<File name="models/staging/stg_events.yml">

```yaml
models:
  - name: stg_events
    config:
      event_time: my_time_field
```

</File>

And that’s it!

When you run the model, each batch templates a separate query. For example, if you were running the model on October 1, dbt would template separate queries for each day between September 28 and October 1, inclusive — four batches in total.

The query for `2024-10-01` would look like:

<File name="target/compiled/staging/stg_events.sql">

```sql
select * from (
    select * from "analytics"."stg_events"
    where my_time_field >= '2024-10-01 00:00:00'
      and my_time_field < '2024-10-02 00:00:00'
)
```

</File>

Based on your data platform, dbt will choose the most efficient atomic mechanism to insert, update, or replace these four batches (`2024-09-28`, `2024-09-29`, `2024-09-30`, and `2024-10-01`) in the existing table.
