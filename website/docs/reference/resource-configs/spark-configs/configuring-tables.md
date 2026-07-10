---
title: "Configuring tables"
sidebar_label: "Configuring tables"
description: "Optional table configs specific to the dbt-spark plugin for models materialized as tables."
---

When materializing a model as `table`, you may include several optional configs that are specific to the dbt-spark plugin, in addition to the standard [model configs](/reference/model-configs).

| Option  | Description          | Required?        | <div style={{width:'350px'}}>Example</div>       |
|---------|----------------------|------------------|--------------------------------------------------|
| file_format | The file format to use when creating tables (`parquet`, `delta`, `iceberg`, `hudi`, `csv`, `json`, `text`, `jdbc`, `orc`, `hive` or `libsvm`). | Optional | `parquet`|
| location_root [^1]  | The created table uses the specified directory to store its data. The table alias is appended to it.                               | Optional                | `/mnt/root`              |
| partition_by  | Partition the created table by the specified columns. A directory is created for each partition.                                   | Optional                | `date_day`              |
| clustered_by  | Each partition in the created table will be split into a fixed number of buckets by the specified columns.                         | Optional               | `country_code`              |
| buckets  | The number of buckets to create while clustering                                                                                   | Required if `clustered_by` is specified                | `8`              |
| tblproperties | The table properties configure table behavior. Properties differ depending on the file format, see reference docs ([Iceberg](https://iceberg.apache.org/docs/latest/configuration/#table-properties), [Parquet](https://spark.apache.org/docs/3.5.4/sql-data-sources-parquet.html#data-source-option), [Delta](https://docs.databricks.com/aws/en/delta/table-properties#delta-table-properties), [Hudi](https://hudi.apache.org/docs/sql_ddl/#table-properties)). | Optional |<code># Iceberg Example<br /> tblproperties:<br />   read.split.target-size: 268435456<br />   commit.retry.num-retries: 10</code> |

[^1]: If you configure `location_root`, dbt specifies a location path in the `create table` statement. This changes the table from "managed" to "external" in Spark/Databricks.
