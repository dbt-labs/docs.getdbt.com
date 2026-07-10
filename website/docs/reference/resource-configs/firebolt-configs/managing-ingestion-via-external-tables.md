---
title: "Managing ingestion via external tables"
sidebar_label: "External tables"
description: "Use the external tables feature in dbt-firebolt to manage table ingestion from S3 into Firebolt."
---

`dbt-firebolt` supports dbt's [external tables feature](/reference/resource-properties/external), which allows dbt to manage the table ingestion process from S3 into Firebolt. This is an optional feature but can be highly convenient depending on your use case.

More information on using external tables including properly configuring IAM can be found in the Firebolt [documentation](https://docs.firebolt.io/godocs/Guides/loading-data/working-with-external-tables.html).


#### Installation of external tables package

To install and use `dbt-external-tables` with Firebolt, you must:

1. Add this package to your packages.yml:

    ```yaml
    packages:
      - package: dbt-labs/dbt_external_tables
        version: <version>
    ```

2. Add these fields to your `dbt_project.yml`:

    ```yaml
    dispatch:
      - macro_namespace: dbt_external_tables
        search_order: ['dbt', 'dbt_external_tables']
    ```

3. Pull in the `packages.yml` dependencies by calling `dbt deps`.


#### Using external tables

To use external tables, you must define a table as `external` in your `dbt_project.yml` file. Every external table must contain the fields `url`, `type`, and `object_pattern`. Note that the Firebolt external table specification requires fewer fields than what is specified in the dbt documentation.

In addition to specifying the columns, an external table may specify partitions. Partitions are not columns and they cannot have the same name as columns. To avoid YAML parsing errors, remember to encase string literals (such as the `url` and `object_pattern` values) in single quotation marks.


#### dbt_project.yml syntax for an external table

```yml
sources:
  - name: firebolt_external
    schema: "{{ target.schema }}"
    loader: S3

    tables:
      - name: <table-name>
        external:
          url: 's3://<bucket_name>/'
          object_pattern: '<regex>'
          type: '<type>'
          credentials:
            aws_key_id: <key-id>
            aws_secret_key: <key-secret>
          object_pattern: '<regex>'
          compression: '<compression-type>'
          partitions:
            - name: <partition-name>
              data_type: <partition-type>
              regex: '<partition-definition-regex>'
          columns:
            - name: <column-name>
              data_type: <type>
```

`aws_key_id` and `aws_secret_key` are the credentails that allow Firebolt access to your S3 bucket. Learn
how to set them up by following this [guide](https://docs.firebolt.io/godocs/Guides/loading-data/creating-access-keys-aws.html). If your bucket is public these parameters are not necessary.

#### Running external tables

The `stage_external_sources` macro is inherited from the [dbt-external-tables package](https://github.com/dbt-labs/dbt-external-tables#syntax) and is the primary point of entry when using thes package. It has two operational modes: standard and "full refresh."

```bash
# iterate through all source nodes, create if missing, refresh metadata
$ dbt run-operation stage_external_sources

# iterate through all source nodes, create or replace (no refresh command is required as data is fetched live from remote)
$ dbt run-operation stage_external_sources --vars "ext_full_refresh: true"
```
