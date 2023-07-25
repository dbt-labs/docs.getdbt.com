---
id: ratio
title: "Ratio metrics"
description: "Use ratio metrics to create a ratio out of two measures. "
sidebar_label: Ratio
tags: [Metrics, Semantic Layer]
---

Ratio allows you to create a ratio between two measures. You simply specify a numerator and a denominator measure. Additionally, you can apply a dimensional filter to both the numerator and denominator using a constraint string when computing the metric. The full spec for ratio metrics, and examples are belwo:

# Ratio Metric Spec
```yaml
metrics:
  - name: the metric name # Required
    description: the metric description # Optinal
    type: ratio # Required
    label: The value that will be displayed in downstream tools #Required
    type_params: # Required
      numerator: the measure used for the numerator # Required
      filter: filter for the numerator# Optional
      alias: alias for the numerator # Optional
      denominator: the meausure used for the denominator # Required
      filter: filter for the denominator # Optional
      alias: alias for the denominator # Optional
```

```yaml
# Ratio Metric
metrics:
  - name: food_order_total_pct
    description: "The food order total as the % of the total order"
    label: Food Order Total % 
    type: ratio
    type_params: 
      numerator: food_order_total
      denominator: order_total
  
```
### Ratio metrics using different semantic models

If the numerator and denominator in a ratio metric come from different semantic models, the system will compute their values in subqueries and then join the result set based on common dimensions to calculate the final ratio. Here's an example of the generated SQL for such a ratio metric.


```SQL
select
  subq_15577.metric_time as metric_time
  , cast(subq_15577.mql_queries_created_test as double) / cast(nullif(subq_15582.distinct_query_users, 0) as double) as mql_queries_per_active_user
from (
  select
    metric_time
    , sum(mql_queries_created_test) as mql_queries_created_test
  from (
    select
      cast(query_created_at as date) as metric_time
      , case when query_status in ('PENDING','MODE') then 1 else 0 end as mql_queries_created_test
    from prod_dbt.mql_query_base mql_queries_test_src_2552 
  ) subq_15576
  group by
    metric_time
) subq_15577
inner join (
  select
    metric_time
    , count(distinct distinct_query_users) as distinct_query_users
  from (
    select
      cast(query_created_at as date) as metric_time
      , case when query_status in ('MODE','PENDING') then email else null end as distinct_query_users
    from prod_dbt.mql_query_base mql_queries_src_2585 
  ) subq_15581
  group by
    metric_time
) subq_15582
on
  (
    (
      subq_15577.metric_time = subq_15582.metric_time
    ) or (
      (
        subq_15577.metric_time is null
      ) and (
        subq_15582.metric_time is null
      )
    )
  )
```

### Add filter

Users can define constraints on input measures for a metric by applying a filter directly to the measure, like so:

```yaml
metrics:
  - name: frequent_purchaser_ratio
    description: Fraction of active users who qualify as frequent purchasers
    owners:
      - support@getdbt.com
    type: ratio
    type_params:
      numerator:
        name: distinct_purchasers
        filter: {{dimension('is_frequent_purchaser')}}
        alias: frequent_purchasers
      denominator:
        name: distinct_purchasers
```

Note the `filter` and `alias` parameters for the measure referenced in the numerator. Use the `filter` parameter to apply a filter to the measure it's attached to. The `alias` parameter is used to avoid naming conflicts in the rendered SQL queries when the same measure is used with different filters. If there are no naming conflicts, the `alias` parameter can be left out.
