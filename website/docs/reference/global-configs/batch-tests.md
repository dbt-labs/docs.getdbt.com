---
title: "Batch tests"
id: "batch-tests"
description: "Use the --batch-tests flag to combine compatible data tests into a single query, improving performance in large projects."
sidebar: "Batch tests"
availability:
  engine: v2
---

The `--batch-tests` flag combines compatible data tests that target the same model into a single query, rather than running one query per test. This reduces the number of queries dbt runs for tests, which can improve performance in projects with many data tests.


## Prerequisites

Batching only applies to `unique` and `not_null` data tests that use their default configuration against the same model. A test is excluded from batching, and runs on its own as before, if it sets any of the following:

- `severity`
- `error_if`
- `warn_if`
- `fail_calc`
- `limit`
- `where`
- `store_failures`
- `store_failures_as`
- A project override of the underlying test macro

Batch tests apply to `dbt build`, `dbt test`, `dbt run`, `dbt seed`, and `dbt snapshot`.

## Setting the flag

dbt resolves `batch_tests` from three places, in order of precedence:
1. The `--batch-tests` command-line flag.
2. The `DBT_ENGINE_BATCH_TESTS` environment variable.
3. The `flags` block in your root project's `dbt_project.yml`.

<File name='CLI'>

```bash
dbt build --batch-tests
```

</File>

<File name='Env var'>

```bash
export DBT_ENGINE_BATCH_TESTS=true
dbt build
```

</File>

<File name='dbt_project.yml'>

```yaml
flags:
  batch_tests: true
```

</File>
