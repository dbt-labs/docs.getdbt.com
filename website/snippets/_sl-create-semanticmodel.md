The following steps will walk you through setting up semantic models in your dbt project, which consist of [entities](/docs/build/entities), [dimensions](/docs/build/dimensions), and [measures](/docs/build/measures).  

We highly recommend you read the overview of what a [semantic model](/docs/build/semantic-models) is before getting started. If you're working in the [Jaffle shop example](https://github.com/dbt-labs/jaffle-sl-template), delete the `orders.yml` config or delete the .yml extension so it's ignored during parsing. **We'll be rebuilding it step by step in this example.**

If you're following the guide in your own project, pick a model that you want to build a semantic manifest from and fill in the config values accordingly.

1. Create a new yml config file for the orders model, such as `orders.yml`.

It's best practice to create semantic models in the `/models/semantic_models` directory in your project. Semantic models are nested under the `semantic_models` key. First, fill in the name and appropriate metadata, map it to a model in your dbt project, and specify model defaults. For now, `default_agg_time_dimension` is the only supported default.

```yaml
semantic_models:
  #The name of the semantic model.
  - name: orders
    defaults:
      agg_time_dimension: ordered_at
    description: |
      Order fact table. This table is at the order grain with one row per order. 
    #The name of the dbt model and schema
    model: ref('orders')
  ```

2. Define your entities. These are the keys in your table that MetricFlow will use to join other semantic models. These are usually columns like `customer_id`, `order_id`, and so on.

```yaml
  #Entities. These usually correspond to keys in the table.
    entities:
      - name: order_id
        type: primary
      - name: location
        type: foreign
        expr: location_id
      - name: customer
        type: foreign
        expr: customer_id
  ```

3. Define your dimensions and measures. Dimensions are properties of the records in your table that are non-aggregatable. They provide categorical or time-based context to enrich metrics. Measures are the building block for creating metrics. They are numerical columns that MetricFlow aggregates to create metrics.

```yaml
    #Measures. These are the aggregations on the columns in the table.
    measures: 
      - name: order_total
        description: The total revenue for each order.
        agg: sum
      - name: order_count
        expr: 1
        agg: sum
      - name: tax_paid
        description: The total tax paid on each order. 
        agg: sum
      - name: customers_with_orders
        description: Distinct count of customers placing orders
        agg: count_distinct
        expr: customer_id
      - name: locations_with_orders
        description: Distinct count of locations with order
        expr: location_id
        agg: count_distinct
      - name: order_cost
        description: The cost for each order item. Cost is calculated as a sum of the supply cost for each order item. 
        agg: sum
  #Dimensions. Either categorical or time. These add additional context to metrics. The typical querying pattern is Metric by Dimension.  
    dimensions:
      - name: ordered_at
        type: time
        type_params:
          time_granularity: day 
      - name: order_total_dim
        type: categorical
        expr: order_total
      - name: is_food_order
        type: categorical
      - name: is_drink_order
        type: categorical  
```

Putting it all together, a complete semantic model configurations based on the order model would look like the following example:

```yaml
semantic_models:
  #The name of the semantic model.
  - name: orders
    defaults:
      agg_time_dimension: ordered_at
    description: |
      Order fact table. This table is at the order grain with one row per order. 
    #The name of the dbt model and schema
    model: ref('orders')
    #Entities. These usually corespond to keys in the table.
    entities:
      - name: order_id
        type: primary
      - name: location
        type: foreign
        expr: location_id
      - name: customer
        type: foreign
        expr: customer_id
    #Measures. These are the aggregations on the columns in the table.
    measures: 
      - name: order_total
        description: The total revenue for each order.
        agg: sum
      - name: order_count
        expr: 1
        agg: sum
      - name: tax_paid
        description: The total tax paid on each order. 
        agg: sum
      - name: customers_with_orders
        description: Distinct count of customers placing orders
        agg: count_distinct
        expr: customer_id
      - name: locations_with_orders
        description: Distinct count of locations with order
        expr: location_id
        agg: count_distinct
      - name: order_cost
        description: The cost for each order item. Cost is calculated as a sum of the supply cost for each order item. 
        agg: sum
    #Dimensions. Either categorical or time. These add additional context to metrics. The typical querying pattern is Metric by Dimension.  
    dimensions:
      - name: ordered_at
        type: time
        type_params:
          time_granularity: day 
      - name: order_total_dim
        type: categorical
        expr: order_total
      - name: is_food_order
        type: categorical
      - name: is_drink_order
        type: categorical  
```

:::tip
If you're familiar with writing SQL, you can think of dimensions as the columns you would group by and measures as the columns you would aggregate.

```sql
select
  metric_time_day,  -- time
  country,  -- categorical dimension
  sum(revenue_usd) -- measure
from
  snowflake.fact_transactions  -- sql table
group by metric_time_day, country  -- dimensions
  ```

:::
