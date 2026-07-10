---
title: "Using catalogs.yml"
id: catalogs-yml
sidebar_label: "Using catalogs.yml"
description: Understand how Iceberg catalogs fit into your dbt Mesh configurations.
---

Now that you understand [what an Iceberg catalog is](/docs/mesh/iceberg/about-catalogs), let's talk about how to use them within dbt.

## Getting started: Managed catalogs

Several data platforms offer their own "managed" catalogs that support the Iceberg table format out-of-the-box. These include Snowflake Horizon, Databricks Unity, AWS Glue (for Athena + Redshift), and BigLake (for BigQuery).

If you are using dbt with a data platform that offers a managed Iceberg catalog, then the simplest way to materialize your first dbt model as an Iceberg table is by simply setting the `table_format` configuration:

<File name='models/hello_iceberg.sql'>

```sql
{{ config(
  materialized = 'table',
  table_format = 'iceberg
) }}

select 'hello_iceberg' as message
```

</File>

That's it. This model will be materialized as an Iceberg table, with all the default configurations for this adapter, and stored in the default (managed) catalog offered by this data platform. Congratulations, you're using Iceberg!

_Note: Most open source query engines, including DuckDB and Apache Spark, can operate well with external catalogs, but they don't come with a "managed" catalog. Instead, their default behavior for materializing Iceberg tables is to write parquet files + Iceberg metadata to the local filesystem (wherever the query engine is running)._

## Next step: Using catalogs

You should start using `catalogs` when:
- You want a single place to define custom configurations for how dbt should materialize Iceberg tables
- You want to write to multiple catalogs ("external" as well as built-in / managed)
- You want to access the same catalog across multiple data platforms / dbt projects

dbt defines `catalogs` in a single top-level file, `catalogs.yml`, that lives in the root of your project directory. We first introduced `catalogs.yml` in dbt Core v1.10; starting in dbt Core v1.12, we have introduced a new simpler spec (recommended) behind an opt-in behavior flag.

### New spec (recommended)

_Available in dbt Core v1.12+ (including dbt Core v2 and Fusion). See GitHub discussion [dbt-core#12723](https://github.com/dbt-labs/dbt-core/discussions/12723) for an explanation of the motivations behind the new spec, and an overview of what's changed._

To use the new spec, first set this behavior flag:

<File name='dbt_project.yml'>

```yml
flags:
  use_catalogs_v2: true
```

</File>

Each entry in `catalogs` refers to a specific catalog containing Iceberg tables. Each catalog **should** map to a top-level logical namespace (often called "database" in dbt). Each catalog may be managed or external for this data platform. Each catalog may be accessed (read from and written to) by one or multiple data platforms.

For this reason, each catalog's adapter-specific configuration is nested under `<adapter>` keys (`snowflake:`, `databricks:`, etc). If you run the same dbt project, with the same `catalogs.yml`, using different adapters, dbt will always use the catalog configuration for the current active adapter.

That said, one "catalog" **must** always point to the same actual data (Iceberg tables in object storage), regardless of whether that catalog is external to or managed by the current active adapter.

<VersionBlock firstVersion="1.12">

<File name='catalogs.yml'>

```yml
catalogs:
  - name: my_iceberg_catalog
    type: <catalog_type>   # see below
    table_format: iceberg  # default, optional
    config:
      <adapter>:
        # Configuration for a specific adapter to integrate with this catalog.
        # See available configs for each adapter + catalog combination.
```

</File>

</VersionBlock>

#### Catalog types

| catalog `type`    | default for | supported by                  | Notes                                                                                         |
|-------------------|-------------|-------------------------------|-----------------------------------------------------------------------------------------------|
| horizon           | snowflake   | snowflake, duckdb             |                                                                                               |
| glue              | athena      | athena, snowflake, duckdb     |                                                                                               |
| biglake_metastore | bigquery    | bigquery, snowflake           |                                                                                               |
| unity             | databricks  | databricks, snowflake, duckdb | Supports Iceberg (native), Delta, "Uniform" formats                                           |
| hive_metastore    |             | databricks                    | Supports Hudi format, in addition to Iceberg + Delta                                          |
| ducklake          |             | duckdb                        |                                                                                               |
| local_filesystem  |             | duckdb                        |                                                                                               |
| iceberg_rest      |             | snowflake, duckdb             | In theory, this option can support any catalog that implements an Iceberg-compatible REST API |

#### Config inheritance

Configurations defined in [`catalogs.yml`](https://docs.getdbt.com/reference/model-configs) are lowest in the model-config precedence. Meaning, if you set a more-specific config for one model (within its sql/py file), or set a project-level config, those will take precedence.

For example, we set a default `base_location_root` for all models in the `finance_db` catalog:

<File name='catalogs.yml'>

```yml
catalogs:
  - name: finance_db
    catalog_type: unity
    config:
      snowflake:
        base_location_root: 's3://my-bucket/finance_db'
```

</File>

But then we override that config for one particular model:

<File name='models/finance/my_special_model.sql'>

```sql
{{ config(
    catalog_name = 'finance_db',
    base_location_root = 's3://my-bucket/somewhere_else'
}}
```

</File>

Some Iceberg-related configurations are only available at the model configuration level, so they cannot be set in catalogs.yml. For example, the related config `base_location_subpath` determines the exact write path for a single Iceberg table, so it only makes sense to configure per-model, rather than setting a default for all models in the catalog.

#### The `catalog_database` config

There is a dedicated configuration for the name of the database mapped to this catalog in each adapter. Unlike other catalog-level configurations, the `catalog_database` applies to *all* models configured with this `catalog_name`, it cannot be changed for specific models, and it does not follow the usual rules about the `database` config or the `generate_database_name` macro.

Meaning: If a model has both a `database` config and a `catalog_name` config, the catalog’s `catalog_database` takes precedence over the model’s database config, to tell dbt where to materialize this model.

Why? We strongly recommend a 1:1 mapping between each Iceberg catalog and the top-level namespace (logical "database") to which it is linked/synced. The namespaces don't have to be identical, but if you can make them the same everywhere, it is simpler to reason about and debug.

If you do not specify a `catalog_database`, then dbt will materialize models based on their `database` config. In this case, the catalog serves as a collection of shared Iceberg configs, but it does not map to a consistent namespace containing all its Iceberg tables.

### Old spec

_Available in dbt Core v1.10+_

Each catalog configures one or more `write_integrations`, and then specifies an "active" write integration to use for the current invocation / data warehouse.

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
          catalog_linked_database: catalog_linked_db_glue
          catalog_linked_database_type: glue
```

</File>