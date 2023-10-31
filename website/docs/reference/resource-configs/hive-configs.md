---
title: "Apache Hive configurations"
description: "Apache Hive Configurations - Read this in-depth guide to learn about configurations in dbt."
id: "hive-configs"
---

## Configuring tables

When materializing a model as `table`, you may include several optional configs that are specific to the dbt-hive plugin, in addition to the standard [model configs](/reference/model-configs).

| Option  | Description                                        | Required?               | Example                  |
|---------|----------------------------------------------------|-------------------------|--------------------------|
| partition_by | partition by a column, typically a directory per partition is created | No | partition_by=['name'] |
| clustered_by | second level division of a partitioned column  | No | clustered_by=['age'] |
| file_format | underlying storage format of the table, see https://cwiki.apache.org/confluence/display/Hive/FileFormats for supported formats | No | file_format='PARQUET' |
| location | storage location, typically an hdfs path | No | LOCATION='/user/etl/destination' |
| comment | comment for the table | No | comment='this is the cleanest model' |

## Incremental models

Supported modes for incremental model:
 - **`append`** (default): Insert new records without updating or overwriting any existing data.
 - **`insert_overwrite`**: For new records, insert data. When used along with partition clause, update data for changed record and insert data for new records. 

## Example: Using partition_by config option

<File name='hive_partition_by.sql'>

```sql
{{
    config(
        materialized='table',
        unique_key='id',
        partition_by=['city'],
    )
}}

with source_data as (
     select 1 as id, "Name 1" as name, "City 1" as city,
     union all
     select 2 as id, "Name 2" as name, "City 2" as city,
     union all
     select 3 as id, "Name 3" as name, "City 2" as city,
     union all
     select 4 as id, "Name 4" as name, "City 1" as city,
)

select * from source_data
```

</File>

In the above example, a sample table is created with partition_by and other config options. One thing to note when using partition_by option is that the select query should always have the column name used in partition_by option as the last one, as can be seen for the ```city``` column name used in the above query. If the partition_by clause is not the same as the last column in select statement, Hive will flag an error when trying to create the model.
