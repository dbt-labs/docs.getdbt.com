---
title: "dbt Information Schema tables"
sidebar_label: "Information Schema tables"
description: "Reference for all tables available in the dbt Information Schema, organized by namespace."
id: "info-schema"
availability:
  engine: v2
  access: free
---

For an overview of the dbt Information Schema, how to generate it, and how to query it, refer to [dbt Information Schema](/docs/build/dbt-information-schema).

The dbt Information Schema materializes your project metadata as Parquet files under `target/info_schema/v1/`. You can query these same tables at parse time using the [`{{ info_schema() }}`](/reference/dbt-jinja-functions/info-schema-macro) macro &mdash; for example, when writing [checks](/docs/build/checks). Refer to [Columns available for checks](#columns-available-for-checks) to know which columns are accessible.

## Tables

The following tables reflect dbt Information Schema v1, written to `target/info_schema/v1/`. The version only increments on breaking schema changes (for example, when a column is removed or retyped).

The Information Schema generates tables across the following namespaces.

- [`dbt`](#dbt-namespace)
- [`dbt_rt`](#dbt_rt-namespace)

### `dbt` namespace

The `dbt` namespace tables contain information about your project's structure, resources, and configuration.

| Table | Description |
|-------|-------------|
| `dbt.dag_nodes` | All DAG participants with `unique_id` and `resource_type` |
| `dbt.project` | Project-level metadata |
| `dbt.packages` | Installed packages, one row per package |
| `dbt.project_vars` | Project variables, one row per (project scope, variable name) |
| `dbt.project_env_vars` | Environment variables used in the project |
| `dbt.models` | All models |
| `dbt.seeds` | All seeds |
| `dbt.sources` | All sources |
| `dbt.snapshots` | All snapshots |
| `dbt.functions` | All user-defined functions |
| `dbt.analyses` | All analyses |
| `dbt.hooks` | All `on-run-start` and `on-run-end` hook operations |
| `dbt.checks` | All checks |
| `dbt.data_tests` | All data tests (generic and singular) |
| `dbt.unit_tests` | All unit tests |
| `dbt.macros` | All macros |
| `dbt.groups` | All groups |
| `dbt.exposures` | All exposures |
| `dbt.metrics` | All metrics |
| `dbt.docs_blocks` | All docs blocks |
| `dbt.saved_queries` | All saved queries |
| `dbt.semantic_models` | All semantic models |
| `dbt.semantic_entities` | Semantic model entities |
| `dbt.semantic_measures` | Semantic model measures |
| `dbt.semantic_dimensions` | Semantic model dimensions |
| `dbt.semantic_relationships` | Relationships between semantic models |
| `dbt.time_spines` | Time spine definitions |
| `dbt.classifiers` | Resource classifiers |
| `dbt.edges` | DAG edges (parent → child) |
| `dbt.node_columns` | Column names, types, and descriptions for all nodes |
| `dbt.column_lineage` | Column-level lineage (populated with `--static-analysis strict`) |

### `dbt_rt` namespace

The `dbt_rt` namespace tables contain runtime execution data. These tables are not available for parse-time checks.

| Table | Description |
|-------|-------------|
| `dbt_rt.invocations` | One row per dbt invocation |
| `dbt_rt.run_results` | Results for each node in each invocation |
| `dbt_rt.run_results_latest` | View of the most recent run result per node |
| `dbt_rt.relations` | Warehouse catalog data for each materialized relation (populated with `--write-catalog`) |
| `dbt_rt.freshness` | Freshness check results for sources and models; `resource_type` indicates whether a row is a `source` or `model` |
| `dbt_rt.diagnostics` | Diagnostic data from invocations |
| `dbt_rt.adapter_queries` | Adapter queries issued during invocations |

## Columns available for checks

When you query a table in the Information Schema through the `{{ info_schema() }}` macro, dbt exposes it as a _view_ &mdash; the same table name, but with only a subset of columns available: those that are resolved at parse time. The full table (in `target/info_schema/v1/`) may contain additional columns. Use the view name (without the `dbt.` prefix) as the argument to the macro.

| View | Columns |
|------|---------|
| `models` | `unique_id`, `name`, `resource_type`, `package_name`, `original_file_path`, `fqn`, `alias`, `description`, `node_language`, `database_name`, `schema_name`, `relation_name`, `identifier`, `enabled`, `materialized`, `config`, `access`, `group`, `contract_enforced`, `version`, `latest_version`, `deprecation_date`, `primary_key`, `properties_yml_file_path`, `tags`, `meta`, `ingested_at` |
| `seeds` | `unique_id`, `name`, `resource_type`, `package_name`, `original_file_path`, `fqn`, `alias`, `description`, `node_language`, `database_name`, `schema_name`, `relation_name`, `identifier`, `enabled`, `materialized`, `config`, `access`, `group`, `contract_enforced`, `version`, `latest_version`, `deprecation_date`, `primary_key`, `properties_yml_file_path`, `tags`, `meta`, `ingested_at` |
| `snapshots` | `unique_id`, `name`, `resource_type`, `package_name`, `original_file_path`, `fqn`, `alias`, `description`, `node_language`, `database_name`, `schema_name`, `relation_name`, `identifier`, `enabled`, `materialized`, `config`, `access`, `group`, `contract_enforced`, `version`, `latest_version`, `deprecation_date`, `primary_key`, `properties_yml_file_path`, `tags`, `meta`, `raw_code`, `ingested_at` |
| `functions` | `unique_id`, `name`, `resource_type`, `package_name`, `original_file_path`, `fqn`, `alias`, `description`, `node_language`, `database_name`, `schema_name`, `relation_name`, `identifier`, `enabled`, `materialized`, `config`, `access`, `group`, `contract_enforced`, `version`, `latest_version`, `deprecation_date`, `primary_key`, `properties_yml_file_path`, `tags`, `meta`, `raw_code`, `ingested_at` |
| `analyses` | `unique_id`, `name`, `resource_type`, `package_name`, `original_file_path`, `fqn`, `alias`, `description`, `node_language`, `database_name`, `schema_name`, `relation_name`, `identifier`, `enabled`, `materialized`, `config`, `access`, `group`, `contract_enforced`, `version`, `latest_version`, `deprecation_date`, `primary_key`, `properties_yml_file_path`, `tags`, `meta`, `raw_code`, `ingested_at` |
| `hooks` | `unique_id`, `name`, `resource_type`, `package_name`, `original_file_path`, `fqn`, `alias`, `description`, `node_language`, `database_name`, `schema_name`, `relation_name`, `identifier`, `enabled`, `materialized`, `config`, `access`, `group`, `contract_enforced`, `version`, `latest_version`, `deprecation_date`, `primary_key`, `properties_yml_file_path`, `tags`, `meta`, `raw_code`, `ingested_at` |
| `checks` | `unique_id`, `name`, `resource_type`, `package_name`, `original_file_path`, `fqn`, `alias`, `description`, `node_language`, `database_name`, `schema_name`, `relation_name`, `identifier`, `enabled`, `materialized`, `config`, `access`, `group`, `contract_enforced`, `version`, `latest_version`, `deprecation_date`, `primary_key`, `properties_yml_file_path`, `tags`, `meta`, `raw_code`, `ingested_at` |
| `sources` | `unique_id`, `name`, `resource_type`, `package_name`, `original_file_path`, `fqn`, `alias`, `description`, `node_language`, `database_name`, `schema_name`, `relation_name`, `identifier`, `enabled`, `materialized`, `config`, `access`, `group`, `contract_enforced`, `version`, `latest_version`, `deprecation_date`, `primary_key`, `properties_yml_file_path`, `tags`, `meta`, `source_name`, `source_description`, `loader`, `loaded_at_field`, `ingested_at` |
| `data_tests` | `unique_id`, `name`, `package_name`, `original_file_path`, `fqn`, `description`, `database_name`, `schema_name`, `relation_name`, `enabled`, `materialized`, `config`, `tags`, `meta`, `group`, `properties_yml_file_path`, `test_name`, `test_definition_package`, `arguments`, `column_name`, `node_unique_id`, `severity`, `warn_if`, `error_if`, `fail_calc`, `store_failures`, `store_failures_as`, `ingested_at` |
| `unit_tests` | `unique_id`, `name`, `model`, `description`, `package_name`, `original_file_path`, `fqn`, `given`, `expect`, `overrides`, `versions`, `ingested_at` |
| `node_columns` | `node_unique_id`, `column_name`, `data_type_declared`, `description`, `tags`, `ingested_at` |
| `dag_nodes` | `unique_id`, `resource_type`, `ingested_at` — one row per enabled resource that participates in the DAG, including exposures, metrics, and unit tests |
| `edges` | `parent_unique_id`, `child_unique_id`, `ingested_at` |
| `macros` | `unique_id`, `name`, `package_name`, `original_file_path`, `macro_sql`, `description`, `depends_on_macros`, `arguments`, `docs_show`, `properties_yml_file_path`, `meta`, `created_at`, `ingested_at` |
| `docs_blocks` | `unique_id`, `name`, `package_name`, `original_file_path`, `content`, `ingested_at` |
| `groups` | `unique_id`, `name`, `description`, `owner_name`, `owner_email`, `ingested_at` |
| `exposures` | `unique_id`, `name`, `exposure_type`, `label`, `owner_name`, `owner_email`, `url`, `maturity`, `description`, `package_name`, `original_file_path`, `fqn`, `depends_on`, `tags`, `created_at`, `ingested_at` |
| `metrics` | `unique_id`, `name`, `label`, `metric_type`, `description`, `package_name`, `original_file_path`, `fqn`, `type_params`, `metric_filter`, `time_granularity`, `input_metric_names`, `group`, `tags`, `meta`, `config`, `created_at`, `ingested_at` |
| `saved_queries` | `unique_id`, `name`, `label`, `description`, `package_name`, `original_file_path`, `fqn`, `query_params`, `exports`, `depends_on`, `group`, `tags`, `created_at`, `ingested_at` |
| `semantic_models` | `unique_id`, `name`, `model`, `label`, `description`, `fqn`, `node_relation`, `primary_entity`, `defaults`, `group`, `created_at`, `ingested_at` |
| `semantic_entities` | `unique_id`, `name`, `entity_type`, `description`, `label`, `entity_role`, `expr`, `ingested_at` |
| `semantic_measures` | `unique_id`, `name`, `agg`, `description`, `label`, `expr`, `create_metric`, `agg_time_dimension`, `agg_params`, `non_additive_dimension`, `ingested_at` |
| `semantic_dimensions` | `unique_id`, `name`, `dimension_type`, `description`, `label`, `expr`, `is_partition`, `time_granularity`, `validity_params`, `ingested_at` |
| `time_spines` | `unique_id`, `primary_column`, `primary_granularity`, `custom_granularities`, `node_relation`, `ingested_at` |
| `project` | `project_name`, `dbt_version`, `adapter_type`, `git_sha`, `git_branch`, `git_uncommitted_changes`, `ingested_at` |
| `packages` | `package_name`, `ingested_at` |
| `project_vars` | `project_name`, `var_name`, `var_value`, `ingested_at` — a package-scoped var appears on that package's `project_name` |
| `project_env_vars` | `env_var_name`, `ingested_at` |

## Related docs

- [dbt Information Schema](/docs/build/dbt-information-schema)
- [Checks](/docs/build/checks)
