---
title: "Optimize static analysis for development and deployment"
id: "optimize-static-analysis-for-development-and-deployment"
description: "Configure Fusion static analysis with strict in development and baseline in deployment for stronger local checks and faster jobs."
sidebar_label: "Optimize static analysis"
displayText: Optimize static analysis for development and deployment
hoverSnippet: Use strict static analysis in development and baseline in deployment for stronger local checks and faster jobs.
---

import FusionLifecycle from '/snippets/_fusion-lifecycle-callout.md';

<FusionLifecycle />

<IntroText>

Static analysis helps the <Constant name="fusion_engine" /> validate your SQL before it runs. This guide shows how to configure it so you get stronger checks while you develop, and faster, less blocking runs in deployment.

</IntroText>

This guide explains why using `strict` in development and `baseline` (the default, lighter static analysis mode) in deployment is a valid and recommended pattern, and how to configure it in your <Constant name="fusion" /> project. For more information about modes and features, refer to [About static analysis](/docs/build/about-static-analysis).

## Why this pattern

- **Development:** `strict` mode has the strongest SQL checks before you promote changes, including richer column-level features in the VS Code extension.
- **Deployment:** `baseline` skips remote warehouse schema downloads and surfaces findings as warnings, so jobs are less likely to block. That can save compile time (and warehouse cost) in deployment, especially in projects with many sources. Review deployment logs for warnings that `strict` would have raised as errors in development.

`strict` can increase compile time because the <Constant name="fusion_engine" /> downloads schemas for all sources (including sources your models do not reference). Teams with thousands of sources have seen large differences between `baseline` and `strict`.

## Set the mode with the CLI flag

Use the [`--static-analysis`](/reference/global-configs/static-analysis-flag) flag to set the mode for a single run.

**Development:**

```bash
dbt compile --static-analysis strict
```

**Deployment:**

```bash
dbt compile --static-analysis baseline
```

You can use the same flag with `dbt run` or `dbt build`. If you already have <Constant name="core" /> or the platform CLI installed alongside <Constant name="fusion" />, use `dbtf` as the unambiguous <Constant name="fusion" /> command.

You can also configure [`static_analysis`](/reference/resource-configs/static-analysis) per directory or model. Refer to [Configuring `static_analysis`](/docs/build/about-static-analysis#configuring-static_analysis) for examples.

## Set the mode with an environment variable

You can also drive [`static_analysis`](/reference/resource-configs/static-analysis) from a custom environment variable in `dbt_project.yml`. This is useful when development and deployment share the same project config but set different environment values.

<File name="dbt_project.yml">

```yml
models:
  my_project:
    +static_analysis: "{{ env_var('DBT_ENV_STATIC_ANALYSIS', 'baseline') }}"
```

</File>

Then set the variable per environment:

- Development: `DBT_ENV_STATIC_ANALYSIS=strict`
- Deployment: leave unset (defaults to `baseline`), or set `DBT_ENV_STATIC_ANALYSIS=baseline`

`DBT_ENV_STATIC_ANALYSIS` is a custom variable name you choose. It is separate from the built-in `DBT_STATIC_ANALYSIS` override used with the CLI flag.

For more information about `env_var`, refer to [About env_var](/reference/dbt-jinja-functions/env_var) and [Environment variables](/docs/build/environment-variables).

## Related docs

- [About static analysis](/docs/build/about-static-analysis)
- [`static_analysis` config](/reference/resource-configs/static-analysis)
- [`--static-analysis` flag](/reference/global-configs/static-analysis-flag)
