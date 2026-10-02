---
title: "Mapping project folders to warehouse schemas"
id: "6-mapping-folders-to-warehouse"
description: "Map dbt project folders to warehouse schemas, including how that changes in development and production."
sidebar_label: "Mapping folders to warehouse schemas"
displayText: Mapping project folders to warehouse schemas
hoverSnippet: Map dbt project folders to warehouse schemas.
availability: all_users
---

The earlier pages in this guide cover how to structure folders in your dbt project. This page covers where those folders land in the warehouse.

Folders are how you organize code. Schemas (datasets, on BigQuery) are how that code shows up for people querying the warehouse. Map them on purpose so staging, intermediate, and marts stay easy to find, and so development does not overwrite production.

## Default mapping

A default mapping is the starting pattern this guide recommends: each model folder uses a custom schema of the same name (`+schema: staging`, `+schema: marts`, and so on). You can change those custom schema names if your warehouse team already uses different ones. The purpose of a default is so you do not invent a new layout for every project, and so people querying the warehouse can tell staging, intermediate, and marts apart without opening the dbt project.

Use the same names for your project folders and your custom schemas. With dbt's default behavior, the warehouse schema is still `<target_schema>_<custom_schema>`. The [Development and production schemas](#development-and-production-schemas) section shows those full names.

| Project folder | Layer | Custom schema (`+schema`) | What dbt does |
| --- | --- | --- | --- |
| Sources (often a `raw` schema) | Raw inputs | `raw` (not set by dbt) | Reads only. dbt does not build this layer. |
| `models/staging/` | Staging | `staging` | Builds cleaned, source-conformed models. |
| `models/intermediate/` | Intermediate | `intermediate` | Builds models that are not meant for end users. Keep this schema restricted. |
| `models/marts/` | Marts | `marts` | Builds business-conformed models for reporting. |

<br />

Sources are declared in YAML (often next to staging models) and point at tables that already exist, typically in `raw`. For more on that split, refer to [Staging](/best-practices/how-we-structure/2-staging) and [Sources](/docs/build/sources).

This mapping is the same on every warehouse, and on <Constant name="core" /> and the <Constant name="fusion_engine" />. What changes is the container name: schema on Snowflake, Redshift, Postgres, and Databricks, dataset on BigQuery. Databricks Unity Catalog also has a catalog above the schema. Configure that with [custom databases](/docs/build/custom-databases) when you need it. Do not create a different folder mapping per warehouse.

## Folder config

Set `+schema` on the folder in `dbt_project.yml`, the same way this guide sets default materializations on folders. Every model in that folder inherits the schema. Configure a schema on an individual model only when that model should land in a different schema.

The `jaffle_shop` key must match the `name` in your `dbt_project.yml`. This guide uses `jaffle_shop`. If your project uses a different name, use that instead. The [Jaffle Shop](https://github.com/dbt-labs/jaffle-shop) example has `staging` and `marts` only. The `intermediate` block is unused until you add that folder. That is expected.

<File name="dbt_project.yml">

```yaml
models:
  jaffle_shop:
    staging:
      +materialized: view
      +schema: staging
    intermediate:
      +materialized: view
      +schema: intermediate
    marts:
      +materialized: table
      +schema: marts
```

</File>

[The rest of the project](/best-practices/how-we-structure/5-the-rest-of-the-project) explains why this guide sets defaults on folders instead of on every model.

## Development and production schemas

Every dbt run has a _target schema_. That is the schema for the environment you are running in: your personal development schema, a CI schema, or production. The [Custom schemas](/docs/build/custom-schemas) page calls this out because it is the piece people miss.

The `+schema` values in [Folder config](#folder-config) are custom schemas. They do not replace the target schema. By default, dbt joins the two names: `<target_schema>_<custom_schema>`.

That join is the point. If `+schema: marts` built a schema named only `marts`, every developer would write into the same `marts` schema, and could overwrite production. Prefixing with the target schema keeps development in `alice_dev_marts` and production in `analytics_prod_marts`.

The following table shows the warehouse schema names for that config.

| Folder | Config | Production (`analytics_prod`) | Your development (`alice_dev`) |
| --- | --- | --- | --- |
| `models/staging/` | `+schema: staging` | `analytics_prod_staging` | `alice_dev_staging` |
| `models/intermediate/` | `+schema: intermediate` | `analytics_prod_intermediate` | `alice_dev_intermediate` |
| `models/marts/` | `+schema: marts` | `analytics_prod_marts` | `alice_dev_marts` |

<br />

You use the same `dbt_project.yml` in development and production. The warehouse schema names change because the target schema comes from the [environment](/docs/dbt-platform-environments) (<Constant name="dbt_platform" />) or the [profile](/docs/local/dbt-core-environments) (<Constant name="core" />).

If you want production to use `marts` (not `analytics_prod_marts`), use the built-in [`generate_schema_name_for_env`](/docs/build/custom-schemas#a-built-in-alternative-pattern-for-generating-schema-names) pattern. That pattern is different from the default `<target_schema>_<custom_schema>` names. In production (`target.name` is `prod`), models land in the custom schema only (`marts`). In development, custom schemas are ignored, so every model lands in your target schema (`alice_dev`), not `alice_dev_marts`. Set the production target name to `prod` for that pattern to apply. Do not remove the target schema from the default macro, or developers will write into the same schemas.

## Medallion names

Some teams, especially on Databricks, call these layers Bronze, Silver, and Gold. That is a naming convention, not a different dbt structure. Use this folder mapping, and treat Medallion as labels for the same layers.

| If they say | In dbt that is |
| --- | --- |
| Bronze | Sources in `raw` (read-only) |
| Silver | Staging and intermediate |
| Gold | Marts |

<br />

Keep `staging`, `intermediate`, and `marts` as the custom schema names in this guide so they match the folders. If your warehouse standard requires `silver` and `gold` as schema names, those are aliases for the same layers. Set `+schema` to the names your warehouse team already uses.

For Databricks-specific performance guidance, refer to [Optimize dbt models on Databricks](/guides/optimize-dbt-models-on-databricks). For isolating raw source data in Unity Catalog, refer to [Best practices for dbt and Unity Catalog](/best-practices/dbt-unity-catalog-best-practices).

## Related docs

- [How we structure our dbt projects](/best-practices/how-we-structure/1-guide-overview)
- [Custom schemas](/docs/build/custom-schemas)
- [Staging](/best-practices/how-we-structure/2-staging)
- [Intermediate](/best-practices/how-we-structure/3-intermediate)
- [Marts](/best-practices/how-we-structure/4-marts)
- [The rest of the project](/best-practices/how-we-structure/5-the-rest-of-the-project)
