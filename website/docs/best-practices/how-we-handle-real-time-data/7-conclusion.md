---
title: "Choosing the right freshness pattern"
description: Decision framework and resources for implementing near real-time data with dbt
hoverSnippet: Choose the right pattern for your near real-time data requirements
---

You've now seen multiple patterns for achieving near real-time data freshness with dbt. This page provides a decision framework to help you choose the right approach and links to helpful resources.

---

## Quick decision tree

```
Start here: What's your freshness requirement?
│
├─ Hourly or slower
│  └─> Use standard incremental models with hourly/daily schedules
│
├─ 15-30 minutes
│  └─> Incremental models with frequent scheduling
│     └─> Start with Pattern 1 (MERGE)
│
├─ 5-15 minutes (near real-time)
│  ├─> Do you have heavy aggregations or complex logic?
│  │   ├─ Yes → Incremental models (Pattern 1-3) + high-frequency scheduling
│  │   └─ No → Consider Dynamic Tables (Pattern 4) for simplicity
│  │
│  └─> Is this Snowflake with frequent updates?
│      └─> Consider CDC with Streams (Pattern 2)
│
├─ 1-5 minutes (near real-time)
│  ├─> Snowflake → Consider Dynamic Tables with low target_lag
│  ├─> Need full dbt control → Lambda views (Pattern 5)
│  └─> Very lightweight transforms → Views-only (Pattern 6)
│
└─ Sub-second (true real-time)
   └─> dbt is not the right tool
       └─> Use streaming database (ClickHouse, Materialize, Rockset)
           dbt can still handle historical/analytical tables
```

---

## Pattern comparison matrix

| Pattern | Freshness | Complexity | Cost | Control | Best For |
|---------|-----------|------------|------|---------|----------|
| **Standard Incremental** | Hours | Low | Low | High | Most use cases |
| **Pattern 1: MERGE** | 5-15 min | Medium | Medium | High | General near real-time |
| **Pattern 2: CDC Streams** | 5-15 min | Medium | Medium | High | Frequent updates (Snowflake) |
| **Pattern 3: Microbatch** | 5-15 min | Medium | Medium | High | Massive time-series tables |
| **Pattern 4: Dynamic Tables** | 1-15 min | Low | Medium-High | Low | Simple logic, Snowflake |
| **Pattern 5: Lambda Views** | 1-5 min | High | High | High | Custom dbt-only solution |
| **Pattern 6: Views-only** | <1 min | Low | Medium | High | Very lightweight transforms |

---

## Pattern selection guide

### Start with Pattern 1 (Incremental MERGE) if:
- ✅ You're new to near real-time patterns
- ✅ You need 5-15 minute freshness
- ✅ You want a well-understood, portable solution
- ✅ You have standard fact table workloads

### Upgrade to Pattern 2 (CDC with Streams) if:
- ✅ You're on Snowflake
- ✅ You have tables with frequent updates (not just inserts)
- ✅ You need efficient change capture
- ✅ You're comfortable with Snowflake-specific features

### Reach for Pattern 3 (Microbatch) if:
- ✅ You have massive tables (billions of rows)
- ✅ Backfills are slow and risky
- ✅ You need systematic late-data handling
- ✅ You can coordinate `event_time` across upstream models

### Consider Pattern 4 (Dynamic Tables) if:
- ✅ You're on Snowflake
- ✅ You want simple, declarative freshness
- ✅ You're okay with less control over scheduling
- ✅ Transformation logic is relatively straightforward

### Use Pattern 5 (Lambda Views) only if:
- ✅ Patterns 1-4 don't meet your needs
- ✅ You need 1-5 minute freshness
- ✅ You can't use Dynamic Tables
- ✅ Your team can handle the complexity

### Use Pattern 6 (Views-only) only if:
- ✅ Transformations are truly lightweight
- ✅ Source is continuously updated
- ✅ Table is small-to-medium sized
- ✅ You need maximum freshness preservation

---

## Implementation checklist

Before implementing any near real-time pattern:

### Prerequisites
- [ ] Continuous ingestion is already in place (Snowpipe, Fivetran, etc.)
- [ ] Ingestion latency meets your requirements
- [ ] Source data quality is reliable
- [ ] You've documented the business case for near real-time data

### Technical readiness
- [ ] Incremental models run in < 50% of schedule interval
- [ ] Warehouse can handle increased load
- [ ] Monitoring and alerting are in place
- [ ] Team has capacity for increased operational complexity

### Cost planning
- [ ] You've modeled the cost of continuous warehouse usage
- [ ] Budget is approved for 5-10x increase in compute costs
- [ ] You have a plan to monitor and control costs
- [ ] You've identified which data truly needs near real-time freshness

### Operational readiness
- [ ] On-call rotation can handle high-frequency job failures
- [ ] Runbooks exist for common failure scenarios
- [ ] SLAs are defined and agreed upon
- [ ] You have a rollback plan if things go wrong

---

## Common anti-patterns to avoid

### ❌ Making everything real-time
**Problem:** Not all data needs the same freshness. Making everything near real-time adds cost and complexity without proportional value.

**Solution:** Use tiered freshness. Reserve near real-time for truly critical operational data.

### ❌ Over-scheduling jobs
**Problem:** Scheduling jobs more frequently than they can complete leads to queue buildup and cancelled runs.

**Solution:** Ensure job runtime is < 50% of schedule interval. Start with longer intervals and increase frequency gradually.

### ❌ Ignoring costs
**Problem:** Near real-time patterns can increase warehouse costs by 5-10x. Cost surprises lead to project cancellation.

**Solution:** Model costs upfront. Monitor actual vs. expected costs weekly. Have a cost containment plan.

### ❌ No monitoring
**Problem:** High-frequency jobs fail in new ways. Without monitoring, small issues become big problems.

**Solution:** Implement comprehensive monitoring of jobs, freshness, quality, and costs from day one.

### ❌ Premature optimization
**Problem:** Building complex near real-time patterns before validating the business need.

**Solution:** Start with hourly updates. Let users experience it. Upgrade to near real-time only if there's demonstrated value.

### ❌ Views everywhere
**Problem:** Starting with views-only pattern for complex transformations leads to performance issues.

**Solution:** Use incremental models as the default. Reserve views-only for truly lightweight transforms on small tables.

---

## Migration paths

### From hourly to near real-time

1. **Start:** Standard incremental models, hourly schedule
2. **Optimize:** Improve query performance, reduce runtime
3. **Increase frequency:** Move to every 15 minutes
4. **Monitor:** Watch costs, performance, failure rates
5. **Increase more:** Move to every 5 minutes if justified
6. **Evaluate alternatives:** Consider Dynamic Tables or Lambda Views if needed

### From Lambda Views to Dynamic Tables

If you're using Lambda Views and want to simplify:

1. **Validate compatibility:** Ensure your logic works in Dynamic Table format
2. **Test in dev:** Create Dynamic Table version alongside Lambda Views
3. **Compare freshness:** Verify Dynamic Tables meet your SLA
4. **Monitor costs:** Compare warehouse credit usage
5. **Migrate gradually:** Switch over one dashboard at a time
6. **Remove old pattern:** Clean up Lambda View artifacts

---

## Key takeaways

1. **dbt is batch-oriented**: It's great for near real-time (minutes), but not true streaming (sub-second)

2. **Start simple**: Use standard incremental models with reasonable schedules before reaching for advanced patterns

3. **Tier your freshness**: Not all data needs the same SLA. Reserve near real-time for high-value use cases

4. **Cost matters**: Near real-time patterns can increase costs by 5-10x. Make sure the business value justifies it

5. **Operational complexity**: High-frequency jobs require more monitoring, maintenance, and on-call support

6. **Choose the right tool**: For true streaming use cases, consider purpose-built streaming databases alongside dbt

7. **Monitor everything**: Jobs, costs, freshness, quality—all need comprehensive monitoring

8. **Be ready to adapt**: Start with one pattern, but be prepared to evolve as requirements change

---

## Additional resources

### Incremental Models
- [Incremental Models Overview](/docs/build/incremental-models-overview)
- [Microbatch Incremental Models](/docs/build/incremental-microbatch)
- [Configuring Incremental Models in dbt](/docs/build/incremental-models)

### Snowflake Dynamic Tables
- [Dynamic Tables: Delivering Declarative Streaming Data Pipelines](https://www.snowflake.com/en/blog/dynamic-tables-delivering-declarative-streaming-data-pipelines/)
- [Snowflake docs on Dynamic Tables](https://docs.snowflake.com/en/user-guide/dynamic-tables-intro)
- [Understanding dynamic table initialization and refresh](https://docs.snowflake.com/en/user-guide/dynamic-tables-refresh#understanding-target-lag)
- [Dynamic table limitations](https://docs.snowflake.com/en/user-guide/dynamic-tables-limitations)
- [Dynamic tables configurations in dbt](/reference/resource-configs/snowflake-configs#dynamic-tables)

### Materialized Views
- [Optimizing Materialized Views with dbt](/blog/announcing-materialized-views)
- [Snowflake Materialized Views](https://docs.snowflake.com/en/user-guide/views-materialized)
- [BigQuery Materialized Views](https://cloud.google.com/bigquery/docs/materialized-views-intro)
- [Databricks Materialized Views](https://docs.databricks.com/sql/language-manual/sql-ref-syntax-ddl-create-materialized-view.html)

### Lambda Views Pattern
- [How to create near real-time models with just dbt + SQL](https://discourse.getdbt.com/t/how-to-create-near-real-time-models-with-just-dbt-sql/1457) - Original community blog post

### Monitoring and Observability
- [Source Freshness](/docs/deploy/source-freshness)
- [dbt Test Documentation](/docs/build/data-tests)
- [Model Contracts](/docs/collaborate/govern/model-contracts)

### Data Warehouse Documentation
- [Snowflake Streams](https://docs.snowflake.com/en/user-guide/streams-intro)
- [Snowpipe](https://docs.snowflake.com/en/user-guide/data-load-snowpipe-intro)
- [BigQuery Streaming Inserts](https://cloud.google.com/bigquery/docs/streaming-data-into-bigquery)

---

## Getting help

If you're implementing near real-time patterns and need help:

- **[dbt Community Slack](https://www.getdbt.com/community/join-the-community/)** - `#advice-dbt-for-data-modeling` channel
- **[dbt Discourse](https://discourse.getdbt.com/)** - Search for "real-time" or "incremental"
- **[dbt Office Hours](https://www.getdbt.com/community/events/)** - Bring your specific questions
- **dbt Labs Professional Services** - For complex implementations

---

## What's next?

Now that you understand the patterns for near real-time data:

1. **Assess your requirements**: Do you really need minute-level freshness?
2. **Start conservative**: Begin with hourly or 15-minute schedules
3. **Measure baseline**: Establish costs and performance before optimizing
4. **Choose a pattern**: Use the decision tree above to select your starting pattern
5. **Implement monitoring**: Set up comprehensive observability from day one
6. **Iterate gradually**: Increase frequency only when business value is proven

Remember: **The best freshness pattern is the simplest one that meets your business requirements.**
