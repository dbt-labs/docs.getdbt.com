---
title: "Greenplum configurations"
description: "Greenplum Configurations - Read this in-depth guide to learn about configurations in dbt."
id: "greenplum-configs"
---

## Performance Optimizations
    
Tables in Greenplum have powerful optimization configurations to improve query performance:
 
 - distribution
 - column orientation
 - compression
 - `appendonly` toggle
 - partitions
 
Supplying these values as model-level configurations apply the corresponding settings in the generated `CREATE TABLE`(except partitions). Note that these settings will have no effect for models set to `view`.

### Distribution

In Greenplum, you can choose a [distribution key](https://gpdb.docs.pivotal.io/6-4/admin_guide/distribution.html), that will be used to sort data by segments. Joining on the partition will become more performant after specifying distribution.

By default dbt-greenplum distributes data `RANDOMLY`. To implement a distribution key you need to specify the `distributed_by` parameter in model's config:

```sql
{{
    config(
        ...
        distributed_by='<field_name>'
        ...
    )
}}


select ...
```

Also you can choose `DISTRIBUTED REPLICATED` option:

```sql
{{
    config(
        ...
        distributed_replicated=true
        ...
    )
}}


select ...
```

### Column orientation

Greenpum supports two type of [orientation](https://gpdb.docs.pivotal.io/6-6/admin_guide/ddl/ddl-storage.html#topic39) row and column:

```sql
{{
    config(
        ...
        orientation='column'
        ...
    )
}}


select ...
```

### Compression

Compression allows reducing read-write time. Greenplum suggest several [algorithms](https://gpdb.docs.pivotal.io/6-6/admin_guide/ddl/ddl-storage.html#topic40) algotihms to compress append-optimized tables:
 - RLE_TYPE(only for column oriented table)
 - ZLIB
 - ZSTD 
 - QUICKLZ

```sql
{{
    config(
        ...
        appendonly='true',
        compresstype='ZLIB',
        compresslevel=3,
        blocksize=32768
        ...
    )
}}


select ...
```

As you can see, you can also specify `compresslevel` and `blocksize`.

### Partition

Greenplum does not support partitions with `create table as` [construction](https://gpdb.docs.pivotal.io/6-9/ref_guide/sql_commands/CREATE_TABLE_AS.html), so you need to build model in two steps
    
1. create table schema
2. insert data

To implement partitions into your dbt-model you need to specify the following config parameters:
 - `fields_string` - definition of columns name, type and constraints
 - `raw_partition` - partition specification 

```sql
{% set fields_string %}
    some_filed int4 null,
    date_field timestamp NULL
{% endset %}


{% set raw_partition %}
   PARTITION BY RANGE (date_field)
   (
       START ('2021-01-01'::timestamp) INCLUSIVE
       END ('2023-01-01'::timestamp) EXCLUSIVE
       EVERY (INTERVAL '1 day'),
       DEFAULT PARTITION default_part
   );
{% endset %}

{{
   config(
       ...
       fields_string=fields_string,
       raw_partition=raw_partition,
       ...
   )
}}

select *
```
