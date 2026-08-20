---
title: metadata_warehouse
description: "Specify a dedicated Snowflake warehouse for dbt State metadata lookups to avoid queueing on your main compute warehouse."
id: "metadata-warehouse"
tags: ['dbt State']
---

# metadata_warehouse

:::note Snowflake only
This configuration is available in Snowflake only.
:::

<File name="profiles.yml">

```yaml
my_project:
  outputs:
    prod:
      type: snowflake
      # ... other connection settings
      warehouse: TRANSFORMING
      metadata_warehouse: METADATA_XS
  target: prod
```

</File>

## Definition

dbt State performs metadata introspection queries to determine whether models need to be rebuilt. On Snowflake, these queries run against your configured `warehouse` by default, which can cause queuing when your primary warehouse is under heavy load.

`metadata_warehouse` lets you route these queries to a separate, smaller warehouse to keep introspection overhead off your main compute resource. When set, dbt issues metadata queries concurrently &mdash; one per schema, up to your profile's thread count &mdash; so they run in parallel without competing with model execution.

Without `metadata_warehouse`, metadata queries run on your main warehouse. If they take longer than 15 seconds, dbt emits a warning suggesting you configure a dedicated warehouse.

You can also use `metadata_warehouse` on the <Constant name="dbt_platform" /> by adding it as an [extended attribute](/docs/dbt-platform-environments#extended-attributes) in your environment settings.

:::note
This configuration currently applies only to dbt State metadata queries. It might be used more broadly in the future. See [dbt-core#12122](https://github.com/dbt-labs/dbt-core/issues/12122) for the feature request.
:::

## Default

Falls back to the `warehouse` setting in `profiles.yml`.

## Example

### Separate metadata and execution warehouses

<File name="profiles.yml">

```yaml
my_project:
  outputs:
    prod:
      type: snowflake
      account: abc12345
      database: ANALYTICS
      schema: DBT_PROD
      warehouse: TRANSFORMING          # used for model execution
      metadata_warehouse: METADATA_XS  # used for dbt State introspection
  target: prod
```

</File>

## Related docs

- [About dbt State](/docs/deploy/dbt-state-about)
- [Snowflake configuration](/reference/resource-configs/snowflake-configs)
