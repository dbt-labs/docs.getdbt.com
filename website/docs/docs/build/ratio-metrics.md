---
id: ratio
title: "Ratio metrics"
description: "Use ratio metrics to create a ratio out of two metrics. "
sidebar_label: Ratio
tags: [Metrics, Semantic Layer]
---

Ratio metrics allow you to create a ratio between two metrics. You specify a numerator and a denominator metric. You can optionally apply filters, names, and aliases to both the numerator and denominator when computing the metric.

The parameters for ratio metrics are as follows:

<VersionBlock lastVersion="1.11">

| Parameter | Description | Required | Type | 
| --------- | ----------- | ---- | ---- |
| `name` | The name of the metric. | Required | String |
| `description` | The description of the metric. | Optional | String |
| `type` | The type of the metric (cumulative, derived, ratio, or simple). | Required | String |
| `label` | Defines the display value in downstream tools. Accepts plain text, spaces, and quotes (such as `orders_total` or `"orders_total"`). | Required | String |
| `type_params` | The type parameters of the metric. | Required | Dict |
| `numerator` | The name of the metric used for the numerator, or structure of properties. | Required | String or dict |
| `denominator` |  The name of the metric used for the denominator, or structure of properties. | Required  | String  or dict |
| `filter` | Optional filter for the numerator or denominator. | Optional | String |
| `alias` | Optional alias for the numerator or denominator. | Optional | String |

</VersionBlock>

<VersionBlock firstVersion="1.12">

| Parameter | Description | Required | Type | 
| --------- | ----------- | ---- | ---- |
| `name` | The name of the metric. | Required | String |
| `description` | The description of the metric. | Optional | String |
| `type` | The type of the metric (cumulative, derived, ratio, or simple). | Required | String |
| `label` | Defines the display value in downstream tools. Accepts plain text, spaces, and quotes (such as `orders_total` or `"orders_total"`). | Optional | String |
| `numerator` | The name of the metric used for the numerator. Can be a string (metric name) or a dict with `name`, `filter`, and `alias` properties. | Required | String or Dict |
| `denominator` | The name of the metric used for the denominator. Can be a string (metric name) or a dict with `name`, `filter`, and `alias` properties. | Required | String or Dict |

#### Numerator/Denominator dictionary properties
The following properties are available for the numerator and denominator dictionary:

| Property | Description | Required | Type |
| -------- | ----------- | -------- | ---- |
| `name` | Name of the metric. | Required | String |
| `filter` | Filter to apply to the metric. | Optional | String |
| `alias` | Alias for the metric. | Optional | String |

</VersionBlock>

The complete specification for ratio metrics is as follows:

<VersionBlock lastVersion="1.11">
<File name="models/metrics/file_name.yml">
 
```yaml
metrics:
  - name: The metric name # Required
    description: the metric description # Optional
    type: ratio # Required
    label: String that defines the display value in downstream tools. (such as orders_total or "orders_total") #Required
    type_params: # Required
      numerator: The name of the metric used for the numerator, or structure of properties # Required
        name: Name of metric used for the numerator # Required
        filter: Filter for the numerator # Optional
        alias: Alias for the numerator # Optional
      denominator: The name of the metric used for the denominator, or structure of properties # Required
        name: Name of metric used for the denominator # Required
        filter: Filter for the denominator # Optional
        alias: Alias for the denominator # Optional
```
</File>

</VersionBlock>

<VersionBlock firstVersion="1.12">

<File name="models/file_name.yml">

```yaml
models:
  - name: file_name
    semantic_model:
      - enabled: true # required
      - name: my_semantic_model
      ... rest of config...
    metrics:
      - name: my_advanced_ratio_metric
        type: ratio
        numerator:
          name: my_simple_metric
          filter: "{{ Dimension('my_primary_entity__my_categorical_dimension_column') }} > 10"
          alias: joel_loves_data
        denominator:
          name: my_simple_metric_that_uses_the_other_time_dimension_but_is_also_from_another_semantic_model
          filter: "{{ Dimension('my_primary_entity__my_categorical_dimension_column') }} < 10"
          alias: joel_hates_data
```
</File>

</VersionBlock>

For advanced data modeling, you can use `fill_nulls_with` and `join_to_timespine` to [set null metric values to zero](/docs/build/fill-nulls-advanced), ensuring numeric values for every data row.

## Ratio metrics example

These examples demonstrate how to create ratio metrics in your model. They cover basic and advanced use cases, including applying filters to the numerator and denominator metrics.

#### Example 1 
This example is a basic ratio metric that calculates the ratio of food orders to total orders:

<VersionBlock lastVersion="1.11">
<File name="models/metrics/file_name.yml">
 
```yaml
metrics:
  - name: food_order_pct
    description: "The food order count as a ratio of the total order count"
    label: Food order ratio
    type: ratio
    type_params: 
      numerator: food_orders
      denominator: orders
```
</File>

</VersionBlock>

<VersionBlock firstVersion="1.12">

<File name="models/file_name.yml">
 
```yaml
metrics:
  - name: food_order_pct
    description: "The food order count as a ratio of the total order count"
    label: Food order ratio
    type: ratio
    numerator: food_orders
    denominator: orders
```
</File>
</VersionBlock>

#### Example 2 
This example is a ratio metric that calculates the ratio of food orders to total orders, with a filter and alias applied to the numerator. Note that in order to add these attributes, you'll need to use an explicit key for the name attribute too.

<VersionBlock lastVersion="1.11">

<File name="models/metrics/file_name.yml">
 
```yaml
metrics:
  - name: food_order_pct
    description: "The food order count as a ratio of the total order count, filtered by location"
    label: Food order ratio by location
    type: ratio
    type_params:
      numerator:
        name: food_orders
        filter: location = 'New York'
        alias: ny_food_orders
      denominator:
        name: orders
        filter: location = 'New York'
        alias: ny_orders
```
</File>

</VersionBlock>

<VersionBlock firstVersion="1.12">

<File name="models/file_name.yml">
 
```yaml
metrics:
  - name: food_order_pct
    description: "The food order count as a ratio of the total order count"
    label: Food order ratio by location
    type: ratio
    numerator:
      name: food_orders
      filter: location = 'New York'
      alias: ny_food_orders
    denominator:
      name: orders
      filter: location = 'New York'
      alias: ny_orders
```
</File>

</VersionBlock>

## Ratio metrics using different semantic models

The system will simplify and turn the numerator and denominator into a ratio metric from different semantic models by computing their values in sub-queries. It will then join the result set based on common dimensions to calculate the final ratio. Here's an example of the SQL generated for such a ratio metric.


```sql
select
  subq_15577.metric_time as metric_time,
  cast(subq_15577.mql_queries_created_test as double) / cast(nullif(subq_15582.distinct_query_users, 0) as double) as mql_queries_per_active_user
from (
  select
    metric_time,
    sum(mql_queries_created_test) as mql_queries_created_test
  from (
    select
      cast(query_created_at as date) as metric_time,
      case when query_status in ('PENDING','MODE') then 1 else 0 end as mql_queries_created_test
    from prod_dbt.mql_query_base mql_queries_test_src_2552 
  ) subq_15576
  group by
    metric_time
) subq_15577
inner join (
  select
    metric_time,
    count(distinct distinct_query_users) as distinct_query_users
  from (
    select
      cast(query_created_at as date) as metric_time,
      case when query_status in ('MODE','PENDING') then email else null end as distinct_query_users
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

## Add filter

Users can define constraints on input metrics for a ratio metric by applying a filter directly to the input metric, like so:

<VersionBlock lastVersion="1.11">

<File name="models/metrics/file_name.yml">
 
```yaml
metrics:
  - name: frequent_purchaser_ratio
    description: Fraction of active users who qualify as frequent purchasers
    type: ratio
    type_params:
      numerator:
        name: distinct_purchasers
        filter: |
          {{Dimension('customer__is_frequent_purchaser')}}
        alias: frequent_purchasers
      denominator:
        name: distinct_purchasers
```
</File>

</VersionBlock>

<VersionBlock firstVersion="1.12">

<File name="models/file_name.yml">
 
```yaml
metrics:
  - name: frequent_purchaser_ratio
    description: Fraction of active users who qualify as frequent purchasers
    type: ratio
    numerator:
      name: distinct_purchasers
      filter: | 
        "{{ Dimension('customer__is_frequent_purchaser') }}"
      alias: frequent_purchasers
    denominator:
      name: distinct_purchasers
```
</File>

</VersionBlock>

Note the `filter` and `alias` parameters for the metric referenced in the numerator. 
- Use the `filter` parameter to apply a filter to the metric it's attached to. 
- The `alias` parameter is used to avoid naming conflicts in the rendered SQL queries when the same metric is used with different filters. 
- If there are no naming conflicts, the `alias` parameter can be left out.

## Related docs
- [Fill null values for simple, derived, or ratio metrics](/docs/build/fill-nulls-advanced)
