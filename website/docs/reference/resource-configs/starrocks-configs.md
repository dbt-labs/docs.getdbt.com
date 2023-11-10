---
title: "Starrocks configurations"
id: "starrocks-configs"
description: "Starrocks Configurations - Read this in-depth guide to learn about configurations in dbt."
---

## Model Configuration

A dbt model can be configured using the following syntax:

<Tabs
  groupId="config-fact"
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
  <resource-path>:
    materialized: table       // table or view or materialized_view
    keys: ['id', 'name', 'some_date']
    table_type: 'PRIMARY'     // PRIMARY or DUPLICATE or UNIQUE
    distributed_by: ['id']
    buckets: 3                // default 10
    partition_by: ['some_date']
    partition_by_init: ["PARTITION p1 VALUES [('1971-01-01 00:00:00'), ('1991-01-01 00:00:00')),PARTITION p1972 VALUES [('1991-01-01 00:00:00'), ('1999-01-01 00:00:00'))"]
    properties: [{"replication_num":"1", "in_memory": "true"}]
    refresh_method: 'async' // only for materialized view default manual
```

</File>
</TabItem>

<TabItem value="property-yaml">
<File name='models/properties.yml'>

```yaml
models:
  - name: <model-name>
    config:
      materialized: table       // table or view or materialized_view
      keys: ['id', 'name', 'some_date']
      table_type: 'PRIMARY'     // PRIMARY or DUPLICATE or UNIQUE
      distributed_by: ['id']
      buckets: 3                // default 10
      partition_by: ['some_date']
      partition_by_init: ["PARTITION p1 VALUES [('1971-01-01 00:00:00'), ('1991-01-01 00:00:00')),PARTITION p1972 VALUES [('1991-01-01 00:00:00'), ('1999-01-01 00:00:00'))"]
      properties: [{"replication_num":"1", "in_memory": "true"}]
      refresh_method: 'async' // only for materialized view default manual
```

</File>
</TabItem>

<TabItem value="config">
<File name='models/<model_name>.sql'>

```jinja
{{ config(
    materialized = 'table',
    keys=['id', 'name', 'some_date'],
    table_type='PRIMARY',
    distributed_by=['id'],
    buckets=3,
    partition_by=['some_date'],
    ....
) }}
```
</File>
</TabItem>
</Tabs>

### Configuration Description

| Option              | Description                                                                                                                                                                                  |
|---------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `materialized`      | How the model will be materialized into Starrocks. Supports view, table, incremental, ephemeral, and materialized_view.                                                                      |
| `keys`              | Which columns serve as keys.                                                                                                                                                                 |
| `table_type`        | Table type, supported are PRIMARY or DUPLICATE or UNIQUE.                                                                                                                                    |
| `distributed_by`    | Specifies the column of data distribution. If not specified, it defaults to random.                                                                                                          |
| `buckets`           | The bucket number in one partition. If not specified, it will be automatically inferred.                                                                                                     |
| `partition_by`      | The partition column list.                                                                                                                                                                   |
| `partition_by_init` | The partition rule or some real partitions item.                                                                                                                                             |
| `properties`        | The table properties configuration of Starrocks. ([Starrocks table properties](https://docs.starrocks.io/en-us/latest/sql-reference/sql-statements/data-definition/CREATE_TABLE#properties)) |
| `refresh_method`    | How to refresh materialized views.                                                                                                                                                           |

## Read From Catalog
First you need to add this catalog to starrocks. The following is an example of hive.

```sql
CREATE EXTERNAL CATALOG `hive_catalog`
PROPERTIES (
    "hive.metastore.uris"  =  "thrift://127.0.0.1:8087",
    "type"="hive"
);
```
How to add other types of catalogs can be found in the documentation. [Catalog Overview](https://docs.starrocks.io/en-us/latest/data_source/catalog/catalog_overview) Then write the sources.yaml file.
```yaml
sources:
  - name: external_example
    schema: hive_catalog.hive_db
    tables:
      - name: hive_table_name
```
Finally, you might use below marco quote
```jinja
{{ source('external_example', 'hive_table_name') }}
```