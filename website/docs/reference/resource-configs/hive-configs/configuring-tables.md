---
title: "Configuring tables"
sidebar_label: "Tables"
description: "Review the optional configs specific to the dbt-hive plugin when materializing a model as a table."
---

When materializing a model as `table`, you may include several optional configs that are specific to the dbt-hive plugin, in addition to the standard [model configs](/reference/model-configs).

| Option  | Description                                        | Required?               | Example                  |
|---------|----------------------------------------------------|-------------------------|--------------------------|
| partition_by | partition by a column, typically a directory per partition is created | No | partition_by=['name'] |
| clustered_by | second level division of a partitioned column  | No | clustered_by=['age'] |
| file_format | underlying storage format of the table, see https://cwiki.apache.org/confluence/display/Hive/FileFormats for supported formats | No | file_format='PARQUET' |
| location | storage location, typically an hdfs path | No | LOCATION='/user/etl/destination' |
| comment | comment for the table | No | comment='this is the cleanest model' |
| external | is this an external table - true / false | No | external=true |
| tbl_properties | any metadata can be stored as key/value pair with the table | No | tbl_properties="('dbt_test'='1')" |
| table_type | indicates the type of the table | No | table_type="iceberg" |
