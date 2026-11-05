---
title: ignore_external_modifications
description: "Configure whether dbt State forces a rebuild when it detects that a model was changed outside of dbt."
id: "ignore-external-modifications"
tags: ['dbt State']
---

# ignore_external_modifications

<Tabs>
<TabItem value="project" label="Project YAML file">

<File name="dbt_project.yml">

```yaml
models:
  [<resource-path>](/reference/resource-configs/resource-path):
    [+](/reference/resource-configs/plus-prefix)state:
      ignore_external_modifications: true | false
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
        ignore_external_modifications: true | false
```

</File>
</TabItem>

<TabItem value="sql" label="SQL file config">

<File name="models/<filename>.sql">

```sql
{{ config(
    state={
      "ignore_external_modifications": true | false
    }
) }}
```

</File>
</TabItem>
</Tabs>

## Definition

dbt State tracks whether a node has been modified outside of dbt (for example, by a direct DDL statement in your warehouse or by another tool) and can use that signal to force a rebuild on the next run.

By default, `ignore_external_modifications` is `true` &mdash; dbt State reuses a node even if it was changed externally since the last run. This is appropriate when external modifications to dbt-managed objects are expected and intentional.

Set `ignore_external_modifications: false` if you want dbt State to treat external changes as a signal to rebuild. When a modification is detected, dbt State forces a rebuild the next time that node is selected.

| Value | Behavior |
|-------|----------|
| `true` (default) | dbt State reuses nodes even if they were modified outside of dbt. |
| `false` | dbt State forces a rebuild when it detects an external modification. |

## Example

### Enforce strict ownership for a single model

Use `ignore_external_modifications: false` for models where external changes should never go undetected:

<File name="models/schema.yml">

```yaml
models:
  - name: fct_orders
    config:
      state:
        ignore_external_modifications: false
```

</File>

If `fct_orders` is modified outside of dbt (for example by a direct `ALTER TABLE` statement), dbt State triggers a rebuild on the next run.


## Related docs

- [About dbt State](/docs/deploy/dbt-state-about)
- [Set up dbt State](/docs/deploy/dbt-state-setup)
- [dbt State configurations](/reference/resource-configs/dbt-state-configs)
