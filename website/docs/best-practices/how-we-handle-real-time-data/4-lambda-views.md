---
title: "Lambda views for near real-time dashboards"
description: Combine batch and real-time data in a single view for operational dashboards
hoverSnippet: Learn the lambda view pattern for near real-time operational dashboards
---

A **lambda view** pattern combines a **batch/incremental fact table** with a small near real-time (NRT) slice of very recent data and exposes them through a single view. This is a legacy-but-still-useful pattern some teams have used to deliver near real-time operational dashboards on top of dbt + Snowflake.

:::info Advanced pattern
This is an advanced pattern with significant operational complexity. For most use cases, consider [Dynamic Tables](/best-practices/how-we-handle-real-time-datas/3-warehouse-native-features) or standard [incremental models](/best-practices/how-we-handle-real-time-datas/2-incremental-patterns) first.
:::

---

## When to use this pattern

Use lambda views only when:

- You need **fresher reads than your normal incremental schedule**, but
- You **can't (or don't want to) use Dynamic Tables or materialized views**, or you want to keep logic entirely in dbt SQL
- You have specific operational dashboards that justify the added complexity
- Standard incremental patterns running every 5-15 minutes aren't fresh enough

---

## How it works

The pattern consists of three layers:

1. **Base table** (HIST): An incremental table that processes historical data on a schedule (e.g., every 5-15 minutes)
2. **NRT view** (HOT): A view that queries only the very latest data not yet in the base table
3. **Lambda view**: A view that unions the base table and NRT view, giving you complete data

```
┌─────────────────┐
│  Lambda View    │  ← BI tools query this
│   (Union All)   │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
┌───▼──┐  ┌──▼────┐
│ HIST │  │  NRT  │
│Table │  │ View  │
└──────┘  └───┬───┘
              │
         ┌────▼────┐
         │   Raw   │
         │  Events │
         └─────────┘
```

---

## Assumptions

- Raw events land continuously into `RAW.EVENTS` via Snowpipe/streaming
- You already maintain an **incremental fact table** that is rebuilt every few minutes
- Most dashboards are fine reading from that incremental table, but a small set of **operational dashboards** want "as-of-now" data (e.g., last few minutes of events)

---

## Implementation

### 1. Base incremental table (HIST)

This is your standard incremental model, scheduled to run every 5-15 minutes:

```sql
-- models/marts/fct_events.sql
{{ config(
    materialized = 'incremental',
    incremental_strategy = 'merge',
    unique_key = 'event_id',
    cluster_by = ['event_date'],
    snowflake_warehouse = 'TRANSFORM_WH'
) }}

with source_events as (

    select
        event_id,
        event_ts::timestamp_ntz       as event_ts,
        to_date(event_ts)             as event_date,
        user_id,
        event_type,
        payload
    from {{ source('raw', 'events') }}

    {% if is_incremental() %}
      -- Only pull new/changed rows since last successful load
      where event_ts >
            (select max(event_ts) from {{ this }})
    {% endif %}

)

select *
from source_events;
```

Schedule this model to run every 5–15 minutes as part of your near real-time job.

---

### 2. NRT view (HOT data)

The NRT **view** returns only events with `event_ts` greater than the max timestamp in the base table, so there is **no overlap/double counting**:

```sql
-- models/marts/fct_events_nrt.sql
{{ config(
    materialized = 'view'
) }}

with base_max as (
    select max(event_ts) as max_event_ts
    from {{ ref('fct_events') }}
),

fresh_events as (
    select
        e.event_id,
        e.event_ts::timestamp_ntz   as event_ts,
        to_date(e.event_ts)         as event_date,
        e.user_id,
        e.event_type,
        e.payload
    from {{ source('raw', 'events') }} as e
    cross join base_max
    where e.event_ts > base_max.max_event_ts
)

select *
from fresh_events;
```

**Characteristics:**
- **No scheduling required** – it's just a view over `RAW.EVENTS` filtered by `max(event_ts)` from `FCT_EVENTS`
- Every query against `FCT_EVENTS_NRT` scans only "since last batch" data, which should be a **small time window** (e.g., a few minutes or hours, depending on your job cadence)

---

### 3. Lambda view (single read path)

The **lambda view** exposes a single relation that always contains:
- All historical data from the base incremental fact table, plus
- The most recent events from the NRT view

```sql
-- models/bi/fct_events_lambda.sql
{{ config(
    materialized = 'view'
) }}

select
    event_id,
    event_ts,
    event_date,
    user_id,
    event_type,
    payload
from {{ ref('fct_events') }}

union all

select
    event_id,
    event_ts,
    event_date,
    user_id,
    event_type,
    payload
from {{ ref('fct_events_nrt') }};
```

Point your BI/dashboards to **`ANALYTICS.FCT_EVENTS_LAMBDA`**:

- Historical portion (most of the table) is served from a **pre-computed incremental table**
- The "tail" of the distribution (the very latest events since the last dbt run) is answered by a **small live query** against `RAW.EVENTS`

---

## Benefits

- **Always fresh**: Data is as fresh as your ingestion pipeline, not limited by dbt job frequency
- **Optimized reads**: Most data is pre-computed; only the recent tail is queried live
- **Pure dbt SQL**: No external orchestration or warehouse-specific features required
- **Flexible**: Can apply complex transformations in the HIST layer while keeping NRT layer simple

---

## Operational considerations

### Cost profile
- Every query against `FCT_EVENTS_LAMBDA` must read the NRT slice from `RAW.EVENTS` in addition to the base table
- Use this pattern only for **truly operational dashboards** that justify the extra per-query cost
- High-concurrency BI usage can result in many repeated scans of the NRT slice

### Freshness boundaries
Freshness is bounded by:
- Your dbt incremental job frequency (age of `FCT_EVENTS`), plus
- Ingestion latency into `RAW.EVENTS` (Snowpipe/streaming layer)

For example:
- If your incremental job runs every 10 minutes
- And Snowpipe has 2-minute latency
- Your data can be 2-12 minutes old (average ~7 minutes)

### Timing gaps and correctness

A critical challenge with lambda views is **timing gaps** between HIST and NRT flows:

**The problem:**
- Views (NRT) often update much faster than incremental tables
- During a dbt run, the NRT side may start filtering on the *new* `max(event_ts)` before the incremental table has finished loading
- This produces temporary **holes in the unioned lambda view** where recent data disappears briefly

**Example timeline:**
1. 10:00 AM - dbt job starts, `fct_events` has data through 9:50 AM
2. 10:02 AM - `fct_events` is being updated with 9:50-10:00 AM data
3. 10:02 AM - User queries lambda view
4. NRT view sees *new* `max(event_ts)` from partially-loaded `fct_events` (e.g., 9:55 AM)
5. NRT view filters `RAW.EVENTS` for data > 9:55 AM
6. Data from 9:50-9:55 AM is missing (not in completed HIST, excluded from NRT)

**Mitigation:**
- Introduce explicit dependency from NRT to incremental model (ensures NRT reads only after HIST completes)
- Add a time buffer in the NRT filter (e.g., `max(event_ts) - interval '1 minute'`) to reduce gap window
- Clearly document expected behavior and set user expectations

### DAG complexity

Every "product" model now has at least three artifacts:
- HIST table (incremental)
- NRT view
- Lambda view (union)

This triples the number of models to maintain, test, and document.

### Duplicated logic

You may need to duplicate transformation logic between HIST and NRT flows:
- **Centralized macros**: More DRY but less readable
- **Duplicated SQL**: More readable but more to maintain

---

## Complexity vs. alternatives

For many modern Snowflake implementations, a **Dynamic Table or materialized view** with a small `target_lag` can provide similar "always within X minutes" SLAs with **less custom SQL** and warehouse-managed incremental logic.

Lambda views are best positioned as an **advanced/legacy pattern** you can still reach for when:
- You want all logic in dbt SQL, or
- You lack the right warehouse feature in your environment, or
- You're extending an existing implementation already built this way

---

## Origin and further reading

This pattern was originally documented by the dbt community and popularized by teams like JetBlue who used it for operational dashboards.

For the original write-up and community discussion, see:
- [How to create near real-time models with just dbt + SQL](https://discourse.getdbt.com/t/how-to-create-near-real-time-models-with-just-dbt-sql/1457) (dbt Discourse)

---

## When to use lambda views

✅ **Consider lambda views when:**
- Standard incremental models aren't fresh enough
- You can't use Dynamic Tables or prefer pure dbt SQL
- You have specific high-value operational dashboards
- You can accept the operational complexity

❌ **Prefer alternatives when:**
- Dynamic Tables/materialized views are available and suitable
- Incremental models every 5-15 minutes meet your SLA
- You're just starting with near real-time patterns (start simpler)
- Team lacks capacity to maintain complex DAG patterns
