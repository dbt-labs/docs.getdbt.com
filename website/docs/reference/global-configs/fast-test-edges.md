---
title: "Fast test edges"
id: "fast-test-edges"
description: "Use the --use-fast-test-edges flag to reduce the number of test edges dbt adds to the execution graph during dbt build, improving performance in large projects."
sidebar: "Fast test edges"
---

:::caution Experimental
This flag is experimental and has not been validated to produce the same results across all project configurations.
:::

The `--use-fast-test-edges` flag reduces the number of test edges dbt adds to the execution graph during `dbt build`.

When you run `dbt build`, dbt adds edges so tests on upstream nodes tend to finish before downstream models run. In large projects, that can add a large number of edges, which slows the run and increases memory use.

Using the `--use-fast-test-edges` flag with `dbt build` produces the same execution order with significantly fewer edges. If you experience slow run times or high memory usage during `dbt build`, use this flag.

You can set this flag using the CLI or an environment variable:

<File name='CLI'>

```bash
dbt build --use-fast-test-edges
```

</File>

<File name='Env var'>

```bash
export DBT_ENGINE_USE_FAST_TEST_EDGES=true
dbt build
```

</File>
