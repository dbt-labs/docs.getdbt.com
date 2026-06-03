---
title: Why is my model being rebuilt instead of reused?
description: "Learn the common reasons dbt State rebuilds models instead of reusing them, including SELECT *, non-deterministic macros, and semantic differences from state-aware orchestration."
sidebar_label: 'Why is my model being rebuilt instead of reused?'
id: views-rebuilt
---

dbt State determines whether to reuse a model by comparing its compiled SQL against the previously stored hash. If anything causes that compiled SQL to differ between runs (even without a meaningful logic change), dbt State rebuilds the model.

Two patterns commonly cause this:

- [Views with `select *`](#views-with-select-)
- [Non-deterministic Jinja templating](#non-deterministic-jinja-templating)

## Views with `select *`

Views that contain `select *` anywhere in their SQL, including inside CTEs, are always rebuilt. A common staging pattern like the following triggers this:

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

dbt State reuses a model by confirming its SQL hasn't changed. With `select *`, it can't tell what columns are actually being selected without querying the upstream schema. dbt State can't confirm the query is the same, and rebuilds the view to be safe.

:::tip
To make this view eligible for reuse, remove the import CTE and reference the source directly with explicit column names:

```sql
select
    id as order_id,
    ...
from {{ source("my_source", "my_table") }}
```
:::

## Non-deterministic Jinja templating

Some macros, such as the introspective macro `dbt_utils.get_relations_by_pattern` combined with `dbt_utils.union_relations`, don't always return relations in the same order. This means the compiled SQL can look different on every run, even when nothing has actually changed. dbt State sees a new hash and rebuilds the model.

This can affect any model type, not just views. If a base or staging model rebuilds every run, all of its downstream models will, too.

## How to diagnose

In <Constant name="core" /> v1.7–v1.12, you can use the `dbt-state explain` command to see why a specific model was rebuilt or reused.

:::caution Experimental
The command `dbt-state explain` is experimental and not yet available in the <Constant name="fusion_engine" /> or <Constant name="dbt_platform" />.
:::

