---
title: "Example: using partition_by config option"
sidebar_label: "partition_by example"
description: "An example model showing how to use the partition_by config option with Impala, including the column ordering requirement."
---

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
