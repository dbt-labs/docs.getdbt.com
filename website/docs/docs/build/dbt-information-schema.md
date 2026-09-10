---
title: "dbt Information Schema"
sidebar_label: "About dbt Information Schema"
description: "The dbt Information Schema is a queryable artifact set at target/info_schema/ that exposes your project's metadata as relational tables."
id: "dbt-information-schema"
availability:
  engine: v2
  access: free
---

The dbt Information Schema is a set of standard tables that provide information about all of the resources in your dbt project. Rather than parsing `manifest.json`, you can query your project metadata using SQL &mdash; the same way you'd query a database's system tables.

dbt writes the Information Schema to `target/info_schema/` in a versioned subdirectory (currently `v1/`) as standard [Parquet](https://parquet.apache.org/) files. The versioned subdirectory only increments on breaking schema changes (for example, when a column is removed or retyped).

The Information Schema contains tables across three namespaces: `dbt`, `dbt_rt`, and `dbt_internal`. For the full list of tables and their descriptions, refer to the [Information Schema tables](/reference/info-schema).

You can query the files with any Parquet-compatible tool (for example, DuckDB, Pandas, or Polars). dbt also generates a `views.sql` file alongside the Parquet files for convenient querying with [DuckDB](https://duckdb.org/).

## Generating the Information Schema

Use the `--generate-info-schema` flag with `dbt build`, `dbt run`, `dbt compile`, or `dbt parse`:

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

```shell
dbt build --generate-info-schema --info-schema-dir /tmp/my_schema
# writes to /tmp/my_schema/v1/
```

Or with the environment variable:

```shell
DBT_INFO_SCHEMA_DIR=/tmp/my_schema dbt build --generate-info-schema
```

### Checking the schema version

To check which schema version you're on, query the `schema_version` column from the `dbt.project` table. The version is also embedded in each Parquet file's metadata under `dbt:info-schema-version`.

```shell
dbt show --info project
```

Or to query just the version:

```shell
dbt show --inline "select schema_version from {{ info_schema('project') }}"
```

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

**Parquet-compatible tools:** Point your tool directly at the Parquet files in `target/info_schema/v1/`. For example, with pandas:

```python
import pandas as pd
models = pd.read_parquet("target/info_schema/v1/dbt.models.parquet")
```

**DuckDB:** dbt generates a DuckDB-specific `views.sql` file alongside the Parquet files that registers all tables as named views. Navigate to the versioned directory and start a DuckDB session with the views loaded:

```shell
cd target/info_schema/v1
duckdb -cmd ".read views.sql"
```

Then query any table by namespace and table name:

```sql
select * from dbt.models limit 5;
select * from dbt_rt.run_results where status = 'error';
```


## Related docs
- [Information Schema tables](/reference/info-schema)
- [`dbt build`](/reference/commands/build)
- [`dbt run`](/reference/commands/run)
- [`dbt compile`](/reference/commands/compile)
- [`dbt parse`](/reference/commands/parse)
