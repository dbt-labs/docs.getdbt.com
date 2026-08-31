---
title: "About the info_schema function"
sidebar_label: "info_schema"
id: "info-schema"
description: "Use `info_schema()` in check SQL files to query project metadata at parse time."
availability:
  engine: v2
---

`{{ info_schema('<view_name>') }}` is the supported way to read project metadata inside [project quality checks](/docs/build/project-checks). Pass the name of the view you want to query (for example, `{{ info_schema('models') }}` to query models, or `{{ info_schema('edges') }}` to query DAG edges). For the full list of available views, refer to [Available views](#available-views). dbt writes your project metadata to a local index at parse time, and checks query that index through `info_schema()`.

Only views whose columns are fully populated at parse time are available. Passing an unknown or later-phase view name causes the check to fail with a message listing what is available. This is intentional &mdash; if dbt silently returned an empty table, the check would pass despite having checked nothing.

## Available views

Each view represents a resource type in your project. Pass the view name to `{{ info_schema() }}` to query that resource type in your check SQL.

<SimpleTable>
| View | Description |
|------|-------------|
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

`models`, `seeds`, `tests`, `snapshots`, `sources`, `analyses`, `operations`, `functions`, and `checks` share the same columns as `graph_nodes`.

## Unavailable views

The following views are not available. dbt errors if you pass them to `info_schema()`:

- `nodes`, `node_columns`: Some columns are only populated after compile, so they are incomplete at parse time.
- `column_lineage`: Only available after compile and lineage resolutio.
- Run results and other post-run data: Only available after models execute.

## Column reference

The following lists commonly used columns per view.

<Expandable alt_header="graph_nodes (shared by all resource-type views)">

- `unique_id`
- `name`
- `description`
- `resource_type`
- `package_name`
- `fqn`
- `enabled`
- `materialized`
- `access_level`
- `group_name`
- `contract_enforced`
- `tags`
- `meta`

</Expandable>

<Expandable alt_header="columns">

- `unique_id`
- `column_name`
- `declared_type`
- `description`
- `tags`

</Expandable>

<Expandable alt_header="docs">

- `unique_id`
- `name`
- `block_contents`

</Expandable>

<Expandable alt_header="edges">

- `parent_unique_id`
- `child_unique_id`
- `edge_type`

</Expandable>

<Expandable alt_header="macros">

- `unique_id`
- `name`
- `description`
- `package_name`

</Expandable>

<Expandable alt_header="project">

- `project_name`
- `dbt_version`
- `adapter_type`

</Expandable>

<Expandable alt_header="project_vars">

- `var_name`
- `var_value`

</Expandable>

<Expandable alt_header="test_metadata">

- `unique_id`
- `test_name`
- `column_name`
- `severity`

</Expandable>
