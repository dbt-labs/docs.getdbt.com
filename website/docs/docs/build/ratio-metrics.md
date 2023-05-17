---
id: ratio
title: "Ratio metrics"
description: "Use ratio metrics to create a ratio out of two measures. "
sidebar_label: Ratio
tags: [Metrics, Semantic Layer]
---

Ratio allows you to create a ratio between two measures. You simply specify a numerator and a denominator measure. Additionally, you can apply a dimensional filter to both numerator and denominator using a constraint string when computing the metric.

```yaml
# Ratio Metric
  metrics:
  - name: cancellation_rate
    owners:
      - support@getdbt.com
    type: ratio # Ratio metrics create a ratio out of two measures. Define the measures from the semantic model as numerator or denominator
    type_params:
      numerator: cancellations_usd
      denominator: transaction_amount_usd
    constraint: | # add optional constraint string. This applies to both the numerator and denominator
      is_internal = false

  - name: enterprise_cancellation_rate
    owners:
      - support@getdbt.com
    type: ratio # Ratio metrics create a ratio out of two measures. Define the measures from the semantic model as numerator or denominator
    type_params:
      numerator: 
        name: cancellations_usd
        constraint: tier = 'enterprise' #constraint only applies to the numerator
      denominator: transaction_amount_usd 
    constraint: | # add optional constraint string. This applies to both the numerator and denominator
      is_internal = false
  
```

### Different semantic models

If the numerator and denominator in a ratio metric come from different semantic models, the system will compute their values in subqueries and then join the result set based on common dimensions to calculate the final ratio. Here's an example of the generated SQL for such a ratio metric.


```SQL
-- Join Aggregated Measures with Standard Outputs
-- Pass Only Elements:
--   ['metric_time', 'mql_queries_created_test', 'distinct_query_users']
-- Compute Metrics via Expressions
-- Order By [] Limit 100
SELECT
  subq_15577.metric_time AS metric_time
  , CAST(subq_15577.mql_queries_created_test AS DOUBLE) / CAST(NULLIF(subq_15582.distinct_query_users, 0) AS DOUBLE) AS mql_queries_per_active_user
FROM (
  -- Aggregate Measures From Numerator
  SELECT
    metric_time
    , SUM(mql_queries_created_test) AS mql_queries_created_test
  FROM (
    -- Read Elements From semantic model 'mql_queries_test'
    -- Pass Only Additive Measures
    -- Metric Time Dimension 'ds'
    -- Pass Only Elements:
    --   ['mql_queries_created_test', 'metric_time']
    SELECT
      CAST(query_created_at AS DATE) AS metric_time
      , case when query_status IN ('PENDING','MODE') then 1 else 0 end AS mql_queries_created_test
    FROM prod_dbt.mql_query_base mql_queries_test_src_2552 -- Numerator semantic model
  ) subq_15576
  GROUP BY
    metric_time
) subq_15577
INNER JOIN (
  -- Aggregate Measures From Denominator
  SELECT
    metric_time
    , COUNT(DISTINCT distinct_query_users) AS distinct_query_users
  FROM (
    -- Read Elements From semantic model 'mql_queries'
    -- Pass Only Additive Measures
    -- Metric Time Dimension 'ds'
    -- Pass Only Elements:
    --   ['distinct_query_users', 'metric_time']
    SELECT
      CAST(query_created_at AS DATE) AS metric_time
      , case when query_status in ('MODE','PENDING') then email else null end AS distinct_query_users
    FROM prod_dbt.mql_query_base mql_queries_src_2585 --Denominator semantic model
  ) subq_15581
  GROUP BY
    metric_time
) subq_15582
ON -- Join on Common Dimensions
  (
    (
      subq_15577.metric_time = subq_15582.metric_time
    ) OR (
      (
        subq_15577.metric_time IS NULL
      ) AND (
        subq_15582.metric_time IS NULL
      )
    )
  )
LIMIT 100
```

### Add constraints

Users can define constraints on input measures for a metric by applying a constraint directly to the measure, like so:

```yaml
metric:
  name: frequent_purchaser_ratio
  description: Fraction of active users who qualify as frequent purchasers
  owners:
    - support@getdbt.com
  type: ratio
  locked_metadata:
    value_format: ".2%"
  type_params:
    numerator:
      name: distinct_purchasers
      constraint: is_frequent_purchaser
      alias: frequent_purchasers
    denominator:
      name: distinct_purchasers
```

Note the `constraint` and `alias` parameters for the measure referenced in the numerator. The `constraint` parameter specifies the filter to be applied to the measure it's attached to. The `alias` parameter is used to avoid naming conflicts in the rendered SQL queries when the same measure is used with different filters. If there are no naming conflicts, the `alias` parameter can be left out.
