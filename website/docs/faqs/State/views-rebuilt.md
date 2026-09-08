---
title: Why is my model being rebuilt instead of reused?
description: "Learn the common reasons dbt State rebuilds models instead of reusing them."
sidebar_label: 'Why is my model being rebuilt instead of reused?'
id: views-rebuilt
---

dbt State decides whether to reuse a model by parsing the rendered SQL into a syntax tree and comparing the hash. If the hash has changed (implying the model's logic has changed), dbt State rebuilds the model.

dbt State prioritizes safety and precision; if it can't guarantee skipping a node is safe, then it rebuilds the node to be sure. A few patterns that commonly cause overeager rebuilds are listed on this page, along with recommendations to increase reuse rate.

The following patterns commonly cause unexpected rebuilds:

- [Views with `select *`](#views-with-select)
- [Non-deterministic Jinja templating](#non-deterministic-jinja-templating)
- [Models with external sources in BigQuery](#models-with-external-sources-in-bigquery)
- [Models with custom materializations](#models-with-custom-materializations)

## Views with `select *` {#views-with-select}

dbt State reuses a model when its compiled SQL matches the stored hash. When a view uses `select *` directly on a `ref()` or `source()`, dbt can't determine the column list at parse time &mdash; the upstream model or source table might have gained or lost columns since the last run. To be safe, dbt State forces a rebuild.

For example, this view will be rebuilt even if `stg_orders` hasn't changed because dbt can't know at parse time whether `stg_orders` has the same columns as before:

```sql
-- stg_orders_view.sql (materialized: view)
select * from {{ ref('stg_orders') }}
```

However, if you use `select *` on a CTE, dbt can resolve the columns from the CTE definition and safely reuse the view:

```sql
with renamed as (
    select order_id, customer_id, order_total from {{ ref('stg_orders') }}
)

select * from renamed
```

If a CTE explicitly names its columns, a `select *` that reads from that CTE won't force a rebuild even if an earlier CTE used `select *` on a `ref()` or `source()`. The typical staging pattern is reused:

```sql
with source as (
    select * from {{ source('jaffle_shop', 'orders') }}
),

renamed as (
    select
        id as order_id,
        user_id as customer_id,
        amount as order_total
    from source
)

select * from renamed
```


:::tip
To avoid forced rebuilds, use explicit column names when selecting directly from a `ref()` or `source()`. You can also exclude views from execution using `--exclude config.materialized:view`.
:::

## Non-deterministic Jinja templating

Some macros and environment variables can cause unexpected rebuilds. For example, `dbt_utils.get_relations_by_pattern` (an introspective macro) combined with `dbt_utils.union_relations` can return relations in a different order on each run, producing different rendered SQL even when your project logic hasn't changed. Similarly, environment variables that change between runs produce different rendered SQL on every run:

```sql
select '{{ env_var("AIRFLOW_RUN_ID") }}' as airflow_run_id, ...
```

Because the query result order or the environment variable's value changes, the rendered SQL differs from the stored hash on every run. dbt State treats this as a code change and rebuilds the model, even though the underlying project logic hasn't changed. This pattern can affect any model type, not just views; if a base or staging model rebuilds on every run, all of its downstream models rebuild, too.

To avoid these unnecessary rebuilds, enable [`compare_unrendered_code`](/reference/resource-configs/compare-unrendered-code). When enabled, dbt State checks both the Jinja template and rendered SQL; non-deterministic values that don't change the template don't trigger a rebuild. For example:

```sql
{{ config(state={"compare_unrendered_code": true}) }}

select '{{ env_var("AIRFLOW_RUN_ID") }}' as airflow_run_id, ...
```

## Models with external sources on BigQuery

On BigQuery, models that use external sources (such as Google Sheets) always rebuild because BigQuery doesn't expose modification timestamps for external sources, so dbt State can't determine freshness.

:::tip
To prevent external sources from always being considered stale, configure [`loaded_at_field`](/reference/resource-properties/freshness#loaded_at_field) or [`loaded_at_query`](/reference/resource-properties/freshness#loaded_at_query) in your source definition to point to a timestamp field. This lets dbt State query a timestamp field directly to determine freshness, rather than relying on warehouse metadata.
:::

## Models with custom materializations

Models using custom materializations are always built and are never reused. Custom materializations may have side effects (for example, modifying table properties or writing to other schemas), and dbt State cannot safely determine whether skipping the run would produce the same result.

## How to diagnose

After a run, use <VersionBlock firstVersion="2.0">[`dbt state explain`](/reference/commands/state-explain)</VersionBlock><VersionBlock lastVersion="1.99">[`dbt-state explain`](/reference/commands/state-explain)</VersionBlock> to see why dbt State rebuilt, reused, or cloned a specific model. For a detailed breakdown, use the `--verbose` flag with `-s` to select your model:

:::note
The command name differs by version: <Constant name="core_v2" /> uses `dbt state explain` (with a space), while <Constant name="core_v1" /> uses `dbt-state explain` (with a hyphen).
:::

<VersionBlock firstVersion="2.0">

```bash
dbt state explain --verbose -s my_model_name
```

</VersionBlock>

<VersionBlock lastVersion="1.99">

```bash
dbt-state explain --verbose -s my_model_name
```

</VersionBlock>

If you use the <Constant name="dbt_platform" />, the same information is available without running a command &mdash; go to the [**Explain** tab](/docs/deploy/dbt-state-interface#explain-tab) on the job run details page to see the full decision breakdown for each node.

