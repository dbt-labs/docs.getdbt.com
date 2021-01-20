---
title: "Snowflake specific configurations"
id: "snowflake-configs"
---

## Transient tables

Snowflake supports the creation of [transient tables](https://docs.snowflake.net/manuals/user-guide/tables-temp-transient.html). Snowflake does not preserve a history for these tables, which can result in a measurable reduction of your Snowflake storage costs. Note however that transient tables do not participate in Time Travel. Weigh these tradeoffs when deciding whether or not to configure your dbt models as `transient`. **By default, all Snowflake tables created by dbt are `transient`.**

### Configuring transient tables in dbt_project.yml

A whole folder (or package) can be configured to be transient (or not) by adding a line to the `dbt_project.yml` file. This config works just like all of the [model configs](configuring-models) defined in `dbt_project.yml`.

<File name='dbt_project.yml'>

```yaml
name: my_project

...

models:
  transient: false
  my_project:
    ...
```

</File>

### Configuring transience for a specific model

A specific model can be configured to be transient by setting the `transient` model config to `true`.

<File name='my_table.sql'>

```sql
{{ config(materialized='table', transient=true) }}

select * from ...
```

</File>

## Merge behavior (incremental models)

The `incremental_strategy` config controls how dbt builds incremental models. By default, dbt will use a [merge statement](https://docs.snowflake.net/manuals/sql-reference/sql/merge.html) on Snowflake to refresh incremental tables.

Snowflake's `merge` statement fails with a "nondeterministic merge" error if the `unique_key` specified in your model config is not actually unique. If you encounter this error, you can instruct dbt to use a two-step incremental approach by setting the `incremental_strategy` config for your model to `delete+insert`. 

This config can either be specified in specific models, or for all models in your `dbt_project.yml` file:

<File name='dbt_project.yml'>

```yaml
# Your dbt_project.yml file

models:
  incremental_strategy: "delete+insert"
```

</File>

or:

<File name='models/my_model.sql'>

```sql
{{
  config(
    materialized='incremental',
    unique_key='id',
    incremental_strategy='delete+insert'
  )
}}

select ...
```

</File>

## Configuring table clustering

dbt supports [table clustering](https://docs.snowflake.net/manuals/user-guide/tables-clustering-keys.html) on Snowflake. To control clustering for a table or incremental model, use the `cluster_by` config. When this configuration is applied, dbt will do two things:

1. It will implicitly order the table results by the specified `cluster_by` fields
2. It will add the specified clustering keys to the target table

By using the specified `cluster_by` fields to order the table, dbt minimizes the amount of work required by Snowflake's automatic clustering functionality. If an incremental model is configured to use table clustering, then dbt will also order the staged dataset before merging it into the destination table. As such, the dbt-managed table should always be in a mostly clustered state.

### Using cluster_by

The `cluster_by` config accepts either a string, or a list of strings to use as clustering keys. The following example will create a sessions table that is clustered by the `session_start` column.

<File name='models/events/sessions.sql'>

```sql

{{
  config(
    materialized='table',
    cluster_by=['session_start']
  )
}}

select
  session_id,
  min(event_time) as session_start,
  max(event_time) as session_end,
  count(*) as count_pageviews

from {{ source('snowplow', 'event') }}
group by 1
```

</File>

The code above will be compiled to SQL that looks (approximately) like this:

```sql

create or replace table my_database.my_schema.my_table as (

  select * from (
    select
      session_id,
      min(event_time) as session_start,
      max(event_time) as session_end,
      count(*) as count_pageviews

    from {{ source('snowplow', 'event') }}
    group by 1
  )
  
  -- this order by is added by dbt in order to create the
  -- table in an already-clustered manner.
  order by session_start
  
);

 alter table my_database.my_schema.my_table cluster by (session_start);"
```

It is possible to cluster by expressions, as below:

```sql

{{
  config(
    materialized='table',
    cluster_by=['to_date(session_start)', 'left(session_id,1)']
  )
}}

select
  session_id,
  min(event_time) as session_start,
  max(event_time) as session_end,
  count(*) as count_pageviews

from {{ source('snowplow', 'event') }}
group by 1
```

## Configuring virtual warehouses

The default warehouse that dbt uses can be configured in your [Profile](profile) for Snowflake connections. To override the warehouse that is used for specific models (or groups of models), use the `snowflake_warehouse` model configuration. This configuration can be used to specify a larger warehouse for certain models in order to control Snowflake costs and project build times.

The following config uses the `EXTRA_SMALL` warehouse for all models in the project, except for the models in the `clickstream` folder, which are configured to use the `EXTRA_LARGE` warehouse. In this example, all Snapshot models are configured to use the `EXTRA_LARGE` warehouse.

```yaml
name: my_project
version: 1.0.0

...

models:
  snowflake_warehouse: "EXTRA_SMALL"
  my_project:
    clickstream:
      snowflake_warehouse: "EXTRA_LARGE"
      
snapshots:
  snowflake_warehouse: "EXTRA_LARGE""
```

## Copying grants

When the `copy_grants` config is set to `true`, dbt will add the `copy grants` DDL qualifier when rebuilding tables and views. The default value is `false`.

<File name='dbt_project.ym'>

```yaml

models:
  copy_grants: true
```

</File>

## Secure views

To create a Snowflake [secure view](https://docs.snowflake.net/manuals/user-guide/views-secure.html), use the `secure` config for view models. Secure views can be used to limit access to sensitive data. Note: secure views may incur a performance penalty, so you should only use them if you need them.

The following example configures the models in the `sensitive/` folder to be configured as secure views.

<File name='dbt_project.yml'>

```yaml

name: my_project
version: 1.0.0

models:
  my_project:
    sensitive:
      materialized: view
      secure: true
```

</File>
