---
title: require_fresh_data_from
description: "Configure how many direct parent nodes need fresh data before a node is rebuilt by dbt State."
id: "require-fresh-data-from"
tags: ['dbt State']
---

# require_fresh_data_from

<Tabs>
<TabItem value="project" label="Project YAML file">

<File name="dbt_project.yml">

```yaml
models:
  [<resource-path>](/reference/resource-configs/resource-path):
    [+](/reference/resource-configs/plus-prefix)state:
      require_fresh_data_from: any | all
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
        require_fresh_data_from: any | all
```

</File>
</TabItem>

<TabItem value="sql" label="SQL file config">

<File name="models/<filename>.sql">

```sql
{{ config(
    state={
      "require_fresh_data_from": "any" | "all"
    }
) }}
```

</File>
</TabItem>
</Tabs>

## Definition

`require_fresh_data_from` controls how many direct parent nodes need fresh data before dbt State considers this node eligible for a rebuild. dbt State still looks for an object to reuse before triggering an actual rebuild.

| Value | Behavior |
|-------|----------|
| `any` (default) | The node becomes eligible for a rebuild when _any_ direct parent has fresh data. Rebuilds more frequently; may increase spend. |
| `all` | The node only becomes eligible for a rebuild when _all_ direct parents have fresh data. Rebuilds less frequently; reduces spend. |

## Default

`any`

## Examples

### Require all parents to have fresh data

Use `all` for a model that joins multiple sources and should only rebuild when every upstream dependency has updated:

<File name="models/fct_orders.yml">

```yaml
models:
  - name: fct_orders
    config:
      state:
        require_fresh_data_from: all
```

</File>

### Apply a project-wide default

<File name="dbt_project.yml">

```yaml
models:
  +state:
    require_fresh_data_from: all
```

</File>

## Related docs

- [About dbt State](/docs/deploy/dbt-state-about)
- [Set up dbt State](/docs/deploy/dbt-state-setup)
