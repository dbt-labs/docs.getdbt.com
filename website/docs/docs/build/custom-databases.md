---
title: "Custom databases"
id: "custom-databases"
---


:::info A word on naming

Different warehouses have different names for "logical databases". The information in this document covers "databases" on Snowflake, Redshift, and Postgres, as well as "projects" on BigQuery.

The values `project` and `database` are interchangeable in BigQuery project configurations.

:::

## Configuring custom databases

The logical database that dbt models are built into can be configured using the `database` model configuration. If this configuration is not supplied to a model, then dbt will use the database configured in the active target from your `profiles.yml` file. If the `database` configuration *is* supplied for a model, then dbt will build the model into the configured  database.

The `database` configuration can be supplied for groups of models in the `dbt_project.yml` file, or for individual models in model SQL files.

### Configuring database overrides in `dbt_project.yml`:

This config changes all models in the `jaffle_shop` project to be built into a database called `jaffle_shop`.

<File name='dbt_project.yml'>

```yaml
name: jaffle_shop

models:
  jaffle_shop:
    +database: jaffle_shop

    # For BigQuery users:
    # project: jaffle_shop
```

</File>

### Configuring database overrides in a model file

This config changes a specific model to be built into a database called `jaffle_shop`.

<File name='models/my_model.sql'>

```sql

{{ config(database="jaffle_shop") }}

select * from ...
```

</File>

### generate_database_name

<Changelog>New in v0.16.0</Changelog>

The database name generated for a model is controlled by a macro called `generate_database_name`. This macro can be overridden in a dbt project to change how dbt generates model database names. This macro works similarly to the [generate_schema_name](/docs/build/custom-schemas#advanced-custom-schema-configuration) macro.

To override dbt's database name generation, create a macro named `generate_database_name` in your own dbt project. The `generate_database_name` macro accepts two arguments:

1. The custom database supplied in the model config
2. The node that a custom database is being generated for

The default implementation of `generate_database_name` simply uses the supplied `database` config if one is present, otherwise the database configured in the active `target` is used. This implementation looks like this:

<File name='get_custom_database.sql'>

```jinja2
{% macro generate_database_name(custom_database_name=none, node=none) -%}

    {%- set default_database = target.database -%}
    {%- if custom_database_name is none -%}

        {{ default_database }}

    {%- else -%}

        {{ custom_database_name | trim }}

    {%- endif -%}

{%- endmacro %}

```

</File>

<VersionBlock firstVersion="1.6">

### Managing different behaviors across packages

See docs on macro `dispatch`: ["Managing different global overrides across packages"](/reference/dbt-jinja-functions/dispatch)

</VersionBlock>

## Considerations

### BigQuery

When dbt opens a BigQuery connection, it will do so using the `project_id` defined in your active `profiles.yml` target. This `project_id` will be billed for the queries that are executed in the dbt run, even if some models are configured to be built in other projects.
