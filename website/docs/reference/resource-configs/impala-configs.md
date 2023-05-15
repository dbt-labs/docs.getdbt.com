---
title: "Apache Impala configurations"
description: "Impala Configs - Read this in-depth guide to learn about configurations in dbt."
id: "impala-configs"
---

## Configuring tables

When materializing a model as `table`, you may include several optional configs that are specific to the dbt-impala plugin, in addition to the standard [model configs](/reference/model-configs).

| Option  | Description                                        | Required?               | Example                  |
|---------|----------------------------------------------------|-------------------------|--------------------------|
| partition_by | partition by a column, typically a directory per partition is created | No | partition_by=['name'] |
| sort_by | sort by a column  | No | sort_by=['age'] |
| row_format | format to be used when storing individual arows | No | row_format='delimited' |
| stored_as | underlying storage format of the table | No | stored_as='PARQUET' |
| location | storage location, typically an hdfs path | No | LOCATION='/user/etl/destination' |
| comment | comment for the table | No | comment='this is the cleanest model' |
| serde_properties | SerDes ([de-]serialization) prperties of table | No | serde_properties="('quoteChar'='\'', 'escapeChar'='\\')" |
| tbl_properties | any metadata can be stored as key/value pair with the table | No | tbl_properties="('dbt_test'='1')" |
| is_cached | true or false - if this table is cached | No | is_cached=false (default) |
| cache_pool | cache pool name to use if is_cached is set to true | No |  |
| replication_factor | cache replication factor to use if is_cached is set to true  | No | |  
| external | is this an external table - true / false | No | external=true |

For Cloudera specific options for above parameters see documentation of CREATE TABLE (https://docs.cloudera.com/documentation/enterprise/6/6.3/topics/impala_create_table.html)

## Incremental models

Supported modes for incremental model:
 - **`append`** (default): Insert new records without updating or overwriting any existing data.
 - **`insert_overwrite`**: For new records, insert data. When used along with partition clause, update data for changed record and insert data for new records. 


Unsupported modes:
 - **`unique_key`** This is not suppored option for incremental models in dbt-impala
 - **`merge`**: Merge is not supported by the underlying warehouse, and hence not supported by dbt-impala

## Example: Using partition_by config option

<File name='impala_partition_by.sql'>

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

In the above example, a sample table is created with partition_by and other config options. One thing to note when using partition_by option is that the select query should always have the column name used in partition_by option as the last one, as can be seen for the ```city``` column name used in the above query. If the partition_by clause is not the same as the last column in select statement, Impala will flag an error when trying to create the model.
