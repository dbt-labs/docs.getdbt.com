---
title: "Indirect selection"
id: "indirect-selection"
sidebar: "Indirect selection"
---

Use the `--indirect_selection` flag to `dbt test` or `dbt build` to configure which tests to run for the nodes you specify. You can set this as a CLI flag or an environment variable. In dbt Core, you can also configure user configurations in [YAML selectors](/reference/node-selection/yaml-selectors) or in the `config:` block of `profiles.yml`, which sets default values for all projects.

When all flags are set, the order of precedence are as follows. Refer to [About global configs](/reference/global-configs/about-global-configs) for details.

1. CLI configurations
1. Environment variables
1. User configurations

You can set the flag to: `empty`, `buildable`, `cautious`, or `eager` (default). By default, dbt indirectly selects all tests if they touch any resource you select. Learn more about these options in [Indirect selection in Test selection examples](/reference/node-selection/test-selection-examples?indirect-selection-mode=empty#indirect-selection).

For example, you can run tests that only refer to selected nodes using a CLI configuration:

<File name='Usage'>

```shell
dbt test --indirect-selection cautious
```

</File>

For example, you can run tests that only refer to selected nodes using an environment variable

<File name='Env var'>

```text

$ export DBT_INDIRECT_SELECTION=cautious
dbt run

```

</File>

For example, you can run tests that only refer to selected nodes using `profiles.yml` user configurations:

<File name='profiles.yml'>

```yaml

config:
  indirect_selection: cautious

```

</File>


