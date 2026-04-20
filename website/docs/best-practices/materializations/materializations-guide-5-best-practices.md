---
title: Best practices for materializations
id: materializations-guide-5-best-practices
slug: 5-best-practices
description: Read this guide to understand the different types of materializations you can create in dbt.
displayText: Materializations best practices
hoverSnippet: Read this guide to understand the different types of materializations you can create in dbt.
---

First, let’s consider some properties of various levels of our dbt project and materializations.

- 🔍 **Views** return the freshest, real-time state of their input data when they’re queried, this makes them ideal as **building blocks** for larger models.
  - 🧶  When we’re building a model that stitches lots of other models together, we don’t want to worry about all those models having different states of freshness because they were built into tables at different times. We want all those inputs to give us all the underlying source data available.
- 🤏 **Views** are also great for **small datasets** with minimally intensive logic that we want **near realtime** access to.
- 🛠️ **Tables** are the **most performant** materialization, as they just return the transformed data when they’re queried, with no need to reprocess it.
  - 📊  This makes tables great for **things end users touch**, like a mart that services a popular dashboard.
  - 💪 Tables are also ideal for **frequently used, compute intensive** transformations. Making a table allows us to ‘freeze’ those transformations in place.
- 📚  **Incremental models** are useful for the **same purposes as tables**, they just enable us to build them on larger datasets, so they can be **built** _and_ **accessed** in a **performant** way.

### Project-level configuration

Keeping these principles in mind, we can applying these materializations to a project. Earlier we looked at how to configure an individual model's materializations. In practice though, we'll want to set materializations at the folder level, and use individual model configs to override those as needed. This will keep our code DRY and avoid repeating the same config blocks in every model.

- 📂  In the `dbt_project.yml` we have a `models:` section (by default at the bottom of the file) we can use define various **configurations for entire directories**.
- ⚙️  These are the **same configs that are passed to a `{{ config() }}` block** for individual models, but they get set for _every model in that directory and any subdirectories nested within it_.
- ➕  We demarcate between a folder name and a configuration by using a `+`, so `marketing`, `paid_ads`, and `google` below are folder names, whereas **`+materialized` is a configuration** being applied to those folder and all folders nested below them.
- ⛲  Configurations set in this way **cascade**, the **more specific scope** is the one that will be set.
- 👇🏻  In the example below, all the models in the `marketing` and `paid_ads` folders would be views, but the `google` sub folder would be **tables.**

```yaml
models:
  jaffle_shop:
    marketing:
      +materialized: view
      paid_ads:
        google:
          +materialized: table
```

### Staging views

We’ll start off simple with staging models. Lets consider some aspects of staging models to determine the ideal materialization strategy:

- 🙅‍♀️ Staging models are **rarely accessed** directly by our **end users.**
- 🧱 They need to be always up-to-date and in sync with our source data as a **building blocks** for later models
- 🔍  It’s clear we’ll want to keep our **staging models as views**.
- 👍  Since views are the **default materialization** in dbt, we don’t _have_ to do any specific configuration for this.
- 💎  Still, for clarity, it’s a **good idea** to go ahead and **specify the configuration** to be explicit. We’ll want to make sure our `dbt_project.yml` looks like this:

```yaml
models:
  jaffle_shop:
    staging:
      +materialized: view
```

### Ephemeral intermediate models

Intermediate models sit between staging and marts, breaking up complex transformations into manageable pieces. Consider these aspects when choosing their materialization:

- 🚫 Intermediate models are not accessed directly by end users. They exist to simplify mart logic.
- 🧩 They serve as building blocks that get referenced by marts or other intermediate models.
- 👻 This makes them ideal candidates for ephemeral materialization, which doesn't create objects in your warehouse.

Ephemeral models are interpolated as <Term id="cte">CTE</Term> into the models that reference them. This keeps your warehouse clean and avoids cluttering it with models that aren't meant for direct querying:

```yaml
models:
  jaffle_shop:
    staging:
      +materialized: view
    intermediate:
      +materialized: ephemeral
```

:::tip When to avoid ephemeral models
Ephemeral models can make troubleshooting more difficult since they don't exist as queryable objects. If you need to inspect intermediate results during development, consider materializing them as views in a custom schema with restricted permissions instead. This gives you visibility while keeping them separate from production models.
:::

For more details on intermediate model patterns, refer to [How we structure our dbt projects: Intermediate](/best-practices/how-we-structure/3-intermediate).

### Table and incremental marts

As we’ve learned, views store only the logic of the transformation in the warehouse, so our runs take only a couple seconds per model (or less). What happens when we go to query the data though?

![Long query time from Snowflake](/img/best-practices/materializations/snowflake-query-timing.png)

Our marts are slow to query!

Let’s contrast the same aspects of marts that we considered for staging models to assess the best materialization strategy:

- 📊  Marts are **frequently accessed directly by our end users**, and need to be **performant.**
- ⌛  Can often **function with intermittently refreshed data**, end user decision making in many domains is **fine with hourly or daily data.**
- 🛠️  Given the above properties we’ve got a great use case for **building the data itself** into the warehouse, not the logic. In other words, **a table**.
- ❓ The only decision we need to make with our marts is whether we can **process the whole table at once or do we need to do it in chunks**, that is, are we going to use the `table` materialization or `incremental`.

:::info
🔑 **Golden Rule of Materializations** Start with models as views, when they take too long to query, make them tables, when the tables take too long to build, make them incremental.
:::
