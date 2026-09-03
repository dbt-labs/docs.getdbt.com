---
title: "Views and columns reference"
sidebar_label: "Views and columns"
id: "info-schema-views"
description: "Column reference for all views available through the info_schema() macro in project quality checks."
availability:
  engine: v2
---

Each view mirrors a table of the same name in the [dbt Information Schema](/reference/info-schema), showing only the columns that are final at parse time. Use these views in [`{{ info_schema() }}`](/reference/dbt-jinja-functions/info-schema) when writing [project quality checks](/docs/build/project-checks).

| View | Columns |
|------|---------|
| `models` | `unique_id`, `name`, `resource_type`, `package_name`, `original_file_path`, `fqn`, `alias`, `description`, `node_language`, `raw_code`, `database_name`, `schema_name`, `relation_name`, `identifier`, `enabled`, `materialized`, `config`, `access`, `group`, `contract_enforced`, `version`, `latest_version`, `deprecation_date`, `primary_key`, `properties_yml_file_path`, `tags`, `meta`, `ingested_at` |
| `seeds` | `unique_id`, `name`, `resource_type`, `package_name`, `original_file_path`, `fqn`, `alias`, `description`, `node_language`, `raw_code`, `database_name`, `schema_name`, `relation_name`, `identifier`, `enabled`, `materialized`, `config`, `access`, `group`, `contract_enforced`, `version`, `latest_version`, `deprecation_date`, `primary_key`, `properties_yml_file_path`, `tags`, `meta`, `ingested_at` |
| `snapshots` | `unique_id`, `name`, `resource_type`, `package_name`, `original_file_path`, `fqn`, `alias`, `description`, `node_language`, `raw_code`, `database_name`, `schema_name`, `relation_name`, `identifier`, `enabled`, `materialized`, `config`, `access`, `group`, `contract_enforced`, `version`, `latest_version`, `deprecation_date`, `primary_key`, `properties_yml_file_path`, `tags`, `meta`, `ingested_at` |
| `functions` | `unique_id`, `name`, `resource_type`, `package_name`, `original_file_path`, `fqn`, `alias`, `description`, `node_language`, `raw_code`, `database_name`, `schema_name`, `relation_name`, `identifier`, `enabled`, `materialized`, `config`, `access`, `group`, `contract_enforced`, `version`, `latest_version`, `deprecation_date`, `primary_key`, `properties_yml_file_path`, `tags`, `meta`, `ingested_at` |
| `analyses` | `unique_id`, `name`, `resource_type`, `package_name`, `original_file_path`, `fqn`, `alias`, `description`, `node_language`, `raw_code`, `database_name`, `schema_name`, `relation_name`, `identifier`, `enabled`, `materialized`, `config`, `access`, `group`, `contract_enforced`, `version`, `latest_version`, `deprecation_date`, `primary_key`, `properties_yml_file_path`, `tags`, `meta`, `ingested_at` |
| `hooks` | `unique_id`, `name`, `resource_type`, `package_name`, `original_file_path`, `fqn`, `alias`, `description`, `node_language`, `raw_code`, `database_name`, `schema_name`, `relation_name`, `identifier`, `enabled`, `materialized`, `config`, `access`, `group`, `contract_enforced`, `version`, `latest_version`, `deprecation_date`, `primary_key`, `properties_yml_file_path`, `tags`, `meta`, `ingested_at` |
| `checks` | `unique_id`, `name`, `resource_type`, `package_name`, `original_file_path`, `fqn`, `alias`, `description`, `node_language`, `raw_code`, `database_name`, `schema_name`, `relation_name`, `identifier`, `enabled`, `materialized`, `config`, `access`, `group`, `contract_enforced`, `version`, `latest_version`, `deprecation_date`, `primary_key`, `properties_yml_file_path`, `tags`, `meta`, `ingested_at` |
| `sources` | `unique_id`, `name`, `resource_type`, `package_name`, `original_file_path`, `fqn`, `alias`, `description`, `node_language`, `raw_code`, `database_name`, `schema_name`, `relation_name`, `identifier`, `enabled`, `materialized`, `config`, `access`, `group`, `contract_enforced`, `version`, `latest_version`, `deprecation_date`, `primary_key`, `properties_yml_file_path`, `tags`, `meta`, `source_name`, `source_description`, `loader`, `loaded_at_field`, `ingested_at` |
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
| `project_vars` | `var_name`, `var_value`, `ingested_at` |
| `project_env_vars` | `env_var_name`, `ingested_at` |

:::note
The following views are not available to checks. dbt raises an error if you pass them to `info_schema()`, and reports the list of available views.

- `nodes`: An internal index table. Use the per-resource-type views instead (for example, `models`, `sources`).
- `column_lineage`: Requires static analysis, so it is not available at parse time.
- `classifiers`, `semantic_relationships`: Not yet populated.
:::
