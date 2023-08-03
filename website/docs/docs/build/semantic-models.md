---
title: "Semantic models"
id: "semantic-models"
description: "Semantic models are yml abstractions on top of a dbt mode, connected via joining keys as edges"
keywords:
  - dbt metrics layer
sidebar_label: Semantic models
tags: [Metrics, Semantic Layer]
---

Semantic models serve as the foundation for defining data in MetricFlow, which powers the dbt Semantic Layer. You can think of semantic models as nodes in your semantic graph, connected via entities as edges. MetricFlow takes semantic models defined in YAML configuration files as inputs and creates a semantic graph that can be used to query metrics.

Each semantic model corresponds to a dbt model in your DAG. Therefore you will have one YAML config for each semantic model in your dbt project. You can create multiple semantic models out of a single dbt model, as long as you give each semantic model a unique name. 

You can configure semantic models in your dbt project directory in a `YAML` file. Depending on your project structure, you can nest semantic models under a `metrics:` folder or organize them under project sources. 

Semantic models have 6 components and this page explains the definitions with some examples:

| Component | Description | Type |
| --------- | ----------- | ---- |
| [Name](#name) | Unique name for the semantic model | Required |
| [Description](#description) | Includes important details in the description | Optional |
| [Model](#model) | Specifies the dbt model for the semantic model using the `ref` function | Required |
| [Defaults](#defaults) | The defaults for the model, currently only `agg_time_dimension` is supported.  | Required |
| [Entities](#entities) | Uses the columns from entities as join keys and indicate their type as primary, foreign, or unique keys with the `type` parameter | Required |
| [Dimensions](#dimensions) | Different ways to group or slice data for a metric, they can be `time` or `categorical` | Required |
| [Measures](#measures) | Aggregations applied to columns in your data model. They can be the final metric or used as building blocks for more complex metrics | Optional |
| [Primary Entity](#primary) | If the semantic model has no primary entity, then this property is required. | Optional |

## Semantic models components

The complete spec for semantic models is below:
```yaml
semantic_models:
  - name: the_name_of_the_semantic_model      ## Required
    description: same as always               ## Optional
    model: ref('some_model')                  ## Required
    defaults:                                 ## Required
        agg_time_dimension: dimension_name    ## Required if the model contains dimensions
    entities:                                 ## Required
       - see more information in entities
    measures:                                 ## Optional
       - see more information in measures section
    dimensions:                               ## Required
       - see more information in dimensions section
    primary_entity: if the semantic model has no primary entity, then this property is required. #Optional if a primary entity exists, otherwise Required
```

The following example displays a complete configuration and detailed descriptions of each field:

```yml
semantic_models:
  - name: transaction # A semantic model with the name Transactions
    model: ref('fact_transactions') # References the dbt model named `fact_transactions`
    description: "Transaction fact table at the transaction level. This table contains one row per transaction and includes the transaction timestamp."
    defaults:
      agg_time_dimension: transaction_date

    entities: # Entities included in the table are defined here. MetricFlow will use these columns as join keys.
      - name: transaction
        type: primary
        expr: transaction_id
      - name: customer
        type: foreign
        expr: customer_id


    dimensions: # dimensions are qualitative values such as names, dates, or geographical data. They provide context to metrics and allow "metric by group" data slicing.
      - name: transaction_date
        type: time
        type_params:
          time_granularity: day

      - name: transaction_location
        type: categorical
        expr: order_country

    measures: # Measures are columns we perform an aggregation over. Measures are inputs to metrics.
      - name: transaction_total
        description: "The total value of the transaction."
        agg: sum

      - name: sales
        description: "The total sale of the transaction."
        agg: sum
        expr: transaction_total

      - name: median_sales
        description: "The median sale of the transaction."
        agg: median
        expr: transaction_total

  - name: customers # Another semantic model called customers.
    model: ref('dim_customers')
    description: "A customer dimension table."

    entities:
      - name: customer
        type: primary
        expr: customer_id

    dimensions:
      - name: first_name
        type: categorical
```

### Name 

Define the name of the semantic model. You must define a unique name for the semantic model. The semantic graph will use this name to identify the model, and you can update it at any time.

### Description 

Includes important details in the description of the semantic model. This description will primarily be used by other configuration contributors. You can use the pipe operator `(|)` to include multiple lines in the description.

### Model 

Specify the dbt model for the semantic model using the [`ref` function](/reference/dbt-jinja-functions/ref).

### Defaults
Defaults for the semantic model. Currently only `agg_time_dimension`. `agg_time_dimension` represents the default time dimensions for measures. This can be overriden by adding the `agg_time_dimension` key directly to a measure - see [Dimensions](/docs/build/dimensions) for examples. 
### Entities 

To specify the [entities](/docs/build/entities) in your model, use their columns as join keys and indicate their `type` as primary, foreign, or unique keys with the type parameter.

### Primary Entity
If your data source does not have a primary entity, you need to manually specify one. Metricflow requers that all dimensions be tied to an entity. You can define a primary entity using the following configs:

```yaml:
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

<Tabs>

<TabItem value="entitytypes" value="Entity types">

Here are the types of keys:

- **Primary** &mdash; Only one record per row in the table, and it includes every record in the data platform.
- **Unique** &mdash; Only one record per row in the table, but it may have a subset of records in the data platform. Null values may also be present.
- **Foreign** &mdash; Can have zero, one, or multiple instances of the same record. Null values may also be present.
- **Natural** &mdash; A column or combination of columns in a table that uniquely identifies a record based on real-world data. For example, the `sales_person_id` can serve as a natural key in a `sales_person_department` dimension table.

</TabItem>
<TabItem value="sample" label="Sample config">

This example shows a semantic model with three entities and their entity types: `transaction` (primary), `order` (foreign), and `user` (foreign).

To reference a desired column, use the actual column name from the model in the `name` parameter. You can also use `name` as an alias to rename the column, and the `expr` parameter to refer to the original column name or a SQL expression of the column.


```yml
entity:
  - name: transaction
    type: primary
  - name: order
    type: foreign
    expr: id_order
  - name: user
    type: foreign
    expr: substring(id_order FROM 2)
```

You can refer to entities (join keys) in a semantic model using the `name` parameter. Entity names must be unique within a semantic model, and identifier names can be non-unique across semantic models since MetricFlow uses them for [joins](/docs/build/join-logic). <!--You can also create [composite keys](/docs/build/entities#composite-keys), like in event logs where a unique ID is a combination of timestamp, event type keys, and machine IDs.-->

</TabItem>
</Tabs>

### Dimensions 

[Dimensions](/docs/build/dimensions) are the different ways you can group or slice data for a metric. It can be time-consuming and error-prone to anticipate all possible options in a single table, such as region, country, user role, and so on. 

MetricFlow simplifies this by allowing you to query all metric groups and construct the join during the query. To specify dimensions parameters, include the `name` (either a column or SQL expression) and `type` (`categorical` or `time`). Categorical groups represent qualitative values, while time groups represent dates of varying granularity.

Dimensions are identified using the name parameter, just like identifiers. The naming of groups must be unique within a semantic model, but not across semantic models since MetricFlow, uses entities to determine the appropriate groups. MetricFlow requires all dimensions be tied to a primary entity. 

:::info For time groups

For semantic models with a measure, you must have a [primary time group](/docs/build/dimensions#time).

:::

### Measures

[Measures](/docs/build/measures) are aggregations applied to columns in your data model. They can be used as the foundational building blocks for more complex metrics, or be the final metric itself. Measures have various parameters which are listed in a table along with their descriptions and types.

| Parameter | Description | Field type |
| --- | --- | --- |
| `name`| Provide a name for the measure, which must be unique and can't be repeated across all semantic models in your dbt project. | Required |
| `description` | Describes the calculated measure. | Optional |
| `agg` | dbt supports the following aggregations: `sum`, `max`, `min`, `count_distinct`, and `sum_boolean`. | Required |
| `expr` | You can either reference an existing column in the table or use a SQL expression to create or derive a new one. | Optional |
| `non_additive_dimension` | Non-additive dimensions can be specified for measures that cannot be aggregated over certain dimensions, such as bank account balances, to avoid producing incorrect results. | Optional |
| `create_metric`* | You can create a metric directly from a measure with create_metric: True and specify its display name with create_metric_display_name. | Optional |
_*Coming soon_


import SetUpPages from '/snippets/_metrics-dependencies.md';

<SetUpPages />

## Related docs

- [About MetricFlow](/docs/build/about-metricflow)
- [Dimensions](/docs/build/dimensions)
- [Entities](/docs/build/entities)
- [Measures](/docs/build/measures)
