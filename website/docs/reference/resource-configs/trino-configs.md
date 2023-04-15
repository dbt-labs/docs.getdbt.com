---
title: "Starburst/Trino configurations"
id: "trino-configs"
---

## Session properties

During a connection session with a Trino cluster, you can temporarily modify your session's properties for a specific dbt model by using [dbt hooks](/reference/resource-configs/pre-hook-post-hook). 

For example: 

```sql
{{
  config(
    pre_hook="set session query_max_run_time='10m'"
  )
}}
```

## Connector properties

Trino connectors use table properties to configure connector specifics.

For more information, refer to either the [Trino Connectors](https://trino.io/docs/current/connector.html) or [Starburst Catalog](https://docs.starburst.io/starburst-galaxy/catalogs/) so learn what is and isn't supported for each underlying data platform

```sql
{{
  config(
    materialized='table',
    properties= {
      "format": "'PARQUET'",
      "partitioning": "ARRAY['bucket(id, 2)']",
    }
  )
}}
```

## Seeds and prepared statements

reference: [dbt docs: Seeds](https://docs.getdbt.com/docs/build/seeds)

The `dbt seed` feature uses [Trino's prepared statements](https://trino.io/docs/current/sql/prepare.html).

Prepared statements are templated SQL statements that are sent with the values in a separate field rather than hard-coded in the SQL string itself. This is often how application front ends structure record INSERTs in the OLTP database backend. Therefore, it is common that a prepared statement will have as many placeholder variables as there are columns in the destintation table.

Virtually all seed files have more than one row, and often thousands of rows. This makes the size of the client request as large as there are parameters.

As an example a seed file with 20 columns and 600 rows has 12,000 values, therefore 12,000 parameters.

Python's http client has a hardcoded limit of `65536` bytes for a header line. When executing a prepared statement with a large number of parameters, you might encounter following error:

```python
requests.exceptions.ConnectionError: (
  'Connection aborted.', 
  LineTooLong('got more than 65536 bytes when reading header line')
  )
```

There are two ways to deal with this issue:

1. decrease the size of each batch, or
2. enable the `prepared_statements_enabled` flag in your profile.

### Decrease batch size

To avoid this upper limit, one way each the total size of each client prepared statement request is to simply break the statement into smaller ones. dbt does this already by batching an entire seed file into groups of rows -- one group for a chunk of rows of the `.csv`. 

So, using the example above, rather than creating a single prepared statement with 1200 parameters, we can have dbt create four prepared `INSERT` statements, with 150 rows and 3,000 parameters.

There's a draw back to chunking a table into groups of rows, which is when there are many columns. Some users have seed files with many parameters, which means the batch size needs to be very small.

For `dbt-trino` batch_size is defined the macro `trino__get_batch_size()` and it's default value is `1000`. 
In order to override this default, add the below macro to your dbt project:

```sql
{% macro trino__get_batch_size() %}
  {{ return(10000) }} -- adjust this number as you see fit
{% endmacro %}
```

### Header line length limit

Another option you have is to disable prepared statements by setting `prepared_statements_enabled` to `true` in your dbt profile (reverting back to the legacy behavior using Python string interpolation). Note: This flag may be removed in later releases.

## Materializations
### Table

`dbt-trino` supports two modes in `table` materialization: `rename` and `drop` configured using `on_table_exists`.

- `rename` - creates intermediate table, then renames the target to backup one and renames intermediate to target one.
- `drop` - drops and recreates a table. It overcomes table rename limitation in AWS Glue.

The recommended `table` materialization uses `on_table_exists = 'rename'` and it is also the default. See the below example for how to change it.

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

```sh
TrinoUserError(type=USER_ERROR, name=NOT_SUPPORTED, message="Table rename is not yet supported by Glue service")
```

### View

Adapter supports two security modes in `view` materialization `definer` and `invoker` configured using `view_security`.

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

Through the `merge` incremental strategy, dbt-trino constructs a [`MERGE` statement](https://trino.io/docs/current/sql/merge.html) which `insert`s new and `update`s existing records based on the unique key (specified by `unique_key`).  
If `unique_key` is not unique, `delete+insert` strategy can be used.
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

```ini
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

## Snapshots

[Snapshots in dbt](/docs/build/snapshots) depend on the `current_timestamp` macro, which returns a timestamp with millisecond precision (3 digits). There are some connectors for Trino that don't support this timestamp precision (`TIMESTAMP(3) WITH TIME ZONE`), like Iceberg.

To change the precision of timestamps, you can define your own [macro](/docs/build/jinja-macros). For example, this defines a new `trino__current_timestamp()` macro with microsecond precision (6 digits): 

```jinja2
{% macro trino__current_timestamp() %}
    current_timestamp(6)
{% endmacro %}
```

## Grants

Use [grants](/reference/resource-configs/grants) to manage access to the datasets you're producing with dbt. You can use grants with [Starburst Enterprise](https://docs.starburst.io/latest/security/biac-overview.html), [Starburst Galaxy](https://docs.starburst.io/starburst-galaxy/security/access-control.html), and Hive ([sql-standard](https://trino.io/docs/current/connector/hive-security.html)).


To implement access permissions, define grants as resource configs on each model, seed, and snapshot. Define the default grants that apply to the entire project in your `dbt_project.yml` and define model-specific grants within each model's SQL or YAML file.

```yaml
models:
  - name: NAME_OF_YOUR_MODEL
    config:
      grants:
        select: ['reporter', 'bi']
```

