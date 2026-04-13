---
title: "Indirect selection"
id: "indirect-selection"
sidebar: "Indirect selection"
---

import IndirSelect from '/snippets/_indirect-selection-definitions.md';

Indirect selection determines which tests to run when you select models or other resources. It applies to tests that are related to your selected resources through relationships in your DAG &mdash; for example, tests on upstream or downstream models, or tests that reference multiple models.

Use the `--indirect-selection` flag with `dbt test` or `dbt build` to configure this behavior. You can set this as a CLI flag or an environment variable. In dbt <Constant name="core"/>, you can also configure user configurations in [YAML selectors](/reference/node-selection/yaml-selectors) or in the `flags:` block of `dbt_project.yml`, which sets project-level flags.

:::tip Indirect selection happens by default
Even without explicitly using the [`--indirect-selection` flag](/reference/node-selection/test-selection-examples?indirect-selection-mode=eager#indirect-selection), dbt uses indirect selection when you run commands like `dbt test --select "stg_model_a+"`. The default mode is `eager`, which runs all tests that reference your selected models. For example, `dbt test --select model_b` will run tests defined on `model_b`, as well as tests defined on upstream models if those tests reference `model_b`. 
:::

When all flags are set, the order of precedence is as follows. Refer to [About global configs](/reference/global-configs/about-global-configs) for more details:

1. CLI configurations
1. Environment variables
1. User configurations

You can set the flag to: `empty`, `buildable`, `cautious`, or `eager` (default). Learn more about these options in [Indirect selection in Test selection examples](/reference/node-selection/test-selection-examples?indirect-selection-mode=eager#indirect-selection).

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

<VersionBlock lastVersion="1.10">

```text

$ export DBT_INDIRECT_SELECTION=cautious
dbt run

```

</VersionBlock>

<VersionBlock firstVersion="1.11">

```text

$ export DBT_ENGINE_INDIRECT_SELECTION=cautious
dbt run

```

</VersionBlock>

</File>

You can also run tests that only refer to selected nodes using `dbt_project.yml` project-level flags:

<File name='dbt_project.yml'>

```yaml

flags:
  indirect_selection: cautious

```

</File>
