---
title: "Indirect selection"
id: "indirect-selection"
sidebar: "Indirect selection"
---

Supply the `--indirect_selection` flag to `dbt test` or `dbt build` to configure which tests will be run for the nodes you specify. You can set this as a CLI flag or an environment variable. In dbt Core, you can also configure user configurations in [YAML selectors](/reference/node-selection/yaml-selectors) or in the `config:` block of `profiles.yml`, which sets default values for all projects.

When all flags are set, CLI configurations take precedence, then environment variables, then user configurations. Read the docs on [global configs](/reference/global-configs/about-global-configs) for details.

Options are `empty`, `buildable`, `cautious`, and `eager` (default). By default, dbt indirectly selects all tests if they touch any resource you select. Read more about these options in [Indirect selection in Test selection examples](/reference/node-selection/test-selection-examples?indirect-selection-mode=empty#indirect-selection).

You can run tests that only refer to selected nodes using a CLI configuration, for example:

<File name='Usage'>

```text
dbt test --indirect-selection cautious
```

</File>

You can run tests that only refer to selected nodes using an environment variable, for example:

<File name='Env var'>

```text

$ export DBT_INDIRECT_SELECTION=cautious
dbt run

```

</File>

You can run tests that only refer to selected nodes using `profiles.yml` user configurations, for example:

<File name='profiles.yml'>

```yaml

config:
  indirect_selection: cautious

```

</File>


