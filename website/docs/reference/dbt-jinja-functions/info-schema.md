---
title: "About the info_schema function"
sidebar_label: "info_schema"
id: "info-schema"
description: "Use `info_schema()` in check SQL files to query project metadata at parse time."
availability:
  engine: v2
---

`{{ info_schema('<view_name>') }}` is the supported way to read project metadata inside [project quality checks](/docs/build/project-checks). Pass the name of the view you want to query (for example, `{{ info_schema('models') }}` to query models, or `{{ info_schema('edges') }}` to query DAG edges). dbt writes your project metadata to a local index at parse time, and checks query that index through `info_schema()`.

Each view exposes a set of columns you can select and filter on in your check SQL. For example, to find models without a description, query the `models` view and filter on the `description` column. To find models that depend on a forbidden source, query `edges` and filter on `parent_unique_id`. The [Views and columns reference](#views-and-columns-reference) below lists the columns available for each view.

Only views whose columns are fully populated at parse time are available. Passing a view name that doesn't exist or isn't available at parse time causes the check to fail with a message listing what is available. This is intentional &mdash; if dbt silently returned an empty table, the check would pass despite having checked nothing.

## Views and columns reference

The following lists the columns available in each view when querying with `{{ info_schema() }}`.

:::note
`group` is a SQL keyword. When querying any view that has a `group` column, write `"group"` (quoted) to avoid a parse error.
:::

### Node views

The `models`, `seeds`, `snapshots`, `functions`, `analyses`, `hooks`, and `checks` views share the following columns:

<Expandable alt_header="Shared node columns">

- `unique_id`
- `name`
- `resource_type`
- `package_name`
- `original_file_path`
- `fqn`
- `alias`
- `description`
- `node_language`
- `raw_code`
- `database_name`
- `schema_name`
- `relation_name`
- `identifier`
- `enabled`
- `materialized`
- `config`
- `access`
- `group`
- `contract_enforced`
- `version`
- `latest_version`
- `deprecation_date`
- `primary_key`
- `properties_yml_file_path`
- `tags`
- `meta`
- `ingested_at`

</Expandable>

`sources` includes the shared node columns above, plus:

<Expandable alt_header="sources (additional columns)">

- `source_name`
- `source_description`
- `loader`
- `loaded_at_field`

</Expandable>

### Other views

<Expandable alt_header="data_tests">

- `unique_id`
- `name`
- `package_name`
- `original_file_path`
- `fqn`
- `description`
- `database_name`
- `schema_name`
- `relation_name`
- `enabled`
- `materialized`
- `config`
- `tags`
- `meta`
- `group`
- `properties_yml_file_path`
- `test_name`
- `test_definition_package`
- `arguments`
- `column_name`
- `node_unique_id`
- `severity`
- `warn_if`
- `error_if`
- `fail_calc`
- `store_failures`
- `store_failures_as`
- `ingested_at`

</Expandable>

<Expandable alt_header="unit_tests">

- `unique_id`
- `name`
- `model`
- `description`
- `package_name`
- `original_file_path`
- `fqn`
- `given`
- `expect`
- `overrides`
- `versions`
- `ingested_at`

</Expandable>

<Expandable alt_header="node_columns">

- `node_unique_id`
- `column_name`
- `data_type_declared`
- `description`
- `tags`
- `ingested_at`

</Expandable>

<Expandable alt_header="dag_nodes">

- `unique_id`
- `resource_type`
- `ingested_at`

</Expandable>

<Expandable alt_header="edges">

- `parent_unique_id`
- `child_unique_id`
- `ingested_at`

</Expandable>

<Expandable alt_header="macros">

- `unique_id`
- `name`
- `package_name`
- `original_file_path`
- `macro_sql`
- `description`
- `depends_on_macros`
- `arguments`
- `docs_show`
- `properties_yml_file_path`
- `meta`
- `created_at`
- `ingested_at`

</Expandable>

<Expandable alt_header="docs_blocks">

- `unique_id`
- `name`
- `package_name`
- `original_file_path`
- `content`
- `ingested_at`

</Expandable>

<Expandable alt_header="groups">

- `unique_id`
- `name`
- `description`
- `owner_name`
- `owner_email`
- `ingested_at`

</Expandable>

<Expandable alt_header="exposures">

- `unique_id`
- `name`
- `exposure_type`
- `label`
- `owner_name`
- `owner_email`
- `url`
- `maturity`
- `description`
- `package_name`
- `original_file_path`
- `fqn`
- `depends_on`
- `tags`
- `created_at`
- `ingested_at`

</Expandable>

<Expandable alt_header="metrics">

- `unique_id`
- `name`
- `label`
- `metric_type`
- `description`
- `package_name`
- `original_file_path`
- `fqn`
- `type_params`
- `metric_filter`
- `time_granularity`
- `input_metric_names`
- `group`
- `tags`
- `meta`
- `config`
- `created_at`
- `ingested_at`

</Expandable>

<Expandable alt_header="saved_queries">

- `unique_id`
- `name`
- `label`
- `description`
- `package_name`
- `original_file_path`
- `fqn`
- `query_params`
- `exports`
- `depends_on`
- `group`
- `tags`
- `created_at`
- `ingested_at`

</Expandable>

<Expandable alt_header="semantic_models">

- `unique_id`
- `name`
- `model`
- `label`
- `description`
- `fqn`
- `node_relation`
- `primary_entity`
- `defaults`
- `group`
- `created_at`
- `ingested_at`

</Expandable>

<Expandable alt_header="semantic_entities">

- `unique_id`
- `name`
- `entity_type`
- `description`
- `label`
- `entity_role`
- `expr`
- `ingested_at`

</Expandable>

<Expandable alt_header="semantic_measures">

- `unique_id`
- `name`
- `agg`
- `description`
- `label`
- `expr`
- `create_metric`
- `agg_time_dimension`
- `agg_params`
- `non_additive_dimension`
- `ingested_at`

</Expandable>

<Expandable alt_header="semantic_dimensions">

- `unique_id`
- `name`
- `dimension_type`
- `description`
- `label`
- `expr`
- `is_partition`
- `time_granularity`
- `validity_params`
- `ingested_at`

</Expandable>

<Expandable alt_header="time_spines">

- `unique_id`
- `primary_column`
- `primary_granularity`
- `custom_granularities`
- `node_relation`
- `ingested_at`

</Expandable>

<Expandable alt_header="project">

- `project_name`
- `dbt_version`
- `adapter_type`
- `git_sha`
- `git_branch`
- `git_uncommitted_changes`
- `ingested_at`

</Expandable>

<Expandable alt_header="packages">

- `package_name`
- `ingested_at`

</Expandable>

<Expandable alt_header="project_vars">

- `var_name`
- `var_value`
- `ingested_at`

</Expandable>

<Expandable alt_header="project_env_vars">

- `env_var_name`
- `ingested_at`

</Expandable>

## Unavailable views

The following views are not available. dbt raises an error if you pass them to `info_schema()`, and reports the list of available views:

- `nodes`: An internal index table. Use the per-resource-type views instead (for example, `models`, `sources`).
- `column_lineage`: Requires static analysis, so it is not available at parse time.
- `classifiers`, `semantic_relationships`: Not yet populated.
- Run results and other post-run data: Project checks run _before_ models execute, so post-run views are not available.
