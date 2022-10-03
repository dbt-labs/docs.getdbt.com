---
title: "Materializations"
id: "materializations"
---

## Overview

<Term id="materialization">Materializations</Term> are strategies for persisting dbt models in a warehouse. There are four types of materializations built into dbt. They are:

- <Term id="table" />
- <Term id="view" />
- incremental
- ephemeral


## Configuring materializations
By default, dbt models are materialized as "views". Models can be configured with a different materialization by supplying the `materialized` configuration parameter as shown below.

<File name='dbt_project.yml'>

```yaml
# The following dbt_project.yml configures a project that looks like this:
# .
# └── models
#     ├── csvs
#     │   ├── employees.sql
#     │   └── goals.sql
#     └── events
#         ├── stg_event_log.sql
#         └── stg_event_sessions.sql

name: my_project
version: 1.0.0
config-version: 2

models:
  my_project:
    events:
      # materialize all models in models/events as tables
      +materialized: table
    csvs:
      # this is redundant, and does not need to be set
      +materialized: view
```

</File>

Alternatively, materializations can be configured directly inside of the model sql files. This can be useful if you are also setting [Performance Optimization] configs for specific models (for example, [Redshift specific configurations](redshift-configs) or [BigQuery specific configurations](bigquery-configs)).

<File name='models/events/stg_event_log.sql'>

```sql

{{ config(materialized='table', sort='timestamp', dist='user_id') }}

select *
from ...
```

</File>

## Materializations


### View
When using the `view` materialization, your model is rebuilt as a view on each run, via a `create view as` statement.
* **Pros:** No additional data is stored, views on top of source data will always have the latest records in them.
* **Cons:** Views that perform significant transformation, or are stacked on top of other views, are slow to query.
* **Advice:**
    * Generally start with views for your models, and only change to another materialization when you're noticing performance problems.
    * Views are best suited for models that do not do significant transformation, e.g. renaming, recasting columns.

### Table
When using the `table` materialization, your model is rebuilt as a <Term id="table" /> on each run, via a `create table as` statement.
* **Pros:** Tables are fast to query
* **Cons:**
    * Tables can take a long time to rebuild, especially for complex transformations
    * New records in underlying source data are not automatically added to the table
* **Advice:**
  * Use the table materialization for any models being queried by BI tools, to give your end user a faster experience
  * Also use the table materialization for any slower transformations that are used by many downstream models


### Incremental
`incremental` models allow dbt to insert or update records into a table since the last time that dbt was run.
* **Pros:** You can significantly reduce the build time by just transforming new records
* **Cons:** Incremental models require extra configuration and are an advanced usage of dbt. Read more about using incremental models [here](configuring-incremental-models).
* **Advice:**
    * Incremental models are best for event-style data
    * Use incremental models when your `dbt run`s are becoming too slow (i.e. don't start with incremental models)

### Ephemeral
`ephemeral` models are not directly built into the database. Instead, dbt will interpolate the code from this model into dependent models as a common <Term id="table" /> expression.
* **Pros:**
    * You can still write reusable logic
    * Ephemeral models can help keep your <Term id="data-warehouse" /> clean by reducing clutter (also consider splitting your models across multiple schemas by [using custom schemas](using-custom-schemas)).
* **Cons:**
    * You cannot select directly from this model.
    * Operations (e.g. macros called via `dbt run-operation` cannot `ref()` ephemeral nodes)
    * Overuse of the ephemeral materialization can also make queries harder to debug.
* **Advice:**  Use the ephemeral materialization for:
    * very light-weight transformations that are early on in your DAG
    * are only used in one or two downstream models, and
    * do not need to be queried directly
