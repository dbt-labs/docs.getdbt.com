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

## Tables

The Information Schema generates tables across three namespaces.

- [`dbt`](#dbt-namespace)
- [`dbt_rt`](#dbt_rt-namespace)
- [`dbt_internal`](#dbt_internal-namespace)

### `dbt` namespace

The `dbt` namespace tables contain information about your project's structure, resources, and configuration.

| Table | Description |
|-------|-------------|
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
| `dbt.data_tests` | All data tests (generic and singular), with test-specific detail columns |
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
| `dbt.dag_nodes` | All DAG participants with `unique_id` and `resource_type` |
| `dbt.edges` | DAG edges (parent → child) |
| `dbt.node_columns` | Column-level metadata for all nodes |
| `dbt.column_lineage` | Column-level lineage (populated with `--static-analysis strict`) |

### `dbt_rt` namespace

The `dbt_rt` namespace tables and views contain runtime execution data.

| Table | Description |
|-------|-------------|
| `dbt_rt.invocations` | One row per dbt invocation |
| `dbt_rt.run_results` | Results for each node in each invocation |
| `dbt_rt.run_results_latest` | View of the most recent run result per node |
| `dbt_rt.freshness` | Freshness check results for sources and models; `resource_type` indicates whether a row is a `source` or `model` |
| `dbt_rt.diagnostics` | Diagnostic data from invocations |
| `dbt_rt.adapter_queries` | Adapter queries issued during invocations |

### `dbt_internal` namespace

The `dbt_internal` namespace contains internal implementation tables. Unlike `dbt` and `dbt_rt`, the tables' schema may change without notice.

| Table | Description |
|-------|-------------|
| `dbt_internal.node_input_files` | Internal record of input files per node |

Note that `dbt_internal` tables are not accessible using `dbt show --info` or `{{ info_schema() }}`. You can query them by pointing a Parquet-compatible tool directly at the files in `target/info_schema/v1`.


## Related

- [dbt Information Schema](/docs/build/dbt-information-schema)
