---
title: defer_to_target
description: "Configure which target environment dbt State defers to for self-managed deployments."
id: "defer-to-target"
tags: ['dbt State']
---

# defer_to_target

:::note Self-managed deployments only
This configuration applies to self-managed dbt deployments. If you're using the <Constant name="dbt_platform" />, deferral is configured through your environment settings in the UI.
:::

`defer_to_target` is part of [dbt State](/docs/deploy/dbt-state-setup), which manages model caching and deferral across environments.

<File name="profiles.yml">

```yaml
my_project:
  outputs:
    dev:
      type: snowflake
      # ... dev connection settings
    staging:
      type: snowflake
      # ... staging connection settings
    uat:
      type: snowflake
      # ... uat connection settings
      defer_to_target: staging
    prod:
      type: snowflake
      # ... prod connection settings
  target: prod
```

</File>

## Definition

`defer_to_target` specifies which target environment dbt State should defer to when resolving unselected upstream nodes and evaluating whether models need to be rebuilt.

In self-managed deployments with multiple environments, you can configure each target to defer to a different upstream environment. For example, a `uat` environment can defer to `staging`, while `prod` manages its own state independently.

## Default

`prod`. When omitted, all targets defer to the target named `prod`. Use this config if you want to defer to a different target (for example, `staging`), or if your production target is named something other than `prod` (for example, `production`).

## Example

### Multi-environment deferral chain

Configure a pipeline where `uat` defers to `staging`:

<File name="profiles.yml">

```yaml
my_project:
  outputs:
    dev:
      type: snowflake
      account: abc12345
      database: ANALYTICS
      schema: DBT_DEV
    staging:
      type: snowflake
      account: abc12345
      database: ANALYTICS
      schema: DBT_STAGING
    uat:
      type: snowflake
      account: abc12345
      database: ANALYTICS
      schema: DBT_UAT
      defer_to_target: staging
    prod:
      type: snowflake
      account: abc12345
      database: ANALYTICS
      schema: DBT_PROD
  target: prod
```

</File>

## Caveats to dbt State without a manifest

When dbt State tries to guess where the production version of a relation was built, it re-renders the database and schema names using the configured target from `defer_to_target`.

If either of the generated names depend on dynamic data that has changed since the production run, or the node's alias depends on any target-specific logic, then:

- The guessed location may not exist, forcing an unnecessary rebuild from scratch.
- The guessed location may point to the wrong object, resulting in invalid data.

The following examples show scenarios that will cause issues with an `orders` node. Assume the dev profile sets `schema: dbt_developer` and the prod profile sets `schema: analytics`.

### Environment variables and CLI vars

If your schema name depends on an environment variable or a CLI var, dbt State may guess the wrong location because those values differ between production and local runs.

```sql
{% macro generate_schema_name(custom_schema_name, node) %}
    {{ target.schema }}_{{ env_var('DBT_BRANCH', 'main') | replace('/', '_') }}
{% endmacro %}
```

- Production runs with `DBT_BRANCH=main`, so the relation is built at `analytics_main.orders`.
- When a developer runs with `DBT_BRANCH=feature/x`, dbt State swaps `target.schema` to the prod value (`analytics`) but reads `DBT_BRANCH` from the developer's shell, producing the guess `analytics_feature_x.orders`.
- That relation does not exist in production, so no clone is performed and the node rebuilds from scratch.

The same issue occurs with CLI vars:

```sql
{% macro generate_schema_name(custom_schema_name, node) %}
    {{ target.schema }}_{{ var('environment', 'dev') }}
{% endmacro %}
```

- Production runs `dbt run --vars '{environment: prod}'`, so the relation is built at `analytics_prod.orders`.
- When a developer runs `dbt run` with no `--vars`, `var('environment')` falls back to its default (`dev`), so dbt State guesses `analytics_dev.orders`.
- That relation does not exist in production. Vars passed at the original prod invocation are not stored anywhere dbt State can recover them.

### Path-derived names when files move

A common pattern is to use a node's directory as its schema:

```sql
{% macro generate_schema_name(custom_schema_name, node) %}
    {{ target.schema }}_{{ node.fqn[-2] }}
{% endmacro %}
```

- Production builds `models/finance/orders.sql` into `analytics_finance.orders`.
- If a developer reorganizes the project and renames the directory to `models/accounting/`, then runs `dbt run -s orders`, their local manifest records the node's parent directory as `accounting`. dbt State then guesses `analytics_accounting.orders`.
- Production is still at `analytics_finance.orders`, the clone misses, and the node rebuilds from scratch.

### Target-specific `generate_alias_name` logic

Unlike database and schema, dbt State currently does not re-render aliases. An override on `generate_alias_name` that varies by target or environment breaks the guess.

```sql
{% macro generate_alias_name(custom_alias_name=none, node=none) %}
    {%- if custom_alias_name -%}
        {{ custom_alias_name | trim }}_{{ target.name }}
    {%- else -%}
        {{ node.name }}_{{ target.name }}
    {%- endif -%}
{% endmacro %}
```

- When `target.name == 'prod'`, production builds `analytics.orders_prod`.
- When a developer runs with `target.name == 'dev'`, dbt State swaps the schema component to `analytics` but leaves the alias as-is, producing the guess `analytics.orders_dev`.

:::caution
This scenario is the most likely to cause data corruption. If you have custom `generate_alias_name` logic, provide a `manifest.json` to guarantee accurate results.
:::

## Related docs

- [About dbt State](/docs/deploy/dbt-state-about)
- [Set up dbt State](/docs/deploy/dbt-state-setup)
