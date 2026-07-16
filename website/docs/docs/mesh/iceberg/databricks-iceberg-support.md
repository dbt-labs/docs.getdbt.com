---
title: "Databricks and Apache Iceberg"
id: databricks-iceberg-support
sidebar_label: "Databricks Iceberg support"
description: Understand Databricks support for Apache Iceberg.
---

import BaseLocationEnvIsolation from '/snippets/_base-location-env-isolation-warning.md';

dbt supports materializing Iceberg tables in Unity Catalog using the catalog integration, starting with the dbt-databricks 1.9.0 release, for two Databricks materializations:

- [Table](/docs/build/materializations#table)
- [Incremental](/docs/build/materializations#incremental)

## Databricks Iceberg tables

Databricks is built on [Delta Lake](https://docs.databricks.com/aws/en/delta/) and stores data in the [Delta table](https://docs.databricks.com/aws/en/introduction/delta-comparison#delta-tables-default-data-table-architecture) format.

Databricks supports two methods for creating Iceberg tables in its data catalog, [Unity Catalog](https://docs.databricks.com/aws/en/data-governance/unity-catalog/):

- Creating [Unity Catalog managed Iceberg tables](https://docs.databricks.com/aws/en/tables/managed). Databricks Runtime 16.4 LTS and later support this feature.
- Enabling [Iceberg reads](https://docs.databricks.com/aws/en/delta/uniform) on Delta tables. These tables still use the Delta file format, but generate both Delta and Iceberg-compatible metadata. Databricks Runtime 14.3 LTS and later support this feature.

External Iceberg compute engines can read from and write to these Iceberg tables using Unity Catalog's [Iceberg REST API endpoint](https://docs.databricks.com/aws/en/external-access/iceberg). However, Databricks only supports reading from external Iceberg catalogs.

To set up Databricks for reading and querying external tables, configure [Lakehouse Federation](https://docs.databricks.com/aws/en/query-federation/) and establish the catalog as a foreign catalog. Configure this outside of dbt. Once completed, it becomes another database you can query. 

dbt does not yet support enabling [Iceberg v3](https://docs.databricks.com/aws/en/iceberg/iceberg-v3) on managed Iceberg tables.

## Creating Iceberg tables

To configure dbt models to materialize as Iceberg tables, you can use a catalog integration with `table_format: iceberg` (see [dbt Catalog integration configurations for databricks](#dbt-catalog-integration-configurations-for-databricks)).

<VersionBlock lastVersion="1.99">
dbt supports both creating managed Iceberg tables and Iceberg-enabled Delta tables (formerly [UniForm](https://www.databricks.com/blog/delta-uniform-universal-format-lakehouse-interoperability)). The behavior flag [`use_managed_iceberg`](/reference/global-configs/databricks-changes#use-managed-iceberg) determines whether dbt creates a managed Iceberg table or a Delta table.
</VersionBlock>

<VersionBlock firstVersion="2.0">
dbt supports both creating managed Iceberg tables and Iceberg-enabled Delta tables (formerly [UniForm](https://www.databricks.com/blog/delta-uniform-universal-format-lakehouse-interoperability)). The behavior change flag `use_managed_iceberg` (see [use_managed_iceberg](/reference/global-configs/databricks-changes#use-managed-iceberg)) determines whether dbt creates a managed Iceberg table or a Delta table.
</VersionBlock>

### External tables

dbt also supports creating externally-managed Iceberg tables using the model configuration [`location_root`](/reference/resource-configs/databricks-configs#configuring-tables). Databricks' DDL for creating tables requires a fully qualified `location`. dbt defines this parameter on the user's behalf to streamline usage and enforce basic isolation of table data:

- When you set a `location_root` string, dbt generates a `location` string of the form: `{{ location_root }}/{{ model_name }}`.
If you set the configuration option `include_full_name_in_path` to true, dbt generates a `location` string of the form `{{ location_root }}/{{ database_name}}/{{ schema_name }}/{{ model_name }}`.

<VersionBlock firstVersion="2.0">
In Fusion, dbt also supports setting `location_root` as an [adapter property](#adapter-properties) in `catalogs.yml`.
</VersionBlock>

### dbt Catalog integration configurations for Databricks

<VersionBlock lastVersion="1.99">
The following table outlines the configuration fields required to set up a catalog integration for [Iceberg compatible tables in Databricks](https://docs.databricks.com/aws/en/iceberg).

| Field | Description | Required | Accepted values |
| :---- | :---- | :---- | :---- |
| `name` | Name of the catalog on Databricks | Yes | "my_unity_catalog" |
| `catalog_type` | Type of catalog  | Yes | unity, hive_metastore |
| `table_format` | Format for tables created by dbt models.  | Optional | Automatically set to `iceberg` for `catalog_type=unity`, and `default` for `hive_metastore`. |
| `file_format` | Format used for dbt model outputs.   | Optional | Defaults to `delta` unless overwritten in Databricks account.  |
</VersionBlock>

<VersionBlock firstVersion="2.0">
The following table outlines the configuration fields required to set up a catalog integration for [Iceberg compatible tables in Databricks](https://docs.databricks.com/aws/en/iceberg).

| Field | Description | Required | Accepted values |
| :---- | :---- | :---- | :---- |
| `name` | Name of catalog integration | Yes | "my_write_integration" |
| `catalog_type` | Type of catalog  | Yes | unity, hive_metastore |
| `table_format` | Format for tables created by dbt models.  | Optional | Automatically set to `iceberg` for `catalog_type=unity`, and `default` for `hive_metastore`. |
| `file_format` | Format used for dbt model outputs. | Optional | Defaults to `delta` unless overwritten in Databricks account.  |
| `adapter_properties` | Additional configurations unique to Databricks | Optional | See [Adapter properties](#adapter-properties) |
</VersionBlock>

#### Note

On Databricks, if a model has `catalog_name=<>` in its model config, the catalog name becomes the catalog part of the model's FQN. For example, if the catalog is named `my_database`, a model with `catalog_name='my_database'` is materialized as `my_database.<schema>.<model>`.

<VersionBlock firstVersion="2.0">
### Adapter properties

Databricks supports one additional configuration, `location_root`, that specifies an [external location](https://docs.databricks.com/aws/en/sql/language-manual/sql-ref-external-tables) root to write to. dbt writes the table to `<location_root>/<identifier>`, or `<location_root>/<database>/<schema>/<identifier>` if `include_full_name_in_path` is true.

`location_root` should be supplied and nested under `adapter_properties`. This configuration is specific to Unity Catalog; `adapter_properties` is not allowed for catalog integrations with `catalog_type: hive_metastore`.

</VersionBlock>

## Configure catalog integration for Iceberg tables

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
        adapter_properties:
          location_root: s3://cloud-storage-uri
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
