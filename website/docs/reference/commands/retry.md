---
title: "About dbt retry command"
sidebar_label: "retry"
id: "retry"
---

`dbt retry` retries the last `dbt` command from the point of failure. If the previously executed `dbt` command was successful, `retry` will complete without compiling any nodes. 

Retry works with the following commands:

- [`build`](/reference/commands/build)
- [`compile`](/reference/commands/compile)
- [`clone`](/reference/commands/clone)
- [`generate`](/reference/commands/generate)
- [`seed`](/reference/commands/seed)
- [`snapshot`](/reference/commands/build)
- [`test`](/reference/commands/test)
- [`run`](/reference/commands/run)
- [`run-operation`](/reference/commands/run-operation)

`dbt retry` will rerun from `error`, `failed`, `runtime error`, and `skipped` failures recorded in the run_results.json. If the command was successful with no errors, then it will rerun tests or freshness checks that warned. Executing `dbt retry` without correcting the previous failures will result in the same outcome. 

If a model is _canceled_ because of `-fail--fast`, the downstream dependencies are not recorded as `skipped` and will not be retried.

There are no selectors for `dbt retry`; it reuses the selectors from the previously executed command.