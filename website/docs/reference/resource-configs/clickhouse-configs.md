---
title: "ClickHouse configurations"
description: "Read this guide to understand ClickHouse configurations in dbt."
id: "clickhouse-configs"
---

## ClickHouse configurations

### View materialization

A dbt model can be created as a [ClickHouse view](https://clickhouse.com/docs/en/sql-reference/table-functions/view/)
and configured using the following syntax:

<Tabs
groupId="config-view"
defaultValue="project-yaml"
values={[
{ label: 'Project YAML file', value: 'project-yaml', },
{ label: 'SQL file config', value: 'config', },
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

### Table materialization

A dbt model can be created as a [ClickHouse table](https://clickhouse.com/docs/en/operations/system-tables/tables/) and
configured using the following syntax:

<Tabs
groupId="config-table"
defaultValue="project-yaml"
values={[
{ label: 'Project YAML file', value: 'project-yaml', },
{ label: 'SQL file config', value: 'config', },
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

#### Table configuration

| Option         | Description                                                                                                                                          | Required?                         |
|----------------|------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------|
| `materialized` | How the model will be materialized into ClickHouse. Must be `table` to create a table model.                                                         | Required                          |
| `engine`       | The table engine to use when creating tables. See list of supported engines below.                                                                   | Optional (default: `MergeTree()`) |
| `order_by`     | A tuple of column names or arbitrary expressions. This allows you to create a small sparse index that helps find data faster.                        | Optional (default: `tuple()`)     |
| `partition_by` | A partition is a logical combination of records in a table by a specified criterion. The partition key can be any expression from the table columns. | Optional                          |

For the complete list of configuration options, see the [ClickHouse documentation](https://clickhouse.com/docs/integrations/dbt).

### Incremental materialization

Table model will be reconstructed for each dbt execution. This may be infeasible and extremely costly for larger result
sets or complex transformations. To address this challenge and reduce the build time, a dbt model can be created as an
incremental ClickHouse table and is configured using the following syntax:

<Tabs
groupId="config-incremental"
defaultValue="project-yaml"
values={[
{ label: 'Project file', value: 'project-yaml', },
{ label: 'SQL file config', value: 'config', },
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

#### Incremental table configuration

| Option                   | Description                                                                                                                                                                                                                                                       | Required?                                                                            |
|--------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------|
| `materialized`           | How the model will be materialized into ClickHouse. Must be `table` to create a table model.                                                                                                                                                                      | Required                                                                             |
| `unique_key`             | A tuple of column names that uniquely identify rows. For more details on uniqueness constraints, see [here](/docs/build/incremental-models#defining-a-unique-key-optional).                                                                                       | Required. If not provided altered rows will be added twice to the incremental table. |
| `engine`                 | The table engine to use when creating tables. See list of supported engines below.                                                                                                                                                                                | Optional (default: `MergeTree()`)                                                    |
| `order_by`               | A tuple of column names or arbitrary expressions. This allows you to create a small sparse index that helps find data faster.                                                                                                                                     | Optional (default: `tuple()`)                                                        |
| `partition_by`           | A partition is a logical combination of records in a table by a specified criterion. The partition key can be any expression from the table columns.                                                                                                              | Optional                                                                             |
| `inserts_only`           | (Deprecated, see the `append` materialization strategy).  If True, incremental updates will be inserted directly to the target incremental table without creating an intermediate table.                                                                          | Optional (default: `False`)                                                          |
| `incremental_strategy`   | The strategy to use for incremental materialization.  `delete+insert`, `append` and `insert_overwrite` (experimental) are supported.  For additional details on strategies, see [here](https://github.com/ClickHouse/dbt-clickhouse#incremental-model-strategies) | Optional (default: 'default')                                                        |
| `incremental_predicates` | Incremental predicate clause to be applied to `delete+insert` materializations                                                                                                                                                                                    | Optional                                                                             |

For the complete list of configuration options, see the [ClickHouse documentation](https://clickhouse.com/docs/integrations/dbt).

## Snapshot

dbt snapshots allow a record to be made of changes to a mutable model over time. This in turn allows point-in-time
queries on models, where analysts can “look back in time” at the previous state of a model. This functionality is
supported by the ClickHouse connector and is configured using the following syntax:


<VersionBlock firstVersion="1.9">

<File name='snapshots/<model_name>.sql'>

```jinja
{{
   config(
     schema = "<schema-name>",
     unique_key = "<column-name>",
     strategy = "<strategy>",
     updated_at = "<updated-at-column-name>",
   )
}}
```

</File>

</VersionBlock>

For more information on configuration, check out the [snapshot configs](/reference/snapshot-configs) reference page.

## Learn more

The `dbt-clickhouse` adapter supports most dbt-native features like tests, snapshots, helper macros, and more. For a complete overview of supported features and best practices, see the [ClickHouse documentation](https://clickhouse.com/docs/integrations/dbt).

