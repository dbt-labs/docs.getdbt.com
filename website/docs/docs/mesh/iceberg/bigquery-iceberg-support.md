---
title: "BigQuery and Apache Iceberg"
id: bigquery-iceberg-support
sidebar_label: "BigQuery Iceberg support"
description: Understand BigQuery support for Apache Iceberg.
---

dbt supports materializing Iceberg tables on BigQuery via the catalog integration, starting with the dbt-bigquery 1.10 release.

## Creating Iceberg Tables

dbt supports creating Iceberg tables for two of the BigQuery materializations: 

- [Table](/docs/build/materializations#table)
- [Incremental](/docs/build/materializations#incremental)

## Bigquery Iceberg catalogs

BigQuery supports Iceberg tables via its built-in catalog [BigLake Metastore](https://cloud.google.com/bigquery/docs/iceberg-tables#architecture) today. No setup is needed to access the BigLake Metastore. However, you will need to have a [storage bucket and the required BigQuery roles](https://cloud.google.com/bigquery/docs/iceberg-tables#create-iceberg-tables) configured prior to creating an Iceberg table. 


### dbt catalog integration configurations

The following table outlines the configuration fields required to set up a catalog integration for [Iceberg tables in Snowflake](/reference/resource-configs/snowflake-configs#iceberg-table-format).

| Field            | Required | Accepted values                                                                         |
|------------------|----------|-----------------------------------------------------------------------------------------|
| `name`           | yes      | Name of catalog integration                                                             |
| `catalog_name`   | yes      | The name of the catalog integration in BigQuery. For example, `biglake_metastore`.     |
| `external_volume`| yes      | `gs://<bucket_name>`                                                                    |
| `table_format`   | yes      | `iceberg`                                                                               |
| `catalog_type`   | yes      | `biglake_metastore`                                                                     |
| `file_format`    | optional | `default`,`parquet`                                                                     |

dbt has an additonal configuration: `storage_uri` that the user can use on the model configuration to override the catalog integration path to supply the entire `storage_uri` path directly.

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
        catalog_type: biglake_metastore

```
2. Apply the catalog configuration at either the model, folder, or project level:

<File name='iceberg_model.yml'>

```yaml

{{
    config(
        materialized='table',
        catalog_name = my_bigquery_iceberg_catalog

    )
}}

select * from {{ ref('jaffle_shop_customers') }}

```

</File>


3. Execute the dbt model with a `dbt run -s iceberg_model`.

### Limitations

BigQuery today does not support connecting to external Iceberg catalogs. In terms of SQL operations and table management features, please refer to the (BigQuery docs)[https://cloud.google.com/bigquery/docs/iceberg-tables#limitations] for more information. 


<VersionBlock firstVersion="1.9">

### Base location 

BigQuery's DDL for creating iceberg tables requires that a fully qualified storage_uri be provided, including the object path. Once the user has provided the bucket name as the `external_volume` in the catalog integration, dbt will manage the storage_uri input. The default behavior in dbt is to provide an object path, referred to in dbt as the `base_location`, in the form: `_dbt/{SCHEMA_NAME}/{MODEL_NAME}`.  We recommend using the default behavior, but if you need to customize the resulting `base_location`, dbt allows users to configure `base_location` with the `base_location_root` and `base_location_subpath`. 
- If no inputs are provided, dbt will output for base_location `{{ external_volumne }}/_dbt/{{ schema }}/{{ model_name }}`
- If base_location_root = `foo`, dbt will output `{{ external_volumne }}/foo/{{ schema }}/{{ model_name }}`
- If base_location_subpath = `bar`, dbt will output `{{ bucket_name }}/_dbt/{{ schema }}/{{ model_name }}/bar`
- If base_location = `foo` and base_location_subpath = `bar`, dbt will output `{{ bucket_name }}/foo/{{ schema }}/{{ model_name }}/bar`

A theoretical (but not recommended) use case is re-using the `storage_uri` while maintaining isolation across development and production environments. We recommend against this as storage permissions should be configured on the external volume and underlying storage, not paths that any analytics engineer can modify.

#### Rationale

By default, dbt manages the full `storage_uri` on behalf of users for ease of use. The `base_location` parameter specifies the location within the storage bucket where the data will be written. Without guardrails (for example, if the user forgets to provide a base location root), it's possible for BigQuery to reuse the same path across multiple tables.  

This behavior could result in future technical debt because it will limit the ability to:

- Navigate the underlying object store 
- Read Iceberg tables via an object-store integration
- Grant schema-specific access to tables via object store
- Use a crawler pointed at the tables within the external storage to build a new catalog with another tool

To maintain best practices,  dbt enforces an input and, by default, writes your tables within a `_dbt/{SCHEMA_NAME}/{TABLE_NAME}` prefix to ensure easier object-store observability and auditability.

</VersionBlock>
