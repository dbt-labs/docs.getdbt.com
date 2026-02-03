---
title: "Operational considerations for near real-time data"
id: "6-operational-considerations"
description: Understand the challenges, risks, and costs of implementing near real-time data pipelines with dbt
hoverSnippet: Learn about operational challenges and risks for near real-time data patterns
---

Teams that implement very high-frequency dbt jobs tend to run into a consistent set of challenges, both at the dbt scheduler layer and in the warehouse itself.

:::info Treat near real-time as a premium service
Near real-time service level agreements (SLAs) require premium resources and add significant operational overhead. Pressure-test whether the business really needs minute-level freshness before committing.
:::

## Over-scheduled jobs and queue management

If a job's run duration is longer than its schedule frequency, the job becomes over-scheduled. The queue grows faster than the scheduler can process runs, and <Constant name="dbt_platform" /> will start cancelling queued runs to avoid an ever-expanding backlog.

This is easy to hit with near real-time patterns if your incremental build time creeps up (more models, more tests, more data) but the cron schedule stays aggressive (for example, every 2–5 minutes).

**Example scenario:**
- Your job is scheduled to run every 5 minutes.
- The job typically takes 6-7 minutes to complete.
- New runs queue up while previous runs are still executing.
- <Constant name="dbt_platform" /> starts cancelling queued runs to prevent infinite backlog.

When this happens, remediation is non-trivial. You need to either refactor the job to run faster (prune model selection, adjust threads, optimize SQL) or relax the schedule and accept a looser freshness SLA.

#### Related scheduler constraints

- Run slots limit how many jobs can run concurrently. Frequent near real-time jobs can starve other deployment jobs if slot usage isn't planned.
- The scheduler runs distinct executions of the same job serially. If one run is still in progress when the next cron fires, the second run must wait (or be cancelled in an over-scheduled scenario).

## Warehouse cost and utilization

As the gap between job runtime and schedule interval shrinks, your warehouse is effectively running continuously to keep up with back-to-back transformation windows.

**Cost scaling example:**
- Daily job: Warehouse runs 30 min/day = ~2% utilization
- Hourly job: Warehouse runs 30 min × 24 = 12 hours/day = 50% utilization
- 5-minute job: Warehouse runs nearly 24/7 = ~100% utilization

On platforms like Snowflake, ingestion options like Snowpipe for high-volume real-time feeds can be very expensive (cost per 1,000 files plus compute).

Warehouse-managed options for freshness (for example, dynamic tables and materialized views) can also be harder to predict and monitor from a cost perspective, especially when underlying data is changing frequently.

The net effect: you should treat near real-time SLAs as a premium service and pressure-test whether the business really needs minute-level freshness on each workload.

## Lambda view DAG complexity and correctness

If you're using the [lambda views pattern](/best-practices/how-we-handle-real-time-data/4-lambda-views), you face additional complexity:

- **Duplicated logic**: You either centralize SQL in macros (more DRY, less readable) or duplicate the same transformations in both history (HIST) and NRT flows (more readable, more to maintain).
- **Complex DAGs**: Every "product" model now has at least three artifacts (HIST table, NRT view, lambda union), plus supporting upstream layers.
- **Materialization brittleness**: The pattern depends on specific materializations (views vs incrementals). A seemingly harmless materialization change can break freshness or correctness.

On top of that, community experience has surfaced timing gaps between HIST and NRT flows:

- Views (NRT) often update much faster than incremental tables. During a run, the NRT side may start filtering on the new `max(event_ts)` before the incremental table has finished loading, producing temporary holes in the unioned lambda view where recent data disappears briefly.
- One way to mitigate is to introduce an explicit dependency from NRT to the incremental model (for example, a manual dependency on `{{ ref('fct_events') }}` comment), but this is somewhat brittle and increases coupling.


## Job reliability and resource limits

High-frequency jobs are more likely to surface job-level failures:

- **Memory limits**
  - Memory-heavy macros (for example, large `run_query()` results) or big doc-generation steps can hit account-level memory limits.
  - This causes runs to terminate with "memory limit" errors.

- **Auto-deactivation**
  - A job that fails repeatedly can be auto-deactivated after 100 consecutive failures.
  - When this happens, scheduled triggers stop until someone manually intervenes.

- **Smaller margin for error**
  - A flaky model, test, or small regression can quickly generate many failed runs.
  - This creates noisy alerts and can hit the auto-deactivation threshold faster.

## Ingestion architecture dependencies

Lambda views and NRT dbt jobs sit on top of your ingestion architecture:

- **The dependency**
  - If ingestion latency or throughput degrades (issues in a task/stream pipeline, backlogs in storage, intermittent Snowpipe delays), the lambda view can only union what has already arrived.
  - You can't make data fresher than your ingestion layer allows.

- **What you end up tuning**
  - Task cadences and partition strategies in the landing zone
  - Lambda overlap windows and incremental look-backs
  - Which sources really need to participate in the NRT path

## Conclusion

These challenges are why we position lambda views and ultra-frequent dbt schedules as special-case patterns. They're powerful when you truly need them, but they require deliberate design around scheduler behavior, cost, DAG structure, and ingestion architecture. In many cases, they're better replaced by [dynamic tables](/best-practices/how-we-handle-real-time-data/3-warehouse-native-features#dynamic-tables), [materialized views](/best-practices/how-we-handle-real-time-data/3-warehouse-native-features#materialized-views), or a dedicated streaming stack.
