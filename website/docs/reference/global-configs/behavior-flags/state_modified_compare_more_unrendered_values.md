---
title: "Source definitions for state:modified"
id: "state_modified_compare_more_unrendered_values"
sidebar_label: "state modified compare more unrendered values"
---

:::caution Removed in <Constant name="core_v2" />

This flag was removed in <Constant name="core_v2" /> and in <Constant name="fusion" />. The new behavior is always enabled. If you're upgrading, remove this flag from your `dbt_project.yml`.

:::

import StateModified from '/snippets/_state-modified-compare.md';


| state_modified_compare_more_unrendered_values | <Constant name="dbt" /> **Latest** | <Constant name="core" /> |
|---|---|---|
| Introduced | 2024.10 | 1.9.0 |
| Matured (default → `true`) | Sep 1, 2026 | — |
| Removed | — | v2.0 |

:::info

<StateModified features={'/snippets/_state-modified-compare.md'}/>

:::

Set `state_modified_compare_more_unrendered_values` to `true` to reduce false positives during `state:modified` checks, especially when configs differ by target environment (such as `prod` vs. `dev`).

Setting the flag to `true` changes the `state:modified` comparison from using rendered values to unrendered values instead. It accomplishes this by persisting `unrendered_config` during model parsing and `unrendered_database` and `unrendered_schema` configs during source parsing.

:::note
This flag requires rebuilding the state directory (manifest) to take effect.
:::

## Impact when the flag matures

Setting the default to `true` silently changes the `state:modified` selection set that most CI, Slim CI, and `dbt build --defer` workflows rely on. There are two ways this surfaces:

- **False "modified" on the first run after the flag is set to `true`.** If the baseline manifest was captured before the flag is set (rendered values stored) and the current parse runs after the setting change (literal text stored), every node whose YAML config contains Jinja will appear as `state:modified`, even if nothing has changed. This causes a full rebuild on the first CI run after the upgrade.
- **New positives going forward.** After both manifests are captured with the flag enabled, `state:modified` will catch cases where two equivalent Jinja expressions render to the same value (for example, switching from `"{{ env_var('MAT', 'view') }}"` to `view`).

<Expandable alt_header="What to expect">

On the first CI or Slim CI run after the flag is set, any node whose YAML config uses Jinja (`env_var`, `var`, conditional materialization) may appear as `state:modified` even if nothing changed. This is because the baseline manifest stored rendered values while the new parse stores literal Jinja text — the two sides of the comparison differ on serialization, not on real changes.

Once your production job runs once on the **Latest** release track and generates a new baseline manifest, both sides of the `state:modified` comparison use the same format and the extra diffs disappear.

No code change is required. The cost is one extra rebuild cycle for affected nodes.

This new behavior fixes the legacy behavior. Previously, the comparison silently missed real changes to Jinja expressions (for example, switching from `"{{ env_var('MAT', 'view') }}"` to `view` renders identically and was never caught). With this flag enabled, `state:modified` is more accurate going forward.

To opt out, set the flag to `false` in `dbt_project.yml`:

<File name='dbt_project.yml'>

```yaml
flags:
  state_modified_compare_more_unrendered_values: false
```

</File>

Opting out is recommended during a production deploy freeze or if your project has heavy Jinja in YAML configs and the one-time rebuild would exceed your CI compute budget. Otherwise, enabling this flag is recommended.

</Expandable>
