---
title: "Marts for the Semantic Layer"
id: "5-semantic-layer-marts"
---

The Semantic Layer alters some fundamental principles of how you organize your project. Using dbt without the Semantic Layer necessitates creating the most useful combination of your building block components into wide, denormalized marts. On the other hand, using the Semantic Layer means we can leverage MetricFlow to denormalize every possible combination of components we've encoded dynamically. As such we're better served to bring more normalized models through from the logical layer into the Semantic Layer to maximize flexibility. This section will assume familiarity with the best practices laid out in the [How we build our metrics](https://docs.getdbt.com/guides/best-practices/how-we-build-our-metrics/semantic-layer-1-intro) guide, so check that out first for a more hands-on introduction to the Semantic Layer.

## Semantic Layer: Files and folders

- There are two major factors that alter our recommendations for the Semantic Layer:
  - There is **more YAML** in the form of **semantic models and metrics**.
  - We may **use a staging model directly** if it forms a complete normalized component, and it will not have a mart at all.
- This combination means models at **both the staging and marts layer** may participate in the Semantic Layer and use **more powerful, expansive YAML configuration**.
- Given this, for projects using the Semantic Layer we recommend a **YAML-file-per-model approach**, as below.

```shell
models
├── marts
│   ├── customers.sql
│   ├── customers.yml
│   ├── orders.sql
│   └── orders.yml
└── staging
    ├── __sources.yml
    ├── stg_customers.sql
    ├── stg_customers.yml
    ├── stg_locations.sql
    ├── stg_locations.yml
    ├── stg_order_items.sql
    ├── stg_order_items.yml
    ├── stg_orders.sql
    ├── stg_orders.yml
    ├── stg_products.sql
    ├── stg_products.yml
    ├── stg_supplies.sql
    └── stg_supplies.yml
```

## When to make a mart

- If we can go directly to staging models and it's better to serve normalized models to the Semantic Layer, then when, where, and why would we make a mart?
  - We have models that have measures but no time dimension to aggregate against. The details of this are laid out in the [Semantic Layer guide](https://docs.getdbt.com/guides/best-practices/how-we-build-our-metrics/semantic-layer-1-intro) but in short, we need a time dimension to aggregate against in MetricFlow. Dimensional tables that
  - We want to **materialize** our model in various ways.
  - We want to **version** our model.
  - We have various related models that make more sense as **one wider component**.
  - We have similar models across multiple data sources that make more sense **unioned together**.
  - We have models in our project we **need to time to refactor** but want to serve up to the Semantic Layer quickly.
- Any of the above and more are great reasons to build a mart. Analytics engineering is about creativity and problem solving, so these are not prescriptive rules, there are many reasons to build marts in any project. The most important takeaway is that you don't _have to_ if you're using the Semantic Layer.
