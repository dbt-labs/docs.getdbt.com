---
title: "Snowflake and Apache Iceberg"
id: snowflake-iceberg-support
sidebar_label: "Snowflake Iceberg support"
description: Understand Snowflake support for Apache Iceberg.
---

dbt supports materializing the table in Iceberg table format in two different ways:

- The model configuration field `table_format = 'iceberg'` (legacy)
- Catalog integration can be configured in the SQL config (inside the `.sql` model file), property file (model folder), or project file ([`dbt_project.yml`](/reference/dbt_project.yml)) 

:::info Catalog integration configuration

You need to create a `catalogs.yml` file to use the integration and apply that integration on the config level.

Refer to [Configure catalog integration](#configure-catalog-integration-for-managed-iceberg-tables) for more information.

:::

We recommend using the Iceberg catalog configuration and applying the catalog in the model config for ease of use and to future-proof your code. Using `table_format = 'iceberg'` directly on the model configuration is a legacy approach and limits usage to just Snowflake Horizon as the catalog. Catalog support is available on dbt 1.10+.

## Creating Iceberg tables

dbt supports creating Iceberg tables for three of the Snowflake materializations: 

- [Table](/docs/build/materializations#table)
- [Incremental](/docs/build/materializations#incremental)
- [Dynamic Table](/reference/resource-configs/snowflake-configs#dynamic-tables) 

## Iceberg catalogs

Snowflake has support for Iceberg tables via built-in and external catalogs, including:
- Snowflake Horizon (the built-in catalog) 
- Polaris/Open Catalog (managed Polaris)
- Glue Data Catalog (Not supported in dbt-snowflake)
- Iceberg REST Compatible 

dbt supports the Snowflake built-in catalog and Iceberg REST-compatible catalogs (including Polaris and Unity Catalog) on dbt-snowflake. 

To use an externally managed catalog (anything outside of the built-in catalog), you must set up a catalog integration. To do so, you must run a SQL command similar to the following. 


### External catalogs

Example configurations for external catalogs.

<Tabs>

<TabItem value="Polaris/Open Catalog">

You must set up a catalog integration to use Polaris/Open Catalog (managed Polaris). 

Example code:

```sql

CREATE CATALOG INTEGRATION my_polaris_catalog_int 
  CATALOG_SOURCE = POLARIS 
  TABLE_FORMAT = ICEBERG 
  REST_CONFIG = (
    CATALOG_URI = 'https://<org>-<account>.snowflakecomputing.com/polaris/api/catalog' 
    CATALOG_NAME = '<open_catalog_name>' 
  ) 
  REST_AUTHENTICATION = (
    TYPE = OAUTH 
    OAUTH_CLIENT_ID = '<client_id>' 
    OAUTH_CLIENT_SECRET = '<client_secret>' 
    OAUTH_ALLOWED_SCOPES = ('PRINCIPAL_ROLE:ALL') 
  ) 
  ENABLED = TRUE;

```

Executing this will register the external Polaris catalog with Snowflake. Once configured, dbt can create Iceberg tables in Snowflake that register the existence of the new database object with the catalog as metadata and query Polaris-managed tables. 

</TabItem>

<TabItem value="Glue data catalog" >

To configure Glue Data Catalog as the external catalog, you will need to set up two prerequisites:

- **Create AWS IAM Role for Glue Access:** Configure AWS permissions so Snowflake can read the Glue Catalog. This typically means creating an AWS IAM role that Snowflake will assume, with policies allowing Glue catalog read operations (at minimum, `glue:GetTable` and `glue:GetTables` on the relevant Glue databases). Attach a trust policy to enable Snowflake to assume this role (via an external ID).


- **Set up the catalog integration:** In Snowflake, create a catalog integration of type GLUE. This registers the Glue Data Catalog information and the IAM role with Snowflake. For example:

```sql

CREATE CATALOG INTEGRATION my_glue_catalog_int
  CATALOG_SOURCE = GLUE
  CATALOG_NAMESPACE = 'dbt_database' 
  TABLE_FORMAT = ICEBERG
  GLUE_AWS_ROLE_ARN = 'arn:aws:iam::123456789012:role/myGlueRole'
  GLUE_CATALOG_ID = '123456789012'
  GLUE_REGION = 'us-east-2'
  ENABLED = TRUE;

```
Glue Data Catalog supports the Iceberg REST specification so that you can connect to Glue via the Iceberg REST API.

</TabItem>

<TabItem value="Iceberg REST API">

You can set up an integration for your catalogs that are compatible with the open-source Apache Iceberg REST  specification, 

Example code: 

```sql

CREATE CATALOG INTEGRATION my_iceberg_catalog_int
  CATALOG_SOURCE = ICEBERG_REST
  TABLE_FORMAT = ICEBERG
  CATALOG_NAMESPACE = 'dbt_database'
  REST_CONFIG = (
    restConfigParams
  )
  REST_AUTHENTICATION = (
    restAuthenticationParams
  )
  ENABLED = TRUE
  REFRESH_INTERVAL_SECONDS = <value> 
  COMMENT = 'catalog integration for dbt iceberg tables'

```

For Unity Catalog with a bearer token :

```sql

CREATE OR REPLACE CATALOG INTEGRATION my_unity_catalog_int_pat
  CATALOG_SOURCE = ICEBERG_REST
  TABLE_FORMAT = ICEBERG
  CATALOG_NAMESPACE = 'my_namespace'
  REST_CONFIG = (
    CATALOG_URI = 'https://my-api/api/2.1/unity-catalog/iceberg'
    CATALOG_NAME= '<catalog_name>'
  )
  REST_AUTHENTICATION = (
    TYPE = BEARER
    BEARER_TOKEN = '<bearer_token>'
  )
  ENABLED = TRUE;

```

</TabItem>

</Tabs>

After you have created the external catalog integration, you will be able to do two things:

- **Query an externally managed table:** Snowflake can query Iceberg tables whose metadata lives in the external catalog. In this scenario, Snowflake is a "reader" of the external catalog. The table’s data remains in external cloud storage (AWS S3 or GCP Bucket) as defined in the catalog storage configuration. Snowflake will use the catalog integration to fetch metadata via the REST API. Snowflake then reads the data files from cloud storage.

- **Sync Snowflake-managed tables to an external catalog:** You can create a Snowflake Iceberg table that Snowflake manages via a cloud storage location and then register/sync that table to the external catalog. This allows other engines to discover the table.

## dbt Catalog integration configurations for Snowflake

The following table outlines the configuration fields required to set up a catalog integration for [Iceberg tables in Snowflake](/reference/resource-configs/snowflake-configs#iceberg-table-format).

| Field            | Required | Accepted values                                                                         |
|------------------|----------|-----------------------------------------------------------------------------------------|
| `name`           | yes      | Name of catalog integration                                                             |
| `catalog_name`   | yes      | The name of the catalog integration in Snowflake. For example, `my_dbt_iceberg_catalog`)|
| `external_volume`| yes      | `<external_volume_name>`                                                                |
| `table_format`   | yes      | `iceberg`                                                                               |
| `catalog_type`   | yes      | `built_in`, `iceberg_rest`                                                             |
| `adapter_properties`| optional| See below                                                                    |

You can connect to external Iceberg-compatible catalogs, such as Polaris and Unity Catalog, via the Iceberg REST `catalog_type`. Please note that we only support Iceberg REST with [Catalog Linked Databases](https://docs.snowflake.com/en/user-guide/tables-iceberg-catalog-linked-database). 

### Adapter properties

These are the additional configurations, unique to Snowflake, that can be supplied and nested under `adapter_properties`. 

#### Built-in catalog

<VersionBlock lastVersion="1.99">
| Field | Required | Accepted values |
| --- | --- | --- |
| `change_tracking` | Optional | `True` or `False`    |
| `data_retention_time_in_days` | Optional | Standard Account: `1`, Enterprise or higher: `0` to `90`, default `1`  |
| `max_data_extension_time_in_days` | Optional |  `0` to `90` with a default of `14`  |
| `storage_serialization_policy` | Optional | `COMPATIBLE` or `OPTIMIZED`     |
</VersionBlock>
<VersionBlock firstVersion="2.0">
| Field | Required | Accepted values |
| --- | --- | --- |
| `change_tracking` | Optional | `True` or `False`    |
| `data_retention_time_in_days` | Optional | Standard Account: `1`, Enterprise or higher: `0` to `90`, default `1`  |
| `max_data_extension_time_in_days` | Optional |  `0` to `90` with a default of `14`  |
| `storage_serialization_policy` | Optional | `COMPATIBLE` or `OPTIMIZED`     |
| `base_location_root` | Optional | relative path segment (like `'subpath1/subpath2'`) |
| `base_location_subpath` | Optional | relative path segment (like `'subpath1/subpath2'`), only configurable per-model |
</VersionBlock>

#### REST catalog

| Field | Required | Accepted values |
| --- | --- | --- |
| `auto_refresh` | Optional | `True` or `False`    |
| `catalog_linked_database` | Required for `catalog type: iceberg_rest`. | catalog linked database name.   |
| `max_data_extension_time_in_days` | Optional |  `0` to `90` with a default of `14`  |
| `target_file_size` | Optional | values like `'AUTO'`, `'16MB'`, `'32MB'`, `'64MB'`, `'128MB'`, etc., case insensitive  |

-  **storage_serialization_policy:** The serialization policy tells Snowflake what kind of encoding and compression to perform on the table data files. If not specified at table creation, the table inherits the value set at the schema, database, or account level. If the value isn’t specified at any level, the table uses the default value. You can’t change the value of this parameter after table creation.
- **max_data_extension_time_in_days:** The maximum number of days Snowflake can extend the data retention period for tables to prevent streams on the tables from becoming stale. The `MAX_DATA_EXTENSION_TIME_IN_DAYS` parameter enables you to limit this automatic extension period to control storage costs for data retention, or for compliance reasons. 
- **data_retention_time_in_days:** For managed Iceberg tables, you can set a retention period for Snowflake Time Travel and undropping the table over the default account values. For tables that use an external catalog, Snowflake uses the value of the DATA_RETENTION_TIME_IN_DAYS parameter to set a retention period for Snowflake Time Travel and undropping the table. When the retention period expires, Snowflake does not delete the Iceberg metadata or snapshots from your external cloud storage.
- **change_tracking:** Specifies whether to enable change tracking on the table.
- **catalog_linked_database:** [Catalog-linked databases](https://docs.snowflake.com/en/user-guide/tables-iceberg-catalog-linked-database) (CLD) in Snowflake ensures that Snowflake can automatically sync metadata (including namespaces and iceberg tables) from the external Iceberg Catalog and registers them as remote tables in the catalog-linked database. The reason we require the usage of Catalog-linked databases for building Iceberg tables with external catalogs is that without it, dbt will be unable to truly manage the table end-to-end. Snowflake does not support dropping the Iceberg table on non-CLDs in the external catalog; instead, it only allows unlinking the Snowflake table, which creates a discrepancy with how dbt expects to manage the materialized object.
- **auto_refresh:** Specifies whether Snowflake should automatically poll the external Iceberg catalog for metadata updates. If `REFRESH_INTERVAL_SECONDS` isn’t set on the catalog integration, the default refresh interval is 30 seconds. 
- **target_file_size:** Specifies a target Parquet file size. Default is `AUTO`.

<VersionBlock firstVersion="2.0">
You can set the following properties in model configurations under the `adapter_properties` field, or as top-level fields themselves. If present in both places, the value set under `adapter_properties` takes precedence. Refer to [Base location](#base-location) for more information.
- **base_location_root:** Specifies the prefix of the [`BASE_LOCATION`](https://docs.snowflake.com/en/sql-reference/sql/create-iceberg-table-snowflake#optional-parameters), the write path for the Iceberg table.
- **base_location_subpath:** Specifies the suffix of the [`BASE_LOCATION`](https://docs.snowflake.com/en/sql-reference/sql/create-iceberg-table-snowflake#optional-parameters), the write path for the Iceberg table. This property can only be set in model configurations, not in `catalogs.yml`.
</VersionBlock>

### Configure catalog integration for managed Iceberg tables

1. Create a `catalogs.yml` at the top level of your dbt project.<br />
<br />An example of Snowflake Horizon as the catalog:

```yaml

catalogs:
  - name: catalog_horizon
    active_write_integration: snowflake_write_integration
    write_integrations:
      - name: snowflake_write_integration
        external_volume: dbt_external_volume
        table_format: iceberg
        catalog_type: built_in
        adapter_properties:
          change_tracking: True

```

2. Add the `catalog_name` config parameter in either the SQL config (inside the .sql model file), property file (model folder), or your `dbt_project.yml`. <br />
<br />An example of `iceberg_model.sql`:

```sql

{{
    config(
        materialized='table',
        catalog_name = 'catalog_horizon'

    )
}}

select * from {{ ref('jaffle_shop_customers') }}

```

3. Execute the dbt model with a `dbt run -s iceberg_model`.

For more information, refer to our documentation on [Snowflake configurations](/reference/resource-configs/snowflake-configs).

### Limitations

For external catalogs, Snowflake only supports `read`, which means it can query the table but cannot insert or modify data. 

The syncing experience will be different depending on the catalog you choose. Some catalogs are automatically refreshed, and you can set parameters to do so with your catalog integration. Other catalogs might require a separate job to manage the metadata sync. 

<VersionBlock firstVersion="1.9">

## Iceberg table format

The dbt-snowflake adapter also supports applying `table_format` as a standalone configuration for dbt-snowflake models. We recommend against using this, as it is a legacy behavior, and you will only be able to write to Snowflake Horizon (not external Iceberg catalogs).

The following configurations are supported.
For more information, check out the Snowflake reference for [`CREATE ICEBERG TABLE` (Snowflake as the catalog)](https://docs.snowflake.com/en/sql-reference/sql/create-iceberg-table-snowflake).

| Parameter | Type   | Required | Description   | Sample input | Note   |
| ------ | ----- | -------- | ------------- | ------------ | ------ |
| `table_format` | String | Yes     | Configures the objects table format.  | `iceberg`  | `iceberg` is the only accepted value.    |
| `external_volume` | String | Yes(*)   | Specifies the identifier (name) of the external volume where Snowflake writes the Iceberg table's metadata and data files. | `my_s3_bucket`            | *You don't need to specify this if the account, database, or schema already has an associated external volume. [More info](https://docs.snowflake.com/user-guide/tables-iceberg-configure-external-volume#set-a-default-external-volume-at-the-account-database-or-schema-level) |
| `base_location_root` | String  | No  | If provided, the input will override the default dbt base_location value of `_dbt` |
| `base_location_subpath` | String | No       | An optional suffix to add to the `base_location` path that dbt automatically specifies.     | `jaffle_marketing_folder` | We recommend that you do not specify this. Modifying this parameter results in a new Iceberg table. See [Base Location](#base-location) for more info.                                                                                                  |

### Example configuration

To configure an Iceberg table materialization in dbt, refer to the example configuration:

<File name='models/<modelname>.sql'>

```sql

{{
  config(
    materialized = "table",
    table_format="iceberg",
    external_volume="s3_iceberg_snow",
  )
}}

select * from {{ ref('raw_orders') }}

```

</File>

### Base location 

<VersionBlock lastVersion="1.99">
Snowflake's `CREATE ICEBERG TABLE` DDL requires that a `base_location` be provided. dbt defines this parameter on the user's behalf to streamline usage and enforce basic isolation of table data within the `EXTERNAL VOLUME`. The default behavior in dbt is to provide a `base_location` string of the form: `_dbt/{SCHEMA_NAME}/{MODEL_NAME}`. 

We recommend using the default behavior, but if you need to customize the resulting `base_location`, dbt allows users to configure the base_location with the model configuration fields `base_location_root` and `base_location_subpath`.

- If no inputs are provided, dbt will output for base_location `{{ external_volume }}/_dbt/{{ schema }}/{{ model_name }}`
- If base_location_root = `foo`, dbt will output `{{ external_volume }}/foo/{{ schema }}/{{ model_name }}`
- If base_location_subpath = `bar`, dbt will output `{{ external_volume }}/_dbt/{{ schema }}/{{ model_name }}/bar`
- If base_location = `foo` and base_location_subpath = `bar`, dbt will output `{{ external_volume }}/foo/{{ schema }}/{{ model_name }}/bar`

While you can customize paths with `base_location_root` and `base_location_subpath`, we don't recommend you rely on these for environment isolation (such as separating development and production environments). These configuration values can be easily modified by anyone with repository access. For true environment isolation, use separate `EXTERNAL VOLUME`s with infrastructure-level access controls.

#### Example configurations

An example model with a customized `base_location`:

<File name='iceberg_model.sql'>

```sql

{{
    config(
        materialized='table',
        catalog_name='catalog_horizon',
        base_location_root='foo',
        base_location_subpath='bar',

    )
}}

select * from {{ ref('jaffle_shop_customers') }}
```

</File>

</VersionBlock>

<VersionBlock firstVersion="2.0">
Snowflake's `CREATE ICEBERG TABLE` DDL requires that a `base_location` be provided. dbt defines this parameter on the user's behalf to streamline usage and enforce basic isolation of table data within the `EXTERNAL VOLUME`. The default behavior in dbt is to provide a `base_location` string of the form: `_dbt/{SCHEMA_NAME}/{MODEL_NAME}`.

We recommend using the default behavior, but if you need to customize the resulting `base_location`, dbt allows you to configure the base_location with the adapter properties `base_location_root` and `base_location_subpath`. `base_location_subpath` is only accepted in model configurations. Refer to [Adapter Properties](#adapter-properties) for more information.

- If no inputs are provided, dbt will output for base_location `{{ external_volume }}/_dbt/{{ schema }}/{{ model_name }}`
- If base_location_root = `foo`, dbt will output `{{ external_volume }}/foo/{{ schema }}/{{ model_name }}`
- If base_location_subpath = `bar`, dbt will output `{{ external_volume }}/_dbt/{{ schema }}/{{ model_name }}/bar`
- If base_location = `foo` and base_location_subpath = `bar`, dbt will output `{{ external_volume }}/foo/{{ schema }}/{{ model_name }}/bar`

A theoretical (but not recommended) use case is re-using an `EXTERNAL VOLUME` while maintaining isolation across development and production environments. We recommend against this as storage permissions should configured on the external volume and underlying storage, not paths that any analytics engineer can modify.

#### Example configurations

An example model with a customized `base_location`:

<File name='iceberg_model.sql'>

```sql

{{
    config(
        materialized='table',
        catalog_name='catalog_horizon',
        adapter_properties={
          'base_location_root': 'foo',
          'base_location_subpath': 'bar',
        }

    )
}}

select * from {{ ref('jaffle_shop_customers') }}
```

</File>

:::info Legacy model configuration for base_location

For backwards compatibility, dbt <Constant name="fusion"/> also supports setting `base_location_root` and `base_location_subpath` as top-level model configuration fields. `adapter_properties` configs take precedence over legacy configs.

For example, in the following model config, `base_location_root`=`bar` overrides `base_location_root`=`foo`.

```sql
config(
    materialized='table',
    catalog_name='catalog_horizon',
    'base_location_root': 'foo',
    'base_location_subpath': 'bar',
    adapter_properties={
      'base_location_root': 'bar',
    },
)
```
This configuration results in: `base_location` = `{{ external_volume }}/bar/{{ schema }}/{{ model_name }}/bar`
:::

</VersionBlock>


#### Rationale

By default, dbt manages `base_location` on behalf of users to enforce best practices. With Snowflake-managed Iceberg format tables, the user owns and maintains the data storage of the tables in an external storage solution (the declared `external volume`). The `base_location` parameter declares where to write the data within the external volume. The Snowflake Iceberg catalog keeps track of your Iceberg table regardless of where the data lives within the `external volume` declared and the `base_location` provided. However, Snowflake permits passing anything into the `base_location` field, including an empty string, even reusing the same path across multiple tables. This behavior could result in future technical debt because it will limit the ability to:

- Navigate the underlying object store (S3/Azure blob)
- Read Iceberg tables via an object-store integration
- Grant schema-specific access to tables via object store
- Use a crawler pointed at the tables within the external volume to build a new catalog with another tool

To maintain best practices,  dbt enforces an input and, by default, writes your tables within a `_dbt/{SCHEMA_NAME}/{TABLE_NAME}` prefix to ensure easier object-store observability and auditability.

### Limitations

You should be aware of these limitations to the implementation:

-  When you use Iceberg tables with dbt, your query is materialized in Iceberg. However, dbt often creates intermediary objects as temporary and transient tables for certain materializations, such as incremental ones. It is not possible to configure these temporary objects to be Iceberg-formatted. You may see non-Iceberg tables created in the logs to support specific materializations, but they will be dropped after usage.
- You cannot incrementally update a pre-existing incremental model to be an Iceberg table. To do so, you must fully rebuild the table with the `--full-refresh` flag.
- As of Snowflake change bundle `2025-01`, the `SHOW TABLES` command does not include the `is_iceberg` column in its output. This forced dbt v1.9 to run a command similar to the following query for all the models in the dbt project (regardless of whether they're configured as `iceberg` models):

    ```sql
    select all_objects.*, is_iceberg
    from table(result_scan(last_query_id(-1))) all_objects
    left join INFORMATION_SCHEMA.tables as all_tables
    on all_tables.table_name = all_objects."name"
    and all_tables.table_schema = all_objects."schema_name"
    and all_tables.table_catalog = all_objects."database_name"
    ``` 
    
    This query may be relatively inefficient and potentially expensive, depending on the size of your Snowflake warehouse. Thus, the ability to run iceberg models is gated behind the `enable_iceberg_materializations` flag.

</VersionBlock>
