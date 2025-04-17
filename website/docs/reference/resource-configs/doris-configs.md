---
title: "Doris/SelectDB configurations"
description: "Doris/SelectDB Configurations - Read this in-depth guide to learn about configurations in dbt."
id: "doris-configs"
---

## Models

| Type                        | Supported? | Details                                                                                                                                             |
|-----------------------------|------------|-----------------------------------------------------------------------------------------------------------------------------------------------------|
| view materialization        | YES        | Creates a [view](https://doris.apache.org/docs/sql-manual/sql-reference/Data-Definition-Statements/Create/CREATE-VIEW/).                            |
| table materialization       | YES        | Creates a [table](https://doris.apache.org/docs/sql-manual/sql-reference/Data-Definition-Statements/Create/CREATE-TABLE/).                          |
| incremental materialization | YES        | Creates a table if it doesn't exist, and then item table model must be '[unique](https://doris.apache.org/docs/data-table/data-model#uniq-model/)'. |

### View Materialization

A dbt model can be created as a Doris view and configured using the following syntax:

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

A dbt model can be created as a [Doris table](https://doris.apache.org/docs/sql-manual/sql-reference/Data-Definition-Statements/Create/CREATE-TABLE/) and configured using the following syntax:

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
    +duplicate_key: [ <column-name>, ... ],
    +partition_by: [ <column-name>, ... ],
    +partition_type: <engine-type>,
    +partition_by_init: [<pertition-init>, ... ]
    +distributed_by: [ <column-name>, ... ],
    +buckets: int,
    +properties: {<key>:<value>,...}
```

</File>
</TabItem>

<TabItem value="config">
<File name='models/<model_name>.sql'>

```jinja
{{ config(
    materialized = "table",
    duplicate_key = [ "<column-name>", ... ],
    partition_by = [ "<column-name>", ... ],
    partition_type = "<engine-type>",
    partition_by_init = ["<pertition-init>", ... ]
    distributed_by = [ "<column-name>", ... ],
    buckets = "int",
    properties = {"<key>":"<value>",...}
      ...
    ]
) }}
```

</File>
</TabItem>
</Tabs>

#### Table Configuration

| Option              | Description                                                                                                                                                                           | Required?                   |
|---------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------|
| `materialized`      | How the model will be materialized into Doris. Must be `table` to create a table model.                                                                                               | Required                    |
| `duplicate_key`     | The key list of Doris table model :'[duplicate](https://doris.apache.org/docs/data-table/data-model#duplicate-model)'.                                                                | Required                    |
| `partition_by`      | The partition key list of Doris. ([Doris partition](https://doris.apache.org/docs/data-table/data-partition))                                                                         | Optional                    |
| `partition_type`    | The partition type of Doris.                                                                                                                                                          | Optional (default: `RANGE`) |
| `partition_by_init` | The partition rule or some real partitions item.                                                                                                                                      | Optional                    |
| `distributed_by`    | The bucket key list of Doris.  ([Doris distribute](https://doris.apache.org/docs/data-table/data-partition#partitioning-and-bucket))                                                  | Required                    |
| `buckets`           | The bucket number in one Doris partition.                                                                                                                                             | Required                    |
| `properties`        | The other configuration of Doris. ([Doris properties](https://doris.apache.org/docs/sql-manual/sql-reference/Data-Definition-Statements/Create/CREATE-TABLE/?&_highlight=properties)) | Required                    |

### Incremental Materialization

An incremental Doris table, item table model must be 'unique' and is configured using the following syntax:

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
    +unique_key: [ <column-name>, ... ],
    +partition_by: [ <column-name>, ... ],
    +partition_type: <engine-type>,
    +partition_by_init: [<pertition-init>, ... ]
    +distributed_by: [ <column-name>, ... ],
    +buckets: int,
    +properties: {<key>:<value>,...}
```

</File>
</TabItem>

<TabItem value="config">
<File name='models/<model_name>.sql'>

```jinja
{{ config(
    materialized = "incremental",
    unique_key = [ "<column-name>", ... ],
    partition_by = [ "<column-name>", ... ],
    partition_type = "<engine-type>",
    partition_by_init = ["<pertition-init>", ... ]
    distributed_by = [ "<column-name>", ... ],
    buckets = "int",
    properties = {"<key>":"<value>",...}
      ...
    ]
) }}
```

</File>
</TabItem>
</Tabs>

#### Incremental Table Configuration

| Option              | Description                                                                                                                                                                           | Required?                   |
|---------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------|
| `materialized`      | How the model will be materialized into Doris. Must be `table` to create a table model.                                                                                               | Required                    |
| `unique_key`        | The key list of Doris table model :'[Doris unique](https://doris.apache.org/docs/data-table/data-model#uniq-model)'.                                                                  | Required                    |
| `partition_by`      | The partition key list of Doris. ([Doris partition](https://doris.apache.org/docs/data-table/data-partition))                                                                         | Optional                    |
| `partition_type`    | The partition type of Doris.                                                                                                                                                          | Optional (default: `RANGE`) |
| `partition_by_init` | The partition rule or some real partitions item.                                                                                                                                      | Optional                    |
| `distributed_by`    | The bucket key list of Doris.  ([Doris distribute](https://doris.apache.org/docs/data-table/data-partition#partitioning-and-bucket))                                                  | Required                    |
| `buckets`           | The bucket number in one Doris partition.                                                                                                                                             | Required                    |
| `properties`        | The other configuration of Doris. ([Doris properties](https://doris.apache.org/docs/sql-manual/sql-reference/Data-Definition-Statements/Create/CREATE-TABLE/?&_highlight=properties)) | Required                    |

 

