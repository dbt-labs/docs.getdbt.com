---
title: "About MetricFlow"
id: about-metricflow
description: "Learn more about MetricFlow and its key concepts"
sidebar_label: About MetricFlow
tags: [Metrics, Semantic Layer]
---

This guide introduces MetricFlow's fundamental ideas for new users. MetricFlow, which powers the dbt Semantic Layer, helps you define and manage the logic for your company's metrics. It's an opinionated set of abstractions and helps data consumers retrieve metric datasets from a data platform quickly and efficiently.

:::info

MetricFlow is a new way to define metrics in dbt and one of the key components of the [dbt Semantic Layer](/docs/use-dbt-semantic-layer/dbt-semantic-layer). It handles SQL query construction and defines the specification for dbt semantic models and metrics. 

To fully experience the dbt Semantic Layer, including the ability to query dbt metrics via external integrations, you'll need a [dbt Cloud Team or Enterprise account](https://www.getdbt.com/pricing/).

:::

There are a few key principles:

- **Flexible, but complete** &mdash;  Ability to create any metric on any data model by defining logic in flexible abstractions.
- **Don't Repeat Yourself (DRY)** &mdash; Avoid repetition by allowing metric definitions to be enabled whenever possible.
- **Simple with progressive complexity** &mdash; Make MetricFlow approachable by relying on known concepts and structures in data modeling. 
- **Performant and efficient** &mdash; Allow for performance optimizations in centralized data engineering while still enabling distributed definition and ownership of logic.

## Framework

- MetricFlow is a SQL query generation engine that helps you create metrics by constructing appropriate queries for different granularities and dimensions that are useful for various business applications. 

- It uses YAML files to define a semantic graph, which maps language to data. This graph consists of [semantic models](/docs/build/semantic-models), which serve as data entry points, and [metrics](/docs/build/metrics-overview), which are functions used to create new quantitative indicators.

- MetricFlow is a [BSL package](https://github.com/dbt-labs/metricflow) (code is source available) and available on dbt versions 1.6 and higher. Data practitioners and enthusiasts are highly encouraged to contribute. 

- MetricFlow, as a part of the dbt Semantic Layer, allows organizations to define company metrics logic through YAML abstractions, as described in the following sections.

### Semantic graph 

We're introducing a new concept: a "semantic graph". It's the relationship between semantic models and YAML configurations that creates a data landscape for building metrics. You can think of it like a map, where tables are like locations, and the connections between them (edges) are like roads. Although it's under the hood, the semantic graph is a subset of the <Term id="dag" />, and you can see the semantic models as nodes on the DAG.

The semantic graph helps us decide which information is available to use for consumption and which is not. The connections between tables in the semantic graph are more about relationships between the information. This is different from the DAG, where the connections show dependencies between tasks.

When MetricFlow generates a metric, it uses its SQL engine to figure out the best path between tables using the framework defined in YAML files for semantic models and metrics. When these models and metrics are correctly defined, they can be used downstream with dbt Semantic Layer's integrations.

### Semantic models 

Semantic models are the starting points of data and correspond to models in your dbt project. You can create multiple semantic models from each model. Semantic models have metadata, like a data table, that define important information such as the table name and primary keys for the graph to be navigated correctly.

For a semantic model, there are three main pieces of metadata:

* [Entities](/docs/build/entities) &mdash; The join keys of your semantic model (think of these as the traversal paths, or edges between semantic models).
* [Dimensions](/docs/build/dimensions) &mdash; These are the ways you want to group or slice/dice your metrics.
* [Measures](/docs/build/measures) &mdash; The aggregation functions that give you a numeric result can be used to create your metrics.


### Metrics 

Metrics, which is a key concept, are functions that combine measures, constraints, or other mathematical functions to define new quantitative indicators. MetricFlow uses measures, such as average, sum, and count distinct, to create metrics.  Dimensions add context to metrics and without them, a metric is simply a number for all time. You can define metrics in the same YAML files as your semantic models, or create a new file.

MetricFlow supports different metric types:

- [Cumulative](/docs/build/cumulative) &mdash; Cumulative metrics aggregate a measure over a given window, like weekly active users.
- [Derived](/docs/build/derived) &mdash; An expression of other metrics, which allows you to do calculations on top of metrics.
- [Measure proxy](/docs/build/measure-proxy) &mdash; Metrics that refer directly to one measure. 
- [Ratio](/docs/build/ratio) &mdash; Create a ratio out of two measures, like revenue per customer.


## Use case

In the upcoming sections, we'll show how data practitioners currently calculate metrics and compare it to how MetricFlow makes defining metrics easier and more flexible. 

The following example data schema image shows a number of different types of data tables:

- `transactions` is a production data platform export that has been cleaned up and organized for analytical consumption
- `visits` is a raw event log
- `stores` is a cleaned-up and fully normalized dimensional table from a daily production database export
- `products` is a dimensional table that came from an external source such as a wholesale vendor of the goods this store sells.
- `customers` is a partially denormalized table in this case with a column derived from the transactions table through some upstream process

![MetricFlow-SchemaExample](/img/docs/building-a-dbt-project/MetricFlow-SchemaExample.jpeg)

To make this more concrete, consider the metric `revenue`, which is defined using the SQL expression:

`select sum(price * quantity) as revenue from transactions` 

This expression calculates the total revenue by multiplying the price and quantity for each transaction and then adding up all the results. In business settings, the metric `revenue` is often calculated according to different categories, such as:
- Time, for example `date_trunc(created_at, 'day')`
- Product, using `product_category` from the `product` table.

### Calculate metrics

Next, we'll compare how data practitioners currently calculate metrics with multiple queries versus how MetricFlow simplifies and streamlines the process.

<Tabs>
<TabItem value="mulqueries" label="Calculate with multiple queries">

The following example displays how data practitioners typically would calculate the revenue metric aggregated. It's also likely that analysts are asked for more details on a metric, like how much revenue came from bulk purchases. 

Using the following query creates a situation where multiple analysts working on the same data, each using their own query method &mdash; this can lead to confusion, inconsistencies, and a headache for data management.

```sql
select
    date_trunc(transactions.created_at, 'day') as day
  , products.category as product_category
  , sum(transactions.price * transactions.quantity) as revenue
from
  transactions
left join
  products
on
  transactions.product_id = products.product_id
group by 1, 2
```

</TabItem>
<TabItem value="metricflow" label="Calculate with MetricFlow">

> Introducing MetricFlow, a key component of the dbt Semantic Layer 🤩 - simplifying data collaboration and governance.

In the following three example tabs, use MetricFlow to define a semantic model that uses revenue as a metric and a sample schema to create consistent and accurate results &mdash; eliminating confusion, code duplication, and streamlining your workflow.

<Tabs>
<TabItem value="example1" label="Revenue example">

In this example, a measure named revenue is defined based on two columns in the `schema.transactions` table. The time dimension `ds` provides daily granularity and can be aggregated to weekly or monthly time periods. Additionally, a categorical dimension called `is_bulk_transaction` is specified using a case statement to capture bulk purchases.


```yaml
semantic_model:
  name: transactions
  description: A record for every transaction that takes place. Carts are considered multiple transactions for each SKU.
  owners: support@getdbt.com
  model: (ref('transactions'))

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
    - name: revenue
      description:
      expr: price * quantity
      agg: sum
    - name: quantity
      description: Quantity of products sold
      expr: quantity
      agg: sum
    - name: active_customers
      description: A count of distinct customers completing transactions
      expr: customer_id
      agg: count_distinct

  # --- dimensions ---
  dimensions:
    - name: metric_time
      type: time
      expr: date_trunc('day', ts)
      type_params:
        is_primary: true
        time_granularity: day
    - name: is_bulk_transaction
      type: categorical
      expr: case when quantity > 10 then true else false end
```

</TabItem>
<TabItem value="example2" label="Product example">

Similarly, you could then add a `products` semantic model on top of the `products` model to incorporate even more dimensions to slice and dice your revenue metric. 

Notice the identifiers present in the semantic models `products` and `transactions`. MetricFlow does the heavy-lifting for you by traversing the appropriate join keys to identify the available dimensions to slice and dice your `revenue` metric. 

```yaml
semantic_model:
  name: products
  description: A record for every product available through our retail stores.
  owners: support@getdbt.com
  mode: ref('products')

  # --- identifiers ---
  entities:
    - name: product_id
      type: primary

  # --- dimensions ---
  dimensions:
    - name: category
      type: categorical
    - name: brand
      type: categorical
    - name: is_perishable
      type: categorical
      expr: |
        category in ("vegetables", "fruits", "dairy", "deli")
```
</TabItem>
<TabItem value="example3" label="Advanced example">

Imagine an even more difficult metric is needed, like the amount of money earned each day by selling perishable goods per active customer. Without MetricFlow the data practitioner's original SQL might look like this:

```sql
select
    date_trunc(transactions.created_at, 'day') as day
  , products.category as product_category
  , sum(transactions.price * transactions.quantity) as revenue
  , count(distinct customer_id) as active_customers
  , sum(transactions.price * transactions.quantity)/count(distinct customer_id) as perishable_revenues_per_active_customer
from
  transactions
left join
  products
on
  transactions.product_id = products.product_id
where 
  products.category in ("vegetables", "fruits", "dairy", "deli")
group by 1, 2
```

MetricFlow simplifies the SQL process via metric YAML configurations as seen below. You can also commit them to your git repository to ensure everyone on the data and business teams can see and approve them as the true and only source of information.

```yaml
metric:
  name: perishables_revenue_per_active_customer
  description: Revenue from perishable goods (vegetables, fruits, dairy, deli) for each active store.
  type: ratio
  type_params:
    numerator: revenue
    denominator: active_customers
  constraints: |
    product__category in ("vegetables", "fruits", "dairy", "deli")
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

