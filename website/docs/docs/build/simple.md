---
title: "Simple metrics"
id: simple
description: "Use simple metrics to aggregate data directly from columns in your semantic models."
sidebar_label: Simple
tags: [Metrics, Semantic Layer]
pagination_next: null
---

<VersionBlock lastVersion="1.99">
Simple metrics are metrics that directly reference a single measure, without any additional measures involved. They are aggregations over a column in your data platform and can be filtered by one or multiple dimensions.
</VersionBlock>

<VersionBlock firstVersion="2.0">
Simple metrics are direct aggregations over columns in your data warehouse using different aggregation types. They serve as building blocks for more complex metrics and can be filtered by dimensions.
</VersionBlock>

The parameters, description, and type for simple metrics are:
<VersionBlock lastVersion="1.99">
:::tip
Note that we use the double colon (::) to indicate whether a parameter is nested within another parameter. So for example, `query_params::metrics` means the `metrics` parameter is nested under `query_params`.
:::
</VersionBlock>

<VersionBlock lastVersion="1.99">

| Parameter | Description | Required | Type |
| --------- | ----------- | ---- | ---- |
| `name` | The name of the metric. | Required | String |
| `description` | The description of the metric. | Optional | String |
| `type` | The type of the metric (cumulative, derived, ratio, or simple). | Required | String |
| `label` | Defines the display value in downstream tools. Accepts plain text, spaces, and quotes (such as `orders_total` or `"orders_total"`). | Required | String |
| `type_params` | The type parameters of the metric. | Required | Dict |
| `measure` | A list of measure inputs. | Required | List |
| `measure:name` | The measure you're referencing. | Required | String |
| `measure:alias` | Optional [`alias`](/reference/resource-configs/alias) to rename the measure. | Optional | String |
| `measure:filter` | Optional `filter` applied to the measure. | Optional | String |
| `measure:fill_nulls_with` | Set the value in your metric definition instead of null (such as zero). | Optional | Integer |
| `measure:join_to_timespine` | Indicates if the aggregated measure should be joined to the time spine table to fill in missing dates. Default `false`. | Optional | Boolean |

</VersionBlock>

<VersionBlock firstVersion="2.0">

| Parameter | Description | Required | Type |
| --------- | ----------- | ---- | ---- |
| `name` | The name of the metric. | Required | String |
| `description` | The description of the metric. | Optional | String |
| `type` | The type of the metric (cumulative, derived, ratio, or simple). | Required | String |
| `label` | Defines the display value in downstream tools. Accepts plain text, spaces, and quotes (such as `orders_total` or `"orders_total"`). | Required | String |
| `name` | The metric you're referencing. | Required | String |
| `alias` | Optional [`alias`](/reference/resource-configs/alias) to rename the metric. | Optional | String |
| `filter` | Optional `filter` applied to the metric. | Optional | String |
| `agg` | dbt supports the following aggregations: `sum`, `max`, `min`, `average`, `median`, `count_distinct`, `percentile`, and `sum_boolean`. | Required | String |
| `expr` | Either reference an existing column in the table or use a SQL expression to create or derive a new one. | Optional | String |
| `agg_time_dimension` | The time field. Defaults to the default agg time dimension for the semantic model. | Optional | String |
| `fill_nulls_with` | Set the value in your metric definition instead of null (such as zero). | Optional | Integer |
| `join_to_timespine` | Indicates if the aggregated metric should be joined to the time spine table to fill in missing dates. Default `false`. | Optional | Boolean |

</VersionBlock>

The following displays the complete specification for simple metrics, along with an example.


<VersionBlock lastVersion="1.99">

```yaml
metrics:
  - name: The metric name # Required
    description: the metric description # Optional
    type: simple # Required
    label: The value that will be displayed in downstream tools # Required
    type_params: # Required
      measure: 
        name: The name of your measure # Required
        alias: The alias applied to the measure. # Optional
        filter: The filter applied to the measure. # Optional
        fill_nulls_with: Set value instead of null  (such as zero) # Optional
        join_to_timespine: true/false # Boolean that indicates if the aggregated measure should be joined to the time spine table to fill in missing dates. # Optional

```

</VersionBlock>

<VersionBlock firstVersion="2.0">

```yaml
metrics:
  - name: my_simple_metric # Required
    description: The metric description # Optional
    label: My simple metric label # Required
    type: simple  # Required
    agg: count_distinct # Required sum | max | min | average | median | count_distinct | percentile, and sum_boolean (use existing enum from DSI)
    expr: case when is_a then 1 else 0 end # Optional for simple metric, defaults to name of metric
    join_to_timespine: true
    fill_nulls_with: 0

  - name: my_simple_metric_that_uses_the_other_time_dimensio
    description: The metric description
    label: My simple metric that uses the other time dimension label
    type: simple
    agg: count_distinct
    agg_time_dimension: my_other_time_dimension_column # Optional, if not using the default time dimension
```

</VersionBlock>

For advanced data modeling, you can use `fill_nulls_with` and `join_to_timespine` to [set null metric values to zero](/docs/build/fill-nulls-advanced), ensuring numeric values for every data row.

<!-- create_metric not supported yet
:::tip

If you've already defined the measure using the `create_metric: true` parameter, you don't need to create simple metrics. However, if you want to include a filter in the final metric, you'll need to define and create a simple metric.
:::
-->

## Simple metrics example

<VersionBlock lastVersion="1.99">

```yaml
  metrics: 
    - name: customers
      description: Count of customers
      type: simple # Pointers to a measure you created in a semantic model
      label: Count of customers
      type_params:
        measure: 
          name: customers # The measure you are creating a proxy of.
          fill_nulls_with: 0 
          join_to_timespine: true
          alias: customer_count
          filter: {{ Dimension('customer__customer_total') }} >= 20
    - name: large_orders
      description: "Order with order values over 20."
      type: simple
      label: Large orders
      type_params:
        measure: 
          name: orders
      filter: | # For any metric you can optionally include a filter on dimension values
        {{Dimension('customer__order_total_dim')}} >= 20
```

</VersionBlock>

<VersionBlock firstVersion="2.0">

```yaml
metrics:
  - name: customers
    description: Count of customers
    type: simple
    label: Count of customers
    agg: count
    expr: customers 
    fill_nulls_with: 0
    join_to_timespine: true
    alias: customer_count
    filter: "{{ Dimension('customer__customer_total') }} >= 20"

  - name: large_orders
    description: "Order with order values over 20."
    type: simple
    label: Large orders
    agg: count
    expr: orders 
    filter: "{{ Dimension('customer__order_total_dim') }} >= 20"
```

</VersionBlock>

## Related docs
- [Fill null values for simple, derived, or ratio metrics](/docs/build/fill-nulls-advanced)
