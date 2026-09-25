---
title: "Amazon Web Services and Apache Iceberg"
id: aws-iceberg-support
sidebar_label: "AWS Iceberg support"
description: Understand dbt support for Apache Iceberg on AWS, including the AWS Glue Data Catalog, Amazon Athena, and Amazon S3 Tables.
---

dbt materializes Iceberg tables on AWS through the [AWS Glue Data Catalog](#aws-glue-data-catalog), the catalog that AWS analytics engines share. There are two ways to configure it:

- **Simplest:** Set `table_type = 'iceberg'` in your model config to instruct dbt to materialize this model as an Iceberg table in the AWS Glue Data Catalog through Amazon Athena.
- **Extensible:** Define an Iceberg catalog in `catalogs.yml` and configure this model with `catalog_name`. This is required to target [Amazon S3 Tables](#amazon-s3-tables).

dbt supports creating Iceberg tables for two Athena materializations:

- [Table](/docs/build/materializations#table)
- [Incremental](/docs/build/materializations#incremental), with the `merge` strategy

## AWS Glue Data Catalog

On AWS, the [AWS Glue Data Catalog](https://docs.aws.amazon.com/athena/latest/ug/glue-athena.html) is the metadata layer that registers Iceberg tables. It is the shared source of truth that lets one engine write a table and another read it: Amazon Athena, Amazon Redshift, Amazon EMR, and Apache Spark all resolve Iceberg tables through Glue. To create these tables with dbt through Amazon Athena, use the [dbt-athena](/docs/local/connect-data-platform/athena-setup).

Amazon S3 Tables extends this model with a managed Iceberg catalog that owns its own storage, surfaced to Glue through a federated catalog. Both paths register governed Iceberg tables that any Glue-connected engine can read.

## Amazon Athena and Iceberg

Athena queries Iceberg tables registered in the AWS Glue Data Catalog. 

### Prerequisites
- Iceberg tables require [Athena engine version 3](https://docs.aws.amazon.com/athena/latest/ug/querying-iceberg.html).
- Each table also needs a unique storage location, unless you use Amazon S3 Tables, which manages storage for you.

1. To connect dbt to Athena locally, define a dbt-athena target in `profiles.yml`:

  <File name='profiles.yml'>

  ```yaml
  my_profile:
    target: dev
    outputs:
      dev:
        type: athena
        s3_staging_dir: s3://my-athena-results-bucket/staging/
        region_name: <region>
        database: awsdatacatalog
        schema: my_schema
        threads: 4
  ```

  </File>

For the full set of connection options, see the [dbt-athena setup page](/docs/local/connect-data-platform/athena-setup).

2. To create an Iceberg table without `catalogs.yml`, set `table_type='iceberg'` in your model config:

  <File name="models/my_iceberg_model.sql">

  ```sql
  {{
      config(
          materialized = 'table',
          table_type = 'iceberg',
          format = 'parquet'
      )
  }}

  select * from {{ ref('jaffle_shop_customers') }}
  ```

  </File>

## Amazon S3 Tables

[Amazon S3 Tables](https://docs.aws.amazon.com/AmazonS3/latest/userguide/s3-tables.html) is AWS's managed Apache Iceberg storage. S3 Tables owns its own storage location and Iceberg snapshots, so it isn't addressed the same way as a regular Glue-backed Iceberg table &mdash; it needs the dedicated `type: s3_tables` catalog integration.

:::info Adapter availability

S3 Tables support is available on <Constant name="dbt_platform"/>. It was added in [dbt-adapters#2047](https://github.com/dbt-labs/dbt-adapters/pull/2047), merged July 17, 2026, after the latest stable `dbt-athena` release on PyPI (`1.11.0`, released July 16).

Until a stable release includes this support, install the adapter from GitHub to use it locally or in a self-hosted environment:

```shell
pip install "git+https://github.com/dbt-labs/dbt-adapters.git@main#subdirectory=dbt-athena"
```
:::

### Enable the S3 Tables integration with Glue

Athena accesses an S3 Tables bucket through a federated Glue catalog named `s3tablescatalog`. Each table bucket appears under this catalog. Enable the integration once per AWS account and Region either from the Amazon S3 console by selecting **Enable integration** when you create a table bucket or using the AWS CLI:

```shell
aws glue create-catalog \
  --name "s3tablescatalog" \
  --catalog-input '{
    "Description": "Federated catalog for S3 Tables",
    "FederatedCatalog": {
      "Identifier": "arn:aws:s3tables:<region>:<account-id>:bucket/*",
      "ConnectionName": "aws:s3tables"
    },
    "CreateDatabaseDefaultPermissions": [{
      "Principal": {"DataLakePrincipalIdentifier": "IAM_ALLOWED_PRINCIPALS"},
      "Permissions": ["ALL"]
    }],
    "CreateTableDefaultPermissions": [{
      "Principal": {"DataLakePrincipalIdentifier": "IAM_ALLOWED_PRINCIPALS"},
      "Permissions": ["ALL"]
    }]
  }'
```

This example uses `IAM_ALLOWED_PRINCIPALS` to configure IAM-only access. Access is controlled by the query role's IAM permissions, without requiring AWS Lake Formation setup.

You can optionally use Lake Formation if you need fine-grained permissions or centrally managed access. For both options, refer to [Enabling S3 Tables integration with the Data Catalog](https://docs.aws.amazon.com/glue/latest/dg/enable-s3-tables-catalog-integration.html).

### Configure your dbt project

1. Enable the `use_catalogs_v2` behavior flag in `dbt_project.yml`:

   <File name="dbt_project.yml">

   ```yaml
   flags:
     use_catalogs_v2: true
   ```

   </File>

2. Create a `catalogs.yml` at the top level of your dbt project:

<File name='catalogs.yml'>

```yaml
catalogs:
  - name: s3_tables_catalog
    type: s3_tables
    table_format: iceberg
    config:
      athena:
        catalog_database: s3tablescatalog/<your-table-bucket-name>
        file_format: parquet
```

</File>

  Set `catalog_database` to the federated Glue catalog name for your S3 table bucket (the same name Athena uses to address it). dbt uses this value as the model's `database`. Omitting `catalog_database` falls back to the profile's `database`.  The model's resolved `schema` identifies the S3 Tables namespace.

3. Add the `catalog_name` config parameter in either a config block (inside the `.sql` model file), properties YAML file (model folder), or your project YAML file (`dbt_project.yml`):

<File name='models/my_s3_tables_model.sql'>

```sql
{{
    config(
        materialized = 'table',
        catalog_name = 's3_tables_catalog',
        schema = 'my_namespace'
    )
}}

select * from {{ ref('jaffle_shop_customers') }}
```

</File>

4. Run your dbt model:

 ```shell
   dbt run -s my_s3_tables_model
   ```

### Create an incremental model

:::info Full refresh is not supported

The implementation added in [dbt-adapters#2047](https://github.com/dbt-labs/dbt-adapters/pull/2047) supports initial and repeated incremental `merge` runs, but not `--full-refresh` for incremental S3 Tables models.

Refer to [Full-refresh limitation](#full-refresh-limitation) before rebuilding an incremental table.

:::

To update an existing table with new or changed rows, use the `incremental` materialization with the `merge` strategy. Set a `unique_key` so dbt can match incoming records to existing rows:

<File name='models/my_incremental_s3_tables_model.sql'>

```sql
{{
    config(
        materialized = 'incremental',
        incremental_strategy = 'merge',
        unique_key = 'id',
        catalog_name = 's3_tables_catalog',
        schema = 'my_namespace'
    )
}}

select * from {{ ref('my_s3_tables_model') }}
```

</File>

On the first run, when the target table does not yet exist, dbt creates the incremental model using `CREATE TABLE AS` (the same drop-and-recreate-aware path the `table` materialization uses), then switches to `merge` on subsequent runs. No `--full-refresh` is needed to bootstrap the table.

### How dbt writes to S3 Tables

The `s3_tables` catalog integration accounts for storage and DDL differences between S3 Tables and a standard Glue-backed Iceberg table:

- **Storage locations:** dbt omits `LOCATION` from `CREATE TABLE AS` because S3 Tables manages storage and rejects an explicit location.
- **Table replacement:** dbt drops and recreates tables instead of renaming them. S3 Tables doesn't support `ALTER TABLE ... RENAME`, which the standard Glue table materialization uses to swap tables with near-zero downtime. dbt removes the table's metadata through the Glue Data Catalog rather than issuing SQL `DROP TABLE` or deleting S3 files directly.
- **Table recognition:** dbt recognizes S3 Tables as Iceberg tables even though Glue reports their `TableType` as `customer`, or `aws` for service-managed tables.

### Full-refresh limitation

Running an incremental S3 Tables model with `--full-refresh` fails with this error:


```
An error occurred (InvalidRequestException) when calling the StartQueryExecution
operation: Unsupported DDL query for S3 table buckets
```

This happens because the incremental materialization's full-refresh path still swaps tables with `ALTER TABLE ... RENAME TO ...__bkp`, which S3 Tables doesn't support.  The `table` materialization's drop-and-recreate fix doesn't currently extend to this path. 

Until this is addressed upstream, avoid `--full-refresh` on incremental S3 Tables models. To rebuild a table:
- Drop the table through the S3 Tables API or console, then rerun the model.
- Rebuild it using the `table` materialization.

## AWS-specific configs for Iceberg catalogs

Supply these configs nested under `config.athena` in a `catalogs.yml` catalog entry:

<SimpleTable>

| Field | Required | Description |
| --- | --- | --- |
| `catalog_database` | Optional | Federated Glue catalog name for the target bucket, for example `s3tablescatalog/<bucket-name>`. Routes the model's `database`. Falls back to the profile's `database` if omitted. |
| `file_format` | Optional | File format for written data files. Defaults to `parquet`. |
</SimpleTable>

## Other AWS engines

This page covers Iceberg catalog integration through `dbt-athena`.

For support for additional AWS engines, refer to [Apache Iceberg support adapters page](/docs/build/iceberg/apache-iceberg-support).

Today, engines such as dbt-spark (on Amazon EMR), dbt-trino, and dbt-redshift can read and write Glue-registered Iceberg tables by configuring the engine's own Iceberg catalog against the AWS Glue Data Catalog or the S3 Tables Iceberg REST endpoint, but they do not yet expose a native AWS `catalog_type` in `catalogs.yml`.
