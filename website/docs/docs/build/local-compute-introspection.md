---
title: "Building models with introspective queries locally"
id: "local-compute-introspection"
sidebar_label: "Local compute and introspection"
description: "Prepare warehouse query results and sample rows for a model, then build it locally using the same deferred refs."
availability: local_all
---

Suppose your `payments` model contains millions of rows, but a macro only needs the names of the payment methods. With local compute, you can ask Snowflake for that short list while you're connected, then use it to build a model on your computer after you disconnect.

:::info Experimental workflow
These examples require a development build of <Constant name="fusion" /> that includes saved query answers and local deferral. The feature flags below are experimental. The example uses a Snowflake profile with an explicit role. For local unit tests with fixture data, see [Running unit tests locally](/docs/build/unit-tests#run-unit-tests-locally).
:::

## Decide what to prepare

An *introspective query* is a query that dbt runs while rendering Jinja. Its result helps determine the SQL dbt generates. For example, a macro can call [`run_query`](/reference/dbt-jinja-functions/run_query) to discover which payment methods to include in a report. The finished model can use the result in two ways.

| What your model does | What you need locally |
| --- | --- |
| Generates SQL from the list of payment methods, such as a count of how many methods exist | The saved answer to the lookup. You can build this model with zero `payments` rows. |
| Generates a column per payment method and sums `amount` from `payments` | The saved method list *and* local payment rows for the SQL to scan. You can pull a small sample for development. |

A column name or data type is *schema metadata*. The values `card` and `wire` are data. Having the `method` column's type tells dbt how to query it, but it can't tell dbt which methods exist. Likewise, a one-row sample containing `card` can't tell you whether `wire` exists elsewhere in the table.

## Capture a lookup while connected

Start with a `payments` model, a Snowflake target you can read from, and the production `manifest.json` in a separate `prod-state/` directory. Keep using the same project, profile, target, and target path for capture and build. The state directory identifies your production relations. The target path stores what you prepare locally.

For example, save this model as `models/method_names.sql`. The `ref()` declares the dependency during parsing. The [`execute`](/reference/dbt-jinja-functions/execute) check delays the query until dbt renders the model.

```sql
{% set payments = ref('payments') %}
{% if execute %}
    {% set methods = run_query('select distinct method from ' ~ payments ~ ' order by 1') %}
    {% set method_count = methods.columns[0].values() | length %}
{% else %}
    {% set method_count = 0 %}
{% endif %}

select {{ method_count }} as method_count
```

Select only the child so dbt can [defer its unselected parent](/reference/node-selection/defer). By default, `--defer --state prod-state` uses the dev relation if it exists. If it's missing, dbt uses the relation recorded in the production manifest. Add `--favor-state` during preparation and build if you want to prefer the manifest relation even when dev exists.

```shell
dbt compile --compute remote --select method_names --defer --state prod-state \
  --target-path target/local-preview --beta-use-query-cache --static-analysis off
```

Here `--compute remote` runs the lookup on Snowflake and `--beta-use-query-cache` saves the result. This example turns off static analysis during capture so the connected compile only needs to render the SQL. If the warehouse returns `card` and `wire`, the rendered model is `select 2 as method_count`.

## Build after disconnecting

```shell
dbt build --compute sidecar --select method_names --defer --state prod-state \
  --target-path target/local-preview --beta-use-query-cache \
  --feature sidecar_query_cache_introspection --feature sidecar_defer_local_availability
```

`--compute sidecar` runs the model in the local DuckDB engine. `sidecar_defer_local_availability` makes the unselected `ref()` follow the dev or production relation chosen during preparation. `sidecar_query_cache_introspection` lets dbt reuse an eligible answer when it renders the model. The model above builds one row with `method_count = 2`. It never scans a local `payments` table.

## Pull rows when the model scans the input

Suppose a `payment_pivot` model uses the same lookup to choose its columns and has `from {{ ref('payments') }}` in its final SQL. While connected, run the capture command above with `--select payment_pivot`. The cache stores answers per model. Then pull a sample into the same target.

```shell
dbt pull --compute sidecar --select payment_pivot --defer --state prod-state \
  --target-path target/local-preview --sample 1 --feature sidecar_defer_local_availability
```

After you disconnect, run the local build command with `--select payment_pivot`. For example, if the saved answer contains `card` and `wire` and the sample contains one `card` payment of `10`, a pivot that sums with `else 0` produces `card = 10` and `wire = 0`. The method list reflects the warehouse lookup. The totals reflect the rows in your sample.

## When to prepare again

- **The dev table disappeared.** Repeat the connected capture, pull, or both, according to what the model uses. Plain `--defer` then follows the latest successful preparation, even if an older dev copy still exists locally.
- **The role, physical table name, or lookup SQL changed.** Capture with the context you want to use offline. An answer for the old role or table won't satisfy the new lookup. Answers can also expire. A saved answer represents the time it was captured.
- **The error names a missing local table.** Check where the table is read. If the final SQL scans it, pull rows. If a macro reads it, check the selection, target path, and flags on both commands. Replay supports simple value lookups against a fully qualified external table. Joins, schema discovery, and other unsupported lookups use the local engine and may need additional local inputs.
- **You're editing the parent too.** Select the parent along with the child, for example `--select +payment_pivot`. A lookup against a parent rebuilt in that invocation uses the local parent, so the generated columns reflect your edits.
