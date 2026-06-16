By default, dbt State defers to your production environment. To control which environment dbt State defers to, configure it based on your setup:

- **<Constant name="dbt_platform" />**: Add `project-id` (and optionally `defer-env-id`) to the `dbt-cloud` config block in `dbt_project.yml`. Refer to [Configure Cloud CLI](/docs/platform/dbt-cli-installation) for more information.

  <File name="dbt_project.yml">

  ```yaml
  dbt-cloud:
    project-id: <your-project-id>
    defer-env-id: <your-production-environment-id>  # optional
  ```

  </File>

- **Self-managed deployment**: Add `state-org-id` to the `dbt-cloud` config block in `dbt_project.yml`. dbt State defaults to a target named `prod`.

  <File name="dbt_project.yml">

  ```yaml
  dbt-cloud:
    state-org-id: <your-org-id>
  ```

  </File>

  To defer to a different target or environment (for example, staging), update [`defer_to_target`](/reference/resource-configs/defer-to-target) in `profiles.yml`.

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

You can also pass `--state` or `--defer-state` to explicitly point dbt State to a specific `manifest.json` as the source of truth for cloning objects.

:::note
If you've overridden `generate_*_name()` macros with runtime values (such as environment variables, file paths, or dates), provide a `manifest.json` file so dbt State can locate objects correctly. Without one, it infers object locations from your macros and profile target, which may be incorrect in these cases. Refer to [Caveats to dbt State without a manifest](/reference/resource-configs/defer-to-target#caveats-to-dbt-state-without-a-manifest).
:::
