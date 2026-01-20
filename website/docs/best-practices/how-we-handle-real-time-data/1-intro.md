---
title: "Near real-time data in dbt"
description: Learn how to achieve near real-time data freshness with dbt through streaming ingestion and frequent transformations
hoverSnippet: Learn how to achieve near real-time data freshness with dbt
---

dbt is designed for batch-oriented data processing, working more like a scheduled report that runs at set intervals, with a clear defined start and end time. For instant, real-time data updates (think: stock tickers updating every second), we recommend using your data wa
 designed for true streaming or real-time data processing.

To get data that's "fresh enough" for business decisions, you combine two things:

1. **Continuous data collection** - Your data warehouse is constantly receiving new information (like customer orders, website clicks, etc.)
2. **Frequent processing** - dbt runs every few minutes (instead of once a day) to clean and organize that data for reports and dashboards

**How Fresh Can You Get?**

- **Near real-time**: Data updates every 1-15 minutes - good enough for most operational dashboards
- **True real-time** (sub-second updates): You'll need different tools; dbt isn't the right fit

**The Tradeoffs:**

- **Fresher data = higher costs** - Running updates every 5 minutes instead of every hour means your data warehouse is working constantly, which costs more
- **More complexity** - You need to carefully monitor and tune your systems to keep everything running smoothly
- **Business value question** - Do you really need minute-by-minute data, or would hourly updates work just as well?

**Bottom Line:**

You can absolutely get near real-time data with dbt (minutes-fresh, not seconds-fresh), but it requires more infrastructure cost and operational effort. Make sure the business value of having that fresh data justifies the additional investment.

---

## Overview

**dbt does not natively support true streaming or real-time data processing.** Its core paradigm is batch-oriented, with jobs that have a defined start and end, making it a challenging fit for continuous, sub-second streaming use cases. Our core recommendations are: leverage your data warehouse's streaming ingestion (like Snowpipe for Snowflake), use dbt to transform that data with high-frequency scheduled jobs, and consider materialized views or dynamic tables for minimal-latency reporting.

## Key Recommendations for Near Real-Time Data with dbt

- **Ingest Data Continuously:** Use your warehouse's native streaming or micro-batch ingestion (e.g., Snowpipe for Snowflake, Fivetran for batch loads) to land raw data as soon as it arrives. This minimizes latency before dbt transformations even begin.
- **Transform with dbt on a Frequent Schedule:** Schedule dbt jobs to run as often as your business needs allow (e.g., every 1–15 minutes). The actual frequency should balance data freshness with cost and resource constraints.
- **Materialized Views & Dynamic Tables:** For the lowest-latency reporting, use materialized views or dynamic tables. These can be refreshed as frequently as every minute, providing "near real-time" access for BI tools.
- **Incremental Models & Microbatching:** Use dbt's incremental models to process only new or changed data, which is essential for keeping transformations efficient and scalable as data volumes grow.
- **Decouple Ingestion from Transformation:** Keep data acquisition (ingestion) and transformation (dbt) flows separate. This allows you to optimize each independently and troubleshoot more easily.
- **Monitor and Test Data Freshness:** Implement data quality checks and freshness monitoring in dbt to ensure your near real-time pipelines are delivering accurate, up-to-date results.
- **Cost and Complexity Considerations:** Be aware that increasing data freshness (i.e., running dbt jobs more frequently) will drive up compute costs and operational complexity. Always weigh the business value of "real-time" against these trade-offs.

---

## How streaming / real-time data fits with dbt

### dbt's role

- dbt runs **discrete jobs** (CLI, dbt Cloud, Airflow, etc.); it does not keep a long-running streaming compute process alive.
- Teams that need "real-time" usually end up with **two layers**:
    - **Ingestion / streaming layer** (Snowpipe, Snowpipe Streaming, Kafka → Snowflake, Fivetran, etc.) to land events continuously.
    - **dbt layer** to do **micro-batch transformations** (e.g. every 1–15 minutes) using incremental or microbatch models, or Snowflake **Dynamic Tables** where appropriate.

### When dbt is a good fit

- **Near real-time (minutes)**:
    - Incremental models with **merge** or **append**.
    - Or **microbatch** incremental strategy for large time-series tables.
    - Jobs scheduled very frequently (e.g. every 5 minutes) or Dynamic Tables with `target_lag` of a few minutes on Snowflake.
- **True streaming / sub-second** dashboards often use a **streaming database** (ClickHouse, Materialize, Rockset, etc.) in front of or alongside dbt; dbt still owns "analytic" tables and history but not the ultra-low-latency read path.

---

## What's in this guide

This guide covers multiple patterns for achieving near real-time data freshness with dbt:

1. **[Incremental patterns](/best-practices/how-we-handle-real-time-datas/2-incremental-patterns)** - MERGE strategies, CDC with Snowflake Streams, and microbatch processing
2. **[Warehouse-native features](/best-practices/how-we-handle-real-time-datas/3-warehouse-native-features)** - When to use Dynamic Tables and Materialized Views instead
3. **[Lambda views pattern](/best-practices/how-we-handle-real-time-datas/4-lambda-views)** - Combining batch and real-time data in a single view
4. **[Views-only pattern](/best-practices/how-we-handle-real-time-datas/5-views-only-pattern)** - Maximum freshness for lightweight transformations
5. **[Operational considerations](/best-practices/how-we-handle-real-time-datas/6-operational-considerations)** - Challenges, risks, and cost management

Each pattern includes practical code examples, use cases, and tradeoffs to help you choose the right approach for your requirements.
