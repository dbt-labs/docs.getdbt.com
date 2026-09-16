---
title: "Batch tests"
id: "batch-tests"
description: "Use the --batch-tests flag to combine compatible data tests into a single query, improving performance in large projects."
sidebar: "Batch tests"
---

The `--batch-tests` flag combines compatible data tests that target the same model into a single query, rather than running one query per test. This reduces the number of queries dbt runs for tests, which can improve performance in projects with many data tests.

Available in <Constant name="fusion_engine"/> v2.0 and later.

## Eligibility

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

Other data test types, such as `relationships`, are not eligible for batching and always run as their own query.

When dbt batches eligible tests, it merges them into a single synthesized data test per model and test type, checking every eligible column in one query.

This flag requires authenticating a dbt platform account with `dbt login`, and applies to `dbt build`, `dbt test`, `dbt run`, `dbt seed`, and `dbt snapshot`.

## Setting the flag

dbt resolves `batch_tests` from three places, in order of precedence:
1. The `--batch-tests` command-line flag, for a single invocation.
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
