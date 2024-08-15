---
title: MetricFlow time spine
id: metricflow-time-spine
description: "MetricFlow expects a default timespine table called metricflow_time_spine"
sidebar_label: "MetricFlow time spine"
tags: [Metrics, Semantic Layer]
---

It's common in analytics engineering to have a date dimension or "time spine" table as a base table for different types of time-based joins and aggregations. The structure of this table is typically a base column of daily or hourly dates, with additional columns for other time grains, like fiscal quarter, defined based on the base column. You can join other tables to the time spine on the base column to calculate metrics like revenue at a point in time, or to aggregate to a specific time grain.

MetricFlow requires you to define a time spine table as a project level configuration, which then is used for various time-based joins and aggregations, like cumulative metrics. At a minimum, you need to define a time spine table for a daily grain. You can optionally define a time spine table for a different granularity, like hourly.

If you already have a date dimension or time spine table in your dbt project, you can point MetricFlow to this table by updating the `model` configuration to use this table in the Semantic Layer. For example, given the following directory structure, you can create two time spine configurations, `time_spine_hourly` and `time_spine_daily`. 

::tip 
Previously, you were required to create a model called `metricflow_time_spine` in your dbt project. This is no longer required. However, you can build your time spine model from this table if you don't have another date dimension table you want to use in your project.
:::

<Lightbox src="/img/time_spines.png" title="Time spine directory structure" />


```yaml
models:
  - name: time_spine_hourly
    time_spine:
      standard_granularity_column: date_hour # column for the standard grain of your table
    columns:
      - name: date_hour
        granularity: hour # set granularity at column-level for standard_granularity_column
  - name: time_spine_daily
    time_spine:
      standard_granularity_column: date_day # column for the standard grain of your table
    columns:
      - name: date_day
        granularity: day # set granularity at column-level for standard_granularity_column
```

Now, break down the configuration above. It's pointing to a model called `time_spine_daily`. It sets the time spine configurations under the `time_spine` key. The `standard_granularity_column` is the lowest grain of the table, in this case, it's hourly. It needs to reference a column defined under the columns key, in this case, `date_hour`. Use the `standard_granularity_column` as the join key for the time spine table when joining tables in MetricFlow. Here, the granularity of the `standard_granularity_column` is set at the column level, in this case, `hour`.


If you need to create a time spine table from scratch, you can do so by adding the following code to your dbt project. 
The example creates a time spine at a daily grain and an hourly grain. A few things to note when creating time spine models:
* MetricFlow will use the time spine with the largest compatible granularity for a given query to ensure the most efficient query possible. For example, if you have a time spine at a monthly grain, and query a dimension at a monthly grain, MetricFlow will use the monthly time spine. If you only have a daily time spine, MetricFlow will use the daily time spine and date_trunc to month.
* You can add a time spine for each granularity you intend to use if query efficiency is more important to you than configuration time, or storage constraints. For most engines, the query performance difference should be minimal and transforming your time spine to a coarser grain at query time shouldn't add significant overhead to your queries.
* We recommend having a time spine at the finest grain used in any of your dimensions to avoid unexpected errors. i.e., if you have dimensions at an hourly grain, you should have a time spine at an hourly grain.

<File name='time_spine_daily.sql'>

<VersionBlock lastVersion="1.6">

```sql
{{
    config(
        materialized = 'table',
    )
}}

with days as (

    {{
        dbt_utils.date_spine(
            'day',
            "to_date('01/01/2000','mm/dd/yyyy')",
            "to_date('01/01/2025','mm/dd/yyyy')"
        )
    }}

),

final as (
    select cast(date_day as date) as date_day
    from days
)

select * from final
-- filter the time spine to a specific range
where date_day > dateadd(year, -4, current_timestamp()) 
and date_hour < dateadd(day, 30, current_timestamp())
```

</VersionBlock>

<VersionBlock firstVersion="1.7">

```sql
{{
    config(
        materialized = 'table',
    )
}}

with days as (

    {{
        dbt.date_spine(
            'day',
            "to_date('01/01/2000','mm/dd/yyyy')",
            "to_date('01/01/2025','mm/dd/yyyy')"
        )
    }}

),

final as (
    select cast(date_day as date) as date_day
    from days
)

select * from final
where date_day > dateadd(year, -4, current_timestamp()) 
and date_hour < dateadd(day, 30, current_timestamp())
```

</VersionBlock>

</File>

<VersionBlock lastVersion="1.6">

```sql
-- filename: metricflow_time_spine.sql
-- BigQuery supports DATE() instead of TO_DATE(). Use this model if you're using BigQuery
{{config(materialized='table')}}
with days as (
    {{dbt_utils.date_spine(
        'day',
        "DATE(2000,01,01)",
        "DATE(2025,01,01)"
    )
    }}
),

final as (
    select cast(date_day as date) as date_day
    from days
)

select *
from final
-- filter the time spine to a specific range
where date_day > dateadd(year, -4, current_timestamp()) 
and date_hour < dateadd(day, 30, current_timestamp())
```

</VersionBlock>

<VersionBlock firstVersion="1.7">

```sql
-- filename: metricflow_time_spine.sql
-- BigQuery supports DATE() instead of TO_DATE(). Use this model if you're using BigQuery
{{config(materialized='table')}}
with days as (
    {{dbt.date_spine(
        'day',
        "DATE(2000,01,01)",
        "DATE(2025,01,01)"
    )
    }}
),

final as (
    select cast(date_day as date) as date_day
    from days
)

select *
from final
-- filter the time spine to a specific range
where date_day > dateadd(year, -4, current_timestamp()) 
and date_hour < dateadd(day, 30, current_timestamp())
```

</VersionBlock>

## Hourly time spine
<File name='time_spine_hourly.sql'>

```sql
-- filename: metricflow_time_spine_hour.sql
{{
    config(
        materialized = 'table',
    )
}}

with hours as (

    {{
        dbt.date_spine(
            'hour',
            "to_date('01/01/2000','mm/dd/yyyy')",
            "to_date('01/01/2025','mm/dd/yyyy')"
        )
    }}

),

final as (
    select cast(date_hour as timestamp) as date_hour
    from hours
)

select * from final
-- filter the time spine to a specific range
where date_day > dateadd(year, -4, current_timestamp()) 
and date_hour < dateadd(day, 30, current_timestamp())
```
</File>
