---
title: "Databricks and Apache Iceberg"
id: databricks-iceberg-support
sidebar_label: "Databricks Iceberg support"
description: Understand Databricks support for Apache Iceberg.
---

Databricks is built on [Delta Lake](https://docs.databricks.com/aws/en/delta/) and stores data in the [Delta table](https://docs.databricks.com/aws/en/introduction/delta-comparison#delta-tables-default-data-table-architecture) format. Databricks does not support writing to Iceberg catalogs. 
Databricks can create both managed Iceberg tables and Iceberg-compatible Delta tables by storing the table metadata in Iceberg and Delta, readable from external clients. In terms of reading, Unity Catalog does support reading from external Iceberg catalogs.

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


## dbt Catalog integration configurations for Databricks

The following table outlines the configuration fields required to set up a catalog integration for [Iceberg compatible tables in Databricks](https://docs.databricks.com/aws/en/delta/uniform).

| Field | Description | Required | Accepted values |
| :---- | :---- | :---- | :---- |
| name | Name of the Catalog on Databricks | Yes | “my_unity_catalog” |
| catalog_type | Type of catalog  | Yes | unity, hive_metastore |
| table_format | Format for tables created by dbt models.  | Optional | Automatically set to `iceberg` for `catalog_type=unity`; and `default` for `hive_metastore`. |
| file_format | Format used for dbt model outputs.   | Optional | Defaults to `delta` unless overwritten in Databricks account.  |

#### Note

On Databricks, if a model has `catalog_name=<>` in its model config, the catalog name becomes the catalog part of the model's FQN. For example, if the catalog is named `my_database`, a model with `catalog_name='my_database'` is materialized as `my_database.<schema>.<model>`.

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
        file_format: delta   
```

2. Add the `catalog_name` config parameter in either a config block (inside the .sql model file), properties YAML file (model folder), or your project YAML file (`dbt_project.yml`). <br />
<br />

An example of `iceberg_model.sql`:

```yaml

{{
    config(
        materialized = 'table',
        catalog_name = 'unity_catalog'

    )
}}

select * from {{ ref('jaffle_shop_customers') }}

```

3. Execute the dbt model with a `dbt run -s iceberg_model`.



