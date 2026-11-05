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

By default, dbt State reuses a node even if it was changed outside of dbt since the last run (for example, by a direct change to the table in your warehouse).

Set `ignore_external_modifications: false` if you want dbt State to force a rebuild when it detects an external change. dbt State detects external changes by comparing the target's last-modified timestamp in your warehouse against what it recorded on the previous run.

| Value | Behavior |
|-------|----------|
| `true` (default) | dbt State reuses a node even if it was modified outside of dbt. |
| `false` | dbt State forces a rebuild when the target's last-modified time is newer than what dbt State recorded. |

If dbt State decides to clone a node from the deferred environment, it clones regardless of whether an external modification is detected.

## Interactions with other configs

The following interactions apply when `ignore_external_modifications` is `false`.

- [`lag_tolerance`](/reference/resource-configs/lag-tolerance): A model is rebuilt when an external change is detected, even if it was built recently enough to fall within its `lag_tolerance` window.

- [`execute_hooks_on_any_reuse`](/reference/resource-configs/execute-hooks-on-any-reuse): If `execute_hooks_on_any_reuse` is `true` and a post-hook modifies the target relation, the warehouse timestamp moves. dbt State sees the updated timestamp as an external change and forces a rebuild on the next run. To avoid this, set `lag_tolerance: 0` or remove post-hook statements that modify the target.

## Example

### Enforce strict ownership for a single model

Use `ignore_external_modifications: false` for models where external changes should trigger a rebuild:

<File name="models/schema.yml">

```yaml
models:
  - name: fct_orders
    config:
      state:
        ignore_external_modifications: false
```

</File>

With this config set, dbt State triggers a rebuild the next time `fct_orders` runs if its last-modified timestamp in the warehouse is newer than what dbt State recorded.


## Related docs

- [About dbt State](/docs/deploy/dbt-state-about)
- [Set up dbt State](/docs/deploy/dbt-state-setup)
- [dbt State configurations](/reference/resource-configs/dbt-state-configs)
