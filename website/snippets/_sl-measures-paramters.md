| Parameter | Description | Field type | Version support |
| --- | --- | --- | --- |
| [`name`](/docs/build/measures#name) | Provide a name for the measure, which must be unique and can't be repeated across all semantic models in your dbt project. | Required | 1.6 and higher |
| [`description`](/docs/build/measures#description) | Describes the calculated measure. | Optional | 1.6 and higher |
| [`agg`](/docs/build/measures#description) | dbt supports the following aggregations: `sum`, `max`, `min`, `count_distinct`, and `sum_boolean`. | Required | 1.6 and higher |
| [`expr`](/docs/build/measures#expr) | Either reference an existing column in the table or use a SQL expression to create or derive a new one. | Optional | 1.6 and higher |
| [`non_additive_` <br /> `dimension`](/docs/build/measures#non-additive-dimensions) | Non-additive dimensions can be specified for measures that cannot be aggregated over certain dimensions, such as bank account balances, to avoid producing incorrect results. | Optional | 1.6 and higher |
| `agg_params` | Specific aggregation properties such as a percentile. | Optional | 1.6 and higher |
| `agg_time_dimension` | The time field. Defaults to the default agg time dimension for the semantic model.  | Optional | 1.6 and higher |
| `label`  | How the metric appears in project docs and downstream integrations. | Required |  1.7 or higher|
| `create_metric` | You can create a metric directly from a measure with `create_metric: True` and specify its display name with `create_metric_display_name`.  | Optional | 1.7 or higher|
