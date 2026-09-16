---
title: "Batch tests"
id: "batch-tests"
description: "Use the --batch-tests flag to combine compatible data tests into a single query per test type, improving performance in large projects."
sidebar_label: "Batch tests"
availability:
  engine: v2
---

The `--batch-tests` flag combines compatible data tests that target the same model into a single query per test type, rather than running one query per test. This reduces the number of queries dbt runs for tests, which can improve performance in projects with many data tests.

## Batching tests

Batching applies to `dbt build` and `dbt test`. dbt batches a group of tests when all of these are true:

- The tests are `unique` or `not_null`
- They're attached to the same model
- They use their default configuration
- At least two of them are the same type

dbt excludes tests from batching when any of the following is set:
- `severity`
- `error_if`
- `warn_if`
- `fail_calc`
- `limit`
- `where`
- `store_failures`
- `store_failures_as`

Excluded tests run on their own, as they do without batching.

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

With an environment variable:

<File name='Env var'>

```bash
export DBT_ENGINE_BATCH_TESTS=true
dbt build
```

</File>

In your `dbt_project.yml`:

<File name='dbt_project.yml'>

```yaml
flags:
  batch_tests: true
```

</File>
