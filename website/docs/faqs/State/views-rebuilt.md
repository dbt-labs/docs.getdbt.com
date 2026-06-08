---
title: Why is my model being rebuilt instead of reused?
description: "Learn the common reasons dbt State rebuilds models instead of reusing them."
sidebar_label: 'Why is my model being rebuilt instead of reused?'
id: views-rebuilt
---

dbt State decides whether to reuse a model by comparing its compiled SQL to the hash from the previous run. If anything changes that compiled SQL between runs, even when the logic hasn't meaningfully changed, dbt State rebuilds the model.

These two patterns commonly cause unexpected rebuilds:

- [Views with `select *`](#views-with-select-)
- [Non-deterministic Jinja templating](#non-deterministic-jinja-templating)

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

dbt State reuses a model when its compiled SQL matches the stored hash. For views with `select *`, dbt State can't determine which columns the query selects without querying the upstream schema, so it can't confirm the SQL is unchanged. It always rebuilds these views to avoid reusing a stale result.

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

Some macros, such as `dbt_utils.get_relations_by_pattern` (an introspective macro) combined with `dbt_utils.union_relations`, can return relations in a different order on each run. That produces different compiled SQL even when your project logic hasn't changed. dbt State detects a new hash and rebuilds the model.

This pattern can affect any model type, not just views. If a base or staging model rebuilds on every run, all of its downstream models rebuild, too.

## How to diagnose

In <Constant name="core" /> v1.7–v1.12, run the `dbt-state explain` command to see why dbt State rebuilt or reused a specific model.

:::caution Experimental
The `dbt-state explain` command is experimental. It isn't available in the <Constant name="fusion_engine" /> or <Constant name="dbt_platform" /> yet.
:::

