---
title: MetricFlow time spine
id: metricflow-time-spine
description: "MetricFlow expects a default timespine table called metricflow_time_spine"
sidebar_label: "MetricFlow time spine"
tags: [Metrics, Semantic Layer]
---

MetricFlow uses a timespine table to construct cumulative metrics. By default, MetricFlow expects the timespine table to be named `metricflow_time_spine` and doesn't support using a different name.

To create this table, you need to create a model in your dbt project called `metricflow_time_spine` and add the following code:

```sql
filename: metricflow_time_spine.sql
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
            "to_date('01/01/2027','mm/dd/yyyy')"
        )
    }}

),

final as (
    select cast(date_day as date) as date_day
    from days
)

select * from final
```
```sql
--- BigQuery supports DATE() instead of TO_DATE(). Use this model if you're using BigQuery
{{config(materialized='table')}}
with days as (
    {{dbt_utils.date_spine('day'
    , "DATE(2000,01,01)"
    , "DATE(2030,01,01)"
    )
    }}
),

final as (
    select cast(date_day as date) as date_day
    from days
)

select *
from final
```
You only need to include the `date_day` column in the table. MetricFlow can handle broader levels of detail, but it doesn't currently support finer grains.
