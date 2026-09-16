---
title: pre_clone
description: "Configure when dbt State pre-populates incremental models and snapshots in dev by cloning their production counterparts."
id: "pre-clone"
tags: ['dbt State']
---

# pre_clone

<Tabs>
<TabItem value="project" label="Project YAML file">

<File name="dbt_project.yml">

```yaml
models:
  [<resource-path>](/reference/resource-configs/resource-path):
    [+](/reference/resource-configs/plus-prefix)state:
      pre_clone: never | if_missing | always
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
        pre_clone: never | if_missing | always
```

</File>
</TabItem>

<TabItem value="sql" label="SQL file config">

<File name="models/<filename>.sql">

```sql
{{ config(
    state={
      "pre_clone": "never" | "if_missing" | "always"
    }
) }}
```

</File>
</TabItem>
</Tabs>

## Definition

`pre_clone` controls whether and when dbt State pre-populates incremental models and snapshots in your development environment by cloning their production counterparts before a run.

| Value | Behavior |
|-------|----------|
| `never` | Never pre-clone. Incremental models and snapshots start from whatever exists in the development environment. If it doesn't already exist, it's built from scratch. |
| `if_missing` (default) | Clone only if the target table does not yet exist in development. After the first clone, subsequent runs build incrementally on top of the cloned data. |
| `always` | Clone before every run, regardless of whether the development table already exists. Guarantees development incremental state matches production on every run. |

:::note
Non-incremental materializations are never pre-cloned. This setting has no effect on them.
:::

## Examples

### Always sync development with production

Use `always` when you want development to reflect the current production state before every run:

<File name="models/fct_orders.yml">

```yaml
models:
  - name: fct_orders
    config:
      state:
        pre_clone: always
```

</File>

### Isolate dev state from production

Use `never` when you want development to be fully independent from production:

<File name="dbt_project.yml">

```yaml
models:
  +state:
    pre_clone: never
```

</File>

## Related docs

- [About dbt State](/docs/deploy/dbt-state-about)
- [Set up dbt State](/docs/deploy/dbt-state-setup)
