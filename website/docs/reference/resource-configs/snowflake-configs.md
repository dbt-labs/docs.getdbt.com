---
title: "Snowflake configurations"
id: "snowflake-configs"
description: "Snowflake Configurations - Read this in-depth guide to learn about configurations in dbt."
---

<!----
To-do:
- use the reference doc structure for this article / split into separate articles
--->

## Transient tables

Snowflake supports the creation of [transient tables](https://docs.snowflake.net/manuals/user-guide/tables-temp-transient.html). Snowflake does not preserve a history for these tables, which can result in a measurable reduction of your Snowflake storage costs. Transient tables participate in time travel to a limited degree with a retention period of 1 day by default with no fail-safe period. Weigh these tradeoffs when deciding whether or not to configure your dbt models as `transient`. **By default, all Snowflake tables created by dbt are `transient`.**

### Configuring transient tables in dbt_project.yml

A whole folder (or package) can be configured to be transient (or not) by adding a line to the `dbt_project.yml` file. This config works just like all of the [model configs](/reference/model-configs) defined in `dbt_project.yml`.

<File name='dbt_project.yml'>

```yaml
name: my_project

...

models:
  +transient: false
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

## Query tags

[Query tags](https://docs.snowflake.com/en/sql-reference/parameters.html#query-tag) are a Snowflake
parameter that can be quite useful later on when searching in the [QUERY_HISTORY view](https://docs.snowflake.com/en/sql-reference/account-usage/query_history.html).

dbt supports setting a default query tag for the duration of its Snowflake connections in
[your profile](/docs/core/connect-data-platform/snowflake-setup). You can set more precise values (and override the default) for subsets of models by setting
a `query_tag` model config or by overriding the default `set_query_tag` macro:

<File name='dbt_project.yml'>

```yaml
models:
  [<resource-path>](/reference/resource-configs/resource-path):
    +query_tag: dbt_special

```

</File>

<File name='models/<modelname>.sql'>

```sql
{{ config(
    query_tag = 'dbt_special'
) }}

select ...

```
  
In this example, you can set up a query tag to be applied to every query with the model's name.
  
```sql 

  {% macro set_query_tag() -%}
  {% set new_query_tag = model.name %} 
  {% if new_query_tag %}
    {% set original_query_tag = get_current_query_tag() %}
    {{ log("Setting query_tag to '" ~ new_query_tag ~ "'. Will reset to '" ~ original_query_tag ~ "' after materialization.") }}
    {% do run_query("alter session set query_tag = '{}'".format(new_query_tag)) %}
    {{ return(original_query_tag)}}
  {% endif %}
  {{ return(none)}}
{% endmacro %}

```

**Note:** query tags are set at the _session_ level. At the start of each model <Term id="materialization" />, if the model has a custom `query_tag` configured, dbt will run `alter session set query_tag` to set the new value. At the end of the materialization, dbt will run another `alter` statement to reset the tag to its default value. As such, build failures midway through a materialization may result in subsequent queries running with an incorrect tag.

</File>

## Merge behavior (incremental models)

The [`incremental_strategy` config](/docs/build/incremental-models#about-incremental_strategy) controls how dbt builds incremental models. By default, dbt will use a [merge statement](https://docs.snowflake.net/manuals/sql-reference/sql/merge.html) on Snowflake to refresh incremental tables.

Snowflake's `merge` statement fails with a "nondeterministic merge" error if the `unique_key` specified in your model config is not actually unique. If you encounter this error, you can instruct dbt to use a two-step incremental approach by setting the `incremental_strategy` config for your model to `delete+insert`.

## Configuring table clustering

dbt supports [table clustering](https://docs.snowflake.net/manuals/user-guide/tables-clustering-keys.html) on Snowflake. To control clustering for a <Term id="table" /> or incremental model, use the `cluster_by` config. When this configuration is applied, dbt will do two things:

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

 alter table my_database.my_schema.my_table cluster by (session_start);
```

### Automatic clustering

Automatic clustering is [enabled by default in Snowflake today](https://docs.snowflake.com/en/user-guide/tables-auto-reclustering.html), no action is needed to make use of it. Though there is an `automatic_clustering` config, it has no effect except for accounts with (deprecated) manual clustering enabled.

If [manual clustering is still enabled for your account](https://docs.snowflake.com/en/user-guide/tables-clustering-manual.html), you can use the `automatic_clustering` config to control whether or not automatic clustering is enabled for dbt models. When `automatic_clustering` is set to `true`, dbt will run an `alter table <table name> resume recluster` query after building the target table.

The `automatic_clustering` config can be specified in the `dbt_project.yml` file, or in a model `config()` block.

<File name='dbt_project.yml'>

```yaml
models:
  +automatic_clustering: true
```

</File>

## Configuring virtual warehouses

The default warehouse that dbt uses can be configured in your [Profile](/docs/core/connect-data-platform/profiles.yml) for Snowflake connections. To override the warehouse that is used for specific models (or groups of models), use the `snowflake_warehouse` model configuration. This configuration can be used to specify a larger warehouse for certain models in order to control Snowflake costs and project build times. 

<Tabs
  defaultValue="dbt_project.yml"
  values={[
    { label: 'YAML code', value: 'dbt_project.yml', },
    { label: 'SQL code', value: 'models/events/sessions.sql', },
    ]}
>

<TabItem value="dbt_project.yml">

The example config below changes the warehouse for a group of models with a config argument in the yml.

<File name='dbt_project.yml'>

```yaml
name: my_project
version: 1.0.0

...

models:
  +snowflake_warehouse: "EXTRA_SMALL"    # use the `EXTRA_SMALL` warehouse for all models in the project...
  my_project:
    clickstream:
      +snowflake_warehouse: "EXTRA_LARGE"    # ...except for the models in the `clickstream` folder, which will use the `EXTRA_LARGE` warehouse.

snapshots:
  +snowflake_warehouse: "EXTRA_LARGE"    # all Snapshot models are configured to use the `EXTRA_LARGE` warehouse.
```

</File>
</TabItem>

<TabItem value="models/events/sessions.sql">

The example config below changes the warehouse for a single model with a config() block in the sql model.

<File name='models/events/sessions.sql'>

```sql
{{
  config(
    materialized='table',
    snowflake_warehouse='EXTRA_LARGE'
  )
}}

with

aggregated_page_events as (

    select
        session_id,
        min(event_time) as session_start,
        max(event_time) as session_end,
        count(*) as count_page_views
    from {{ source('snowplow', 'event') }}
    group by 1

),

index_sessions as (

    select
        *,
        row_number() over (
            partition by session_id
            order by session_start
        ) as page_view_in_session_index
    from aggregated_page_events

)

select * from index_sessions
```

</File>
</TabItem>
</Tabs>

## Copying grants

When the `copy_grants` config is set to `true`, dbt will add the `copy grants` <Term id="ddl" /> qualifier when rebuilding tables and <Term id="view">views</Term>. The default value is `false`.

<File name='dbt_project.yml'>

```yaml
models:
  +copy_grants: true
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
      +materialized: view
      +secure: true
```

</File>

<VersionBlock firstVersion="1.3">

## Temporary tables

Beginning in dbt version 1.3, incremental table merges for Snowflake prefer to utilize a `view` rather than a `temporary table`. The reasoning was to avoid the database write step that a temporary table would initiate and save compile time. 

However, some situations remain where a temporary table would achieve results faster or more safely. dbt v1.4 adds the `tmp_relation_type` configuration to allow you to opt in to temporary tables for incremental builds. This is defined as part of the model configuration. 

To guarantee accuracy, an incremental model using the `delete+insert` strategy with a `unique_key` defined requires a temporary table; trying to change this to a view will result in an error.

Defined in the project YAML:

<File name='dbt_project.yml'>

```yaml
name: my_project

...

models:
  <resource-path>:
    +tmp_relation_type: table | view ## If not defined, view is the default.
  
```

</File>

In the configuration format for the model SQL file:

<File name='dbt_model.sql'>

```yaml

{{ config(
    tmp_relation_type="table | view", ## If not defined, view is the default.
) }}

```

</File>

</VersionBlock>

<VersionBlock firstVersion="1.6">

## Dynamic tables

The Snowflake adapter supports [dynamic tables](https://docs.snowflake.com/en/sql-reference/sql/create-dynamic-table).
This materialization is specific to Snowflake, which means that any model configuration that
would normally come along for the ride from `dbt-core` (e.g. as with a `view`) may not be available
for dynamic tables. This gap will decrease in future patches and versions.
While this materialization is specific to Snowflake, it very much follows the implementation
of [materialized views](/docs/build/materializations#Materialized-View).
In particular, dynamic tables have access to the `on_configuration_change` setting.
There are also some limitations that we hope to address in the next version.

### Parameters

Dynamic tables in `dbt-snowflake` require the following parameters:
- `target_lag`
- `snowflake_warehouse`
- `on_configuration_change`

To learn more about each parameter and what values it can take, see 
the Snowflake docs page: [`CREATE DYNAMIC TABLE: Parameters`](https://docs.snowflake.com/en/sql-reference/sql/create-dynamic-table).

### Usage

You can create a dynamic table by editing _one_ of these files:

- the SQL file for your model
- the `dbt_project.yml` configuration file

The following examples create a dynamic table:

<File name='models/YOUR_MODEL_NAME.sql'>

```sql
{{ config(
    materialized = 'dynamic_table',
    snowflake_warehouse = 'snowflake_warehouse',
    target_lag = '10 minutes',
) }}
```

</File>

<File name='dbt_project.yml'>

```yaml
models:
  path:
    materialized: dynamic_table
    snowflake_warehouse: snowflake_warehouse
    target_lag: '10 minutes'
```

</File>

### Monitored configuration changes

The settings below are monitored for changes applicable to `on_configuration_change`.

#### Target lag

Changes to `target_lag` can be applied by running an `ALTER` statement. Refreshing is essentially
always on for dynamic tables; this setting changes how frequently the dynamic table is updated.

#### Warehouse

Changes to `snowflake_warehouse` can be applied via an `ALTER` statement.

### Limitations

#### Changing materialization to and from "dynamic_table"

Swapping an already materialized model to be a dynamic table and vice versa.
The workaround is manually dropping the existing materialization in the data warehouse prior to calling `dbt run`.
Normally, re-running with the `--full-refresh` flag would resolve this, but not in this case.
This would only need to be done once as the existing object would then be a dynamic table.

For example, assume for the example model below, `my_model`, has already been materialized to the underlying data platform via `dbt run`.
If the user changes the model's config to `materialized="dynamic_table"`, they will get an error.
The workaround is to execute `DROP TABLE my_model` on the data warehouse before trying the model again.

<File name='my_model.sql'>

```yaml

{{ config(
    materialized="table" # or any model type eg view, incremental
) }}

```

</File>

</VersionBlock>
