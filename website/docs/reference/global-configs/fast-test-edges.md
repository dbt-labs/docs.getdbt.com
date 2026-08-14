---
title: "Fast test edges"
id: "fast-test-edges"
sidebar: "Fast test edges"
---

The `--use-fast-test-edges` flag reduces the number of test edges dbt adds to the execution graph during `dbt build`.

:::note
In <Constant name="core_v2" />, this performance improvement is always on. The `--use-fast-test-edges` flag is not supported and emits a warning if passed.
:::

When you run `dbt build`, dbt adds edges to the execution graph so that downstream models don't run until all tests on their upstream nodes have passed. In large projects, this can inflate the number of edges in the graph significantly, causing slow run times and high memory usage.

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
