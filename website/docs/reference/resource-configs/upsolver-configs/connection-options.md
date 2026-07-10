---
title: "Connection options"
sidebar_label: "Connection options"
description: "Reference of Upsolver connection options in dbt for sources such as S3, Kafka, Glue Catalog, Kinesis, and databases."
---

| Option | Storage   | Editable | Optional | Config Syntax |
| -------| --------- | -------- | -------- | ------------- |
| aws_role | s3 | True | True | 'aws_role': `'<aws_role>'` |
| external_id | s3 | True | True | 'external_id': `'<external_id>'` |
| aws_access_key_id | s3 | True | True | 'aws_access_key_id': `'<aws_access_key_id>'` |
| aws_secret_access_key | s3 | True | True | 'aws_secret_access_key_id': `'<aws_secret_access_key_id>'` |
| path_display_filter | s3 | True | True | 'path_display_filter': `'<path_display_filter>'` |
| path_display_filters | s3 | True | True | 'path_display_filters': (`'<filter>'`, ...) |
| read_only | s3 | True | True | 'read_only': True/False |
| encryption_kms_key | s3 | True | True | 'encryption_kms_key': `'<encryption_kms_key>'` |
| encryption_customer_managed_key | s3 | True | True | 'encryption_customer_kms_key': `'<encryption_customer_kms_key>'` |
| comment | s3 | True | True | 'comment': `'<comment>'` |
| host | kafka | False | False | 'host': `'<host>'` |
| hosts | kafka | False | False | 'hosts': (`'<host>'`, ...) |
| consumer_properties | kafka | True | True | 'consumer_properties': `'<consumer_properties>'` |
| version | kafka | False | True | 'version': `'<value>'` |
| require_static_ip | kafka | True | True | 'require_static_ip': True/False |
| ssl | kafka | True | True | 'ssl': True/False |
| topic_display_filter | kafka | True | True | 'topic_display_filter': `'<topic_display_filter>'` |
| topic_display_filters | kafka | True | True | 'topic_display_filter': (`'<filter>'`, ...) |
| comment | kafka | True | True | 'comment': `'<comment>'` |
| aws_role | glue_catalog | True | True | 'aws_role': `'<aws_role>'` |
| external_id | glue_catalog | True | True | 'external_id': `'<external_id>'` |
| aws_access_key_id | glue_catalog | True | True | 'aws_access_key_id': `'<aws_access_key_id>'` |
| aws_secret_access_key | glue_catalog | True | True | 'aws_secret_access_key': `'<aws_secret_access_key>'` |
| default_storage_connection | glue_catalog | False | False | 'default_storage_connection': `'<default_storage_connection>'` |
| default_storage_location | glue_catalog | False | False | 'default_storage_location': `'<default_storage_location>'` |
| region | glue_catalog | False | True | 'region': `'<region>'` |
| database_display_filter | glue_catalog | True | True | 'database_display_filter': `'<database_display_filter>'` |
| database_display_filters | glue_catalog | True | True | 'database_display_filters': (`'<filter>'`, ...) |
| comment | glue_catalog | True | True | 'comment': `'<comment>'` |
| aws_role | kinesis | True | True | 'aws_role': `'<aws_role>'` |
| external_id | kinesis | True | True | 'external_id': `'<external_id>'` |
| aws_access_key_id | kinesis | True | True | 'aws_access_key_id': `'<aws_access_key_id>'` |
| aws_secret_access_key | kinesis | True | True | 'aws_secret_access_key': `'<aws_secret_access_key>'` |
| region | kinesis | False | False | 'region': `'<region>'` |
| read_only | kinesis | False | True | 'read_only': True/False |
| max_writers | kinesis | True | True | 'max_writers': `<integer>` |
| stream_display_filter | kinesis | True | True | 'stream_display_filter': `'<stream_display_filter>'` |
| stream_display_filters | kinesis | True | True | 'stream_display_filters': (`'<filter>'`, ...) |
| comment | kinesis | True | True | 'comment': `'<comment>'` |
| connection_string | snowflake | True | False | 'connection_string': `'<connection_string>'` |
| user_name | snowflake | True | False | 'user_name': `'<user_name>'` |
| password | snowflake | True | False | 'password': `'<password>'` |
| max_concurrent_connections | snowflake | True | True | 'max_concurrent_connections': `<integer>` |
| comment | snowflake | True | True | 'comment': `'<comment>'` |
| connection_string | redshift | True | False | 'connection_string': `'<connection_string>'` |
| user_name | redshift | True | False | 'user_name': `'<user_name>'` |
| password | redshift | True | False | 'password': `'<password>'` |
| max_concurrent_connections | redshift | True | True | 'max_concurrent_connections': `<integer>` |
| comment | redshift | True | True | 'comment': `'<comment>'` |
| connection_string | mysql | True | False | 'connection_string': `'<connection_string>'` |
| user_name | mysql | True | False | 'user_name': `'<user_name>'` |
| password | mysql | True | False | 'password': `'<password>'` |
| comment | mysql | True | True | 'comment': `'<comment>'` |
| connection_string | postgres | True | False | 'connection_string': `'<connection_string>'` |
| user_name | postgres | True | False | 'user_name': `'<user_name>'` |
| password | postgres | True | False | 'password': `'<password>'` |
| comment | postgres | True | True | 'comment': `'<comment>'` |
| connection_string | elasticsearch | True | False | 'connection_string': `'<connection_string>'` |
| user_name | elasticsearch | True | False | 'user_name': `'<user_name>'` |
| password | elasticsearch | True | False | 'password': `'<password>'` |
| comment | elasticsearch | True | True | 'comment': `'<comment>'` |
| connection_string | mongodb | True | False | 'connection_string': `'<connection_string>'` |
| user_name | mongodb | True | False | 'user_name': `'<user_name>'` |
| password | mongodb | True | False | 'password': `'<password>'` |
| timeout | mongodb | True | True | 'timeout': "INTERVAL 'N' SECONDS" |
| comment | mongodb | True | True | 'comment': `'<comment>'` |
| connection_string | mssql | True | False | 'connection_string': `'<connection_string>'` |
| user_name | mssql | True | False | 'user_name': `'<user_name>'` |
| password | mssql | True | False | 'password': `'<password>'` |
| comment | mssql | True | True | 'comment': `'<comment>'` |
