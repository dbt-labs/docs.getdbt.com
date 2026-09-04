---
resource_types: [unit tests]
title: "compute"
description: "Use the compute config to run unit tests locally with DuckDB instead of against your data platform."
intro_text: "Compute controls whether a unit test runs against your data platform or locally with DuckDB."
datatype: string
default_value: remote
sidebar_label: "compute"
---

:::info

The `compute` config is available in the <Constant name="fusion_engine"/> only. It isn't available in <Constant name="core" /> and will be ignored. To upgrade to <Constant name="fusion"/>, refer to [Get started with <Constant name="fusion"/>](/docs/dbt/get-started-dbt).

:::

The `compute` config sets where a [unit test](/docs/build/unit-tests) runs &mdash; against your data platform, or locally with DuckDB for faster feedback while you develop. Because unit tests run against static fixtures instead of real data, they don't necessarily need your data platform to execute.

<File name='models/filename.yml'>

```yml
unit_tests:
  - name: unit_test_name
    model: model_name
    [config](/reference/resource-properties/config):
      compute: local | remote
```

</File>

<File name='dbt_project.yml'>

```yml
unit_tests:
  [resource-path](/reference/resource-configs/resource-path):
    +compute: local | remote
```

</File>

## Definition

You can configure `compute` for [unit tests](/docs/build/unit-tests), either on an individual test in a properties YAML file or for a group of tests in your project YAML file (`dbt_project.yml`).

The following values are available for `compute`:

- `remote` (default): Run the unit test against your data platform. This matches the behavior of previous versions.
- `local`: Run the unit test with DuckDB, wherever dbt is running, instead of sending it to your data platform.

Local execution is available for Snowflake and BigQuery. You might also see `sidecar` in error messages, which means the same thing as `local`.

A config on an individual unit test takes precedence over a project-level config. Set `+compute: local` in `dbt_project.yml` and then `compute: remote` on a specific test to opt that test out:

<File name='dbt_project.yml'>

```yml
unit_tests:
  my_project:
    +compute: local
```

</File>

<File name='models/filename.yml'>

```yml
unit_tests:
  - name: test_revenue_calculation
    model: fct_revenue
    config:
      compute: remote
```

</File>

## Things to know about local execution

- Your SQL has to be translatable to DuckDB. Platform-specific functions with no DuckDB equivalent fail, and `local` doesn't fall back to your data platform &mdash; a translation failure is a test failure.
- To translate your SQL, dbt fetches the schemas of your model's direct upstream models from your data platform the first time you run the test, then caches them for later runs. Those upstream models must already exist in your data platform.
- Setting `compute: local` also promotes [`static_analysis`](/reference/resource-configs/static-analysis) to `strict` for that test, because local execution needs strict analysis to translate your SQL. If you set `static_analysis: off` on the test, it can't run locally.
- The run output doesn't state which mode a test used.

:::caution Local results can differ from your data platform

DuckDB and your data platform won't always agree on things like rounding or date handling, so a test can pass locally even when the logic would behave differently in production. Use `compute: local` for fast iteration during development, and set `compute: remote` on unit tests that assert business-critical logic so CI validates them against your data platform before they ship.

:::

## Related docs

- [Run unit tests locally](/docs/build/unit-tests#run-unit-tests-locally)
- [Unit tests](/docs/build/unit-tests)
- [About unit tests property](/reference/resource-properties/unit-tests)
- [static_analysis](/reference/resource-configs/static-analysis)
