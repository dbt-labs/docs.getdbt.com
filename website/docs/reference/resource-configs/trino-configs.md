---
title: "Starburst (Trino) configurations"
id: "trino-configs"
---

## Session-specific configs

In some specific cases, there may be needed tuning through the Trino session properties only for a specific dbt model. In such cases, using the [dbt hooks](https://docs.getdbt.com/reference/resource-configs/pre-hook-post-hook) may come to the rescue:

```
{{
  config(
    pre_hook="set session query_max_run_time='10m'"
  )
}}
```

## Materialization-specific configs

### Table

`dbt-trino` supports two modes in `table` materialization `rename` and `drop` configured using `on_table_exists`.

- `rename` - creates intermediate table, then renames the target to backup one and renames intermediate to target one.
- `drop` - drops and recreates a table. It overcomes table rename limitation in AWS Glue.


By default `table` materialization uses `on_table_exists = 'rename'`, see an examples below how to change it.

In model add:
```jinja2
{{
  config(
    materialized = 'table',
    on_table_exists = 'drop`
  )
}}
```

or in `dbt_project.yaml`:

```yaml
models:
  path:
    materialized: table
    +on_table_exists: drop
```

Using `table` materialization and `on_table_exists = 'rename'` with AWS Glue may result in below error:

```
TrinoUserError(type=USER_ERROR, name=NOT_SUPPORTED, message="Table rename is not yet supported by Glue service")
```

### View

Adapter supports two security modes in `view` materialization `DEFINER` and `INVOKER` configured using `view_security`.

See [Trino docs](https://trino.io/docs/current/sql/create-view.html#security) for more details about security modes in views.

By default `view` materialization uses `view_security = 'definer'`, see an examples below how to change it.

In model add:
```jinja2
{{
  config(
    materialized = 'view',
    view_security = 'invoker'
  )
}}
```

or in `dbt_project.yaml`:

```yaml
models:
  path:
    materialized: view
    +view_security: invoker
```


### Incremental

Using an incremental model limits the amount of data that needs to be transformed, vastly reducing the runtime of your transformations. This improves performance and reduces compute costs.

```jinja2
{{
    config(
      materialized = 'incremental', 
      unique_key='<optional>',
      incremental_strategy='<optional>',)
}}
select * from {{ ref('events') }}
{% if is_incremental() %}
  where event_ts > (select max(event_ts) from {{ this }})
{% endif %}
```

Use the `+on_schema_change` property to define how dbt-trino should handle column changes. See [dbt docs](https://docs.getdbt.com/docs/building-a-dbt-project/building-models/configuring-incremental-models#what-if-the-columns-of-my-incremental-model-change).

Set the `+views_enabled` to `false` if your connector doesn't support views. 

#### `append` (default)

The default incremental strategy is `append`. `append` only adds the new records based on the condition specified in the `is_incremental()` conditional block.

```jinja2
{{
    config(
      materialized = 'incremental')
}}
select * from {{ ref('events') }}
{% if is_incremental() %}
  where event_ts > (select max(event_ts) from {{ this }})
{% endif %}
```

#### `delete+insert`

Through the `delete+insert` incremental strategy, you can instruct dbt to use a two-step incremental approach. It will first delete the records detected through the configured `is_incremental()` block and re-insert them.

```jinja2
{{
    config(
      materialized = 'incremental',
      unique_key='user_id',
      incremental_strategy='delete+insert',
      )
}}
select * from {{ ref('users') }}
{% if is_incremental() %}
  where updated_ts > (select max(updated_ts) from {{ this }})
{% endif %}
```

#### `merge`

Through the `merge` incremental strategy, dbt-trino constructs a [`MERGE` statement](https://trino.io/docs/current/sql/merge.html) which `INSERT`s new and `UPDATE`s existing records based on the unique key (specified by `unique_key`).  
If `unique_key` is not unique `delete+insert` strategy can be used.
Note that some connectors in Trino have limited or no support for `MERGE`.

```jinja2
{{
    config(
      materialized = 'incremental',
      unique_key='user_id',
      incremental_strategy='merge',
      )
}}
select * from {{ ref('users') }}
{% if is_incremental() %}
  where updated_ts > (select max(updated_ts) from {{ this }})
{% endif %}
```

#### Incremental overwrite on hive models

In case that the target incremental model is being accessed with
[hive](https://trino.io/docs/current/connector/hive.html) Trino connector, an `insert overwrite`
functionality can be achieved when using:

```
<hive-catalog-name>.insert-existing-partitions-behavior=OVERWRITE
```

setting on the Trino hive connector configuration.

Below is a sample hive profile entry to deal with `OVERWRITE` functionality for the hive connector called `minio`:

```yaml
trino-incremental-hive:
  target: dev
  outputs:
    dev:
      type: trino
      method: none
      user: admin
      password:
      catalog: minio
      schema: tiny
      host: localhost
      port: 8080
      http_scheme: http
      session_properties:
        minio.insert_existing_partitions_behavior: OVERWRITE
      threads: 1
```

Existing partitions in the target model that match the staged data will be overwritten.
The rest of the partitions will be simply appended to the target model.

NOTE that this functionality works on incremental models that use partitioning:

```jinja2
{{
    config(
        materialized = 'incremental',
        properties={
          "format": "'PARQUET'",
          "partitioned_by": "ARRAY['day']",
        }
    )
}}
```

### Materialized view

The adapter also supports [materialized views](https://trino.io/docs/current/sql/create-materialized-view.html).
At every subsequent `dbt run` command, the materialized view is [refreshed](https://trino.io/docs/current/sql/refresh-materialized-view.html).

You can also define custom properties for the materialized view through the `properties` config.

This materialization supports the [full_refresh](https://docs.getdbt.com/reference/resource-configs/full_refresh) config and flag.
Whenever you want to rebuild your materialized view, e.g. when changing underlying SQL query, run `dbt run --full-refresh`.


In model add:
```jinja2
{{
  config(
    materialized = 'materialized_view',
    properties = {
      'format': "'PARQUET'"
    },
  )
}}
```

or in `dbt_project.yaml`:

```yaml
models:
  path:
    materialized: materialized_view
    properties:
      format: "'PARQUET'"
```

### Snapshots

Commonly, analysts need to "look back in time" at some previous state of data in their mutable tables. While some source data systems are built in a way that makes accessing historical data possible, this is often not the case. dbt provides a mechanism, snapshots, which records changes to a mutable table over time.

Snapshots implement type-2 Slowly Changing Dimensions over mutable source tables. These Slowly Changing Dimensions (or SCDs) identify how a row in a table changes over time. Imagine you have an orders table where the status field can be overwritten as the order is processed. [See also the dbt docs about snapshots](https://docs.getdbt.com/docs/building-a-dbt-project/snapshots).

An example is given below.

```jinja2
{% snapshot orders_snapshot %}
{{
    config(
        target_database='analytics',
        target_schema='snapshots',
        unique_key='id',
        strategy='timestamp',
        updated_at='updated_at',
    )
}}
select * from {{ source('jaffle_shop', 'orders') }}
{% endsnapshot %}
```

Note that the Snapshot feature depends on the `current_timestamp` macro. In some connectors the standard precision (`TIMESTAMP(3) WITH TIME ZONE`) is not supported by the connector eg. Iceberg.

If necessary, you can override the standard precision by providing your own version of the `trino__current_timestamp()` macro as in following example:

```jinja2
{% macro trino__current_timestamp() %}
    current_timestamp(6)
{% endmacro %}
```

## Use table properties to configure connector specifics

Trino connectors use table properties to configure connector specifics.

Check the Trino connector documentation for more information.

```jinja2
{{
  config(
    materialized='table',
    properties={
      "format": "'PARQUET'",
      "partitioning": "ARRAY['bucket(id, 2)']",
    }
  )
}}
```

## Seeds

Seeds are CSV files in your dbt project (typically in your data directory), that dbt can load into your data warehouse using the dbt seed command.

For dbt-trino batch_size is defined in macro `trino__get_batch_size()` and default value is `1000`.
In order to override default value define within your project a macro like the following:

```jinja2
{% macro default__get_batch_size() %}
  {{ return(10000) }}
{% endmacro %}
```

## Persist docs

Persist docs optionally persist resource descriptions as column and relation comments in the database. By default, documentation persistence is disabled, but it can be enabled for specific resources or groups of resources as needed.

Detailed documentation can be found [here](https://docs.getdbt.com/reference/resource-configs/persist_docs).

## Generating lineage flow in docs

In order to generate lineage flow in docs use `ref` function in the place of table names in the query. It builts dependencies between models and allows to create DAG with data flow. Refer to examples [here](https://docs.getdbt.com/docs/building-a-dbt-project/building-models#building-dependencies-between-models).

```sh
dbt docs generate          # generate docs
dbt docs serve --port 8081 # starts local server (by default docs server runs on 8080 port, it may cause conflict with Trino in case of local development)
```

## Using Custom schemas

By default, all dbt models are built in the schema specified in your target. But sometimes you wish to build some of the models in a custom schema. In order to do so, use the `schema` configuration key to specify a custom schema for a model. See [here](https://docs.getdbt.com/docs/building-a-dbt-project/building-models/using-custom-schemas) for the documentation. It is important to note that by default, dbt will generate the schema name for a model by concatenating the custom schema to the target schema, as in: `<target_schema>_<custom_schema>`. 


## Prepared statements

The `dbt seed` feature uses [Trino's prepared statements](https://trino.io/docs/current/sql/prepare.html).

Python's http client has a hardcoded limit of 65536 bytes for a header line.

When executing a prepared statement with a large number of parameters, you might encounter following error:

`requests.exceptions.ConnectionError: ('Connection aborted.', LineTooLong('got more than 65536 bytes when reading header line'))`.

The prepared statements can be disabled by setting `prepared_statements_enabled` to `true` in your dbt profile (reverting back to the legacy behavior using Python string interpolation). This flag may be removed in later releases.

#### Grants

Please note that grants are only supported in [Starburst Enterprise](https://docs.starburst.io/latest/security/biac-overview.html) and [Starburst Galaxy](https://docs.starburst.io/starburst-galaxy/security/access-control.html) and Hive ([sql-standard](https://trino.io/docs/current/connector/hive-security.html)).

You can manage access to the datasets you're producing with dbt by using grants. To implement these permissions, define grants as resource configs on each model, seed, or snapshot. Define the default grants that apply to the entire project in your dbt_project.yml, and define model-specific grants within each model's SQL or YAML file.

```yaml
models:
  - name: specific_model
    config:
      grants:
        select: ['reporter', 'bi']
```

Read everything about grants in the [dbt docs](https://docs.getdbt.com/reference/resource-configs/grants).
