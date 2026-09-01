---
title: "dbt information schema"
sidebar_label: "Information schema"
description: "The dbt information schema is a queryable artifact set at target/info_schema/ that exposes your project's metadata as relational tables."
id: "info-schema"
availability:
  engine: v2
  access: free
---

The dbt information schema is a set of standard tables that provide information about all of the resources in your dbt project. Instead of parsing `manifest.json`, you can query your project metadata using SQL &mdash; the same way you'd query a database's system tables.

dbt writes the information schema to `target/info_schema/` in a versioned subdirectory (currently `v1/`) as standard [Parquet](https://parquet.apache.org/) files. The versioned subdirectory only increments on breaking schema changes (for example, when a column is removed or retyped). The Parquet files are organized across three SQL namespaces: `dbt`, `dbt_rt`, and `dbt_internal`.

You can query the files with any Parquet-compatible tool. dbt also generates a `views.sql` file alongside the Parquet files for convenient querying with [DuckDB](https://duckdb.org/).

## Generating the information schema

Use `--generate-info-schema` with `dbt build`, `dbt run`, `dbt compile`, or `dbt parse`:

```shell
dbt build --generate-info-schema
dbt run --generate-info-schema
dbt compile --generate-info-schema
dbt parse --generate-info-schema
```

For [`dbt compile`](/reference/commands/compile), combine with [`--static-analysis strict`](/docs/build/about-static-analysis) to also populate column types and column-level lineage in `dbt.node_columns` and `dbt.column_lineage`:

```shell
dbt compile --generate-info-schema --static-analysis strict
```

For [`dbt parse`](/reference/commands/parse), the information schema is structural only &mdash; no column types, no lineage, and no runtime results, because `dbt parse` doesn't connect to your warehouse.

## Querying the information schema

The information schema uses standard Parquet files; you can query them with any Parquet-compatible tool.

dbt also generates a `views.sql` file alongside the Parquet files. This file is DuckDB-specific; it registers all tables as named views so you can query them directly:

```shell
# views.sql uses relative paths — run from within the versioned directory
cd target/info_schema/v1
duckdb -cmd ".read views.sql" -c "select * from dbt.models limit 5"
```

## Tables

The information schema contains tables across three namespaces.

- [`dbt`](#dbt-namespace)
- [`dbt_rt`](#dbt_rt-namespace)
- [`dbt_internal`](#dbt_internal-namespace)

### `dbt` namespace

The `dbt` namespace contains tables describing your project's structure, resources, and configuration.

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

The `dbt_rt` namespace contains tables and views with runtime execution data.

| Table | Description |
|-------|-------------|
| `dbt_rt.invocations` | One row per dbt invocation |
| `dbt_rt.run_results` | Results for each node in each invocation |
| `dbt_rt.run_results_latest` | View of the most recent run result per node |
| `dbt_rt.source_freshness` | Source freshness check results |
| `dbt_rt.diagnostics` | Diagnostic data from invocations |
| `dbt_rt.adapter_queries` | Adapter queries issued during invocations |

### `dbt_internal` namespace

The `dbt_internal` namespace contains internal implementation tables that are not part of the public contract. Their schema may change without notice.

| Table | Description |
|-------|-------------|
| `dbt_internal.node_input_files` | Internal record of input files per node |


## Related

- [dbt artifacts](/reference/artifacts/dbt-artifacts)
- [`dbt build`](/reference/commands/build)
- [`dbt run`](/reference/commands/run)
- [`dbt compile`](/reference/commands/compile)
- [`dbt parse`](/reference/commands/parse)
