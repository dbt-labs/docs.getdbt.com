---
title: "Marts for the Semantic Layer"
id: "5-semantic-layer-marts"
---

The Semantic Layer alters some fundamental principles of how you organize your project. Using dbt without the Semantic Layer necessitates creating the most useful combinations of your building block components into wide, denormalized marts. On the other hand, the Semantic Layer leverages MetricFlow to denormalize every possible combination of components we've encoded dynamically. As such we're better served to bring more normalized models through from the logical layer into the Semantic Layer to maximize flexibility. This section will assume familiarity with the best practices laid out in the [How we build our metrics](/best-practices/how-we-build-our-metrics/semantic-layer-1-intro) guide, so check that out first for a more hands-on introduction to the Semantic Layer.

## Semantic Layer: Files and folders

- 2️⃣ There are two major factors that alter our recommendations for the Semantic Layer:
  - 📝 There is **more YAML** in the form of **semantic models and metrics**.
  - ⏫ We may **use a staging model directly** if it forms a complete normalized component, and it will not have a mart at all.
- 💪 This combination means models at **both the staging and marts layer** may participate in the Semantic Layer and use **more powerful, expansive YAML configuration**.
- 🔁 Given this, for projects using the Semantic Layer we recommend a **YAML-file-per-model approach**, as below.

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

## Semantic Layer: Where and why?

- 📂 Directory structure: Add your semantic models in `models/semantic_models` with directories corresponding to the models/marts files. This organization makes it easier to search and find what you can join. It also supports better maintenance and reduces repeated code.

## Naming conventions

- 🏷️ Semantic model names: Use the `sem_` prefix for semantic model names, such as `sem_cloud_user_account_activity`. This follows the same pattern as other naming conventions like `fct_` for fact tables and `dim_` for dimension tables.
- 🧩 Entity names: Do not use prefixes for entity names within the semantic model. This keeps the names clear and focused on their specific purpose without unnecessary prefixes.

This guidance helps you make sure your dbt project is organized, maintainable, and scalable, allowing you to take full advantage of the capabilities offered by the dbt Semantic Layer.

## When to make a mart

- ❓ If we can go directly to staging models and it's better to serve normalized models to the Semantic Layer, then when, where, and why would we make a mart?
  - 🕰️ We have models that have measures but no time dimension to aggregate against. The details of this are laid out in the [Semantic Layer guide](/best-practices/how-we-build-our-metrics/semantic-layer-1-intro) but in short, we need a time dimension to aggregate against in MetricFlow. Dimensional tables that
  - 🧱 We want to **materialize** our model in various ways.
  - 👯 We want to **version** our model.
  - 🛒 We have various related models that make more sense as **one wider component**.
  - 1️⃣ We have similar models across multiple data sources that make more sense **unioned together**.
  - ⌚ We have models in our project we **need to time to refactor** but want to serve up to the Semantic Layer quickly.
- 🌍 Any of the above and more are great reasons to build a mart. Analytics engineering is about **creativity and problem solving**, so these are not prescriptive rules, **there are many reasons to build marts** in any project. The most important takeaway is that you don't **_have to_** if you're using the Semantic Layer.
