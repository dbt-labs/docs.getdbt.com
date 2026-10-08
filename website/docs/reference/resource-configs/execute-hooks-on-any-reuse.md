---
title: execute_hooks_on_any_reuse
description: "Configure whether pre- and post-hooks run when dbt State skips a node because it's still fresh."
id: "execute-hooks-on-any-reuse"
tags: ['dbt State']
---

# execute_hooks_on_any_reuse

<Tabs>
<TabItem value="project" label="Project YAML file">

<File name="dbt_project.yml">

```yaml
models:
  [<resource-path>](/reference/resource-configs/resource-path):
    [+](/reference/resource-configs/plus-prefix)state:
      execute_hooks_on_any_reuse: true | false
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
        execute_hooks_on_any_reuse: true | false
```

</File>
</TabItem>

<TabItem value="sql" label="SQL file config">

<File name="models/<filename>.sql">

```sql
{{ config(
    state={
      "execute_hooks_on_any_reuse": true | false
    }
) }}
```

</File>
</TabItem>
</Tabs>

## Definition

When dbt State skips a node because it's still fresh, that node's pre- and post-hooks are not executed by default. This matches dbt's standard behavior: if the node wasn't executed, its hooks don't run.

Set `execute_hooks_on_any_reuse: true` if you have audit hooks or other hooks that must run on every job invocation, regardless of whether the node was rebuilt or reused.

| Value | Behavior |
|-------|----------|
| `false` (default) | Hooks are skipped when a node is reused without rebuilding. |
| `true` | Hooks run even when a node is reused. |

Hooks always execute when dbt State _clones_ a node from another environment, because the clone step creates a new object in the warehouse.

## Example

### Always run audit hooks

Use `execute_hooks_on_any_reuse: true` for nodes with audit or lineage hooks that must run on every job invocation:

<File name="models/fct_orders.yml">

```yaml
models:
  - name: fct_orders
    config:
      state:
        execute_hooks_on_any_reuse: true
      post-hook:
        - "INSERT INTO audit_log VALUES ('{{ model.name }}', CURRENT_TIMESTAMP())"
```

</File>

## Related docs

- [About dbt State](/docs/deploy/dbt-state-about)
- [Set up dbt State](/docs/deploy/dbt-state-setup)
- [Hooks](/docs/build/hooks-operations)
