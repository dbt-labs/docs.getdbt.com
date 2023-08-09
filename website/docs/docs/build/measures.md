---
title: Measures
id: measures
description: "Measures are aggregations performed on columns in your model."
sidebar_label: "Measures"
tags: [Metrics, Semantic Layer]
---

Measures are aggregations performed on columns in your model. They can be used as final metrics or serve as building blocks for more complex metrics. Measures have several inputs, which are described in the following table along with their field types.

| Parameter | Description | Type |
| --------- | ----------- | ---- |
| [`name`](#name) | Provide a name for the measure, which must be unique and can't be repeated across all semantic models in your dbt project. | Required |
| [`description`](#description) | Describes the calculated measure. | Optional |
| [`agg`](#aggregation) | dbt supports aggregations such as `sum`, `min`, `max`, and more. Refer to [Aggregation](/docs/build/measures#aggregation) for the full list of supported aggregation types. | Required |
| [`expr`](#expr) | You can either reference an existing column in the table or use a SQL expression to create or derive a new one. | Optional |
| [`non_additive_dimension`](#non-additive-dimensions) | Non-additive dimensions can be specified for measures that cannot be aggregated over certain dimensions, such as bank account balances, to avoid producing incorrect results. | Optional |
| `agg_params` | specific aggregation properties such as a percentile. | Optional |
| `agg_time_dimension` | The time field. Defaults to the default agg time dimension for the semantic model.  | Optional |
| `label` | How the metric appears in project docs and downstream integrations. | Required |


## Measure spec

An example of the complete YAML measures spec is below. The actual configuration of your measures will depend on the aggregation you're using.

```yaml
measures:
  - name: The name of the measure
    description: 'same as always' ## Optional
    agg: the aggregation type.
    expr: the field
    agg_params: 'specific aggregation properties such as a percentile'  ## Optional
    agg_time_dimension: The time field. Defaults to the default agg time dimension for the semantic model. ##  Optional
    non_additive_dimension: 'Use these configs when you need non-additive dimensions.' ## Optional
    label: How the metric appears in project docs and downstream integrations. ## Required
```

### Name 

When you create a measure, you can either give it a custom name or use the `name` of the data platform column directly. If the `name` of the measure is different from the column name, you need to add an `expr` to specify the column name. The `name` of the measure is used when creating a metric. 

Measure names must be **unique** across all semantic models in a project.

### Description

The description describes the calculated measure. It's strongly recommended you create verbose and human-readable descriptions in this field.

### Aggregation 

The aggregation determines how the field will be aggregated. For example, a `sum` aggregation type over a granularity of `day` would sum the values across a given day.

Supported aggregations include:

| Aggregation types | Description              |
|-------------------|--------------------------|
| sum               | Sum across the values    |
| min               | Minimum across the values|
| max               | Maximum across the values|
| average           | Average across the values |
| sum_boolean       | A sum for a boolean type |
| count_distinct    | Distinct count of values |
| median           | Median (p50) calculation across the values |
| percentile        | Percentile calculation across the values  |


### Expr

If the `name` you specified for a measure doesn't match a column name in your model, you can use the `expr` parameter instead. This allows you to use any valid SQL to manipulate an underlying column name into a specific output. The `name` parameter then serves as an alias for your measure.

**Notes**: When using SQL functions in the `expr` parameter, **always use data platform-specific SQL**. This is because outputs may differ depending on your specific data platform.

:::tip For Snowflake users
For Snowflake users, if you use a week-level function in the `expr` parameter, it'll now return Monday as the default week start day based on ISO standards. If you have any account or session level overrides for the `WEEK_START` parameter that fix it to a value other than 0 or 1, you will still see Monday as the week start. 

If you use the `dayofweek` function in the `expr` parameter with the legacy Snowflake default of `WEEK_START = 0`, it will now return ISO-standard values of 1 (Monday) through 7 (Sunday) instead of Snowflake's legacy default values of 0 (Monday) through 6 (Sunday).
:::


### Model with different aggregations

```yaml
semantic_models:
 - name: transactions
    description: A record of every transaction that takes place. Carts are considered  multiple transactions for each SKU.
    model: ref('schema.transactions')
    defaults:
      agg_time_dimensions:

# --- entities ---
  entities:
    - name: transaction_id
      type: primary
    - name: customer_id
      type: foreign
    - name: store_id
      type: foreign
    - name: product_id
      type: foreign

  # --- measures ---
  measures:
    - name: transaction_amount_usd
      description: Total USD value of transactions
      expr: transaction_amount_usd
      agg: sum
    - name: transaction_amount_usd_avg
      description: Average USD value of transactions
      expr: transaction_amount_usd
      agg: average
    - name: transaction_amount_usd_max
      description: Maximum USD value of transactions
      expr: transaction_amount_usd
      agg: max
    - name: transaction_amount_usd_min
      description: Minimum USD value of transactions
      expr: transaction_amount_usd
      agg: min
    - name: quick_buy_transactions 
      description: The total transactions bought as quick buy
      expr: quick_buy_flag 
      agg: sum_boolean 
    - name: distinct_transactions_count
      description: Distinct count of transactions 
      expr: transaction_id
      agg: count_distinct
    - name: transactions 
      description: The average value of transactions 
      expr: transaction_amount_usd
      agg: average 
    - name: transactions_amount_usd_valid #Notice here how we use expr to compute the aggregation based on a condition
      description: The total USD value of valid transactions only
      expr: CASE WHEN is_valid = True then 1 else 0 end 
      agg: sum
    - name: transactions
      description: The average value of transactions.
      expr: transaction_amount_usd
      agg: average
    - name: p99_transaction_value
      description: The 99th percentile transaction value
      expr: transaction_amount_usd
      agg: percentile
      agg_params:
        percentile: .99
        use_discrete_percentile: False #False will calculate the discrete percentile and True will calculate the continuous percentile
    - name: median_transaction_value
      description: The median transaction value
      expr: transaction_amount_usd
      agg: median
        
# --- dimensions ---
  dimensions:
    - name: metric_time
      type: time
      expr: date_trunc('day', ts) #expr refers to underlying column ts
      type_params:
        time_granularity: day
    - name: is_bulk_transaction
      type: categorical
      expr: case when quantity > 10 then true else false end

```

### Non-additive dimensions

Some measures cannot be aggregated over certain dimensions, like time, because it could result in incorrect outcomes. Examples include bank account balances where it does not make sense to carry over balances month-to-month, and monthly recurring revenue where daily recurring revenue cannot be summed up to achieve monthly recurring revenue. You can specify non-additive dimensions to handle this, where certain dimensions are excluded from aggregation.

To demonstrate the configuration for non-additive measures, consider a subscription table that includes one row per date of the registered user, the user's active subscription plan(s), and the plan's subscription value (revenue) with the following columns:

- `date_transaction`: The daily date-spine.
- `user_id`: The ID pertaining to the registered user.
- `subscription_plan`: A column to indicate the subscription plan ID.
- `subscription_value`: A column to indicate the monthly subscription value (revenue) of a particular subscription plan ID.

Parameters under the `non_additive_dimension` will specify dimensions that the measure should not be aggregated over.

| Parameter | Description | Field type |
| --- | --- | --- |
| `name`| This will be the name of the time dimension (that has already been defined in the data source) that the measure should not be aggregated over. | Required |
| `window_choice` | Choose either `min` or `max`, where `min` reflects the beginning of the time period and `max` reflects the end of the time period. | Required |
| `window_groupings` | Provide the entities that you would like to group by. | Optional |


```yaml
semantic_models:
  - name: subscription_table
    description: A subscription table with one row per date for each active user and their subscription plans. 
    model: ref('your_schema.subscription_table')
    defaults:
      agg_time_dimension: metric_time 

    entities:
      - name: user_id
        type: foreign

    dimensions:
      - name: metric_time
        type: time
        expr: date_transaction
        type_params:
          time_granularity: day

    measures: 
      - name: count_users_end_of_month 
        description: Count of users at the end of the month 
        expr: 1
        agg: sum 
        non_additive_dimension: 
          name: metric_time
          window_choice: min 
      - name: mrr_end_of_month
        description: Aggregate by summing all users' active subscription plans at the end of month 
        expr: subscription_value
        agg: sum 
        non_additive_dimension: 
          name: metric_time
          window_choice: max
      - name: mrr_by_user_end_of_month
        description: Group by user_id to achieve each user's MRR at the end of the month 
        expr: subscription_value
        agg: sum  
        non_additive_dimension: 
          name: metric_time
          window_choice: max
          window_groupings: 
            - user_id 

metrics:
  - name: mrr_end_of_month
    type: simple
    type_params:
        measure: mrr_end_of_month
```

We can query the semi-additive metrics using the following syntax:

```bash
mf query --metrics mrr_by_end_of_month --dimensions metric_time__month --order metric_time__month 
mf query --metrics mrr_by_end_of_month --dimensions metric_time__week --order metric_time__week 
```

import SetUpPages from '/snippets/_metrics-dependencies.md';

<SetUpPages /> 
