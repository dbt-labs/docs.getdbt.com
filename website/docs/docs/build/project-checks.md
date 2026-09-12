---
title: "Project quality checks"
description: "Write SQL rules that enforce project standards."
id: "project-checks"
availability:
  engine: v2
---

# Project quality checks <Lifecycle status="beta" />

As dbt projects grow and more contributors add models, quality silently degrades: a model ships without a description, a `public` model gets no `owner`, a model doesn't follow your org's naming convention.

Checks let you enforce project standards with SQL, locally, without a warehouse connection. Define rules (such as every model must have a description, required tags are set, and so on) and dbt enforces it at parse time before any warehouse work runs. If the project violates a rule, `dbt build` stops before compiling or materializing a single model.

Each check queries project metadata &mdash; such as models, sources, columns, and dependencies &mdash; using the [`{{ info_schema() }}` macro](/reference/dbt-jinja-functions/info-schema-macro).

They are similar to [data tests](/docs/build/data-tests) &mdash; a check finds the "bad" rows and it passes if the query returns zero rows, and fails otherwise. However, checks are earlier and cheaper than data tests: they run at parse time, locally, and with no warehouse connection.

Checks run automatically with every `dbt build`. You can also run them on demand with `dbt check` or skip them during a build with `--skip-checks`.

## Guidelines for writing SQL check files

This section covers the rules and constraints for writing check SQL files and configuring check behavior.

- A check is a SQL file in your `checks/` directory paired with a properties YAML file in the same directory. To use a different directory, set [`check-paths`](/reference/project-configs/check-paths) in `dbt_project.yml`.
- The filename without the `.sql` extension becomes the check name (for example, `all_models_have_descriptions` is the check name for `checks/all_models_have_descriptions.sql`).
- Jinja in check files renders at parse time. You can use Jinja, but the result must be valid SQL at that point; checks do not go through a separate compile step the way models do.
- Checks cannot use `ref()` and do not appear in the model DAG. However, checks are dbt resources; each check appears in `manifest.json`, supports `tags` and `meta`, and `dbt ls` lists them. Checks access the [dbt Information Schema](/docs/build/dbt-information-schema) only through `{{ info_schema() }}`.

### The `info_schema()` macro

[`{{ info_schema() }}`](/reference/dbt-jinja-functions/info-schema-macro) is the supported way to reference the dbt Information Schema in a check. Pass the name of the table you want to query (for example, `{{ info_schema('models') }}` to query models, or `{{ info_schema('edges') }}` to query DAG edges). Checks always run against an intermediate representation of the dbt Information Schema built at parse time.

The `info_schema()` macro reads from a logical view layer over your project metadata. Checks can access the latest project metadata without requiring materialized [Information Schema](/reference/info-schema) files.

For the full list of available tables and columns, refer to [Views and columns reference](/reference/info-schema-views/).

## Writing your first check

The following steps walk you through creating your first check.

1. Declare the `info_schema` version in `dbt_project.yml`:

    The `info_schema.version` pins which version of the info schema the [`{{ info_schema() }}`](/reference/dbt-jinja-functions/info-schema-macro) macro resolves to.

    <File name='dbt_project.yml'>

    ```yaml
    info_schema:
      version: 1
    ```

    </File>

2. Write a check under `checks/`:

    Use [`{{ info_schema() }}`](/reference/dbt-jinja-functions/info-schema-macro) to query project metadata. A check passes if the query returns zero rows. For available views and columns, refer to the [Views and columns reference](/reference/info-schema-views/).

    <File name='checks/all_models_have_descriptions.sql'>

    ```sql
    select unique_id
    from {{ info_schema('models') }}
    where description = ''
    ```

    </File>


3. Configure the check in a properties YAML file in your `checks/` directory. 

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

## Example checks

The following examples show common project quality rules, each defined as a SQL query against the `info_schema` macros and saved as a `.sql` file under `checks/`.

- Enforce that all `public` models have a description:

  <File name='checks/public_models_have_descriptions.sql'>

  ```sql
  select unique_id
  from {{ info_schema('models') }}
  where access = 'public'
    and description = ''
  ```

  </File>

- Flag sources that aren't referenced by models. An unreferenced source has no downstream models, and is either unused or missing a model that should reference it:

  <File name='checks/unused_sources.sql'>

  ```sql
  select s.unique_id, s.name
  from {{ info_schema('sources') }} s
  left join {{ info_schema('edges') }} e on e.parent_unique_id = s.unique_id
  where e.child_unique_id is null
  ```

  </File>

- Prevent non-staging models from referencing `raw_` models directly. Because this check queries `edges`, use the [`selection_filter_on`](/reference/resource-configs/selection-filter-on) config so the selector filters on either endpoint:

  <File name='checks/no_direct_raw_dependency.sql'>

  ```sql
  select
      e.parent_unique_id,
      e.child_unique_id,
      c.name as consumer
  from {{ info_schema('edges') }} as e
  join {{ info_schema('models') }} as p
      on p.unique_id = e.parent_unique_id
  join {{ info_schema('models') }} as c
      on c.unique_id = e.child_unique_id
  where p.name like 'raw_%'
    and c.name not like 'stg_%'
  ```

  </File>

  <File name='checks/_checks.yml'>

  ```yaml
  version: 2
  checks:
    - name: no_direct_raw_dependency
      description: "Fails if a non-staging model refs a raw_ model directly."
      config:
        selection_filter_on: [parent_unique_id, child_unique_id]
  ```

  </File>

## Commands

Checks run with `dbt check` and `dbt build`. Other commands (`dbt run`, `dbt test`, `dbt compile`, etc.) do not run checks.

| Command | Behavior |
|---------|----------|
| `dbt check` | Runs all checks. |
| `dbt check <name1> <name2> …` | Runs only the named checks. An unknown check name is an error; a disabled check name is accepted and skipped. |
| `dbt build` | Runs all enabled checks before models compile. A failing check stops the run before any model is compiled or executed. Warn failures are reported and the build continues. Use `--skip-checks` to bypass. |

## Skipping checks on build

To skip all checks during a build, pass the `--skip-checks` flag to `dbt build`. Models still compile and run.

```shell
dbt build --skip-checks
```

To skip a specific check, set `enabled: false` in its config block in the YAML file. The check still appears in the manifest but does not run.

```yaml
checks:
  - name: all_models_have_descriptions
    config:
      enabled: false
```

To disable all checks at the project level, set `+enabled: false` under `checks:` in `dbt_project.yml`. You can also scope it to a specific package or check:

<File name='dbt_project.yml'>

```yaml
checks:
  +enabled: false  # disables all checks in the project

  # or scope to a package:
  my_package:
    +enabled: false

  # or scope to a single check:
  my_package:
    all_models_have_descriptions:
      +enabled: false
```

</File>

:::note Disabling at the project level
Unlike the `--skip-checks` flag, setting `+enabled: false` in `dbt_project.yml` is persistent and nothing in the output shows that checks were skipped. A successful `dbt build` in CI doesn't indicate whether the project has no checks or all checks are disabled. Running `dbt check <name>` for a disabled check also succeeds without running the check or returning an error.
:::


## Using selectors with checks

[`--select` and other selector methods](/reference/node-selection/syntax) do something different for checks than for other commands: instead of selecting which checks run, they select which project resources the checks evaluate.

Why checks work this way:

- You generally don't need to exclude checks or run only a subset of them. Checks are fast. Error-severity checks should block execution if violated; if a rule is informational, set it to `warn`. If a check is no longer relevant, disable or delete it.
- You may want to limit which resources are checked. This lets you incrementally introduce checks in an existing project. In development, run `dbt build --select <the part of your DAG you're working on>` to check only those resources. In CI, your checks run only against modified resources.
- When developing a new check, you can run one check at a time: `dbt check name_of_check`, or `dbt check name_of_check --select <resources to check>` to run it against a specific subset. You can also preview any `info_schema` query directly: `dbt show --inline "select * from {{ info_schema('...') }}"`. For example, to inspect your checks' own metadata, run `dbt show --inline "select * from {{ info_schema('checks') }}"`.

`state:modified` behaves like any other selector. If it produces an empty selection, checks are `Skipped` and dbt emits a `NoNodesForSelectionCriteria` warning naming the selector:

```shell
[warning] [NoNodesForSelectionCriteria (dbt1092)]: The selection criterion 'state:modified' does not match any enabled nodes
```

### How `selection_filter_on` works

When a selector is active, dbt uses the [`selection_filter_on`](/reference/resource-configs/selection-filter-on) config to determine which column in the check's output contains the resource IDs to filter on:

import SelectionFilterOnValues from '/snippets/_selection-filter-on-values.md';

<SelectionFilterOnValues />

## Results

Each check produces one of the following statuses:

| Status | When | Fails the command? | Error code |
|--------|------|--------------------|------------|
| `Passed` | Zero rows returned | No | — |
| `Failed` | One or more rows returned with `severity: error`, or the check could not be evaluated (bad SQL, or `selection_filter_on` names a missing column). The latter fails even if `severity` is `warn`. | Yes | `dbt1650` (violations), `dbt1653` (evaluation error) |
| `Warned` | One or more rows returned, `severity: warn` | No (`--warn-error` or `warn_error_options` can promote it) | `dbt1651` |
| `Skipped` | Selector matched nothing the check can report on | No | `dbt1652` |

Each check prints one result line in the same format as data tests:

```shell
 Failed [  0.02s] check all_models_have_descriptions
 Passed [  0.00s] check zz_pass
Skipped [  0.00s] check documentation_coverage
```

A failing or warning check prints its violation rows as a table, the way `dbt show` prints query rows:

```shell
[error] [CheckFailed (dbt1650)]: check 'all_models_have_descriptions' failed with 1 violation(s)
┌──────────────────────────────────┬──────────────┬──────────────────────────┐
│ unique_id                        ┆ name         ┆ message                  │
╞══════════════════════════════════╪══════════════╪══════════════════════════╡
│ model.check_command.undocumented ┆ undocumented ┆ model has no description │
└──────────────────────────────────┴──────────────┴──────────────────────────┘
```

Each check result is recorded in `run_results.json` as `check.<project>.<name>`. When a `dbt build` is blocked by a failing check, the models that did not run are recorded as `Skipped` with the reason `skipped because a parse-time check failed`.

## `dbt retry` with checks

Use `dbt retry` to resume after a failed `dbt check` or a check-blocked `dbt build`. dbt will:

1. Re-parse the project ([partial parse](/reference/global-configs/parsing) still applies).
2. Re-run only the checks that previously failed. Checks that already passed are not re-run.
3. Build the models that were skipped, if the previously failing checks now pass and the original command was a `dbt build`.

## Related documentation

- [Check properties](/reference/check-properties)
- [Check configurations](/reference/check-configs)
- [`dbt check` command](/reference/commands/check)
- [`info_schema`](/reference/dbt-jinja-functions/info-schema-macro/)
- [`check-paths` project config](/reference/project-configs/check-paths)
