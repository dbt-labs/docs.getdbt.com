---
title: "Project quality checks"
description: "Write SQL rules that assert properties of your dbt project and block dbt build before models compile."
id: "project-checks"
availability:
  engine: v2
---

# Project quality checks

As dbt projects grow and more contributors add models, quality silently degrades: a model ships without a description, a `public` model gets no `owner`, a staging model reaches directly into a mart layer.

Project quality checks in <Constant name="core_v2" /> help you enforce project standards in dbt. Write a rule in SQL (for example, every model has a description, no model selects from a forbidden source, required tags are set) and dbt enforces it before any warehouse work runs. If the project violates a rule, `dbt build` stops before compiling or materializing a single model.

Checks are similar to data tests, but earlier and cheaper: they run at parse time, locally, and with no warehouse connection. 

## Writing your first check

A check is a SQL file in your `checks/` directory paired with a config entry in `checks/_checks.yml`. The following steps walk you through creating your first check.

1. Declare the `info_schema` version in `dbt_project.yml`:

  The `info_schema.version` key tells dbt which version of the metadata index schema your checks are written against. See [`info_schema`](/reference/dbt-jinja-functions/info-schema/) for more detail. <!-- TODO: add a link to info schema docs once PR 9906 is merged-->

  <File name='dbt_project.yml'>

  ```yaml
  info_schema:
    version: 1
  ```

  </File>

2. Write a check under `checks/`:

  <File name='checks/all_models_have_descriptions.sql'>

  ```sql
  select unique_id
  from {{ info_schema('models') }}
  where description is null or description = ''
  ```

  </File>

3. Configure the check in `checks/_checks.yml`:

  <File name='checks/_checks.yml'>

  ```yaml
  version: 2
  checks:
    - name: all_models_have_descriptions
      config:
        severity: error   # default; 'warn' reports but does not fail
        enabled: true     # default
  ```

  </File>

4. Run your checks:

  ```shell
  dbt check
  dbt check all_models_have_descriptions
  dbt build
  ```

## Writing SQL check files

This section covers the rules and constraints for writing check SQL files and configuring check behavior.

### Guidelines

- Put SQL files under `checks/`. To use a different directory, set [`check-paths`](/reference/project-configs/check-paths) in `dbt_project.yml`.
- The filename without the `.sql` extension becomes the check name (for example, `all_models_have_descriptions` is the check name for `checks/all_models_have_descriptions.sql`).
- Jinja in check files renders at parse time. You can use Jinja, but the result must be valid SQL at that point; checks do not go through a separate compile step the way models do.
- Checks cannot use `ref()` and do not appear in the model DAG. They read project metadata only through `{{ info_schema() }}`.
- `group` is a SQL keyword. When querying any view that has a `group` column, write `"group"` (quoted) to avoid a parse error.

#### Metadata contract versioning

Each package that ships checks must declare `info_schema.version` in its own `dbt_project.yml` (it is not inherited from the root project). Only `version: 1` is accepted today. A package with checks and no version declaration fails to parse with a message naming the file and the value to set.

### The `info_schema()` macro

`{{ info_schema() }}` is the supported way to read project metadata in a check. Pass the name of the view you want to query (for example, `{{ info_schema('models') }}` to query models, or `{{ info_schema('edges') }}` to query DAG edges). dbt writes your project metadata to a local index at parse time, and checks query that index through this macro. For the full list of available views and columns, refer to [`info_schema`](/reference/dbt-jinja-functions/info-schema/).

### Example checks

The following examples show common project quality rules. Each queries a different `info_schema()` view depending on what it's asserting.

- Enforce descriptions on all models:

  <File name='checks/all_models_have_descriptions.sql'>

  ```sql
  select unique_id
  from {{ info_schema('models') }}
  where description is null or description = ''
  ```

  </File>

- Block access to a forbidden source:

  <File name='checks/no_forbidden_source_access.sql'>

  ```sql
  select parent_unique_id, child_unique_id
  from {{ info_schema('edges') }}
  where parent_unique_id like 'source.%forbidden%'
  ```

  </File>

  Because this check returns edges (parent/child pairs rather than a single `unique_id`), set `selection_filter_on: [parent_unique_id, child_unique_id]` in the check config so `--select` scopes rows by either column. Refer to [Using selectors with checks](#using-selectors-with-checks) for more information.

### Configuring checks

For the full list of config options and how to set them in the project file, property file, or SQL config block, refer to [Check configurations](/reference/check-configs).

## Commands

Checks run with `dbt check` and `dbt build`. Other commands do not run checks. The following table describes the behavior of each command.

| Command | Runs checks? | Behavior |
|---------|-------------|----------|
| `dbt check` | Yes | Parses the project, runs all enabled checks, and exits. Does not compile or materialize models. |
| `dbt check <name> …` | Yes, named checks only | Runs only the named checks. An unknown check name is an error. A disabled check name is accepted and skipped. |
| `dbt build` | Yes, before models compile | Error-severity failures stop the run before any model is compiled or built. Warn-severity failures are reported and the build continues. |
| `dbt build --skip-checks` | No | Skips all checks. Models still compile and run. `dbt check` does not support the `--skip-checks` flag. For more information, refer to [Skipping checks on build](#skipping-checks-on-build). |
| `dbt run` / `test` / `compile` / `seed` | No | Checks only run with `dbt check` and `dbt build`. |
| `dbt retry` after a failed `dbt check` or `dbt build` | Yes, failed checks only | Re-runs only the checks that failed. If they pass and a build was blocked, builds the skipped models. |

## Skipping checks on build

There are two ways to skip checks during `dbt build`:

| Method | Checks skipped | Models still build? | Warning issued? |
|--------|---------------|---------------------|-----------------|
| `dbt build --skip-checks` | All checks | Yes | No |
| `enabled: false` on a check | That check only | Yes | No |

`--warn-error` has no effect on `--skip-checks`. When checks are skipped, there is nothing to promote to an error, so the build always continues.

If dbt cannot prepare project metadata (for example, due to a write error), it skips all checks and `dbt build` continues with a `CheckIndexUnavailable` warning (`dbt1654`). To fail the build when this happens, promote that warning to an error using `warn_error_options`.

## Using selectors with checks

Use `dbt check <name>` to choose which check to run. The `--select` flag serves a different purpose: it filters the result rows reported by that check.

For example, passing `--select some_check_name` does not tell dbt to run only `some_check_name`. If the check being run queries `info_schema('checks')`, the selector limits its results to the row representing `some_check_name`.

When you pass a selector, dbt uses the [`selection_filter_on`](/reference/resource-configs/selection-filter-on) config to determine how to filter the results:

- **Default (not set)**: If the query returns a `unique_id` column, dbt keeps rows whose `unique_id` is included in the selection. If the query does not return `unique_id`, dbt does not filter the results. This allows aggregate checks (for example, "the project has at least one model") to apply to the whole project.
- **`selection_filter_on: none`**: Does not filter the results; always applies the check to the whole project. Use this option to make whole-project behavior explicit.
- **`selection_filter_on: [parent_unique_id, child_unique_id]`** (or another list of column names): Keeps a row if the ID in any of the specified columns is included in the selection. Each specified column must exist in the results, or the check returns an error. Use this option for checks that report relationships between resources.

`state:modified` behaves like any other selector. If it produces an empty selection, checks are `skipped` with exit code `0` rather than fail because of issues elsewhere in the project. If it selects one model, the check reports only applicable result rows for that model.

:::note
`state:modified.configs` does not yet fully detect config changes for checks. Config comparison falls back to the rendered config rather than `unrendered_config` (which is not yet populated for checks), so changes involving environment-aware Jinja values may not be detected. Use this selector with caution in CI pipelines.
:::

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
