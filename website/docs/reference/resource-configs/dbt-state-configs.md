---
title: dbt State configurations
description: "Reference for all dbt State configurations — node-level state configs and profile-level settings."
id: "dbt-state-configs"
tags: ['dbt State']
---

When you run a dbt command with [dbt State](/docs/deploy/dbt-state-about) enabled, dbt compares a node's logic and data against previous builds and takes the most efficient path:

- **Reuse** — if the object exists in the target schema, its logic hasn't changed, and its parents haven't received fresh data exceeding its `lag_tolerance`, the node is reused.
- **Clone** — if reuse isn't possible but the object exists in the deferred environment with the same logic and sufficiently fresh data, dbt State clones it.
- **Normal build** — if neither reuse nor clone is possible, the node builds as normal, using deferral for any unselected upstream nodes.

Use the following configs to control how dbt State makes these decisions.

<Tabs>
<TabItem value="project" label="Project YAML file">

<File name="dbt_project.yml">

```yaml
models:
  +state:
    lag_tolerance: <duration>
    require_fresh_data_from: any | all
    evaluate_volatile_sql: true | false
    pre_clone: never | if_missing | always
    execute_hooks_on_any_reuse: true | false
```

</File>
</TabItem>

<TabItem value="property" label="Properties YAML file">

<File name="models/schema.yml">

```yaml
models:
  - name: <model_name>
    config:
      state:
        lag_tolerance: <duration>
        require_fresh_data_from: any | all
        evaluate_volatile_sql: true | false
        pre_clone: never | if_missing | always
        execute_hooks_on_any_reuse: true | false
```

</File>
</TabItem>

<TabItem value="sql" label="SQL file config">

<File name="models/<filename>.sql">

```sql
{{ config(
    state={
        "lag_tolerance": "<duration>",
        "require_fresh_data_from": "any" | "all",
        "evaluate_volatile_sql": true | false,
        "pre_clone": "never" | "if_missing" | "always",
        "execute_hooks_on_any_reuse": true | false
    }
) }}
```

</File>
</TabItem>
</Tabs>

| Config | Default | Scope | Description |
|--------|---------|-------|-------------|
| [`lag_tolerance`](/reference/resource-configs/lag-tolerance) | `45m` | Node, folder, or project-level via model config | How much time must pass since the last upstream data change before a node is eligible for a rebuild. Acts as a compute-saving buffer that helps align builds with freshness SLAs. Applies to data freshness only; SQL changes always trigger a rebuild regardless of this setting. |
| [`require_fresh_data_from`](/reference/resource-configs/require-fresh-data-from) | `any` | Node, folder, or project-level via model config | Whether `any` or `all` direct parents need fresh data before a node is eligible for a rebuild. |
| [`pre_clone`](/reference/resource-configs/pre-clone) | `if_missing` | Node, folder, or project-level via model config | Whether dbt State pre-populates incremental models and snapshots by cloning production before a run. |
| [`execute_hooks_on_any_reuse`](/reference/resource-configs/execute-hooks-on-any-reuse) | `false` | Node, folder, or project-level via model config | Whether pre- and post-hooks run when a node is reused without rebuilding. |
| [`evaluate_volatile_sql`](/reference/resource-configs/evaluate-volatile-sql) | `false` | Node, folder, or project-level via model config | Whether dbt State stores and compares the runtime output of volatile SQL functions when deciding whether to rebuild. |
| [`defer_to_target`](/reference/resource-configs/defer-to-target) | `prod` | Profile | (Self-managed only) Which profile target dbt State defers to. |
| [`metadata_warehouse`](/reference/resource-configs/metadata-warehouse) | Profile `warehouse` | Profile | (Snowflake only) A separate warehouse for dbt State metadata lookups. |


## Related docs

- [About dbt State](/docs/deploy/dbt-state-about)
- [Set up dbt State](/docs/deploy/dbt-state-setup)
