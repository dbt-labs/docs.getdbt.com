---
title: "DuckDB configurations"
id: "duckdb-configs"
description: "Reference the profile settings, external file options, incremental strategies, and other configs available in dbt-duckdb."
---

Use these settings to configure `dbt-duckdb` for DuckDB, MotherDuck, DuckLake, external files, and more.

## Set up your profile

Use the following `profiles.yml` settings with `dbt-duckdb`:

```yml
your_profile_name:
  target: dev
  outputs:
    dev:
      type: duckdb
      path: 'file_path/database_name.duckdb'
      extensions:
        - httpfs
        - parquet
      settings:
        s3_region: my-aws-region
        s3_access_key_id: "{{ env_var('S3_ACCESS_KEY_ID') }}"
        s3_secret_access_key: "{{ env_var('S3_SECRET_ACCESS_KEY') }}"
```

This profile runs `dbt-duckdb` against the [DuckDB](https://www.duckdb.org) file specified in `path` and persists relations across runs.

Omitting the `path` field sets it to `:memory:`, which means the database runs in-memory and all data is lost after your run completes.

`dbt-duckdb` automatically sets the `database` property to the basename of the file in the `path` argument with the suffix removed. For example, if the path is `/tmp/a/dbfile.duckdb`, the `database` field will be set to `dbfile`. If you are running in `:memory:` mode, then `database` is set to `memory`.

## Use MotherDuck

In `dbt-duckdb 1.5.2` and later, you can connect to a DuckDB instance running on [MotherDuck](https://motherduck.com) by setting `path` to an `md:` connection string, just as you would with the DuckDB CLI or Python API.

MotherDuck databases generally work the same way as local DuckDB databases, with a few differences:

- MotherDuck is compatible with specific client DuckDB versions as described in [MotherDuck's documentation](https://motherduck.com/docs/architecture-and-capabilities#considerations-and-limitations).
- MotherDuck preloads a set of common DuckDB extensions, but it does not support loading custom extensions or user-defined functions.

### DuckLake on MotherDuck

In `dbt-duckdb 1.9.6` and later, you can connect to [hosted DuckLake on MotherDuck](https://motherduck.com/blog/ducklake-motherduck/) by creating a DuckLake on MotherDuck and then setting `is_ducklake: true` in `profiles.yml`.

First, create your DuckLake database in MotherDuck:

```sql
CREATE DATABASE my_ducklake
  (TYPE ducklake, DATA_PATH 's3://...')
```

Then configure your profile with the DuckLake database attached:

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

DuckLake must be identified with `is_ducklake: true` so that safe DDL operations are applied by dbt.

## Configure extensions, settings, and filesystems

You can install and load any core [DuckDB extensions](https://duckdb.org/docs/extensions/overview) by listing them in the `extensions` field in your profile. You can also set any additional [DuckDB configuration options](https://duckdb.org/docs/sql/configuration) via the `settings` field, including options that are supported in loaded extensions.

You can also configure extensions from outside the core extension repository (such as a community extension) by configuring the extension as a `name`/`repo` pair:

```yml
default:
  outputs:
    dev:
      type: duckdb
      path: /tmp/dbt.duckdb
      extensions:
        - httpfs
        - parquet
        - name: h3
          repo: community
        - name: uc_catalog
          repo: core_nightly
  target: dev
```

In `dbt-duckdb 1.4.1` and later, you can experimentally use DuckDB filesystems implemented via [fsspec](https://duckdb.org/docs/guides/python/filesystems.html). The `fsspec` library supports a [variety of cloud data storage systems](https://filesystem-spec.readthedocs.io/en/latest/api.html#other-known-implementations), including S3, GCS, and Azure Blob Storage. To use an `fsspec` implementation with `dbt-duckdb`, install the relevant Python modules and configure your profile like this:

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

The `filesystems` property takes a list of configurations. Each entry must include an `fs` property that identifies the `fsspec` protocol to load, such as `s3`, `gcs`, or `abfs`. Each entry can also include additional key-value pairs to configure that `fsspec` implementation.

## Use the Secrets Manager

To use the [DuckDB Secrets Manager](https://duckdb.org/docs/configuration/secrets_manager.html), configure the `secrets` field. For example, to connect to S3 and read and write Parquet files with an AWS access key and secret, use a profile like this:

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

Instead of specifying the credentials through the settings block, you can also use the `credential_chain` secret provider. This means that you can use any supported mechanism from AWS to obtain credentials (for example, web identity tokens). You can read more about [secret providers in the DuckDB documentation](https://duckdb.org/docs/configuration/secrets_manager.html#secret-providers). To use the `credential_chain` provider and automatically fetch credentials from AWS, specify the `provider` in the `secrets` key:

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
          provider: credential_chain
  target: dev
```

### Scoped credentials by storage prefix

Secrets can be scoped so that different storage paths use different credentials:

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
          provider: credential_chain
          scope: [ "s3://bucket-in-eu-region", "s3://bucket-2-in-eu-region" ]
          region: "eu-central-1"
        - type: s3
          region: us-west-2
          scope: "s3://bucket-in-us-region"
```

When fetching a secret for a path, the secret scopes are compared to the path, returning the matching secret for the path. In the case of multiple matching secrets, the longest prefix is chosen.

## Attach additional databases

DuckDB supports [attaching additional databases](https://duckdb.org/docs/sql/statements/attach.html) to your `dbt-duckdb` run so that you can read and write from multiple databases. Additional databases may be configured via the `attach` argument in your profile:

```yml
default:
  outputs:
    dev:
      type: duckdb
      path: /tmp/dbt.duckdb
      attach:
        - path: /tmp/other.duckdb
        - path: ./yet/another.duckdb
          alias: yet_another
        - path: s3://yep/even/this/works.duckdb
          read_only: true
        - path: sqlite.db
          type: sqlite
        - path: postgresql://username@hostname/dbname
          type: postgres
  target: dev
```

The attached databases may be referred to in your dbt sources and models by either:

- The basename of the database file, minus its suffix (for example `/tmp/other.duckdb` is the `other` database and `s3://yep/even/this/works.duckdb` is the `works` database).
- By an alias you specify (the `./yet/another.duckdb` database in the above configuration is referred to as `yet_another` instead of `another`).

These additional databases do not necessarily have to be DuckDB files. DuckDB's storage and catalog engines are pluggable. You can indicate the type of the database you are connecting to via the `type` argument, which currently supports `duckdb`, `sqlite`, and `postgres`.

For DuckLake, use `ducklake:` for local databases; for MotherDuck-managed DuckLake, use `md:` with `is_ducklake: true`:

```yml
attach:
  - path: "ducklake:my_ducklake.ddb"
  - path: "md:my_other_ducklake"
    is_ducklake: true
```

### Arbitrary ATTACH options

You can use the `options` dictionary to pass any additional key-value pairs to DuckDB's `ATTACH` statement. This allows you to take advantage of new DuckDB features without waiting for explicit support in `dbt-duckdb`:

```yml
attach:
  - path: /tmp/db1.db
    type: sqlite
    read_only: true
  - path: /tmp/special.duckdb
    options:
      cache_size: 1GB
      threads: 4
      enable_fsst: true
```

If you specify the same option in both a direct field (`type`, `secret`, `read_only`) and in the `options` dict, `dbt-duckdb` will raise an error to prevent conflicts.

## Use plugins

`dbt-duckdb` has its own [plugin](https://github.com/duckdb/dbt-duckdb/blob/master/dbt/adapters/duckdb/plugins/__init__.py) system to enable advanced users to extend dbt-duckdb with additional functionality, including:
- Defining custom Python UDFs on the DuckDB database connection so that they can be used in your SQL models.
- Loading source data from Excel, Google Sheets, or SQLAlchemy tables.

To configure a plugin for use in your dbt project, use the `plugins` property on the profile:

```yml
default:
  outputs:
    dev:
      type: duckdb
      path: /tmp/dbt.duckdb
      plugins:
        - module: gsheet
          config:
            method: oauth
        - module: sqlalchemy
          alias: sql
          config:
            connection_url: "{{ env_var('DBT_ENV_SECRET_SQLALCHEMY_URI') }}"
        - module: path.to.custom_udf_module
```

Every plugin must have a `module` property that indicates where the plugin class to load is defined. There are a [set of built-in plugins](https://github.com/duckdb/dbt-duckdb/blob/master/dbt/adapters/duckdb/plugins) you can define, that may be referenced by their base filename (`excel` or `gsheet`), while user-defined plugins should be referred to by their full module path name (such as a `lib.my.custom` module that defines a class named `Plugin`).

Each plugin instance has a name for logging and reference purposes that defaults to the name of the module but that may be overridden by the user by setting the `alias` property in the configuration. Modules may be initialized using an arbitrary set of key-value pairs that are defined in the `config` dictionary.

Using plugins may require you to add additional dependencies to the Python environment that your dbt-duckdb pipeline runs in:

- `excel` depends on `pandas`, and `openpyxl` or `xlsxwriter` to perform writes
- `gsheet` depends on `gspread` and `pandas`
- `iceberg` depends on `pyiceberg` and Python >= 3.10
- `sqlalchemy` depends on `pandas`, `sqlalchemy`, and the driver(s) you need
- `delta` depends on `deltalake` (experimental)

### Write your own plugins

Defining your own `dbt-duckdb` plugin requires creating a Python module that defines a class named `Plugin` that inherits from `dbt.adapters.duckdb.plugins.BasePlugin`. There are four methods that may be implemented:

1. `initialize` &mdash; Takes in the `config` dictionary for the plugin defined in the profile. Called once when the `Plugin` class is created.
2. `configure_connection` &mdash; Takes a `DuckDBPyConnection` object and can perform additional configuration, like defining custom user-defined functions.
3. `load` &mdash; Takes a `SourceConfig` instance and can optionally return a DataFrame-like object that DuckDB knows how to turn into a table.
4. `store` &mdash; Takes a `TargetConfig` instance for an `external` materialization and can perform additional operations once the file is written (for example, registering with AWS Glue or uploading to an external database).

Refer to the [built-in plugins](https://github.com/duckdb/dbt-duckdb/tree/master/dbt/adapters/duckdb/plugins) for examples.

## Use Python models

dbt supports [Python models](/docs/build/python-models) in `dbt Core` 1.3 and later. In `dbt-duckdb`, Python models run in the same process that owns the DuckDB connection. The `.py` file is loaded as a Python module using [`importlib`](https://docs.python.org/3/library/importlib.html), the `model` function is called with a `dbt` object (containing `ref` and `source` information) and a `DuckDBPyConnection` object, and the returned object is materialized as a table.

The value of `dbt.ref` and `dbt.source` inside a Python model will be a [DuckDB Relation](https://duckdb.org/docs/api/python/reference/) object that can be converted into a Pandas/Polars DataFrame or an Arrow table. The return value can be any object DuckDB knows how to turn into a table, including a Pandas/Polars DataFrame, a DuckDB Relation, or an Arrow Table, Dataset, RecordBatchReader, or Scanner.

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

The profile setting `module_paths` allows you to specify a list of paths on the filesystem that contain additional Python modules that should be added to the Python process's `sys.path`. This allows you to include additional helper Python modules in your dbt projects that can be accessed by the running dbt process and used to define custom dbt-duckdb plugins or library code for Python models.

## Work with external files

One of DuckDB's most powerful features is its ability to read and write CSV, JSON, and Parquet files directly, without needing to import/export them from the database first.

### Read from external files

You may reference external files in your dbt models either directly or as dbt sources by configuring the `external_location` in either the `meta` or the `config` option on the source definition. Settings under `meta` will be propagated to the documentation generated via `dbt docs generate`, but settings under `config` will not be.

```yml
sources:
  - name: external_source
    meta:
      external_location: "s3://my-bucket/my-sources/{name}.parquet"
    tables:
      - name: source1
      - name: source2
```

Here, the `meta` setting on `external_source` defines `external_location` as an f-string that lets you express a pattern for the location of any table defined for that source. For example, a dbt model like:

```sql
SELECT *
FROM {{ source('external_source', 'source1') }}
```

will be compiled as:

```sql
SELECT *
FROM 's3://my-bucket/my-sources/source1.parquet'
```

If one of the source tables deviates from the pattern, the `external_location` can also be set on the table itself:

```yml
sources:
  - name: external_source
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

You can create dbt models backed by external files via the `external` materialization strategy:

```sql
{{ config(materialized='external', location='local/directory/file.parquet') }}

SELECT m.*, s.id IS NOT NULL as has_source_id
FROM {{ ref('upstream_model') }} m
LEFT JOIN {{ source('upstream', 'source') }} s USING (id)
```

| Option | Default | Description |
| --- | --- | --- |
| `location` | `external_location` macro | The path to write the external materialization to. |
| `format` | `parquet` | The format of the external file (parquet, csv, or json). |
| `delimiter` | `,` | For CSV files, the delimiter to use for fields. |
| `options` | None | Any other options to pass to DuckDB's `COPY` operation (for example `partition_by`, `codec`, etc). |
| `glue_register` | `false` | If true, try to register the file created by this model with the AWS Glue Catalog. |
| `glue_database` | `default` | The name of the AWS Glue database to register the model with. |

If the `location` argument is specified, it must be a filename (or S3 bucket/path), and `dbt-duckdb` will attempt to infer the `format` argument from the file extension of the `location` if the `format` argument is unspecified.

If the `location` argument is not specified, the external file will be named after the `model.sql` (or `model.py`) file that defined it with an extension that matches the `format` argument. By default, external files are created relative to the current working directory. You can change the default directory (or S3 bucket/prefix) by specifying the `external_root` setting in your DuckDB profile.

Incremental materialization strategies are not supported for `external` models.

### Registering external models

When using `:memory:` as the DuckDB database, subsequent dbt runs can fail when selecting a subset of models that depend on external tables. This is because external files are only registered as DuckDB views when they are created, not when they are referenced. To overcome this issue, use the `register_upstream_external_models` macro at the beginning of a run:

```yml
on-run-start:
  - "{{ register_upstream_external_models() }}"
```

## Use the `table_function` materialization

`dbt-duckdb` provides a custom `table_function` materialization to use DuckDB's [Table Function / Table Macro](https://duckdb.org/docs/sql/statements/create_macro.html) feature to provide parameterized views.

Benefits of using `table_function`:
- Late binding means the underlying table can change (have new columns added) and the function does not need to be recreated, unlike views.
- Parameters can force filter pushdown.
- Functions can provide advanced features like dynamic SQL.

Example `table_function` creation with 0 parameters:

```sql
{{
    config(
        materialized='table_function'
    )
}}
select * from {{ ref("example_table") }}
```

Example invocation (parentheses are required even with 0 parameters):

```sql
select * from {{ ref("my_table_function") }}()
```

Example `table_function` with 2 parameters:

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

## Use incremental strategies

`dbt-duckdb` supports the `delete+insert`, `append`, `merge`, and `microbatch` strategies for incremental table models.

### Append strategy

| Configuration | Type | Default | Description |
| --- | --- | --- | --- |
| `incremental_predicates` | list | null | SQL conditions to filter which records get appended. |

### Delete+insert strategy

| Configuration | Type | Default | Description |
| --- | --- | --- | --- |
| `unique_key` | string/list | required | Column(s) used to identify records for deletion. |
| `incremental_predicates` | list | null | SQL conditions to filter the delete and insert operations. |

### Merge strategy

The `merge` strategy requires DuckDB >= 1.4.0 and provides access to DuckDB's native `MERGE` statement.

**Basic configuration** &mdash; When you specify only `unique_key`, `dbt-duckdb` uses DuckDB's `UPDATE BY NAME` and `INSERT BY NAME` operations, which automatically match columns by name:

```yml
models:
  - name: my_incremental_model
    config:
      materialized: incremental
      incremental_strategy: merge
      unique_key: id
```

**Enhanced configuration** &mdash; Additional options for finer control:

| Configuration | Type | Default | Description |
| --- | --- | --- | --- |
| `unique_key` | string/list | required | Column(s) used for the MERGE join condition. |
| `incremental_predicates` | list | null | Additional SQL conditions to filter the MERGE operation. |
| `merge_update_condition` | string | null | SQL condition to control when matched records are updated. |
| `merge_insert_condition` | string | null | SQL condition to control when unmatched records are inserted. |
| `merge_update_columns` | list | null | Specific columns to update. |
| `merge_exclude_columns` | list | null | Columns to exclude from updates. |
| `merge_update_set_expressions` | dict | null | Custom expressions for column updates. |

For maximum flexibility, use `merge_clauses` to define custom `when_matched` and `when_not_matched` behaviors. When using DuckLake, MERGE statements are limited to a single UPDATE or DELETE action in `when_matched` clauses due to DuckLake's current MERGE implementation constraints.

In conditions and expressions, use `DBT_INTERNAL_SOURCE` to reference the incoming data and `DBT_INTERNAL_DEST` to reference the existing target table.

### Microbatch strategy

The `microbatch` strategy requires `dbt Core` 1.9 or later and runs incremental builds in time-based batches using a configured `event_time` column.

| Configuration | Type | Default | Description |
| --- | --- | --- | --- |
| `event_time` | string | required | Name of the timestamp column used for microbatch windowing. |
| `begin` | string | required | Start time for batching (for example `2025-01-01`). |
| `batch_size` | string | required | Batch grain (for example `day`, `hour`). |
| `incremental_predicates` | list | null | Optional additional predicates applied within each batch. |

:::tip
Microbatching might not always be the best option from a performance perspective. DuckDB operates on row groups, not physical partitions (unless you have explicitly partitioned data in a DuckLake). Be sure to test different amounts of threads to match your use case.
:::

## Configure DuckLake table partitioning

For DuckLake-backed tables (including MotherDuck-managed DuckLake), you can configure physical partitioning for `table` or `incremental` models using `partitioned_by`:

```sql
{{ config(materialized='table', partitioned_by=['year', 'month']) }}

select
  *,
  year(event_time) as year,
  month(event_time) as month
from {{ ref('upstream_model') }}
```

`partition_by` is accepted as an alias for `partitioned_by`. This setting is only applied for DuckLake relations; on non-DuckLake targets it is ignored with a warning.

DuckLake applies partitioning via `ALTER TABLE ... SET PARTITIONED BY (...)`, and partitioning only affects new data. For first builds or full refreshes, `dbt-duckdb` creates an empty table, sets partitioning, then inserts data so the initial load is partitioned. Refer to the [DuckLake partitioning documentation](https://ducklake.select/docs/stable/duckdb/advanced_features/partitioning) for more details.

## Use the interactive shell

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
