---
title: "Static analysis"
id: "static-analysis-flag"
description: "Use the --static-analysis flag to override model-level static_analysis behavior for a single run."
sidebar: "Static analysis"
---

Use the `--static-analysis` flag to override model-level `static_analysis` behavior for a single run. This flag applies to the <Constant name="fusion_engine" /> only; it is ignored by <Constant name="core" />.

Values:

- `baseline` (default): Statically analyze SQL for all models in the run. This is the recommended starting point for users transitioning from <Constant name="core" />.
- `strict` (previously `on`): Statically analyze all SQL before execution begins. Provides maximum validation guarantees &mdash; nothing runs until the entire project is proven valid.
- `off`: Disable static analysis for all models in the run.

:::caution Deprecated values

The `on` and `unsafe` values are deprecated and will be removed in May 2026. Use `strict` instead.

:::

If not set, <Constant name="fusion" /> defaults to `baseline` mode, which provides a smooth transition from <Constant name="core" /> while still catching most SQL errors. See [Configuring `static_analysis`](/docs/fusion/new-concepts#configuring-static_analysis) for more information on incrementally opting in to stricter analysis.

<File name='Usage'>

```shell
dbt run --static-analysis strict
dbt run --static-analysis baseline
dbt run --static-analysis off
```

</File>

## Related docs

Also check out the model-level [`static_analysis` (resource config)](/reference/resource-configs/static-analysis) and [About flags](/reference/global-configs/about-global-configs) pages for more details.
