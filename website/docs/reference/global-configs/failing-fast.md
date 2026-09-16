---
title: "Failing fast"
id: "failing-fast"
sidebar: "Failing fast"
---

Supply the `-x` or `--fail-fast` flag to `dbt run`, `dbt build`, or `dbt test` to make dbt exit immediately on the first failure. `fail_fast` is a global flag, so it stops on both run errors and test errors —&mdash; not just run errors. If other models are in-progress when the first failure happens, then dbt will terminate the connections for these still-running models.

For the full precedence rules and environment-variable equivalent (`DBT_FAIL_FAST`), refer to [`fail_fast` row in About global configs](/reference/global-configs/about-global-configs#available-flags).

For example, you can select four models to run, but if a failure occurs in the first model, the failure will prevent other models from running:

```text
$ dbt run -x --threads 1
Running with dbt=1.0.0
Found 4 models, 1 test, 1 snapshot, 2 analyses, 143 macros, 0 operations, 1 seed file, 0 sources

14:47:39 | Concurrency: 1 threads (target='dev')
14:47:39 |
14:47:39 | 1 of 4 START table model test_schema.model_1........... [RUN]
14:47:40 | 1 of 4 ERROR creating table model test_schema.model_1.. [ERROR in 0.06s]
14:47:40 | 2 of 4 START view model test_schema.model_2............ [RUN]
14:47:40 | CANCEL query model.debug.model_2....................... [CANCEL]
14:47:40 | 2 of 4 ERROR creating view model test_schema.model_2... [ERROR in 0.05s]

Database Error in model model_1 (models/model_1.sql)
  division by zero
  compiled SQL at target/run/debug/models/model_1.sql

Encountered an error:
FailFast Error in model model_1 (models/model_1.sql)
  Failing early due to test failure or runtime error
```
