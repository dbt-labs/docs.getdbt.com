---
title: "BigQuery and Apache Iceberg"
id: bigquery-iceberg-support
sidebar_label: "BigQuery Iceberg support"
description: Understand BigQuery support for Apache Iceberg.
---

import BaseLocationEnvIsolation from '/snippets/_base-location-env-isolation-warning.md';

dbt supports materializing Iceberg tables on BigQuery via the catalog integration, starting with the dbt-bigquery 1.10 release.

## Creating Iceberg Tables

dbt supports creating Iceberg tables for two of the BigQuery materializations: 

- [Table](/docs/build/materializations#table)
- [Incremental](/docs/build/materializations#incremental)

## BigQuery Iceberg catalogs

BigQuery supports Iceberg tables via its built-in catalog [BigLake Metastore](https://cloud.google.com/bigquery/docs/iceberg-tables#architecture) today. No setup is needed to access the BigLake Metastore. However, you will need to have a [storage bucket](https://docs.cloud.google.com/storage/docs/buckets#buckets) and [the required BigQuery roles](https://cloud.google.com/bigquery/docs/iceberg-tables#required-roles) configured prior to creating an Iceberg table. 


### dbt Catalog integration configurations for BigQuery

The following table outlines the configuration fields required to set up a catalog integration for [Biglake Iceberg tables in BigQuery](https://docs.cloud.google.com/bigquery/docs/iceberg-tables).

<VersionBlock lastVersion="1.99">

| Field            | Required | Accepted values                                                                         |
|------------------|----------|-----------------------------------------------------------------------------------------|
| `name`           | yes      | Name of catalog integration                                                             |
| `catalog_name`   | yes      | The name of the catalog integration in BigQuery. For example, `biglake_metastore`.     |
| `external_volume`| yes      | `gs://<bucket_name>`                                                                    |
| `table_format`   | yes      | `iceberg`                                                                               |
| `catalog_type`   | yes      | `biglake_metastore`                                                                     |
| `file_format`    | yes      | `parquet`                                                                     |

</VersionBlock>

<VersionBlock firstVersion="2.0">

| Field            | Required | Accepted values                                                                         |
|------------------|----------|-----------------------------------------------------------------------------------------|
| `name`           | yes      | Name of catalog integration                                                             |
| `catalog_name`   | yes      | The name of the catalog integration in BigQuery. For example, `biglake_metastore`.     |
| `external_volume`| yes      | `gs://<bucket_name>`                                                                    |
| `table_format`   | yes      | `iceberg`                                                                               |
| `catalog_type`   | yes      | `biglake_metastore`                                                                     |
| `file_format`    | yes      | `parquet`                                                                     |
| `adapter_properties` | optional | See below |

### Adapter properties

Supply and nest these additional configurations, unique to BigQuery, under the `adapter_properties` field.

| Field | Type   | Required | Description   | Note   |
| ------ | ----- | -------- | ------------- | ------ |
| `base_location_root` | String | No     | If provided, the input will override the default dbt base_location value of `_dbt`.  | Can be set in `catalogs.yml`
| `base_location_subpath` | String | No     | An optional suffix to add to the `base_location` path that dbt automatically specifies.     | Only configurable per-model |
| `storage_uri` | String | No     | If provided, the input will override the dbt storage_uri value. | Only configurable per-model |

These properties can be set in model configurations under the `adapter_properties` field, or as top-level fields themselves. If present in both places, the value set under `adapter_properties` will take precedence. Refer to [Base location](#base-location) for more information.

- `base_location_root`: Specifies the prefix of the base location path within the storage bucket where Iceberg table data will be written.
- `base_location_subpath`: Specifies the suffix of the base location path within the storage bucket where Iceberg table data will be written. This property can only be set in model configurations, not in `catalogs.yml`.
- `storage_uri`: Completely overrides the storage_uri, allowing you to specify the full path directly instead of using the catalog integration's external volume and base_location components.

</VersionBlock>

### Configure catalog integration for managed Iceberg tables

1. Create a `catalogs.yml` at the top level of your dbt project.<br />
<br />An example:

```yaml

catalogs:
  - name: my_bigquery_iceberg_catalog
    active_write_integration: biglake_metastore
    write_integrations:
      - name: biglake_metastore
        external_volume: 'gs://mydbtbucket'
        table_format: iceberg
        file_format: parquet
        catalog_type: biglake_metastore

```
2. Apply the catalog configuration at either the model, folder, or project level:

<File name='iceberg_model.sql'>

```sql

{{
    config(
        materialized='table',
        catalog_name='my_bigquery_iceberg_catalog'

    )
}}

select * from {{ ref('jaffle_shop_customers') }}

```

</File>


3. Execute the dbt model with `dbt run -s iceberg_model`.

### Limitations

BigQuery today does not support connecting to external Iceberg catalogs. In terms of SQL operations and table management features, please refer to the [BigQuery docs](https://cloud.google.com/bigquery/docs/iceberg-tables#limitations) for more information. 

<VersionBlock firstVersion="1.9">

### Base location

<VersionBlock lastVersion="1.99">
BigQuery's DDL for creating iceberg tables requires that a fully qualified storage_uri be provided, including the object path. Once the user has provided the bucket name as the `external_volume` in the catalog integration, dbt will manage the storage_uri input. The default behavior in dbt is to provide an object path, referred to in dbt as the `base_location`, in the form: `_dbt/{SCHEMA_NAME}/{MODEL_NAME}`.  We recommend using the default behavior, but if you need to customize the resulting `base_location`, dbt allows users to configure `base_location` with the model configuration fields `base_location_root` and `base_location_subpath`. 

- If no inputs are provided, dbt will output for base_location `{{ external_volume }}/_dbt/{{ schema }}/{{ model_name }}`
- If base_location_root = `foo`, dbt will output `{{ external_volume }}/foo/{{ schema }}/{{ model_name }}`
- If base_location_subpath = `bar`, dbt will output `{{ external_volume }}/_dbt/{{ schema }}/{{ model_name }}/bar`
- If base_location_root = `foo` and base_location_subpath = `bar`, dbt will output `{{ external_volume }}/foo/{{ schema }}/{{ model_name }}/bar`

<BaseLocationEnvIsolation />

dbt also allows users to completely override the storage_uri with the model configuration field `storage_uri`. This overrides both the catalog integration path and the other model configuration fields to supply the entire `storage_uri` path directly.

An example model with a customized `base_location`:

<File name='iceberg_model.sql'>

```sql

{{
    config(
        materialized='table',
        catalog_name='my_bigquery_iceberg_catalog',
        base_location_root='foo',
        base_location_subpath='bar',

    )
}}

select * from {{ ref('jaffle_shop_customers') }}
```

</File>

</VersionBlock>

<VersionBlock firstVersion="2.0">

BigQuery's DDL for creating iceberg tables requires that a fully qualified storage_uri be provided, including the object path. Once the user has provided the bucket name as the `external_volume` in the catalog integration, dbt will manage the storage_uri input. The default behavior in dbt is to provide an object path, referred to in dbt as the `base_location`, in the form: `_dbt/{SCHEMA_NAME}/{MODEL_NAME}`.  We recommend using the default behavior, but if you need to customize the resulting `base_location`, dbt allows users to configure `base_location` through configuring `adapter_properties`.

The available adapter properties for configuration are `base_location_root`, `base_location_subpath`, and `storage_uri`. `base_location_subpath` and `storage_uri` are only accepted in model configurations (see [Adapter Properties](#adapter-properties)).

- If no inputs are provided, dbt will output for base_location `{{ external_volume }}/_dbt/{{ schema }}/{{ model_name }}`
- If base_location_root = `foo`, dbt will output `{{ external_volume }}/foo/{{ schema }}/{{ model_name }}`
- If base_location_subpath = `bar`, dbt will output `{{ external_volume }}/_dbt/{{ schema }}/{{ model_name }}/bar`
- If base_location_root = `foo` and base_location_subpath = `bar`, dbt will output `{{ external_volume }}/foo/{{ schema }}/{{ model_name }}/bar`

<BaseLocationEnvIsolation />

dbt also allows users to completely override the storage_uri with the adapter property `storage_uri`. This overrides both the catalog integration path and any `base_location` overrides to supply the entire `storage_uri` path directly.

#### Example configurations

An example model with a customized `base_location`:

<File name='iceberg_model.sql'>

```sql

{{
    config(
        materialized='table',
        catalog_name='my_bigquery_iceberg_catalog',
        adapter_properties={
          'base_location_root': 'foo',
          'base_location_subpath': 'bar',
        },

    )
}}

select * from {{ ref('jaffle_shop_customers') }}
```

</File>

An example `catalogs.yml` with a customized `base_location_root` using `adapter_properties`:

<File name='catalogs.yml'>

```yaml
catalogs:
  - name: my_bigquery_iceberg_catalog
    active_write_integration: biglake_metastore
    write_integrations:
      - name: biglake_metastore
        external_volume: 'gs://mydbtbucket'
        table_format: iceberg
        file_format: parquet
        catalog_type: biglake_metastore
        adapter_properties:
          base_location_root: foo
```

</File>

:::info Legacy model configuration for base_location

For backwards compatibility, dbt <Constant name="fusion"/> also supports setting `base_location` properties and `storage_uri` as top-level model configuration fields. `adapter_properties` configs take precedence over legacy configs.

For example, in the following model config, `base_location_root`=`bar` overrides `base_location_root`=`foo`.

```sql
config(
    materialized='table',
    catalog_name='my_bigquery_iceberg_catalog',
    'base_location_root': 'foo',
    'base_location_subpath': 'bar',
    adapter_properties={
      'base_location_root': 'bar',
    },
)

```

This configuration results in: `storage_uri` = `{{ external_volume }}/bar/{{ schema }}/{{ model_name }}/bar`
:::

</VersionBlock>

#### Rationale

By default, dbt manages the full `storage_uri` on behalf of users for ease of use. The `base_location` parameter specifies the location within the storage bucket where the data will be written. Without guardrails (for example, if the user forgets to provide a base location root), it's possible for BigQuery to reuse the same path across multiple tables.  

This behavior could result in future technical debt because it will limit the ability to:

- Navigate the underlying object store 
- Read Iceberg tables via an object-store integration
- Grant schema-specific access to tables via object store
- Use a crawler pointed at the tables within the external storage to build a new catalog with another tool

To maintain best practices, dbt enforces an input and, by default, writes your tables within a `_dbt/{SCHEMA_NAME}/{TABLE_NAME}` prefix to ensure easier object-store observability and auditability.

</VersionBlock>
