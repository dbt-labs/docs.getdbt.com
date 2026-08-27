---
title: "DuckDB and Apache Iceberg"
id: duckdb-iceberg-support
sidebar_label: "DuckDB Iceberg support"
description: Understand DuckDB support for Apache Iceberg.
---

<Lifecycle status="beta" />

:::info Fusion only

DuckDB support for `catalogs.yml` requires the [dbt Fusion engine](/docs/fusion/about-fusion) (v2) with the `use_catalogs_v2` behavior flag enabled. It isn't available in the legacy Python `dbt-duckdb` adapter for dbt Core v1.

<File name='dbt_project.yml'>

```yaml
flags:
  use_catalogs_v2: true
```

</File>

:::

Unlike Snowflake, Databricks, and BigQuery, DuckDB doesn't ship with a single built-in "managed" Iceberg catalog. This means there's no `table_format='iceberg'`-only shortcut for DuckDB &mdash; every Iceberg model requires a `catalog_name` that points to an entry in [`catalogs.yml`](/docs/build/iceberg/catalogs-yml).

dbt supports creating Iceberg tables for two DuckDB materializations:

- [Table](/docs/build/materializations#table)
- [Incremental](/docs/build/materializations#incremental)

## How DuckDB attaches catalogs

When you configure a catalog with a `duckdb` block in `catalogs.yml`, dbt generates and runs the appropriate DuckDB [`ATTACH`](https://duckdb.org/docs/sql/statements/attach.html) statement on your behalf &mdash; you don't need to write `ATTACH` SQL yourself. dbt then resolves any model with a matching `catalog_name` to that attached database.

## Iceberg REST catalogs

DuckDB can attach to any catalog that implements the Iceberg REST protocol, including self-hosted catalogs (such as [Lakekeeper](https://github.com/lakekeeper/lakekeeper) or [Nessie](https://github.com/projectnessie/nessie)), AWS Glue, and AWS S3 Tables.

<File name='catalogs.yml'>

```yaml
catalogs:
  - name: rest_catalog
    type: iceberg_rest
    table_format: iceberg
    config:
      duckdb:
        endpoint: "https://my-iceberg-rest.example.com"
        secret: my_iceberg_secret
```

</File>

<File name='models/my_iceberg_model.sql'>

```sql
{{
    config(
        materialized = 'table',
        catalog_name = 'rest_catalog'
    )
}}

select * from {{ ref('jaffle_shop_customers') }}
```

</File>

Run the model with `dbt run -s my_iceberg_model`. Instead of `endpoint`, you can use `endpoint_type: GLUE` or `endpoint_type: S3_TABLES` to attach one of these well-known AWS-managed Iceberg REST endpoints without specifying a URL:

<File name='catalogs.yml'>

```yaml
catalogs:
  - name: s3_tables_catalog
    type: iceberg_rest
    table_format: iceberg
    config:
      duckdb:
        endpoint_type: S3_TABLES
        warehouse: "arn:aws:s3tables:us-east-1:123456789012:bucket/example"
```

</File>

`endpoint` and `endpoint_type` are mutually exclusive.

:::caution Writing to S3 Tables: use the explicit `endpoint` form, not `endpoint_type`

The `endpoint_type: S3_TABLES` shortcut shown above works for *reading* from S3 Tables, but as of the current Fusion preview builds, it incorrectly defaults the REST catalog authentication to OAuth2 instead of SigV4 when **writing**. This surfaces as either:

```
Invalid Configuration Error: AUTHORIZATION_TYPE is 'oauth2', yet no 'secret' was provided...
```
or, if a secret is attached to the catalog directly:
```
InvalidArguments: HTTP Error: Failed to retrieve OAuth2 token from  (sqlstate: ...)
```

S3 Tables authenticates with SigV4, not OAuth2. Until this is fixed, use the explicit `endpoint` + `authorization_type: SIGV4` form for any S3 Tables catalog you plan to write to. See [Amazon S3 Tables (write path)](#amazon-s3-tables-write-path) below for the full, verified configuration.
:::

## Amazon S3 Tables (write path)

To materialize Iceberg models into an S3 Tables bucket, attach it as an `iceberg_rest` catalog using the explicit `endpoint` form together with SigV4 authentication, and set the S3 Tables write-compatibility options:

<File name='catalogs.yml'>

```yaml
catalogs:
  - name: s3_tables_catalog
    type: iceberg_rest
    table_format: iceberg
    config:
      duckdb:
        endpoint: "https://s3tables.<region>.amazonaws.com/iceberg"
        warehouse: "arn:aws:s3tables:<region>:<account-id>:bucket/<bucket-name>"
        authorization_type: SIGV4
        secret: s3_tables_secret
        default_schema: <namespace>
        stage_create_tables: false        # S3 Tables rejects staged CREATE TABLE AS SELECT
        disable_multi_table_commit: true  # S3 Tables has no multi-table transaction commit endpoint
        purge_requested: true             # S3 Tables only allows DROP TABLE with purge enabled
```

</File>

`secret` references an `s3` credential-chain secret defined in `profiles.yml` (see [Secrets](#secrets) below) &mdash; this supplies the SigV4 credentials, not an OAuth2 token.

<File name='profiles.yml'>

```yaml
my_profile:
  target: dev
  outputs:
    dev:
      type: duckdb
      path: ':memory:'
      extensions:
        - iceberg
        - aws
        - httpfs
      secrets:
        - type: s3
          name: s3_tables_secret
          provider: credential_chain
          region: <region>
```

</File>

<File name='models/my_s3_tables_model.sql'>

```sql
{{
    config(
        materialized = 'table',
        catalog_name = 's3_tables_catalog',
        schema = '<namespace>'
    )
}}

select * from {{ ref('jaffle_shop_customers') }}
```

</File>

Because DuckDB's default schema is `main`, dbt's default schema-naming logic concatenates it with your model's custom schema (for example, `main_my_namespace`), which won't match an existing S3 Tables namespace. Add a project-level override so the schema resolves to your namespace exactly:

<File name='macros/generate_schema_name.sql'>

```sql
{% macro generate_schema_name(custom_schema_name, node) -%}
    {%- if custom_schema_name is none -%}
        {{ target.schema }}
    {%- else -%}
        {{ custom_schema_name | trim }}
    {%- endif -%}
{%- endmacro %}
```

</File>

## Cross-platform Mesh: reading catalogs managed by other platforms

Because a single catalog entry in `catalogs.yml` can carry configuration for multiple platforms at once, you can point DuckDB at the same physical catalog that Snowflake or Databricks writes to &mdash; enabling [cross-platform Mesh](/docs/mesh/cross-platform-mesh) without copying data.

### Snowflake Horizon

[Snowflake Horizon](/docs/build/iceberg/adapters/snowflake-iceberg-support) is Snowflake's managed Iceberg catalog. Add a `duckdb` block alongside the `snowflake` block to let DuckDB attach to the same catalog:

<File name='catalogs.yml'>

```yaml
catalogs:
  - name: horizon_catalog
    type: horizon
    table_format: iceberg
    config:
      snowflake:
        external_volume: my_external_volume
      duckdb:
        warehouse: horizon_wh
        endpoint: "https://horizon.example.com/catalog"
        secret: horizon_secret
        default_schema: demo
```

</File>

### Databricks Unity Catalog

Similarly, for [Databricks Unity Catalog](/docs/build/iceberg/adapters/databricks-iceberg-support):

<File name='catalogs.yml'>

```yaml
catalogs:
  - name: unity_catalog
    type: unity
    table_format: iceberg
    config:
      databricks:
        file_format: delta
        use_uniform: true
      duckdb:
        warehouse: unity_wh
        endpoint: "https://dbc-example.cloud.databricks.com/api/2.1/unity-catalog/iceberg"
        default_schema: demo
```

</File>

### Read-only vs. read-write

By default, dbt attaches Horizon and Unity catalogs read-write (`read_only: false`) and applies write-compat `ATTACH` defaults for each (for example, disabling multi-table commits on Unity). Writing to these catalogs from DuckDB requires DuckDB 1.5.4+ and [duckdb-iceberg#1017](https://github.com/duckdb/duckdb-iceberg/issues/1017). If you only need to *read* Iceberg tables that another platform wrote, set `read_only: true`:

```yaml
      duckdb:
        warehouse: horizon_wh
        endpoint: "https://horizon.example.com/catalog"
        read_only: true
```

## DuckLake

[DuckLake](https://ducklake.select/) is a separate open table format (not Apache Iceberg) built for DuckDB, but you configure it the same way, through `catalogs.yml`. Because DuckLake isn't Iceberg, its catalog entries use `table_format: default`.

<File name='catalogs.yml'>

```yaml
catalogs:
  - name: local_lake
    type: ducklake
    table_format: default
    config:
      duckdb:
        metadata_path: "metadata.ducklake"
        data_path: "s3://my-bucket/lake" # optional
```

</File>

<File name='models/my_ducklake_model.sql'>

```sql
{{
    config(
        materialized = 'table',
        catalog_name = 'local_lake'
    )
}}

select * from {{ ref('jaffle_shop_customers') }}
```

</File>

dbt installs the DuckLake extension and attaches the catalog before running your model:

```sql
INSTALL ducklake
ATTACH IF NOT EXISTS 'ducklake:metadata.ducklake' AS local_lake (DATA_PATH 's3://my-bucket/lake')
```

## Secrets

The `secret` field in a `duckdb` catalog block references a named secret defined in `profiles.yml`, which dbt turns into a DuckDB [`CREATE SECRET`](https://duckdb.org/docs/configuration/secrets_manager.html) statement:

<File name='profiles.yml'>

```yaml
my_profile:
  target: dev
  outputs:
    dev:
      type: duckdb
      path: ':memory:'
      secrets:
        - type: iceberg
          name: my_iceberg_secret
          # additional key-value pairs become CREATE SECRET parameters
          # (for example, token, client_id, client_secret) -- see DuckDB's
          # iceberg extension docs for the parameters your catalog needs.
```

</File>

For Amazon S3 Tables specifically, use a `type: s3` / `provider: credential_chain` secret instead (SigV4, not OAuth2/token-based) &mdash; see [Amazon S3 Tables (write path)](#amazon-s3-tables-write-path) above.

## DuckDB-specific configs for Iceberg catalogs

You can supply these configs, nested under `config.duckdb`, for `horizon`, `unity`, and `iceberg_rest` catalogs:

| Field | Required | Description |
| --- | --- | --- |
| `endpoint` | One of `endpoint`/`endpoint_type` | Full Iceberg REST catalog URL. |
| `endpoint_type` | One of `endpoint`/`endpoint_type` | `GLUE` or `S3_TABLES`, for well-known AWS-managed endpoints. For writing to S3 Tables, prefer the explicit `endpoint` form (see caution above). |
| `warehouse` | Required for `horizon`; required for any Amazon S3 Tables catalog (both the `endpoint_type: S3_TABLES` and the explicit `endpoint` write path) | Warehouse identifier passed as the `ATTACH` source. |
| `secret` | Optional | Name of a DuckDB secret from `profiles.yml` to use for authentication. |
| `attach_as` | Optional | Overrides the DuckDB attach alias. Defaults to the catalog's `name`. |
| `default_region` | Optional | AWS region, when applicable. |
| `default_schema` | Optional | Default schema/namespace within the catalog. |
| `max_table_staleness` | Optional | How long DuckDB may serve cached metadata before refreshing. |
| `authorization_type` | Optional | `OAUTH2`, `SIGV4`, or `NONE`. Can't be combined with `endpoint_type`. Required as `SIGV4` when writing to S3 Tables. |
| `access_delegation_mode` | Optional | `VENDED_CREDENTIALS` or `NONE`. |
| `read_only` | Optional | Attach the catalog read-only. Defaults to `false` (read-write). |
| `support_nested_namespaces` | Optional | Whether the catalog supports nested namespaces. |
| `stage_create_tables` | Optional | Write-compat: stage `CREATE TABLE AS SELECT` writes. Requires DuckDB 1.5.4+. Set to `false` for Amazon S3 Tables. |
| `disable_multi_table_commit` | Optional | Write-compat: disable multi-table commits. Requires DuckDB 1.5.4+. Set to `true` for Amazon S3 Tables. |
| `skip_create_table_metadata_updates` | Optional | Write-compat: skip metadata updates on `CREATE TABLE`. Requires DuckDB 1.5.4+. |
| `remove_files_on_delete` | Optional | Write-compat: remove underlying data files when a table is dropped. Requires DuckDB 1.5.4+. |
| `purge_requested` | Optional | Purge underlying files when supported by the catalog. Set to `true` for Amazon S3 Tables, which only allows `DROP TABLE` with purge enabled. |
| `encode_entire_prefix` | Optional | Percent-encode the entire object key prefix. |

For `ducklake` catalogs, `config.duckdb` accepts:

| Field | Required | Description |
| --- | --- | --- |
| `metadata_path` | Required | Path to the DuckLake metadata store, for example `metadata.ducklake` or a database connection string. |
| `data_path` | Optional | Where DuckLake writes data files. |
| `attach_as` | Optional | Overrides the DuckDB attach alias. Defaults to the catalog's `name`. |
| `metadata_schema` | Optional | Schema within the metadata store to use. |
| `metadata_catalog` | Optional | Catalog/database name within the metadata store. |
| `data_inlining_row_limit` | Optional | Inline row groups smaller than this many rows into the metadata catalog instead of writing a Parquet file. |
| `create_if_not_exists` | Optional | Create the DuckLake catalog if it doesn't already exist. |
| `read_only` | Optional | Attach read-only. |
| `encrypted` | Optional | Encrypt the DuckLake catalog. |
| `automatic_migration` | Optional | Automatically migrate the catalog's DuckLake format version on attach. |
| `override_data_path` | Optional | Allow attaching with a `data_path` that differs from the one recorded in an existing catalog. |
