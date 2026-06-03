---
title: Why is my model being rebuilt instead of reused?
description: "Learn the common reasons dbt State rebuilds models instead of reusing them, including SELECT *, non-deterministic macros, and semantic differences from state-aware orchestration."
sidebar_label: 'Why is my model being rebuilt instead of reused?'
id: views-rebuilt
---

dbt State determines whether to reuse a model by comparing its compiled SQL against the previously stored hash. If anything causes that compiled SQL to differ between runs (even without a meaningful logic change), dbt State rebuilds the model.

Two patterns commonly cause this:

- [Views with `select *`](#views-with-select-)
- [Non-deterministic SQL from introspective macros](#non-deterministic-sql-from-introspective-macros)

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

## Non-deterministic SQL from introspective macros

Some macros, such as `dbt_utils.get_relations_by_pattern` combined with `dbt_utils.union_relations`, don't always return relations in the same order. This means the compiled SQL can look different on every run, even when nothing has actually changed. dbt State sees a new hash and rebuilds the model.

This can affect any model type, not just views. If a base or staging model rebuilds every run, all of its downstream models will, too.

## Difference from state-aware orchestration

If you're migrating from state-aware orchestration and seeing more rebuilds than expected, this is a known behavioral difference:

- State-aware orchestration's `build_after` is tied to the model itself; it won't rebuild a model within the configured time window, regardless of what changed in upstream logic.
- dbt State's `lag_tolerance` is tied to upstream data freshness, but dbt State still rebuilds if the compiled SQL has changed, _even within the tolerance window_.

This means that in state-aware orchestration, non-deterministic or `select *` queries were silently tolerated during the `build_after` period. In dbt State, any compiled SQL change triggers a rebuild.

## How to diagnose

In <Constant name="core" /> v1.7–v1.12, you can use the `dbt-state explain` command to see why a specific model was rebuilt or reused. This command is not yet available in the <Constant name="fusion_engine" />.

