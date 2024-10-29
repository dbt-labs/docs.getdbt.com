---
title: "Semantic models"
id: "semantic-models"
description: "Semantic models are yml abstractions on top of a dbt mode, connected via joining keys as edges"
keywords:
  - dbt metrics layer
sidebar_label: Semantic models
tags: [Metrics, Semantic Layer]
pagination_next: "docs/build/dimensions"
---

Semantic models are the foundation for data definition in MetricFlow, which powers the dbt Semantic Layer:

- Think of semantic models as nodes connected by entities in a semantic graph.
- MetricFlow uses YAML configuration files to create this graph for querying metrics.
- Each semantic model corresponds to a dbt model in your DAG, requiring a unique YAML configuration for each semantic model.
- You can create multiple semantic models from a single dbt model (SQL or Python), as long as you give each semantic model a unique name.
- Configure semantic models in a YAML file within your dbt project directory. Refer to the [best practices guide](/best-practices/how-we-build-our-metrics/semantic-layer-1-intro) for more info on project structuring.
- Organize them under a `metrics:` folder or within project sources as needed.

<Lightbox src="/img/docs/dbt-cloud/semantic-layer/semantic_foundation.jpg" width="70%" title="A semantic model is made up of different components: Entities, Measures, and Dimensions."/>

import SLCourses from '/snippets/\_sl-course.md';

<SLCourses/>

Here we describe the Semantic model components with examples:

| Component                         | Description                                                                                                                                                                                                                                                                    | Type     |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------- |
| [Name](#name)                     | Choose a unique name for the semantic model. Avoid using double underscores (\_\_) in the name as they're not supported.                                                                                                                                                       | Required |
| [Description](#description)       | Includes important details in the description                                                                                                                                                                                                                                  | Optional |
| [Model](#model)                   | Specifies the dbt model for the semantic model using the `ref` function                                                                                                                                                                                                        | Required |
| [Defaults](#defaults)             | The defaults for the model, currently only `agg_time_dimension` is supported.                                                                                                                                                                                                  | Required |
| [Entities](#entities)             | Uses the columns from entities as join keys and indicate their type as primary, foreign, or unique keys with the `type` parameter                                                                                                                                              | Required |
| [Primary Entity](#primary-entity) | If a primary entity exists, this component is Optional. If the semantic model has no primary entity, then this property is required.                                                                                                                                           | Optional |
| [Dimensions](#dimensions)         | Different ways to group or slice data for a metric, they can be `time` or `categorical`                                                                                                                                                                                        | Required |
| [Measures](#measures)             | Aggregations applied to columns in your data model. They can be the final metric or used as building blocks for more complex metrics                                                                                                                                           | Optional |
| Label                             | The display name for your semantic model `node`, `dimension`, `entity`, and/or `measures`                                                                                                                                                                                      | Optional |
| `config`                          | Use the [`config`](/reference/resource-properties/config) property to specify configurations for your metric. Supports [`meta`](/reference/resource-configs/meta), [`group`](/reference/resource-configs/group), and [`enabled`](/reference/resource-configs/enabled) configs. | Optional |

## Semantic models components

The complete spec for semantic models is below:

```yaml
semantic_models:
  - name: the_name_of_the_semantic_model ## Required
    description: same as always ## Optional
    model: ref('some_model') ## Required
    defaults: ## Required
      agg_time_dimension: dimension_name ## Required if the model contains measures
    entities: ## Required
      - see more information in entities
    measures: ## Optional
      - see more information in the measures section
    dimensions: ## Required
      - see more information in the dimensions section
    primary_entity: >-
      if the semantic model has no primary entity, then this property is required. #Optional if a primary entity exists, otherwise Required
```

You can refer to the [best practices guide](/best-practices/how-we-build-our-metrics/semantic-layer-1-intro) for more info on project structuring.

The following example displays a complete configuration and detailed descriptions of each field:

```yaml
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

Semantic models support [`meta`](/reference/resource-configs/meta), [`group`](/reference/resource-configs/group), and [`enabled`](/reference/resource-configs/enabled) [`config`](/reference/resource-properties/config) property in either the schema file or at the project level:

- Semantic model config in `models/semantic.yml`:

  ```yml
  semantic_models:
    - name: orders
      config:
        enabled: true | false
        group: some_group
        meta:
          some_key: some_value
  ```

- Semantic model config in `dbt_project.yml`:

  ```yml
  semantic-models:
    my_project_name:
      +enabled: true | false
      +group: some_group
      +meta:
        some_key: some_value
  ```

For more information on `dbt_project.yml` and config naming conventions, see the [dbt_project.yml reference page](/reference/dbt_project.yml#naming-convention).

### Name

Define the name of the semantic model. You must define a unique name for the semantic model. The semantic graph will use this name to identify the model, and you can update it at any time. Avoid using double underscores (\_\_) in the name as they're not supported.

### Description

Includes important details in the description of the semantic model. This description will primarily be used by other configuration contributors. You can use the pipe operator `(|)` to include multiple lines in the description.

### Model

Specify the dbt model for the semantic model using the [`ref` function](/reference/dbt-jinja-functions/ref).

### Defaults

Defaults for the semantic model. Currently only `agg_time_dimension`. `agg_time_dimension` represents the default time dimensions for measures. This can be overridden by adding the `agg_time_dimension` key directly to a measure - see [Dimensions](/docs/build/dimensions) for examples.

### Entities

To specify the [entities](/docs/build/entities) in your model, use their columns as join keys and indicate their `type` as primary, foreign, or unique keys with the type parameter.

### Primary entity

MetricFlow requires that all dimensions be tied to an entity. This is to guarantee unique dimension names. If your data source doesn't have a primary entity, you need to assign the entity a name using the `primary_entity: entity_name` key. It doesn't necessarily have to map to a column in that table and assigning the name doesn't affect query generation.

You can define a primary entity using the following configs:

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

```yaml
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

[Dimensions](/docs/build/dimensions) are different ways to organize or look at data. They are effectively the group by parameters for metrics. For example, you might group data by things like region, country, or job title.

MetricFlow takes a dynamic approach when making dimensions available for metrics. Instead of trying to figure out all the possible groupings ahead of time, MetricFlow lets you ask for the dimensions you need and constructs any joins necessary to reach the requested dimensions at query time. The advantage of this approach is that you don't need to set up a system that pre-materializes every possible way to group data, which can be time-consuming and prone to errors. Instead, you define the dimensions (group by parameters) you're interested in within the semantic model, and they will automatically be made available for valid metrics.

Dimensions have the following characteristics:

- There are two types of dimensions: categorical and time. Categorical dimensions are for things you can't measure in numbers, while time dimensions represent dates and timestamps.
- Dimensions are bound to the primary entity of the semantic model in which they are defined. For example, if a dimension called `full_name` is defined in a model with `user` as a primary entity, then `full_name` is scoped to the `user` entity. To reference this dimension, you would use the fully qualified dimension name `user__full_name`.
- The naming of dimensions must be unique in each semantic model with the same primary entity. Dimension names can be repeated if defined in semantic models with a different primary entity.


:::info For time groups

For semantic models with a measure, you must have a [primary time group](/docs/build/dimensions#time).
:::

### Measures

[Measures](/docs/build/measures) are aggregations applied to columns in your data model. They can be used as the foundational building blocks for more complex metrics, or be the final metric itself.

Measures have various parameters which are listed in a table along with their descriptions and types.

import MeasuresParameters from '/snippets/\_sl-measures-parameters.md';

<MeasuresParameters />

import SetUpPages from '/snippets/\_metrics-dependencies.md';

<SetUpPages />

## Related docs

- [About MetricFlow](/docs/build/about-metricflow)
- [Dimensions](/docs/build/dimensions)
- [Entities](/docs/build/entities)
- [Measures](/docs/build/measures)
- [Semantic Layer best practices guide](/best-practices/how-we-build-our-metrics/semantic-layer-1-intro)
