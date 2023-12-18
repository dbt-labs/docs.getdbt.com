---
title: "Materializations"
description: "Read this tutorial to learn how to use materializations when building in dbt."
id: "materializations"
pagination_next: "docs/build/incremental-models"
---

## Overview
<Term id="materialization">Materializations</Term> are strategies for persisting dbt models in a warehouse. There are five types of materializations built into dbt. They are:

- <Term id="table" />
- <Term id="view" />
- incremental
- ephemeral
- materialized view

You can also configure [custom materializations](/guides/create-new-materializations?step=1) in dbt. Custom materializations are a powerful way to extend dbt's functionality to meet your specific needs. 


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

Alternatively, materializations can be configured directly inside of the model sql files. This can be useful if you are also setting [Performance Optimization] configs for specific models (for example, [Redshift specific configurations](/reference/resource-configs/redshift-configs) or [BigQuery specific configurations](/reference/resource-configs/bigquery-configs)).

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
* **Cons:** Views that perform a significant transformation, or are stacked on top of other views, are slow to query.
* **Advice:**
    * Generally start with views for your models, and only change to another materialization when you notice performance problems.
    * Views are best suited for models that do not do significant transformation, e.g. renaming, or recasting columns.

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
`incremental` models allow dbt to insert or update records into a table since the last time that model was run.
* **Pros:** You can significantly reduce the build time by just transforming new records
* **Cons:** Incremental models require extra configuration and are an advanced usage of dbt. Read more about using incremental models [here](/docs/build/incremental-models).
* **Advice:**
    * Incremental models are best for event-style data
    * Use incremental models when your `dbt run`s are becoming too slow (i.e. don't start with incremental models)

### Ephemeral
`ephemeral` models are not directly built into the database. Instead, dbt will interpolate the code from this model into dependent models as a common <Term id="table" /> expression.
* **Pros:**
    * You can still write reusable logic
  - Ephemeral models can help keep your <Term id="data-warehouse" /> clean by reducing clutter (also consider splitting your models across multiple schemas by [using custom schemas](/docs/build/custom-schemas)).
* **Cons:**
    * You cannot select directly from this model.
    * Operations (e.g. macros called via `dbt run-operation` cannot `ref()` ephemeral nodes)
    * Overuse of ephemeral materialization can also make queries harder to debug.
* **Advice:**  Use the ephemeral materialization for:
    * very light-weight transformations that are early on in your DAG
    * are only used in one or two downstream models, and
    * do not need to be queried directly

### Materialized View

The `materialized view` materialization allows the creation and maintenance of materialized views
in the target database. This materialization makes use of the `on_configuration_change` config, which
aligns with the incremental nature of the namesake database object. This setting tells dbt to attempt to
make configuration changes directly to the object when possible, as opposed to completely recreating
the object to implement the updated configuration. Using `dbt-postgres` as an example, indexes can
be dropped and created on the materialized view without the need to recreate the materialized view itself.

The `on_configuration_change` config has three settings:
- `apply` (default) &mdash; attempt to update the existing database object if possible, avoiding a complete rebuild
  - *Note:* if any individual configuration change requires a full refresh, a full refresh be performed in lieu of individual alter statements
- `continue` &mdash; allow runs to continue while also providing a warning that the object was left untouched
  - *Note:* this could result in downstream failures as those models may depend on these unimplemented changes
- `fail` &mdash; force the entire run to fail if a change is detected

Materialized views are implemented following this "drop through" life cycle:
1. If an object does not exist, create a materialized view
2. If an object exists, other than a materialized view, that object is dropped and replaced with a materialized view
3. If `--full-refresh` is supplied, replace the materialized view regardless of changes and the `on_configuration_change` setting
4. If there are no configuration changes, refresh the materialized view
5. At this point there are configuration changes, proceed according to the `on_configuration_change` setting

Materialized views are a combination of a view and a table, and serve use cases similar to incremental models.

* **Pros:**
  * Materialized views combine the query performance of a table with the data freshness of a view
  * Materialized views operate much like incremental materializations, however they are usually
able to be refreshed without manual interference on a regular cadence (depending on the database), forgoing the regular dbt batch refresh
required with incremental materializations
  * `dbt run` on materialized views corresponds to a code deployment, just like views
* **Cons:**
  * Due to the fact that materialized views are more complex database objects, database platforms tend to have
less configuration options available, see your database platform's docs for more details
  * Materialized views may not be supported by every database platform
* **Advice:**
  * Consider materialized views for use cases where incremental models are sufficient, but you would like the data platform to manage the incremental logic and refresh.

**Note:** `dbt-snowflake` _does not_ support materialized views, it uses Dynamic Tables instead. For details, refer to [Snowflake specific configurations](/reference/resource-configs/snowflake-configs#dynamic-tables).

## Python materializations

Python models support two materializations:
- `table`
- `incremental`

Incremental Python models support all the same [incremental strategies](/docs/build/incremental-models#about-incremental_strategy) as their SQL counterparts. The specific strategies supported depend on your adapter.

Python models can't be materialized as `view` or `ephemeral`. Python isn't supported for non-model resource types (like tests and snapshots).

For incremental models, like SQL models, you will need to filter incoming tables to only new rows of data:

<WHCode>

<div warehouse="Snowpark">

<File name='models/my_python_model.py'>

```python
import snowflake.snowpark.functions as F

def model(dbt, session):
    dbt.config(materialized = "incremental")
    df = dbt.ref("upstream_table")

    if dbt.is_incremental:

        # only new rows compared to max in current table
        max_from_this = f"select max(updated_at) from {dbt.this}"
        df = df.filter(df.updated_at >= session.sql(max_from_this).collect()[0][0])

        # or only rows from the past 3 days
        df = df.filter(df.updated_at >= F.dateadd("day", F.lit(-3), F.current_timestamp()))

    ...

    return df
```

</File>

</div>

<div warehouse="PySpark">

<File name='models/my_python_model.py'>

```python
import pyspark.sql.functions as F

def model(dbt, session):
    dbt.config(materialized = "incremental")
    df = dbt.ref("upstream_table")

    if dbt.is_incremental:

        # only new rows compared to max in current table
        max_from_this = f"select max(updated_at) from {dbt.this}"
        df = df.filter(df.updated_at >= session.sql(max_from_this).collect()[0][0])

        # or only rows from the past 3 days
        df = df.filter(df.updated_at >= F.date_add(F.current_timestamp(), F.lit(-3)))

    ...

    return df
```

</File>

</div>

</WHCode>

**Note:** Incremental models are supported on BigQuery/Dataproc for the `merge` incremental strategy. The `insert_overwrite` strategy is not yet supported.

<Snippet path="discourse-help-feed-header" />
<DiscourseHelpFeed tags="materialization"/>

