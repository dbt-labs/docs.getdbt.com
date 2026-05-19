---
title: "Cost Insights in the dbt platform"
sidebar_label: "About Cost Insights"
description: "Track warehouse compute costs and understand the impact of optimizations across your dbt projects and models." 
id: "cost-insights"
tags: ['SAO', 'cost savings', 'models built', 'cost insights', 'cost reductions', 'cost optimizations']
---

# Cost Insights <Lifecycle status="beta,managed,managed_plus" />

Cost Insights shows estimated costs and compute time for your dbt projects and models directly in the <Constant name="dbt_platform" />, so you can measure and share the impact of optimizations like [state-aware orchestration](/docs/deploy/state-aware-about).

[State-aware orchestration](/docs/deploy/state-aware-about) makes your dbt workflows more efficient by reusing models and tests instead of running full rebuilds. When this is enabled, Cost Insights helps you demonstrate the resulting cost reductions and efficiency gains. These cost and cost reduction estimates are based on a retroactive analysis of runs after you enable <Constant name="fusion" /> and state-aware orchestration. They reflect actual historical usage, _not_ forecasts of future costs or cost reductions.

With Cost Insights, you can see:

- **How much your dbt models cost to run**: See the compute cost and times for each model and job in your warehouse's native units.
- **The cost reductions from using state-aware orchestration**: Understand the cost reduction when state-aware orchestration reuses unchanged models.
- **Cost trends over time**: Track your warehouse spend and optimization impact across your dbt projects.
- **Filter by asset type**: On Cost Insights charts (**Cost**, **Usage**, **Query run time**, **Builds**), use the **Assets** dropdown menu to filter data by **Models**, **Tests**, or **All**. Each tab keeps its own selection.

The Cost Insights section is available in different <Constant name="dbt_platform" /> areas and lets you view your cost data and the impact of state-aware optimizations across various dimensions:

- [Project dashboard](/docs/explore/explore-cost-data#project-dashboard)
- [Catalog on Model page](/docs/explore/explore-cost-data#model-performance-in-catalog)
- [Job details page](/docs/explore/explore-cost-data#job-details) 

<DocCarousel slidesPerView={1}>

<Lightbox src="/img/docs/dbt-platform/cost-insights/cost-insights-project.png" title="Cost Insights in the project dashboard"/>

<Lightbox src="/img/docs/dbt-platform/cost-insights/cost-insights-model.png" title="Cost Insights in Catalog"/>

<Lightbox src="/img/docs/dbt-platform/cost-insights/cost-insights-job.png" title="Cost Insights in job details"/>

</DocCarousel>

## Prerequisities

import ViewCostData from '/snippets/_cost-insights-view.md';

<ViewCostData />

For setup instructions, see [Set up Cost Insights](/docs/explore/set-up-cost-insights).

## Understanding cost and reduction estimates

:::note
Cost estimates are intended for visibility and optimization, not billing reconciliation.
:::

dbt calculates the cost of running your dbt models using your data warehouse's usage metadata and billing context. dbt computes costs daily using up to the _last seven days of available data_.

### Warehouse-specific logic

The following sections explain how costs are calculated for each supported warehouse. Expand each section to view the details.

<Expandable alt_header="Snowflake">

dbt computes Snowflake query costs using Snowflake's query attribution data and your credit price (`price_per_credit`). Query attribution data is always available for Snowflake. dbt pulls the `per_credit` price directly from Snowflake when available; otherwise, dbt uses the configured or default value in the <Constant name="dbt_platform" />. For more information about configuring or viewing these values, see [Configure Cost Insights settings](/docs/explore/set-up-cost-insights#configure-cost-insights-settings-optional).

Formula:
```
credits_per_query * price_per_credit
```

Where:
- `credits_per_query` - Cloud services, compute, and query acceleration credits attributed to the query. dbt sources this value from `QUERY_ATTRIBUTION_HISTORY`. For more information, see the [Snowflake documentation](https://docs.snowflake.com/en/sql-reference/account-usage/query_attribution_history).      
- `price_per_credit` - Your Snowflake credit price (from Snowflake system tables when available, otherwise from your configured input or the default rate).
</Expandable>

<Expandable alt_header="BigQuery">

BigQuery does not expose per-query cost directly in system tables. Instead, dbt estimates cost by combining _query usage_ with a _pricing input_ (either from your configuration or the default rate).

- **On-demand pricing**

    The cost is determined by how much data each query processes. The usage shows the amount of that data billed for the query.

    Formula:
    ```
    data_processed_per_query * price_per_tib
    ```

    Where:
    - `data_processed_per_query` - Total data billed for the query (normalized to TiB). dbt sources this value from `information_schema.jobs.total_bytes_billed`. For more information, see the [BigQuery documentation](https://docs.cloud.google.com/bigquery/docs/information-schema-jobs).
    - `price_per_tib` - BigQuery on-demand price per TiB (from your configuration or the default rate).
        
- **Capacity pricing (reservations)**

    The cost is determined by how long each query runs on reserved compute. The usage shows the amount of that reserved compute time consumed by a query.

    Formula:
    ```
    compute_time_per_query * price_per_slot_hour
    ```

    Where:
    - `compute_time_per_query` - Total slot time used by the query (in hours). dbt sources this value from `information_schema.jobs.total_slot_ms`. For more information, see the [BigQuery documentation](https://docs.cloud.google.com/bigquery/docs/information-schema-jobs).
    - `price_per_slot_hour` - BigQuery capacity price per slot-hour (from your configuration or the default rate)

- **Cached queries**
    Queries served from cache do not consume compute and are counted as $0.

</Expandable>

<Expandable alt_header="Databricks">

Databricks does not directly attribute usage to individual queries. Instead, dbt estimates per-query cost by proportionally allocating Databricks Units (DBUs) based on how long each query ran during a billing period.

- Queries that run longer receive a larger share of usage.
- Usage is converted to dollars using your list price.

Formula:
```
usage_per_query * cost_per_dbu
```

Where:
- `usage_per_query` - DBUs attributed to the query.
- `cost_per_dbu` - Dollar cost per DBU for the relevant stock-keeping unit. For information about the pricing system table, see the [Databricks documentation](https://docs.databricks.com/aws/en/admin/system-tables/pricing).

Databricks reports usage in billing windows. These windows are periods of time where a compute resource consumed a known number of DBUs. Queries have their own start and end times. For information about the billing usage system table, see the [Databricks documentation](https://docs.databricks.com/aws/en/admin/system-tables/billing).

To attribute usage to queries:

1. dbt identifies which billing windows each query overlaps.
2. dbt calculates how long the query ran during each window.
3. dbt allocates DBUs _proportionally_ based on the query’s share of total execution time on that compute resource during the same window.

Conceptually:
```
DBUs_in_window * (query_runtime / total_query_runtime_in_window)
```

dbt sums this across all overlapping windows to get `usage_per_query`.
</Expandable>

### Cost reduction calculation

dbt calculates cost reductions by comparing actual costs to what costs would have been _without model reuse_. To do this, dbt uses data from the last seven days (where available) and performs the following steps:

1. Calculates the average cost per model build.
2. Counts how many times a model was reused instead of rebuilt. 
3. Multiplies the reused model count by the average cost per build to determine total cost reduction.

Formula:
```
average_cost_per_build * reuse_count
```

dbt calculates reductions per model and per deployment environment (production and staging), based on recent historical runs.

Additional notes:
- dbt calculates estimated costs and savings daily.
- Pricing inputs come from warehouse system tables (where available), connection-level configuration, or default list prices.

#### Example

The following example shows how dbt calculates cost reductions. Looking back seven days, assuming a model runs on two distinct days:

| Day | Total cost | Total executions |
|-----|------------|------------------|
| Day 1 | $5 | 5 |
| Day 2 | $10 | 10 |
| **Total** | **$15** | **15** |
<br></br>

The average cost per execution: $15 ÷ 15 runs = $1 per run

If the model was _reused_ eight times instead of rebuilt during this same period, the estimated cost reduction is: $1 average cost per run * 8 reuses = $8

## Considerations

Keep the following in mind when using Cost Insights:

**Data collection and refresh**
- Cost Insights uses your platform metadata credentials to access warehouse system tables. No separate credentials are needed beyond the platform metadata setup.
    - You need sufficient [permissions](/docs/explore/set-up-cost-insights#configure-platform-metadata-credentials) to query warehouse metadata tables.
- Cost data is calculated _once per day_ by a scheduled job that runs at approximately 17:00 UTC.
- The data collection job processes completed calendar days only. It does not include the current day because warehouse usage data may still be incomplete.
    - Jobs that ran yesterday (or earlier) will have cost data available after the next daily refresh.
    - Jobs that ran today will not have cost data until the following day’s refresh, regardless of what time they ran. 
- If you don’t see cost data for a recent job, make sure at least one full calendar day has passed since it ran. The **Updated** badge in the **Cost Insights** section shows when the last refresh occurred.

**Cost accuracy**
- dbt calculates costs using warehouse-reported usage data and applies default credit or compute costs based on standard warehouse pricing.
- If you have custom pricing agreements with your warehouse provider, override the default values in your account settings to ensure accurate cost reporting. For more information, see [Set up Cost Insights](/docs/explore/set-up-cost-insights#configure-cost-insights-settings-optional).
- Update your cost variables whenever your warehouse pricing contracts change to maintain accurate tracking.
- Changes to cost variables only apply to future calculations &mdash; historical cost data remains unchanged.

**Optimization data**
- Optimization and usage reduction data is available once state-aware orchestration is enabled and begins reusing models across runs.
- For accounts already using state-aware orchestration, run at least one full model build within the last 10 days before enabling Cost Insights to establish a baseline for cost reduction calculations. If you don't see cost reduction data, run a full build to establish the baseline.
- Cost Insights currently calculates estimated reductions in warehouse compute usage at the model level and will expand to include tests and seeds in the future.

**Exporting data**
- You can export cost data as a CSV file for further analysis and reporting. For more information, see [Explore cost data](/docs/explore/explore-cost-data).

## Related FAQs

<FAQ path="Cost optimizations/actual-vs-displayed-costs" />
<FAQ path="Cost optimizations/cost-data-refresh-frequency" />
<FAQ path="Cost optimizations/troubleshooting-cost-data" />
<FAQ path="Cost optimizations/metadata-warehouse-costs" />
<FAQ path="Cost optimizations/job-frequency" />


