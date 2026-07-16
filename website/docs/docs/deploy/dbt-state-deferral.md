---
title: "Configuring deferral in dbt State"
sidebar_label: "Configure deferral"
description: "Configure which environment dbt State defers to, including project and org disambiguation and deferral target customization."
id: "dbt-state-deferral"
tags: ['dbt State'] 
---

# Configuring deferral in dbt State <Lifecycle status="preview" />

By default, dbt State defers to your production environment. Both sections on this page are optional; configure them if you want to customize the defaults.

## Configure deferral

By default, dbt State defers to your production environment. You only need to configure this if you want to change that behavior:

- **<Constant name="dbt_platform" />**: To defer to an environment other than the default (for example, staging), add `defer-env-id` to the `dbt-cloud` block in `dbt_project.yml`. Refer to [Configure Cloud CLI](/docs/platform/dbt-cli-installation) for more information.

  <File name="dbt_project.yml">

  ```yaml
  dbt-cloud:
    project-id: <your-project-id>
    defer-env-id: <your-environment-id>
  ```

  </File>

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

You can also pass `--state` or `--defer-state` to explicitly point dbt State to a specific `manifest.json`.

:::note
If you've overridden `generate_*_name()` macros with runtime values (such as environment variables, file paths, or dates), provide a `manifest.json` file so dbt State can locate objects correctly. Without one, it infers object locations from your macros and profile target, which may be incorrect in these cases. Refer to [Caveats to dbt State without a manifest](/reference/resource-configs/defer-to-target#caveats-to-dbt-state-without-a-manifest).
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

- [About dbt State](/docs/deploy/dbt-state-about)
- [Set up dbt State](/docs/deploy/dbt-state-setup)
- [dbt State configs](/reference/resource-configs/dbt-state-configs)
