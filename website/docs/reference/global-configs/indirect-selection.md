---
title: "Indirect selection"
id: "indirect-selection"
sidebar: "Indirect selection"
---

import IndirSelect from '/snippets/_indirect-selection-definitions.md';

Use the `--indirect-selection` flag to `dbt test` or `dbt build` to configure which tests to run for the nodes you specify. You can set this as a CLI flag or an environment variable. In dbt Core, you can also configure user configurations in [YAML selectors](/reference/node-selection/yaml-selectors) or in the `flags:` block of `dbt_project.yml`, which sets project-level flags.

When all flags are set, the order of precedence is as follows. Refer to [About global configs](/reference/global-configs/about-global-configs) for more details:

1. CLI configurations
1. Environment variables
1. User configurations

You can set the flag to: `empty`, `buildable`, `cautious`, or `eager` (default). By default, dbt indirectly selects all tests if they touch any resource you select. Learn more about these options in [Indirect selection in Test selection examples](/reference/node-selection/test-selection-examples?indirect-selection-mode=eager#indirect-selection).

<IndirSelect features={'/snippets/indirect-selection-definitions.md'}/>

The following is a visualization of the impact `--indirect-selection` and the various flags have using three models, three tests, and `dbt build` as an example:

<DocCarousel slidesPerView={1}>

<Lightbox src src="/img/docs/reference/indirect-selection-dbt-build.png" width="85%" title="dbt build" />

<Lightbox src src="/img/docs/reference/indirect-selection-eager.png" width="85%" title="Eager (default)"/>

<Lightbox src src="/img/docs/reference/indirect-selection-buildable.png" width="85%" title="Buildable"/>

<Lightbox src src="/img/docs/reference/indirect-selection-cautious.png" width="85%" title="Cautious"/>

<Lightbox src src="/img/docs/reference/indirect-selection-empty.png" width="85%" title="Empty"/>

</DocCarousel>

For example, you can run tests that only refer to selected nodes using a CLI configuration:

<File name='Usage'>

```shell
dbt test --indirect-selection cautious
```

</File>

Or you can run tests that only refer to selected nodes using an environment variable:

<File name='Env var'>

```text

$ export DBT_INDIRECT_SELECTION=cautious
dbt run

```

</File>

You can also run tests that only refer to selected nodes using `dbt_project.yml` project-level flags:

<File name='dbt_project.yml'>

```yaml

flags:
  indirect_selection: cautious

```

</File>
