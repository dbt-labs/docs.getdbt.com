---
title: "Transformation options"
sidebar_label: "Transformation options"
description: "Reference of Upsolver transformation job options in dbt for targets like S3, Snowflake, Redshift, and Postgres."
---

| Option | Storage   | Editable | Optional | Config Syntax |
| -------| --------- | -------- | -------- | ------------- |
| run_interval | s3 | False | True | 'run_interval': `'<N MINUTES/HOURS/DAYS>'` |
| start_from | s3 | False | True | 'start_from': `'<timestamp>/NOW/BEGINNING'` |
| end_at | s3 | True | True | 'end_at': `'<timestamp>/NOW'` |
| compute_cluster | s3 | True | True | 'compute_cluster': `'<compute_cluster>'` |
| comment | s3 | True | True | 'comment': `'<comment>'` |
| skip_validations | s3 | False | True | 'skip_validations': ('ALLOW_CARTESIAN_PRODUCT', ...) |
| skip_all_validations | s3 | False | True | 'skip_all_validations': True/False |
| aggregation_parallelism | s3 | True | True | 'aggregation_parallelism': `<integer>` |
| run_parallelism | s3 | True | True | 'run_parallelism': `<integer>` |
| file_format | s3 | False | False | 'file_format': '(type = `<file_format>`)' |
| compression | s3 | False | True | 'compression': 'SNAPPY/GZIP ...' |
| date_pattern | s3 | False | True | 'date_pattern': `'<date_pattern>'` |
| output_offset | s3 | False | True | 'output_offset': `'<N MINUTES/HOURS/DAYS>'` |
| run_interval | elasticsearch | False | True | 'run_interval': `'<N MINUTES/HOURS/DAYS>'` |
| routing_field_name | elasticsearch | True | True | 'routing_field_name': `'<routing_field_name>'` |
| start_from | elasticsearch | False | True | 'start_from': `'<timestamp>/NOW/BEGINNING'` |
| end_at | elasticsearch | True | True | 'end_at': `'<timestamp>/NOW'` |
| compute_cluster | elasticsearch | True | True | 'compute_cluster': `'<compute_cluster>'` |
| skip_validations | elasticsearch | False | True | 'skip_validations': ('ALLOW_CARTESIAN_PRODUCT', ...) |
| skip_all_validations | elasticsearch | False | True | 'skip_all_validations': True/False |
| aggregation_parallelism | elasticsearch | True | True | 'aggregation_parallelism': `<integer>` |
| run_parallelism | elasticsearch | True | True | 'run_parallelism': `<integer>` |
| bulk_max_size_bytes | elasticsearch | True | True | 'bulk_max_size_bytes': `<integer>` |
| index_partition_size | elasticsearch | True | True | 'index_partition_size': 'HOURLY/DAILY ...' |
| comment | elasticsearch | True | True | 'comment': `'<comment>'` |
| custom_insert_expressions | snowflake | True | True | 'custom_insert_expressions': \{'INSERT_TIME' : 'CURRENT_TIMESTAMP()','MY_VALUE': `'<value>'`\} |
| custom_update_expressions | snowflake | True | True | 'custom_update_expressions': \{'UPDATE_TIME' : 'CURRENT_TIMESTAMP()','MY_VALUE': `'<value>'`\} |
| keep_existing_values_when_null | snowflake | True | True | 'keep_existing_values_when_null': True/False |
| add_missing_columns | snowflake | False | True | 'add_missing_columns': True/False |
| run_interval | snowflake | False | True | 'run_interval': `'<N MINUTES/HOURS/DAYS>'` |
| commit_interval | snowflake | True | True | 'commit_interval': `'<N MINUTE[S]/HOUR[S]/DAY[S]>'` |
| start_from | snowflake | False | True | 'start_from': `'<timestamp>/NOW/BEGINNING'` |
| end_at | snowflake | True | True | 'end_at': `'<timestamp>/NOW'` |
| compute_cluster | snowflake | True | True | 'compute_cluster': `'<compute_cluster>'` |
| skip_validations | snowflake | False | True | 'skip_validations': ('ALLOW_CARTESIAN_PRODUCT', ...) |
| skip_all_validations | snowflake | False | True | 'skip_all_validations': True/False |
| aggregation_parallelism | snowflake | True | True | 'aggregation_parallelism': `<integer>` |
| run_parallelism | snowflake | True | True | 'run_parallelism': `<integer>` |
| comment | snowflake | True | True | 'comment': `'<comment>'` |
| add_missing_columns | datalake | False | True | 'add_missing_columns': True/False |
| run_interval | datalake | False | True | 'run_interval': `'<N MINUTES/HOURS/DAYS>'` |
| start_from | datalake | False | True | 'start_from': `'<timestamp>/NOW/BEGINNING'` |
| end_at | datalake | True | True | 'end_at': `'<timestamp>/NOW'` |
| compute_cluster | datalake | True | True | 'compute_cluster': `'<compute_cluster>'` |
| skip_validations | datalake | False | True | 'skip_validations': ('ALLOW_CARTESIAN_PRODUCT', ...) |
| skip_all_validations | datalake | False | True | 'skip_all_validations': True/False |
| aggregation_parallelism | datalake | True | True | 'aggregation_parallelism': `<integer>` |
| run_parallelism | datalake | True | True | 'run_parallelism': `<integer>` |
| comment | datalake | True | True | 'comment': `'<comment>'` |
| run_interval | redshift | False | True | 'run_interval': `'<N MINUTES/HOURS/DAYS>'` |
| start_from | redshift | False | True | 'start_from': `'<timestamp>/NOW/BEGINNING'` |
| end_at | redshift | True | True | 'end_at': `'<timestamp>/NOW'` |
| compute_cluster | redshift | True | True | 'compute_cluster': `'<compute_cluster>'` |
| skip_validations | redshift | False | True | 'skip_validations': ('ALLOW_CARTESIAN_PRODUCT', ...) |
| skip_all_validations | redshift | False | True | 'skip_all_validations': True/False |
| aggregation_parallelism | redshift | True | True | 'aggregation_parallelism': `<integer>` |
| run_parallelism | redshift | True | True | 'run_parallelism': `<integer>` |
| skip_failed_files | redshift | False | True | 'skip_failed_files': True/False |
| fail_on_write_error | redshift | False | True | 'fail_on_write_error': True/False |
| comment | redshift | True | True | 'comment': `'<comment>'` |
| run_interval | postgres | False | True | 'run_interval': `'<N MINUTES/HOURS/DAYS>'` |
| start_from | postgres | False | True | 'start_from': `'<timestamp>/NOW/BEGINNING'` |
| end_at | postgres | True | True | 'end_at': `'<timestamp>/NOW'` |
| compute_cluster | postgres | True | True | 'compute_cluster': `'<compute_cluster>'` |
| skip_validations | postgres | False | True | 'skip_validations': ('ALLOW_CARTESIAN_PRODUCT', ...) |
| skip_all_validations | postgres | False | True | 'skip_all_validations': True/False |
| aggregation_parallelism | postgres | True | True | 'aggregation_parallelism': `<integer>` |
| run_parallelism | postgres | True | True | 'run_parallelism': `<integer>` |
| comment | postgres | True | True | 'comment': `'<comment>'` |
