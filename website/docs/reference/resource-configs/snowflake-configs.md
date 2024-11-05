---
title: "Snowflake configurations"
id: "snowflake-configs"
description: "Snowflake Configurations - Read this in-depth guide to learn about configurations in dbt."
---

<!----
To-do:
- use the reference doc structure for this article / split into separate articles
--->

<VersionBlock firstVersion="1.9">

## Iceberg table format <Lifecycle status="beta"/>

The dbt-snowflake adapter supports the Iceberg table format. It is available for three of the Snowflake materializations: 

- [Table](/docs/build/materializations#table)
- [Incremental](/docs/build/materializations#incremental)
- [Dynamic](#dynamic-tables) 

For now, to create Iceberg tables, you must implement a [behavior flag](/reference/global-configs/behavior-changes) due to performance impact related to using Iceberg tables. Snowflake does not support `is_iceberg` on the `Show Objects` query, which dbt depends on for metadata.

To use Iceberg, set the `enable_iceberg_materializations` flag to `True` in your dbt_project.yml:

<File name='dbt_project.yml'>

```yaml

flags:
  enable_iceberg_materializations: True

```

</File>


The following configurations are supported.
For more information, check out the Snowflake reference for [`CREATE ICEBERG TABLE` (Snowflake as the catalog)](https://docs.snowflake.com/en/sql-reference/sql/create-iceberg-table-snowflake).

| Field                 | Type   | Required | Description                                                                                                                | Sample input              | Note                                                                                                                                                                                                                                                         |
| --------------------- | ------ | -------- | -------------------------------------------------------------------------------------------------------------------------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Table Format          | String | Yes      | Configures the objects table format.                                                                                       | `iceberg`                 | `iceberg` is the only accepted value.                                                                                                                                                                                                                          |
| External volume       | String | Yes(*)   | Specifies the identifier (name) of the external volume where Snowflake writes the Iceberg table's metadata and data files. | `my_s3_bucket`            | *You don't need to specify this if the account, database, or schema already has an associated external volume. [More info](https://docs.snowflake.com/en/sql-reference/sql/create-iceberg-table-snowflake#:~:text=Snowflake%20Table%20Structures.-,external_volume) |
| Base location Subpath | String | No       | An optional suffix to add to the `base_location` path that dbt automatically specifies.                                    | `jaffle_marketing_folder` | We recommend that you do not specify this. Modifying this parameter results in a new Iceberg table. See [Base Location](#base-location) for more info.                                                                                                  |

### Example configuration

To configure an Iceberg table materialization in dbt, refer to the example configuration:

<File name='models/<modelname>.sql'>

```sql

{{
  config(
    materialized = "table",
    table_format="iceberg",
    external_volume="s3_iceberg_snow",
  )
}}

select * from {{ ref('raw_orders') }}

```

</File>

### Base location 

Snowflake's `CREATE ICEBERG TABLE` DDL requires that a `base_location` be provided. dbt defines this parameter on the user's behalf to streamline usage and enforce basic isolation of table data within the `EXTERNAL VOLUME`. The default behavior in dbt is to provide a `base_location` string of the form: `_dbt/{SCHEMA_NAME}/{MODEL_NAME}`

#### Base Location Subpath
We recommend using dbt's auto-generated `base_location`. However, if you need to customize the resulting `base_location`, dbt allows users to configure a `base_location_subpath`. When specified, the subpath concatenates to the end of the previously described pattern for `base_location` string generation.

For example, `config(base_location_subpath="prod")` will generate a `base_location` of the form `_dbt/{SCHEMA_NAME}/{MODEL_NAME}/prod/`.

A theoretical (but not recommended) use case is re-using an `EXTERNAL VOLUME` while maintaining isolation across development and production environments. We recommend against this as storage permissions should configured on the external volume and underlying storage, not paths that any analytics engineer can modify.

#### Rationale

dbt manages `base_location` on behalf of users to enforce best practices. With Snowflake-managed Iceberg format tables, the user owns and maintains the data storage of the tables in an external storage solution (the declared `external volume`). The `base_ location` parameter declares where to write the data within the external volume. The Snowflake Iceberg catalog keeps track of your Iceberg table regardless of where the data lives within the `external volume` declared and the `base_location` provided. However, Snowflake permits passing anything into the `base_location` field, including an empty string, even reusing the same path across multiple tables. This behavior could result in future technical debt because it will limit the ability to:

- Navigate the underlying object store (S3/Azure blob)
- Read Iceberg tables via an object-store integration
- Grant schema-specific access to tables via object store
- Use a crawler pointed at the tables within the external volume to build a new catalog with another tool

To maintain best practices,  we enforce an input. Currently, we do not support overriding the default `base location` input but will consider it based on user feedback. 

In summary, dbt-snowflake does not support arbitrary definition of `base_location` for Iceberg tables. Instead, dbt, by default, writes your tables within a `_dbt/{SCHEMA_NAME}/{TABLE_NAME}` prefix to ensure easier object-store observability and auditability.

### Limitations

There are some limitations to the implementation you need to be aware of:

-  Using Iceberg tables with dbt, the result is that your query is materialized in Iceberg. However, often, dbt creates intermediary objects as temporary and transient tables for certain materializations, such as incremental ones. It is not possible to configure these temporary objects also to be Iceberg-formatted. You may see non-Iceberg tables created in the logs to support specific materializations, but they will be dropped after usage.
- You cannot incrementally update a preexisting incremental model to be an Iceberg table. To do so, you must fully rebuild the table with the `--full-refresh` flag.

</VersionBlock>

## Dynamic tables

The Snowflake adapter supports [dynamic tables](https://docs.snowflake.com/en/user-guide/dynamic-tables-about).
This materialization is specific to Snowflake, which means that any model configuration that
would normally come along for the ride from `dbt-core` (e.g. as with a `view`) may not be available
for dynamic tables. This gap will decrease in future patches and versions.
While this materialization is specific to Snowflake, it very much follows the implementation
of [materialized views](/docs/build/materializations#Materialized-View).
In particular, dynamic tables have access to the `on_configuration_change` setting.
Dynamic tables are supported with the following configuration parameters:

<VersionBlock lastVersion="1.8">

| Parameter          | Type       | Required | Default     | Change Monitoring Support |
|--------------------|------------|----------|-------------|---------------------------|
| [`on_configuration_change`](/reference/resource-configs/on_configuration_change) | `<string>` | no       | `apply`     | n/a                       |
| [`target_lag`](#target-lag)      | `<string>` | yes      |        | alter          |
| [`snowflake_warehouse`](#configuring-virtual-warehouses)   | `<string>` | yes      |       | alter  |
</VersionBlock>

<VersionBlock firstVersion="1.9">

| Parameter          | Type       | Required | Default     | Change Monitoring Support |
|--------------------|------------|----------|-------------|---------------------------|
| [`on_configuration_change`](/reference/resource-configs/on_configuration_change) | `<string>` | no       | `apply`     | n/a                       |
| [`target_lag`](#target-lag)      | `<string>` | yes      |        | alter          |
| [`snowflake_warehouse`](#configuring-virtual-warehouses)   | `<string>` | yes      |       | alter  |
| [`refresh_mode`](#refresh-mode)       | `<string>` | no       | `AUTO`      | refresh        |
| [`initialize`](#initialize)     | `<string>` | no       | `ON_CREATE` | n/a   |

</VersionBlock>

<VersionBlock lastVersion="1.8">

<Tabs
  groupId="config-languages"
  defaultValue="project-yaml"
  values={[
    { label: 'Project file', value: 'project-yaml', },
    { label: 'Property file', value: 'property-yaml', },
    { label: 'Config block', value: 'config', },
  ]
}>

<TabItem value="project-yaml">

<File name='dbt_project.yml'>

```yaml
models:
  [<resource-path>](/reference/resource-configs/resource-path):
    [+](/reference/resource-configs/plus-prefix)[materialized](/reference/resource-configs/materialized): dynamic_table
    [+](/reference/resource-configs/plus-prefix)[on_configuration_change](/reference/resource-configs/on_configuration_change): apply | continue | fail
    [+](/reference/resource-configs/plus-prefix)[target_lag](#target-lag): downstream | <time-delta>
    [+](/reference/resource-configs/plus-prefix)[snowflake_warehouse](#configuring-virtual-warehouses): <warehouse-name>

```

</File>

</TabItem>


<TabItem value="property-yaml">

<File name='models/properties.yml'>

```yaml
version: 2

models:
  - name: [<model-name>]
    config:
      [materialized](/reference/resource-configs/materialized): dynamic_table
      [on_configuration_change](/reference/resource-configs/on_configuration_change): apply | continue | fail
      [target_lag](#target-lag): downstream | <time-delta>
      [snowflake_warehouse](#configuring-virtual-warehouses): <warehouse-name>

```

</File>

</TabItem>


<TabItem value="config">

<File name='models/<model_name>.sql'>

```jinja

{{ config(
    [materialized](/reference/resource-configs/materialized)="dynamic_table",
    [on_configuration_change](/reference/resource-configs/on_configuration_change)="apply" | "continue" | "fail",
    [target_lag](#target-lag)="downstream" | "<integer> seconds | minutes | hours | days",
    [snowflake_warehouse](#configuring-virtual-warehouses)="<warehouse-name>",

) }}

```

</File>

</TabItem>

</Tabs>

</VersionBlock>

<VersionBlock firstVersion="1.9">

<Tabs
  groupId="config-languages"
  defaultValue="project-yaml"
  values={[
    { label: 'Project file', value: 'project-yaml', },
    { label: 'Property file', value: 'property-yaml', },
    { label: 'Config block', value: 'config', },
  ]
}>

<TabItem value="project-yaml">

<File name='dbt_project.yml'>

```yaml
models:
  [<resource-path>](/reference/resource-configs/resource-path):
    [+](/reference/resource-configs/plus-prefix)[materialized](/reference/resource-configs/materialized): dynamic_table
    [+](/reference/resource-configs/plus-prefix)[on_configuration_change](/reference/resource-configs/on_configuration_change): apply | continue | fail
    [+](/reference/resource-configs/plus-prefix)[target_lag](#target-lag): downstream | <time-delta>
    [+](/reference/resource-configs/plus-prefix)[snowflake_warehouse](#configuring-virtual-warehouses): <warehouse-name>
    [+](/reference/resource-configs/plus-prefix)[refresh_mode](#refresh-mode): AUTO | FULL | INCREMENTAL
    [+](/reference/resource-configs/plus-prefix)[initialize](#initialize): ON_CREATE | ON_SCHEDULE 

```

</File>

</TabItem>


<TabItem value="property-yaml">

<File name='models/properties.yml'>

```yaml
version: 2

models:
  - name: [<model-name>]
    config:
      [materialized](/reference/resource-configs/materialized): dynamic_table
      [on_configuration_change](/reference/resource-configs/on_configuration_change): apply | continue | fail
      [target_lag](#target-lag): downstream | <time-delta>
      [snowflake_warehouse](#configuring-virtual-warehouses): <warehouse-name>
      [refresh_mode](#refresh-mode): AUTO | FULL | INCREMENTAL 
      [initialize](#initialize): ON_CREATE | ON_SCHEDULE 

```

</File>

</TabItem>


<TabItem value="config">

<File name='models/<model_name>.sql'>

```jinja

{{ config(
    [materialized](/reference/resource-configs/materialized)="dynamic_table",
    [on_configuration_change](/reference/resource-configs/on_configuration_change)="apply" | "continue" | "fail",
    [target_lag](#target-lag)="downstream" | "<integer> seconds | minutes | hours | days",
    [snowflake_warehouse](#configuring-virtual-warehouses)="<warehouse-name>",
    [refresh_mode](#refresh-mode)="AUTO" | "FULL" | "INCREMENTAL",
    [initialize](#initialize)="ON_CREATE" | "ON_SCHEDULE", 

) }}

```

</File>

</TabItem>

</Tabs>

</VersionBlock>

Learn more about these parameters in Snowflake's [docs](https://docs.snowflake.com/en/sql-reference/sql/create-dynamic-table):

### Target lag

Snowflake allows two configuration scenarios for scheduling automatic refreshes: 
- **Time-based** &mdash; Provide a value of the form `<int> { seconds | minutes | hours | days }`. For example, if the dynamic table needs to be updated every 30 minutes, use `target_lag='30 minutes'`.
- **Downstream** &mdash; Applicable when the dynamic table is referenced by other dynamic tables. In this scenario, `target_lag='downstream'` allows for refreshes to be controlled at the target, instead of at each layer.

Learn more about `target_lag` in Snowflake's [docs](https://docs.snowflake.com/en/user-guide/dynamic-tables-refresh#understanding-target-lag). Please note that Snowflake supports a target lag of 1 minute or longer.

<VersionBlock firstVersion="1.9">

### Refresh mode

Snowflake allows three options for refresh mode:
- **AUTO** &mdash; Enforces an incremental refresh of the dynamic table by default. If the `CREATE DYNAMIC TABLE` statement does not support the incremental refresh mode, the dynamic table is automatically created with the full refresh mode.
- **FULL** &mdash; Enforces a full refresh of the dynamic table, even if the dynamic table can be incrementally refreshed.
- **INCREMENTAL** &mdash; Enforces an incremental refresh of the dynamic table. If the query that underlies the dynamic table can’t perform an incremental refresh, dynamic table creation fails and displays an error message.

Learn more about `refresh_mode` in [Snowflake's docs](https://docs.snowflake.com/en/user-guide/dynamic-tables-refresh).

### Initialize

Snowflake allows two options for initialize:
- **ON_CREATE** &mdash; Refreshes the dynamic table synchronously at creation. If this refresh fails, dynamic table creation fails and displays an error message.
- **ON_SCHEDULE** &mdash; Refreshes the dynamic table at the next scheduled refresh.

Learn more about `initialize` in [Snowflake's docs](https://docs.snowflake.com/en/user-guide/dynamic-tables-refresh).

</VersionBlock>

### Limitations

As with materialized views on most data platforms, there are limitations associated with dynamic tables. Some worth noting include:

- Dynamic table SQL has a [limited feature set](https://docs.snowflake.com/en/user-guide/dynamic-tables-tasks-create#query-constructs-not-currently-supported-in-dynamic-tables).
- Dynamic table SQL cannot be updated; the dynamic table must go through a `--full-refresh` (DROP/CREATE).
- Dynamic tables cannot be downstream from: materialized views, external tables, streams.
- Dynamic tables cannot reference a view that is downstream from another dynamic table.

Find more information about dynamic table limitations in Snowflake's [docs](https://docs.snowflake.com/en/user-guide/dynamic-tables-tasks-create#dynamic-table-limitations-and-supported-functions).

For dbt limitations, these dbt features are not supported:
- [Model contracts](/docs/collaborate/govern/model-contracts)
- [Copy grants configuration](/reference/resource-configs/snowflake-configs#copying-grants)

## Temporary tables

Incremental table merges for Snowflake prefer to utilize a `view` rather than a `temporary table`. The reasoning is to avoid the database write step that a temporary table would initiate and save compile time. 

However, some situations remain where a temporary table would achieve results faster or more safely. The `tmp_relation_type` configuration enables you to opt in to temporary tables for incremental builds. This is defined as part of the model configuration. 

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

The [`incremental_strategy` config](/docs/build/incremental-strategy) controls how dbt builds incremental models. By default, dbt will use a [merge statement](https://docs.snowflake.net/manuals/sql-reference/sql/merge.html) on Snowflake to refresh incremental tables.

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


## Source freshness known limitation

Snowflake calculates source freshness using information from the `LAST_ALTERED` column, meaning it relies on a field updated whenever any object undergoes modification, not only data updates. No action must be taken, but analytics teams should note this caveat. 

Per the [Snowflake documentation](https://docs.snowflake.com/en/sql-reference/info-schema/tables#usage-notes): 

  >The `LAST_ALTERED` column is updated when the following operations are performed on an object:
  >- DDL operations.
  >- DML operations (for tables only).
  >- Background maintenance operations on metadata performed by Snowflake.
