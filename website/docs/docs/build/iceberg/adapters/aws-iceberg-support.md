---
title: "Amazon Web Services and Apache Iceberg"
id: aws-iceberg-support
sidebar_label: "AWS Iceberg support"
description: Understand dbt support for Apache Iceberg on AWS, including the AWS Glue Data Catalog, Amazon Athena, and Amazon S3 Tables.
---

dbt materializes Iceberg tables on AWS through the [AWS Glue Data Catalog](#aws-glue-data-catalog), the catalog that AWS analytics engines share. There are two ways to configure it:

- **Simplest:** The model config `table_type = 'iceberg'` instructs dbt to materialize this model as an Iceberg table in the AWS Glue Data Catalog through Amazon Athena.
- **Extensible:** Define an Iceberg catalog in `catalogs.yml` and configure this model with `catalog_name`. This is required to target [Amazon S3 Tables](#amazon-s3-tables).

dbt supports creating Iceberg tables for two Athena materializations:

- [Table](/docs/build/materializations#table)
- [Incremental](/docs/build/materializations#incremental), with the `merge` strategy

## AWS Glue Data Catalog

On AWS, the [AWS Glue Data Catalog](https://docs.aws.amazon.com/athena/latest/ug/glue-athena.html) is the metadata layer that registers Iceberg tables. It is the shared source of truth that lets one engine write a table and another read it: Amazon Athena, Amazon Redshift, Amazon EMR, and Apache Spark all resolve Iceberg tables through Glue. dbt drives Glue through the engine's adapter &mdash; today that is [dbt-athena](/docs/core/connect-data-platform/athena-setup).

Amazon S3 Tables extends this model with a managed Iceberg catalog that owns its own storage, surfaced to Glue through a federated catalog. Both paths register governed Iceberg tables that any Glue-connected engine can read.

## Amazon Athena and Iceberg

Athena queries Iceberg tables registered in the AWS Glue Data Catalog. Iceberg tables require [Athena engine version 3](https://docs.aws.amazon.com/athena/latest/ug/querying-iceberg.html) and, outside of Amazon S3 Tables, a unique table location.

To connect dbt to Athena, define a dbt-athena target in `profiles.yml`:

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

For the full set of connection options, see the [dbt-athena setup page](/docs/core/connect-data-platform/athena-setup).

Without a `catalogs.yml`, set `table_type='iceberg'` directly on the model:

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

:::info Requires a recent dbt-athena
S3 Tables support was added in [`dbt-labs/dbt-adapters#2047`](https://github.com/dbt-labs/dbt-adapters/pull/2047), merged 2026-07-17. As of this writing it is not yet in an official stable `dbt-athena` release on PyPI (latest stable is `1.11.0`, dated one day before the merge). It is already available on dbt Cloud. To use it locally or self-hosted before the next stable release, install directly from GitHub:

```shell
pip install "git+https://github.com/dbt-labs/dbt-adapters.git@main#subdirectory=dbt-athena"
```
:::

`catalogs.yml` support requires the `use_catalogs_v2` behavior flag:

<File name='dbt_project.yml'>

```yaml
flags:
  use_catalogs_v2: true
```

</File>

### Prerequisite: enable the S3 Tables and Glue Data Catalog integration

Athena reaches an S3 Tables bucket through a federated Glue catalog named `s3tablescatalog`, which mounts your S3 Tables buckets as child catalogs. Enable it once per account/Region, either from the Amazon S3 console (select **Enable integration** when creating a table bucket) or with the AWS CLI:

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

The `IAM_ALLOWED_PRINCIPALS` default shown above puts the catalog in IAM-only mode: Athena's access to the S3 Tables bucket is governed by the query role's IAM permissions, with no AWS Lake Formation setup required. Lake Formation is optional, for teams that want fine-grained or centrally managed grants. See [Enabling S3 Tables integration with the Data Catalog](https://docs.aws.amazon.com/glue/latest/dg/enable-s3-tables-catalog-integration.html) for both options.

### Configure catalog integration for S3 Tables

1. Create a `catalogs.yml` at the top level of your dbt project:

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

   `catalog_database` is the federated catalog name for your S3 Tables bucket &mdash; the same name Athena uses to address it. It routes the model's `database`; the model's `schema` is the S3 Tables namespace. Omitting `catalog_database` falls back to the profile's `database`.

2. Add the `catalog_name` config parameter in either a config block (inside the `.sql` model file), properties YAML file (model folder), or your project YAML file (`dbt_project.yml`):

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

3. Execute the dbt model with `dbt run -s my_s3_tables_model`.

For an incremental model using the `merge` strategy:

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

On the first run, when the target table does not yet exist, the incremental model creates it with a standard `CREATE TABLE AS` (the same drop-and-recreate-aware path the `table` materialization uses), then switches to `merge` on subsequent runs. No `--full-refresh` is needed to bootstrap the table.

### How dbt writes to S3 Tables

The `s3_tables` catalog integration accounts for storage and DDL differences between S3 Tables and a standard Glue-backed Iceberg table:

- **No `LOCATION`** is set on `CREATE TABLE AS` &mdash; S3 Tables manages its own storage and rejects a supplied location.
- **Table replacement uses drop-and-recreate**, routed through the Glue Data Catalog's metadata delete (not a SQL `DROP TABLE`, and not a direct S3 delete) &mdash; S3 Tables does not support `ALTER TABLE ... RENAME`, which the standard Glue `table` materialization otherwise uses for a near-zero-downtime swap.
- Glue reports an S3 Tables table's `TableType` as `customer` (or `aws` for service-managed tables), neither of which is a standard Glue table type. dbt classifies these correctly as Iceberg tables.

### Known limitation: incremental `--full-refresh`

As of `dbt-athena` including `dbt-adapters#2047`, a normal incremental `merge` run works correctly, including repeated runs. However, running an incremental model with `--full-refresh` currently fails:

```
An error occurred (InvalidRequestException) when calling the StartQueryExecution
operation: Unsupported DDL query for S3 table buckets
```

This happens because the incremental materialization's full-refresh path still swaps tables with `ALTER TABLE ... RENAME TO ...__bkp`, which S3 Tables does not support. The `table` materialization's drop-and-recreate fix does not currently extend to this path. Until this is addressed upstream, avoid `--full-refresh` on incremental S3 Tables models; instead, drop the table via the S3 Tables API/console and re-run, or rebuild it as a `table` materialization.

## AWS-specific configs for Iceberg catalogs

Supply these configs nested under `config.athena` in a `catalogs.yml` catalog entry:

| Field | Required | Description |
| --- | --- | --- |
| `catalog_database` | Optional | Federated Glue catalog name for the target bucket, for example `s3tablescatalog/<bucket-name>`. Routes the model's `database`. Falls back to the profile's `database` if omitted. |
| `file_format` | Optional | File format for written data files. Defaults to `parquet`. |

## Other AWS engines

Support for additional AWS engines will be documented here as their dbt adapters add first-class Iceberg catalog integration. Today, engines such as dbt-spark (on Amazon EMR), dbt-trino, and dbt-redshift can read and write Glue-registered Iceberg tables by configuring the engine's own Iceberg catalog against the AWS Glue Data Catalog or the S3 Tables Iceberg REST endpoint, but they do not yet expose a native AWS `catalog_type` in `catalogs.yml`.
