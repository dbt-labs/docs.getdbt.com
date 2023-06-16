---
title: "About dbt retry command"
sidebar_label: "retry"
id: "retry"
---

`dbt retry` re-executes the last `dbt` command from the node point of failure. If the previously executed `dbt` command was successful, `retry` will finish as a no op. 

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

`dbt retry` will execute from the node failures recorded in the run_results.json. Executing `dbt retry` without correcting the previous failures will garner idempotent results.

`dbt retry` reuses the selectors from the previously executed command.