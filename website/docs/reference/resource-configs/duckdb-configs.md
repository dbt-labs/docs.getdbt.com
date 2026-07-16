---
title: "DuckDB configurations"
id: "duckdb-configs"
description: "Reference for DuckDB-specific configurations in dbt-duckdb, including secrets, DuckLake, external files, incremental strategies, and more."
tags: ['DuckDB', 'dbt Core']
---

These configurations are specific to `dbt-duckdb`. For profile setup and connection options, refer to [Connect DuckDB](/docs/local/connect-data-platform/duckdb-setup). For general dbt concepts, refer to [Materializations](/docs/build/materializations) and [Incremental models](/docs/build/incremental-models).

Some features require a minimum version of `dbt-duckdb`. Version requirements are noted inline throughout this page.

## Secrets manager

Use the [DuckDB Secrets Manager](https://duckdb.org/docs/configuration/secrets_manager.html) to manage credentials for cloud storage. Configure the `secrets` field in your profile:

```yml
default:
  outputs:
    dev:
      type: duckdb
      path: /tmp/dbt.duckdb
      extensions:
        - httpfs
        - parquet
      secrets:
        - type: s3
          region: my-aws-region
          key_id: "{{ env_var('S3_ACCESS_KEY_ID') }}"
          secret: "{{ env_var('S3_SECRET_ACCESS_KEY') }}"
  target: dev
```

### Fetch credentials from context

Instead of specifying credentials directly, you can use the `credential_chain` secret provider to use any supported AWS mechanism (for example, web identity tokens). Refer to the [DuckDB secret providers documentation](https://duckdb.org/docs/configuration/secrets_manager.html#secret-providers) for details.

```yml
secrets:
  - type: s3
    provider: credential_chain
```

### Scoped credentials by storage prefix

Secrets can be scoped so that different storage paths use different credentials:

```yml
secrets:
  - type: s3
    provider: credential_chain
    scope: [ "s3://bucket-in-eu-region", "s3://bucket-2-in-eu-region" ]
    region: "eu-central-1"
  - type: s3
    region: us-west-2
    scope: "s3://bucket-in-us-region"
```

When fetching a secret for a path, the secret scopes are compared to the path. In the case of multiple matching secrets, the longest prefix is chosen.

## Cloud storage with fsspec

In `dbt-duckdb 1.4.1` and later, you can experimentally use DuckDB filesystems implemented via [fsspec](https://duckdb.org/docs/guides/python/filesystems.html). The `fsspec` library supports [a variety of cloud data storage systems](https://filesystem-spec.readthedocs.io/en/latest/api.html#other-known-implementations), including S3, GCS, and Azure Blob Storage.

To use an `fsspec` implementation, install the relevant Python modules and configure `filesystems` in your profile:

```yml
default:
  outputs:
    dev:
      type: duckdb
      path: /tmp/dbt.duckdb
      filesystems:
        - fs: s3
          anon: false
          key: "{{ env_var('S3_ACCESS_KEY_ID') }}"
          secret: "{{ env_var('S3_SECRET_ACCESS_KEY') }}"
          client_kwargs:
            endpoint_url: "http://localhost:4566"
  target: dev
```

Each entry must include an `fs` property that identifies the `fsspec` protocol to load (`s3`, `gcs`, `abfs`, etc.) and can include additional key-value pairs to configure that implementation.

## Arbitrary ATTACH options

For the basic `attach` profile syntax, refer to [Connecting to DuckDB](/docs/local/connect-data-platform/duckdb-setup#attaching-additional-databases). Use the `options` dictionary when you need to pass additional key-value pairs to DuckDB's `ATTACH` statement:

```yml
attach:
  - path: /tmp/db1.sqlite
    type: sqlite
    read_only: true
  - path: /tmp/special.duckdb
    options:
      cache_size: 1GB
      threads: 4
      enable_fsst: true
```

If you specify the same option in both a direct field (`type`, `secret`, `read_only`) and in the `options` dict, `dbt-duckdb` raises an error to prevent conflicts.

## DuckLake

[DuckLake](https://ducklake.select) is a table format that provides <Term id="acid" /> transactions and time travel for DuckDB. You can use DuckLake with both local databases and MotherDuck.

### DuckLake on MotherDuck

In `dbt-duckdb 1.9.6` and later, you can connect to [hosted DuckLake on MotherDuck](https://motherduck.com/blog/ducklake-motherduck/) by creating a DuckLake database and setting `is_ducklake: true`.

To set up DuckLake on MotherDuck:

1. Create your DuckLake database in MotherDuck:

  ```sql
  CREATE DATABASE my_ducklake
    (TYPE ducklake, DATA_PATH 's3://...')
  ```

2. Configure your profile:

  ```yml
  default:
    outputs:
      dev:
        type: duckdb
        path: "md:my_db?motherduck_token={{ env_var('MOTHERDUCK_TOKEN') }}"
        attach:
          - path: "md:my_ducklake"
            is_ducklake: true
    target: dev
  ```

  You must identify DuckLake must with `is_ducklake: true` so that dbt applies safe DDL operations.

  For local DuckLake, use `ducklake:` in the path:

  ```yml
  attach:
    - path: "ducklake:my_ducklake.ddb"
  ```

### DuckLake table partitioning

For DuckLake-backed tables (including MotherDuck-managed DuckLake), you can configure physical partitioning for `table` or `incremental` models using `partitioned_by`:

```sql
{{ config(materialized='table', partitioned_by=['year', 'month']) }}

select
  *,
  year(event_time) as year,
  month(event_time) as month
from {{ ref('upstream_model') }}
```

`partition_by` is accepted as an alias for `partitioned_by`. This setting is only applied for DuckLake relations; on non-DuckLake targets, it is ignored with a warning.

DuckLake applies partitioning using `ALTER TABLE ... SET PARTITIONED BY (...)`, and partitioning only affects new data. For first builds or full refreshes, `dbt-duckdb` creates an empty table, sets partitioning, then inserts data so the initial load is partitioned. Refer to the [DuckLake partitioning documentation](https://ducklake.select/docs/stable/duckdb/advanced_features/partitioning) for more details.

<VersionBlock lastVersion="1.99">

## Plugins

`dbt-duckdb` has a [plugin system](https://github.com/duckdb/dbt-duckdb#configuring-dbt-duckdb-plugins) for extending the adapter with custom Python UDFs, loading source data from Excel/Google Sheets/SQLAlchemy, and more. For details on configuring and writing plugins, refer to the [dbt-duckdb documentation on plugins](https://github.com/duckdb/dbt-duckdb#configuring-dbt-duckdb-plugins).

:::info dbt Core only
Plugins are a `dbt-duckdb` feature and are not supported in <Constant name="fusion_engine" /> or <Constant name="dbt_platform" />.
:::

## Python models

dbt supports [Python models](/docs/build/python-models) in <Constant name="core" /> 1.3 and later. In `dbt-duckdb`, Python models run in the same process that owns the DuckDB connection. The `.py` file is loaded as a Python module using [`importlib`](https://docs.python.org/3/library/importlib.html), the `model` function is called with a `dbt` object (containing `ref` and `source` information) and a `DuckDBPyConnection` object, and the returned object is materialized as a table.

The value of `dbt.ref` and `dbt.source` inside a Python model will be a [DuckDB Relation](https://duckdb.org/docs/api/python/reference/) object that you can convert into a Pandas/Polars DataFrame or an Arrow table. The return value can be any object DuckDB knows how to turn into a table, including a Pandas/Polars DataFrame, a DuckDB Relation, or an Arrow Table, Dataset, RecordBatchReader, or Scanner.

### Process data in batches

In `dbt-duckdb` 1.6.1 and later, you can read and write data in chunks so you can work with larger-than-memory datasets in Python models:

```py
import pyarrow as pa

def batcher(batch_reader: pa.RecordBatchReader):
    for batch in batch_reader:
        df = batch.to_pandas()
        # Do some operations on the DF...
        # ...then yield back a new batch
        yield pa.RecordBatch.from_pandas(df)

def model(dbt, session):
    big_model = dbt.ref("big_model")
    batch_reader = big_model.record_batch(100_000)
    batch_iter = batcher(batch_reader)
    return pa.RecordBatchReader.from_batches(batch_reader.schema, batch_iter)
```

### Use local Python modules

The `module_paths` profile setting lets you specify a list of filesystem paths containing additional Python modules. These paths are added to the dbt process's `sys.path`, which makes the modules importable within dbt. You can use this to include helper code in your project, such as custom `dbt-duckdb` plugins or shared libraries for Python models.

## External files

One of DuckDB's most powerful features is its ability to read and write CSV, JSON, and Parquet files directly, without needing to import or export them from the database first.

### Read from external files

You may reference external files in your dbt models either directly or as dbt sources by configuring `external_location` either under `config.meta` or as a direct `config.external_location` on the source definition. Settings under `config.meta` are propagated to the documentation generated by `dbt docs generate`, but direct `config.external_location` settings are not.

```yml
sources:
  - name: external_source
    config:
      meta:
        external_location: "s3://my-bucket/my-sources/{name}.parquet"
    tables:
      - name: source1
      - name: source2
```

Here, `config.meta.external_location` on `external_source` defines an f-string pattern for the location of any table defined for that source. For example, a dbt model like:

```sql
SELECT *
FROM {{ source('external_source', 'source1') }}
```

Will be compiled as:

```sql
SELECT *
FROM 's3://my-bucket/my-sources/source1.parquet'
```

If one of the source tables deviates from the pattern, you can also set the `external_location` on the table itself:

```yml
sources:
  - name: external_source
    config:
      meta:
        external_location: "s3://my-bucket/my-sources/{name}.parquet"
    tables:
      - name: source1
      - name: source2
        config:
          external_location: "read_parquet(['s3://my-bucket/my-sources/source2a.parquet', 's3://my-bucket/my-sources/source2b.parquet'])"
```

The `external_location` property does not need to be a path-like string; it can also be a function call, which is helpful for CSV files that require special handling:

```yml
sources:
  - name: flights_source
    tables:
      - name: flights
        config:
          external_location: "read_csv('flights.csv', types={'FlightDate': 'DATE'}, names=['FlightDate', 'UniqueCarrier'])"
          formatter: oldstyle
```

The `formatter` configuration option indicates whether to use `newstyle` string formatting (the default), `oldstyle` string formatting, or `template` string formatting. The `oldstyle` formatter is needed here because `str.format` would interpret the `types={'FlightDate': 'DATE'}` argument as a template variable.

### Write to external files

You can create dbt models backed by external files through the `external` materialization strategy:

```sql
{{ config(materialized='external', location='local/directory/file.parquet') }}

SELECT m.*, s.id IS NOT NULL as has_source_id
FROM {{ ref('upstream_model') }} m
LEFT JOIN {{ source('upstream', 'source') }} s USING (id)
```

| Option | Default | Description |
| --- | --- | --- |
| `location` | `external_location` macro | The path to write the external materialization to. |
| `format` | `parquet` | The format of the external file (`parquet`, `csv`, or `json`). |
| `delimiter` | `,` | For CSV files, the delimiter to use for fields. |
| `options` | None | Any other options to pass to DuckDB's `COPY` operation (for example, `partition_by`, `codec`). |
| `glue_register` | `false` | If `true`, try to register the file created by this model with the AWS Glue Catalog. |
| `glue_database` | `default` | The name of the AWS Glue database to register the model with. |

- If the `location` argument is specified, it must be a filename (or S3 bucket/path), and `dbt-duckdb` will attempt to infer the `format` argument from the file extension of the `location` if the `format` argument is unspecified.

- If the `location` argument is not specified, the external file will be named after the `model.sql` (or `model.py`) file that defined it with an extension that matches the `format` argument. By default, external files are created relative to the current working directory. You can change the default directory (or S3 bucket/prefix) by specifying the `external_root` setting in your DuckDB profile.

Incremental materialization strategies are not supported for `external` models.

### Register external models

When using `:memory:` as the DuckDB database, subsequent dbt runs can fail when selecting a subset of models that depend on external tables. This is because external files are only registered as DuckDB views when they are created, not when they are referenced. To overcome this issue, use the `register_upstream_external_models` macro at the beginning of a run:

```yml
on-run-start:
  - "{{ register_upstream_external_models() }}"
```

## `table_function` materialization

`dbt-duckdb` provides a custom `table_function` materialization to use DuckDB's [Table Function / Table Macro](https://duckdb.org/docs/sql/statements/create_macro.html) feature to provide parameterized views.

Benefits of using `table_function`:
- Late binding means the underlying table can change (have new columns added) and the function does not need to be recreated, unlike views.
- Parameters can force filter pushdown.
- Functions can provide advanced features like dynamic SQL.

Example `table_function` creation with zero parameters:

```sql
{{
    config(
        materialized='table_function'
    )
}}
select * from {{ ref("example_table") }}
```

Example invocation (parentheses are required even with zero parameters):

```sql
select * from {{ ref("my_table_function") }}()
```

Example `table_function` with two parameters:

```sql
{{
    config(
        materialized='table_function',
        parameters=['where_a', 'where_b']
    )
}}
select *
from {{ ref("example_table") }}
where 1=1
    and a = where_a
    and b = where_b
```

Example invocation with parameters:

```sql
select * from {{ ref("my_table_function_with_parameters") }}(1, 2)
```

</VersionBlock>

## Incremental strategies

`dbt-duckdb` supports the following strategies for incremental table models:

- [`append`](#append-strategy)
- [`delete+insert`](#deleteinsert-strategy)
- [`merge`](#merge-strategy)
- [`microbatch`](#microbatch-strategy)

### Append strategy

| Configuration | Type | Default | Description |
| --- | --- | --- | --- |
| `incremental_predicates` | `<list>` | null | SQL conditions to filter which records get appended. |

### Delete+insert strategy

| Configuration | Type | Default | Description |
| --- | --- | --- | --- |
| `unique_key` | `<string>`/`<list>` | — | Required. Columns used to identify records for deletion. |
| `incremental_predicates` | `<list>` | null | SQL conditions to filter the delete and insert operations. |

### Merge strategy

The `merge` strategy requires DuckDB 1.4.0 or later and provides access to DuckDB's native `MERGE` statement.

**Basic configuration**

When you specify only `unique_key`, `dbt-duckdb` uses DuckDB's `UPDATE BY NAME` and `INSERT BY NAME` operations, which automatically match columns by name:

```yml
models:
  - name: my_incremental_model
    config:
      materialized: incremental
      incremental_strategy: merge
      unique_key: id
```

**Enhanced configuration**

Additional options for finer control:

| Configuration | Type | Default | Description |
| --- | --- | --- | --- |
| `unique_key` | `<string/list>` | — | Required. Columns used for the MERGE join condition. |
| `incremental_predicates` | `<list>` | null | Additional SQL conditions to filter the MERGE operation. |
| `merge_update_condition` | `<string>` | null | SQL condition to control when matched records are updated. |
| `merge_insert_condition` | `<string>` | null | SQL condition to control when unmatched records are inserted. |
| `merge_update_columns` | `<list>` | null | Specific columns to update. |
| `merge_exclude_columns` | `<list>` | null | Columns to exclude from updates. |
| `merge_update_set_expressions` | `<dict>` | null | Custom expressions for column updates. |

For maximum flexibility, use `merge_clauses` to define custom `when_matched` and `when_not_matched` behaviors. When using DuckLake, MERGE statements are limited to a single UPDATE or DELETE action in `when_matched` clauses due to DuckLake's current MERGE implementation constraints.

In conditions and expressions, use `DBT_INTERNAL_SOURCE` to reference the incoming data and `DBT_INTERNAL_DEST` to reference the existing target table.

### Microbatch strategy

The `microbatch` strategy requires <Constant name="core" /> 1.9 or later and runs incremental builds in time-based batches using a configured `event_time` column.

| Configuration | Type | Default | Description |
| --- | --- | --- | --- |
| `event_time` | `<string>` | — | Required. Name of the timestamp column used for microbatch windowing. |
| `begin` | `<string>` | — | Required. Start time for batching (for example, `2025-01-01`). |
| `batch_size` | `<string>` | — | Required. Batch grain (for example, `day`, `hour`). |
| `incremental_predicates` | `<list>` | null | Optional additional predicates applied within each batch. |

:::tip
Microbatching might not always be the best option from a performance perspective. DuckDB operates on row groups, not physical partitions (unless you have explicitly partitioned data in a DuckLake). Be sure to test different amounts of threads to match your use case.
:::

<VersionBlock firstVersion="1.9" lastVersion="1.99">

## Interactive shell

In `dbt-duckdb` 1.9.3 and later, the interactive shell lets you run dbt commands and query the DuckDB database in an integrated CLI environment. The shell automatically launches the [DuckDB UI](https://duckdb.org/2025/03/12/duckdb-ui.html), which gives you a visual interface to explore your data while you work with your dbt models.

To start the interactive shell:

```bash
python -m dbt.adapters.duckdb.cli
```

You can specify a profile with the `--profile` flag:

```bash
python -m dbt.adapters.duckdb.cli --profile my_profile
```

The shell provides access to all standard dbt commands (`run`, `test`, `build`, `seed`, `snapshot`, `compile`, `parse`, `debug`, `deps`, `list`) and supports model name autocompletion if you install the optional `iterfzf` package.

</VersionBlock>

## More information

- For connection modes and profile setup, refer to [Connect DuckDB](/docs/local/connect-data-platform/duckdb-setup).
- For adapter source code and plugins, refer to the [`dbt-duckdb` repository](https://github.com/duckdb/dbt-duckdb). For adapter release notes, refer to the [`dbt-duckdb` releases page](https://github.com/duckdb/dbt-duckdb/releases).
- For <Constant name="core" /> concepts used on this page, refer to [Materializations](/docs/build/materializations), [Incremental models](/docs/build/incremental-models), and [Python models](/docs/build/python-models).
