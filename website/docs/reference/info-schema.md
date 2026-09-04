---
title: "dbt Information Schema"
sidebar_label: "Information Schema"
description: "The dbt Information Schema is a queryable artifact set at target/info_schema/ that exposes your project's metadata as relational tables."
id: "info-schema"
availability:
  engine: v2
  access: free
---

The dbt Information Schema is a set of standard tables that provide information about all of the resources in your dbt project. Instead of parsing `manifest.json`, you can query your project metadata using SQL &mdash; the same way you'd query a database's system tables.

dbt writes the Information Schema to `target/info_schema/` in a versioned subdirectory (currently `v1/`) as standard [Parquet](https://parquet.apache.org/) files. The versioned subdirectory only increments on breaking schema changes (for example, when a column is removed or retyped). The Parquet files are organized across three SQL namespaces: `dbt`, `dbt_rt`, and `dbt_internal`. 

You can query the files with any Parquet-compatible tool. dbt also generates a `views.sql` file alongside the Parquet files for convenient querying with [DuckDB](https://duckdb.org/).

## Generating the Information Schema

Use `--generate-info-schema` with `dbt build`, `dbt run`, `dbt compile`, or `dbt parse`:

```shell
dbt build --generate-info-schema
dbt run --generate-info-schema
dbt compile --generate-info-schema
dbt parse --generate-info-schema
```

- To populate column types and column-level lineage in `dbt.node_columns` and `dbt.column_lineage`, combine [`dbt build`](/reference/commands/build), [`dbt run`](/reference/commands/run), or [`dbt compile`](/reference/commands/compile) with [`--static-analysis strict`](/docs/build/about-static-analysis). Without it, `dbt.node_columns` and `dbt.column_lineage` are structural only and dbt emits a warning.

  ```shell
  dbt build --generate-info-schema --static-analysis strict
  ```

- For [`dbt parse`](/reference/commands/parse), the Information Schema is structural only &mdash; no column types, no lineage, and no runtime results, because `dbt parse` doesn't connect to your warehouse.

`--generate-info-schema` also automatically enables partial parse; the Information Schema is built from the metadata dbt writes during the invocation.

### Overriding the output directory

Use `--info-schema-dir` (env var: `DBT_INFO_SCHEMA_DIR`) to write the Information Schema to a custom directory. The versioned subdirectory (`v1/`) is still appended under whatever directory you set.

### Checking the schema version

To check which schema version you're on, query `dbt.project.schema_version`. The version is also embedded in each Parquet file's metadata under `dbt:info-schema-version`.

## Querying the Information Schema

### Querying with `dbt show`

Use `dbt show --info <view>` to query a specific Information Schema view directly from the CLI:

```shell
dbt show --info models
dbt show --info models --format json --limit 20
```

`--info <view>` is equivalent to `--inline "select * from {{ info_schema('<view>') }}"` and queries `target/info_schema/`. It does not connect to your warehouse.

You can also use `--inline` SQL that calls `{{ info_schema() }}` directly:

```shell
dbt show --inline "select name from {{ info_schema('models') }} order by name"
```

### Querying with external tools

You can query the Parquet files with any Parquet-compatible tool.

**DuckDB:** dbt generates a `views.sql` file alongside the Parquet files that registers all tables as named views. Navigate to the versioned directory and start a DuckDB session with the views loaded:

```shell
cd target/info_schema/v1
duckdb -cmd ".read views.sql"
```

Then query any table by namespace and table name:

```sql
select * from dbt.models limit 5;
select * from dbt_rt.run_results where status = 'error';
```

**Other Parquet-compatible tools:** Point your tool directly at the Parquet files in `target/info_schema/v1/`. For example, with pandas:

```python
import pandas as pd
models = pd.read_parquet("target/info_schema/v1/dbt.models.parquet")
```

## Tables

The Information Schema contains tables across three namespaces.

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

The `dbt_internal` namespace contains internal implementation tables. Unlike `dbt` and `dbt_rt`, the tables' schema may change without notice.

| Table | Description |
|-------|-------------|
| `dbt_internal.node_input_files` | Internal record of input files per node |

Note that `dbt_internal` tables are not accessible using `dbt show --info` or `{{ info_schema() }}`. You can query them by pointing a Parquet-compatible tool directly at the files in `target/info_schema/v1`.


## Related

- [dbt artifacts](/reference/artifacts/dbt-artifacts)
- [`dbt build`](/reference/commands/build)
- [`dbt run`](/reference/commands/run)
- [`dbt compile`](/reference/commands/compile)
- [`dbt parse`](/reference/commands/parse)
