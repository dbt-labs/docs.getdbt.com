---
title: "Mapping project folders to warehouse schemas"
id: "6-mapping-folders-to-warehouse"
description: "Map dbt project folders to warehouse schemas, including how that changes in development and production."
sidebar_label: "Mapping folders to warehouse schemas"
displayText: Mapping project folders to warehouse schemas
hoverSnippet: Map dbt project folders to warehouse schemas.
availability: all_users
---

Folders organize your code. Schemas (datasets, on BigQuery) are how that code shows up in the warehouse. Map folders to schemas so staging, intermediate, and marts stay easy to find, and so development does not overwrite production.

## Default mapping

Name your custom schemas after your project folders: `+schema: staging`, `+schema: intermediate`, and `+schema: marts`. If your warehouse uses different names, use those instead.

Every dbt run has a _target schema_ for the environment you are in (development, CI, or production). Custom `+schema` values do not replace it. By default, dbt joins them: `<target_schema>_<custom_schema>`. That keeps development in schemas like `alice_dev_marts` and production in `analytics_prod_marts`, so developers do not write into the same schemas as production. Refer to [Custom schemas](/docs/build/custom-schemas).

Resulting schema names:

| Folder | Config | Production (`analytics_prod`) | Development (`alice_dev`) |
| --- | --- | --- | --- |
| `models/staging/` | `+schema: staging` | `analytics_prod_staging` | `alice_dev_staging` |
| `models/intermediate/` | `+schema: intermediate` | `analytics_prod_intermediate` | `alice_dev_intermediate` |
| `models/marts/` | `+schema: marts` | `analytics_prod_marts` | `alice_dev_marts` |

<br />

The target schema comes from the [environment](/docs/dbt-platform-environments) in <Constant name="dbt_platform" /> or from the [profile](/docs/local/dbt-environments) when you run locally, so you use the same `dbt_project.yml` everywhere.

This mapping is the same on every warehouse. Only the container name changes: schema on Snowflake, Redshift, Postgres, and Databricks, and dataset on BigQuery. Configure the database, project, or catalog that contains the schema with [custom databases](/docs/build/custom-databases).

Sources point at tables that already exist, typically in `raw`. dbt reads those tables; it does not build them. Refer to [Staging](/best-practices/how-we-structure/2-staging) and [Sources](/docs/build/sources).

:::note
If the [Jaffle Shop](https://github.com/dbt-labs/jaffle-shop) example loads seed data into `raw` with `load_source_data`, those seeds use `+schema: raw` and dbt builds them in `<target_schema>_raw` by default.

If you materialize intermediate models as ephemeral, dbt does not create a relation in the intermediate schema. Refer to [Intermediate](/best-practices/how-we-structure/3-intermediate).
:::

## Folder config

Set `+schema` on the folder in `dbt_project.yml`. Every model in that folder inherits it. Configure a schema on an individual model only when that model should use a different schema.

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

The `jaffle_shop` key must match the `name` in your `dbt_project.yml`. The [Jaffle Shop](https://github.com/dbt-labs/jaffle-shop) example has `staging` and `marts` only; the `intermediate` block is unused until you add that folder.

This guide sets defaults on folders instead of on every model. Refer to [The rest of the project](/best-practices/how-we-structure/5-the-rest-of-the-project).

## Production schema names

To use `marts` in production (not `analytics_prod_marts`), use the built-in [`generate_schema_name_for_env`](/docs/build/custom-schemas#a-built-in-alternative-pattern-for-generating-schema-names) pattern.

In production (`target.name` is `prod`), dbt writes models to the custom schema only (`marts`). In development, dbt ignores custom schemas, so it writes every model to your target schema (`alice_dev`). Set the production target name to `prod` for that pattern to apply.

Do not change the default `generate_schema_name` macro to drop the target schema in every environment, or developers will write into the same schemas as production.

## Medallion names

If your warehouse uses Bronze, Silver, and Gold, those names map to the same layers. You do not need a different dbt folder layout.

| Warehouse name | In this guide |
| --- | --- |
| Bronze | Sources in `raw` (read-only) |
| Silver | Staging and intermediate |
| Gold | Marts |

<br />

Keep `staging`, `intermediate`, and `marts` as the custom schema names in this guide so they match the folders. If your warehouse requires `silver` and `gold` as schema names, set `+schema` to those names instead.

If you set `+schema: silver` on both `staging` and `intermediate`, those models share one schema and you lose a separate intermediate schema. To keep that separation, use two custom schema names.

## Related docs

- [How we structure our dbt projects](/best-practices/how-we-structure/1-guide-overview)
- [Custom schemas](/docs/build/custom-schemas)
- [Staging](/best-practices/how-we-structure/2-staging)
- [Intermediate](/best-practices/how-we-structure/3-intermediate)
- [Marts](/best-practices/how-we-structure/4-marts)
- [The rest of the project](/best-practices/how-we-structure/5-the-rest-of-the-project)
- [Optimize dbt models on Databricks](/guides/optimize-dbt-models-on-databricks)
- [Best practices for dbt and Unity Catalog](/best-practices/dbt-unity-catalog-best-practices)
