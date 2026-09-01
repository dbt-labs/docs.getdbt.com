---
title: "About the info_schema function"
sidebar_label: "info_schema"
id: "info-schema"
description: "Use `info_schema()` in check SQL files to query project metadata at parse time."
availability:
  engine: v2
---

`{{ info_schema('<view_name>') }}` is the supported way to read project metadata inside [project quality checks](/docs/build/project-checks). Pass the name of the view you want to query (for example, `{{ info_schema('models') }}` to query models, or `{{ info_schema('edges') }}` to query DAG edges). For the full list of available views, refer to [Available views](#available-views). dbt writes your project metadata to a local index at parse time, and checks query that index through `info_schema()`.

Only views whose columns are fully populated at parse time are available. Passing a view name that doesn't exist or isn't available at parse time causes the check to fail with a message listing what is available. This is intentional &mdash; if dbt silently returned an empty table, the check would pass despite having checked nothing.

## Available views

Pass the view name to `{{ info_schema() }}` to query it in your check SQL.

<SimpleTable>
| View | Description |
|------|-------------|
| `graph_nodes` | All nodes across all resource types in a single queryable view |
| `models` | One row per model |
| `seeds` | One row per seed |
| `tests` | One row per data test |
| `snapshots` | One row per snapshot |
| `sources` | One row per source |
| `analyses` | One row per analysis |
| `operations` | One row per operation |
| `functions` | One row per user-defined function |
| `checks` | One row per check |
| `columns` | Declared columns across all nodes |
| `docs` | Doc blocks |
| `edges` | Parent/child edges in the DAG |
| `macros` | Macros |
| `project` | Project-level metadata (one row) |
| `project_vars` | Project variables |
| `test_metadata` | Test configuration details |
</SimpleTable>

`models`, `seeds`, `tests`, `snapshots`, `sources`, `analyses`, `operations`, `functions`, and `checks` each contain one resource type and share the same columns as `graph_nodes`.

## Unavailable views

The following views are not available. dbt errors if you pass them to `info_schema()` and reports the list of available views:

- `nodes`, `node_columns`: Some columns in these views are empty at parse time and only populated after dbt compiles the project (for example, `compiled_code`, `compiled_path`). Querying them at parse time would return silent `NULL`s, which could cause a check to pass incorrectly. Use `graph_nodes` or a per-resource-type view instead.
- `generation`: Contains internal bookkeeping data, not project metadata. There is no parse-time equivalent.
- Run artifact views (`dbt_rt.*`): Only exist after models execute. Use `run_results.json` to access post-run data.

