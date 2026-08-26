---
title: "BigQuery and Apache Iceberg"
id: bigquery-iceberg-support
sidebar_label: "BigQuery Iceberg support"
description: Understand BigQuery support for Apache Iceberg.
---

import BaseLocationEnvIsolation from '/snippets/_base-location-env-isolation-warning.md';

dbt supports materializing models in the Iceberg table format in two ways:

- **Simplest:** The model config `table_format = 'iceberg'` instructs dbt to materialize this model as an Iceberg table in BigLake Metastore (managed catalog)
- **Extensible:** Define an Iceberg catalog in `catalogs.yml` and configure this model with `catalog_name`

## Creating Iceberg tables

dbt supports creating Iceberg tables for two of the BigQuery materializations: 

- [Table](/docs/build/materializations#table)
- [Incremental](/docs/build/materializations#incremental)

## Iceberg catalogs

BigQuery supports Iceberg tables through its built-in catalog [BigLake Metastore](https://cloud.google.com/bigquery/docs/iceberg-tables#architecture) today. No setup is needed to access the BigLake Metastore. However, you need to have a [storage bucket](https://docs.cloud.google.com/storage/docs/buckets#buckets) and [the required BigQuery roles](https://cloud.google.com/bigquery/docs/iceberg-tables#required-roles) configured prior to creating an Iceberg table. 


## BigQuery-specific configs for `biglake_metastore` catalogs

The following table outlines the configuration fields required to set up a catalog integration for [BigLake Iceberg tables in BigQuery](https://docs.cloud.google.com/bigquery/docs/iceberg-tables).

Supply and nest these additional configurations, unique to BigQuery, under `config.bigquery` (in the new catalog spec) or `adapter_properties` (in the old catalog spec).

| Field | Type | Required | Description | Note |
| ----- | ---- | -------- | ----------- | ---- |
| `file_format` | String | Yes | The file format for the Iceberg table. | `parquet` is the only accepted value. |
| `external_volume` | String | Yes | The Cloud Storage bucket where Iceberg table data is written. | For example, `gs://BUCKET_NAME`. |
| `base_location_root` | String | No | If provided, the input overrides the default dbt `base_location` value of `_dbt`. | Can be set in `catalogs.yml`. |
| `base_location_subpath` | String | No | An optional suffix to add to the `base_location` path that dbt automatically specifies. | Only configurable per-model. |
| `storage_uri` | String | No | If provided, the input overrides the dbt `storage_uri` value. | Only configurable per-model. |

- `base_location_root`: Specifies the prefix of the base location path within the storage bucket where Iceberg table data is written.
- `base_location_subpath`: Specifies the suffix of the base location path within the storage bucket where Iceberg table data is written. This property can only be set in model configurations, not in `catalogs.yml`.
- `storage_uri`: Completely overrides the storage_uri, allowing you to specify the full path directly instead of using the catalog integration's external volume and base_location components.

### Example

1. Create a `catalogs.yml` at the top level of your dbt project.

<Tabs defaultValue="new" values={[
  { label: 'New spec (beta)', value: 'new' },
  { label: 'Old spec', value: 'old' }
]}>
<TabItem value="new">

<File name="catalogs.yml">

```yaml
catalogs:
  - name: my_biglake_catalog
    type: biglake_metastore
    table_format: iceberg
    config:
      bigquery:
        external_volume: 'gs://mydbtbucket'
        file_format: parquet

```

</File>

</TabItem>
<TabItem value="old">

<File name="catalogs.yml">

```yaml
catalogs:
  - name: my_biglake_catalog
    active_write_integration: biglake_metastore
    write_integrations:
      - name: biglake_metastore
        external_volume: 'gs://mydbtbucket'
        table_format: iceberg
        file_format: parquet
        catalog_type: biglake_metastore

```

</File>

</TabItem>
</Tabs>

2. Apply the catalog configuration at either the model, folder, or project level:

<File name="iceberg_model.sql">

```sql

{{
    config(
        materialized='table',
        catalog_name='my_biglake_catalog'

    )
}}

select * from {{ ref('jaffle_shop_customers') }}

```

</File>


3. Finally, run the model: `dbt run -s my_iceberg_model`.

### Limitations

BigQuery today doesn't support connecting to external Iceberg catalogs. In terms of SQL operations and table management features, refer to the [BigQuery docs](https://cloud.google.com/bigquery/docs/iceberg-tables#limitations) for more information. 

### Base location

BigQuery's DDL for creating Iceberg tables requires that a fully qualified `storage_uri` be provided, including the object path. Once the user has provided the bucket name as the `external_volume` in the catalog integration, dbt manages the `storage_uri` input. The default behavior in dbt is to provide an object path, referred to in dbt as the `base_location`, in the form: `_dbt/{SCHEMA_NAME}/{MODEL_NAME}`.  We recommend using the default behavior, but if you need to customize the resulting `base_location`, you can configure `base_location` with the model configuration fields `base_location_root` and `base_location_subpath`.

- If no inputs are provided, dbt outputs for base_location `{{ external_volume }}/_dbt/{{ schema }}/{{ model_name }}`
- If base_location_root = `foo`, dbt outputs `{{ external_volume }}/foo/{{ schema }}/{{ model_name }}`
- If base_location_subpath = `bar`, dbt outputs `{{ external_volume }}/_dbt/{{ schema }}/{{ model_name }}/bar`
- If base_location_root = `foo` and base_location_subpath = `bar`, dbt outputs `{{ external_volume }}/foo/{{ schema }}/{{ model_name }}/bar`

<BaseLocationEnvIsolation />

You can also completely override the `storage_uri` with the model configuration field `storage_uri`. This overrides both the catalog integration path and the other model configuration fields to supply the entire `storage_uri` path directly.

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

<Tabs defaultValue="new" values={[
  { label: 'New spec (beta)', value: 'new' },
  { label: 'Old spec', value: 'old' }
]}>
<TabItem value="new">

<File name='catalogs.yml'>

```yaml
catalogs:
  - name: my_bigquery_iceberg_catalog
    type: biglake_metastore
    table_format: iceberg
    config:
      bigquery:
        external_volume: 'gs://mydbtbucket'
        file_format: parquet
        base_location_root: foo

```

</File>

</TabItem>
<TabItem value="old">

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

</TabItem>
</Tabs>

#### Rationale

By default, dbt manages the full `storage_uri` on behalf of users for ease of use. The `base_location` parameter specifies the location within the storage bucket where the data is written. Without guardrails (for example, if the user forgets to provide a base location root), it's possible for BigQuery to reuse the same path across multiple tables.  

This behavior could result in future technical debt because it limits the ability to:

- Navigate the underlying object store 
- Read Iceberg tables through an object-store integration
- Grant schema-specific access to tables through object store
- Use a crawler pointed at the tables within the external storage to build a new catalog with another tool

To maintain best practices, dbt enforces an input and, by default, writes your tables within a `_dbt/{SCHEMA_NAME}/{TABLE_NAME}` prefix to ensure easier object-store observability and auditability.
