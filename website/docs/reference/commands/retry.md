---
title: "About dbt retry command"
sidebar_label: "retry"
id: "retry"
---

:::info Support in dbt Cloud

`dbt retry` is supported in the dbt Cloud IDE.

Native support for restarting scheduled runs from point of failure is currently in development & coming soon.

:::

`dbt retry` re-executes the last `dbt` command from the node point of failure. If the previously executed `dbt` command was successful, `retry` will finish as `no operation`. 

Retry works with the following commands:

- [`build`](/reference/commands/build)
- [`compile`](/reference/commands/compile)
- [`seed`](/reference/commands/seed)
- [`snapshot`](/reference/commands/build)
- [`test`](/reference/commands/test)
- [`run`](/reference/commands/run)
- [`run-operation`](/reference/commands/run-operation)

`dbt retry` references [run_results.json](/reference/artifacts/run-results-json) to determine where to start. Executing `dbt retry` without correcting the previous failures will garner <Term id="idempotent" /> results.

`dbt retry` reuses the [selectors](/reference/node-selection/yaml-selectors) from the previously executed command.

