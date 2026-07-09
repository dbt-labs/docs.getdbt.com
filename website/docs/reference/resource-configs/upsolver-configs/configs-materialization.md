---
title: "Materialization configs"
sidebar_label: "Materialization configs"
description: "Reference of Upsolver materialization configs in dbt for connection and incremental models."
---

| Config | Required | Materialization | Description | Example |
| ------ | --------- | --------------- | ---------- | ------- |
| connection_type | Yes | connection | Connection identifier: S3/GLUE_CATALOG/KINESIS | connection_type='S3' |
| connection_options | Yes | connection | Dictionary of options supported by selected connection |           connection_options=\{ 'aws_role': 'aws_role', 'external_id': 'SAMPLES', 'read_only': True \} |
| incremental_strategy | No | incremental | Define one of incremental strategies: merge/copy/insert. Default: copy | incremental_strategy='merge' |
| source | No | incremental | Define source to copy from: S3/KAFKA/KINESIS | source = 'S3' |
| target_type | No | incremental | Define target type REDSHIFT/ELASTICSEARCH/S3/SNOWFLAKE/POSTGRES. Default None for Data lake | target_type='Snowflake' |
| target_prefix | False | incremental | Define PREFIX for ELASTICSEARCH target type | target_prefix = 'orders' |
| target_location | False | incremental | Define LOCATION for S3 target type | target_location = 's3://your-bucket-name/path/to/folder/' |
| schema | Yes/No | incremental | Define target schema. Required if target_type, no table created in a metastore connection | schema = 'target_schema' |
| database | Yes/No | incremental | Define target connection. Required if target_type, no table created in a metastore connection | database = 'target_connection' |
| alias | Yes/No | incremental | Define target table. Required if target_type, no table created in a metastore connection | alias = 'target_table' |
| delete_condition | No | incremental | Records that match the ON condition and a delete condition can be deleted | delete_condition='nettotal > 1000' |
| partition_by | No | incremental | List of dictionaries to define partition_by for target metastore table | partition_by=[\{'field':'$field_name'\}] |
| primary_key | No | incremental | List of dictionaries to define partition_by for target metastore table  | primary_key=[\{'field':'customer_email', 'type':'string'\}] |
| map_columns_by_name | No | incremental | Maps columns from the SELECT statement to the table. Boolean. Default: False | map_columns_by_name=True |
| sync | No | incremental/materializedview | Boolean option to define if job is synchronized or non-msynchronized. Default: False | sync=True |
| options | No | incremental/materializedview | Dictionary of job options | options=\{ 'START_FROM': 'BEGINNING', 'ADD_MISSING_COLUMNS': True \} |
