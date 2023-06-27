---
title: MetricFlow time spine
id: metricflow-time-spine
description: "MetricFlow expects a default timespine table called metricflow_time_spine"
sidebar_label: "MetricFlow time spine"
tags: [Metrics, Semantic Layer]
---

MetricFlow uses a timespine table to construct cumulative metrics. The default name for this table is `metricflow_time_spine`. To create this table, you need to create a model in your dbt project called `metricflow_time_spine` and add the following code:

```sql
-- metricflow_time_spine.sql
with days as (
    {{dbt_utils.date_spine('day'
    , "to_date('01/01/2000','mm/dd/yyyy')"
    , "to_date('01/01/2027','mm/dd/yyyy')"
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

The only required column in this table is `date_day`, MetricFlow will handle coarser granularities. Finer grains are not supported at this time.

FAQ:
1. Can I use a different name for the time spine table?
No, MetricFlow expects the table to be called `metricflow_time_spine`, and will not work with a different name.

2. Can I use a different grain for the time spine table?
MetricFlow will handel coarser grains, but finer grains are not supported at this time.

