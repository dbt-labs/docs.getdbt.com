---
title: "Target options"
sidebar_label: "Target options"
description: "Reference of Upsolver target options in dbt for data lake, materialized view, and Snowflake targets."
---

| Option | Storage   | Editable | Optional | Config Syntax |
| -------| --------- | -------- | -------- | ------------- |
| globally_unique_keys | datalake | False | True | 'globally_unique_keys': True/False |
| storage_connection | datalake | False | True | 'storage_connection': `'<storage_connection>'` |
| storage_location | datalake | False | True | 'storage_location': `'<storage_location>'` |
| compute_cluster | datalake | True | True | 'compute_cluster': `'<compute_cluster>'` |
| compression | datalake | True | True | 'compression': 'SNAPPY/GZIP' |
| compaction_processes | datalake | True | True | 'compaction_processes': `<integer>` |
| disable_compaction | datalake | True | True | 'disable_compaction': True/False |
| retention_date_partition | datalake | False | True | 'retention_date_partition': `'<column>'` |
| table_data_retention | datalake | True | True | 'table_data_retention': `'<N DAYS>'` |
| column_data_retention | datalake | True | True | 'column_data_retention': (\{'COLUMN' : `'<column>'`,'DURATION': `'<N DAYS>'`\}) |
| comment | datalake | True | True | 'comment': `'<comment>'` |
| storage_connection | materialized_view | False | True | 'storage_connection': `'<storage_connection>'` |
| storage_location | materialized_view | False | True | 'storage_location': `'<storage_location>'` |
| max_time_travel_duration | materialized_view | True | True | 'max_time_travel_duration': `'<N DAYS>'` |
| compute_cluster | materialized_view | True | True | 'compute_cluster': `'<compute_cluster>'` |
| column_transformations | snowflake | False | True | 'column_transformations': \{`'<column>'` : `'<expression>'` , ...\} |
| deduplicate_with | snowflake | False | True | 'deduplicate_with': \{'COLUMNS' : ['col1', 'col2'],'WINDOW': 'N HOURS'\} |
| exclude_columns | snowflake | False | True | 'exclude_columns': (`'<exclude_column>'`, ...) |
| create_table_if_missing | snowflake | False | True | 'create_table_if_missing': True/False} |
| run_interval | snowflake | False | True | 'run_interval': `'<N MINUTES/HOURS/DAYS>'` |
