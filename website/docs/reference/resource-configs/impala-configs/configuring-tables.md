---
title: "Configuring tables"
sidebar_label: "Configuring tables"
description: "Optional table configs specific to the dbt-impala plugin for models materialized as tables."
---

When materializing a model as `table`, you may include several optional configs that are specific to the dbt-impala plugin, in addition to the standard [model configs](/reference/model-configs).

| Option  | Description                                        | Required?               | Example                  |
|---------|----------------------------------------------------|-------------------------|--------------------------|
| partition_by | partition by a column, typically a directory per partition is created | No | partition_by=['name'] |
| sort_by | sort by a column  | No | sort_by=['age'] |
| row_format | format to be used when storing individual arows | No | row_format='delimited' |
| stored_as | underlying storage format of the table | No | stored_as='PARQUET' |
| location | storage location, typically an hdfs path | No | LOCATION='/user/etl/destination' |
| comment | comment for the table | No | comment='this is the cleanest model' |
| serde_properties | SerDes ([de-]serialization) properties of table | No | serde_properties="('quoteChar'='\'', 'escapeChar'='\\')" |
| tbl_properties | any metadata can be stored as key/value pair with the table | No | tbl_properties="('dbt_test'='1')" |
| is_cached | true or false - if this table is cached | No | is_cached=false (default) |
| cache_pool | cache pool name to use if is_cached is set to true | No |  |
| replication_factor | cache replication factor to use if is_cached is set to true  | No | |  
| external | is this an external table - true / false | No | external=true |
| table_type | indicates the type of the table - iceberg / kudu | No | table_type="iceberg" |

For Cloudera specific options for above parameters see documentation of CREATE TABLE (https://docs.cloudera.com/documentation/enterprise/6/6.3/topics/impala_create_table.html)
