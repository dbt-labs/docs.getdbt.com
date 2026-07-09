---
title: "Partitioning"
sidebar_label: "Partitioning"
description: "Add a partitioning clause to table and incremental materializations in Oracle."
---

<VersionBlock firstVersion="1.3.2">

Table and Incremental materialization configuration supports adding a partitioning clause:

```sql
{
    config(
        materialized='incremental',
        unique_key='group_id',
        parallel=4,
        partition_config={"clause": "PARTITION BY HASH(PROD_NAME) PARTITIONS 4"},
        table_compression_clause='COLUMN STORE COMPRESS FOR QUERY LOW')
}}
SELECT *
FROM {{ source('sh_database', 'sales') }}
```

</VersionBlock>
