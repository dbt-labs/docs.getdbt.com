---
title: "Connect Amazon Athena"
id: connect-amazon-athena
description: "Configure the Amazon Athena data platform connection in dbt Cloud."
sidebar_label: "Connect Amazon Athena"
---

# Connect Amazon Athena

Your environment(s) must be on ["Versionless"](/docs/dbt-versions/versionless-cloud) to use the Amazon Athena connection.

Connect dbt Cloud to Amazon's Athena interactive query service to build your dbt project. The following are the required and optional fields for configuring the Athena connection:

| Field                         | Option           | Description                                                                         | Type   | Required? | Example |
| ----------------------------- | ---------------- | ----------------------------------------------------------------------------------- | ------ | --------- | ------- |
| AWS region name               | region_name      | AWS region of your Athena instance                                                  | String | Required  | eu-west-1 |
| Database (catalog)            | database         | Specify the database (Data catalog) to build models into (lowercase only)           | String | Required  | awsdatacatalog |
| AWS S3 staging directory      | s3_staging_dir   | S3 location to store Athena query results and metadata                              | String | Required  | s3://bucket/dbt/ |
| Athena workgroup              | work_group       | Identifier of Athena workgroup                                                      | String | Optional  | my-custom-workgroup |
| Athena Spark workgroup        | spark_work_group | Identifier of Athena Spark workgroup for running Python models                      | String | Optional  | my-spark-workgroup |
| AWS S3 data directory         | s3_data_dir      | Prefix for storing tables, if different from the connection's s3_staging_dir        | String | Optional  | s3://bucket2/dbt/ |
| AWS S3 data naming convention | s3_data_naming   | How to generate table paths in s3_data_dir                                          | String | Optional  | schema_table_unique |
| AWS S3 temp tables prefix     | s3_tmp_table_dir | Prefix for storing temporary tables, if different from the connection's s3_data_dir | String | Optional  | s3://bucket3/dbt/ |
| Poll interval                 | poll_interval    | Interval in seconds to use for polling the status of query results in Athena        | Integer| Optional  | 5 |
| Query retries                 | num_retries      | Number of times to retry a failing query                                            | Integer| Optional  | 3 |
| Boto3 retries                 | num_boto3_retries| Number of times to retry boto3 requests (e.g. deleting S3 files for materialized tables)| Integer | Optional | 5 |
| Iceberg retries               | num_iceberg_retries| Number of times to retry iceberg commit queries to fix ICEBERG_COMMIT_ERROR       | Integer | Optional | 0 |

### Development credentials

Enter your _development_ (not deployment) credentials with the following fields:

| Field                 | Option                | Description                                                                | Type   | Required | Example  |
| --------------------- | --------------------- | -------------------------------------------------------------------------- | ------ | -------- | -------- |
| AWS Access Key ID     | aws_access_key_id     | Access key ID of the user performing requests                              | String | Required | AKIAIOSFODNN7EXAMPLE |
| AWS Secret Access Key | aws_secret_access_key | Secret access key of the user performing requests                          | String | Required | wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY |
| Schema                | schema                | Specify the schema (Athena database) to build models into (lowercase only) | String | Required | dbt |
| Threads               | threads               |                                                                            | Integer| Optional | 3 |
