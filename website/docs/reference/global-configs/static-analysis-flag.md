---
title: "Static analysis"
id: "static-analysis-flag"
description: "Use the --static-analysis flag to override model-level static_analysis behavior for a single run."
sidebar: "Static analysis"
---

Use the `--static-analysis` flag to override model-level `static_analysis` behavior for a single run. This flag applies to dbt v2 only; it is ignored by v1.

Values:

- `baseline` (default): Statically analyze SQL for all models in the run. This is the recommended starting point for users transitioning from <Constant name="core" />.
- `strict` (previously `on`): Statically analyze all SQL before execution begins. Provides maximum validation guarantees &mdash; nothing runs until the entire project is proven valid.
- `off`: Disable static analysis for all models in the run.

:::caution Deprecated values

The `on` and `unsafe` values are deprecated and will be removed in May 2026. Use `strict` instead.

:::

If not set, <Constant name="fusion" /> defaults to `baseline` mode, which provides a smooth transition from v1 while still catching most SQL errors. See [Configuring `static_analysis`](/docs/fusion/new-concepts#configuring-static_analysis) for more information on incrementally opting in to stricter analysis.

<File name='Usage'>

```shell
dbt run --static-analysis strict
dbt run --static-analysis baseline
dbt run --static-analysis off
```

</File>

## Set a project-wide default in `flags`

You can set a project-wide default for static analysis in the [`flags`](/reference/global-configs/about-global-configs) block of your `dbt_project.yml`. This lets you raise (or lower) the default level for every resource type at once, without setting `+static_analysis` on each resource type individually.

<File name='dbt_project.yml'>

```yml
flags:
  default_static_analysis_level: strict # PLACEHOLDER: final flag name is not yet confirmed
```

</File>

This flag only changes the default that <Constant name="fusion" /> applies to resources that don't have `static_analysis` set explicitly. It _doesn't_ override a `static_analysis` config you've set on an individual resource or on a resource type in `dbt_project.yml`. In other words, it's equivalent to setting `+static_analysis` for every resource type, while still respecting any explicit config you've already defined:

<File name='dbt_project.yml'>

```yml
# Setting the flag once…
flags:
  default_static_analysis_level: strict

# …is roughly equivalent to setting +static_analysis on every resource type:
models:
  +static_analysis: strict
seeds:
  +static_analysis: strict
snapshots:
  +static_analysis: strict
data_tests:
  +static_analysis: strict
unit_tests:
  +static_analysis: strict
sources:
  +static_analysis: strict
analyses:
  +static_analysis: strict
```

</File>

### Precedence

<Constant name="fusion" /> resolves the static analysis level for each resource from most specific to least specific:

1. The `--static-analysis` CLI flag, which changes the default for resources that don't have an explicit config rather than overriding configs you've already set.
2. A `static_analysis` config set on the individual resource (for example, in a `config()` block or the resource's YAML).
3. A `static_analysis` config set for that resource type in `dbt_project.yml` (for example, under `models:`).
4. The `flags.default_static_analysis_level` project flag.
5. The built-in default (`baseline`).

## Related docs

Also check out the model-level [`static_analysis` (resource config)](/reference/resource-configs/static-analysis) and [About flags](/reference/global-configs/about-global-configs) pages for more details.
