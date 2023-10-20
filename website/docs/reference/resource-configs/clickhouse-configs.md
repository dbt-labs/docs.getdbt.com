---
title: "ClickHouse configurations"
description: "Read this guide to understand ClickHouse configurations in dbt."
id: "clickhouse-configs"
---

## Models

| Type                        | Supported? | Details                                                                                                                          |
|-----------------------------|------------|----------------------------------------------------------------------------------------------------------------------------------|
| view materialization        | YES        | Creates a [view](https://clickhouse.com/docs/en/sql-reference/table-functions/view/).                                            |
| table materialization       | YES        | Creates a [table](https://clickhouse.com/docs/en/operations/system-tables/tables/). See below for the list of supported engines. |
| incremental materialization | YES        | Creates a table if it doesn't exist, and then writes only updates to it.                                                         |
| ephemeral materialized      | YES        | Creates a ephemeral/CTE materialization.  This does model is internal to dbt and does not create any database objects            |

### View Materialization

A dbt model can be created as a [ClickHouse view](https://clickhouse.com/docs/en/sql-reference/table-functions/view/) and configured using the following syntax:

<Tabs
    groupId="config-view"
    defaultValue="project-yaml"
    values={[
        { label: 'Project file', value: 'project-yaml', },
        { label: 'Config block', value: 'config', },
    ]
}>

<TabItem value="project-yaml">
<File name='dbt_project.yml'>

```yaml
models:
  <resource-path>:
    +materialized: view
```

</File>
</TabItem>

<TabItem value="config">
<File name='models/<model_name>.sql'>

```jinja
{{ config(materialized = "view") }}
```

</File>
</TabItem>
</Tabs>

### Table Materialization

A dbt model can be created as a [ClickHouse table](https://clickhouse.com/docs/en/operations/system-tables/tables/) and configured using the following syntax:

<Tabs
    groupId="config-table"
    defaultValue="project-yaml"
    values={[
        { label: 'Project file', value: 'project-yaml', },
        { label: 'Config block', value: 'config', },
    ]
}>

<TabItem value="project-yaml">
<File name='dbt_project.yml'>

```yaml
models:
  <resource-path>:
    +materialized: table
    +order_by: [ <column-name>, ... ]
    +engine: <engine-type>
    +partition_by: [ <column-name>, ... ]
```

</File>
</TabItem>

<TabItem value="config">
<File name='models/<model_name>.sql'>

```jinja
{{ config(
    materialized = "table",
    engine = "<engine-type>",
    order_by = [ "<column-name>", ... ],
    partition_by = [ "<column-name>", ... ],
      ...
    ]
) }}
```

</File>
</TabItem>
</Tabs>

#### Table Configuration

| Option         | Description                                                                                                                                          | Required?                         |
|----------------|------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------|
| `materialized` | How the model will be materialized into ClickHouse. Must be `table` to create a table model.                                                         | Required                          |
| `engine`       | The table engine to use when creating tables. See list of supported engines below.                                                                   | Optional (default: `MergeTree()`) |
| `order_by`     | A tuple of column names or arbitrary expressions. This allows you to create a small sparse index that helps find data faster.                        | Optional (default: `tuple()`)     |
| `partition_by` | A partition is a logical combination of records in a table by a specified criterion. The partition key can be any expression from the table columns. | Optional                          |

### Incremental Materialization

Table model will be reconstructed for each dbt execution. This may be infeasible and extremely costly for larger result sets or complex transformations. To address this challenge and reduce the build time, a dbt model can be created as an incremental ClickHouse table and is configured using the following syntax:

<Tabs
    groupId="config-incremental"
    defaultValue="project-yaml"
    values={[
        { label: 'Project file', value: 'project-yaml', },
        { label: 'Config block', value: 'config', },
    ]}
>

<TabItem value="project-yaml">
<File name='dbt_project.yml'>

```yaml
models:
  <resource-path>:
    +materialized: incremental
    +order_by: [ <column-name>, ... ]
    +engine: <engine-type>
    +partition_by: [ <column-name>, ... ]
    +unique_key: [ <column-name>, ... ]
    +inserts_only: [ True|False ]
```

</File>
</TabItem>

<TabItem value="config">
<File name='models/<model_name>.sql'>

```jinja
{{ config(
    materialized = "incremental",
    engine = "<engine-type>",
    order_by = [ "<column-name>", ... ],
    partition_by = [ "<column-name>", ... ],
    unique_key = [ "<column-name>", ... ],
    inserts_only = [ True|False ],
      ...
    ]
) }}
```

</File>
</TabItem>
</Tabs>

#### Incremental Table Configuration

| Option                   | Description                                                                                                                                                                                                                    | Required?                                                                            |
|--------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------|
| `materialized`           | How the model will be materialized into ClickHouse. Must be `table` to create a table model.                                                                                                                                   | Required                                                                             |
| `unique_key`             | A tuple of column names that uniquely identify rows. For more details on uniqueness constraints, see [here](https://docs.getdbt.com/docs/build/incremental-models#defining-a-uniqueness-constraint-optional).                  | Required. If not provided altered rows will be added twice to the incremental table. |
| `engine`                 | The table engine to use when creating tables. See list of supported engines below.                                                                                                                                             | Optional (default: `MergeTree()`)                                                    |
| `order_by`               | A tuple of column names or arbitrary expressions. This allows you to create a small sparse index that helps find data faster.                                                                                                  | Optional (default: `tuple()`)                                                        |
| `partition_by`           | A partition is a logical combination of records in a table by a specified criterion. The partition key can be any expression from the table columns.                                                                           | Optional                                                                             |
| `inserts_only`           | (Deprecated, see the `append` materialization strategy).  If True, incremental updates will be inserted directly to the target incremental table without creating an intermediate table.                                       | Optional (default: `False`)                                                          |
| `incremental_strategy`   | The strategy to use for incremental materialization.  `delete+insert` and `append` are supported.  For additional details on strategies, see [here](https://github.com/ClickHouse/dbt-clickhouse#incremental-model-strategies) | Optional (default: 'default')                                                        |
| `incremental_predicates` | Incremental predicate clause to be applied to `delete+insert` materializations                                                                                                                                                 | Optional                                                                             |

## Snapshot

dbt snapshots allow a record to be made of changes to a mutable model over time. This in turn allows point-in-time queries on models, where analysts can “look back in time” at the previous state of a model. This functionality is supported by the ClickHouse connector and is configured using the following syntax:

<File name='snapshots/<model_name>.sql'>

```jinja
{{
   config(
     target_schema = "<schema_name>",
     unique_key = "<column-name>",
     strategy = "<strategy>",
     updated_at = "<unpdated_at_column-name>",
   )
}}
```

</File>

#### Snapshot Configuration

| Option          | Description                                                                                                               | Required?                                                                            |
|-----------------|---------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------|
| `target_schema` | A ClickHouse's database name where the snapshot table will be created.                                                    | Required                                                                             |
| `unique_key`    | A tuple of column names that uniquely identify rows.                                                                      | Required. If not provided altered rows will be added twice to the incremental table. |
| `strategy`      | Defines how dbt knows if a row has changed. More about dbt startegies [here](/docs/build/snapshots#detecting-row-changes) | Required                                                                             |
| `updated_at`    | If using the timestamp strategy, the timestamp column to compare.                                                         | Only if using the timestamp strategy                                                 |

## Supported Table Engines

| Type                   | Details                                                                                   |
|------------------------|-------------------------------------------------------------------------------------------|
| MergeTree (default)    | https://clickhouse.com/docs/en/engines/table-engines/mergetree-family/mergetree/.         |
| HDFS                   | https://clickhouse.com/docs/en/engines/table-engines/integrations/hdfs                    |
| MaterializedPostgreSQL | https://clickhouse.com/docs/en/engines/table-engines/integrations/materialized-postgresql |
| S3                     | https://clickhouse.com/docs/en/engines/table-engines/integrations/s3                      |
| EmbeddedRocksDB        | https://clickhouse.com/docs/en/engines/table-engines/integrations/embedded-rocksdb        |
| Hive                   | https://clickhouse.com/docs/en/engines/table-engines/integrations/hive                    |

If you encounter issues connecting to ClickHouse from dbt with one of the above engines, please report an issue [here](https://github.com/ClickHouse/dbt-clickhouse/issues).

## Cross Database Macro Support

dbt-clickhouse supports most of the cross database macros now included in dbt-core, with the following exceptions:
* The `listagg` SQL function (and therefore the corresponding dbt macro) is not supported by ClickHouse.  You can achieve similar results with the ClickHouse `groupArray` function but in some cases subqueries may be required to achieve the desired ordering.
* The `split_part` SQL function is implemented in ClickHouse using the splitByChar function.  This function requires using a constant string for the "split" delimiter, so the `delimeter` parameter used for this macro will be interpreted as a string, not a column name
* Similarly, the `replace` SQL function in ClickHouse requires constant strings for the `old_chars` and `new_chars` parameters, so those parameters will be interpreted as strings rather than column names when invoking this macro. 

## Setting `quote_columns`

To prevent a warning, make sure to explicitly set a value for `quote_columns` in your `dbt_project.yml`. See the [doc on quote_columns](https://docs.getdbt.com/reference/resource-configs/quote_columns) for more information.

```yaml
seeds:
  +quote_columns: false  #or `true` if you have csv column headers with spaces
```

 
