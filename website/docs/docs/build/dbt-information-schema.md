---
title: "dbt Information Schema"
sidebar_label: "About dbt Information Schema"
description: "The dbt Information Schema is a contracted interface into your dbt project metadata."
id: "dbt-information-schema"
availability:
  engine: v2
  access: free
---


The dbt Information Schema is a contracted interface into your project’s metadata. You can query it using SQL with [`dbt show`](#querying-with-dbt-show) or in your [checks](#using-the-information-schema-in-checks).

The metadata is stored as [Parquet](https://parquet.apache.org/) files, which are more compact and efficient to query than JSON artifacts. For example, a project whose `manifest.json` and `catalog.json` total ~70 MB has an Information Schema of ~5 MB.

The Information Schema doesn't use warehouse compute to build or to query it. dbt writes the files from its internal project metadata, using an embedded DuckDB engine that runs inside the dbt process. You don't need to install, configure, or manage DuckDB to use the Information Schema.

When you use the [`--generate-info-schema`](#generating-the-information-schema) flag, dbt writes these files to a versioned directory, such as `target/info_schema/v1/`. The available metadata grows as dbt processes your project:

- Parsing provides basic project metadata
- Compiling adds model column types and column-level lineage (with `--static-analysis strict`)
- Running or building adds runtime results

Use `dbt show --inline` to run SQL queries or `dbt show --info` to query a view by name. You can also read the files with Parquet-compatible tools such as Pandas or Polars.

For available tables and their descriptions, see [Information Schema tables](/reference/info-schema).

<Constant name="wizard" /> also uses the Information Schema to understand your project. Refer to [How <Constant name="wizard" /> works](/docs/dbt-ai/wizard-how-it-works#dbt-information-schema) to learn more.

## Generating the Information Schema

Use `--generate-info-schema` or `DBT_ENGINE_GENERATE_INFO_SCHEMA=true` with `dbt build`, `dbt run`, `dbt compile`, or `dbt parse`. By default, the `dbt.node_columns` table contains only YAML-declared columns for both models and sources.

- To include inferred model column types and column-level lineage, add `--static-analysis strict`:

  ```shell
  dbt build --generate-info-schema --static-analysis strict
  ```

  With this flag, dbt infers column types from your model SQL. Source columns are still limited to what's declared in YAML.

- To include warehouse column types and all columns from sources used by the selected nodes, add [`--write-catalog`](/reference/commands/cmd-docs#--write-catalog-flag) on `dbt build` or `dbt run`:

  ```shell
  dbt build --generate-info-schema --write-catalog
  dbt build --generate-info-schema --static-analysis strict --write-catalog # to get inferred model column types and column-level lineage
  ```

- For [`dbt parse`](/reference/commands/parse), the Information Schema contains no column types, no lineage, and no runtime results, because `dbt parse` doesn't connect to your warehouse.

- `dbt show` reads your project's metadata directly, so you don't need to generate anything before using the command. Use `--generate-info-schema` when you want to export the Parquet files to disk (for example, to read them with [external tools](#querying-with-external-tools)).

### Schema directory

The Information Schema Parquet files live in a versioned subdirectory under your project's `target/info_schema/` directory (or wherever you've set with [`--info-schema-dir`](#overriding-the-output-directory)). They aren't stored in your data warehouse.

#### Overriding the output directory

Use `--info-schema-dir` or `DBT_ENGINE_INFO_SCHEMA_DIR` to write the Information Schema to a custom directory. The versioned subdirectory (`v1/`) is still appended under whatever directory you set.

```shell
dbt build --generate-info-schema --info-schema-dir /tmp/my_schema
# writes to /tmp/my_schema/v1/
```

## Querying the Information Schema

You can query the Information Schema locally with `dbt show` or any Parquet-compatible tool.

### Querying with `dbt show`

Use `dbt show --info <view>` to query a view directly from the CLI:

```shell
dbt show --info models
dbt show --info models --format json --limit 20
```

This queries the intermediate views directly, without connecting to your warehouse. `--info <view>` is equivalent to `--inline "select * from {{ info_schema('<view>') }}"`.

You can also use `--inline` SQL that calls `{{ info_schema() }}` directly:

```shell
dbt show --inline "select name from {{ info_schema('models') }} order by name"
```

### Querying with external tools

Point any Parquet-compatible tool at the files in `target/info_schema/v1/`. For example, with pandas:

```python
import pandas as pd
models = pd.read_parquet("target/info_schema/v1/dbt.models.parquet")
```

## Using the Information Schema in checks

[Checks](/docs/build/checks) are SQL queries that run against the dbt Information Schema to check your project quality. Use the [`{{ info_schema() }}`](/reference/dbt-jinja-functions/info-schema-macro) macro in your check to reference a view in the dbt Information Schema. You must set the version of the `info_schema` you want to use in `dbt_project.yml`. Currently, `1` is the only available version.

```yaml
info_schema:
  version: 1
```

You can find the schema version in the versioned subdirectory name (for example, `target/info_schema/v1/`).

## Related docs
- [Information Schema tables](/reference/info-schema)
- [Commands for generating metadata](/reference/commands/cmd-docs#commands-for-generating-metadata)
- [`dbt build`](/reference/commands/build)
- [`dbt run`](/reference/commands/run)
- [`dbt compile`](/reference/commands/compile)
- [`dbt parse`](/reference/commands/parse)
