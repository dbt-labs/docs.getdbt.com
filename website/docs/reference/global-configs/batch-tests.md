---
title: "Batch tests"
id: "batch-tests"
description: "Use the --batch-tests flag to combine compatible data tests into a single query per test type, improving performance in large projects."
sidebar_label: "Batch tests"
availability:
  engine: v2
---

The `--batch-tests` flag combines compatible data tests that target the same model into a single query per test type, rather than running one query per test. This reduces the number of queries dbt runs for tests, which can improve performance in projects with many data tests.


## What gets batched

Batch tests:

- Group two or more tests of the same type (`unique` or `not_null`) that are attached to the same model and use their default configuration
- Run with `dbt build` and `dbt test`
- Exclude any test that sets one of the following:
  - `severity`
  - `error_if`
  - `warn_if`
  - `fail_calc`
  - `limit`
  - `where`
  - `store_failures`
  - `store_failures_as`

Excluded tests run on their own, as they do without batching. Each batched test still reports its own pass or fail result, with the line number where it's defined.

## Setting the flag

dbt resolves `batch_tests` from three places, in order of precedence:

1. The `--batch-tests` command-line flag
2. The `DBT_ENGINE_BATCH_TESTS` environment variable
3. The `flags` block in your root project's `dbt_project.yml`

For example, on the command line:

<File name='CLI'>

```bash
dbt build --batch-tests
```

</File>

Or using an environment variable:

<File name='Env var'>

```bash
export DBT_ENGINE_BATCH_TESTS=true
dbt build
```

</File>

Or setting it as a flag in your `dbt_project.yml`:

<File name='dbt_project.yml'>

```yaml
flags:
  batch_tests: true
```

</File>
