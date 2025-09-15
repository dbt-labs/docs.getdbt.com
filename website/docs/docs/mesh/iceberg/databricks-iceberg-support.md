---
title: "Databricks and Apache Iceberg"
id: databricks-iceberg-support
sidebar_label: "Databricks Iceberg support"
unlisted: true
description: Understand Databricks support for Apache Iceberg.
---

Databricks is built on [Delta Lake](https://docs.databricks.com/aws/en/delta/) and stores data in the [Delta table](https://docs.databricks.com/aws/en/introduction/delta-comparison#delta-tables-default-data-table-architecture) format. Databricks does not support writing to Iceberg catalogs. However, it does support reading from external Iceberg catalogs and creating tables readable from Iceberg clients. Databricks can create managed Iceberg tables and create Iceberg compatible Delta tables by storing the table metadata in Iceberg and Delta. 

When a dbt model is configured with the table property `UniForm`, it will duplicate the Delta metadata for an Iceberg-compatible metadata. This allows external Iceberg compute engines to read from Unity Catalogs. 

Example SQL:

```sql
{{ config(
    tblproperties={
      'delta.enableIcebergCompatV2': 'true'
      'delta.universalFormat.enabledFormats': 'iceberg'
    }
 ) }}

```
To set up Databricks for reading and querying external tables, configure [Lakehouse Federation](https://docs.databricks.com/aws/en/query-federation/) and establish the catalog as a foreign catalog. This will be configured outside of dbt, and once completed, it will be another database you can query. 

We do not currently support the new Private Priview features of Databricks managed Iceberg tables. 


## dbt Catalog Integration Configurations for Databricks

The following table outlines the configuration fields required to set up a catalog integration for [Iceberg compatible tables in Databricks](https://docs.databricks.com/aws/en/delta/uniform).

| Field | Description | Required | Accepted values |
| :---- | :---- | :---- | :---- |
| name | Name of the Catalog on Databricks | yes | “my_unity_catalog” |
| catalog_type | Type of catalog  | yes | unity, hive_metastore |
| external_volume | Storage location of your data | optional | See Databricks [documentation](https://docs.databricks.com/aws/en/volumes/managed-vs-external) |
| table_format | Table Format for your dbt models will be materialized as  | OptionalDefaults to `delta` unless overwritten in Databricks account.  | default, iceberg |
| adapter_properties: | Additional Platform-Specific Properties.  | Optional | See below for acceptable values	 |


Here are optional fields for adapter properties:

| Field | Description | Required | Accepted values |
| :---- | :---- | :---- | :---- |
| file_format |  | Optional, Defaults to `delta` unless overwritten in Databricks account.  | delta (default), parquet, hudi |

Example:

```yaml
adapter_properties:
  file_format: parquet
```

### Configure catalog integration for managed Iceberg tables

1. Create a `catalogs.yml` at the top level of your dbt project (at the same level as dbt_project.yml)<br />
<br />An example of Unity Catalog as the catalog:

```yaml

catalogs:
  - name: unity_catalog
    active_write_integration: unity_catalog_integration
    write_integrations:
      - name: unity_catalog_integration
        table_format: iceberg
        catalog_type: unity

```

2. Apply the catalog configuration at either the model, folder, or project level. <br />
<br />An example of `iceberg_model.sql`:

```yaml

{{
    config(
        tblproperties = {
          'delta.enableIcebergCompatV2': 'true',
          'delta.universalFormat.enabledFormats': 'iceberg'
        },
        materialized = 'table',
        catalog = 'unity_catalog'

    )
}}

select * from {{ ref('jaffle_shop_customers') }}

```

3. Execute the dbt model with a `dbt run -s iceberg_model`.



