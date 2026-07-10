---
title: "Materializations"
sidebar_label: "Materializations"
description: "Configure table and incremental materialization behavior in the Trino adapter with the on_table_exists option."
---

### Table

The `dbt-trino` adapter supports these modes in `table` materialization (and [full-refresh runs](/reference/commands/run#refresh-incremental-models) in `incremental` materialization), which you can configure with `on_table_exists`:

- `rename` &mdash; Creates an intermediate table, renames the target table to the backup one, and renames the intermediate table to the target one.
- `drop` &mdash; Drops and re-creates a table. This overcomes the table rename limitation in AWS Glue.
- `replace` &mdash; Replaces a table using CREATE OR REPLACE clause. Support for table replacement varies across connectors. Refer to the connector documentation for details.
- `skip` &mdash; Skips table materialization altogether using a CREATE TABLE IF NOT EXISTS clause.

If CREATE OR REPLACE is supported in underlying connector, `replace` is recommended option. Otherwise, the recommended `table` materialization uses `on_table_exists = 'rename'` and is also the default. You can change this default configuration by editing _one_ of these files:
- the SQL file for your model
- the `dbt_project.yml` configuration file

The following examples configure `table` materialization to be `drop`: 

<File name='models/YOUR_MODEL_NAME.sql'>

```sql
{{
  config(
    materialized = 'table',
    on_table_exists = 'drop`
  )
}}
```

</File>


<File name='dbt_project.yml'>

```yaml 
models:
  path:
    materialized: table
    +on_table_exists: drop
```
</File>

If you use `table` materialization and `on_table_exists = 'rename'` with AWS Glue, you might encounter this error message. You can overcome the table rename limitation by using `drop`: 

```sh
TrinoUserError(type=USER_ERROR, name=NOT_SUPPORTED, message="Table rename is not yet supported by Glue service")
```

### View

The `dbt-trino` adapter supports these security modes in `view` materialization, which you can configure with `view_security`:
- `definer`
- `invoker`

For more details about security modes in views, see [Security](https://trino.io/docs/current/sql/create-view.html#security) in the Trino docs.

By default, `view` materialization uses `view_security = 'definer'`. You can change this default configuration by editing _one_ of these files:
- the SQL file for your model
- the `dbt_project.yml` configuration file

For example, these configure the security mode to `invoker`:  

<File name='models/YOUR_MODEL_NAME.sql'>

```sql
{{
  config(
    materialized = 'view',
    view_security = 'invoker'
  )
}}
```

</File>

<File name='dbt_project.yml'>

```yaml 
models:
  path:
    materialized: view
    +view_security: invoker
```
</File>


### Incremental

Using an incremental model limits the amount of data that needs to be transformed, which greatly reduces the runtime of your transformations. This improves performance and reduces compute costs.

```sql
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

Use the `+on_schema_change` property to define how dbt-trino should handle column changes. For more details about this property, see [column changes](/docs/build/incremental-models#what-if-the-columns-of-my-incremental-model-change).

If your connector doesn't support views, set the `+views_enabled` property to `false`.

You can decide how model should be rebuilt in a `full-refresh` run by specifying `on_table_exists` config. Options are the same as described in [table materialization section](/reference/resource-configs/trino-configs/materializations#table)

#### append strategy

The default incremental strategy is `append`. `append` only adds new records based on the condition specified in the `is_incremental()` conditional block.

```sql
{{
    config(
      materialized = 'incremental')
}}
select * from {{ ref('events') }}
{% if is_incremental() %}
  where event_ts > (select max(event_ts) from {{ this }})
{% endif %}
```

#### delete+insert strategy

With the `delete+insert` incremental strategy, you can instruct dbt to use a two-step incremental approach. First, it deletes the records detected through the configured `is_incremental()` block, then re-inserts them.

```sql
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

#### merge strategy

With the `merge` incremental strategy, dbt-trino constructs a [Trino MERGE statement](https://trino.io/docs/current/sql/merge.html) to `insert` new records and `update` existing records, based on the `unique_key` property.

If `unique_key` is not unique, you can use the `delete+insert` strategy instead.

```sql
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

Be aware that there are some Trino connectors that don't support `MERGE` or have limited support.

#### Incremental overwrite on Hive models

If there's a [Hive connector](https://trino.io/docs/current/connector/hive.html) accessing your target incremental model, you can simulate an `INSERT OVERWRITE` statement by using the `insert-existing-partitions-behavior` setting on the Hive connector configuration in Trino:

```ini
<hive-catalog-name>.insert-existing-partitions-behavior=OVERWRITE
```

Below is an example Hive configuration that sets the `OVERWRITE` functionality for a Hive connector called `minio`:

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

`dbt-trino` overwrites existing partitions in the target model that match the staged data. It appends the remaining partitions to the target model. This functionality works on incremental models that use partitioning. For example:  

```sql
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

The `dbt-trino` adapter supports [materialized views](https://trino.io/docs/current/sql/create-materialized-view.html) and refreshes them for every subsequent `dbt run` that you execute. For more information, see [REFRESH MATERIALIZED VIEW](https://trino.io/docs/current/sql/refresh-materialized-view.html) in the Trino docs.

You can also define custom properties for the materialized view through the `properties` config.

This materialization supports the [full_refresh](/reference/resource-configs/full_refresh) config and flag.
Whenever you want to rebuild your materialized view (for example, when changing underlying SQL query) run `dbt run --full-refresh`.

You can create a materialized view by editing _one_ of these files:
- the SQL file for your model
- the `dbt_project.yml` configuration file

The following examples create a materialized view in Parquet format: 

<File name='models/YOUR_MODEL_NAME.sql'>

```sql
{{
  config(
    materialized = 'materialized_view',
    properties = {
      'format': "'PARQUET'"
    },
  )
}}
```

</File>


<File name='dbt_project.yml'>

```yaml 
models:
  path:
    materialized: materialized_view
    properties:
      format: "'PARQUET'"
```
</File>
