---
title: "Checks"
description: "Write SQL rules that enforce project standards."
id: "checks"
availability:
  engine: v2
---

# Checks <Lifecycle status="beta" />

As dbt projects grow and more contributors add models, maintaining consistent standards becomes harder: a model ships without a description, a public model has no owner, a new model ignores naming conventions. None of this breaks anything, so it's not caught, but quality erodes silently.

Checks are SQL queries that assert rules and standards about your project metadata. Define rules (such as every model must have a description, required tags are set, and so on) and dbt enforces them before any warehouse work runs. 

Write your checks in DuckDB SQL, using the [`{{ info_schema() }}` macro](/reference/dbt-jinja-functions/info-schema-macro) to reference the [dbt Information Schema](/docs/build/dbt-information-schema) in your SQL. Checks run locally in DuckDB at parse time, so they don't require a connection to your warehouse. If the project violates a rule, `dbt build` stops before compiling or materializing a single model.

Similar to [data tests](/docs/build/data-tests), a check finds any instances in your project that do not meet your expectations. A check passes when the query returns zero rows, and fails when it returns one or more.

Checks run automatically with every `dbt build`; you can use `--skip-checks` to skip them. You can also run them on demand with `dbt check`.

## Guidelines for writing SQL check files

This section covers the rules and constraints for writing check SQL files and configuring check behavior.

- A check is a SQL file in your `checks/` directory. You can optionally pair it with a properties YAML file in the same directory to configure it. To use a different directory, set [`check-paths`](/reference/project-configs/check-paths) in `dbt_project.yml`.
- The filename without the `.sql` extension becomes the check name (for example, `all_models_have_descriptions` is the check name for `checks/all_models_have_descriptions.sql`).
- Jinja in check files renders at parse time. You can use Jinja, but the result must be valid DuckDB SQL at that point; checks do not go through a separate compile step the way models do.
- Checks are dbt resources; each check appears in `manifest.json`, supports `tags` and `meta`, and `dbt ls` lists them.

### The `info_schema()` macro

[`{{ info_schema() }}`](/reference/dbt-jinja-functions/info-schema-macro) is the supported way to query the [dbt Information Schema](/docs/build/dbt-information-schema) in a check. Pass the name of the table you want to query (for example, `{{ info_schema('models') }}` for models or `{{ info_schema('edges') }}` for DAG edges). No materialized [Information Schema](/reference/info-schema) files are required; checks run against an intermediate representation built at parse time.

For the full list of available views and columns, refer to [Columns available for checks](/reference/info-schema#columns-available-for-checks).

## Writing your first check

The following steps walk you through creating your first check.

1. Declare the `info_schema` version in `dbt_project.yml`:

    The `info_schema.version` pins which version of the info schema the [`{{ info_schema() }}`](/reference/dbt-jinja-functions/info-schema-macro) macro resolves to. Currently, `1` is the only available version.

    <File name='dbt_project.yml'>

    ```yaml
    info_schema:
      version: 1
    ```

    </File>

2. Write a check under `checks/`:

    Use [`{{ info_schema() }}`](/reference/dbt-jinja-functions/info-schema-macro) to query project metadata. A check passes if the query returns zero rows. For available views and columns, refer to [Columns available for checks](/reference/info-schema#columns-available-for-checks).

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
  from {{ info_schema('sources') }} as s
  left join {{ info_schema('edges') }} as e on e.parent_unique_id = s.unique_id
  where e.child_unique_id is null
  ```

  </File>

- Flag `public` models with no group owner:

  <File name='checks/public_models_have_owners.sql'>

  ```sql
  select m.unique_id
  from {{ info_schema('models') }} as m
  left join {{ info_schema('groups') }} as g on g.name = m."group"
  where m.access = 'public'
    and (
      g.unique_id is null
      or (
        (g.owner_name is null or trim(g.owner_name) = '')
        and (g.owner_email is null or trim(g.owner_email) = '')
      )
    )
  ```

  </File>

## Commands

Checks run with `dbt check` and `dbt build`.

<SimpleTable>
| Command | Behavior |
|---------|----------|
| `dbt check` | Runs all checks. |
| `dbt check <name1> <name2> …` | Runs only the named checks. An unknown check name is an error; a disabled check name is accepted and skipped. |
| `dbt build` | Runs all enabled checks before models compile. A failing check stops the run before any model is compiled or executed. Warn failures are reported and the build continues. Use `--skip-checks` to bypass. |
</SimpleTable>

## Skipping checks on build

To skip all checks, pass the [`--skip-checks` flag](/reference/commands/build?version=2#the---skip-checks-flag) to `dbt build`.

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

:::note Disabling at the project level
Setting `+enabled: false` in `dbt_project.yml` disables the check silently &mdash; nothing in the output shows checks were skipped. A successful `dbt build` in CI doesn't tell you whether the project has no checks or all checks are disabled. Running `dbt check <name>` for a disabled check also succeeds without running the check or returning an error.
:::


## Using selectors with checks

[`--select` and other selector methods](/reference/node-selection/syntax) do something different for checks than for other commands: instead of selecting which checks run, they select which project resources the checks evaluate.

Why checks work this way:

- You generally don't need to exclude checks or run only a subset of them. Checks are fast. Error-severity checks should block execution if violated; if a rule is informational, set it to `warn`. If a check is no longer relevant, disable or delete it.
- You may want to limit which resources are checked. This lets you incrementally introduce checks in an existing project. In development, run `dbt build --select <the part of your DAG you're working on>` to check only those resources. In CI, your checks run only against modified resources.
- When developing a new check, you can run one check at a time: `dbt check name_of_check`, or `dbt check name_of_check --select <resources to check>` to run it against a specific subset. You can also preview any `info_schema` query directly: `dbt show --inline "select * from {{ info_schema('...') }}"`. For example, to inspect your checks' own metadata, run `dbt show --inline "select * from {{ info_schema('checks') }}"`.


### How `selection_filter_on` works

By default, dbt filters check results to selected resources by matching the `unique_id` column in the output. If the check returns no `unique_id` column, it runs against the whole project.

Use [`selection_filter_on`](/reference/resource-configs/selection-filter-on) when your check returns rows with different ID columns that you want to filter on. It accepts the following values:

import SelectionFilterOnValues from '/snippets/_selection-filter-on-values.md';

<SelectionFilterOnValues />

For example, the following check returns `child_unique_id` instead of `unique_id`, so you must set `selection_filter_on`:

<File name='checks/multiple_sources_joined.sql'>

```sql
select child_unique_id, count(*) as source_parents
from {{ info_schema('edges') }}
where parent_unique_id like 'source.%'
group by child_unique_id
having count(*) > 1
```

</File>

<File name='checks/_checks.yml'>

```yaml
checks:
  - name: multiple_sources_joined
    description: "Fails if any model reads directly from more than one source."
    config:
      selection_filter_on: child_unique_id
```

</File>


## Related documentation

- [Check properties](/reference/check-properties)
- [Check configurations](/reference/check-configs)
- [`dbt check` command](/reference/commands/check)
- [`info_schema`](/reference/dbt-jinja-functions/info-schema-macro/)
- [`check-paths` project config](/reference/project-configs/check-paths)
