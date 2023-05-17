---
title: "Expression metrics"
id: expr
description: "Expression metrics allow measures to be modified using a SQL expression. "
sidebar_label: Expression
tags: [Metrics, Semantic Layer]
---

Expression metrics are used to modify measures using a SQL expression, often involving multiple measures. To define an expression metric, you need to include the SQL expression and a list of the measures used in the expression.

```yaml
# Expression metrics allow you to pass in any valid SQL expression. Define all of the measures used in the metric in the "measures" field.
metrics:
  name: revenue_usd
  type: expr # Expression metrics allow you to pass in any valid SQL expression.
  type_params:
    expr: transaction_amount_usd - cancellations_usd + alterations_usd # Define the SQL expression 
    measures: # Define all the measures that are to be used in this expression metric 
      - transaction_amount_usd
      - cancellations_usd
      - alterations_usd
```

### Different semantic models

If you use measures from different data sets in an expression metric in MetricFlow, the system will calculate the values in sub-queries and then join the result set based on common dimensions to calculate the final value. Here's an example of the generated SQL from an expression with measures from different semantic models.


```SQL

-- Compute Metrics via Expressions
-- Order By [] Limit 100
SELECT
  metric_time
  , mql_queries_created - mql_queries_created_test AS mql_queries_cleaned
FROM (
  -- Join Aggregated Measures with Standard Outputs
  -- Pass Only Elements:
  --   ['metric_time', 'mql_queries_created', 'mql_queries_created_test']
  SELECT
    subq_15611.metric_time AS metric_time
    , subq_15611.mql_queries_created AS mql_queries_created
    , subq_15616.mql_queries_created_test AS mql_queries_created_test
  FROM (
    -- Aggregate Measures
    SELECT
      metric_time
      , SUM(mql_queries_created) AS mql_queries_created
    FROM (
      -- Read Elements From semantic models 'mql_queries_test'
      -- Pass Only Additive Measures
      -- Metric Time Dimension 'ds'
      -- Pass Only Elements:
      --   ['mql_queries_created', 'metric_time']
      SELECT
        CAST(query_created_at AS DATE) AS metric_time
        , case when query_status IN ('PENDING','MODE') then 1 else 0 end AS mql_queries_created
      FROM prod_dbt.mql_query_base mql_queries_test_src_2682
    ) subq_15610
    GROUP BY
      metric_time
  ) subq_15611
  INNER JOIN (
    -- Aggregate Measures
    SELECT
      metric_time
      , COUNT(DISTINCT mql_queries_created_test) AS mql_queries_created_test
    FROM (
      -- Read Elements From semantic models 'mql_queries'
      -- Pass Only Additive Measures
      -- Metric Time Dimension 'ds'
      -- Pass Only Elements:
      --   ['mql_queries_created_test', 'metric_time']
      SELECT
        CAST(query_created_at AS DATE) AS metric_time
        , case when query_status in ('MODE','PENDING') then email else null end AS mql_queries_created_test
      FROM prod_dbt.mql_query_base mql_queries_src_2670
    ) subq_15615
    GROUP BY
      metric_time
  ) subq_15616
  ON
    (
      (
        subq_15611.metric_time = subq_15616.metric_time
      ) OR (
        (
          subq_15611.metric_time IS NULL
        ) AND (
          subq_15616.metric_time IS NULL
        )
      )
    )
) subq_15618
LIMIT 100
```


### Add constraints

Users can add constraints to input measures in an expression metric by directly applying a constraint to the measure.

```yaml
metrics:
  name: purchase_rate_90
  description: Fraction of purchases with < 90 pct chance of being returned
  type: expr
  locked_metadata:
    value_format: ".2%"
  type_params:
    expr: "(total_purchases - predicted_returns_90_pct) / NULLIF(total_purchases, 0)"
    measures:
      - name: total_purchases
      - name: predicted_returned_items
        constraint: prediction_score > 0.9
        alias: predicted_returns_90_pct # alias not required, but you may always include one for clarity
```

The `predicted_returned_items` measure has two parameters, `constraint` and `alias`. The `constraint` parameter specifies the filter to be applied to the measure it is attached to, and not to others. The `alias` parameter is used to avoid column name conflicts in the SQL queries when the same measure is used with different constraints. If all input measures are distinct, the `alias` parameter isn't necessary.

