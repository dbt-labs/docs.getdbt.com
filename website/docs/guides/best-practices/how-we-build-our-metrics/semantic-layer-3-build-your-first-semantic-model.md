---
title: "Build your first semantic model"
description: Getting started with the dbt Semantic Layer
displayText: "dbt Cloud Semantic Layer best practices"
hoverSnippet: Learn how to get started with the dbt Semantic Layer
---

## Our first semantic model

A semantic model is the Semantic Layer equivalent to a logical layer model (what historically has just been called a 'model' in dbt land). Just as configurations for models are defined on the `models:` YAML key, configurations for semantic models are housed under `semantic models:`. A key difference is that while a logical model consists of configuration and SQL or Python code, a semantic model is defined purely via YAML. Rather than encoding a specific dataset, a semantic model describes relationships that let your end users select and refine their own datasets reliably.

- ⚙️ Semantic models are **comprised of three components**:
  - 🫂 **entities**: these describe the **relationships** between various semantic models (think ids)
  - 🪣 **dimensions**: these are the columns you want to **slice, dice, group, and filter by** (think timestamps, categories, booleans).
  - 📏 **measures**: these are the **quantitative values you want to aggregate**
- We define **columns as being an entity, dimension, or measure**.

## Defining orders

- The semantic model we're going to define is _orders_.
- We define it as a **YAML dictionary in the semantic models list**.
- It will have a **name, entities list, dimensions list, and measures list**.
- We recommend defining them **in this order consistently** as a style best practice.

```YAML
semantic_models:
  - name: orders
    entities:
      ...
    dimensions:
      ...
    measures:
      ...
```

- Next we'll point to the corresponding logical model by supplying a [`ref`](https://docs.getdbt.com/reference/dbt-jinja-functions/ref) in the `model:` property, and a `description` for documentation.

```YAML
semantic_models:
  - name: orders
    description: |
      Model containting order data. The grain of the table is the order id.
    model: ref('stg_orders')
    entities:
      ...
    dimensions:
      ...
    measures:
      ...
```

## Establishing our entities

- Entities are the _things_ in our data that have dimensions and measures, you can think of them as the _nouns_ of our project, the _spines_ of our queries that we may want to aggregate by, or simply the _join keys_.
- Entities help MetricFlow understand _how various semantic models relate to one another_.
- Unlike many other semantic layers, in MetricFlow _we do not need to describe joins explicitly_, instead the _relationships are implicitly described by entities_.
- Each semantic model should have _one primary entity_ defined for itself, and _any number of foreign entities_ for other semantic models it may join to.
- Entities require a **name and type**
  - Types available are primary, foreign, unique or natural — we'll be focused on the first two for now, but you can [read more about unique and natural keys](https://docs.getdbt.com/docs/build/entities#entity-types).

### Entities in action

If we look at the staging model for orders, we see that it has 3 id columns, so we'll need three entities.

```SQL
renamed as (

    select

        ----------  ids
        id as order_id,
        store_id as location_id,
        customer as customer_id,

        ---------- properties
        (order_total / 100.0) as order_total,
        (tax_paid / 100.0) as tax_paid,

        ---------- timestamps
        ordered_at

    from source
```

- We add them with a **`name`, `type`, and optional `expr`** (expression). The expression can be any valid SQL expression on your platform.
- If you **don't add an expression**, MetricFlow will **assume the name is equal to the column name** in the underlying logical model.
- Our best practices pattern is to, whenever possible, provide a `name` that is the singular form of the subject or grain of the table, and use `expr` to specify the precise column name (with `_id` etc). This will let us write **more readable metrics** on top of these semantic models.

```YAML
semantic_models:
  - name: orders
    ...
    entities:
      # we use the column for the name here because order is a reserved word in SQL
      - name: order_id
        type: primary
      - name: location
        type: foreign
        expr: location_id
      - name: customer
        type: foreign
        expr: customer_id

    dimensions:
      ...
    measures:
      ...

```

## Defining our dimensions

- Dimensions are the columns that we want to **filter and group by**, **the adjectives of our project**. They come in three types:
  - **categorical**
  - **time**
  - slowly changing dimensions — [these are covered in the documentation](https://docs.getdbt.com/docs/build/dimensions#scd-type-ii), and a little more complex. To focus on building your mental models of MetricFlow's fundamentals, we won't be using SCDs this guide.
- We're **not limited to existing columns**, we can use the `expr` property to add simple computations in our dimensions.
- Categorical dimensions are the simplest, they simply require a `name` and `type`, **if the `name` matches the name of the dimension column**, that's it, **otherwise you would supply an `expr`** to evaluate for the dimension.

### Dimensions in action

- Lets look at our staging model again and see what fields we have available.

```SQL
select

    ----------  ids -> entities
    id as order_id,
    store_id as location_id,
    customer as customer_id,

    ---------- numerics -> measures
    (order_total / 100.0) as order_total,
    (tax_paid / 100.0) as tax_paid,

    ---------- timestamps -> dimensions
    ordered_at

from source
```

- For now the only dimension to add is a **time dimension**.
- At least one **primary time dimension** is **required** for any semantic models that **have measures**.
  - We denote this with the `is_primary` property.

```YAML
dimensions:
      - name: ordered_at
        type: time
        type_params:
          is_primary: true
          time_granularity: day
```

:::tip
**Dimensional models**. You may have some models that do not contain measures, just dimensional data that enriches other facts. That's totally fine, a semantic model does not require dimensions or measures, it just needs a primary entity, and if you do have measures, a primary time dimension.

We'll discuss an alternate situation, dimensional tables that have static numeric values like supply costs or tax rates but no time dimensions, later in the Guide.
:::

- We can also **make a dimension out of numeric column** that would be typically be a measures.
- Using `expr` we can **create buckets of values that we label** for our dimension. We'll add one of these in for labeling 'large orders' as any order totals over $50.

```YAML
...
dimensions:
  - name: ordered_at
    type: time
    type_params:
      is_primary: true
      time_granularity: day
  - name: is_large_order
    type: categorical
    expr: case when order_total > 50 then true else false end
...
```

## Making our measures

- Measures are the final component of a semantic model. They describe the **numeric values that we want to aggregate**.
- Measures form **the building blocks of metrics**, with entities and dimensions helping us combine, group, and filter those metrics correctly.
- You can think of them as something like the **verbs of a semantic model**.

### Measures in action

- Lets look at our staging model one last time and see what fields we want to measure.

```SQL
select

    ----------  ids -> entities
    id as order_id,
    store_id as location_id,
    customer as customer_id,

    ---------- numerics -> measures
    (order_total / 100.0) as order_total,
    (tax_paid / 100.0) as tax_paid,

    ---------- timestamps -> dimensions
    ordered_at

from source
```

- Here `order_total` and `tax paid` are the columns we want as measures.
- We can describe them below, specifying a **name, description, aggregation, and expression**.
- As before MetricFlow we default to the **name being the name of a column when no expression is supplied**.
- TODO: link to agg docs

```YAML
measures:
  - name: order_total
    description: The total revenue for each order.
    agg: sum
  - name: tax_paid
    description: The toal tax paid on each order.
    agg: sum
```

- We can also create new measures using expressions, for instance adding a count of individual orders as below.

```YAML
  - name: order_count
    description: The count of individual orders.
    expr: 1
    agg: sum
```

## Validating configs

Now we should have code that looks like this, our first complete semantic model!

```orders
semantic_models:
  - name: orders
    defaults:
      agg_time_dimension: ordered_at
    description: |
      Order fact table. This table is at the order grain with one row per order.

    model: ref('orders')

    entities:
      - name: order_id
        type: primary
      - name: location
        type: foreign
        expr: location_id
      - name: customer
        type: foreign
        expr: customer_id

    dimensions:
      - name: ordered_at
        type: time
        type_params:
          is_primary: true
          time_granularity: day
      - name: is_large_order
        type: categorical
        expr: case when order_total > 50 then true else false end

    measures:
      - name: order_total
        description: The total revenue for each order.
        agg: sum
      - name: order_count
        description: The count of individual orders.
        expr: 1
        agg: sum
      - name: tax_paid
        description: The toal tax paid on each order.
        agg: sum
```

- We can check that it's valid configuration and works with the real data our dbt project is generating by using the `mf validate-configs` command. This will:
  1. **Parse the semantic manifest** our configuration describes out of the dbt project.
  2. Validate the **internal semantics** of the manifest as described by our code.
  3. Validate the **external semantics** of the manifest against your data warehouse (e.g. making sure that a column specified as a dimension exists on the proper table)

## Review and next steps

- Consist off **entities, dimensions, and measures**.
- Describe the **semantics and relationships of objects** in the warehouse.
- Correspond to a **single logical model** in your dbt project.
- Next up, lets use our new semantic model to **build a metric**!
