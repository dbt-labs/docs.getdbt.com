---
title: "Refactor an existing rollup"
description: Getting started with the dbt Semantic Layer
hoverSnippet: Learn how to get started with the dbt Semantic Layer
pagination_next: "best-practices/how-we-build-our-metrics/semantic-layer-9-conclusion"
---

## A new approach

Now that we've set the stage, it's time to dig in to the fun and messy part: how do we refactor an existing rollup in dbt into semantic models and metrics?

Let's look at the differences we can observe in how we might approach this with MetricFlow supercharging dbt versus how we work without a Semantic Layer. These differences can then inform our structure.

- 🍊 In dbt, we tend to create **highly denormalized datasets** that bring **everything you want around a certain entity or process into a single table**.
- 💜 The problem is, this **limits the dimensionality available to MetricFlow**. The more we pre-compute and 'freeze' into place, the less flexible our data is.
- 🚰 In MetricFlow, we ideally want **highly normalized**, star schema-like data that then allows MetricFlow to shine as a **denormalization engine**.
- ∞ Another way to think about this is that instead of moving down a list of requested priorities trying to pre-make as many combinations of our marts as possible — increasing lines of code and complexity — we can **let MetricFlow present every combination possible without specifically coding it**.
- 🏗️ To resolve these approaches optimally, we'll need to shift some **fundamental aspects of our modeling strategy**.

## Refactor steps outlined

We recommend an incremental implementation process that looks something like this:

1. 👉 Identify **an important output** (a revenue chart on a dashboard for example, and the mart model(s) that supplies this output.
2. 🔍 Examine all the **entities that are components** of this rollup (for instance, an `active_customers_per_week` rollup may include customers, shipping, and product data).
3. 🛠️ **Build semantic models** for all the underlying component marts.
4. 📏 **Build metrics** for the required aggregations in the rollup.
5. 👯 Create a **clone of the output** on top of the Semantic Layer.
6. 💻 Audit to **ensure you get accurate outputs**.
7. 👉 Identify **any other outputs** that point to the rollup and **move them to the Semantic Layer**.
8. ✌️ Put a **deprecation plan** in place for the now extraneous frozen rollup.

You would then **continue this process** on other outputs and marts moving down a list of **priorities**. Each model as you go along will be faster and easier as you'll **reuse many of the same components** that will already have been semantically modeled.

## Let's make a `revenue` metric

So far we've been working in new pointing at a staging model to simplify things as we build new mental models for MetricFlow. In reality, unless you're implementing MetricFlow in a green-field dbt project, you probably are going to have some refactoring to do. So let's get into that in detail.

1. 📚 Per the above steps, let's say we've identified our target as a revenue rollup that is built on top of `orders` and `order_items`. Now we need to identify all the underlying components, these will be all the 'import' CTEs at the top of these marts. So in the Jaffle Shop project we'd need: `orders`, `order_items`, `products`, `locations`, and `supplies`.
2. 🗺️ We'll next make semantic models for all of these. Let's walk through a straightforward conversion first with `locations`.
3. ⛓️ We'll want to first decide if we need to do any joining to get this into the shape we want for our semantic model. The biggest determinants of this are two factors:
   - 📏 Does this semantic model **contain measures**?
   - 🕥 Does this semantic model have a **primary timestamp**?
   - 🫂 If a semantic model **has measures but no timestamp** (for example, supplies in the example project, which has static costs of supplies), you'll likely want to **sacrifice some normalization and join it on to another model** that has a primary timestamp to allow for metric aggregation.
4. 🔄 If we _don't_ need any joins, we'll just go straight to the staging model for our semantic model's `ref`. Locations does have a `tax_rate` measure, but it also has an `ordered_at` timestamp, so we can go **straight to the staging model** here.
5. 🥇 We specify our **primary entity** (based on `location_id`), dimensions (one categorical, `location_name`, and one **primary time dimension** `opened_at`), and lastly our measures, in this case just `average_tax_rate`.

<File name="models/marts/locations.yml" />

```yaml
semantic_models:
  - name: locations
    description: |
      Location dimension table. The grain of the table is one row per location.
    model: ref('stg_locations')
    entities:
      - name: location
        type: primary
        expr: location_id
    dimensions:
      - name: location_name
        type: categorical
      - name: date_trunc('day', opened_at)
        type: time
        type_params:
          time_granularity: day
    measures:
      - name: average_tax_rate
        description: Average tax rate.
        expr: tax_rate
        agg: avg
```

## Semantic and logical interaction

Now, let's tackle a thornier situation. Products and supplies both have dimensions and measures but no time dimension. Products has a one-to-one relationship with `order_items`, enriching that table, which is itself just a mapping table of products to orders. Additionally, products have a one-to-many relationship with supplies. The high-level ERD looks like the diagram below.

<Lightbox src='/img/best-practices/semantic-layer/orders_erd.png' />

So to calculate, for instance, the cost of ingredients and supplies for a given order, we'll need to do some joining and aggregating, but again we **lack a time dimension for products and supplies**. This is the signal to us that we'll **need to build a logical mart** and point our semantic model at that.

:::tip
**dbt 🧡 MetricFlow.** This is where integrating your semantic definitions into your dbt project really starts to pay dividends. The interaction between the logical and semantic layers is so dynamic, you either need to house them in one codebase or facilitate a lot of cross-project communication and dependency.
:::

1. 🎯 Let's aim at, to start, building a table at the `order_items` grain. We can aggregate supply costs up, map over the fields we want from products, such as price, and bring the `ordered_at` timestamp we need over from the orders table. You can see example code, copied below, in `models/marts/order_items.sql`.

<File name="models/marts/order_items.sql" />

```sql
{{
   config(
      materialized = 'table',
   )
}}

with

order_items as (

   select * from {{ ref('stg_order_items') }}

),

orders as (

   select * from {{ ref('stg_orders')}}

),

products as (

   select * from {{ ref('stg_products') }}

),

supplies as (

   select * from {{ ref('stg_supplies') }}

),

order_supplies_summary as (

   select
      product_id,
      sum(supply_cost) as supply_cost

   from supplies

   group by 1
),

joined as (

   select
      order_items.*,
      products.product_price,
      order_supplies_summary.supply_cost,
      products.is_food_item,
      products.is_drink_item,
      orders.ordered_at

   from order_items

   left join orders on order_items.order_id  = orders.order_id

   left join products on order_items.product_id = products.product_id

   left join order_supplies_summary on order_items.product_id = order_supplies_summary.product_id

)

select * from joined
```

2. 🏗️ Now we've got a table that looks more like what we want to feed into the Semantic Layer. Next, we'll **build a semantic model on top of this new mart** in `models/marts/order_items.yml`. Again, we'll identify our **entities, then dimensions, then measures**.

<File name="models/marts/order_items.yml" />

```yml
semantic_models:
   #The name of the semantic model.
   - name: order_items
      defaults:
         agg_time_dimension: ordered_at
      description: |
         Items contatined in each order. The grain of the table is one row per order item.
      model: ref('order_items')
      entities:
         - name: order_item
           type: primary
           expr: order_item_id
         - name: order_id
           type: foreign
           expr: order_id
         - name: product
           type: foreign
           expr: product_id
      dimensions:
         - name: ordered_at
           expr: date_trunc('day', ordered_at)
           type: time
           type_params:
             time_granularity: day
         - name: is_food_item
           type: categorical
         - name: is_drink_item
           type: categorical
      measures:
         - name: revenue
           description: The revenue generated for each order item. Revenue is calculated as a sum of revenue associated with each product in an order.
           agg: sum
           expr: product_price
         - name: food_revenue
           description: The revenue generated for each order item. Revenue is calculated as a sum of revenue associated with each product in an order.
           agg: sum
           expr: case when is_food_item = 1 then product_price else 0 end
         - name: drink_revenue
           description: The revenue generated for each order item. Revenue is calculated as a sum of revenue associated with each product in an order.
           agg: sum
           expr: case when is_drink_item = 1 then product_price else 0 end
         - name: median_revenue
           description: The median revenue generated for each order item.
           agg: median
           expr: product_price
```

3. 📏 Finally, Let's **build a simple revenue metric** on top of our semantic model now.

<File name="models/marts/order_items.yml" />

```yaml
metrics:
  - name: revenue
    description: Sum of the product revenue for each order item. Excludes tax.
    type: simple
    label: Revenue
    type_params:
      measure: revenue
```

## Checking our work

- 🔍 We always start our **auditing** with a `dbt parse` to **ensure our code works** before we examine its output.
- 👯 If we're working there, we'll move to trying out an `dbt sl query` that **replicates the logic of the output** we're trying to refactor.
- 💸 For our example we want to **audit monthly revenue**, to do that we'd run the query below.

### Example query

```shell
dbt sl query --metrics revenue --group-by metric_time__month
```

### Example query results

```shell
✔ Success 🦄 - query completed after 1.02 seconds
| METRIC_TIME__MONTH   |   REVENUE |
|:---------------------|----------:|
| 2016-09-01 00:00:00  |  17032.00 |
| 2016-10-01 00:00:00  |  20684.00 |
| 2016-11-01 00:00:00  |  26338.00 |
| 2016-12-01 00:00:00  |  10685.00 |
```

- Try introducing some other dimensions from the semantic models into the `group-by` arguments to get a feel for this command.
