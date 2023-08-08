---
title: "About MetricFlow"
id: about-metricflow
description: "Learn more about MetricFlow and its key concepts"
sidebar_label: About MetricFlow
tags: [Metrics, Semantic Layer]
---

This guide introduces MetricFlow's fundamental ideas for new users. MetricFlow, which powers the dbt Semantic Layer, helps you define and manage the logic for your company's metrics. It's an opinionated set of abstractions and helps data consumers retrieve metric datasets from a data platform quickly and efficiently.

:::info

MetricFlow is a new way to define metrics in dbt and one of the key components of the [dbt Semantic Layer](/docs/use-dbt-semantic-layer/dbt-sl). It handles SQL query construction and defines the specification for dbt semantic models and metrics. 

To fully experience the dbt Semantic Layer, including the ability to query dbt metrics via external integrations, you'll need a [dbt Cloud Team or Enterprise account](https://www.getdbt.com/pricing/).

:::

There are a few key principles:

- **Flexible, but complete** &mdash;  Ability to create any metric on any data model by defining logic in flexible abstractions.
- **Don't Repeat Yourself (DRY)** &mdash; Avoid repetition by allowing metric definitions to be enabled whenever possible.
- **Simple with progressive complexity** &mdash; Make MetricFlow approachable by relying on known concepts and structures in data modeling. 
- **Performant and efficient** &mdash; Allow for performance optimizations in centralized data engineering while still enabling distributed definition and ownership of logic.

## MetricFlow

- MetricFlow is a SQL query generation engine that helps you create metrics by constructing appropriate queries for different granularities and dimensions that are useful for various business applications. 

- It uses YAML files to define a semantic graph, which maps language to data. This graph consists of [semantic models](/docs/build/semantic-models), which serve as data entry points, and [metrics](/docs/build/metrics-overview), which are functions used to create new quantitative indicators.

- MetricFlow is a [BSL package](https://github.com/dbt-labs/metricflow) (code is source available) and available on dbt versions 1.6 and higher. Data practitioners and enthusiasts are highly encouraged to contribute. 

- MetricFlow, as a part of the dbt Semantic Layer, allows organizations to define company metrics logic through YAML abstractions, as described in the following sections.

- You can install MetricFlow using PyPI as an extension of your [dbt adapter](/docs/supported-data-platforms) in the CLI. To install the adapter, run `pip install "dbt-metricflow[your_adapter_name]"` and add the adapter name at the end of the command. For example, for a Snowflake adapter run `pip install "dbt-metricflow[snowflake]"`.

- To query metrics dimensions, dimension values, and validate your configurations; install the [MetricFlow CLI](/docs/build/metricflow-cli).

### Semantic graph 

We're introducing a new concept: a "semantic graph". It's the relationship between semantic models and YAML configurations that creates a data landscape for building metrics. You can think of it like a map, where tables are like locations, and the connections between them (edges) are like roads. Although it's under the hood, the semantic graph is a subset of the <Term id="dag" />, and you can see the semantic models as nodes on the DAG.

The semantic graph helps us decide which information is available to use for consumption and which is not. The connections between tables in the semantic graph are more about relationships between the information. This is different from the DAG, where the connections show dependencies between tasks.

When MetricFlow generates a metric, it uses its SQL engine to figure out the best path between tables using the framework defined in YAML files for semantic models and metrics. When these models and metrics are correctly defined, they can be used downstream with dbt Semantic Layer's integrations.

### Semantic models 

Semantic models are the starting points of data and correspond to models in your dbt project. You can create multiple semantic models from each model. Semantic models have metadata, like a data table, that define important information such as the table name and primary keys for the graph to be navigated correctly.

For a semantic model, there are three main pieces of metadata:

* [Entities](/docs/build/entities) &mdash; The join keys of your semantic model (think of these as the traversal paths, or edges between semantic models).
* [Dimensions](/docs/build/dimensions) &mdash; These are the ways you want to group or slice/dice your metrics.
* [Measures](/docs/build/measures) &mdash; The aggregation functions that give you a numeric result and can be used to create your metrics.

### Metrics 

Metrics, which is a key concept, are functions that combine measures, constraints, or other mathematical functions to define new quantitative indicators. MetricFlow uses measures and various aggregation types, such as average, sum, and count distinct, to create metrics.  Dimensions add context to metrics and without them, a metric is simply a number for all time. You can define metrics in the same YAML files as your semantic models, or create a new file.

MetricFlow supports different metric types:

- [Cumulative](/docs/build/cumulative) &mdash;  Aggregates a measure over a given window.
- [Derived](/docs/build/derived) &mdash; An expression of other metrics, which allows you to do calculations on top of metrics.
- [Ratio](/docs/build/ratio) &mdash; Create a ratio out of two measures, like revenue per customer.
- [Simple](/docs/build/simple) &mdash; Metrics that refer directly to one measure. 

## Use case

In the upcoming sections, we'll show how data practitioners currently calculate metrics and compare it to how MetricFlow makes defining metrics easier and more flexible. 

The following example data is based off the Jaffle Shop repo. You can view the complete [dbt project](https://github.com/dbt-labs/jaffle-sl-template). The tables we're using in our example model are:

- `orders` is a production data platform export that has been cleaned up and organized for analytical consumption
- `customers` is a partially denormalized table in this case with a column derived from the orders table through some upstream process

<!-- ![MetricFlow-SchemaExample](/img/docs/building-a-dbt-project/MetricFlow-SchemaExample.jpeg) -->

To make this more concrete, consider the metric `order_total`, which is defined using the SQL expression:

`select sum(order_total) as order_total from orders` 
This expression calculates the revenue from each order by summing the order_total column in the orders table. In a business setting, the metric order_total is often calculated according to different categories, such as"
- Time, for example `date_trunc(ordered_at, 'day')`
- Order Type, using `is_food_order` dimension from the `orders` table.

### Calculate metrics

Next, we'll compare how data practitioners currently calculate metrics with multiple queries versus how MetricFlow simplifies and streamlines the process.

<Tabs>
<TabItem value="mulqueries" label="Calculate with multiple queries">

The following example displays how data practitioners typically would calculate the order_total metric aggregated. It's also likely that analysts are asked for more details on a metric, like how much revenue came from new customers. 

Using the following query creates a situation where multiple analysts working on the same data, each using their own query method &mdash; this can lead to confusion, inconsistencies, and a headache for data management.

```sql
select
    date_trunc('day',orders.ordered_at) as day, 
    case when customers.first_ordered_at is not null then true else false end as is_new_customer,
    sum(orders.order_total) as order_total
from
  orders
left join
  customers
on
  orders.customer_id = customers.customer_id
group by 1, 2
```

</TabItem>
<TabItem value="metricflow" label="Calculate with MetricFlow">

> Introducing MetricFlow, a key component of the dbt Semantic Layer 🤩 - simplifying data collaboration and governance.

In the following three example tabs, use MetricFlow to define a semantic model that uses order_total as a metric and a sample schema to create consistent and accurate results &mdash; eliminating confusion, code duplication, and streamlining your workflow.

<Tabs>
<TabItem value="example1" label="Revenue example">

In this example, a measure named `order_total` is defined based on the order_total column in the `orders` table. 

The time dimension `metric_time` provides daily granularity and can be aggregated to weekly or monthly time periods. Additionally, a categorical dimension called `is_new_customer` is specified in the `customers` semantic model.


```yaml
semantic_models:
  - name: orders    #The name of the semantic model
    description: |
      Model containing order data. The grain of the table is the order id.
    model: ref('orders') #The name of the dbt model and schema
    defaults:
      agg_time_dimension: metric_time
    entities: #Entities. These usually correspond to keys in the table.table.
      - name: order_id
        type: primary
      - name: customer
        type: foreign
        expr: customer_id
    measures:   #Measures. These are the aggregations on the columns in the table.
      - name: order_total
        agg: sum
    dimensions: #Dimensions,either categorical or time. These add additional context to metrics. The typical querying pattern is Metric by Dimension.
      - name: metric_time
        expr: cast(ordered_at as date)
        type: time
        type_params:
          time_granularity: day
      - name: customers
        defaults: null
        agg_time_dimension: first_ordered_at
        description: >
          Customer dimension table. The grain of the table is one row per
          customer.
        model: ref('customers') # The name of the dbt model and schema
    entities: #Entities. These usually correspond to keys in the table.
      - name: customer 
        type: primary
        expr: customer_id
    dimensions:
      - name: is_new_customer
        type: categorical
        expr: case when first_ordered_at is not null then true else false end
      - name: first_ordered_at
        type: time
        type_params:
          time_granularity: day

  ```

</TabItem>
<TabItem value="example2" label="More dimensions example">

Similarly, you could then add additional dimensions like `is_food_order` to your semantic models to incorporate even more dimensions to slice and dice your revenue order_total. 

```yaml
semantic_models:
  - name: orders
    description: |
      Model containing order data. The grain of the table is the order id.
    model: ref('orders')  #The name of the dbt model and schema
    defaults:
      agg_time_dimension: metric_time
    entities: #Entities. These usually correspond to keys in the table.table.
      - name: order_id
        type: primary
      - name: customer
        type: foreign
        expr: customer_id
    measures: #Measures. These are the aggregations on the columns in the table.
      - name: order_total
        agg: sum
    dimensions: #Dimensions,either categorical or time. These add additional context to metrics. The typical querying pattern is Metric by Dimension.
      - name: metric_time
        expr: cast(ordered_at as date)
        type: time
        type_params:
          time_granularity: day
      - name: is_food_order
        type: categorical
```
</TabItem>
<TabItem value="example3" label="Advanced example">

Imagine an even more complex metric is needed, like the amount of money earned each day from food orders from returning customers. Without MetricFlow the data practitioner's original SQL might look like this:

```sql
select
    date_trunc('day',orders.ordered_at) as day, 
    sum(case when is_food_order = true then order_total else null end) as food_order,
    sum(orders.order_total) as sum_order_total,
    food_order/sum_order_total
from
  orders
left join
  customers
on
  orders.customer_id = customers.customer_id
where
  case when customers.first_ordered_at is not null then true else false end = true
group by 1
```

MetricFlow simplifies the SQL process via metric YAML configurations as seen below. You can also commit them to your git repository to ensure everyone on the data and business teams can see and approve them as the true and only source of information.

```yaml
metrics:
  - name: food_order_pct_of_order_total
    description: Revenue from food orders in each store
    label: "Food % of Order Total"
    type: ratio
    type_params:
      numerator: food_order
      denominator: active_customers
    filter: |
      {{ Dimension('customer__is_new_customer')}} = true
```
</TabItem>
</Tabs>

</TabItem>
</Tabs>

## FAQs

<details>
  <summary>Do my datasets need to be normalized?</summary>
  <div>
    <div>Not at all! While a cleaned and well-modeled data set can be extraordinarily powerful and is the ideal input, you can use any dataset from raw to fully denormalized datasets. <br /><br />It's recommended that you apply quality data consistency, such as filtering bad data, normalizing common objects, and data modeling of keys and tables, in upstream applications. The Semantic Layer is more efficient at doing data denormalization instead of normalization. <br /><br />If you have not invested in data consistency, that is okay. The Semantic Layer can take SQL queries or expressions to define consistent datasets.</div>
  </div>
</details>
<details>
  <summary>Why is normalized data the ideal input?</summary>
  <div>
    <div> MetricFlow is built to do denormalization efficiently. There are better tools to take raw datasets and accomplish the various tasks required to build data consistency and organized data models. On the other end, by putting in denormalized data you are potentially creating redundancy which is technically challenging to manage, and you are reducing the potential granularity that MetricFlow can use to aggregate metrics.</div>
  </div>
</details>
<details>
  <summary>Why not just make metrics the same as measures?</summary>
  <div>
    <div>One principle of MetricFlow is to reduce the duplication of logic sometimes referred to as Don't Repeat Yourself(DRY).<br /><br />Many metrics are constructed from reused measures and in some cases constructed from measures from different semantic models. This allows for metrics to be built breadth-first (metrics that can stand alone) instead of depth-first (where you have multiple metrics acting as functions of each other).<br /><br />Additionally, not all metrics are constructed off of measures. As an example, a conversion metric is likely defined as the presence or absence of an event record after some other event record.</div>
  </div>
</details>
<details>
  <summary>How does the Semantic Layer handle joins?</summary>
  <div>
    <div>MetricFlow builds joins based on the types of keys and parameters that are passed to entities. To better understand how joins are constructed see our documentations on join types.<br /><br />Rather than capturing arbitrary join logic, MetricFlow captures the types of each identifier and then helps the user to navigate to appropriate joins. This allows us to avoid the construction of fan out and chasm joins as well as generate legible SQL.</div>
  </div>
</details>
<details>
  <summary>Are entities and join keys the same thing?</summary>
  <div>
    <div>If it helps you to think of entities as join keys, that is very reasonable. Entities in MetricFlow have applications beyond joining two tables, such as acting as a dimension.</div>
  </div>
</details> 
<details>
  <summary>Can a table without a primary or unique entities have dimensions?</summary>
  <div>
    <div>Yes, but because a dimension is considered an attribute of the primary or unique ent of the table, they are only usable by the metrics that are defined in that table. They cannot be joined to metrics from other tables. This is common in event logs.</div>
  </div>
</details>


## Related docs
- [Joins](/docs/build/join-logic)
- [Validations](/docs/build/validation) 

