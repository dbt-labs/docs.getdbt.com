---
title: "Using strict mode in development and baseline in deployment"
id: "using-strict-and-baseline-static-analysis"
description: "Recommend strict static analysis in development and baseline in deployment with the dbt Fusion engine."
sidebar_label: "Strict in development, baseline in deployment"
displayText: Using strict mode in development and baseline in deployment
hoverSnippet: Use strict static analysis while you develop, and baseline in deployment for faster jobs.
---

import FusionLifecycle from '/snippets/_fusion-lifecycle-callout.md';

<FusionLifecycle />

<IntroText>

Use `strict` static analysis while you develop so the <Constant name="fusion_engine" /> validates SQL as thoroughly as possible. Use `baseline` (the default, lighter static analysis mode) in deployment so jobs stay faster and are less likely to stop on analysis findings.

</IntroText>

This pattern is valid and recommended for projects that use the <Constant name="fusion_engine" />. For more information about modes and features, refer to [About static analysis](/docs/build/about-static-analysis).

## Why this pattern

- **Development:** `strict` gives you the strongest SQL checks before you promote changes, including richer column-level features in the VS Code extension.
- **Deployment:** `baseline` skips remote warehouse schema downloads and surfaces findings as warnings, so jobs are less likely to block.

`strict` can increase compile time, especially in projects with many sources, because the <Constant name="fusion_engine" /> downloads schemas for all sources (including sources your models do not reference). Teams with thousands of sources have seen large compile-time differences between `baseline` and `strict`.

## Set the mode with the CLI flag

Use the [`--static-analysis`](/reference/global-configs/static-analysis-flag) flag to set the mode for a single run:

```bash
# Development
dbt compile --static-analysis strict

# Deployment
dbt compile --static-analysis baseline
```

You can use the same flag with `dbt run` or `dbt build`. If you already have <Constant name="core" /> or the platform CLI installed alongside <Constant name="fusion" />, use `dbtf` as the unambiguous <Constant name="fusion" /> command.

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

## Tradeoffs to keep in mind

- `strict` can increase compile time when you have many sources, because schemas are downloaded for all sources.
- `baseline` does not download remote schemas. Findings are warnings rather than errors, so review deployment logs for issues that `strict` would have raised as errors in development.
- You can also configure `static_analysis` per directory or model. Refer to [Configuring `static_analysis`](/docs/build/about-static-analysis#configuring-static_analysis) and the [`static_analysis` config](/reference/resource-configs/static-analysis).

## Related docs

- [About static analysis](/docs/build/about-static-analysis)
- [`static_analysis` config](/reference/resource-configs/static-analysis)
- [`--static-analysis` flag](/reference/global-configs/static-analysis-flag)
