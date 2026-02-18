---
title: "Static analysis"
id: "static-analysis-flag"
description: "Use the --static-analysis flag to override model-level static_analysis behavior for a single run."
sidebar: "Static analysis"
---

Use the `--static-analysis` flag to override model-level `static_analysis` behavior for a single run. This flag applies to the <Constant name="fusion_engine" /> only; it is ignored by <Constant name="core" />.

Values:

- `strict`: Use Ahead-of-time (AOT) static analysis for all models in the run.
- `baseline`: Use Just-in-time (JIT) static analysis for all models in the run.
- `off`: Disable static analysis for all models in the run.

If not set, Fusion uses its defaults: AOT static analysis (`strict`) for eligible models and JIT (`baseline`) for introspective branches. See [Configuring `static_analysis`](/docs/fusion/new-concepts#configuring-static_analysis) for more information.

:::caution Deprecated value

The `unsafe` value is deprecated and will be removed in May 2026. Use `baseline` instead.

:::

<File name='Usage'>

```shell
dbt run --static-analysis strict
dbt run --static-analysis baseline
dbt run --static-analysis off
```

</File>

## Related docs

Also check out the model-level [`static_analysis` (resource config)](/reference/resource-configs/static-analysis) and [About flags](/reference/global-configs/about-global-configs) pages for more details.
