---
title: "Snowflake and Apache Iceberg"
id: snowflake-iceberg-support
sidebar_label: "Snowflake Iceberg support"
description: Understand Snowflake support for Apache Iceberg.
---

dbt supports materializing the table in Iceberg table format in two different ways:

- the model configuration field table_format = 'iceberg' (legacy)
- catalog integration in the model/resource/dbt_project.yml configuration

We recommend that you use the Iceberg catalog configuration and apply the catalog in the model config for ease of use and future-proof your code. Using table_format = 'iceberg' directly on the model configuration is a legacy approach. 

## Creating Iceberg Tables

dbt supports creating Iceberg tables for three of the Snowflake materializations: 

- [Table](/docs/build/materializations#table)
- [Incremental](/docs/build/materializations#incremental)
- [Dynamic Table](#dynamic-tables) 

## Iceberg catalogs

Snowflake has support for Iceberg tables via built-in and external catalogs, including:
- Snowflake built-in catalog (metadata managed by Snowflake’s built-in information schema)
- Polaris/Open Catalog (managed Polaris)*
- Glue Data Catalog*
- Iceberg REST Compatible* 

*_dbt catalog support coming soon._


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

- **Create AWS IAM Role for Glue Access:** Configure AWS permissions so Snowflake can read the Glue Catalog. This typically means creating an AWS IAM role that Snowflake will assume, with policies allowing Glue catalog read operations (at minimum, glue:GetTable and glue:GetTables on the relevant Glue databases). Attach a trust policy to enable Snowflake to assume this role (via an external ID).


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

You can set up a catalog integration for or Catalogs that are compatible with the open-source Apache Iceberg™ REST  specification, 

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

## dbt Catalog Integration Configurations for Snowflake

The following table outlines the configuration fields required to set up a catalog integration for [Iceberg tables in Snowflake](/reference/resource-configs/snowflake-configs#iceberg-table-format).

| Field            | Required | Accepted values                                                                         |
|------------------|----------|-----------------------------------------------------------------------------------------|
| `name`           | yes      | Name of catalog integration                                                             |
| `catalog_name`   | yes      | The name of the catalog integration in Snowflake. For example, `my_dbt_iceberg_catalog`)|
| `external_volume`| yes      | `<external_volume_name>`                                                                |
| `table_format`   | yes      | `iceberg`                                                                               |
| `catalog_type`   | yes      | `built_in`, `iceberg_rest`*                                                             |

*Coming soon! Stay tuned for updates.

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

```

2. Apply the catalog configuration at either the model, folder, or project level. <br />
<br />An example of `iceberg_model.yml`:

```yaml

{{
    config(
        materialized='table',
        catalog = catalog_horizon

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

The dbt-snowflake adapter also supports applying `table_format` as an standalone configuration for dbt-snowflake models. We do not recommend using this as it is a legacy behavior. 

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

Snowflake's `CREATE ICEBERG TABLE` DDL requires that a `base_location` be provided. dbt defines this parameter on the user's behalf to streamline usage and enforce basic isolation of table data within the `EXTERNAL VOLUME`. The default behavior in dbt is to provide a `base_location` string of the form: `_dbt/{SCHEMA_NAME}/{MODEL_NAME}`. 

We recommend using the default behavior, but if you need to customize the resulting `base_location`, dbt allows users to configure the base_location with the `base_location_root` and `base_location_subpath`. 

- If no inputs are provided, dbt will output for base_location `{{ external_volume }}/_dbt/{{ schema }}/{{ model_name }}`
- If base_location_root = `foo`, dbt will output `{{ external_volume }}/foo/{{ schema }}/{{ model_name }}`
- If base_location_subpath = `bar`, dbt will output `{{ external_volume }}/_dbt/{{ schema }}/{{ model_name }}/bar`
- If base_location = `foo` and base_location_subpath = `bar`, dbt will output `{{ external_volume }}/foo/{{ schema }}/{{ model_name }}/bar`

A theoretical (but not recommended) use case is re-using an `EXTERNAL VOLUME` while maintaining isolation across development and production environments. We recommend against this as storage permissions should configured on the external volume and underlying storage, not paths that any analytics engineer can modify.

#### Rationale

By default, dbt manages `base_location` on behalf of users to enforce best practices. With Snowflake-managed Iceberg format tables, the user owns and maintains the data storage of the tables in an external storage solution (the declared `external volume`). The `base_ location` parameter declares where to write the data within the external volume. The Snowflake Iceberg catalog keeps track of your Iceberg table regardless of where the data lives within the `external volume` declared and the `base_location` provided. However, Snowflake permits passing anything into the `base_location` field, including an empty string, even reusing the same path across multiple tables. This behavior could result in future technical debt because it will limit the ability to:

- Navigate the underlying object store (S3/Azure blob)
- Read Iceberg tables via an object-store integration
- Grant schema-specific access to tables via object store
- Use a crawler pointed at the tables within the external volume to build a new catalog with another tool

To maintain best practices,  dbt enforces an input and, by default, writes your tables within a `_dbt/{SCHEMA_NAME}/{TABLE_NAME}` prefix to ensure easier object-store observability and auditability.

### Limitations

There are some limitations to the implementation you need to be aware of:

-  Using Iceberg tables with dbt, the result is that your query is materialized in Iceberg. However, often, dbt creates intermediary objects as temporary and transient tables for certain materializations, such as incremental ones. It is not possible to configure these temporary objects also to be Iceberg-formatted. You may see non-Iceberg tables created in the logs to support specific materializations, but they will be dropped after usage.
- You cannot incrementally update a preexisting incremental model to be an Iceberg table. To do so, you must fully rebuild the table with the `--full-refresh` flag.

</VersionBlock>
