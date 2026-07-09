---
title: "Configuring tables"
sidebar_label: "Configuring tables"
description: "Optional table configs for the dbt-spark plugin, including file_format, location_root, partition_by, clustered_by, and tblproperties."
---

When materializing a model as `table`, you may include several optional configs that are specific to the dbt-spark plugin, in addition to the standard [model configs](/reference/model-configs).

| Option  | Description          | Required?        | <div style={{width:'350px'}}>Example</div>       |
|---------|----------------------|------------------|--------------------------------------------------|
| file_format | The file format to use when creating tables (`parquet`, `delta`, `csv`). | Optional | `delta`|
| location_root [^1]  | The specified directory used to store table data. The table alias is appended to it.                               | Optional                | `Files/<folder>` or `Tables/<tableName>`              |
| partition_by  | Partition the table by the specified columns. A directory is created for each partition.                                   | Optional                | `date_day`              |
| clustered_by  | Each partition in the table will be split into a fixed number of buckets by the specified columns.                         | Optional               | `country_code`              |
| buckets  | The number of buckets to create while clustering                                                                                   | Required if `clustered_by` is specified                | `8`              |
| tblproperties | The table properties configure table behavior. Properties differ depending on the file format, see reference docs ([Parquet](https://spark.apache.org/docs/3.5.4/sql-data-sources-parquet.html#data-source-option), [Delta](https://docs.delta.io/latest/table-properties.html)). | Optional |<code>Provider=delta Location=abfss://.../Files/tables/sales_data TableProperty.created.by=data_engineering_team TableProperty.purpose=sales analytics CreatedBy=Delta Lake CreatedAt=2024-12-01 14:21:00 Format=Parquet PartitionColumns=region MinReaderVersion=1 MinWriterVersion=2</code> |

[^1]: If you configure `location_root`, dbt specifies a location path in the `create table` statement. This changes the table from "managed" to "external" in Fabric Lakehouse.
