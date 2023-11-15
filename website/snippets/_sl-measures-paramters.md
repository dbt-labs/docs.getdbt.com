| Parameter | Description | Field type |
| --- | --- | --- |
| [`name`](/docs/build/measures#name) | Provide a name for the measure, which must be unique and can't be repeated across all semantic models in your dbt project. | Required |
| [`description`](/docs/build/measures#description) | Describes the calculated measure. | Optional |
| [`agg`](/docs/build/measures#description) | dbt supports the following aggregations: `sum`, `max`, `min`, `count_distinct`, and `sum_boolean`. | Required |
| [`expr`](/docs/build/measures#expr) | Either reference an existing column in the table or use a SQL expression to create or derive a new one. | Optional |
| [`non_additive_dimension`](/docs/build/measures#non-additive-dimensions) | Non-additive dimensions can be specified for measures that cannot be aggregated over certain dimensions, such as bank account balances, to avoid producing incorrect results. | Optional |
| `agg_params` | Specific aggregation properties such as a percentile. | Optional |
| `agg_time_dimension` | The time field. Defaults to the default agg time dimension for the semantic model.  | Optional |
| `label` | How the metric appears in project docs and downstream integrations. | Required |
| `create_metric` | You can create a metric directly from a measure with create_metric: True and specify its display name with create_metric_display_name. Available on dbt v1.7 or higher. | Optional |
