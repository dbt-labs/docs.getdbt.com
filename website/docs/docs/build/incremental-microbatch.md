---
title: "About microbatch incremental models"
description: "Learn about the 'microbatch' strategy for incremental models."
id: "incremental-microbatch"
---

# About microbatch incremental models <Lifecycle status="beta" />

:::info Microbatch

The `microbatch` strategy is available in beta for [dbt Cloud Versionless](/docs/dbt-versions/upgrade-dbt-version-in-cloud#versionless) and dbt Core v1.9. We have been developing it behind a flag to prevent unintended interactions with existing custom incremental strategies. To enable this feature, [set the environment variable](/docs/build/environment-variables#setting-and-overriding-environment-variables) `DBT_EXPERIMENTAL_MICROBATCH` to `True` in your dbt Cloud environments or wherever you're running dbt Core.

Read and participate in the discussion: [dbt-core#10672](https://github.com/dbt-labs/dbt-core/discussions/10672)

Refer to [Supported incremental strategies by adapter](/docs/build/incremental-strategy#supported-incremental-strategies-by-adapter) for a list of supported adapters. 

:::

## What is "microbatch" in dbt?

Incremental models in dbt are a [materialization](/docs/build/materializations) designed to efficiently update your data warehouse tables by only transforming and loading _new or changed data_ since the last run. Instead of reprocessing an entire dataset every time, incremental models process a smaller number of rows, and then append, update, or replace those rows in the existing table. This can significantly reduce the time and resources required for your data transformations.

Microbatch incremental models make it possible to process transformations on very large time-series datasets with efficiency and resiliency. When dbt runs a microbatch model — whether for the first time, during incremental runs, or in specified backfills — it will split the processing into multiple queries (or "batches"), based on the `event_time` and `batch_size` you configure.

Each "batch" corresponds to a single bounded time period (by default, a single day of data). Where other incremental strategies operate only on "old" and "new" data, microbatch models treat every batch as an atomic unit that can be built or replaced on its own. Each batch is independent and <Term id="idempotent" />. This is a powerful abstraction that makes it possible for dbt to run batches separately — in the future, concurrently — and to retry them independently.

### Example

A `sessions` model aggregates and enriches data that comes from two other models.
- `page_views` is a large, time-series table. It contains many rows, new records almost always arrive after existing ones, and existing records rarely update.
- `customers` is a relatively small dimensional table. Customer attributes update often, and not in a time-based manner — that is, older customers are just as likely to change column values as newer customers.

The `page_view_start` column in `page_views` is configured as that model's `event_time`. The `customers` model does not configure an `event_time`. Therefore, each batch of `sessions` will filter `page_views` to the equivalent time-bounded batch, and it will not filter `customers` (a full scan for every batch).

<File name="models/staging/page_views.yml">

```yaml
models:
  - name: page_views
    config:
      event_time: page_view_start
```
</File>

We run the `sessions` model on October 1, 2024, and then again on October 2. It produces the following queries:

<Tabs>

<TabItem value="Model definition">

The `event_time` for the `sessions` model is set to `session_start`, which marks the beginning of a user’s session on the website. This setting allows dbt to combine multiple page views (each tracked by their own `page_view_start` timestamps) into a single session. This way, `session_start` differentiates the timing of individual page views from the broader timeframe of the entire user session.
  
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

### Relevant configs

Several configurations are relevant to microbatch models, and some are required:

| Config   | Type | Description   | Default |
|----------|------|---------------|---------|
| `event_time` | Column  (required)   | The column indicating "at what time did the row occur." Required for your microbatch model and any direct parents that should be filtered.          | N/A     |
| `begin`      | Date (required)   | The "beginning of time" for the microbatch model. This is the starting point for any initial or full-refresh builds. For example, a daily-grain microbatch model run on `2024-10-01` with `begin = '2023-10-01` will process 366 batches (it's a leap year!) plus the batch for "today."        | N/A     |
| `batch_size` | String (required)  | The granularity of your batches. Supported values are `hour`, `day`, `month`, and `year`             | N/A     |
| `lookback`   | Integer (optional) | Process X batches prior to the latest bookmark to capture late-arriving records.                                         | `1`     |

<Lightbox src="/img/docs/building-a-dbt-project/microbatch/event_time.png" title="The event_time column configures the real-world time of this record"/>

As a best practice, we recommend configuring `full_refresh: False` on microbatch models so that they ignore invocations with the `--full-refresh` flag. If you need to reprocess historical data, do so with a targeted backfill that specifies explicit start and end dates.

### Usage

**You must write your model query to process (read and return) exactly one "batch" of data**. This is a simplifying assumption and a powerful one:
- You don’t need to think about `is_incremental` filtering
- You don't need to pick among DML strategies (upserting/merging/replacing)
- You can preview your model, and see the exact records for a given batch that will appear when that batch is processed and written to the table

When you run a microbatch model, dbt will evaluate which batches need to be loaded, break them up into a SQL query per batch, and load each one independently.

dbt will automatically filter upstream inputs (`source` or `ref`) that define `event_time`, based on the `lookback` and `batch_size` configs for this model.

During standard incremental runs, dbt will process batches according to the current timestamp and the configured `lookback`, with one query per batch.

<Lightbox src="/img/docs/building-a-dbt-project/microbatch/microbatch_lookback.png" title="Configure a lookback to reprocess additional batches during standard incremental runs"/>

**Note:** If there’s an upstream model that configures `event_time`, but you *don’t* want the reference to it to be filtered, you can specify `ref('upstream_model').render()` to opt-out of auto-filtering. This isn't generally recommended — most models that configure `event_time` are fairly large, and if the reference is not filtered, each batch will perform a full scan of this input table.

### Backfills

Whether to fix erroneous source data or retroactively apply a change in business logic, you may need to reprocess a large amount of historical data.

Backfilling a microbatch model is as simple as selecting it to run or build, and specifying a "start" and "end" for `event_time`. Note that `--event-time-start` and `--event-time-end` are mutually necessary, meaning that if you specify one, you must specify the other. 

As always, dbt will process the batches between the start and end as independent queries.

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
- `--event-time-start`
- `--event-time-end`

While we may consider adding support for custom time zones in the future, we also believe that defining these values in UTC makes everyone's lives easier.

## How `microbatch` compares to other incremental strategies?

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
