---
title: "Operational considerations for near real-time data"
description: Understand the challenges, risks, and costs of implementing near real-time data pipelines with dbt
hoverSnippet: Learn about operational challenges and risks for near real-time data patterns
---

Teams that implement very high-frequency dbt jobs tend to run into a consistent set of challenges, both at the **dbt scheduler** layer and in the **warehouse** itself. This page covers the common operational risks and how to mitigate them.

:::info Plan for complexity
Near real-time data patterns add significant operational overhead. Make sure the business value justifies the investment before committing to minute-level freshness SLAs.
:::

---

## Over-scheduled jobs and queue management

### The problem

If a job's **run duration is longer than its schedule frequency**, the job becomes *over-scheduled*: the queue grows faster than the scheduler can process runs, and dbt Cloud will start **cancelling queued runs** to avoid an ever-expanding backlog.

**Example scenario:**
- Your job is scheduled to run every 5 minutes
- The job typically takes 6-7 minutes to complete
- New runs queue up while previous runs are still executing
- dbt Cloud starts cancelling queued runs to prevent infinite backlog

This is easy to hit with near real-time patterns if your incremental build time creeps up (more models, more tests, more data) but the cron schedule stays aggressive.

### Impact

- **Data gaps**: Cancelled runs mean data doesn't get processed
- **Unpredictable freshness**: Freshness becomes inconsistent
- **Alert fatigue**: Cancelled runs trigger failure notifications
- **Debugging difficulty**: Hard to distinguish intentional cancellations from real failures

### Mitigation strategies

**1. Optimize job runtime**
- Prune model selection (only include models that need frequent updates)
- Increase thread count (if warehouse can handle it)
- Optimize slow-running SQL
- Use `dbt list` to audit model selection

**2. Adjust schedule frequency**
- Relax the schedule to match actual job runtime
- Accept a looser freshness SLA
- Consider if 15-minute updates are "good enough" vs. 5-minute

**3. Split jobs into smaller units**
- Separate high-frequency models from lower-frequency models
- Create dedicated jobs for different freshness requirements
- Use job dependencies to coordinate

**4. Use run slots wisely**
- Run slots limit concurrent job execution
- Frequent near-real-time jobs can starve other deployment jobs
- Plan slot allocation across all job types

### Related scheduler constraints

- **Serial execution**: Distinct executions of the same job run serially; if one run is still in progress when the next cron fires, the second run must wait (or be cancelled in an over-scheduled scenario)
- **Run slots**: Limit how many jobs can run concurrently across your entire account
- **Job dependencies**: Can help coordinate but also create bottlenecks

---

## Warehouse cost and utilization

### Continuous compute costs

As the gap between **job runtime and schedule interval** shrinks, your warehouse is effectively **running continuously** to keep up with back-to-back transformation windows.

**Cost implications:**
- Warehouse utilization approaches 100%
- You're paying for near-constant compute
- Cost scales linearly (or worse) with frequency

**Example:**
- Daily job: Warehouse runs 30 min/day = ~2% utilization
- Hourly job: Warehouse runs 30 min × 24 = 12 hours/day = 50% utilization
- 5-minute job: Warehouse runs nearly 24/7 = ~100% utilization

### Ingestion costs

On Snowflake, ingestion options like **Snowpipe** for high-volume real-time feeds can be very expensive:
- Cost per 1,000 files loaded
- Compute costs for processing
- Storage costs for staging files

**Tip:** Evaluate whether micro-batch ingestion (e.g., every 15 minutes) is "good enough" compared to true streaming ingestion (every few seconds).

### Warehouse-managed feature costs

Warehouse-managed options for freshness (e.g., **Dynamic Tables/materialized views**) can be harder to predict and monitor from a cost perspective:
- Refreshes happen automatically based on `target_lag`
- May refresh more frequently than needed
- Difficult to attribute costs to specific models
- Can create unexpected cost spikes

### Cost optimization strategies

**1. Right-size freshness requirements**
- Challenge every "real-time" requirement
- Many use cases work fine with 15-30 minute latency
- Reserve minute-level freshness for truly critical dashboards

**2. Use tiered freshness**
- Not all data needs the same freshness
- Critical operational metrics: 5 minutes
- Standard dashboards: 1 hour
- Historical reports: Daily

**3. Implement warehouse auto-suspend**
- Configure aggressive auto-suspend for transformation warehouses
- Use separate warehouses for different freshness tiers
- Monitor actual utilization vs. capacity

**4. Monitor and alert on costs**
- Set up cost monitoring dashboards
- Alert on unexpected cost increases
- Track cost per model or job

**5. Consider serverless options**
- Snowflake Serverless features
- BigQuery on-demand pricing
- Databricks serverless SQL

---

## DAG complexity and maintainability

### Lambda view challenges

If you're using the [lambda views pattern](/best-practices/how-we-handle-real-time-datas/4-lambda-views), you face additional complexity:

**Duplicated logic:**
- You either centralize SQL in macros (more DRY, less readable)
- Or duplicate the same transformations in both HIST and NRT flows (more readable, more to maintain)

**Complex DAGs:**
- Every "product" model now has at least three artifacts (HIST table, NRT view, lambda union)
- Plus supporting upstream layers
- DAG becomes harder to understand and maintain

**Materialization brittleness:**
- The pattern *depends* on specific materializations (views vs incrementals)
- A seemingly harmless materialization change can break freshness or correctness

### Timing issues

Community experience has surfaced **timing gaps** between HIST and NRT flows:

**The problem:**
- Views (NRT) often update much faster than incremental tables
- During a run, the NRT side may start filtering on the *new* `max(event_ts)` before the incremental table has finished loading
- This produces temporary **holes in the unioned lambda view**

**Example:**
```
10:00 - Job starts
10:02 - fct_events HIST table is being updated (50% complete)
10:02 - User queries lambda view
10:02 - NRT view reads max(event_ts) from partially-loaded HIST
10:02 - Recent data temporarily disappears from the union
10:05 - Job completes, data reappears
```

**Mitigation:**
- Introduce explicit dependency from NRT to incremental model
- Add time buffer in NRT filter (e.g., `max(event_ts) - interval '1 minute'`)
- Document expected behavior for end users

### Maintenance burden

More models = more maintenance:
- More tests to write and maintain
- More documentation to keep current
- More alert noise when things break
- Higher cognitive load for team members

---

## Job reliability and resource limits

### Memory limits

High-frequency jobs are more likely to surface **job-level failures**:

- Memory-heavy macros (e.g., large `run_query()` results pulled back into dbt)
- Big doc-generation steps
- Can hit **account-level memory limits**, causing runs to terminate with "memory limit" errors

**Impact:**
- Job failures
- Incomplete data processing
- Difficult to debug (memory limits often not obvious)

**Mitigation:**
- Minimize use of `run_query()` in frequently-run jobs
- Move heavy operations to warehouse (SQL) instead of dbt (Python/Jinja)
- Consider disabling docs generation for high-frequency jobs
- Split large jobs into smaller ones

### Auto-deactivation risk

A job that fails repeatedly can be **auto-deactivated** after 100 consecutive failures:
- Scheduled triggers stop enqueuing runs
- Requires manual intervention to reactivate
- Easy to miss if alerts are being ignored due to alert fatigue

**With high-frequency jobs:**
- Margin for error shrinks
- A flaky model/test can quickly generate many failed runs
- Can hit auto-deactivation threshold quickly

**Mitigation:**
- Implement robust error handling
- Use `dbt retry` for transient failures
- Monitor failure rates, not just individual failures
- Fix flaky tests immediately

### Resource contention

High-frequency jobs can create resource contention:
- **Warehouse queuing**: If warehouse is busy, queries queue
- **Lock contention**: MERGE operations acquire locks, can conflict
- **Storage I/O**: High-frequency writes can impact read performance

---

## Ingestion architecture dependencies

Near real-time dbt jobs sit **on top of** your ingestion architecture. If ingestion has issues, dbt cannot compensate.

### Common ingestion bottlenecks

**Snowpipe delays:**
- Intermittent backlogs
- File processing delays
- Configuration issues

**Task/stream pipeline issues:**
- Task failures
- Stream offset problems
- Schedule coordination

**Blob storage problems:**
- File arrival delays
- Partition problems
- Network issues

### What this means for dbt

- Lambda views and near-real-time patterns can only union **what has arrived**
- Ingestion latency directly impacts end-to-end freshness
- You need to monitor and optimize **both** ingestion and transformation

### Tuning requirements

In real deployments, you often end up tuning:
- Task cadences in the landing zone
- Partition strategies
- Lambda overlap windows
- Incremental look-backs
- Which sources *really* need to participate in the near-real-time path

---

## Monitoring and alerting

Successful near real-time implementations require robust monitoring:

### Job-level monitoring

- **Run duration trends**: Catch performance degradation early
- **Success/failure rates**: Distinguish patterns from one-off failures
- **Queue depth**: Detect over-scheduling before it becomes critical
- **Cancellation frequency**: Monitor cancelled runs

### Data-level monitoring

- **Freshness tests**: Alert when data goes stale
```yaml
sources:
  - name: raw
    tables:
      - name: events
        freshness:
          warn_after: {count: 10, period: minute}
          error_after: {count: 30, period: minute}
```

- **Row counts**: Detect missing or duplicate data
- **Schema changes**: Catch breaking changes
- **Data quality tests**: Ensure correctness at high frequency

### Cost monitoring

- **Warehouse credit consumption**: Track costs by job/model
- **Query costs**: Monitor expensive queries
- **Storage costs**: Track table growth
- **Ingestion costs**: Monitor Snowpipe or similar costs

### End-to-end monitoring

- **SLA tracking**: Measure actual freshness vs. target
- **User-facing metrics**: Monitor dashboard performance
- **Alert fatigue**: Track alert volume and response times

---

## Decision framework: Is near real-time worth it?

Before implementing near real-time patterns, ask:

### Business value questions

1. **What decisions will be made differently with minute-fresh vs hour-fresh data?**
2. **What is the actual business impact of the delay?**
3. **Are users actually looking at dashboards continuously, or checking periodically?**
4. **Can we start with hourly and upgrade to near-real-time if needed?**

### Technical feasibility questions

1. **Do we have continuous ingestion already in place?**
2. **Can our incremental models run in < 5 minutes?**
3. **Do we have capacity to monitor and maintain high-frequency jobs?**
4. **Can our warehouse handle the increased load?**

### Cost-benefit questions

1. **What is the incremental cost of 5-minute vs hourly refreshes?**
2. **Is there budget for 24/7 warehouse utilization?**
3. **Do we have engineering capacity for increased operational complexity?**
4. **Can we absorb the cost of mistakes (duplicate data, failed jobs, etc.)?**

---

## Best practices summary

1. **Start conservative**: Begin with hourly, then increase frequency if needed
2. **Measure first**: Establish baseline costs and performance before optimizing for speed
3. **Tier your freshness**: Not all data needs the same SLA
4. **Monitor everything**: Jobs, costs, freshness, quality
5. **Plan for failure**: Near real-time patterns fail in new and interesting ways
6. **Document decisions**: Record why certain data needs certain freshness
7. **Review regularly**: Reassess freshness requirements quarterly

Near-real-time SLAs should be treated as a **premium service** with premium costs and complexity. Make sure the business value justifies the investment.
