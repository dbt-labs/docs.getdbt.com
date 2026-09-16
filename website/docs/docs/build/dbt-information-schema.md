---
title: "dbt Information Schema"
sidebar_label: "About dbt Information Schema"
description: "The dbt Information Schema is a contracted interface into your dbt project metadata."
id: "dbt-information-schema"
availability:
  engine: v2
  access: free
---

The dbt Information Schema is a contracted interface into the metadata for all of the resources in your dbt project. It takes the form of [Parquet](https://parquet.apache.org/) artifacts, which are more performant than JSON artifacts. For example, a project with a `manifest.json` and `catalog.json` that total ~70 MB has an Information Schema of only ~5 MB. It also includes intermediate views that you can query with `dbt show`. You can also query the Information Schema from SQL you write in your checks.

When you use the [`--generate-info-schema`](#generating-the-information-schema) flag, dbt writes the Information Schema to `target/info_schema/` in a versioned subdirectory (for example, `target/info_schema/v1/`) as standard Parquet files. The metadata available in the schema grows with each step: parsing produces basic metadata, compiling adds column types and column-level lineage (with `--static-analysis strict`), and running or building populates runtime results.

For the full list of tables and their descriptions, refer to the [Information Schema tables](/reference/info-schema).

Rather than parsing `manifest.json`, you can query your project metadata using SQL. Use [`dbt show --inline`](#querying-with-dbt-show) to run SQL queries against the Information Schema directly from the CLI, or [`dbt show --info`](#querying-with-dbt-show) to query a view by name. You can also point any Parquet-compatible tool (for example, Pandas or Polars) directly at the files. 

## Generating the Information Schema

Use the `--generate-info-schema` flag with `dbt build`, `dbt run`, `dbt compile`, or `dbt parse`.

- To populate column types and column-level lineage in `dbt.node_columns` and `dbt.column_lineage`, combine [`dbt build`](/reference/commands/build), [`dbt run`](/reference/commands/run), or [`dbt compile`](/reference/commands/compile) with [`--static-analysis strict`](/docs/build/about-static-analysis). Without it, `dbt.node_columns` and `dbt.column_lineage` contain no column types and no lineage.

  ```shell
  dbt build --generate-info-schema --static-analysis strict
  ```

- For [`dbt parse`](/reference/commands/parse), the Information Schema contains no column types, no lineage, and no runtime results, because `dbt parse` doesn't connect to your warehouse.

### Overriding the output directory

Use `--info-schema-dir` to write the Information Schema to a custom directory. The versioned subdirectory (`v1/`) is still appended under whatever directory you set.

```shell
dbt build --generate-info-schema --info-schema-dir /tmp/my_schema
# writes to /tmp/my_schema/v1/
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

## Using the Information Schema in checks

[Checks](/docs/build/checks) use the [`{{ info_schema() }}`](/reference/dbt-jinja-functions/info-schema-macro) macro to query the dbt Information Schema at parse time. To use it, set the `info_schema` version in `dbt_project.yml`. Currently, `1` is the only available version.

```yaml
info_schema:
  version: 1
```

You can find the schema version in the versioned subdirectory name (for example, `target/info_schema/v1/`). The version only increments on breaking schema changes (for example, when a column is removed or retyped).

## Related docs
- [Information Schema tables](/reference/info-schema)
- [`dbt build`](/reference/commands/build)
- [`dbt run`](/reference/commands/run)
- [`dbt compile`](/reference/commands/compile)
- [`dbt parse`](/reference/commands/parse)
