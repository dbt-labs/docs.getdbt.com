---
title: "Copy options"
sidebar_label: "Copy options"
description: "Reference of Upsolver COPY job options in dbt for sources such as Kafka, S3, Kinesis, MySQL, and Postgres."
---

| Option | Storage    | Category | Editable | Optional | Config Syntax |
| -------| ---------- | -------- | -------- | -------- | ------------- |
| topic | kafka | source_options | False | False | 'topic': `'<topic>'` |
| exclude_columns | kafka | job_options | False | True | 'exclude_columns': (`'<exclude_column>'`, ...) |
| deduplicate_with | kafka | job_options | False | True | 'deduplicate_with': \{'COLUMNS' : ['col1', 'col2'],'WINDOW': 'N HOURS'\} |
| consumer_properties | kafka | job_options | True | True | 'consumer_properties': `'<consumer_properties>'` |
| reader_shards | kafka | job_options | True | True | 'reader_shards': `<integer>` |
| store_raw_data | kafka | job_options | False | True | 'store_raw_data': True/False |
| start_from | kafka | job_options | False | True | 'start_from': 'BEGINNING/NOW' |
| end_at | kafka | job_options | True | True | 'end_at': `'<timestamp>/NOW'` |
| compute_cluster | kafka | job_options | True | True | 'compute_cluster': `'<compute_cluster>'` |
| run_parallelism | kafka | job_options | True | True | 'run_parallelism': `<integer>` |
| content_type | kafka | job_options | True | True | 'content_type': 'AUTO/CSV/...' |
| compression | kafka | job_options | False | True | 'compression': 'AUTO/GZIP/...' |
| column_transformations | kafka | job_options | False | True | 'column_transformations': \{`'<column>'` : `'<expression>'` , ...\} |
| commit_interval | kafka | job_options | True | True | 'commit_interval': `'<N MINUTE[S]/HOUR[S]/DAY[S]>'` |
| skip_validations | kafka | job_options | False | True | 'skip_validations': ('MISSING_TOPIC') |
| skip_all_validations | kafka | job_options | False | True | 'skip_all_validations': True/False |
| comment | kafka | job_options | True | True | 'comment': `'<comment>'` |
| table_include_list | mysql | source_options | True | True | 'table_include_list': (`'<regexFilter>'`, ...) |
| column_exclude_list | mysql | source_options | True | True | 'column_exclude_list': (`'<regexFilter>'`, ...) |
| exclude_columns | mysql | job_options | False | True | 'exclude_columns': (`'<exclude_column>'`, ...) |
| column_transformations | mysql | job_options | False | True | 'column_transformations': \{`'<column>'` : `'<expression>'` , ...\} |
| skip_snapshots | mysql | job_options | True | True | 'skip_snapshots': True/False |
| end_at | mysql | job_options | True | True | 'end_at': `'<timestamp>/NOW'` |
| compute_cluster | mysql | job_options | True | True | 'compute_cluster': `'<compute_cluster>'` |
| snapshot_parallelism | mysql | job_options | True | True | 'snapshot_parallelism': `<integer>` |
| ddl_filters | mysql | job_options | False | True | 'ddl_filters': (`'<filter>'`, ...) |
| comment | mysql | job_options | True | True | 'comment': `'<comment>'` |
| table_include_list | postgres | source_options | False | False | 'table_include_list': (`'<regexFilter>'`, ...) |
| column_exclude_list | postgres | source_options | False | True | 'column_exclude_list': (`'<regexFilter>'`, ...) |
| heartbeat_table | postgres | job_options | False | True | 'heartbeat_table': `'<heartbeat_table>'` |
| skip_snapshots | postgres | job_options | False | True | 'skip_snapshots': True/False |
| publication_name | postgres | job_options | False | False | 'publication_name': `'<publication_name>'` |
| end_at | postgres | job_options | True | True | 'end_at': `'<timestamp>/NOW'` |
| compute_cluster | postgres | job_options | True | True | 'compute_cluster': `'<compute_cluster>'` |
| comment | postgres | job_options | True | True | 'comment': `'<comment>'` |
| parse_json_columns | postgres | job_options | False | False | 'parse_json_columns': True/False |
| column_transformations | postgres | job_options | False | True | 'column_transformations': \{`'<column>'` : `'<expression>'` , ...\} |
| snapshot_parallelism | postgres | job_options | True | True | 'snapshot_parallelism': `<integer>` |
| exclude_columns | postgres | job_options | False | True | 'exclude_columns': (`'<exclude_column>'`, ...) |
| location | s3 | source_options | False | False | 'location': `'<location>'` |
| date_pattern | s3 | job_options | False | True | 'date_pattern': `'<date_pattern>'` |
| file_pattern | s3 | job_options | False | True | 'file_pattern': `'<file_pattern>'` |
| initial_load_pattern | s3 | job_options | False | True | 'initial_load_pattern': `'<initial_load_pattern>'` |
| initial_load_prefix | s3 | job_options | False | True | 'initial_load_prefix': `'<initial_load_prefix>'` |
| delete_files_after_load | s3 | job_options | False | True | 'delete_files_after_load': True/False |
| deduplicate_with | s3 | job_options | False | True | 'deduplicate_with': \{'COLUMNS' : ['col1', 'col2'],'WINDOW': 'N HOURS'\} |
| end_at | s3 | job_options | True | True | 'end_at': `'<timestamp>/NOW'` |
| start_from | s3 | job_options | False | True | 'start_from': `'<timestamp>/NOW/BEGINNING'` |
| compute_cluster | s3 | job_options | True | True | 'compute_cluster': `'<compute_cluster>'` |
| run_parallelism | s3 | job_options | True | True | 'run_parallelism': `<integer>` |
| content_type | s3 | job_options | True | True | 'content_type': 'AUTO/CSV...' |
| compression | s3 | job_options | False | True | 'compression': 'AUTO/GZIP...' |
| comment | s3 | job_options | True | True | 'comment': `'<comment>'` |
| column_transformations | s3 | job_options | False | True | 'column_transformations': \{`'<column>'` : `'<expression>'` , ...\} |
| commit_interval | s3 | job_options | True | True | 'commit_interval': `'<N MINUTE[S]/HOUR[S]/DAY[S]>'` |
| skip_validations | s3 | job_options | False | True | 'skip_validations': ('EMPTY_PATH') |
| skip_all_validations | s3 | job_options | False | True | 'skip_all_validations': True/False |
| exclude_columns | s3 | job_options | False | True | 'exclude_columns': (`'<exclude_column>'`, ...) |
| stream | kinesis | source_options | False | False | 'stream': `'<stream>'` |
| reader_shards | kinesis | job_options | True | True | 'reader_shards': `<integer>` |
| store_raw_data | kinesis | job_options | False | True | 'store_raw_data': True/False |
| start_from | kinesis | job_options | False | True | 'start_from': `'<timestamp>/NOW/BEGINNING'` |
| end_at | kinesis | job_options | False | True | 'end_at': `'<timestamp>/NOW'` |
| compute_cluster | kinesis | job_options | True | True | 'compute_cluster': `'<compute_cluster>'` |
| run_parallelism | kinesis | job_options | False | True | 'run_parallelism': `<integer>` |
| content_type | kinesis | job_options | True | True | 'content_type': 'AUTO/CSV...' |
| compression | kinesis | job_options | False | True | 'compression': 'AUTO/GZIP...' |
| comment | kinesis | job_options | True | True | 'comment': `'<comment>'` |
| column_transformations | kinesis | job_options | True | True | 'column_transformations': \{`'<column>'` : `'<expression>'` , ...\} |
| deduplicate_with | kinesis | job_options | False | True | 'deduplicate_with': \{'COLUMNS' : ['col1', 'col2'],'WINDOW': 'N HOURS'\} |
| commit_interval | kinesis | job_options | True | True | 'commit_interval': `'<N MINUTE[S]/HOUR[S]/DAY[S]>'` |
| skip_validations | kinesis | job_options | False | True | 'skip_validations': ('MISSING_STREAM') |
| skip_all_validations | kinesis | job_options | False | True | 'skip_all_validations': True/False |
| exclude_columns | kinesis | job_options | False | True | 'exclude_columns': (`'<exclude_column>'`, ...) |
| table_include_list | mssql | source_options | True | True | 'table_include_list': (`'<regexFilter>'`, ...) |
| column_exclude_list | mssql | source_options | True | True | 'column_exclude_list': (`'<regexFilter>'`, ...) |
| exclude_columns | mssql | job_options | False | True | 'exclude_columns': (`'<exclude_column>'`, ...) |
| column_transformations | mssql | job_options | False | True | 'column_transformations': \{`'<column>'` : `'<expression>'` , ...\} |
| skip_snapshots | mssql | job_options | True | True | 'skip_snapshots': True/False |
| end_at | mssql | job_options | True | True | 'end_at': `'<timestamp>/NOW'` |
| compute_cluster | mssql | job_options | True | True | 'compute_cluster': `'<compute_cluster>'` |
| snapshot_parallelism | mssql | job_options | True | True | 'snapshot_parallelism': `<integer>` |
| parse_json_columns | mssql | job_options | False | False | 'parse_json_columns': True/False |
| comment | mssql | job_options | True | True | 'comment': `'<comment>'` |
| collection_include_list | mongodb | source_options | True | True | 'collection_include_list': (`'<regexFilter>'`, ...) |
| exclude_columns | mongodb | job_options | False | True | 'exclude_columns': (`'<exclude_column>'`, ...) |
| column_transformations | mongodb | job_options | False | True | 'column_transformations': \{`'<column>'` : `'<expression>'` , ...\} |
| skip_snapshots | mongodb | job_options | True | True | 'skip_snapshots': True/False |
| end_at | mongodb | job_options | True | True | 'end_at': `'<timestamp>/NOW'` |
| compute_cluster | mongodb | job_options | True | True | 'compute_cluster': `'<compute_cluster>'` |
| snapshot_parallelism | mongodb | job_options | True | True | 'snapshot_parallelism': `<integer>` |
| comment | mongodb | job_options | True | True | 'comment': `'<comment>'` |
