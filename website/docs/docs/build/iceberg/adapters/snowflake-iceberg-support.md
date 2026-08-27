---
title: "Snowflake and Apache Iceberg"
id: snowflake-iceberg-support
sidebar_label: "Snowflake Iceberg support"
description: Understand Snowflake support for Apache Iceberg.
---

import BaseLocationEnvIsolation from '/snippets/_base-location-env-isolation-warning.md';

dbt supports materializing models in the Iceberg table format in two ways:

- **Simplest:** The model config `table_format = 'iceberg'` instructs dbt to materialize this model as an Iceberg table in Snowflake Horizon (managed catalog). Whether dbt writes to Snowflake-managed storage by default depends on your dbt version &mdash; refer to [External volume defaults](#external-volume-defaults)
- **Extensible:** Define an Iceberg catalog in `catalogs.yml` and configure this model with `catalog_name`

## Creating Iceberg tables

dbt supports creating Iceberg tables for three of the Snowflake materializations: 

- [Table](/docs/build/materializations#table)
- [Incremental](/docs/build/materializations#incremental)
- [Dynamic Table](/reference/resource-configs/snowflake-configs#dynamic-tables) 

## Iceberg catalogs

Snowflake supports writing Iceberg tables to Snowflake Horizon (its managed catalog), and to external catalogs through [catalog-linked databases](https://docs.snowflake.com/en/user-guide/tables-iceberg-catalog-linked-database). Those external catalogs include Polaris (self-hosted), Open Catalog (Snowflake's managed Polaris), AWS Glue, GCP BigLake, Databricks Unity, and (in theory) any other catalog that implements Iceberg REST compatibility.

### Snowflake Horizon (Snowflake-managed)

#### Simplest: Create a single Iceberg table

<File name='models/MODEL_NAME.sql'>

```sql

{{
  config(
    materialized = "table",
    table_format="iceberg",
  )
}}

select * from {{ ref('raw_orders') }}

```

</File>

The following configurations are supported.

For more information, check out the Snowflake reference for [`CREATE ICEBERG TABLE` (Snowflake as the catalog)](https://docs.snowflake.com/en/sql-reference/sql/create-iceberg-table-snowflake).

| Parameter | Type   | Required | Description                                                                                                                                                         | Sample input                                       | Note |
| ------ | ----- |----------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------| ---- |
| `table_format` | String | Yes      | Configures the objects table format.                                                                                                                                | `iceberg`                                          | `iceberg` is the only accepted value.  |
| `external_volume` | String | No       | Specifies the identifier (name) of the external volume where Snowflake writes the Iceberg table's metadata and data files. Set it to `SNOWFLAKE_MANAGED` to write to [Snowflake-managed storage](https://docs.snowflake.com/en/user-guide/tables-iceberg-internal-storage). | `my_s3_bucket`<br />`SNOWFLAKE_MANAGED` | Refer to [External volume defaults](#external-volume-defaults). |
| `base_location_root` | String  | No       | If provided, the input overrides the default dbt base_location value of `_dbt`                                                                                      |
| `base_location_subpath` | String | No       | An optional suffix to add to the `base_location` path that dbt automatically specifies.                                                                             | `jaffle_marketing_folder`                          | We recommend that you don't specify this. Modifying this parameter results in a new Iceberg table. See [Base Location](#base-location) for more info.                                                                                            |
| `iceberg_version` | Integer | No       | Specifies the Iceberg format version for the table. Defaults to `2`. Cannot be changed after table creation.                                                        | `3`                                                | Set to `3` for improved `VARIANT` type support and better incremental/snapshot performance through deletion vectors. |

#### External volume defaults

When a model sets `table_format: iceberg` without an `external_volume`, dbt's behavior depends on your version.

<VersionBlock firstVersion="2.0">

dbt emits `external_volume = 'SNOWFLAKE_MANAGED'` in the `CREATE ICEBERG TABLE` DDL and omits `base_location`, so the table uses Snowflake-managed storage.

</VersionBlock>

<VersionBlock lastVersion="1.12">

The `snowflake_managed_iceberg_default` [behavior flag](/reference/global-configs/snowflake-changes#the-snowflake_managed_iceberg_default-flag) controls what happens, starting in `dbt-snowflake` v1.12. It defaults to `false`:

- **`false` (default)** &mdash; dbt doesn't emit `external_volume`. Snowflake falls back to any [default external volume](https://docs.snowflake.com/user-guide/tables-iceberg-configure-external-volume#set-a-default-external-volume-at-the-account-database-or-schema-level) set at the account, database, or schema level, and dbt still generates a `base_location`.
- **`true`** &mdash; dbt emits `external_volume = 'SNOWFLAKE_MANAGED'` and omits `base_location`.

</VersionBlock>

Setting `external_volume` to `SNOWFLAKE_MANAGED` always omits `base_location`, in any version. dbt resolves `external_volume` from the model config first, then from the catalog definition in `catalogs.yml`, so setting it in either place has this effect. When `external_volume` names a user-defined volume (such as an S3 bucket), dbt emits both `external_volume` and `base_location`.

#### Extensible: Configure `horizon` catalog

First, configure a catalog with `type: horizon` in `catalogs.yml`:

<Tabs defaultValue="new" values={[
  { label: 'New spec (beta)', value: 'new' },
  { label: 'Old spec', value: 'old' }
]}>
<TabItem value="new">

<File name='catalogs.yml'>

```yaml

catalogs:
  - name: my_horizon_catalog
    type: horizon
    table_format: iceberg  # optional - default
    config:
      snowflake:
        # optional - specify additional Snowflake-specific configurations
        change_tracking: true
        iceberg_version: 3  # available in v1.12+
```

</File>

</TabItem>

<TabItem value="old">

<File name='catalogs.yml'>

```yml
catalogs:
  - name: my_horizon_catalog
    active_write_integration: snowflake_write_integration
    write_integrations:
      - name: snowflake_write_integration
        external_volume: dbt_external_volume
        table_format: iceberg
        catalog_type: built_in
        adapter_properties:
          change_tracking: True
          iceberg_version: 3  # available in v1.12+
```

</File>

</TabItem>

</Tabs>

Next, configure a dbt model with the name of your Horizon catalog.

<File name='models/my_iceberg_model.sql'>

```sql

{{
    config(
        materialized='table',
        catalog_name='my_horizon_catalog',
        iceberg_version=3,  # available in v1.12+
    )
}}

select * from {{ ref('jaffle_shop_customers') }}

```

</File>

Finally, run the model: `dbt run -s my_iceberg_model`. Because dbt understands that `type: horizon` refers to Snowflake's managed catalog, dbt templates the appropriate Snowflake DDL/DML for creating and updating managed Iceberg tables.

### External catalogs

dbt can also template Snowflake DDL/DML for creating and updating Iceberg tables managed by external catalogs.

First, you need to set up a catalog integration and (recommended) catalog-linked database within Snowflake. See Snowflake docs for how to [create a catalog integration](https://docs.snowflake.com/en/sql-reference/sql/create-catalog-integration) and [catalog-linked database](https://docs.snowflake.com/en/sql-reference/sql/create-database-catalog-linked).

Caveats:
- For some external catalogs (for example, AWS Glue), table and column identifiers must use only alphanumeric characters (letters and numbers), be lowercase, and surrounded by double quotes.
- Starting in dbt Core v1.11, dbt-snowflake supports basic table materialization on Iceberg tables registered in a Glue catalog through a catalog-linked database. Note that incremental materializations aren't yet supported.

After you create the external catalog integration, you can do two things:

- **Query an externally managed table:** Snowflake can query Iceberg tables whose metadata lives in the external catalog. In this scenario, Snowflake is a "reader" of the external catalog. The table’s data remains in external cloud storage (AWS S3 or GCP Bucket) as defined in the catalog storage configuration. Snowflake uses the catalog integration to fetch metadata using the REST API. Snowflake then reads the data files from cloud storage.

- **Write tables to the external catalog, using Snowflake compute:** You can materialize a dbt model as an Iceberg table using Snowflake's compute, and Snowflake registers and syncs that table to the external catalog (for example, AWS Glue or Databricks Unity). The dbt model appears in that catalog, and other query engines can read its data there.

Now, we can configure that external catalog in `catalogs.yml`. Here is an example for an AWS Glue catalog:

<Tabs defaultValue="new" values={[
  { label: 'New spec (beta)', value: 'new' },
  { label: 'Old spec', value: 'old' }
]}>
<TabItem value="new">

<File name='catalogs.yml'>

```yaml

catalogs:
  - name: my_glue_catalog
    type: glue
    table_format: iceberg
    config:
      snowflake:
        catalog_database: catalog_linked_db_glue  # name of catalog-linked database in Snowflake
```

</File>

</TabItem>

<TabItem value="old">

<File name='catalogs.yml'>

```yml
catalogs:
  - name: my_glue_catalog
    active_write_integration: glue_rest
    write_integrations:
      - name: glue_rest
        catalog_type: iceberg_rest
        table_format: iceberg
        adapter_properties:
          catalog_linked_database: catalog_linked_db_glue  # name of catalog-linked database in Snowflake
          catalog_linked_database_type: glue
```

</File>

</TabItem>

</Tabs>

## Snowflake-specific configs for Iceberg catalogs

These are the additional configurations, specific to Snowflake, that can be supplied and nested under `config.snowflake` (in the new catalog spec) or `adapter_properties` (in the old catalog spec). Available configurations are different when writing dbt models as Snowflake-managed Iceberg tables (Snowflake Horizon catalog) versus writing to external catalogs.

#### Snowflake-managed (Horizon)

<VersionBlock lastVersion="1.11">

| Field | Required | Accepted values |
| --- | --- | --- |
| `change_tracking` | Optional | `True` or `False`    |
| `data_retention_time_in_days` | Optional | Standard Account: `1`, Enterprise or higher: `0` to `90`, default `1`  |
| `max_data_extension_time_in_days` | Optional |  `0` to `90` with a default of `14`  |
| `storage_serialization_policy` | Optional | `COMPATIBLE` or `OPTIMIZED`     |
| `base_location_root` | Optional | Relative path segment (for example, `'subpath1/subpath2'`) |
| `base_location_subpath` | Optional | Relative path segment (for example, `'subpath1/subpath2'`), only configurable per-model |

</VersionBlock>

<VersionBlock firstVersion="1.12">

| Field | Required | Accepted values |
| --- | --- | --- |
| `change_tracking` | Optional | `True` or `False`    |
| `data_retention_time_in_days` | Optional | Standard Account: `1`, Enterprise or higher: `0` to `90`, default `1`  |
| `max_data_extension_time_in_days` | Optional |  `0` to `90` with a default of `14`  |
| `storage_serialization_policy` | Optional | `COMPATIBLE` or `OPTIMIZED`     |
| `base_location_root` | Optional | Relative path segment (for example, `'subpath1/subpath2'`) |
| `base_location_subpath` | Optional | Relative path segment (for example, `'subpath1/subpath2'`), only configurable per-model |
| `iceberg_version` (v1.12+) | Optional | `2` (default) or `3` |

</VersionBlock>

#### External catalogs

<VersionBlock lastVersion="1.11">

| Field | Required | Accepted values |
| --- | --- | --- |
| `auto_refresh` | Optional | `True` or `False`    |
| `catalog_linked_database` | Required for `catalog type: iceberg_rest` | Catalog-linked database name   |
| `catalog_linked_database_type` | Optional | Catalog-linked database type. For example, `glue`  |
| `max_data_extension_time_in_days` | Optional |  `0` to `90` (default: `14`)  |
| `target_file_size` | Optional | Values like `'AUTO'`, `'16MB'`, `'32MB'`, `'64MB'`, `'128MB'`. Case-insensitive  |

</VersionBlock>

<VersionBlock firstVersion="1.12">

| Field | Required | Accepted values |
| --- | --- | --- |
| `auto_refresh` | Optional | `True` or `False`    |
| `catalog_linked_database` | Required for `catalog type: iceberg_rest` | Catalog-linked database name   |
| `catalog_linked_database_type` | Optional | Catalog-linked database type. For example, `glue`  |
| `max_data_extension_time_in_days` | Optional |  `0` to `90` (default: `14`)  |
| `target_file_size` | Optional | Values like `'AUTO'`, `'16MB'`, `'32MB'`, `'64MB'`, `'128MB'`. Case-insensitive  |
| `iceberg_version` (v1.12+) | Optional | `2` (default) or `3` |

</VersionBlock>

-  **storage_serialization_policy:** The serialization policy tells Snowflake what kind of encoding and compression to perform on the table data files. If not specified at table creation, the table inherits the value set at the schema, database, or account level. If the value isn’t specified at any level, the table uses the default value. You can’t change the value of this parameter after table creation.
- **max_data_extension_time_in_days:** The maximum number of days Snowflake can extend the data retention period for tables to prevent streams on the tables from becoming stale. The `MAX_DATA_EXTENSION_TIME_IN_DAYS` parameter enables you to limit this automatic extension period to control storage costs for data retention, or for compliance reasons. 
- **data_retention_time_in_days:** For managed Iceberg tables, you can set a retention period for Snowflake Time Travel and undropping the table over the default account values. For tables that use an external catalog, Snowflake uses the value of the DATA_RETENTION_TIME_IN_DAYS parameter to set a retention period for Snowflake Time Travel and undropping the table. When the retention period expires, Snowflake doesn't delete the Iceberg metadata or snapshots from your external cloud storage.
- **change_tracking:** Specifies whether to enable change tracking on the table.
- **catalog_linked_database:** [Catalog-linked databases](https://docs.snowflake.com/en/user-guide/tables-iceberg-catalog-linked-database) (CLD) in Snowflake ensure that Snowflake can automatically sync metadata (including namespaces and Iceberg tables) from the external Iceberg catalog and registers them as remote tables in the catalog-linked database. The reason we require the usage of Catalog-linked databases for building Iceberg tables with external catalogs is that without it, dbt is unable to truly manage the table end-to-end. Snowflake doesn't support dropping the Iceberg table on non-CLDs in the external catalog; instead, it only allows unlinking the Snowflake table, which creates a discrepancy with how dbt expects to manage the materialized object.
- **auto_refresh:** Specifies whether Snowflake should automatically poll the external Iceberg catalog for metadata updates. If `REFRESH_INTERVAL_SECONDS` isn’t set on the catalog integration, the default refresh interval is 30 seconds. 
- **target_file_size:** Specifies a target Parquet file size. Default is `AUTO`.
<VersionBlock firstVersion="1.12">
- **iceberg_version:** Specifies the Iceberg format version for the table. Default value is `2`. Set to `3` for improved support for `VARIANT` data types and faster incremental operations. Version 3 uses [deletion vectors](https://docs.snowflake.com/en/user-guide/tables-iceberg-manage#tables-iceberg-deletion-vectors), which let Snowflake mark rows as deleted without rewriting the underlying data files, making incremental runs faster. Note that you can't change the Iceberg version after table creation. As an alternative, you can [configure the default Iceberg version](https://docs.snowflake.com/en/user-guide/tables-iceberg-v3-specification-support#configure-the-default-iceberg-version) at the account, database, or schema level in Snowflake.
</VersionBlock>

- **base_location_root:** Specifies the prefix of the [`BASE_LOCATION`](https://docs.snowflake.com/en/sql-reference/sql/create-iceberg-table-snowflake#optional-parameters), the write path for the Iceberg table.
- **base_location_subpath:** Specifies the suffix of the [`BASE_LOCATION`](https://docs.snowflake.com/en/sql-reference/sql/create-iceberg-table-snowflake#optional-parameters), the write path for the Iceberg table. This property can only be set in model configurations, not in `catalogs.yml`.

### Base location 

Snowflake's `CREATE ICEBERG TABLE` DDL requires that a `base_location` be provided when using a custom external volume. dbt defines this parameter on the user's behalf to streamline usage and enforce basic isolation of table data within the `EXTERNAL VOLUME`. The default behavior in dbt is to provide a `base_location` string of the form: `_dbt/{SCHEMA_NAME}/{MODEL_NAME}`. No `base_location` is required when no external volume is provided or when `external_volume` is set to `SNOWFLAKE_MANAGED_STORAGE`.

Snowflake rejects `BASE_LOCATION` for Iceberg tables that use Snowflake-managed storage, so dbt omits it when `external_volume` is set to `SNOWFLAKE_MANAGED`. dbt also omits it when you leave `external_volume` unset, depending on your version &mdash; refer to [External volume defaults](#external-volume-defaults).

We recommend using the default behavior, but if you need to customize the resulting `base_location`, you can configure the `base_location` with the model configuration fields `base_location_root` and `base_location_subpath`. <VersionBlock firstVersion="2.0"> `base_location_subpath` is only accepted in model configurations. </VersionBlock>

- If no inputs are provided, dbt outputs for base_location `{{ external_volume }}/_dbt/{{ schema }}/{{ model_name }}`
- If base_location_root = `foo`, dbt outputs `{{ external_volume }}/foo/{{ schema }}/{{ model_name }}`
- If base_location_subpath = `bar`, dbt outputs `{{ external_volume }}/_dbt/{{ schema }}/{{ model_name }}/bar`
- If base_location_root = `foo` and base_location_subpath = `bar`, dbt outputs `{{ external_volume }}/foo/{{ schema }}/{{ model_name }}/bar`

While you can customize paths with `base_location_root` and `base_location_subpath`, we don't recommend you rely on these for environment isolation (such as separating development and production environments). These configuration values can be easily modified by anyone with repository access. For true environment isolation, use separate `EXTERNAL VOLUME`s with infrastructure-level access controls.

An example model with a customized `base_location`:

<File name='iceberg_model.sql'>

```sql

{{
    config(
        materialized='table',
        catalog_name='my_horizon_catalog',
        base_location_root='foo',
        base_location_subpath='bar',

    )
}}

select * from {{ ref('jaffle_shop_customers') }}
```

</File>

<BaseLocationEnvIsolation />

#### Rationale

By default, dbt manages `base_location` on behalf of users to enforce best practices. With Snowflake-managed Iceberg format tables, the user owns and maintains the data storage of the tables in an external storage solution (the declared `external volume`). The `base_location` parameter declares where to write the data within the external volume. The Snowflake Iceberg catalog keeps track of your Iceberg table regardless of where the data lives within the `external volume` declared and the `base_location` provided. However, Snowflake permits passing anything into the `base_location` field, including an empty string, even reusing the same path across multiple tables. This behavior could result in future technical debt because it limits the ability to:

- Navigate the underlying object store (S3/Azure blob)
- Read Iceberg tables through an object-store integration
- Grant schema-specific access to tables through object store
- Use a crawler pointed at the tables within the external volume to build a new catalog with another tool

To maintain best practices, dbt enforces an input and, by default, writes your tables within a `_dbt/{SCHEMA_NAME}/{TABLE_NAME}` prefix to ensure easier object-store observability and auditability.

### Limitations

-  When you use Iceberg tables with dbt, dbt materializes your query in Iceberg. However, dbt often creates intermediary objects as temporary and transient tables for certain materializations, such as incremental ones. You can't configure these temporary objects to be Iceberg-formatted. You may see non-Iceberg tables created in the logs to support specific materializations, but they are dropped after usage.
- You can't incrementally update a pre-existing incremental model to be an Iceberg table. To do so, you must fully rebuild the table with the `--full-refresh` flag.
- As of Snowflake change bundle `2025-01`, the `SHOW TABLES` command doesn't include the `is_iceberg` column in its output. This forced dbt v1.9 to run a command similar to the following query for all the models in the dbt project (regardless of whether they're configured as `iceberg` models):

    ```sql
    select all_objects.*, is_iceberg
    from table(result_scan(last_query_id(-1))) all_objects
    left join INFORMATION_SCHEMA.tables as all_tables
    on all_tables.table_name = all_objects."name"
    and all_tables.table_schema = all_objects."schema_name"
    and all_tables.table_catalog = all_objects."database_name"
    ``` 
    
    This query may be relatively inefficient and potentially expensive, depending on the size of your Snowflake warehouse. Thus, the ability to run Iceberg models is gated behind the `enable_iceberg_materializations` flag.
