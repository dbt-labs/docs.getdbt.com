---
title: Why is my model being rebuilt instead of reused?
description: "Learn the common reasons dbt State rebuilds models instead of reusing them."
sidebar_label: 'Why is my model being rebuilt instead of reused?'
id: views-rebuilt
---

dbt State decides whether to reuse a model by parsing the rendered SQL into a syntax tree and comparing the hash. If the hash has changed (implying the model's logic has changed), dbt State rebuilds the model.

dbt State prioritizes safety and precision; if it can't guarantee skipping a node is safe, then it rebuilds the node to be sure. A few patterns that commonly cause overeager rebuilds are listed on this page, along with recommendations to increase reuse rate.

The following patterns commonly cause unexpected rebuilds:

- [Views with `select *`](#views-with-select-)
- [Non-deterministic Jinja templating](#non-deterministic-jinja-templating)
- [Models with external sources in BigQuery](#models-with-external-sources-in-bigquery)

## Views with `select *`

dbt State always rebuilds views that use `select *` anywhere in their SQL, including inside CTEs. A common staging pattern like the following triggers this behavior:

```sql
with source as (
    select * from {{ source("my_source", "my_table") }}
),

renamed as (
    select
        id as order_id,
        ...
    from source
)

select * from renamed
```

dbt State reuses a model when its compiled SQL matches the stored hash. For views with `select *`, dbt State can't determine which columns the query selects without querying the upstream schema, so it can't confirm the SQL is unchanged. It always rebuilds these views to avoid errors &mdash; if the upstream table gains a column, querying the view can fail. When dbt State rebuilds a view, it also re-runs any tests defined on the model.

:::tip
To make this view eligible for reuse, remove the imported CTE and reference the source directly with explicit column names:

```sql
select
    id as order_id,
    ...
from {{ source("my_source", "my_table") }}
```

If you can't remove `select *`, you can exclude views from running with `--exclude config.materialized:view`.
:::

## Non-deterministic Jinja templating

Some macros, such as `dbt_utils.get_relations_by_pattern` (an introspective macro) combined with `dbt_utils.union_relations`, can return relations in a different order on each run. That produces different compiled SQL even when your project logic hasn't changed. dbt State detects a new hash and rebuilds the model.

This pattern can affect any model type, not just views. If a base or staging model rebuilds on every run, all of its downstream models rebuild, too.

## Models with external sources on BigQuery

On BigQuery, models that use external sources (such as Google Sheets) always rebuild because BigQuery doesn't expose modification timestamps for external sources, so dbt State can't determine freshness.

:::tip
To prevent external sources from always being considered stale, configure [`loaded_at_field`](/reference/resource-properties/freshness#loaded_at_field) or [`loaded_at_query`](/reference/resource-properties/freshness#loaded_at_query) in your source definition to point to a timestamp field. This lets dbt State query a timestamp field directly to determine freshness, rather than relying on warehouse metadata.
:::

## How to diagnose

In <Constant name="core" /> v1.7–v1.12, run the `dbt-state explain` command to see why dbt State rebuilt or reused a specific model.

:::caution Experimental
The `dbt-state explain` command is experimental. It isn't available in the <Constant name="fusion_engine" /> or <Constant name="dbt_platform" /> yet.
:::

