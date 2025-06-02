
| Parameter | Description | Required | Type | 
| --- | --- | --- | --- | 
| [`name`](/docs/build/measures#name) | Provide a name for the measure, which must be unique and can't be repeated across all semantic models in your dbt project. | Required | String | 
| [`description`](/docs/build/measures#description) | Describes the calculated measure. | Optional | String | 
| [`agg`](/docs/build/measures#aggregation) | dbt supports the following aggregations: `sum`, `max`, `min`, `average`, `median`, `count_distinct`, `percentile`, and `sum_boolean`. | Required | String |
| [`expr`](/docs/build/measures#expr) | Either reference an existing column in the table or use a SQL expression to create or derive a new one. | Optional | String | 
| [`non_additive_dimension`](/docs/build/measures#non-additive-dimensions) | Non-additive dimensions can be specified for measures that cannot be aggregated over certain dimensions, such as bank account balances, to avoid producing incorrect results. | Optional | String |
| `agg_params` | Specific aggregation properties, such as a percentile. | Optional | Dict |
| `agg_time_dimension` | The time field. Defaults to the default agg time dimension for the semantic model.  | Optional | String |
| `label` | String that defines the display value in downstream tools. Accepts plain text, spaces, and quotes (such as `orders_total` or `"orders_total"`). Available in dbt version 1.7 or higher. | Optional | String |
| `create_metric` | Create a `simple` metric from a measure by setting `create_metric: True`. The `label` and `description` attributes will be automatically propagated to the created metric. Available in dbt version 1.7 or higher. | Optional | Boolean |
| `config`  | Use the [`config`](/reference/resource-properties/config) property to specify configurations for your metric. Supports the [`meta`](/reference/resource-configs/meta) property, nested under `config`. | Optional |
