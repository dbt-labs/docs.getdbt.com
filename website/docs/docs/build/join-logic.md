---
title: Joins
id: join-logic
description: "Joins allow you to combine data from different tables and create new metrics"
sidebar_label: "Joins"
tags: [Metrics, Semantic Layer]
---

Joins are a powerful part of MetricFlow and simplify the process of making all valid dimensions available for your metrics at query time, regardless of where they are defined in different semantic models. With Joins, you can also create metrics using measures from different semantic models.

Joins use `entities` defined in your semantic model configs as the join keys between tables. Assuming entities are defined in the semantic model, MetricFlow creates a graph using the semantic models as nodes and the join paths as edges to perform joins automatically. MetricFlow chooses the appropriate join type and avoids fan-out or chasm joins with other tables based on the entity types.

<details>
  <summary>What are fan-out or chasm joins?</summary>
  <div>
    <div>&mdash; Fan-out joins are when one row in a table is joined to multiple rows in another table, resulting in more output rows than input rows.<br /><br />
    &mdash; Chasm joins are when two tables have a many-to-many relationship through an intermediate table, and the join results in duplicate or missing data. </div>
  </div>
</details>


## Types of joins

:::tip Joins are auto-generated
MetricFlow automatically generates the necessary joins to the defined semantic objects, eliminating the need for you to create new semantic models or configuration files.

This document explains the different types of joins that can be used with entities and how to query them using the CLI.
:::

MetricFlow primarily uses left joins for joins, and restricts the use of fan-out and chasm joins. Refer to the table below to identify which joins are or aren't allowed based on specific entity types to prevent the creation of risky joins.

| entity type - Table A | entity type - Table B | Join type            |
|---------------------------|---------------------------|----------------------|
| Primary                   | Primary                   | ✅ Left                 |
| Primary                   | Unique                    | ✅ Left                 |
| Primary                   | Foreign                   | ❌ Fan-out (Not allowed) |
| Unique                    | Primary                   | ✅ Left                 |
| Unique                    | Unique                    | ✅ Left                 |
| Unique                    | Foreign                   | ❌ Fan-out (Not allowed) |
| Foreign                   | Primary                   | ✅ Left                 |
| Foreign                   | Unique                    | ✅ Left                 |
| Foreign                   | Foreign                   | ❌ Fan-out (Not allowed) |   

### Example

The following example uses two semantic models with a common entity and shows a MetricFlow query that requires a join between the two semantic models. 

Let's say you have two semantic models, `transactions` and `user_signup` as seen in the following example: 

```yaml
semantic_models:
  - name: transactions
    entities:
      - name: id
        type: primary
      - name: user
        type: foreign
        expr: user_id
    measures:
      - name: average_purchase_price
        agg: avg
        expr: purchase_price
  - name: user_signup
    entities:
      - name: user
        type: primary
        expr: user_id
    dimensions:
      - name: type
        type: categorical
```

MetricFlow will use `user_id` as the join key to join two semantic models, `transactions` and `user_signup`. This enables you to query the `average_purchase_price` metric in `transactions`, sliced by the `type` dimension in the `user_signup` semantic model.

Note that the `average_purchase_price` measure is defined in the `transactions` semantic model, where `user_id` is a foreign entity. However, the `user_signup` semantic model has `user_id` as a primary entity. 

Since this is a foreign-to-primary relationship, a left join is implemented where the `transactions` semantic model joins the `user_signup` semantic model, since the `average_purchase_price` measure is defined in the `transactions` semantic model.

When querying dimensions from different semantic models using the CLI, a double underscore (or dunder) is added to the dimension name after the joining entity. In the CLI query shown below, `user_id__type` is included as a `dimension`.

```yaml 
mf query --metrics average_purchase_price --dimensions metric_time,user_id__type 
```

## Multi-hop joins

:::info
This feature is currently in development and not currently available. 
:::

MetricFlow allows users to join measures and dimensions across a graph of entities, which we refer to as a 'multi-hop join.' This is because users can move from one table to another like a 'hop' within a graph.

Here's an example schema for reference:

![Multi-Hop-Join](/img/docs/building-a-dbt-project/multihop-diagram.png)

Notice how this schema can be translated into the three MetricFlow semantic models below to create the metric 'Average purchase price by country' using the `purchase_price` measure from the sales table and the `country_name` dimension from the `country_dim` table.

```yaml
semantic_models:
  - name: sales
    defaults:
      agg_time_dimension: first_ordered_at
    entities:
      - name: id
        type: primary
      - name: user_id
        type: foreign
    measures:
      - name: average_purchase_price
        agg: avg
        expr: purchase_price
    dimensions:
      - name: metric_time
        type: time
        type_params:
  - name: user_signup
    entities:
      - name: user_id
        type: primary
      - name: country_id
        type: Unique
    dimensions:
      - name: signup_date
        type: time
      - name: country_dim
    entities:
      - name: country_id
        type: primary
    dimensions:
      - name: country_name
        type: categorical
```

### Query multi-hop joins

:::info 
This feature is currently in development and not currently available.
::: 

To query dimensions _without_ a multi-hop join involved, you can use the fully qualified dimension name with the syntax entity double underscore (dunder) dimension, like `entity__dimension`. 

For dimensions retrieved by a multi-hop join, you need to additionally provide the entity path as a list, like `user_id`.

