---
title: "Project quality checks"
description: "Write SQL rules that enforce project standards."
id: "project-checks"
availability:
  engine: v2
---

# Project quality checks <Lifecycle status="beta" />

As dbt projects grow and more contributors add models, quality silently degrades: a model ships without a description, a `public` model gets no `owner`, a model doesn't follow your org's naming convention.

Project quality checks in <Constant name="core_v2" /> let you enforce project standards with SQL. Write a rule (for example, every model has a description, required tags are set) and dbt enforces it before any warehouse work runs. If the project violates a rule, `dbt build` stops before compiling or materializing a single model.

Checks are similar to data tests, but earlier and cheaper: they run at parse time, locally, and with no warehouse connection.

Checks are SQL queries that run against the [dbt Information Schema](/reference/dbt-jinja-functions/info-schema/), a set of Parquet files that dbt generates to describe the resources in your project. Checks use the `{{ info_schema() }}` macro to query this information and enforce rules about your project's structure and metadata.

Before running checks, you must generate the dbt Information Schema. Once generated, checks run automatically with every `dbt build`. You can also run them on demand with `dbt check` or skip them during a build with `--skip-checks`.

## Writing your first check

A check is a SQL file in your `checks/` directory paired with a properties YAML file in the same directory. The following steps walk you through creating your first check.

1. Declare the `info_schema` version in `dbt_project.yml`:

    The `info_schema.version` tells dbt which version of the [dbt Information Schema](/reference/dbt-jinja-functions/info-schema/) your checks are written against. Refer to dbt Information Schema versioning for more information.

    <File name='dbt_project.yml'>

    ```yaml
    info_schema:
      version: 1
    ```

    </File>

2. Write a check under `checks/`:

    Like data tests, a check is a query that finds the "bad" rows. It passes if the query returns zero rows, and fails otherwise.

    <File name='checks/all_models_have_descriptions.sql'>

    ```sql
    select unique_id
    from {{ info_schema('models') }}
    where description is null or description = ''
    ```

    </File>

3. Configure the check in a properties YAML file in your `checks/` directory:

    <File name='checks/_checks.yml'>

    ```yaml
    version: 2
    checks:
      - name: all_models_have_descriptions
        description: "Fails if any model is missing a description."
        config:
          severity: warn   # default is error; 'warn' logs issues but does not fail the execution
    ```

    </File>

4. Run your checks:

    ```shell
    dbt check
    ```

    Checks also run automatically before models compile when you run `dbt build`. For more information, refer to [Commands](#commands).

## Guidelines for writing SQL check files

This section covers the rules and constraints for writing check SQL files and configuring check behavior.

- Put SQL files under `checks/`. To use a different directory, set [`check-paths`](/reference/project-configs/check-paths) in `dbt_project.yml`.
- The filename without the `.sql` extension becomes the check name (for example, `all_models_have_descriptions` is the check name for `checks/all_models_have_descriptions.sql`).
- Jinja in check files renders at parse time. You can use Jinja, but the result must be valid SQL at that point; checks do not go through a separate compile step the way models do.
- Checks cannot use `ref()` and do not appear in the model DAG. They access the dbt Information Schema only through `{{ info_schema() }}`.

## The `info_schema()` macro

`{{ info_schema() }}` is the supported way to reference the dbt Information Schema in a check. Pass the name of the table you want to query (for example, `{{ info_schema('models') }}` to query models, or `{{ info_schema('edges') }}` to query DAG edges). For the full list of available tables and columns, refer to [`info_schema`](/reference/dbt-jinja-functions/info-schema/).

## Example checks

The following examples show common project quality rules.

- Enforce descriptions on all models:

  <File name='checks/all_models_have_descriptions.sql'>

  ```sql
  select unique_id
  from {{ info_schema('models') }}
  where description is null or description = ''
  ```

  </File>

- Enforce that all `public` models have a description:

  <File name='checks/public_models_have_descriptions.sql'>

  ```sql
  select unique_id
  from {{ info_schema('models') }}
  where access = 'public'
    and (description is null or description = '')
  ```

  </File>

## Commands

Checks run with `dbt check` and `dbt build`. Other commands (`dbt run`, `dbt test`, `dbt compile`, etc.) do not run checks.

| Command | Behavior |
|---------|----------|
| `dbt check` | Runs all enabled checks. |
| `dbt check <name1> <name2> …` | Runs only the named checks. An unknown check name is an error; a disabled check name is accepted and skipped. |
| `dbt build` | Runs all enabled checks before models compile. A failing check stops the run before any model is compiled or executed. Warn-severity failures are reported and the build continues. Use `--skip-checks` to bypass. |

## Skipping checks on build

To skip all checks during a build, pass `--skip-checks` to `dbt build`. Models still compile and run.

```shell
dbt build --skip-checks
```

To skip a specific check, set `enabled: false` in its config. The check still appears in the manifest but does not run.

```yaml
checks:
  - name: all_models_have_descriptions
    config:
      enabled: false
```

If dbt cannot generate the dbt Information Schema, it skips all checks and `dbt build` continues with a `CheckIndexUnavailable` warning (`dbt1654`). To fail the build when this happens, promote that warning to an error using [`warn_error_options`](/reference/global-configs/warnings).

## Using selectors with checks

[`--select` and other selector methods](/reference/node-selection/syntax) do something different for checks than for other commands: instead of selecting which checks run, they select which project resources the checks evaluate.

Why checks work this way:

- You generally don't need to exclude checks or run only a subset of them. Checks are fast. Error-severity checks should block execution if violated; if a rule is informational, set it to `warn`. If a check is no longer relevant, disable or delete it.
- You may want to limit which resources are checked. This lets you incrementally introduce checks in an existing project. In development, run `dbt build --select <the part of your DAG you're working on>` to check only those resources. In CI, your checks run only against modified resources.
- When developing a new check, you can run one check at a time: `dbt check name_of_check`, or `dbt check name_of_check --select <resources to check>` to run it against a specific subset. You can also preview any `info_schema` query directly: `dbt show --inline "select * from {{ info_schema('...') }}"`.

`state:modified` behaves like any other selector. If it produces an empty selection, checks are `skipped` with exit code `0`.

:::note
`state:modified.configs` is not fully supported for checks. Changes to a check's `config` block may not be detected.
:::

### How `selection_filter_on` works

When a selector is active, dbt uses the [`selection_filter_on`](/reference/resource-configs/selection-filter-on) config to determine which column in the check's output contains the resource IDs to filter on:

- **Default (not set)**: If the check returns a `unique_id` column, dbt keeps only rows whose `unique_id` is in the selection. If there is no `unique_id` column, the check runs against the whole project (useful for aggregate checks like "the project has at least one model").
- **`selection_filter_on: none`**: Always runs the check against the whole project, regardless of any selector.
- **`selection_filter_on: [parent_unique_id, child_unique_id]`** (or another list of column names): Keeps a row if the ID in any of the named columns is in the selection. Use this for checks that return relationships between resources (edges). Each named column must exist in the results, or the check errors.

## Results

Each check produces one of the following statuses:

| Status | When | Fails the command? | Error code |
|--------|------|--------------------|------------|
| `pass` | Zero rows returned | No | — |
| `fail` | One or more rows returned, `severity: error` | Yes | `dbt1650` |
| `warn` | One or more rows returned, `severity: warn` | No (`--warn-error` or `warn_error_options` can promote it) | `dbt1651` |
| `skipped` | Selector matched nothing the check can report on | No | `dbt1652` |
| `error` | Check could not be evaluated (bad SQL, or `selection_filter_on` names a missing column) | Yes, even if `severity` is `warn` | `dbt1653` |

A failing check prints a short preview of the result rows. Each check result is recorded in `run_results.json` as `check.<project>.<name>`. When a `dbt build` is blocked by a failing check, the models that did not run are recorded as `skipped` with the reason `skipped because a parse-time check failed`.

## Retry

Use `dbt retry` to resume after a failed `dbt check` or a check-blocked `dbt build`. dbt will:

1. Re-parse the project ([partial parse](/reference/global-configs/parsing) still applies).
2. Re-run only the checks that previously failed. Checks that already passed are not re-run.
3. Build the models that were skipped, if the previously failing checks now pass and the original command was a `dbt build`.

## Related documentation

- [Check properties](/reference/check-properties)
- [Check configurations](/reference/check-configs)
- [`dbt check` command](/reference/commands/check)
- [`info_schema`](/reference/dbt-jinja-functions/info-schema/)
- [`check-paths` project config](/reference/project-configs/check-paths)
