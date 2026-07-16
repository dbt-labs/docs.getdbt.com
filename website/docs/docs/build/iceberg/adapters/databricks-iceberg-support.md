---
title: "Databricks and Apache Iceberg"
id: databricks-iceberg-support
sidebar_label: "Databricks Iceberg support"
description: Understand Databricks support for Apache Iceberg.
---

import BaseLocationEnvIsolation from '/snippets/_base-location-env-isolation-warning.md';

dbt supports materializing Iceberg tables in Unity Catalog in two ways:

- **Simplest:** The model config `table_format = 'iceberg'` instructs dbt to materialize this model as an Iceberg table in Unity Catalog
- **Extensible:** Define an Iceberg catalog in `catalogs.yml` and configure this model with `catalog_name`

dbt supports creating Iceberg tables for two Databricks materializations:

- [Table](/docs/build/materializations#table)
- [Incremental](/docs/build/materializations#incremental)

## Databricks Iceberg support

Databricks is built on [Delta Lake](https://docs.databricks.com/aws/en/delta/) and stores data in the [Delta table](https://docs.databricks.com/aws/en/introduction/delta-comparison#delta-tables-default-data-table-architecture) format.

Databricks supports two methods for creating Iceberg tables in its data catalog, [Unity Catalog](https://docs.databricks.com/aws/en/data-governance/unity-catalog/):

- Creating [Unity Catalog managed Iceberg tables](https://docs.databricks.com/aws/en/tables/managed). Databricks Runtime 16.4 LTS and later support this feature.
- Enabling [Iceberg reads](https://docs.databricks.com/aws/en/delta/uniform) on Delta tables. These tables still use the Delta file format, but generate both Delta and Iceberg-compatible metadata. Databricks Runtime 14.3 LTS and later support this feature.

dbt supports both creating managed Iceberg tables and Iceberg-enabled Delta tables (formerly [UniForm](https://www.databricks.com/blog/delta-uniform-universal-format-lakehouse-interoperability)). The behavior flag [`use_managed_iceberg`](/reference/global-configs/databricks-changes#use-managed-iceberg) determines whether dbt creates a managed Iceberg table or a Delta table.

External Iceberg compute engines can read from and write to these Iceberg tables using Unity Catalog's [Iceberg REST API endpoint](https://docs.databricks.com/aws/en/external-access/iceberg). However, Databricks only has limited support for reading from external Iceberg catalogs (and externally managed Iceberg tables) via [Databricks catalog federation](https://docs.databricks.com/aws/en/query-federation/catalog-federation) (configured outside of dbt).

dbt does not yet support enabling [Iceberg v3](https://docs.databricks.com/aws/en/iceberg/iceberg-v3) on managed Iceberg tables.

### External tables

dbt also supports creating externally-managed Iceberg tables using the model configuration [`location_root`](/reference/resource-configs/databricks-configs#configuring-tables). Databricks' DDL for creating tables requires a fully qualified `location`. dbt defines this parameter on the user's behalf to streamline usage and enforce basic isolation of table data:

- When you set a `location_root` string, dbt generates a `location` string of the form: `{{ location_root }}/{{ model_name }}`.
- If you set the configuration option `include_full_name_in_path` to `true`, dbt generates a `location` string of the form `{{ location_root }}/{{ database_name}}/{{ schema_name }}/{{ model_name }}`.

In dbt v2, you may set `location_root` within the catalog definition in `catalogs.yml`, under `config.databricks` (in the new catalog spec) or `adapter_properties` (in the old catalog spec).

### Catalogs

Configure catalogs in order to:
- define muiltiple configurations for Databricks-managed Iceberg tables within one catalog
- support cross-platform mesh

Notes:
- Every Databricks catalog may optionally configure `table_format`. By default, this is set to `iceberg` for `catalog_type=unity`, and `default` for `hive_metastore`.
- On Databricks, `catalog_name` takes precedence over the `catalog` config when determining the model's top-level namespace.

## Configure catalog integration for Iceberg tables

1. Create a `catalogs.yml` at the top level of your dbt project. An example of Unity Catalog as the catalog:

<Tabs defaultValue="new" values={[
  { label: 'New spec', value: 'new' },
  { label: 'Old spec', value: 'old' }
]}>
<TabItem value="new">

<File name="catalogs.yml">

```yaml

catalogs:
  - name: unity_catalog
    type: unity
    table_format: iceberg # optional
    config:
      databricks:
        # optional
        location_root: s3://cloud-storage-uri
```

</File>

</TabItem>

<TabItem value="old">

<File name="catalogs.yml">

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

</File>

</TabItem>

</Tabs>

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
