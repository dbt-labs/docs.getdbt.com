---
title: "Configuring deferral in dbt State"
sidebar_label: "Configure deferral"
description: "Configure which environment dbt State defers to, and use dbt State as the comparison source for state:* selectors in self-managed deployments."
id: "dbt-state-deferral"
tags: ['dbt State'] 
availability: everywhere_usage
---

# Configuring deferral in dbt State

By default, dbt State defers to your production environment. You only need to configure this if you want to change that behavior:

- **<Constant name="dbt_platform" />**: To defer to an environment other than the default (for example, staging), add `defer-env-id` to the `dbt-cloud` block in `dbt_project.yml`. Refer to [Configure the <Constant name="platform_cli" />](/docs/platform/dbt-cli-installation) for more information.

  <File name="dbt_project.yml">

  ```yaml
  dbt-cloud:
    project-id: <your-project-id>
    defer-env-id: <your-environment-id>
  ```

  </File>

  :::note
  `defer-env-id` is manifest-based. If you set it, [dbt State-powered `state:*` selectors](#dbt-state-powered-state-selectors) are disabled. Refer to that section's requirements for more information.
  :::

- **Self-managed deployments**: If you can't access a production or deployment manifest, you can set [`defer_to_target`](/reference/resource-configs/defer-to-target) in `profiles.yml` for best-effort auto-deferral. Note that this approach has known limitations; refer to [Caveats to dbt State without a manifest](/reference/resource-configs/defer-to-target#caveats-to-dbt-state-without-a-manifest).

  <File name="profiles.yml">

  ```yaml
  my_project:
    outputs:
      uat:
        type: snowflake
        # ... connection settings
        defer_to_target: staging
  ```

  </File>

  In self-managed deployments, you can use [dbt State-powered `state:*` selectors](#dbt-state-powered-state-selectors), which compare each node against its own last execution rather than a single job's `manifest.json`. To use this feature, connect your project to the <Constant name="dbt_platform" />.

You can also pass `--state` or `--defer-state` to explicitly point dbt State to a specific `manifest.json`.

:::note
If you've overridden `generate_*_name()` macros with runtime values (such as environment variables, file paths, or dates), provide a `manifest.json` file so dbt State can locate objects correctly. Without one, it infers object locations from your macros and profile target, which may be incorrect in these cases. Refer to [Caveats to dbt State without a manifest](/reference/resource-configs/defer-to-target#caveats-to-dbt-state-without-a-manifest).
:::

## dbt State-powered `state:*` selectors <Lifecycle status="beta" /> {#dbt-state-powered-state-selectors}

When dbt State is enabled, [`state:*` selectors](/reference/node-selection/methods#state) can use dbt State as their comparison source instead of a single `manifest.json` from the most recent job run. Each node (models, snapshots, seeds, and tests) is compared against its own last execution in the [`defer_to_target`](/reference/resource-configs/defer-to-target) environment (default: `prod`), so a node is only selected as modified if its own logic changed, no matter which job last ran it.

This feature is for **self-managed deployments**, meaning you orchestrate dbt runs yourself (for example, with Airflow or GitHub Actions) rather than with <Constant name="dbt_platform" /> jobs. You still authenticate to the <Constant name="dbt_platform" /> for dbt State using `project-id`.

### Prerequisites

- dbt State is enabled for your project.
- `project-id` is set in the `dbt-cloud` block in `dbt_project.yml`:

<File name="dbt_project.yml">

```yaml
dbt-cloud:
  project-id: <your-project-id>
```

</File>

:::note
When orchestrating with the <Constant name="dbt_platform" />, each job produces a `manifest.json`, so dbt State uses that for `state:*` comparisons instead of per-node execution history.
:::

## Specify your project or org

If you have multiple projects or orgs that use dbt State, configure the `dbt-cloud` block in `dbt_project.yml` so dbt State knows which one to use:

- **For <Constant name="dbt_platform" /> users with multiple projects**: Add `project-id` to identify which project dbt State should use.

  <File name="dbt_project.yml">

  ```yaml
  dbt-cloud:
    project-id: <your-project-id>
  ```

  </File>

- **For self-managed deployments with multiple dbt State orgs**: Add `state-org-id` to identify which org dbt State should use.

  <File name="dbt_project.yml">

  ```yaml
  dbt-cloud:
    state-org-id: <your-org-id>
  ```

  </File>

## Related docs

- [Defer in dbt](/docs/platform/about-defer)
- [About dbt State](/docs/deploy/dbt-state-about)
- [Set up dbt State](/docs/deploy/dbt-state-setup)
- [dbt State configs](/reference/resource-configs/dbt-state-configs)
