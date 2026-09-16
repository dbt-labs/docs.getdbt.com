---
title: "Batch tests"
id: "batch-tests"
description: "Learn about batch test that combine compatible generic tests into a single query, improving performance in large projects."
sidebar: "Batch tests"
---

The `--batch-tests` flag combines compatible data tests that target the same model into a single query, rather than running one query per test.

When dbt schedules data tests that use their default configuration against the same model, `--batch-tests` merges them into a single synthesized test per model and test type, checking every eligible column in one query. This reduces the number of queries dbt runs for tests, which can improve performance in projects with many data tests.

This flag is only supported on <Constant name="fusion_engine"/>, and applies to the following commands: 
- `dbt build`
- `dbt test`
- `dbt run`
- `dbt seed`
- `dbt snapshot`.

You can set this flag using the CLI, an environment variable, or a project-level flag:

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
