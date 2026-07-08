---
title: "Using catalogs.yml"
id: catalogs-yml
sidebar_label: "Using catalogs.yml"
description: Understand how Iceberg catalogs fit into your dbt Mesh configurations.
---

dbt defines `catalogs` in a single top-level file, `catalogs.yml`, that lives in the root of your project directory.

### New spec (recommended)

Available in dbt Core v1.12+ (including dbt Core v2 and Fusion). See GitHub discussion [dbt-core#12723](https://github.com/dbt-labs/dbt-core/discussions/12723) for an explanation of the motivations behind the new spec, and an overview of what's changed.

To use the new spec, set this behavior flag:

<File name='dbt_project.yml'>

```yml
flags:
  use_catalogs_v2: true
```

</File>

Each entry in `catalogs` refers to a specific "catalog" (top-level namespace, often called "database" in dbt) containing Iceberg tables, which can be read from (and potentially written to) by multiple data platforms.

For this reason, each catalog's configuration is nested under `<adapter>` keys (`snowflake:`, `databricks:`, etc). If you run the same dbt project, with the same `catalogs.yml`, using different adapters, dbt will always use the catalog configuration for the current active adapter.

That said, one "catalog" should always point to the same actual data (Iceberg catalog), regardless of whether that catalog is external to or managed by the current active adapter.

<VersionBlock firstVersion="1.12">

<File name='catalogs.yml'>

```yml
catalogs:
  - name: my_iceberg_catalog
    type: iceberg_rest | horizon | unity | ...
    table_format: iceberg  # optional
    config:
      <adapter>:
        # Configuration for a specific adapter to integrate with this catalog.
        # See available configs for each adapter.
```

</File>

</VersionBlock>

#### Config inheritance

Configurations defined in [`catalogs.yml`](https://docs.getdbt.com/reference/model-configs) are lowest in the model-config precedence. Meaning, if you set a more-specific config for one model (within its sql/py file), or set a project-level config, those will take precedence.

For example, we set a default `base_location_root` for all models in the `finance_db` catalog:

<File name="catalogs.yml>

```yml
catalogs:
  - name: finance_db
    catalog_type: unity
    config:
      snowflake:
        base_location_root: 's3://my-bucket/finance_db'
```

But then we override that config for one particular model:

<File name="models/finance/my_special_model.sql">

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

Available in dbt Core v1.10+

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