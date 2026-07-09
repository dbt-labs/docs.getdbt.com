---
title: "File format configuration"
sidebar_label: "File format configuration"
description: "Configure file formats and partitioning for Hive and Iceberg connectors in dbt-watsonx-presto models."
---

File-based connectors, such as Hive and Iceberg, allow customization of table materialization, data formats, and partitioning strategies in dbt models. The following examples demonstrate how to configure these options for each connector.

### Hive Configuration

Hive supports specifying file formats and partitioning strategies using the properties parameter in dbt models. The example below demonstrates how to create a partitioned table stored in Parquet format:

```sql
{{
  config(
    materialized='table',
    properties={
      "format": "'PARQUET'", -- Specifies the file format
      "partitioned_by": "ARRAY['id']", -- Defines the partitioning column(s)
    }
  )
}}
```

For more details about Hive table creation and supported properties, refer to the [Hive connector documentation](https://prestodb.io/docs/current/connector/hive.html#create-a-managed-table).

### Iceberg Configuration

Iceberg supports defining file formats and advanced partitioning strategies to optimize query performance. The following example demonstrates how to create a ORC table partitioned using a bucketing strategy:

```sql
{{
  config(
    materialized='table',
    properties={
      "format": "'ORC'", -- Specifies the file format
      "partitioning": "ARRAY['bucket(id, 2)']", -- Defines the partitioning strategy
    }
  )
}}
```
For more information about Iceberg table creation and supported configurations, refer to the [Iceberg connector documentation](https://prestodb.io/docs/current/connector/iceberg.html#create-table).
