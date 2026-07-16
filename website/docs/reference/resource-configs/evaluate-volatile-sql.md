---
title: evaluate_volatile_sql
description: "Configure whether dbt State stores and compares the runtime results of volatile SQL functions when deciding whether to rebuild a node."
id: "evaluate-volatile-sql"
tags: ['dbt State']
---

# evaluate_volatile_sql

<Tabs>
<TabItem value="project" label="Project YAML file">

<File name="dbt_project.yml">

```yaml
models:
  [<resource-path>](/reference/resource-configs/resource-path):
    [+](/reference/resource-configs/plus-prefix)state:
      evaluate_volatile_sql: true | false
```

</File>
</TabItem>

<TabItem value="property" label="Properties YAML file">

<File name="models/<filename>.yml">

```yaml
models:
  - name: my_model
    config:
      state:
        evaluate_volatile_sql: true | false
```

</File>
</TabItem>

<TabItem value="sql" label="SQL file config">

<File name="models/<filename>.sql">

```sql
{{ config(
    state={
      "evaluate_volatile_sql": true | false
    }
) }}
```

</File>
</TabItem>
</Tabs>

## Definition

dbt State determines whether a node's data has changed based on the freshness of its parents. However, volatile SQL functions like `CURRENT_TIMESTAMP()`, `RANDOM()`, or `UUID_STRING()` can change a node's output from one run to the next even when no upstream data has changed.

By default, dbt State treats volatile functions as static parts of the node's compiled code, not as a source of new data. This is the right choice in most cases — otherwise, no node containing `CURRENT_TIMESTAMP()` would ever be reusable.

When `evaluate_volatile_sql` is set to `true`, dbt State stores the _result_ of each volatile function call and uses those stored values for future comparisons. This means the node is rebuilt when the function's output changes &mdash; for example, when `current_date()` returns a new value after midnight.

| Value | Behavior |
|-------|----------|
| `false` (default) | Volatile functions are treated as static code. The node can be reused even if function outputs would differ between runs. |
| `true` | dbt State stores and compares the runtime result of volatile functions. The node rebuilds when those results change. |

## Examples

### Rebuild when the date changes

Use `evaluate_volatile_sql: true` for a node whose output is meaningfully affected by the current date:

<File name="models/<filename>.sql">

```sql
{{ config(state={"evaluate_volatile_sql": true}) }}

select
  *,
  account_created_at >= current_date() as signed_up_today
from {{ ref('dim_customers') }}
```

</File>

With this config enabled, dbt State stores the result of `current_date()` after each build. On the next run after midnight, the stored value no longer matches and the node is rebuilt, even if `dim_customers` hasn't changed.

### Default behavior

For nodes where volatile function output doesn't affect business logic, no config is required:

<File name="models/<filename>.sql">

```sql
select
  *,
  getdate() as _dbt_built_at
from {{ ref('dim_customers') }}
```

</File>

dbt State treats `getdate()` as static code. The node remains reusable as long as its parents haven't changed.

## Related docs

- [About dbt State](/docs/deploy/dbt-state-about)
- [Set up dbt State](/docs/deploy/dbt-state-setup)
