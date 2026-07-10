---
title: "File format configuration"
sidebar_label: "File format configuration"
description: "Customize the file format and materialization for file-based Trino connectors such as Hive, including partitioned Parquet tables."
---

When using file-based connectors such as Hive, a user can customize aspects of the connector such as the format that is used as well the type of materialization

The below configures the table to be materializes as a set of partitioned [Parquet](https://spark.apache.org/docs/latest/sql-data-sources-parquet.html) files.

```sql
{{
  config(
    materialized='table',
    properties= {
      "format": "'PARQUET'",
      "partitioning": "ARRAY['bucket(id, 2)']",
    }
  )
}}
```
