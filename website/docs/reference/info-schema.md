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

The `dbt_rt` namespace tables and views contain runtime execution data.

| Table | Description |
|-------|-------------|
| `dbt_rt.invocations` | One row per dbt invocation |
| `dbt_rt.run_results` | Results for each node in each invocation |
| `dbt_rt.run_results_latest` | View of the most recent run result per node |
| `dbt_rt.relations` | Warehouse catalog data for each materialized relation (populated with `--write-catalog`) |
| `dbt_rt.freshness` | Freshness check results for sources and models; `resource_type` indicates whether a row is a `source` or `model` |
| `dbt_rt.diagnostics` | Diagnostic data from invocations |
| `dbt_rt.adapter_queries` | Adapter queries issued during invocations |


## Related

- [dbt Information Schema](/docs/build/dbt-information-schema)
