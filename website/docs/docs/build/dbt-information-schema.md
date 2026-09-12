---
title: "dbt Information Schema"
sidebar_label: "About dbt Information Schema"
description: "The dbt Information Schema is a contracted interface into your dbt project metadata."
id: "dbt-information-schema"
availability:
  engine: v2
  access: free
---

The dbt Information Schema is a set of standard tables that provide information about all of the resources in your dbt project. It uses the [Parquet](https://parquet.apache.org/) format, which is significantly more compact than JSON artifacts. For example, a project whose `manifest.json` and `catalog.json` total ~70 MB has an Information Schema of only ~5 MB.

When you use the [`--generate-info-schema`](#generating-the-information-schema) flag, dbt writes the Information Schema to `target/info_schema/` in a versioned subdirectory (currently `v1/`) as standard Parquet files. The versioned subdirectory only increments on breaking schema changes (for example, when a column is removed or retyped). The metadata available in the schema grows with each step: parsing produces metadata without column types, lineage, or runtime results, compiling adds column types and lineage (with `--static-analysis strict`), and running or building populates runtime results.

The Information Schema contains tables across the `dbt` and `dbt_rt` namespaces. For the full list of tables and their descriptions, refer to the [Information Schema tables](/reference/info-schema).

Rather than parsing `manifest.json`, you can query your project metadata using SQL &mdash; the same way you'd query a database's system tables. Use [`dbt show --inline`](#querying-with-dbt-show) to run SQL queries against the Information Schema directly from the CLI, or [`dbt show --info`](#querying-with-dbt-show) to query a view by name without writing SQL. You can also point any Parquet-compatible tool (for example, Pandas or Polars) directly at the files. For convenient querying with [DuckDB](https://duckdb.org/), dbt also generates a `views.sql` file alongside the Parquet files.

## Generating the Information Schema

Use the `--generate-info-schema` flag with `dbt build`, `dbt run`, `dbt compile`, or `dbt parse`:

```shell
dbt build --generate-info-schema
dbt run --generate-info-schema
dbt compile --generate-info-schema
dbt parse --generate-info-schema
```

- To populate column types and column-level lineage in `dbt.node_columns` and `dbt.column_lineage`, combine [`dbt build`](/reference/commands/build), [`dbt run`](/reference/commands/run), or [`dbt compile`](/reference/commands/compile) with [`--static-analysis strict`](/docs/build/about-static-analysis). Without it, `dbt.node_columns` and `dbt.column_lineage` contain no column types and no lineage. When using `dbt compile`, dbt also emits a warning.

  ```shell
  dbt build --generate-info-schema --static-analysis strict
  ```

- For [`dbt parse`](/reference/commands/parse), the Information Schema contains no column types, no lineage, and no runtime results, because `dbt parse` doesn't connect to your warehouse.

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

You can find the schema version in the versioned subdirectory name (for example, `target/info_schema/v1/`).

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
