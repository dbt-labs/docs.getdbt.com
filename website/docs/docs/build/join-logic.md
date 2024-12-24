---
title: Joins
id: join-logic
description: "Joins allow you to combine data from different tables and create new metrics"
sidebar_label: "Joins"
tags: [Metrics, Semantic Layer]
---

Joins are a powerful part of MetricFlow and simplify the process of making all valid dimensions available for your metrics at query time, regardless of where they are defined in different semantic models. With Joins, you can also create metrics using measures from different semantic models.

Joins use `entities` defined in your semantic model configs as the join keys between tables. Assuming entities are defined in the semantic model, MetricFlow creates a graph using the semantic models as nodes and the join paths as edges to perform joins automatically. MetricFlow chooses the appropriate join type and avoids fan-out or chasm joins with other tables based on the entity types.

<Expandable alt_header="What are fan-out or chasm joins?" >
-  Fan-out joins are when one row in a table is joined to multiple rows in another table, resulting in more output rows than input rows.
-  Chasm joins are when two tables have a many-to-many relationship through an intermediate table, and the join results in duplicate or missing data.
</Expandable>

## Types of joins

:::tip Joins are auto-generated
MetricFlow automatically generates the necessary joins to the defined semantic objects, eliminating the need for you to create new semantic models or configuration files.

This section explains the different types of joins that can be used with entities and how to query them.
:::

Metricflow uses these specific join strategies:

- Primarily uses left joins when joining `fct` and `dim` models. Left joins make sure all rows from the "base" table are retained, while matching rows are included from the joined table.
- For queries that involve multiple `fct` models, MetricFlow uses full outer joins to ensure all data points are captured, even when some `dim` or `fct` models are missing in certain tables. 
- MetricFlow restricts the use of fan-out and chasm joins. 

Refer to [SQL examples](#sql-examples) for more information on how MetricFlow handles joins in practice.

The following table identifies which joins are allowed based on specific entity types to prevent the creation of risky joins. This table primarily represents left joins unless otherwise specified. For scenarios involving multiple `fct` models, MetricFlow uses full outer joins.

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

### Semantic validation

MetricFlow performs semantic validation by executing `explain` queries in the data platform to ensure that the generated SQL gets executed without errors. This validation includes:

- Verifying that all referenced tables and columns exist.
- Ensuring the data platform supports SQL functions, such as `date_diff(x, y)`.
- Checking for ambiguous joins or paths in multi-hop joins.

If validation fails, MetricFlow surfaces errors for users to address before executing the query.

## Example

The following example uses two semantic models with a common entity and shows a MetricFlow query that requires a join between the two semantic models. The two semantic models are:
- `transactions`
- `user_signup`

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

- MetricFlow uses `user_id` as the join key to link two semantic models, `transactions` and `user_signup`. This allows you to query the `average_purchase_price` metric in the `transactions` semantic model, grouped by the `type` dimension in the `user_signup` semantic model.
  - Note that the `average_purchase_price` measure is defined in `transactions`, where `user_id` is a foreign entity. However, `user_signup` has `user_id` as a primary entity. 
- Since `user_id` is a foreign key in `transactions` and a primary key in `user_signup`, MetricFlow performs a left join where `transactions` joins `user_signup` to access the `average_purchase_price` measure defined in `transactions`.
- To query dimensions from different semantic models, add a double underscore (or dunder) to the dimension name after joining the entity in your editing tool. The following query, `user_id__type` is included as a dimension using the `--group-by` flag (`type` is the dimension).

```yaml 
dbt sl query --metrics average_purchase_price --group-by metric_time,user_id__type # In dbt Cloud
```

```yaml 
mf query --metrics average_purchase_price --group-by metric_time,user_id__type # In dbt Core
```

#### SQL examples

These SQL examples show how MetricFlow handles both left join and full outer join scenarios in practice:

<Tabs>
<TabItem value="SQL example for left join"> 

Using the previous example for `transactions` and `user_signup` semantic models, this shows a left join between those two semantic models.

```sql
select
  transactions.user_id,
  transactions.purchase_price,
  user_signup.type
from transactions
left outer join user_signup
  on transactions.user_id = user_signup.user_id
where transactions.purchase_price is not null
group by
  transactions.user_id,
  user_signup.type;
```
</TabItem>

<TabItem value="SQL example for outer joins"> 

If you have multiple `fct` models, let's say `sales` and `returns`, MetricFlow uses full outer joins to ensure all data points are captured. 

This example shows a full outer join between the `sales` and `returns` semantic models.

```sql
select
  sales.user_id,
  sales.total_sales,
  returns.total_returns
from sales
full outer join returns
  on sales.user_id = returns.user_id
where sales.user_id is not null or returns.user_id is not null;
```

</TabItem>
</Tabs>

## Multi-hop joins

MetricFlow allows users to join measures and dimensions across a graph of entities by moving from one table to another within a graph. This is referred to as "multi-hop join". 

MetricFlow can join up to three tables, supporting multi-hop joins with a limit of two hops. This does the following:
- Enables complex data analysis without ambiguous paths.
- Supports navigating through data models, like moving from `orders` to `customers` to `country` tables.

While direct three-hop paths are limited to prevent confusion from multiple routes to the same data, MetricFlow does allow joining more than three tables if the joins don’t exceed two hops to reach a dimension. 

For example, if you have two models, `country` and `region`, where customers are linked to countries, which in turn are linked to regions, you can join all of them in a single SQL query and can dissect `orders` by `customer__country_country_name` but not by `customer__country__region_name`.

![Multi-Hop-Join](/img/docs/building-a-dbt-project/multihop-diagram.png "Example schema for reference")

Notice how the schema can be translated into the following three MetricFlow semantic models to create the metric 'Average purchase price by country' using the `purchase_price` measure from the sales table and the `country_name` dimension from the `country_dim` table.

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
        type: unique
    dimensions:
      - name: signup_date
        type: time
      - name: country_dim

  - name: country
    entities:
      - name: country_id
        type: primary
    dimensions:
      - name: country_name
        type: categorical
```

### Query multi-hop joins


To query dimensions _without_ a multi-hop join involved, you can use the fully qualified dimension name with the syntax entity double underscore (dunder) dimension, like `entity__dimension`. 

For dimensions retrieved by a multi-hop join, you need to additionally provide the entity path as a list, like `user_id`.

