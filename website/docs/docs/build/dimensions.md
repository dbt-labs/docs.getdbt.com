---
title: Dimensions
id: dimensions
description: "Dimensions determine the level of aggregation for a metric, and are non-aggregatable expressions."
sidebar_label: "Dimensions"
tags: [Metrics, Semantic Layer]
---

Dimensions is a way to group or filter information based on categories or time. It's like a special label that helps organize and analyze data. 

In a data platform, dimensions is part of a larger structure called a semantic model. It's created along with other elements like [entities](/docs/build/entities) and [measures](/docs/build/measures), and used to add more details to your data that can't be easily added up or combined.  In SQL, dimensions is typically included in the `group by` clause of your SQL query.


<!--dimensions are non-aggregatable expressions that define the level of aggregation for a metric used to define how data is sliced or grouped in a metric. Since groups can't be aggregated, they're considered to be a property of the primary or unique entity of the table.

Groups are defined within semantic models, alongside entities and measures, and correspond to non-aggregatable columns in your dbt model that provides categorical or time-based context. In SQL, dimensions  is typically included in the GROUP BY clause.-->

All dimensions require a `name`, `type` and in some cases, an `expr` parameter. 

| Parameter | Description | Type |
| --------- | ----------- | ---- |
| `name` |  Refers to the name of the group that will be visible to the user in downstream tools. It can also serve as an alias if the column name or SQL query reference is different and provided in the `expr` parameter. <br /><br /> Dimension names should be unique within a semantic model, but they can be non-unique across different models as MetricFlow uses [joins](/docs/build/join-logic) to identify the right dimension. | Required |
| `type` | Specifies the type of group created in the semantic model. There are three types:<br /><br />- **Categorical**: Group rows in a table by categories like geography, color, and so on. <br />- **Time**: Point to a date field in the data platform. Must be of type TIMESTAMP or equivalent in the data platform engine. <br />- **Slowly-changing dimensions**: Analyze metrics over time and slice them by groups that change over time, like sales trends by a customer's country. | Required |
| `type_params` | Specific type params such as if the time is primary or used as a partition | Required |
| `description` | A clear description of the dimension | Optional |
| `expr` | Defines the underlying column or SQL query for a dimension. If no `expr` is specified, MetricFlow will use the column with the same name as the group. You can use column name itself to input a SQL expression. | Optional |

Refer to the following for the complete specification for dimensions:

```yaml
dimensions:
  - name: name of the group that will be visible to the user in downstream tools
    type: Categorical or Time
    type_params: specific type params such as if the time is primary or used as a partition
    description: same as always
    expr: the column name or expression. If not provided the default is the dimension name
```

Refer to the following example to see how dimensions are used in a semantic model:

```yaml
semantic_models:
  - name: transactions
    description: A record for every transaction that takes place. Carts are considered multiple transactions for each SKU. 
    model: {{ ref("fact_transactions") }}
    defaults:
      agg_time_dimension: metric_time
# --- entities ---
  entities: 
      ...
# --- measures --- 
  measures: 
      ... 
# --- dimensions ---
  dimensions:
    - name: metric_time
      type: time
      expr: date_trunc('day', ts)
    - name: is_bulk_transaction
      type: categorical
      expr: case when quantity > 10 then true else false end
```

MetricFlow requires that all dimensions have a primary entity. This is to guarantee unique dimension names. If your data source doesn't have a primary entity, you need to assign the entity a name using the `primary_entity: entity_name` key. It doesn't necessarily have to map to a column in that table and assigning the name doesn't affect query generation.

```yaml
semantic_model:
  name: bookings_monthly_source
  description: bookings_monthly_source
  defaults:
    agg_time_dimension: ds
  model: ref('bookings_monthly_source')
  measures:
    - name: bookings_monthly
      agg: sum
      create_metric: true
  primary_entity: booking_id
```

## Dimensions types

Dimensions have 2 types. This section further explains the definitions and provides examples.

1. [Categorical](#categorical)
1. [Time](#time)

### Categorical

Categorical is used to group metrics by different categories such as product type, color, or geographical area. They can refer to existing columns in your dbt model or be calculated using a SQL expression with the `expr` parameter. An example of a category dimension is `is_bulk_transaction`, which is a group created by applying a case statement to the underlying column `quantity`. This allows users to group or filter the data based on bulk transactions.

```yaml
dimensions: 
  - name: is_bulk_transaction
    type: categorical
    expr: case when quantity > 10 then true else false end
```

### Time


:::tip use datetime data type if using BigQuery
To use BigQuery as your data platform, time dimensions columns need to be in the datetime data type. If they are stored in another type, you can cast them to datetime using the `expr` property. Time dimensions are used to group metrics by different levels of time, such as day, week, month, quarter, and year. MetricFlow supports these granularities, which can be specified using the `time_granularity` parameter.
:::

Time has additional parameters specified under the `type_params` section. When you query one or more metrics in MetricFlow using the CLI, the default time dimension for a single metric is the primary time dimension, which you can refer to as `metric_time` or use the dimensions' name. 

You can use multiple time groups in separate metrics. For example, the `users_created` metric uses `created_at`, and the `users_deleted` metric uses `deleted_at`:


```bash
mf query --metrics users_created,users_deleted --dimensions metric_time --order metric_time 
```

You can set `is_partition` for time or categorical dimensions to define specific time spans. Additionally, use the `type_params` section to set `time_granularity` to adjust aggregation detail (like daily, weekly, and so on):

<Tabs>

<TabItem value="is_partition" label="is_partition">

Use `is_partition: True` to show that a dimension exists over a specific time window. For example, a date-partitioned dimensional table. When you query metrics from different tables, the dbt Semantic Layer uses this parameter to ensure that the correct dimensional values are joined to measures. 

You can also use `is_partition` for [categorical](#categorical) dimensions as well.

MetricFlow enables metric aggregation during query time. For example, you can aggregate the `messages_per_month` measure. If you originally had a `time_granularity` for the time dimensions `metric_time`, you can specify a yearly granularity for aggregation in your CLI query:

```bash
mf query --metrics messages_per_month --dimensions metric_time --order metric_time --time-granularity year  
```

```yaml
dimensions: 
  - name: created_at
    type: time
    expr: date_trunc('day', ts_created) #ts_created is the underlying column name from the table 
    is_partition: True 
    type_params:
      time_granularity: day
  - name: deleted_at
    type: time
    expr: date_trunc('day', ts_deleted) #ts_deleted is the underlying column name from the table 
    is_partition: True 
    type_params:
      time_granularity: day

measures:
  - name: users_deleted
    expr: 1
    agg: sum
    agg_time_dimension: deleted_at
  - name: users_created
    expr: 1
    agg: sum
```

</TabItem>

<TabItem value="time_gran" label="time_granularity">

`time_granularity` specifies the smallest level of detail that a measure or metric should be reported at, such as daily, weekly, monthly, quarterly, or yearly. Different granularity options are available, and each metric must have a specified granularity. For example, a metric that is specified with weekly granularity couldn't be aggregated to a daily grain. 

The current options for time granularity are day, week, month, quarter, and year. 

Aggregation between metrics with different granularities is possible, with the Semantic Layer returning results at the highest granularity by default. For example, when querying two metrics with daily and monthly granularity, the resulting aggregation will be at the monthly level.

```yaml
dimensions: 
  - name: created_at
    type: time
    expr: date_trunc('day', ts_created) #ts_created is the underlying column name from the table 
    is_partition: True 
    type_params:
      time_granularity: day
  - name: deleted_at
    type: time
    expr: date_trunc('day', ts_deleted) #ts_deleted is the underlying column name from the table 
    is_partition: True 
    type_params:
      time_granularity: day

measures:
  - name: users_deleted
    expr: 1
    agg: sum 
    agg_time_dimension: deleted_at
  - name: users_created
    expr: 1
    agg: sum
```

</TabItem>

</Tabs>

### SCD Type II 

:::caution 
Currently, there are limitations in supporting SCD's. 
:::

MetricFlow supports joins against dimensions values in a semantic model built on top of an SCD Type II table (slowly changing dimension) Type II table. This is useful when you need a particular metric sliced by a group that changes over time, such as the historical trends of sales by a customer's country. 

As their name suggests SCD Type II are groups that change values at a coarser time granularity. This results in a range of valid rows with different dimensions values for a given metric or measure. MetricFlow associates the metric with the first (minimum) available dimensions value within a coarser time window, such as month. By default, MetricFlow uses the group that is valid at the beginning of the time granularity.

The following basic structure of an SCD Type II data platform table is supported:

| entity_key | dimensions_1 | dimensions_2 | ... | dimensions_x | valid_from | valid_to |
|------------|-------------|-------------|-----|-------------|------------|----------|  

* `entity_key` (required): An entity_key (or some sort of identifier) must be present 
* `valid_from` (required): A timestamp indicating the start of a changing dimensions value must be present
* `valid_to` (required): A timestamp indicating the end of a changing dimensions value must be present

**Note**: The SCD dimensions table must have `valid_to` and `valid_from` columns.

This is an example of SQL code that shows how a sample metric called `num_events` is joined with versioned dimensions data (stored in a table called `scd_dimensions`) using a primary key made up of the `entity_key` and `timestamp` columns. 


```sql
select metric_time, dimensions_1, sum(1) as num_events
from events a
left outer join scd_dimensions b
on 
  a.entity_key = b.entity_key 
  and a.metric_time >= b.valid_from 
  and (a.metric_time < b. valid_to or b.valid_to is null)
group by 1, 2
```

<Tabs>

<TabItem value="example" label="SCD table example 1">

This example shows how to create slowly changing dimensions (SCD) using a semantic model. The SCD table contains information about sales persons' tier and the time length of that tier. Suppose you have the underlying SCD table:

| sales_person_id | tier | start_date | end_date | 
|-----------------|------|------------|----------|
| 111             | 1    | 2019-02-03 | 2020-01-05| 
| 111             | 2    | 2020-01-05 | 2048-01-01| 
| 222             | 2    | 2020-03-05 | 2048-01-01| 
| 333             | 2    | 2020-08-19 | 2021-10-22| 
| 333             | 3    | 2021-10-22 | 2048-01-01|  

Take note of the extra arguments under `validity_params`: `is_start` and `is_end`. These arguments indicate the columns in the SCD table that contain the start and end dates for each tier (or beginning or ending timestamp column for a dimensional value).

```yaml 
semantic_models:
  - name: sales_person_tiers
    description: SCD Type II table of tiers for salespeople 
    model: {{ref(sales_person_tiers)}}
    defaults:
      agg_time_dimension: tier_start

    dimensions:
      - name: tier_start
        type: time
        expr: start_date
        type_params:
          time_granularity: day
          validity_params:
            is_start: True
      - name: tier_end 
        type: time
        expr: end_date
        type_params:
          time_granularity: day
          validity_params:
            is_end: True
      - name: tier
        type: categorical

    entities:
      - name: sales_person
        type: primary 
        expr: sales_person_id
```

The following code represents a separate semantic model that holds a fact table for `transactions`:  

```yaml
semantic_models: 
  - name: transactions 
    description: |
      Each row represents one transaction.
      There is a transaction, product, sales_person, and customer id for 
      every transaction. There is only one transaction id per 
      transaction. The `metric_time` or date is reflected in UTC.
    model: {{ ref(fact_transactions) }}
    defaults:
      agg_time_dimension: metric_time

    entities:
      - name: transaction_id
        type: primary
      - name: customer
        type: foreign
        expr: customer_id
      - name: product
        type: foreign
        expr: product_id
      - name: sales_person
        type: foreign
        expr: sales_person_id

    measures:
      - name: transactions
        expr: 1
        agg: sum
      - name: gross_sales
        expr: sales_price
        agg: sum
      - name: sales_persons_with_a_sale
        expr: sales_person_id
        agg: count_distinct

    dimensions:
      - name: metric_time
        type: time
        is_partition: true
        type_params:
          time_granularity: day
      - name: sales_geo
        type: categorical
```

You can now access the metrics in the `transactions` semantic model organized by the slowly changing dimension of `tier`. 

In the sales tier example,  For instance, if a salesperson was Tier 1 from 2022-03-01 to 2022-03-12, and gets promoted to Tier 2 from 2022-03-12 onwards, all transactions from March would be categorized under Tier 1 since the dimensions value of Tier 1 comes earlier (and is the default starting point), even though the salesperson was promoted to Tier 2 on 2022-03-12.

</TabItem>

<TabItem value="example2" label="SCD table example 2">

This example shows how to create slowly changing dimensions (SCD) using a semantic model. The SCD table contains information about salespersons' tier and the time length of that tier. Suppose you have the underlying SCD table:

| sales_person_id | tier | start_date | end_date | 
|-----------------|------|------------|----------|
| 111             | 1    | 2019-02-03 | 2020-01-05| 
| 111             | 2    | 2020-01-05 | 2048-01-01| 
| 222             | 2    | 2020-03-05 | 2048-01-01| 
| 333             | 2    | 2020-08-19 | 2021-10-22| 
| 333             | 3    | 2021-10-22 | 2048-01-01|  

In the sales tier example, if sales_person_id 456 is Tier 2 from 2022-03-08 onwards, but there is no associated tier level dimension for this person from 2022-03-01 to 2022-03-08, then all transactions associated with sales_person_id 456 for the month of March will be grouped under 'NA' since no tier is present prior to Tier 2.

The following command or code represents how to return the count of transactions generated by each sales tier per month:

```
mf query --metrics transactions --dimensions metric_time__month,sales_person__tier --order metric_time__month --order sales_person__tier

```

</TabItem>
</Tabs>
